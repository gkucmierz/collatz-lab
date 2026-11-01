pub mod bigint_lab;

use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;
use std::time::Instant;

/// Precomputed powers of 3 up to 3^40 in u128
pub const fn build_pow3() -> [u128; 41] {
    let mut arr = [1u128; 41];
    let mut i = 1;
    while i <= 40 {
        arr[i] = arr[i - 1] * 3;
        i += 1;
    }
    arr
}

pub const POW3: [u128; 41] = build_pow3();

#[derive(Debug, Clone)]
pub struct PreCarryResult {
    pub n: u128,
    pub n_bits: String,
    pub shifted_bits: String,
    pub raw_pre_carry: String,
    pub out_bits: String,
    pub v2: u32,
    pub syracuse_next: u128,
    pub ones_fuse_count: usize,
    pub twos_collision_count: usize,
    pub zeros_barrier_count: usize,
    pub is_immediate_power_of_two: bool,
}

/// Decomposes 3n + 1 = (n << 1) + n + 1 into the Pre-Carry Ternary Vector d_i in {0, 1, 2}
pub fn analyze_pre_carry_u128(n: u128) -> PreCarryResult {
    let clean_n = if n == 0 { 1 } else { n };
    let shifted = clean_n << 1;
    let res_3n1 = 3 * clean_n + 1;
    let v2 = res_3n1.trailing_zeros();
    let syracuse_next = res_3n1 >> v2;

    let shift_str = format!("{:b}", shifted);
    let col_width = shift_str.len();
    let n_raw = format!("{:b}", clean_n);
    let n_aligned = format!("{:0>width$}", n_raw, width = col_width);

    let shift_bytes = shift_str.as_bytes();
    let n_bytes = n_aligned.as_bytes();

    let mut raw_pre_carry = String::with_capacity(col_width);
    let mut ones_fuse_count = 0usize;
    let mut twos_collision_count = 0usize;
    let mut zeros_barrier_count = 0usize;

    for i in 0..col_width {
        let b2 = if shift_bytes[i] == b'1' { 1u8 } else { 0u8 };
        let b1 = if n_bytes[i] == b'1' { 1u8 } else { 0u8 };
        let plus_one = if i == col_width - 1 { 1u8 } else { 0u8 };
        let d = b2 + b1 + plus_one;
        raw_pre_carry.push((b'0' + d) as char);
        match d {
            0 => zeros_barrier_count += 1,
            1 => ones_fuse_count += 1,
            _ => twos_collision_count += 1,
        }
    }

    PreCarryResult {
        n: clean_n,
        n_bits: n_raw,
        shifted_bits: shift_str,
        raw_pre_carry,
        out_bits: format!("{:b}", res_3n1),
        v2,
        syracuse_next,
        ones_fuse_count,
        twos_collision_count,
        zeros_barrier_count,
        is_immediate_power_of_two: syracuse_next == 1,
    }
}

/// Counts {0, 1, 2} column symbols and binary transitions in an odd integer n in O(1) bitwise ops
#[inline(always)]
pub fn bitwise_ternary_metrics(n: u128) -> (u32, u32, u32, u32) {
    let bit_len = 128 - n.leading_zeros();
    let trailing_ones = (!n).trailing_zeros();
    // Adjacent (1,1) pairs where both bit i and bit i-1 are 1:
    let collisions_11 = (n & (n >> 1)).count_ones();
    // Alternating (1,0) or (0,1) transitions inside the bit width:
    let mask = if bit_len >= 128 {
        u128::MAX
    } else {
        (1u128 << bit_len) - 1
    };
    let xor_adj = (n ^ (n >> 1)) & (mask >> 1);
    let alternating_fuses = xor_adj.count_ones();
    (bit_len, trailing_ones, collisions_11, alternating_fuses)
}

