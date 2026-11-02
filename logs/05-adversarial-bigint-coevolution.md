::: lang pl
# Log Badawczy 05: Współewolucyjny Łowca Kontrprzykładów `BigInt` (`128–2048` bitów) vs Potencjał $V_{\theta}(n)$

- **Metoda:** `05-adversarial-bigint-coevolution`
- **Silnik obliczeniowy:** `rust-verifier/src/bigint_lab.rs` (`run_method5_adversarial_bigint_hunter`)

---

## 1. Cel Eksperymentu: Test Odporności na Gigantycznych Liczbach `BigInt` ($128 \dots 2048$ bitów)

Przy badaniu Hipotezy Collatza zwykłe 64-bitowe liczby całkowite są niewystarczające, ponieważ trajektorie mogą wielokrotnie przekraczać próg $2^{64}$, a pewne zjawiska falowe (wielokrotne kaskady przeniesień przez długie łańcuchy `11101110111...`) ujawniają się dopiero przy setkach lub tysiącach bitów.

Zbudowaliśmy w Rust natywną strukturę `BigBits` (wektor 64-bitowych słów maszynowych z obsługą pełnego przeniesienia `u128` i natychmiastowego obcinania zer $\nu_2$) i uruchomiliśmy łowcę najtrudniejszych konfiguracji bitowych dla pięciu skal wielkości:
- **$128$ bitów** ($\sim 3{,}4 \times 10^{38}$),
- **$256$ bitów** ($\sim 1{,}1 \times 10^{77}$),
- **$512$ bitów** ($\sim 1{,}3 \times 10^{154}$),
- **$1024$ bity** ($\sim 1{,}8 \times 10^{308}$ — granica `Float64`),
- **$2048$ bitów** ($\sim 3{,}2 \times 10^{616}$ — klucz RSA-2048!).

---

## 2. Wyniki dla Najtrudniejszych Znalezionych Chromosomów `BigInt` (Motywy Tunelowe `11101110...`)

| Długość `BigInt` | Kroki Nieparzyste | Kroki Parzyste (Zera $\nu_2$) | Łączna Liczba Kroków | Współczynnik Opóźnienia $\gamma(n) = \frac{\text{steps}}{\log_2 n}$ | Okno Spadku Potencjału $\Delta V_{\theta} < 0$ | Osiągnięto Cel `1[000...]`? |
| :---: | ---: | ---: | ---: | ---: | :---: | :---: |
| **$128$ bitów** | $407$ | $773$ | $1\,180$ | **$9{,}24$** | $2\text{ kroki}$ | **TAK (`100%`)** |
| **$256$ bitów** | $927$ | $1\,725$ | $2\,652$ | **$10{,}38$** | $2\text{ kroki}$ | **TAK (`100%`)** |
| **$512$ bitów** | $1\,516$ | $2\,915$ | $4\,431$ | **$8{,}65$** | **$1\text{ krok}$** | **TAK (`100%`)** |
| **$1024$ bity** | $2\,508$ | $4\,999$ | $7\,507$ | **$7{,}33$** | **$1\text{ krok}$** | **TAK (`100%`)** |
| **$2048$ bitów** | **$5\,192$** | **$10\,277$** | **$15\,469$** | **$7{,}55$** | **$1\text{ krok}$** | **TAK (`100%`)** |

---

## 3. Kluczowe Wnioski z Testów na 2048-Bitowych `BigInt`

1. **Samotłumienie w Skali Makro (`512–2048` bitów):**
   Zauważ własność w kolumnie $\gamma(n)$ oraz oknie spadku $\Delta V_{\theta} < 0$:
   Dla mniejszych liczb ($128–256$ bitów) pojedynczy pechowy układ końcowych bitów potrafi wygenerować współczynnik opóźnienia $\gamma(n) \approx 10{,}38$. Natomiast dla gigantycznych liczb **$1024$ i $2048$ bitów** maksymalny współczynnik opóźnienia spada w okolice $\gamma(n) \approx 7{,}33\text{–}7{,}55$ (zbliżając się do teoretycznej wartości średniej prawa wielkich liczb $\frac{1 + 2}{2 - \log_2 3} \approx 7{,}228$), a nasz potencjał tunelowy $V_{\theta}(n)$ maleje już po **1–2 krokach**!
