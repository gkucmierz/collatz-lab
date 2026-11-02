---
name: collatz-horizon-hunter
description: Autonomous loop skill (/goal) for hunting the remaining 1.769% surviving 2-adic residue classes and closing h_horizon in lean4/CollatzProof.lean until stopped by the user.
---

# Collatz Horizon Hunter (`h_horizon` Continuous Loop Skill)

Use this skill whenever the user invokes `/goal` or asks to hunt for the missing $1.769\%$ (`h_horizon`) in `collatz-lab`.

## Loop Execution Steps

1. **Run the Symbolic Branch & Invariant Hunter:**
   ```bash
   node scripts/hunt-surviving-horizon.mjs --depth 8
   ```
   This script inspects all surviving residue classes $r \pmod{2^k}$, computes the exact symbolic affine trajectory $T^m(2^k \cdot q + r) = 3^{\text{odd}} \cdot q + c$ under `collatzStep`, and emits ready-to-verify Lean 4 theorems for every newly contracting residue class.

2. **Integrate New Theorems & Structural Invariants into `lean4/CollatzProof.lean`:**
   - Add the newly discovered unconditional residue contraction lemmas (`horizon_drop_mod64_...`, `horizon_drop_mod128_...`, etc.) or multi-block induction lemmas into `lean4/CollatzProof.lean`.
   - Update the master reduction theorem so the surviving hypothesis set shrinks monotonically at every iteration.

3. **Machine-Verify in Lean 4 (`0 sorryAx`):**
   ```bash
   npm run proof
   ```
   Ensure exit code `0` and verify via `#print axioms` that only standard axioms (`propext`, `Classical.choice`, `Quot.sound`) appear.

4. **Repeat Indefinitely Until User Interruption:**
   Do not stop after a single depth level. Immediately advance $k \mapsto k + 1$ and test the next candidate invariant on the surviving branches until the user explicitly stops the task.