#[derive(Debug, Clone)]
pub struct LyapunovProfile {
    pub w_trail: f64,
    pub w_collision2: f64,
    pub w_fuse1: f64,
    pub single_step_decrease_pct: f64,
    pub two_step_decrease_pct: f64,
    pub three_step_decrease_pct: f64,
    pub mean_drift_per_odd_step: f64,
    pub mersenne_climb_strictly_decreasing: bool,
}

/// Evaluates the Composite 2-Adic Lyapunov Potential:
/// V(n) = log2(n) + w_trail * (T_1(n) - 1) + w_collision2 * (C_11(n) / bit_len) - w_fuse1 * (F_alt(n) / bit_len)
///
/// Notice why (T_1(n) - 1) is the exact stored Mersenne climb energy:
/// - For n ≡ 1 (mod 4), T_1(n) = 1 (binary ...01), so excess trailing ones = 0 and n contracts immediately!
/// - For n ≡ -1 (mod 2^L) with L >= 2 (binary ...01^L), each step of (3n+1)/2 increases log2(n) by log2(3/2) ≈ 0.58496
///   while strictly reducing (T_1(n) - 1) by 1. With w_trail = 0.62 > log2(3/2), every step of the Mersenne climb
///   strictly decreases V(n) by at least 0.62 - 0.58496 = 0.03504!
#[inline(always)]
pub fn compute_lyapunov_potential(n: u128, w_trail: f64, w_collision2: f64, w_fuse1: f64) -> f64 {
    let (bit_len, t1, c11, falt) = bitwise_ternary_metrics(n);
    let log2_n = (n as f64).log2();
    let excess_t1 = (t1.saturating_sub(1)) as f64;
    let inv_len = 1.0 / (bit_len.max(1) as f64);
    log2_n
        + w_trail * excess_t1
        + w_collision2 * (c11 as f64) * inv_len
        - w_fuse1 * (falt as f64) * inv_len
}

#[inline(always)]
pub fn syracuse_odd_step(n: u128) -> u128 {
    let m = 3 * n + 1;
    m >> m.trailing_zeros()
}

pub fn optimize_lyapunov_weights(sample_max_odd: u128) -> LyapunovProfile {
    let w_trail = 0.62;
    let w_collision2 = 0.35;
    let w_fuse1 = 0.25;

    let mut total = 0usize;
    let mut dec1 = 0usize;
    let mut dec2 = 0usize;
    let mut dec3 = 0usize;
    let mut sum_drift = 0.0f64;

    let mut n = 3u128;
    while n <= sample_max_odd {
        let v0 = compute_lyapunov_potential(n, w_trail, w_collision2, w_fuse1);
        let n1 = syracuse_odd_step(n);
        let v1 = compute_lyapunov_potential(n1, w_trail, w_collision2, w_fuse1);
        let n2 = if n1 > 1 { syracuse_odd_step(n1) } else { 1 };
        let v2 = compute_lyapunov_potential(n2, w_trail, w_collision2, w_fuse1);
        let n3 = if n2 > 1 { syracuse_odd_step(n2) } else { 1 };
        let v3 = compute_lyapunov_potential(n3, w_trail, w_collision2, w_fuse1);

        total += 1;
        if v1 < v0 || n1 == 1 {
            dec1 += 1;
        }
        if v1 < v0 || v2 < v0 || n2 == 1 {
            dec2 += 1;
        }
        if v1 < v0 || v2 < v0 || v3 < v0 || n3 == 1 {
            dec3 += 1;
        }
        sum_drift += v1 - v0;
        n += 2;
    }

    // Check Mersenne numbers 2^L - 1 for L = 3..16: does V(T(2^L - 1)) < V(2^L - 1)?
    let mut mersenne_ok = true;
    for l in 3..=16 {
        let m = (1u128 << l) - 1;
        let next_m = syracuse_odd_step(m);
        let vm0 = compute_lyapunov_potential(m, w_trail, w_collision2, w_fuse1);
        let vm1 = compute_lyapunov_potential(next_m, w_trail, w_collision2, w_fuse1);
        if vm1 >= vm0 {
            mersenne_ok = false;
        }
    }

    LyapunovProfile {
        w_trail,
        w_collision2,
        w_fuse1,
        single_step_decrease_pct: (dec1 as f64 / total as f64) * 100.0,
        two_step_decrease_pct: (dec2 as f64 / total as f64) * 100.0,
        three_step_decrease_pct: (dec3 as f64 / total as f64) * 100.0,
        mean_drift_per_odd_step: sum_drift / (total as f64),
        mersenne_climb_strictly_decreasing: mersenne_ok,
    }
}

