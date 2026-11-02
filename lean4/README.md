# Formalna Weryfikacja w Lean 4 (`lean4/CollatzProof.lean`)

Ten katalog zawiera samowystarczalną, pozbawioną zewnętrznych zależności (nie wymaga pobierania wielogigabajtowego `Mathlib`) formalizację kluczowych lematów i twierdzeń redukcyjnych z laboratorium **[`collatz.7u.pl`](https://collatz.7u.pl)** w asystencie dowodowym **Lean 4 (v4.35.0)**.

## Szybkie uruchomienie (czas weryfikacji: ~1.5 sekundy)

```bash
npm run proof
# lub bezpośrednio:
lean lean4/CollatzProof.lean
```

Kompilator `lean` weryfikuje cały plik z wynikiem **`0 errors, 0 warnings, 0 sorryAx`** i wypisuje listę aksjomatów użytych w każdym z 12 głównych twierdzeń (`#print axioms`), potwierdzając brak jakichkolwiek luk (`sorry`) lub ukrytych aksjomatów użytkownika.

---

## Jak czytać plik `CollatzProof.lean` bez znajomości Lean 4?

W asystencie dowodowym Lean 4 czytelnik **nie musi analizować taktyk wewnątrz bloków `by ...`** — poprawność przejść algebraicznych i logicznych wewnątrz dowodu jest wymuszana przez jądro kompilatora (*kernel*). Aby mieć 100% pewności co do znaczenia twierdzeń, wystarczy przeczytać **same definicje (10 linijek na początku pliku)** oraz nagłówki `theorem`:

```lean
def collatzStep (n : Nat) : Nat :=
  if n % 2 = 0 then n / 2 else 3 * n + 1

def collatzIter : Nat → Nat → Nat
  | 0,     n => n
  | k + 1, n => collatzIter k (collatzStep n)

def CollatzConjecture : Prop :=
  ∀ (n : Nat), n > 0 → ∃ (k : Nat), collatzIter k n = 1
```

---

## Lista Zweryfikowanych Twierdzeń w `CollatzProof.lean`

| Twierdzenie w `CollatzProof.lean` | Odpowiednik w `Log #07` (`collatz.7u.pl`) | Status w Lean 4.35.0 |
| :--- | :--- | :---: |
| `collatzIter_add` | Półgrupowa własność składania iteracji $T^{a+b}(n) = T^a(T^b(n))$ | **Udowodnione (`0 sorry`)** |
| `example_n5_annihilation`, `example_n7_mersenne`, `example_n27_trajectory` | Certyfikaty przykładów ze słupka binarnego ($n=5, 7, 27$) | **Udowodnione (`0 sorry`)** |
| `mealy_column_conservation` oraz `rule_R1_igniter` .. `rule_R6_silence` | Krok 3: 6-stanowy Automat Przeniesień Mealy'ego na $\{0, 1, 2\}$ | **Udowodnione (`0 sorry`)** |
| `lemma1_alternating_fuse_annihilation` | Lemat 1: Anihilacja lontu naprzemiennego $3\cdot\mathtt{(10)^k 1_2} + 1 = 4^{k+1}$ | **Udowodnione (`0 sorry`)** |
| `lemma2_mersenne_suffix_erosion` | Lemat 2: Jednostkowa erozja sufiksu Mersenne'a $\mathtt{1^k} \mapsto \mathtt{1^{k-1}}$ | **Udowodnione (`0 sorry`)** |
| `deterministic_k1_run_exhaustion` oraz `mersenne_tail_one_forces_v2_ge_2` | **Obalenie Zarzutu A:** Indukcyjny dowód deterministycznego wyczerpania serii $v_2 = 1$ po dokładnie $k-1$ krokach ($4 \mid 3x+1$) | **Udowodnione (`0 sorry`)** |
| `lemma3_single_zero_tunneling` | Lemat 3: Tunelowanie pojedynczego zera $\mathtt{\dots 01^{a_2}01_2}$ z dzieleniem przez $8 = 2^3$ | **Udowodnione (`0 sorry`)** |
| `affine_sieve_infinite_family_contraction` | Krok 7: Lemat Afiniczny sita 2-adycznego (przejście do nieskończoności $m \to \infty$) | **Udowodnione (`0 sorry`)** |
| `theorem8_1_bellman_envelope_shift` | Krok 8 (Twierdzenie 8.1): Krok spadku Obwiedni Splotowej Bellmana $U_{next} + \delta \le U_n$ | **Udowodnione (`0 sorry`)** |
| `sublevel_set_invariance` | Lemat 4.2 (**Obalenie Zarzutu B**): Niezmienniczość skończonego zbioru podpoziomowego $\Omega(n_0)$ | **Udowodnione (`0 sorry`)** |
| `no_cycle_from_minimal_element` oraz `no_nontrivial_cycles_from_strict_lyapunov` | **Obalenie Zarzutu C:** Bezwarunkowe wykluczenie nietrywialnych cykli okresowych | **Udowodnione (`0 sorry`)** |
| `horizon_lyapunov_implies_collatz` | **Twierdzenie Główne (Obalenie Zarzutu B):** Redukcja całej Hipotezy Collatza do skończoności horyzontu $H(n) < \infty$ przez indukcję dobrze ufundowaną na $\mathbb{N}$ (bez twierdzenia Banacha i bez warunku transwersalności!) | **Udowodnione (`0 sorry`)** |
