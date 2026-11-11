# Raport Rundy 2 — Architekt 3 (Fotel Inżyniera Automatu RLE i Tunelowania MSB-LSB)

## 1. Podsumowanie Wykonawcze Rundy 2 (`mod 512`, `v₂ ≥ 9`, wszystkie 8 rodzin)

Korzystając z:
- 2-adycznego wzoru `pow9_mod512` (od Architekta 2):
  $$s_{512}(k) = \left(k + 8\lfloor k/2\rfloor + 16\lfloor k/4\rfloor + 16\lfloor(k+1)/4\rfloor + 32\lfloor k/8\rfloor + 32\lfloor(k+1)/8\rfloor + 32\lfloor(k+2)/8\rfloor + 32\lfloor(k+3)/8\rfloor\right) \bmod 64$$
- oraz naszej architektury refleksyjnej `checkResonanceTable 512` + `checkResonanceTable_sound` + `mod512_linear_inverse`,

wyprowadziłem, zweryfikowałem w `node -e` (dla wszystkich $r = 0..65$ i $W = 0..2$) oraz przetestowałem w `~/.elan/bin/lean --stdin` (**0 błędów, 0 ostrzeżeń, `0 sorryAx`, domyślny `maxHeartbeats 200000` bez ani jednego `set_option maxHeartbeats`**) kompletny pakiet **71 twierdzeń `mod 512` (`v₂ ≥ 9`) dla WSZYSTKICH 8 RODZIN**!

### Odkrycie algebraiczne: Uniwersalne podniesienie $t_{256}(s) \to t_{512}(s)$
Dla wszystkich 8 rodzin wzór na $t(s) \in \{0, \dots, 63\}$ (gdzie $U = 512W + u_{\text{base}} + 8t(s)$) powstaje ze wzoru $t_{256}(s)$ z `CollatzProof.lean` przez dodanie **dokładnie jednej pary członów dzielenia przez 4**:
- **Grupa A (5 rodzin: `two_zero_valley`, `shifted_valley`, `rle_10011`, `rle_10111`, `shifted_valley_d1`)**:
  dodajemy `+ 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)` (odpowiada korekcie $+32$ dla $s \equiv 1 \pmod 4$).
- **Grupa B (3 rodziny: `two_zero_valley_d5` ze stałą `42`, `two_zero_valley_d4`, `shifted_valley_d2`)**:
  dodajemy `+ 32 * (s / 4) + 32 * ((s + 1) / 4)` (odpowiada korekcie $+32$ dla $s \equiv 3 \pmod 4$).

### Zestawienie wszystkich 8 rodzin na poziomie `mod 512` (`v₂ ≥ 9`)

| # | Rodzina | Licznik $\equiv 0 \pmod{512}$ | Indeks $s$ | Wzór na $t(s) \bmod 64$ oraz $U$ | Kroki | Nowy pułap $r_{\max}$ (`mod 512`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1}U - 7$ | $s_{512}(r+1)$ | $(s + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor) \bmod 64$<br>$U = 512W + 7 + 8t(s)$ | $5r+14$ | **$r \le 51$** (**$2^{156}$**, $269$ kr.) | `_drop_r46..r51` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1}U - 5$ | $s_{512}(r+1)$ | $(3s + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor) \bmod 64$<br>$U = 512W + 5 + 8t(s)$ | $5r+14$ | **$r \le 51$** (**$2^{156}$**, $269$ kr.) | `_drop_r46..r51` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2}U - 7$ | $s_{512}(r+2)$ | $(s + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor) \bmod 64$<br>$U = 512W + 7 + 8t(s)$ | $5r+20$ | **$r \le 56$** (**$2^{175}$**, $300$ kr.) | `_drop_r51..r56` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27\cdot 9^{r+1}U - 7$ | $s_{512}(r+1)$ | $(3s + 16 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor) \bmod 64$<br>$U = 512W + 5 + 8t(s)$ | $5r+22$ | **$r \le 53$** (**$2^{167}$**, $287$ kr.) | `_drop_r48..r53` (6 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3\cdot 9^r U - 7$ | $s_{512}(r)$ | $(27s + 21 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor) \bmod 64$<br>$U = 512W + 5 + 8t(s)$ | $5r+11$ | **$r \le 49$** (**$2^{148}$**, $256$ kr.) | `_drop_r44..r49` (6 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3\cdot 9^{r+1}U - 5$ | $s_{512}(r+1)$ | $(17s + 42 + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor) \bmod 64$<br>$U = 512W + 7 + 8t(s)$ | $5r+17$ | **$r \le 54$** (**$2^{167}$**, $287$ kr.)<br>*(bonus: $r=54$ też działa!)* | `_drop_r48..r54` (7 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2}U - 29$ | $s_{512}(r+2)$ | $(11s + 3 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor) \bmod 64$<br>$U = 512W + 5 + 8t(s)$ | $5r+17$ | **$r \le 39$** (**$2^{121}$**, $212$ kr.) | `_drop_r34..r39` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27\cdot 9^r U - 29$ | $s_{512}(r)$ | $(s + 4 + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor) \bmod 64$<br>$U = 512W + 7 + 8t(s)$ | $5r+14$ | **$r \le 36$** (**$2^{110}$**, $194$ kr.)<br>*(bonus: $r=36$ też działa!)* | `_drop_r30..r36` (7 tw.) |

## 2. Gotowy do wklejenia i zweryfikowany w `lean --stdin` blok kodu Lean 4

Poniższy kod został w całości przetestowany w `~/.elan/bin/lean --stdin` (zero błędów, zero ostrzeżeń, domyślny `maxHeartbeats 200000`, `0 sorryAx`). Można go wkleić bezpośrednio przed `end CollatzLab` w `CollatzProof.lean`:

```lean
-- =============================================================================
-- CZĘŚĆ 49. 2-ADYCZNA OKRESOWOŚĆ POTĘG DZIEWIĄTKI `mod 512` (`pow9_mod512`),
--           ARCHITEKTURA `checkResonanceTable` + `mod512_linear_inverse` ORAZ
--           PAKIET REZONANSÓW `mod 512` (`v₂ ≥ 9`) DLA WSZYSTKICH 8 RODZIN
--           (SIĘGAJĄCY `r = 56`, TJ. `2^175` W `300` KROKACH COLLATZA!)
-- =============================================================================

/-- Twierdzenie o 2-adycznej okresowości potęg dziewiątki modulo 512 (okres 64):
    Dla każdego `k ∈ ℕ` zachodzi:
      `(9^k) % 512 = 1 + 8 * ((k + 8 * (k / 2) + 16 * (k / 4) + 16 * ((k + 1) / 4) + 32 * (k / 8) + 32 * ((k + 1) / 8) + 32 * ((k + 2) / 8) + 32 * ((k + 3) / 8)) % 64)`. -/
theorem pow9_mod512 (k : Nat) :
    (9 ^ k) % 512 = 1 + 8 * ((k + 8 * (k / 2) + 16 * (k / 4) + 16 * ((k + 1) / 4) +
      32 * (k / 8) + 32 * ((k + 1) / 8) + 32 * ((k + 2) / 8) + 32 * ((k + 3) / 8)) % 64) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    have hp : k % 8 = 0 ∨ k % 8 = 1 ∨ k % 8 = 2 ∨ k % 8 = 3 ∨
              k % 8 = 4 ∨ k % 8 = 5 ∨ k % 8 = 6 ∨ k % 8 = 7 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7 <;> omega

/-- Lemat o 8 krokach parzystych przy podzielności przez 512 (`v₂ ≥ 9`): -/
theorem div2_step8_eq_div512 (N : Nat) (hN : N % 512 = 0) :
    collatzIter 8 (N / 2) = N / 512 := by
  have s1 : collatzStep (N / 2)   = N / 4   := by unfold collatzStep; split <;> omega
  have s2 : collatzStep (N / 4)   = N / 8   := by unfold collatzStep; split <;> omega
  have s3 : collatzStep (N / 8)   = N / 16  := by unfold collatzStep; split <;> omega
  have s4 : collatzStep (N / 16)  = N / 32  := by unfold collatzStep; split <;> omega
  have s5 : collatzStep (N / 32)  = N / 64  := by unfold collatzStep; split <;> omega
  have s6 : collatzStep (N / 64)  = N / 128 := by unfold collatzStep; split <;> omega
  have s7 : collatzStep (N / 128) = N / 256 := by unfold collatzStep; split <;> omega
  have s8 : collatzStep (N / 256) = N / 512 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2)))))))) = N / 512
  rw [s1, s2, s3, s4, s5, s6, s7, s8]

/-- Uniwersalny ewaluator tablicy rezonansowej `mod K` dla `s ∈ {0, ..., n - 1}`: -/
def checkResonanceTable (K A uBase c : Nat) (tFn : Nat → Nat) : Nat → Bool
  | 0 => true
  | s + 1 =>
    (((A * (uBase + 8 * tFn s) * (1 + 8 * s)) % K == c % K) &&
      checkResonanceTable K A uBase c tFn s)

theorem bool_and_eq_true_iff (a b : Bool) : (a && b) = true ↔ a = true ∧ b = true := by
  cases a <;> cases b <;> decide

/-- Twierdzenie o poprawności `checkResonanceTable` (eliminuje 64-gałęziowe `rcases hs`): -/
theorem checkResonanceTable_sound (K A uBase c : Nat) (tFn : Nat → Nat) (n : Nat)
    (h : checkResonanceTable K A uBase c tFn n = true) :
    ∀ s < n, (A * (uBase + 8 * tFn s) * (1 + 8 * s)) % K = c % K := by
  induction n with
  | zero => intro s hs; omega
  | succ n ih =>
    unfold checkResonanceTable at h
    rw [bool_and_eq_true_iff] at h
    intro s hs
    have hcases : s = n ∨ s < n := by omega
    rcases hcases with rfl | hlt
    · exact of_decide_eq_true h.1
    · exact ih h.2 s hlt

/-- Ogólny lemat redukcji liniowej modulo 512 dla liczników postaci `A * M * (512 * W + u0) - c`: -/
theorem mod512_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 512 = b)
    (hge : c ≤ A * M * (512 * W + u0))
    (hres : (A * u0 * b) % 512 = c % 512) :
    (A * M * (512 * W + u0) - c) % 512 = 0 := by
  have h1 : (A * M * (512 * W + u0)) % 512 = (A * u0 * b) % 512 := by
    have hcomm : A * M * (512 * W + u0) = A * (512 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (512 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (512 * W + u0)) % 512 = (A * u0) % 512 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 512, Nat.mul_assoc]
      omega
    have h3 : (M % 512) = (b % 512) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod512`, faza `3r + 3`, `5r + 14` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) DLA MAKRO-EROZJI DWU-ZEROWEJ (`-7`) W `5r + 14` KROKACH: -/
theorem two_zero_valley_mod512_resonance_step14 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    collatzIter (5 * r + 14) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 512 := by
  intro s U
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4)) % 64
  have ht : tFn s = (s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64 := rfl
  have h14 : 5 * r + 14 = 8 + (5 * r + 6) := by omega
  have hU : U = 2 * (256 * W + 3 + 4 * tFn s) + 1 := by omega
  rw [h14, collatzIter_add 8 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (256 * W + 3 + 4 * tFn s), ← hU]
  have h9_mod512 : (9 ^ (r + 1)) % 512 = 1 + 8 * s := by
    have h2 : r + 1 + 1 = r + 2 := by omega
    have h3 : r + 1 + 2 = r + 3 := by omega
    have h4 : r + 1 + 3 = r + 4 := by omega
    have h := pow9_mod512 (r + 1)
    rw [h2, h3, h4] at h
    exact h
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 512 * W + (7 + 8 * tFn s) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (512 * W + (7 + 8 * tFn s)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (512 * W + (7 + 8 * tFn s)) h9_pos
    omega
  have hres := checkResonanceTable_sound 512 1 7 7 tFn 64 (by decide) s (by omega)
  have hdiv512 : (9 ^ (r + 1) * U - 7) % 512 = 0 := by
    have h1 := mod512_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * tFn s) 7 (1 + 8 * s) h9_mod512 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (9 ^ (r + 1) * U - 7) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI REZONANSU `mod 512` RODZINY `-7` (`r = 0..51`, aż do `2^156`!): -/
theorem two_zero_valley_mod512_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 512 ≤ 512 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 14) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 14) n0 = (9 ^ (r + 1) * U - 7) / 512 :=
    two_zero_valley_mod512_resonance_step14 r W
  have hle : (9 ^ (r + 1) + 512) * U ≤ (512 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  have hX_ge : 519 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs1 : s = 1 := rfl
      have hU399 : U ≥ 399 := by omega
      have h9 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      have hU7 : U ≥ 7 := by omega
      have h81 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hmul := Nat.mul_le_mul_right U h81
      omega
  have hU_ge7 : U ≥ 7 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  have hlt : collatzIter (5 * r + 14) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 14) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 14) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod512`, faza `3r + 3`, `5r + 14` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) DLA MAKRO-EROZJI PRZESUNIĘTEJ (`-5`) W `5r + 14` KROKACH: -/
theorem shifted_valley_mod512_resonance_step14 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((3 * s + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    collatzIter (5 * r + 14) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 512 := by
  intro s U
  let tFn := fun x => (3 * x + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4)) % 64
  have ht : tFn s = (3 * s + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64 := rfl
  have h14 : 5 * r + 14 = 8 + (5 * r + 6) := by omega
  have hU : U = 2 * (256 * W + 2 + 4 * tFn s) + 1 := by omega
  rw [h14, collatzIter_add 8 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (256 * W + 2 + 4 * tFn s) (by omega), ← hU]
  have h9_mod512 : (9 ^ (r + 1)) % 512 = 1 + 8 * s := by
    have h2 : r + 1 + 1 = r + 2 := by omega
    have h3 : r + 1 + 2 = r + 3 := by omega
    have h4 : r + 1 + 3 = r + 4 := by omega
    have h := pow9_mod512 (r + 1)
    rw [h2, h3, h4] at h
    exact h
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 512 * W + (5 + 8 * tFn s) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (512 * W + (5 + 8 * tFn s)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (512 * W + (5 + 8 * tFn s)) h9_pos
    omega
  have hres := checkResonanceTable_sound 512 1 5 5 tFn 64 (by decide) s (by omega)
  have hdiv512 : (9 ^ (r + 1) * U - 5) % 512 = 0 := by
    have h1 := mod512_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * tFn s) 5 (1 + 8 * s) h9_mod512 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (9 ^ (r + 1) * U - 5) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI REZONANSU `mod 512` RODZINY `-5` (`r = 0..51`, aż do `2^156`!): -/
theorem shifted_valley_mod512_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 512 ≤ 512 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((3 * s + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 14) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 14) n0 = (9 ^ (r + 1) * U - 5) / 512 :=
    shifted_valley_mod512_resonance_step14 r W
  have hle : (9 ^ (r + 1) + 512) * U ≤ (512 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  have hX_ge : 517 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs1 : s = 1 := rfl
      have hU285 : U ≥ 285 := by omega
      have h9 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs10 : s = 10 := rfl
        have hU373 : U ≥ 373 := by omega
        have h81 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hU5 : U ≥ 5 := by omega
        have h729 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hmul := Nat.mul_le_mul_right U h729
        omega
  have hU_ge5 : U ≥ 5 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  have hlt : collatzIter (5 * r + 14) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 14) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 14) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod512`, `3r + 7`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) KASKADY RLE `-13` (`...10011₂`) W `5r + 20` KROKACH: -/
theorem rle_10011_mod512_resonance_step20 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 16 * ((r + 2) / 4) + 16 * ((r + 3) / 4) +
              32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8) + 32 * ((r + 5) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 512 := by
  intro s U
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4)) % 64
  have ht : tFn s = (s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64 := rfl
  have h20 : 5 * r + 20 = 8 + (5 * r + 12) := by omega
  have hU : U = 2 * (256 * W + 3 + 4 * tFn s) + 1 := by omega
  rw [h20, collatzIter_add 8 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (256 * W + 3 + 4 * tFn s), ← hU]
  have h9_mod512 : (9 ^ (r + 2)) % 512 = 1 + 8 * s := by
    have h2 : r + 2 + 1 = r + 3 := by omega
    have h3 : r + 2 + 2 = r + 4 := by omega
    have h4 : r + 2 + 3 = r + 5 := by omega
    have h := pow9_mod512 (r + 2)
    rw [h2, h3, h4] at h
    exact h
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 512 * W + (7 + 8 * tFn s) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (512 * W + (7 + 8 * tFn s)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (512 * W + (7 + 8 * tFn s)) h9_pos
    omega
  have hres := checkResonanceTable_sound 512 1 7 7 tFn 64 (by decide) s (by omega)
  have hdiv512 : (9 ^ (r + 2) * U - 7) % 512 = 0 := by
    have h1 := mod512_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * tFn s) 7 (1 + 8 * s) h9_mod512 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (9 ^ (r + 2) * U - 7) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI REZONANSU `mod 512` KASKADY RLE `-13` (`r = 0..56`, aż do `2^175`!): -/
theorem rle_10011_mod512_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 1024 ≤ 512 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 16 * ((r + 2) / 4) + 16 * ((r + 3) / 4) +
              32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8) + 32 * ((r + 5) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (9 ^ (r + 2) * U - 7) / 512 :=
    rle_10011_mod512_resonance_step20 r W
  have hle : (9 ^ (r + 2) + 1024) * U ≤ (512 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  have h81_ge : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hX_ge : 81 * U ≤ 9 ^ (r + 2) * U := Nat.mul_le_mul_right U h81_ge
  have hU_ge7 : U ≥ 7 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  have hlt : collatzIter (5 * r + 20) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod512`, `3r + 8`, `5r + 22` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) KASKADY RLE `-9` (`...10111₂`) W `5r + 22` KROKACH: -/
theorem rle_10111_mod512_resonance_step22 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((3 * s + 16 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    collatzIter (5 * r + 22) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 512 := by
  intro s U
  let tFn := fun x => (3 * x + 16 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4)) % 64
  have ht : tFn s = (3 * s + 16 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64 := rfl
  have h22 : 5 * r + 22 = 8 + (5 * r + 14) := by omega
  have hU : U = 2 * (256 * W + 2 + 4 * tFn s) + 1 := by omega
  rw [h22, collatzIter_add 8 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (256 * W + 2 + 4 * tFn s), ← hU]
  have h9_mod512 : (9 ^ (r + 1)) % 512 = 1 + 8 * s := by
    have h2 : r + 1 + 1 = r + 2 := by omega
    have h3 : r + 1 + 2 = r + 3 := by omega
    have h4 : r + 1 + 3 = r + 4 := by omega
    have h := pow9_mod512 (r + 1)
    rw [h2, h3, h4] at h
    exact h
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 512 * W + (5 + 8 * tFn s) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (512 * W + (5 + 8 * tFn s)) := by
    have h27 : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (512 * W + (5 + 8 * tFn s)) h27; omega
  have hres := checkResonanceTable_sound 512 27 5 7 tFn 64 (by decide) s (by omega)
  have hdiv512 : (27 * 9 ^ (r + 1) * U - 7) % 512 = 0 := by
    have h1 := mod512_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * tFn s) 7 (1 + 8 * s) h9_mod512 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (27 * 9 ^ (r + 1) * U - 7) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI REZONANSU `mod 512` KASKADY RLE `-9` (`r = 0..53`, aż do `2^167`!): -/
theorem rle_10111_mod512_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 1024 ≤ 512 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((3 * s + 16 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 22) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 22) n0 = (27 * 9 ^ (r + 1) * U - 7) / 512 :=
    rle_10111_mod512_resonance_step22 r W
  have hle : (27 * 9 ^ (r + 1) + 1024) * U ≤ (512 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  have h9_ge9 : 9 ≤ 9 ^ (r + 1) := by
    rw [Nat.pow_succ]
    have := pow9_pos r
    omega
  have h243 : 243 ≤ 27 * 9 ^ (r + 1) := by omega
  have hX_ge : 243 * U ≤ (27 * 9 ^ (r + 1)) * U := Nat.mul_le_mul_right U h243
  have hU_ge5 : U ≥ 5 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  have hlt : collatzIter (5 * r + 22) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 22) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 22) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod512`, `3r + 1`, `5r + 11` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) FAZY `d = 1` RODZINY `-5` W `5r + 11` KROKACH: -/
theorem shifted_valley_d1_mod512_resonance_step11 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 16 * (r / 4) + 16 * ((r + 1) / 4) +
              32 * (r / 8) + 32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((27 * s + 21 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    collatzIter (5 * r + 11) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 512 := by
  intro s U
  let tFn := fun x => (27 * x + 21 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4)) % 64
  have ht : tFn s = (27 * s + 21 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64 := rfl
  have h11 : 5 * r + 11 = 8 + (5 * r + 3) := by omega
  have hU : U = 2 * (256 * W + 2 + 4 * tFn s) + 1 := by omega
  rw [h11, collatzIter_add 8 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (256 * W + 2 + 4 * tFn s) (by omega), ← hU]
  have h9_mod512 : (9 ^ r) % 512 = 1 + 8 * s := pow9_mod512 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 512 * W + (5 + 8 * tFn s) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (512 * W + (5 + 8 * tFn s)) := by
    have h3 : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (512 * W + (5 + 8 * tFn s)) h3; omega
  have hres := checkResonanceTable_sound 512 3 5 7 tFn 64 (by decide) s (by omega)
  have hdiv512 : (3 * 9 ^ r * U - 7) % 512 = 0 := by
    have h1 := mod512_linear_inverse 3 (9 ^ r) W (5 + 8 * tFn s) 7 (1 + 8 * s) h9_mod512 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (3 * 9 ^ r * U - 7) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI `mod 512` FAZY `d = 1` RODZINY `-5` (`r = 0..49`, aż do `2^148`!): -/
theorem shifted_valley_d1_mod512_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 512 ≤ 512 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 16 * (r / 4) + 16 * ((r + 1) / 4) +
              32 * (r / 8) + 32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((27 * s + 21 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 11) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 11) n0 = (3 * 9 ^ r * U - 7) / 512 :=
    shifted_valley_d1_mod512_resonance_step11 r W
  have hle : (3 * 9 ^ r + 512) * U ≤ (512 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  have hX_ge : 519 ≤ 3 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have hU173 : U ≥ 173 := by omega
      have h3 : 3 * 9 ^ 0 * U = 3 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have hU133 : U ≥ 133 := by omega
        have h27 : 3 * 9 ^ 1 * U = 27 * U := rfl
        omega
      | succ r'' =>
        have hU5 : U ≥ 5 := by omega
        have h81 : 81 ≤ 9 ^ (r'' + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have h243 : 243 ≤ 3 * 9 ^ (r'' + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U h243
        omega
  have hU_ge5 : U ≥ 5 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  have hlt : collatzIter (5 * r + 11) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 11) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 11) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod512`, `3r + 5`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) FAZY `d = 5` RODZINY `-7` W `5r + 17` KROKACH: -/
theorem two_zero_valley_d5_mod512_resonance_step17 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((17 * s + 42 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 512 := by
  intro s U
  let tFn := fun x => (17 * x + 42 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4)) % 64
  have ht : tFn s = (17 * s + 42 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64 := rfl
  have h17 : 5 * r + 17 = 8 + (5 * r + 9) := by omega
  have hU : U = 2 * (256 * W + 3 + 4 * tFn s) + 1 := by omega
  rw [h17, collatzIter_add 8 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (256 * W + 3 + 4 * tFn s), ← hU]
  have h9_mod512 : (9 ^ (r + 1)) % 512 = 1 + 8 * s := by
    have h2 : r + 1 + 1 = r + 2 := by omega
    have h3 : r + 1 + 2 = r + 3 := by omega
    have h4 : r + 1 + 3 = r + 4 := by omega
    have h := pow9_mod512 (r + 1)
    rw [h2, h3, h4] at h
    exact h
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 512 * W + (7 + 8 * tFn s) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (512 * W + (7 + 8 * tFn s)) := by
    have h3 : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (512 * W + (7 + 8 * tFn s)) h3; omega
  have hres := checkResonanceTable_sound 512 3 7 5 tFn 64 (by decide) s (by omega)
  have hdiv512 : (3 * 9 ^ (r + 1) * U - 5) % 512 = 0 := by
    have h1 := mod512_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * tFn s) 5 (1 + 8 * s) h9_mod512 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (3 * 9 ^ (r + 1) * U - 5) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI `mod 512` FAZY `d = 5` RODZINY `-7` (`r = 0..54`, aż do `2^167`!): -/
theorem two_zero_valley_d5_mod512_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 512 ≤ 512 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 16 * ((r + 1) / 4) + 16 * ((r + 2) / 4) +
              32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((17 * s + 42 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (3 * 9 ^ (r + 1) * U - 5) / 512 :=
    two_zero_valley_d5_mod512_resonance_step17 r W
  have hle : (3 * 9 ^ (r + 1) + 512) * U ≤ (512 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  have hX_ge : 517 ≤ 3 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs1 : s = 1 := rfl
      have hU95 : U ≥ 95 := by omega
      have h27 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      omega
    | succ r' =>
      have hU7 : U ≥ 7 := by omega
      have h81 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have h243 : 243 ≤ 3 * 9 ^ (r' + 1 + 1) := by omega
      have hmul := Nat.mul_le_mul_right U h243
      omega
  have hU_ge7 : U ≥ 7 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  have hlt : collatzIter (5 * r + 17) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod512`, `3r + 4`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) FAZY `d = 4` RODZINY `-7` W `5r + 17` KROKACH: -/
theorem two_zero_valley_d4_mod512_resonance_step17 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 16 * ((r + 2) / 4) + 16 * ((r + 3) / 4) +
              32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8) + 32 * ((r + 5) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((11 * s + 3 + 16 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 512 := by
  intro s U
  let tFn := fun x => (11 * x + 3 + 16 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4)) % 64
  have ht : tFn s = (11 * s + 3 + 16 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64 := rfl
  have h17 : 5 * r + 17 = 8 + (5 * r + 9) := by omega
  have hU : U = 2 * (256 * W + 2 + 4 * tFn s) + 1 := by omega
  rw [h17, collatzIter_add 8 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (256 * W + 2 + 4 * tFn s), ← hU]
  have h9_mod512 : (9 ^ (r + 2)) % 512 = 1 + 8 * s := by
    have h2 : r + 2 + 1 = r + 3 := by omega
    have h3 : r + 2 + 2 = r + 4 := by omega
    have h4 : r + 2 + 3 = r + 5 := by omega
    have h := pow9_mod512 (r + 2)
    rw [h2, h3, h4] at h
    exact h
  have h9_ge81 : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 512 * W + (5 + 8 * tFn s) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (512 * W + (5 + 8 * tFn s)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (512 * W + (5 + 8 * tFn s)) h9_ge81
    omega
  have hres := checkResonanceTable_sound 512 1 5 29 tFn 64 (by decide) s (by omega)
  have hdiv512 : (9 ^ (r + 2) * U - 29) % 512 = 0 := by
    have h1 := mod512_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * tFn s) 29 (1 + 8 * s) h9_mod512 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (9 ^ (r + 2) * U - 29) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI `mod 512` FAZY `d = 4` RODZINY `-7` (`r = 0..39`, aż do `2^121`!): -/
theorem two_zero_valley_d4_mod512_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 1024 ≤ 512 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 16 * ((r + 2) / 4) + 16 * ((r + 3) / 4) +
              32 * ((r + 2) / 8) + 32 * ((r + 3) / 8) + 32 * ((r + 4) / 8) + 32 * ((r + 5) / 8)) % 64
    let U := 512 * W + 5 + 8 * ((11 * s + 3 + 16 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (9 ^ (r + 2) * U - 29) / 512 :=
    two_zero_valley_d4_mod512_resonance_step17 r W
  have hle : (9 ^ (r + 2) + 1024) * U ≤ (512 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  have hX_ge : 541 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs10 : s = 10 := rfl
      have hU13 : U ≥ 13 := by omega
      have h81 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hU5 : U ≥ 5 := by omega
      have h729 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hmul := Nat.mul_le_mul_right U h729
      omega
  have hU_ge5 : U ≥ 5 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  have hlt : collatzIter (5 * r + 17) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod512`, `3r + 2`, `5r + 14` kroków)
-- -----------------------------------------------------------------------------
/-- TWIERDZENIE O REZONANSIE `mod 512` (`v₂ ≥ 9`) FAZY `d = 2` RODZINY `-5` W `5r + 14` KROKACH: -/
theorem shifted_valley_d2_mod512_resonance_step14 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 16 * (r / 4) + 16 * ((r + 1) / 4) +
              32 * (r / 8) + 32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 4 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    collatzIter (5 * r + 14) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 512 := by
  intro s U
  let tFn := fun x => (x + 4 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4)) % 64
  have ht : tFn s = (s + 4 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64 := rfl
  have h14 : 5 * r + 14 = 8 + (5 * r + 6) := by omega
  have hU : U = 2 * (256 * W + 3 + 4 * tFn s) + 1 := by omega
  rw [h14, collatzIter_add 8 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (256 * W + 3 + 4 * tFn s) (by omega), ← hU]
  have h9_mod512 : (9 ^ r) % 512 = 1 + 8 * s := pow9_mod512 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 512 * W + (7 + 8 * tFn s) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (512 * W + (7 + 8 * tFn s)) := by
    have h27 : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (512 * W + (7 + 8 * tFn s)) h27; omega
  have hres := checkResonanceTable_sound 512 27 7 29 tFn 64 (by decide) s (by omega)
  have hdiv512 : (27 * 9 ^ r * U - 29) % 512 = 0 := by
    have h1 := mod512_linear_inverse 27 (9 ^ r) W (7 + 8 * tFn s) 29 (1 + 8 * s) h9_mod512 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step8_eq_div512 (27 * 9 ^ r * U - 29) hdiv512

/-- TWIERDZENIE O BEZWARUNKOWEJ KONTRAKCJI `mod 512` FAZY `d = 2` RODZINY `-5` (`r = 0..36`, aż do `2^110`!): -/
theorem shifted_valley_d2_mod512_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 512 ≤ 512 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 16 * (r / 4) + 16 * ((r + 1) / 4) +
              32 * (r / 8) + 32 * ((r + 1) / 8) + 32 * ((r + 2) / 8) + 32 * ((r + 3) / 8)) % 64
    let U := 512 * W + 7 + 8 * ((s + 4 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4)) % 64)
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 14) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 14) n0 = (27 * 9 ^ r * U - 29) / 512 :=
    shifted_valley_d2_mod512_resonance_step14 r W
  have hle : (27 * 9 ^ r + 512) * U ≤ (512 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 512 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  have hX_ge : 541 ≤ 27 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have hU39 : U ≥ 39 := by omega
      have h27 : 27 * 9 ^ 0 * U = 27 * U := rfl
      omega
    | succ r' =>
      have hU7 : U ≥ 7 := by omega
      have h9 : 9 ≤ 9 ^ (r' + 1) := by
        rw [Nat.pow_succ]
        have := pow9_pos r'
        omega
      have h243 : 243 ≤ 27 * 9 ^ (r' + 1) := by omega
      have hmul := Nat.mul_le_mul_right U h243
      omega
  have hU_ge7 : U ≥ 7 := by omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  have hlt : collatzIter (5 * r + 14) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 14) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 14) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 9. Komplet 50 twierdzeń `_drop_r...` dla wszystkich 8 rodzin na poziomie `mod 512`
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod512_drop_r46 (W : Nat) : HasHorizonDrop ((512 * W + 447) * 2 ^ 141 - 7) := (two_zero_valley_mod512_contraction 46 W (by decide)).2
theorem two_zero_valley_mod512_drop_r47 (W : Nat) : HasHorizonDrop ((512 * W + 391) * 2 ^ 144 - 7) := (two_zero_valley_mod512_contraction 47 W (by decide)).2
theorem two_zero_valley_mod512_drop_r48 (W : Nat) : HasHorizonDrop ((512 * W + 271) * 2 ^ 147 - 7) := (two_zero_valley_mod512_contraction 48 W (by decide)).2
theorem two_zero_valley_mod512_drop_r49 (W : Nat) : HasHorizonDrop ((512 * W + 87 ) * 2 ^ 150 - 7) := (two_zero_valley_mod512_contraction 49 W (by decide)).2
theorem two_zero_valley_mod512_drop_r50 (W : Nat) : HasHorizonDrop ((512 * W + 351) * 2 ^ 153 - 7) := (two_zero_valley_mod512_contraction 50 W (by decide)).2
theorem two_zero_valley_mod512_drop_r51 (W : Nat) : HasHorizonDrop ((512 * W + 39 ) * 2 ^ 156 - 7) := (two_zero_valley_mod512_contraction 51 W (by decide)).2

theorem shifted_valley_mod512_drop_r46 (W : Nat) : HasHorizonDrop ((512 * W + 173) * 2 ^ 141 - 5) := (shifted_valley_mod512_contraction 46 W (by decide)).2
theorem shifted_valley_mod512_drop_r47 (W : Nat) : HasHorizonDrop ((512 * W + 133) * 2 ^ 144 - 5) := (shifted_valley_mod512_contraction 47 W (by decide)).2
theorem shifted_valley_mod512_drop_r48 (W : Nat) : HasHorizonDrop ((512 * W + 413) * 2 ^ 147 - 5) := (shifted_valley_mod512_contraction 48 W (by decide)).2
theorem shifted_valley_mod512_drop_r49 (W : Nat) : HasHorizonDrop ((512 * W + 501) * 2 ^ 150 - 5) := (shifted_valley_mod512_contraction 49 W (by decide)).2
theorem shifted_valley_mod512_drop_r50 (W : Nat) : HasHorizonDrop ((512 * W + 397) * 2 ^ 153 - 5) := (shifted_valley_mod512_contraction 50 W (by decide)).2
theorem shifted_valley_mod512_drop_r51 (W : Nat) : HasHorizonDrop ((512 * W + 101) * 2 ^ 156 - 5) := (shifted_valley_mod512_contraction 51 W (by decide)).2

theorem rle_10011_mod512_drop_r51 (W : Nat) : HasHorizonDrop ((512 * W + 175) * 2 ^ 160 - 13) := (rle_10011_mod512_contraction 51 W (by decide)).2
theorem rle_10011_mod512_drop_r52 (W : Nat) : HasHorizonDrop ((512 * W + 247) * 2 ^ 163 - 13) := (rle_10011_mod512_contraction 52 W (by decide)).2
theorem rle_10011_mod512_drop_r53 (W : Nat) : HasHorizonDrop ((512 * W + 255) * 2 ^ 166 - 13) := (rle_10011_mod512_contraction 53 W (by decide)).2
theorem rle_10011_mod512_drop_r54 (W : Nat) : HasHorizonDrop ((512 * W + 199) * 2 ^ 169 - 13) := (rle_10011_mod512_contraction 54 W (by decide)).2
theorem rle_10011_mod512_drop_r55 (W : Nat) : HasHorizonDrop ((512 * W + 79 ) * 2 ^ 172 - 13) := (rle_10011_mod512_contraction 55 W (by decide)).2
theorem rle_10011_mod512_drop_r56 (W : Nat) : HasHorizonDrop ((512 * W + 407) * 2 ^ 175 - 13) := (rle_10011_mod512_contraction 56 W (by decide)).2

theorem rle_10111_mod512_drop_r48 (W : Nat) : HasHorizonDrop ((512 * W + 29 ) * 2 ^ 152 - 9) := (rle_10111_mod512_contraction 48 W (by decide)).2
theorem rle_10111_mod512_drop_r49 (W : Nat) : HasHorizonDrop ((512 * W + 117) * 2 ^ 155 - 9) := (rle_10111_mod512_contraction 49 W (by decide)).2
theorem rle_10111_mod512_drop_r50 (W : Nat) : HasHorizonDrop ((512 * W + 13 ) * 2 ^ 158 - 9) := (rle_10111_mod512_contraction 50 W (by decide)).2
theorem rle_10111_mod512_drop_r51 (W : Nat) : HasHorizonDrop ((512 * W + 229) * 2 ^ 161 - 9) := (rle_10111_mod512_contraction 51 W (by decide)).2
theorem rle_10111_mod512_drop_r52 (W : Nat) : HasHorizonDrop ((512 * W + 253) * 2 ^ 164 - 9) := (rle_10111_mod512_contraction 52 W (by decide)).2
theorem rle_10111_mod512_drop_r53 (W : Nat) : HasHorizonDrop ((512 * W + 85 ) * 2 ^ 167 - 9) := (rle_10111_mod512_contraction 53 W (by decide)).2

theorem shifted_valley_d1_mod512_drop_r44 (W : Nat) : HasHorizonDrop ((512 * W + 77 ) * 2 ^ 133 - 5) := (shifted_valley_d1_mod512_contraction 44 W (by decide)).2
theorem shifted_valley_d1_mod512_drop_r45 (W : Nat) : HasHorizonDrop ((512 * W + 293) * 2 ^ 136 - 5) := (shifted_valley_d1_mod512_contraction 45 W (by decide)).2
theorem shifted_valley_d1_mod512_drop_r46 (W : Nat) : HasHorizonDrop ((512 * W + 317) * 2 ^ 139 - 5) := (shifted_valley_d1_mod512_contraction 46 W (by decide)).2
theorem shifted_valley_d1_mod512_drop_r47 (W : Nat) : HasHorizonDrop ((512 * W + 149) * 2 ^ 142 - 5) := (shifted_valley_d1_mod512_contraction 47 W (by decide)).2
theorem shifted_valley_d1_mod512_drop_r48 (W : Nat) : HasHorizonDrop ((512 * W + 301) * 2 ^ 145 - 5) := (shifted_valley_d1_mod512_contraction 48 W (by decide)).2
theorem shifted_valley_d1_mod512_drop_r49 (W : Nat) : HasHorizonDrop ((512 * W + 261) * 2 ^ 148 - 5) := (shifted_valley_d1_mod512_contraction 49 W (by decide)).2

theorem two_zero_valley_d5_mod512_drop_r48 (W : Nat) : HasHorizonDrop ((512 * W + 479) * 2 ^ 149 - 7) := (two_zero_valley_d5_mod512_contraction 48 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r49 (W : Nat) : HasHorizonDrop ((512 * W + 167) * 2 ^ 152 - 7) := (two_zero_valley_d5_mod512_contraction 49 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r50 (W : Nat) : HasHorizonDrop ((512 * W + 303) * 2 ^ 155 - 7) := (two_zero_valley_d5_mod512_contraction 50 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r51 (W : Nat) : HasHorizonDrop ((512 * W + 375) * 2 ^ 158 - 7) := (two_zero_valley_d5_mod512_contraction 51 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r52 (W : Nat) : HasHorizonDrop ((512 * W + 383) * 2 ^ 161 - 7) := (two_zero_valley_d5_mod512_contraction 52 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r53 (W : Nat) : HasHorizonDrop ((512 * W + 327) * 2 ^ 164 - 7) := (two_zero_valley_d5_mod512_contraction 53 W (by decide)).2
theorem two_zero_valley_d5_mod512_drop_r54 (W : Nat) : HasHorizonDrop ((512 * W + 207) * 2 ^ 167 - 7) := (two_zero_valley_d5_mod512_contraction 54 W (by decide)).2

theorem two_zero_valley_d4_mod512_drop_r34 (W : Nat) : HasHorizonDrop ((512 * W + 509) * 2 ^ 106 - 7) := (two_zero_valley_d4_mod512_contraction 34 W (by decide)).2
theorem two_zero_valley_d4_mod512_drop_r35 (W : Nat) : HasHorizonDrop ((512 * W + 341) * 2 ^ 109 - 7) := (two_zero_valley_d4_mod512_contraction 35 W (by decide)).2
theorem two_zero_valley_d4_mod512_drop_r36 (W : Nat) : HasHorizonDrop ((512 * W + 493) * 2 ^ 112 - 7) := (two_zero_valley_d4_mod512_contraction 36 W (by decide)).2
theorem two_zero_valley_d4_mod512_drop_r37 (W : Nat) : HasHorizonDrop ((512 * W + 453) * 2 ^ 115 - 7) := (two_zero_valley_d4_mod512_contraction 37 W (by decide)).2
theorem two_zero_valley_d4_mod512_drop_r38 (W : Nat) : HasHorizonDrop ((512 * W + 221) * 2 ^ 118 - 7) := (two_zero_valley_d4_mod512_contraction 38 W (by decide)).2
theorem two_zero_valley_d4_mod512_drop_r39 (W : Nat) : HasHorizonDrop ((512 * W + 309) * 2 ^ 121 - 7) := (two_zero_valley_d4_mod512_contraction 39 W (by decide)).2

theorem shifted_valley_d2_mod512_drop_r30 (W : Nat) : HasHorizonDrop ((512 * W + 343) * 2 ^ 92  - 5) := (shifted_valley_d2_mod512_contraction 30 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r31 (W : Nat) : HasHorizonDrop ((512 * W + 95 ) * 2 ^ 95  - 5) := (shifted_valley_d2_mod512_contraction 31 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r32 (W : Nat) : HasHorizonDrop ((512 * W + 295) * 2 ^ 98  - 5) := (shifted_valley_d2_mod512_contraction 32 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r33 (W : Nat) : HasHorizonDrop ((512 * W + 431) * 2 ^ 101 - 5) := (shifted_valley_d2_mod512_contraction 33 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r34 (W : Nat) : HasHorizonDrop ((512 * W + 503) * 2 ^ 104 - 5) := (shifted_valley_d2_mod512_contraction 34 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r35 (W : Nat) : HasHorizonDrop ((512 * W + 511) * 2 ^ 107 - 5) := (shifted_valley_d2_mod512_contraction 35 W (by decide)).2
theorem shifted_valley_d2_mod512_drop_r36 (W : Nat) : HasHorizonDrop ((512 * W + 455) * 2 ^ 110 - 5) := (shifted_valley_d2_mod512_contraction 36 W (by decide)).2
```

---

# Raport Rundy 3 — Architekt 3 (`mod 1024`, `v₂ ≥ 10`, okres 128 dla WSZYSTKICH 8 rodzin)

## 1. Podsumowanie Wykonawcze Rundy 3 (`mod 1024`, `v₂ ≥ 10`, aż do `r = 62`, `2^193`!)

W Rundzie 3 wyprowadziłem, zweryfikowałem w `node -e` (pełna symulacja trajektorii Collatza dla wszystkich $r = 0..70, W = 0..2$ oraz weryfikacja tablicy dla $s = 0..127$) i przetestowałem w `~/.elan/bin/lean` (**0 błędów, 0 ostrzeżeń, `0 sorryAx`, domyślny `maxHeartbeats 200000` bez ani jednego `set_option maxHeartbeats`**) kompletny pakiet **72 twierdzeń `mod 1024` (`v₂ ≥ 10`)**:
- 6 twierdzeń podnośnika potęg dziewiątki `mod 1024` (`pow9_mod1024_compact`, `sum8_div16_mod128`, `sum4_div8_mod128`, `pow9_mod1024`, `pow9_mod1024_succ`, `pow9_mod1024_succ2`),
- 2 lematy infrastrukturalne (`div2_step9_eq_div1024`, `mod1024_linear_inverse`),
- 16 głównych twierdzeń parametrycznych (8 par `_mod1024_resonance_step...` + `_mod1024_contraction` dla wszystkich 8 rodzin RLE i faz Modulo-3),
- 48 konkretnych twierdzeń horyzontowych `_mod1024_drop_r...` (po 6 najwyższych rzędów na rodzinę, sięgających aż do **`r = 62` (`2^193`, `331` kroków Collatza!)** dla `rle_10011`).

## 2. Dwa kluczowe odkrycia konstrukcyjne Rundy 3

### Odkrycie A: Most Biliniowy dla `pow9_mod1024` (redukcja z >200 000 do <15 000 heartbeats!)
Bezpośredni 16-gałęziowy dowód indukcyjny dla pełnego 15-członowego rozwinięcia Presburgera:
$$s_{1024}(k) = \left(k + 8\lfloor k/2\rfloor + 80\lfloor k/4\rfloor + 80\lfloor(k+1)/4\rfloor + 32\sum_{j=0}^3 \lfloor(k+j)/8\rfloor + 64\sum_{j=0}^7 \lfloor(k+j)/16\rfloor\right) \bmod 128$$
przekracza limit `200 000` heartbeats w `omega` na etapie `whnf`, ponieważ krok $k \to k+1$ generuje jednocześnie 30 zmiennych dzielenia całkowitego o NWW równym 16.
Odkryłem jednak, że zachodzi dokładna tożsamość biliniowa modulo 128:
1. Suma ośmiu członów $\lfloor(k+j)/16\rfloor$ pomnożona przez $64$ redukuje się modulo 128 do pojedynczego członu parzystości (`sum8_div16_mod128`):
   $$64 \sum_{j=0}^7 \lfloor(k+j)/16\rfloor \equiv 64 \cdot (k \bmod 2) \cdot \lfloor k/8 \rfloor \pmod{128}.$$
2. Z kolei suma czterech członów $\lfloor(k+j)/8\rfloor$ pomnożona przez $32$ wraz z powyższym członem redukuje się modulo 128 do pojedynczego członu modulo 4 (`sum4_div8_mod128`):
   $$32 \sum_{j=0}^3 \lfloor(k+j)/8\rfloor + 64 (k \bmod 2)\lfloor k/8 \rfloor \equiv 32 \cdot (k \bmod 4) \cdot \lfloor k/4 \rfloor \pmod{128}.$$
3. Dzięki temu najpierw dowodzimy w 4 gałęziach (`k % 4 = 0..3`) ultra-zwartego twierdzenia `pow9_mod1024_compact` (w czasie $< 0.1\text{ s}$!), a następnie w 5 linijkach przez `generalize` + `omega` wyprowadzamy pełne 15-członowe `pow9_mod1024` oraz gotowe lematy przesunięte `pow9_mod1024_succ` ($r+1$) i `pow9_mod1024_succ2` ($r+2$)!

### Odkrycie B: Uniwersalne 4-punktowe podniesienie $t_{512}(s) \to t_{1024}(s)$ oraz izolacja `generalize hT : tFn s = t`
Dla każdej z 8 rodzin różnica $\Delta(s) = (t_{1024}(s) - t_{512}(s)) \bmod 128 \in \{0, 64\}$ ma okres **8** względem $s$ i wymaga dodania dokładnie **4 członów postaci `64 * ((s + j) / 8)`** (oraz przesunięcia wyrazu wolnego o $+64$ dla `rle_10111` i `shifted_valley_d1`):
- **`two_zero_valley`** oraz **`rle_10011`**: $j \in \{4, 5, 6, 7\}$,
- **`shifted_valley`**, **`rle_10111`** ($+64$) oraz **`shifted_valley_d1`** ($+64$): $j \in \{1, 2, 4, 7\}$,
- **`two_zero_valley_d5`**: $j \in \{2, 3, 4, 5\}$,
- **`two_zero_valley_d4`**: $j \in \{1, 3, 4, 6\}$,
- **`shifted_valley_d2`**: $j \in \{0, 1, 6, 7\}$.

Ponadto zastosowanie wzorca:
```lean
  let tFn := fun x => (...) % 128
  have hU_def : U = 1024 * W + uBase + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
```
całkowicie ukrywa definicje `s` i `U` przed taktyką `omega`, dzięki czemu wszystkie 16 twierdzeń rezonansowych i kontrakcyjnych kompiluje się w ułamku sekundy!

## 3. Zbiorcza Tabela Wszystkich 8 Rodzin na Poziomie `mod 1024` (`v₂ ≥ 10`, okres 128)

| # | Rodzina | Licznik $\equiv 0 \pmod{1024}$ | Indeks $s$ | Wzór na $t(s) \bmod 128$ (gdzie $U = 1024W + u_{\text{base}} + 8t(s)$) | Kroki | Pułap $r_{\max}$ (`mod 1024`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1}U - 7$ | $s_{1024}(r+1)$ | $(s + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor + 64\sum_{j \in \{4,5,6,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+15$ | **`r = 57`** ($2^{174}$, $300$ kr.) | `r52..r57` (`u0 = 687, 759, 767, 199, 591, 407`) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1}U - 5$ | $s_{1024}(r+1)$ | $(3s + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor + 64\sum_{j \in \{1,2,4,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+15$ | **`r = 57`** ($2^{174}$, $300$ kr.) | `r52..r57` (`u0 = 637, 981, 109, 581, 861, 437`) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2}U - 7$ | $s_{1024}(r+2)$ | $(s + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor + 64\sum_{j \in \{4,5,6,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+21$ | **`r = 62`** ($2^{193}$, $331$ kr.!) | `r57..r62` (`u0 = 159, 359, 495, 55, 575, 519`) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27\cdot 9^{r+1}U - 7$ | $s_{1024}(r+1)$ | $(3s + 80 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor + 64\sum_{j \in \{1,2,4,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+23$ | **`r = 59`** ($2^{185}$, $318$ kr.) | `r54..r59` (`u0 = 749, 197, 477, 53, 461, 165`) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3\cdot 9^r U - 7$ | $s_{1024}(r)$ | $(27s + 85 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s+2}{4}\rfloor + 32\lfloor\frac{s+3}{4}\rfloor + 64\sum_{j \in \{1,2,4,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+12$ | **`r = 55`** ($2^{166}$, $287$ kr.) | `r50..r55` (`u0 = 29, 117, 13, 229, 253, 597`) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3\cdot 9^{r+1}U - 5$ | $s_{1024}(r+1)$ | $(17s + 42 + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor + 64\sum_{j \in \{2,3,4,5\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+18$ | **`r = 60`** ($2^{185}$, $318$ kr.) | `r55..r60` (`u0 = 535, 287, 487, 623, 183, 703`) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2}U - 29$ | $s_{1024}(r+2)$ | $(11s + 3 + 16\lfloor\frac{s}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor + 64\sum_{j \in \{1,3,4,6\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+18$ | **`r = 45`** ($2^{139}$, $243$ kr.) | `r40..r45` (`u0 = 205, 933, 445, 277, 941, 901`) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27\cdot 9^r U - 29$ | $s_{1024}(r)$ | $(s + 4 + 16\lfloor\frac{s+1}{2}\rfloor + 32\lfloor\frac{s}{4}\rfloor + 32\lfloor\frac{s+1}{4}\rfloor + 64\sum_{j \in \{0,1,6,7\}}\lfloor\frac{s+j}{8}\rfloor) \bmod 128$ | $5r+15$ | **`r = 42`** ($2^{128}$, $225$ kr.) | `r37..r42` (`u0 = 847, 663, 415, 615, 751, 311`) |

## 4. Gotowy, Zweryfikowany w `~/.elan/bin/lean` Blok Kodu Lean 4 (72 Twierdzenia `mod 1024`, `0 sorryAx`)

```lean
-- INFRASTRUKTURA BAZOWA mod 1024 (v₂ ≥ 10, okres 128)
-- =============================================================================

theorem pow9_mod1024_compact (k : Nat) :
    (9 ^ k) % 1024 = 1 + 8 * ((k + 8 * (k / 2) + 80 * (k / 4) + 80 * ((k + 1) / 4) +
      32 * (k % 4) * (k / 4)) % 128) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    have hp : k % 4 = 0 ∨ k % 4 = 1 ∨ k % 4 = 2 ∨ k % 4 = 3 := by omega
    rcases hp with h0 | h1 | h2 | h3
    · have h0' : (k + 1) % 4 = 1 := by omega
      rw [h0, h0']; omega
    · have h1' : (k + 1) % 4 = 2 := by omega
      rw [h1, h1']; omega
    · have h2' : (k + 1) % 4 = 3 := by omega
      rw [h2, h2']; omega
    · have h3' : (k + 1) % 4 = 0 := by omega
      rw [h3, h3']; omega

theorem sum8_div16_mod128 (k : Nat) :
    (64 * ((k / 16) + ((k + 1) / 16) + ((k + 2) / 16) + ((k + 3) / 16) +
           ((k + 4) / 16) + ((k + 5) / 16) + ((k + 6) / 16) + ((k + 7) / 16))) % 128 =
    (64 * (k % 2) * (k / 8)) % 128 := by
  have hp : k % 2 = 0 ∨ k % 2 = 1 := by omega
  rcases hp with h0 | h1
  · rw [h0]; omega
  · rw [h1]; omega

theorem sum4_div8_mod128 (k : Nat) :
    (32 * ((k / 8) + ((k + 1) / 8) + ((k + 2) / 8) + ((k + 3) / 8)) +
      64 * (k % 2) * (k / 8)) % 128 =
    (32 * (k % 4) * (k / 4)) % 128 := by
  have hp : k % 8 = 0 ∨ k % 8 = 1 ∨ k % 8 = 2 ∨ k % 8 = 3 ∨
            k % 8 = 4 ∨ k % 8 = 5 ∨ k % 8 = 6 ∨ k % 8 = 7 := by omega
  rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7
  · have ha : k % 2 = 0 := by omega
    have hb : k % 4 = 0 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 1 := by omega
    have hb : k % 4 = 1 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 0 := by omega
    have hb : k % 4 = 2 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 1 := by omega
    have hb : k % 4 = 3 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 0 := by omega
    have hb : k % 4 = 0 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 1 := by omega
    have hb : k % 4 = 1 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 0 := by omega
    have hb : k % 4 = 2 := by omega
    rw [ha, hb]; omega
  · have ha : k % 2 = 1 := by omega
    have hb : k % 4 = 3 := by omega
    rw [ha, hb]; omega

theorem pow9_mod1024 (k : Nat) :
    (9 ^ k) % 1024 = 1 + 8 * ((k + 8 * (k / 2) + 80 * (k / 4) + 80 * ((k + 1) / 4) +
      32 * ((k / 8) + ((k + 1) / 8) + ((k + 2) / 8) + ((k + 3) / 8)) +
      64 * ((k / 16) + ((k + 1) / 16) + ((k + 2) / 16) + ((k + 3) / 16) +
            ((k + 4) / 16) + ((k + 5) / 16) + ((k + 6) / 16) + ((k + 7) / 16))) % 128) := by
  rw [pow9_mod1024_compact k]
  congr 2
  generalize hA : k + 8 * (k / 2) + 80 * (k / 4) + 80 * ((k + 1) / 4) = A
  generalize hB : 32 * ((k / 8) + ((k + 1) / 8) + ((k + 2) / 8) + ((k + 3) / 8)) = B
  generalize hC : 64 * ((k / 16) + ((k + 1) / 16) + ((k + 2) / 16) + ((k + 3) / 16) +
                        ((k + 4) / 16) + ((k + 5) / 16) + ((k + 6) / 16) + ((k + 7) / 16)) = C
  generalize hD : 64 * (k % 2) * (k / 8) = D
  generalize hE : 32 * (k % 4) * (k / 4) = E
  have h1 : C % 128 = D % 128 := by rw [← hC, ← hD]; exact sum8_div16_mod128 k
  have h2 : (B + D) % 128 = E % 128 := by rw [← hB, ← hD, ← hE]; exact sum4_div8_mod128 k
  omega

theorem pow9_mod1024_succ (r : Nat) :
    (9 ^ (r + 1)) % 1024 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
      32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
      64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
            ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h3 : r + 1 + 2 = r + 3 := by omega
  have h4 : r + 1 + 3 = r + 4 := by omega
  have h5 : r + 1 + 4 = r + 5 := by omega
  have h6 : r + 1 + 5 = r + 6 := by omega
  have h7 : r + 1 + 6 = r + 7 := by omega
  have h8 : r + 1 + 7 = r + 8 := by omega
  have h := pow9_mod1024 (r + 1)
  rw [h2, h3, h4, h5, h6, h7, h8] at h
  exact h

theorem pow9_mod1024_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 1024 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
      32 * (((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8) + ((r + 5) / 8)) +
      64 * (((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) + ((r + 5) / 16) +
            ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16) + ((r + 9) / 16))) % 128) := by
  have h2 : r + 2 + 1 = r + 3 := by omega
  have h3 : r + 2 + 2 = r + 4 := by omega
  have h4 : r + 2 + 3 = r + 5 := by omega
  have h5 : r + 2 + 4 = r + 6 := by omega
  have h6 : r + 2 + 5 = r + 7 := by omega
  have h7 : r + 2 + 6 = r + 8 := by omega
  have h8 : r + 2 + 7 = r + 9 := by omega
  have h := pow9_mod1024 (r + 2)
  rw [h2, h3, h4, h5, h6, h7, h8] at h
  exact h

theorem div2_step9_eq_div1024 (N : Nat) (hN : N % 1024 = 0) :
    collatzIter 9 (N / 2) = N / 1024 := by
  have s1 : collatzStep (N / 2)   = N / 4    := by unfold collatzStep; split <;> omega
  have s2 : collatzStep (N / 4)   = N / 8    := by unfold collatzStep; split <;> omega
  have s3 : collatzStep (N / 8)   = N / 16   := by unfold collatzStep; split <;> omega
  have s4 : collatzStep (N / 16)  = N / 32   := by unfold collatzStep; split <;> omega
  have s5 : collatzStep (N / 32)  = N / 64   := by unfold collatzStep; split <;> omega
  have s6 : collatzStep (N / 64)  = N / 128  := by unfold collatzStep; split <;> omega
  have s7 : collatzStep (N / 128) = N / 256  := by unfold collatzStep; split <;> omega
  have s8 : collatzStep (N / 256) = N / 512  := by unfold collatzStep; split <;> omega
  have s9 : collatzStep (N / 512) = N / 1024 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2))))))))) = N / 1024
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9]

theorem mod1024_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 1024 = b)
    (hge : c ≤ A * M * (1024 * W + u0))
    (hres : (A * u0 * b) % 1024 = c % 1024) :
    (A * M * (1024 * W + u0) - c) % 1024 = 0 := by
  have h1 : (A * M * (1024 * W + u0)) % 1024 = (A * u0 * b) % 1024 := by
    have hcomm : A * M * (1024 * W + u0) = A * (1024 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (1024 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (1024 * W + u0)) % 1024 = (A * u0) % 1024 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 1024, Nat.mul_assoc]
      omega
    have h3 : (M % 1024) = (b % 1024) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod1024`, faza `3r + 3`, `5r + 15` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod1024_resonance_step15 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 4) / 8) + 64 * ((s + 5) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 15) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 1024 := by
  intro s U
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 4) / 8) + 64 * ((x + 5) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 15 = 9 + (5 * r + 6) := by omega
  have hU : U = 2 * (512 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (512 * W + 3 + 4 * t), ← hU]
  have h9_mod1024 : (9 ^ (r + 1)) % 1024 = 1 + 8 * s := pow9_mod1024_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 1024 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (1024 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (1024 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 1 7 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (9 ^ (r + 1) * U - 7) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod1024 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (9 ^ (r + 1) * U - 7) hdiv1024

theorem two_zero_valley_mod1024_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 1024 ≤ 1024 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 4) / 8) + 64 * ((s + 5) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 15) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 15) n0 = (9 ^ (r + 1) * U - 7) / 1024 :=
    two_zero_valley_mod1024_resonance_step15 r W
  have hle : (9 ^ (r + 1) + 1024) * U ≤ (1024 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 4) / 8) + 64 * ((x + 5) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1031 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 113 := by rw [hs0]
      have hU0 : U ≥ 911 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 26 := by rw [hs1]
        have hU1 : U ≥ 215 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  have hlt : collatzIter (5 * r + 15) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 15) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 15) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod1024`, faza `3r + 3`, `5r + 15` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod1024_resonance_step15 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((3 * s + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 15) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 1024 := by
  intro s U
  let tFn := fun x => (3 * x + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 15 = 9 + (5 * r + 6) := by omega
  have hU : U = 2 * (512 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (512 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod1024 : (9 ^ (r + 1)) % 1024 = 1 + 8 * s := pow9_mod1024_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 1024 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (1024 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (1024 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 1 5 5 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (9 ^ (r + 1) * U - 5) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod1024 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (9 ^ (r + 1) * U - 5) hdiv1024

theorem shifted_valley_mod1024_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 1024 ≤ 1024 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((3 * s + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 15) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 15) n0 = (9 ^ (r + 1) * U - 5) / 1024 :=
    shifted_valley_mod1024_resonance_step15 r W
  have hle : (9 ^ (r + 1) + 1024) * U ≤ (1024 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (3 * x + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1029 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 99 := by rw [hs0]
      have hU0 : U ≥ 797 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 110 := by rw [hs1]
        have hU1 : U ≥ 885 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  have hlt : collatzIter (5 * r + 15) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 15) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 15) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod1024`, `3r + 7`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod1024_resonance_step21 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
              32 * (((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8) + ((r + 5) / 8)) +
              64 * (((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) + ((r + 5) / 16) +
                    ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16) + ((r + 9) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 4) / 8) + 64 * ((s + 5) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 1024 := by
  intro s U
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 4) / 8) + 64 * ((x + 5) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 9 + (5 * r + 12) := by omega
  have hU : U = 2 * (512 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (512 * W + 3 + 4 * t), ← hU]
  have h9_mod1024 : (9 ^ (r + 2)) % 1024 = 1 + 8 * s := pow9_mod1024_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 1024 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (1024 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (1024 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 1 7 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (9 ^ (r + 2) * U - 7) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod1024 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (9 ^ (r + 2) * U - 7) hdiv1024

theorem rle_10011_mod1024_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 2048 ≤ 1024 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
              32 * (((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8) + ((r + 5) / 8)) +
              64 * (((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) + ((r + 5) / 16) +
                    ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16) + ((r + 9) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 16 * ((s + 1) / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 4) / 8) + 64 * ((s + 5) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (9 ^ (r + 2) * U - 7) / 1024 :=
    rle_10011_mod1024_resonance_step21 r W
  have hle : (9 ^ (r + 2) + 2048) * U ≤ (1024 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (x + 16 * ((x + 1) / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 4) / 8) + 64 * ((x + 5) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1031 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 26 := by rw [hs0]
      have hU0 : U ≥ 215 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 729 ≤ 9 ^ (r' + 1 + 2) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  have hlt : collatzIter (5 * r + 21) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod1024`, `3r + 8`, `5r + 23` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod1024_resonance_step23 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((3 * s + 80 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 23) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 1024 := by
  intro s U
  let tFn := fun x => (3 * x + 80 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 23 = 9 + (5 * r + 14) := by omega
  have hU : U = 2 * (512 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (512 * W + 2 + 4 * t), ← hU]
  have h9_mod1024 : (9 ^ (r + 1)) % 1024 = 1 + 8 * s := pow9_mod1024_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 1024 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (1024 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (1024 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 27 5 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (27 * 9 ^ (r + 1) * U - 7) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod1024 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (27 * 9 ^ (r + 1) * U - 7) hdiv1024

theorem rle_10111_mod1024_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 2048 ≤ 1024 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((3 * s + 80 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 23) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 23) n0 = (27 * 9 ^ (r + 1) * U - 7) / 1024 :=
    rle_10111_mod1024_resonance_step23 r W
  have hle : (27 * 9 ^ (r + 1) + 2048) * U ≤ (1024 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (3 * x + 80 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have h9_ge9 : 9 ≤ 9 ^ (r + 1) := by
    rw [Nat.pow_succ]
    have := pow9_pos r
    omega
  have h243 : 243 ≤ 27 * 9 ^ (r + 1) := by omega
  have hX_ge : 243 * U ≤ (27 * 9 ^ (r + 1)) * U := Nat.mul_le_mul_right U h243
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  have hlt : collatzIter (5 * r + 23) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 23) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 23) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod1024`, `3r + 1`, `5r + 12` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod1024_resonance_step12 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) +
              32 * ((r / 8) + ((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8)) +
              64 * ((r / 16) + ((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) +
                    ((r + 4) / 16) + ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((27 * s + 85 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 12) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 1024 := by
  intro s U
  let tFn := fun x => (27 * x + 85 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 12 = 9 + (5 * r + 3) := by omega
  have hU : U = 2 * (512 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (512 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod1024 : (9 ^ r) % 1024 = 1 + 8 * s := pow9_mod1024 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 1024 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (1024 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (1024 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 3 5 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (3 * 9 ^ r * U - 7) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod1024 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (3 * 9 ^ r * U - 7) hdiv1024

theorem shifted_valley_d1_mod1024_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 1024 ≤ 1024 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) +
              32 * ((r / 8) + ((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8)) +
              64 * ((r / 16) + ((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) +
                    ((r + 4) / 16) + ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((27 * s + 85 + 16 * (s / 2) + 32 * ((s + 2) / 4) + 32 * ((s + 3) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 2) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 12) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 12) n0 = (3 * 9 ^ r * U - 7) / 1024 :=
    shifted_valley_d1_mod1024_resonance_step12 r W
  have hle : (3 * 9 ^ r + 1024) * U ≤ (1024 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (27 * x + 85 + 16 * (x / 2) + 32 * ((x + 2) / 4) + 32 * ((x + 3) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 2) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1031 ≤ 3 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 85 := by rw [hs0]
      have hU0 : U ≥ 685 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ 0 * U = 3 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 80 := by rw [hs1]
        have hU1 : U ≥ 645 := by rw [ht1] at hU_def; omega
        have hpow1 : 3 * 9 ^ 1 * U = 27 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 81 ≤ 9 ^ (r'' + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 243 ≤ 3 * 9 ^ (r'' + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  have hlt : collatzIter (5 * r + 12) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 12) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 12) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod1024`, `3r + 5`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod1024_resonance_step18 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((17 * s + 42 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * ((s + 2) / 8) + 64 * ((s + 3) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 5) / 8)) % 128)
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 1024 := by
  intro s U
  let tFn := fun x => (17 * x + 42 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * ((x + 2) / 8) + 64 * ((x + 3) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 5) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 9 + (5 * r + 9) := by omega
  have hU : U = 2 * (512 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (512 * W + 3 + 4 * t), ← hU]
  have h9_mod1024 : (9 ^ (r + 1)) % 1024 = 1 + 8 * s := pow9_mod1024_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 1024 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (1024 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (1024 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 3 7 5 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (3 * 9 ^ (r + 1) * U - 5) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod1024 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (3 * 9 ^ (r + 1) * U - 5) hdiv1024

theorem two_zero_valley_d5_mod1024_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 1024 ≤ 1024 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
              32 * (((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8)) +
              64 * (((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) +
                    ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((17 * s + 42 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * ((s + 2) / 8) + 64 * ((s + 3) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 5) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (3 * 9 ^ (r + 1) * U - 5) / 1024 :=
    two_zero_valley_d5_mod1024_resonance_step18 r W
  have hle : (3 * 9 ^ (r + 1) + 1024) * U ≤ (1024 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (17 * x + 42 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * ((x + 2) / 8) + 64 * ((x + 3) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 5) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1029 ≤ 3 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 75 := by rw [hs0]
      have hU0 : U ≥ 607 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 243 ≤ 3 * 9 ^ (r' + 1 + 1) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  have hlt : collatzIter (5 * r + 18) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod1024`, `3r + 4`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod1024_resonance_step18 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
              32 * (((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8) + ((r + 5) / 8)) +
              64 * (((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) + ((r + 5) / 16) +
                    ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16) + ((r + 9) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((11 * s + 3 + 16 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 3) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 6) / 8)) % 128)
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 1024 := by
  intro s U
  let tFn := fun x => (11 * x + 3 + 16 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 3) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 6) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 9 + (5 * r + 9) := by omega
  have hU : U = 2 * (512 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (512 * W + 2 + 4 * t), ← hU]
  have h9_mod1024 : (9 ^ (r + 2)) % 1024 = 1 + 8 * s := pow9_mod1024_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 1024 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (1024 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (1024 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 1 5 29 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (9 ^ (r + 2) * U - 29) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod1024 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (9 ^ (r + 2) * U - 29) hdiv1024

theorem two_zero_valley_d4_mod1024_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 2048 ≤ 1024 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
              32 * (((r + 2) / 8) + ((r + 3) / 8) + ((r + 4) / 8) + ((r + 5) / 8)) +
              64 * (((r + 2) / 16) + ((r + 3) / 16) + ((r + 4) / 16) + ((r + 5) / 16) +
                    ((r + 6) / 16) + ((r + 7) / 16) + ((r + 8) / 16) + ((r + 9) / 16))) % 128
    let U := 1024 * W + 5 + 8 * ((11 * s + 3 + 16 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * ((s + 1) / 8) + 64 * ((s + 3) / 8) + 64 * ((s + 4) / 8) + 64 * ((s + 6) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (9 ^ (r + 2) * U - 29) / 1024 :=
    two_zero_valley_d4_mod1024_resonance_step18 r W
  have hle : (9 ^ (r + 2) + 2048) * U ≤ (1024 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (11 * x + 3 + 16 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * ((x + 1) / 8) + 64 * ((x + 3) / 8) + 64 * ((x + 4) / 8) + 64 * ((x + 6) / 8)) % 128
  have hU_def : U = 1024 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1053 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 1 := by rw [hs0]
      have hU0 : U ≥ 13 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 729 ≤ 9 ^ (r' + 1 + 2) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  have hlt : collatzIter (5 * r + 18) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod1024`, `3r + 2`, `5r + 15` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod1024_resonance_step15 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) +
              32 * ((r / 8) + ((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8)) +
              64 * ((r / 16) + ((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) +
                    ((r + 4) / 16) + ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 4 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * (s / 8) + 64 * ((s + 1) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    collatzIter (5 * r + 15) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 1024 := by
  intro s U
  let tFn := fun x => (x + 4 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * (x / 8) + 64 * ((x + 1) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 15 = 9 + (5 * r + 6) := by omega
  have hU : U = 2 * (512 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 9 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (512 * W + 3 + 4 * t) (by omega), ← hU]
  have h9_mod1024 : (9 ^ r) % 1024 = 1 + 8 * s := pow9_mod1024 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 1024 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (1024 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (1024 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 128 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceTable_sound 1024 27 7 29 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv1024 : (27 * 9 ^ r * U - 29) % 1024 = 0 := by
    have h1 := mod1024_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod1024 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step9_eq_div1024 (27 * 9 ^ r * U - 29) hdiv1024

theorem shifted_valley_d2_mod1024_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 1024 ≤ 1024 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) +
              32 * ((r / 8) + ((r + 1) / 8) + ((r + 2) / 8) + ((r + 3) / 8)) +
              64 * ((r / 16) + ((r + 1) / 16) + ((r + 2) / 16) + ((r + 3) / 16) +
                    ((r + 4) / 16) + ((r + 5) / 16) + ((r + 6) / 16) + ((r + 7) / 16))) % 128
    let U := 1024 * W + 7 + 8 * ((s + 4 + 16 * ((s + 1) / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) +
              64 * (s / 8) + 64 * ((s + 1) / 8) + 64 * ((s + 6) / 8) + 64 * ((s + 7) / 8)) % 128)
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 15) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 15) n0 = (27 * 9 ^ r * U - 29) / 1024 :=
    shifted_valley_d2_mod1024_resonance_step15 r W
  have hle : (27 * 9 ^ r + 1024) * U ≤ (1024 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 1024 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (x + 4 + 16 * ((x + 1) / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) +
              64 * (x / 8) + 64 * ((x + 1) / 8) + 64 * ((x + 6) / 8) + 64 * ((x + 7) / 8)) % 128
  have hU_def : U = 1024 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 1053 ≤ 27 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 4 := by rw [hs0]
      have hU0 : U ≥ 39 := by rw [ht0] at hU_def; omega
      have hpow0 : 27 * 9 ^ 0 * U = 27 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 9 ≤ 9 ^ (r' + 1) := by
        rw [Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 243 ≤ 27 * 9 ^ (r' + 1) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  have hlt : collatzIter (5 * r + 15) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 15) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 15) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 9. Komplet 48 twierdzeń _drop_r... dla wszystkich 8 rodzin na poziomie mod 1024
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod1024_drop_r52 (W : Nat) : HasHorizonDrop ((1024 * W + 687) * 2 ^ 159 - 7) := (two_zero_valley_mod1024_contraction 52 W (by decide)).2
theorem two_zero_valley_mod1024_drop_r53 (W : Nat) : HasHorizonDrop ((1024 * W + 759) * 2 ^ 162 - 7) := (two_zero_valley_mod1024_contraction 53 W (by decide)).2
theorem two_zero_valley_mod1024_drop_r54 (W : Nat) : HasHorizonDrop ((1024 * W + 767) * 2 ^ 165 - 7) := (two_zero_valley_mod1024_contraction 54 W (by decide)).2
theorem two_zero_valley_mod1024_drop_r55 (W : Nat) : HasHorizonDrop ((1024 * W + 199) * 2 ^ 168 - 7) := (two_zero_valley_mod1024_contraction 55 W (by decide)).2
theorem two_zero_valley_mod1024_drop_r56 (W : Nat) : HasHorizonDrop ((1024 * W + 591) * 2 ^ 171 - 7) := (two_zero_valley_mod1024_contraction 56 W (by decide)).2
theorem two_zero_valley_mod1024_drop_r57 (W : Nat) : HasHorizonDrop ((1024 * W + 407) * 2 ^ 174 - 7) := (two_zero_valley_mod1024_contraction 57 W (by decide)).2

theorem shifted_valley_mod1024_drop_r52 (W : Nat) : HasHorizonDrop ((1024 * W + 637) * 2 ^ 159 - 5) := (shifted_valley_mod1024_contraction 52 W (by decide)).2
theorem shifted_valley_mod1024_drop_r53 (W : Nat) : HasHorizonDrop ((1024 * W + 981) * 2 ^ 162 - 5) := (shifted_valley_mod1024_contraction 53 W (by decide)).2
theorem shifted_valley_mod1024_drop_r54 (W : Nat) : HasHorizonDrop ((1024 * W + 109) * 2 ^ 165 - 5) := (shifted_valley_mod1024_contraction 54 W (by decide)).2
theorem shifted_valley_mod1024_drop_r55 (W : Nat) : HasHorizonDrop ((1024 * W + 581) * 2 ^ 168 - 5) := (shifted_valley_mod1024_contraction 55 W (by decide)).2
theorem shifted_valley_mod1024_drop_r56 (W : Nat) : HasHorizonDrop ((1024 * W + 861) * 2 ^ 171 - 5) := (shifted_valley_mod1024_contraction 56 W (by decide)).2
theorem shifted_valley_mod1024_drop_r57 (W : Nat) : HasHorizonDrop ((1024 * W + 437) * 2 ^ 174 - 5) := (shifted_valley_mod1024_contraction 57 W (by decide)).2

theorem rle_10011_mod1024_drop_r57 (W : Nat) : HasHorizonDrop ((1024 * W + 159) * 2 ^ 178 - 13) := (rle_10011_mod1024_contraction 57 W (by decide)).2
theorem rle_10011_mod1024_drop_r58 (W : Nat) : HasHorizonDrop ((1024 * W + 359) * 2 ^ 181 - 13) := (rle_10011_mod1024_contraction 58 W (by decide)).2
theorem rle_10011_mod1024_drop_r59 (W : Nat) : HasHorizonDrop ((1024 * W + 495) * 2 ^ 184 - 13) := (rle_10011_mod1024_contraction 59 W (by decide)).2
theorem rle_10011_mod1024_drop_r60 (W : Nat) : HasHorizonDrop ((1024 * W + 55 ) * 2 ^ 187 - 13) := (rle_10011_mod1024_contraction 60 W (by decide)).2
theorem rle_10011_mod1024_drop_r61 (W : Nat) : HasHorizonDrop ((1024 * W + 575) * 2 ^ 190 - 13) := (rle_10011_mod1024_contraction 61 W (by decide)).2
theorem rle_10011_mod1024_drop_r62 (W : Nat) : HasHorizonDrop ((1024 * W + 519) * 2 ^ 193 - 13) := (rle_10011_mod1024_contraction 62 W (by decide)).2

theorem rle_10111_mod1024_drop_r54 (W : Nat) : HasHorizonDrop ((1024 * W + 749) * 2 ^ 170 - 9) := (rle_10111_mod1024_contraction 54 W (by decide)).2
theorem rle_10111_mod1024_drop_r55 (W : Nat) : HasHorizonDrop ((1024 * W + 197) * 2 ^ 173 - 9) := (rle_10111_mod1024_contraction 55 W (by decide)).2
theorem rle_10111_mod1024_drop_r56 (W : Nat) : HasHorizonDrop ((1024 * W + 477) * 2 ^ 176 - 9) := (rle_10111_mod1024_contraction 56 W (by decide)).2
theorem rle_10111_mod1024_drop_r57 (W : Nat) : HasHorizonDrop ((1024 * W + 53 ) * 2 ^ 179 - 9) := (rle_10111_mod1024_contraction 57 W (by decide)).2
theorem rle_10111_mod1024_drop_r58 (W : Nat) : HasHorizonDrop ((1024 * W + 461) * 2 ^ 182 - 9) := (rle_10111_mod1024_contraction 58 W (by decide)).2
theorem rle_10111_mod1024_drop_r59 (W : Nat) : HasHorizonDrop ((1024 * W + 165) * 2 ^ 185 - 9) := (rle_10111_mod1024_contraction 59 W (by decide)).2

theorem shifted_valley_d1_mod1024_drop_r50 (W : Nat) : HasHorizonDrop ((1024 * W + 29 ) * 2 ^ 151 - 5) := (shifted_valley_d1_mod1024_contraction 50 W (by decide)).2
theorem shifted_valley_d1_mod1024_drop_r51 (W : Nat) : HasHorizonDrop ((1024 * W + 117) * 2 ^ 154 - 5) := (shifted_valley_d1_mod1024_contraction 51 W (by decide)).2
theorem shifted_valley_d1_mod1024_drop_r52 (W : Nat) : HasHorizonDrop ((1024 * W + 13 ) * 2 ^ 157 - 5) := (shifted_valley_d1_mod1024_contraction 52 W (by decide)).2
theorem shifted_valley_d1_mod1024_drop_r53 (W : Nat) : HasHorizonDrop ((1024 * W + 229) * 2 ^ 160 - 5) := (shifted_valley_d1_mod1024_contraction 53 W (by decide)).2
theorem shifted_valley_d1_mod1024_drop_r54 (W : Nat) : HasHorizonDrop ((1024 * W + 253) * 2 ^ 163 - 5) := (shifted_valley_d1_mod1024_contraction 54 W (by decide)).2
theorem shifted_valley_d1_mod1024_drop_r55 (W : Nat) : HasHorizonDrop ((1024 * W + 597) * 2 ^ 166 - 5) := (shifted_valley_d1_mod1024_contraction 55 W (by decide)).2

theorem two_zero_valley_d5_mod1024_drop_r55 (W : Nat) : HasHorizonDrop ((1024 * W + 535) * 2 ^ 170 - 7) := (two_zero_valley_d5_mod1024_contraction 55 W (by decide)).2
theorem two_zero_valley_d5_mod1024_drop_r56 (W : Nat) : HasHorizonDrop ((1024 * W + 287) * 2 ^ 173 - 7) := (two_zero_valley_d5_mod1024_contraction 56 W (by decide)).2
theorem two_zero_valley_d5_mod1024_drop_r57 (W : Nat) : HasHorizonDrop ((1024 * W + 487) * 2 ^ 176 - 7) := (two_zero_valley_d5_mod1024_contraction 57 W (by decide)).2
theorem two_zero_valley_d5_mod1024_drop_r58 (W : Nat) : HasHorizonDrop ((1024 * W + 623) * 2 ^ 179 - 7) := (two_zero_valley_d5_mod1024_contraction 58 W (by decide)).2
theorem two_zero_valley_d5_mod1024_drop_r59 (W : Nat) : HasHorizonDrop ((1024 * W + 183) * 2 ^ 182 - 7) := (two_zero_valley_d5_mod1024_contraction 59 W (by decide)).2
theorem two_zero_valley_d5_mod1024_drop_r60 (W : Nat) : HasHorizonDrop ((1024 * W + 703) * 2 ^ 185 - 7) := (two_zero_valley_d5_mod1024_contraction 60 W (by decide)).2

theorem two_zero_valley_d4_mod1024_drop_r40 (W : Nat) : HasHorizonDrop ((1024 * W + 205) * 2 ^ 124 - 7) := (two_zero_valley_d4_mod1024_contraction 40 W (by decide)).2
theorem two_zero_valley_d4_mod1024_drop_r41 (W : Nat) : HasHorizonDrop ((1024 * W + 933) * 2 ^ 127 - 7) := (two_zero_valley_d4_mod1024_contraction 41 W (by decide)).2
theorem two_zero_valley_d4_mod1024_drop_r42 (W : Nat) : HasHorizonDrop ((1024 * W + 445) * 2 ^ 130 - 7) := (two_zero_valley_d4_mod1024_contraction 42 W (by decide)).2
theorem two_zero_valley_d4_mod1024_drop_r43 (W : Nat) : HasHorizonDrop ((1024 * W + 277) * 2 ^ 133 - 7) := (two_zero_valley_d4_mod1024_contraction 43 W (by decide)).2
theorem two_zero_valley_d4_mod1024_drop_r44 (W : Nat) : HasHorizonDrop ((1024 * W + 941) * 2 ^ 136 - 7) := (two_zero_valley_d4_mod1024_contraction 44 W (by decide)).2
theorem two_zero_valley_d4_mod1024_drop_r45 (W : Nat) : HasHorizonDrop ((1024 * W + 901) * 2 ^ 139 - 7) := (two_zero_valley_d4_mod1024_contraction 45 W (by decide)).2

theorem shifted_valley_d2_mod1024_drop_r37 (W : Nat) : HasHorizonDrop ((1024 * W + 847) * 2 ^ 113 - 5) := (shifted_valley_d2_mod1024_contraction 37 W (by decide)).2
theorem shifted_valley_d2_mod1024_drop_r38 (W : Nat) : HasHorizonDrop ((1024 * W + 663) * 2 ^ 116 - 5) := (shifted_valley_d2_mod1024_contraction 38 W (by decide)).2
theorem shifted_valley_d2_mod1024_drop_r39 (W : Nat) : HasHorizonDrop ((1024 * W + 415) * 2 ^ 119 - 5) := (shifted_valley_d2_mod1024_contraction 39 W (by decide)).2
theorem shifted_valley_d2_mod1024_drop_r40 (W : Nat) : HasHorizonDrop ((1024 * W + 615) * 2 ^ 122 - 5) := (shifted_valley_d2_mod1024_contraction 40 W (by decide)).2
theorem shifted_valley_d2_mod1024_drop_r41 (W : Nat) : HasHorizonDrop ((1024 * W + 751) * 2 ^ 125 - 5) := (shifted_valley_d2_mod1024_contraction 41 W (by decide)).2
theorem shifted_valley_d2_mod1024_drop_r42 (W : Nat) : HasHorizonDrop ((1024 * W + 311) * 2 ^ 128 - 5) := (shifted_valley_d2_mod1024_contraction 42 W (by decide)).2

```

---

# Raport Rundy 4 — Architekt 3 (`mod 2048`, `v₂ ≥ 11`, okres 256 dla WSZYSTKICH 8 rodzin)

## 1. Podsumowanie Wykonawcze Rundy 4 (`mod 2048`, `v₂ ≥ 11`, aż do `r = 68`, `2^211`!)

W Rundzie 4 wyprowadziłem, zweryfikowałem w `node -e` (pełna symulacja trajektorii Collatza dla wszystkich $r = 0..70, W = 0..2$ oraz weryfikacja tablicy dla $s = 0..255$) i przetestowałem w `~/.elan/bin/lean` (**0 błędów, 0 ostrzeżeń, `0 sorryAx`, domyślny `maxHeartbeats 200000` bez ani jednego `set_option maxHeartbeats` ani `set_option maxRecDepth`, całkowity czas kompilacji `5.67 s` — o 33% szybciej niż `mod 1024`!**) kompletny pakiet **71 twierdzeń i definicji `mod 2048` (`v₂ ≥ 11`)**:
- 5 definicji i twierdzeń dwuwymiarowej siatki refleksyjnej $16 \times 16$ (`checkResonanceAt`, `checkResonanceRow`, `checkResonanceGrid16`, `checkResonanceRow_sound`, `checkResonanceGrid16_sound`),
- 3 twierdzenia biliniowego podnośnika potęg dziewiątki `mod 2048` (`pow9_mod2048`, `pow9_mod2048_succ`, `pow9_mod2048_succ2`),
- 2 lematy infrastrukturalne (`div2_step10_eq_div2048`, `mod2048_linear_inverse`),
- 16 głównych twierdzeń parametrycznych (8 par `_mod2048_resonance_step...` + `_mod2048_contraction` dla wszystkich 8 rodzin RLE i faz Modulo-3),
- 48 konkretnych twierdzeń horyzontowych `_mod2048_drop_r...` (po 6 najwyższych rzędów na rodzinę, sięgających aż do **`r = 68` (`2^211`, `362` kroków Collatza!)** dla `rle_10011`).

## 2. Trzy kluczowe odkrycia konstrukcyjne Rundy 4

### Odkrycie A: 6-członowy Most Biliniowy bezpośrednio jako `pow9_mod2048` (czas kompilacji `< 0.2 s`!)
Zamiast rozwijać $s_{2048}(k) = ((9^k - 1)/8) \bmod 256$ w 31 członów dzielenia całkowitego o okresie 32 (co dla kroku indukcyjnego $k \to k+1$ wymagałoby 32 gałęzi i ponad 60 zmiennych Presburgera w `omega`), zauważyłem, że ponieważ:
$$9^4 = 6561 = 3 \cdot 2048 + 417 = 1 + 32 \cdot 13 \pmod{2048},$$
wyrażenie $(9^4 - 1)^2 = 416^2 = 173056 \equiv 1024 \pmod{2048}$ oraz $(9^8 - 1)^2 \equiv 0 \pmod{2048}$.
W konsekwencji $s_{2048}(k) \bmod 256$ wyraża się **dokładnie dla każdego $k \in \mathbb{N}$** za pomocą zaledwie **6 członów** z jednym wyrazem biliniowym $(k \bmod 4)\lfloor k/4 \rfloor$:
$$s_{2048}(k) = \left(k + 8\lfloor k/2\rfloor + 208\lfloor k/4\rfloor + 80\lfloor(k+1)/4\rfloor + 128\lfloor k/8\rfloor + 160(k \bmod 4)\lfloor k/4\rfloor\right) \bmod 256.$$
Dowód indukcyjny `pow9_mod2048` wymaga jedynie podziału na 8 reszt `k % 8 = 0..7` (z przepisaniem `k % 4` i `(k + 1) % 4`) i kompiluje się w **0,2 sekundy**! Co więcej, użycie tego 6-członowego wzoru bezpośrednio jako `pow9_mod2048` sprawia, że `pow9_mod2048_succ` i `pow9_mod2048_succ2` wymagają tylko **jednego** przepisania `r + 1 + 1 = r + 2` (zamiast 7 w `mod 1024`).

### Odkrycie B: Dwugrupowa struktura biliniowa $t_{2048}(s) \bmod 256$ dla wszystkich 8 rodzin (0 członów `/ 8`!)
Badając różnice czwartego rzędu $\Delta_4(r) = (t_{2048}(4(q+1)+r) - t_{2048}(4q+r)) \bmod 256$ dla $r = s \bmod 4 \in \{0, 1, 2, 3\}$, odkryłem, że dla każdej z 8 rodzin nachylenie $\Delta_4(r)$ jest **ściśle stałe względem $q = \lfloor s/4 \rfloor$** i spełnia $\Delta_4(r) \equiv \Delta_4(0) + B \cdot r \pmod{256}$, gdzie $B \in \{64, 192\}$ zależy wyłącznie od $u_{\text{base}} \in \{5, 7\}$!
Dzięki temu **żadna z 8 rodzin na poziomie `mod 2048` nie potrzebuje członów `/ 8` ani `/ 16`** — każda rodzina wyraża się 5- lub 6-członowym wzorem biliniowym:
1. **Grupa I ($u_{\text{base}} = 7$: `two_zero_valley`, `rle_10011`, `two_zero_valley_d5`, `shifted_valley_d2`)** — wspólny ogon nieliniowy `+ 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)`:
   - `two_zero_valley` i `rle_10011`: `(113 * s + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256`
   - `two_zero_valley_d5`: `(161 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256`
   - `shifted_valley_d2`: `(81 * s + 132 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256`
2. **Grupa II ($u_{\text{base}} = 5$: `shifted_valley`, `rle_10111`, `shifted_valley_d1`, `two_zero_valley_d4`)** — wspólny ogon `+ 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)`:
   - `shifted_valley`: `(227 * s + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256`
   - `rle_10111`: `(99 * s + 208 + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256`
   - `shifted_valley_d1`: `(123 * s + 85 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256`
   - `two_zero_valley_d4`: `(139 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256`

### Odkrycie C: Dwuwymiarowa siatka refleksyjna `checkResonanceGrid16` (eliminacja `maxRecDepth` przy okresie 256)
Przy okresie $256$, jednowymiarowa rekursja unarna `checkResonanceTable ... 256` osiąga w jądrze Lean 4 domyślny limit głębokości stosu `maxRecDepth = 512` podczas ewaluacji `(by decide)`. Zastąpienie jej dwuwymiarową siatką $16 \times 16$ (`checkResonanceRow` o długości 16 wewnątrz `checkResonanceGrid16` o długości 16) redukuje maksymalną głębokość rekursji z $256$ do $16 + 16 = 32$, dzięki czemu `(by decide)` wykonuje się natychmiast bez żadnego `set_option maxRecDepth`.

## 3. Zestawienie wszystkich 8 rodzin na poziomie `mod 2048` (`v₂ ≥ 11`, okres 256)

| # | Rodzina | Licznik $\equiv 0 \pmod{2048}$ | Indeks $s$ | Wzór biliniowy na $t(s) \bmod 256$ | Kroki | Pułap $r_{\max}$ (`mod 2048`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{2048}(r+1)$ | `(113*s + 240*(s/2) + 96*(s/4) + 96*((s+1)/4) + 192*(s%4)*(s/4)) % 256` | $5r+16$ | **`r = 63`** (`2^192`, 331 kr.) | `r58 .. r63` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{2048}(r+1)$ | `(227*s + 208*(s/2) + 32*(s/4) + 32*((s+1)/4) + 64*(s%4)*(s/4)) % 256` | $5r+16$ | **`r = 63`** (`2^192`, 331 kr.) | `r58 .. r63` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{2048}(r+2)$ | `(113*s + 240*(s/2) + 96*(s/4) + 96*((s+1)/4) + 192*(s%4)*(s/4)) % 256` | $5r+22$ | **`r = 68`** (`2^211`, 362 kr.) | `r63 .. r68` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{2048}(r+1)$ | `(99*s + 208 + 208*(s/2) + 32*(s/4) + 32*((s+1)/4) + 64*(s%4)*(s/4)) % 256` | $5r+24$ | **`r = 65`** (`2^203`, 349 kr.) | `r60 .. r65` (6 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{2048}(r)$ | `(123*s + 85 + 80*(s/2) + 32*(s/4) + 32*((s+1)/4) + 64*(s%4)*(s/4)) % 256` | $5r+13$ | **`r = 61`** (`2^184`, 318 kr.) | `r56 .. r61` (6 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{2048}(r+1)$ | `(161*s + 170 + 240*(s/2) + 96*(s/4) + 96*((s+1)/4) + 192*(s%4)*(s/4)) % 256` | $5r+19$ | **`r = 66`** (`2^203`, 349 kr.) | `r61 .. r66` (6 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{2048}(r+2)$ | `(139*s + 3 + 80*(s/2) + 32*(s/4) + 32*((s+1)/4) + 64*(s%4)*(s/4)) % 256` | $5r+19$ | **`r = 50`** (`2^154`, 269 kr.) | `r45 .. r50` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{2048}(r)$ | `(81*s + 132 + 240*(s/2) + 96*(s/4) + 96*((s+1)/4) + 192*(s%4)*(s/4)) % 256` | $5r+16$ | **`r = 48`** (`2^146`, 256 kr.) | `r43 .. r48` (6 tw.) |

*(Uwaga: dla `two_zero_valley_d4` dokładny pułap nierówności $9^{r+2} + 4096 \le 2048 \cdot 2^{3r+4} = 2^{3r+15}$ wynosi `r = 50` (`2^154`), ponieważ $9^{52} < 2^{165}$ natomiast $9^{53} > 2^{168}$; dlatego wygenerowałem 6 najwyższych twierdzeń horyzontowych `r45 .. r50`.)*

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 53 i 54 (`mod 2048`, `v₂ ≥ 11`, 0 sorryAx)

```lean
def checkResonanceAt (M A uBase c : Nat) (tFn : Nat → Nat) (s : Nat) : Bool :=
  (A * (uBase + 8 * tFn s) * (1 + 8 * s)) % M == c % M

def checkResonanceRow (M A uBase c : Nat) (tFn : Nat → Nat) (base : Nat) : Nat → Bool
  | 0 => true
  | j + 1 => checkResonanceAt M A uBase c tFn (base + j) && checkResonanceRow M A uBase c tFn base j

def checkResonanceGrid16 (M A uBase c : Nat) (tFn : Nat → Nat) : Nat → Bool
  | 0 => true
  | i + 1 => checkResonanceRow M A uBase c tFn (16 * i) 16 && checkResonanceGrid16 M A uBase c tFn i

theorem checkResonanceRow_sound (M A uBase c : Nat) (tFn : Nat → Nat) (base : Nat) :
    ∀ k : Nat, checkResonanceRow M A uBase c tFn base k = true →
      ∀ j : Nat, j < k → (A * (uBase + 8 * tFn (base + j)) * (1 + 8 * (base + j))) % M = c % M
  | 0, _, j, hj => absurd hj (Nat.not_lt_zero j)
  | k + 1, h, j, hj => by
    unfold checkResonanceRow at h
    cases h1 : checkResonanceAt M A uBase c tFn (base + k) <;> simp [h1] at h
    rcases Nat.lt_succ_iff_lt_or_eq.mp hj with hlt | rfl
    · exact checkResonanceRow_sound M A uBase c tFn base k h j hlt
    · unfold checkResonanceAt at h1
      exact of_decide_eq_true h1

theorem checkResonanceGrid16_sound (M A uBase c : Nat) (tFn : Nat → Nat) :
    ∀ k : Nat, checkResonanceGrid16 M A uBase c tFn k = true →
      ∀ s : Nat, s < 16 * k → (A * (uBase + 8 * tFn s) * (1 + 8 * s)) % M = c % M
  | 0, _, s, hs => absurd hs (Nat.not_lt_zero s)
  | k + 1, h, s, hs => by
    unfold checkResonanceGrid16 at h
    cases h1 : checkResonanceRow M A uBase c tFn (16 * k) 16 <;> simp [h1] at h
    have hsplit : s < 16 * k ∨ (16 * k ≤ s ∧ s < 16 * k + 16) := by omega
    rcases hsplit with hlt | ⟨hge, hlt2⟩
    · exact checkResonanceGrid16_sound M A uBase c tFn k h s hlt
    · have hj : s - 16 * k < 16 := by omega
      have hrow := checkResonanceRow_sound M A uBase c tFn (16 * k) 16 h1 (s - 16 * k) hj
      have heq : 16 * k + (s - 16 * k) = s := by omega
      rw [heq] at hrow
      exact hrow

-- =============================================================================
-- Część 53-54: Rezonanse i Kontrakcje mod 2048 (v₂ ≥ 11, okres 256)
-- =============================================================================

theorem pow9_mod2048 (k : Nat) :
    (9 ^ k) % 2048 = 1 + 8 * ((k + 8 * (k / 2) + 208 * (k / 4) + 80 * ((k + 1) / 4) +
      128 * (k / 8) + 160 * (k % 4) * (k / 4)) % 256) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    have hp : k % 8 = 0 ∨ k % 8 = 1 ∨ k % 8 = 2 ∨ k % 8 = 3 ∨
              k % 8 = 4 ∨ k % 8 = 5 ∨ k % 8 = 6 ∨ k % 8 = 7 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7
    · have ha : k % 4 = 0 := by omega
      have hb : (k + 1) % 4 = 1 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 1 := by omega
      have hb : (k + 1) % 4 = 2 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 2 := by omega
      have hb : (k + 1) % 4 = 3 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 3 := by omega
      have hb : (k + 1) % 4 = 0 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 0 := by omega
      have hb : (k + 1) % 4 = 1 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 1 := by omega
      have hb : (k + 1) % 4 = 2 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 2 := by omega
      have hb : (k + 1) % 4 = 3 := by omega
      rw [ha, hb]; omega
    · have ha : k % 4 = 3 := by omega
      have hb : (k + 1) % 4 = 0 := by omega
      rw [ha, hb]; omega

theorem pow9_mod2048_succ (r : Nat) :
    (9 ^ (r + 1)) % 2048 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
      128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h := pow9_mod2048 (r + 1)
  rw [h2] at h
  exact h

theorem pow9_mod2048_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 2048 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 208 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
      128 * ((r + 2) / 8) + 160 * ((r + 2) % 4) * ((r + 2) / 4)) % 256) := by
  have h2 : r + 2 + 1 = r + 3 := by omega
  have h := pow9_mod2048 (r + 2)
  rw [h2] at h
  exact h

theorem div2_step10_eq_div2048 (N : Nat) (hN : N % 2048 = 0) :
    collatzIter 10 (N / 2) = N / 2048 := by
  have s1  : collatzStep (N / 2)    = N / 4    := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)    = N / 8    := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)    = N / 16   := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)   = N / 32   := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)   = N / 64   := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)   = N / 128  := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)  = N / 256  := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)  = N / 512  := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)  = N / 1024 := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024) = N / 2048 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2)))))))))) = N / 2048
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10]

theorem mod2048_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 2048 = b)
    (hge : c ≤ A * M * (2048 * W + u0))
    (hres : (A * u0 * b) % 2048 = c % 2048) :
    (A * M * (2048 * W + u0) - c) % 2048 = 0 := by
  have h1 : (A * M * (2048 * W + u0)) % 2048 = (A * u0 * b) % 2048 := by
    have hcomm : A * M * (2048 * W + u0) = A * (2048 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (2048 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (2048 * W + u0)) % 2048 = (A * u0) % 2048 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 2048, Nat.mul_assoc]
      omega
    have h3 : (M % 2048) = (b % 2048) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod2048`, faza `3r + 3`, `5r + 16` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod2048_resonance_step16 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((113 * s + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 16) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 2048 := by
  intro s U
  let tFn := fun x => (113 * x + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 16 = 10 + (5 * r + 6) := by omega
  have hU : U = 2 * (1024 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (1024 * W + 3 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ (r + 1)) % 2048 = 1 + 8 * s := pow9_mod2048_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 2048 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (2048 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (2048 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 1 7 7 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (9 ^ (r + 1) * U - 7) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod2048 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (9 ^ (r + 1) * U - 7) hdiv2048

theorem two_zero_valley_mod2048_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 2048 ≤ 2048 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((113 * s + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 16) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 16) n0 = (9 ^ (r + 1) * U - 7) / 2048 :=
    two_zero_valley_mod2048_resonance_step16 r W
  have hle : (9 ^ (r + 1) + 2048) * U ≤ (2048 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (113 * x + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2055 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 113 := by rw [hs0]
      have hU0 : U ≥ 911 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 154 := by rw [hs1]
        have hU1 : U ≥ 1239 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  have hlt : collatzIter (5 * r + 16) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 16) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 16) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod2048`, faza `3r + 3`, `5r + 16` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod2048_resonance_step16 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 16) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 2048 := by
  intro s U
  let tFn := fun x => (227 * x + 208 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 16 = 10 + (5 * r + 6) := by omega
  have hU : U = 2 * (1024 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (1024 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod2048 : (9 ^ (r + 1)) % 2048 = 1 + 8 * s := pow9_mod2048_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 2048 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (2048 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (2048 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 1 5 5 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (9 ^ (r + 1) * U - 5) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod2048 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (9 ^ (r + 1) * U - 5) hdiv2048

theorem shifted_valley_mod2048_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 2048 ≤ 2048 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 16) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 16) n0 = (9 ^ (r + 1) * U - 5) / 2048 :=
    shifted_valley_mod2048_resonance_step16 r W
  have hle : (9 ^ (r + 1) + 2048) * U ≤ (2048 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (227 * x + 208 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2053 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 227 := by rw [hs0]
      have hU0 : U ≥ 1821 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 110 := by rw [hs1]
        have hU1 : U ≥ 885 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  have hlt : collatzIter (5 * r + 16) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 16) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 16) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod2048`, `3r + 7`, `5r + 22` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod2048_resonance_step22 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 208 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 128 * ((r + 2) / 8) + 160 * ((r + 2) % 4) * ((r + 2) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((113 * s + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 22) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 2048 := by
  intro s U
  let tFn := fun x => (113 * x + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 22 = 10 + (5 * r + 12) := by omega
  have hU : U = 2 * (1024 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (1024 * W + 3 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ (r + 2)) % 2048 = 1 + 8 * s := pow9_mod2048_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 2048 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (2048 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (2048 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 1 7 7 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (9 ^ (r + 2) * U - 7) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod2048 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (9 ^ (r + 2) * U - 7) hdiv2048

theorem rle_10011_mod2048_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 4096 ≤ 2048 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 208 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 128 * ((r + 2) / 8) + 160 * ((r + 2) % 4) * ((r + 2) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((113 * s + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 22) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 22) n0 = (9 ^ (r + 2) * U - 7) / 2048 :=
    rle_10011_mod2048_resonance_step22 r W
  have hle : (9 ^ (r + 2) + 4096) * U ≤ (2048 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (113 * x + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2055 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 154 := by rw [hs0]
      have hU0 : U ≥ 1239 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 729 ≤ 9 ^ (r' + 1 + 2) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  have hlt : collatzIter (5 * r + 22) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 22) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 22) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod2048`, `3r + 8`, `5r + 24` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod2048_resonance_step24 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((99 * s + 208 + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 24) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 2048 := by
  intro s U
  let tFn := fun x => (99 * x + 208 + 208 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 24 = 10 + (5 * r + 14) := by omega
  have hU : U = 2 * (1024 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (1024 * W + 2 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ (r + 1)) % 2048 = 1 + 8 * s := pow9_mod2048_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 2048 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (2048 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (2048 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 27 5 7 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (27 * 9 ^ (r + 1) * U - 7) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod2048 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (27 * 9 ^ (r + 1) * U - 7) hdiv2048

theorem rle_10111_mod2048_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 4096 ≤ 2048 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((99 * s + 208 + 208 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 24) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 24) n0 = (27 * 9 ^ (r + 1) * U - 7) / 2048 :=
    rle_10111_mod2048_resonance_step24 r W
  have hle : (27 * 9 ^ (r + 1) + 4096) * U ≤ (2048 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (99 * x + 208 + 208 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2055 ≤ 27 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 51 := by rw [hs0]
      have hU0 : U ≥ 413 := by rw [ht0] at hU_def; omega
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 2187 ≤ 27 * 9 ^ (r' + 1 + 1) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  have hlt : collatzIter (5 * r + 24) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 24) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 24) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod2048`, `3r + 1`, `5r + 13` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod2048_resonance_step13 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 208 * (r / 4) + 80 * ((r + 1) / 4) + 128 * (r / 8) + 160 * (r % 4) * (r / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((123 * s + 85 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 13) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 2048 := by
  intro s U
  let tFn := fun x => (123 * x + 85 + 80 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 13 = 10 + (5 * r + 3) := by omega
  have hU : U = 2 * (1024 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (1024 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod2048 : (9 ^ r) % 2048 = 1 + 8 * s := pow9_mod2048 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 2048 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (2048 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (2048 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 3 5 7 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (3 * 9 ^ r * U - 7) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod2048 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (3 * 9 ^ r * U - 7) hdiv2048

theorem shifted_valley_d1_mod2048_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 2048 ≤ 2048 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 208 * (r / 4) + 80 * ((r + 1) / 4) + 128 * (r / 8) + 160 * (r % 4) * (r / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((123 * s + 85 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 13) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 13) n0 = (3 * 9 ^ r * U - 7) / 2048 :=
    shifted_valley_d1_mod2048_resonance_step13 r W
  have hle : (3 * 9 ^ r + 2048) * U ≤ (2048 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (123 * x + 85 + 80 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2055 ≤ 3 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 85 := by rw [hs0]
      have hU0 : U ≥ 685 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ 0 * U = 3 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 208 := by rw [hs1]
        have hU1 : U ≥ 1669 := by rw [ht1] at hU_def; omega
        have hpow1 : 3 * 9 ^ 1 * U = 27 * U := rfl
        omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 10 := rfl
          have ht2 : tFn s = 51 := by rw [hs2]
          have hU2 : U ≥ 413 := by rw [ht2] at hU_def; omega
          have hpow2 : 3 * 9 ^ 2 * U = 243 * U := rfl
          omega
        | succ r''' =>
          have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hval3 : 2187 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1) := by omega
          have hmul := Nat.mul_le_mul_right U hval3
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  have hlt : collatzIter (5 * r + 13) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 13) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 13) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod2048`, `3r + 5`, `5r + 19` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod2048_resonance_step19 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((161 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 19) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 2048 := by
  intro s U
  let tFn := fun x => (161 * x + 170 + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 19 = 10 + (5 * r + 9) := by omega
  have hU : U = 2 * (1024 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (1024 * W + 3 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ (r + 1)) % 2048 = 1 + 8 * s := pow9_mod2048_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 2048 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (2048 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (2048 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 3 7 5 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (3 * 9 ^ (r + 1) * U - 5) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod2048 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (3 * 9 ^ (r + 1) * U - 5) hdiv2048

theorem two_zero_valley_d5_mod2048_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 2048 ≤ 2048 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 208 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 128 * ((r + 1) / 8) + 160 * ((r + 1) % 4) * ((r + 1) / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((161 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 19) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 19) n0 = (3 * 9 ^ (r + 1) * U - 5) / 2048 :=
    two_zero_valley_d5_mod2048_resonance_step19 r W
  have hle : (3 * 9 ^ (r + 1) + 2048) * U ≤ (2048 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (161 * x + 170 + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2053 ≤ 3 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 75 := by rw [hs0]
      have hU0 : U ≥ 607 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 36 := by rw [hs1]
        have hU1 : U ≥ 295 := by rw [ht1] at hU_def; omega
        have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 3 * 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  have hlt : collatzIter (5 * r + 19) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 19) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 19) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod2048`, `3r + 4`, `5r + 19` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod2048_resonance_step19 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 208 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 128 * ((r + 2) / 8) + 160 * ((r + 2) % 4) * ((r + 2) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((139 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 19) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 2048 := by
  intro s U
  let tFn := fun x => (139 * x + 3 + 80 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 19 = 10 + (5 * r + 9) := by omega
  have hU : U = 2 * (1024 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (1024 * W + 2 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ (r + 2)) % 2048 = 1 + 8 * s := pow9_mod2048_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 2048 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (2048 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (2048 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 1 5 29 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (9 ^ (r + 2) * U - 29) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod2048 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (9 ^ (r + 2) * U - 29) hdiv2048

theorem two_zero_valley_d4_mod2048_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 4096 ≤ 2048 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 208 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 128 * ((r + 2) / 8) + 160 * ((r + 2) % 4) * ((r + 2) / 4)) % 256
    let U := 2048 * W + 5 + 8 * ((139 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 32 * ((s + 1) / 4) + 64 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 19) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 19) n0 = (9 ^ (r + 2) * U - 29) / 2048 :=
    two_zero_valley_d4_mod2048_resonance_step19 r W
  have hle : (9 ^ (r + 2) + 4096) * U ≤ (2048 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (139 * x + 3 + 80 * (x / 2) + 32 * (x / 4) + 32 * ((x + 1) / 4) + 64 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2077 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 129 := by rw [hs0]
      have hU0 : U ≥ 1037 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 729 ≤ 9 ^ (r' + 1 + 2) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  have hlt : collatzIter (5 * r + 19) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 19) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 19) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod2048`, `3r + 2`, `5r + 16` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod2048_resonance_step16 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 208 * (r / 4) + 80 * ((r + 1) / 4) + 128 * (r / 8) + 160 * (r % 4) * (r / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((81 * s + 132 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    collatzIter (5 * r + 16) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 2048 := by
  intro s U
  let tFn := fun x => (81 * x + 132 + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 16 = 10 + (5 * r + 6) := by omega
  have hU : U = 2 * (1024 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 10 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (1024 * W + 3 + 4 * t), ← hU]
  have h9_mod2048 : (9 ^ r) % 2048 = 1 + 8 * s := pow9_mod2048 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 2048 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (2048 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (2048 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 256 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 2048 27 7 29 tFn 16 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv2048 : (27 * 9 ^ r * U - 29) % 2048 = 0 := by
    have h1 := mod2048_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod2048 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step10_eq_div2048 (27 * 9 ^ r * U - 29) hdiv2048

theorem shifted_valley_d2_mod2048_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 2048 ≤ 2048 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 208 * (r / 4) + 80 * ((r + 1) / 4) + 128 * (r / 8) + 160 * (r % 4) * (r / 4)) % 256
    let U := 2048 * W + 7 + 8 * ((81 * s + 132 + 240 * (s / 2) + 96 * (s / 4) + 96 * ((s + 1) / 4) + 192 * (s % 4) * (s / 4)) % 256)
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 16) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 16) n0 = (27 * 9 ^ r * U - 29) / 2048 :=
    shifted_valley_d2_mod2048_resonance_step16 r W
  have hle : (27 * 9 ^ r + 2048) * U ≤ (2048 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 2048 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (81 * x + 132 + 240 * (x / 2) + 96 * (x / 4) + 96 * ((x + 1) / 4) + 192 * (x % 4) * (x / 4)) % 256
  have hU_def : U = 2048 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 2077 ≤ 27 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 132 := by rw [hs0]
      have hU0 : U ≥ 1063 := by rw [ht0] at hU_def; omega
      have hpow0 : 27 * 9 ^ 0 * U = 27 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 213 := by rw [hs1]
        have hU1 : U ≥ 1711 := by rw [ht1] at hU_def; omega
        have hpow1 : 27 * 9 ^ 1 * U = 243 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 81 ≤ 9 ^ (r'' + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 27 * 9 ^ (r'' + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  have hlt : collatzIter (5 * r + 16) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 16) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 16) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 48 konkretnych twierdzeń horyzontowych _mod2048_drop_r...
-- -----------------------------------------------------------------------------

theorem two_zero_valley_mod2048_drop_r58 (W : Nat) : HasHorizonDrop ((2048 * W + 159) * 2 ^ 177 - 7) := (two_zero_valley_mod2048_contraction 58 W (by decide)).2
theorem two_zero_valley_mod2048_drop_r59 (W : Nat) : HasHorizonDrop ((2048 * W + 1383) * 2 ^ 180 - 7) := (two_zero_valley_mod2048_contraction 59 W (by decide)).2
theorem two_zero_valley_mod2048_drop_r60 (W : Nat) : HasHorizonDrop ((2048 * W + 1519) * 2 ^ 183 - 7) := (two_zero_valley_mod2048_contraction 60 W (by decide)).2
theorem two_zero_valley_mod2048_drop_r61 (W : Nat) : HasHorizonDrop ((2048 * W + 1079) * 2 ^ 186 - 7) := (two_zero_valley_mod2048_contraction 61 W (by decide)).2
theorem two_zero_valley_mod2048_drop_r62 (W : Nat) : HasHorizonDrop ((2048 * W + 575) * 2 ^ 189 - 7) := (two_zero_valley_mod2048_contraction 62 W (by decide)).2
theorem two_zero_valley_mod2048_drop_r63 (W : Nat) : HasHorizonDrop ((2048 * W + 519) * 2 ^ 192 - 7) := (two_zero_valley_mod2048_contraction 63 W (by decide)).2

theorem shifted_valley_mod2048_drop_r58 (W : Nat) : HasHorizonDrop ((2048 * W + 1869) * 2 ^ 177 - 5) := (shifted_valley_mod2048_contraction 58 W (by decide)).2
theorem shifted_valley_mod2048_drop_r59 (W : Nat) : HasHorizonDrop ((2048 * W + 1573) * 2 ^ 180 - 5) := (shifted_valley_mod2048_contraction 59 W (by decide)).2
theorem shifted_valley_mod2048_drop_r60 (W : Nat) : HasHorizonDrop ((2048 * W + 1085) * 2 ^ 183 - 5) := (shifted_valley_mod2048_contraction 60 W (by decide)).2
theorem shifted_valley_mod2048_drop_r61 (W : Nat) : HasHorizonDrop ((2048 * W + 1941) * 2 ^ 186 - 5) := (shifted_valley_mod2048_contraction 61 W (by decide)).2
theorem shifted_valley_mod2048_drop_r62 (W : Nat) : HasHorizonDrop ((2048 * W + 1581) * 2 ^ 189 - 5) := (shifted_valley_mod2048_contraction 62 W (by decide)).2
theorem shifted_valley_mod2048_drop_r63 (W : Nat) : HasHorizonDrop ((2048 * W + 1541) * 2 ^ 192 - 5) := (shifted_valley_mod2048_contraction 63 W (by decide)).2

theorem rle_10011_mod2048_drop_r63 (W : Nat) : HasHorizonDrop ((2048 * W + 1423) * 2 ^ 196 - 13) := (rle_10011_mod2048_contraction 63 W (by decide)).2
theorem rle_10011_mod2048_drop_r64 (W : Nat) : HasHorizonDrop ((2048 * W + 1751) * 2 ^ 199 - 13) := (rle_10011_mod2048_contraction 64 W (by decide)).2
theorem rle_10011_mod2048_drop_r65 (W : Nat) : HasHorizonDrop ((2048 * W + 2015) * 2 ^ 202 - 13) := (rle_10011_mod2048_contraction 65 W (by decide)).2
theorem rle_10011_mod2048_drop_r66 (W : Nat) : HasHorizonDrop ((2048 * W + 679) * 2 ^ 205 - 13) := (rle_10011_mod2048_contraction 66 W (by decide)).2
theorem rle_10011_mod2048_drop_r67 (W : Nat) : HasHorizonDrop ((2048 * W + 303) * 2 ^ 208 - 13) := (rle_10011_mod2048_contraction 67 W (by decide)).2
theorem rle_10011_mod2048_drop_r68 (W : Nat) : HasHorizonDrop ((2048 * W + 1399) * 2 ^ 211 - 13) := (rle_10011_mod2048_contraction 68 W (by decide)).2

theorem rle_10111_mod2048_drop_r60 (W : Nat) : HasHorizonDrop ((2048 * W + 1725) * 2 ^ 188 - 9) := (rle_10111_mod2048_contraction 60 W (by decide)).2
theorem rle_10111_mod2048_drop_r61 (W : Nat) : HasHorizonDrop ((2048 * W + 1557) * 2 ^ 191 - 9) := (rle_10111_mod2048_contraction 61 W (by decide)).2
theorem rle_10111_mod2048_drop_r62 (W : Nat) : HasHorizonDrop ((2048 * W + 173) * 2 ^ 194 - 9) := (rle_10111_mod2048_contraction 62 W (by decide)).2
theorem rle_10111_mod2048_drop_r63 (W : Nat) : HasHorizonDrop ((2048 * W + 1157) * 2 ^ 197 - 9) := (rle_10111_mod2048_contraction 63 W (by decide)).2
theorem rle_10111_mod2048_drop_r64 (W : Nat) : HasHorizonDrop ((2048 * W + 1949) * 2 ^ 200 - 9) := (rle_10111_mod2048_contraction 64 W (by decide)).2
theorem rle_10111_mod2048_drop_r65 (W : Nat) : HasHorizonDrop ((2048 * W + 2037) * 2 ^ 203 - 9) := (rle_10111_mod2048_contraction 65 W (by decide)).2

theorem shifted_valley_d1_mod2048_drop_r56 (W : Nat) : HasHorizonDrop ((2048 * W + 1773) * 2 ^ 169 - 5) := (shifted_valley_d1_mod2048_contraction 56 W (by decide)).2
theorem shifted_valley_d1_mod2048_drop_r57 (W : Nat) : HasHorizonDrop ((2048 * W + 197) * 2 ^ 172 - 5) := (shifted_valley_d1_mod2048_contraction 57 W (by decide)).2
theorem shifted_valley_d1_mod2048_drop_r58 (W : Nat) : HasHorizonDrop ((2048 * W + 477) * 2 ^ 175 - 5) := (shifted_valley_d1_mod2048_contraction 58 W (by decide)).2
theorem shifted_valley_d1_mod2048_drop_r59 (W : Nat) : HasHorizonDrop ((2048 * W + 53) * 2 ^ 178 - 5) := (shifted_valley_d1_mod2048_contraction 59 W (by decide)).2
theorem shifted_valley_d1_mod2048_drop_r60 (W : Nat) : HasHorizonDrop ((2048 * W + 461) * 2 ^ 181 - 5) := (shifted_valley_d1_mod2048_contraction 60 W (by decide)).2
theorem shifted_valley_d1_mod2048_drop_r61 (W : Nat) : HasHorizonDrop ((2048 * W + 1189) * 2 ^ 184 - 5) := (shifted_valley_d1_mod2048_contraction 61 W (by decide)).2

theorem two_zero_valley_d5_mod2048_drop_r61 (W : Nat) : HasHorizonDrop ((2048 * W + 647) * 2 ^ 188 - 7) := (two_zero_valley_d5_mod2048_contraction 61 W (by decide)).2
theorem two_zero_valley_d5_mod2048_drop_r62 (W : Nat) : HasHorizonDrop ((2048 * W + 527) * 2 ^ 191 - 7) := (two_zero_valley_d5_mod2048_contraction 62 W (by decide)).2
theorem two_zero_valley_d5_mod2048_drop_r63 (W : Nat) : HasHorizonDrop ((2048 * W + 1879) * 2 ^ 194 - 7) := (two_zero_valley_d5_mod2048_contraction 63 W (by decide)).2
theorem two_zero_valley_d5_mod2048_drop_r64 (W : Nat) : HasHorizonDrop ((2048 * W + 1119) * 2 ^ 197 - 7) := (two_zero_valley_d5_mod2048_contraction 64 W (by decide)).2
theorem two_zero_valley_d5_mod2048_drop_r65 (W : Nat) : HasHorizonDrop ((2048 * W + 807) * 2 ^ 200 - 7) := (two_zero_valley_d5_mod2048_contraction 65 W (by decide)).2
theorem two_zero_valley_d5_mod2048_drop_r66 (W : Nat) : HasHorizonDrop ((2048 * W + 1455) * 2 ^ 203 - 7) := (two_zero_valley_d5_mod2048_contraction 66 W (by decide)).2

theorem two_zero_valley_d4_mod2048_drop_r45 (W : Nat) : HasHorizonDrop ((2048 * W + 1925) * 2 ^ 139 - 7) := (two_zero_valley_d4_mod2048_contraction 45 W (by decide)).2
theorem two_zero_valley_d4_mod2048_drop_r46 (W : Nat) : HasHorizonDrop ((2048 * W + 669) * 2 ^ 142 - 7) := (two_zero_valley_d4_mod2048_contraction 46 W (by decide)).2
theorem two_zero_valley_d4_mod2048_drop_r47 (W : Nat) : HasHorizonDrop ((2048 * W + 757) * 2 ^ 145 - 7) := (two_zero_valley_d4_mod2048_contraction 47 W (by decide)).2
theorem two_zero_valley_d4_mod2048_drop_r48 (W : Nat) : HasHorizonDrop ((2048 * W + 1677) * 2 ^ 148 - 7) := (two_zero_valley_d4_mod2048_contraction 48 W (by decide)).2
theorem two_zero_valley_d4_mod2048_drop_r49 (W : Nat) : HasHorizonDrop ((2048 * W + 869) * 2 ^ 151 - 7) := (two_zero_valley_d4_mod2048_contraction 49 W (by decide)).2
theorem two_zero_valley_d4_mod2048_drop_r50 (W : Nat) : HasHorizonDrop ((2048 * W + 1917) * 2 ^ 154 - 7) := (two_zero_valley_d4_mod2048_contraction 50 W (by decide)).2

theorem shifted_valley_d2_mod2048_drop_r43 (W : Nat) : HasHorizonDrop ((2048 * W + 831) * 2 ^ 131 - 5) := (shifted_valley_d2_mod2048_contraction 43 W (by decide)).2
theorem shifted_valley_d2_mod2048_drop_r44 (W : Nat) : HasHorizonDrop ((2048 * W + 775) * 2 ^ 134 - 5) := (shifted_valley_d2_mod2048_contraction 44 W (by decide)).2
theorem shifted_valley_d2_mod2048_drop_r45 (W : Nat) : HasHorizonDrop ((2048 * W + 1679) * 2 ^ 137 - 5) := (shifted_valley_d2_mod2048_contraction 45 W (by decide)).2
theorem shifted_valley_d2_mod2048_drop_r46 (W : Nat) : HasHorizonDrop ((2048 * W + 2007) * 2 ^ 140 - 5) := (shifted_valley_d2_mod2048_contraction 46 W (by decide)).2
theorem shifted_valley_d2_mod2048_drop_r47 (W : Nat) : HasHorizonDrop ((2048 * W + 223) * 2 ^ 143 - 5) := (shifted_valley_d2_mod2048_contraction 47 W (by decide)).2
theorem shifted_valley_d2_mod2048_drop_r48 (W : Nat) : HasHorizonDrop ((2048 * W + 935) * 2 ^ 146 - 5) := (shifted_valley_d2_mod2048_contraction 48 W (by decide)).2

```

---

# Raport Rundy 5 — Architekt 3 (`mod 4096`, `v₂ ≥ 12`, okres 512 dla WSZYSTKICH 8 rodzin)

## 1. Podsumowanie Wykonawcze Rundy 5 (`mod 4096`, `v₂ ≥ 12`, aż do `r = 74`, `2^229`!)

W Rundzie 5 wyprowadziłem, zweryfikowałem w `node -e` (pełna symulacja trajektorii Collatza dla wszystkich $r = 0..78, W = 0..2$ oraz weryfikacja tablicy dla $s = 0..511$) i przetestowałem w `~/.elan/bin/lean` (**0 błędów, 0 ostrzeżeń, `0 sorryAx`, domyślny `maxHeartbeats 200000` bez ani jednego `set_option maxHeartbeats` ani `set_option maxRecDepth`, całkowity czas kompilacji `8.81 s`!**) kompletny pakiet **70 twierdzeń `mod 4096` (`v₂ ≥ 12`)**:
- 3 twierdzenia biliniowego podnośnika potęg dziewiątki `mod 4096` (`pow9_mod4096`, `pow9_mod4096_succ`, `pow9_mod4096_succ2`),
- 2 lematy infrastrukturalne (`div2_step11_eq_div4096`, `mod4096_linear_inverse`), korzystające bezpośrednio z dwuwymiarowej siatki `checkResonanceGrid16_sound` z Części 53 wywołanej z parametrem `32` ($16 \times 32 = 512$, głębokość rekurencji $\le 32$),
- 16 głównych twierdzeń parametrycznych (8 par `_mod4096_resonance_step...` + `_mod4096_contraction` dla wszystkich 8 rodzin RLE i faz Modulo-3),
- 49 konkretnych twierdzeń horyzontowych `_mod4096_drop_r...` (po 6 najwyższych rzędów na rodzinę + bonusowy rząd `r71` dla `rle_10111`, sięgających aż do **`r = 74` (`2^229`, `393` kroków Collatza!)** dla `rle_10011`).

## 2. Dwa kluczowe odkrycia konstrukcyjne Rundy 5

### Odkrycie A: 8-członowy Most Biliniowy bezpośrednio jako `pow9_mod4096` (8 gałęzi `k % 8`, kompilacja w `0,3 s`!)
Kluczowa obserwacja 2-adyczna na poziomie $4096 = 2^{12}$:
Ponieważ $9^4 = 1 + 416$ oraz $9^8 = (1 + 416)^2 = 1 + 832 + 173056 \equiv 1 + 1856 \pmod{4096}$, a $1856 = 64 \cdot 29$, mamy:
$$(9^8 - 1)^2 \equiv 1856^2 = 4096 \cdot 841 \equiv 0 \pmod{4096}!!$$
Oznacza to, że **nawet modulo 4096** ciąg $s_{4096}(8q + r) \bmod 512$ jest **ściśle liniowy względem $q = \lfloor k/8 \rfloor$ dla każdej reszty $r = k \bmod 8 \in \{0, \dots, 7\}$** (z nachyleniem $\Delta_8(r) \equiv 232 + 320 r \pmod{512}$)!
Dzięki temu pełna reszta $s_{4096}(k) \bmod 512$ wyraża się **dokładnie dla każdego $k \in \mathbb{N}$** za pomocą zaledwie **8 członów** (bez żadnych dzielników `/ 16`, `/ 32` ani `/ 64`!):
$$s_{4096}(k) = \left(k + 8\lfloor k/2\rfloor + 80\lfloor k/4\rfloor + 80\lfloor(k+1)/4\rfloor + 384\lfloor k/8\rfloor + 256\lfloor(k+1)/8\rfloor + 256\lfloor(k+3)/8\rfloor + 160(k \bmod 8)\lfloor k/4\rfloor\right) \bmod 512.$$
Dowód indukcyjny `pow9_mod4096` wymaga jedynie podziału na **8 gałęzi `k % 8 = 0..7`** i pojedynczego przepisania `(k + 1) % 8`, kompilując się w **0,3 sekundy**!

### Odkrycie B: Tożsamość linearyzacji kwadratu $128\lfloor s/4\rfloor^2 \equiv 128\lfloor s/4\rfloor + 256\lfloor s/8\rfloor \pmod{512}$ dla $t_{4096}(s)$
W rozwinięciu 2-adycznym odwrotności $(1 + 8s)^{-1} \equiv 1 - 8s + 64s^2 - 512s^3 \pmod{4096}$, dla $s = 4q + r$ ($q = \lfloor s/4 \rfloor, r = s \bmod 4$) człon kwadratowy w $t_{4096}(s) \bmod 512$ wynosi:
$$8(4q + r)^2 = 128 q^2 + 64 q r + 8 r^2 \pmod{512}.$$
Ponieważ dla każdej liczby całkowitej $q$ zachodzi $(2m)^2 \equiv 0 \pmod 4$ oraz $(2m+1)^2 \equiv 1 \pmod 4$, mamy dokładną tożsamość:
$$q^2 \equiv q \bmod 2 = q - 2\lfloor q/2 \rfloor = \lfloor s/4 \rfloor - 2\lfloor s/8 \rfloor \pmod 4,$$
czyli po pomnożeniu przez $128$:
$$128 \lfloor s/4 \rfloor^2 \equiv 128 \lfloor s/4 \rfloor + 256 \lfloor s/8 \rfloor \pmod{512}!!$$
W rezultacie **wszystkie 8 wzorów na $t_{4096}(s) \bmod 512$ powstaje ze wzorów $t_{2048}(s)$ wyłącznie przez dodanie pojedynczego członu `+ 256 * (s / 8)` oraz korektę współczynników przy `s`, `s / 2`, `s / 4`, `(s + 1) / 4` (i używa tego samego członu biliniowego `(s % 4) * (s / 4)` bez `s % 8`!)**:
1. **Grupa I ($u_{\text{base}} = 7$: `two_zero_valley`, `rle_10011`, `two_zero_valley_d5`, `shifted_valley_d2`)** — wspólny ogon `+ 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)`:
   - `two_zero_valley` i `rle_10011`: `(113 * s + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512`
   - `two_zero_valley_d5`: `(417 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512`
   - `shifted_valley_d2`: `(337 * s + 132 + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512`
2. **Grupa II ($u_{\text{base}} = 5$: `shifted_valley`, `rle_10111`, `shifted_valley_d1`, `two_zero_valley_d4`)** — wspólny człon `+ 256 * (s / 8) + 64 * (s % 4) * (s / 4)`:
   - `shifted_valley`: `(227 * s + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512`
   - `rle_10111`: `(99 * s + 208 + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512`
   - `shifted_valley_d1`: `(379 * s + 341 + 336 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512`
   - `two_zero_valley_d4`: `(395 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512`

## 3. Zestawienie wszystkich 8 rodzin na poziomie `mod 4096` (`v₂ ≥ 12`, okres 512)

| # | Rodzina | Licznik $\equiv 0 \pmod{4096}$ | Indeks $s$ | Wzór biliniowy na $t(s) \bmod 512$ | Kroki | Pułap $r_{\max}$ (`mod 4096`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{4096}(r+1)$ | `(113*s + 496*(s/2) + 96*(s/4) + 352*((s+1)/4) + 256*(s/8) + 192*(s%4)*(s/4)) % 512` | $5r+17$ | **`r = 69`** (`2^210`, 362 kr.) | `r64 .. r69` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{4096}(r+1)$ | `(227*s + 208*(s/2) + 288*(s/4) + 32*((s+1)/4) + 256*(s/8) + 64*(s%4)*(s/4)) % 512` | $5r+17$ | **`r = 69`** (`2^210`, 362 kr.) | `r64 .. r69` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{4096}(r+2)$ | `(113*s + 496*(s/2) + 96*(s/4) + 352*((s+1)/4) + 256*(s/8) + 192*(s%4)*(s/4)) % 512` | $5r+23$ | **`r = 74`** (`2^229`, 393 kr.) | `r69 .. r74` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{4096}(r+1)$ | `(99*s + 208 + 208*(s/2) + 288*(s/4) + 32*((s+1)/4) + 256*(s/8) + 64*(s%4)*(s/4)) % 512` | $5r+25$ | **`r = 71`** (`2^221`, 380 kr.) | `r65 .. r71` (7 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{4096}(r)$ | `(379*s + 341 + 336*(s/2) + 32*(s/4) + 288*((s+1)/4) + 256*(s/8) + 64*(s%4)*(s/4)) % 512` | $5r+14$ | **`r = 67`** (`2^202`, 349 kr.) | `r62 .. r67` (6 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{4096}(r+1)$ | `(417*s + 170 + 240*(s/2) + 96*(s/4) + 352*((s+1)/4) + 256*(s/8) + 192*(s%4)*(s/4)) % 512` | $5r+20$ | **`r = 72`** (`2^221`, 380 kr.) | `r67 .. r72` (6 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{4096}(r+2)$ | `(395*s + 3 + 80*(s/2) + 32*(s/4) + 288*((s+1)/4) + 256*(s/8) + 64*(s%4)*(s/4)) % 512` | $5r+20$ | **`r = 56`** (`2^172`, 300 kr.) | `r51 .. r56` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{4096}(r)$ | `(337*s + 132 + 496*(s/2) + 96*(s/4) + 352*((s+1)/4) + 256*(s/8) + 192*(s%4)*(s/4)) % 512` | $5r+17$ | **`r = 54`** (`2^164`, 287 kr.) | `r49 .. r54` (6 tw.) |

*(Uwaga: dla `rle_10111` warunek kontrakcji $27 \cdot 9^{r+1} + 8192 \le 4096 \cdot 2^{3r+8}$ zachodzi aż do **`r = 71` (`2^221`, `380` kroków)**, więc dołączyłem wszystkie 7 twierdzeń `r65 .. r71`; z kolei dla `two_zero_valley_d4` dokładny pułap wynosi `r = 56` (`2^172`), czyli o $+6$ rzędów wyżej niż `r = 50` na poziomie `mod 2048`, dlatego wygenerowałem 6 nowych twierdzeń `r51 .. r56`.)*

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 55 i 56 (`mod 4096`, `v₂ ≥ 12`, 0 sorryAx)

```lean
-- =============================================================================
-- Część 55-56: Rezonanse i Kontrakcje mod 4096 (v₂ ≥ 12, okres 512)
-- =============================================================================

theorem pow9_mod4096 (k : Nat) :
    (9 ^ k) % 4096 = 1 + 8 * ((k + 8 * (k / 2) + 80 * (k / 4) + 80 * ((k + 1) / 4) +
      384 * (k / 8) + 256 * ((k + 1) / 8) + 256 * ((k + 3) / 8) +
      160 * (k % 8) * (k / 4)) % 512) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    have hp : k % 8 = 0 ∨ k % 8 = 1 ∨ k % 8 = 2 ∨ k % 8 = 3 ∨
              k % 8 = 4 ∨ k % 8 = 5 ∨ k % 8 = 6 ∨ k % 8 = 7 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7
    · have hb : (k + 1) % 8 = 1 := by omega
      rw [h0, hb]; omega
    · have hb : (k + 1) % 8 = 2 := by omega
      rw [h1, hb]; omega
    · have hb : (k + 1) % 8 = 3 := by omega
      rw [h2, hb]; omega
    · have hb : (k + 1) % 8 = 4 := by omega
      rw [h3, hb]; omega
    · have hb : (k + 1) % 8 = 5 := by omega
      rw [h4, hb]; omega
    · have hb : (k + 1) % 8 = 6 := by omega
      rw [h5, hb]; omega
    · have hb : (k + 1) % 8 = 7 := by omega
      rw [h6, hb]; omega
    · have hb : (k + 1) % 8 = 0 := by omega
      rw [h7, hb]; omega

theorem pow9_mod4096_succ (r : Nat) :
    (9 ^ (r + 1)) % 4096 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
      384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) +
      160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h4 : r + 1 + 3 = r + 4 := by omega
  have h := pow9_mod4096 (r + 1)
  rw [h2, h4] at h
  exact h

theorem pow9_mod4096_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 4096 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
      384 * ((r + 2) / 8) + 256 * ((r + 3) / 8) + 256 * ((r + 5) / 8) +
      160 * ((r + 2) % 8) * ((r + 2) / 4)) % 512) := by
  have h3 : r + 2 + 1 = r + 3 := by omega
  have h5 : r + 2 + 3 = r + 5 := by omega
  have h := pow9_mod4096 (r + 2)
  rw [h3, h5] at h
  exact h

theorem div2_step11_eq_div4096 (N : Nat) (hN : N % 4096 = 0) :
    collatzIter 11 (N / 2) = N / 4096 := by
  have s1  : collatzStep (N / 2)    = N / 4    := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)    = N / 8    := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)    = N / 16   := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)   = N / 32   := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)   = N / 64   := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)   = N / 128  := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)  = N / 256  := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)  = N / 512  := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)  = N / 1024 := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024) = N / 2048 := by unfold collatzStep; split <;> omega
  have s11 : collatzStep (N / 2048) = N / 4096 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2))))))))))) = N / 4096
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11]

theorem mod4096_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 4096 = b)
    (hge : c ≤ A * M * (4096 * W + u0))
    (hres : (A * u0 * b) % 4096 = c % 4096) :
    (A * M * (4096 * W + u0) - c) % 4096 = 0 := by
  have h1 : (A * M * (4096 * W + u0)) % 4096 = (A * u0 * b) % 4096 := by
    have hcomm : A * M * (4096 * W + u0) = A * (4096 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (4096 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (4096 * W + u0)) % 4096 = (A * u0) % 4096 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 4096, Nat.mul_assoc]
      omega
    have h3 : (M % 4096) = (b % 4096) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod4096`, faza `3r + 3`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod4096_resonance_step17 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 4096 := by
  intro s U
  let tFn := fun x => (113 * x + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 17 = 11 + (5 * r + 6) := by omega
  have hU : U = 2 * (2048 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (2048 * W + 3 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ (r + 1)) % 4096 = 1 + 8 * s := pow9_mod4096_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 4096 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (4096 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (4096 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 1 7 7 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (9 ^ (r + 1) * U - 7) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod4096 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (9 ^ (r + 1) * U - 7) hdiv4096

theorem two_zero_valley_mod4096_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 4096 ≤ 4096 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (9 ^ (r + 1) * U - 7) / 4096 :=
    two_zero_valley_mod4096_resonance_step17 r W
  have hle : (9 ^ (r + 1) + 4096) * U ≤ (4096 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (113 * x + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4103 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 113 := by rw [hs0]
      have hU0 : U ≥ 911 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 410 := by rw [hs1]
        have hU1 : U ≥ 3287 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  have hlt : collatzIter (5 * r + 17) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod4096`, faza `3r + 3`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod4096_resonance_step17 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 4096 := by
  intro s U
  let tFn := fun x => (227 * x + 208 * (x / 2) + 288 * (x / 4) + 32 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 17 = 11 + (5 * r + 6) := by omega
  have hU : U = 2 * (2048 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (2048 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod4096 : (9 ^ (r + 1)) % 4096 = 1 + 8 * s := pow9_mod4096_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 4096 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (4096 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (4096 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 1 5 5 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (9 ^ (r + 1) * U - 5) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod4096 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (9 ^ (r + 1) * U - 5) hdiv4096

theorem shifted_valley_mod4096_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 4096 ≤ 4096 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (9 ^ (r + 1) * U - 5) / 4096 :=
    shifted_valley_mod4096_resonance_step17 r W
  have hle : (9 ^ (r + 1) + 4096) * U ≤ (4096 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (227 * x + 208 * (x / 2) + 288 * (x / 4) + 32 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4101 ≤ 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 227 := by rw [hs0]
      have hU0 : U ≥ 1821 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 366 := by rw [hs1]
        have hU1 : U ≥ 2933 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 91 := rfl
          have ht2 : tFn s = 97 := by rw [hs2]
          have hU2 : U ≥ 781 := by rw [ht2] at hU_def; omega
          have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
          omega
        | succ r''' =>
          have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hval3 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by omega
          have hmul := Nat.mul_le_mul_right U hval3
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  have hlt : collatzIter (5 * r + 17) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod4096`, `3r + 7`, `5r + 23` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod4096_resonance_step23 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 384 * ((r + 2) / 8) + 256 * ((r + 3) / 8) + 256 * ((r + 5) / 8) + 160 * ((r + 2) % 8) * ((r + 2) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 23) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 4096 := by
  intro s U
  let tFn := fun x => (113 * x + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 23 = 11 + (5 * r + 12) := by omega
  have hU : U = 2 * (2048 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (2048 * W + 3 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ (r + 2)) % 4096 = 1 + 8 * s := pow9_mod4096_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 4096 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (4096 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (4096 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 1 7 7 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (9 ^ (r + 2) * U - 7) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod4096 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (9 ^ (r + 2) * U - 7) hdiv4096

theorem rle_10011_mod4096_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 8192 ≤ 4096 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 384 * ((r + 2) / 8) + 256 * ((r + 3) / 8) + 256 * ((r + 5) / 8) + 160 * ((r + 2) % 8) * ((r + 2) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 23) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 23) n0 = (9 ^ (r + 2) * U - 7) / 4096 :=
    rle_10011_mod4096_resonance_step23 r W
  have hle : (9 ^ (r + 2) + 8192) * U ≤ (4096 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (113 * x + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4103 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 410 := by rw [hs0]
      have hU0 : U ≥ 3287 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 729 ≤ 9 ^ (r' + 1 + 2) := by
        rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 729 ≤ 9 ^ (r' + 1 + 2) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  have hlt : collatzIter (5 * r + 23) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 23) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 23) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod4096`, `3r + 8`, `5r + 25` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod4096_resonance_step25 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((99 * s + 208 + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 25) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 4096 := by
  intro s U
  let tFn := fun x => (99 * x + 208 + 208 * (x / 2) + 288 * (x / 4) + 32 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 25 = 11 + (5 * r + 14) := by omega
  have hU : U = 2 * (2048 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (2048 * W + 2 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ (r + 1)) % 4096 = 1 + 8 * s := pow9_mod4096_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 4096 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (4096 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (4096 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 27 5 7 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (27 * 9 ^ (r + 1) * U - 7) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod4096 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (27 * 9 ^ (r + 1) * U - 7) hdiv4096

theorem rle_10111_mod4096_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 8192 ≤ 4096 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((99 * s + 208 + 208 * (s / 2) + 288 * (s / 4) + 32 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 25) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 25) n0 = (27 * 9 ^ (r + 1) * U - 7) / 4096 :=
    rle_10111_mod4096_resonance_step25 r W
  have hle : (27 * 9 ^ (r + 1) + 8192) * U ≤ (4096 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (99 * x + 208 + 208 * (x / 2) + 288 * (x / 4) + 32 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4103 ≤ 27 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 307 := by rw [hs0]
      have hU0 : U ≥ 2461 := by rw [ht0] at hU_def; omega
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      omega
    | succ r' =>
      have hpow9 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 2187 ≤ 27 * 9 ^ (r' + 1 + 1) := by omega
      have hmul := Nat.mul_le_mul_right U hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  have hlt : collatzIter (5 * r + 25) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 25) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 25) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod4096`, `3r + 1`, `5r + 14` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod4096_resonance_step14 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 384 * (r / 8) + 256 * ((r + 1) / 8) + 256 * ((r + 3) / 8) + 160 * (r % 8) * (r / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((379 * s + 341 + 336 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 14) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 4096 := by
  intro s U
  let tFn := fun x => (379 * x + 341 + 336 * (x / 2) + 32 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 14 = 11 + (5 * r + 3) := by omega
  have hU : U = 2 * (2048 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (2048 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod4096 : (9 ^ r) % 4096 = 1 + 8 * s := pow9_mod4096 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 4096 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (4096 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (4096 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 3 5 7 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (3 * 9 ^ r * U - 7) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod4096 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (3 * 9 ^ r * U - 7) hdiv4096

theorem shifted_valley_d1_mod4096_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 4096 ≤ 4096 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 384 * (r / 8) + 256 * ((r + 1) / 8) + 256 * ((r + 3) / 8) + 160 * (r % 8) * (r / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((379 * s + 341 + 336 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 14) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 14) n0 = (3 * 9 ^ r * U - 7) / 4096 :=
    shifted_valley_d1_mod4096_resonance_step14 r W
  have hle : (3 * 9 ^ r + 4096) * U ≤ (4096 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (379 * x + 341 + 336 * (x / 2) + 32 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4103 ≤ 3 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 341 := by rw [hs0]
      have hU0 : U ≥ 2733 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ 0 * U = 3 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 208 := by rw [hs1]
        have hU1 : U ≥ 1669 := by rw [ht1] at hU_def; omega
        have hpow1 : 3 * 9 ^ 1 * U = 27 * U := rfl
        omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 10 := rfl
          have ht2 : tFn s = 307 := by rw [hs2]
          have hU2 : U ≥ 2461 := by rw [ht2] at hU_def; omega
          have hpow2 : 3 * 9 ^ 2 * U = 243 * U := rfl
          omega
        | succ r''' =>
          have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hval3 : 2187 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1) := by omega
          have hmul := Nat.mul_le_mul_right U hval3
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  have hlt : collatzIter (5 * r + 14) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 14) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 14) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod4096`, `3r + 5`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod4096_resonance_step20 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((417 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 4096 := by
  intro s U
  let tFn := fun x => (417 * x + 170 + 240 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 20 = 11 + (5 * r + 9) := by omega
  have hU : U = 2 * (2048 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (2048 * W + 3 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ (r + 1)) % 4096 = 1 + 8 * s := pow9_mod4096_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 4096 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (4096 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (4096 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 3 7 5 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (3 * 9 ^ (r + 1) * U - 5) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod4096 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (3 * 9 ^ (r + 1) * U - 5) hdiv4096

theorem two_zero_valley_d5_mod4096_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 4096 ≤ 4096 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 384 * ((r + 1) / 8) + 256 * ((r + 2) / 8) + 256 * ((r + 4) / 8) + 160 * ((r + 1) % 8) * ((r + 1) / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((417 * s + 170 + 240 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (3 * 9 ^ (r + 1) * U - 5) / 4096 :=
    two_zero_valley_d5_mod4096_resonance_step20 r W
  have hle : (3 * 9 ^ (r + 1) + 4096) * U ≤ (4096 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (417 * x + 170 + 240 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4101 ≤ 3 * 9 ^ (r + 1) * U := by
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 75 := by rw [hs0]
      have hU0 : U ≥ 607 := by rw [ht0] at hU_def; omega
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 292 := by rw [hs1]
        have hU1 : U ≥ 2343 := by rw [ht1] at hU_def; omega
        have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 3 * 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  have hlt : collatzIter (5 * r + 20) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod4096`, `3r + 4`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod4096_resonance_step20 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 384 * ((r + 2) / 8) + 256 * ((r + 3) / 8) + 256 * ((r + 5) / 8) + 160 * ((r + 2) % 8) * ((r + 2) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((395 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 4096 := by
  intro s U
  let tFn := fun x => (395 * x + 3 + 80 * (x / 2) + 32 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 20 = 11 + (5 * r + 9) := by omega
  have hU : U = 2 * (2048 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (2048 * W + 2 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ (r + 2)) % 4096 = 1 + 8 * s := pow9_mod4096_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 4096 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (4096 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (4096 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 1 5 29 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (9 ^ (r + 2) * U - 29) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod4096 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (9 ^ (r + 2) * U - 29) hdiv4096

theorem two_zero_valley_d4_mod4096_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 8192 ≤ 4096 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 384 * ((r + 2) / 8) + 256 * ((r + 3) / 8) + 256 * ((r + 5) / 8) + 160 * ((r + 2) % 8) * ((r + 2) / 4)) % 512
    let U := 4096 * W + 5 + 8 * ((395 * s + 3 + 80 * (s / 2) + 32 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 64 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (9 ^ (r + 2) * U - 29) / 4096 :=
    two_zero_valley_d4_mod4096_resonance_step20 r W
  have hle : (9 ^ (r + 2) + 8192) * U ≤ (4096 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (395 * x + 3 + 80 * (x / 2) + 32 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 64 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 5 + 8 * tFn s := rfl
  have hU_ge : U ≥ 5 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4125 ≤ 9 ^ (r + 2) * U := by
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 385 := by rw [hs0]
      have hU0 : U ≥ 3085 := by rw [ht0] at hU_def; omega
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 91 := rfl
        have ht1 : tFn s = 156 := by rw [hs1]
        have hU1 : U ≥ 1253 := by rw [ht1] at hU_def; omega
        have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  have hlt : collatzIter (5 * r + 20) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod4096`, `3r + 2`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod4096_resonance_step17 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 384 * (r / 8) + 256 * ((r + 1) / 8) + 256 * ((r + 3) / 8) + 160 * (r % 8) * (r / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((337 * s + 132 + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 4096 := by
  intro s U
  let tFn := fun x => (337 * x + 132 + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 17 = 11 + (5 * r + 6) := by omega
  have hU : U = 2 * (2048 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 11 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (2048 * W + 3 + 4 * t), ← hU]
  have h9_mod4096 : (9 ^ r) % 4096 = 1 + 8 * s := pow9_mod4096 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 4096 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (4096 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (4096 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 512 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 4096 27 7 29 tFn 32 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv4096 : (27 * 9 ^ r * U - 29) % 4096 = 0 := by
    have h1 := mod4096_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod4096 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step11_eq_div4096 (27 * 9 ^ r * U - 29) hdiv4096

theorem shifted_valley_d2_mod4096_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 4096 ≤ 4096 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 384 * (r / 8) + 256 * ((r + 1) / 8) + 256 * ((r + 3) / 8) + 160 * (r % 8) * (r / 4)) % 512
    let U := 4096 * W + 7 + 8 * ((337 * s + 132 + 496 * (s / 2) + 96 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 192 * (s % 4) * (s / 4)) % 512)
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (27 * 9 ^ r * U - 29) / 4096 :=
    shifted_valley_d2_mod4096_resonance_step17 r W
  have hle : (27 * 9 ^ r + 4096) * U ≤ (4096 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 4096 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (337 * x + 132 + 496 * (x / 2) + 96 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 192 * (x % 4) * (x / 4)) % 512
  have hU_def : U = 4096 * W + 7 + 8 * tFn s := rfl
  have hU_ge : U ≥ 7 := by generalize tFn s = t at hU_def; omega
  have hX_ge : 4125 ≤ 27 * 9 ^ r * U := by
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 132 := by rw [hs0]
      have hU0 : U ≥ 1063 := by rw [ht0] at hU_def; omega
      have hpow0 : 27 * 9 ^ 0 * U = 27 * U := rfl
      omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 469 := by rw [hs1]
        have hU1 : U ≥ 3759 := by rw [ht1] at hU_def; omega
        have hpow1 : 27 * 9 ^ 1 * U = 243 * U := rfl
        omega
      | succ r'' =>
        have hpow9 : 81 ≤ 9 ^ (r'' + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 27 * 9 ^ (r'' + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right U hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  have hlt : collatzIter (5 * r + 17) n0 < n0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) n0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) n0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- Konkretne twierdzenia horyzontowe _mod4096_drop_r...
-- -----------------------------------------------------------------------------

theorem two_zero_valley_mod4096_drop_r64 (W : Nat) : HasHorizonDrop ((4096 * W + 3471) * 2 ^ 195 - 7) := (two_zero_valley_mod4096_contraction 64 W (by decide)).2
theorem two_zero_valley_mod4096_drop_r65 (W : Nat) : HasHorizonDrop ((4096 * W + 1751) * 2 ^ 198 - 7) := (two_zero_valley_mod4096_contraction 65 W (by decide)).2
theorem two_zero_valley_mod4096_drop_r66 (W : Nat) : HasHorizonDrop ((4096 * W + 2015) * 2 ^ 201 - 7) := (two_zero_valley_mod4096_contraction 66 W (by decide)).2
theorem two_zero_valley_mod4096_drop_r67 (W : Nat) : HasHorizonDrop ((4096 * W + 679) * 2 ^ 204 - 7) := (two_zero_valley_mod4096_contraction 67 W (by decide)).2
theorem two_zero_valley_mod4096_drop_r68 (W : Nat) : HasHorizonDrop ((4096 * W + 2351) * 2 ^ 207 - 7) := (two_zero_valley_mod4096_contraction 68 W (by decide)).2
theorem two_zero_valley_mod4096_drop_r69 (W : Nat) : HasHorizonDrop ((4096 * W + 3447) * 2 ^ 210 - 7) := (two_zero_valley_mod4096_contraction 69 W (by decide)).2

theorem shifted_valley_mod4096_drop_r64 (W : Nat) : HasHorizonDrop ((4096 * W + 1309) * 2 ^ 195 - 5) := (shifted_valley_mod4096_contraction 64 W (by decide)).2
theorem shifted_valley_mod4096_drop_r65 (W : Nat) : HasHorizonDrop ((4096 * W + 2421) * 2 ^ 198 - 5) := (shifted_valley_mod4096_contraction 65 W (by decide)).2
theorem shifted_valley_mod4096_drop_r66 (W : Nat) : HasHorizonDrop ((4096 * W + 269) * 2 ^ 201 - 5) := (shifted_valley_mod4096_contraction 66 W (by decide)).2
theorem shifted_valley_mod4096_drop_r67 (W : Nat) : HasHorizonDrop ((4096 * W + 485) * 2 ^ 204 - 5) := (shifted_valley_mod4096_contraction 67 W (by decide)).2
theorem shifted_valley_mod4096_drop_r68 (W : Nat) : HasHorizonDrop ((4096 * W + 509) * 2 ^ 207 - 5) := (shifted_valley_mod4096_contraction 68 W (by decide)).2
theorem shifted_valley_mod4096_drop_r69 (W : Nat) : HasHorizonDrop ((4096 * W + 1877) * 2 ^ 210 - 5) := (shifted_valley_mod4096_contraction 69 W (by decide)).2

theorem rle_10011_mod4096_drop_r69 (W : Nat) : HasHorizonDrop ((4096 * W + 383) * 2 ^ 214 - 13) := (rle_10011_mod4096_contraction 69 W (by decide)).2
theorem rle_10011_mod4096_drop_r70 (W : Nat) : HasHorizonDrop ((4096 * W + 1863) * 2 ^ 217 - 13) := (rle_10011_mod4096_contraction 70 W (by decide)).2
theorem rle_10011_mod4096_drop_r71 (W : Nat) : HasHorizonDrop ((4096 * W + 207) * 2 ^ 220 - 13) := (rle_10011_mod4096_contraction 71 W (by decide)).2
theorem rle_10011_mod4096_drop_r72 (W : Nat) : HasHorizonDrop ((4096 * W + 23) * 2 ^ 223 - 13) := (rle_10011_mod4096_contraction 72 W (by decide)).2
theorem rle_10011_mod4096_drop_r73 (W : Nat) : HasHorizonDrop ((4096 * W + 1823) * 2 ^ 226 - 13) := (rle_10011_mod4096_contraction 73 W (by decide)).2
theorem rle_10011_mod4096_drop_r74 (W : Nat) : HasHorizonDrop ((4096 * W + 2023) * 2 ^ 229 - 13) := (rle_10011_mod4096_contraction 74 W (by decide)).2

theorem rle_10111_mod4096_drop_r65 (W : Nat) : HasHorizonDrop ((4096 * W + 2037) * 2 ^ 203 - 9) := (rle_10111_mod4096_contraction 65 W (by decide)).2
theorem rle_10111_mod4096_drop_r66 (W : Nat) : HasHorizonDrop ((4096 * W + 2957) * 2 ^ 206 - 9) := (rle_10111_mod4096_contraction 66 W (by decide)).2
theorem rle_10111_mod4096_drop_r67 (W : Nat) : HasHorizonDrop ((4096 * W + 2149) * 2 ^ 209 - 9) := (rle_10111_mod4096_contraction 67 W (by decide)).2
theorem rle_10111_mod4096_drop_r68 (W : Nat) : HasHorizonDrop ((4096 * W + 1149) * 2 ^ 212 - 9) := (rle_10111_mod4096_contraction 68 W (by decide)).2
theorem rle_10111_mod4096_drop_r69 (W : Nat) : HasHorizonDrop ((4096 * W + 1493) * 2 ^ 215 - 9) := (rle_10111_mod4096_contraction 69 W (by decide)).2
theorem rle_10111_mod4096_drop_r70 (W : Nat) : HasHorizonDrop ((4096 * W + 621) * 2 ^ 218 - 9) := (rle_10111_mod4096_contraction 70 W (by decide)).2
theorem rle_10111_mod4096_drop_r71 (W : Nat) : HasHorizonDrop ((4096 * W + 69) * 2 ^ 221 - 9) := (rle_10111_mod4096_contraction 71 W (by decide)).2

theorem shifted_valley_d1_mod4096_drop_r62 (W : Nat) : HasHorizonDrop ((4096 * W + 3773) * 2 ^ 187 - 5) := (shifted_valley_d1_mod4096_contraction 62 W (by decide)).2
theorem shifted_valley_d1_mod4096_drop_r63 (W : Nat) : HasHorizonDrop ((4096 * W + 3605) * 2 ^ 190 - 5) := (shifted_valley_d1_mod4096_contraction 63 W (by decide)).2
theorem shifted_valley_d1_mod4096_drop_r64 (W : Nat) : HasHorizonDrop ((4096 * W + 2221) * 2 ^ 193 - 5) := (shifted_valley_d1_mod4096_contraction 64 W (by decide)).2
theorem shifted_valley_d1_mod4096_drop_r65 (W : Nat) : HasHorizonDrop ((4096 * W + 1157) * 2 ^ 196 - 5) := (shifted_valley_d1_mod4096_contraction 65 W (by decide)).2
theorem shifted_valley_d1_mod4096_drop_r66 (W : Nat) : HasHorizonDrop ((4096 * W + 1949) * 2 ^ 199 - 5) := (shifted_valley_d1_mod4096_contraction 66 W (by decide)).2
theorem shifted_valley_d1_mod4096_drop_r67 (W : Nat) : HasHorizonDrop ((4096 * W + 2037) * 2 ^ 202 - 5) := (shifted_valley_d1_mod4096_contraction 67 W (by decide)).2

theorem two_zero_valley_d5_mod4096_drop_r67 (W : Nat) : HasHorizonDrop ((4096 * W + 1527) * 2 ^ 206 - 7) := (two_zero_valley_d5_mod4096_contraction 67 W (by decide)).2
theorem two_zero_valley_d5_mod4096_drop_r68 (W : Nat) : HasHorizonDrop ((4096 * W + 1535) * 2 ^ 209 - 7) := (two_zero_valley_d5_mod4096_contraction 68 W (by decide)).2
theorem two_zero_valley_d5_mod4096_drop_r69 (W : Nat) : HasHorizonDrop ((4096 * W + 1991) * 2 ^ 212 - 7) := (two_zero_valley_d5_mod4096_contraction 69 W (by decide)).2
theorem two_zero_valley_d5_mod4096_drop_r70 (W : Nat) : HasHorizonDrop ((4096 * W + 3407) * 2 ^ 215 - 7) := (two_zero_valley_d5_mod4096_contraction 70 W (by decide)).2
theorem two_zero_valley_d5_mod4096_drop_r71 (W : Nat) : HasHorizonDrop ((4096 * W + 2199) * 2 ^ 218 - 7) := (two_zero_valley_d5_mod4096_contraction 71 W (by decide)).2
theorem two_zero_valley_d5_mod4096_drop_r72 (W : Nat) : HasHorizonDrop ((4096 * W + 2975) * 2 ^ 221 - 7) := (two_zero_valley_d5_mod4096_contraction 72 W (by decide)).2

theorem two_zero_valley_d4_mod4096_drop_r51 (W : Nat) : HasHorizonDrop ((4096 * W + 2261) * 2 ^ 157 - 7) := (two_zero_valley_d4_mod4096_contraction 51 W (by decide)).2
theorem two_zero_valley_d4_mod4096_drop_r52 (W : Nat) : HasHorizonDrop ((4096 * W + 3437) * 2 ^ 160 - 7) := (two_zero_valley_d4_mod4096_contraction 52 W (by decide)).2
theorem two_zero_valley_d4_mod4096_drop_r53 (W : Nat) : HasHorizonDrop ((4096 * W + 837) * 2 ^ 163 - 7) := (two_zero_valley_d4_mod4096_contraction 53 W (by decide)).2
theorem two_zero_valley_d4_mod4096_drop_r54 (W : Nat) : HasHorizonDrop ((4096 * W + 93) * 2 ^ 166 - 7) := (two_zero_valley_d4_mod4096_contraction 54 W (by decide)).2
theorem two_zero_valley_d4_mod4096_drop_r55 (W : Nat) : HasHorizonDrop ((4096 * W + 2741) * 2 ^ 169 - 7) := (two_zero_valley_d4_mod4096_contraction 55 W (by decide)).2
theorem two_zero_valley_d4_mod4096_drop_r56 (W : Nat) : HasHorizonDrop ((4096 * W + 2125) * 2 ^ 172 - 7) := (two_zero_valley_d4_mod4096_contraction 56 W (by decide)).2

theorem shifted_valley_d2_mod4096_drop_r49 (W : Nat) : HasHorizonDrop ((4096 * W + 559) * 2 ^ 149 - 5) := (shifted_valley_d2_mod4096_contraction 49 W (by decide)).2
theorem shifted_valley_d2_mod4096_drop_r50 (W : Nat) : HasHorizonDrop ((4096 * W + 3703) * 2 ^ 152 - 5) := (shifted_valley_d2_mod4096_contraction 50 W (by decide)).2
theorem shifted_valley_d2_mod4096_drop_r51 (W : Nat) : HasHorizonDrop ((4096 * W + 2687) * 2 ^ 155 - 5) := (shifted_valley_d2_mod4096_contraction 51 W (by decide)).2
theorem shifted_valley_d2_mod4096_drop_r52 (W : Nat) : HasHorizonDrop ((4096 * W + 2119) * 2 ^ 158 - 5) := (shifted_valley_d2_mod4096_contraction 52 W (by decide)).2
theorem shifted_valley_d2_mod4096_drop_r53 (W : Nat) : HasHorizonDrop ((4096 * W + 2511) * 2 ^ 161 - 5) := (shifted_valley_d2_mod4096_contraction 53 W (by decide)).2
theorem shifted_valley_d2_mod4096_drop_r54 (W : Nat) : HasHorizonDrop ((4096 * W + 279) * 2 ^ 164 - 5) := (shifted_valley_d2_mod4096_contraction 54 W (by decide)).2

```

---

# Runda 6 Debaty: Domknięcie kaskad rezonansowych `mod 8192` ($v_2 \ge 13$, okres 1024, Części 57 i 58) — 67 twierdzeń i przekroczenie bariery `2^247` (`424` kroków!)

## 1. Zwarta postać biliniowa dla `pow9_mod8192` (okres 1024, $v_2 = 13$) i optymalizacja `clear` dla `omega`

Dla dowolnego wykładnika $k \in \mathbb{N}$ reszta $(9^k) \bmod 8192 = 1 + 8 \cdot s_{8192}(k)$, gdzie indeks $s_{8192}(k) = \frac{9^k - 1}{8} \bmod 1024$ ma okres $1024$. Rozkładając $k = 8q + r$ ($r = k \bmod 8 \in \{0, \dots, 7\}$, $q = \lfloor k/8 \rfloor$), część kwadratowa względem $q$ sprowadza się modulo $1024$ do $512 \cdot \frac{q(q-1)}{2} \equiv 512 \cdot \lfloor q/2 \rfloor = 512 \cdot \lfloor k/16 \rfloor \pmod{1024}$, natomiast nachylenie części biliniowej względem $\lfloor k/4 \rfloor$ wyraża się przez pojedynczą resztę $k \bmod 8$:

$$s_{8192}(k) = \left(k + 8\lfloor k/2 \rfloor + 80\lfloor k/4 \rfloor + 80\lfloor (k+1)/4 \rfloor + 896\lfloor k/8 \rfloor + 512\lfloor (k+1)/8 \rfloor + 512\lfloor k/16 \rfloor + \left(416(k \bmod 8) + 256\lfloor ((k \bmod 8) \bmod 4)/2 \rfloor\right)\lfloor k/4 \rfloor\right) \bmod 1024$$

### Dwie kluczowe optymalizacje dowodowe w Lean 4 (`0 sorryAx`, domyślny `maxHeartbeats 200000`):
1. **9-gałęziowa indukcja w `pow9_mod8192` z `clear ih` i `dsimp`:**
   Ponieważ dla $k \bmod 8 \in \{0, 1, 2, 3, 4, 5, 6\}$ zachodzi $\lfloor (k+1)/16 \rfloor = \lfloor k/16 \rfloor$, podstawienie `h16 : (k + 1) / 16 = k / 16` i `generalize k / 16 = q16` całkowicie eliminuje dzielenie przez $16$ w 7 z 8 klas reszt modulo $8$ ($9 \cdot 512 \cdot q_{16} - 512 \cdot q_{16} = 4096 \cdot q_{16} \equiv 0 \pmod{1024}$), a jedynie klasa $k \bmod 8 = 7$ rozgałęzia się na $k \bmod 16 \in \{7, 15\}$. Ponadto użycie `clear ih` po `rw [Nat.pow_succ, Nat.mul_mod, ih]` oraz `dsimp` po podstawieniu reszty $k \bmod 8$ usuwa nieliniowe wyrażenia z kontekstu `omega`.
2. **Eliminacja rozwijania `let`-wiązań (`s`, `U`, `n0`) przez `omega` w twierdzeniach `_contraction`:**
   W Lean 4 taktyka `omega` automatycznie rozwija wszystkie lokalne definicje `let` typu `Nat` obecne w kontekście (nawet gdy nie występują w celu!). Ponieważ $U$ zawiera 7 wystąpień $s$, każde wywołanie `omega` z aktywnymi `let`-wiązaniami `s` i `U` budowało układ Presburgera ze $>100$ zmiennymi dzielenia całkowitego. Użycie `generalize U = u ...; clear n0 U s tFn` przed wywołaniem `omega` przyspieszyło dowody `_contraction` **7-krotnie** (z `~6.5 s` do `~0.85 s` na twierdzenie!).
3. **Weryfikator tabelaryczny `checkResonanceGrid16_sound` na siatce $64 \times 16 = 1024$:**
   Istniejący dwuwymiarowy weryfikator `checkResonanceGrid16_sound 8192 A uBase c tFn 64 (by decide) s hs_lt` (64 wiersze po 16 kolumn) ma głębokość rekursji $64 + 16 = 80 \ll 512$ (`maxRecDepth`) i zamyka każde z 8 twierdzeń rezonansowych w `~1.4 s` bez potrzeby definiowania nowej siatki.

## 2. Uniwersalna struktura odwrotności modularnych $t_{8192}(s) \bmod 1024$ dla wszystkich 8 rodzin

Zastąpienie czynnika $(s \bmod 4)$ przez $(s \bmod 8)$ w członie biliniowym z poziomu `mod 4096` automatycznie kompensuje skok kwadratowy $512 \cdot \lfloor s/8 \rfloor$ na nieparzystych czwórkach $s \bmod 8 \in \{4, 5, 6, 7\}$, dzięki czemu wszystkie 8 rodzin na poziomie `mod 8192` zachowuje **symetryczne współczynniki przy $\lfloor s/4 \rfloor$ i $\lfloor (s+1)/4 \rfloor$** oraz dzieli się na dwie grupy:

1. **Grupa I ($u_{\text{base}} = 7$: `two_zero_valley`, `rle_10011`, `two_zero_valley_d5`, `shifted_valley_d2`)** — wspólny ogon `+ 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)`:
   - `two_zero_valley` i `rle_10011`: `(113 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024`
   - `two_zero_valley_d5`: `(417 * s + 682 + 752 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024`
   - `shifted_valley_d2`: `(337 * s + 644 + 1008 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024`
2. **Grupa II ($u_{\text{base}} = 5$: `shifted_valley`, `rle_10111`, `shifted_valley_d1`, `two_zero_valley_d4`)** — wspólny człon biliniowy `+ 64 * (s % 8) * (s / 4)`:
   - `shifted_valley`: `(227 * s + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024`
   - `rle_10111`: `(611 * s + 720 + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024`
   - `shifted_valley_d1`: `(379 * s + 341 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024`
   - `two_zero_valley_d4`: `(907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024`

## 3. Zestawienie wszystkich 8 rodzin na poziomie `mod 8192` (`v₂ ≥ 13`, okres 1024)

| # | Rodzina | Licznik $\equiv 0 \pmod{8192}$ | Indeks $s$ | Wzór biliniowy na $t(s) \bmod 1024$ | Kroki | Pułap $r_{\max}$ (`mod 8192`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{8192}(r+1)$ | `(113*s + 496*(s/2) + 352*(s/4) + 352*((s+1)/4) + 768*(s/8) + 512*((s+2)/8) + 192*(s%8)*(s/4)) % 1024` | $5r+18$ | **`r = 75`** (`2^228`, 393 kr.) | `r70 .. r75` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{8192}(r+1)$ | `(227*s + 208*(s/2) + 544*(s/4) + 544*((s+1)/4) + 768*(s/8) + 512*((s+1)/8) + 512*((s+3)/8) + 64*(s%8)*(s/4)) % 1024` | $5r+18$ | **`r = 75`** (`2^228`, 393 kr.) | `r70 .. r75` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{8192}(r+2)$ | `(113*s + 496*(s/2) + 352*(s/4) + 352*((s+1)/4) + 768*(s/8) + 512*((s+2)/8) + 192*(s%8)*(s/4)) % 1024` | $5r+24$ | **`r = 80`** (`2^247`, **424 kr.**) | `r75 .. r80` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{8192}(r+1)$ | `(611*s + 720 + 208*(s/2) + 544*(s/4) + 544*((s+1)/4) + 768*(s/8) + 512*((s+1)/8) + 512*((s+3)/8) + 64*(s%8)*(s/4)) % 1024` | $5r+26$ | **`r = 76`** (`2^236`, 406 kr.) | `r72 .. r76` (5 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{8192}(r)$ | `(379*s + 341 + 848*(s/2) + 800*(s/4) + 800*((s+1)/4) + 256*(s/8) + 512*((s+2)/8) + 64*(s%8)*(s/4)) % 1024` | $5r+15$ | **`r = 73`** (`2^220`, 380 kr.) | `r68 .. r73` (6 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{8192}(r+1)$ | `(417*s + 682 + 752*(s/2) + 864*(s/4) + 864*((s+1)/4) + 768*(s/8) + 512*((s+2)/8) + 192*(s%8)*(s/4)) % 1024` | $5r+21$ | **`r = 77`** (`2^236`, 406 kr.) | `r73 .. r77` (5 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{8192}(r+2)$ | `(907*s + 3 + 592*(s/2) + 288*(s/4) + 288*((s+1)/4) + 256*(s/8) + 512*((s+2)/8) + 64*(s%8)*(s/4)) % 1024` | $5r+21$ | **`r = 62`** (`2^190`, 331 kr.) | `r57 .. r62` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{8192}(r)$ | `(337*s + 644 + 1008*(s/2) + 352*(s/4) + 352*((s+1)/4) + 768*(s/8) + 512*((s+2)/8) + 192*(s%8)*(s/4)) % 1024` | $5r+18$ | **`r = 60`** (`2^182`, 318 kr.) | `r55 .. r60` (6 tw.) |

*(Uwaga: dla `rle_10011` nierówność kontrakcji $9^{r+2} + 16384 \le 8192 \cdot 2^{3r+7}$ zachodzi aż do **`r = 80`** — ponieważ $82 \log_2 9 \approx 259.93385 < 260 = 13 + 3 \cdot 80 + 7$ — co pozwala osiągnąć rekordowy pułap **`2^247` w `424` krokach Collatza** i daje 6 nowych twierdzeń `r75 .. r80`! Z kolei dla `rle_10111` dokładny pułap wynosi `r = 76` (`2^236`, `406` kroków), co daje 5 nowych twierdzeń `r72 .. r76` ponad `r71` z poziomu `mod 4096`.)*

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 57 i 58 (`mod 8192`, `v₂ ≥ 13`, 0 sorryAx)

```lean
-- =============================================================================
-- Część 57-58: Rezonanse i Kontrakcje mod 8192 (v₂ ≥ 13, okres 1024)
-- =============================================================================

theorem pow9_mod8192 (k : Nat) :
    (9 ^ k) % 8192 = 1 + 8 * ((k + 8 * (k / 2) + 80 * (k / 4) + 80 * ((k + 1) / 4) +
      896 * (k / 8) + 512 * ((k + 1) / 8) + 512 * (k / 16) +
      (416 * (k % 8) + 256 * ((k % 8) % 4 / 2)) * (k / 4)) % 1024) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    clear ih
    have hp : k % 8 = 0 ∨ k % 8 = 1 ∨ k % 8 = 2 ∨ k % 8 = 3 ∨
              k % 8 = 4 ∨ k % 8 = 5 ∨ k % 8 = 6 ∨ k % 16 = 7 ∨ k % 16 = 15 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7 | h15
    · have hb : (k + 1) % 8 = 1 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h0, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 2 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h1, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 3 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h2, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 4 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h3, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 5 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h4, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 6 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h5, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 8 = 7 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h6, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have ha : k % 8 = 7 := by omega
      have hb : (k + 1) % 8 = 0 := by omega
      rw [ha, hb]; dsimp; omega
    · have ha : k % 8 = 7 := by omega
      have hb : (k + 1) % 8 = 0 := by omega
      rw [ha, hb]; dsimp; omega

theorem pow9_mod8192_succ (r : Nat) :
    (9 ^ (r + 1)) % 8192 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) +
      896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) +
      (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h := pow9_mod8192 (r + 1)
  rw [h2] at h
  exact h

theorem pow9_mod8192_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 8192 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) +
      896 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 512 * ((r + 2) / 16) +
      (416 * ((r + 2) % 8) + 256 * (((r + 2) % 8) % 4 / 2)) * ((r + 2) / 4)) % 1024) := by
  have h3 : r + 2 + 1 = r + 3 := by omega
  have h := pow9_mod8192 (r + 2)
  rw [h3] at h
  exact h

theorem div2_step12_eq_div8192 (N : Nat) (hN : N % 8192 = 0) :
    collatzIter 12 (N / 2) = N / 8192 := by
  have s1  : collatzStep (N / 2)    = N / 4    := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)    = N / 8    := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)    = N / 16   := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)   = N / 32   := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)   = N / 64   := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)   = N / 128  := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)  = N / 256  := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)  = N / 512  := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)  = N / 1024 := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024) = N / 2048 := by unfold collatzStep; split <;> omega
  have s11 : collatzStep (N / 2048) = N / 4096 := by unfold collatzStep; split <;> omega
  have s12 : collatzStep (N / 4096) = N / 8192 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2)))))))))))) = N / 8192
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12]

theorem mod8192_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 8192 = b)
    (hge : c ≤ A * M * (8192 * W + u0))
    (hres : (A * u0 * b) % 8192 = c % 8192) :
    (A * M * (8192 * W + u0) - c) % 8192 = 0 := by
  have h1 : (A * M * (8192 * W + u0)) % 8192 = (A * u0 * b) % 8192 := by
    have hcomm : A * M * (8192 * W + u0) = A * (8192 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (8192 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (8192 * W + u0)) % 8192 = (A * u0) % 8192 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 8192, Nat.mul_assoc]
      omega
    have h3 : (M % 8192) = (b % 8192) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod8192`, faza `3r + 3`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod8192_resonance_step18 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 8192 := by
  intro s U
  let tFn := fun x => (113 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 12 + (5 * r + 6) := by omega
  have hU : U = 2 * (4096 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (4096 * W + 3 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ (r + 1)) % 8192 = 1 + 8 * s := pow9_mod8192_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 8192 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (8192 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (8192 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (9 ^ (r + 1) * U - 7) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod8192 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (9 ^ (r + 1) * U - 7) hdiv8192

theorem two_zero_valley_mod8192_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 8192 ≤ 8192 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (9 ^ (r + 1) * U - 7) / 8192 :=
    two_zero_valley_mod8192_resonance_step18 r W
  have hle : (9 ^ (r + 1) + 8192) * U ≤ (8192 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (113 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  have hX_ge : 8199 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 113 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 922 := by rw [hs1]
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 91 := rfl
          have ht2 : tFn s = 443 := by rw [hs2]
          have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
          rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
        | succ r''' =>
          generalize tFn s = t at hU_def
          generalize U = u at hU_def ⊢
          clear U s tFn
          have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hmul := Nat.mul_le_mul_right u hpow9
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 18) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod8192`, faza `3r + 3`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod8192_resonance_step18 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 8192 := by
  intro s U
  let tFn := fun x => (227 * x + 208 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 1) / 8) + 512 * ((x + 3) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 12 + (5 * r + 6) := by omega
  have hU : U = 2 * (4096 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (4096 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod8192 : (9 ^ (r + 1)) % 8192 = 1 + 8 * s := pow9_mod8192_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 8192 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (8192 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (8192 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 1 5 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (9 ^ (r + 1) * U - 5) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod8192 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (9 ^ (r + 1) * U - 5) hdiv8192

theorem shifted_valley_mod8192_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 8192 ≤ 8192 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((227 * s + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (9 ^ (r + 1) * U - 5) / 8192 :=
    shifted_valley_mod8192_resonance_step18 r W
  have hle : (9 ^ (r + 1) + 8192) * U ≤ (8192 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (227 * x + 208 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 1) / 8) + 512 * ((x + 3) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  have hX_ge : 8197 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 227 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 366 := by rw [hs1]
        have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 91 := rfl
          have ht2 : tFn s = 609 := by rw [hs2]
          have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
          rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
        | succ r''' =>
          generalize tFn s = t at hU_def
          generalize U = u at hU_def ⊢
          clear U s tFn
          have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hmul := Nat.mul_le_mul_right u hpow9
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 18) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod8192`, `3r + 7`, `5r + 24` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod8192_resonance_step24 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 512 * ((r + 2) / 16) + (416 * ((r + 2) % 8) + 256 * (((r + 2) % 8) % 4 / 2)) * ((r + 2) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 24) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 8192 := by
  intro s U
  let tFn := fun x => (113 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 24 = 12 + (5 * r + 12) := by omega
  have hU : U = 2 * (4096 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (4096 * W + 3 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ (r + 2)) % 8192 = 1 + 8 * s := pow9_mod8192_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 8192 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (8192 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (8192 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (9 ^ (r + 2) * U - 7) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod8192 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (9 ^ (r + 2) * U - 7) hdiv8192

theorem rle_10011_mod8192_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 16384 ≤ 8192 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 512 * ((r + 2) / 16) + (416 * ((r + 2) % 8) + 256 * (((r + 2) % 8) % 4 / 2)) * ((r + 2) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((113 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 24) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 24) n0 = (9 ^ (r + 2) * U - 7) / 8192 :=
    rle_10011_mod8192_resonance_step24 r W
  have hle : (9 ^ (r + 2) + 16384) * U ≤ (8192 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (113 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  have hX_ge : 8199 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 922 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 91 := rfl
        have ht1 : tFn s = 443 := by rw [hs1]
        have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        generalize tFn s = t at hU_def
        generalize U = u at hU_def ⊢
        clear U s tFn
        have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hmul := Nat.mul_le_mul_right u hpow9
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 24) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 24) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 24) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod8192`, `3r + 8`, `5r + 26` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod8192_resonance_step26 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((611 * s + 720 + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 26) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 8192 := by
  intro s U
  let tFn := fun x => (611 * x + 720 + 208 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 1) / 8) + 512 * ((x + 3) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 26 = 12 + (5 * r + 14) := by omega
  have hU : U = 2 * (4096 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (4096 * W + 2 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ (r + 1)) % 8192 = 1 + 8 * s := pow9_mod8192_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 8192 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (8192 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (8192 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 27 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (27 * 9 ^ (r + 1) * U - 7) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod8192 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (27 * 9 ^ (r + 1) * U - 7) hdiv8192

theorem rle_10111_mod8192_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 16384 ≤ 8192 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((611 * s + 720 + 208 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 1) / 8) + 512 * ((s + 3) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 26) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 26) n0 = (27 * 9 ^ (r + 1) * U - 7) / 8192 :=
    rle_10111_mod8192_resonance_step26 r W
  have hle : (27 * 9 ^ (r + 1) + 16384) * U ≤ (8192 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (611 * x + 720 + 208 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 1) / 8) + 512 * ((x + 3) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  have hX_ge : 8199 ≤ 27 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 307 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      generalize tFn s = t at hU_def
      generalize U = u at hU_def ⊢
      clear U s tFn
      have hpow9 : 81 ≤ 9 ^ (r' + 1 + 1) := by
        rw [Nat.pow_succ, Nat.pow_succ]
        have := pow9_pos r'
        omega
      have hval1 : 2187 ≤ 27 * 9 ^ (r' + 1 + 1) := by omega
      have hmul := Nat.mul_le_mul_right u hval1
      omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 26) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 26) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 26) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod8192`, `3r + 1`, `5r + 15` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod8192_resonance_step15 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 512 * ((r + 1) / 8) + 512 * (r / 16) + (416 * (r % 8) + 256 * ((r % 8) % 4 / 2)) * (r / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((379 * s + 341 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 15) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 8192 := by
  intro s U
  let tFn := fun x => (379 * x + 341 + 848 * (x / 2) + 800 * (x / 4) + 800 * ((x + 1) / 4) + 256 * (x / 8) + 512 * ((x + 2) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 15 = 12 + (5 * r + 3) := by omega
  have hU : U = 2 * (4096 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (4096 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod8192 : (9 ^ r) % 8192 = 1 + 8 * s := pow9_mod8192 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 8192 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (8192 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (8192 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 3 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (3 * 9 ^ r * U - 7) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod8192 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (3 * 9 ^ r * U - 7) hdiv8192

theorem shifted_valley_d1_mod8192_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 8192 ≤ 8192 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 512 * ((r + 1) / 8) + 512 * (r / 16) + (416 * (r % 8) + 256 * ((r % 8) % 4 / 2)) * (r / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((379 * s + 341 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 15) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 15) n0 = (3 * 9 ^ r * U - 7) / 8192 :=
    shifted_valley_d1_mod8192_resonance_step15 r W
  have hle : (3 * 9 ^ r + 8192) * U ≤ (8192 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (379 * x + 341 + 848 * (x / 2) + 800 * (x / 4) + 800 * ((x + 1) / 4) + 256 * (x / 8) + 512 * ((x + 2) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  have hX_ge : 8199 ≤ 3 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 341 := by rw [hs0]
      have hpow0 : 3 * 9 ^ 0 * U = 3 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 720 := by rw [hs1]
        have hpow1 : 3 * 9 ^ 1 * U = 27 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        cases r'' with
        | zero =>
          have hs2 : s = 10 := rfl
          have ht2 : tFn s = 307 := by rw [hs2]
          have hpow2 : 3 * 9 ^ 2 * U = 243 * U := rfl
          rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
        | succ r''' =>
          generalize tFn s = t at hU_def
          generalize U = u at hU_def ⊢
          clear U s tFn
          have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
            rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
            have := pow9_pos r'''
            omega
          have hval3 : 2187 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1) := by omega
          have hmul := Nat.mul_le_mul_right u hval3
          omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 15) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 15) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 15) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod8192`, `3r + 5`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod8192_resonance_step21 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((417 * s + 682 + 752 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 8192 := by
  intro s U
  let tFn := fun x => (417 * x + 682 + 752 * (x / 2) + 864 * (x / 4) + 864 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 12 + (5 * r + 9) := by omega
  have hU : U = 2 * (4096 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (4096 * W + 3 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ (r + 1)) % 8192 = 1 + 8 * s := pow9_mod8192_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 8192 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (8192 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (8192 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 3 7 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (3 * 9 ^ (r + 1) * U - 5) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod8192 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (3 * 9 ^ (r + 1) * U - 5) hdiv8192

theorem two_zero_valley_d5_mod8192_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 8192 ≤ 8192 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 80 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 512 * ((r + 1) / 16) + (416 * ((r + 1) % 8) + 256 * (((r + 1) % 8) % 4 / 2)) * ((r + 1) / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((417 * s + 682 + 752 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (3 * 9 ^ (r + 1) * U - 5) / 8192 :=
    two_zero_valley_d5_mod8192_resonance_step21 r W
  have hle : (3 * 9 ^ (r + 1) + 8192) * U ≤ (8192 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (417 * x + 682 + 752 * (x / 2) + 864 * (x / 4) + 864 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  have hX_ge : 8197 ≤ 3 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 75 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 10 := rfl
        have ht1 : tFn s = 804 := by rw [hs1]
        have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        generalize tFn s = t at hU_def
        generalize U = u at hU_def ⊢
        clear U s tFn
        have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 3 * 9 ^ (r'' + 1 + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right u hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 21) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod8192`, `3r + 4`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod8192_resonance_step21 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 512 * ((r + 2) / 16) + (416 * ((r + 2) % 8) + 256 * (((r + 2) % 8) % 4 / 2)) * ((r + 2) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 8192 := by
  intro s U
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 288 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 512 * ((x + 2) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 12 + (5 * r + 9) := by omega
  have hU : U = 2 * (4096 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (4096 * W + 2 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ (r + 2)) % 8192 = 1 + 8 * s := pow9_mod8192_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 8192 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (8192 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (8192 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 1 5 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (9 ^ (r + 2) * U - 29) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod8192 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (9 ^ (r + 2) * U - 29) hdiv8192

theorem two_zero_valley_d4_mod8192_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 16384 ≤ 8192 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 80 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 512 * ((r + 2) / 16) + (416 * ((r + 2) % 8) + 256 * (((r + 2) % 8) % 4 / 2)) * ((r + 2) / 4)) % 1024
    let U := 8192 * W + 5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 256 * (s / 8) + 512 * ((s + 2) / 8) + 64 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (9 ^ (r + 2) * U - 29) / 8192 :=
    two_zero_valley_d4_mod8192_resonance_step21 r W
  have hle : (9 ^ (r + 2) + 16384) * U ≤ (8192 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 288 * (x / 4) + 288 * ((x + 1) / 4) + 256 * (x / 8) + 512 * ((x + 2) / 8) + 64 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 5 + 8 * tFn s := rfl
  have hX_ge : 8221 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 897 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 91 := rfl
        have ht1 : tFn s = 668 := by rw [hs1]
        have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        generalize tFn s = t at hU_def
        generalize U = u at hU_def ⊢
        clear U s tFn
        have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
          rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hmul := Nat.mul_le_mul_right u hpow9
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 21) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod8192`, `3r + 2`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod8192_resonance_step18 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 512 * ((r + 1) / 8) + 512 * (r / 16) + (416 * (r % 8) + 256 * ((r % 8) % 4 / 2)) * (r / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((337 * s + 644 + 1008 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 8192 := by
  intro s U
  let tFn := fun x => (337 * x + 644 + 1008 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 12 + (5 * r + 6) := by omega
  have hU : U = 2 * (4096 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 12 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (4096 * W + 3 + 4 * t), ← hU]
  have h9_mod8192 : (9 ^ r) % 8192 = 1 + 8 * s := pow9_mod8192 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 8192 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (8192 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (8192 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 1024 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 8192 27 7 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv8192 : (27 * 9 ^ r * U - 29) % 8192 = 0 := by
    have h1 := mod8192_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod8192 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step12_eq_div8192 (27 * 9 ^ r * U - 29) hdiv8192

theorem shifted_valley_d2_mod8192_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 8192 ≤ 8192 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 80 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 512 * ((r + 1) / 8) + 512 * (r / 16) + (416 * (r % 8) + 256 * ((r % 8) % 4 / 2)) * (r / 4)) % 1024
    let U := 8192 * W + 7 + 8 * ((337 * s + 644 + 1008 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 768 * (s / 8) + 512 * ((s + 2) / 8) + 192 * (s % 8) * (s / 4)) % 1024)
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (27 * 9 ^ r * U - 29) / 8192 :=
    shifted_valley_d2_mod8192_resonance_step18 r W
  have hle : (27 * 9 ^ r + 8192) * U ≤ (8192 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 8192 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (337 * x + 644 + 1008 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 768 * (x / 8) + 512 * ((x + 2) / 8) + 192 * (x % 8) * (x / 4)) % 1024
  have hU_def : U = 8192 * W + 7 + 8 * tFn s := rfl
  have hX_ge : 8221 ≤ 27 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 644 := by rw [hs0]
      have hpow0 : 27 * 9 ^ 0 * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
      cases r' with
      | zero =>
        have hs1 : s = 1 := rfl
        have ht1 : tFn s = 981 := by rw [hs1]
        have hpow1 : 27 * 9 ^ 1 * U = 243 * U := rfl
        rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
      | succ r'' =>
        generalize tFn s = t at hU_def
        generalize U = u at hU_def ⊢
        clear U s tFn
        have hpow9 : 81 ≤ 9 ^ (r'' + 1 + 1) := by
          rw [Nat.pow_succ, Nat.pow_succ]
          have := pow9_pos r''
          omega
        have hval2 : 2187 ≤ 27 * 9 ^ (r'' + 1 + 1) := by omega
        have hmul := Nat.mul_le_mul_right u hval2
        omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 18) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- Konkretne twierdzenia horyzontowe _mod8192_drop_r...
-- -----------------------------------------------------------------------------

theorem two_zero_valley_mod8192_drop_r70 (W : Nat) : HasHorizonDrop ((8192 * W + 4479) * 2 ^ 213 - 7) := (two_zero_valley_mod8192_contraction 70 W (by decide)).2
theorem two_zero_valley_mod8192_drop_r71 (W : Nat) : HasHorizonDrop ((8192 * W + 5959) * 2 ^ 216 - 7) := (two_zero_valley_mod8192_contraction 71 W (by decide)).2
theorem two_zero_valley_mod8192_drop_r72 (W : Nat) : HasHorizonDrop ((8192 * W + 4303) * 2 ^ 219 - 7) := (two_zero_valley_mod8192_contraction 72 W (by decide)).2
theorem two_zero_valley_mod8192_drop_r73 (W : Nat) : HasHorizonDrop ((8192 * W + 4119) * 2 ^ 222 - 7) := (two_zero_valley_mod8192_contraction 73 W (by decide)).2
theorem two_zero_valley_mod8192_drop_r74 (W : Nat) : HasHorizonDrop ((8192 * W + 5919) * 2 ^ 225 - 7) := (two_zero_valley_mod8192_contraction 74 W (by decide)).2
theorem two_zero_valley_mod8192_drop_r75 (W : Nat) : HasHorizonDrop ((8192 * W + 6119) * 2 ^ 228 - 7) := (two_zero_valley_mod8192_contraction 75 W (by decide)).2

theorem shifted_valley_mod8192_drop_r70 (W : Nat) : HasHorizonDrop ((8192 * W + 2029) * 2 ^ 213 - 5) := (shifted_valley_mod8192_contraction 70 W (by decide)).2
theorem shifted_valley_mod8192_drop_r71 (W : Nat) : HasHorizonDrop ((8192 * W + 6597) * 2 ^ 216 - 5) := (shifted_valley_mod8192_contraction 71 W (by decide)).2
theorem shifted_valley_mod8192_drop_r72 (W : Nat) : HasHorizonDrop ((8192 * W + 733) * 2 ^ 219 - 5) := (shifted_valley_mod8192_contraction 72 W (by decide)).2
theorem shifted_valley_mod8192_drop_r73 (W : Nat) : HasHorizonDrop ((8192 * W + 6453) * 2 ^ 222 - 5) := (shifted_valley_mod8192_contraction 73 W (by decide)).2
theorem shifted_valley_mod8192_drop_r74 (W : Nat) : HasHorizonDrop ((8192 * W + 717) * 2 ^ 225 - 5) := (shifted_valley_mod8192_contraction 74 W (by decide)).2
theorem shifted_valley_mod8192_drop_r75 (W : Nat) : HasHorizonDrop ((8192 * W + 5541) * 2 ^ 228 - 5) := (shifted_valley_mod8192_contraction 75 W (by decide)).2

theorem rle_10011_mod8192_drop_r75 (W : Nat) : HasHorizonDrop ((8192 * W + 5231) * 2 ^ 232 - 13) := (rle_10011_mod8192_contraction 75 W (by decide)).2
theorem rle_10011_mod8192_drop_r76 (W : Nat) : HasHorizonDrop ((8192 * W + 7863) * 2 ^ 235 - 13) := (rle_10011_mod8192_contraction 76 W (by decide)).2
theorem rle_10011_mod8192_drop_r77 (W : Nat) : HasHorizonDrop ((8192 * W + 6335) * 2 ^ 238 - 13) := (rle_10011_mod8192_contraction 77 W (by decide)).2
theorem rle_10011_mod8192_drop_r78 (W : Nat) : HasHorizonDrop ((8192 * W + 5255) * 2 ^ 241 - 13) := (rle_10011_mod8192_contraction 78 W (by decide)).2
theorem rle_10011_mod8192_drop_r79 (W : Nat) : HasHorizonDrop ((8192 * W + 5135) * 2 ^ 244 - 13) := (rle_10011_mod8192_contraction 79 W (by decide)).2
theorem rle_10011_mod8192_drop_r80 (W : Nat) : HasHorizonDrop ((8192 * W + 2391) * 2 ^ 247 - 13) := (rle_10011_mod8192_contraction 80 W (by decide)).2

theorem rle_10111_mod8192_drop_r72 (W : Nat) : HasHorizonDrop ((8192 * W + 1373) * 2 ^ 224 - 9) := (rle_10111_mod8192_contraction 72 W (by decide)).2
theorem rle_10111_mod8192_drop_r73 (W : Nat) : HasHorizonDrop ((8192 * W + 1973) * 2 ^ 227 - 9) := (rle_10111_mod8192_contraction 73 W (by decide)).2
theorem rle_10111_mod8192_drop_r74 (W : Nat) : HasHorizonDrop ((8192 * W + 7501) * 2 ^ 230 - 9) := (rle_10111_mod8192_contraction 74 W (by decide)).2
theorem rle_10111_mod8192_drop_r75 (W : Nat) : HasHorizonDrop ((8192 * W + 7205) * 2 ^ 233 - 9) := (rle_10111_mod8192_contraction 75 W (by decide)).2
theorem rle_10111_mod8192_drop_r76 (W : Nat) : HasHorizonDrop ((8192 * W + 2621) * 2 ^ 236 - 9) := (rle_10111_mod8192_contraction 76 W (by decide)).2

theorem shifted_valley_d1_mod8192_drop_r68 (W : Nat) : HasHorizonDrop ((8192 * W + 7053) * 2 ^ 205 - 5) := (shifted_valley_d1_mod8192_contraction 68 W (by decide)).2
theorem shifted_valley_d1_mod8192_drop_r69 (W : Nat) : HasHorizonDrop ((8192 * W + 6245) * 2 ^ 208 - 5) := (shifted_valley_d1_mod8192_contraction 69 W (by decide)).2
theorem shifted_valley_d1_mod8192_drop_r70 (W : Nat) : HasHorizonDrop ((8192 * W + 5245) * 2 ^ 211 - 5) := (shifted_valley_d1_mod8192_contraction 70 W (by decide)).2
theorem shifted_valley_d1_mod8192_drop_r71 (W : Nat) : HasHorizonDrop ((8192 * W + 1493) * 2 ^ 214 - 5) := (shifted_valley_d1_mod8192_contraction 71 W (by decide)).2
theorem shifted_valley_d1_mod8192_drop_r72 (W : Nat) : HasHorizonDrop ((8192 * W + 4717) * 2 ^ 217 - 5) := (shifted_valley_d1_mod8192_contraction 72 W (by decide)).2
theorem shifted_valley_d1_mod8192_drop_r73 (W : Nat) : HasHorizonDrop ((8192 * W + 4165) * 2 ^ 220 - 5) := (shifted_valley_d1_mod8192_contraction 73 W (by decide)).2

theorem two_zero_valley_d5_mod8192_drop_r73 (W : Nat) : HasHorizonDrop ((8192 * W + 2151) * 2 ^ 224 - 7) := (two_zero_valley_d5_mod8192_contraction 73 W (by decide)).2
theorem two_zero_valley_d5_mod8192_drop_r74 (W : Nat) : HasHorizonDrop ((8192 * W + 239) * 2 ^ 227 - 7) := (two_zero_valley_d5_mod8192_contraction 74 W (by decide)).2
theorem two_zero_valley_d5_mod8192_drop_r75 (W : Nat) : HasHorizonDrop ((8192 * W + 1847) * 2 ^ 230 - 7) := (two_zero_valley_d5_mod8192_contraction 75 W (by decide)).2
theorem two_zero_valley_d5_mod8192_drop_r76 (W : Nat) : HasHorizonDrop ((8192 * W + 7487) * 2 ^ 233 - 7) := (two_zero_valley_d5_mod8192_contraction 76 W (by decide)).2
theorem two_zero_valley_d5_mod8192_drop_r77 (W : Nat) : HasHorizonDrop ((8192 * W + 5383) * 2 ^ 236 - 7) := (two_zero_valley_d5_mod8192_contraction 77 W (by decide)).2

theorem two_zero_valley_d4_mod8192_drop_r57 (W : Nat) : HasHorizonDrop ((8192 * W + 7973) * 2 ^ 175 - 7) := (two_zero_valley_d4_mod8192_contraction 57 W (by decide)).2
theorem two_zero_valley_d4_mod8192_drop_r58 (W : Nat) : HasHorizonDrop ((8192 * W + 5437) * 2 ^ 178 - 7) := (two_zero_valley_d4_mod8192_contraction 58 W (by decide)).2
theorem two_zero_valley_d4_mod8192_drop_r59 (W : Nat) : HasHorizonDrop ((8192 * W + 4245) * 2 ^ 181 - 7) := (two_zero_valley_d4_mod8192_contraction 59 W (by decide)).2
theorem two_zero_valley_d4_mod8192_drop_r60 (W : Nat) : HasHorizonDrop ((8192 * W + 5933) * 2 ^ 184 - 7) := (two_zero_valley_d4_mod8192_contraction 60 W (by decide)).2
theorem two_zero_valley_d4_mod8192_drop_r61 (W : Nat) : HasHorizonDrop ((8192 * W + 7941) * 2 ^ 187 - 7) := (two_zero_valley_d4_mod8192_contraction 61 W (by decide)).2
theorem two_zero_valley_d4_mod8192_drop_r62 (W : Nat) : HasHorizonDrop ((8192 * W + 3613) * 2 ^ 190 - 7) := (two_zero_valley_d4_mod8192_contraction 62 W (by decide)).2

theorem shifted_valley_d2_mod8192_drop_r55 (W : Nat) : HasHorizonDrop ((8192 * W + 4127) * 2 ^ 167 - 5) := (shifted_valley_d2_mod8192_contraction 55 W (by decide)).2
theorem shifted_valley_d2_mod8192_drop_r56 (W : Nat) : HasHorizonDrop ((8192 * W + 2279) * 2 ^ 170 - 5) := (shifted_valley_d2_mod8192_contraction 56 W (by decide)).2
theorem shifted_valley_d2_mod8192_drop_r57 (W : Nat) : HasHorizonDrop ((8192 * W + 7535) * 2 ^ 173 - 5) := (shifted_valley_d2_mod8192_contraction 57 W (by decide)).2
theorem shifted_valley_d2_mod8192_drop_r58 (W : Nat) : HasHorizonDrop ((8192 * W + 8119) * 2 ^ 176 - 5) := (shifted_valley_d2_mod8192_contraction 58 W (by decide)).2
theorem shifted_valley_d2_mod8192_drop_r59 (W : Nat) : HasHorizonDrop ((8192 * W + 4543) * 2 ^ 179 - 5) := (shifted_valley_d2_mod8192_contraction 59 W (by decide)).2
theorem shifted_valley_d2_mod8192_drop_r60 (W : Nat) : HasHorizonDrop ((8192 * W + 1415) * 2 ^ 182 - 5) := (shifted_valley_d2_mod8192_contraction 60 W (by decide)).2
```

# Runda 7 Debaty: Domknięcie kaskad rezonansowych `mod 16384` ($v_2 \ge 14$, okres 2048, Części 59 i 60) — 68 twierdzeń i przekroczenie bariery `2^265` (`455` kroków!)

## 1. Przełom strukturalny dla `pow9_mod16384` (okres 2048, $v_2 = 14$): eliminacja `k / 32` i prawostronne nawiasowanie `U`

Dla dowolnego wykładnika $k \in \mathbb{N}$ reszta $(9^k) \bmod 16384 = 1 + 8 \cdot s_{16384}(k)$, gdzie indeks $s_{16384}(k) = \frac{9^k - 1}{8} \bmod 2048$ ma okres $2048$. Ponieważ $9^4 - 1 = 6560 = 32 \times 205$, rozwinięcie dwumianowe $\frac{(1 + 32 \cdot 205)^{q_4} - 1}{8}$ dla $q_4 = \lfloor k/4 \rfloor$ ma **zerowy człon sześcienny modulo 2048** ($\frac{32^3}{8} \binom{q_4}{3} = 4096 \binom{q_4}{3} \equiv 0 \pmod{2048}$), a człon kwadratowy wynosi dokładnie $512 \cdot \frac{q_4(q_4 - 1)}{2} \pmod{2048}$.

Zastępując w członie biliniowym resztę $k \bmod 8$ przez $k \bmod 16$:
$$(416(k \bmod 16) + 1280\lfloor ((k \bmod 16) \bmod 4)/2 \rfloor) \cdot \lfloor k/4 \rfloor$$
przesunięcie $k \mapsto k + 16$ ($q_4 \mapsto q_4 + 4$) zmienia nachylenie o $16 \times 416 = 6656 = 3 \times 2048 + 512 \equiv 512 \pmod{2048}$, co **dokładnie kompensuje przyrost kwadratowy bez potrzeby użycia dzielenia `k / 32`**:

$$s_{16384}(k) = \Big(k + 8\lfloor k/2 \rfloor + 1104\lfloor k/4 \rfloor + 80\lfloor (k+1)/4 \rfloor + 1408\lfloor k/8 \rfloor + 512\lfloor (k+1)/8 \rfloor + 1536\lfloor k/16 \rfloor + 1792\lfloor (k \bmod 16)/12 \rfloor + 1024\lfloor (k \bmod 16)/8 \rfloor(((k \bmod 16) \bmod 4) \bmod 3) + \big(416(k \bmod 16) + 1280\lfloor ((k \bmod 16) \bmod 4)/2 \rfloor\big)\lfloor k/4 \rfloor\Big) \bmod 2048$$

### Trzy kluczowe optymalizacje inżynieryjne w Lean 4 (`0 sorryAx`, domyślny `maxHeartbeats 200000`, `56.77 s` dla całego pliku 68 twierdzeń):
1. **Redukcja okresowa przez `k % 16` i `generalize k / 16 = q16` w `pow9_mod16384`:**
   Zapisanie korekt okresu 16 jako funkcji od `k % 16` (`1792 * ((k % 16) / 12) + 1024 * ((k % 16) / 8) * (((k % 16) % 4) % 3)`) sprawia, że po podstawieniu reszty `k % 16 = r` taktyka `dsimp` redukuje je w czasie zerowym do stałych liczbowych. W 15 z 16 gałęzi ($r \in \{0, \dots, 14\}$) zachodzi `(k + 1) / 16 = k / 16`, a po `generalize k / 16 = q16` zmienna `q16` całkowicie się skraca ($(9 - 1) \cdot 1536 \cdot q_{16} = 12288 \cdot q_{16} \equiv 0 \pmod{2048}$).
2. **Prawostronne nawiasowanie `let U := 16384 * W + (uBase + 8 * (...))` (eliminacja błędu `(kernel) deep recursion detected` dla $u_0 > 8000$):**
   Ponieważ operator `+` w Lean 4 jest lewostronnie łączny, zapis `16384 * W + uBase + 8 * t` jest parsowany jako `(16384 * W + uBase) + 8 * t`. Podczas weryfikacji twierdzeń `_drop_r...` (gdzie pierwszy argument `16384 * W + uBase` zawiera wolną zmienną `W`), jądro Lean 4 nie mogło użyć szybkiego dodawania GMP dla `(16384 * W + uBase) + 8 * t`, lecz rozwijało `Nat.add` przez rekurencję Peano (`Nat.succ`) względem drugiego argumentu `8 * t`, przekraczając limit stosu dla $8t > 8000$. Zastosowanie prawostronnego nawiasowania `16384 * W + (uBase + 8 * t)` sprawia, że zamknięty podwyraz `uBase + 8 * t` redukuje się w `O(1)` przez arytmetykę GMP bez rozwijania `Nat.succ` na zmiennej `W`!
3. **Siatka `checkResonanceGrid16_sound` o wymiarze $128 \times 16 = 2048$ i `set_option exponentiation.threshold 512`:**
   Istniejący weryfikator `checkResonanceGrid16_sound 16384 A uBase c tFn 128 (by decide) s hs_lt` (głębokość rekursji $128 + 16 = 144 \ll 512$) domyka każde z 8 twierdzeń rezonansowych w `~2 s`, a `set_option exponentiation.threshold 512` odblokowuje wykładniki $2^{259}, 2^{262}, 2^{265}$ dla `rle_10011_mod16384_drop_r84..r86`.

## 2. Uniwersalna struktura odwrotności modularnych $t_{16384}(s) \bmod 2048$ dla wszystkich 8 rodzin

Po zastąpieniu $(s \bmod 8)$ przez $(s \bmod 16)$ oraz spłaszczeniu skoków wewnątrz bloków czwórkowych w członie biliniowym, wszystkie 8 rodzin zachowuje **symetryczne współczynniki przy $\lfloor s/4 \rfloor$ i $\lfloor (s+1)/4 \rfloor$** oraz dzieli się na dwie grupy o identycznych ogonach `/ 8` i `/ 16`:

1. **Grupa I ($u_{\text{base}} = 7$: `two_zero_valley`, `rle_10011`, `two_zero_valley_d5`, `shifted_valley_d2`)** — wspólny ogon `+ 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16)`:
   - `two_zero_valley` i `rle_10011`: `(1137 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048`
   - `two_zero_valley_d5`: `(1441 * s + 682 + 1776 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1024 * (s % 2) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048`
   - `shifted_valley_d2`: `(337 * s + 1668 + 1008 * (s / 2) + 1376 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048`
2. **Grupa II ($u_{\text{base}} = 5$: `shifted_valley`, `rle_10111`, `shifted_valley_d1`, `two_zero_valley_d4`)** — wspólny ogon `+ 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16)`:
   - `shifted_valley`: `(227 * s + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048`
   - `rle_10111`: `(1635 * s + 1744 + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048`
   - `shifted_valley_d1`: `(379 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048`
   - `two_zero_valley_d4`: `(907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1024 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048`

## 3. Zestawienie wszystkich 8 rodzin na poziomie `mod 16384` (`v₂ ≥ 14`, okres 2048)

| # | Rodzina | Licznik $\equiv 0 \pmod{16384}$ | Indeks $s$ | Kroki | Pułap $r_{\max}$ (`mod 16384`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{16384}(r+1)$ | $5r+19$ | **`r = 81`** (`2^246`, 424 kr.) | `r76 .. r81` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{16384}(r+1)$ | $5r+19$ | **`r = 81`** (`2^246`, 424 kr.) | `r76 .. r81` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{16384}(r+2)$ | $5r+25$ | **`r = 86`** (`2^265`, **455 kr.**) | `r81 .. r86` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{16384}(r+1)$ | $5r+27$ | **`r = 82`** (`2^254`, 437 kr.) | `r77 .. r82` (6 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{16384}(r)$ | $5r+16$ | **`r = 78`** (`2^235`, 406 kr.) | `r74 .. r78` (5 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{16384}(r+1)$ | $5r+22$ | **`r = 83`** (`2^254`, 437 kr.) | `r78 .. r83` (6 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{16384}(r+2)$ | $5r+22$ | **`r = 68`** (`2^208`, 362 kr.) | `r63 .. r68` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{16384}(r)$ | $5r+19$ | **`r = 66`** (`2^200`, 349 kr.) | `r61 .. r66` (6 tw.) |

*(Uwaga: dla `shifted_valley_d1` dokładny pułap nierówności $3 \cdot 9^r + 16384 \le 16384 \cdot 2^{3r+1}$ wynosi **`r = 78`** (`2^235`, `406` kroków), ponieważ dla $r = 79$ mamy $159 \log_2 3 \approx 252.00904 > 252 = 14 + 238$, czyli $3 \cdot 9^{79} > 16384 \cdot 2^{238}$. Z kolei dla `rle_10011` osiągamy rekordowy pułap **`r = 86`** — aż **`2^265` w `455` krokach Collatza**!)*

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 59 i 60 (`mod 16384`, `v₂ ≥ 14`, 0 sorryAx)

```lean
-- =============================================================================
-- Część 59-60: Rezonanse i Kontrakcje mod 16384 (v₂ ≥ 14, okres 2048)
-- =============================================================================

theorem pow9_mod16384 (k : Nat) :
    (9 ^ k) % 16384 = 1 + 8 * ((k + 8 * (k / 2) + 1104 * (k / 4) + 80 * ((k + 1) / 4) +
      1408 * (k / 8) + 512 * ((k + 1) / 8) + 1536 * (k / 16) +
      1792 * ((k % 16) / 12) + 1024 * ((k % 16) / 8) * (((k % 16) % 4) % 3) +
      (416 * (k % 16) + 1280 * (((k % 16) % 4) / 2)) * (k / 4)) % 2048) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    clear ih
    have hp : k % 16 = 0 ∨ k % 16 = 1 ∨ k % 16 = 2 ∨ k % 16 = 3 ∨
              k % 16 = 4 ∨ k % 16 = 5 ∨ k % 16 = 6 ∨ k % 16 = 7 ∨
              k % 16 = 8 ∨ k % 16 = 9 ∨ k % 16 = 10 ∨ k % 16 = 11 ∨
              k % 16 = 12 ∨ k % 16 = 13 ∨ k % 16 = 14 ∨ k % 16 = 15 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7 | h8 | h9 | h10 | h11 | h12 | h13 | h14 | h15
    · have hb : (k + 1) % 16 = 1 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h0, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 2 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h1, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 3 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h2, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 4 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h3, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 5 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h4, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 6 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h5, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 7 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h6, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 8 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h7, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 9 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h8, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 10 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h9, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 11 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h10, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 12 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h11, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 13 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h12, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 14 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h13, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 15 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      rw [h14, hb, h16]; dsimp; generalize k / 16 = q16; omega
    · have hb : (k + 1) % 16 = 0 := by omega
      rw [h15, hb]; dsimp; omega

theorem pow9_mod16384_succ (r : Nat) :
    (9 ^ (r + 1)) % 16384 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h := pow9_mod16384 (r + 1)
  rw [h2] at h
  exact h

theorem pow9_mod16384_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 16384 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 1104 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 1408 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 1536 * ((r + 2) / 16) + 1792 * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) / 8) * ((((r + 2) % 16) % 4) % 3) + (416 * ((r + 2) % 16) + 1280 * ((((r + 2) % 16) % 4) / 2)) * ((r + 2) / 4)) % 2048) := by
  have h3 : r + 2 + 1 = r + 3 := by omega
  have h := pow9_mod16384 (r + 2)
  rw [h3] at h
  exact h

theorem div2_step13_eq_div16384 (N : Nat) (hN : N % 16384 = 0) :
    collatzIter 13 (N / 2) = N / 16384 := by
  have s1  : collatzStep (N / 2)    = N / 4     := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)    = N / 8     := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)    = N / 16    := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)   = N / 32    := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)   = N / 64    := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)   = N / 128   := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)  = N / 256   := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)  = N / 512   := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)  = N / 1024  := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024) = N / 2048  := by unfold collatzStep; split <;> omega
  have s11 : collatzStep (N / 2048) = N / 4096  := by unfold collatzStep; split <;> omega
  have s12 : collatzStep (N / 4096) = N / 8192  := by unfold collatzStep; split <;> omega
  have s13 : collatzStep (N / 8192) = N / 16384 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2))))))))))))) = N / 16384
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13]

theorem mod16384_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 16384 = b)
    (hge : c ≤ A * M * (16384 * W + u0))
    (hres : (A * u0 * b) % 16384 = c % 16384) :
    (A * M * (16384 * W + u0) - c) % 16384 = 0 := by
  have h1 : (A * M * (16384 * W + u0)) % 16384 = (A * u0 * b) % 16384 := by
    have hcomm : A * M * (16384 * W + u0) = A * (16384 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (16384 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (16384 * W + u0)) % 16384 = (A * u0) % 16384 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 16384, Nat.mul_assoc]
      omega
    have h3 : (M % 16384) = (b % 16384) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod16384`, faza `3r + 3`, `5r + 19` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod16384_resonance_step19 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1137 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 19) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 16384 := by
  intro s U
  let tFn := fun x => (1137 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 19 = 13 + (5 * r + 6) := by omega
  have hU : U = 2 * (8192 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (8192 * W + 3 + 4 * t), ← hU]
  have h9_mod16384 : (9 ^ (r + 1)) % 16384 = 1 + 8 * s := pow9_mod16384_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 16384 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (16384 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (16384 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 1 7 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (9 ^ (r + 1) * U - 7) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod16384 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (9 ^ (r + 1) * U - 7) hdiv16384

theorem two_zero_valley_mod16384_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 16384 ≤ 16384 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1137 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 19) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 19) n0 = (9 ^ (r + 1) * U - 7) / 16384 :=
    two_zero_valley_mod16384_resonance_step19 r W
  have hle : (9 ^ (r + 1) + 16384) * U ≤ (16384 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (1137 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 16391 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 1137 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 1946 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 443 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 19) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 19) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 19) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod16384`, faza `3r + 3`, `5r + 19` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod16384_resonance_step19 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((227 * s + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048))
    collatzIter (5 * r + 19) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 16384 := by
  intro s U
  let tFn := fun x => (227 * x + 1232 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 19 = 13 + (5 * r + 6) := by omega
  have hU : U = 2 * (8192 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (8192 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod16384 : (9 ^ (r + 1)) % 16384 = 1 + 8 * s := pow9_mod16384_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 16384 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (16384 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (16384 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 1 5 5 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (9 ^ (r + 1) * U - 5) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod16384 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (9 ^ (r + 1) * U - 5) hdiv16384

theorem shifted_valley_mod16384_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 16384 ≤ 16384 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((227 * s + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 19) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 19) n0 = (9 ^ (r + 1) * U - 5) / 16384 :=
    shifted_valley_mod16384_resonance_step19 r W
  have hle : (9 ^ (r + 1) + 16384) * U ≤ (16384 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (227 * x + 1232 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 16389 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 227 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 1390 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 609 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 19) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 19) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 19) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod16384`, `3r + 7`, `5r + 25` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod16384_resonance_step25 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 1104 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 1408 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 1536 * ((r + 2) / 16) + 1792 * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) / 8) * ((((r + 2) % 16) % 4) % 3) + (416 * ((r + 2) % 16) + 1280 * ((((r + 2) % 16) % 4) / 2)) * ((r + 2) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1137 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 25) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 16384 := by
  intro s U
  let tFn := fun x => (1137 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 25 = 13 + (5 * r + 12) := by omega
  have hU : U = 2 * (8192 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (8192 * W + 3 + 4 * t), ← hU]
  have h9_mod16384 : (9 ^ (r + 2)) % 16384 = 1 + 8 * s := pow9_mod16384_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 16384 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (16384 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (16384 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 1 7 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (9 ^ (r + 2) * U - 7) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod16384 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (9 ^ (r + 2) * U - 7) hdiv16384

theorem rle_10011_mod16384_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 32768 ≤ 16384 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 1104 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 1408 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 1536 * ((r + 2) / 16) + 1792 * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) / 8) * ((((r + 2) % 16) % 4) % 3) + (416 * ((r + 2) % 16) + 1280 * ((((r + 2) % 16) % 4) / 2)) * ((r + 2) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1137 * s + 496 * (s / 2) + 352 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 25) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 25) n0 = (9 ^ (r + 2) * U - 7) / 16384 :=
    rle_10011_mod16384_resonance_step25 r W
  have hle : (9 ^ (r + 2) + 32768) * U ≤ (16384 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (1137 * x + 496 * (x / 2) + 352 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 16391 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 1946 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 443 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hmul := Nat.mul_le_mul_right u hpow9
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 25) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 25) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 25) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod16384`, `3r + 8`, `5r + 27` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod16384_resonance_step27 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((1635 * s + 1744 + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048))
    collatzIter (5 * r + 27) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 16384 := by
  intro s U
  let tFn := fun x => (1635 * x + 1744 + 1232 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 27 = 13 + (5 * r + 14) := by omega
  have hU : U = 2 * (8192 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (8192 * W + 2 + 4 * t), ← hU]
  have h9_mod16384 : (9 ^ (r + 1)) % 16384 = 1 + 8 * s := pow9_mod16384_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 16384 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (16384 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (16384 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 27 5 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (27 * 9 ^ (r + 1) * U - 7) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod16384 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (27 * 9 ^ (r + 1) * U - 7) hdiv16384

theorem rle_10111_mod16384_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 32768 ≤ 16384 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((1635 * s + 1744 + 1232 * (s / 2) + 544 * (s / 4) + 544 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 27) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 27) n0 = (27 * 9 ^ (r + 1) * U - 7) / 16384 :=
    rle_10111_mod16384_resonance_step27 r W
  have hle : (27 * 9 ^ (r + 1) + 32768) * U ≤ (16384 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (1635 * x + 1744 + 1232 * (x / 2) + 544 * (x / 4) + 544 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 16391 ≤ 27 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 1331 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 830 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (0 + 1 + 1) * U = 2187 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hval : 19683 ≤ 27 * 9 ^ (r'' + 1 + 1 + 1) := by omega
            have hmul := Nat.mul_le_mul_right u hval
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 27) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 27) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 27) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod16384`, `3r + 1`, `5r + 16` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod16384_resonance_step16 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 1104 * (r / 4) + 80 * ((r + 1) / 4) + 1408 * (r / 8) + 512 * ((r + 1) / 8) + 1536 * (r / 16) + 1792 * ((r % 16) / 12) + 1024 * ((r % 16) / 8) * (((r % 16) % 4) % 3) + (416 * (r % 16) + 1280 * (((r % 16) % 4) / 2)) * (r / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((379 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 16) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 16384 := by
  intro s U
  let tFn := fun x => (379 * x + 1365 + 848 * (x / 2) + 800 * (x / 4) + 800 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 16 = 13 + (5 * r + 3) := by omega
  have hU : U = 2 * (8192 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (8192 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod16384 : (9 ^ r) % 16384 = 1 + 8 * s := pow9_mod16384 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 16384 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (16384 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (16384 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 3 5 7 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (3 * 9 ^ r * U - 7) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod16384 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (3 * 9 ^ r * U - 7) hdiv16384

theorem shifted_valley_d1_mod16384_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 16384 ≤ 16384 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 1104 * (r / 4) + 80 * ((r + 1) / 4) + 1408 * (r / 8) + 512 * ((r + 1) / 8) + 1536 * (r / 16) + 1792 * ((r % 16) / 12) + 1024 * ((r % 16) / 8) * (((r % 16) % 4) % 3) + (416 * (r % 16) + 1280 * (((r % 16) % 4) / 2)) * (r / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((379 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 800 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 16) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 16) n0 = (3 * 9 ^ r * U - 7) / 16384 :=
    shifted_valley_d1_mod16384_resonance_step16 r W
  have hle : (3 * 9 ^ r + 16384) * U ≤ (16384 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (379 * x + 1365 + 848 * (x / 2) + 800 * (x / 4) + 800 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 16391 ≤ 3 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 1365 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0) * U = 3 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 1744 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (1) * U = 27 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 1331 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (2) * U = 243 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                cases r''' with
                | zero =>
                  have hs3 : s = 91 := rfl
                  have ht3 : tFn s = 830 := by rw [hs3]
                  have hpow3 : 3 * 9 ^ (3) * U = 2187 * U := rfl
                  rw [ht3] at hU_def; rw [hpow3, hU_def]; clear hs3 ht3 hpow3 hU_def U s tFn; omega
                | succ r'''' =>
                    generalize tFn s = t at hU_def
                    generalize U = u at hU_def ⊢
                    clear U s tFn
                    have hpow9 : 6561 ≤ 9 ^ (r'''' + 1 + 1 + 1 + 1) := by
                      rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                      have := pow9_pos r''''
                      omega
                    have hval : 19683 ≤ 3 * 9 ^ (r'''' + 1 + 1 + 1 + 1) := by omega
                    have hmul := Nat.mul_le_mul_right u hval
                    omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 16) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 16) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 16) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod16384`, `3r + 5`, `5r + 22` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod16384_resonance_step22 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1441 * s + 682 + 1776 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1024 * (s % 2) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 22) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 16384 := by
  intro s U
  let tFn := fun x => (1441 * x + 682 + 1776 * (x / 2) + 864 * (x / 4) + 864 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1024 * (x % 2) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 22 = 13 + (5 * r + 9) := by omega
  have hU : U = 2 * (8192 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (8192 * W + 3 + 4 * t), ← hU]
  have h9_mod16384 : (9 ^ (r + 1)) % 16384 = 1 + 8 * s := pow9_mod16384_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 16384 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (16384 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (16384 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 3 7 5 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (3 * 9 ^ (r + 1) * U - 5) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod16384 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (3 * 9 ^ (r + 1) * U - 5) hdiv16384

theorem two_zero_valley_d5_mod16384_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 16384 ≤ 16384 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 1104 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 1408 * ((r + 1) / 8) + 512 * ((r + 2) / 8) + 1536 * ((r + 1) / 16) + 1792 * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) / 8) * ((((r + 1) % 16) % 4) % 3) + (416 * ((r + 1) % 16) + 1280 * ((((r + 1) % 16) % 4) / 2)) * ((r + 1) / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((1441 * s + 682 + 1776 * (s / 2) + 864 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1024 * (s % 2) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 22) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 22) n0 = (3 * 9 ^ (r + 1) * U - 5) / 16384 :=
    two_zero_valley_d5_mod16384_resonance_step22 r W
  have hle : (3 * 9 ^ (r + 1) + 16384) * U ≤ (16384 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (1441 * x + 682 + 1776 * (x / 2) + 864 * (x / 4) + 864 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1024 * (x % 2) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 16389 ≤ 3 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 75 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 1828 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 885 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (0 + 1 + 1 + 1) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 22) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 22) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 22) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod16384`, `3r + 4`, `5r + 22` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod16384_resonance_step22 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 1104 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 1408 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 1536 * ((r + 2) / 16) + 1792 * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) / 8) * ((((r + 2) % 16) % 4) % 3) + (416 * ((r + 2) % 16) + 1280 * ((((r + 2) % 16) % 4) / 2)) * ((r + 2) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1024 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 22) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 16384 := by
  intro s U
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 288 * (x / 4) + 288 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1024 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 22 = 13 + (5 * r + 9) := by omega
  have hU : U = 2 * (8192 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (8192 * W + 2 + 4 * t), ← hU]
  have h9_mod16384 : (9 ^ (r + 2)) % 16384 = 1 + 8 * s := pow9_mod16384_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 16384 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (16384 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (16384 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 1 5 29 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (9 ^ (r + 2) * U - 29) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod16384 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (9 ^ (r + 2) * U - 29) hdiv16384

theorem two_zero_valley_d4_mod16384_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 32768 ≤ 16384 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 1104 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 1408 * ((r + 2) / 8) + 512 * ((r + 3) / 8) + 1536 * ((r + 2) / 16) + 1792 * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) / 8) * ((((r + 2) % 16) % 4) % 3) + (416 * ((r + 2) % 16) + 1280 * ((((r + 2) % 16) % 4) / 2)) * ((r + 2) / 4)) % 2048
    let U := 16384 * W + (5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 288 * (s / 4) + 288 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + (64 * (s % 16) + 1024 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 22) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 22) n0 = (9 ^ (r + 2) * U - 29) / 16384 :=
    two_zero_valley_d4_mod16384_resonance_step22 r W
  have hle : (9 ^ (r + 2) + 32768) * U ≤ (16384 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 288 * (x / 4) + 288 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + (64 * (x % 16) + 1024 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 16413 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 1921 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 668 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hmul := Nat.mul_le_mul_right u hpow9
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 22) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 22) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 22) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod16384`, `3r + 2`, `5r + 19` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod16384_resonance_step19 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 1104 * (r / 4) + 80 * ((r + 1) / 4) + 1408 * (r / 8) + 512 * ((r + 1) / 8) + 1536 * (r / 16) + 1792 * ((r % 16) / 12) + 1024 * ((r % 16) / 8) * (((r % 16) % 4) % 3) + (416 * (r % 16) + 1280 * (((r % 16) % 4) / 2)) * (r / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((337 * s + 1668 + 1008 * (s / 2) + 1376 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    collatzIter (5 * r + 19) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 16384 := by
  intro s U
  let tFn := fun x => (337 * x + 1668 + 1008 * (x / 2) + 1376 * (x / 4) + 1376 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 19 = 13 + (5 * r + 6) := by omega
  have hU : U = 2 * (8192 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 13 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (8192 * W + 3 + 4 * t) (by omega), ← hU]
  have h9_mod16384 : (9 ^ r) % 16384 = 1 + 8 * s := pow9_mod16384 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 16384 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (16384 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (16384 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 2048 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid16_sound 16384 27 7 29 tFn 128 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv16384 : (27 * 9 ^ r * U - 29) % 16384 = 0 := by
    have h1 := mod16384_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod16384 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step13_eq_div16384 (27 * 9 ^ r * U - 29) hdiv16384

theorem shifted_valley_d2_mod16384_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 16384 ≤ 16384 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 1104 * (r / 4) + 80 * ((r + 1) / 4) + 1408 * (r / 8) + 512 * ((r + 1) / 8) + 1536 * (r / 16) + 1792 * ((r % 16) / 12) + 1024 * ((r % 16) / 8) * (((r % 16) % 4) % 3) + (416 * (r % 16) + 1280 * (((r % 16) % 4) / 2)) * (r / 4)) % 2048
    let U := 16384 * W + (7 + 8 * ((337 * s + 1668 + 1008 * (s / 2) + 1376 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 2048))
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 19) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 19) n0 = (27 * 9 ^ r * U - 29) / 16384 :=
    shifted_valley_d2_mod16384_resonance_step19 r W
  have hle : (27 * 9 ^ r + 16384) * U ≤ (16384 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 16384 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (337 * x + 1668 + 1008 * (x / 2) + 1376 * (x / 4) + 1376 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 2048
  have hU_def : U = 16384 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 16413 ≤ 27 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 1668 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 2005 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 222 := by rw [hs2]
              have hpow2 : 27 * 9 ^ (2) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 27 * 9 ^ (r''' + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 19) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 19) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 19) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- Konkretne twierdzenia horyzontowe _mod16384_drop_r...
-- -----------------------------------------------------------------------------
set_option exponentiation.threshold 512

theorem two_zero_valley_mod16384_drop_r76 (W : Nat) : HasHorizonDrop ((16384 * W + 5231) * 2 ^ 231 - 7) := (two_zero_valley_mod16384_contraction 76 W (by decide)).2
theorem two_zero_valley_mod16384_drop_r77 (W : Nat) : HasHorizonDrop ((16384 * W + 7863) * 2 ^ 234 - 7) := (two_zero_valley_mod16384_contraction 77 W (by decide)).2
theorem two_zero_valley_mod16384_drop_r78 (W : Nat) : HasHorizonDrop ((16384 * W + 6335) * 2 ^ 237 - 7) := (two_zero_valley_mod16384_contraction 78 W (by decide)).2
theorem two_zero_valley_mod16384_drop_r79 (W : Nat) : HasHorizonDrop ((16384 * W + 13447) * 2 ^ 240 - 7) := (two_zero_valley_mod16384_contraction 79 W (by decide)).2
theorem two_zero_valley_mod16384_drop_r80 (W : Nat) : HasHorizonDrop ((16384 * W + 5135) * 2 ^ 243 - 7) := (two_zero_valley_mod16384_contraction 80 W (by decide)).2
theorem two_zero_valley_mod16384_drop_r81 (W : Nat) : HasHorizonDrop ((16384 * W + 2391) * 2 ^ 246 - 7) := (two_zero_valley_mod16384_contraction 81 W (by decide)).2

theorem shifted_valley_mod16384_drop_r76 (W : Nat) : HasHorizonDrop ((16384 * W + 6077) * 2 ^ 231 - 5) := (shifted_valley_mod16384_contraction 76 W (by decide)).2
theorem shifted_valley_mod16384_drop_r77 (W : Nat) : HasHorizonDrop ((16384 * W + 7957) * 2 ^ 234 - 5) := (shifted_valley_mod16384_contraction 77 W (by decide)).2
theorem shifted_valley_mod16384_drop_r78 (W : Nat) : HasHorizonDrop ((16384 * W + 4525) * 2 ^ 237 - 5) := (shifted_valley_mod16384_contraction 78 W (by decide)).2
theorem shifted_valley_mod16384_drop_r79 (W : Nat) : HasHorizonDrop ((16384 * W + 9605) * 2 ^ 240 - 5) := (shifted_valley_mod16384_contraction 79 W (by decide)).2
theorem shifted_valley_mod16384_drop_r80 (W : Nat) : HasHorizonDrop ((16384 * W + 8349) * 2 ^ 243 - 5) := (shifted_valley_mod16384_contraction 80 W (by decide)).2
theorem shifted_valley_mod16384_drop_r81 (W : Nat) : HasHorizonDrop ((16384 * W + 6389) * 2 ^ 246 - 5) := (shifted_valley_mod16384_contraction 81 W (by decide)).2

theorem rle_10011_mod16384_drop_r81 (W : Nat) : HasHorizonDrop ((16384 * W + 5727) * 2 ^ 250 - 13) := (rle_10011_mod16384_contraction 81 W (by decide)).2
theorem rle_10011_mod16384_drop_r82 (W : Nat) : HasHorizonDrop ((16384 * W + 11559) * 2 ^ 253 - 13) := (rle_10011_mod16384_contraction 82 W (by decide)).2
theorem rle_10011_mod16384_drop_r83 (W : Nat) : HasHorizonDrop ((16384 * W + 12207) * 2 ^ 256 - 13) := (rle_10011_mod16384_contraction 83 W (by decide)).2
theorem rle_10011_mod16384_drop_r84 (W : Nat) : HasHorizonDrop ((16384 * W + 12279) * 2 ^ 259 - 13) := (rle_10011_mod16384_contraction 84 W (by decide)).2
theorem rle_10011_mod16384_drop_r85 (W : Nat) : HasHorizonDrop ((16384 * W + 12287) * 2 ^ 262 - 13) := (rle_10011_mod16384_contraction 85 W (by decide)).2
theorem rle_10011_mod16384_drop_r86 (W : Nat) : HasHorizonDrop ((16384 * W + 8647) * 2 ^ 265 - 13) := (rle_10011_mod16384_contraction 86 W (by decide)).2

theorem rle_10111_mod16384_drop_r77 (W : Nat) : HasHorizonDrop ((16384 * W + 7573) * 2 ^ 239 - 9) := (rle_10111_mod16384_contraction 77 W (by decide)).2
theorem rle_10111_mod16384_drop_r78 (W : Nat) : HasHorizonDrop ((16384 * W + 15405) * 2 ^ 242 - 9) := (rle_10111_mod16384_contraction 78 W (by decide)).2
theorem rle_10111_mod16384_drop_r79 (W : Nat) : HasHorizonDrop ((16384 * W + 7173) * 2 ^ 245 - 9) := (rle_10111_mod16384_contraction 79 W (by decide)).2
theorem rle_10111_mod16384_drop_r80 (W : Nat) : HasHorizonDrop ((16384 * W + 797) * 2 ^ 248 - 9) := (rle_10111_mod16384_contraction 80 W (by decide)).2
theorem rle_10111_mod16384_drop_r81 (W : Nat) : HasHorizonDrop ((16384 * W + 1909) * 2 ^ 251 - 9) := (rle_10111_mod16384_contraction 81 W (by decide)).2
theorem rle_10111_mod16384_drop_r82 (W : Nat) : HasHorizonDrop ((16384 * W + 3853) * 2 ^ 254 - 9) := (rle_10111_mod16384_contraction 82 W (by decide)).2

theorem shifted_valley_d1_mod16384_drop_r74 (W : Nat) : HasHorizonDrop ((16384 * W + 9565) * 2 ^ 223 - 5) := (shifted_valley_d1_mod16384_contraction 74 W (by decide)).2
theorem shifted_valley_d1_mod16384_drop_r75 (W : Nat) : HasHorizonDrop ((16384 * W + 10165) * 2 ^ 226 - 5) := (shifted_valley_d1_mod16384_contraction 75 W (by decide)).2
theorem shifted_valley_d1_mod16384_drop_r76 (W : Nat) : HasHorizonDrop ((16384 * W + 15693) * 2 ^ 229 - 5) := (shifted_valley_d1_mod16384_contraction 76 W (by decide)).2
theorem shifted_valley_d1_mod16384_drop_r77 (W : Nat) : HasHorizonDrop ((16384 * W + 7205) * 2 ^ 232 - 5) := (shifted_valley_d1_mod16384_contraction 77 W (by decide)).2
theorem shifted_valley_d1_mod16384_drop_r78 (W : Nat) : HasHorizonDrop ((16384 * W + 2621) * 2 ^ 235 - 5) := (shifted_valley_d1_mod16384_contraction 78 W (by decide)).2

theorem two_zero_valley_d5_mod16384_drop_r78 (W : Nat) : HasHorizonDrop ((16384 * W + 12431) * 2 ^ 239 - 7) := (two_zero_valley_d5_mod16384_contraction 78 W (by decide)).2
theorem two_zero_valley_d5_mod16384_drop_r79 (W : Nat) : HasHorizonDrop ((16384 * W + 8663) * 2 ^ 242 - 7) := (two_zero_valley_d5_mod16384_contraction 79 W (by decide)).2
theorem two_zero_valley_d5_mod16384_drop_r80 (W : Nat) : HasHorizonDrop ((16384 * W + 2783) * 2 ^ 245 - 7) := (two_zero_valley_d5_mod16384_contraction 80 W (by decide)).2
theorem two_zero_valley_d5_mod16384_drop_r81 (W : Nat) : HasHorizonDrop ((16384 * W + 7591) * 2 ^ 248 - 7) := (two_zero_valley_d5_mod16384_contraction 81 W (by decide)).2
theorem two_zero_valley_d5_mod16384_drop_r82 (W : Nat) : HasHorizonDrop ((16384 * W + 15407) * 2 ^ 251 - 7) := (two_zero_valley_d5_mod16384_contraction 82 W (by decide)).2
theorem two_zero_valley_d5_mod16384_drop_r83 (W : Nat) : HasHorizonDrop ((16384 * W + 14455) * 2 ^ 254 - 7) := (two_zero_valley_d5_mod16384_contraction 83 W (by decide)).2

theorem two_zero_valley_d4_mod16384_drop_r63 (W : Nat) : HasHorizonDrop ((16384 * W + 6773) * 2 ^ 193 - 7) := (two_zero_valley_d4_mod16384_contraction 63 W (by decide)).2
theorem two_zero_valley_d4_mod16384_drop_r64 (W : Nat) : HasHorizonDrop ((16384 * W + 2573) * 2 ^ 196 - 7) := (two_zero_valley_d4_mod16384_contraction 64 W (by decide)).2
theorem two_zero_valley_d4_mod16384_drop_r65 (W : Nat) : HasHorizonDrop ((16384 * W + 13029) * 2 ^ 199 - 7) := (two_zero_valley_d4_mod16384_contraction 65 W (by decide)).2
theorem two_zero_valley_d4_mod16384_drop_r66 (W : Nat) : HasHorizonDrop ((16384 * W + 6909) * 2 ^ 202 - 7) := (two_zero_valley_d4_mod16384_contraction 66 W (by decide)).2
theorem two_zero_valley_d4_mod16384_drop_r67 (W : Nat) : HasHorizonDrop ((16384 * W + 6229) * 2 ^ 205 - 7) := (two_zero_valley_d4_mod16384_contraction 67 W (by decide)).2
theorem two_zero_valley_d4_mod16384_drop_r68 (W : Nat) : HasHorizonDrop ((16384 * W + 4333) * 2 ^ 208 - 7) := (two_zero_valley_d4_mod16384_contraction 68 W (by decide)).2

theorem shifted_valley_d2_mod16384_drop_r61 (W : Nat) : HasHorizonDrop ((16384 * W + 7439) * 2 ^ 185 - 5) := (shifted_valley_d2_mod16384_contraction 61 W (by decide)).2
theorem shifted_valley_d2_mod16384_drop_r62 (W : Nat) : HasHorizonDrop ((16384 * W + 2647) * 2 ^ 188 - 5) := (shifted_valley_d2_mod16384_contraction 62 W (by decide)).2
theorem shifted_valley_d2_mod16384_drop_r63 (W : Nat) : HasHorizonDrop ((16384 * W + 3935) * 2 ^ 191 - 5) := (shifted_valley_d2_mod16384_contraction 63 W (by decide)).2
theorem shifted_valley_d2_mod16384_drop_r64 (W : Nat) : HasHorizonDrop ((16384 * W + 7719) * 2 ^ 194 - 5) := (shifted_valley_d2_mod16384_contraction 64 W (by decide)).2
theorem shifted_valley_d2_mod16384_drop_r65 (W : Nat) : HasHorizonDrop ((16384 * W + 6319) * 2 ^ 197 - 5) := (shifted_valley_d2_mod16384_contraction 65 W (by decide)).2
theorem shifted_valley_d2_mod16384_drop_r66 (W : Nat) : HasHorizonDrop ((16384 * W + 4343) * 2 ^ 200 - 5) := (shifted_valley_d2_mod16384_contraction 66 W (by decide)).2
```

# Runda 8 Debaty: Domknięcie kaskad rezonansowych `mod 32768` ($v_2 \ge 15$, okres 4096, Części 61 i 62) — 70 twierdzeń i przekroczenie bariery `2^283` (`486` kroków!) w `13.65 s`

## 1. Liniowy Podnośnik Hensela `pow9_mod32768` (okres 4096, $v_2 = 15$): 17-gałęziowa redukcja z podwójną generalizacją `q16` i `q32`

Dla dowolnego wykładnika $k \in \mathbb{N}$ reszta $(9^k) \bmod 32768 = 1 + 8 \cdot s_{32768}(k)$, gdzie indeks $s_{32768}(k) = \frac{9^k - 1}{8} \bmod 4096$ ma okres $4096$. Druga różnica $s_{32768}(4q_4 + r_4)$ względem $q_4 = \lfloor k/4 \rfloor$ wynosi:
$$d_2(r_4) \equiv 1152 + 1024 \cdot (k \bmod 4) \pmod{4096}$$
Dzięki dodaniu członu `512 * ((k % 16) / 4)` wewnątrz nawiasu biliniowego `(... ) * (k / 4)` oraz `1024 * ((k % 16) % 4) * (k / 8)`, przyrost nachylenia przy przesunięciu $k \mapsto k + 16$ wynosi $16 \times 2464 + 4 \times 512 = 41472 \equiv 512 \pmod{4096}$, a jedyny człon zależny od $\lfloor k/32 \rfloor$ to pojedynczy bit parzystości `2048 * (k / 32)`:

$$s_{32768}(k) = \Big(k + 8\lfloor k/2 \rfloor + 2640\lfloor k/4 \rfloor + 80\lfloor (k+1)/4 \rfloor + 896\lfloor k/8 \rfloor + 1536\lfloor k/16 \rfloor + 2048\lfloor k/32 \rfloor + (1792 + 2048((k \bmod 16) \bmod 2))\lfloor (k \bmod 16)/12 \rfloor + 1024((k \bmod 16) \bmod 4)\lfloor k/8 \rfloor + \big(2464(k \bmod 16) + 512\lfloor (k \bmod 16)/4 \rfloor + 3328\lfloor ((k \bmod 16) \bmod 4)/2 \rfloor + 512\lfloor ((k \bmod 16) \bmod 4)/3 \rfloor\big)\lfloor k/4 \rfloor\Big) \bmod 4096$$

### Trzy kluczowe optymalizacje w Lean 4 (`0 sorryAx`, domyślny `maxHeartbeats 200000`, domyślny `maxRecDepth 512`, czas kompilacji całego pliku 70 twierdzeń: `13.65 s`!):
1. **17-gałęziowy dowód `pow9_mod32768` (`3.82 s`) z jednoczesną eliminacją `q16` i `q32`:**
   Zamiast 32 przypadków modulo 32, rozbijamy krok indukcyjny na **17 gałęzi**: $k \bmod 16 \in \{0, \dots, 14\}$ oraz $k \bmod 32 \in \{15, 31\}$. W pierwszych 15 gałęziach zachodzą jednocześnie `(k + 1) / 16 = k / 16` oraz `(k + 1) / 32 = k / 32`, a po `generalize k / 16 = q16; generalize k / 32 = q32` obie zmienne całkowicie znikają z równania ($(9 - 1) \cdot 1536 = 12288 \equiv 0 \pmod{4096}$ oraz $(9 - 1) \cdot 2048 = 16384 \equiv 0 \pmod{4096}$).
2. **Dwuwymiarowy weryfikator `checkResonanceGrid64_sound` na siatce $64 \times 64 = 4096$:**
   Dla okresu $4096$ wywołanie `checkResonanceGrid16 ... 256` wykonywało 256 zagnieżdżonych wywołań rekurencyjnych ($2 \times 256 = 512 = \text{maxRecDepth}$). Zdefiniowanie `checkResonanceGrid64` (64 wiersze po 64 kolumny, korzystające z istniejącego `checkResonanceRow`) zmniejsza głębokość rekursji czterokrotnie do $\max(64, 64) = 64 \ll 512$ i domyka wszystkie 8 rodzin w domyślnym limicie `maxRecDepth 512`.
3. **Brak `s / 32` i `s % 32` w odwrotnościach modularnych $t_{32768}(s) \bmod 4096$:**
   Ponieważ w Grupie I ($u_{\text{base}} = 7$) zachodzi $16 \times 192 = 3072 \equiv 4 d_2 \pmod{4096}$, a w Grupie II ($u_{\text{base}} = 5$) zachodzi $16 \times 64 = 1024 \equiv 4 d_2 \pmod{4096}$, człon biliniowy `C * (s % 16) * (s / 4)` z dodatkiem uniwersalnego członu `2048 * (s % 2) * (s / 8)` **dokładnie kompensuje krzywiznę kwadratową modulo 4096 bez użycia `s / 32` ani `s % 32`**!

## 2. Uniwersalna struktura odwrotności modularnych $t_{32768}(s) \bmod 4096$ dla wszystkich 8 rodzin

Wszystkie 8 rodzin dzieli się na dwie grupy o identycznych ogonach `/ 16` i wspólnym członie `+ 2048 * (s % 2) * (s / 8)`:

1. **Grupa I ($u_{\text{base}} = 7$: `two_zero_valley`, `rle_10011`, `two_zero_valley_d5`, `shifted_valley_d2`)** — wspólny ogon `+ 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8)`:
   - `two_zero_valley` i `rle_10011`: `(3185 * s + 2544 * (s / 2) + 2400 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096`
   - `two_zero_valley_d5`: `(3489 * s + 2730 + 1776 * (s / 2) + 2912 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 3072 * (s % 2) + 3584 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096`
   - `shifted_valley_d2`: `(337 * s + 1668 + 3056 * (s / 2) + 3424 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096`
2. **Grupa II ($u_{\text{base}} = 5$: `shifted_valley`, `rle_10111`, `shifted_valley_d1`, `two_zero_valley_d4`)** — wspólny ogon `+ 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8)`:
   - `shifted_valley`: `(2275 * s + 1232 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096`
   - `rle_10111`: `(1635 * s + 3792 + 3280 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096`
   - `shifted_valley_d1`: `(2427 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 2848 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 2048 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096`
   - `two_zero_valley_d4`: `(907 * s + 3 + 592 * (s / 2) + 2336 * (s / 4) + 288 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1024 * (s % 2) + 2560 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096`

## 3. Zestawienie wszystkich 8 rodzin na poziomie `mod 32768` (`v₂ ≥ 15`, okres 4096)

| # | Rodzina | Licznik $\equiv 0 \pmod{32768}$ | Indeks $s$ | Kroki | Pułap $r_{\max}$ (`mod 32768`) | Twierdzenia `_drop_r...` |
|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{32768}(r+1)$ | $5r+20$ | **`r = 87`** (`2^264`, 455 kr.) | `r82 .. r87` (6 tw.) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{32768}(r+1)$ | $5r+20$ | **`r = 87`** (`2^264`, 455 kr.) | `r82 .. r87` (6 tw.) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{32768}(r+2)$ | $5r+26$ | **`r = 92`** (**`2^283`, 486 kr.!**) | `r87 .. r92` (6 tw.) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{32768}(r+1)$ | $5r+28$ | **`r = 88`** (`2^272`, 468 kr.) | `r83 .. r88` (6 tw.) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{32768}(r)$ | $5r+17$ | **`r = 84`** (`2^253`, 437 kr.) | `r79 .. r84` (6 tw.) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{32768}(r+1)$ | $5r+23$ | **`r = 89`** (`2^272`, 468 kr.) | `r84 .. r89` (6 tw.) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{32768}(r+2)$ | $5r+23$ | **`r = 74`** (`2^226`, 393 kr.) | `r69 .. r74` (6 tw.) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{32768}(r)$ | $5r+20$ | **`r = 72`** (`2^218`, 380 kr.) | `r67 .. r72` (6 tw.) |

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 61 i 62 (`mod 32768`, `v₂ ≥ 15`, 0 sorryAx)

```lean
def checkResonanceGrid64 (M A uBase c : Nat) (tFn : Nat → Nat) : Nat → Bool
  | 0 => true
  | i + 1 => checkResonanceRow M A uBase c tFn (64 * i) 64 && checkResonanceGrid64 M A uBase c tFn i

theorem checkResonanceRow_sound (M A uBase c : Nat) (tFn : Nat → Nat) (base : Nat) :
    ∀ k : Nat, checkResonanceRow M A uBase c tFn base k = true →
      ∀ j : Nat, j < k → (A * (uBase + 8 * tFn (base + j)) * (1 + 8 * (base + j))) % M = c % M
  | 0, _, j, hj => absurd hj (Nat.not_lt_zero j)
  | k + 1, h, j, hj => by
    unfold checkResonanceRow at h
    cases h1 : checkResonanceAt M A uBase c tFn (base + k) <;> simp [h1] at h
    rcases Nat.lt_succ_iff_lt_or_eq.mp hj with hlt | rfl
    · exact checkResonanceRow_sound M A uBase c tFn base k h j hlt
    · unfold checkResonanceAt at h1
      exact of_decide_eq_true h1

theorem checkResonanceGrid64_sound (M A uBase c : Nat) (tFn : Nat → Nat) :
    ∀ k : Nat, checkResonanceGrid64 M A uBase c tFn k = true →
      ∀ s : Nat, s < 64 * k → (A * (uBase + 8 * tFn s) * (1 + 8 * s)) % M = c % M
  | 0, _, s, hs => absurd hs (Nat.not_lt_zero s)
  | k + 1, h, s, hs => by
    unfold checkResonanceGrid64 at h
    cases h1 : checkResonanceRow M A uBase c tFn (64 * k) 64 <;> simp [h1] at h
    have hsplit : s < 64 * k ∨ (64 * k ≤ s ∧ s < 64 * k + 64) := by omega
    rcases hsplit with hlt | ⟨hge, hlt2⟩
    · exact checkResonanceGrid64_sound M A uBase c tFn k h s hlt
    · have hj : s - 64 * k < 64 := by omega
      have hrow := checkResonanceRow_sound M A uBase c tFn (64 * k) 64 h1 (s - 64 * k) hj
      have heq : 64 * k + (s - 64 * k) = s := by omega
      rw [heq] at hrow
      exact hrow

-- =============================================================================
-- Część 61-62: Rezonanse i Kontrakcje mod 32768 (v₂ ≥ 15, okres 4096)
-- =============================================================================

theorem pow9_mod32768 (k : Nat) :
    (9 ^ k) % 32768 = 1 + 8 * ((k + 8 * (k / 2) + 2640 * (k / 4) + 80 * ((k + 1) / 4) +
      896 * (k / 8) + 1536 * (k / 16) + 2048 * (k / 32) +
      (1792 + 2048 * ((k % 16) % 2)) * ((k % 16) / 12) +
      1024 * ((k % 16) % 4) * (k / 8) +
      (2464 * (k % 16) + 512 * ((k % 16) / 4) + 3328 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 4096) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    rw [Nat.pow_succ, Nat.mul_mod, ih]
    clear ih
    have hp : k % 16 = 0 ∨ k % 16 = 1 ∨ k % 16 = 2 ∨ k % 16 = 3 ∨
              k % 16 = 4 ∨ k % 16 = 5 ∨ k % 16 = 6 ∨ k % 16 = 7 ∨
              k % 16 = 8 ∨ k % 16 = 9 ∨ k % 16 = 10 ∨ k % 16 = 11 ∨
              k % 16 = 12 ∨ k % 16 = 13 ∨ k % 16 = 14 ∨ k % 32 = 15 ∨ k % 32 = 31 := by omega
    rcases hp with h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7 | h8 | h9 | h10 | h11 | h12 | h13 | h14 | h15 | h31
    · have hb : (k + 1) % 16 = 1 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h0, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 2 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h1, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 3 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h2, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 4 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h3, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 5 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h4, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 6 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h5, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 7 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h6, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 8 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h7, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 9 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h8, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 10 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h9, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 11 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h10, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 12 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h11, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 13 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h12, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 14 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h13, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have hb : (k + 1) % 16 = 15 := by omega
      have h16 : (k + 1) / 16 = k / 16 := by omega
      have h32 : (k + 1) / 32 = k / 32 := by omega
      rw [h14, hb, h16, h32]; dsimp; generalize k / 16 = q16; generalize k / 32 = q32; omega
    · have ha : k % 16 = 15 := by omega
      have hb : (k + 1) % 16 = 0 := by omega
      rw [ha, hb]; dsimp; omega
    · have ha : k % 16 = 15 := by omega
      have hb : (k + 1) % 16 = 0 := by omega
      rw [ha, hb]; dsimp; omega

theorem pow9_mod32768_succ (r : Nat) :
    (9 ^ (r + 1)) % 32768 = 1 + 8 * ((r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096) := by
  have h2 : r + 1 + 1 = r + 2 := by omega
  have h := pow9_mod32768 (r + 1)
  rw [h2] at h
  exact h

theorem pow9_mod32768_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 32768 = 1 + 8 * ((r + 2 + 8 * ((r + 2) / 2) + 2640 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 1536 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + (1792 + 2048 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (2464 * ((r + 2) % 16) + 512 * (((r + 2) % 16) / 4) + 3328 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 4096) := by
  have h3 : r + 2 + 1 = r + 3 := by omega
  have h := pow9_mod32768 (r + 2)
  rw [h3] at h
  exact h

theorem div2_step14_eq_div32768 (N : Nat) (hN : N % 32768 = 0) :
    collatzIter 14 (N / 2) = N / 32768 := by
  have s1  : collatzStep (N / 2)     = N / 4     := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)     = N / 8     := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)     = N / 16    := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)    = N / 32    := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)    = N / 64    := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)    = N / 128   := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)   = N / 256   := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)   = N / 512   := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)   = N / 1024  := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024)  = N / 2048  := by unfold collatzStep; split <;> omega
  have s11 : collatzStep (N / 2048)  = N / 4096  := by unfold collatzStep; split <;> omega
  have s12 : collatzStep (N / 4096)  = N / 8192  := by unfold collatzStep; split <;> omega
  have s13 : collatzStep (N / 8192)  = N / 16384 := by unfold collatzStep; split <;> omega
  have s14 : collatzStep (N / 16384) = N / 32768 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2)))))))))))))) = N / 32768
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14]

theorem mod32768_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 32768 = b)
    (hge : c ≤ A * M * (32768 * W + u0))
    (hres : (A * u0 * b) % 32768 = c % 32768) :
    (A * M * (32768 * W + u0) - c) % 32768 = 0 := by
  have h1 : (A * M * (32768 * W + u0)) % 32768 = (A * u0 * b) % 32768 := by
    have hcomm : A * M * (32768 * W + u0) = A * (32768 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (32768 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (32768 * W + u0)) % 32768 = (A * u0) % 32768 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 32768, Nat.mul_assoc]
      omega
    have h3 : (M % 32768) = (b % 32768) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod32768`, faza `3r + 3`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod32768_resonance_step20 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 2400 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 32768 := by
  intro s U
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 2400 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 20 = 14 + (5 * r + 6) := by omega
  have hU : U = 2 * (16384 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (16384 * W + 3 + 4 * t), ← hU]
  have h9_mod32768 : (9 ^ (r + 1)) % 32768 = 1 + 8 * s := pow9_mod32768_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 32768 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (32768 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (32768 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (9 ^ (r + 1) * U - 7) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod32768 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (9 ^ (r + 1) * U - 7) hdiv32768

theorem two_zero_valley_mod32768_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 32768 ≤ 32768 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 2400 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (9 ^ (r + 1) * U - 7) / 32768 :=
    two_zero_valley_mod32768_resonance_step20 r W
  have hle : (9 ^ (r + 1) + 32768) * U ≤ (32768 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 2400 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 32775 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 3185 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 3994 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 443 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 20) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod32768`, faza `3r + 3`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod32768_resonance_step20 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((2275 * s + 1232 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096))
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 32768 := by
  intro s U
  let tFn := fun x => (2275 * x + 1232 * (x / 2) + 2592 * (x / 4) + 2592 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2) + 2048 * ((x % 4) / 2)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 20 = 14 + (5 * r + 6) := by omega
  have hU : U = 2 * (16384 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (16384 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod32768 : (9 ^ (r + 1)) % 32768 = 1 + 8 * s := pow9_mod32768_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 32768 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (32768 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (32768 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 1 5 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (9 ^ (r + 1) * U - 5) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod32768 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (9 ^ (r + 1) * U - 5) hdiv32768

theorem shifted_valley_mod32768_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 32768 ≤ 32768 * 2 ^ (3 * r + 3)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((2275 * s + 1232 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (9 ^ (r + 1) * U - 5) / 32768 :=
    shifted_valley_mod32768_resonance_step20 r W
  have hle : (9 ^ (r + 1) + 32768) * U ≤ (32768 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (2275 * x + 1232 * (x / 2) + 2592 * (x / 4) + 2592 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2) + 2048 * ((x % 4) / 2)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 32773 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 2275 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 3438 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 2657 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 20) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod32768`, `3r + 7`, `5r + 26` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod32768_resonance_step26 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 2640 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 1536 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + (1792 + 2048 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (2464 * ((r + 2) % 16) + 512 * (((r + 2) % 16) / 4) + 3328 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 2400 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 26) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 32768 := by
  intro s U
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 2400 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 26 = 14 + (5 * r + 12) := by omega
  have hU : U = 2 * (16384 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (16384 * W + 3 + 4 * t), ← hU]
  have h9_mod32768 : (9 ^ (r + 2)) % 32768 = 1 + 8 * s := pow9_mod32768_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 32768 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (32768 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (32768 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (9 ^ (r + 2) * U - 7) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod32768 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (9 ^ (r + 2) * U - 7) hdiv32768

theorem rle_10011_mod32768_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 65536 ≤ 32768 * 2 ^ (3 * r + 7)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 2640 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 1536 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + (1792 + 2048 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (2464 * ((r + 2) % 16) + 512 * (((r + 2) % 16) / 4) + 3328 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 2400 * (s / 4) + 352 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 26) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 26) n0 = (9 ^ (r + 2) * U - 7) / 32768 :=
    rle_10011_mod32768_resonance_step26 r W
  have hle : (9 ^ (r + 2) + 65536) * U ≤ (32768 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 2400 * (x / 4) + 352 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 32775 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 3994 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 443 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hmul := Nat.mul_le_mul_right u hpow9
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 26) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 26) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 26) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod32768`, `3r + 8`, `5r + 28` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod32768_resonance_step28 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((1635 * s + 3792 + 3280 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096))
    collatzIter (5 * r + 28) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 32768 := by
  intro s U
  let tFn := fun x => (1635 * x + 3792 + 3280 * (x / 2) + 2592 * (x / 4) + 2592 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2) + 2048 * ((x % 4) / 2)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 28 = 14 + (5 * r + 14) := by omega
  have hU : U = 2 * (16384 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (16384 * W + 2 + 4 * t), ← hU]
  have h9_mod32768 : (9 ^ (r + 1)) % 32768 = 1 + 8 * s := pow9_mod32768_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 32768 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (32768 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (32768 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 27 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (27 * 9 ^ (r + 1) * U - 7) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod32768 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (27 * 9 ^ (r + 1) * U - 7) hdiv32768

theorem rle_10111_mod32768_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 65536 ≤ 32768 * 2 ^ (3 * r + 8)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((1635 * s + 3792 + 3280 * (s / 2) + 2592 * (s / 4) + 2592 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1536 * (((s + 1) % 4) / 2) + 2048 * ((s % 4) / 2)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 28) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 28) n0 = (27 * 9 ^ (r + 1) * U - 7) / 32768 :=
    rle_10111_mod32768_resonance_step28 r W
  have hle : (27 * 9 ^ (r + 1) + 65536) * U ≤ (32768 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (1635 * x + 3792 + 3280 * (x / 2) + 2592 * (x / 4) + 2592 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1536 * (((x + 1) % 4) / 2) + 2048 * ((x % 4) / 2)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 32775 ≤ 27 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 1331 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 2878 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (0 + 1 + 1) * U = 2187 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hval : 19683 ≤ 27 * 9 ^ (r'' + 1 + 1 + 1) := by omega
            have hmul := Nat.mul_le_mul_right u hval
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 28) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 28) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 28) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod32768`, `3r + 1`, `5r + 17` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod32768_resonance_step17 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 2640 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 1536 * (r / 16) + 2048 * (r / 32) + (1792 + 2048 * ((r % 16) % 2)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (2464 * (r % 16) + 512 * ((r % 16) / 4) + 3328 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((2427 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 2848 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 2048 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 17) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 32768 := by
  intro s U
  let tFn := fun x => (2427 * x + 1365 + 848 * (x / 2) + 800 * (x / 4) + 2848 * ((x + 1) / 4) + 2816 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 2048 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 17 = 14 + (5 * r + 3) := by omega
  have hU : U = 2 * (16384 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (16384 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod32768 : (9 ^ r) % 32768 = 1 + 8 * s := pow9_mod32768 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 32768 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (32768 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (32768 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 3 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (3 * 9 ^ r * U - 7) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod32768 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (3 * 9 ^ r * U - 7) hdiv32768

theorem shifted_valley_d1_mod32768_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 32768 ≤ 32768 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 2640 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 1536 * (r / 16) + 2048 * (r / 32) + (1792 + 2048 * ((r % 16) % 2)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (2464 * (r % 16) + 512 * ((r % 16) / 4) + 3328 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((2427 * s + 1365 + 848 * (s / 2) + 800 * (s / 4) + 2848 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 2048 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 17) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 17) n0 = (3 * 9 ^ r * U - 7) / 32768 :=
    shifted_valley_d1_mod32768_resonance_step17 r W
  have hle : (3 * 9 ^ r + 32768) * U ≤ (32768 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (2427 * x + 1365 + 848 * (x / 2) + 800 * (x / 4) + 2848 * ((x + 1) / 4) + 2816 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 2048 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 32775 ≤ 3 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 1365 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0) * U = 3 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 3792 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (1) * U = 27 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 1331 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (2) * U = 243 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                cases r''' with
                | zero =>
                  have hs3 : s = 91 := rfl
                  have ht3 : tFn s = 2878 := by rw [hs3]
                  have hpow3 : 3 * 9 ^ (3) * U = 2187 * U := rfl
                  rw [ht3] at hU_def; rw [hpow3, hU_def]; clear hs3 ht3 hpow3 hU_def U s tFn; omega
                | succ r'''' =>
                    generalize tFn s = t at hU_def
                    generalize U = u at hU_def ⊢
                    clear U s tFn
                    have hpow9 : 6561 ≤ 9 ^ (r'''' + 1 + 1 + 1 + 1) := by
                      rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                      have := pow9_pos r''''
                      omega
                    have hval : 19683 ≤ 3 * 9 ^ (r'''' + 1 + 1 + 1 + 1) := by omega
                    have hmul := Nat.mul_le_mul_right u hval
                    omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 17) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 17) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 17) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod32768`, `3r + 5`, `5r + 23` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod32768_resonance_step23 (r W : Nat) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3489 * s + 2730 + 1776 * (s / 2) + 2912 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 3072 * (s % 2) + 3584 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 23) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 32768 := by
  intro s U
  let tFn := fun x => (3489 * x + 2730 + 1776 * (x / 2) + 2912 * (x / 4) + 864 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 3072 * (x % 2) + 3584 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 23 = 14 + (5 * r + 9) := by omega
  have hU : U = 2 * (16384 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (16384 * W + 3 + 4 * t), ← hU]
  have h9_mod32768 : (9 ^ (r + 1)) % 32768 = 1 + 8 * s := pow9_mod32768_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 32768 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (32768 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (32768 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 3 7 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (3 * 9 ^ (r + 1) * U - 5) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod32768 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (3 * 9 ^ (r + 1) * U - 5) hdiv32768

theorem two_zero_valley_d5_mod32768_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 32768 ≤ 32768 * 2 ^ (3 * r + 5)) :
    let s := (r + 1 + 8 * ((r + 1) / 2) + 2640 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 896 * ((r + 1) / 8) + 1536 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + (1792 + 2048 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (2464 * ((r + 1) % 16) + 512 * (((r + 1) % 16) / 4) + 3328 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((3489 * s + 2730 + 1776 * (s / 2) + 2912 * (s / 4) + 864 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 3072 * (s % 2) + 3584 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 23) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 23) n0 = (3 * 9 ^ (r + 1) * U - 5) / 32768 :=
    two_zero_valley_d5_mod32768_resonance_step23 r W
  have hle : (3 * 9 ^ (r + 1) + 32768) * U ≤ (32768 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (3489 * x + 2730 + 1776 * (x / 2) + 2912 * (x / 4) + 864 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 3072 * (x % 2) + 3584 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 32773 ≤ 3 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 2123 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 3876 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 885 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (0 + 1 + 1 + 1) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 23) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 23) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 23) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod32768`, `3r + 4`, `5r + 23` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod32768_resonance_step23 (r W : Nat) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 2640 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 1536 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + (1792 + 2048 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (2464 * ((r + 2) % 16) + 512 * (((r + 2) % 16) / 4) + 3328 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 2336 * (s / 4) + 288 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1024 * (s % 2) + 2560 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 23) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 32768 := by
  intro s U
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 2336 * (x / 4) + 288 * ((x + 1) / 4) + 2816 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1024 * (x % 2) + 2560 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 23 = 14 + (5 * r + 9) := by omega
  have hU : U = 2 * (16384 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (16384 * W + 2 + 4 * t), ← hU]
  have h9_mod32768 : (9 ^ (r + 2)) % 32768 = 1 + 8 * s := pow9_mod32768_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 32768 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (32768 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (32768 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 1 5 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (9 ^ (r + 2) * U - 29) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod32768 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (9 ^ (r + 2) * U - 29) hdiv32768

theorem two_zero_valley_d4_mod32768_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 65536 ≤ 32768 * 2 ^ (3 * r + 4)) :
    let s := (r + 2 + 8 * ((r + 2) / 2) + 2640 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 896 * ((r + 2) / 8) + 1536 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + (1792 + 2048 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (2464 * ((r + 2) % 16) + 512 * (((r + 2) % 16) / 4) + 3328 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 4096
    let U := 32768 * W + (5 + 8 * ((907 * s + 3 + 592 * (s / 2) + 2336 * (s / 4) + 288 * ((s + 1) / 4) + 2816 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (64 * (s % 16) + 1024 * (s % 2) + 2560 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 23) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 23) n0 = (9 ^ (r + 2) * U - 29) / 32768 :=
    two_zero_valley_d4_mod32768_resonance_step23 r W
  have hle : (9 ^ (r + 2) + 65536) * U ≤ (32768 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (907 * x + 3 + 592 * (x / 2) + 2336 * (x / 4) + 288 * ((x + 1) / 4) + 2816 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (64 * (x % 16) + 1024 * (x % 2) + 2560 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 32797 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 1921 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 668 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 6561 ≤ 9 ^ (r'' + 1 + 1 + 2) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hmul := Nat.mul_le_mul_right u hpow9
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 23) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 23) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 23) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod32768`, `3r + 2`, `5r + 20` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod32768_resonance_step20 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 2640 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 1536 * (r / 16) + 2048 * (r / 32) + (1792 + 2048 * ((r % 16) % 2)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (2464 * (r % 16) + 512 * ((r % 16) / 4) + 3328 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((337 * s + 1668 + 3056 * (s / 2) + 3424 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    collatzIter (5 * r + 20) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 32768 := by
  intro s U
  let tFn := fun x => (337 * x + 1668 + 3056 * (x / 2) + 3424 * (x / 4) + 1376 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 20 = 14 + (5 * r + 6) := by omega
  have hU : U = 2 * (16384 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 14 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (16384 * W + 3 + 4 * t) (by omega), ← hU]
  have h9_mod32768 : (9 ^ r) % 32768 = 1 + 8 * s := pow9_mod32768 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 32768 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (32768 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (32768 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 4096 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid64_sound 32768 27 7 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv32768 : (27 * 9 ^ r * U - 29) % 32768 = 0 := by
    have h1 := mod32768_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod32768 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step14_eq_div32768 (27 * 9 ^ r * U - 29) hdiv32768

theorem shifted_valley_d2_mod32768_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 32768 ≤ 32768 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 2640 * (r / 4) + 80 * ((r + 1) / 4) + 896 * (r / 8) + 1536 * (r / 16) + 2048 * (r / 32) + (1792 + 2048 * ((r % 16) % 2)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (2464 * (r % 16) + 512 * ((r % 16) / 4) + 3328 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 4096
    let U := 32768 * W + (7 + 8 * ((337 * s + 1668 + 3056 * (s / 2) + 3424 * (s / 4) + 1376 * ((s + 1) / 4) + 256 * (s / 8) + 512 * (s / 16) + 512 * ((s + 4) / 16) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 4096))
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 20) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 20) n0 = (27 * 9 ^ r * U - 29) / 32768 :=
    shifted_valley_d2_mod32768_resonance_step20 r W
  have hle : (27 * 9 ^ r + 32768) * U ≤ (32768 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 32768 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (337 * x + 1668 + 3056 * (x / 2) + 3424 * (x / 4) + 1376 * ((x + 1) / 4) + 256 * (x / 8) + 512 * (x / 16) + 512 * ((x + 4) / 16) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 4096
  have hU_def : U = 32768 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 32797 ≤ 27 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 1668 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 2005 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 222 := by rw [hs2]
              have hpow2 : 27 * 9 ^ (2) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 27 * 9 ^ (r''' + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 20) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 20) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 20) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- Konkretne twierdzenia horyzontowe _mod32768_drop_r...
-- -----------------------------------------------------------------------------
set_option exponentiation.threshold 512

theorem two_zero_valley_mod32768_drop_r82 (W : Nat) : HasHorizonDrop ((32768 * W + 5727) * 2 ^ 249 - 7) := (two_zero_valley_mod32768_contraction 82 W (by decide)).2
theorem two_zero_valley_mod32768_drop_r83 (W : Nat) : HasHorizonDrop ((32768 * W + 11559) * 2 ^ 252 - 7) := (two_zero_valley_mod32768_contraction 83 W (by decide)).2
theorem two_zero_valley_mod32768_drop_r84 (W : Nat) : HasHorizonDrop ((32768 * W + 12207) * 2 ^ 255 - 7) := (two_zero_valley_mod32768_contraction 84 W (by decide)).2
theorem two_zero_valley_mod32768_drop_r85 (W : Nat) : HasHorizonDrop ((32768 * W + 12279) * 2 ^ 258 - 7) := (two_zero_valley_mod32768_contraction 85 W (by decide)).2
theorem two_zero_valley_mod32768_drop_r86 (W : Nat) : HasHorizonDrop ((32768 * W + 12287) * 2 ^ 261 - 7) := (two_zero_valley_mod32768_contraction 86 W (by decide)).2
theorem two_zero_valley_mod32768_drop_r87 (W : Nat) : HasHorizonDrop ((32768 * W + 8647) * 2 ^ 264 - 7) := (two_zero_valley_mod32768_contraction 87 W (by decide)).2

theorem shifted_valley_mod32768_drop_r82 (W : Nat) : HasHorizonDrop ((32768 * W + 13453) * 2 ^ 249 - 5) := (shifted_valley_mod32768_contraction 82 W (by decide)).2
theorem shifted_valley_mod32768_drop_r83 (W : Nat) : HasHorizonDrop ((32768 * W + 26981) * 2 ^ 252 - 5) := (shifted_valley_mod32768_contraction 83 W (by decide)).2
theorem shifted_valley_mod32768_drop_r84 (W : Nat) : HasHorizonDrop ((32768 * W + 32125) * 2 ^ 255 - 5) := (shifted_valley_mod32768_contraction 84 W (by decide)).2
theorem shifted_valley_mod32768_drop_r85 (W : Nat) : HasHorizonDrop ((32768 * W + 18133) * 2 ^ 258 - 5) := (shifted_valley_mod32768_contraction 85 W (by decide)).2
theorem shifted_valley_mod32768_drop_r86 (W : Nat) : HasHorizonDrop ((32768 * W + 27501) * 2 ^ 261 - 5) := (shifted_valley_mod32768_contraction 86 W (by decide)).2
theorem shifted_valley_mod32768_drop_r87 (W : Nat) : HasHorizonDrop ((32768 * W + 24901) * 2 ^ 264 - 5) := (shifted_valley_mod32768_contraction 87 W (by decide)).2

theorem rle_10011_mod32768_drop_r87 (W : Nat) : HasHorizonDrop ((32768 * W + 26447) * 2 ^ 268 - 13) := (rle_10011_mod32768_contraction 87 W (by decide)).2
theorem rle_10011_mod32768_drop_r88 (W : Nat) : HasHorizonDrop ((32768 * W + 21143) * 2 ^ 271 - 13) := (rle_10011_mod32768_contraction 88 W (by decide)).2
theorem rle_10011_mod32768_drop_r89 (W : Nat) : HasHorizonDrop ((32768 * W + 9631) * 2 ^ 274 - 13) := (rle_10011_mod32768_contraction 89 W (by decide)).2
theorem rle_10011_mod32768_drop_r90 (W : Nat) : HasHorizonDrop ((32768 * W + 4711) * 2 ^ 277 - 13) := (rle_10011_mod32768_contraction 90 W (by decide)).2
theorem rle_10011_mod32768_drop_r91 (W : Nat) : HasHorizonDrop ((32768 * W + 15087) * 2 ^ 280 - 13) := (rle_10011_mod32768_contraction 91 W (by decide)).2
theorem rle_10011_mod32768_drop_r92 (W : Nat) : HasHorizonDrop ((32768 * W + 12599) * 2 ^ 283 - 13) := (rle_10011_mod32768_contraction 92 W (by decide)).2

theorem rle_10111_mod32768_drop_r83 (W : Nat) : HasHorizonDrop ((32768 * W + 4069) * 2 ^ 257 - 9) := (rle_10111_mod32768_contraction 83 W (by decide)).2
theorem rle_10111_mod32768_drop_r84 (W : Nat) : HasHorizonDrop ((32768 * W + 4093) * 2 ^ 260 - 9) := (rle_10111_mod32768_contraction 84 W (by decide)).2
theorem rle_10111_mod32768_drop_r85 (W : Nat) : HasHorizonDrop ((32768 * W + 25941) * 2 ^ 263 - 9) := (rle_10111_mod32768_contraction 85 W (by decide)).2
theorem rle_10111_mod32768_drop_r86 (W : Nat) : HasHorizonDrop ((32768 * W + 13805) * 2 ^ 266 - 9) := (rle_10111_mod32768_contraction 86 W (by decide)).2
theorem rle_10111_mod32768_drop_r87 (W : Nat) : HasHorizonDrop ((32768 * W + 30661) * 2 ^ 269 - 9) := (rle_10111_mod32768_contraction 87 W (by decide)).2
theorem rle_10111_mod32768_drop_r88 (W : Nat) : HasHorizonDrop ((32768 * W + 28893) * 2 ^ 272 - 9) := (rle_10111_mod32768_contraction 88 W (by decide)).2

theorem shifted_valley_d1_mod32768_drop_r79 (W : Nat) : HasHorizonDrop ((32768 * W + 7573) * 2 ^ 238 - 5) := (shifted_valley_d1_mod32768_contraction 79 W (by decide)).2
theorem shifted_valley_d1_mod32768_drop_r80 (W : Nat) : HasHorizonDrop ((32768 * W + 15405) * 2 ^ 241 - 5) := (shifted_valley_d1_mod32768_contraction 80 W (by decide)).2
theorem shifted_valley_d1_mod32768_drop_r81 (W : Nat) : HasHorizonDrop ((32768 * W + 23557) * 2 ^ 244 - 5) := (shifted_valley_d1_mod32768_contraction 81 W (by decide)).2
theorem shifted_valley_d1_mod32768_drop_r82 (W : Nat) : HasHorizonDrop ((32768 * W + 17181) * 2 ^ 247 - 5) := (shifted_valley_d1_mod32768_contraction 82 W (by decide)).2
theorem shifted_valley_d1_mod32768_drop_r83 (W : Nat) : HasHorizonDrop ((32768 * W + 1909) * 2 ^ 250 - 5) := (shifted_valley_d1_mod32768_contraction 83 W (by decide)).2
theorem shifted_valley_d1_mod32768_drop_r84 (W : Nat) : HasHorizonDrop ((32768 * W + 3853) * 2 ^ 253 - 5) := (shifted_valley_d1_mod32768_contraction 84 W (by decide)).2

theorem two_zero_valley_d5_mod32768_drop_r84 (W : Nat) : HasHorizonDrop ((32768 * W + 21631) * 2 ^ 257 - 7) := (two_zero_valley_d5_mod32768_contraction 84 W (by decide)).2
theorem two_zero_valley_d5_mod32768_drop_r85 (W : Nat) : HasHorizonDrop ((32768 * W + 16967) * 2 ^ 260 - 7) := (two_zero_valley_d5_mod32768_contraction 85 W (by decide)).2
theorem two_zero_valley_d5_mod32768_drop_r86 (W : Nat) : HasHorizonDrop ((32768 * W + 9167) * 2 ^ 263 - 7) := (two_zero_valley_d5_mod32768_contraction 86 W (by decide)).2
theorem two_zero_valley_d5_mod32768_drop_r87 (W : Nat) : HasHorizonDrop ((32768 * W + 19223) * 2 ^ 266 - 7) := (two_zero_valley_d5_mod32768_contraction 87 W (by decide)).2
theorem two_zero_valley_d5_mod32768_drop_r88 (W : Nat) : HasHorizonDrop ((32768 * W + 31263) * 2 ^ 269 - 7) := (two_zero_valley_d5_mod32768_contraction 88 W (by decide)).2
theorem two_zero_valley_d5_mod32768_drop_r89 (W : Nat) : HasHorizonDrop ((32768 * W + 25319) * 2 ^ 272 - 7) := (two_zero_valley_d5_mod32768_contraction 89 W (by decide)).2

theorem two_zero_valley_d4_mod32768_drop_r69 (W : Nat) : HasHorizonDrop ((32768 * W + 31429) * 2 ^ 211 - 7) := (two_zero_valley_d4_mod32768_contraction 69 W (by decide)).2
theorem two_zero_valley_d4_mod32768_drop_r70 (W : Nat) : HasHorizonDrop ((32768 * W + 7133) * 2 ^ 214 - 7) := (two_zero_valley_d4_mod32768_contraction 70 W (by decide)).2
theorem two_zero_valley_d4_mod32768_drop_r71 (W : Nat) : HasHorizonDrop ((32768 * W + 18997) * 2 ^ 217 - 7) := (two_zero_valley_d4_mod32768_contraction 71 W (by decide)).2
theorem two_zero_valley_d4_mod32768_drop_r72 (W : Nat) : HasHorizonDrop ((32768 * W + 27597) * 2 ^ 220 - 7) := (two_zero_valley_d4_mod32768_contraction 72 W (by decide)).2
theorem two_zero_valley_d4_mod32768_drop_r73 (W : Nat) : HasHorizonDrop ((32768 * W + 13989) * 2 ^ 223 - 7) := (two_zero_valley_d4_mod32768_contraction 73 W (by decide)).2
theorem two_zero_valley_d4_mod32768_drop_r74 (W : Nat) : HasHorizonDrop ((32768 * W + 12477) * 2 ^ 226 - 7) := (two_zero_valley_d4_mod32768_contraction 74 W (by decide)).2

theorem shifted_valley_d2_mod32768_drop_r67 (W : Nat) : HasHorizonDrop ((32768 * W + 2303) * 2 ^ 203 - 5) := (shifted_valley_d2_mod32768_contraction 67 W (by decide)).2
theorem shifted_valley_d2_mod32768_drop_r68 (W : Nat) : HasHorizonDrop ((32768 * W + 29383) * 2 ^ 206 - 5) := (shifted_valley_d2_mod32768_contraction 68 W (by decide)).2
theorem shifted_valley_d2_mod32768_drop_r69 (W : Nat) : HasHorizonDrop ((32768 * W + 28751) * 2 ^ 209 - 5) := (shifted_valley_d2_mod32768_contraction 69 W (by decide)).2
theorem shifted_valley_d2_mod32768_drop_r70 (W : Nat) : HasHorizonDrop ((32768 * W + 21399) * 2 ^ 212 - 5) := (shifted_valley_d2_mod32768_contraction 70 W (by decide)).2
theorem shifted_valley_d2_mod32768_drop_r71 (W : Nat) : HasHorizonDrop ((32768 * W + 24223) * 2 ^ 215 - 5) := (shifted_valley_d2_mod32768_contraction 71 W (by decide)).2
theorem shifted_valley_d2_mod32768_drop_r72 (W : Nat) : HasHorizonDrop ((32768 * W + 17255) * 2 ^ 218 - 5) := (shifted_valley_d2_mod32768_contraction 72 W (by decide)).2
```


---

# RUNDA 9: Pomost Biliniowy `pow9_mod65536` (Okres 8192), Dwuwymiarowy Ewaluator `checkResonanceGrid128`, Uniwersalne Prawo Skalowania Afinicznego oraz Rezonanse i Kontrakcje `mod 65536` (`v₂ ≥ 16`) dla Wszystkich 8 Kanonicznych Rodzin i Faz Modulo-3 (Części 63 i 64 — aż do `r = 98`, `2^301` w `517` krokach!)

**Autor:** Architekt 3 (Fotel Inżyniera Automatu RLE i Tunelowania MSB-LSB — profil konstrukcyjny Claude Sonnet 5.5)  
**Status weryfikacji Lean 4:** **100% ZWERYFIKOWANE** (`~/.elan/bin/lean /tmp/test_mod65536.lean` — kod wyjścia `0`, **70 twierdzeń docelowych + 3 lematy krokowe = 73 deklaracje**, **`0 sorryAx`**, domyślny `maxRecDepth 512`).

## 1. Pomost Biliniowy dla `pow9_mod65536` (Okres 8192, `v₂ = 16`) oraz Trójpodział Indukcyjny Kroków `k % 16`

W Rundzie 9 podnosimy wykładnik rezonansu 2-adycznego o kolejny rząd: z $M = 32768 = 2^{15}$ (okres $4096 = 2^{12}$) do **$M = 65536 = 2^{16}$** (okres **$8192 = 2^{13}$**, $v_2 ge 16$).
Każda potęga $9^k pmod{65536}$ ma postać:
$$(9^k) mod 65536 = 1 + 8 cdot (s_{65536}(k) mod 8192),$$
gdzie skompresowana funkcja biliniowa $s_{65536}(k)$ (po wchłonięciu składników blokowych $k mod 16$ w ilorazy globalne $k/4, k/8, k/16$) przyjmuje zamkniętą postać:
```lean
s65536(k) =
  (k + 8 * (k / 2) + 3664 * (k / 4) + 80 * ((k + 1) / 4) +
   2944 * (k / 8) + 5632 * (k / 16) + 2048 * (k / 32) + 4096 * (k / 64) + 4096 * ((k + 16) / 64) +
   6144 * ((k % 16) % 2) * ((k % 16) / 8) +
   (1792 + 6144 * ((k % 16) % 4)) * ((k % 16) / 12) +
   1024 * ((k % 16) % 4) * (k / 8) +
   (1440 * (k % 16) + (7680 + 5120 * ((k % 16) % 2)) * ((k % 16) / 4) +
    5376 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 8192
```
Aby utrzymać kompilację `pow9_mod65536` w ~4 sekundach przy domyślnym `maxRecDepth 512`, krok indukcyjny został rozbity na 3 lematy pomocnicze:
1. `pow9_mod65536_step_lt8` ($k mod 16 < 8$: 8 podprzypadków $b in {0..7}$),
2. `pow9_mod65536_step_mid` ($8 le k mod 16 < 15$: 7 podprzypadków $b in {8..14}$),
3. `pow9_mod65536_step_15` ($k mod 16 = 15$: 4 podprzypadki przeniesienia przez granicę bloku $k mod 64 in {15, 31, 47, 63}$).

Dodatkowo, ponieważ `r + 1 + 1` jest definicyjnie równe `r + 2` w Lean 4 (a `r + 1 + 16` jest definicyjnie równe `r + 17`), lematy przesunięte `pow9_mod65536_succ` oraz `pow9_mod65536_succ2` dowodzone są natychmiastowo jedną linijką `exact pow9_mod65536 (r + 1)` oraz `exact pow9_mod65536 (r + 2)` bez kosztownego przepisywania `rw`.

## 2. Dwuwymiarowy Ewaluator `checkResonanceGrid128` i Uniwersalne Prawo Skalowania Afinicznego Odwrotności 2-Adycznej

### 2.1. Siatka `checkResonanceGrid128` ($64 	imes 128 = 8192$)
Aby zweryfikować tożsamość modularną
$$(A cdot (u_{\text{base}} + 8 cdot t(s)) cdot (1 + 8s)) mod 65536 = c mod 65536$$
dla wszystkich $s in [0, 8192)$ bez przekraczania domyślnego limitu głębokości rekursji (`maxRecDepth = 512`), definiujemy dwuwymiarową siatkę `checkResonanceGrid128` wywołującą $64$ wiersze po $128$ elementów za pomocą istniejącego `checkResonanceRow`:
- Głębokość rekursji zewnętrznej: $64 ll 512$,
- Głębokość rekursji wewnętrznej (`checkResonanceRow`): $128 ll 512$.

### 2.2. Uniwersalne Prawo Skalowania Afinicznego $T_{\text{fam}}[s] pmod{8192}$
Dla każdej z 8 kanonicznych rodzin $(A, u_{\text{base}}, c)$ tablica odwrotności modularnej $T_{\text{fam}}[s] in [0, 8192)$ jest jednoznacznie związana z tablicą bazową rodziny `two_zero_valley` ($A=1, u_{\text{base}}=7, c=7$, gdzie $1 + 8 cdot T_{\text{tzv}}[s] equiv (1 + 8s)^{-1} pmod{65536}$) dokładną tożsamością afiniczną w $\mathbb{Z}/8192\mathbb{Z}$:
$$T_{\text{fam}}[s] \equiv t_0 + M_{\text{fam}} \cdot T_{\text{tzv}}[s] \pmod{8192}, \qquad M_{\text{fam}} \equiv (u_{\text{base}} + 8 t_0) \cdot 7^{-1} \pmod{8192},$$
gdzie:
1. **`two_zero_valley`** ($A=1, u_{\text{base}}=7, c=7$): $t_0 = 0,\; M = 1$,
2. **`shifted_valley`** ($A=1, u_{\text{base}}=5, c=5$): $t_0 = 0,\; M = 1171 \equiv 5 \cdot 7^{-1} \pmod{8192}$,
3. **`rle_10011`** ($A=1, u_{\text{base}}=7, c=7$): $t_0 = 0,\; M = 1$ (identyczna funkcja `tFn` jak `two_zero_valley`),
4. **`rle_10111`** ($A=27, u_{\text{base}}=5, c=7$): $t_0 = 7888,\; M = 6675$,
5. **`shifted_valley_d1`** ($A=3, u_{\text{base}}=5, c=7$): $t_0 = 5461,\; M = 2731$,
6. **`two_zero_valley_d5`** ($A=3, u_{\text{base}}=7, c=5$): $t_0 = 2730,\; M = 3121$,
7. **`two_zero_valley_d4`** ($A=1, u_{\text{base}}=5, c=29$): $t_0 = 3,\; M = 3515$,
8. **`shifted_valley_d2`** ($A=27, u_{\text{base}}=7, c=29$): $t_0 = 5764,\; M = 737$.

## 3. Zbiorcza Tabela Wszystkich 8 Rodzin `mod 65536` (`v₂ ≥ 16`, Części 63 i 64)

| # | Rodzina / Faza Modulo-3 | Licznik Wyjściowy | $s \in [0, 8192)$ | Liczba kroków | Maksymalny zasięg kontrakcji $r_{\max}$ | Twierdzenia horyzontowe `_mod65536_drop_r...` |
|---|---|---|---|---|---|---|
| 1 | **`two_zero_valley`** (`-7`, $3r+3$) | $9^{r+1} U - 7$ | $s_{65536}(r+1)$ | $5r+21$ | **`r = 93`** (`2^282`, 486 kr.) | `r88 .. r93` (`u₀ = 59215, 21143, 9631, 37479, 47855, 12599`) |
| 2 | **`shifted_valley`** (`-5`, $3r+3$) | $9^{r+1} U - 5$ | $s_{65536}(r+1)$ | $5r+21$ | **`r = 93`** (`2^282`, 486 kr.) | `r88 .. r93` (`u₀ = 61021, 43189, 63053, 36133, 62269, 65173`) |
| 3 | **`rle_10011`** (`-13`, $3r+7$) | $9^{r+2} U - 7$ | $s_{65536}(r+2)$ | $5r+27$ | **`r = 98`** (`2^301`, 517 kr.) | `r93 .. r98` (`u₀ = 30527, 32519, 10895, 52183, 42207, 26535`) |
| 4 | **`rle_10111`** (`-9`, $3r+8$) | $27 \cdot 9^{r+1} U - 7$ | $s_{65536}(r+1)$ | $5r+29$ | **`r = 94`** (`2^290`, 499 kr.) | `r89 .. r94` (`u₀ = 46901, 12493, 37797, 26045, 32021, 32685`) |
| 5 | **`shifted_valley_d1`** (`-5`, $3r+1$) | $3 \cdot 9^r U - 7$ | $s_{65536}(r)$ | $5r+18$ | **`r = 90`** (`2^271`, 468 kr.) | `r85 .. r90` (`u₀ = 4069, 36861, 25941, 46573, 63429, 28893`) |
| 6 | **`two_zero_valley_d5`** (`-7`, $3r+5$) | $3 \cdot 9^{r+1} U - 5$ | $s_{65536}(r+1)$ | $5r+24$ | **`r = 95`** (`2^290`, 499 kr.) | `r90 .. r95` (`u₀ = 42863, 55735, 64447, 65415, 50959, 42071`) |
| 7 | **`two_zero_valley_d4`** (`-7`, $3r+4$) | $9^{r+2} U - 29$ | $s_{65536}(r+2)$ | $5r+24$ | **`r = 80`** (`2^244`, 424 kr.) | `r75 .. r80` (`u₀ = 12309, 23213, 9861, 22941, 2549, 7565`) |
| 8 | **`shifted_valley_d2`** (`-5`, $3r+2$) | $27 \cdot 9^r U - 29$ | $s_{65536}(r)$ | $5r+21$ | **`r = 77`** (`2^233`, 406 kr.) | `r72 .. r77` (`u₀ = 50023, 41967, 4663, 36927, 4103, 29583`) |

*(Uwaga arytmetyczna dla `shifted_valley_d2`: dla $r = 77$ zachodzi $27 \cdot 9^{77} + 65536 < 65536 \cdot 2^{233}$, natomiast dla $r = 78$ mamy $27 \cdot 9^{78} / 2^{234} \approx 263306{,}35 > 262144 = 65536 \cdot 2^2$, zatem dokładny próg bezwarunkowej kontrakcji wynosi $r_{\max} = 77$, a 6 twierdzeń horyzontowych obejmuje `r72 .. r77`).*

## 4. Kompletny, zweryfikowany kod Lean 4 dla Części 63 i 64 (`mod 65536`, `v₂ ≥ 16`, 0 sorryAx)

```lean
def checkResonanceGrid128 (M A uBase c : Nat) (tFn : Nat → Nat) : Nat → Bool
  | 0 => true
  | i + 1 => checkResonanceRow M A uBase c tFn (128 * i) 128 && checkResonanceGrid128 M A uBase c tFn i

theorem checkResonanceGrid128_sound (M A uBase c : Nat) (tFn : Nat → Nat) :
    ∀ k : Nat, checkResonanceGrid128 M A uBase c tFn k = true →
      ∀ s : Nat, s < 128 * k → (A * (uBase + 8 * tFn s) * (1 + 8 * s)) % M = c % M
  | 0, _, s, hs => absurd hs (Nat.not_lt_zero s)
  | k + 1, h, s, hs => by
    unfold checkResonanceGrid128 at h
    cases h1 : checkResonanceRow M A uBase c tFn (128 * k) 128 <;> simp [h1] at h
    have hsplit : s < 128 * k ∨ (128 * k ≤ s ∧ s < 128 * k + 128) := by omega
    rcases hsplit with hlt | ⟨hge, hlt2⟩
    · exact checkResonanceGrid128_sound M A uBase c tFn k h s hlt
    · have hj : s - 128 * k < 128 := by omega
      have hrow := checkResonanceRow_sound M A uBase c tFn (128 * k) 128 h1 (s - 128 * k) hj
      have heq : 128 * k + (s - 128 * k) = s := by omega
      rw [heq] at hrow
      exact hrow

theorem pow9_mod65536_step_lt8 (k : Nat) (hlt8 : k % 16 < 8)
    (ih : (9 ^ k) % 65536 = 1 + 8 * ((k + 8 * (k / 2) + 3664 * (k / 4) + 80 * ((k + 1) / 4) +
      2944 * (k / 8) + 5632 * (k / 16) + 2048 * (k / 32) + 4096 * (k / 64) + 4096 * ((k + 16) / 64) +
      6144 * ((k % 16) % 2) * ((k % 16) / 8) +
      (1792 + 6144 * ((k % 16) % 4)) * ((k % 16) / 12) +
      1024 * ((k % 16) % 4) * (k / 8) +
      (1440 * (k % 16) + (7680 + 5120 * ((k % 16) % 2)) * ((k % 16) / 4) + 5376 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 8192)) :
    (9 ^ (k + 1)) % 65536 = 1 + 8 * ((k + 1 + 8 * ((k + 1) / 2) + 3664 * ((k + 1) / 4) + 80 * ((k + 1 + 1) / 4) +
      2944 * ((k + 1) / 8) + 5632 * ((k + 1) / 16) + 2048 * ((k + 1) / 32) + 4096 * ((k + 1) / 64) + 4096 * ((k + 1 + 16) / 64) +
      6144 * (((k + 1) % 16) % 2) * (((k + 1) % 16) / 8) +
      (1792 + 6144 * (((k + 1) % 16) % 4)) * (((k + 1) % 16) / 12) +
      1024 * (((k + 1) % 16) % 4) * ((k + 1) / 8) +
      (1440 * ((k + 1) % 16) + (7680 + 5120 * (((k + 1) % 16) % 2)) * (((k + 1) % 16) / 4) + 5376 * ((((k + 1) % 16) % 4) / 2) + 512 * ((((k + 1) % 16) % 4) / 3)) * ((k + 1) / 4)) % 8192) := by
  rw [Nat.pow_succ, Nat.mul_mod, ih]
  clear ih
  have hp : ((k % 16 = 0 ∨ k % 16 = 1) ∨ (k % 16 = 2 ∨ k % 16 = 3)) ∨
            ((k % 16 = 4 ∨ k % 16 = 5) ∨ (k % 16 = 6 ∨ k % 16 = 7)) := by omega
  clear hlt8
  rcases hp with ((h0 | h1) | (h2 | h3)) | ((h4 | h5) | (h6 | h7))
  · have hb : (k + 1) % 16 = 1 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h0, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 2 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h1, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 3 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h2, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 4 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h3, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 5 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h4, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 6 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h5, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 7 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h6, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 8 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h7, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega

theorem pow9_mod65536_step_mid (k : Nat) (hmid : 8 ≤ k % 16 ∧ k % 16 < 15)
    (ih : (9 ^ k) % 65536 = 1 + 8 * ((k + 8 * (k / 2) + 3664 * (k / 4) + 80 * ((k + 1) / 4) +
      2944 * (k / 8) + 5632 * (k / 16) + 2048 * (k / 32) + 4096 * (k / 64) + 4096 * ((k + 16) / 64) +
      6144 * ((k % 16) % 2) * ((k % 16) / 8) +
      (1792 + 6144 * ((k % 16) % 4)) * ((k % 16) / 12) +
      1024 * ((k % 16) % 4) * (k / 8) +
      (1440 * (k % 16) + (7680 + 5120 * ((k % 16) % 2)) * ((k % 16) / 4) + 5376 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 8192)) :
    (9 ^ (k + 1)) % 65536 = 1 + 8 * ((k + 1 + 8 * ((k + 1) / 2) + 3664 * ((k + 1) / 4) + 80 * ((k + 1 + 1) / 4) +
      2944 * ((k + 1) / 8) + 5632 * ((k + 1) / 16) + 2048 * ((k + 1) / 32) + 4096 * ((k + 1) / 64) + 4096 * ((k + 1 + 16) / 64) +
      6144 * (((k + 1) % 16) % 2) * (((k + 1) % 16) / 8) +
      (1792 + 6144 * (((k + 1) % 16) % 4)) * (((k + 1) % 16) / 12) +
      1024 * (((k + 1) % 16) % 4) * ((k + 1) / 8) +
      (1440 * ((k + 1) % 16) + (7680 + 5120 * (((k + 1) % 16) % 2)) * (((k + 1) % 16) / 4) + 5376 * ((((k + 1) % 16) % 4) / 2) + 512 * ((((k + 1) % 16) % 4) / 3)) * ((k + 1) / 4)) % 8192) := by
  rw [Nat.pow_succ, Nat.mul_mod, ih]
  clear ih
  have hp : ((k % 16 = 8 ∨ k % 16 = 9) ∨ (k % 16 = 10 ∨ k % 16 = 11)) ∨
            ((k % 16 = 12 ∨ k % 16 = 13) ∨ k % 16 = 14) := by omega
  clear hmid
  rcases hp with ((h8 | h9) | (h10 | h11)) | ((h12 | h13) | h14)
  · have hb : (k + 1) % 16 = 9 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h8, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 10 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h9, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 11 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h10, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 12 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h11, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 13 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h12, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 14 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h13, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega
  · have hb : (k + 1) % 16 = 15 := by omega
    have h16 : (k + 1) / 16 = k / 16 := by omega
    have h32 : (k + 1) / 32 = k / 32 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = (k + 16) / 64 := by omega
    rw [h14, hb, h16, h32, h64, h64b]; clear hb h16 h32 h64 h64b; dsimp
    generalize k / 32 = q32; generalize k / 64 = q64; generalize (k + 16) / 64 = q64b; omega

theorem pow9_mod65536_step_15 (k : Nat) (h15_mod : k % 16 = 15)
    (ih : (9 ^ k) % 65536 = 1 + 8 * ((k + 8 * (k / 2) + 3664 * (k / 4) + 80 * ((k + 1) / 4) +
      2944 * (k / 8) + 5632 * (k / 16) + 2048 * (k / 32) + 4096 * (k / 64) + 4096 * ((k + 16) / 64) +
      6144 * ((k % 16) % 2) * ((k % 16) / 8) +
      (1792 + 6144 * ((k % 16) % 4)) * ((k % 16) / 12) +
      1024 * ((k % 16) % 4) * (k / 8) +
      (1440 * (k % 16) + (7680 + 5120 * ((k % 16) % 2)) * ((k % 16) / 4) + 5376 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 8192)) :
    (9 ^ (k + 1)) % 65536 = 1 + 8 * ((k + 1 + 8 * ((k + 1) / 2) + 3664 * ((k + 1) / 4) + 80 * ((k + 1 + 1) / 4) +
      2944 * ((k + 1) / 8) + 5632 * ((k + 1) / 16) + 2048 * ((k + 1) / 32) + 4096 * ((k + 1) / 64) + 4096 * ((k + 1 + 16) / 64) +
      6144 * (((k + 1) % 16) % 2) * (((k + 1) % 16) / 8) +
      (1792 + 6144 * (((k + 1) % 16) % 4)) * (((k + 1) % 16) / 12) +
      1024 * (((k + 1) % 16) % 4) * ((k + 1) / 8) +
      (1440 * ((k + 1) % 16) + (7680 + 5120 * (((k + 1) % 16) % 2)) * (((k + 1) % 16) / 4) + 5376 * ((((k + 1) % 16) % 4) / 2) + 512 * ((((k + 1) % 16) % 4) / 3)) * ((k + 1) / 4)) % 8192) := by
  rw [Nat.pow_succ, Nat.mul_mod, ih]
  clear ih
  have hp : (k % 64 = 15 ∨ k % 64 = 31) ∨ (k % 64 = 47 ∨ k % 64 = 63) := by omega
  clear h15_mod
  rcases hp with (h15 | h31) | (h47 | h63)
  · have hm : k % 16 = 15 := by omega
    have hb : (k + 1) % 16 = 0 := by omega
    have h16 : (k + 1) / 16 = 4 * (k / 64) + 1 := by omega
    have h16b : k / 16 = 4 * (k / 64) := by omega
    have h32 : (k + 1) / 32 = 2 * (k / 64) := by omega
    have h32b : k / 32 = 2 * (k / 64) := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = k / 64 := by omega
    have h64c : (k + 16) / 64 = k / 64 := by omega
    have hk : k = 64 * (k / 64) + 15 := by omega
    rw [hm, hb, h16, h16b, h32, h32b, h64, h64b, h64c]; clear h15 hm hb h16 h16b h32 h32b h64 h64b h64c; dsimp
    generalize k / 64 = q64 at hk ⊢; omega
  · have hm : k % 16 = 15 := by omega
    have hb : (k + 1) % 16 = 0 := by omega
    have h16 : (k + 1) / 16 = 4 * (k / 64) + 2 := by omega
    have h16b : k / 16 = 4 * (k / 64) + 1 := by omega
    have h32 : (k + 1) / 32 = 2 * (k / 64) + 1 := by omega
    have h32b : k / 32 = 2 * (k / 64) := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = k / 64 := by omega
    have h64c : (k + 16) / 64 = k / 64 := by omega
    have hk : k = 64 * (k / 64) + 31 := by omega
    rw [hm, hb, h16, h16b, h32, h32b, h64, h64b, h64c]; clear h31 hm hb h16 h16b h32 h32b h64 h64b h64c; dsimp
    generalize k / 64 = q64 at hk ⊢; omega
  · have hm : k % 16 = 15 := by omega
    have hb : (k + 1) % 16 = 0 := by omega
    have h16 : (k + 1) / 16 = 4 * (k / 64) + 3 := by omega
    have h16b : k / 16 = 4 * (k / 64) + 2 := by omega
    have h32 : (k + 1) / 32 = 2 * (k / 64) + 1 := by omega
    have h32b : k / 32 = 2 * (k / 64) + 1 := by omega
    have h64 : (k + 1) / 64 = k / 64 := by omega
    have h64b : (k + 1 + 16) / 64 = k / 64 + 1 := by omega
    have h64c : (k + 16) / 64 = k / 64 := by omega
    have hk : k = 64 * (k / 64) + 47 := by omega
    rw [hm, hb, h16, h16b, h32, h32b, h64, h64b, h64c]; clear h47 hm hb h16 h16b h32 h32b h64 h64b h64c; dsimp
    generalize k / 64 = q64 at hk ⊢; omega
  · have hm : k % 16 = 15 := by omega
    have hb : (k + 1) % 16 = 0 := by omega
    have h16 : (k + 1) / 16 = 4 * (k / 64) + 4 := by omega
    have h16b : k / 16 = 4 * (k / 64) + 3 := by omega
    have h32 : (k + 1) / 32 = 2 * (k / 64) + 2 := by omega
    have h32b : k / 32 = 2 * (k / 64) + 1 := by omega
    have h64 : (k + 1) / 64 = k / 64 + 1 := by omega
    have h64b : (k + 1 + 16) / 64 = k / 64 + 1 := by omega
    have h64c : (k + 16) / 64 = k / 64 + 1 := by omega
    have hk : k = 64 * (k / 64) + 63 := by omega
    rw [hm, hb, h16, h16b, h32, h32b, h64, h64b, h64c]; clear h63 hm hb h16 h16b h32 h32b h64 h64b h64c; dsimp
    generalize k / 64 = q64 at hk ⊢; omega

theorem pow9_mod65536 (k : Nat) :
    (9 ^ k) % 65536 = 1 + 8 * ((k + 8 * (k / 2) + 3664 * (k / 4) + 80 * ((k + 1) / 4) +
      2944 * (k / 8) + 5632 * (k / 16) + 2048 * (k / 32) + 4096 * (k / 64) + 4096 * ((k + 16) / 64) +
      6144 * ((k % 16) % 2) * ((k % 16) / 8) +
      (1792 + 6144 * ((k % 16) % 4)) * ((k % 16) / 12) +
      1024 * ((k % 16) % 4) * (k / 8) +
      (1440 * (k % 16) + (7680 + 5120 * ((k % 16) % 2)) * ((k % 16) / 4) + 5376 * (((k % 16) % 4) / 2) + 512 * (((k % 16) % 4) / 3)) * (k / 4)) % 8192) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    have hsplit : k % 16 < 8 ∨ (8 ≤ k % 16 ∧ k % 16 < 15) ∨ k % 16 = 15 := by omega
    rcases hsplit with hlt8 | hmid | h15
    · exact pow9_mod65536_step_lt8 k hlt8 ih
    · exact pow9_mod65536_step_mid k hmid ih
    · exact pow9_mod65536_step_15 k h15 ih


theorem pow9_mod65536_succ (r : Nat) :
    (9 ^ (r + 1)) % 65536 = 1 + 8 * (((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192) := by
  exact pow9_mod65536 (r + 1)

theorem pow9_mod65536_succ2 (r : Nat) :
    (9 ^ (r + 2)) % 65536 = 1 + 8 * (((r + 2) + 8 * ((r + 2) / 2) + 3664 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 2944 * ((r + 2) / 8) + 5632 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + 4096 * ((r + 2) / 64) + 4096 * ((r + 18) / 64) + 6144 * (((r + 2) % 16) % 2) * (((r + 2) % 16) / 8) + (1792 + 6144 * (((r + 2) % 16) % 4)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (1440 * ((r + 2) % 16) + (7680 + 5120 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 4) + 5376 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 8192) := by
  exact pow9_mod65536 (r + 2)

theorem div2_step15_eq_div65536 (N : Nat) (hN : N % 65536 = 0) :
    collatzIter 15 (N / 2) = N / 65536 := by
  have s1  : collatzStep (N / 2)     = N / 4     := by unfold collatzStep; split <;> omega
  have s2  : collatzStep (N / 4)     = N / 8     := by unfold collatzStep; split <;> omega
  have s3  : collatzStep (N / 8)     = N / 16    := by unfold collatzStep; split <;> omega
  have s4  : collatzStep (N / 16)    = N / 32    := by unfold collatzStep; split <;> omega
  have s5  : collatzStep (N / 32)    = N / 64    := by unfold collatzStep; split <;> omega
  have s6  : collatzStep (N / 64)    = N / 128   := by unfold collatzStep; split <;> omega
  have s7  : collatzStep (N / 128)   = N / 256   := by unfold collatzStep; split <;> omega
  have s8  : collatzStep (N / 256)   = N / 512   := by unfold collatzStep; split <;> omega
  have s9  : collatzStep (N / 512)   = N / 1024  := by unfold collatzStep; split <;> omega
  have s10 : collatzStep (N / 1024)  = N / 2048  := by unfold collatzStep; split <;> omega
  have s11 : collatzStep (N / 2048)  = N / 4096  := by unfold collatzStep; split <;> omega
  have s12 : collatzStep (N / 4096)  = N / 8192  := by unfold collatzStep; split <;> omega
  have s13 : collatzStep (N / 8192)  = N / 16384 := by unfold collatzStep; split <;> omega
  have s14 : collatzStep (N / 16384) = N / 32768 := by unfold collatzStep; split <;> omega
  have s15 : collatzStep (N / 32768) = N / 65536 := by unfold collatzStep; split <;> omega
  change collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (collatzStep (N / 2))))))))))))))) = N / 65536
  rw [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15]

theorem mod65536_linear_inverse (A M W u0 c b : Nat)
    (hM : M % 65536 = b)
    (hge : c ≤ A * M * (65536 * W + u0))
    (hres : (A * u0 * b) % 65536 = c % 65536) :
    (A * M * (65536 * W + u0) - c) % 65536 = 0 := by
  have h1 : (A * M * (65536 * W + u0)) % 65536 = (A * u0 * b) % 65536 := by
    have hcomm : A * M * (65536 * W + u0) = A * (65536 * W + u0) * M := by
      rw [Nat.mul_assoc, Nat.mul_comm M (65536 * W + u0), ← Nat.mul_assoc]
    have h2 : (A * (65536 * W + u0)) % 65536 = (A * u0) % 65536 := by
      rw [Nat.mul_add, ← Nat.mul_assoc, Nat.mul_comm A 65536, Nat.mul_assoc]
      omega
    have h3 : (M % 65536) = (b % 65536) := by omega
    rw [hcomm, Nat.mul_mod, h2, h3, ← Nat.mul_mod]
  omega

-- -----------------------------------------------------------------------------
-- 1. Rodzina główna `-7` (`two_zero_valley_mod65536`, faza `3r + 3`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_mod65536_resonance_step21 (r W : Nat) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 1376 * (s / 4) + 352 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 3) - 7) =
      (9 ^ (r + 1) * U - 7) / 65536 := by
  intro s U
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 1376 * (x / 4) + 352 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 15 + (5 * r + 6) := by omega
  have hU : U = 2 * (32768 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 6), hU, two_zero_valley_odd_prefix_step6_exit r (32768 * W + 3 + 4 * t), ← hU]
  have h9_mod65536 : (9 ^ (r + 1)) % 65536 = 1 + 8 * s := pow9_mod65536_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 65536 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 1) * (65536 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (65536 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (9 ^ (r + 1) * U - 7) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 1 (9 ^ (r + 1)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod65536 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (9 ^ (r + 1) * U - 7) hdiv65536

theorem two_zero_valley_mod65536_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 65536 ≤ 65536 * 2 ^ (3 * r + 3)) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 1376 * (s / 4) + 352 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 3) - 7
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (9 ^ (r + 1) * U - 7) / 65536 :=
    two_zero_valley_mod65536_resonance_step21 r W
  have hle : (9 ^ (r + 1) + 65536) * U ≤ (65536 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 1376 * (x / 4) + 352 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 65543 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 7281 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 8090 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 4539 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                cases r''' with
                | zero =>
                  have hs3 : s = 820 := rfl
                  have ht3 : tFn s = 2324 := by rw [hs3]
                  have hpow3 : 9 ^ (0 + 1 + 1 + 1 + 1) * U = 6561 * U := rfl
                  rw [ht3] at hU_def; rw [hpow3, hU_def]; clear hs3 ht3 hpow3 hU_def U s tFn; omega
                | succ r'''' =>
                    generalize tFn s = t at hU_def
                    generalize U = u at hU_def ⊢
                    clear U s tFn
                    have hpow9 : 59049 ≤ 9 ^ (r'''' + 1 + 1 + 1 + 1 + 1) := by
                      rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                      have := pow9_pos r''''
                      omega
                    have hmul := Nat.mul_le_mul_right u hpow9
                    omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 21) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 2. Rodzina główna `-5` (`shifted_valley_mod65536`, faza `3r + 3`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_mod65536_resonance_step21 (r W : Nat) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((2275 * s + 5328 * (s / 2) + 5664 * (s / 4) + 2592 * ((s + 1) / 4) + 2816 * (s / 8) + 5632 * (s / 16) + 5632 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3648 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 4608 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 3) - 5) =
      (9 ^ (r + 1) * U - 5) / 65536 := by
  intro s U
  let tFn := fun x => (2275 * x + 5328 * (x / 2) + 5664 * (x / 4) + 2592 * ((x + 1) / 4) + 2816 * (x / 8) + 5632 * (x / 16) + 5632 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3648 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 4608 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 15 + (5 * r + 6) := by omega
  have hU : U = 2 * (32768 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 6), hU, shifted_valley_odd_prefix_step6_exit r (32768 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod65536 : (9 ^ (r + 1)) % 65536 = 1 + 8 * s := pow9_mod65536_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 65536 * W + (5 + 8 * t) := by omega
  have hge : 5 ≤ 1 * 9 ^ (r + 1) * (65536 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (65536 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 1 5 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (9 ^ (r + 1) * U - 5) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 1 (9 ^ (r + 1)) W (5 + 8 * t) 5 (1 + 8 * s) h9_mod65536 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (9 ^ (r + 1) * U - 5) hdiv65536

theorem shifted_valley_mod65536_contraction (r W : Nat)
    (hr : 9 ^ (r + 1) + 65536 ≤ 65536 * 2 ^ (3 * r + 3)) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((2275 * s + 5328 * (s / 2) + 5664 * (s / 4) + 2592 * ((s + 1) / 4) + 2816 * (s / 8) + 5632 * (s / 16) + 5632 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3648 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 4608 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 3) - 5
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (9 ^ (r + 1) * U - 5) / 65536 :=
    shifted_valley_mod65536_resonance_step21 r W
  have hle : (9 ^ (r + 1) + 65536) * U ≤ (65536 * 2 ^ (3 * r + 3)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 3)) U, Nat.mul_comm (2 ^ (3 * r + 3)) U] at hle
  let tFn := fun x => (2275 * x + 5328 * (x / 2) + 5664 * (x / 4) + 2592 * ((x + 1) / 4) + 2816 * (x / 8) + 5632 * (x / 16) + 5632 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3648 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 4608 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 65541 ≤ 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 6371 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 1) * U = 9 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 3438 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 1) * U = 81 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 6753 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 1) * U = 729 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                cases r''' with
                | zero =>
                  have hs3 : s = 820 := rfl
                  have ht3 : tFn s = 1660 := by rw [hs3]
                  have hpow3 : 9 ^ (0 + 1 + 1 + 1 + 1) * U = 6561 * U := rfl
                  rw [ht3] at hU_def; rw [hpow3, hU_def]; clear hs3 ht3 hpow3 hU_def U s tFn; omega
                | succ r'''' =>
                    generalize tFn s = t at hU_def
                    generalize U = u at hU_def ⊢
                    clear U s tFn
                    have hpow9 : 59049 ≤ 9 ^ (r'''' + 1 + 1 + 1 + 1 + 1) := by
                      rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                      have := pow9_pos r''''
                      omega
                    have hmul := Nat.mul_le_mul_right u hpow9
                    omega
  have hn0 : n0 = U * 2 ^ (3 * r + 3) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 21) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 3. Dwublokowa kaskada RLE `-13` (`rle_10011_mod65536`, `3r + 7`, `5r + 27` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10011_mod65536_resonance_step27 (r W : Nat) :
    let s := ((r + 2) + 8 * ((r + 2) / 2) + 3664 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 2944 * ((r + 2) / 8) + 5632 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + 4096 * ((r + 2) / 64) + 4096 * ((r + 18) / 64) + 6144 * (((r + 2) % 16) % 2) * (((r + 2) % 16) / 8) + (1792 + 6144 * (((r + 2) % 16) % 4)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (1440 * ((r + 2) % 16) + (7680 + 5120 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 4) + 5376 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 1376 * (s / 4) + 352 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 27) (U * 2 ^ (3 * r + 7) - 13) =
      (9 ^ (r + 2) * U - 7) / 65536 := by
  intro s U
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 1376 * (x / 4) + 352 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 27 = 15 + (5 * r + 12) := by omega
  have hU : U = 2 * (32768 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 12), hU, rle_10011_odd_prefix_step12_exit r (32768 * W + 3 + 4 * t), ← hU]
  have h9_mod65536 : (9 ^ (r + 2)) % 65536 = 1 + 8 * s := pow9_mod65536_succ2 r
  have h9_pos : 1 ≤ 9 ^ (r + 2) := pow9_pos (r + 2)
  have hU_eq : U = 65536 * W + (7 + 8 * t) := by omega
  have hge : 7 ≤ 1 * 9 ^ (r + 2) * (65536 * W + (7 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (65536 * W + (7 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 1 7 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (9 ^ (r + 2) * U - 7) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 1 (9 ^ (r + 2)) W (7 + 8 * t) 7 (1 + 8 * s) h9_mod65536 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (9 ^ (r + 2) * U - 7) hdiv65536

theorem rle_10011_mod65536_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 131072 ≤ 65536 * 2 ^ (3 * r + 7)) :
    let s := ((r + 2) + 8 * ((r + 2) / 2) + 3664 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 2944 * ((r + 2) / 8) + 5632 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + 4096 * ((r + 2) / 64) + 4096 * ((r + 18) / 64) + 6144 * (((r + 2) % 16) % 2) * (((r + 2) % 16) / 8) + (1792 + 6144 * (((r + 2) % 16) % 4)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (1440 * ((r + 2) % 16) + (7680 + 5120 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 4) + 5376 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((3185 * s + 2544 * (s / 2) + 1376 * (s / 4) + 352 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (192 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 7) - 13
    collatzIter (5 * r + 27) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 27) n0 = (9 ^ (r + 2) * U - 7) / 65536 :=
    rle_10011_mod65536_resonance_step27 r W
  have hle : (9 ^ (r + 2) + 131072) * U ≤ (65536 * 2 ^ (3 * r + 7)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 7)) U, Nat.mul_comm (2 ^ (3 * r + 7)) U] at hle
  let tFn := fun x => (3185 * x + 2544 * (x / 2) + 1376 * (x / 4) + 352 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (192 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 65543 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 8090 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 4539 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 820 := rfl
              have ht2 : tFn s = 2324 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 2) * U = 6561 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 59049 ≤ 9 ^ (r''' + 1 + 1 + 1 + 2) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 7) - 13 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 27) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 27) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 27) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 4. Dwublokowa kaskada RLE `-9` (`rle_10111_mod65536`, `3r + 8`, `5r + 29` kroków)
-- -----------------------------------------------------------------------------
theorem rle_10111_mod65536_resonance_step29 (r W : Nat) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((7888 + 1635 * s + 7376 * (s / 2) + 1568 * (s / 4) + 6688 * ((s + 1) / 4) + 2816 * (s / 8) + 5632 * (s / 16) + 5632 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3648 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 4608 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 29) (U * 2 ^ (3 * r + 8) - 9) =
      (27 * 9 ^ (r + 1) * U - 7) / 65536 := by
  intro s U
  let tFn := fun x => (7888 + 1635 * x + 7376 * (x / 2) + 1568 * (x / 4) + 6688 * ((x + 1) / 4) + 2816 * (x / 8) + 5632 * (x / 16) + 5632 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3648 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 4608 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 29 = 15 + (5 * r + 14) := by omega
  have hU : U = 2 * (32768 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 14), hU, rle_10111_odd_prefix_step14_exit r (32768 * W + 2 + 4 * t), ← hU]
  have h9_mod65536 : (9 ^ (r + 1)) % 65536 = 1 + 8 * s := pow9_mod65536_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 65536 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 27 * 9 ^ (r + 1) * (65536 * W + (5 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (65536 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 27 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (27 * 9 ^ (r + 1) * U - 7) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 27 (9 ^ (r + 1)) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod65536 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (27 * 9 ^ (r + 1) * U - 7) hdiv65536

theorem rle_10111_mod65536_contraction (r W : Nat)
    (hr : 27 * 9 ^ (r + 1) + 131072 ≤ 65536 * 2 ^ (3 * r + 8)) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((7888 + 1635 * s + 7376 * (s / 2) + 1568 * (s / 4) + 6688 * ((s + 1) / 4) + 2816 * (s / 8) + 5632 * (s / 16) + 5632 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3648 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 4608 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 8) - 9
    collatzIter (5 * r + 29) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 29) n0 = (27 * 9 ^ (r + 1) * U - 7) / 65536 :=
    rle_10111_mod65536_resonance_step29 r W
  have hle : (27 * 9 ^ (r + 1) + 131072) * U ≤ (65536 * 2 ^ (3 * r + 8)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 8)) U, Nat.mul_comm (2 ^ (3 * r + 8)) U] at hle
  let tFn := fun x => (7888 + 1635 * x + 7376 * (x / 2) + 1568 * (x / 4) + 6688 * ((x + 1) / 4) + 2816 * (x / 8) + 5632 * (x / 16) + 5632 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3648 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 4608 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 65543 ≤ 27 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 5427 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0 + 1) * U = 243 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 6974 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (0 + 1 + 1) * U = 2187 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            generalize tFn s = t at hU_def
            generalize U = u at hU_def ⊢
            clear U s tFn
            have hpow9 : 729 ≤ 9 ^ (r'' + 1 + 1 + 1) := by
              rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
              have := pow9_pos r''
              omega
            have hval : 19683 ≤ 27 * 9 ^ (r'' + 1 + 1 + 1) := by omega
            have hmul := Nat.mul_le_mul_right u hval
            omega
  have hn0 : n0 = U * 2 ^ (3 * r + 8) - 9 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 29) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 29) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 29) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 5. Faza `d = 1` rodziny `-5` (`shifted_valley_d1_mod65536`, `3r + 1`, `5r + 18` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d1_mod65536_resonance_step18 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 3664 * (r / 4) + 80 * ((r + 1) / 4) + 2944 * (r / 8) + 5632 * (r / 16) + 2048 * (r / 32) + 4096 * (r / 64) + 4096 * ((r + 16) / 64) + 6144 * ((r % 16) % 2) * ((r % 16) / 8) + (1792 + 6144 * ((r % 16) % 4)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (1440 * (r % 16) + (7680 + 5120 * ((r % 16) % 2)) * ((r % 16) / 4) + 5376 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((5461 + 6523 * s + 848 * (s / 2) + 5920 * (s / 4) + 2848 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (64 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 18) (U * 2 ^ (3 * r + 1) - 5) =
      (3 * 9 ^ r * U - 7) / 65536 := by
  intro s U
  let tFn := fun x => (5461 + 6523 * x + 848 * (x / 2) + 5920 * (x / 4) + 2848 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (64 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 18 = 15 + (5 * r + 3) := by omega
  have hU : U = 2 * (32768 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 3), hU, shifted_valley_d1_odd_prefix_step3_exit r (32768 * W + 2 + 4 * t) (by omega), ← hU]
  have h9_mod65536 : (9 ^ r) % 65536 = 1 + 8 * s := pow9_mod65536 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 65536 * W + (5 + 8 * t) := by omega
  have hge : 7 ≤ 3 * 9 ^ r * (65536 * W + (5 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (65536 * W + (5 + 8 * t)) hA
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 3 5 7 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (3 * 9 ^ r * U - 7) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 3 (9 ^ r) W (5 + 8 * t) 7 (1 + 8 * s) h9_mod65536 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (3 * 9 ^ r * U - 7) hdiv65536

theorem shifted_valley_d1_mod65536_contraction (r W : Nat)
    (hr : 3 * 9 ^ r + 65536 ≤ 65536 * 2 ^ (3 * r + 1)) :
    let s := (r + 8 * (r / 2) + 3664 * (r / 4) + 80 * ((r + 1) / 4) + 2944 * (r / 8) + 5632 * (r / 16) + 2048 * (r / 32) + 4096 * (r / 64) + 4096 * ((r + 16) / 64) + 6144 * ((r % 16) % 2) * ((r % 16) / 8) + (1792 + 6144 * ((r % 16) % 4)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (1440 * (r % 16) + (7680 + 5120 * ((r % 16) % 2)) * ((r % 16) / 4) + 5376 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((5461 + 6523 * s + 848 * (s / 2) + 5920 * (s / 4) + 2848 * ((s + 1) / 4) + 768 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (64 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 1) - 5
    collatzIter (5 * r + 18) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 18) n0 = (3 * 9 ^ r * U - 7) / 65536 :=
    shifted_valley_d1_mod65536_resonance_step18 r W
  have hle : (3 * 9 ^ r + 65536) * U ≤ (65536 * 2 ^ (3 * r + 1)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 1)) U, Nat.mul_comm (2 ^ (3 * r + 1)) U] at hle
  let tFn := fun x => (5461 + 6523 * x + 848 * (x / 2) + 5920 * (x / 4) + 2848 * ((x + 1) / 4) + 768 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (64 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 65543 ≤ 3 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 5461 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0) * U = 3 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 7888 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (1) * U = 27 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 5427 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (2) * U = 243 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                cases r''' with
                | zero =>
                  have hs3 : s = 91 := rfl
                  have ht3 : tFn s = 6974 := by rw [hs3]
                  have hpow3 : 3 * 9 ^ (3) * U = 2187 * U := rfl
                  rw [ht3] at hU_def; rw [hpow3, hU_def]; clear hs3 ht3 hpow3 hU_def U s tFn; omega
                | succ r'''' =>
                    generalize tFn s = t at hU_def
                    generalize U = u at hU_def ⊢
                    clear U s tFn
                    have hpow9 : 6561 ≤ 9 ^ (r'''' + 1 + 1 + 1 + 1) := by
                      rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                      have := pow9_pos r''''
                      omega
                    have hval : 19683 ≤ 3 * 9 ^ (r'''' + 1 + 1 + 1 + 1) := by omega
                    have hmul := Nat.mul_le_mul_right u hval
                    omega
  have hn0 : n0 = U * 2 ^ (3 * r + 1) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 18) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 18) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 18) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 6. Faza `d = 5` rodziny `-7` (`two_zero_valley_d5_mod65536`, `3r + 5`, `5r + 24` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d5_mod65536_resonance_step24 (r W : Nat) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((2730 + 3489 * s + 1776 * (s / 2) + 1888 * (s / 4) + 864 * ((s + 1) / 4) + 6400 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (1216 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 24) (U * 2 ^ (3 * r + 5) - 7) =
      (3 * 9 ^ (r + 1) * U - 5) / 65536 := by
  intro s U
  let tFn := fun x => (2730 + 3489 * x + 1776 * (x / 2) + 1888 * (x / 4) + 864 * ((x + 1) / 4) + 6400 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (1216 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 24 = 15 + (5 * r + 9) := by omega
  have hU : U = 2 * (32768 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 9), hU, two_zero_valley_d5_odd_prefix_step9_exit r (32768 * W + 3 + 4 * t), ← hU]
  have h9_mod65536 : (9 ^ (r + 1)) % 65536 = 1 + 8 * s := pow9_mod65536_succ r
  have h9_pos : 1 ≤ 9 ^ (r + 1) := pow9_pos (r + 1)
  have hU_eq : U = 65536 * W + (7 + 8 * t) := by omega
  have hge : 5 ≤ 3 * 9 ^ (r + 1) * (65536 * W + (7 + 8 * t)) := by
    have hA : 3 ≤ 3 * 9 ^ (r + 1) := by omega
    have := Nat.mul_le_mul_right (65536 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 3 7 5 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (3 * 9 ^ (r + 1) * U - 5) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 3 (9 ^ (r + 1)) W (7 + 8 * t) 5 (1 + 8 * s) h9_mod65536 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (3 * 9 ^ (r + 1) * U - 5) hdiv65536

theorem two_zero_valley_d5_mod65536_contraction (r W : Nat)
    (hr : 3 * 9 ^ (r + 1) + 65536 ≤ 65536 * 2 ^ (3 * r + 5)) :
    let s := ((r + 1) + 8 * ((r + 1) / 2) + 3664 * ((r + 1) / 4) + 80 * ((r + 2) / 4) + 2944 * ((r + 1) / 8) + 5632 * ((r + 1) / 16) + 2048 * ((r + 1) / 32) + 4096 * ((r + 1) / 64) + 4096 * ((r + 17) / 64) + 6144 * (((r + 1) % 16) % 2) * (((r + 1) % 16) / 8) + (1792 + 6144 * (((r + 1) % 16) % 4)) * (((r + 1) % 16) / 12) + 1024 * (((r + 1) % 16) % 4) * ((r + 1) / 8) + (1440 * ((r + 1) % 16) + (7680 + 5120 * (((r + 1) % 16) % 2)) * (((r + 1) % 16) / 4) + 5376 * ((((r + 1) % 16) % 4) / 2) + 512 * ((((r + 1) % 16) % 4) / 3)) * ((r + 1) / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((2730 + 3489 * s + 1776 * (s / 2) + 1888 * (s / 4) + 864 * ((s + 1) / 4) + 6400 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (1216 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 5) - 7
    collatzIter (5 * r + 24) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 24) n0 = (3 * 9 ^ (r + 1) * U - 5) / 65536 :=
    two_zero_valley_d5_mod65536_resonance_step24 r W
  have hle : (3 * 9 ^ (r + 1) + 65536) * U ≤ (65536 * 2 ^ (3 * r + 5)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 5)) U, Nat.mul_comm (2 ^ (3 * r + 5)) U] at hle
  let tFn := fun x => (2730 + 3489 * x + 1776 * (x / 2) + 1888 * (x / 4) + 864 * ((x + 1) / 4) + 6400 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (1216 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 65541 ≤ 3 * 9 ^ (r + 1) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 1 := rfl
      have ht0 : tFn s = 2123 := by rw [hs0]
      have hpow0 : 3 * 9 ^ (0 + 1) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 10 := rfl
          have ht1 : tFn s = 3876 := by rw [hs1]
          have hpow1 : 3 * 9 ^ (0 + 1 + 1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 91 := rfl
              have ht2 : tFn s = 4981 := by rw [hs2]
              have hpow2 : 3 * 9 ^ (0 + 1 + 1 + 1) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 6561 ≤ 9 ^ (r''' + 1 + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 3 * 9 ^ (r''' + 1 + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 5) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 24) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 24) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 24) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 7. Faza `d = 4` rodziny `-7` (`two_zero_valley_d4_mod65536`, `3r + 4`, `5r + 24` kroków)
-- -----------------------------------------------------------------------------
theorem two_zero_valley_d4_mod65536_resonance_step24 (r W : Nat) :
    let s := ((r + 2) + 8 * ((r + 2) / 2) + 3664 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 2944 * ((r + 2) / 8) + 5632 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + 4096 * ((r + 2) / 64) + 4096 * ((r + 18) / 64) + 6144 * (((r + 2) % 16) % 2) * (((r + 2) % 16) / 8) + (1792 + 6144 * (((r + 2) % 16) % 4)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (1440 * ((r + 2) % 16) + (7680 + 5120 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 4) + 5376 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((3 + 5003 * s + 4688 * (s / 2) + 3360 * (s / 4) + 288 * ((s + 1) / 4) + 4864 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3136 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 24) (U * 2 ^ (3 * r + 4) - 7) =
      (9 ^ (r + 2) * U - 29) / 65536 := by
  intro s U
  let tFn := fun x => (3 + 5003 * x + 4688 * (x / 2) + 3360 * (x / 4) + 288 * ((x + 1) / 4) + 4864 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3136 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 24 = 15 + (5 * r + 9) := by omega
  have hU : U = 2 * (32768 * W + 2 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 9), hU, two_zero_valley_d4_odd_prefix_step9_exit r (32768 * W + 2 + 4 * t), ← hU]
  have h9_mod65536 : (9 ^ (r + 2)) % 65536 = 1 + 8 * s := pow9_mod65536_succ2 r
  have h9_pos : 81 ≤ 9 ^ (r + 2) := by
    rw [Nat.pow_succ, Nat.pow_succ]
    have := pow9_pos r
    omega
  have hU_eq : U = 65536 * W + (5 + 8 * t) := by omega
  have hge : 29 ≤ 1 * 9 ^ (r + 2) * (65536 * W + (5 + 8 * t)) := by
    rw [Nat.one_mul]
    have := Nat.mul_le_mul_right (65536 * W + (5 + 8 * t)) h9_pos
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 1 5 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (9 ^ (r + 2) * U - 29) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 1 (9 ^ (r + 2)) W (5 + 8 * t) 29 (1 + 8 * s) h9_mod65536 hge hres
    rw [Nat.one_mul, ← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (9 ^ (r + 2) * U - 29) hdiv65536

theorem two_zero_valley_d4_mod65536_contraction (r W : Nat)
    (hr : 9 ^ (r + 2) + 131072 ≤ 65536 * 2 ^ (3 * r + 4)) :
    let s := ((r + 2) + 8 * ((r + 2) / 2) + 3664 * ((r + 2) / 4) + 80 * ((r + 3) / 4) + 2944 * ((r + 2) / 8) + 5632 * ((r + 2) / 16) + 2048 * ((r + 2) / 32) + 4096 * ((r + 2) / 64) + 4096 * ((r + 18) / 64) + 6144 * (((r + 2) % 16) % 2) * (((r + 2) % 16) / 8) + (1792 + 6144 * (((r + 2) % 16) % 4)) * (((r + 2) % 16) / 12) + 1024 * (((r + 2) % 16) % 4) * ((r + 2) / 8) + (1440 * ((r + 2) % 16) + (7680 + 5120 * (((r + 2) % 16) % 2)) * (((r + 2) % 16) / 4) + 5376 * ((((r + 2) % 16) % 4) / 2) + 512 * ((((r + 2) % 16) % 4) / 3)) * ((r + 2) / 4)) % 8192
    let U := 65536 * W + (5 + 8 * ((3 + 5003 * s + 4688 * (s / 2) + 3360 * (s / 4) + 288 * ((s + 1) / 4) + 4864 * (s / 8) + 1536 * (s / 16) + 1536 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 6144 * (s % 2) * (s / 8) + (3136 * (s % 16) + 3072 * ((s % 16) / 4) + 6144 * (s % 2) + 512 * ((s % 4) / 2) + 1024 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 4) - 7
    collatzIter (5 * r + 24) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 24) n0 = (9 ^ (r + 2) * U - 29) / 65536 :=
    two_zero_valley_d4_mod65536_resonance_step24 r W
  have hle : (9 ^ (r + 2) + 131072) * U ≤ (65536 * 2 ^ (3 * r + 4)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 4)) U, Nat.mul_comm (2 ^ (3 * r + 4)) U] at hle
  let tFn := fun x => (3 + 5003 * x + 4688 * (x / 2) + 3360 * (x / 4) + 288 * ((x + 1) / 4) + 4864 * (x / 8) + 1536 * (x / 16) + 1536 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 6144 * (x % 2) * (x / 8) + (3136 * (x % 16) + 3072 * ((x % 16) / 4) + 6144 * (x % 2) + 512 * ((x % 4) / 2) + 1024 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (5 + 8 * tFn s) := rfl
  have hX_ge : 65565 ≤ 9 ^ (r + 2) * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 10 := rfl
      have ht0 : tFn s = 1921 := by rw [hs0]
      have hpow0 : 9 ^ (0 + 2) * U = 81 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 91 := rfl
          have ht1 : tFn s = 4764 := by rw [hs1]
          have hpow1 : 9 ^ (0 + 1 + 2) * U = 729 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 820 := rfl
              have ht2 : tFn s = 1439 := by rw [hs2]
              have hpow2 : 9 ^ (0 + 1 + 1 + 2) * U = 6561 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 59049 ≤ 9 ^ (r''' + 1 + 1 + 1 + 2) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hmul := Nat.mul_le_mul_right u hpow9
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 4) - 7 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 24) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 24) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 24) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- 8. Faza `d = 2` rodziny `-5` (`shifted_valley_d2_mod65536`, `3r + 2`, `5r + 21` kroków)
-- -----------------------------------------------------------------------------
theorem shifted_valley_d2_mod65536_resonance_step21 (r W : Nat) :
    let s := (r + 8 * (r / 2) + 3664 * (r / 4) + 80 * ((r + 1) / 4) + 2944 * (r / 8) + 5632 * (r / 16) + 2048 * (r / 32) + 4096 * (r / 64) + 4096 * ((r + 16) / 64) + 6144 * ((r % 16) % 2) * ((r % 16) / 8) + (1792 + 6144 * ((r % 16) % 4)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (1440 * (r % 16) + (7680 + 5120 * ((r % 16) % 2)) * ((r % 16) / 4) + 5376 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((5764 + 4433 * s + 7152 * (s / 2) + 6496 * (s / 4) + 5472 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (2240 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    collatzIter (5 * r + 21) (U * 2 ^ (3 * r + 2) - 5) =
      (27 * 9 ^ r * U - 29) / 65536 := by
  intro s U
  let tFn := fun x => (5764 + 4433 * x + 7152 * (x / 2) + 6496 * (x / 4) + 5472 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (2240 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  generalize hT : tFn s = t at hU_def
  have hstep : 5 * r + 21 = 15 + (5 * r + 6) := by omega
  have hU : U = 2 * (32768 * W + 3 + 4 * t) + 1 := by omega
  rw [hstep, collatzIter_add 15 (5 * r + 6), hU, shifted_valley_d2_odd_prefix_step6_exit r (32768 * W + 3 + 4 * t) (by omega), ← hU]
  have h9_mod65536 : (9 ^ r) % 65536 = 1 + 8 * s := pow9_mod65536 r
  have h9_pos : 1 ≤ 9 ^ r := pow9_pos r
  have hU_eq : U = 65536 * W + (7 + 8 * t) := by omega
  have hge : 29 ≤ 27 * 9 ^ r * (65536 * W + (7 + 8 * t)) := by
    have hA : 27 ≤ 27 * 9 ^ r := by omega
    have := Nat.mul_le_mul_right (65536 * W + (7 + 8 * t)) hA
    omega
  have hs_lt : s < 8192 := Nat.mod_lt _ (by decide)
  have hres := checkResonanceGrid128_sound 65536 27 7 29 tFn 64 (by decide) s hs_lt
  rw [hT] at hres
  have hdiv65536 : (27 * 9 ^ r * U - 29) % 65536 = 0 := by
    have h1 := mod65536_linear_inverse 27 (9 ^ r) W (7 + 8 * t) 29 (1 + 8 * s) h9_mod65536 hge hres
    rw [← hU_eq] at h1
    exact h1
  exact div2_step15_eq_div65536 (27 * 9 ^ r * U - 29) hdiv65536

theorem shifted_valley_d2_mod65536_contraction (r W : Nat)
    (hr : 27 * 9 ^ r + 65536 ≤ 65536 * 2 ^ (3 * r + 2)) :
    let s := (r + 8 * (r / 2) + 3664 * (r / 4) + 80 * ((r + 1) / 4) + 2944 * (r / 8) + 5632 * (r / 16) + 2048 * (r / 32) + 4096 * (r / 64) + 4096 * ((r + 16) / 64) + 6144 * ((r % 16) % 2) * ((r % 16) / 8) + (1792 + 6144 * ((r % 16) % 4)) * ((r % 16) / 12) + 1024 * ((r % 16) % 4) * (r / 8) + (1440 * (r % 16) + (7680 + 5120 * ((r % 16) % 2)) * ((r % 16) / 4) + 5376 * (((r % 16) % 4) / 2) + 512 * (((r % 16) % 4) / 3)) * (r / 4)) % 8192
    let U := 65536 * W + (7 + 8 * ((5764 + 4433 * s + 7152 * (s / 2) + 6496 * (s / 4) + 5472 * ((s + 1) / 4) + 2304 * (s / 8) + 4608 * (s / 16) + 4608 * ((s + 4) / 16) + 4096 * ((s + 10) / 16) + 4096 * ((s + 13) / 16) + 4096 * ((s + 15) / 16) + 4096 * (s / 32) + 2048 * (s % 2) * (s / 8) + (2240 * (s % 16) + 1024 * ((s % 16) / 4) + 2048 * (s % 2) + 1536 * ((s % 4) / 2) + 3072 * ((s % 4) / 3)) * (s / 4)) % 8192))
    let n0 := U * 2 ^ (3 * r + 2) - 5
    collatzIter (5 * r + 21) n0 < n0 ∧ HasHorizonDrop n0 := by
  intro s U n0
  have hcasc : collatzIter (5 * r + 21) n0 = (27 * 9 ^ r * U - 29) / 65536 :=
    shifted_valley_d2_mod65536_resonance_step21 r W
  have hle : (27 * 9 ^ r + 65536) * U ≤ (65536 * 2 ^ (3 * r + 2)) * U :=
    Nat.mul_le_mul_right U hr
  rw [Nat.add_mul, Nat.mul_assoc 65536 (2 ^ (3 * r + 2)) U, Nat.mul_comm (2 ^ (3 * r + 2)) U] at hle
  let tFn := fun x => (5764 + 4433 * x + 7152 * (x / 2) + 6496 * (x / 4) + 5472 * ((x + 1) / 4) + 2304 * (x / 8) + 4608 * (x / 16) + 4608 * ((x + 4) / 16) + 4096 * ((x + 10) / 16) + 4096 * ((x + 13) / 16) + 4096 * ((x + 15) / 16) + 4096 * (x / 32) + 2048 * (x % 2) * (x / 8) + (2240 * (x % 16) + 1024 * ((x % 16) / 4) + 2048 * (x % 2) + 1536 * ((x % 4) / 2) + 3072 * ((x % 4) / 3)) * (x / 4)) % 8192
  have hU_def : U = 65536 * W + (7 + 8 * tFn s) := rfl
  have hX_ge : 65565 ≤ 27 * 9 ^ r * U := by
    clear hcasc hle hr n0
    cases r with
    | zero =>
      have hs0 : s = 0 := rfl
      have ht0 : tFn s = 5764 := by rw [hs0]
      have hpow0 : 27 * 9 ^ (0) * U = 27 * U := rfl
      rw [ht0] at hU_def; rw [hpow0, hU_def]; clear hs0 ht0 hpow0 hU_def U s tFn; omega
    | succ r' =>
        cases r' with
        | zero =>
          have hs1 : s = 1 := rfl
          have ht1 : tFn s = 6101 := by rw [hs1]
          have hpow1 : 27 * 9 ^ (1) * U = 243 * U := rfl
          rw [ht1] at hU_def; rw [hpow1, hU_def]; clear hs1 ht1 hpow1 hU_def U s tFn; omega
        | succ r'' =>
            cases r'' with
            | zero =>
              have hs2 : s = 10 := rfl
              have ht2 : tFn s = 4318 := by rw [hs2]
              have hpow2 : 27 * 9 ^ (2) * U = 2187 * U := rfl
              rw [ht2] at hU_def; rw [hpow2, hU_def]; clear hs2 ht2 hpow2 hU_def U s tFn; omega
            | succ r''' =>
                generalize tFn s = t at hU_def
                generalize U = u at hU_def ⊢
                clear U s tFn
                have hpow9 : 729 ≤ 9 ^ (r''' + 1 + 1 + 1) := by
                  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
                  have := pow9_pos r'''
                  omega
                have hval : 19683 ≤ 27 * 9 ^ (r''' + 1 + 1 + 1) := by omega
                have hmul := Nat.mul_le_mul_right u hval
                omega
  have hn0 : n0 = U * 2 ^ (3 * r + 2) - 5 := rfl
  generalize tFn s = t at hU_def
  generalize U = u at hcasc hle hU_def hX_ge hn0
  generalize n0 = m0 at hcasc hn0 ⊢
  clear n0 U s tFn
  have hlt : collatzIter (5 * r + 21) m0 < m0 := by rw [hcasc, hn0]; omega
  have hge1 : collatzIter (5 * r + 21) m0 ≥ 1 := by rw [hcasc]; omega
  exact ⟨hlt, hasHorizonDrop_of_ge_one_and_lt (5 * r + 21) m0 (by omega) hge1 hlt⟩

-- -----------------------------------------------------------------------------
-- Konkretne twierdzenia horyzontowe _mod65536_drop_r...
-- -----------------------------------------------------------------------------
set_option exponentiation.threshold 512

theorem two_zero_valley_mod65536_drop_r88 (W : Nat) : HasHorizonDrop ((65536 * W + 59215) * 2 ^ 267 - 7) := (two_zero_valley_mod65536_contraction 88 W (by decide)).2
theorem two_zero_valley_mod65536_drop_r89 (W : Nat) : HasHorizonDrop ((65536 * W + 21143) * 2 ^ 270 - 7) := (two_zero_valley_mod65536_contraction 89 W (by decide)).2
theorem two_zero_valley_mod65536_drop_r90 (W : Nat) : HasHorizonDrop ((65536 * W + 9631) * 2 ^ 273 - 7) := (two_zero_valley_mod65536_contraction 90 W (by decide)).2
theorem two_zero_valley_mod65536_drop_r91 (W : Nat) : HasHorizonDrop ((65536 * W + 37479) * 2 ^ 276 - 7) := (two_zero_valley_mod65536_contraction 91 W (by decide)).2
theorem two_zero_valley_mod65536_drop_r92 (W : Nat) : HasHorizonDrop ((65536 * W + 47855) * 2 ^ 279 - 7) := (two_zero_valley_mod65536_contraction 92 W (by decide)).2
theorem two_zero_valley_mod65536_drop_r93 (W : Nat) : HasHorizonDrop ((65536 * W + 12599) * 2 ^ 282 - 7) := (two_zero_valley_mod65536_contraction 93 W (by decide)).2

theorem shifted_valley_mod65536_drop_r88 (W : Nat) : HasHorizonDrop ((65536 * W + 61021) * 2 ^ 267 - 5) := (shifted_valley_mod65536_contraction 88 W (by decide)).2
theorem shifted_valley_mod65536_drop_r89 (W : Nat) : HasHorizonDrop ((65536 * W + 43189) * 2 ^ 270 - 5) := (shifted_valley_mod65536_contraction 89 W (by decide)).2
theorem shifted_valley_mod65536_drop_r90 (W : Nat) : HasHorizonDrop ((65536 * W + 63053) * 2 ^ 273 - 5) := (shifted_valley_mod65536_contraction 90 W (by decide)).2
theorem shifted_valley_mod65536_drop_r91 (W : Nat) : HasHorizonDrop ((65536 * W + 36133) * 2 ^ 276 - 5) := (shifted_valley_mod65536_contraction 91 W (by decide)).2
theorem shifted_valley_mod65536_drop_r92 (W : Nat) : HasHorizonDrop ((65536 * W + 62269) * 2 ^ 279 - 5) := (shifted_valley_mod65536_contraction 92 W (by decide)).2
theorem shifted_valley_mod65536_drop_r93 (W : Nat) : HasHorizonDrop ((65536 * W + 65173) * 2 ^ 282 - 5) := (shifted_valley_mod65536_contraction 93 W (by decide)).2

theorem rle_10011_mod65536_drop_r93 (W : Nat) : HasHorizonDrop ((65536 * W + 30527) * 2 ^ 286 - 13) := (rle_10011_mod65536_contraction 93 W (by decide)).2
theorem rle_10011_mod65536_drop_r94 (W : Nat) : HasHorizonDrop ((65536 * W + 32519) * 2 ^ 289 - 13) := (rle_10011_mod65536_contraction 94 W (by decide)).2
theorem rle_10011_mod65536_drop_r95 (W : Nat) : HasHorizonDrop ((65536 * W + 10895) * 2 ^ 292 - 13) := (rle_10011_mod65536_contraction 95 W (by decide)).2
theorem rle_10011_mod65536_drop_r96 (W : Nat) : HasHorizonDrop ((65536 * W + 52183) * 2 ^ 295 - 13) := (rle_10011_mod65536_contraction 96 W (by decide)).2
theorem rle_10011_mod65536_drop_r97 (W : Nat) : HasHorizonDrop ((65536 * W + 42207) * 2 ^ 298 - 13) := (rle_10011_mod65536_contraction 97 W (by decide)).2
theorem rle_10011_mod65536_drop_r98 (W : Nat) : HasHorizonDrop ((65536 * W + 26535) * 2 ^ 301 - 13) := (rle_10011_mod65536_contraction 98 W (by decide)).2

theorem rle_10111_mod65536_drop_r89 (W : Nat) : HasHorizonDrop ((65536 * W + 46901) * 2 ^ 275 - 9) := (rle_10111_mod65536_contraction 89 W (by decide)).2
theorem rle_10111_mod65536_drop_r90 (W : Nat) : HasHorizonDrop ((65536 * W + 12493) * 2 ^ 278 - 9) := (rle_10111_mod65536_contraction 90 W (by decide)).2
theorem rle_10111_mod65536_drop_r91 (W : Nat) : HasHorizonDrop ((65536 * W + 37797) * 2 ^ 281 - 9) := (rle_10111_mod65536_contraction 91 W (by decide)).2
theorem rle_10111_mod65536_drop_r92 (W : Nat) : HasHorizonDrop ((65536 * W + 26045) * 2 ^ 284 - 9) := (rle_10111_mod65536_contraction 92 W (by decide)).2
theorem rle_10111_mod65536_drop_r93 (W : Nat) : HasHorizonDrop ((65536 * W + 32021) * 2 ^ 287 - 9) := (rle_10111_mod65536_contraction 93 W (by decide)).2
theorem rle_10111_mod65536_drop_r94 (W : Nat) : HasHorizonDrop ((65536 * W + 32685) * 2 ^ 290 - 9) := (rle_10111_mod65536_contraction 94 W (by decide)).2

theorem shifted_valley_d1_mod65536_drop_r85 (W : Nat) : HasHorizonDrop ((65536 * W + 4069) * 2 ^ 256 - 5) := (shifted_valley_d1_mod65536_contraction 85 W (by decide)).2
theorem shifted_valley_d1_mod65536_drop_r86 (W : Nat) : HasHorizonDrop ((65536 * W + 36861) * 2 ^ 259 - 5) := (shifted_valley_d1_mod65536_contraction 86 W (by decide)).2
theorem shifted_valley_d1_mod65536_drop_r87 (W : Nat) : HasHorizonDrop ((65536 * W + 25941) * 2 ^ 262 - 5) := (shifted_valley_d1_mod65536_contraction 87 W (by decide)).2
theorem shifted_valley_d1_mod65536_drop_r88 (W : Nat) : HasHorizonDrop ((65536 * W + 46573) * 2 ^ 265 - 5) := (shifted_valley_d1_mod65536_contraction 88 W (by decide)).2
theorem shifted_valley_d1_mod65536_drop_r89 (W : Nat) : HasHorizonDrop ((65536 * W + 63429) * 2 ^ 268 - 5) := (shifted_valley_d1_mod65536_contraction 89 W (by decide)).2
theorem shifted_valley_d1_mod65536_drop_r90 (W : Nat) : HasHorizonDrop ((65536 * W + 28893) * 2 ^ 271 - 5) := (shifted_valley_d1_mod65536_contraction 90 W (by decide)).2

theorem two_zero_valley_d5_mod65536_drop_r90 (W : Nat) : HasHorizonDrop ((65536 * W + 42863) * 2 ^ 275 - 7) := (two_zero_valley_d5_mod65536_contraction 90 W (by decide)).2
theorem two_zero_valley_d5_mod65536_drop_r91 (W : Nat) : HasHorizonDrop ((65536 * W + 55735) * 2 ^ 278 - 7) := (two_zero_valley_d5_mod65536_contraction 91 W (by decide)).2
theorem two_zero_valley_d5_mod65536_drop_r92 (W : Nat) : HasHorizonDrop ((65536 * W + 64447) * 2 ^ 281 - 7) := (two_zero_valley_d5_mod65536_contraction 92 W (by decide)).2
theorem two_zero_valley_d5_mod65536_drop_r93 (W : Nat) : HasHorizonDrop ((65536 * W + 65415) * 2 ^ 284 - 7) := (two_zero_valley_d5_mod65536_contraction 93 W (by decide)).2
theorem two_zero_valley_d5_mod65536_drop_r94 (W : Nat) : HasHorizonDrop ((65536 * W + 50959) * 2 ^ 287 - 7) := (two_zero_valley_d5_mod65536_contraction 94 W (by decide)).2
theorem two_zero_valley_d5_mod65536_drop_r95 (W : Nat) : HasHorizonDrop ((65536 * W + 42071) * 2 ^ 290 - 7) := (two_zero_valley_d5_mod65536_contraction 95 W (by decide)).2

theorem two_zero_valley_d4_mod65536_drop_r75 (W : Nat) : HasHorizonDrop ((65536 * W + 12309) * 2 ^ 229 - 7) := (two_zero_valley_d4_mod65536_contraction 75 W (by decide)).2
theorem two_zero_valley_d4_mod65536_drop_r76 (W : Nat) : HasHorizonDrop ((65536 * W + 23213) * 2 ^ 232 - 7) := (two_zero_valley_d4_mod65536_contraction 76 W (by decide)).2
theorem two_zero_valley_d4_mod65536_drop_r77 (W : Nat) : HasHorizonDrop ((65536 * W + 9861) * 2 ^ 235 - 7) := (two_zero_valley_d4_mod65536_contraction 77 W (by decide)).2
theorem two_zero_valley_d4_mod65536_drop_r78 (W : Nat) : HasHorizonDrop ((65536 * W + 22941) * 2 ^ 238 - 7) := (two_zero_valley_d4_mod65536_contraction 78 W (by decide)).2
theorem two_zero_valley_d4_mod65536_drop_r79 (W : Nat) : HasHorizonDrop ((65536 * W + 2549) * 2 ^ 241 - 7) := (two_zero_valley_d4_mod65536_contraction 79 W (by decide)).2
theorem two_zero_valley_d4_mod65536_drop_r80 (W : Nat) : HasHorizonDrop ((65536 * W + 7565) * 2 ^ 244 - 7) := (two_zero_valley_d4_mod65536_contraction 80 W (by decide)).2

theorem shifted_valley_d2_mod65536_drop_r72 (W : Nat) : HasHorizonDrop ((65536 * W + 50023) * 2 ^ 218 - 5) := (shifted_valley_d2_mod65536_contraction 72 W (by decide)).2
theorem shifted_valley_d2_mod65536_drop_r73 (W : Nat) : HasHorizonDrop ((65536 * W + 41967) * 2 ^ 221 - 5) := (shifted_valley_d2_mod65536_contraction 73 W (by decide)).2
theorem shifted_valley_d2_mod65536_drop_r74 (W : Nat) : HasHorizonDrop ((65536 * W + 4663) * 2 ^ 224 - 5) := (shifted_valley_d2_mod65536_contraction 74 W (by decide)).2
theorem shifted_valley_d2_mod65536_drop_r75 (W : Nat) : HasHorizonDrop ((65536 * W + 36927) * 2 ^ 227 - 5) := (shifted_valley_d2_mod65536_contraction 75 W (by decide)).2
theorem shifted_valley_d2_mod65536_drop_r76 (W : Nat) : HasHorizonDrop ((65536 * W + 4103) * 2 ^ 230 - 5) := (shifted_valley_d2_mod65536_contraction 76 W (by decide)).2
theorem shifted_valley_d2_mod65536_drop_r77 (W : Nat) : HasHorizonDrop ((65536 * W + 29583) * 2 ^ 233 - 5) := (shifted_valley_d2_mod65536_contraction 77 W (by decide)).2


```