#[derive(Debug, Clone)]
pub struct SurvivingSample {
    pub residue: u128,
    pub binary: String,
    pub odd_count: usize,
    pub coeff_ratio: f64,
    pub raw_pre_carry: String,
    pub twos_density: f64,
}

#[derive(Debug, Clone)]
pub struct ContractionCertificate {
    pub k: usize,
    pub total_odd_residues: u128,
    pub contracted_count: u128,
    pub surviving_count: u128,
    pub contracted_percent: f64,
    pub visited_nodes: u128,
    pub pruning_speedup: f64,
    pub elapsed_ms: f64,
    pub depth_histogram: Vec<(usize, u128)>,
    pub top_irreducible_suffixes: Vec<(String, u128, f64)>,
    pub surviving_samples: Vec<SurvivingSample>,
}

#[derive(Clone, Copy)]
struct FrontierTask {
    d: usize,
    r: u128,
    cur_val: u128,
    odd_count: usize,
}

struct WorkerStats {
    contracted_count: u128,
    visited_nodes: u128,
    depth_hist: [u128; 41],
    suffix8_counts: Vec<u64>,
    samples: Vec<SurvivingSample>,
}

impl Default for WorkerStats {
    fn default() -> Self {
        Self {
            contracted_count: 0,
            visited_nodes: 0,
            depth_hist: [0u128; 41],
            suffix8_counts: vec![0u64; 256],
            samples: Vec::new(),
        }
    }
}

fn explore_subtree_seq(
    d: usize,
    target_k: usize,
    r: u128,
    cur_val: u128,
    odd_count: usize,
    stats: &mut WorkerStats,
) {
    stats.visited_nodes += 1;
    let is_odd = (cur_val & 1) == 1;
    let next_val = if is_odd {
        (3 * cur_val + 1) >> 1
    } else {
        cur_val >> 1
    };
    let next_odd = odd_count + (is_odd as usize);

    // Contraction check: 3^next_odd < 2^d
    if POW3[next_odd] < (1u128 << d) {
        let leaves = 1u128 << (target_k - d);
        stats.contracted_count += leaves;
        stats.depth_hist[d] += leaves;
        return;
    }

    if d == target_k {
        // Uncontracted leaf at depth target_k
        let idx8 = ((r >> 1) & 0xFF) as usize;
        stats.suffix8_counts[idx8] += 1;
        if stats.samples.len() < 16 {
            let pre = analyze_pre_carry_u128(r);
            let width = pre.raw_pre_carry.len().max(1);
            let twos_density = pre.twos_collision_count as f64 / width as f64;
            let ratio = (POW3[next_odd] as f64) / ((1u128 << target_k) as f64);
            stats.samples.push(SurvivingSample {
                residue: r,
                binary: format!("{:0>width$b}", r, width = target_k),
                odd_count: next_odd,
                coeff_ratio: ratio,
                raw_pre_carry: pre.raw_pre_carry,
                twos_density,
            });
        }
        return;
    }

    let delta = POW3[next_odd];
    explore_subtree_seq(d + 1, target_k, r, next_val, next_odd, stats);
    explore_subtree_seq(
        d + 1,
        target_k,
        r + (1u128 << d),
        next_val + delta,
        next_odd,
        stats,
    );
}

