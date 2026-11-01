use collatz_rust_verifier::bigint_lab::{
    run_method1_optimization_loop, run_method2_two_sided_analysis, run_method4_inverse_mod3_tree,
    run_method5_adversarial_bigint_hunter, run_method6_horizon_scaling_analysis,
    verify_method3_symbolic_grammar,
};
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

    // =========================================================================
    // 4. Execute All 5 BigInt (128..2048-bit) Research Loop Methods
    // =========================================================================
    println!("\n==========================================================================");
    println!("  5-Method Autonomous BigInt (128..2048-Bit) Research Loop");
    println!("==========================================================================");

    let m1_reports = run_method1_optimization_loop();
    println!("\n  [Method 1: Multi-Layer Carry-Tunneling Lyapunov V_theta(n)]");
    for r in &m1_reports {
        println!(
            "    - {:<68} | E(1)={:>5.2}% | E(3)={:>5.2}% | E(6)={:>5.2}% | E(12)={:>5.2}% | E(W={:>2})={:>6.4}%",
            r.label, r.err_1step_pct, r.err_3step_pct, r.err_6step_pct, r.err_12step_pct, r.window_k, r.err_window_k_pct
        );
    }

    let m2_stats = run_method2_two_sided_analysis();
    println!("\n  [Method 2: Two-Sided MSB Valley vs LSB Erosion Annihilation]");
    println!(
        "    - Trajectories: {} | Odd Steps: {} | MSB Carry Reflections: {} | MSB Valley Expansions: {} | Max MSB Valley: {} zeros | 100% Collapsed: {}",
        m2_stats.total_trajectories,
        m2_stats.total_odd_steps,
        m2_stats.msb_carry_reflection_events,
        m2_stats.msb_valley_expansion_events,
        m2_stats.max_msb_valley_observed,
        m2_stats.positive_100pct_collapsed_to_1000
    );

    let m3_rules = verify_method3_symbolic_grammar();
    println!("\n  [Method 3: Symbolic Block Grammar 1^a 0^b Rewriting Transducer]");
    for rule in &m3_rules {
        println!(
            "    - {:<22} | {} -> {} -> {} (Verified L=2..60: {}/59)",
            rule.id, rule.pattern_in, rule.pre_carry_ternary, rule.pattern_out, rule.verified_instances
        );
    }

    let m4_inv = run_method4_inverse_mod3_tree(6, 16);
    println!("\n  [Method 4: Inverse Mod-3 Automaton from 1[000...]]");
    println!(
        "    - Depth: {} | Reachable Predecessors: {} | u≡1(mod 3) branches: {} | u≡2(mod 3) branches: {} | u≡0(mod 3) dead leaves: {}",
        m4_inv.depth,
        m4_inv.total_nodes_generated,
        m4_inv.mod3_residue1_branching,
        m4_inv.mod3_residue2_branching,
        m4_inv.mod3_residue0_terminal_leaves
    );

    let m5_champs = run_method5_adversarial_bigint_hunter();
    println!("\n  [Method 5: Adversarial BigInt (128..2048-Bit) Co-Evolutionary Hunter]");
    for c in &m5_champs {
        println!(
            "    - {:>4}-bit BigInt | Odd steps: {:>5} | Even steps: {:>5} | γ(n) = {:>5.2} | Window ΔV<0: {:>2} steps | Collapsed to 1[000...]: {}",
            c.bit_length,
            c.total_odd_steps,
            c.total_even_steps,
            c.gamma_delay,
            c.min_window_to_drop_v,
            c.collapsed_to_1000
        );
    }

    let m6_buckets = run_method6_horizon_scaling_analysis();
    println!("\n  [Method 6: Exhaustive Horizon Scaling H_max(B) / B up to 4096-Bit BigInt]");
    for b in &m6_buckets {
        println!(
            "    - {:<42} | Tested: {:>6} | H_max: {:>3} | Mean H: {:>4.2} | H_max/B: {:>6.4} | 100% Closed (E=0%): {} | Hardest: {}",
            b.bit_range_label,
            b.tested_count,
            b.max_horizon_h,
            b.mean_horizon_h,
            b.relative_horizon_h_over_bits,
            b.zero_failures_at_h_max,
            b.hardest_seed_bits
        );
    }
}
