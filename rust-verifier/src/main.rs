use collatz_rust_verifier::{
    analyze_pre_carry_u128, optimize_lyapunov_weights, verify_2adic_tree_parallel,
};
use std::fs;
use std::path::Path;

fn main() {
    let threads = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(8);

    println!("==========================================================================");
    println!(
        "  Collatz-Lab Native Rust 128-Bit 2-Adic Verifier ({} threads)",
        threads
    );
    println!("==========================================================================\n");

    // 1. Verify Pre-Carry Ternary {0,1,2} examples
    for &sample_n in &[5u128, 2, 7, 22, 85, 341] {
        let p = analyze_pre_carry_u128(sample_n);
        println!(
            "  [Pre-Carry {{0,1,2}}] n = {:>3} ({:>8}_2) -> 2n+n+1 raw = {:>9} -> out = {:>10}_2 (v2={}, next={})",
            p.n, p.n_bits, p.raw_pre_carry, p.out_bits, p.v2, p.syracuse_next
        );
    }

    // 2. Optimize & verify Composite 2-Adic Lyapunov Potential Function V(n)
    let lyap = optimize_lyapunov_weights(500_000);
    println!("\n  [Lyapunov Potential V(n) = log2(n) + {:.2}*T1(n) + {:.2}*C11(n) - {:.2}*Falt(n)]", lyap.w_trail, lyap.w_collision2, lyap.w_fuse1);
    println!(
        "    - 1-Step Strict Decrease: {:.2}% | 2-Step: {:.2}% | 3-Step: {:.2}%",
        lyap.single_step_decrease_pct, lyap.two_step_decrease_pct, lyap.three_step_decrease_pct
    );
    println!(
        "    - Mean Lyapunov Drift:    {:.5} bits/odd-step | Mersenne 1^L Strictly Decreasing: {}",
        lyap.mean_drift_per_odd_step, lyap.mersenne_climb_strictly_decreasing
    );

    // 3. Run Multi-Threaded 2-Adic Contraction Tree Verification for k = 20..34
    println!("\n  [2-Adic Contraction Tree mod 2^k (Branch-and-Bound Subtree Pruning)]");
    let k_levels = [20usize, 22, 24, 26, 28, 30, 32, 34];
    let mut certs = Vec::new();

    for &k in &k_levels {
        let c = verify_2adic_tree_parallel(k, threads);
        println!(
            "    k = {:>2} | Odd Classes: {:>11} | Contracted: {:>11} ({:>6.3}%) | Surviving: {:>9} | Speedup: {:>6.1}x | {:>6.2} ms",
            c.k,
            c.total_odd_residues,
            c.contracted_count,
            c.contracted_percent,
            c.surviving_count,
            c.pruning_speedup,
            c.elapsed_ms
        );
        certs.push(c);
    }

    // Export JSON certificate to ../public/certificates/rust-2adic-certificate.json
    let mut json = String::from("{\n");
    json.push_str(&format!("  \"engine\": \"collatz-rust-verifier 1.0 (u128 + {} threads)\",\n", threads));
    json.push_str(&format!(
        "  \"lyapunov\": {{\n    \"formula\": \"V(n) = log2(n) + {:.2}*T1(n) + {:.2}*C11(n) - {:.2}*Falt(n)\",\n    \"wTrail\": {:.2},\n    \"wCollision2\": {:.2},\n    \"wFuse1\": {:.2},\n    \"singleStepDecreasePct\": {:.4},\n    \"twoStepDecreasePct\": {:.4},\n    \"threeStepDecreasePct\": {:.4},\n    \"meanDriftPerOddStep\": {:.6},\n    \"mersenneStrictDescent\": {}\n  }},\n",
        lyap.w_trail,
        lyap.w_collision2,
        lyap.w_fuse1,
        lyap.w_trail,
        lyap.w_collision2,
        lyap.w_fuse1,
        lyap.single_step_decrease_pct,
        lyap.two_step_decrease_pct,
        lyap.three_step_decrease_pct,
        lyap.mean_drift_per_odd_step,
        lyap.mersenne_climb_strictly_decreasing
    ));
    json.push_str("  \"levels\": [\n");
    for (idx, c) in certs.iter().enumerate() {
        json.push_str("    {\n");
        json.push_str(&format!("      \"k\": {},\n", c.k));
        json.push_str(&format!("      \"totalOddResidues\": {},\n", c.total_odd_residues));
        json.push_str(&format!("      \"contractedCount\": {},\n", c.contracted_count));
        json.push_str(&format!("      \"survivingCount\": {},\n", c.surviving_count));
        json.push_str(&format!("      \"contractedPercent\": {:.6},\n", c.contracted_percent));
        json.push_str(&format!("      \"visitedNodes\": {},\n", c.visited_nodes));
        json.push_str(&format!("      \"pruningSpeedup\": {:.2},\n", c.pruning_speedup));
        json.push_str(&format!("      \"elapsedMs\": {:.3},\n", c.elapsed_ms));
        json.push_str("      \"topIrreducibleSuffixes\": [");
        for (s_idx, (suf, cnt, share)) in c.top_irreducible_suffixes.iter().take(6).enumerate() {
            json.push_str(&format!(
                "{{\"suffix\": \"{}\", \"count\": {}, \"sharePct\": {:.3}}}{}",
                suf,
                cnt,
                share,
                if s_idx + 1 < c.top_irreducible_suffixes.len().min(6) {
                    ", "
                } else {
                    ""
                }
            ));
        }
        json.push_str("]\n");
        json.push_str(if idx + 1 < certs.len() {
            "    },\n"
        } else {
            "    }\n"
        });
    }
    json.push_str("  ]\n}\n");

    let out_dir = Path::new("../public/certificates");
    let _ = fs::create_dir_all(out_dir);
    let out_file = out_dir.join("rust-2adic-certificate.json");
    fs::write(&out_file, &json).expect("Failed to write JSON certificate");
    println!("\n  [OK] Exported formal certificate to {:?}", out_file);
}