/// Multi-threaded 128-bit 2-adic contraction tree verifier for mod 2^k (k up to 34)
pub fn verify_2adic_tree_parallel(k: usize, num_threads: usize) -> ContractionCertificate {
    let start = Instant::now();
    let safe_k = k.clamp(4, 34);
    let split_depth = safe_k.min(11);

    let mut root_stats = WorkerStats {
        suffix8_counts: vec![0u64; 256],
        ..Default::default()
    };
    let mut tasks = Vec::new();

    // Generate frontier tasks up to split_depth while pruning early contracted branches
    fn build_frontier(
        d: usize,
        split_d: usize,
        target_k: usize,
        r: u128,
        cur_val: u128,
        odd_count: usize,
        stats: &mut WorkerStats,
        tasks: &mut Vec<FrontierTask>,
    ) {
        stats.visited_nodes += 1;
        let is_odd = (cur_val & 1) == 1;
        let next_val = if is_odd {
            (3 * cur_val + 1) >> 1
        } else {
            cur_val >> 1
        };
        let next_odd = odd_count + (is_odd as usize);

        if POW3[next_odd] < (1u128 << d) {
            let leaves = 1u128 << (target_k - d);
            stats.contracted_count += leaves;
            stats.depth_hist[d] += leaves;
            return;
        }

        if d == target_k {
            let idx8 = ((r >> 1) & 0xFF) as usize;
            stats.suffix8_counts[idx8] += 1;
            return;
        }

        if d >= split_d {
            let delta = POW3[next_odd];
            tasks.push(FrontierTask {
                d: d + 1,
                r,
                cur_val: next_val,
                odd_count: next_odd,
            });
            tasks.push(FrontierTask {
                d: d + 1,
                r: r + (1u128 << d),
                cur_val: next_val + delta,
                odd_count: next_odd,
            });
            return;
        }

        let delta = POW3[next_odd];
        build_frontier(
            d + 1,
            split_d,
            target_k,
            r,
            next_val,
            next_odd,
            stats,
            tasks,
        );
        build_frontier(
            d + 1,
            split_d,
            target_k,
            r + (1u128 << d),
            next_val + delta,
            next_odd,
            stats,
            tasks,
        );
    }

    build_frontier(
        1,
        split_depth,
        safe_k,
        1,
        1,
        0,
        &mut root_stats,
        &mut tasks,
    );

    let queue_idx = AtomicUsize::new(0);
    let worker_count = num_threads.max(1);

    let worker_results: Vec<WorkerStats> = thread::scope(|s| {
        let mut handles = Vec::with_capacity(worker_count);
        let tasks_ref = &tasks;
        let q_ref = &queue_idx;

        for _ in 0..worker_count {
            handles.push(s.spawn(move || {
                let mut local = WorkerStats {
                    suffix8_counts: vec![0u64; 256],
                    ..Default::default()
                };
                loop {
                    let idx = q_ref.fetch_add(1, Ordering::Relaxed);
                    if idx >= tasks_ref.len() {
                        break;
                    }
                    let t = tasks_ref[idx];
                    explore_subtree_seq(t.d, safe_k, t.r, t.cur_val, t.odd_count, &mut local);
                }
                local
            }));
        }

        handles.into_iter().map(|h| h.join().unwrap()).collect()
    });

    for w in worker_results {
        root_stats.contracted_count += w.contracted_count;
        root_stats.visited_nodes += w.visited_nodes;
        for d in 0..=safe_k {
            root_stats.depth_hist[d] += w.depth_hist[d];
        }
        for i in 0..256 {
            root_stats.suffix8_counts[i] += w.suffix8_counts[i];
        }
        for sample in w.samples {
            if root_stats.samples.len() < 20 {
                root_stats.samples.push(sample);
            }
        }
    }

    let total_odd_residues = 1u128 << (safe_k - 1);
    let surviving_count = total_odd_residues.saturating_sub(root_stats.contracted_count);
    let contracted_percent =
        (root_stats.contracted_count as f64 / total_odd_residues as f64) * 100.0;

    let mut depth_histogram = Vec::new();
    for d in 1..=safe_k {
        if root_stats.depth_hist[d] > 0 {
            depth_histogram.push((d, root_stats.depth_hist[d]));
        }
    }

    let mut suffix_entries: Vec<(usize, u64)> = root_stats
        .suffix8_counts
        .into_iter()
        .enumerate()
        .filter(|(_, c)| *c > 0)
        .collect();
    suffix_entries.sort_by(|a, b| b.1.cmp(&a.1));

    let top_irreducible_suffixes = suffix_entries
        .into_iter()
        .take(10)
        .map(|(idx8, count)| {
            let odd_r9 = ((idx8 as u128) << 1) | 1;
            let width = safe_k.min(9);
            let suf_str = format!("{:0>width$b}", odd_r9 & ((1u128 << width) - 1), width = width);
            let share = (count as f64 / (surviving_count.max(1) as f64)) * 100.0;
            (suf_str, count as u128, share)
        })
        .collect();

    let elapsed_ms = start.elapsed().as_secs_f64() * 1000.0;
    let naive_ops = (total_odd_residues as f64) * (safe_k as f64);
    let pruning_speedup = naive_ops / (root_stats.visited_nodes.max(1) as f64);

    ContractionCertificate {
        k: safe_k,
        total_odd_residues,
        contracted_count: root_stats.contracted_count,
        surviving_count,
        contracted_percent,
        visited_nodes: root_stats.visited_nodes,
        pruning_speedup,
        elapsed_ms,
        depth_histogram,
        top_irreducible_suffixes,
        surviving_samples: root_stats.samples,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pre_carry_ternary_insights() {
        // 1. Alternating n = 5 (101_2): 1010 + 101 + 1 = 1112 -> 10000_2 (16 = 2^4)
        let s5 = analyze_pre_carry_u128(5);
        assert_eq!(s5.n_bits, "101");
        assert_eq!(s5.raw_pre_carry, "1112");
        assert_eq!(s5.out_bits, "10000");
        assert!(s5.is_immediate_power_of_two);

        // 2. Chain: 10_2 (2) -> 111_2 (7) -> 1222 -> 10110_2 (22) -> 111211 -> 1000011_2 (67)
        let s2 = analyze_pre_carry_u128(2);
        assert_eq!(s2.raw_pre_carry, "111");
        assert_eq!(s2.out_bits, "111");

        let s7 = analyze_pre_carry_u128(7);
        assert_eq!(s7.raw_pre_carry, "1222");
        assert_eq!(s7.out_bits, "10110");

        let s22 = analyze_pre_carry_u128(22);
        assert_eq!(s22.raw_pre_carry, "111211");
        assert_eq!(s22.out_bits, "1000011");
    }

    #[test]
    fn test_lyapunov_potential_strict_mersenne_descent() {
        let profile = optimize_lyapunov_weights(20_000);
        assert!(profile.mersenne_climb_strictly_decreasing);
        assert!(profile.mean_drift_per_odd_step < -0.35);
        assert!(profile.single_step_decrease_pct > 62.0);
        assert!(profile.three_step_decrease_pct > 85.0);
    }

    #[test]
    fn test_parallel_2adic_verifier_up_to_k24() {
        let cert20 = verify_2adic_tree_parallel(20, 8);
        assert_eq!(cert20.total_odd_residues, 524_288);
        assert!(cert20.contracted_percent > 85.0);

        let cert24 = verify_2adic_tree_parallel(24, 8);
        assert_eq!(cert24.total_odd_residues, 8_388_608);
        assert!(cert24.contracted_percent > 90.0);
    }
}
