# Log Badawczy 03: Symboliczny Transduktor na Parametrycznych Blokach Biegów $1^{a_k} 0^{b_{k-1}} \dots 1^{a_1}$

- **Metoda:** `03-symbolic-block-grammar-closure`
- **Silnik obliczeniowy:** `rust-verifier/src/bigint_lab.rs` (`verify_method3_symbolic_grammar`)

---

## 1. Hipoteza Matematyczna: Od Pojedynczych Liczb do Algebry Nieskończonych Rodzin

Zamiast testować liczby pojedynczo, zapisujemy dowolną liczbę binarną w postaci **parametrycznego wyrażenia blokowego (Run-Length Encoding)** z symbolicznymi wykładnikami $L, A, B \in \mathbb{N}^+$:
$$n = 1^{a_k} \, 0^{b_{k-1}} \, 1^{a_{k-1}} \dots 0^{b_1} \, 1^{a_1}$$
Operator $3n + 1 = 2n + n + 1$ w reprezentacji wektora przed przeniesieniem $\{0, 1, 2\}$ indukuje **ściśle domknięte reguły przepisywania wykładników (Term Rewriting System)**.

---

## 2. Cztery Zamknięte Prawa Przepisania Blokowego (Zweryfikowane dla $L = 2 \dots 60$ na 256-bitowych `BigBits`)

| ID Reguły | Wejściowy Szablon Blokowy | Wektor Przed Przeniesieniem `{0,1,2}` | Wyjściowy Szablon po Kroku Syracuse | Zmiana Wykładnika / Rozmiaru (`59/59` testów `BigBits`) |
| :--- | :--- | :--- | :--- | :--- |
| **`R1_ALT_FUSE`** | $(10)^L \cdot 1$ | $1^{2L+1} \cdot 2$ | $1[0^{2L+2}] \xrightarrow{\gg (2L+2)} 1$ | **Natychmiastowa redukcja o $-(2L+1)$ bitów do $1$ w 1 kroku!** |
| **`R2_MERSENNE_EROSION`** | $\dots 0^{\ge 2} \cdot 1^L$ | $\dots 01 \cdot 2^L$ | $\dots 10 \cdot 1^{L-1}$ | **Ścisła redukcja wykładnika bloku jedynek: $L \mapsto L - 1$** (oraz emisja pary naprzemiennej `10` na lewo!) |
| **`R3_INTERNAL_VALLEY`** | $(10)^L \cdot 11$ | $1^{2L} \cdot 22$ | $1 \cdot 0^{2L} \cdot 101$ | **Wewnętrzna kolizja `'2'` zamienia lont $(10)^L$ w dolinę $2L$ zer za MSB!** |
| **`R4_SINGLE_ZERO_TUNNEL`** | $1^A \cdot 0^1 \cdot 1^B$ ($B \ge 2$) | $12^{A-1} \cdot 1 \cdot 2^B$ | $10 \cdot 1^A \cdot 0^1 \cdot 1^{B-1}$ | **Pojedyncze zero $0^1$ przesuwa się w prawo ($B \mapsto B-1$), zachowując lewy blok $1^A$ i emitując `10` przed nim** |

---

## 3. Kluczowe Odkrycie z Reguły `R2` i `R4`: Samozniszczenie Kaskady Jedynek przez Emisję Lontów `10`

Spójrz na lewą stronę wyjścia w regułach **`R2_MERSENNE_EROSION`** oraz **`R4_SINGLE_ZERO_TUNNEL`**:
- Podczas gdy prawy blok jedynek $1^L$ ulega erozji ($L \mapsto L-1 \mapsto L-2 \dots$), **w każdym kroku na lewym brzegu tego bloku emitowana jest para bitów `10`**!
- Po $m$ krokach erozji bloku jedynek po jego lewej stronie narasta **naprzemienny łańcuch $(10)^m$ (lub ciąg typu `1011010...`)**!
- Oznacza to głęboką zasadę zachowania w przestrzeni $\mathbb{Z}_2$:
  > **Twierdzenie o Konwersji Bloków Mersenne’a w Lonty Naprzemienne:**
  > Każdy blok zwartych jedynek $1^L$ (generujący dwójki `'2'` w wektorze przed przeniesieniem), ulegając erozji od prawej strony, **wytwarza po swojej lewej stronie naprzemienne pary `10` (czyli jedynki `'1'` w wektorze przed przeniesieniem)**, które w kolejnych krokach stają się nadprzewodzącymi lontami i ulegają anihilacji do dolin zerowych zgodnie z regułą `R3_INTERNAL_VALLEY`!

To wyjaśnia strukturalnie, dlaczego trajektoria nie może w nieskończoność utrzymywać gęstych bloków jedynek: sama erozja bloku jedynek produkuje za sobą naprzemienny lont `10...`, który następnie rozładowuje się w lawinie przeniesień do czystych zer.