2. **Dlaczego duże liczby `BigInt` są „łatwiejsze” dla potencjału $V_{\theta}(n)$ niż małe liczby typu $n = 27$?**
   Ponieważ w 2048-bitowej liczbie (złożonej z setek bloków $1^{a_i} 0^{b_i}$) w tym samym czasie, gdy prawy brzeg przechodzi przez lokalne tunelowanie $b_1 = 1$, wewnątrz 2048-bitowego słowa dochodzi jednocześnie do dziesiątek zderzeń typu `R3_INTERNAL_VALLEY` (wewnętrzne dwójki `'2'` wypalają doliny zer na naprzemiennych segmentach), co stabilizuje gęstość globalną i przyspiesza spadek $V_{\theta}(n)$.
:::

::: lang en
# Research Log 05: Co-Evolutionary `BigInt` Counterexample Hunter (`128–2048` bits) vs Potential $V_{\theta}(n)$

- **Method:** `05-adversarial-bigint-coevolution`
- **Compute Engine:** `rust-verifier/src/bigint_lab.rs` (`run_method5_adversarial_bigint_hunter`)

---

## 1. Experimental Goal: Stress-Testing on Giant `BigInt` Integers ($128 \dots 2048$ bits)

When investigating the Collatz Conjecture, standard 64-bit integers are insufficient because trajectories can repeatedly exceed $2^{64}$, and multi-block carry cascades across long chains like `11101110111...` only manifest at hundreds or thousands of bits.

We implemented a native `BigBits` engine in Rust (an array of 64-bit machine words with full `u128` carry propagation and hardware trailing-zero stripping $\nu_2$) and ran an evolutionary hunter for the hardest bit configurations across five scales:
- **$128$ bits** ($\sim 3.4 \times 10^{38}$),
- **$256$ bits** ($\sim 1.1 \times 10^{77}$),
- **$512$ bits** ($\sim 1.3 \times 10^{154}$),
- **$1024$ bits** ($\sim 1.8 \times 10^{308}$ — `Float64` limit),
- **$2048$ bits** ($\sim 3.2 \times 10^{616}$ — RSA-2048 key scale!).

---

## 2. Results for the Hardest Evolved `BigInt` Chromosomes (Tunneling Motifs `11101110...`)

| `BigInt` Bit-Width | Odd Steps | Even Steps ($\nu_2$ Zeros) | Total Steps | Delay Factor $\gamma(n) = \frac{\text{steps}}{\log_2 n}$ | Potential Drop Window $\Delta V_{\theta} < 0$ | Collapsed to `1[000...]`? |
| :---: | ---: | ---: | ---: | ---: | :---: | :---: |
| **$128$ bits** | $407$ | $773$ | $1,180$ | **$9.24$** | $2\text{ steps}$ | **YES (`100%`)** |
| **$256$ bits** | $927$ | $1,725$ | $2,652$ | **$10.38$** | $2\text{ steps}$ | **YES (`100%`)** |
| **$512$ bits** | $1,516$ | $2,915$ | $4,431$ | **$8.65$** | **$1\text{ step}$** | **YES (`100%`)** |
| **$1024$ bits** | $2,508$ | $4,999$ | $7,507$ | **$7.33$** | **$1\text{ step}$** | **YES (`100%`)** |
| **$2048$ bits** | **$5,192$** | **$10,277$** | **$15,469$** | **$7.55$** | **$1\text{ step}$** | **YES (`100%`)** |

---

## 3. Key Findings from the 2048-Bit `BigInt` Stress Tests

1. **Macro-Scale Self-Damping (`512–2048` bits):**
   Observe the trend in $\gamma(n)$ and the drop window $\Delta V_{\theta} < 0$:
   For smaller numbers ($128–256$ bits), a worst-case suffix can generate a delay factor of $\gamma(n) \approx 10.38$. However, for giant **$1024$ and $2048$-bit numbers**, the maximum delay factor drops toward $\gamma(n) \approx 7.33\text{–}7.55$ (approaching the law-of-large-numbers expectation $\frac{1 + 2}{2 - \log_2 3} \approx 7.228$), and our tunneling potential $V_{\theta}(n)$ decreases within **1–2 steps**!
2. **Why are large `BigInt` integers "easier" for $V_{\theta}(n)$ than small seeds like $n = 27$?**
   Because inside a 2048-bit word (composed of hundreds of $1^{a_i} 0^{b_i}$ blocks), at the exact same moment the right LSB edge undergoes local $b_1 = 1$ tunneling, dozens of internal `R3_INTERNAL_VALLEY` collisions occur simultaneously across the interior of the word (internal `'2'` collisions carving zero valleys across alternating segments), stabilizing global bit density and accelerating the drop of $V_{\theta}(n)$.
:::
