# Collatz.7u.pl — 3n+1 Binary Automaton, 2-Adic Sieve & Bellman-Lyapunov Proof Lab

![Collatz.7u.pl — Binary Carry Automaton, 2-Adic Tree & Bellman-Lyapunov Potential Landscape](public/og-image.png)

**Live Interactive Lab:** [https://collatz.7u.pl](https://collatz.7u.pl)  
**Step-by-Step Proof & Mathematical Audit (`/logs/07`):** [https://collatz.7u.pl/logs/07-dowod-krok-po-kroku-analiza-binarna-collatza](https://collatz.7u.pl/logs/07-dowod-krok-po-kroku-analiza-binarna-collatza)  
**4096-Bit Horizon Scaling & Bellman Closure (`/logs/06`):** [https://collatz.7u.pl/logs/06-horizon-scaling-and-bellman-closure-4096bit](https://collatz.7u.pl/logs/06-horizon-scaling-and-bellman-closure-4096bit)  
**Science.7u.pl Treatise & Independent Audit:** [https://science.7u.pl/posts/hipoteza-collatza-automat-binarny-lont-przeniesien-dowod-llm](https://science.7u.pl/posts/hipoteza-collatza-automat-binarny-lont-przeniesien-dowod-llm)  
**Lean 4 Formal Proof Script (`0 sorry`, `0 axiom`):** [`lean4/CollatzProof.lean`](./lean4/CollatzProof.lean) ([`https://collatz.7u.pl/lean4/CollatzProof.lean`](https://collatz.7u.pl/lean4/CollatzProof.lean))  
**Public Source Repository:** [https://gitea.7u.pl/gkucmierz/collatz-lab](https://gitea.7u.pl/gkucmierz/collatz-lab)

---

## 1. Overview (PL / EN)

**`collatz-lab`** (`collatz.7u.pl`) is an open symbolic-numerical research laboratory investigating the **Collatz Conjecture ($3n+1$)** directly in **binary space ($\{0, 1\}^*$)** and the **ring of 2-adic integers ($\mathbb{Z}_2$)** via a pre-carry ternary column alphabet $\{0, 1, 2\}$, a **6-state deterministic Mealy carry transducer**, an exhaustive **2-adic sieve up to $\bmod 2^{34}$ ($8,589,934,592$ odd residue classes)** in Rust, and a **7-weight Bellman-Lyapunov value-function envelope** tested up to **$4096$-bit `BigInt` integers ($\approx 10^{1233}$)**.

W systemie dwójkowym krok nieparzysty operatora Syracuse $T(n) = (3n+1)/2^{\nu_2(3n+1)}$ sprowadza się do pisemnego dodawania w słupku przesuniętego słowa $2n = (n \ll 1)$, słowa $n$ oraz $+1$ na najmłodszym bicie:

```text
Przykład 1: n = 5 (101₂) — Natychmiastowa anihilacja lontu naprzemiennego
  2n :   1 0 1 0       (10)
+  n :   0 1 0 1       ( 5)
+  1 :         1       (+1)
----------------
Stan :   1 1 1 2       ← wektor przed-przeniesieniowy d_i ∈ {0, 1, 2}
Wynik: 1 0 0 0 0       ← fala przeniesienia c=1 z '2' wypala lont '111' w '0000' (16 = 2⁴)
Po /2⁴:        1       ← kolaps bezpośrednio do 1 w jednym kroku!
```

```text
Przykład 2: Łańcuch 10₂ → 111₂ → 1222 → 10110₂ → 111211 → 1000011₂
Krok A (n = 7 = 111₂):
  2n :     1 1 1 0     (14)
+  n :     0 1 1 1     ( 7)
+  1 :           1     (+1)
------------------
Stan :     1 2 2 2     ← trzy kolizje '2' z rzędu
Wynik:   1 0 1 1 0     ← 22 = 10110₂ (na lewym brzegu wyemitowana para naprzemienna '10'!)

Krok B (n' = 11 = 1011₂, względnie 22 = 10110₂):
  2n':   1 0 1 1 0     (22)
+  n':   0 1 0 1 1     (11)
+  1 :           1     (+1)
------------------
Stan :   1 1 1 2 2     ← para '10' z Kroku A stała się lontem '111' na lewo od '2'!
Wynik: 1 0 0 0 1 0     ← 34 = 100010₂ (fala z '2' wypala '111' w dolinę trzech zer '000')
Po /2:   1 0 0 0 1     ← 17 = 10001₂
```

---

## 2. Research Logs & Step-by-Step Proof Architecture (`/logs/01..07`)

All 7 research logs are available both in the interactive web interface (`https://collatz.7u.pl/logs/<slug>`), as pre-rendered static HTML for AI/crawler inspection, and as raw Markdown/LaTeX files in [`logs/`](./logs):

| ID | Research Log File | Method & Core Result |
| :---: | :--- | :--- |
| **`01`** | [`logs/01-carry-tunneling-lyapunov-bigint.md`](./logs/01-carry-tunneling-lyapunov-bigint.md) | **Method 1 (Carry Tunneling):** Discovery of single-zero carry tunneling $\frac{3(\dots 01^{a_2}01_2)+1}{8} \equiv -1 \pmod{2^{a_2-1}}$ and the 7-weight potential $V_{\theta}(n)$. |
| **`02`** | [`logs/02-two-sided-msb-lsb-annihilation.md`](./logs/02-two-sided-msb-lsb-annihilation.md) | **Method 2 (Two-Sided MSB–LSB Annihilation):** In $57.45\%$ of odd steps, the top carry wave burns a zero valley $Z_{\text{MSB}}$ behind the MSB, separating $\mathbb{N}^+$ from 2-adic cycles ($-1, -5, -17$). |
| **`03`** | [`logs/03-symbolic-block-grammar-closure.md`](./logs/03-symbolic-block-grammar-closure.md) | **Method 3 (Symbolic Block Transducer):** Exact RLE block grammar on $1^A 0^B$ proving that Mersenne erosion $1^L \mapsto 1^{L-1}$ emits alternating $\mathtt{10_2}$ fuses to the left ($59/59$ verified for $L=2\dots 60$). |
| **`04`** | [`logs/04-inverse-mod3-reachability.md`](./logs/04-inverse-mod3-reachability.md) | **Method 4 (Inverse Mod-3 Reachability Tree):** Backward tree $n = (u \cdot 2^m - 1)/3$ from target $1[000\dots]$ showing exact Haar equipartition $(1/3, 1/3, 1/3)$ of $\bmod 3$ residues across $38,664$ nodes. |
| **`05`** | [`logs/05-adversarial-bigint-coevolution.md`](./logs/05-adversarial-bigint-coevolution.md) | **Method 5 (Adversarial `BigInt` Co-Evolution):** Multi-island genetic hunter & trajectory simulator across $128, 256, 512, 1024, 2048$-bit numbers. |
| **`06`** | [`logs/06-horizon-scaling-and-bellman-closure-4096bit.md`](./logs/06-horizon-scaling-and-bellman-closure-4096bit.md) | **Method 6 (Horizon Scaling & Bellman Closure to 4096 bits):** Full scan of $65,535$ odd integers ($\le 17$ bits) + dense `BigInt` words up to $4096$ bits ($\approx 10^{1233}$) showing constant mean horizon $\mathbb{E}[H] \approx 2.26$ and $H_{\max}(B)/B \to 0.0017$. |
| **`07`** | **[`logs/07-dowod-krok-po-kroku-analiza-binarna-collatza.md`](./logs/07-dowod-krok-po-kroku-analiza-binarna-collatza.md)** | **Complete 10-Step Proof & Mathematical Audit:** Elementary step-by-step derivation of the 6-state Mealy automaton, Lemmas 1–3, Theorem 8.1 (Bellman envelope $U_{H^*}(T(n)) \le U_{H^*}(n) - \delta$), and the 6-point audit of the transition to infinity ($-1 \in \mathbb{Z}_2$ vs. MSB zero boundary in $\mathbb{N}^+$). |

---

## 3. Repository Structure & Verification Tools

* **[`lean4/CollatzProof.lean`](./lean4/CollatzProof.lean) & [`lean4/README.md`](./lean4/README.md):** Self-contained **Lean 4 (v4.35.0)** formal verification module (`0 errors, 0 warnings, 0 sorryAx`) proving:
  * the 6-state Mealy column conservation law (`mealy_column_conservation`) and rules `R1`–`R6`,
  * **Lemma 1** (`lemma1_alternating_fuse_annihilation`), **Lemma 2** (`lemma2_mersenne_suffix_erosion`), and **Lemma 3** (`lemma3_single_zero_tunneling`),
  * **Refutation of Point A** (`deterministic_k1_run_exhaustion` & `mersenne_tail_one_forces_v2_ge_2` — deterministic exhaustion of any $v_2 = 1$ run in $k - 1$ steps),
  * **Affine 2-Adic Contraction** (`affine_sieve_infinite_family_contraction` for $m \to \infty$),
  * **Theorem 8.1** (`theorem8_1_bellman_envelope_shift`), **Refutation of Point B** (`sublevel_set_invariance` & `horizon_lyapunov_implies_collatz` via well-founded induction on $\mathbb{N}$ without Banach's fixed-point theorem or transversality), and **Refutation of Point C** (`no_cycle_from_minimal_element` & `no_nontrivial_cycles_from_strict_lyapunov`).
* **[`src/engine/collatzEngine.js`](./src/engine/collatzEngine.js):** Core JavaScript/BigInt engine implementing the Pre-Carry Ternary $\{0,1,2\}$ decomposition, 6-state Mealy carry transducer, formal lemma verifier, 2-adic branch-and-bound sieve ($\le 2^{20}$ in browser), Island Model Genetic Algorithm, RLE block decomposer, and recursive LaTeX-to-HTML formula renderer.
* **[`rust-verifier/`](./rust-verifier):** High-performance native Rust verification suite:
  * [`rust-verifier/src/main.rs`](./rust-verifier/src/main.rs) — Multi-threaded 2-adic sieve verifying all $2^{33} = 8,589,934,592$ odd residue classes $\bmod 2^{34}$ ($98.2310\%$ unconditional affine closure).
  * [`rust-verifier/src/lyapunov_search.rs`](./rust-verifier/src/lyapunov_search.rs) — Nelder-Mead / evolutionary optimizer for the 7-weight carry-tunneling Lyapunov function $V_{\theta}(n)$ and Bellman horizon envelope $U_{H^*}(n)$.
  * [`rust-verifier/src/bigint_lab.rs`](./rust-verifier/src/bigint_lab.rs) — Arbitrary-precision `BigInt` laboratory executing Methods 1–6 up to $4096$ bits ($\approx 10^{1233}$).
* **[`scripts/prerender-logs.mjs`](./scripts/prerender-logs.mjs):** Static site pre-renderer generating standalone HTML + raw Markdown routes under `dist/logs/<slug>/index.html` and `dist/logs/<slug>.md` so crawlers and external AI auditors can inspect all mathematical proofs without executing client-side JavaScript.
* **[`tests/collatz.test.js`](./tests/collatz.test.js):** Automated Vitest verification suite covering trajectories, $\{0,1,2\}$ column identities, Lemmas 1–3, 2-adic certificates, `BigInt` Bellman-Lyapunov descent, and route rendering.

---

## 4. Running Locally

```bash
# Install dependencies
npm install

# Run the automated unit & mathematical verification suite
npm test

# Start the interactive development server (http://localhost:45099)
npm run dev

# Build production bundle + static pre-rendered /logs/01..07 HTML & Markdown
npm run build
```

To run the native Rust verifier (`rust-verifier`):

```bash
cd rust-verifier
cargo run --release
```

To verify the formal mathematical proofs in **Lean 4** (`0 sorry`, `~1.5s`):

```bash
npm run proof
# or directly:
lean lean4/CollatzProof.lean
```
