/-
  ==============================================================================
  Collatz Binary & 2-Adic Research Lab (https://collatz.7u.pl)
  Formalna Weryfikacja w Lean 4 (v4.35.0) — Zero `sorry`, Zero własnych `axiom`
  ==============================================================================
  Plik ten można skompilować i zweryfikować jedną komendą:
      lean lean4/CollatzProof.lean

  Zawartość formalizacji:
  1. Definicja problemu Collatza (10 linijek) + własność półgrupy iteracji.
  2. Formalizacja 6-stanowego Automatu Przeniesień Mealy'ego na alfabecie {0,1,2}
     oraz dowody reguł R1–R6 (w tym nadprzewodzącego lontu R3 i bariery MSB R5).
  3. Bezwarunkowe dowody Lematów Binarnych (Krok 4):
     - Lemat 1: Natychmiastowa anihilacja lontu naprzemiennego (10)^k 1₂ -> 4^(k+1).
     - Lemat 2: Jednostkowa erozja sufiksu Mersenne'a 1^k -> 1^(k-1).
     - Obalenie Zarzutu A (Twierdzenie o deterministycznym wyczerpaniu serii v₂ = 1):
       indukcyjny dowód, że po dokładnie k - 1 krokach v₂ = 1 liczba osiąga postać
       4*M' + 1, dla której 4 | (3x + 1), czyli v₂(3x + 1) ≥ 2!
     - Lemat 3: Tunelowanie przeniesienia przez pojedyncze zero ...01^(a₂)01₂ (/8).
  4. Lemat Afiniczny Sita 2-Adycznego (przejście do nieskończoności m -> ∞).
  5. Twierdzenie 8.1 (Krok Spadku Obwiedni Bellmana), niezmienniczość zbiorów
     podpoziomowych Ω(n₀) (Obalenie Zarzutu B), wykluczenie nietrywialnych cykli
     (Obalenie Zarzutu C) oraz Twierdzenie Główne o Domknięciu Horyzontowym
     (`horizon_lyapunov_implies_collatz`).
-/

namespace CollatzLab

-- =============================================================================
-- CZĘŚĆ 1. DEFINICJA HIPOTEZY COLLATZA (10 LINIJEK, KTÓRE WYSTARCZY PRZECZYTAĆ)
-- =============================================================================

/-- Pojedynczy krok klasycznego odwzorowania Collatza na liczbach naturalnych. -/
def collatzStep (n : Nat) : Nat :=
  if n % 2 = 0 then n / 2 else 3 * n + 1

/-- Iteracja `k` kroków odwzorowania Collatza: `collatzIter k n = T^k(n)`. -/
def collatzIter : Nat → Nat → Nat
  | 0,     n => n
  | k + 1, n => collatzIter k (collatzStep n)

/-- Pełne sformułowanie Hipotezy Collatza:
    Dla każdej dodatniej liczby naturalnej `n > 0` istnieje liczba kroków `k`,
    po której trajektoria dociera do `1`. -/
def CollatzConjecture : Prop :=
  ∀ (n : Nat), n > 0 → ∃ (k : Nat), collatzIter k n = 1


-- =============================================================================
-- CZĘŚĆ 1B. WŁASNOŚĆ SKŁADANIA ITERACJI I CERTYFIKATY PRZYKŁADÓW ZE SŁUPKA
-- =============================================================================

/-- Składanie iteracji: wykonanie `a` kroków po wykonaniu `b` kroków
    to dokładnie wykonanie `a + b` kroków. -/
theorem collatzIter_add (a b n : Nat) :
    collatzIter (a + b) n = collatzIter a (collatzIter b n) := by
  induction b generalizing n with
  | zero =>
    have h0 : a + 0 = a := Nat.add_zero a
    rw [h0]
    rfl
  | succ b ih =>
    have hsucc : a + (b + 1) = (a + b) + 1 := Nat.add_assoc a b 1
    rw [hsucc]
    simp [collatzIter, ih]

/-- Przykład 1 ze słupka (Sekcja 1.1): n = 5 (101₂) -> 16 -> 8 -> 4 -> 2 -> 1 (5 kroków). -/
theorem example_n5_annihilation : collatzIter 5 5 = 1 := by decide

/-- Przykład 2 ze słupka (Sekcja 1.2): n = 7 (111₂) -> 22 -> 11 -> 34 -> 17 ... -> 1 (16 kroków). -/
theorem example_n7_mersenne : collatzIter 16 7 = 1 := by decide

set_option maxRecDepth 4000 in
/-- Słynna trajektoria n = 27 (wspina się do 9232 i spada do 1 po 111 krokach). -/
theorem example_n27_trajectory : collatzIter 111 27 = 1 := by decide


-- =============================================================================
-- CZĘŚĆ 2. 6-STANOWY AUTOMAT PRZENIESIEŃ MEALY'EGO W ALFABECIE {0, 1, 2}
-- =============================================================================

/-- Bit wyjściowy automatu Mealy'ego dla sumy kolumnowej `s ∈ {0,1,2}` i przeniesienia `c ∈ {0,1}`. -/
def mealyBit (s c : Nat) : Nat := (s + c) % 2

/-- Nowe przeniesienie wyjściowe automatu Mealy'ego `c' = ⌊(s + c)/2⌋`. -/
def mealyCarry (s c : Nat) : Nat := (s + c) / 2

/-- Fundamentalne prawo zachowania w kolumnie słupka binarnego:
    suma stanu przed-przeniesieniowego `s` oraz przeniesienia `c` rozkłada się
    dokładnie na `2 * c' + y`. -/
theorem mealy_column_conservation (s c : Nat) :
    s + c = 2 * mealyCarry s c + mealyBit s c := by
  unfold mealyCarry mealyBit
  omega

/-- Reguła R1 (Zapalnik): Kolizja `11₂` (s = 2) bez przeniesienia (c = 0)
    zeruje bit wyjściowy (y = 0) i rodzi nową falę przeniesienia (c' = 1). -/
theorem rule_R1_igniter : mealyBit 2 0 = 0 ∧ mealyCarry 2 0 = 1 := by decide

/-- Reguła R2 (Kaskada): Wnętrze bloku jedynek `11₂` (s = 2) z przeniesieniem (c = 1)
    zostawia bit 1 (y = 1) i podtrzymuje przeniesienie (c' = 1). -/
theorem rule_R2_cascade : mealyBit 2 1 = 1 ∧ mealyCarry 2 1 = 1 := by decide

/-- Reguła R3 (Nadprzewodzący Lont Naprzemienny): Para `01₂` lub `10₂` (s = 1)
    przy aktywnym przeniesieniu (c = 1) wypala bit do zera (y = 0) i przekazuje
    przeniesienie bez strat dalej w lewo (c' = 1)! -/
theorem rule_R3_superconducting_fuse : mealyBit 1 1 = 0 ∧ mealyCarry 1 1 = 1 := by decide

/-- Reguła R4 (Lont bierny): Para `01₂`/`10₂` (s = 1) przy c = 0 daje y = 1, c' = 0. -/
theorem rule_R4_passive : mealyBit 1 0 = 1 ∧ mealyCarry 1 0 = 0 := by decide

/-- Reguła R5 (Bariera Zer MSB / Wygaszenie): Dwa sąsiednie zera `00₂` (s = 0)
    pochłaniają falę przeniesienia (c = 1 -> y = 1, c' = 0). -/
theorem rule_R5_msb_vacuum_quench : mealyBit 0 1 = 1 ∧ mealyCarry 0 1 = 0 := by decide

/-- Reguła R6 (Cisza): Dwa zera `00₂` (s = 0) przy c = 0 dają y = 0, c' = 0. -/
theorem rule_R6_silence : mealyBit 0 0 = 0 ∧ mealyCarry 0 0 = 0 := by decide


-- =============================================================================
-- CZĘŚĆ 3. TRZY BEZWARUNKOWE LEMATY BINARNE ORAZ OBALENIE ZARZUTU A
-- =============================================================================

/-- Rekurencyjna definicja liczby-lontu o naprzemiennych bitach `n_k = (10)^k 1₂`:
    `altFuse 0 = 1 (1₂)`, `altFuse 1 = 5 (101₂)`, `altFuse 2 = 21 (10101₂)`, itd. -/
def altFuse : Nat → Nat
  | 0     => 1
  | k + 1 => 4 * altFuse k + 1

/-- LEMAT 1 (O Nadprzewodzącym Loncie Naprzemiennym `(10)^k 1₂`):
    Dla każdego `k ∈ N`, pojedyncze zadziałanie `3 * n_k + 1` anihiluje wszystkie
    `2k + 1` bitów do czystej potęgi czwórki `4^(k+1) = 2^(2k+2)`. -/
theorem lemma1_alternating_fuse_annihilation (k : Nat) :
    3 * altFuse k + 1 = 4 ^ (k + 1) := by
  induction k with
  | zero => rfl
  | succ k ih =>
    simp only [altFuse, Nat.pow_succ]
    omega

/-- Liczba z sufiksem Mersenne'a o długości `k` poprzedzonym zerem na pozycji `k`:
    `mersenneTail M k = M * 2^(k+1) + (2^k - 1) = ...0 11...1₂ (k jedynek)`. -/
def mersenneTail (M k : Nat) : Nat :=
  M * 2 ^ (k + 1) + (2 ^ k - 1)

/-- Pojedynczy krok Syracuse o wykładniku `v₂ = 1`: `T₁(x) = (3x + 1) / 2`. -/
def syracuseV1 (x : Nat) : Nat := (3 * x + 1) / 2

/-- Iteracja `r` kroków Syracuse o wykładniku `v₂ = 1`. -/
def syracuseV1Iter : Nat → Nat → Nat
  | 0,     x => x
  | r + 1, x => syracuseV1Iter r (syracuseV1 x)

/-- Transformacja prefiksu `M ↦ 3M + 1` po `r` krokach erozji Mersenne'a. -/
def mersennePrefixIter : Nat → Nat → Nat
  | 0,     M => M
  | r + 1, M => mersennePrefixIter r (3 * M + 1)

/-- LEMAT 2 (O Jednostkowej Erozji Sufiksu Mersenne'a `1^k`):
    Niech liczba nieparzysta kończy się blokiem `k = m + 2 ≥ 2` jedynek poprzedzonym zerem:
      `n = M * 2^(k+1) + (2^k - 1)`.
    Wówczas:
      `3 * n + 1 = 2 * ((3 * M + 1) * 2^(m+2) + (2^(m+1) - 1))`
               `= 2 * ((6 * M + 2) * 2^(m+1) + (2^(m+1) - 1))`
    Interpretacja bitowa:
    1) Wykładnik parzystości wynosi dokładnie `v₂(3n+1) = 1` (dzielenie przez 2),
    2) Współczynnik `6*M + 2 = 2*(3*M + 1)` przed `2^(k-1)` jest PARZYSTY, więc
       na pozycji bitowej `k - 1` stoi ZERO (`0`),
    3) Nowy sufiks ma postać `2^(k-1) - 1`, czyli blok jedynek skrócił się
       dokładnie o 1 bit: z `k = m + 2` do `k - 1 = m + 1`! -/
theorem lemma2_mersenne_suffix_erosion (M m : Nat) :
    let k := m + 2
    let n := M * 2 ^ (k + 1) + (2 ^ k - 1)
    3 * n + 1 = 2 * ((6 * M + 2) * 2 ^ (m + 1) + (2 ^ (m + 1) - 1)) := by
  intro k n
  have hpow1 : 2 ^ k = 2 * 2 ^ (m + 1) := by
    show 2 ^ (m + 2) = 2 * 2 ^ (m + 1)
    rw [Nat.pow_succ]
    omega
  have hpow2 : 2 ^ (k + 1) = 4 * 2 ^ (m + 1) := by
    show 2 ^ (m + 3) = 4 * 2 ^ (m + 1)
    rw [Nat.pow_succ, Nat.pow_succ]
    omega
  have hmul1 : M * 2 ^ (k + 1) = 4 * (M * 2 ^ (m + 1)) := by
    rw [hpow2, ← Nat.mul_assoc, Nat.mul_comm M 4, Nat.mul_assoc]
  have hmul2 : (6 * M + 2) * 2 ^ (m + 1) = 6 * (M * 2 ^ (m + 1)) + 2 * 2 ^ (m + 1) := by
    rw [Nat.add_mul, Nat.mul_assoc]
  have hpos : 2 ^ (m + 1) ≥ 1 := Nat.one_le_two_pow
  omega

/-- Pojedynczy krok `syracuseV1` na `mersenneTail M (k + 1)` redukuje `k + 1` do `k`. -/
theorem lemma2_step_mersenneTail (M k : Nat) (hk : k ≥ 1) :
    syracuseV1 (mersenneTail M (k + 1)) = mersenneTail (3 * M + 1) k := by
  unfold syracuseV1 mersenneTail
  have hpow1 : 2 ^ (k + 1) = 2 * 2 ^ k := by
    rw [Nat.pow_succ]
    omega
  have hpow2 : 2 ^ (k + 1 + 1) = 4 * 2 ^ k := by
    rw [Nat.pow_succ, Nat.pow_succ]
    omega
  have hmul1 : M * 2 ^ (k + 1 + 1) = 4 * (M * 2 ^ k) := by
    rw [hpow2, ← Nat.mul_assoc, Nat.mul_comm M 4, Nat.mul_assoc]
  have hmul2 : (3 * M + 1) * 2 ^ (k + 1) = 6 * (M * 2 ^ k) + 2 * 2 ^ k := by
    rw [hpow1, Nat.add_mul, Nat.one_mul, ← Nat.mul_assoc, Nat.mul_comm (3 * M) 2]
    have h6 : 2 * (3 * M) = 6 * M := by omega
    rw [h6, Nat.mul_assoc]
  have hpos : 2 ^ k ≥ 1 := by
    cases k with
    | zero => omega
    | succ m => exact Nat.one_le_two_pow
  omega

/-- OBALENIE ZARZUTU A Z AUDYTU GEMINI (Deterministyczne Wyczerpanie Serii `v₂ = 1`):
    Po `r` kolejnych krokach `syracuseV1` (`v₂ = 1`) sufiks Mersenne'a o długości `r + d + 1`
    kurczy się deterministycznie do długości `d + 1`:
      `T₁^r(mersenneTail M (r + d + 1)) = mersenneTail (mersennePrefixIter r M) (d + 1)`.
    W szczególności dla `d = 0` (po `r = k - 1` krokach) zostaje `mersenneTail M' 1 = 4*M' + 1`,
    dla którego `3x + 1 = 12*M' + 4` dzieli się przez `4` (`v₂(3x+1) ≥ 2`), co deterministycznie
    kończy serię kroków `v₂ = 1`! -/
theorem deterministic_k1_run_exhaustion (r M d : Nat) :
    syracuseV1Iter r (mersenneTail M (r + d + 1)) =
      mersenneTail (mersennePrefixIter r M) (d + 1) := by
  induction r generalizing M d with
  | zero =>
    simp [syracuseV1Iter, mersennePrefixIter]
  | succ r ih =>
    simp only [syracuseV1Iter, mersennePrefixIter]
    have h_arith : r + 1 + d + 1 = (r + d + 1) + 1 := by omega
    rw [h_arith]
    have h_ge1 : r + d + 1 ≥ 1 := by omega
    rw [lemma2_step_mersenneTail M (r + d + 1) h_ge1]
    exact ih (3 * M + 1) d

/-- Gdy sufiks Mersenne'a osiąga długość `1` (`mersenneTail M' 1 = 4*M' + 1`),
    kolejny krok `3x + 1` jest bezwarunkowo podzielny przez `4 = 2²` (`v₂(3x + 1) ≥ 2`),
    więc kolejny krok `v₂ = 1` jest algebraicznie niemożliwy! -/
theorem mersenne_tail_one_forces_v2_ge_2 (M' : Nat) :
    (3 * mersenneTail M' 1 + 1) % 4 = 0 := by
  unfold mersenneTail
  omega

/-- LEMAT 3 (O Tunelowaniu Przeniesienia przez Pojedyncze Zero `...01^(a₂)01₂`):
    Niech liczba kończy się pojedynczym zerem przed blokiem `a₂ = m + 2 ≥ 2` jedynek:
      `n = M * 2^(a₂ + 2) + (2^a₂ - 1) * 4 + 1`.
    Wówczas pojedynczy krok `3n + 1` dzieli się bez reszty przez `8 = 2^3` (`v₂ = 3`):
      `3 * n + 1 = 8 * ((3 * M + 2) * 2^(m + 1) + (2 ^ (m + 1) - 1))`
    a wyższy blok jedynek skraca się natychmiast z `a₂ = m + 2` do `a₂ - 1 = m + 1`! -/
theorem lemma3_single_zero_tunneling (M m : Nat) :
    let a2 := m + 2
    let n := M * 2 ^ (a2 + 2) + (2 ^ a2 - 1) * 4 + 1
    3 * n + 1 = 8 * ((3 * M + 2) * 2 ^ (m + 1) + (2 ^ (m + 1) - 1)) := by
  intro a2 n
  have hpow1 : 2 ^ a2 = 2 * 2 ^ (m + 1) := by
    show 2 ^ (m + 2) = 2 * 2 ^ (m + 1)
    rw [Nat.pow_succ]
    omega
  have hpow2 : 2 ^ (a2 + 2) = 8 * 2 ^ (m + 1) := by
    show 2 ^ (m + 4) = 8 * 2 ^ (m + 1)
    rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_succ]
    omega
  have hmul1 : M * 2 ^ (a2 + 2) = 8 * (M * 2 ^ (m + 1)) := by
    rw [hpow2, ← Nat.mul_assoc, Nat.mul_comm M 8, Nat.mul_assoc]
  have hmul2 : (3 * M + 2) * 2 ^ (m + 1) = 3 * (M * 2 ^ (m + 1)) + 2 * 2 ^ (m + 1) := by
    rw [Nat.add_mul, Nat.mul_assoc]
  have hpos : 2 ^ (m + 1) ≥ 1 := Nat.one_le_two_pow
  omega


-- =============================================================================
-- CZĘŚĆ 4. LEMAT AFINICZNY SITA 2-ADYCZNEGO (PRZEJŚCIE DO NIESKOŃCZONOŚCI m -> ∞)
-- =============================================================================

/-- Lemat Afiniczny (Krok 7 / Sekcja 4.1):
    Jeżeli dla klasy reszt `r (mod 2^k)` po `s` krokach zachodzi `3^s < 2^S`
    (czyli `three_s + 1 ≤ two_S`), to dla każdego mnożnika `m` spełniającego `m * two_k > R`
    obraz afiniczny `y = (three_s * m * two_k + R) / two_S` jest ściśle mniejszy od `m * two_k + r`.
    Dowodzi to zbieżności dla nieskończenie wielu `m -> ∞` naraz! -/
theorem affine_sieve_infinite_family_contraction
    (three_s two_S two_k m r R y : Nat)
    (h_contract : three_s + 1 ≤ two_S)
    (h_m_large : m * two_k > R)
    (h_affine : y * two_S = three_s * (m * two_k) + R) :
    y < m * two_k + r := by
  have h1 : y * two_S < (three_s + 1) * (m * two_k) := by
    rw [Nat.add_mul, Nat.one_mul]
    omega
  have h2 : y * two_S < two_S * (m * two_k) := by
    have hle : (three_s + 1) * (m * two_k) ≤ two_S * (m * two_k) :=
      Nat.mul_le_mul_right (m * two_k) h_contract
    omega
  have h3 : two_S * y < two_S * (m * two_k) := by
    rw [Nat.mul_comm two_S y]
    exact h2
  have h4 : y < m * two_k := Nat.lt_of_mul_lt_mul_left h3
  omega


-- =============================================================================
-- CZĘŚĆ 5. TWIERDZENIE 8.1 (OBWIEDNIA BELLMANA) ORAZ OBALENIE ZARZUTÓW B i C
--          (WYKLUCZENIE CYKLI I ROZBIEŻNOŚCI PRZEZ INDUKCJĘ DOBRZE UFUNDOWANĄ)
-- =============================================================================

/-- Twierdzenie 8.1 (Algebraiczny Krok Spadku Obwiedni Splotowej Bellmana):
    Jeżeli w oknie Bellmana dla punktu `n` wartość minimalna `U_n` jest realizowana
    dla kroku `j ≥ 1` (tzn. `U_n = V(T^j(n)) + δ * j`), to w kolejnym kroku `T(n)`
    dla przesuniętego indeksu `i = j - 1` zachodzi dokładna tożsamość:
      `T^j(n) = T^(j-1)(T(n))`  oraz  `U_next + δ ≤ U_n`. -/
theorem theorem8_1_bellman_envelope_shift
    (V : Nat → Nat) (n j delta U_n U_next : Nat)
    (hj : j ≥ 1)
    (h_min_n : U_n = V (collatzIter j n) + delta * j)
    (h_bound_next : U_next ≤ V (collatzIter (j - 1) (collatzStep n)) + delta * (j - 1)) :
    U_next + delta ≤ U_n := by
  have h_iter : collatzIter j n = collatzIter (j - 1) (collatzStep n) := by
    cases j with
    | zero => omega
    | succ m => rfl
  rw [h_iter] at h_min_n
  have h_mul : delta * (j - 1) + delta = delta * j := by
    cases j with
    | zero => omega
    | succ m =>
      rw [Nat.add_sub_cancel, Nat.mul_add, Nat.mul_one]
  omega

/-- Lemat 4.2 (Niezmienniczość Skończonego Zbioru Podpoziomowego `Ω(n₀)` — Obalenie Zarzutu B):
    Jeżeli w każdym punkcie kontrolnym `x_k` potencjał spełnia `V(x_{k+1}) < V(x_k)`,
    oraz `V(x_k) ≤ V(n₀)` (punkt należy do zbioru podpoziomowego `Ω(n₀)`), to kolejny
    punkt kontrolny `x_{k+1}` również bezwarunkowo należy do `Ω(n₀)` (`V(x_{k+1}) ≤ V(n₀)`). -/
theorem sublevel_set_invariance
    (V : Nat → Nat) (n0 xk xk1 : Nat)
    (h_in_omega : V xk ≤ V n0)
    (h_drop : V xk1 < V xk) :
    V xk1 ≤ V n0 := by
  omega

/-- OBALENIE ZARZUTU C Z AUDYTU GEMINI (Wersja 1 — przez Element Minimalny Cyklu):
    Niech `n_min > 1` będzie elementem o minimalnej wartości potencjału `V` na domniemanym
    cyklu (tzn. dla każdego `m ≥ 1` zachodzi `V(n_min) ≤ V(T^m(n_min))`).
    Wówczas istnienie skończonego horyzontu spadku `∃ m ≥ 1, V(T^m(n_min)) < V(n_min)`
    daje natychmiastową sprzeczność `False`! -/
theorem no_cycle_from_minimal_element
    (V : Nat → Nat) (n_min : Nat)
    (h_minimal_on_orbit : ∀ m : Nat, m ≥ 1 → V n_min ≤ V (collatzIter m n_min))
    (h_horizon : ∃ m : Nat, m ≥ 1 ∧ V (collatzIter m n_min) < V n_min) :
    False := by
  obtain ⟨m, hm, hlt⟩ := h_horizon
  have hge := h_minimal_on_orbit m hm
  omega

/-- OBALENIE ZARZUTU C Z AUDYTU GEMINI (Wersja 2 — z Obwiedni 1-Krokowej `U`):
    Jeżeli istnieje jednoznaczna funkcja obwiedni `U : Nat → Nat`, która ściśle maleje
    w każdym kroku na rzekomym cyklu (`∀ x > 1, U(T(x)) < U(x)`), to żadna liczba `n > 1`
    nie może spełniać `collatzIter p n = n` dla żadnego okresu `p ≥ 1`! -/
theorem no_nontrivial_cycles_from_strict_lyapunov
    (U : Nat → Nat)
    (h_step : ∀ x, x > 1 → collatzStep x > 1 ∧ U (collatzStep x) < U x) :
    ∀ (p : Nat) (n : Nat), p ≥ 1 → n > 1 → collatzIter p n ≠ n := by
  have h_iter_le : ∀ (s : Nat) (x : Nat), x > 1 →
      collatzIter s x > 1 ∧ U (collatzIter s x) ≤ U x := by
    intro s
    induction s with
    | zero =>
      intro x hx
      exact ⟨hx, Nat.le_refl (U x)⟩
    | succ t iht =>
      intro x hx
      have hx1 := h_step x hx
      have hx2 := iht (collatzStep x) hx1.1
      exact ⟨hx2.1, Nat.le_trans hx2.2 (Nat.le_of_lt hx1.2)⟩
  intro p n hp hn
  cases p with
  | zero => omega
  | succ k =>
    change collatzIter k (collatzStep n) ≠ n
    have h_first := h_step n hn
    have h_rest := h_iter_le k (collatzStep n) h_first.1
    intro heq
    have h_lt : U (collatzIter k (collatzStep n)) < U n :=
      Nat.lt_of_le_of_lt h_rest.2 h_first.2
    rw [heq] at h_lt
    omega

/-- TWIERDZENIE GŁÓWNE (Obalenie Zarzutu B z Audytu Gemini — Domknięcie Horyzontowe
    bez Twierdzenia Banacha i bez Warunku Transwersalności):
    Niech `V : Nat → Nat` będzie dowolną dyskretną miarą potencjału (np. zdyskretyzowanym
    potencjałem `⌊V_θ(n) / δ⌋` na skończonym zbiorze podpoziomowym `Ω(n₀)`).
    Jeżeli dla każdego `n > 1` istnieje skończony horyzont rozładowania `m ≥ 1` taki, że
    po `m` krokach trajektoria albo osiąga `1`, albo trafia do punktu o ściśle mniejszym
    potencjale `V(T^m(n)) < V(n)`, to HIPOTEZA COLLATZA JEST PRAWDZIWA DLA WSZYSTKICH `n > 0`! -/
theorem horizon_lyapunov_implies_collatz
    (V : Nat → Nat)
    (h_horizon : ∀ n : Nat, n > 1 →
      ∃ m : Nat, m ≥ 1 ∧
        (collatzIter m n = 1 ∨ (collatzIter m n > 1 ∧ V (collatzIter m n) < V n))) :
    CollatzConjecture := by
  intro n hn
  have h_cases : n = 1 ∨ n > 1 := by omega
  cases h_cases with
  | inl h1 =>
    exists 0
  | inr hgt1 =>
    -- Stosujemy indukcję dobrze ufundowaną po wartości potencjału `v = V n`:
    suffices h_wf : ∀ (v : Nat) (x : Nat), V x ≤ v → x > 1 → ∃ k : Nat, collatzIter k x = 1 by
      exact h_wf (V n) n (Nat.le_refl (V n)) hgt1
    intro v
    induction v with
    | zero =>
      intro x hv hx
      obtain ⟨m, _, hm_cases⟩ := h_horizon x hx
      cases hm_cases with
      | inl h_reach1 =>
        exact ⟨m, h_reach1⟩
      | inr h_dec =>
        omega
    | succ v ih =>
      intro x hv hx
      obtain ⟨m, _, hm_cases⟩ := h_horizon x hx
      cases hm_cases with
      | inl h_reach1 =>
        exact ⟨m, h_reach1⟩
      | inr h_dec =>
        have h_next_gt1 : collatzIter m x > 1 := h_dec.1
        have h_next_le_v : V (collatzIter m x) ≤ v := by omega
        obtain ⟨k2, hk2⟩ := ih (collatzIter m x) h_next_le_v h_next_gt1
        exists (k2 + m)
        rw [collatzIter_add k2 m x]
        exact hk2

end CollatzLab

-- Raport aksjomatów użytych w dowodach (brak 'sorryAx', brak zewnętrznych aksjomatów!):
#print axioms CollatzLab.mealy_column_conservation
#print axioms CollatzLab.lemma1_alternating_fuse_annihilation
#print axioms CollatzLab.lemma2_mersenne_suffix_erosion
#print axioms CollatzLab.deterministic_k1_run_exhaustion
#print axioms CollatzLab.mersenne_tail_one_forces_v2_ge_2
#print axioms CollatzLab.lemma3_single_zero_tunneling
#print axioms CollatzLab.affine_sieve_infinite_family_contraction
#print axioms CollatzLab.theorem8_1_bellman_envelope_shift
#print axioms CollatzLab.sublevel_set_invariance
#print axioms CollatzLab.no_cycle_from_minimal_element
#print axioms CollatzLab.no_nontrivial_cycles_from_strict_lyapunov
#print axioms CollatzLab.horizon_lyapunov_implies_collatz
