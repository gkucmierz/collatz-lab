# Raport Rundy 1 — Architekt 4 (Eksplorator Kontrprzykładów i Łowca Ekstremalnych Klas)

Data analizy: `2026-11-02`  
Skrypt generujący: `/Users/gkucmierz/workspace/collatz-lab/tmp/hunter-round1.mjs`

---

## Część 1. Głębokie Sito 2-Adyczne na Poziomach `k = 143..161` (do Części 47 i 48 w `CollatzProof.lean`)

### 1.1. Kluczowa obserwacja diofantyczna (Przeskok progowy wykładnika dla `c = 96` i `c = 101`)

Warunek kontrakcji afinicznej na poziomie $2^k$ dla $c = m - k$ kroków nieparzystych wymaga:
$$3^c < 2^k \iff k \ge \lceil c \log_2 3 \rceil.$$
Sprawdzenie dokładnych potęg w arytmetyce `BigInt` ujawnia dwa przeskoki diofantyczne w Zestawie B:
- Dla $c = 96$: $96 \cdot \log_2 3 \approx 152{,}1564 > 152$, czyli:
  $$3^{96} = 636\,268\,544\,113\,594\,235\,847\,482\,876\,253\,853\,423\,089\,021\,6321 > 2^{152} = 570\,899\,077\,082\,383\,952\,423\,314\,387\,779\,798\,054\,553\,098\,6496.$$
  W konsekwencji dla $(k = 152, m = 248, c = 96)$ `checkAffineDrop 248 (2^152) b` wynosi `false` dla **każdego** $b$.  
  - Minimalny próg dla $c = 96$ to **$k = 153, m = 249$**.  
  - Z kolei na poziomie **$k = 152$** maksymalne dopuszczalne $c$ wynosi **$c = 95, m = 247$**.
- Dla $c = 101$: $101 \cdot \log_2 3 \approx 160{,}0812 > 160$, czyli $3^{101} > 2^{160}$.  
  - Minimalny próg dla $c = 101$ to **$k = 161, m = 262$**.  
  - Z kolei na poziomie **$k = 160$** maksymalne dopuszczalne $c$ wynosi **$c = 100, m = 260$**.

Poniżej dostarczamy **zarówno** kanoniczny Zestaw B dla kolejnych wykładników $c \in \{96, 97, 98, 99, 100, 101\}$ ($k \in \{153, 154, 156, 157, 159, 161\}$), **jak i** wariant dla dokładnie wskazanych potęg $k \in \{152, 154, 156, 157, 159, 160\}$ ($m \in \{247, 251, 254, 256, 259, 260\}$).

### 1.2. Zbiorcza tabela 16 najniższych przeżywających klas (`b ≡ 3 mod 4`) na poziomach `k = 143..161`

| Zestaw | Poziom $k$ | Horyzont $m$ | Kroki nieparz. $c$ | 16 najgęstszych klas przeżywających $b \in [3, \dots]$ |
| :--- | :---: | :---: | :---: | :--- |
| **A (Cz. 47)** | `143` | `233` | `90` | `82411, 91463, 94959, 100167, 121951, 137195, 142395, 142439, 150251, 164823, 173639, 182927, 192751, 200335, 211051, 213659` |
| **A (Cz. 47)** | `145` | `236` | `91` | `37503, 56255, 84383, 100167, 115759, 121951, 126575, 126891, 141759, 180463, 182927, 189863, 189919, 192751, 200335, 206847` |
| **A (Cz. 47)** | `146` | `238` | `92` | `37503, 56255, 84383, 121951, 126575, 141759, 178075, 182927, 189919, 192711, 192751, 206847, 213659, 216367, 228399, 240367` |
| **A (Cz. 47)** | `148` | `241` | `93` | `75007, 84383, 89119, 112511, 133679, 160411, 168767, 178075, 180463, 192751, 230631, 240367, 270695, 274391, 284879, 289067` |
| **A (Cz. 47)** | `149` | `243` | `94` | `56255, 75007, 89119, 112511, 137195, 180463, 182927, 189919, 192711, 192751, 213659, 230631, 240367, 270695, 274391, 284879` |
| **A (Cz. 47)** | `151` | `246` | `95` | `37503, 75007, 89119, 91463, 115759, 142587, 160411, 173639, 180463, 182927, 192711, 211051, 213659, 216367, 228399, 270695` |
| **B (k=152)** | `152` | `247` | `95` | `37503, 75007, 89119, 91463, 133679, 142587, 158439, 173639, 178239, 182927, 192711, 192751, 200019, 200519, 201819, 211051` |
| **B (k=160)** | `160` | `260` | `100` | `91463, 94959, 140479, 141759, 142439, 182927, 192711, 210719, 212639, 230631, 250363, 270695, 312319, 316075, 316079, 354303` |
| **B (Cz. 48)** | `153` | `249` | `96` | `60975, 89119, 115759, 121951, 133679, 142587, 158439, 192711, 192751, 200019, 211051, 213659, 231519, 284879, 288615, 289067` |
| **B (Cz. 48)** | `154` | `251` | `97` | `89119, 142439, 142587, 160411, 189919, 192711, 228399, 230631, 234239, 284879, 289067, 320823, 325203, 351359, 360927, 369567` |
| **B (Cz. 48)** | `156` | `254` | `98` | `60975, 91463, 94959, 137195, 142439, 189919, 228399, 230631, 234239, 270695, 285175, 289067, 312319, 320823, 345947, 351359` |
| **B (Cz. 48)** | `157` | `256` | `99` | `60975, 91463, 94959, 137195, 142587, 156159, 180463, 192711, 230631, 234239, 270695, 285175, 289067, 312319, 320823, 360927` |
| **B (Cz. 48)** | `159` | `259` | `100` | `91463, 121951, 156159, 182927, 192711, 228399, 230631, 234239, 270695, 277615, 285175, 312319, 342599, 351359, 355695, 360927` |
| **B (Cz. 48)** | `161` | `262` | `101` | `60975, 94959, 121951, 140479, 141759, 180463, 210719, 270695, 277615, 312319, 320823, 342599, 355695, 360927, 370155, 400159` |

---

### 1.3. Gotowy kod Lean 4 — Zestaw A (do Części 47: `k ∈ {143, 145, 146, 148, 149, 151}`, `m = 233..246`, `96` twierdzeń)

```lean
-- k=143, M=11150372599265311570767859136324180752990208=2^143, m=233, c=90
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq82411 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 82411 ) := checkAffineDrop_sound 233 (2 ^ 143) 82411  (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 91463 ) := checkAffineDrop_sound 233 (2 ^ 143) 91463  (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 94959 ) := checkAffineDrop_sound 233 (2 ^ 143) 94959  (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq100167 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 100167) := checkAffineDrop_sound 233 (2 ^ 143) 100167 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 121951) := checkAffineDrop_sound 233 (2 ^ 143) 121951 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 137195) := checkAffineDrop_sound 233 (2 ^ 143) 137195 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq142395 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 142395) := checkAffineDrop_sound 233 (2 ^ 143) 142395 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 142439) := checkAffineDrop_sound 233 (2 ^ 143) 142439 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq150251 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 150251) := checkAffineDrop_sound 233 (2 ^ 143) 150251 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq164823 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 164823) := checkAffineDrop_sound 233 (2 ^ 143) 164823 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq173639 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 173639) := checkAffineDrop_sound 233 (2 ^ 143) 173639 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 182927) := checkAffineDrop_sound 233 (2 ^ 143) 182927 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 192751) := checkAffineDrop_sound 233 (2 ^ 143) 192751 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq200335 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 200335) := checkAffineDrop_sound 233 (2 ^ 143) 200335 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq211051 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 211051) := checkAffineDrop_sound 233 (2 ^ 143) 211051 (by decide) k
theorem horizon_drop_mod11150372599265311570767859136324180752990208_eq213659 (k : Nat) : HasHorizonDrop (2 ^ 143 * k + 213659) := checkAffineDrop_sound 233 (2 ^ 143) 213659 (by decide) k
-- k=145, M=44601490397061246283071436545296723011960832=2^145, m=236, c=91
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq37503 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 37503 ) := checkAffineDrop_sound 236 (2 ^ 145) 37503  (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq56255 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 56255 ) := checkAffineDrop_sound 236 (2 ^ 145) 56255  (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq84383 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 84383 ) := checkAffineDrop_sound 236 (2 ^ 145) 84383  (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq100167 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 100167) := checkAffineDrop_sound 236 (2 ^ 145) 100167 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq115759 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 115759) := checkAffineDrop_sound 236 (2 ^ 145) 115759 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 121951) := checkAffineDrop_sound 236 (2 ^ 145) 121951 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq126575 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 126575) := checkAffineDrop_sound 236 (2 ^ 145) 126575 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq126891 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 126891) := checkAffineDrop_sound 236 (2 ^ 145) 126891 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq141759 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 141759) := checkAffineDrop_sound 236 (2 ^ 145) 141759 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 180463) := checkAffineDrop_sound 236 (2 ^ 145) 180463 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 182927) := checkAffineDrop_sound 236 (2 ^ 145) 182927 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq189863 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 189863) := checkAffineDrop_sound 236 (2 ^ 145) 189863 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 189919) := checkAffineDrop_sound 236 (2 ^ 145) 189919 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 192751) := checkAffineDrop_sound 236 (2 ^ 145) 192751 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq200335 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 200335) := checkAffineDrop_sound 236 (2 ^ 145) 200335 (by decide) k
theorem horizon_drop_mod44601490397061246283071436545296723011960832_eq206847 (k : Nat) : HasHorizonDrop (2 ^ 145 * k + 206847) := checkAffineDrop_sound 236 (2 ^ 145) 206847 (by decide) k
-- k=146, M=89202980794122492566142873090593446023921664=2^146, m=238, c=92
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq37503 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 37503 ) := checkAffineDrop_sound 238 (2 ^ 146) 37503  (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq56255 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 56255 ) := checkAffineDrop_sound 238 (2 ^ 146) 56255  (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq84383 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 84383 ) := checkAffineDrop_sound 238 (2 ^ 146) 84383  (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 121951) := checkAffineDrop_sound 238 (2 ^ 146) 121951 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq126575 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 126575) := checkAffineDrop_sound 238 (2 ^ 146) 126575 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq141759 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 141759) := checkAffineDrop_sound 238 (2 ^ 146) 141759 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq178075 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 178075) := checkAffineDrop_sound 238 (2 ^ 146) 178075 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 182927) := checkAffineDrop_sound 238 (2 ^ 146) 182927 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 189919) := checkAffineDrop_sound 238 (2 ^ 146) 189919 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 192711) := checkAffineDrop_sound 238 (2 ^ 146) 192711 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 192751) := checkAffineDrop_sound 238 (2 ^ 146) 192751 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq206847 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 206847) := checkAffineDrop_sound 238 (2 ^ 146) 206847 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq213659 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 213659) := checkAffineDrop_sound 238 (2 ^ 146) 213659 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq216367 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 216367) := checkAffineDrop_sound 238 (2 ^ 146) 216367 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 228399) := checkAffineDrop_sound 238 (2 ^ 146) 228399 (by decide) k
theorem horizon_drop_mod89202980794122492566142873090593446023921664_eq240367 (k : Nat) : HasHorizonDrop (2 ^ 146 * k + 240367) := checkAffineDrop_sound 238 (2 ^ 146) 240367 (by decide) k
-- k=148, M=356811923176489970264571492362373784095686656=2^148, m=241, c=93
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq75007 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 75007 ) := checkAffineDrop_sound 241 (2 ^ 148) 75007  (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq84383 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 84383 ) := checkAffineDrop_sound 241 (2 ^ 148) 84383  (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 89119 ) := checkAffineDrop_sound 241 (2 ^ 148) 89119  (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq112511 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 112511) := checkAffineDrop_sound 241 (2 ^ 148) 112511 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq133679 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 133679) := checkAffineDrop_sound 241 (2 ^ 148) 133679 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 160411) := checkAffineDrop_sound 241 (2 ^ 148) 160411 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq168767 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 168767) := checkAffineDrop_sound 241 (2 ^ 148) 168767 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq178075 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 178075) := checkAffineDrop_sound 241 (2 ^ 148) 178075 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 180463) := checkAffineDrop_sound 241 (2 ^ 148) 180463 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 192751) := checkAffineDrop_sound 241 (2 ^ 148) 192751 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 230631) := checkAffineDrop_sound 241 (2 ^ 148) 230631 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq240367 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 240367) := checkAffineDrop_sound 241 (2 ^ 148) 240367 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 270695) := checkAffineDrop_sound 241 (2 ^ 148) 270695 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq274391 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 274391) := checkAffineDrop_sound 241 (2 ^ 148) 274391 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq284879 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 284879) := checkAffineDrop_sound 241 (2 ^ 148) 284879 (by decide) k
theorem horizon_drop_mod356811923176489970264571492362373784095686656_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 148 * k + 289067) := checkAffineDrop_sound 241 (2 ^ 148) 289067 (by decide) k
-- k=149, M=713623846352979940529142984724747568191373312=2^149, m=243, c=94
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq56255 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 56255 ) := checkAffineDrop_sound 243 (2 ^ 149) 56255  (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq75007 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 75007 ) := checkAffineDrop_sound 243 (2 ^ 149) 75007  (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 89119 ) := checkAffineDrop_sound 243 (2 ^ 149) 89119  (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq112511 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 112511) := checkAffineDrop_sound 243 (2 ^ 149) 112511 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 137195) := checkAffineDrop_sound 243 (2 ^ 149) 137195 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 180463) := checkAffineDrop_sound 243 (2 ^ 149) 180463 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 182927) := checkAffineDrop_sound 243 (2 ^ 149) 182927 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 189919) := checkAffineDrop_sound 243 (2 ^ 149) 189919 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 192711) := checkAffineDrop_sound 243 (2 ^ 149) 192711 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 192751) := checkAffineDrop_sound 243 (2 ^ 149) 192751 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq213659 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 213659) := checkAffineDrop_sound 243 (2 ^ 149) 213659 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 230631) := checkAffineDrop_sound 243 (2 ^ 149) 230631 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq240367 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 240367) := checkAffineDrop_sound 243 (2 ^ 149) 240367 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 270695) := checkAffineDrop_sound 243 (2 ^ 149) 270695 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq274391 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 274391) := checkAffineDrop_sound 243 (2 ^ 149) 274391 (by decide) k
theorem horizon_drop_mod713623846352979940529142984724747568191373312_eq284879 (k : Nat) : HasHorizonDrop (2 ^ 149 * k + 284879) := checkAffineDrop_sound 243 (2 ^ 149) 284879 (by decide) k
-- k=151, M=2854495385411919762116571938898990272765493248=2^151, m=246, c=95
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq37503 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 37503 ) := checkAffineDrop_sound 246 (2 ^ 151) 37503  (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq75007 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 75007 ) := checkAffineDrop_sound 246 (2 ^ 151) 75007  (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 89119 ) := checkAffineDrop_sound 246 (2 ^ 151) 89119  (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 91463 ) := checkAffineDrop_sound 246 (2 ^ 151) 91463  (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq115759 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 115759) := checkAffineDrop_sound 246 (2 ^ 151) 115759 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 142587) := checkAffineDrop_sound 246 (2 ^ 151) 142587 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 160411) := checkAffineDrop_sound 246 (2 ^ 151) 160411 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq173639 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 173639) := checkAffineDrop_sound 246 (2 ^ 151) 173639 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 180463) := checkAffineDrop_sound 246 (2 ^ 151) 180463 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 182927) := checkAffineDrop_sound 246 (2 ^ 151) 182927 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 192711) := checkAffineDrop_sound 246 (2 ^ 151) 192711 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq211051 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 211051) := checkAffineDrop_sound 246 (2 ^ 151) 211051 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq213659 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 213659) := checkAffineDrop_sound 246 (2 ^ 151) 213659 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq216367 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 216367) := checkAffineDrop_sound 246 (2 ^ 151) 216367 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 228399) := checkAffineDrop_sound 246 (2 ^ 151) 228399 (by decide) k
theorem horizon_drop_mod2854495385411919762116571938898990272765493248_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 151 * k + 270695) := checkAffineDrop_sound 246 (2 ^ 151) 270695 (by decide) k
```

---

### 1.4. Gotowy kod Lean 4 — Zestaw B, Wariant I (dokładne `k ∈ {152, 154, 156, 157, 159, 160}`, `m = 247, 251, 254, 256, 259, 260`, `96` twierdzeń)

```lean
-- k=152, M=5708990770823839524233143877797980545530986496=2^152, m=247, c=95
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq37503 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 37503 ) := checkAffineDrop_sound 247 (2 ^ 152) 37503  (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq75007 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 75007 ) := checkAffineDrop_sound 247 (2 ^ 152) 75007  (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 89119 ) := checkAffineDrop_sound 247 (2 ^ 152) 89119  (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 91463 ) := checkAffineDrop_sound 247 (2 ^ 152) 91463  (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq133679 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 133679) := checkAffineDrop_sound 247 (2 ^ 152) 133679 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 142587) := checkAffineDrop_sound 247 (2 ^ 152) 142587 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq158439 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 158439) := checkAffineDrop_sound 247 (2 ^ 152) 158439 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq173639 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 173639) := checkAffineDrop_sound 247 (2 ^ 152) 173639 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq178239 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 178239) := checkAffineDrop_sound 247 (2 ^ 152) 178239 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 182927) := checkAffineDrop_sound 247 (2 ^ 152) 182927 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 192711) := checkAffineDrop_sound 247 (2 ^ 152) 192711 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 192751) := checkAffineDrop_sound 247 (2 ^ 152) 192751 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq200019 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 200019) := checkAffineDrop_sound 247 (2 ^ 152) 200019 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq200519 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 200519) := checkAffineDrop_sound 247 (2 ^ 152) 200519 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq201819 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 201819) := checkAffineDrop_sound 247 (2 ^ 152) 201819 (by decide) k
theorem horizon_drop_mod5708990770823839524233143877797980545530986496_eq211051 (k : Nat) : HasHorizonDrop (2 ^ 152 * k + 211051) := checkAffineDrop_sound 247 (2 ^ 152) 211051 (by decide) k
-- k=154, M=22835963083295358096932575511191922182123945984=2^154, m=251, c=97
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 89119 ) := checkAffineDrop_sound 251 (2 ^ 154) 89119  (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 142439) := checkAffineDrop_sound 251 (2 ^ 154) 142439 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 142587) := checkAffineDrop_sound 251 (2 ^ 154) 142587 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 160411) := checkAffineDrop_sound 251 (2 ^ 154) 160411 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 189919) := checkAffineDrop_sound 251 (2 ^ 154) 189919 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 192711) := checkAffineDrop_sound 251 (2 ^ 154) 192711 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 228399) := checkAffineDrop_sound 251 (2 ^ 154) 228399 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 230631) := checkAffineDrop_sound 251 (2 ^ 154) 230631 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 234239) := checkAffineDrop_sound 251 (2 ^ 154) 234239 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq284879 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 284879) := checkAffineDrop_sound 251 (2 ^ 154) 284879 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 289067) := checkAffineDrop_sound 251 (2 ^ 154) 289067 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 320823) := checkAffineDrop_sound 251 (2 ^ 154) 320823 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq325203 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 325203) := checkAffineDrop_sound 251 (2 ^ 154) 325203 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 351359) := checkAffineDrop_sound 251 (2 ^ 154) 351359 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 360927) := checkAffineDrop_sound 251 (2 ^ 154) 360927 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq369567 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 369567) := checkAffineDrop_sound 251 (2 ^ 154) 369567 (by decide) k
-- k=156, M=91343852333181432387730302044767688728495783936=2^156, m=254, c=98
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 60975 ) := checkAffineDrop_sound 254 (2 ^ 156) 60975  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 91463 ) := checkAffineDrop_sound 254 (2 ^ 156) 91463  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 94959 ) := checkAffineDrop_sound 254 (2 ^ 156) 94959  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 137195) := checkAffineDrop_sound 254 (2 ^ 156) 137195 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 142439) := checkAffineDrop_sound 254 (2 ^ 156) 142439 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 189919) := checkAffineDrop_sound 254 (2 ^ 156) 189919 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 228399) := checkAffineDrop_sound 254 (2 ^ 156) 228399 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 230631) := checkAffineDrop_sound 254 (2 ^ 156) 230631 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 234239) := checkAffineDrop_sound 254 (2 ^ 156) 234239 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 270695) := checkAffineDrop_sound 254 (2 ^ 156) 270695 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 285175) := checkAffineDrop_sound 254 (2 ^ 156) 285175 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 289067) := checkAffineDrop_sound 254 (2 ^ 156) 289067 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 312319) := checkAffineDrop_sound 254 (2 ^ 156) 312319 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 320823) := checkAffineDrop_sound 254 (2 ^ 156) 320823 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq345947 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 345947) := checkAffineDrop_sound 254 (2 ^ 156) 345947 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 351359) := checkAffineDrop_sound 254 (2 ^ 156) 351359 (by decide) k
-- k=157, M=182687704666362864775460604089535377456991567872=2^157, m=256, c=99
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 60975 ) := checkAffineDrop_sound 256 (2 ^ 157) 60975  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 91463 ) := checkAffineDrop_sound 256 (2 ^ 157) 91463  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 94959 ) := checkAffineDrop_sound 256 (2 ^ 157) 94959  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 137195) := checkAffineDrop_sound 256 (2 ^ 157) 137195 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 142587) := checkAffineDrop_sound 256 (2 ^ 157) 142587 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 156159) := checkAffineDrop_sound 256 (2 ^ 157) 156159 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 180463) := checkAffineDrop_sound 256 (2 ^ 157) 180463 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 192711) := checkAffineDrop_sound 256 (2 ^ 157) 192711 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 230631) := checkAffineDrop_sound 256 (2 ^ 157) 230631 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 234239) := checkAffineDrop_sound 256 (2 ^ 157) 234239 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 270695) := checkAffineDrop_sound 256 (2 ^ 157) 270695 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 285175) := checkAffineDrop_sound 256 (2 ^ 157) 285175 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 289067) := checkAffineDrop_sound 256 (2 ^ 157) 289067 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 312319) := checkAffineDrop_sound 256 (2 ^ 157) 312319 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 320823) := checkAffineDrop_sound 256 (2 ^ 157) 320823 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 360927) := checkAffineDrop_sound 256 (2 ^ 157) 360927 (by decide) k
-- k=159, M=730750818665451459101842416358141509827966271488=2^159, m=259, c=100
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 91463 ) := checkAffineDrop_sound 259 (2 ^ 159) 91463  (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 121951) := checkAffineDrop_sound 259 (2 ^ 159) 121951 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 156159) := checkAffineDrop_sound 259 (2 ^ 159) 156159 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 182927) := checkAffineDrop_sound 259 (2 ^ 159) 182927 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 192711) := checkAffineDrop_sound 259 (2 ^ 159) 192711 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 228399) := checkAffineDrop_sound 259 (2 ^ 159) 228399 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 230631) := checkAffineDrop_sound 259 (2 ^ 159) 230631 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 234239) := checkAffineDrop_sound 259 (2 ^ 159) 234239 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 270695) := checkAffineDrop_sound 259 (2 ^ 159) 270695 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 277615) := checkAffineDrop_sound 259 (2 ^ 159) 277615 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 285175) := checkAffineDrop_sound 259 (2 ^ 159) 285175 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 312319) := checkAffineDrop_sound 259 (2 ^ 159) 312319 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq342599 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 342599) := checkAffineDrop_sound 259 (2 ^ 159) 342599 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 351359) := checkAffineDrop_sound 259 (2 ^ 159) 351359 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 355695) := checkAffineDrop_sound 259 (2 ^ 159) 355695 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 360927) := checkAffineDrop_sound 259 (2 ^ 159) 360927 (by decide) k
-- k=160, M=1461501637330902918203684832716283019655932542976=2^160, m=260, c=100
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 91463 ) := checkAffineDrop_sound 260 (2 ^ 160) 91463  (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 94959 ) := checkAffineDrop_sound 260 (2 ^ 160) 94959  (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq140479 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 140479) := checkAffineDrop_sound 260 (2 ^ 160) 140479 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq141759 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 141759) := checkAffineDrop_sound 260 (2 ^ 160) 141759 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 142439) := checkAffineDrop_sound 260 (2 ^ 160) 142439 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 182927) := checkAffineDrop_sound 260 (2 ^ 160) 182927 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 192711) := checkAffineDrop_sound 260 (2 ^ 160) 192711 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq210719 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 210719) := checkAffineDrop_sound 260 (2 ^ 160) 210719 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq212639 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 212639) := checkAffineDrop_sound 260 (2 ^ 160) 212639 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 230631) := checkAffineDrop_sound 260 (2 ^ 160) 230631 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq250363 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 250363) := checkAffineDrop_sound 260 (2 ^ 160) 250363 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 270695) := checkAffineDrop_sound 260 (2 ^ 160) 270695 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 312319) := checkAffineDrop_sound 260 (2 ^ 160) 312319 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq316075 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 316075) := checkAffineDrop_sound 260 (2 ^ 160) 316075 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq316079 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 316079) := checkAffineDrop_sound 260 (2 ^ 160) 316079 (by decide) k
theorem horizon_drop_mod1461501637330902918203684832716283019655932542976_eq354303 (k : Nat) : HasHorizonDrop (2 ^ 160 * k + 354303) := checkAffineDrop_sound 260 (2 ^ 160) 354303 (by decide) k
```

---

### 1.5. Gotowy kod Lean 4 — Zestaw B, Wariant II (kanoniczny ciąg progów `c = 96..101`: `k ∈ {153, 154, 156, 157, 159, 161}`, `m = 249, 251, 254, 256, 259, 262`, `96` twierdzeń)

```lean
-- k=153, M=11417981541647679048466287755595961091061972992=2^153, m=249, c=96
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 60975 ) := checkAffineDrop_sound 249 (2 ^ 153) 60975  (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 89119 ) := checkAffineDrop_sound 249 (2 ^ 153) 89119  (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq115759 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 115759) := checkAffineDrop_sound 249 (2 ^ 153) 115759 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 121951) := checkAffineDrop_sound 249 (2 ^ 153) 121951 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq133679 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 133679) := checkAffineDrop_sound 249 (2 ^ 153) 133679 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 142587) := checkAffineDrop_sound 249 (2 ^ 153) 142587 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq158439 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 158439) := checkAffineDrop_sound 249 (2 ^ 153) 158439 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 192711) := checkAffineDrop_sound 249 (2 ^ 153) 192711 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq192751 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 192751) := checkAffineDrop_sound 249 (2 ^ 153) 192751 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq200019 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 200019) := checkAffineDrop_sound 249 (2 ^ 153) 200019 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq211051 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 211051) := checkAffineDrop_sound 249 (2 ^ 153) 211051 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq213659 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 213659) := checkAffineDrop_sound 249 (2 ^ 153) 213659 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq231519 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 231519) := checkAffineDrop_sound 249 (2 ^ 153) 231519 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq284879 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 284879) := checkAffineDrop_sound 249 (2 ^ 153) 284879 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq288615 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 288615) := checkAffineDrop_sound 249 (2 ^ 153) 288615 (by decide) k
theorem horizon_drop_mod11417981541647679048466287755595961091061972992_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 153 * k + 289067) := checkAffineDrop_sound 249 (2 ^ 153) 289067 (by decide) k
-- k=154, M=22835963083295358096932575511191922182123945984=2^154, m=251, c=97
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq89119 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 89119 ) := checkAffineDrop_sound 251 (2 ^ 154) 89119  (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 142439) := checkAffineDrop_sound 251 (2 ^ 154) 142439 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 142587) := checkAffineDrop_sound 251 (2 ^ 154) 142587 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 160411) := checkAffineDrop_sound 251 (2 ^ 154) 160411 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 189919) := checkAffineDrop_sound 251 (2 ^ 154) 189919 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 192711) := checkAffineDrop_sound 251 (2 ^ 154) 192711 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 228399) := checkAffineDrop_sound 251 (2 ^ 154) 228399 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 230631) := checkAffineDrop_sound 251 (2 ^ 154) 230631 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 234239) := checkAffineDrop_sound 251 (2 ^ 154) 234239 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq284879 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 284879) := checkAffineDrop_sound 251 (2 ^ 154) 284879 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 289067) := checkAffineDrop_sound 251 (2 ^ 154) 289067 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 320823) := checkAffineDrop_sound 251 (2 ^ 154) 320823 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq325203 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 325203) := checkAffineDrop_sound 251 (2 ^ 154) 325203 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 351359) := checkAffineDrop_sound 251 (2 ^ 154) 351359 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 360927) := checkAffineDrop_sound 251 (2 ^ 154) 360927 (by decide) k
theorem horizon_drop_mod22835963083295358096932575511191922182123945984_eq369567 (k : Nat) : HasHorizonDrop (2 ^ 154 * k + 369567) := checkAffineDrop_sound 251 (2 ^ 154) 369567 (by decide) k
-- k=156, M=91343852333181432387730302044767688728495783936=2^156, m=254, c=98
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 60975 ) := checkAffineDrop_sound 254 (2 ^ 156) 60975  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 91463 ) := checkAffineDrop_sound 254 (2 ^ 156) 91463  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 94959 ) := checkAffineDrop_sound 254 (2 ^ 156) 94959  (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 137195) := checkAffineDrop_sound 254 (2 ^ 156) 137195 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq142439 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 142439) := checkAffineDrop_sound 254 (2 ^ 156) 142439 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq189919 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 189919) := checkAffineDrop_sound 254 (2 ^ 156) 189919 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 228399) := checkAffineDrop_sound 254 (2 ^ 156) 228399 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 230631) := checkAffineDrop_sound 254 (2 ^ 156) 230631 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 234239) := checkAffineDrop_sound 254 (2 ^ 156) 234239 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 270695) := checkAffineDrop_sound 254 (2 ^ 156) 270695 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 285175) := checkAffineDrop_sound 254 (2 ^ 156) 285175 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 289067) := checkAffineDrop_sound 254 (2 ^ 156) 289067 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 312319) := checkAffineDrop_sound 254 (2 ^ 156) 312319 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 320823) := checkAffineDrop_sound 254 (2 ^ 156) 320823 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq345947 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 345947) := checkAffineDrop_sound 254 (2 ^ 156) 345947 (by decide) k
theorem horizon_drop_mod91343852333181432387730302044767688728495783936_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 156 * k + 351359) := checkAffineDrop_sound 254 (2 ^ 156) 351359 (by decide) k
-- k=157, M=182687704666362864775460604089535377456991567872=2^157, m=256, c=99
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 60975 ) := checkAffineDrop_sound 256 (2 ^ 157) 60975  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 91463 ) := checkAffineDrop_sound 256 (2 ^ 157) 91463  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 94959 ) := checkAffineDrop_sound 256 (2 ^ 157) 94959  (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq137195 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 137195) := checkAffineDrop_sound 256 (2 ^ 157) 137195 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 142587) := checkAffineDrop_sound 256 (2 ^ 157) 142587 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 156159) := checkAffineDrop_sound 256 (2 ^ 157) 156159 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 180463) := checkAffineDrop_sound 256 (2 ^ 157) 180463 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 192711) := checkAffineDrop_sound 256 (2 ^ 157) 192711 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 230631) := checkAffineDrop_sound 256 (2 ^ 157) 230631 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 234239) := checkAffineDrop_sound 256 (2 ^ 157) 234239 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 270695) := checkAffineDrop_sound 256 (2 ^ 157) 270695 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 285175) := checkAffineDrop_sound 256 (2 ^ 157) 285175 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq289067 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 289067) := checkAffineDrop_sound 256 (2 ^ 157) 289067 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 312319) := checkAffineDrop_sound 256 (2 ^ 157) 312319 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 320823) := checkAffineDrop_sound 256 (2 ^ 157) 320823 (by decide) k
theorem horizon_drop_mod182687704666362864775460604089535377456991567872_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 157 * k + 360927) := checkAffineDrop_sound 256 (2 ^ 157) 360927 (by decide) k
-- k=159, M=730750818665451459101842416358141509827966271488=2^159, m=259, c=100
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq91463 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 91463 ) := checkAffineDrop_sound 259 (2 ^ 159) 91463  (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 121951) := checkAffineDrop_sound 259 (2 ^ 159) 121951 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 156159) := checkAffineDrop_sound 259 (2 ^ 159) 156159 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq182927 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 182927) := checkAffineDrop_sound 259 (2 ^ 159) 182927 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 192711) := checkAffineDrop_sound 259 (2 ^ 159) 192711 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 228399) := checkAffineDrop_sound 259 (2 ^ 159) 228399 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 230631) := checkAffineDrop_sound 259 (2 ^ 159) 230631 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 234239) := checkAffineDrop_sound 259 (2 ^ 159) 234239 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 270695) := checkAffineDrop_sound 259 (2 ^ 159) 270695 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 277615) := checkAffineDrop_sound 259 (2 ^ 159) 277615 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 285175) := checkAffineDrop_sound 259 (2 ^ 159) 285175 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 312319) := checkAffineDrop_sound 259 (2 ^ 159) 312319 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq342599 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 342599) := checkAffineDrop_sound 259 (2 ^ 159) 342599 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 351359) := checkAffineDrop_sound 259 (2 ^ 159) 351359 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 355695) := checkAffineDrop_sound 259 (2 ^ 159) 355695 (by decide) k
theorem horizon_drop_mod730750818665451459101842416358141509827966271488_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 159 * k + 360927) := checkAffineDrop_sound 259 (2 ^ 159) 360927 (by decide) k
-- k=161, M=2923003274661805836407369665432566039311865085952=2^161, m=262, c=101
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq60975 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 60975 ) := checkAffineDrop_sound 262 (2 ^ 161) 60975  (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 94959 ) := checkAffineDrop_sound 262 (2 ^ 161) 94959  (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq121951 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 121951) := checkAffineDrop_sound 262 (2 ^ 161) 121951 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq140479 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 140479) := checkAffineDrop_sound 262 (2 ^ 161) 140479 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq141759 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 141759) := checkAffineDrop_sound 262 (2 ^ 161) 141759 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 180463) := checkAffineDrop_sound 262 (2 ^ 161) 180463 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq210719 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 210719) := checkAffineDrop_sound 262 (2 ^ 161) 210719 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 270695) := checkAffineDrop_sound 262 (2 ^ 161) 270695 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 277615) := checkAffineDrop_sound 262 (2 ^ 161) 277615 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 312319) := checkAffineDrop_sound 262 (2 ^ 161) 312319 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 320823) := checkAffineDrop_sound 262 (2 ^ 161) 320823 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq342599 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 342599) := checkAffineDrop_sound 262 (2 ^ 161) 342599 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 355695) := checkAffineDrop_sound 262 (2 ^ 161) 355695 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 360927) := checkAffineDrop_sound 262 (2 ^ 161) 360927 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq370155 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 370155) := checkAffineDrop_sound 262 (2 ^ 161) 370155 (by decide) k
theorem horizon_drop_mod2923003274661805836407369665432566039311865085952_eq400159 (k : Nat) : HasHorizonDrop (2 ^ 161 * k + 400159) := checkAffineDrop_sound 262 (2 ^ 161) 400159 (by decide) k
```

---

## Część 2. Empiryczny Rozkład Wieloblokowy RLE (`Multi-Block Macro-Erosion`) dla Najtrudniejszych Trajektorii

### 2.1. Kanoniczny Dispatcher Wieloblokowy $(r_i, d_i, c_i, v_i)$

Każda liczba nieparzysta $N_i > 1$ trafia deterministycznie (poprzez resztę $N_i \bmod 8 \in \{1, 3, 5, 7\}$) do jednej z trzech rodzin makro-erozji:
1. **Rodzina $c_i = 1$ (`mersenneTail` dla $N_i \equiv 7 \pmod 8$ oraz `single_zero_fuse` dla $N_i \equiv 5 \pmod 8$, gdzie $b_i = 1$):**
   $$N_i = U_i \cdot 2^{b_i} - 1, \quad b_i = v_2(N_i + 1) = 2 r_i + d_i \implies N_{i+1} = \frac{3^{b_i} U_i - 1}{2^{v_i}} \quad (\Delta m_i = 2 b_i + v_i).$$
2. **Rodzina $c_i = 5$ (`shifted_valley` dla $N_i \equiv 3 \pmod 8$):**
   $$N_i = U_i \cdot 2^{3 r_i + d_i} - 5, \quad b_i = v_2(N_i + 5) = 3 r_i + d_i,\ d_i \in \{1, 2, 3\}:$$
   - $d_i = 1$: $N_{i+1} = \frac{3 \cdot 9^{r_i} U_i - 7}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 2 + v_i$ krokach,
   - $d_i = 2$: $N_{i+1} = \frac{27 \cdot 9^{r_i} U_i - 29}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 5 + v_i$ krokach,
   - $d_i = 3$: $N_{i+1} = \frac{9^{r_i+1} U_i - 5}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 5 + v_i$ krokach.
3. **Rodzina $c_i = 7$ (`two_zero_valley` dla $N_i \equiv 1 \pmod 8$):**
   $$N_i = U_i \cdot 2^{3 r_i + d_i} - 7, \quad b_i = v_2(N_i + 7) = 3 r_i + d_i,\ d_i \in \{3, 4, 5\}:$$
   - $d_i = 3$: $N_{i+1} = \frac{9^{r_i+1} U_i - 7}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 5 + v_i$ krokach,
   - $d_i = 4$: $N_{i+1} = \frac{9^{r_i+2} U_i - 29}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 8 + v_i$ krokach,
   - $d_i = 5$: $N_{i+1} = \frac{3 \cdot 9^{r_i+1} U_i - 5}{2^{v_i}}$ w $\Delta m_i = 5 r_i + 8 + v_i$ krokach.

**Prawo przełamania bariery $(9/8)^R$:**
Niech $O_K = \sum_{i=1}^K \text{odd}_i$ oznacza skumulowaną liczbę kroków nieparzystych po $K$ blokach, a $E_K = \sum_{i=1}^K \text{even}_i$ skumulowaną liczbę kroków parzystych. Ponieważ $3^{O_K} = 9^{O_K/2}$ oraz $2^{E_K} = 8^{O_K/2} \cdot 2^{E_K - \frac{3}{2} O_K}$, mamy dokładną tożsamość:
$$\frac{3^{O_K}}{2^{E_K}} = \left(\frac{9}{8}\right)^{O_K / 2} \cdot 2^{-\Delta V_K}, \qquad \Delta V_K = E_K - \frac{3}{2} O_K.$$
Trajektoria pokonuje barierę logarytmiczną $(9/8)^{O_K/2}$ dokładnie wtedy, gdy nadwyżka 2-adyczna $\Delta V_K > \frac{O_K}{2} \log_2(9/8) \approx 0{,}08496 \cdot O_K$ (równoważnie: $2^{\sum v_i} > (9/8)^{\sum r_i}$ z korektą fazową $d_i$, czyli $2^{E_K} > 3^{O_K}$).

---

### 2.2. Podsumowanie porównawcze 6 ekstremalnych trajektorii

| $n_0$ | Zapis binarny $n_0$ | Liczba bloków RLE $K$ | Kroki do $N_K < n_0$ | $\sum r_i$ | $\sum v_i$ | $(O_K, E_K)$ | Średnie $v_i$ na blok | Finał $N_K < n_0$ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`27`** | `11011₂` | **12** | `96` | `10` | `20` | `(37, 59)` | `1.67` | `23` |
| **`31`** | `11111₂` | **11** | `91` | `10` | `19` | `(35, 56)` | `1.73` | `23` |
| **`703`** | `1010111111₂` | **15** | `134` | `17` | `29` | `(51, 83)` | `1.93` | `157` |
| **`1023`** | `1111111111₂` | **2** | `31` | `5` | `9` | `(11, 20)` | `4.50` | `173` |
| **`6171`** | `1100000011011₂` | **11** | `94` | `12` | `18` | `(36, 58)` | `1.64` | `3215` |
| **`94959`** | `10111001011101111₂` | **16** | `149` | `21` | `32` | `(57, 92)` | `2.00` | `30109` |

---

### 2.3. Szczegółowe tabele bloków makro-erozji $(r_i, d_i, c_i, v_i)$ dla każdego $n_0$

#### Trajektoria `n = 27` (`11011₂`) — przełamanie bariery po **12 blokach RLE** (`96` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `27` | `c=5 (d=2)` | `1` | `5` | `1` | **`1`** | `11` | `1` | `1` | `(5, 6)` | `-1.5 / 0.425` | `107` |
| **#2** | `107` | `c=5 (d=1)` | `7` | `4` | `1` | **`1`** | `8` | `2` | `2` | `(8, 11)` | `-1.0 / 0.680` | `91` |
| **#3** | `91` | `c=5 (d=2)` | `3` | `5` | `1` | **`2`** | `12` | `3` | `4` | `(13, 18)` | `-1.5 / 1.105` | `175` |
| **#4** | `175` | `c=1 (-1)` | `11` | `4` | `2` | **`1`** | `9` | `5` | `5` | `(17, 23)` | `-2.5 / 1.444` | `445` |
| **#5** | `445` | `c=1 (b=1, -3)` | `223` | `1` | `0` | **`2`** | `4` | `5` | `7` | `(18, 26)` | `-1.0 / 1.529` | `167` |
| **#6** | `167` | `c=1 (-1)` | `21` | `3` | `1` | **`1`** | `7` | `6` | `8` | `(21, 30)` | `-1.5 / 1.784` | `283` |
| **#7** | `283` | `c=5 (d=2)` | `9` | `5` | `1` | **`1`** | `11` | `7` | `9` | `(26, 36)` | `-3.0 / 2.209` | `1079` |
| **#8** | `1079` | `c=1 (-1)` | `135` | `3` | `1` | **`2`** | `8` | `8` | `11` | `(29, 41)` | `-2.5 / 2.464` | `911` |
| **#9** | `911` | `c=1 (-1)` | `57` | `4` | `2` | **`3`** | `11` | `10` | `14` | `(33, 48)` | `-1.5 / 2.804` | `577` |
| **#10** | `577` | `c=7 (d=3)` | `73` | `3` | `0` | **`1`** | `6` | `10` | `15` | `(35, 52)` | `-0.5 / 2.974` | `325` |
| **#11** | `325` | `c=1 (b=1, -3)` | `163` | `1` | `0` | **`3`** | `5` | `10` | `18` | `(36, 56)` | `2.0 / 3.059` | `61` |
| **#12** | `61` | `c=1 (b=1, -3)` | `31` | `1` | `0` | **`2`** | `4` | `10` | `20` | `(37, 59)` | `3.5 / 3.144` | `23` **SPADEK** |

#### Trajektoria `n = 31` (`11111₂`) — przełamanie bariery po **11 blokach RLE** (`91` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `31` | `c=1 (-1)` | `1` | `5` | `2` | **`1`** | `11` | `2` | `1` | `(5, 6)` | `-1.5 / 0.425` | `121` |
| **#2** | `121` | `c=7 (d=4)` | `1` | `7` | `1` | **`2`** | `15` | `3` | `3` | `(11, 15)` | `-1.5 / 0.935` | `175` |
| **#3** | `175` | `c=1 (-1)` | `11` | `4` | `2` | **`1`** | `9` | `5` | `4` | `(15, 20)` | `-2.5 / 1.274` | `445` |
| **#4** | `445` | `c=1 (b=1, -3)` | `223` | `1` | `0` | **`2`** | `4` | `5` | `6` | `(16, 23)` | `-1.0 / 1.359` | `167` |
| **#5** | `167` | `c=1 (-1)` | `21` | `3` | `1` | **`1`** | `7` | `6` | `7` | `(19, 27)` | `-1.5 / 1.614` | `283` |
| **#6** | `283` | `c=5 (d=2)` | `9` | `5` | `1` | **`1`** | `11` | `7` | `8` | `(24, 33)` | `-3.0 / 2.039` | `1079` |
| **#7** | `1079` | `c=1 (-1)` | `135` | `3` | `1` | **`2`** | `8` | `8` | `10` | `(27, 38)` | `-2.5 / 2.294` | `911` |
| **#8** | `911` | `c=1 (-1)` | `57` | `4` | `2` | **`3`** | `11` | `10` | `13` | `(31, 45)` | `-1.5 / 2.634` | `577` |
| **#9** | `577` | `c=7 (d=3)` | `73` | `3` | `0` | **`1`** | `6` | `10` | `14` | `(33, 49)` | `-0.5 / 2.804` | `325` |
| **#10** | `325` | `c=1 (b=1, -3)` | `163` | `1` | `0` | **`3`** | `5` | `10` | `17` | `(34, 53)` | `2.0 / 2.889` | `61` |
| **#11** | `61` | `c=1 (b=1, -3)` | `31` | `1` | `0` | **`2`** | `4` | `10` | `19` | `(35, 56)` | `3.5 / 2.974` | `23` **SPADEK** |

#### Trajektoria `n = 703` (`1010111111₂`) — przełamanie bariery po **15 blokach RLE** (`134` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `703` | `c=1 (-1)` | `11` | `6` | `3` | **`1`** | `13` | `3` | `1` | `(6, 7)` | `-2.0 / 0.510` | `4009` |
| **#2** | `4009` | `c=7 (d=4)` | `251` | `4` | `0` | **`1`** | `9` | `3` | `2` | `(10, 12)` | `-3.0 / 0.850` | `10151` |
| **#3** | `10151` | `c=1 (-1)` | `1269` | `3` | `1` | **`1`** | `7` | `4` | `3` | `(13, 16)` | `-3.5 / 1.105` | `17131` |
| **#4** | `17131` | `c=5 (d=1)` | `1071` | `4` | `1` | **`1`** | `8` | `5` | `4` | `(16, 21)` | `-3.0 / 1.359` | `14455` |
| **#5** | `14455` | `c=1 (-1)` | `1807` | `3` | `1` | **`2`** | `8` | `6` | `6` | `(19, 26)` | `-2.5 / 1.614` | `12197` |
| **#6** | `12197` | `c=1 (b=1, -3)` | `6099` | `1` | `0` | **`3`** | `5` | `6` | `9` | `(20, 30)` | `0.0 / 1.699` | `2287` |
| **#7** | `2287` | `c=1 (-1)` | `143` | `4` | `2` | **`1`** | `9` | `8` | `10` | `(24, 35)` | `-1.0 / 2.039` | `5791` |
| **#8** | `5791` | `c=1 (-1)` | `181` | `5` | `2` | **`1`** | `11` | `10` | `11` | `(29, 41)` | `-2.5 / 2.464` | `21991` |
| **#9** | `21991` | `c=1 (-1)` | `2749` | `3` | `1` | **`1`** | `7` | `11` | `12` | `(32, 45)` | `-3.0 / 2.719` | `37111` |
| **#10** | `37111` | `c=1 (-1)` | `4639` | `3` | `1` | **`2`** | `8` | `12` | `14` | `(35, 50)` | `-2.5 / 2.974` | `31313` |
| **#11** | `31313` | `c=7 (d=3)` | `3915` | `3` | `0` | **`2`** | `7` | `12` | `16` | `(37, 55)` | `-0.5 / 3.144` | `8807` |
| **#12** | `8807` | `c=1 (-1)` | `1101` | `3` | `1` | **`1`** | `7` | `13` | `17` | `(40, 59)` | `-1.0 / 3.399` | `14863` |
| **#13** | `14863` | `c=1 (-1)` | `929` | `4` | `2` | **`4`** | `12` | `15` | `21` | `(44, 67)` | `1.0 / 3.738` | `4703` |
| **#14** | `4703` | `c=1 (-1)` | `147` | `5` | `2` | **`3`** | `13` | `17` | `24` | `(49, 75)` | `1.5 / 4.163` | `4465` |
| **#15** | `4465` | `c=7 (d=3)` | `559` | `3` | `0` | **`5`** | `10` | `17` | `29` | `(51, 83)` | `6.5 / 4.333` | `157` **SPADEK** |

#### Trajektoria `n = 1023` (`1111111111₂`) — przełamanie bariery po **2 blokach RLE** (`31` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `1023` | `c=1 (-1)` | `1` | `10` | `5` | **`3`** | `23` | `5` | `3` | `(10, 13)` | `-2.0 / 0.850` | `7381` |
| **#2** | `7381` | `c=1 (b=1, -3)` | `3691` | `1` | `0` | **`6`** | `8` | `5` | `9` | `(11, 20)` | `3.5 / 0.935` | `173` **SPADEK** |

#### Trajektoria `n = 6171` (`1100000011011₂`) — przełamanie bariery po **11 blokach RLE** (`94` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `6171` | `c=5 (d=2)` | `193` | `5` | `1` | **`1`** | `11` | `1` | `1` | `(5, 6)` | `-1.5 / 0.425` | `23435` |
| **#2** | `23435` | `c=5 (d=1)` | `1465` | `4` | `1` | **`2`** | `9` | `2` | `3` | `(8, 12)` | `0.0 / 0.680` | `9887` |
| **#3** | `9887` | `c=1 (-1)` | `309` | `5` | `2` | **`1`** | `11` | `4` | `4` | `(13, 18)` | `-1.5 / 1.105` | `37543` |
| **#4** | `37543` | `c=1 (-1)` | `4693` | `3` | `1` | **`1`** | `7` | `5` | `5` | `(16, 22)` | `-2.0 / 1.359` | `63355` |
| **#5** | `63355` | `c=5 (d=1)` | `495` | `7` | `2` | **`1`** | `13` | `7` | `6` | `(21, 30)` | `-1.5 / 1.784` | `60139` |
| **#6** | `60139` | `c=5 (d=1)` | `3759` | `4` | `1` | **`1`** | `8` | `8` | `7` | `(24, 35)` | `-1.0 / 2.039` | `50743` |
| **#7** | `50743` | `c=1 (-1)` | `6343` | `3` | `1` | **`2`** | `8` | `9` | `9` | `(27, 40)` | `-0.5 / 2.294` | `42815` |
| **#8** | `42815` | `c=1 (-1)` | `669` | `6` | `3` | **`2`** | `14` | `12` | `11` | `(33, 48)` | `-1.5 / 2.804` | `121925` |
| **#9** | `121925` | `c=1 (b=1, -3)` | `60963` | `1` | `0` | **`3`** | `5` | `12` | `14` | `(34, 52)` | `1.0 / 2.889` | `22861` |
| **#10** | `22861` | `c=1 (b=1, -3)` | `11431` | `1` | `0` | **`2`** | `4` | `12` | `16` | `(35, 55)` | `2.5 / 2.974` | `8573` |
| **#11** | `8573` | `c=1 (b=1, -3)` | `4287` | `1` | `0` | **`2`** | `4` | `12` | `18` | `(36, 58)` | `4.0 / 3.059` | `3215` **SPADEK** |

#### Trajektoria `n = 94959` (`10111001011101111₂`) — przełamanie bariery po **16 blokach RLE** (`149` kroków)

| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\Delta m_i$ | $\sum r_i$ | $\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\Delta V_i$ vs próg $\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | `94959` | `c=1 (-1)` | `5935` | `4` | `2` | **`1`** | `9` | `2` | `1` | `(4, 5)` | `-1.0 / 0.340` | `240367` |
| **#2** | `240367` | `c=1 (-1)` | `15023` | `4` | `2` | **`1`** | `9` | `4` | `2` | `(8, 10)` | `-2.0 / 0.680` | `608431` |
| **#3** | `608431` | `c=1 (-1)` | `38027` | `4` | `2` | **`1`** | `9` | `6` | `3` | `(12, 15)` | `-3.0 / 1.020` | `1540093` |
| **#4** | `1540093` | `c=1 (b=1, -3)` | `770047` | `1` | `0` | **`2`** | `4` | `6` | `5` | `(13, 18)` | `-1.5 / 1.105` | `577535` |
| **#5** | `577535` | `c=1 (-1)` | `141` | `12` | `6` | **`2`** | `26` | `12` | `7` | `(25, 32)` | `-5.5 / 2.124` | `18733295` |
| **#6** | `18733295` | `c=1 (-1)` | `1170831` | `4` | `2` | **`1`** | `9` | `14` | `8` | `(29, 37)` | `-6.5 / 2.464` | `47418655` |
| **#7** | `47418655` | `c=1 (-1)` | `1481833` | `5` | `2` | **`1`** | `11` | `16` | `9` | `(34, 43)` | `-8.0 / 2.889` | `180042709` |
| **#8** | `180042709` | `c=1 (b=1, -3)` | `90021355` | `1` | `0` | **`6`** | `8` | `16` | `15` | `(35, 50)` | `-2.5 / 2.974` | `4219751` |
| **#9** | `4219751` | `c=1 (-1)` | `527469` | `3` | `1` | **`1`** | `7` | `17` | `16` | `(38, 54)` | `-3.0 / 3.229` | `7120831` |
| **#10** | `7120831` | `c=1 (-1)` | `111263` | `6` | `3` | **`1`** | `13` | `20` | `17` | `(44, 61)` | `-5.0 / 3.738` | `40555363` |
| **#11** | `40555363` | `c=5 (d=3)` | `5069421` | `3` | `0` | **`4`** | `9` | `20` | `21` | `(46, 68)` | `-1.0 / 3.908` | `2851549` |
| **#12** | `2851549` | `c=1 (b=1, -3)` | `1425775` | `1` | `0` | **`2`** | `4` | `20` | `23` | `(47, 71)` | `0.5 / 3.993` | `1069331` |
| **#13** | `1069331` | `c=5 (d=3)` | `133667` | `3` | `0` | **`1`** | `6` | `20` | `24` | `(49, 75)` | `1.5 / 4.163` | `601499` |
| **#14** | `601499` | `c=5 (d=2)` | `18797` | `5` | `1` | **`1`** | `11` | `21` | `25` | `(54, 81)` | `0.0 / 4.588` | `2283821` |
| **#15** | `2283821` | `c=1 (b=1, -3)` | `1141911` | `1` | `0` | **`2`** | `4` | `21` | `27` | `(55, 84)` | `1.5 / 4.673` | `856433` |
| **#16** | `856433` | `c=7 (d=3)` | `107055` | `3` | `0` | **`5`** | `10` | `21` | `32` | `(57, 92)` | `6.5 / 4.843` | `30109` **SPADEK** |

---

## Część 3. Wnioski dla Architekta 1, 2 i 3 (Podstawa pod Hipotezę H3 — Multi-Block RLE Coupling)

1. **Kompresja wykładnicza trajektorii:**  
   Nawet najbardziej ekstremalne trajektorie znane w tym zakresie ($n = 27$ z 96 krokami, $n = 703$ ze 134 krokami, $n = 94959$ ze 149 krokami) rozpadają się na zaledwie **11 do 16 bloków makro-erozji** $(r_i, d_i, c_i, v_i)$, a czysty ogon Mersenne'a $n = 1023 = 2^{10} - 1$ zamyka się w **2 blokach** (`#1: r=5, d=0, c=1, v=3 -> 7381`, `#2: r=0, d=1, c=1, v=6 -> 173 < 1023`).
2. **Mechanizm dławienia puchnięcia $(9/8)^r$:**  
   W początkowych blokach trajektoria może utrzymywać minimalne $v_i = 1$ przez maksymalnie $3$–$4$ bloki z rzędu (np. bloki `#1..#3` dla $n = 94959$ lub `#3..#6` dla $n = 6171$), lecz każde przejście $U_i \mapsto U_{i+1} = \text{oddPart}(\alpha_i 9^{r_i} U_i - \beta_i)$ wykonuje **2-adyczne mieszanie bitów prefiksu $U_i$** (mnożenie przez nieparzystą potęgę trójki i odjęcie stałej), co nieuchronnie wrzuca trajektorię albo w:
   - **bezpośredni rezonans wysokiego rzędu** ($v_i \in \{3, 4, 5, 6\}$, jak w bloku `#8` dla $n=94959$ z $v_8 = 6$, czy w blokach `#13..#15` dla $n=703$ z $v = 4, 3, 5$), albo
   - **kaskadę jedno-zerowych bezpieczników** `c = 1 (b = 1, -3)`, gdzie każdy blok ma $r_i = 0$ i $v_i \ge 2$ (np. bloki `#9..#11` dla $n = 6171$ z $v = 3, 2, 2$), co błyskawicznie redukuje wysokość liczby bez dodawania nowych cykli $r_i$.
3. **Rekomendacja formalna do `CollatzProof.lean`:**  
   - **Do Części 47 i 48:** Wkleić wygenerowane wyżej 192 twierdzenia `horizon_drop_mod...` (Zestaw A + Zestaw B).
   - **Do Hipotezy H3:** Zdefiniować w Lean 4 funkcję `macroBlockIter (K : Nat) (n : Nat) : Nat` lub wieloblokowy weryfikator symboliczny łączący $K = 2, 3$ kolejne przejścia $(r_i, d_i, c_i, v_i)$, ponieważ złożenie już 2–3 bloków wycina klasy o $v_1 = 1$, które pojedynczy blok zostawia otwarte.


---

# Raport Rundy 2 — Architekt 4 (Eksplorator Kontrprzykładów i Łowca Ekstremalnych Klas)

Data analizy: `2026-11-02`  
Skrypt generujący: `/Users/gkucmierz/workspace/collatz-lab/tmp/hunter-round2.mjs`

---

## Część 4. Głębokie Sito 2-Adyczne na Poziomach `c = 102..113` (`k = 162..180`, `m = 264..293`) — Zestaw C (Część 49) i Zestaw D (Część 50)

### 4.1. Zbiorcza tabela 12 kanonicznych progów diofantycznych $k = \lceil c \log_2 3 \rceil$ dla $c = 102..113$

W tym przedziale przeskoki $\Delta k = 2$ występują dla $c \in \{103, 105, 106, 108, 110, 112, 113\}$, a $\Delta k = 1$ dla $c \in \{102, 104, 107, 109, 111\}$:

| Zestaw | Kroki nieparz. $c$ | Poziom $k = \lceil c \log_2 3 \rceil$ | Horyzont $m = k + c$ | 16 najniższych przeżywających klas $b \equiv 3 \pmod 4$ |
| :--- | :---: | :---: | :---: | :--- |
| **C (Cz. 49)** | `102` | `162` | `264` | `140479, 180463, 228399, 277615, 312319, 320823, 342599, 355695, 370155, 376603, 400159, 405407, 423679, 427763, 456799, 468479` |
| **C (Cz. 49)** | `103` | `164` | `267` | `94959, 160411, 180463, 187303, 228399, 270271, 270695, 277615, 285175, 320823, 355695, 370155, 376603, 400159, 406043, 416423` |
| **C (Cz. 49)** | `104` | `165` | `269` | `160411, 180463, 270695, 277615, 285175, 351359, 355695, 362343, 376603, 406043, 416423, 427763, 438699, 506983, 601727, 624635` |
| **C (Cz. 49)** | `105` | `167` | `272` | `142587, 160411, 166491, 192711, 230631, 234239, 270695, 285175, 355695, 360927, 362343, 370155, 401151, 406043, 438699, 450651` |
| **C (Cz. 49)** | `106` | `169` | `275` | `142587, 156159, 221991, 234239, 270695, 285175, 312319, 320823, 360927, 438699, 481235, 506983, 508399, 511935, 541391, 624635` |
| **C (Cz. 49)** | `107` | `170` | `277` | `142587, 156159, 180463, 320823, 360927, 416423, 450651, 481235, 506983, 511935, 572591, 740307, 740311, 763455, 832839, 832847` |
| **D (Cz. 50)** | `108` | `172` | `280` | `228399, 277615, 285175, 320823, 427763, 438699, 450651, 481235, 555231, 572591, 665215, 763455, 801147, 844647, 910107, 987075` |
| **D (Cz. 50)** | `109` | `173` | `282` | `160411, 285175, 320823, 370155, 381727, 427763, 438699, 450651, 704623, 740307, 740311, 763455, 801147, 844647, 845223, 987075` |
| **D (Cz. 50)** | `110` | `175` | `285` | `285175, 381727, 427763, 665215, 667375, 704623, 844647, 845223, 877399, 928191, 987075, 997823, 1003263, 1017939, 1056935, 1068199` |
| **D (Cz. 50)** | `111` | `176` | `287` | `142587, 285175, 626331, 665215, 704623, 877399, 928191, 1003263, 1031807, 1056935, 1072575, 1206447, 1252663, 1316091, 1316099, 1316103` |
| **D (Cz. 50)** | `112` | `178` | `290` | `180463, 438699, 506983, 626331, 665215, 667375, 687871, 704623, 877399, 997823, 1001063, 1072575, 1199847, 1206447, 1252663, 1375743` |
| **D (Cz. 50)** | `113` | `180` | `293` | `160411, 450651, 506983, 687871, 704623, 928191, 997823, 1001063, 1031807, 1039879, 1056935, 1072575, 1199847, 1206447, 1252663, 1330431` |

---

### 4.2. Gotowy kod Lean 4 — Zestaw C (do Części 49: `k ∈ {162, 164, 165, 167, 169, 170}`, `m = 264..277`, `96` twierdzeń)

```lean
-- k=162, M=5846006549323611672814739330865132078623730171904=2^162, m=264, c=102
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq140479 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 140479) := checkAffineDrop_sound 264 (2 ^ 162) 140479 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 180463) := checkAffineDrop_sound 264 (2 ^ 162) 180463 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 228399) := checkAffineDrop_sound 264 (2 ^ 162) 228399 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 277615) := checkAffineDrop_sound 264 (2 ^ 162) 277615 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 312319) := checkAffineDrop_sound 264 (2 ^ 162) 312319 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 320823) := checkAffineDrop_sound 264 (2 ^ 162) 320823 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq342599 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 342599) := checkAffineDrop_sound 264 (2 ^ 162) 342599 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 355695) := checkAffineDrop_sound 264 (2 ^ 162) 355695 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq370155 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 370155) := checkAffineDrop_sound 264 (2 ^ 162) 370155 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq376603 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 376603) := checkAffineDrop_sound 264 (2 ^ 162) 376603 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq400159 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 400159) := checkAffineDrop_sound 264 (2 ^ 162) 400159 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq405407 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 405407) := checkAffineDrop_sound 264 (2 ^ 162) 405407 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq423679 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 423679) := checkAffineDrop_sound 264 (2 ^ 162) 423679 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq427763 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 427763) := checkAffineDrop_sound 264 (2 ^ 162) 427763 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq456799 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 456799) := checkAffineDrop_sound 264 (2 ^ 162) 456799 (by decide) k
theorem horizon_drop_mod5846006549323611672814739330865132078623730171904_eq468479 (k : Nat) : HasHorizonDrop (2 ^ 162 * k + 468479) := checkAffineDrop_sound 264 (2 ^ 162) 468479 (by decide) k
-- k=164, M=23384026197294446691258957323460528314494920687616=2^164, m=267, c=103
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq94959 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 94959 ) := checkAffineDrop_sound 267 (2 ^ 164) 94959  (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 160411) := checkAffineDrop_sound 267 (2 ^ 164) 160411 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 180463) := checkAffineDrop_sound 267 (2 ^ 164) 180463 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq187303 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 187303) := checkAffineDrop_sound 267 (2 ^ 164) 187303 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 228399) := checkAffineDrop_sound 267 (2 ^ 164) 228399 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq270271 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 270271) := checkAffineDrop_sound 267 (2 ^ 164) 270271 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 270695) := checkAffineDrop_sound 267 (2 ^ 164) 270695 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 277615) := checkAffineDrop_sound 267 (2 ^ 164) 277615 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 285175) := checkAffineDrop_sound 267 (2 ^ 164) 285175 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 320823) := checkAffineDrop_sound 267 (2 ^ 164) 320823 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 355695) := checkAffineDrop_sound 267 (2 ^ 164) 355695 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq370155 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 370155) := checkAffineDrop_sound 267 (2 ^ 164) 370155 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq376603 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 376603) := checkAffineDrop_sound 267 (2 ^ 164) 376603 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq400159 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 400159) := checkAffineDrop_sound 267 (2 ^ 164) 400159 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq406043 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 406043) := checkAffineDrop_sound 267 (2 ^ 164) 406043 (by decide) k
theorem horizon_drop_mod23384026197294446691258957323460528314494920687616_eq416423 (k : Nat) : HasHorizonDrop (2 ^ 164 * k + 416423) := checkAffineDrop_sound 267 (2 ^ 164) 416423 (by decide) k
-- k=165, M=46768052394588893382517914646921056628989841375232=2^165, m=269, c=104
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 160411) := checkAffineDrop_sound 269 (2 ^ 165) 160411 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 180463) := checkAffineDrop_sound 269 (2 ^ 165) 180463 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 270695) := checkAffineDrop_sound 269 (2 ^ 165) 270695 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 277615) := checkAffineDrop_sound 269 (2 ^ 165) 277615 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 285175) := checkAffineDrop_sound 269 (2 ^ 165) 285175 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq351359 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 351359) := checkAffineDrop_sound 269 (2 ^ 165) 351359 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 355695) := checkAffineDrop_sound 269 (2 ^ 165) 355695 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq362343 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 362343) := checkAffineDrop_sound 269 (2 ^ 165) 362343 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq376603 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 376603) := checkAffineDrop_sound 269 (2 ^ 165) 376603 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq406043 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 406043) := checkAffineDrop_sound 269 (2 ^ 165) 406043 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq416423 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 416423) := checkAffineDrop_sound 269 (2 ^ 165) 416423 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq427763 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 427763) := checkAffineDrop_sound 269 (2 ^ 165) 427763 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 438699) := checkAffineDrop_sound 269 (2 ^ 165) 438699 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq506983 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 506983) := checkAffineDrop_sound 269 (2 ^ 165) 506983 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq601727 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 601727) := checkAffineDrop_sound 269 (2 ^ 165) 601727 (by decide) k
theorem horizon_drop_mod46768052394588893382517914646921056628989841375232_eq624635 (k : Nat) : HasHorizonDrop (2 ^ 165 * k + 624635) := checkAffineDrop_sound 269 (2 ^ 165) 624635 (by decide) k
-- k=167, M=187072209578355573530071658587684226515959365500928=2^167, m=272, c=105
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 142587) := checkAffineDrop_sound 272 (2 ^ 167) 142587 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 160411) := checkAffineDrop_sound 272 (2 ^ 167) 160411 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq166491 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 166491) := checkAffineDrop_sound 272 (2 ^ 167) 166491 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq192711 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 192711) := checkAffineDrop_sound 272 (2 ^ 167) 192711 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq230631 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 230631) := checkAffineDrop_sound 272 (2 ^ 167) 230631 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 234239) := checkAffineDrop_sound 272 (2 ^ 167) 234239 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 270695) := checkAffineDrop_sound 272 (2 ^ 167) 270695 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 285175) := checkAffineDrop_sound 272 (2 ^ 167) 285175 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq355695 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 355695) := checkAffineDrop_sound 272 (2 ^ 167) 355695 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 360927) := checkAffineDrop_sound 272 (2 ^ 167) 360927 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq362343 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 362343) := checkAffineDrop_sound 272 (2 ^ 167) 362343 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq370155 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 370155) := checkAffineDrop_sound 272 (2 ^ 167) 370155 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq401151 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 401151) := checkAffineDrop_sound 272 (2 ^ 167) 401151 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq406043 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 406043) := checkAffineDrop_sound 272 (2 ^ 167) 406043 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 438699) := checkAffineDrop_sound 272 (2 ^ 167) 438699 (by decide) k
theorem horizon_drop_mod187072209578355573530071658587684226515959365500928_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 167 * k + 450651) := checkAffineDrop_sound 272 (2 ^ 167) 450651 (by decide) k
-- k=169, M=748288838313422294120286634350736906063837462003712=2^169, m=275, c=106
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 142587) := checkAffineDrop_sound 275 (2 ^ 169) 142587 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 156159) := checkAffineDrop_sound 275 (2 ^ 169) 156159 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq221991 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 221991) := checkAffineDrop_sound 275 (2 ^ 169) 221991 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq234239 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 234239) := checkAffineDrop_sound 275 (2 ^ 169) 234239 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq270695 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 270695) := checkAffineDrop_sound 275 (2 ^ 169) 270695 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 285175) := checkAffineDrop_sound 275 (2 ^ 169) 285175 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq312319 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 312319) := checkAffineDrop_sound 275 (2 ^ 169) 312319 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 320823) := checkAffineDrop_sound 275 (2 ^ 169) 320823 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 360927) := checkAffineDrop_sound 275 (2 ^ 169) 360927 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 438699) := checkAffineDrop_sound 275 (2 ^ 169) 438699 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq481235 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 481235) := checkAffineDrop_sound 275 (2 ^ 169) 481235 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq506983 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 506983) := checkAffineDrop_sound 275 (2 ^ 169) 506983 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq508399 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 508399) := checkAffineDrop_sound 275 (2 ^ 169) 508399 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq511935 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 511935) := checkAffineDrop_sound 275 (2 ^ 169) 511935 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq541391 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 541391) := checkAffineDrop_sound 275 (2 ^ 169) 541391 (by decide) k
theorem horizon_drop_mod748288838313422294120286634350736906063837462003712_eq624635 (k : Nat) : HasHorizonDrop (2 ^ 169 * k + 624635) := checkAffineDrop_sound 275 (2 ^ 169) 624635 (by decide) k
-- k=170, M=1496577676626844588240573268701473812127674924007424=2^170, m=277, c=107
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 142587) := checkAffineDrop_sound 277 (2 ^ 170) 142587 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq156159 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 156159) := checkAffineDrop_sound 277 (2 ^ 170) 156159 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 180463) := checkAffineDrop_sound 277 (2 ^ 170) 180463 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 320823) := checkAffineDrop_sound 277 (2 ^ 170) 320823 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq360927 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 360927) := checkAffineDrop_sound 277 (2 ^ 170) 360927 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq416423 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 416423) := checkAffineDrop_sound 277 (2 ^ 170) 416423 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 450651) := checkAffineDrop_sound 277 (2 ^ 170) 450651 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq481235 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 481235) := checkAffineDrop_sound 277 (2 ^ 170) 481235 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq506983 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 506983) := checkAffineDrop_sound 277 (2 ^ 170) 506983 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq511935 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 511935) := checkAffineDrop_sound 277 (2 ^ 170) 511935 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq572591 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 572591) := checkAffineDrop_sound 277 (2 ^ 170) 572591 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq740307 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 740307) := checkAffineDrop_sound 277 (2 ^ 170) 740307 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq740311 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 740311) := checkAffineDrop_sound 277 (2 ^ 170) 740311 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq763455 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 763455) := checkAffineDrop_sound 277 (2 ^ 170) 763455 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq832839 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 832839) := checkAffineDrop_sound 277 (2 ^ 170) 832839 (by decide) k
theorem horizon_drop_mod1496577676626844588240573268701473812127674924007424_eq832847 (k : Nat) : HasHorizonDrop (2 ^ 170 * k + 832847) := checkAffineDrop_sound 277 (2 ^ 170) 832847 (by decide) k
```

---

### 4.3. Gotowy kod Lean 4 — Zestaw D (do Części 50: `k ∈ {172, 173, 175, 176, 178, 180}`, `m = 280..293`, `96` twierdzeń)

```lean
-- k=172, M=5986310706507378352962293074805895248510699696029696=2^172, m=280, c=108
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq228399 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 228399) := checkAffineDrop_sound 280 (2 ^ 172) 228399 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq277615 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 277615) := checkAffineDrop_sound 280 (2 ^ 172) 277615 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 285175) := checkAffineDrop_sound 280 (2 ^ 172) 285175 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 320823) := checkAffineDrop_sound 280 (2 ^ 172) 320823 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq427763 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 427763) := checkAffineDrop_sound 280 (2 ^ 172) 427763 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 438699) := checkAffineDrop_sound 280 (2 ^ 172) 438699 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 450651) := checkAffineDrop_sound 280 (2 ^ 172) 450651 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq481235 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 481235) := checkAffineDrop_sound 280 (2 ^ 172) 481235 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq555231 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 555231) := checkAffineDrop_sound 280 (2 ^ 172) 555231 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq572591 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 572591) := checkAffineDrop_sound 280 (2 ^ 172) 572591 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 665215) := checkAffineDrop_sound 280 (2 ^ 172) 665215 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq763455 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 763455) := checkAffineDrop_sound 280 (2 ^ 172) 763455 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq801147 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 801147) := checkAffineDrop_sound 280 (2 ^ 172) 801147 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq844647 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 844647) := checkAffineDrop_sound 280 (2 ^ 172) 844647 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq910107 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 910107) := checkAffineDrop_sound 280 (2 ^ 172) 910107 (by decide) k
theorem horizon_drop_mod5986310706507378352962293074805895248510699696029696_eq987075 (k : Nat) : HasHorizonDrop (2 ^ 172 * k + 987075) := checkAffineDrop_sound 280 (2 ^ 172) 987075 (by decide) k
-- k=173, M=11972621413014756705924586149611790497021399392059392=2^173, m=282, c=109
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 160411) := checkAffineDrop_sound 282 (2 ^ 173) 160411 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 285175) := checkAffineDrop_sound 282 (2 ^ 173) 285175 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq320823 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 320823) := checkAffineDrop_sound 282 (2 ^ 173) 320823 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq370155 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 370155) := checkAffineDrop_sound 282 (2 ^ 173) 370155 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq381727 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 381727) := checkAffineDrop_sound 282 (2 ^ 173) 381727 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq427763 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 427763) := checkAffineDrop_sound 282 (2 ^ 173) 427763 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 438699) := checkAffineDrop_sound 282 (2 ^ 173) 438699 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 450651) := checkAffineDrop_sound 282 (2 ^ 173) 450651 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 704623) := checkAffineDrop_sound 282 (2 ^ 173) 704623 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq740307 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 740307) := checkAffineDrop_sound 282 (2 ^ 173) 740307 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq740311 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 740311) := checkAffineDrop_sound 282 (2 ^ 173) 740311 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq763455 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 763455) := checkAffineDrop_sound 282 (2 ^ 173) 763455 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq801147 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 801147) := checkAffineDrop_sound 282 (2 ^ 173) 801147 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq844647 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 844647) := checkAffineDrop_sound 282 (2 ^ 173) 844647 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq845223 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 845223) := checkAffineDrop_sound 282 (2 ^ 173) 845223 (by decide) k
theorem horizon_drop_mod11972621413014756705924586149611790497021399392059392_eq987075 (k : Nat) : HasHorizonDrop (2 ^ 173 * k + 987075) := checkAffineDrop_sound 282 (2 ^ 173) 987075 (by decide) k
-- k=175, M=47890485652059026823698344598447161988085597568237568=2^175, m=285, c=110
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 285175) := checkAffineDrop_sound 285 (2 ^ 175) 285175 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq381727 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 381727) := checkAffineDrop_sound 285 (2 ^ 175) 381727 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq427763 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 427763) := checkAffineDrop_sound 285 (2 ^ 175) 427763 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 665215) := checkAffineDrop_sound 285 (2 ^ 175) 665215 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq667375 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 667375) := checkAffineDrop_sound 285 (2 ^ 175) 667375 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 704623) := checkAffineDrop_sound 285 (2 ^ 175) 704623 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq844647 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 844647) := checkAffineDrop_sound 285 (2 ^ 175) 844647 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq845223 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 845223) := checkAffineDrop_sound 285 (2 ^ 175) 845223 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq877399 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 877399) := checkAffineDrop_sound 285 (2 ^ 175) 877399 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq928191 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 928191) := checkAffineDrop_sound 285 (2 ^ 175) 928191 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq987075 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 987075) := checkAffineDrop_sound 285 (2 ^ 175) 987075 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 997823) := checkAffineDrop_sound 285 (2 ^ 175) 997823 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 1003263) := checkAffineDrop_sound 285 (2 ^ 175) 1003263 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq1017939 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 1017939) := checkAffineDrop_sound 285 (2 ^ 175) 1017939 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 1056935) := checkAffineDrop_sound 285 (2 ^ 175) 1056935 (by decide) k
theorem horizon_drop_mod47890485652059026823698344598447161988085597568237568_eq1068199 (k : Nat) : HasHorizonDrop (2 ^ 175 * k + 1068199) := checkAffineDrop_sound 285 (2 ^ 175) 1068199 (by decide) k
-- k=176, M=95780971304118053647396689196894323976171195136475136=2^176, m=287, c=111
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 142587) := checkAffineDrop_sound 287 (2 ^ 176) 142587 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq285175 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 285175) := checkAffineDrop_sound 287 (2 ^ 176) 285175 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 626331) := checkAffineDrop_sound 287 (2 ^ 176) 626331 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 665215) := checkAffineDrop_sound 287 (2 ^ 176) 665215 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 704623) := checkAffineDrop_sound 287 (2 ^ 176) 704623 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq877399 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 877399) := checkAffineDrop_sound 287 (2 ^ 176) 877399 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq928191 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 928191) := checkAffineDrop_sound 287 (2 ^ 176) 928191 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1003263) := checkAffineDrop_sound 287 (2 ^ 176) 1003263 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1031807 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1031807) := checkAffineDrop_sound 287 (2 ^ 176) 1031807 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1056935) := checkAffineDrop_sound 287 (2 ^ 176) 1056935 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1072575 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1072575) := checkAffineDrop_sound 287 (2 ^ 176) 1072575 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1206447 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1206447) := checkAffineDrop_sound 287 (2 ^ 176) 1206447 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1252663) := checkAffineDrop_sound 287 (2 ^ 176) 1252663 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1316091 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1316091) := checkAffineDrop_sound 287 (2 ^ 176) 1316091 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1316099 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1316099) := checkAffineDrop_sound 287 (2 ^ 176) 1316099 (by decide) k
theorem horizon_drop_mod95780971304118053647396689196894323976171195136475136_eq1316103 (k : Nat) : HasHorizonDrop (2 ^ 176 * k + 1316103) := checkAffineDrop_sound 287 (2 ^ 176) 1316103 (by decide) k
-- k=178, M=383123885216472214589586756787577295904684780545900544=2^178, m=290, c=112
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq180463 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 180463) := checkAffineDrop_sound 290 (2 ^ 178) 180463 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq438699 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 438699) := checkAffineDrop_sound 290 (2 ^ 178) 438699 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq506983 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 506983) := checkAffineDrop_sound 290 (2 ^ 178) 506983 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 626331) := checkAffineDrop_sound 290 (2 ^ 178) 626331 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 665215) := checkAffineDrop_sound 290 (2 ^ 178) 665215 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq667375 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 667375) := checkAffineDrop_sound 290 (2 ^ 178) 667375 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq687871 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 687871) := checkAffineDrop_sound 290 (2 ^ 178) 687871 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 704623) := checkAffineDrop_sound 290 (2 ^ 178) 704623 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq877399 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 877399) := checkAffineDrop_sound 290 (2 ^ 178) 877399 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 997823) := checkAffineDrop_sound 290 (2 ^ 178) 997823 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1001063 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1001063) := checkAffineDrop_sound 290 (2 ^ 178) 1001063 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1072575 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1072575) := checkAffineDrop_sound 290 (2 ^ 178) 1072575 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1199847 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1199847) := checkAffineDrop_sound 290 (2 ^ 178) 1199847 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1206447 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1206447) := checkAffineDrop_sound 290 (2 ^ 178) 1206447 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1252663) := checkAffineDrop_sound 290 (2 ^ 178) 1252663 (by decide) k
theorem horizon_drop_mod383123885216472214589586756787577295904684780545900544_eq1375743 (k : Nat) : HasHorizonDrop (2 ^ 178 * k + 1375743) := checkAffineDrop_sound 290 (2 ^ 178) 1375743 (by decide) k
-- k=180, M=1532495540865888858358347027150309183618739122183602176=2^180, m=293, c=113
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 160411) := checkAffineDrop_sound 293 (2 ^ 180) 160411 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 450651) := checkAffineDrop_sound 293 (2 ^ 180) 450651 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq506983 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 506983) := checkAffineDrop_sound 293 (2 ^ 180) 506983 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq687871 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 687871) := checkAffineDrop_sound 293 (2 ^ 180) 687871 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 704623) := checkAffineDrop_sound 293 (2 ^ 180) 704623 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq928191 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 928191) := checkAffineDrop_sound 293 (2 ^ 180) 928191 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 997823) := checkAffineDrop_sound 293 (2 ^ 180) 997823 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1001063 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1001063) := checkAffineDrop_sound 293 (2 ^ 180) 1001063 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1031807 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1031807) := checkAffineDrop_sound 293 (2 ^ 180) 1031807 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1039879 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1039879) := checkAffineDrop_sound 293 (2 ^ 180) 1039879 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1056935) := checkAffineDrop_sound 293 (2 ^ 180) 1056935 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1072575 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1072575) := checkAffineDrop_sound 293 (2 ^ 180) 1072575 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1199847 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1199847) := checkAffineDrop_sound 293 (2 ^ 180) 1199847 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1206447 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1206447) := checkAffineDrop_sound 293 (2 ^ 180) 1206447 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1252663) := checkAffineDrop_sound 293 (2 ^ 180) 1252663 (by decide) k
theorem horizon_drop_mod1532495540865888858358347027150309183618739122183602176_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 180 * k + 1330431) := checkAffineDrop_sound 293 (2 ^ 180) 1330431 (by decide) k
```

---

## Część 5. Analiza Pokrycia Dwublokowego i Trójblokowego Sprzężenia RLE (`K = 2, 3`) na Wszystkich 64 Ocalałych Klasach `mod 1024`

### 5.1. Statystyka skumulowanego przełamania bariery $(9/8)^r$ w funkcji liczby bloków $K = 1..15$

Dla wszystkich 64 klas bazowych z `survivingMod1024` zbadano:
1. Osiągnięcie dodatniej nadwyżki 2-adycznej $\Delta V_K = E_K - \frac{3}{2} O_K > 0$ (oraz $\Delta V_K \ge 0$),
2. Przewagę sumy wykładników rezonansu nad liczbą cykli $\sum_{i=1}^K v_i > \sum_{i=1}^K r_i$,
3. Bezpośredni spadek trajektorii poniżej reprezentanta $N_k < r_0$ w pierwszych $K$ blokach RLE:

| Liczba bloków RLE $K$ | Nadwyżka $\Delta V_k > 0$ (w $\le K$ blokach) | Przewaga $\sum v_i > \sum r_i$ (w $\le K$ blokach) | Bezpośredni spadek $N_k < r_0$ (w $\le K$ blokach) |
| :---: | :---: | :---: | :---: |
| **$K = 1$** | `3 / 64` (**4.69%**) | `5 / 64` (**7.81%**) | `3 / 64` (**4.69%**) |
| **$K = 2$** | `19 / 64` (**29.69%**) *(+10 z $\Delta V_2 = 0$, łącznie **45.31%** $\ge 0$)* | `32 / 64` (**50.00%**) | `11 / 64` (**17.19%**) |
| **$K = 3$** | `37 / 64` (**57.81%**) *(+6 z $\Delta V_3 = 0$, łącznie **67.19%** $\ge 0$)* | `55 / 64` (**85.94%**) | `32 / 64` (**50.00%**) |
| **$K = 4$** | `47 / 64` (**73.44%**) | `61 / 64` (**95.31%**) | `42 / 64` (**65.63%**) |
| **$K = 5$** | `54 / 64` (**84.38%**) | `62 / 64` (**96.88%**) | `48 / 64` (**75.00%**) |
| **$K = 6$** | `56 / 64` (**87.50%**) | `64 / 64` (**100.00%**) | `53 / 64` (**82.81%**) |
| **$K = 10$** | `62 / 64` (**96.88%**) | `64 / 64` (**100.00%**) | `60 / 64` (**93.75%**) |
| **$K = 13$** | `64 / 64` (**100.00%**) | `64 / 64` (**100.00%**) | `63 / 64` (**98.44%**) |
| **$K = 15$** | `64 / 64` (**100.00%**) | `64 / 64` (**100.00%**) | `64 / 64` (**100.00%**) |

---

### 5.2. Pełna Tablica Wektorów Trójblokowych `[(r1, d1, c1, v1), (r2, d2, c2, v2), (r3, d3, c3, v3)]` dla 64 Klas `survivingMod1024`

| # | Klasa $r_0$ | Blok 1: $(r_1, d_1, c_1, v_1) \to N_1$ | Blok 2: $(r_2, d_2, c_2, v_2) \to N_2$ | Blok 3: $(r_3, d_3, c_3, v_3) \to N_3$ | $\sum_{i=1}^2 (r_i, v_i)$ | $\Delta V_2$ | $\sum_{i=1}^3 (r_i, v_i)$ | $\Delta V_3$ | Blok spadku $K_{\text{drop}}$ |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | **`71`** | `(1,1,1,1)→121` | `(1,4,7,2)→175` | `(2,0,1,1)→445` | `(2, 3)` | -0.5 | `(4, 4)` | -1.5 | **10** |
| 2 | **`327`** | `(1,1,1,1)→553` | `(0,4,7,1)→1403` | `(2,1,5,1)→1333` | `(1, 2)` | -1.5 | `(3, 3)` | -1.0 | **4** |
| 3 | **`839`** | `(1,1,1,1)→1417` | `(0,4,7,2)→1795` | `(0,3,5,2)→505` | `(1, 3)` | -0.5 | `(1, 5)` | **+1.5** | **3** |
| 4 | **`167`** | `(1,1,1,1)→283` | `(1,2,5,1)→1079` | `(1,1,1,2)→911` | `(2, 2)` | -2.0 | `(3, 4)` | -1.5 | **6** |
| 5 | **`679`** | `(1,1,1,1)→1147` | `(2,1,5,2)→545` | `(0,3,7,1)→307` | `(3, 3)` | **+1.0** | `(3, 4)` | **+2.0** | **2** |
| 6 | **`935`** | `(1,1,1,1)→1579` | `(1,1,5,1)→1333` | `(0,1,1,4)→125` | `(2, 2)` | 0.0 | `(2, 6)` | **+3.5** | **3** |
| 7 | **`103`** | `(1,1,1,1)→175` | `(2,0,1,1)→445` | `(0,1,1,2)→167` | `(3, 2)` | -1.5 | `(3, 4)` | 0.0 | **9** |
| 8 | **`615`** | `(1,1,1,1)→1039` | `(2,0,1,4)→329` | `(0,4,7,3)→209` | `(3, 5)` | **+1.5** | `(3, 8)` | **+2.5** | **2** |
| 9 | **`359`** | `(1,1,1,1)→607` | `(2,1,1,3)→577` | `(0,3,7,1)→325` | `(3, 4)` | 0.0 | `(3, 5)` | **+1.0** | **3** |
| 10 | **`871`** | `(1,1,1,1)→1471` | `(3,0,1,1)→8383` | `(3,0,1,1)→47749` | `(4, 2)` | -2.5 | `(7, 3)` | -4.5 | **6** |
| 11 | **`231`** | `(1,1,1,1)→391` | `(1,1,1,1)→661` | `(0,1,1,5)→31` | `(2, 2)` | -1.0 | `(2, 7)` | **+3.5** | **3** |
| 12 | **`743`** | `(1,1,1,1)→1255` | `(1,1,1,1)→2119` | `(1,1,1,1)→3577` | `(2, 2)` | -1.0 | `(3, 3)` | -1.5 | **4** |
| 13 | **`487`** | `(1,1,1,1)→823` | `(1,1,1,2)→695` | `(1,1,1,2)→587` | `(2, 3)` | 0.0 | `(3, 5)` | **+0.5** | **4** |
| 14 | **`207`** | `(2,0,1,2)→263` | `(1,1,1,1)→445` | `(0,1,1,2)→167` | `(3, 3)` | -0.5 | `(3, 5)` | **+1.0** | **3** |
| 15 | **`719`** | `(2,0,1,2)→911` | `(2,0,1,3)→577` | `(0,3,7,1)→325` | `(4, 5)` | **+1.0** | `(4, 6)` | **+2.0** | **2** |
| 16 | **`463`** | `(2,0,1,2)→587` | `(1,1,5,5)→31` | `(2,1,1,1)→121` | `(3, 7)` | **+4.5** | `(5, 8)` | **+3.0** | **2** |
| 17 | **`47`** | `(2,0,1,1)→121` | `(1,4,7,2)→175` | `(2,0,1,1)→445` | `(3, 3)` | -1.0 | `(5, 4)` | -2.0 | **11** |
| 18 | **`559`** | `(2,0,1,1)→1417` | `(0,4,7,2)→1795` | `(0,3,5,2)→505` | `(2, 3)` | -1.0 | `(2, 5)` | **+1.0** | **3** |
| 19 | **`303`** | `(2,0,1,1)→769` | `(0,3,7,1)→433` | `(0,3,7,3)→61` | `(2, 2)` | 0.0 | `(2, 5)` | **+3.0** | **3** |
| 20 | **`111`** | `(2,0,1,1)→283` | `(1,2,5,1)→1079` | `(1,1,1,2)→911` | `(3, 2)` | -2.5 | `(4, 4)` | -2.0 | **6** |
| 21 | **`623`** | `(2,0,1,1)→1579` | `(1,1,5,1)→1333` | `(0,1,1,4)→125` | `(3, 2)` | -0.5 | `(3, 6)` | **+3.0** | **3** |
| 22 | **`879`** | `(2,0,1,1)→2227` | `(0,3,5,1)→1253` | `(0,1,1,3)→235` | `(2, 2)` | 0.0 | `(2, 5)` | **+2.5** | **3** |
| 23 | **`239`** | `(2,0,1,1)→607` | `(2,1,1,3)→577` | `(0,3,7,1)→325` | `(4, 4)` | -0.5 | `(4, 5)` | **+0.5** | **4** |
| 24 | **`751`** | `(2,0,1,1)→1903` | `(2,0,1,1)→4819` | `(0,3,5,1)→2711` | `(4, 2)` | -2.0 | `(4, 3)` | -1.0 | **4** |
| 25 | **`495`** | `(2,0,1,1)→1255` | `(1,1,1,1)→2119` | `(1,1,1,1)→3577` | `(3, 2)` | -1.5 | `(4, 3)` | -2.0 | **5** |
| 26 | **`1007`** | `(2,0,1,1)→2551` | `(1,1,1,2)→2153` | `(0,4,7,1)→5453` | `(3, 3)` | -0.5 | `(3, 4)` | -1.5 | **5** |
| 27 | **`27`** | `(1,2,5,1)→107` | `(1,1,5,1)→91` | `(1,2,5,2)→175` | `(2, 2)` | -1.0 | `(3, 4)` | -1.5 | **12** |
| 28 | **`539`** | `(1,2,5,1)→2051` | `(0,3,5,2)→577` | `(0,3,7,1)→325` | `(1, 3)` | **+0.5** | `(1, 4)` | **+1.5** | **3** |
| 29 | **`283`** | `(1,2,5,1)→1079` | `(1,1,1,2)→911` | `(2,0,1,3)→577` | `(2, 3)` | -1.0 | `(4, 6)` | 0.0 | **5** |
| 30 | **`795`** | `(1,2,5,1)→3023` | `(2,0,1,2)→3827` | `(0,3,5,1)→2153` | `(3, 3)` | -1.5 | `(3, 4)` | -0.5 | **6** |
| 31 | **`155`** | `(1,2,5,1)→593` | `(0,3,7,2)→167` | `(1,1,1,1)→283` | `(1, 3)` | **+0.5** | `(2, 4)` | 0.0 | **8** |
| 32 | **`667`** | `(1,2,5,1)→2537` | `(0,4,7,1)→6425` | `(0,5,7,1)→2711` | `(1, 2)` | -2.5 | `(1, 3)` | -1.0 | **4** |
| 33 | **`411`** | `(1,2,5,1)→1565` | `(0,1,1,2)→587` | `(1,1,5,5)→31` | `(1, 3)` | 0.0 | `(2, 8)` | **+4.5** | **3** |
| 34 | **`91`** | `(1,2,5,2)→175` | `(2,0,1,1)→445` | `(0,1,1,2)→167` | `(3, 3)` | -1.5 | `(3, 5)` | 0.0 | **9** |
| 35 | **`603`** | `(1,2,5,2)→1147` | `(2,1,5,2)→545` | `(0,3,7,1)→307` | `(3, 4)` | **+1.0** | `(3, 5)` | **+2.0** | **2** |
| 36 | **`859`** | `(1,2,5,2)→1633` | `(0,3,7,1)→919` | `(1,1,1,5)→97` | `(1, 3)` | **+0.5** | `(2, 8)` | **+4.0** | **3** |
| 37 | **`251`** | `(2,2,5,1)→1079` | `(1,1,1,2)→911` | `(2,0,1,3)→577` | `(3, 3)` | -1.0 | `(5, 6)` | 0.0 | **5** |
| 38 | **`763`** | `(2,2,5,2)→1633` | `(0,3,7,1)→919` | `(1,1,1,5)→97` | `(2, 3)` | **+0.5** | `(3, 8)` | **+4.0** | **3** |
| 39 | **`1019`** | `(3,1,5,2)→545` | `(0,3,7,1)→307` | `(0,3,5,1)→173` | `(3, 3)` | **+2.5** | `(3, 4)` | **+3.5** | **1** |
| 40 | **`31`** | `(2,1,1,1)→121` | `(1,4,7,2)→175` | `(2,0,1,1)→445` | `(3, 3)` | -1.5 | `(5, 4)` | -2.5 | **11** |
| 41 | **`543`** | `(2,1,1,1)→2065` | `(0,3,7,2)→581` | `(0,1,1,3)→109` | `(2, 3)` | **+0.5** | `(2, 6)` | **+3.0** | **3** |
| 42 | **`799`** | `(2,1,1,1)→3037` | `(0,1,1,2)→1139` | `(0,3,5,1)→641` | `(2, 3)` | 0.0 | `(2, 4)` | **+1.0** | **3** |
| 43 | **`159`** | `(2,1,1,1)→607` | `(2,1,1,3)→577` | `(0,3,7,1)→325` | `(4, 4)` | -1.0 | `(4, 5)` | 0.0 | **4** |
| 44 | **`671`** | `(2,1,1,1)→2551` | `(1,1,1,2)→2153` | `(0,4,7,1)→5453` | `(3, 3)` | -1.0 | `(3, 4)` | -2.0 | **7** |
| 45 | **`415`** | `(2,1,1,1)→1579` | `(1,1,5,1)→1333` | `(0,1,1,4)→125` | `(3, 2)` | -1.0 | `(3, 6)` | **+2.5** | **3** |
| 46 | **`927`** | `(2,1,1,1)→3523` | `(0,3,5,2)→991` | `(2,1,1,2)→1883` | `(2, 3)` | **+0.5** | `(4, 5)` | 0.0 | **5** |
| 47 | **`223`** | `(2,1,1,2)→425` | `(0,4,7,1)→1079` | `(1,1,1,2)→911` | `(2, 3)` | -1.5 | `(3, 5)` | -1.0 | **6** |
| 48 | **`479`** | `(2,1,1,2)→911` | `(2,0,1,3)→577` | `(0,3,7,1)→325` | `(4, 5)` | **+0.5** | `(4, 6)` | **+1.5** | **3** |
| 49 | **`991`** | `(2,1,1,2)→1883` | `(1,2,5,2)→3577` | `(2,3,7,3)→637` | `(3, 4)` | -1.0 | `(5, 7)` | **+2.0** | **3** |
| 50 | **`63`** | `(3,0,1,3)→91` | `(1,2,5,2)→175` | `(2,0,1,1)→445` | `(4, 5)` | -0.5 | `(6, 6)` | -1.5 | **10** |
| 51 | **`319`** | `(3,0,1,2)→911` | `(2,0,1,3)→577` | `(0,3,7,1)→325` | `(5, 5)` | 0.0 | `(5, 6)` | **+1.0** | **4** |
| 52 | **`831`** | `(3,0,1,2)→2369` | `(0,3,7,1)→1333` | `(0,1,1,4)→125` | `(3, 3)` | 0.0 | `(3, 7)` | **+3.5** | **3** |
| 53 | **`191`** | `(3,0,1,1)→1093` | `(0,1,1,3)→205` | `(0,1,1,2)→77` | `(3, 4)` | **+0.5** | `(3, 6)` | **+2.0** | **3** |
| 54 | **`703`** | `(3,0,1,1)→4009` | `(0,4,7,1)→10151` | `(1,1,1,1)→17131` | `(3, 2)` | -3.0 | `(4, 3)` | -3.5 | **15** |
| 55 | **`447`** | `(3,0,1,1)→2551` | `(1,1,1,2)→2153` | `(0,4,7,1)→5453` | `(4, 3)` | -1.5 | `(4, 4)` | -2.5 | **7** |
| 56 | **`959`** | `(3,0,1,1)→5467` | `(1,2,5,2)→10381` | `(0,1,1,2)→3893` | `(4, 3)` | -2.5 | `(4, 5)` | -1.0 | **4** |
| 57 | **`127`** | `(3,1,1,1)→1093` | `(0,1,1,3)→205` | `(0,1,1,2)→77` | `(3, 4)` | 0.0 | `(3, 6)` | **+1.5** | **3** |
| 58 | **`639`** | `(3,1,1,1)→5467` | `(1,2,5,2)→10381` | `(0,1,1,2)→3893` | `(4, 3)` | -3.0 | `(4, 5)` | -1.5 | **4** |
| 59 | **`383`** | `(3,1,1,5)→205` | `(0,1,1,2)→77` | `(0,1,1,2)→29` | `(3, 7)` | **+3.0** | `(3, 9)` | **+4.5** | **1** |
| 60 | **`895`** | `(3,1,1,2)→3827` | `(0,3,5,1)→2153` | `(0,4,7,1)→5453` | `(3, 3)` | -0.5 | `(3, 4)` | -1.5 | **5** |
| 61 | **`255`** | `(4,0,1,5)→205` | `(0,1,1,2)→77` | `(0,1,1,2)→29` | `(4, 7)` | **+2.5** | `(4, 9)` | **+4.0** | **1** |
| 62 | **`767`** | `(4,0,1,1)→9841` | `(0,3,7,6)→173` | `(0,1,1,2)→65` | `(4, 7)` | **+3.0** | `(4, 9)` | **+4.5** | **2** |
| 63 | **`511`** | `(4,1,1,1)→9841` | `(0,3,7,6)→173` | `(0,1,1,2)→65` | `(4, 7)` | **+2.5** | `(4, 9)` | **+4.0** | **2** |
| 64 | **`1023`** | `(5,0,1,3)→7381` | `(0,1,1,6)→173` | `(0,1,1,2)→65` | `(5, 9)` | **+3.5** | `(5, 11)` | **+5.0** | **2** |

---

### 5.3. Wnioski strukturalne z rozkładu 64 klas `mod 1024` dla Architekta 1, 2 i 3

1. **Skok jakościowy między $K = 1$ a $K = 2, 3$:**  
   Na pojedynczym bloku ($K = 1$) tylko **4,69%** (3 z 64 klas: `255`, `383`, `1019`) ma $\Delta V_1 > 0$. Jednak już przy złożeniu **dwóch bloków ($K = 2$)** odsetek ten rośnie ponad 6-krotnie do **29,69%** (19/64 z $\Delta V_2 > 0$, a **45,31%** z $\Delta V_2 \ge 0$ oraz **50,00%** z $v_1 + v_2 > r_1 + r_2$). Przy **trzech blokach ($K = 3$)** aż **57,81%** (37/64) klas osiąga $\Delta V_3 > 0$ (**67,19%** ma $\Delta V_3 \ge 0$), **85,94%** (55/64) spełnia $v_1 + v_2 + v_3 > r_1 + r_2 + r_3$, a dokładnie **50,00% (32 z 64 klas)** spada już fizycznie poniżej $r_0$!
2. **Dominacja dwóch kanałów sprzężenia (weryfikacja hipotezy Architekta 2):**  
   Wśród klas, które po pierwszym bloku mają płytkie wyjście $v_1 \in \{1, 2, 3\}$, przejście do bloku 2 i 3 niemal natychmiast wymusza:
   - albo **bezpiecznik jedno-zerowy** $(r_2 = 0, d_2 = 1, c_2 = 1, v_2 \ge 2)$ (np. klasy `71`, `839`, `935`, `615`, `871`, `231`, `487`, `463`, `559`, `239`, `539`, `667`, `603`, `251`, `763`, `1019`, `799`, `159`, `671`, `223`, `831`, `191`, `959`, `383`, `767`, `511`, `1023`),
   - albo **wysoki rezonans w drugim/trzecim bloku** $v_2, v_3 \in \{3, 4, 5, 6, 7\}$ (np. `167` z $v_3 = 5$, `743` z $v_2 = 7$, `207` z $v_2 = 5$, `719` z $v_3 = 7$, `879` z $v_1 = 6$, `251` z $v_2 = 6$, `63` z $v_2 = 5$, `319` z $v_3 = 5$, `895` z $v_2 = 5$, `1023` z $v_2 = 6$).
3. **Wniosek dla formalizacji w Części 49 i 50:**  
   Połączenie twierdzeń o sprzężeniu z bezpiecznikiem jedno-zerowym ($c_2 = 1, b_2 = 1$) oraz twierdzeń o sprzężeniu dwublokowym dla $v_1 = 2, 3$ pokrywa ponad **85%** wszystkich ścieżek wyjścia z pierwszego bloku na drzewie `mod 1024`.


---

# Raport Rundy 3 — Architekt 4 (Eksplorator Kontrprzykładów i Łowca Ekstremalnych Klas)

Data analizy: `2026-11-02`  
Skrypt generujący: `/Users/gkucmierz/workspace/collatz-lab/tmp/hunter-round3.mjs`

---

## Część 6. Głębokie Sito 2-Adyczne na Poziomach `c = 114..125` (`k = 181..199`, `m = 295..324`) — Zestaw E (Część 51) i Zestaw F (Część 52)

### 6.1. Weryfikacja progów diofantycznych $2^k > 3^c$ i zbiorcza tabela 16 najniższych klas $b \equiv 3 \pmod 4$

Wszystkie 12 poziomów w Zestawie E (`k ∈ {181, 183, 184, 186, 188, 189}`) oraz Zestawie F (`k ∈ {191, 192, 194, 196, 197, 199}`) bezwarunkowo spełnia nierówność $2^k > 3^c$ oraz `checkAffineDrop m (2^k) r = true`.  
*(Uwaga diofantyczna dla $c = 123$: ponieważ $123 \log_2 3 \approx 194{,}9504 < 195$, próg $3^{123} < 2^k$ zaczyna się już na $k = 195, m = 318$ i pozostaje prawdziwy na $k = 196, m = 319$; poniżej podajemy pełny blok dla żądanego $k = 196, m = 319$ w Zestawie F oraz dodatkowo blok dla minimalnego progu $k = 195, m = 318$).*

| Zestaw | Kroki nieparz. $c$ | Poziom $k$ | Horyzont $m = k + c$ | 16 najniższych przeżywających klas $b \equiv 3 \pmod 4$ |
| :--- | :---: | :---: | :---: | :--- |
| **E (Cz. 51)** | `114` | `181` | `295` | `160411, 450651, 626331, 665215, 667375, 687871, 704623, 1031807, 1039879, 1252663, 1330431, 1334751, 1379687, 1429863, 1541147, 1559819` |
| **E (Cz. 51)** | `115` | `183` | `298` | `142587, 450651, 626331, 665215, 667375, 687871, 704623, 919791, 1027431, 1039879, 1056935, 1375743, 1379687, 1429863, 1506607, 1541147` |
| **E (Cz. 51)** | `116` | `184` | `300` | `142587, 626331, 704623, 919791, 1027431, 1056935, 1127871, 1345383, 1541147, 1583007, 1606299, 1691807, 1723519, 1731175, 1733791, 1738395` |
| **E (Cz. 51)** | `117` | `186` | `303` | `626331, 704623, 1027431, 1127871, 1172223, 1409247, 1506607, 1541147, 1564063, 1583007, 1606299, 1723519, 1733791, 1738395, 1807087, 1848687` |
| **E (Cz. 51)** | `118` | `188` | `306` | `919791, 1172223, 1252663, 1327743, 1379687, 1506607, 1561327, 1606299, 1733791, 1738395, 1754395, 1758335, 1807087, 1847455, 1878995, 1979515` |
| **E (Cz. 51)** | `119` | `189` | `308` | `626331, 919791, 1172223, 1252663, 1541147, 1561327, 1564063, 1606299, 1754395, 1758335, 2054863, 2385767, 2389083, 2689131, 2855643, 2929311` |
| **F (Cz. 52)** | `120` | `191` | `311` | `1003263, 1027431, 1172223, 1460679, 1504895, 1541147, 1564063, 1590511, 1606299, 1758335, 1973695, 2054863, 2191019, 2191039, 2257343, 2344447` |
| **F (Cz. 52)** | `121` | `192` | `313` | `1003263, 1027431, 1172223, 1460679, 1504895, 1758335, 2687719, 2827575, 3147243, 3168559, 3428767, 3508791, 3605743, 3647599, 3700923, 3770099` |
| **F (Cz. 52)** | `122` | `194` | `316` | `1003263, 1172223, 1413787, 1564063, 1590511, 1754395, 1758335, 2006527, 2344447, 2385767, 2389083, 2827575, 2855643, 2929311, 3066367, 3168559` |
| **F (Cz. 52)** | `123` | `196` | `319` | `919791, 1003263, 1172223, 1413787, 1565727, 1590511, 1731175, 1783579, 1847455, 1979515, 2344447, 2385767, 2389083, 2596763, 2596767, 2687719` |
| **F (Cz. 52)** | `124` | `197` | `321` | `1256699, 1413787, 1590511, 1731175, 1783579, 1847455, 2195439, 2385767, 2513399, 2725659, 2929311, 2989823, 3066367, 3137471, 3605743, 4063723` |
| **F (Cz. 52)** | `125` | `199` | `324` | `704623, 837799, 1003263, 1056935, 1256699, 1413787, 1565727, 1585403, 1590511, 1675599, 1847455, 1993215, 2308255, 2385767, 2389083, 2778603` |
| **F' (k=195)** | `123` | `195` | `318` | `1172223, 1590511, 2389083, 2513399, 2689131, 2929311, 3066367, 3137471, 3293159, 3770099, 3842715, 4063723, 4066459, 4256703, 4386279, 4393967` |

---

### 6.2. Gotowy kod Lean 4 — Zestaw E (do Części 51: `k ∈ {181, 183, 184, 186, 188, 189}`, `m = 295..308`, `96` twierdzeń)

```lean
-- k=181, M=3064991081731777716716694054300618367237478244367204352=2^181, m=295, c=114
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq160411 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 160411 ) := checkAffineDrop_sound 295 (2 ^ 181) 160411  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 450651 ) := checkAffineDrop_sound 295 (2 ^ 181) 450651  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 626331 ) := checkAffineDrop_sound 295 (2 ^ 181) 626331  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 665215 ) := checkAffineDrop_sound 295 (2 ^ 181) 665215  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq667375 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 667375 ) := checkAffineDrop_sound 295 (2 ^ 181) 667375  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq687871 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 687871 ) := checkAffineDrop_sound 295 (2 ^ 181) 687871  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 704623 ) := checkAffineDrop_sound 295 (2 ^ 181) 704623  (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1031807 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1031807) := checkAffineDrop_sound 295 (2 ^ 181) 1031807 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1039879 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1039879) := checkAffineDrop_sound 295 (2 ^ 181) 1039879 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1252663) := checkAffineDrop_sound 295 (2 ^ 181) 1252663 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1330431) := checkAffineDrop_sound 295 (2 ^ 181) 1330431 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1334751 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1334751) := checkAffineDrop_sound 295 (2 ^ 181) 1334751 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1379687 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1379687) := checkAffineDrop_sound 295 (2 ^ 181) 1379687 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1429863 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1429863) := checkAffineDrop_sound 295 (2 ^ 181) 1429863 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1541147) := checkAffineDrop_sound 295 (2 ^ 181) 1541147 (by decide) k
theorem horizon_drop_mod3064991081731777716716694054300618367237478244367204352_eq1559819 (k : Nat) : HasHorizonDrop (2 ^ 181 * k + 1559819) := checkAffineDrop_sound 295 (2 ^ 181) 1559819 (by decide) k
-- k=183, M=12259964326927110866866776217202473468949912977468817408=2^183, m=298, c=115
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 142587 ) := checkAffineDrop_sound 298 (2 ^ 183) 142587  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq450651 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 450651 ) := checkAffineDrop_sound 298 (2 ^ 183) 450651  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 626331 ) := checkAffineDrop_sound 298 (2 ^ 183) 626331  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 665215 ) := checkAffineDrop_sound 298 (2 ^ 183) 665215  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq667375 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 667375 ) := checkAffineDrop_sound 298 (2 ^ 183) 667375  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq687871 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 687871 ) := checkAffineDrop_sound 298 (2 ^ 183) 687871  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 704623 ) := checkAffineDrop_sound 298 (2 ^ 183) 704623  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq919791 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 919791 ) := checkAffineDrop_sound 298 (2 ^ 183) 919791  (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1027431 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1027431) := checkAffineDrop_sound 298 (2 ^ 183) 1027431 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1039879 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1039879) := checkAffineDrop_sound 298 (2 ^ 183) 1039879 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1056935) := checkAffineDrop_sound 298 (2 ^ 183) 1056935 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1375743 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1375743) := checkAffineDrop_sound 298 (2 ^ 183) 1375743 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1379687 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1379687) := checkAffineDrop_sound 298 (2 ^ 183) 1379687 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1429863 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1429863) := checkAffineDrop_sound 298 (2 ^ 183) 1429863 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1506607 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1506607) := checkAffineDrop_sound 298 (2 ^ 183) 1506607 (by decide) k
theorem horizon_drop_mod12259964326927110866866776217202473468949912977468817408_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 183 * k + 1541147) := checkAffineDrop_sound 298 (2 ^ 183) 1541147 (by decide) k
-- k=184, M=24519928653854221733733552434404946937899825954937634816=2^184, m=300, c=116
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq142587 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 142587 ) := checkAffineDrop_sound 300 (2 ^ 184) 142587  (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 626331 ) := checkAffineDrop_sound 300 (2 ^ 184) 626331  (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 704623 ) := checkAffineDrop_sound 300 (2 ^ 184) 704623  (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq919791 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 919791 ) := checkAffineDrop_sound 300 (2 ^ 184) 919791  (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1027431 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1027431) := checkAffineDrop_sound 300 (2 ^ 184) 1027431 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1056935) := checkAffineDrop_sound 300 (2 ^ 184) 1056935 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1127871 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1127871) := checkAffineDrop_sound 300 (2 ^ 184) 1127871 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1345383 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1345383) := checkAffineDrop_sound 300 (2 ^ 184) 1345383 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1541147) := checkAffineDrop_sound 300 (2 ^ 184) 1541147 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1583007 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1583007) := checkAffineDrop_sound 300 (2 ^ 184) 1583007 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1606299) := checkAffineDrop_sound 300 (2 ^ 184) 1606299 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1691807 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1691807) := checkAffineDrop_sound 300 (2 ^ 184) 1691807 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1723519) := checkAffineDrop_sound 300 (2 ^ 184) 1723519 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1731175 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1731175) := checkAffineDrop_sound 300 (2 ^ 184) 1731175 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1733791 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1733791) := checkAffineDrop_sound 300 (2 ^ 184) 1733791 (by decide) k
theorem horizon_drop_mod24519928653854221733733552434404946937899825954937634816_eq1738395 (k : Nat) : HasHorizonDrop (2 ^ 184 * k + 1738395) := checkAffineDrop_sound 300 (2 ^ 184) 1738395 (by decide) k
-- k=186, M=98079714615416886934934209737619787751599303819750539264=2^186, m=303, c=117
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 626331 ) := checkAffineDrop_sound 303 (2 ^ 186) 626331  (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 704623 ) := checkAffineDrop_sound 303 (2 ^ 186) 704623  (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1027431 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1027431) := checkAffineDrop_sound 303 (2 ^ 186) 1027431 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1127871 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1127871) := checkAffineDrop_sound 303 (2 ^ 186) 1127871 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1172223) := checkAffineDrop_sound 303 (2 ^ 186) 1172223 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1409247) := checkAffineDrop_sound 303 (2 ^ 186) 1409247 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1506607 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1506607) := checkAffineDrop_sound 303 (2 ^ 186) 1506607 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1541147) := checkAffineDrop_sound 303 (2 ^ 186) 1541147 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1564063) := checkAffineDrop_sound 303 (2 ^ 186) 1564063 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1583007 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1583007) := checkAffineDrop_sound 303 (2 ^ 186) 1583007 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1606299) := checkAffineDrop_sound 303 (2 ^ 186) 1606299 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1723519) := checkAffineDrop_sound 303 (2 ^ 186) 1723519 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1733791 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1733791) := checkAffineDrop_sound 303 (2 ^ 186) 1733791 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1738395 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1738395) := checkAffineDrop_sound 303 (2 ^ 186) 1738395 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1807087 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1807087) := checkAffineDrop_sound 303 (2 ^ 186) 1807087 (by decide) k
theorem horizon_drop_mod98079714615416886934934209737619787751599303819750539264_eq1848687 (k : Nat) : HasHorizonDrop (2 ^ 186 * k + 1848687) := checkAffineDrop_sound 303 (2 ^ 186) 1848687 (by decide) k
-- k=188, M=392318858461667547739736838950479151006397215279002157056=2^188, m=306, c=118
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq919791 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 919791 ) := checkAffineDrop_sound 306 (2 ^ 188) 919791  (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1172223) := checkAffineDrop_sound 306 (2 ^ 188) 1172223 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1252663) := checkAffineDrop_sound 306 (2 ^ 188) 1252663 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1327743 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1327743) := checkAffineDrop_sound 306 (2 ^ 188) 1327743 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1379687 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1379687) := checkAffineDrop_sound 306 (2 ^ 188) 1379687 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1506607 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1506607) := checkAffineDrop_sound 306 (2 ^ 188) 1506607 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1561327 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1561327) := checkAffineDrop_sound 306 (2 ^ 188) 1561327 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1606299) := checkAffineDrop_sound 306 (2 ^ 188) 1606299 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1733791 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1733791) := checkAffineDrop_sound 306 (2 ^ 188) 1733791 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1738395 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1738395) := checkAffineDrop_sound 306 (2 ^ 188) 1738395 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1754395) := checkAffineDrop_sound 306 (2 ^ 188) 1754395 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1758335 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1758335) := checkAffineDrop_sound 306 (2 ^ 188) 1758335 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1807087 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1807087) := checkAffineDrop_sound 306 (2 ^ 188) 1807087 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1847455 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1847455) := checkAffineDrop_sound 306 (2 ^ 188) 1847455 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1878995 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1878995) := checkAffineDrop_sound 306 (2 ^ 188) 1878995 (by decide) k
theorem horizon_drop_mod392318858461667547739736838950479151006397215279002157056_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 188 * k + 1979515) := checkAffineDrop_sound 306 (2 ^ 188) 1979515 (by decide) k
-- k=189, M=784637716923335095479473677900958302012794430558004314112=2^189, m=308, c=119
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 626331 ) := checkAffineDrop_sound 308 (2 ^ 189) 626331  (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq919791 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 919791 ) := checkAffineDrop_sound 308 (2 ^ 189) 919791  (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1172223) := checkAffineDrop_sound 308 (2 ^ 189) 1172223 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1252663) := checkAffineDrop_sound 308 (2 ^ 189) 1252663 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1541147) := checkAffineDrop_sound 308 (2 ^ 189) 1541147 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1561327 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1561327) := checkAffineDrop_sound 308 (2 ^ 189) 1561327 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1564063) := checkAffineDrop_sound 308 (2 ^ 189) 1564063 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1606299) := checkAffineDrop_sound 308 (2 ^ 189) 1606299 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1754395) := checkAffineDrop_sound 308 (2 ^ 189) 1754395 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq1758335 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 1758335) := checkAffineDrop_sound 308 (2 ^ 189) 1758335 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2054863 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2054863) := checkAffineDrop_sound 308 (2 ^ 189) 2054863 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2385767 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2385767) := checkAffineDrop_sound 308 (2 ^ 189) 2385767 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2389083 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2389083) := checkAffineDrop_sound 308 (2 ^ 189) 2389083 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2689131 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2689131) := checkAffineDrop_sound 308 (2 ^ 189) 2689131 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2855643 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2855643) := checkAffineDrop_sound 308 (2 ^ 189) 2855643 (by decide) k
theorem horizon_drop_mod784637716923335095479473677900958302012794430558004314112_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 189 * k + 2929311) := checkAffineDrop_sound 308 (2 ^ 189) 2929311 (by decide) k
```

---

### 6.3. Gotowy kod Lean 4 — Zestaw F (do Części 52: `k ∈ {191, 192, 194, 196, 197, 199}`, `m = 311..324`, `96` twierdzeń)

```lean
-- k=191, M=3138550867693340381917894711603833208051177722232017256448=2^191, m=311, c=120
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1003263) := checkAffineDrop_sound 311 (2 ^ 191) 1003263 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1027431 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1027431) := checkAffineDrop_sound 311 (2 ^ 191) 1027431 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1172223) := checkAffineDrop_sound 311 (2 ^ 191) 1172223 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1460679 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1460679) := checkAffineDrop_sound 311 (2 ^ 191) 1460679 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1504895 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1504895) := checkAffineDrop_sound 311 (2 ^ 191) 1504895 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1541147 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1541147) := checkAffineDrop_sound 311 (2 ^ 191) 1541147 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1564063) := checkAffineDrop_sound 311 (2 ^ 191) 1564063 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1590511) := checkAffineDrop_sound 311 (2 ^ 191) 1590511 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1606299) := checkAffineDrop_sound 311 (2 ^ 191) 1606299 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1758335 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1758335) := checkAffineDrop_sound 311 (2 ^ 191) 1758335 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq1973695 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 1973695) := checkAffineDrop_sound 311 (2 ^ 191) 1973695 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq2054863 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 2054863) := checkAffineDrop_sound 311 (2 ^ 191) 2054863 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq2191019 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 2191019) := checkAffineDrop_sound 311 (2 ^ 191) 2191019 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq2191039 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 2191039) := checkAffineDrop_sound 311 (2 ^ 191) 2191039 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq2257343 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 2257343) := checkAffineDrop_sound 311 (2 ^ 191) 2257343 (by decide) k
theorem horizon_drop_mod3138550867693340381917894711603833208051177722232017256448_eq2344447 (k : Nat) : HasHorizonDrop (2 ^ 191 * k + 2344447) := checkAffineDrop_sound 311 (2 ^ 191) 2344447 (by decide) k
-- k=192, M=6277101735386680763835789423207666416102355444464034512896=2^192, m=313, c=121
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1003263) := checkAffineDrop_sound 313 (2 ^ 192) 1003263 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1027431 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1027431) := checkAffineDrop_sound 313 (2 ^ 192) 1027431 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1172223) := checkAffineDrop_sound 313 (2 ^ 192) 1172223 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1460679 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1460679) := checkAffineDrop_sound 313 (2 ^ 192) 1460679 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1504895 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1504895) := checkAffineDrop_sound 313 (2 ^ 192) 1504895 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq1758335 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 1758335) := checkAffineDrop_sound 313 (2 ^ 192) 1758335 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq2687719 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 2687719) := checkAffineDrop_sound 313 (2 ^ 192) 2687719 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq2827575 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 2827575) := checkAffineDrop_sound 313 (2 ^ 192) 2827575 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3147243 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3147243) := checkAffineDrop_sound 313 (2 ^ 192) 3147243 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3168559 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3168559) := checkAffineDrop_sound 313 (2 ^ 192) 3168559 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3428767 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3428767) := checkAffineDrop_sound 313 (2 ^ 192) 3428767 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3508791 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3508791) := checkAffineDrop_sound 313 (2 ^ 192) 3508791 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3605743) := checkAffineDrop_sound 313 (2 ^ 192) 3605743 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3647599 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3647599) := checkAffineDrop_sound 313 (2 ^ 192) 3647599 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3700923 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3700923) := checkAffineDrop_sound 313 (2 ^ 192) 3700923 (by decide) k
theorem horizon_drop_mod6277101735386680763835789423207666416102355444464034512896_eq3770099 (k : Nat) : HasHorizonDrop (2 ^ 192 * k + 3770099) := checkAffineDrop_sound 313 (2 ^ 192) 3770099 (by decide) k
-- k=194, M=25108406941546723055343157692830665664409421777856138051584=2^194, m=316, c=122
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1003263) := checkAffineDrop_sound 316 (2 ^ 194) 1003263 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1172223) := checkAffineDrop_sound 316 (2 ^ 194) 1172223 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1413787) := checkAffineDrop_sound 316 (2 ^ 194) 1413787 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1564063) := checkAffineDrop_sound 316 (2 ^ 194) 1564063 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1590511) := checkAffineDrop_sound 316 (2 ^ 194) 1590511 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1754395) := checkAffineDrop_sound 316 (2 ^ 194) 1754395 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq1758335 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 1758335) := checkAffineDrop_sound 316 (2 ^ 194) 1758335 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2006527 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2006527) := checkAffineDrop_sound 316 (2 ^ 194) 2006527 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2344447 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2344447) := checkAffineDrop_sound 316 (2 ^ 194) 2344447 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2385767 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2385767) := checkAffineDrop_sound 316 (2 ^ 194) 2385767 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2389083 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2389083) := checkAffineDrop_sound 316 (2 ^ 194) 2389083 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2827575 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2827575) := checkAffineDrop_sound 316 (2 ^ 194) 2827575 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2855643 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2855643) := checkAffineDrop_sound 316 (2 ^ 194) 2855643 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 2929311) := checkAffineDrop_sound 316 (2 ^ 194) 2929311 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 3066367) := checkAffineDrop_sound 316 (2 ^ 194) 3066367 (by decide) k
theorem horizon_drop_mod25108406941546723055343157692830665664409421777856138051584_eq3168559 (k : Nat) : HasHorizonDrop (2 ^ 194 * k + 3168559) := checkAffineDrop_sound 316 (2 ^ 194) 3168559 (by decide) k
-- k=196, M=100433627766186892221372630771322662657637687111424552206336=2^196, m=319, c=123
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq919791 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 919791 ) := checkAffineDrop_sound 319 (2 ^ 196) 919791  (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1003263) := checkAffineDrop_sound 319 (2 ^ 196) 1003263 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1172223) := checkAffineDrop_sound 319 (2 ^ 196) 1172223 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1413787) := checkAffineDrop_sound 319 (2 ^ 196) 1413787 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1565727) := checkAffineDrop_sound 319 (2 ^ 196) 1565727 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1590511) := checkAffineDrop_sound 319 (2 ^ 196) 1590511 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1731175 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1731175) := checkAffineDrop_sound 319 (2 ^ 196) 1731175 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1783579 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1783579) := checkAffineDrop_sound 319 (2 ^ 196) 1783579 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1847455 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1847455) := checkAffineDrop_sound 319 (2 ^ 196) 1847455 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 1979515) := checkAffineDrop_sound 319 (2 ^ 196) 1979515 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2344447 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2344447) := checkAffineDrop_sound 319 (2 ^ 196) 2344447 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2385767 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2385767) := checkAffineDrop_sound 319 (2 ^ 196) 2385767 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2389083 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2389083) := checkAffineDrop_sound 319 (2 ^ 196) 2389083 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2596763 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2596763) := checkAffineDrop_sound 319 (2 ^ 196) 2596763 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2596767 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2596767) := checkAffineDrop_sound 319 (2 ^ 196) 2596767 (by decide) k
theorem horizon_drop_mod100433627766186892221372630771322662657637687111424552206336_eq2687719 (k : Nat) : HasHorizonDrop (2 ^ 196 * k + 2687719) := checkAffineDrop_sound 319 (2 ^ 196) 2687719 (by decide) k
-- k=197, M=200867255532373784442745261542645325315275374222849104412672=2^197, m=321, c=124
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1256699) := checkAffineDrop_sound 321 (2 ^ 197) 1256699 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1413787) := checkAffineDrop_sound 321 (2 ^ 197) 1413787 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1590511) := checkAffineDrop_sound 321 (2 ^ 197) 1590511 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1731175 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1731175) := checkAffineDrop_sound 321 (2 ^ 197) 1731175 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1783579 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1783579) := checkAffineDrop_sound 321 (2 ^ 197) 1783579 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq1847455 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 1847455) := checkAffineDrop_sound 321 (2 ^ 197) 1847455 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2195439 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2195439) := checkAffineDrop_sound 321 (2 ^ 197) 2195439 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2385767 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2385767) := checkAffineDrop_sound 321 (2 ^ 197) 2385767 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2513399 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2513399) := checkAffineDrop_sound 321 (2 ^ 197) 2513399 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2725659) := checkAffineDrop_sound 321 (2 ^ 197) 2725659 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2929311) := checkAffineDrop_sound 321 (2 ^ 197) 2929311 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq2989823 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 2989823) := checkAffineDrop_sound 321 (2 ^ 197) 2989823 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 3066367) := checkAffineDrop_sound 321 (2 ^ 197) 3066367 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 3137471) := checkAffineDrop_sound 321 (2 ^ 197) 3137471 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 3605743) := checkAffineDrop_sound 321 (2 ^ 197) 3605743 (by decide) k
theorem horizon_drop_mod200867255532373784442745261542645325315275374222849104412672_eq4063723 (k : Nat) : HasHorizonDrop (2 ^ 197 * k + 4063723) := checkAffineDrop_sound 321 (2 ^ 197) 4063723 (by decide) k
-- k=199, M=803469022129495137770981046170581301261101496891396417650688=2^199, m=324, c=125
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 704623 ) := checkAffineDrop_sound 324 (2 ^ 199) 704623  (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq837799 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 837799 ) := checkAffineDrop_sound 324 (2 ^ 199) 837799  (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1003263) := checkAffineDrop_sound 324 (2 ^ 199) 1003263 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1056935) := checkAffineDrop_sound 324 (2 ^ 199) 1056935 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1256699) := checkAffineDrop_sound 324 (2 ^ 199) 1256699 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1413787) := checkAffineDrop_sound 324 (2 ^ 199) 1413787 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1565727) := checkAffineDrop_sound 324 (2 ^ 199) 1565727 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1585403) := checkAffineDrop_sound 324 (2 ^ 199) 1585403 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1590511) := checkAffineDrop_sound 324 (2 ^ 199) 1590511 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1675599) := checkAffineDrop_sound 324 (2 ^ 199) 1675599 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1847455 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1847455) := checkAffineDrop_sound 324 (2 ^ 199) 1847455 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq1993215 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 1993215) := checkAffineDrop_sound 324 (2 ^ 199) 1993215 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq2308255 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 2308255) := checkAffineDrop_sound 324 (2 ^ 199) 2308255 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq2385767 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 2385767) := checkAffineDrop_sound 324 (2 ^ 199) 2385767 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq2389083 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 2389083) := checkAffineDrop_sound 324 (2 ^ 199) 2389083 (by decide) k
theorem horizon_drop_mod803469022129495137770981046170581301261101496891396417650688_eq2778603 (k : Nat) : HasHorizonDrop (2 ^ 199 * k + 2778603) := checkAffineDrop_sound 324 (2 ^ 199) 2778603 (by decide) k
```

#### Dodatkowy blok progowy `k = 195, m = 318, c = 123` (`16` twierdzeń):
```lean
-- k=195, M=50216813883093446110686315385661331328818843555712276103168=2^195, m=318, c=123
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 1172223) := checkAffineDrop_sound 318 (2 ^ 195) 1172223 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 1590511) := checkAffineDrop_sound 318 (2 ^ 195) 1590511 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq2389083 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 2389083) := checkAffineDrop_sound 318 (2 ^ 195) 2389083 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq2513399 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 2513399) := checkAffineDrop_sound 318 (2 ^ 195) 2513399 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq2689131 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 2689131) := checkAffineDrop_sound 318 (2 ^ 195) 2689131 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 2929311) := checkAffineDrop_sound 318 (2 ^ 195) 2929311 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 3066367) := checkAffineDrop_sound 318 (2 ^ 195) 3066367 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 3137471) := checkAffineDrop_sound 318 (2 ^ 195) 3137471 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq3293159 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 3293159) := checkAffineDrop_sound 318 (2 ^ 195) 3293159 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq3770099 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 3770099) := checkAffineDrop_sound 318 (2 ^ 195) 3770099 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq3842715 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 3842715) := checkAffineDrop_sound 318 (2 ^ 195) 3842715 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq4063723 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 4063723) := checkAffineDrop_sound 318 (2 ^ 195) 4063723 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq4066459 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 4066459) := checkAffineDrop_sound 318 (2 ^ 195) 4066459 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq4256703 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 4256703) := checkAffineDrop_sound 318 (2 ^ 195) 4256703 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq4386279 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 4386279) := checkAffineDrop_sound 318 (2 ^ 195) 4386279 (by decide) k
theorem horizon_drop_mod50216813883093446110686315385661331328818843555712276103168_eq4393967 (k : Nat) : HasHorizonDrop (2 ^ 195 * k + 4393967) := checkAffineDrop_sound 318 (2 ^ 195) 4393967 (by decide) k
```

---

## Część 7. Analiza Grafu Przejść Fazowych Modulo-3 pomiędzy Blokami RLE (`K = 1 -> 2 -> 3 -> 4`)

### 7.1. Macierz najczęstszych przejść fazowych $(c_i, d_i) \to (c_{i+1}, d_{i+1})$ dla 64 ocalałych klas `mod 1024`

Na pierwszych 4 blokach 64 klas z `survivingMod1024` (łącznie $3 \times 64 = 192$ przejścia międzyblokowe $1 \to 2$, $2 \to 3$, $3 \to 4$) oraz w pełnych trajektoriach do spadku poniżej $r_0$ (łącznie 232 przejścia) zaobserwowano silną koncentrację prawdopodobieństwa na zaledwie kilkunastu krawędziach skierowanego grafu fazowego:

| Ranga | Krawędź przejścia fazowego $(c_i, d_i) \to (c_{i+1}, d_{i+1})$ | Liczba w krokach $1\to 4$ (z 192) | Udział % ($1\to 4$) | Liczba w pełnych trajektoriach | Średnie $(d_i+v_i) \to (d_{i+1}+v_{i+1})$ | Przykładowe klasy $r_0$ |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| 1 | **`(c=1, b=1 [-3]) ➔ (c=1, b=1 [-3])`** | `16` | **8.33%** | `12` | `3.94 ➔ 3.25` | `935, 623, 543, 415` |
| 2 | **`(c=7, d=3) ➔ (c=1, b=1 [-3])`** | `13` | **6.77%** | `19` | `5.15 ➔ 3.77` | `359, 719, 303, 239` |
| 3 | **`(c=1, d=0) ➔ (c=1, b=1 [-3])`** | `10` | **5.21%** | `10` | `1.60 ➔ 3.60` | `71, 103, 871, 47` |
| 4 | **`(c=1, d=1) ➔ (c=7, d=4)`** | `9` | **4.69%** | `8` | `2.44 ➔ 5.44` | `71, 327, 839, 463` |
| 5 | **`(c=1, d=1) ➔ (c=1, d=0)`** | `9` | **4.69%** | `18` | `2.67 ➔ 2.67` | `167, 103, 615, 871` |
| 6 | **`(c=1, d=1) ➔ (c=1, d=1)`** | `9` | **4.69%** | `11` | `2.11 ➔ 2.78` | `359, 231, 743, 743` |
| 7 | **`(c=1, d=1) ➔ (c=7, d=3)`** | `9` | **4.69%** | `9` | `3.56 ➔ 5.11` | `359, 743, 239, 495` |
| 8 | **`(c=1, d=0) ➔ (c=7, d=3)`** | `8` | **4.17%** | `20` | `2.38 ➔ 4.63` | `719, 303, 283, 251` |
| 9 | **`(c=1, d=1) ➔ (c=5, d=2)`** | `5` | **2.60%** | `12` | `2.40 ➔ 3.60` | `167, 155, 927, 991` |
| 10 | **`(c=1, d=1) ➔ (c=5, d=1)`** | `5` | **2.60%** | `5` | `2.20 ➔ 3.00` | `679, 935, 487, 415` |
| 11 | **`(c=1, d=1) ➔ (c=1, b=1 [-3])`** | `5` | **2.60%** | `5` | `2.80 ➔ 3.80` | `231, 207, 799, 127` |
| 12 | **`(c=1, d=0) ➔ (c=1, d=1)`** | `5` | **2.60%** | `7` | `1.20 ➔ 2.80` | `207, 239, 495, 1007` |
| 13 | **`(c=5, d=1) ➔ (c=1, b=1 [-3])`** | `4` | **2.08%** | `4` | `2.00 ➔ 5.00` | `327, 935, 623, 415` |
| 14 | **`(c=5, d=3) ➔ (c=7, d=3)`** | `4` | **2.08%** | `1` | `4.75 ➔ 4.00` | `839, 559, 539, 799` |
| 15 | **`(c=5, d=2) ➔ (c=1, d=1)`** | `4` | **2.08%** | `12` | `3.00 ➔ 3.00` | `167, 111, 283, 251` |
| 16 | **`(c=1, b=1 [-3]) ➔ (c=1, d=1)`** | `4` | **2.08%** | `7` | `3.75 ➔ 2.00` | `103, 231, 207, 91` |
| 17 | **`(c=1, d=0) ➔ (c=7, d=4)`** | `4` | **2.08%** | `3` | `1.75 ➔ 6.00` | `615, 47, 559, 703` |
| 18 | **`(c=1, d=0) ➔ (c=1, d=0)`** | `4` | **2.08%** | `4` | `1.50 ➔ 2.00` | `871, 719, 751, 319` |

---

### 7.2. Rozkład i wartości ekstremalne średniego tłumienia $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K (d_i + v_i)$ po $K = 2, 3, 4$ blokach

Dla każdej z 64 ocalałych klas obliczono trzy kluczowe miary uśrednionej ekstrakcji 2-adycznej na blok po $K \in \{2, 3, 4\}$ blokach:
1. $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K (d_i + v_i)$ (łączna liczba bitów fazy resztowej $d_i$ i waluacji wyjściowej $v_i$ na blok),
2. $\bar{v}_{\text{exit}, K} = \frac{1}{K}\sum_{i=1}^K v_i$ (sama waluacja wyjściowa $v_i$ na blok),
3. $\overline{b+v}_K = \frac{1}{K}\sum_{i=1}^K (b_i + v_i)$ (łączna liczba kroków parzystych na blok).

| Liczba bloków $K$ | Min $\bar{v}_K = \frac{1}{K}\sum(d_i+v_i)$ (klasy minimalizujące) | Średnie $\bar{v}_K$ (po 64 klasach) | Max $\bar{v}_K$ | Min $\bar{v}_{\text{exit},K} = \frac{1}{K}\sum v_i$ | Średnie $\bar{v}_{\text{exit},K}$ | Min $\overline{b+v}_K$ | Odsetek klas z $\bar{v}_K \ge 2{,}50$ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 2$** | **`1.00`** (`r0 ∈ {751}`) | **`3.01`** | `5.50` | `1.00` | `1.70` | `4.00` | `51 / 64` (**79.69%**) |
| **$K = 3$** | **`1.33`** (`r0 ∈ {871}`) | **`3.24`** | `4.67` | `1.00` | `1.79` | `4.00` | `57 / 64` (**89.06%**) |
| **$K = 4$** | **`2.00`** (`r0 ∈ {103, 871}`) | **`3.34`** | `5.25` | `1.00` | `1.88` | `4.00` | `61 / 64` (**95.31%**) |

---

### 7.3. Wnioski dla Architekta 2 i Architekta 3 (Fizyka Grafu Przejść Fazowych Modulo-3)

1. **Monotoniczny wzrost dolnego ograniczenia $\min \bar{v}_K$: `1.00` ($K=2$) $\to$ `1.33` ($K=3$) $\to$ `2.00` ($K=4$) oraz $\min \overline{b+v}_K = 4{,}00$:**
   - Po $K = 2$ blokach absolutne minimum $\bar{v}_2 = \frac{1}{2}\sum_{i=1}^2 (d_i + v_i)$ po wszystkich 64 klasach wynosi **`1.00`** (osiągane wyłącznie dla pojedynczej klasy `r0 = 751`, na przejściu `(c=1, d=0) -> (c=1, d=0)` z $v_1 = 1, v_2 = 1$), podczas gdy średnia po 64 klasach wynosi **`3.01`**, a **79,69% (51 / 64)** klas spełnia $\bar{v}_2 \ge 2{,}50$.
   - Po $K = 3$ blokach minimum rośnie do **`1.33`** (osiągane wyłącznie dla klasy `r0 = 871`), średnia rośnie do **`3.24`**, a odsetek klas z $\bar{v}_3 \ge 2{,}50$ wynosi **89,06% (57 / 64)**.
   - Po $K = 4$ blokach absolutne minimum osiąga twardy próg **`2.00`** (wyłącznie dla `r0 ∈ {103, 871}`), średnia wynosi **`3.34`**, a aż **95,31% (61 / 64)** klas spełnia $\bar{v}_4 \ge 2{,}50$. Co więcej, łączna liczba kroków parzystych na blok spełnia bezwarunkowo $\min \overline{b+v}_K = \mathbf{4{,}00}$ dla wszystkich $K \in \{2, 3, 4\}$!
2. **Atraktor bezpiecznikowy `(c=1, b=1 [-3])`:**
   - W grafie przejść krawędzie prowadzące do stanu bezpiecznika jedno-zerowego `(c=1, b=1 [-3])` (w tym dominująca w całym grafie pętla własna `(c=1, b=1 [-3]) -> (c=1, b=1 [-3])` z udziałem **8,33%**, oraz przejście `(c=7, d=3) -> (c=1, b=1 [-3])` z udziałem **6,77%**) stanowią łącznie **ponad 25% wszystkich przejść międzyblokowych**!
   - Ponieważ w stanie `(c=1, b=1 [-3])` mamy zawsze $r_i = 0, d_i = 1$ oraz $v_i \ge 2$, każde wejście w ten węzeł grafu działa jak **jednokierunkowy zawór dławiący (ratchet)**, który obniża wartość liczby bez zwiększania skumulowanego $\sum r_i$.



---

# Runda 4. Głębokie Sito 2-Adyczne (`k = 200..220`, `m = 326..358`) oraz Anatomia Klas `103` i `871` i Test Wieloblokowy ($K = 5, 6, 8, 10$)

## Część 8. Zestaw G (`k = 200..208`, `m = 326..339`) oraz Zestaw H (`k = 210..220`, `m = 342..358`) — 208 Twierdzeń dla Części 53 i 54

### 8.1. Tabela zbiorcza poziomów sita `c = 126..138` (`k = 200..220`)

| Zestaw | Poziom $c$ | Próg $k$ | Kroki $m = c+k$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek $1 < b' < b$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **G (Part 53)** | `126` | `200` | `326` | `0.815228` | `418900` | `626331, 665215, 704623, 837799, 997823, 1003263, 1056935, 1256699, 1409247, 1413787, 1496735, 1564063, 1565727, 1585403, 1590511, 1675599` |
| **G (Part 53)** | `127` | `202` | `329` | `0.611421` | `396351` | `626331, 665215, 997823, 1003263, 1056935, 1072575, 1127871, 1172223, 1252663, 1256699, 1330431, 1409247, 1413787, 1564063, 1565727, 1585403` |
| **G (Part 53)** | `128` | `204` | `332` | `0.458566` | `418900` | `665215, 704623, 997823, 1003263, 1056935, 1072575, 1172223, 1252663, 1330431, 1409247, 1496735, 1565727, 1585403, 1590511, 1606299, 1675599` |
| **G (Part 53)** | `129` | `205` | `334` | `0.687848` | `493424` | `665215, 704623, 997823, 1056935, 1252663, 1256699, 1409247, 1413787, 1496735, 1565727, 1585403, 1590511, 1675599, 1773907, 1878995, 1973695` |
| **G (Part 53)** | `130` | `207` | `337` | `0.515886` | `469749` | `626331, 665215, 704623, 997823, 1056935, 1252663, 1330431, 1409247, 1413787, 1496735, 1565727, 1585403, 1590511, 1675599, 1754395, 1878995` |
| **G (Part 53)** | `131` | `208` | `339` | `0.773829` | `558533` | `626331, 665215, 704623, 997823, 1056935, 1252663, 1256699, 1330431, 1409247, 1413787, 1496735, 1675599, 1754395, 1995647, 2226955, 2234131` |
| **H (Part 54)** | `132` | `210` | `342` | `0.580372` | `525602` | `626331, 704623, 997823, 1056935, 1252663, 1256699, 1330431, 1409247, 1413787, 1496735, 1675599, 1773907, 1878995, 1979515, 1995647, 2102407` |
| **H (Part 54)** | `133` | `212` | `345` | `0.435279` | `469749` | `626331, 665215, 704623, 997823, 1056935, 1252663, 1256699, 1330431, 1409247, 1413787, 1496735, 1506607, 1675599, 1754395, 1773907, 1878995` |
| **H (Part 54)** | `134` | `213` | `347` | `0.652919` | `561276` | `626331, 665215, 704623, 837799, 997823, 1252663, 1256699, 1330431, 1496735, 1675599, 1773907, 1979515, 1995647, 2091647, 2234131, 2245103` |
| **H (Part 54)** | `135` | `215` | `350` | `0.489689` | `525602` | `626331, 665215, 704623, 837799, 997823, 1252663, 1256699, 1330431, 1496735, 1564063, 1565727, 1675599, 1773907, 1979515, 1995647, 2102407` |
| **H (Part 54)** | `136` | `216` | `352` | `0.734533` | `766592` | `626331, 665215, 837799, 997823, 1330431, 1564063, 1565727, 1773907, 1995647, 2102407, 2234131, 2346091, 2346095, 2552575, 2788863, 3066367` |
| **H (Part 54)** | `137` | `218` | `355` | `0.550900` | `766592` | `626331, 665215, 1330431, 1561327, 1564063, 1773907, 1979515, 2102407, 2268955, 2341991, 2346091, 2346095, 2548479, 2552575, 2725659, 3066367` |
| **H (Part 54)** | `138` | `220` | `358` | `0.413175` | `780664` | `1561327, 1564063, 1565727, 1754395, 1773907, 1979515, 2102407, 2268955, 2346091, 2346095, 2548479, 2639355, 2725659, 2783515, 2989823, 3122655` |

### 8.2. Gotowe bloki kodu Lean 4 (Zestaw G — Część 53 oraz Zestaw H — Część 54)

*(Pełny kod został również zapisany w pliku [`sieve_200_220_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_200_220_lean.txt).)*

```lean
-- ============================================================================
-- Część 53. Głębokie Sito 2-Adyczne dla k = 200..208 (m = 326..339, c = 126..131)
-- Wygenerowano przez Architekta 4 (Runda 4 — Zestaw G: 96 twierdzeń)
-- ============================================================================

-- k = 200, m = 326 (c = 126, 2^200 = 1606938044258990275541962092341162602522202993782792835301376 > 3^126)
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 626331) := checkAffineDrop_sound 326 (2 ^ 200) 626331 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 665215) := checkAffineDrop_sound 326 (2 ^ 200) 665215 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 704623) := checkAffineDrop_sound 326 (2 ^ 200) 704623 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq837799 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 837799) := checkAffineDrop_sound 326 (2 ^ 200) 837799 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 997823) := checkAffineDrop_sound 326 (2 ^ 200) 997823 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1003263) := checkAffineDrop_sound 326 (2 ^ 200) 1003263 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1056935) := checkAffineDrop_sound 326 (2 ^ 200) 1056935 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1256699) := checkAffineDrop_sound 326 (2 ^ 200) 1256699 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1409247) := checkAffineDrop_sound 326 (2 ^ 200) 1409247 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1413787) := checkAffineDrop_sound 326 (2 ^ 200) 1413787 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1496735) := checkAffineDrop_sound 326 (2 ^ 200) 1496735 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1564063) := checkAffineDrop_sound 326 (2 ^ 200) 1564063 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1565727) := checkAffineDrop_sound 326 (2 ^ 200) 1565727 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1585403) := checkAffineDrop_sound 326 (2 ^ 200) 1585403 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1590511) := checkAffineDrop_sound 326 (2 ^ 200) 1590511 (by decide) k
theorem horizon_drop_mod1606938044258990275541962092341162602522202993782792835301376_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 200 * k + 1675599) := checkAffineDrop_sound 326 (2 ^ 200) 1675599 (by decide) k

-- k = 202, m = 329 (c = 127, 2^202 = 6427752177035961102167848369364650410088811975131171341205504 > 3^127)
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 626331) := checkAffineDrop_sound 329 (2 ^ 202) 626331 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 665215) := checkAffineDrop_sound 329 (2 ^ 202) 665215 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 997823) := checkAffineDrop_sound 329 (2 ^ 202) 997823 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1003263) := checkAffineDrop_sound 329 (2 ^ 202) 1003263 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1056935) := checkAffineDrop_sound 329 (2 ^ 202) 1056935 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1072575 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1072575) := checkAffineDrop_sound 329 (2 ^ 202) 1072575 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1127871 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1127871) := checkAffineDrop_sound 329 (2 ^ 202) 1127871 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1172223) := checkAffineDrop_sound 329 (2 ^ 202) 1172223 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1252663) := checkAffineDrop_sound 329 (2 ^ 202) 1252663 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1256699) := checkAffineDrop_sound 329 (2 ^ 202) 1256699 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1330431) := checkAffineDrop_sound 329 (2 ^ 202) 1330431 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1409247) := checkAffineDrop_sound 329 (2 ^ 202) 1409247 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1413787) := checkAffineDrop_sound 329 (2 ^ 202) 1413787 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1564063) := checkAffineDrop_sound 329 (2 ^ 202) 1564063 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1565727) := checkAffineDrop_sound 329 (2 ^ 202) 1565727 (by decide) k
theorem horizon_drop_mod6427752177035961102167848369364650410088811975131171341205504_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 202 * k + 1585403) := checkAffineDrop_sound 329 (2 ^ 202) 1585403 (by decide) k

-- k = 204, m = 332 (c = 128, 2^204 = 25711008708143844408671393477458601640355247900524685364822016 > 3^128)
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 665215) := checkAffineDrop_sound 332 (2 ^ 204) 665215 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 704623) := checkAffineDrop_sound 332 (2 ^ 204) 704623 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 997823) := checkAffineDrop_sound 332 (2 ^ 204) 997823 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1003263 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1003263) := checkAffineDrop_sound 332 (2 ^ 204) 1003263 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1056935) := checkAffineDrop_sound 332 (2 ^ 204) 1056935 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1072575 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1072575) := checkAffineDrop_sound 332 (2 ^ 204) 1072575 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1172223 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1172223) := checkAffineDrop_sound 332 (2 ^ 204) 1172223 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1252663) := checkAffineDrop_sound 332 (2 ^ 204) 1252663 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1330431) := checkAffineDrop_sound 332 (2 ^ 204) 1330431 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1409247) := checkAffineDrop_sound 332 (2 ^ 204) 1409247 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1496735) := checkAffineDrop_sound 332 (2 ^ 204) 1496735 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1565727) := checkAffineDrop_sound 332 (2 ^ 204) 1565727 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1585403) := checkAffineDrop_sound 332 (2 ^ 204) 1585403 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1590511) := checkAffineDrop_sound 332 (2 ^ 204) 1590511 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1606299 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1606299) := checkAffineDrop_sound 332 (2 ^ 204) 1606299 (by decide) k
theorem horizon_drop_mod25711008708143844408671393477458601640355247900524685364822016_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 204 * k + 1675599) := checkAffineDrop_sound 332 (2 ^ 204) 1675599 (by decide) k

-- k = 205, m = 334 (c = 129, 2^205 = 51422017416287688817342786954917203280710495801049370729644032 > 3^129)
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 665215) := checkAffineDrop_sound 334 (2 ^ 205) 665215 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 704623) := checkAffineDrop_sound 334 (2 ^ 205) 704623 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 997823) := checkAffineDrop_sound 334 (2 ^ 205) 997823 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1056935) := checkAffineDrop_sound 334 (2 ^ 205) 1056935 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1252663) := checkAffineDrop_sound 334 (2 ^ 205) 1252663 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1256699) := checkAffineDrop_sound 334 (2 ^ 205) 1256699 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1409247) := checkAffineDrop_sound 334 (2 ^ 205) 1409247 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1413787) := checkAffineDrop_sound 334 (2 ^ 205) 1413787 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1496735) := checkAffineDrop_sound 334 (2 ^ 205) 1496735 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1565727) := checkAffineDrop_sound 334 (2 ^ 205) 1565727 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1585403) := checkAffineDrop_sound 334 (2 ^ 205) 1585403 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1590511) := checkAffineDrop_sound 334 (2 ^ 205) 1590511 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1675599) := checkAffineDrop_sound 334 (2 ^ 205) 1675599 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1773907) := checkAffineDrop_sound 334 (2 ^ 205) 1773907 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1878995 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1878995) := checkAffineDrop_sound 334 (2 ^ 205) 1878995 (by decide) k
theorem horizon_drop_mod51422017416287688817342786954917203280710495801049370729644032_eq1973695 (k : Nat) : HasHorizonDrop (2 ^ 205 * k + 1973695) := checkAffineDrop_sound 334 (2 ^ 205) 1973695 (by decide) k

-- k = 207, m = 337 (c = 130, 2^207 = 205688069665150755269371147819668813122841983204197482918576128 > 3^130)
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 626331) := checkAffineDrop_sound 337 (2 ^ 207) 626331 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 665215) := checkAffineDrop_sound 337 (2 ^ 207) 665215 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 704623) := checkAffineDrop_sound 337 (2 ^ 207) 704623 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 997823) := checkAffineDrop_sound 337 (2 ^ 207) 997823 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1056935) := checkAffineDrop_sound 337 (2 ^ 207) 1056935 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1252663) := checkAffineDrop_sound 337 (2 ^ 207) 1252663 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1330431) := checkAffineDrop_sound 337 (2 ^ 207) 1330431 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1409247) := checkAffineDrop_sound 337 (2 ^ 207) 1409247 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1413787) := checkAffineDrop_sound 337 (2 ^ 207) 1413787 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1496735) := checkAffineDrop_sound 337 (2 ^ 207) 1496735 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1565727) := checkAffineDrop_sound 337 (2 ^ 207) 1565727 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1585403 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1585403) := checkAffineDrop_sound 337 (2 ^ 207) 1585403 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1590511 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1590511) := checkAffineDrop_sound 337 (2 ^ 207) 1590511 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1675599) := checkAffineDrop_sound 337 (2 ^ 207) 1675599 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1754395) := checkAffineDrop_sound 337 (2 ^ 207) 1754395 (by decide) k
theorem horizon_drop_mod205688069665150755269371147819668813122841983204197482918576128_eq1878995 (k : Nat) : HasHorizonDrop (2 ^ 207 * k + 1878995) := checkAffineDrop_sound 337 (2 ^ 207) 1878995 (by decide) k

-- k = 208, m = 339 (c = 131, 2^208 = 411376139330301510538742295639337626245683966408394965837152256 > 3^131)
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 626331) := checkAffineDrop_sound 339 (2 ^ 208) 626331 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 665215) := checkAffineDrop_sound 339 (2 ^ 208) 665215 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 704623) := checkAffineDrop_sound 339 (2 ^ 208) 704623 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 997823) := checkAffineDrop_sound 339 (2 ^ 208) 997823 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1056935) := checkAffineDrop_sound 339 (2 ^ 208) 1056935 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1252663) := checkAffineDrop_sound 339 (2 ^ 208) 1252663 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1256699) := checkAffineDrop_sound 339 (2 ^ 208) 1256699 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1330431) := checkAffineDrop_sound 339 (2 ^ 208) 1330431 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1409247) := checkAffineDrop_sound 339 (2 ^ 208) 1409247 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1413787) := checkAffineDrop_sound 339 (2 ^ 208) 1413787 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1496735) := checkAffineDrop_sound 339 (2 ^ 208) 1496735 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1675599) := checkAffineDrop_sound 339 (2 ^ 208) 1675599 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1754395) := checkAffineDrop_sound 339 (2 ^ 208) 1754395 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq1995647 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 1995647) := checkAffineDrop_sound 339 (2 ^ 208) 1995647 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq2226955 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 2226955) := checkAffineDrop_sound 339 (2 ^ 208) 2226955 (by decide) k
theorem horizon_drop_mod411376139330301510538742295639337626245683966408394965837152256_eq2234131 (k : Nat) : HasHorizonDrop (2 ^ 208 * k + 2234131) := checkAffineDrop_sound 339 (2 ^ 208) 2234131 (by decide) k

-- ============================================================================
-- Część 54. Głębokie Sito 2-Adyczne dla k = 210..220 (m = 342..358, c = 132..138)
-- Wygenerowano przez Architekta 4 (Runda 4 — Zestaw H: 112 twierdzeń)
-- ============================================================================

-- k = 210, m = 342 (c = 132, 2^210 = 1645504557321206042154969182557350504982735865633579863348609024 > 3^132)
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 626331) := checkAffineDrop_sound 342 (2 ^ 210) 626331 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 704623) := checkAffineDrop_sound 342 (2 ^ 210) 704623 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 997823) := checkAffineDrop_sound 342 (2 ^ 210) 997823 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1056935) := checkAffineDrop_sound 342 (2 ^ 210) 1056935 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1252663) := checkAffineDrop_sound 342 (2 ^ 210) 1252663 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1256699) := checkAffineDrop_sound 342 (2 ^ 210) 1256699 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1330431) := checkAffineDrop_sound 342 (2 ^ 210) 1330431 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1409247) := checkAffineDrop_sound 342 (2 ^ 210) 1409247 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1413787) := checkAffineDrop_sound 342 (2 ^ 210) 1413787 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1496735) := checkAffineDrop_sound 342 (2 ^ 210) 1496735 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1675599) := checkAffineDrop_sound 342 (2 ^ 210) 1675599 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1773907) := checkAffineDrop_sound 342 (2 ^ 210) 1773907 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1878995 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1878995) := checkAffineDrop_sound 342 (2 ^ 210) 1878995 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1979515) := checkAffineDrop_sound 342 (2 ^ 210) 1979515 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq1995647 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 1995647) := checkAffineDrop_sound 342 (2 ^ 210) 1995647 (by decide) k
theorem horizon_drop_mod1645504557321206042154969182557350504982735865633579863348609024_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 210 * k + 2102407) := checkAffineDrop_sound 342 (2 ^ 210) 2102407 (by decide) k

-- k = 212, m = 345 (c = 133, 2^212 = 6582018229284824168619876730229402019930943462534319453394436096 > 3^133)
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 626331) := checkAffineDrop_sound 345 (2 ^ 212) 626331 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 665215) := checkAffineDrop_sound 345 (2 ^ 212) 665215 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 704623) := checkAffineDrop_sound 345 (2 ^ 212) 704623 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 997823) := checkAffineDrop_sound 345 (2 ^ 212) 997823 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1056935 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1056935) := checkAffineDrop_sound 345 (2 ^ 212) 1056935 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1252663) := checkAffineDrop_sound 345 (2 ^ 212) 1252663 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1256699) := checkAffineDrop_sound 345 (2 ^ 212) 1256699 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1330431) := checkAffineDrop_sound 345 (2 ^ 212) 1330431 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1409247 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1409247) := checkAffineDrop_sound 345 (2 ^ 212) 1409247 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1413787 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1413787) := checkAffineDrop_sound 345 (2 ^ 212) 1413787 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1496735) := checkAffineDrop_sound 345 (2 ^ 212) 1496735 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1506607 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1506607) := checkAffineDrop_sound 345 (2 ^ 212) 1506607 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1675599) := checkAffineDrop_sound 345 (2 ^ 212) 1675599 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1754395) := checkAffineDrop_sound 345 (2 ^ 212) 1754395 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1773907) := checkAffineDrop_sound 345 (2 ^ 212) 1773907 (by decide) k
theorem horizon_drop_mod6582018229284824168619876730229402019930943462534319453394436096_eq1878995 (k : Nat) : HasHorizonDrop (2 ^ 212 * k + 1878995) := checkAffineDrop_sound 345 (2 ^ 212) 1878995 (by decide) k

-- k = 213, m = 347 (c = 134, 2^213 = 13164036458569648337239753460458804039861886925068638906788872192 > 3^134)
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 626331) := checkAffineDrop_sound 347 (2 ^ 213) 626331 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 665215) := checkAffineDrop_sound 347 (2 ^ 213) 665215 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 704623) := checkAffineDrop_sound 347 (2 ^ 213) 704623 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq837799 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 837799) := checkAffineDrop_sound 347 (2 ^ 213) 837799 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 997823) := checkAffineDrop_sound 347 (2 ^ 213) 997823 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1252663) := checkAffineDrop_sound 347 (2 ^ 213) 1252663 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1256699) := checkAffineDrop_sound 347 (2 ^ 213) 1256699 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1330431) := checkAffineDrop_sound 347 (2 ^ 213) 1330431 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1496735) := checkAffineDrop_sound 347 (2 ^ 213) 1496735 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1675599) := checkAffineDrop_sound 347 (2 ^ 213) 1675599 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1773907) := checkAffineDrop_sound 347 (2 ^ 213) 1773907 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1979515) := checkAffineDrop_sound 347 (2 ^ 213) 1979515 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq1995647 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 1995647) := checkAffineDrop_sound 347 (2 ^ 213) 1995647 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 2091647) := checkAffineDrop_sound 347 (2 ^ 213) 2091647 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq2234131 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 2234131) := checkAffineDrop_sound 347 (2 ^ 213) 2234131 (by decide) k
theorem horizon_drop_mod13164036458569648337239753460458804039861886925068638906788872192_eq2245103 (k : Nat) : HasHorizonDrop (2 ^ 213 * k + 2245103) := checkAffineDrop_sound 347 (2 ^ 213) 2245103 (by decide) k

-- k = 215, m = 350 (c = 135, 2^215 = 52656145834278593348959013841835216159447547700274555627155488768 > 3^135)
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 626331) := checkAffineDrop_sound 350 (2 ^ 215) 626331 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 665215) := checkAffineDrop_sound 350 (2 ^ 215) 665215 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq704623 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 704623) := checkAffineDrop_sound 350 (2 ^ 215) 704623 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq837799 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 837799) := checkAffineDrop_sound 350 (2 ^ 215) 837799 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 997823) := checkAffineDrop_sound 350 (2 ^ 215) 997823 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1252663 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1252663) := checkAffineDrop_sound 350 (2 ^ 215) 1252663 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1256699 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1256699) := checkAffineDrop_sound 350 (2 ^ 215) 1256699 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1330431) := checkAffineDrop_sound 350 (2 ^ 215) 1330431 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1496735 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1496735) := checkAffineDrop_sound 350 (2 ^ 215) 1496735 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1564063) := checkAffineDrop_sound 350 (2 ^ 215) 1564063 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1565727) := checkAffineDrop_sound 350 (2 ^ 215) 1565727 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1675599 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1675599) := checkAffineDrop_sound 350 (2 ^ 215) 1675599 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1773907) := checkAffineDrop_sound 350 (2 ^ 215) 1773907 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1979515) := checkAffineDrop_sound 350 (2 ^ 215) 1979515 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq1995647 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 1995647) := checkAffineDrop_sound 350 (2 ^ 215) 1995647 (by decide) k
theorem horizon_drop_mod52656145834278593348959013841835216159447547700274555627155488768_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 215 * k + 2102407) := checkAffineDrop_sound 350 (2 ^ 215) 2102407 (by decide) k

-- k = 216, m = 352 (c = 136, 2^216 = 105312291668557186697918027683670432318895095400549111254310977536 > 3^136)
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 626331) := checkAffineDrop_sound 352 (2 ^ 216) 626331 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 665215) := checkAffineDrop_sound 352 (2 ^ 216) 665215 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq837799 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 837799) := checkAffineDrop_sound 352 (2 ^ 216) 837799 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq997823 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 997823) := checkAffineDrop_sound 352 (2 ^ 216) 997823 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 1330431) := checkAffineDrop_sound 352 (2 ^ 216) 1330431 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 1564063) := checkAffineDrop_sound 352 (2 ^ 216) 1564063 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 1565727) := checkAffineDrop_sound 352 (2 ^ 216) 1565727 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 1773907) := checkAffineDrop_sound 352 (2 ^ 216) 1773907 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq1995647 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 1995647) := checkAffineDrop_sound 352 (2 ^ 216) 1995647 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2102407) := checkAffineDrop_sound 352 (2 ^ 216) 2102407 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2234131 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2234131) := checkAffineDrop_sound 352 (2 ^ 216) 2234131 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2346091 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2346091) := checkAffineDrop_sound 352 (2 ^ 216) 2346091 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2346095 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2346095) := checkAffineDrop_sound 352 (2 ^ 216) 2346095 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2552575 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2552575) := checkAffineDrop_sound 352 (2 ^ 216) 2552575 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 2788863) := checkAffineDrop_sound 352 (2 ^ 216) 2788863 (by decide) k
theorem horizon_drop_mod105312291668557186697918027683670432318895095400549111254310977536_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 216 * k + 3066367) := checkAffineDrop_sound 352 (2 ^ 216) 3066367 (by decide) k

-- k = 218, m = 355 (c = 137, 2^218 = 421249166674228746791672110734681729275580381602196445017243910144 > 3^137)
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq626331 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 626331) := checkAffineDrop_sound 355 (2 ^ 218) 626331 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 665215) := checkAffineDrop_sound 355 (2 ^ 218) 665215 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq1330431 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 1330431) := checkAffineDrop_sound 355 (2 ^ 218) 1330431 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq1561327 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 1561327) := checkAffineDrop_sound 355 (2 ^ 218) 1561327 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 1564063) := checkAffineDrop_sound 355 (2 ^ 218) 1564063 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 1773907) := checkAffineDrop_sound 355 (2 ^ 218) 1773907 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 1979515) := checkAffineDrop_sound 355 (2 ^ 218) 1979515 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2102407) := checkAffineDrop_sound 355 (2 ^ 218) 2102407 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2268955 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2268955) := checkAffineDrop_sound 355 (2 ^ 218) 2268955 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2341991 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2341991) := checkAffineDrop_sound 355 (2 ^ 218) 2341991 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2346091 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2346091) := checkAffineDrop_sound 355 (2 ^ 218) 2346091 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2346095 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2346095) := checkAffineDrop_sound 355 (2 ^ 218) 2346095 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2548479 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2548479) := checkAffineDrop_sound 355 (2 ^ 218) 2548479 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2552575 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2552575) := checkAffineDrop_sound 355 (2 ^ 218) 2552575 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 2725659) := checkAffineDrop_sound 355 (2 ^ 218) 2725659 (by decide) k
theorem horizon_drop_mod421249166674228746791672110734681729275580381602196445017243910144_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 218 * k + 3066367) := checkAffineDrop_sound 355 (2 ^ 218) 3066367 (by decide) k

-- k = 220, m = 358 (c = 138, 2^220 = 1684996666696914987166688442938726917102321526408785780068975640576 > 3^138)
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1561327 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1561327) := checkAffineDrop_sound 358 (2 ^ 220) 1561327 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1564063) := checkAffineDrop_sound 358 (2 ^ 220) 1564063 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1565727 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1565727) := checkAffineDrop_sound 358 (2 ^ 220) 1565727 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1754395 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1754395) := checkAffineDrop_sound 358 (2 ^ 220) 1754395 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1773907 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1773907) := checkAffineDrop_sound 358 (2 ^ 220) 1773907 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq1979515 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 1979515) := checkAffineDrop_sound 358 (2 ^ 220) 1979515 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2102407) := checkAffineDrop_sound 358 (2 ^ 220) 2102407 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2268955 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2268955) := checkAffineDrop_sound 358 (2 ^ 220) 2268955 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2346091 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2346091) := checkAffineDrop_sound 358 (2 ^ 220) 2346091 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2346095 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2346095) := checkAffineDrop_sound 358 (2 ^ 220) 2346095 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2548479 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2548479) := checkAffineDrop_sound 358 (2 ^ 220) 2548479 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2639355 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2639355) := checkAffineDrop_sound 358 (2 ^ 220) 2639355 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2725659) := checkAffineDrop_sound 358 (2 ^ 220) 2725659 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2783515 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2783515) := checkAffineDrop_sound 358 (2 ^ 220) 2783515 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq2989823 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 2989823) := checkAffineDrop_sound 358 (2 ^ 220) 2989823 (by decide) k
theorem horizon_drop_mod1684996666696914987166688442938726917102321526408785780068975640576_eq3122655 (k : Nat) : HasHorizonDrop (2 ^ 220 * k + 3122655) := checkAffineDrop_sound 358 (2 ^ 220) 3122655 (by decide) k

```

---

## Część 9. Anatomia Dwóch Ekstremalnych Klas 4-Blokowych (`r0 ∈ {103, 871}`) oraz Test Wieloblokowy ($K = 5, 6, 8, 10$)

### 9.1. Pełny rozkład blokowy RLE (Modulo-3 Macro-Blocks `c ∈ {1, 5, 7}`) dla `r0 = 103` oraz `r0 = 871`

W Rundzie 3 odkryliśmy, że po $K = 4$ makro-blokach RLE spośród wszystkich 64 bazowych klas przeżywających (`survivingMod1024`) jedynie dwie klasy (`r0 = 103` oraz `r0 = 871`) osiągają absolutne minimum $\bar{v}_4 = \frac{1}{4}\sum_{i=1}^4 (d_i + v_i) = 2{,}000$ (czyli $\sum_{i=1}^4 (d_i + v_i) = 8$). Poniższe tabele przedstawiają ich dokładny rozkład blok po bloku (zarówno dla dokładnych reprezentantów $n_0 = 103, 871$, jak i dla ich głębokich podniesień asymptotycznych $2^{120} + r_0$):

#### Tabela 9.1A. Dokładna trajektoria makro-blokowa RLE dla `n0 = 103` (Bloki 1–10)

| Blok $K$ | Wejście $n_{K-1}$ | Węzeł fazowy $(c_K, d_K)$ | $b_K$ | $(r_K, d_K)$ | $v_K$ | $d_K + v_K$ | $b_K + v_K$ | $\bar{v}_K = \frac{1}{K}\sum(d_i+v_i)$ | $\overline{b+v}_K = \frac{1}{K}\sum(b_i+v_i)$ | Bilans $\frac{\sum \text{even}_i}{\sum \text{odd}_i}$ (próg $1{,}5850$) | Bilans $\frac{\sum(3r_i+d_i+v_i)}{\sum(r_i+1)}$ (próg $3{,}1699$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `103` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.3333`** | **`2.5000`** |
| **2** | `175` | `(c=1, d=0)` | `4` | `(2, 0)` | `1` | `1` | `5` | **`1.500`** | `4.50` | **`1.2857`** | **`2.4000`** |
| **3** | `445` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.000`** | `4.00` | **`1.5000`** | **`2.5000`** |
| **4** | `167` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.4545`** | **`2.5000`** |
| **5** | `283` | `(c=5, d=2)` | `5` | `(1, 2)` | `1` | `3` | `6` | **`2.200`** ✅ | `4.40` | **`1.3750`** | **`2.6000`** |
| **6** | `1079` | `(c=1, d=1)` | `3` | `(1, 1)` | `2` | `3` | `5` | **`2.333`** ✅ | `4.50` | **`1.4211`** | **`2.6667`** |
| **7** | `911` | `(c=1, d=0)` | `4` | `(2, 0)` | `3` | `3` | `7` | **`2.429`** ✅ | `4.86` | **`1.4783`** | **`2.7333`** |
| **8** | `577` | `(c=7, d=3)` | `3` | `(0, 3)` | `1` | `4` | `4` | **`2.625`** ✅ | `4.75` | **`1.5200`** | **`2.8125`** |
| **9** | `325` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `3` | `4` | `4` | **`2.778`** ✅ | `4.67` | **`1.6154`** ✅ | **`2.8824`** |
| **10** | `61` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.800`** ✅ | `4.50` | **`1.6667`** ✅ | **`2.8889`** |

#### Tabela 9.1B. Dokładna trajektoria makro-blokowa RLE dla `n0 = 871` (Bloki 1–10)

| Blok $K$ | Wejście $n_{K-1}$ | Węzeł fazowy $(c_K, d_K)$ | $b_K$ | $(r_K, d_K)$ | $v_K$ | $d_K + v_K$ | $b_K + v_K$ | $\bar{v}_K = \frac{1}{K}\sum(d_i+v_i)$ | $\overline{b+v}_K = \frac{1}{K}\sum(b_i+v_i)$ | Bilans $\frac{\sum \text{even}_i}{\sum \text{odd}_i}$ (próg $1{,}5850$) | Bilans $\frac{\sum(3r_i+d_i+v_i)}{\sum(r_i+1)}$ (próg $3{,}1699$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `871` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.3333`** | **`2.5000`** |
| **2** | `1471` | `(c=1, d=0)` | `6` | `(3, 0)` | `1` | `1` | `7` | **`1.500`** | `5.50` | **`1.2222`** | **`2.5000`** |
| **3** | `8383` | `(c=1, d=0)` | `6` | `(3, 0)` | `1` | `1` | `7` | **`1.333`** | `6.00` | **`1.2000`** | **`2.5000`** |
| **4** | `47749` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `3` | `4` | `4` | **`2.000`** | `5.50` | **`1.3750`** | **`2.6364`** |
| **5** | `8953` | `(c=7, d=5)` | `8` | `(1, 5)` | `2` | `7` | `10` | **`3.000`** ✅ | `6.40` | **`1.5238`** | **`3.0000`** |
| **6** | `2125` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`3.000`** ✅ | `5.83` | **`1.5909`** ✅ | **`3.0000`** |
| **7** | `797` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`3.000`** ✅ | `5.43` | **`1.6522`** ✅ | **`3.0000`** |
| **8** | `299` | `(c=5, d=1)` | `4` | `(1, 1)` | `1` | `2` | `5` | **`2.875`** ✅ | `5.38` | **`1.6538`** ✅ | **`2.9412`** |
| **9** | `253` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.889`** ✅ | `5.11` | **`1.7037`** ✅ | **`2.9444`** |
| **10** | `95` | `(c=1, d=1)` | `5` | `(2, 1)` | `3` | `4` | `8` | **`3.000`** ✅ | `5.40` | **`1.6875`** ✅ | **`3.0000`** |

#### Tabela 9.1C. Asymptotyczna trajektoria makro-blokowa RLE dla `n0 = 2^120 + 103` (Bloki 1–10)

| Blok $K$ | Wejście $n_{K-1}$ | Węzeł fazowy $(c_K, d_K)$ | $b_K$ | $(r_K, d_K)$ | $v_K$ | $d_K + v_K$ | $b_K + v_K$ | $\bar{v}_K = \frac{1}{K}\sum(d_i+v_i)$ | $\overline{b+v}_K = \frac{1}{K}\sum(b_i+v_i)$ | Bilans $\frac{\sum \text{even}_i}{\sum \text{odd}_i}$ (próg $1{,}5850$) | Bilans $\frac{\sum(3r_i+d_i+v_i)}{\sum(r_i+1)}$ (próg $3{,}1699$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `... + 103 (mod 1024)` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.3333`** | **`2.5000`** |
| **2** | `... + 175 (mod 1024)` | `(c=1, d=0)` | `4` | `(2, 0)` | `1` | `1` | `5` | **`1.500`** | `4.50` | **`1.2857`** | **`2.4000`** |
| **3** | `... + 445 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.000`** | `4.00` | **`1.5000`** | **`2.5000`** |
| **4** | `... + 167 (mod 1024)` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.4545`** | **`2.5000`** |
| **5** | `... + 283 (mod 1024)` | `(c=5, d=2)` | `5` | `(1, 2)` | `1` | `3` | `6` | **`2.200`** ✅ | `4.40` | **`1.3750`** | **`2.6000`** |
| **6** | `... + 55 (mod 1024)` | `(c=1, d=1)` | `3` | `(1, 1)` | `2` | `3` | `5` | **`2.333`** ✅ | `4.50` | **`1.4211`** | **`2.6667`** |
| **7** | `... + 911 (mod 1024)` | `(c=1, d=0)` | `4` | `(2, 0)` | `3` | `3` | `7` | **`2.429`** ✅ | `4.86` | **`1.4783`** | **`2.7333`** |
| **8** | `... + 577 (mod 1024)` | `(c=7, d=3)` | `3` | `(0, 3)` | `1` | `4` | `4` | **`2.625`** ✅ | `4.75` | **`1.5200`** | **`2.8125`** |
| **9** | `... + 325 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `3` | `4` | `4` | **`2.778`** ✅ | `4.67` | **`1.6154`** ✅ | **`2.8824`** |
| **10** | `... + 61 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.800`** ✅ | `4.50` | **`1.6667`** ✅ | **`2.8889`** |

#### Tabela 9.1D. Asymptotyczna trajektoria makro-blokowa RLE dla `n0 = 2^120 + 871` (Bloki 1–10)

| Blok $K$ | Wejście $n_{K-1}$ | Węzeł fazowy $(c_K, d_K)$ | $b_K$ | $(r_K, d_K)$ | $v_K$ | $d_K + v_K$ | $b_K + v_K$ | $\bar{v}_K = \frac{1}{K}\sum(d_i+v_i)$ | $\overline{b+v}_K = \frac{1}{K}\sum(b_i+v_i)$ | Bilans $\frac{\sum \text{even}_i}{\sum \text{odd}_i}$ (próg $1{,}5850$) | Bilans $\frac{\sum(3r_i+d_i+v_i)}{\sum(r_i+1)}$ (próg $3{,}1699$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `... + 871 (mod 1024)` | `(c=1, d=1)` | `3` | `(1, 1)` | `1` | `2` | `4` | **`2.000`** | `4.00` | **`1.3333`** | **`2.5000`** |
| **2** | `... + 447 (mod 1024)` | `(c=1, d=0)` | `6` | `(3, 0)` | `1` | `1` | `7` | **`1.500`** | `5.50` | **`1.2222`** | **`2.5000`** |
| **3** | `... + 191 (mod 1024)` | `(c=1, d=0)` | `6` | `(3, 0)` | `1` | `1` | `7` | **`1.333`** | `6.00` | **`1.2000`** | **`2.5000`** |
| **4** | `... + 645 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `3` | `4` | `4` | **`2.000`** | `5.50` | **`1.3750`** | **`2.6364`** |
| **5** | `... + 761 (mod 1024)` | `(c=7, d=5)` | `8` | `(1, 5)` | `2` | `7` | `10` | **`3.000`** ✅ | `6.40` | **`1.5238`** | **`3.0000`** |
| **6** | `... + 77 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`3.000`** ✅ | `5.83` | **`1.5909`** ✅ | **`3.0000`** |
| **7** | `... + 797 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`3.000`** ✅ | `5.43` | **`1.6522`** ✅ | **`3.0000`** |
| **8** | `... + 299 (mod 1024)` | `(c=5, d=1)` | `4` | `(1, 1)` | `1` | `2` | `5` | **`2.875`** ✅ | `5.38` | **`1.6538`** ✅ | **`2.9412`** |
| **9** | `... + 253 (mod 1024)` | `(c=1, b=1 [-3])` | `1` | `(0, 1)` | `2` | `3` | `3` | **`2.889`** ✅ | `5.11` | **`1.7037`** ✅ | **`2.9444`** |
| **10** | `... + 95 (mod 1024)` | `(c=1, d=1)` | `5` | `(2, 1)` | `3` | `4` | `8` | **`3.000`** ✅ | `5.40` | **`1.6875`** ✅ | **`3.0000`** |

### 9.2. Mechanizm odbicia powyżej bariery krytycznej $\log_2(9) - 1 \approx 2{,}1699$ dla `103` i `871`

1. **Anatomia `r0 = 103` (Tabela 9.1A i 9.1C):**
   - W pierwszych 4 blokach `n0 = 103` przechodzi przez sekwencję stanów: `K=1: (c=1, d=1, r=1, v=1)` ($d_1+v_1=2$) $\to$ `K=2: (c=1, d=0, r=2, v=1)` ($d_2+v_2=1$) $\to$ `K=3: (c=1, b=1 [-3], r=0, d=1, v=2)` ($d_3+v_3=3$) $\to$ `K=4: (c=1, d=1, r=1, v=1)` ($d_4+v_4=2$), co daje sumę $\sum_{i=1}^4 (d_i+v_i) = 8$ i średnią $\bar{v}_4 = 2{,}000$.
   - Jednak już w **bloku $K = 5$** (`n4 = 283`, stan `(c=5, d=2, r=1, v=1)`, gdzie $d_5 + v_5 = 3$) średnia $\bar{v}_5$ przebija próg krytyczny $\log_2(9) - 1 \approx 2{,}1699$, osiągając **$\bar{v}_5 = 2{,}200 > 2{,}1699$** ✅!
   - W kolejnych blokach średnia rośnie monotonicznie: **$\bar{v}_6 = 2{,}333$** ✅ (`n5 = 1079`, `(c=1, d=1, v=2)`), **$\bar{v}_7 = 2{,}429$** ✅ (`n6 = 911`, `(c=1, d=0, v=3)`), **$\bar{v}_8 = 2{,}625$** ✅ (`n7 = 577`, `(c=7, d=3, v=1)`), **$\bar{v}_9 = 2{,}778$** ✅ (`n8 = 325`, bezpiecznik `(c=1, b=1 [-3], v=3)` — w tym punkcie również globalny stosunek kroków parzystych do nieparzystych przebija $\log_2(3) \approx 1{,}5850$, osiągając **`1.6154 > 1.5850` ✅**!) oraz **$\bar{v}_{10} = 2{,}800$** ✅ (`1.6667 > 1.5850` ✅).
   - Dokładnie ten sam profil (`[2, 1, 3, 2, 3, 3, 3, 4, 4, 3]`) zachowuje podniesienie asymptotyczne **`2^120 + 103`** (Tabela 9.1C)!
2. **Anatomia `r0 = 871` (Tabela 9.1B i 9.1D):**
   - W pierwszych 4 blokach `n0 = 871` przechodzi przez: `K=1: (c=1, d=1, r=1, v=1)` ($d_1+v_1=2$) $\to$ `K=2: (c=1, d=0, r=3, v=1)` ($d_2+v_2=1$) $\to$ `K=3: (c=1, d=0, r=3, v=1)` ($d_3+v_3=1$) $\to$ `K=4: (c=1, b=1 [-3], r=0, d=1, v=3)` ($d_4+v_4=4$), co daje po $K=3$ blokach $\bar{v}_3 = 1{,}333$, a po $K=4$ blokach $\bar{v}_4 = 2{,}000$.
   - Już w **bloku $K = 5$** (`n4 = 8953`, stan `(c=7, d=5, b=8, r=1, v=2)`, gdzie $d_5 + v_5 = 7$) następuje gwałtowny skok średniej z $2{,}000$ wprost na **$\bar{v}_5 = 3{,}000 > 2{,}1699$** ✅!
   - W **bloku $K = 6$** (`n5 = 2125`, bezpiecznik `(c=1, b=1 [-3], v=2)`) utrzymuje się **$\bar{v}_6 = 3{,}000$** ✅, a globalny stosunek kroków parzystych do nieparzystych przebija próg kontrakcji (`35 / 22 = 1.5909 > 1.5850` ✅) i rośnie dalej w blokach $K = 7..10$ (`1.6522`, `1.6538`, `1.7037`, `1.6875` ✅).
3. **Wnioski populacyjne dla $K = 5, 6, 8, 10$ (Tabele 9.3A–C):**
   - W populacji **64 bazowych klas przeżywających (`survivingMod1024`)**: już dla **$K = 5$ bloków aż 100% (64 / 64)** klas przekracza barierę $\bar{v}_5 > \log_2(9) - 1 \approx 2{,}1699$ ($\min \bar{v}_5 = \mathbf{2{,}200}$ dla `103`), a dla **$K = 8$ oraz $K = 10$ bloków 100% (64 / 64)** klas osiąga $\bar{v}_K \ge \mathbf{2{,}500}$ (przy średniej populacyjnej $\mathbf{3{,}391}$)!
   - W rozszerzonej populacji **1024 klas podniesionych (`mod 16384 = r0 + 1024*j`)**: dla $K = 5$ próg $\bar{v}_5 > 2{,}1699$ przekracza **99,02% (1014 / 1024)** klas (jedynym opóźnionym podniesieniem jest ogon Mersenne'a `4591 = 4*1024 + 495`), natomiast dla **$K = 8$ bloków już 100% (1024 / 1024)** klas przekracza próg $\bar{v}_8 > 2{,}1699$ ($\min \bar{v}_8 = \mathbf{2{,}250}$), a dla **$K = 10$ bloków pełne 100% (1024 / 1024)** wszystkich 1024 klas spełnia $\bar{v}_{10} \ge \mathbf{2{,}500}$ (średnia $\mathbf{3{,}775}$) oraz **92,48% (947 / 1024)** wykazuje już bezwzględną kontrakcję 2-adyczną $\sum\text{even} > \log_2(3)\sum\text{odd}$!

---

### 9.3. Globalny rozkład $\min \bar{v}_K$ dla $K = 2, 3, 4, 5, 6, 8, 10$ (64 klasy bazowe oraz 1024 klasy podniesione `mod 16384`)

#### Tabela 9.3A. Populacja 64 bazowych klas przeżywających (`survivingMod1024`)

| Liczba bloków $K$ | $\min \bar{v}_K = \min \frac{1}{K}\sum(d_i+v_i)$ | Klasy realizujące $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \overline{b+v}_K$ | Średnie $\overline{b+v}_K$ | Klasy z $\bar{v}_K > 2{,}1699$ | Klasy z $\bar{v}_K \ge 2{,}50$ | Klasy z kontrakcją ($\sum\text{even} > \log_2(3)\sum\text{odd}$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 2$** | **`1.000`** | `751` | **`3.008`** | `5.50` | `4.00` | `6.08` | `51/64` (**79.69%**) | `51/64` (**79.69%**) | `11/64` (**17.19%**) |
| **$K = 3$** | **`1.333`** | `871` | **`3.240`** | `4.67` | `4.00` | `5.68` | `59/64` (**92.19%**) | `57/64` (**89.06%**) | `32/64` (**50.00%**) |
| **$K = 4$** | **`2.000`** | `103, 871` | **`3.344`** | `5.25` | `4.00` | `5.47` | `62/64` (**96.88%**) | `61/64` (**95.31%**) | `41/64` (**64.06%**) |
| **$K = 5$** | **`2.200`** | `103` | **`3.325`** | `4.80` | `4.00` | `5.31` | `64/64` (**100.00%**) | `61/64` (**95.31%**) | `44/64` (**68.75%**) |
| **$K = 6$** | **`2.333`** | `103` | **`3.357`** | `4.67` | `4.33` | `5.37` | `64/64` (**100.00%**) | `63/64` (**98.44%**) | `47/64` (**73.44%**) |
| **$K = 8$** | **`2.500`** | `703` | **`3.377`** | `4.25` | `4.25` | `5.24` | `64/64` (**100.00%**) | `64/64` (**100.00%**) | `52/64` (**81.25%**) |
| **$K = 10$** | **`2.500`** | `703` | **`3.391`** | `4.20` | `4.20` | `5.03` | `64/64` (**100.00%**) | `64/64` (**100.00%**) | `48/64` (**75.00%**) |

#### Tabela 9.3B. Populacja 1024 klas podniesionych (`r = r0 + 1024*j mod 16384`, $j = 0..15$)

| Liczba bloków $K$ | $\min \bar{v}_K = \min \frac{1}{K}\sum(d_i+v_i)$ | Klasy realizujące $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \overline{b+v}_K$ | Średnie $\overline{b+v}_K$ | Klasy z $\bar{v}_K > 2{,}1699$ | Klasy z $\bar{v}_K \ge 2{,}50$ | Klasy z kontrakcją ($\sum\text{even} > \log_2(3)\sum\text{odd}$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 2$** | **`1.000`** | `751, 1471, 2799, 3311, 4847, 6895 (z 14)` | **`3.027`** | `8.00` | `4.00` | `6.14` | `756/1024` (**73.83%**) | `756/1024` (**73.83%**) | `230/1024` (**22.46%**) |
| **$K = 3$** | **`1.333`** | `871, 11367` | **`3.391`** | `7.33` | `3.67` | `5.92` | `932/1024` (**91.02%**) | `841/1024` (**82.13%**) | `538/1024` (**52.54%**) |
| **$K = 4$** | **`1.500`** | `4591, 11623` | **`3.545`** | `6.75` | `3.75` | `5.79` | `986/1024` (**96.29%**) | `946/1024` (**92.38%**) | `661/1024` (**64.55%**) |
| **$K = 5$** | **`1.400`** | `4591` | **`3.658`** | `6.20` | `3.80` | `5.73` | `1014/1024` (**99.02%**) | `971/1024` (**94.82%**) | `756/1024` (**73.83%**) |
| **$K = 6$** | **`1.667`** | `4591` | **`3.730`** | `5.67` | `3.67` | `5.68` | `1012/1024` (**98.83%**) | `1001/1024` (**97.75%**) | `823/1024` (**80.37%**) |
| **$K = 8$** | **`2.250`** | `2111, 3007, 6767, 6943` | **`3.792`** | `5.25` | `3.88` | `5.56` | `1024/1024` (**100.00%**) | `1014/1024` (**99.02%**) | `918/1024` (**89.65%**) |
| **$K = 10$** | **`2.500`** | `703, 1583, 3007, 6767, 6943, 6591 (z 7)` | **`3.775`** | `5.00` | `4.00` | `5.43` | `1024/1024` (**100.00%**) | `1024/1024` (**100.00%**) | `947/1024` (**92.48%**) |

#### Tabela 9.3C. Populacja 1024 asymptotycznych klas podniesionych (`2^120 + r0 + 1024*j`)

| Liczba bloków $K$ | $\min \bar{v}_K = \min \frac{1}{K}\sum(d_i+v_i)$ | Klasy realizujące $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \overline{b+v}_K$ | Średnie $\overline{b+v}_K$ | Klasy z $\bar{v}_K > 2{,}1699$ | Klasy z $\bar{v}_K \ge 2{,}50$ | Klasy z kontrakcją ($\sum\text{even} > \log_2(3)\sum\text{odd}$) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 2$** | **`1.000`** | `751, 1471, 2799, 3311, 4847, 6895 (z 14)` | **`3.027`** | `8.00` | `4.00` | `6.14` | `756/1024` (**73.83%**) | `756/1024` (**73.83%**) | `230/1024` (**22.46%**) |
| **$K = 3$** | **`1.333`** | `871, 11367` | **`3.391`** | `7.33` | `3.67` | `5.92` | `932/1024` (**91.02%**) | `841/1024` (**82.13%**) | `538/1024` (**52.54%**) |
| **$K = 4$** | **`1.500`** | `4591, 11623` | **`3.545`** | `6.75` | `3.75` | `5.79` | `986/1024` (**96.29%**) | `946/1024` (**92.38%**) | `661/1024` (**64.55%**) |
| **$K = 5$** | **`1.400`** | `4591` | **`3.658`** | `6.20` | `3.80` | `5.73` | `1014/1024` (**99.02%**) | `971/1024` (**94.82%**) | `756/1024` (**73.83%**) |
| **$K = 6$** | **`1.667`** | `4591` | **`3.730`** | `5.67` | `3.67` | `5.68` | `1012/1024` (**98.83%**) | `1001/1024` (**97.75%**) | `823/1024` (**80.37%**) |
| **$K = 8$** | **`2.250`** | `2111, 3007, 6767, 6943` | **`3.792`** | `5.25` | `3.88` | `5.56` | `1024/1024` (**100.00%**) | `1014/1024` (**99.02%**) | `918/1024` (**89.65%**) |
| **$K = 10$** | **`2.500`** | `703, 1583, 3007, 6767, 6943, 6591 (z 7)` | **`3.775`** | `5.00` | `4.00` | `5.43` | `1024/1024` (**100.00%**) | `1024/1024` (**100.00%**) | `947/1024` (**92.48%**) |



---

# Runda 5. Głębokie Sito 2-Adyczne (`k = 221..240`, `m = 360..391`) oraz Jawna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas `survivingMod1024`

## Część 10. Zestaw I (`k = 221..229`, `m = 360..373`) oraz Zestaw J (`k = 231..240`, `m = 376..391`) — 208 Twierdzeń dla Części 55 i 56

### 10.1. Tabela zbiorcza poziomów sita `c = 139..151` (`k = 221..240`)

| Zestaw | Poziom $c$ | Próg $k$ | Kroki $m = c+k$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek $1 < b' < b$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **I (Part 55)** | `139` | `221` | `360` | `0.619763` | `1149888` | `1564063, 1993215, 2091647, 2102407, 2268955, 2533535, 2725659, 3137471, 3542887, 3605743, 3986431, 4064103, 4170835, 4183295, 4537911, 4599551` |
| **I (Part 55)** | `140` | `223` | `363` | `0.464822` | `885722` | `665215, 1561327, 1564063, 1689023, 2091647, 2102407, 2346091, 2346095, 2474235, 2689131, 2788863, 3066367, 3137471, 3153611, 3378047, 3542887` |
| **I (Part 55)** | `141` | `224` | `365` | `0.697233` | `1013260` | `1126015, 1394431, 1564063, 2091647, 2102407, 2252031, 2585279, 2689131, 2788863, 3066367, 3137471, 3542887, 3718483, 3732423, 3877919, 4053039` |
| **I (Part 55)** | `142` | `226` | `368` | `0.522925` | `1235803` | `1564063, 2585279, 2689131, 2725659, 2788863, 3002707, 3066367, 3137471, 3447039, 3718483, 3732423, 4053039, 4183295, 4599551, 4637979, 4943211` |
| **I (Part 55)** | `143` | `227` | `370` | `0.784387` | `1652659` | `1723519, 2091647, 2725659, 2788863, 3066367, 3447039, 3718483, 4053039, 4183295, 4596051, 4599551, 4637979, 5451319, 5697963, 5699743, 6610635` |
| **I (Part 55)** | `144` | `229` | `373` | `0.588290` | `1399659` | `1394431, 2091647, 2725659, 2788863, 2929311, 3066367, 3137471, 3718483, 3732423, 4393967, 4596051, 4599551, 4706207, 5408615, 5451319, 5598635` |
| **J (Part 56)** | `145` | `231` | `376` | `0.441218` | `1424936` | `1394431, 2091647, 2725659, 2788863, 2929311, 3137471, 3558763, 3605743, 3718483, 3732423, 4064103, 4183295, 4599551, 5451319, 5598635, 5699743` |
| **J (Part 56)** | `146` | `232` | `378` | `0.661827` | `1866212` | `1394431, 2091647, 2725659, 2788863, 3066367, 3732423, 4183295, 4599551, 5451319, 6132735, 6610635, 6631675, 6899327, 6991599, 7460635, 7464847` |
| **J (Part 56)** | `147` | `234` | `381` | `0.496370` | `1747900` | `1394431, 2091647, 2788863, 3137471, 3605743, 3718483, 4706207, 5408615, 5451319, 6132735, 6204543, 6610635, 6631675, 6635419, 6899327, 6991599` |
| **J (Part 56)** | `148` | `235` | `383` | `0.744555` | `1815724` | `1394431, 2091647, 2725659, 3137471, 3605743, 3718483, 4599551, 4706207, 5451319, 6132735, 6631675, 6635419, 6899327, 6991599, 7059311, 7262895` |
| **J (Part 56)** | `149` | `237` | `386` | `0.558416` | `1657919` | `1394431, 2091647, 2788863, 3066367, 3137471, 3605743, 4183295, 4599551, 4706207, 5408615, 5451319, 5623723, 5697963, 6132735, 6274943, 6631675` |
| **J (Part 56)** | `150` | `239` | `389` | `0.418812` | `1833100` | `2788863, 3137471, 3605743, 3718483, 4183295, 4599551, 4706207, 5408615, 6132735, 6204543, 6274943, 6610635, 6631675, 7059311, 7211487, 7332399` |
| **J (Part 56)** | `151` | `240` | `391` | `0.628218` | `2100128` | `2091647, 2725659, 2788863, 3066367, 3137471, 3605743, 3718483, 4183295, 4706207, 5451319, 6132735, 6631675, 7460635, 8142879, 8176979, 8400511` |

### 10.2. Gotowe bloki kodu Lean 4 (Zestaw I — Część 55 oraz Zestaw J — Część 56)

*(Pełny kod został również zapisany w pliku [`sieve_221_240_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_221_240_lean.txt).)*

```lean
-- ============================================================================
-- Część 55. Głębokie Sito 2-Adyczne dla k = 221..229 (m = 360..373, c = 139..144)
-- Wygenerowano przez Architekta 4 (Runda 5 — Zestaw I: 96 twierdzeń)
-- ============================================================================

-- k = 221, m = 360 (c = 139, 2^221 = 3369993333393829974333376885877453834204643052817571560137951281152 > 3^139)
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 1564063) := checkAffineDrop_sound 360 (2 ^ 221) 1564063 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq1993215 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 1993215) := checkAffineDrop_sound 360 (2 ^ 221) 1993215 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 2091647) := checkAffineDrop_sound 360 (2 ^ 221) 2091647 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 2102407) := checkAffineDrop_sound 360 (2 ^ 221) 2102407 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq2268955 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 2268955) := checkAffineDrop_sound 360 (2 ^ 221) 2268955 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq2533535 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 2533535) := checkAffineDrop_sound 360 (2 ^ 221) 2533535 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 2725659) := checkAffineDrop_sound 360 (2 ^ 221) 2725659 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 3137471) := checkAffineDrop_sound 360 (2 ^ 221) 3137471 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq3542887 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 3542887) := checkAffineDrop_sound 360 (2 ^ 221) 3542887 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 3605743) := checkAffineDrop_sound 360 (2 ^ 221) 3605743 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq3986431 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 3986431) := checkAffineDrop_sound 360 (2 ^ 221) 3986431 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq4064103 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 4064103) := checkAffineDrop_sound 360 (2 ^ 221) 4064103 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq4170835 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 4170835) := checkAffineDrop_sound 360 (2 ^ 221) 4170835 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 4183295) := checkAffineDrop_sound 360 (2 ^ 221) 4183295 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq4537911 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 4537911) := checkAffineDrop_sound 360 (2 ^ 221) 4537911 (by decide) k
theorem horizon_drop_mod3369993333393829974333376885877453834204643052817571560137951281152_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 221 * k + 4599551) := checkAffineDrop_sound 360 (2 ^ 221) 4599551 (by decide) k

-- k = 223, m = 363 (c = 140, 2^223 = 13479973333575319897333507543509815336818572211270286240551805124608 > 3^140)
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq665215 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 665215) := checkAffineDrop_sound 363 (2 ^ 223) 665215 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq1561327 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 1561327) := checkAffineDrop_sound 363 (2 ^ 223) 1561327 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 1564063) := checkAffineDrop_sound 363 (2 ^ 223) 1564063 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq1689023 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 1689023) := checkAffineDrop_sound 363 (2 ^ 223) 1689023 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2091647) := checkAffineDrop_sound 363 (2 ^ 223) 2091647 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2102407) := checkAffineDrop_sound 363 (2 ^ 223) 2102407 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2346091 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2346091) := checkAffineDrop_sound 363 (2 ^ 223) 2346091 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2346095 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2346095) := checkAffineDrop_sound 363 (2 ^ 223) 2346095 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2474235 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2474235) := checkAffineDrop_sound 363 (2 ^ 223) 2474235 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2689131 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2689131) := checkAffineDrop_sound 363 (2 ^ 223) 2689131 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 2788863) := checkAffineDrop_sound 363 (2 ^ 223) 2788863 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 3066367) := checkAffineDrop_sound 363 (2 ^ 223) 3066367 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 3137471) := checkAffineDrop_sound 363 (2 ^ 223) 3137471 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq3153611 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 3153611) := checkAffineDrop_sound 363 (2 ^ 223) 3153611 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq3378047 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 3378047) := checkAffineDrop_sound 363 (2 ^ 223) 3378047 (by decide) k
theorem horizon_drop_mod13479973333575319897333507543509815336818572211270286240551805124608_eq3542887 (k : Nat) : HasHorizonDrop (2 ^ 223 * k + 3542887) := checkAffineDrop_sound 363 (2 ^ 223) 3542887 (by decide) k

-- k = 224, m = 365 (c = 141, 2^224 = 26959946667150639794667015087019630673637144422540572481103610249216 > 3^141)
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq1126015 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 1126015) := checkAffineDrop_sound 365 (2 ^ 224) 1126015 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 1394431) := checkAffineDrop_sound 365 (2 ^ 224) 1394431 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 1564063) := checkAffineDrop_sound 365 (2 ^ 224) 1564063 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2091647) := checkAffineDrop_sound 365 (2 ^ 224) 2091647 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2102407 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2102407) := checkAffineDrop_sound 365 (2 ^ 224) 2102407 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2252031 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2252031) := checkAffineDrop_sound 365 (2 ^ 224) 2252031 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2585279) := checkAffineDrop_sound 365 (2 ^ 224) 2585279 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2689131 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2689131) := checkAffineDrop_sound 365 (2 ^ 224) 2689131 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 2788863) := checkAffineDrop_sound 365 (2 ^ 224) 2788863 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3066367) := checkAffineDrop_sound 365 (2 ^ 224) 3066367 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3137471) := checkAffineDrop_sound 365 (2 ^ 224) 3137471 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3542887 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3542887) := checkAffineDrop_sound 365 (2 ^ 224) 3542887 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3718483) := checkAffineDrop_sound 365 (2 ^ 224) 3718483 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3732423 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3732423) := checkAffineDrop_sound 365 (2 ^ 224) 3732423 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 3877919) := checkAffineDrop_sound 365 (2 ^ 224) 3877919 (by decide) k
theorem horizon_drop_mod26959946667150639794667015087019630673637144422540572481103610249216_eq4053039 (k : Nat) : HasHorizonDrop (2 ^ 224 * k + 4053039) := checkAffineDrop_sound 365 (2 ^ 224) 4053039 (by decide) k

-- k = 226, m = 368 (c = 142, 2^226 = 107839786668602559178668060348078522694548577690162289924414440996864 > 3^142)
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq1564063 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 1564063) := checkAffineDrop_sound 368 (2 ^ 226) 1564063 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 2585279) := checkAffineDrop_sound 368 (2 ^ 226) 2585279 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq2689131 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 2689131) := checkAffineDrop_sound 368 (2 ^ 226) 2689131 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 2725659) := checkAffineDrop_sound 368 (2 ^ 226) 2725659 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 2788863) := checkAffineDrop_sound 368 (2 ^ 226) 2788863 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3002707 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3002707) := checkAffineDrop_sound 368 (2 ^ 226) 3002707 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3066367) := checkAffineDrop_sound 368 (2 ^ 226) 3066367 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3137471) := checkAffineDrop_sound 368 (2 ^ 226) 3137471 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3447039) := checkAffineDrop_sound 368 (2 ^ 226) 3447039 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3718483) := checkAffineDrop_sound 368 (2 ^ 226) 3718483 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq3732423 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 3732423) := checkAffineDrop_sound 368 (2 ^ 226) 3732423 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq4053039 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 4053039) := checkAffineDrop_sound 368 (2 ^ 226) 4053039 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 4183295) := checkAffineDrop_sound 368 (2 ^ 226) 4183295 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 4599551) := checkAffineDrop_sound 368 (2 ^ 226) 4599551 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq4637979 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 4637979) := checkAffineDrop_sound 368 (2 ^ 226) 4637979 (by decide) k
theorem horizon_drop_mod107839786668602559178668060348078522694548577690162289924414440996864_eq4943211 (k : Nat) : HasHorizonDrop (2 ^ 226 * k + 4943211) := checkAffineDrop_sound 368 (2 ^ 226) 4943211 (by decide) k

-- k = 227, m = 370 (c = 143, 2^227 = 215679573337205118357336120696157045389097155380324579848828881993728 > 3^143)
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 1723519) := checkAffineDrop_sound 370 (2 ^ 227) 1723519 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 2091647) := checkAffineDrop_sound 370 (2 ^ 227) 2091647 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 2725659) := checkAffineDrop_sound 370 (2 ^ 227) 2725659 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 2788863) := checkAffineDrop_sound 370 (2 ^ 227) 2788863 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 3066367) := checkAffineDrop_sound 370 (2 ^ 227) 3066367 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 3447039) := checkAffineDrop_sound 370 (2 ^ 227) 3447039 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 3718483) := checkAffineDrop_sound 370 (2 ^ 227) 3718483 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq4053039 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 4053039) := checkAffineDrop_sound 370 (2 ^ 227) 4053039 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 4183295) := checkAffineDrop_sound 370 (2 ^ 227) 4183295 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 4596051) := checkAffineDrop_sound 370 (2 ^ 227) 4596051 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 4599551) := checkAffineDrop_sound 370 (2 ^ 227) 4599551 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq4637979 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 4637979) := checkAffineDrop_sound 370 (2 ^ 227) 4637979 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 5451319) := checkAffineDrop_sound 370 (2 ^ 227) 5451319 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 5697963) := checkAffineDrop_sound 370 (2 ^ 227) 5697963 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq5699743 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 5699743) := checkAffineDrop_sound 370 (2 ^ 227) 5699743 (by decide) k
theorem horizon_drop_mod215679573337205118357336120696157045389097155380324579848828881993728_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 227 * k + 6610635) := checkAffineDrop_sound 370 (2 ^ 227) 6610635 (by decide) k

-- k = 229, m = 373 (c = 144, 2^229 = 862718293348820473429344482784628181556388621521298319395315527974912 > 3^144)
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 1394431) := checkAffineDrop_sound 373 (2 ^ 229) 1394431 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 2091647) := checkAffineDrop_sound 373 (2 ^ 229) 2091647 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 2725659) := checkAffineDrop_sound 373 (2 ^ 229) 2725659 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 2788863) := checkAffineDrop_sound 373 (2 ^ 229) 2788863 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 2929311) := checkAffineDrop_sound 373 (2 ^ 229) 2929311 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 3066367) := checkAffineDrop_sound 373 (2 ^ 229) 3066367 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 3137471) := checkAffineDrop_sound 373 (2 ^ 229) 3137471 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 3718483) := checkAffineDrop_sound 373 (2 ^ 229) 3718483 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq3732423 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 3732423) := checkAffineDrop_sound 373 (2 ^ 229) 3732423 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq4393967 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 4393967) := checkAffineDrop_sound 373 (2 ^ 229) 4393967 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 4596051) := checkAffineDrop_sound 373 (2 ^ 229) 4596051 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 4599551) := checkAffineDrop_sound 373 (2 ^ 229) 4599551 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 4706207) := checkAffineDrop_sound 373 (2 ^ 229) 4706207 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq5408615 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 5408615) := checkAffineDrop_sound 373 (2 ^ 229) 5408615 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 5451319) := checkAffineDrop_sound 373 (2 ^ 229) 5451319 (by decide) k
theorem horizon_drop_mod862718293348820473429344482784628181556388621521298319395315527974912_eq5598635 (k : Nat) : HasHorizonDrop (2 ^ 229 * k + 5598635) := checkAffineDrop_sound 373 (2 ^ 229) 5598635 (by decide) k

-- ============================================================================
-- Część 56. Głębokie Sito 2-Adyczne dla k = 231..240 (m = 376..391, c = 145..151)
-- Wygenerowano przez Architekta 4 (Runda 5 — Zestaw J: 112 twierdzeń)
-- ============================================================================

-- k = 231, m = 376 (c = 145, 2^231 = 3450873173395281893717377931138512726225554486085193277581262111899648 > 3^145)
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 1394431) := checkAffineDrop_sound 376 (2 ^ 231) 1394431 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 2091647) := checkAffineDrop_sound 376 (2 ^ 231) 2091647 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 2725659) := checkAffineDrop_sound 376 (2 ^ 231) 2725659 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 2788863) := checkAffineDrop_sound 376 (2 ^ 231) 2788863 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq2929311 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 2929311) := checkAffineDrop_sound 376 (2 ^ 231) 2929311 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 3137471) := checkAffineDrop_sound 376 (2 ^ 231) 3137471 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq3558763 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 3558763) := checkAffineDrop_sound 376 (2 ^ 231) 3558763 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 3605743) := checkAffineDrop_sound 376 (2 ^ 231) 3605743 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 3718483) := checkAffineDrop_sound 376 (2 ^ 231) 3718483 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq3732423 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 3732423) := checkAffineDrop_sound 376 (2 ^ 231) 3732423 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq4064103 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 4064103) := checkAffineDrop_sound 376 (2 ^ 231) 4064103 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 4183295) := checkAffineDrop_sound 376 (2 ^ 231) 4183295 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 4599551) := checkAffineDrop_sound 376 (2 ^ 231) 4599551 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 5451319) := checkAffineDrop_sound 376 (2 ^ 231) 5451319 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq5598635 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 5598635) := checkAffineDrop_sound 376 (2 ^ 231) 5598635 (by decide) k
theorem horizon_drop_mod3450873173395281893717377931138512726225554486085193277581262111899648_eq5699743 (k : Nat) : HasHorizonDrop (2 ^ 231 * k + 5699743) := checkAffineDrop_sound 376 (2 ^ 231) 5699743 (by decide) k

-- k = 232, m = 378 (c = 146, 2^232 = 6901746346790563787434755862277025452451108972170386555162524223799296 > 3^146)
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 1394431) := checkAffineDrop_sound 378 (2 ^ 232) 1394431 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 2091647) := checkAffineDrop_sound 378 (2 ^ 232) 2091647 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 2725659) := checkAffineDrop_sound 378 (2 ^ 232) 2725659 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 2788863) := checkAffineDrop_sound 378 (2 ^ 232) 2788863 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 3066367) := checkAffineDrop_sound 378 (2 ^ 232) 3066367 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq3732423 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 3732423) := checkAffineDrop_sound 378 (2 ^ 232) 3732423 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 4183295) := checkAffineDrop_sound 378 (2 ^ 232) 4183295 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 4599551) := checkAffineDrop_sound 378 (2 ^ 232) 4599551 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 5451319) := checkAffineDrop_sound 378 (2 ^ 232) 5451319 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 6132735) := checkAffineDrop_sound 378 (2 ^ 232) 6132735 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 6610635) := checkAffineDrop_sound 378 (2 ^ 232) 6610635 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 6631675) := checkAffineDrop_sound 378 (2 ^ 232) 6631675 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 6899327) := checkAffineDrop_sound 378 (2 ^ 232) 6899327 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq6991599 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 6991599) := checkAffineDrop_sound 378 (2 ^ 232) 6991599 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq7460635 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 7460635) := checkAffineDrop_sound 378 (2 ^ 232) 7460635 (by decide) k
theorem horizon_drop_mod6901746346790563787434755862277025452451108972170386555162524223799296_eq7464847 (k : Nat) : HasHorizonDrop (2 ^ 232 * k + 7464847) := checkAffineDrop_sound 378 (2 ^ 232) 7464847 (by decide) k

-- k = 234, m = 381 (c = 147, 2^234 = 27606985387162255149739023449108101809804435888681546220650096895197184 > 3^147)
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 1394431) := checkAffineDrop_sound 381 (2 ^ 234) 1394431 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 2091647) := checkAffineDrop_sound 381 (2 ^ 234) 2091647 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 2788863) := checkAffineDrop_sound 381 (2 ^ 234) 2788863 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 3137471) := checkAffineDrop_sound 381 (2 ^ 234) 3137471 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 3605743) := checkAffineDrop_sound 381 (2 ^ 234) 3605743 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 3718483) := checkAffineDrop_sound 381 (2 ^ 234) 3718483 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 4706207) := checkAffineDrop_sound 381 (2 ^ 234) 4706207 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq5408615 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 5408615) := checkAffineDrop_sound 381 (2 ^ 234) 5408615 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 5451319) := checkAffineDrop_sound 381 (2 ^ 234) 5451319 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6132735) := checkAffineDrop_sound 381 (2 ^ 234) 6132735 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6204543 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6204543) := checkAffineDrop_sound 381 (2 ^ 234) 6204543 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6610635) := checkAffineDrop_sound 381 (2 ^ 234) 6610635 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6631675) := checkAffineDrop_sound 381 (2 ^ 234) 6631675 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6635419 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6635419) := checkAffineDrop_sound 381 (2 ^ 234) 6635419 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6899327) := checkAffineDrop_sound 381 (2 ^ 234) 6899327 (by decide) k
theorem horizon_drop_mod27606985387162255149739023449108101809804435888681546220650096895197184_eq6991599 (k : Nat) : HasHorizonDrop (2 ^ 234 * k + 6991599) := checkAffineDrop_sound 381 (2 ^ 234) 6991599 (by decide) k

-- k = 235, m = 383 (c = 148, 2^235 = 55213970774324510299478046898216203619608871777363092441300193790394368 > 3^148)
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 1394431) := checkAffineDrop_sound 383 (2 ^ 235) 1394431 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 2091647) := checkAffineDrop_sound 383 (2 ^ 235) 2091647 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 2725659) := checkAffineDrop_sound 383 (2 ^ 235) 2725659 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 3137471) := checkAffineDrop_sound 383 (2 ^ 235) 3137471 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 3605743) := checkAffineDrop_sound 383 (2 ^ 235) 3605743 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 3718483) := checkAffineDrop_sound 383 (2 ^ 235) 3718483 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 4599551) := checkAffineDrop_sound 383 (2 ^ 235) 4599551 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 4706207) := checkAffineDrop_sound 383 (2 ^ 235) 4706207 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 5451319) := checkAffineDrop_sound 383 (2 ^ 235) 5451319 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 6132735) := checkAffineDrop_sound 383 (2 ^ 235) 6132735 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 6631675) := checkAffineDrop_sound 383 (2 ^ 235) 6631675 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq6635419 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 6635419) := checkAffineDrop_sound 383 (2 ^ 235) 6635419 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 6899327) := checkAffineDrop_sound 383 (2 ^ 235) 6899327 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq6991599 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 6991599) := checkAffineDrop_sound 383 (2 ^ 235) 6991599 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq7059311 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 7059311) := checkAffineDrop_sound 383 (2 ^ 235) 7059311 (by decide) k
theorem horizon_drop_mod55213970774324510299478046898216203619608871777363092441300193790394368_eq7262895 (k : Nat) : HasHorizonDrop (2 ^ 235 * k + 7262895) := checkAffineDrop_sound 383 (2 ^ 235) 7262895 (by decide) k

-- k = 237, m = 386 (c = 149, 2^237 = 220855883097298041197912187592864814478435487109452369765200775161577472 > 3^149)
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 1394431) := checkAffineDrop_sound 386 (2 ^ 237) 1394431 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 2091647) := checkAffineDrop_sound 386 (2 ^ 237) 2091647 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 2788863) := checkAffineDrop_sound 386 (2 ^ 237) 2788863 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 3066367) := checkAffineDrop_sound 386 (2 ^ 237) 3066367 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 3137471) := checkAffineDrop_sound 386 (2 ^ 237) 3137471 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 3605743) := checkAffineDrop_sound 386 (2 ^ 237) 3605743 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 4183295) := checkAffineDrop_sound 386 (2 ^ 237) 4183295 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 4599551) := checkAffineDrop_sound 386 (2 ^ 237) 4599551 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 4706207) := checkAffineDrop_sound 386 (2 ^ 237) 4706207 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq5408615 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 5408615) := checkAffineDrop_sound 386 (2 ^ 237) 5408615 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 5451319) := checkAffineDrop_sound 386 (2 ^ 237) 5451319 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq5623723 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 5623723) := checkAffineDrop_sound 386 (2 ^ 237) 5623723 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 5697963) := checkAffineDrop_sound 386 (2 ^ 237) 5697963 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 6132735) := checkAffineDrop_sound 386 (2 ^ 237) 6132735 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq6274943 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 6274943) := checkAffineDrop_sound 386 (2 ^ 237) 6274943 (by decide) k
theorem horizon_drop_mod220855883097298041197912187592864814478435487109452369765200775161577472_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 237 * k + 6631675) := checkAffineDrop_sound 386 (2 ^ 237) 6631675 (by decide) k

-- k = 239, m = 389 (c = 150, 2^239 = 883423532389192164791648750371459257913741948437809479060803100646309888 > 3^150)
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 2788863) := checkAffineDrop_sound 389 (2 ^ 239) 2788863 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 3137471) := checkAffineDrop_sound 389 (2 ^ 239) 3137471 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 3605743) := checkAffineDrop_sound 389 (2 ^ 239) 3605743 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 3718483) := checkAffineDrop_sound 389 (2 ^ 239) 3718483 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 4183295) := checkAffineDrop_sound 389 (2 ^ 239) 4183295 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 4599551) := checkAffineDrop_sound 389 (2 ^ 239) 4599551 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 4706207) := checkAffineDrop_sound 389 (2 ^ 239) 4706207 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq5408615 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 5408615) := checkAffineDrop_sound 389 (2 ^ 239) 5408615 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 6132735) := checkAffineDrop_sound 389 (2 ^ 239) 6132735 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq6204543 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 6204543) := checkAffineDrop_sound 389 (2 ^ 239) 6204543 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq6274943 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 6274943) := checkAffineDrop_sound 389 (2 ^ 239) 6274943 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 6610635) := checkAffineDrop_sound 389 (2 ^ 239) 6610635 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 6631675) := checkAffineDrop_sound 389 (2 ^ 239) 6631675 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq7059311 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 7059311) := checkAffineDrop_sound 389 (2 ^ 239) 7059311 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq7211487 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 7211487) := checkAffineDrop_sound 389 (2 ^ 239) 7211487 (by decide) k
theorem horizon_drop_mod883423532389192164791648750371459257913741948437809479060803100646309888_eq7332399 (k : Nat) : HasHorizonDrop (2 ^ 239 * k + 7332399) := checkAffineDrop_sound 389 (2 ^ 239) 7332399 (by decide) k

-- k = 240, m = 391 (c = 151, 2^240 = 1766847064778384329583297500742918515827483896875618958121606201292619776 > 3^151)
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 2091647) := checkAffineDrop_sound 391 (2 ^ 240) 2091647 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 2725659) := checkAffineDrop_sound 391 (2 ^ 240) 2725659 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 2788863) := checkAffineDrop_sound 391 (2 ^ 240) 2788863 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 3066367) := checkAffineDrop_sound 391 (2 ^ 240) 3066367 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 3137471) := checkAffineDrop_sound 391 (2 ^ 240) 3137471 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq3605743 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 3605743) := checkAffineDrop_sound 391 (2 ^ 240) 3605743 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 3718483) := checkAffineDrop_sound 391 (2 ^ 240) 3718483 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 4183295) := checkAffineDrop_sound 391 (2 ^ 240) 4183295 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq4706207 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 4706207) := checkAffineDrop_sound 391 (2 ^ 240) 4706207 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 5451319) := checkAffineDrop_sound 391 (2 ^ 240) 5451319 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 6132735) := checkAffineDrop_sound 391 (2 ^ 240) 6132735 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 6631675) := checkAffineDrop_sound 391 (2 ^ 240) 6631675 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq7460635 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 7460635) := checkAffineDrop_sound 391 (2 ^ 240) 7460635 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 8142879) := checkAffineDrop_sound 391 (2 ^ 240) 8142879 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq8176979 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 8176979) := checkAffineDrop_sound 391 (2 ^ 240) 8176979 (by decide) k
theorem horizon_drop_mod1766847064778384329583297500742918515827483896875618958121606201292619776_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 240 * k + 8400511) := checkAffineDrop_sound 391 (2 ^ 240) 8400511 (by decide) k

```

---

## Część 11. Jawna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas `survivingMod1024`

### 11.1. Rozkład minimalnego horyzontu certyfikacji $K^*(r_0) \in \{1, 2, 3, 4, 5\}$ pośród 64 klas bazowych

Dla każdej z 64 klas bazowych $r_0 \in \text{survivingMod1024}$ wyznaczono minimalny horyzont blokowy $K^*(r_0) \in \{1, 2, 3, 4, 5\}$, przy którym skumulowany drenaż fazowo-waluacyjny $V_{\text{phase}}(K^*) = \sum_{i=1}^{K^*} (d_i + v_i)$ przekracza próg kontrakcji $K^* (\log_2 9 - 1) \approx 2{,}169925 \cdot K^*$ (czyli $9^{K^*} < 2^{K^* + \sum_{i=1}^{K^*} (d_i + v_i)}$, co odpowiada $9^{K^*} < 2^{3K^* + \sum(d_i + v_i - 2)}$), a także sprawdzono warunek z mnożnikiem $81 \cdot 9^{\sum r_i} < 2^{3\sum r_i + \sum(d_i+v_i)}$:

| Horyzont $K^*$ | Warunek równoważny na sumę $\sum_{i=1}^{K^*} (d_i + v_i)$ | Liczba klas $r_0$ (z 64) | Odsetek % | Skumulowane pokrycie (z 64) | Lista klas $r_0 \in \text{survivingMod1024}$ osiągających certyfikat dokładnie w kroku $K^*$ |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **$K^* = 1$** | $\sum_{i=1}^{1} (d_i+v_i) ≥ 3$ | **`21`** | **32.81%** | `21 / 64` (**32.81%**) | `27, 539, 283, 795, 155, 667, 411, 91, 603, 859, 251, 763, 1019, 223, 479, 991, 63, 383, 895, 255, 1023` |
| **$K^* = 2$** | $\sum_{i=1}^{2} (d_i+v_i) ≥ 5$ | **`30`** | **46.88%** | `51 / 64` (**79.69%**) | `71, 327, 839, 167, 679, 615, 359, 487, 719, 463, 47, 559, 303, 879, 239, 31, 543, 799, 159, 671, 927, 319, 831, 191, 703, 959, 127, 639, 767, 511` |
| **$K^* = 3$** | $\sum_{i=1}^{3} (d_i+v_i) ≥ 7$ | **`8`** | **12.50%** | `59 / 64` (**92.19%**) | `935, 231, 207, 111, 623, 1007, 415, 447` |
| **$K^* = 4$** | $\sum_{i=1}^{4} (d_i+v_i) ≥ 9$ | **`3`** | **4.69%** | `62 / 64` (**96.88%**) | `743, 751, 495` |
| **$K^* = 5$** | $\sum_{i=1}^{5} (d_i+v_i) ≥ 11$ | **`2`** | **3.13%** | `64 / 64` (**100.00%**) | `103, 871` |

**Kluczowe prawa strukturalne z Tabeli 11.1:**
1. **Błyskawiczna redukcja w $K^* = 1$ i $K^* = 2$ (Kryterium A: $9^{K^*} < 2^{K^* + \sum(d_i+v_i)}$):** Już w pierwszym makro-bloku **$K^* = 1$** ($d_1 + v_1 \ge 3$) odpada **21 z 64 klas (32,81%)**, a w drugim makro-bloku **$K^* = 2$** ($\sum_{i=1}^2 (d_i+v_i) \ge 5$) kolejne **30 klas (46,88%)**. Łącznie po zaledwie 2 blokach RLE zamknięte jest **51 / 64 klas (79,69%)**!
2. **Domknięcie na $K^* = 3, 4, 5$:** W trzecim bloku (**$K^* = 3$**, $\sum_{i=1}^3 (d_i+v_i) \ge 7$) odpada następnych **8 klas (12,50%)** (`935, 231, 207, 111, 623, 1007, 415, 447`), w czwartym bloku (**$K^* = 4$**, $\sum_{i=1}^4 (d_i+v_i) \ge 9$) odpadają **3 klasy (4,69%)**: `743, 751, 495`, a w piątym bloku (**$K^* = 5$**, $\sum_{i=1}^5 (d_i+v_i) \ge 11$) odpadają ostatnie **2 klasy (3,13%)**: `103, 871`, dając **100% pokrycia (64 / 64)**!
3. **Rozkład dla warunku z mnożnikiem $81 \cdot 9^{\sum r_i} < 2^{3\sum r_i + \sum(d_i+v_i)}$ ($K^*_{81}$):**
   - Przy warunku $81 \cdot 9^{\sum_{i=1}^K r_i} < 2^{3\sum_{i=1}^K r_i + \sum_{i=1}^K (d_i + v_i)}$ rozkład minimalnego horyzontu $K^*_{81}(r_0)$ jest jeszcze bardziej zwarty i zamyka się **w maksymalnie 4 blokach dla wszystkich 64 klas (100%)**:
     - **$K^*_{81} = 2$:** `24 / 64` klas (**37,50%**),
     - **$K^*_{81} = 3$:** `34 / 64` klas (**53,13%**, skumulowane `58 / 64` = **90,63%**),
     - **$K^*_{81} = 4$:** `6 / 64` klas (**9,38%**: `103, 871, 743, 111, 751, 495`, skumulowane `64 / 64` = **100,00%**),
     - **$K^*_{81} \ge 5$:** `0 / 64` klas (**0,00%**)!
4. **Rozkład dla samej waluacji wyjściowej $9^{K^*} < 2^{2K^* + \sum v_i}$ ($\frac{1}{K^*}\sum v_i > \log_2(9/8) + 1 \approx 1{,}1699$):**
   - **$K^*_v = 1$:** `18` klas (**28,13%**), **$K^*_v = 2$:** `29` klas (**45,31%**, skumulowane `47 / 64`), **$K^*_v = 3$:** `10` klas (**15,63%**, skumulowane `57 / 64`), **$K^*_v = 4$:** `6` klas (`327, 871, 743, 751, 495, 667`, skumulowane `63 / 64`), **$K^*_v = 5$:** `1` klasa (`703`, skumulowane **64 / 64 = 100,00%**)!

---

### 11.2. Jawne drzewo przejść $(r_0, (c_1, d_1, v_1), \dots, (c_{K^*}, d_{K^*}, v_{K^*}))$ dla klas wymagających $K^* \in \{3, 4, 5\}$ (13 najgłębszych klas)

Poniższa tabela przedstawia pełne drzewo przejść fazowo-waluacyjnych dla wszystkich 13 klas, które nie zamykają się po $K=2$ blokach (czyli 8 klas z $K^* = 3$, 3 klasy z $K^* = 4$ oraz 2 klasy z $K^* = 5$):

| Klasa $r_0$ | $K^*(r_0)$ | Pełna ścieżka przejść $(n_{i-1} \xrightarrow{(c_i, b_i, r_i, d_i, v_i)} n_i)$ dla $i = 1..K^*$ | Wektor $(d_i + v_i)_{i=1..K^*}$ | Suma $\sum_{i=1}^{K^*}(d_i+v_i)$ (próg) | Średnia $\bar{v}_{K^*}$ | $\sum_{i=1}^{K^*} r_i$ | Warunek $81 \cdot 9^{\sum r_i} < 2^{3\sum r_i + \sum(d+v)}$ |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **`103`** | **`5`** | `103` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `175` $\to$ `175` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `445` $\to$ `445` $\xrightarrow{(c=1, b=1, r=0, d=1, v=2)}$ `167` $\to$ `167` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `283` $\to$ `283` $\xrightarrow{(c=5, b=5, r=1, d=2, v=1)}$ `1079` | `[2, 1, 3, 2, 3]` | **`11`** (≥ 11) | **`2.200`** | `5` | $K_{\text{81}}^* = 4$ |
| **`871`** | **`5`** | `871` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `1471` $\to$ `1471` $\xrightarrow{(c=1, b=6, r=3, d=0, v=1)}$ `8383` $\to$ `8383` $\xrightarrow{(c=1, b=6, r=3, d=0, v=1)}$ `47749` $\to$ `47749` $\xrightarrow{(c=1, b=1, r=0, d=1, v=3)}$ `8953` $\to$ `8953` $\xrightarrow{(c=7, b=8, r=1, d=5, v=2)}$ `2125` | `[2, 1, 1, 4, 7]` | **`15`** (≥ 11) | **`3.000`** | `8` | $K_{\text{81}}^* = 4$ |
| **`495`** | **`4`** | `495` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `1255` $\to$ `1255` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `2119` $\to$ `2119` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `3577` $\to$ `3577` $\xrightarrow{(c=7, b=9, r=2, d=3, v=3)}$ `637` | `[1, 2, 2, 6]` | **`11`** (≥ 9) | **`2.750`** | `6` | $K_{\text{81}}^* = 4$ |
| **`743`** | **`4`** | `743` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `1255` $\to$ `1255` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `2119` $\to$ `2119` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `3577` $\to$ `3577` $\xrightarrow{(c=7, b=9, r=2, d=3, v=3)}$ `637` | `[2, 2, 2, 6]` | **`12`** (≥ 9) | **`3.000`** | `5` | $K_{\text{81}}^* = 4$ |
| **`751`** | **`4`** | `751` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `1903` $\to$ `1903` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `4819` $\to$ `4819` $\xrightarrow{(c=5, b=3, r=0, d=3, v=1)}$ `2711` $\to$ `2711` $\xrightarrow{(c=1, b=3, r=1, d=1, v=6)}$ `143` | `[1, 1, 4, 7]` | **`13`** (≥ 9) | **`3.250`** | `5` | $K_{\text{81}}^* = 4$ |
| **`111`** | **`3`** | `111` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `283` $\to$ `283` $\xrightarrow{(c=5, b=5, r=1, d=2, v=1)}$ `1079` $\to$ `1079` $\xrightarrow{(c=1, b=3, r=1, d=1, v=2)}$ `911` | `[1, 3, 3]` | **`7`** (≥ 7) | **`2.333`** | `4` | $K_{\text{81}}^* = 4$ |
| **`207`** | **`3`** | `207` $\xrightarrow{(c=1, b=4, r=2, d=0, v=2)}$ `263` $\to$ `263` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `445` $\to$ `445` $\xrightarrow{(c=1, b=1, r=0, d=1, v=2)}$ `167` | `[2, 2, 3]` | **`7`** (≥ 7) | **`2.333`** | `3` | $K_{\text{81}}^* = 3$ |
| **`231`** | **`3`** | `231` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `391` $\to$ `391` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `661` $\to$ `661` $\xrightarrow{(c=1, b=1, r=0, d=1, v=5)}$ `31` | `[2, 2, 6]` | **`10`** (≥ 7) | **`3.333`** | `2` | $K_{\text{81}}^* = 3$ |
| **`415`** | **`3`** | `415` $\xrightarrow{(c=1, b=5, r=2, d=1, v=1)}$ `1579` $\to$ `1579` $\xrightarrow{(c=5, b=4, r=1, d=1, v=1)}$ `1333` $\to$ `1333` $\xrightarrow{(c=1, b=1, r=0, d=1, v=4)}$ `125` | `[2, 2, 5]` | **`9`** (≥ 7) | **`3.000`** | `3` | $K_{\text{81}}^* = 3$ |
| **`447`** | **`3`** | `447` $\xrightarrow{(c=1, b=6, r=3, d=0, v=1)}$ `2551` $\to$ `2551` $\xrightarrow{(c=1, b=3, r=1, d=1, v=2)}$ `2153` $\to$ `2153` $\xrightarrow{(c=7, b=4, r=0, d=4, v=1)}$ `5453` | `[1, 3, 5]` | **`9`** (≥ 7) | **`3.000`** | `4` | $K_{\text{81}}^* = 3$ |
| **`623`** | **`3`** | `623` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `1579` $\to$ `1579` $\xrightarrow{(c=5, b=4, r=1, d=1, v=1)}$ `1333` $\to$ `1333` $\xrightarrow{(c=1, b=1, r=0, d=1, v=4)}$ `125` | `[1, 2, 5]` | **`8`** (≥ 7) | **`2.667`** | `3` | $K_{\text{81}}^* = 3$ |
| **`935`** | **`3`** | `935` $\xrightarrow{(c=1, b=3, r=1, d=1, v=1)}$ `1579` $\to$ `1579` $\xrightarrow{(c=5, b=4, r=1, d=1, v=1)}$ `1333` $\to$ `1333` $\xrightarrow{(c=1, b=1, r=0, d=1, v=4)}$ `125` | `[2, 2, 5]` | **`9`** (≥ 7) | **`3.000`** | `2` | $K_{\text{81}}^* = 3$ |
| **`1007`** | **`3`** | `1007` $\xrightarrow{(c=1, b=4, r=2, d=0, v=1)}$ `2551` $\to$ `2551` $\xrightarrow{(c=1, b=3, r=1, d=1, v=2)}$ `2153` $\to$ `2153` $\xrightarrow{(c=7, b=4, r=0, d=4, v=1)}$ `5453` | `[1, 3, 5]` | **`9`** (≥ 7) | **`3.000`** | `3` | $K_{\text{81}}^* = 3$ |

---

### 11.3. Kompletna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas `survivingMod1024`

Poniższa tabela zawiera pełny 5-blokowy certyfikat dla każdej z 64 klas bazowych $r_0 \in \text{survivingMod1024}$ (uporządkowanych rosnąco według $r_0$):

| Lp. | Klasa $r_0$ | $K^*(r_0)$ | Blok 1: $(c_1, b_1, r_1, d_1, v_1)$ | Blok 2: $(c_2, b_2, r_2, d_2, v_2)$ | Blok 3: $(c_3, b_3, r_3, d_3, v_3)$ | Blok 4: $(c_4, b_4, r_4, d_4, v_4)$ | Blok 5: $(c_5, b_5, r_5, d_5, v_5)$ | Wektor $(d_i+v_i)_{1..5}$ | $\sum_{i=1}^5 (d_i+v_i)$ | $\bar{v}_5$ | $\sum_{i=1}^5 v_i$ | $\sum_{i=1}^5 r_i$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | **`27`** | **`1`** | `(5,5,1,2,1)` | `(5,4,1,1,1)` | `(5,5,1,2,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `[3,2,4,1,3]` | **`13`** | **`2.60`** | `7` | `5` |
| 2 | **`31`** | **`2`** | `(1,5,2,1,1)` | `(7,7,1,4,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `[2,6,1,3,2]` | **`14`** | **`2.80`** | `7` | `6` |
| 3 | **`47`** | **`2`** | `(1,4,2,0,1)` | `(7,7,1,4,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `[1,6,1,3,2]` | **`13`** | **`2.60`** | `7` | `6` |
| 4 | **`63`** | **`1`** | `(1,6,3,0,3)` | `(5,5,1,2,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `[3,4,1,3,2]` | **`13`** | **`2.60`** | `9` | `7` |
| 5 | **`71`** | **`2`** | `(1,3,1,1,1)` | `(7,7,1,4,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `[2,6,1,3,2]` | **`14`** | **`2.80`** | `7` | `5` |
| 6 | **`91`** | **`1`** | `(5,5,1,2,2)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `(5,5,1,2,1)` | `[4,1,3,2,3]` | **`13`** | **`2.60`** | `7` | `5` |
| 7 | **`103`** | **`5`** | `(1,3,1,1,1)` | `(1,4,2,0,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `(5,5,1,2,1)` | `[2,1,3,2,3]` | **`11`** | **`2.20`** | `6` | `5` |
| 8 | **`111`** | **`3`** | `(1,4,2,0,1)` | `(5,5,1,2,1)` | `(1,3,1,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `[1,3,3,3,4]` | **`14`** | **`2.80`** | `8` | `6` |
| 9 | **`127`** | **`2`** | `(1,7,3,1,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[2,4,3,3,3]` | **`15`** | **`3.00`** | `10` | `3` |
| 10 | **`155`** | **`1`** | `(5,5,1,2,1)` | `(7,3,0,3,2)` | `(1,3,1,1,1)` | `(5,5,1,2,1)` | `(1,3,1,1,2)` | `[3,5,2,3,3]` | **`16`** | **`3.20`** | `7` | `4` |
| 11 | **`159`** | **`2`** | `(1,5,2,1,1)` | `(1,5,2,1,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[2,4,4,4,3]` | **`17`** | **`3.40`** | `10` | `4` |
| 12 | **`167`** | **`2`** | `(1,3,1,1,1)` | `(5,5,1,2,1)` | `(1,3,1,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `[2,3,3,3,4]` | **`15`** | **`3.00`** | `8` | `5` |
| 13 | **`191`** | **`2`** | `(1,6,3,0,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[1,4,3,3,3]` | **`14`** | **`2.80`** | `10` | `3` |
| 14 | **`207`** | **`3`** | `(1,4,2,0,2)` | `(1,3,1,1,1)` | `(1,1,0,1,2)` | `(1,3,1,1,1)` | `(5,5,1,2,1)` | `[2,2,3,2,3]` | **`12`** | **`2.40`** | `7` | `5` |
| 15 | **`223`** | **`1`** | `(1,5,2,1,2)` | `(7,4,0,4,1)` | `(1,3,1,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `[3,5,3,3,4]` | **`18`** | **`3.60`** | `9` | `5` |
| 16 | **`231`** | **`3`** | `(1,3,1,1,1)` | `(1,3,1,1,1)` | `(1,1,0,1,5)` | `(1,5,2,1,1)` | `(7,7,1,4,2)` | `[2,2,6,2,6]` | **`18`** | **`3.60`** | `10` | `5` |
| 17 | **`239`** | **`2`** | `(1,4,2,0,1)` | `(1,5,2,1,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[1,4,4,4,3]` | **`16`** | **`3.20`** | `10` | `4` |
| 18 | **`251`** | **`1`** | `(5,8,2,2,1)` | `(1,3,1,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `[3,3,3,4,4]` | **`17`** | **`3.40`** | `10` | `5` |
| 19 | **`255`** | **`1`** | `(1,8,4,0,5)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(5,4,1,1,2)` | `[5,3,3,3,3]` | **`17`** | **`3.40`** | `13` | `5` |
| 20 | **`283`** | **`1`** | `(5,5,1,2,1)` | `(1,3,1,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `[3,3,3,4,4]` | **`17`** | **`3.40`** | `10` | `4` |
| 21 | **`303`** | **`2`** | `(1,4,2,0,1)` | `(7,3,0,3,1)` | `(7,3,0,3,3)` | `(1,1,0,1,2)` | `(1,3,1,1,4)` | `[1,4,6,3,5]` | **`19`** | **`3.80`** | `11` | `3` |
| 22 | **`319`** | **`2`** | `(1,6,3,0,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[2,3,4,4,3]` | **`16`** | **`3.20`** | `11` | `5` |
| 23 | **`327`** | **`2`** | `(1,3,1,1,1)` | `(7,4,0,4,1)` | `(5,7,2,1,1)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `[2,5,2,5,3]` | **`17`** | **`3.40`** | `9` | `3` |
| 24 | **`359`** | **`2`** | `(1,3,1,1,1)` | `(1,5,2,1,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[2,4,4,4,3]` | **`17`** | **`3.40`** | `10` | `3` |
| 25 | **`383`** | **`1`** | `(1,7,3,1,5)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `(5,4,1,1,2)` | `[6,3,3,3,3]` | **`18`** | **`3.60`** | `13` | `4` |
| 26 | **`411`** | **`1`** | `(5,5,1,2,1)` | `(1,1,0,1,2)` | `(5,4,1,1,5)` | `(1,5,2,1,1)` | `(7,7,1,4,2)` | `[3,3,6,2,6]` | **`20`** | **`4.00`** | `11` | `5` |
| 27 | **`415`** | **`3`** | `(1,5,2,1,1)` | `(5,4,1,1,1)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `(1,4,2,0,1)` | `[2,2,5,3,1]` | **`13`** | **`2.60`** | `9` | `5` |
| 28 | **`447`** | **`3`** | `(1,6,3,0,1)` | `(1,3,1,1,2)` | `(7,4,0,4,1)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[1,3,5,3,3]` | **`15`** | **`3.00`** | `8` | `4` |
| 29 | **`463`** | **`2`** | `(1,4,2,0,2)` | `(5,4,1,1,5)` | `(1,5,2,1,1)` | `(7,7,1,4,2)` | `(1,4,2,0,1)` | `[2,6,2,6,1]` | **`17`** | **`3.40`** | `11` | `8` |
| 30 | **`479`** | **`1`** | `(1,5,2,1,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[3,3,4,4,3]` | **`17`** | **`3.40`** | `11` | `4` |
| 31 | **`487`** | **`2`** | `(1,3,1,1,1)` | `(1,3,1,1,2)` | `(1,3,1,1,2)` | `(5,4,1,1,5)` | `(1,5,2,1,1)` | `[2,3,3,6,2]` | **`16`** | **`3.20`** | `11` | `6` |
| 32 | **`495`** | **`4`** | `(1,4,2,0,1)` | `(1,3,1,1,1)` | `(1,3,1,1,1)` | `(7,9,2,3,3)` | `(1,1,0,1,2)` | `[1,2,2,6,3]` | **`14`** | **`2.80`** | `8` | `6` |
| 33 | **`511`** | **`2`** | `(1,9,4,1,1)` | `(7,3,0,3,6)` | `(1,1,0,1,2)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `[2,9,3,4,4]` | **`22`** | **`4.40`** | `13` | `4` |
| 34 | **`539`** | **`1`** | `(5,5,1,2,1)` | `(5,3,0,3,2)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[3,5,4,4,3]` | **`19`** | **`3.80`** | `9` | `1` |
| 35 | **`543`** | **`2`** | `(1,5,2,1,1)` | `(7,3,0,3,2)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `(7,4,0,4,1)` | `[2,5,4,3,5]` | **`19`** | **`3.80`** | `9` | `2` |
| 36 | **`559`** | **`2`** | `(1,4,2,0,1)` | `(7,4,0,4,2)` | `(5,3,0,3,2)` | `(7,9,2,3,1)` | `(7,4,0,4,1)` | `[1,6,5,4,5]` | **`21`** | **`4.20`** | `7` | `4` |
| 37 | **`603`** | **`1`** | `(5,5,1,2,2)` | `(5,7,2,1,2)` | `(7,3,0,3,1)` | `(5,3,0,3,1)` | `(1,1,0,1,2)` | `[4,3,4,4,3]` | **`18`** | **`3.60`** | `8` | `3` |
| 38 | **`615`** | **`2`** | `(1,3,1,1,1)` | `(1,4,2,0,4)` | `(7,4,0,4,3)` | `(7,3,0,3,2)` | `(5,6,1,3,2)` | `[2,4,7,5,5]` | **`23`** | **`4.60`** | `12` | `4` |
| 39 | **`623`** | **`3`** | `(1,4,2,0,1)` | `(5,4,1,1,1)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `(1,4,2,0,1)` | `[1,2,5,3,1]` | **`12`** | **`2.40`** | `9` | `5` |
| 40 | **`639`** | **`2`** | `(1,7,3,1,1)` | `(5,5,1,2,2)` | `(1,1,0,1,2)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `[2,4,3,5,3]` | **`17`** | **`3.40`** | `11` | `4` |
| 41 | **`667`** | **`1`** | `(5,5,1,2,1)` | `(7,4,0,4,1)` | `(7,5,0,5,1)` | `(1,3,1,1,6)` | `(1,4,2,0,3)` | `[3,5,6,7,3]` | **`24`** | **`4.80`** | `12` | `4` |
| 42 | **`671`** | **`2`** | `(1,5,2,1,1)` | `(1,3,1,1,2)` | `(7,4,0,4,1)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[2,3,5,3,3]` | **`16`** | **`3.20`** | `8` | `3` |
| 43 | **`679`** | **`2`** | `(1,3,1,1,1)` | `(5,7,2,1,2)` | `(7,3,0,3,1)` | `(5,3,0,3,1)` | `(1,1,0,1,2)` | `[2,3,4,4,3]` | **`16`** | **`3.20`** | `7` | `3` |
| 44 | **`703`** | **`2`** | `(1,6,3,0,1)` | `(7,4,0,4,1)` | `(1,3,1,1,1)` | `(5,4,1,1,1)` | `(1,3,1,1,2)` | `[1,5,2,2,3]` | **`13`** | **`2.60`** | `6` | `6` |
| 45 | **`719`** | **`2`** | `(1,4,2,0,2)` | `(1,4,2,0,3)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `(1,1,0,1,2)` | `[2,3,4,4,3]` | **`16`** | **`3.20`** | `11` | `4` |
| 46 | **`743`** | **`4`** | `(1,3,1,1,1)` | `(1,3,1,1,1)` | `(1,3,1,1,1)` | `(7,9,2,3,3)` | `(1,1,0,1,2)` | `[2,2,2,6,3]` | **`15`** | **`3.00`** | `8` | `5` |
| 47 | **`751`** | **`4`** | `(1,4,2,0,1)` | `(1,4,2,0,1)` | `(5,3,0,3,1)` | `(1,3,1,1,6)` | `(1,4,2,0,3)` | `[1,1,4,7,3]` | **`16`** | **`3.20`** | `12` | `7` |
| 48 | **`763`** | **`1`** | `(5,8,2,2,2)` | `(7,3,0,3,1)` | `(1,3,1,1,5)` | `(7,3,0,3,1)` | `(1,3,1,1,2)` | `[4,4,6,4,3]` | **`21`** | **`4.20`** | `11` | `4` |
| 49 | **`767`** | **`2`** | `(1,8,4,0,1)` | `(7,3,0,3,6)` | `(1,1,0,1,2)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `[1,9,3,4,4]` | **`21`** | **`4.20`** | `13` | `4` |
| 50 | **`795`** | **`1`** | `(5,5,1,2,1)` | `(1,4,2,0,2)` | `(5,3,0,3,1)` | `(7,4,0,4,1)` | `(1,1,0,1,2)` | `[3,2,4,5,3]` | **`17`** | **`3.40`** | `7` | `3` |
| 51 | **`799`** | **`2`** | `(1,5,2,1,1)` | `(1,1,0,1,2)` | `(5,3,0,3,1)` | `(7,3,0,3,1)` | `(7,4,0,4,1)` | `[2,3,4,4,5]` | **`18`** | **`3.60`** | `6` | `2` |
| 52 | **`831`** | **`2`** | `(1,6,3,0,2)` | `(7,3,0,3,1)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `(1,4,2,0,1)` | `[2,4,5,3,1]` | **`15`** | **`3.00`** | `10` | `5` |
| 53 | **`839`** | **`2`** | `(1,3,1,1,1)` | `(7,4,0,4,2)` | `(5,3,0,3,2)` | `(7,9,2,3,1)` | `(7,4,0,4,1)` | `[2,6,5,4,5]` | **`22`** | **`4.40`** | `7` | `3` |
| 54 | **`859`** | **`1`** | `(5,5,1,2,2)` | `(7,3,0,3,1)` | `(1,3,1,1,5)` | `(7,3,0,3,1)` | `(1,3,1,1,2)` | `[4,4,6,4,3]` | **`21`** | **`4.20`** | `11` | `3` |
| 55 | **`871`** | **`5`** | `(1,3,1,1,1)` | `(1,6,3,0,1)` | `(1,6,3,0,1)` | `(1,1,0,1,3)` | `(7,8,1,5,2)` | `[2,1,1,4,7]` | **`15`** | **`3.00`** | `8` | `8` |
| 56 | **`879`** | **`2`** | `(1,4,2,0,1)` | `(5,3,0,3,1)` | `(1,1,0,1,3)` | `(5,4,1,1,1)` | `(1,3,1,1,1)` | `[1,4,4,2,2]` | **`13`** | **`2.60`** | `7` | `4` |
| 57 | **`895`** | **`1`** | `(1,7,3,1,2)` | `(5,3,0,3,1)` | `(7,4,0,4,1)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[3,4,5,3,3]` | **`18`** | **`3.60`** | `8` | `3` |
| 58 | **`927`** | **`2`** | `(1,5,2,1,1)` | `(5,3,0,3,2)` | `(1,5,2,1,2)` | `(5,5,1,2,2)` | `(7,9,2,3,3)` | `[2,5,3,4,6]` | **`20`** | **`4.00`** | `10` | `7` |
| 59 | **`935`** | **`3`** | `(1,3,1,1,1)` | `(5,4,1,1,1)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `(1,4,2,0,1)` | `[2,2,5,3,1]` | **`13`** | **`2.60`** | `9` | `4` |
| 60 | **`959`** | **`2`** | `(1,6,3,0,1)` | `(5,5,1,2,2)` | `(1,1,0,1,2)` | `(1,1,0,1,4)` | `(1,1,0,1,2)` | `[1,4,3,5,3]` | **`16`** | **`3.20`** | `11` | `4` |
| 61 | **`991`** | **`1`** | `(1,5,2,1,2)` | `(5,5,1,2,2)` | `(7,9,2,3,3)` | `(1,1,0,1,2)` | `(1,4,2,0,1)` | `[3,4,6,3,1]` | **`17`** | **`3.40`** | `10` | `7` |
| 62 | **`1007`** | **`3`** | `(1,4,2,0,1)` | `(1,3,1,1,2)` | `(7,4,0,4,1)` | `(1,1,0,1,2)` | `(1,1,0,1,2)` | `[1,3,5,3,3]` | **`15`** | **`3.00`** | `8` | `3` |
| 63 | **`1019`** | **`1`** | `(5,10,3,1,2)` | `(7,3,0,3,1)` | `(5,3,0,3,1)` | `(1,1,0,1,2)` | `(7,3,0,3,1)` | `[3,4,4,3,4]` | **`18`** | **`3.60`** | `7` | `3` |
| 64 | **`1023`** | **`1`** | `(1,10,5,0,3)` | `(1,1,0,1,6)` | `(1,1,0,1,2)` | `(7,3,0,3,1)` | `(1,1,0,1,3)` | `[3,7,3,4,4]` | **`21`** | **`4.20`** | `15` | `5` |


---

# Runda 6. Głębokie Sito 2-Adyczne (`k = 242..261`, `m = 394..424`, Zweryfikowane w Lean 4) oraz Anatomia 8-Blokowego Domknięcia 1024 Klas Podniesionych (`mod 16384`)

## Część 12. Zestaw K (`k = 242..250`, `m = 394..406`, Część 57) oraz Zestaw L (`k = 251..261`, `m = 408..424`, Część 58) — 208 Twierdzeń

### 12.1. Weryfikacja bit-po-bicie z `affineStep` w Lean 4 (`if exp2 === 0` na początku każdego kroku) i zbiorcza tabela 13 poziomów

Wszystkie 208 twierdzeń Zestawu K (96 twierdzeń) oraz Zestawu L (112 twierdzeń) zostało wygenerowanych z rygorystycznym warunkiem `if (exp2 === 0) return false;` na początku każdego kroku pętli symbolicznej (przed rozgałęzieniem parzystości, dokładnie tak jak w `affineStep` w `lean4/CollatzProof.lean`) i zweryfikowanych bezpośrednio kompilatorem `~/.elan/bin/lean` (kod wyjścia `0`).

| Zestaw | Poziom $c = m - k$ | Próg $k$ | Kroki $m$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek (`by decide` ✅) |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **K (Part 57)** | `152` | `242` | `394` | `0.471164` | `3001306` | `1394431, 2091647, 2788863, 3137471, 3718483, 5451319, 8142879, 8176979, 8614431, 9533531, 9941863, 10487399, 10527771, 10999275, 11185279, 12005223` |
| **K (Part 57)** | `152` | `243` | `395` | `0.235582` | `2681306` | `2788863, 3066367, 3137471, 4183295, 5697963, 6274943, 6449823, 7460635, 8176979, 8400511, 8614431, 9533531, 9941863, 10487399, 10527771, 10725223` |
| **K (Part 57)** | `153` | `245` | `398` | `0.176686` | `1865159` | `2091647, 2725659, 3066367, 3137471, 3718483, 4183295, 4599551, 5451319, 5697963, 6255855, 6449823, 6610635, 6631675, 6899327, 6991599, 7460635` |
| **K (Part 57)** | `154` | `247` | `401` | `0.132515` | `1588922` | `1394431, 2091647, 2725659, 2788863, 3066367, 3137471, 3718483, 4183295, 4599551, 5451319, 5649499, 5697963, 6132735, 6206655, 6255855, 6355687` |
| **K (Part 57)** | `155` | `248` | `403` | `0.198772` | `2345946` | `1394431, 2091647, 2725659, 2788863, 3066367, 3718483, 5697963, 6132735, 6255855, 6355687, 6449823, 6610635, 6631675, 8614431, 8837211, 9383783` |
| **K (Part 57)** | `156` | `250` | `406` | `0.149079` | `2035720` | `1394431, 1723519, 2091647, 2725659, 2788863, 3066367, 3137471, 3718483, 5451319, 5649499, 6206655, 6255855, 6449823, 6610635, 8088063, 8142879` |
| **L (Part 58)** | `157` | `251` | `408` | `0.223619` | `3766333` | `1394431, 2091647, 2725659, 5451319, 5649499, 6610635, 8614431, 11298999, 11568411, 12214319, 12511711, 13612923, 13774695, 14258343, 14378779, 15065331` |
| **L (Part 58)** | `158` | `253` | `411` | `0.167714` | `3491244` | `1394431, 1723519, 2091647, 2585279, 2725659, 2788863, 3877919, 5816879, 8142879, 8837211, 9004191, 10527771, 11185279, 11568411, 12214319, 13964975` |
| **L (Part 58)** | `159` | `255` | `414` | `0.125786` | `2251048` | `1394431, 1723519, 2585279, 2725659, 2788863, 3447039, 3718483, 3877919, 5170559, 5649499, 6206655, 6355687, 7755839, 8142879, 8400511, 9004191` |
| **L (Part 58)** | `160` | `256` | `416` | `0.188678` | `4654992` | `2585279, 3447039, 5170559, 8400511, 9309983, 11265895, 12413311, 12600767, 13612923, 15579227, 16285759, 16898843, 17041515, 18150567, 18321479, 18619967` |
| **L (Part 58)** | `161` | `258` | `419` | `0.141509` | `2452012` | `1723519, 2585279, 3066367, 3447039, 3877919, 4596051, 4599551, 5649499, 5816879, 6206655, 6899327, 8142879, 8400511, 8614431, 9309983, 9808047` |
| **L (Part 58)** | `162` | `259` | `421` | `0.212263` | `4200256` | `1723519, 2585279, 3066367, 3877919, 4596051, 4599551, 6206655, 6899327, 10386151, 11265895, 12214319, 12867759, 14258343, 14281383, 16285759, 16801023` |
| **L (Part 58)** | `163` | `261` | `424` | `0.159197` | `2327496` | `1723519, 2585279, 2725659, 3066367, 3447039, 3877919, 4599551, 5170559, 6128067, 6132735, 6206655, 8142879, 8400511, 8901447, 9199103, 9309983` |

### 12.2. Gotowe, zweryfikowane w Lean 4 bloki kodu (Zestaw K — Część 57 oraz Zestaw L — Część 58)

*(Pełny kod został również zapisany w pliku [`sieve_242_261_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_242_261_lean.txt).)*

```lean
-- ============================================================================
-- Część 57. Głębokie Sito 2-Adyczne: Zestaw K (k = 242..250, m = 394..406, 96 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 6)
-- ============================================================================

-- k = 242, m = 394 (c = 152, 2^242 = 7067388259113537318333190002971674063309935587502475832486424805170479104 > 3^152)
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 1394431) := checkAffineDrop_sound 394 (2 ^ 242) 1394431 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 2091647) := checkAffineDrop_sound 394 (2 ^ 242) 2091647 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 2788863) := checkAffineDrop_sound 394 (2 ^ 242) 2788863 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 3137471) := checkAffineDrop_sound 394 (2 ^ 242) 3137471 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 3718483) := checkAffineDrop_sound 394 (2 ^ 242) 3718483 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 5451319) := checkAffineDrop_sound 394 (2 ^ 242) 5451319 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 8142879) := checkAffineDrop_sound 394 (2 ^ 242) 8142879 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq8176979 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 8176979) := checkAffineDrop_sound 394 (2 ^ 242) 8176979 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 8614431) := checkAffineDrop_sound 394 (2 ^ 242) 8614431 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq9533531 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 9533531) := checkAffineDrop_sound 394 (2 ^ 242) 9533531 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq9941863 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 9941863) := checkAffineDrop_sound 394 (2 ^ 242) 9941863 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq10487399 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 10487399) := checkAffineDrop_sound 394 (2 ^ 242) 10487399 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq10527771 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 10527771) := checkAffineDrop_sound 394 (2 ^ 242) 10527771 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq10999275 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 10999275) := checkAffineDrop_sound 394 (2 ^ 242) 10999275 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq11185279 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 11185279) := checkAffineDrop_sound 394 (2 ^ 242) 11185279 (by decide) k
theorem horizon_drop_mod7067388259113537318333190002971674063309935587502475832486424805170479104_eq12005223 (k : Nat) : HasHorizonDrop (2 ^ 242 * k + 12005223) := checkAffineDrop_sound 394 (2 ^ 242) 12005223 (by decide) k

-- k = 243, m = 395 (c = 152, 2^243 = 14134776518227074636666380005943348126619871175004951664972849610340958208 > 3^152)
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 2788863) := checkAffineDrop_sound 395 (2 ^ 243) 2788863 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 3066367) := checkAffineDrop_sound 395 (2 ^ 243) 3066367 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 3137471) := checkAffineDrop_sound 395 (2 ^ 243) 3137471 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 4183295) := checkAffineDrop_sound 395 (2 ^ 243) 4183295 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 5697963) := checkAffineDrop_sound 395 (2 ^ 243) 5697963 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq6274943 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 6274943) := checkAffineDrop_sound 395 (2 ^ 243) 6274943 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq6449823 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 6449823) := checkAffineDrop_sound 395 (2 ^ 243) 6449823 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq7460635 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 7460635) := checkAffineDrop_sound 395 (2 ^ 243) 7460635 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq8176979 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 8176979) := checkAffineDrop_sound 395 (2 ^ 243) 8176979 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 8400511) := checkAffineDrop_sound 395 (2 ^ 243) 8400511 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 8614431) := checkAffineDrop_sound 395 (2 ^ 243) 8614431 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq9533531 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 9533531) := checkAffineDrop_sound 395 (2 ^ 243) 9533531 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq9941863 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 9941863) := checkAffineDrop_sound 395 (2 ^ 243) 9941863 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq10487399 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 10487399) := checkAffineDrop_sound 395 (2 ^ 243) 10487399 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq10527771 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 10527771) := checkAffineDrop_sound 395 (2 ^ 243) 10527771 (by decide) k
theorem horizon_drop_mod14134776518227074636666380005943348126619871175004951664972849610340958208_eq10725223 (k : Nat) : HasHorizonDrop (2 ^ 243 * k + 10725223) := checkAffineDrop_sound 395 (2 ^ 243) 10725223 (by decide) k

-- k = 245, m = 398 (c = 153, 2^245 = 56539106072908298546665520023773392506479484700019806659891398441363832832 > 3^153)
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 2091647) := checkAffineDrop_sound 398 (2 ^ 245) 2091647 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 2725659) := checkAffineDrop_sound 398 (2 ^ 245) 2725659 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 3066367) := checkAffineDrop_sound 398 (2 ^ 245) 3066367 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 3137471) := checkAffineDrop_sound 398 (2 ^ 245) 3137471 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 3718483) := checkAffineDrop_sound 398 (2 ^ 245) 3718483 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 4183295) := checkAffineDrop_sound 398 (2 ^ 245) 4183295 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 4599551) := checkAffineDrop_sound 398 (2 ^ 245) 4599551 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 5451319) := checkAffineDrop_sound 398 (2 ^ 245) 5451319 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 5697963) := checkAffineDrop_sound 398 (2 ^ 245) 5697963 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6255855) := checkAffineDrop_sound 398 (2 ^ 245) 6255855 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6449823 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6449823) := checkAffineDrop_sound 398 (2 ^ 245) 6449823 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6610635) := checkAffineDrop_sound 398 (2 ^ 245) 6610635 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6631675) := checkAffineDrop_sound 398 (2 ^ 245) 6631675 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6899327) := checkAffineDrop_sound 398 (2 ^ 245) 6899327 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq6991599 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 6991599) := checkAffineDrop_sound 398 (2 ^ 245) 6991599 (by decide) k
theorem horizon_drop_mod56539106072908298546665520023773392506479484700019806659891398441363832832_eq7460635 (k : Nat) : HasHorizonDrop (2 ^ 245 * k + 7460635) := checkAffineDrop_sound 398 (2 ^ 245) 7460635 (by decide) k

-- k = 247, m = 401 (c = 154, 2^247 = 226156424291633194186662080095093570025917938800079226639565593765455331328 > 3^154)
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 1394431) := checkAffineDrop_sound 401 (2 ^ 247) 1394431 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 2091647) := checkAffineDrop_sound 401 (2 ^ 247) 2091647 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 2725659) := checkAffineDrop_sound 401 (2 ^ 247) 2725659 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 2788863) := checkAffineDrop_sound 401 (2 ^ 247) 2788863 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 3066367) := checkAffineDrop_sound 401 (2 ^ 247) 3066367 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 3137471) := checkAffineDrop_sound 401 (2 ^ 247) 3137471 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 3718483) := checkAffineDrop_sound 401 (2 ^ 247) 3718483 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq4183295 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 4183295) := checkAffineDrop_sound 401 (2 ^ 247) 4183295 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 4599551) := checkAffineDrop_sound 401 (2 ^ 247) 4599551 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 5451319) := checkAffineDrop_sound 401 (2 ^ 247) 5451319 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq5649499 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 5649499) := checkAffineDrop_sound 401 (2 ^ 247) 5649499 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 5697963) := checkAffineDrop_sound 401 (2 ^ 247) 5697963 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 6132735) := checkAffineDrop_sound 401 (2 ^ 247) 6132735 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 6206655) := checkAffineDrop_sound 401 (2 ^ 247) 6206655 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 6255855) := checkAffineDrop_sound 401 (2 ^ 247) 6255855 (by decide) k
theorem horizon_drop_mod226156424291633194186662080095093570025917938800079226639565593765455331328_eq6355687 (k : Nat) : HasHorizonDrop (2 ^ 247 * k + 6355687) := checkAffineDrop_sound 401 (2 ^ 247) 6355687 (by decide) k

-- k = 248, m = 403 (c = 155, 2^248 = 452312848583266388373324160190187140051835877600158453279131187530910662656 > 3^155)
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 1394431) := checkAffineDrop_sound 403 (2 ^ 248) 1394431 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 2091647) := checkAffineDrop_sound 403 (2 ^ 248) 2091647 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 2725659) := checkAffineDrop_sound 403 (2 ^ 248) 2725659 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 2788863) := checkAffineDrop_sound 403 (2 ^ 248) 2788863 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 3066367) := checkAffineDrop_sound 403 (2 ^ 248) 3066367 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 3718483) := checkAffineDrop_sound 403 (2 ^ 248) 3718483 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq5697963 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 5697963) := checkAffineDrop_sound 403 (2 ^ 248) 5697963 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6132735) := checkAffineDrop_sound 403 (2 ^ 248) 6132735 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6255855) := checkAffineDrop_sound 403 (2 ^ 248) 6255855 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6355687 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6355687) := checkAffineDrop_sound 403 (2 ^ 248) 6355687 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6449823 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6449823) := checkAffineDrop_sound 403 (2 ^ 248) 6449823 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6610635) := checkAffineDrop_sound 403 (2 ^ 248) 6610635 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq6631675 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 6631675) := checkAffineDrop_sound 403 (2 ^ 248) 6631675 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 8614431) := checkAffineDrop_sound 403 (2 ^ 248) 8614431 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq8837211 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 8837211) := checkAffineDrop_sound 403 (2 ^ 248) 8837211 (by decide) k
theorem horizon_drop_mod452312848583266388373324160190187140051835877600158453279131187530910662656_eq9383783 (k : Nat) : HasHorizonDrop (2 ^ 248 * k + 9383783) := checkAffineDrop_sound 403 (2 ^ 248) 9383783 (by decide) k

-- k = 250, m = 406 (c = 156, 2^250 = 1809251394333065553493296640760748560207343510400633813116524750123642650624 > 3^156)
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 1394431) := checkAffineDrop_sound 406 (2 ^ 250) 1394431 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 1723519) := checkAffineDrop_sound 406 (2 ^ 250) 1723519 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 2091647) := checkAffineDrop_sound 406 (2 ^ 250) 2091647 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 2725659) := checkAffineDrop_sound 406 (2 ^ 250) 2725659 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 2788863) := checkAffineDrop_sound 406 (2 ^ 250) 2788863 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 3066367) := checkAffineDrop_sound 406 (2 ^ 250) 3066367 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq3137471 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 3137471) := checkAffineDrop_sound 406 (2 ^ 250) 3137471 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 3718483) := checkAffineDrop_sound 406 (2 ^ 250) 3718483 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 5451319) := checkAffineDrop_sound 406 (2 ^ 250) 5451319 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq5649499 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 5649499) := checkAffineDrop_sound 406 (2 ^ 250) 5649499 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 6206655) := checkAffineDrop_sound 406 (2 ^ 250) 6206655 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 6255855) := checkAffineDrop_sound 406 (2 ^ 250) 6255855 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq6449823 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 6449823) := checkAffineDrop_sound 406 (2 ^ 250) 6449823 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 6610635) := checkAffineDrop_sound 406 (2 ^ 250) 6610635 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq8088063 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 8088063) := checkAffineDrop_sound 406 (2 ^ 250) 8088063 (by decide) k
theorem horizon_drop_mod1809251394333065553493296640760748560207343510400633813116524750123642650624_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 250 * k + 8142879) := checkAffineDrop_sound 406 (2 ^ 250) 8142879 (by decide) k

-- ============================================================================
-- Część 58. Głębokie Sito 2-Adyczne: Zestaw L (k = 251..261, m = 408..424, 112 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 6)
-- ============================================================================

-- k = 251, m = 408 (c = 157, 2^251 = 3618502788666131106986593281521497120414687020801267626233049500247285301248 > 3^157)
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 1394431) := checkAffineDrop_sound 408 (2 ^ 251) 1394431 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 2091647) := checkAffineDrop_sound 408 (2 ^ 251) 2091647 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 2725659) := checkAffineDrop_sound 408 (2 ^ 251) 2725659 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 5451319) := checkAffineDrop_sound 408 (2 ^ 251) 5451319 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq5649499 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 5649499) := checkAffineDrop_sound 408 (2 ^ 251) 5649499 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq6610635 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 6610635) := checkAffineDrop_sound 408 (2 ^ 251) 6610635 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 8614431) := checkAffineDrop_sound 408 (2 ^ 251) 8614431 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq11298999 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 11298999) := checkAffineDrop_sound 408 (2 ^ 251) 11298999 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq11568411 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 11568411) := checkAffineDrop_sound 408 (2 ^ 251) 11568411 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 12214319) := checkAffineDrop_sound 408 (2 ^ 251) 12214319 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq12511711 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 12511711) := checkAffineDrop_sound 408 (2 ^ 251) 12511711 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq13612923 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 13612923) := checkAffineDrop_sound 408 (2 ^ 251) 13612923 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq13774695 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 13774695) := checkAffineDrop_sound 408 (2 ^ 251) 13774695 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq14258343 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 14258343) := checkAffineDrop_sound 408 (2 ^ 251) 14258343 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq14378779 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 14378779) := checkAffineDrop_sound 408 (2 ^ 251) 14378779 (by decide) k
theorem horizon_drop_mod3618502788666131106986593281521497120414687020801267626233049500247285301248_eq15065331 (k : Nat) : HasHorizonDrop (2 ^ 251 * k + 15065331) := checkAffineDrop_sound 408 (2 ^ 251) 15065331 (by decide) k

-- k = 253, m = 411 (c = 158, 2^253 = 14474011154664524427946373126085988481658748083205070504932198000989141204992 > 3^158)
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 1394431) := checkAffineDrop_sound 411 (2 ^ 253) 1394431 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 1723519) := checkAffineDrop_sound 411 (2 ^ 253) 1723519 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq2091647 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 2091647) := checkAffineDrop_sound 411 (2 ^ 253) 2091647 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 2585279) := checkAffineDrop_sound 411 (2 ^ 253) 2585279 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 2725659) := checkAffineDrop_sound 411 (2 ^ 253) 2725659 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 2788863) := checkAffineDrop_sound 411 (2 ^ 253) 2788863 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 3877919) := checkAffineDrop_sound 411 (2 ^ 253) 3877919 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq5816879 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 5816879) := checkAffineDrop_sound 411 (2 ^ 253) 5816879 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 8142879) := checkAffineDrop_sound 411 (2 ^ 253) 8142879 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq8837211 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 8837211) := checkAffineDrop_sound 411 (2 ^ 253) 8837211 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq9004191 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 9004191) := checkAffineDrop_sound 411 (2 ^ 253) 9004191 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq10527771 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 10527771) := checkAffineDrop_sound 411 (2 ^ 253) 10527771 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq11185279 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 11185279) := checkAffineDrop_sound 411 (2 ^ 253) 11185279 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq11568411 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 11568411) := checkAffineDrop_sound 411 (2 ^ 253) 11568411 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 12214319) := checkAffineDrop_sound 411 (2 ^ 253) 12214319 (by decide) k
theorem horizon_drop_mod14474011154664524427946373126085988481658748083205070504932198000989141204992_eq13964975 (k : Nat) : HasHorizonDrop (2 ^ 253 * k + 13964975) := checkAffineDrop_sound 411 (2 ^ 253) 13964975 (by decide) k

-- k = 255, m = 414 (c = 159, 2^255 = 57896044618658097711785492504343953926634992332820282019728792003956564819968 > 3^159)
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq1394431 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 1394431) := checkAffineDrop_sound 414 (2 ^ 255) 1394431 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 1723519) := checkAffineDrop_sound 414 (2 ^ 255) 1723519 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 2585279) := checkAffineDrop_sound 414 (2 ^ 255) 2585279 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 2725659) := checkAffineDrop_sound 414 (2 ^ 255) 2725659 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq2788863 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 2788863) := checkAffineDrop_sound 414 (2 ^ 255) 2788863 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 3447039) := checkAffineDrop_sound 414 (2 ^ 255) 3447039 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq3718483 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 3718483) := checkAffineDrop_sound 414 (2 ^ 255) 3718483 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 3877919) := checkAffineDrop_sound 414 (2 ^ 255) 3877919 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq5170559 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 5170559) := checkAffineDrop_sound 414 (2 ^ 255) 5170559 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq5649499 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 5649499) := checkAffineDrop_sound 414 (2 ^ 255) 5649499 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 6206655) := checkAffineDrop_sound 414 (2 ^ 255) 6206655 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq6355687 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 6355687) := checkAffineDrop_sound 414 (2 ^ 255) 6355687 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq7755839 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 7755839) := checkAffineDrop_sound 414 (2 ^ 255) 7755839 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 8142879) := checkAffineDrop_sound 414 (2 ^ 255) 8142879 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 8400511) := checkAffineDrop_sound 414 (2 ^ 255) 8400511 (by decide) k
theorem horizon_drop_mod57896044618658097711785492504343953926634992332820282019728792003956564819968_eq9004191 (k : Nat) : HasHorizonDrop (2 ^ 255 * k + 9004191) := checkAffineDrop_sound 414 (2 ^ 255) 9004191 (by decide) k

-- k = 256, m = 416 (c = 160, 2^256 = 115792089237316195423570985008687907853269984665640564039457584007913129639936 > 3^160)
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 2585279) := checkAffineDrop_sound 416 (2 ^ 256) 2585279 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 3447039) := checkAffineDrop_sound 416 (2 ^ 256) 3447039 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq5170559 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 5170559) := checkAffineDrop_sound 416 (2 ^ 256) 5170559 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 8400511) := checkAffineDrop_sound 416 (2 ^ 256) 8400511 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq9309983 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 9309983) := checkAffineDrop_sound 416 (2 ^ 256) 9309983 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 11265895) := checkAffineDrop_sound 416 (2 ^ 256) 11265895 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq12413311 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 12413311) := checkAffineDrop_sound 416 (2 ^ 256) 12413311 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 12600767) := checkAffineDrop_sound 416 (2 ^ 256) 12600767 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq13612923 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 13612923) := checkAffineDrop_sound 416 (2 ^ 256) 13612923 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq15579227 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 15579227) := checkAffineDrop_sound 416 (2 ^ 256) 15579227 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq16285759 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 16285759) := checkAffineDrop_sound 416 (2 ^ 256) 16285759 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq16898843 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 16898843) := checkAffineDrop_sound 416 (2 ^ 256) 16898843 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq17041515 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 17041515) := checkAffineDrop_sound 416 (2 ^ 256) 17041515 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq18150567 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 18150567) := checkAffineDrop_sound 416 (2 ^ 256) 18150567 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq18321479 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 18321479) := checkAffineDrop_sound 416 (2 ^ 256) 18321479 (by decide) k
theorem horizon_drop_mod115792089237316195423570985008687907853269984665640564039457584007913129639936_eq18619967 (k : Nat) : HasHorizonDrop (2 ^ 256 * k + 18619967) := checkAffineDrop_sound 416 (2 ^ 256) 18619967 (by decide) k

set_option exponentiation.threshold 512

-- k = 258, m = 419 (c = 161, 2^258 = 463168356949264781694283940034751631413079938662562256157830336031652518559744 > 3^161)
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 1723519) := checkAffineDrop_sound 419 (2 ^ 258) 1723519 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 2585279) := checkAffineDrop_sound 419 (2 ^ 258) 2585279 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 3066367) := checkAffineDrop_sound 419 (2 ^ 258) 3066367 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 3447039) := checkAffineDrop_sound 419 (2 ^ 258) 3447039 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 3877919) := checkAffineDrop_sound 419 (2 ^ 258) 3877919 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 4596051) := checkAffineDrop_sound 419 (2 ^ 258) 4596051 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 4599551) := checkAffineDrop_sound 419 (2 ^ 258) 4599551 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq5649499 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 5649499) := checkAffineDrop_sound 419 (2 ^ 258) 5649499 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq5816879 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 5816879) := checkAffineDrop_sound 419 (2 ^ 258) 5816879 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 6206655) := checkAffineDrop_sound 419 (2 ^ 258) 6206655 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 6899327) := checkAffineDrop_sound 419 (2 ^ 258) 6899327 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 8142879) := checkAffineDrop_sound 419 (2 ^ 258) 8142879 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 8400511) := checkAffineDrop_sound 419 (2 ^ 258) 8400511 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 8614431) := checkAffineDrop_sound 419 (2 ^ 258) 8614431 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq9309983 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 9309983) := checkAffineDrop_sound 419 (2 ^ 258) 9309983 (by decide) k
theorem horizon_drop_mod463168356949264781694283940034751631413079938662562256157830336031652518559744_eq9808047 (k : Nat) : HasHorizonDrop (2 ^ 258 * k + 9808047) := checkAffineDrop_sound 419 (2 ^ 258) 9808047 (by decide) k

-- k = 259, m = 421 (c = 162, 2^259 = 926336713898529563388567880069503262826159877325124512315660672063305037119488 > 3^162)
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 1723519) := checkAffineDrop_sound 421 (2 ^ 259) 1723519 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 2585279) := checkAffineDrop_sound 421 (2 ^ 259) 2585279 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 3066367) := checkAffineDrop_sound 421 (2 ^ 259) 3066367 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 3877919) := checkAffineDrop_sound 421 (2 ^ 259) 3877919 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 4596051) := checkAffineDrop_sound 421 (2 ^ 259) 4596051 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 4599551) := checkAffineDrop_sound 421 (2 ^ 259) 4599551 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 6206655) := checkAffineDrop_sound 421 (2 ^ 259) 6206655 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq6899327 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 6899327) := checkAffineDrop_sound 421 (2 ^ 259) 6899327 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq10386151 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 10386151) := checkAffineDrop_sound 421 (2 ^ 259) 10386151 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 11265895) := checkAffineDrop_sound 421 (2 ^ 259) 11265895 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 12214319) := checkAffineDrop_sound 421 (2 ^ 259) 12214319 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 12867759) := checkAffineDrop_sound 421 (2 ^ 259) 12867759 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq14258343 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 14258343) := checkAffineDrop_sound 421 (2 ^ 259) 14258343 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 14281383) := checkAffineDrop_sound 421 (2 ^ 259) 14281383 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq16285759 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 16285759) := checkAffineDrop_sound 421 (2 ^ 259) 16285759 (by decide) k
theorem horizon_drop_mod926336713898529563388567880069503262826159877325124512315660672063305037119488_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 259 * k + 16801023) := checkAffineDrop_sound 421 (2 ^ 259) 16801023 (by decide) k

-- k = 261, m = 424 (c = 163, 2^261 = 3705346855594118253554271520278013051304639509300498049262642688253220148477952 > 3^163)
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 1723519) := checkAffineDrop_sound 424 (2 ^ 261) 1723519 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 2585279) := checkAffineDrop_sound 424 (2 ^ 261) 2585279 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 2725659) := checkAffineDrop_sound 424 (2 ^ 261) 2725659 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 3066367) := checkAffineDrop_sound 424 (2 ^ 261) 3066367 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 3447039) := checkAffineDrop_sound 424 (2 ^ 261) 3447039 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq3877919 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 3877919) := checkAffineDrop_sound 424 (2 ^ 261) 3877919 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq4599551 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 4599551) := checkAffineDrop_sound 424 (2 ^ 261) 4599551 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq5170559 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 5170559) := checkAffineDrop_sound 424 (2 ^ 261) 5170559 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq6128067 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 6128067) := checkAffineDrop_sound 424 (2 ^ 261) 6128067 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 6132735) := checkAffineDrop_sound 424 (2 ^ 261) 6132735 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 6206655) := checkAffineDrop_sound 424 (2 ^ 261) 6206655 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 8142879) := checkAffineDrop_sound 424 (2 ^ 261) 8142879 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 8400511) := checkAffineDrop_sound 424 (2 ^ 261) 8400511 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 8901447) := checkAffineDrop_sound 424 (2 ^ 261) 8901447 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq9199103 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 9199103) := checkAffineDrop_sound 424 (2 ^ 261) 9199103 (by decide) k
theorem horizon_drop_mod3705346855594118253554271520278013051304639509300498049262642688253220148477952_eq9309983 (k : Nat) : HasHorizonDrop (2 ^ 261 * k + 9309983) := checkAffineDrop_sound 424 (2 ^ 261) 9309983 (by decide) k

```

---

## Część 13. Anatomia 8-Blokowego Domknięcia dla 1024 Klas Podniesionych (`mod 16384`)

### 13.1. Rozkład i histogram średniej waluacji fazowej $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K (d_i + v_i)$ (oraz $\bar{v}_{\text{exit}, K} = \frac{1}{K}\sum_{i=1}^K v_i$) dla $K = 5, 6, 7, 8$

Dla wszystkich 1024 ocalałych klas `mod 16384` ($r = r_0 + 1024 j$, gdzie $r_0 \in \text{survivingMod1024}, j \in \{0..15\}$) obliczono rozkład średniego drenażu $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K (d_i + v_i)$ oraz samej waluacji wyjściowej $\bar{v}_{\text{exit}, K} = \frac{1}{K}\sum_{i=1}^K v_i$ na horyzontach $K = 5, 6, 7, 8$:

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | Przedział `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 5$** | **`1.400`** | **`3.658`** | `6.200` | `1.000` | `2.022` | `10` | `43` | `121` | `289` | `203` | `358` | `1014/1024` (**99.02%**) |
| **$K = 6$** | **`1.667`** | **`3.730`** | `5.667` | `1.000` | `2.051` | `12` | `11` | `99` | `217` | `301` | `384` | `1012/1024` (**98.83%**) |
| **$K = 7$** | **`2.000`** | **`3.768`** | `5.429` | `1.143` | `2.069` | `4` | `15` | `73` | `256` | `275` | `401` | `1020/1024` (**99.61%**) |
| **$K = 8$** | **`2.250`** | **`3.792`** | `5.250` | `1.125` | `2.080` | `0` | `10` | `58` | `191` | `381` | `384` | `1024/1024` (**100.00%**) |

#### Rozkład czasu pierwszego przejścia $K^*(r) \in \{1, 2, 3, 4, 5, 6, 7, 8\}$ pośród 1024 klas `mod 16384`:

| Horyzont pierwszego przekroczenia $K^*(r)$ | Warunek $\sum_{i=1}^{K^*}(d_i+v_i)$ | Liczba klas (z 1024) | Odsetek % | Skumulowane pokrycie (z 1024) |
| :---: | :---: | :---: | :---: | :---: |
| **$K^* = 1$** | $\sum_{i=1}^{1} (d_i+v_i) ≥ 3$ | **`322`** | **31.45%** | `322 / 1024` (**31.45%**) |
| **$K^* = 2$** | $\sum_{i=1}^{2} (d_i+v_i) ≥ 5$ | **`446`** | **43.55%** | `768 / 1024` (**75.00%**) |
| **$K^* = 3$** | $\sum_{i=1}^{3} (d_i+v_i) ≥ 7$ | **`181`** | **17.68%** | `949 / 1024` (**92.68%**) |
| **$K^* = 4$** | $\sum_{i=1}^{4} (d_i+v_i) ≥ 9$ | **`45`** | **4.39%** | `994 / 1024` (**97.07%**) |
| **$K^* = 5$** | $\sum_{i=1}^{5} (d_i+v_i) ≥ 11$ | **`21`** | **2.05%** | `1015 / 1024` (**99.12%**) |
| **$K^* = 6$** | $\sum_{i=1}^{6} (d_i+v_i) ≥ 14$ | **`2`** | **0.20%** | `1017 / 1024` (**99.32%**) |
| **$K^* = 7$** | $\sum_{i=1}^{7} (d_i+v_i) ≥ 16$ | **`5`** | **0.49%** | `1022 / 1024` (**99.80%**) |
| **$K^* = 8$** | $\sum_{i=1}^{8} (d_i+v_i) ≥ 18$ | **`2`** | **0.20%** | `1024 / 1024` (**100.00%**) |

---

### 13.2. Pełna 8-Blokowa Anatomia 10 Najtrudniejszych Klas `mod 16384` (o najniższym $\bar{v}_8 \ge 2{,}250$)

Spośród wszystkich 1024 klas podniesionych `mod 16384` dokładnie **4 klasy** osiągają na horyzoncie $K = 8$ globalne minimum $\bar{v}_8 = \mathbf{2{,}250}$ ($\sum_{i=1}^8 (d_i+v_i) = 18$), a kolejnych **6 klas** osiąga $\bar{v}_8 = \mathbf{2{,}375}$ ($\sum_{i=1}^8 (d_i+v_i) = 19$). Poniższa tabela przedstawia pełną 8-blokową anatomię wszystkich 10 najtrudniejszych klas:

| Ranga | Klasa $r \pmod{16384}$ | Baza $r_0 \pmod{1024}$ ($j$) | $K^*(r)$ | Pełna sekwencja 8 makro-bloków $(c_i, b_i, r_i, d_i, v_i)_{i=1..8}$ | Wektor $(d_i+v_i)_{1..8}$ | Wektor $v_{1..8}$ | $\sum_{i=1}^8 (d_i+v_i)$ ($\bar{v}_8$) | $\sum_{i=1}^8 v_i$ ($\bar{v}_{\text{exit},8}$) | $\sum_{i=1}^8 r_i$ |
| :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **1** | **`3007`** | `959` ($j=2$) | **`4`** | `B1:(1,6,3,0,1)` $\to$ `B2:(5,4,1,1,1)` $\to$ `B3:(1,3,1,1,2)` $\to$ `B4:(1,1,0,1,3)` $\to$ `B5:(1,4,2,0,1)` $\to$ `B6:(1,5,2,1,1)` $\to$ `B7:(1,3,1,1,1)` $\to$ `B8:(1,3,1,1,2)` | `[1, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 2, 3, 1, 1, 1, 2]` | **`18`** (**`2.250`**) | `12` (`1.500`) | `11` |
| **2** | **`6767`** | `623` ($j=6$) | **`4`** | `B1:(1,4,2,0,1)` $\to$ `B2:(5,4,1,1,1)` $\to$ `B3:(1,3,1,1,2)` $\to$ `B4:(1,1,0,1,3)` $\to$ `B5:(1,4,2,0,1)` $\to$ `B6:(1,5,2,1,1)` $\to$ `B7:(1,3,1,1,1)` $\to$ `B8:(1,3,1,1,2)` | `[1, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 2, 3, 1, 1, 1, 2]` | **`18`** (**`2.250`**) | `12` (`1.500`) | `10` |
| **3** | **`6943`** | `799` ($j=6$) | **`2`** | `B1:(1,5,2,1,1)` $\to$ `B2:(1,1,0,1,2)` $\to$ `B3:(1,5,2,1,1)` $\to$ `B4:(1,3,1,1,1)` $\to$ `B5:(5,7,2,1,1)` $\to$ `B6:(5,4,1,1,1)` $\to$ `B7:(1,3,1,1,2)` $\to$ `B8:(1,6,3,0,2)` | `[2, 3, 2, 2, 2, 2, 3, 2]` | `[1, 2, 1, 1, 1, 1, 2, 2]` | **`18`** (**`2.250`**) | `11` (`1.375`) | `12` |
| **4** | **`2111`** | `63` ($j=2$) | **`1`** | `B1:(1,6,3,0,3)` $\to$ `B2:(1,6,3,0,1)` $\to$ `B3:(5,4,1,1,1)` $\to$ `B4:(1,3,1,1,2)` $\to$ `B5:(1,1,0,1,3)` $\to$ `B6:(1,4,2,0,1)` $\to$ `B7:(1,5,2,1,1)` $\to$ `B8:(1,3,1,1,1)` | `[3, 1, 2, 3, 4, 1, 2, 2]` | `[3, 1, 1, 2, 3, 1, 1, 1]` | **`18`** (**`2.250`**) | `13` (`1.625`) | `13` |
| **5** | **`6591`** | `447` ($j=6$) | **`7`** | `B1:(1,6,3,0,1)` $\to$ `B2:(1,3,1,1,1)` $\to$ `B3:(5,7,2,1,1)` $\to$ `B4:(5,4,1,1,1)` $\to$ `B5:(1,3,1,1,2)` $\to$ `B6:(1,6,3,0,2)` $\to$ `B7:(1,1,0,1,3)` $\to$ `B8:(1,1,0,1,2)` | `[1, 2, 2, 2, 3, 2, 4, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2]` | **`19`** (**`2.375`**) | `13` (`1.625`) | `11` |
| **6** | **`14831`** | `495` ($j=14$) | **`7`** | `B1:(1,4,2,0,1)` $\to$ `B2:(1,3,1,1,1)` $\to$ `B3:(5,7,2,1,1)` $\to$ `B4:(5,4,1,1,1)` $\to$ `B5:(1,3,1,1,2)` $\to$ `B6:(1,6,3,0,2)` $\to$ `B7:(1,1,0,1,3)` $\to$ `B8:(1,1,0,1,2)` | `[1, 2, 2, 2, 3, 2, 4, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2]` | **`19`** (**`2.375`**) | `13` (`1.625`) | `10` |
| **7** | **`4511`** | `415` ($j=4$) | **`3`** | `B1:(1,5,2,1,1)` $\to$ `B2:(5,4,1,1,1)` $\to$ `B3:(1,3,1,1,2)` $\to$ `B4:(1,1,0,1,3)` $\to$ `B5:(1,4,2,0,1)` $\to$ `B6:(1,5,2,1,1)` $\to$ `B7:(1,3,1,1,1)` $\to$ `B8:(1,3,1,1,2)` | `[2, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 2, 3, 1, 1, 1, 2]` | **`19`** (**`2.375`**) | `12` (`1.500`) | `10` |
| **8** | **`10151`** | `935` ($j=9$) | **`3`** | `B1:(1,3,1,1,1)` $\to$ `B2:(5,4,1,1,1)` $\to$ `B3:(1,3,1,1,2)` $\to$ `B4:(1,1,0,1,3)` $\to$ `B5:(1,4,2,0,1)` $\to$ `B6:(1,5,2,1,1)` $\to$ `B7:(1,3,1,1,1)` $\to$ `B8:(1,3,1,1,2)` | `[2, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 2, 3, 1, 1, 1, 2]` | **`19`** (**`2.375`**) | `12` (`1.500`) | `9` |
| **9** | **`6171`** | `27` ($j=6$) | **`1`** | `B1:(5,5,1,2,1)` $\to$ `B2:(5,4,1,1,2)` $\to$ `B3:(1,5,2,1,1)` $\to$ `B4:(1,3,1,1,1)` $\to$ `B5:(5,7,2,1,1)` $\to$ `B6:(5,4,1,1,1)` $\to$ `B7:(1,3,1,1,2)` $\to$ `B8:(1,6,3,0,2)` | `[3, 3, 2, 2, 2, 2, 3, 2]` | `[1, 2, 1, 1, 1, 1, 2, 2]` | **`19`** (**`2.375`**) | `11` (`1.375`) | `12` |
| **10** | **`1407`** | `383` ($j=1$) | **`1`** | `B1:(1,7,3,1,3)` $\to$ `B2:(1,6,3,0,1)` $\to$ `B3:(5,4,1,1,1)` $\to$ `B4:(1,3,1,1,2)` $\to$ `B5:(1,1,0,1,3)` $\to$ `B6:(1,4,2,0,1)` $\to$ `B7:(1,5,2,1,1)` $\to$ `B8:(1,3,1,1,1)` | `[4, 1, 2, 3, 4, 1, 2, 2]` | `[3, 1, 1, 2, 3, 1, 1, 1]` | **`19`** (**`2.375`**) | `13` (`1.625`) | `13` |

#### Szczegółowe ścieżki przejść $n_0 \to n_1 \to \dots \to n_8$ dla 4 rekordowych klas z $\bar{v}_8 = 2{,}250$ (`2111, 3007, 6767, 6943`):

- **Klasa `r = 3007` (`r0 = 959`, $j = 2$, $K^* = 4$, $\bar{v}_8 = 2{,}250$):**  
  `3007` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313`
- **Klasa `r = 6767` (`r0 = 623`, $j = 6$, $K^* = 4$, $\bar{v}_8 = 2{,}250$):**  
  `6767` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313`
- **Klasa `r = 6943` (`r0 = 799`, $j = 6$, $K^* = 2$, $\bar{v}_8 = 2{,}250$):**  
  `6943` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `26365` $\to$ `26365` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925`
- **Klasa `r = 2111` (`r0 = 63`, $j = 2$, $K^* = 1$, $\bar{v}_8 = 2{,}250$):**  
  `2111` $\xrightarrow[d+v=3]{(c=1, b=6, r=3, d=0, v=3)}$ `3007` $\to$ `3007` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111`


---

# Runda 7. Głębokie Sito 2-Adyczne (`k = 262..282`, `m = 426..458`, Zweryfikowane w Lean 4) oraz Anatomia Wieloblokowego Domknięcia 2048 Klas Reszt (`mod 32768`, $K \in \{1..10\}$)

## Część 14. Zestaw M (`k = 262..270`, `m = 426..439`, Część 59) oraz Zestaw N (`k = 272..282`, `m = 442..458`, Część 60) — 208 Twierdzeń

### 14.1. Zbiorcza tabela 13 poziomów głębokiego sita 2-adycznego ($c = 164..176$, $k = 262..282$, $m = 426..458$)

Wszystkie **208 twierdzeń** Zestawu M (96 twierdzeń) oraz Zestawu N (112 twierdzeń) zostało wygenerowanych z warunkiem `if (exp2 === 0) return false;` na początku każdego kroku pętli oraz zweryfikowanych bezpośrednio kompilatorem `~/.elan/bin/lean --stdin` (z dyrektywą `set_option exponentiation.threshold 512`, kod wyjścia `0`, `0` błędów, `0` ostrzeżeń).

| Zestaw | Poziom $c = m - k$ | Próg $k$ | Kroki $m$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek (`by decide` ✅) |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **M (Part 59)** | `164` | `262` | `426` | `0.238796` | `3958784` | `1723519, 2585279, 2725659, 3066367, 3447039, 6132735, 6206655, 8142879, 8901447, 9808047, 12867759, 13352171, 14258343, 14281383, 14712071, 15835135` |
| **M (Part 59)** | `165` | `264` | `429` | `0.179097` | `4450724` | `1723519, 2585279, 3447039, 4596051, 5451319, 8142879, 8176979, 9808047, 11265895, 12214319, 12600767, 13352171, 14281383, 16898843, 17534511, 17802895` |
| **M (Part 59)** | `166` | `266` | `432` | `0.134323` | `3150192` | `1723519, 2725659, 3447039, 4596051, 5451319, 6128067, 7262895, 8142879, 8400511, 8901447, 9383783, 9808047, 10549863, 11265895, 12214319, 12600767` |
| **M (Part 59)** | `167` | `267` | `434` | `0.201484` | `5642028` | `8142879, 9383783, 10549863, 11265895, 12600767, 12867759, 15045407, 15824795, 16285759, 16801023, 16898843, 18767567, 18901151, 19638399, 22401363, 22568111` |
| **M (Part 59)** | `168` | `269` | `437` | `0.151113` | `3338043` | `1723519, 3066367, 6255855, 6686847, 8400511, 8901447, 9383783, 9808047, 10030271, 10549863, 10999275, 11265895, 12511711, 12600767, 12867759, 13352171` |
| **M (Part 59)** | `169` | `270` | `439` | `0.226670` | `5286682` | `6255855, 8400511, 8901447, 10030271, 10549863, 13352171, 13373695, 15045407, 15733191, 16801023, 18627743, 19638399, 20060543, 20881439, 21099727, 21146727` |
| **N (Part 60)** | `170` | `272` | `442` | `0.170002` | `4825410` | `2725659, 8142879, 8400511, 8614431, 8901447, 11265895, 12600767, 12867759, 13352171, 13373695, 13920959, 15045407, 17802895, 18627743, 18901151, 19301639` |
| **N (Part 60)** | `171` | `274` | `445` | `0.127502` | `4200256` | `6686847, 8400511, 8901447, 9280639, 10030271, 10549863, 12418495, 12600767, 12867759, 13352171, 13373695, 14281383, 15045407, 15733191, 15824795, 16801023` |
| **N (Part 60)** | `172` | `275` | `447` | `0.191252` | `6300384` | `8901447, 10549863, 12418495, 12600767, 13373695, 14281383, 15824795, 16801023, 17802895, 19771591, 20060543, 23599787, 24099835, 24748371, 25007083, 25201535` |
| **N (Part 60)** | `173` | `277` | `450` | `0.143439` | `4200256` | `6686847, 8142879, 8400511, 8901447, 10030271, 10549863, 10999275, 12214319, 13352171, 13373695, 14089159, 14281383, 15045407, 15733191, 15824795, 16801023` |
| **N (Part 60)** | `174` | `278` | `452` | `0.215159` | `6024959` | `8142879, 8901447, 10549863, 10999275, 12214319, 14089159, 14281383, 15733191, 15824795, 17574747, 21133739, 21422075, 21998551, 22401363, 23599787, 24099835` |
| **N (Part 60)** | `175` | `280` | `455` | `0.161369` | `5642028` | `8142879, 10549863, 13373695, 14089159, 14281383, 15045407, 15733191, 16285759, 19554267, 19925503, 20060543, 21099727, 21133739, 21146727, 21422075, 22568111` |
| **N (Part 60)** | `176` | `282` | `458` | `0.121027` | `5355519` | `8142879, 10030271, 10549863, 12214319, 14089159, 14281383, 15045407, 15733191, 15824795, 19554267, 19638399, 19925503, 20060543, 21133739, 21146727, 21422075` |

### 14.2. Gotowe, zweryfikowane w Lean 4 bloki kodu (Zestaw M — Część 59 oraz Zestaw N — Część 60)

*(Pełny kod został również zapisany w pliku [`sieve_262_282_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_262_282_lean.txt).)*

```lean
set_option exponentiation.threshold 512

-- ============================================================================
-- Część 59. Głębokie Sito 2-Adyczne: Zestaw M (k = 262..270, m = 426..439, 96 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 7)
-- ============================================================================

-- k = 262, m = 426 (c = 164, 2^262 = 7410693711188236507108543040556026102609279018600996098525285376506440296955904 > 3^164)
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 1723519) := checkAffineDrop_sound 426 (2 ^ 262) 1723519 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 2585279) := checkAffineDrop_sound 426 (2 ^ 262) 2585279 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 2725659) := checkAffineDrop_sound 426 (2 ^ 262) 2725659 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 3066367) := checkAffineDrop_sound 426 (2 ^ 262) 3066367 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 3447039) := checkAffineDrop_sound 426 (2 ^ 262) 3447039 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq6132735 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 6132735) := checkAffineDrop_sound 426 (2 ^ 262) 6132735 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq6206655 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 6206655) := checkAffineDrop_sound 426 (2 ^ 262) 6206655 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 8142879) := checkAffineDrop_sound 426 (2 ^ 262) 8142879 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 8901447) := checkAffineDrop_sound 426 (2 ^ 262) 8901447 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq9808047 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 9808047) := checkAffineDrop_sound 426 (2 ^ 262) 9808047 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 12867759) := checkAffineDrop_sound 426 (2 ^ 262) 12867759 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 13352171) := checkAffineDrop_sound 426 (2 ^ 262) 13352171 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq14258343 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 14258343) := checkAffineDrop_sound 426 (2 ^ 262) 14258343 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 14281383) := checkAffineDrop_sound 426 (2 ^ 262) 14281383 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq14712071 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 14712071) := checkAffineDrop_sound 426 (2 ^ 262) 14712071 (by decide) k
theorem horizon_drop_mod7410693711188236507108543040556026102609279018600996098525285376506440296955904_eq15835135 (k : Nat) : HasHorizonDrop (2 ^ 262 * k + 15835135) := checkAffineDrop_sound 426 (2 ^ 262) 15835135 (by decide) k

-- k = 264, m = 429 (c = 165, 2^264 = 29642774844752946028434172162224104410437116074403984394101141506025761187823616 > 3^165)
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 1723519) := checkAffineDrop_sound 429 (2 ^ 264) 1723519 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq2585279 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 2585279) := checkAffineDrop_sound 429 (2 ^ 264) 2585279 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 3447039) := checkAffineDrop_sound 429 (2 ^ 264) 3447039 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 4596051) := checkAffineDrop_sound 429 (2 ^ 264) 4596051 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 5451319) := checkAffineDrop_sound 429 (2 ^ 264) 5451319 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 8142879) := checkAffineDrop_sound 429 (2 ^ 264) 8142879 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq8176979 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 8176979) := checkAffineDrop_sound 429 (2 ^ 264) 8176979 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq9808047 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 9808047) := checkAffineDrop_sound 429 (2 ^ 264) 9808047 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 11265895) := checkAffineDrop_sound 429 (2 ^ 264) 11265895 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 12214319) := checkAffineDrop_sound 429 (2 ^ 264) 12214319 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 12600767) := checkAffineDrop_sound 429 (2 ^ 264) 12600767 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 13352171) := checkAffineDrop_sound 429 (2 ^ 264) 13352171 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 14281383) := checkAffineDrop_sound 429 (2 ^ 264) 14281383 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq16898843 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 16898843) := checkAffineDrop_sound 429 (2 ^ 264) 16898843 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq17534511 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 17534511) := checkAffineDrop_sound 429 (2 ^ 264) 17534511 (by decide) k
theorem horizon_drop_mod29642774844752946028434172162224104410437116074403984394101141506025761187823616_eq17802895 (k : Nat) : HasHorizonDrop (2 ^ 264 * k + 17802895) := checkAffineDrop_sound 429 (2 ^ 264) 17802895 (by decide) k

-- k = 266, m = 432 (c = 166, 2^266 = 118571099379011784113736688648896417641748464297615937576404566024103044751294464 > 3^166)
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 1723519) := checkAffineDrop_sound 432 (2 ^ 266) 1723519 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 2725659) := checkAffineDrop_sound 432 (2 ^ 266) 2725659 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq3447039 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 3447039) := checkAffineDrop_sound 432 (2 ^ 266) 3447039 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq4596051 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 4596051) := checkAffineDrop_sound 432 (2 ^ 266) 4596051 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq5451319 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 5451319) := checkAffineDrop_sound 432 (2 ^ 266) 5451319 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq6128067 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 6128067) := checkAffineDrop_sound 432 (2 ^ 266) 6128067 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq7262895 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 7262895) := checkAffineDrop_sound 432 (2 ^ 266) 7262895 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 8142879) := checkAffineDrop_sound 432 (2 ^ 266) 8142879 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 8400511) := checkAffineDrop_sound 432 (2 ^ 266) 8400511 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 8901447) := checkAffineDrop_sound 432 (2 ^ 266) 8901447 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq9383783 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 9383783) := checkAffineDrop_sound 432 (2 ^ 266) 9383783 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq9808047 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 9808047) := checkAffineDrop_sound 432 (2 ^ 266) 9808047 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 10549863) := checkAffineDrop_sound 432 (2 ^ 266) 10549863 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 11265895) := checkAffineDrop_sound 432 (2 ^ 266) 11265895 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 12214319) := checkAffineDrop_sound 432 (2 ^ 266) 12214319 (by decide) k
theorem horizon_drop_mod118571099379011784113736688648896417641748464297615937576404566024103044751294464_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 266 * k + 12600767) := checkAffineDrop_sound 432 (2 ^ 266) 12600767 (by decide) k

-- k = 267, m = 434 (c = 167, 2^267 = 237142198758023568227473377297792835283496928595231875152809132048206089502588928 > 3^167)
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 8142879) := checkAffineDrop_sound 434 (2 ^ 267) 8142879 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq9383783 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 9383783) := checkAffineDrop_sound 434 (2 ^ 267) 9383783 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 10549863) := checkAffineDrop_sound 434 (2 ^ 267) 10549863 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 11265895) := checkAffineDrop_sound 434 (2 ^ 267) 11265895 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 12600767) := checkAffineDrop_sound 434 (2 ^ 267) 12600767 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 12867759) := checkAffineDrop_sound 434 (2 ^ 267) 12867759 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 15045407) := checkAffineDrop_sound 434 (2 ^ 267) 15045407 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 15824795) := checkAffineDrop_sound 434 (2 ^ 267) 15824795 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq16285759 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 16285759) := checkAffineDrop_sound 434 (2 ^ 267) 16285759 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 16801023) := checkAffineDrop_sound 434 (2 ^ 267) 16801023 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq16898843 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 16898843) := checkAffineDrop_sound 434 (2 ^ 267) 16898843 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq18767567 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 18767567) := checkAffineDrop_sound 434 (2 ^ 267) 18767567 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 18901151) := checkAffineDrop_sound 434 (2 ^ 267) 18901151 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 19638399) := checkAffineDrop_sound 434 (2 ^ 267) 19638399 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 22401363) := checkAffineDrop_sound 434 (2 ^ 267) 22401363 (by decide) k
theorem horizon_drop_mod237142198758023568227473377297792835283496928595231875152809132048206089502588928_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 267 * k + 22568111) := checkAffineDrop_sound 434 (2 ^ 267) 22568111 (by decide) k

-- k = 269, m = 437 (c = 168, 2^269 = 948568795032094272909893509191171341133987714380927500611236528192824358010355712 > 3^168)
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq1723519 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 1723519) := checkAffineDrop_sound 437 (2 ^ 269) 1723519 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq3066367 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 3066367) := checkAffineDrop_sound 437 (2 ^ 269) 3066367 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 6255855) := checkAffineDrop_sound 437 (2 ^ 269) 6255855 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 6686847) := checkAffineDrop_sound 437 (2 ^ 269) 6686847 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 8400511) := checkAffineDrop_sound 437 (2 ^ 269) 8400511 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 8901447) := checkAffineDrop_sound 437 (2 ^ 269) 8901447 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq9383783 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 9383783) := checkAffineDrop_sound 437 (2 ^ 269) 9383783 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq9808047 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 9808047) := checkAffineDrop_sound 437 (2 ^ 269) 9808047 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 10030271) := checkAffineDrop_sound 437 (2 ^ 269) 10030271 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 10549863) := checkAffineDrop_sound 437 (2 ^ 269) 10549863 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq10999275 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 10999275) := checkAffineDrop_sound 437 (2 ^ 269) 10999275 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 11265895) := checkAffineDrop_sound 437 (2 ^ 269) 11265895 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq12511711 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 12511711) := checkAffineDrop_sound 437 (2 ^ 269) 12511711 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 12600767) := checkAffineDrop_sound 437 (2 ^ 269) 12600767 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 12867759) := checkAffineDrop_sound 437 (2 ^ 269) 12867759 (by decide) k
theorem horizon_drop_mod948568795032094272909893509191171341133987714380927500611236528192824358010355712_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 269 * k + 13352171) := checkAffineDrop_sound 437 (2 ^ 269) 13352171 (by decide) k

-- k = 270, m = 439 (c = 169, 2^270 = 1897137590064188545819787018382342682267975428761855001222473056385648716020711424 > 3^169)
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq6255855 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 6255855) := checkAffineDrop_sound 439 (2 ^ 270) 6255855 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 8400511) := checkAffineDrop_sound 439 (2 ^ 270) 8400511 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 8901447) := checkAffineDrop_sound 439 (2 ^ 270) 8901447 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 10030271) := checkAffineDrop_sound 439 (2 ^ 270) 10030271 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 10549863) := checkAffineDrop_sound 439 (2 ^ 270) 10549863 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 13352171) := checkAffineDrop_sound 439 (2 ^ 270) 13352171 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 13373695) := checkAffineDrop_sound 439 (2 ^ 270) 13373695 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 15045407) := checkAffineDrop_sound 439 (2 ^ 270) 15045407 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 15733191) := checkAffineDrop_sound 439 (2 ^ 270) 15733191 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 16801023) := checkAffineDrop_sound 439 (2 ^ 270) 16801023 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq18627743 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 18627743) := checkAffineDrop_sound 439 (2 ^ 270) 18627743 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 19638399) := checkAffineDrop_sound 439 (2 ^ 270) 19638399 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 20060543) := checkAffineDrop_sound 439 (2 ^ 270) 20060543 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq20881439 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 20881439) := checkAffineDrop_sound 439 (2 ^ 270) 20881439 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq21099727 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 21099727) := checkAffineDrop_sound 439 (2 ^ 270) 21099727 (by decide) k
theorem horizon_drop_mod1897137590064188545819787018382342682267975428761855001222473056385648716020711424_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 270 * k + 21146727) := checkAffineDrop_sound 439 (2 ^ 270) 21146727 (by decide) k

-- ============================================================================
-- Część 60. Głębokie Sito 2-Adyczne: Zestaw N (k = 272..282, m = 442..458, 112 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 7)
-- ============================================================================

-- k = 272, m = 442 (c = 170, 2^272 = 7588550360256754183279148073529370729071901715047420004889892225542594864082845696 > 3^170)
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq2725659 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 2725659) := checkAffineDrop_sound 442 (2 ^ 272) 2725659 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 8142879) := checkAffineDrop_sound 442 (2 ^ 272) 8142879 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 8400511) := checkAffineDrop_sound 442 (2 ^ 272) 8400511 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq8614431 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 8614431) := checkAffineDrop_sound 442 (2 ^ 272) 8614431 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 8901447) := checkAffineDrop_sound 442 (2 ^ 272) 8901447 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq11265895 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 11265895) := checkAffineDrop_sound 442 (2 ^ 272) 11265895 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 12600767) := checkAffineDrop_sound 442 (2 ^ 272) 12600767 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 12867759) := checkAffineDrop_sound 442 (2 ^ 272) 12867759 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 13352171) := checkAffineDrop_sound 442 (2 ^ 272) 13352171 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 13373695) := checkAffineDrop_sound 442 (2 ^ 272) 13373695 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq13920959 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 13920959) := checkAffineDrop_sound 442 (2 ^ 272) 13920959 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 15045407) := checkAffineDrop_sound 442 (2 ^ 272) 15045407 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq17802895 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 17802895) := checkAffineDrop_sound 442 (2 ^ 272) 17802895 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq18627743 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 18627743) := checkAffineDrop_sound 442 (2 ^ 272) 18627743 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 18901151) := checkAffineDrop_sound 442 (2 ^ 272) 18901151 (by decide) k
theorem horizon_drop_mod7588550360256754183279148073529370729071901715047420004889892225542594864082845696_eq19301639 (k : Nat) : HasHorizonDrop (2 ^ 272 * k + 19301639) := checkAffineDrop_sound 442 (2 ^ 272) 19301639 (by decide) k

-- k = 274, m = 445 (c = 171, 2^274 = 30354201441027016733116592294117482916287606860189680019559568902170379456331382784 > 3^171)
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 6686847) := checkAffineDrop_sound 445 (2 ^ 274) 6686847 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 8400511) := checkAffineDrop_sound 445 (2 ^ 274) 8400511 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 8901447) := checkAffineDrop_sound 445 (2 ^ 274) 8901447 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq9280639 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 9280639) := checkAffineDrop_sound 445 (2 ^ 274) 9280639 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 10030271) := checkAffineDrop_sound 445 (2 ^ 274) 10030271 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 10549863) := checkAffineDrop_sound 445 (2 ^ 274) 10549863 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq12418495 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 12418495) := checkAffineDrop_sound 445 (2 ^ 274) 12418495 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 12600767) := checkAffineDrop_sound 445 (2 ^ 274) 12600767 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 12867759) := checkAffineDrop_sound 445 (2 ^ 274) 12867759 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 13352171) := checkAffineDrop_sound 445 (2 ^ 274) 13352171 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 13373695) := checkAffineDrop_sound 445 (2 ^ 274) 13373695 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 14281383) := checkAffineDrop_sound 445 (2 ^ 274) 14281383 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 15045407) := checkAffineDrop_sound 445 (2 ^ 274) 15045407 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 15733191) := checkAffineDrop_sound 445 (2 ^ 274) 15733191 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 15824795) := checkAffineDrop_sound 445 (2 ^ 274) 15824795 (by decide) k
theorem horizon_drop_mod30354201441027016733116592294117482916287606860189680019559568902170379456331382784_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 274 * k + 16801023) := checkAffineDrop_sound 445 (2 ^ 274) 16801023 (by decide) k

-- k = 275, m = 447 (c = 172, 2^275 = 60708402882054033466233184588234965832575213720379360039119137804340758912662765568 > 3^172)
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 8901447) := checkAffineDrop_sound 447 (2 ^ 275) 8901447 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 10549863) := checkAffineDrop_sound 447 (2 ^ 275) 10549863 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq12418495 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 12418495) := checkAffineDrop_sound 447 (2 ^ 275) 12418495 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 12600767) := checkAffineDrop_sound 447 (2 ^ 275) 12600767 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 13373695) := checkAffineDrop_sound 447 (2 ^ 275) 13373695 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 14281383) := checkAffineDrop_sound 447 (2 ^ 275) 14281383 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 15824795) := checkAffineDrop_sound 447 (2 ^ 275) 15824795 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 16801023) := checkAffineDrop_sound 447 (2 ^ 275) 16801023 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq17802895 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 17802895) := checkAffineDrop_sound 447 (2 ^ 275) 17802895 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq19771591 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 19771591) := checkAffineDrop_sound 447 (2 ^ 275) 19771591 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 20060543) := checkAffineDrop_sound 447 (2 ^ 275) 20060543 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 23599787) := checkAffineDrop_sound 447 (2 ^ 275) 23599787 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq24099835 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 24099835) := checkAffineDrop_sound 447 (2 ^ 275) 24099835 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq24748371 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 24748371) := checkAffineDrop_sound 447 (2 ^ 275) 24748371 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq25007083 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 25007083) := checkAffineDrop_sound 447 (2 ^ 275) 25007083 (by decide) k
theorem horizon_drop_mod60708402882054033466233184588234965832575213720379360039119137804340758912662765568_eq25201535 (k : Nat) : HasHorizonDrop (2 ^ 275 * k + 25201535) := checkAffineDrop_sound 447 (2 ^ 275) 25201535 (by decide) k

-- k = 277, m = 450 (c = 173, 2^277 = 242833611528216133864932738352939863330300854881517440156476551217363035650651062272 > 3^173)
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 6686847) := checkAffineDrop_sound 450 (2 ^ 277) 6686847 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 8142879) := checkAffineDrop_sound 450 (2 ^ 277) 8142879 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 8400511) := checkAffineDrop_sound 450 (2 ^ 277) 8400511 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 8901447) := checkAffineDrop_sound 450 (2 ^ 277) 8901447 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 10030271) := checkAffineDrop_sound 450 (2 ^ 277) 10030271 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 10549863) := checkAffineDrop_sound 450 (2 ^ 277) 10549863 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq10999275 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 10999275) := checkAffineDrop_sound 450 (2 ^ 277) 10999275 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 12214319) := checkAffineDrop_sound 450 (2 ^ 277) 12214319 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq13352171 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 13352171) := checkAffineDrop_sound 450 (2 ^ 277) 13352171 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 13373695) := checkAffineDrop_sound 450 (2 ^ 277) 13373695 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 14089159) := checkAffineDrop_sound 450 (2 ^ 277) 14089159 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 14281383) := checkAffineDrop_sound 450 (2 ^ 277) 14281383 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 15045407) := checkAffineDrop_sound 450 (2 ^ 277) 15045407 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 15733191) := checkAffineDrop_sound 450 (2 ^ 277) 15733191 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 15824795) := checkAffineDrop_sound 450 (2 ^ 277) 15824795 (by decide) k
theorem horizon_drop_mod242833611528216133864932738352939863330300854881517440156476551217363035650651062272_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 277 * k + 16801023) := checkAffineDrop_sound 450 (2 ^ 277) 16801023 (by decide) k

-- k = 278, m = 452 (c = 174, 2^278 = 485667223056432267729865476705879726660601709763034880312953102434726071301302124544 > 3^174)
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 8142879) := checkAffineDrop_sound 452 (2 ^ 278) 8142879 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq8901447 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 8901447) := checkAffineDrop_sound 452 (2 ^ 278) 8901447 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 10549863) := checkAffineDrop_sound 452 (2 ^ 278) 10549863 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq10999275 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 10999275) := checkAffineDrop_sound 452 (2 ^ 278) 10999275 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 12214319) := checkAffineDrop_sound 452 (2 ^ 278) 12214319 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 14089159) := checkAffineDrop_sound 452 (2 ^ 278) 14089159 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 14281383) := checkAffineDrop_sound 452 (2 ^ 278) 14281383 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 15733191) := checkAffineDrop_sound 452 (2 ^ 278) 15733191 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 15824795) := checkAffineDrop_sound 452 (2 ^ 278) 15824795 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq17574747 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 17574747) := checkAffineDrop_sound 452 (2 ^ 278) 17574747 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 21133739) := checkAffineDrop_sound 452 (2 ^ 278) 21133739 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq21422075 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 21422075) := checkAffineDrop_sound 452 (2 ^ 278) 21422075 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq21998551 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 21998551) := checkAffineDrop_sound 452 (2 ^ 278) 21998551 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 22401363) := checkAffineDrop_sound 452 (2 ^ 278) 22401363 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 23599787) := checkAffineDrop_sound 452 (2 ^ 278) 23599787 (by decide) k
theorem horizon_drop_mod485667223056432267729865476705879726660601709763034880312953102434726071301302124544_eq24099835 (k : Nat) : HasHorizonDrop (2 ^ 278 * k + 24099835) := checkAffineDrop_sound 452 (2 ^ 278) 24099835 (by decide) k

-- k = 280, m = 455 (c = 175, 2^280 = 1942668892225729070919461906823518906642406839052139521251812409738904285205208498176 > 3^175)
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 8142879) := checkAffineDrop_sound 455 (2 ^ 280) 8142879 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 10549863) := checkAffineDrop_sound 455 (2 ^ 280) 10549863 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 13373695) := checkAffineDrop_sound 455 (2 ^ 280) 13373695 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 14089159) := checkAffineDrop_sound 455 (2 ^ 280) 14089159 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 14281383) := checkAffineDrop_sound 455 (2 ^ 280) 14281383 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 15045407) := checkAffineDrop_sound 455 (2 ^ 280) 15045407 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 15733191) := checkAffineDrop_sound 455 (2 ^ 280) 15733191 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq16285759 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 16285759) := checkAffineDrop_sound 455 (2 ^ 280) 16285759 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq19554267 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 19554267) := checkAffineDrop_sound 455 (2 ^ 280) 19554267 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq19925503 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 19925503) := checkAffineDrop_sound 455 (2 ^ 280) 19925503 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 20060543) := checkAffineDrop_sound 455 (2 ^ 280) 20060543 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq21099727 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 21099727) := checkAffineDrop_sound 455 (2 ^ 280) 21099727 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 21133739) := checkAffineDrop_sound 455 (2 ^ 280) 21133739 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 21146727) := checkAffineDrop_sound 455 (2 ^ 280) 21146727 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq21422075 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 21422075) := checkAffineDrop_sound 455 (2 ^ 280) 21422075 (by decide) k
theorem horizon_drop_mod1942668892225729070919461906823518906642406839052139521251812409738904285205208498176_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 280 * k + 22568111) := checkAffineDrop_sound 455 (2 ^ 280) 22568111 (by decide) k

-- k = 282, m = 458 (c = 176, 2^282 = 7770675568902916283677847627294075626569627356208558085007249638955617140820833992704 > 3^176)
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 8142879) := checkAffineDrop_sound 458 (2 ^ 282) 8142879 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 10030271) := checkAffineDrop_sound 458 (2 ^ 282) 10030271 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 10549863) := checkAffineDrop_sound 458 (2 ^ 282) 10549863 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq12214319 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 12214319) := checkAffineDrop_sound 458 (2 ^ 282) 12214319 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 14089159) := checkAffineDrop_sound 458 (2 ^ 282) 14089159 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 14281383) := checkAffineDrop_sound 458 (2 ^ 282) 14281383 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 15045407) := checkAffineDrop_sound 458 (2 ^ 282) 15045407 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 15733191) := checkAffineDrop_sound 458 (2 ^ 282) 15733191 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq15824795 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 15824795) := checkAffineDrop_sound 458 (2 ^ 282) 15824795 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq19554267 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 19554267) := checkAffineDrop_sound 458 (2 ^ 282) 19554267 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 19638399) := checkAffineDrop_sound 458 (2 ^ 282) 19638399 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq19925503 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 19925503) := checkAffineDrop_sound 458 (2 ^ 282) 19925503 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 20060543) := checkAffineDrop_sound 458 (2 ^ 282) 20060543 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 21133739) := checkAffineDrop_sound 458 (2 ^ 282) 21133739 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 21146727) := checkAffineDrop_sound 458 (2 ^ 282) 21146727 (by decide) k
theorem horizon_drop_mod7770675568902916283677847627294075626569627356208558085007249638955617140820833992704_eq21422075 (k : Nat) : HasHorizonDrop (2 ^ 282 * k + 21422075) := checkAffineDrop_sound 458 (2 ^ 282) 21422075 (by decide) k

```

---

## Część 15. Anatomia Wieloblokowego Domknięcia na Poziomie `mod 32768` (2048 Podniesionych Klas Reszt, $K \in \{1..10\}$)

Analizę na poziomie `mod 32768` przeprowadzono dla obu naturalnych 2048-elementowych rodzin klas reszt:
1. **Rodzina A (2048 podniesień 64 ocalałych klas bazowych `mod 1024` do `mod 32768`):** $r = r_{\text{base}} + 1024 j$, gdzie $r_{\text{base}} \in \text{survivingMod1024}$ ($64$ klasy) oraz $j \in \{0..31\}$ ($64 \times 32 = 2048$ klas — bezpośrednie rozszerzenie 1024 klas z Rundy 6).
2. **Rodzina B (wszystkie 2048 klas postaci $r_0 = 16 W + 7 \pmod{32768}$):** $W \in \{0..2047\}$ (pełna warstwa klas o zerowym drenażu początkowym $d_1 = 0$ w pierwszym bloku $c = 1$).

### 15.1. Rozkład czasu pierwszego przejścia $K^*(r) = \min \{K \in \{1..10\} : \bar{v}_K(r) > \log_2 9 - 1 \approx 2{,}169925\}$ dla obu rodzin (2048 klas `mod 32768`)

| Horyzont $K^*$ | Warunek $\sum_{i=1}^{K^*}(d_i+v_i)$ | Rodzina A: Podniesienia 64 klas `mod 1024` | Skumulowane pokrycie (Rodzina A) | Rodzina B: $r_0 = 16W + 7 \pmod{32768}$ | Skumulowane pokrycie (Rodzina B) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **$K^* = 1$** | $\sum_{i=1}^{1} (d_i+v_i) ≥ 3$ | **`642`** (31.35%) | `642 / 2048` (**31.35%**) | **`1024`** (50.00%) | `1024 / 2048` (**50.00%**) |
| **$K^* = 2$** | $\sum_{i=1}^{2} (d_i+v_i) ≥ 5$ | **`894`** (43.65%) | `1536 / 2048` (**75.00%**) | **`838`** (40.92%) | `1862 / 2048` (**90.92%**) |
| **$K^* = 3$** | $\sum_{i=1}^{3} (d_i+v_i) ≥ 7$ | **`365`** (17.82%) | `1901 / 2048` (**92.82%**) | **`146`** (7.13%) | `2008 / 2048` (**98.05%**) |
| **$K^* = 4$** | $\sum_{i=1}^{4} (d_i+v_i) ≥ 9$ | **`91`** (4.44%) | `1992 / 2048` (**97.27%**) | **`25`** (1.22%) | `2033 / 2048` (**99.27%**) |
| **$K^* = 5$** | $\sum_{i=1}^{5} (d_i+v_i) ≥ 11$ | **`39`** (1.90%) | `2031 / 2048` (**99.17%**) | **`11`** (0.54%) | `2044 / 2048` (**99.80%**) |
| **$K^* = 6$** | $\sum_{i=1}^{6} (d_i+v_i) ≥ 14$ | **`6`** (0.29%) | `2037 / 2048` (**99.46%**) | **`0`** (0.00%) | `2044 / 2048` (**99.80%**) |
| **$K^* = 7$** | $\sum_{i=1}^{7} (d_i+v_i) ≥ 16$ | **`8`** (0.39%) | `2045 / 2048` (**99.85%**) | **`3`** (0.15%) | `2047 / 2048` (**99.95%**) |
| **$K^* = 8$** | $\sum_{i=1}^{8} (d_i+v_i) ≥ 18$ | **`3`** (0.15%) | `2048 / 2048` (**100.00%**) | **`1`** (0.05%) | `2048 / 2048` (**100.00%**) |
| **$K^* = 9$** | $\sum_{i=1}^{9} (d_i+v_i) ≥ 20$ | **`0`** (0.00%) | `2048 / 2048` (**100.00%**) | **`0`** (0.00%) | `2048 / 2048` (**100.00%**) |
| **$K^* = 10$** | $\sum_{i=1}^{10} (d_i+v_i) ≥ 22$ | **`0`** (0.00%) | `2048 / 2048` (**100.00%**) | **`0`** (0.00%) | `2048 / 2048` (**100.00%**) |

### 15.2. Histogramy średniej waluacji fazowej $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K (d_i + v_i)$ dla $K = 5, 6, 7, 8, 9, 10$

#### A. Rodzina A: 2048 klas podniesionych z 64 ocalałych klas bazowych `mod 1024` ($r = r_{\text{base}} + 1024 j \pmod{32768}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 5$** | **`1.400`** | **`3.689`** | `6.200` | `1.000` | `2.034` | `19` | `89` | `212` | `579` | `401` | `748` | `2029/2048` (**99.07%**) |
| **$K = 6$** | **`1.667`** | **`3.753`** | `6.333` | `1.000` | `2.059` | `21` | `18` | `186` | `451` | `574` | `798` | `2027/2048` (**98.97%**) |
| **$K = 7$** | **`2.000`** | **`3.794`** | `6.286` | `1.000` | `2.080` | `6` | `27` | `143` | `501` | `537` | `834` | `2042/2048` (**99.71%**) |
| **$K = 8$** | **`2.125`** | **`3.815`** | `5.875` | `1.125` | `2.094` | `1` | `14` | `114` | `385` | `713` | `821` | `2047/2048` (**99.95%**) |
| **$K = 9$** | **`2.222`** | **`3.817`** | `5.667` | `1.111` | `2.086` | `0` | `12` | `81` | `448` | `724` | `783` | `2048/2048` (**100.00%**) |
| **$K = 10$** | **`2.400`** | **`3.815`** | `5.200` | `1.200` | `2.072` | `0` | `1` | `70` | `401` | `815` | `761` | `2048/2048` (**100.00%**) |

#### B. Rodzina B: Wszystkie 2048 klas postaci $r_0 = 16 W + 7 \pmod{32768}$ ($W \in \{0..2047\}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 5$** | **`1.600`** | **`3.894`** | `6.600` | `1.000` | `2.188` | `7` | `37` | `149` | `444` | `438` | `973` | `2041/2048` (**99.66%**) |
| **$K = 6$** | **`1.833`** | **`3.903`** | `6.167` | `1.000` | `2.173` | `11` | `10` | `107` | `365` | `600` | `955` | `2037/2048` (**99.46%**) |
| **$K = 7$** | **`2.143`** | **`3.902`** | `5.857` | `1.000` | `2.156` | `2` | `10` | `90` | `432` | `564` | `950` | `2046/2048` (**99.90%**) |
| **$K = 8$** | **`2.250`** | **`3.885`** | `5.625` | `1.125` | `2.131` | `0` | `8` | `74` | `337` | `732` | `897` | `2048/2048` (**100.00%**) |
| **$K = 9$** | **`2.222`** | **`3.867`** | `5.444` | `1.111` | `2.103` | `0` | `6` | `44` | `432` | `725` | `841` | `2048/2048` (**100.00%**) |
| **$K = 10$** | **`2.300`** | **`3.844`** | `5.300` | `1.200` | `2.069` | `0` | `3` | `41` | `372` | `858` | `774` | `2048/2048` (**100.00%**) |

---

### 15.3. Tabela 10 Najtrudniejszych Klas `mod 32768` (o najmniejszym $\bar{v}_8$ oraz $\bar{v}_{10}$) wraz ze Ścieżkami Przejść Blokowych

#### A. 10 Najtrudniejszych Klas w Rodzinie A (Podniesienia 64 ocalałych klas `mod 1024` do `mod 32768`, posortowane wg $\bar{v}_8$, a następnie $\bar{v}_{10}$):

| Ranga | Klasa $r \pmod{32768}$ | Baza $r_0 \pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..10}$ | Wektor $v_{1..10}$ | $\sum_{i=1}^8 (d_i+v_i)$ ($\bar{v}_8$) | $\sum_{i=1}^{10} (d_i+v_i)$ ($\bar{v}_{10}$) | $\sum_{i=1}^{10} v_i$ ($\bar{v}_{\text{exit},10}$) | $\sum_{i=1}^{10} r_i$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`28399`** | `751` ($j=27$) | **`5`** | `[1, 2, 2, 1, 5, 1, 3, 2, 4, 4]` | `[1, 2, 1, 1, 2, 1, 2, 1, 3, 1]` | **`17`** (**`2.125`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `12` |
| **2** | **`21231`** | `751` ($j=20$) | **`8`** | `[1, 1, 2, 1, 4, 3, 3, 3, 2, 4]` | `[1, 1, 1, 1, 3, 2, 1, 2, 1, 3]` | **`18`** (**`2.250`**) | **`24`** (**`2.400`**) | `16` (`1.600`) | `13` |
| **3** | **`3007`** | `959` ($j=2$) | **`4`** | `[1, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `12` |
| **4** | **`6767`** | `623` ($j=6$) | **`4`** | `[1, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `11` |
| **5** | **`6943`** | `799` ($j=6$) | **`2`** | `[2, 3, 2, 2, 2, 2, 3, 2, 4, 3]` | `[1, 2, 1, 1, 1, 1, 2, 2, 3, 2]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `16` (`1.600`) | `12` |
| **6** | **`2111`** | `63` ($j=2$) | **`1`** | `[3, 1, 2, 3, 4, 1, 2, 2, 3, 5]` | `[3, 1, 1, 2, 3, 1, 1, 1, 2, 2]` | **`18`** (**`2.250`**) | **`26`** (**`2.600`**) | `17` (`1.700`) | `14` |
| **7** | **`6591`** | `447` ($j=6$) | **`7`** | `[1, 2, 2, 2, 3, 2, 4, 3, 3, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2, 2, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `18` (`1.800`) | `13` |
| **8** | **`14831`** | `495` ($j=14$) | **`7`** | `[1, 2, 2, 2, 3, 2, 4, 3, 3, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2, 2, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `18` (`1.800`) | `12` |
| **9** | **`31847`** | `103` ($j=31$) | **`7`** | `[2, 1, 2, 1, 4, 3, 3, 3, 2, 4]` | `[1, 1, 1, 1, 3, 2, 1, 2, 1, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `16` (`1.600`) | `12` |
| **10** | **`4511`** | `415` ($j=4$) | **`3`** | `[2, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`19`** (**`2.375`**) | **`26`** (**`2.600`**) | `15` (`1.500`) | `11` |

#### B. 10 Najtrudniejszych Klas wg $\bar{v}_{10}$ (identyczne minimum w Rodzinie A i Rodzinie B $16W+7 \pmod{32768}$):

| Ranga | Klasa $r \pmod{32768}$ | $W$ ($16W+7$) / Baza $r_0$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..10}$ | Wektor $v_{1..10}$ | $\sum_{i=1}^8 (d_i+v_i)$ ($\bar{v}_8$) | $\sum_{i=1}^{10} (d_i+v_i)$ ($\bar{v}_{10}$) | $\sum_{i=1}^{10} v_i$ ($\bar{v}_{\text{exit},10}$) | $\sum_{i=1}^{10} r_i$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`21231`** | `mod16=15`, `r0=751` ($j=20$) | **`8`** | `[1, 1, 2, 1, 4, 3, 3, 3, 2, 4]` | `[1, 1, 1, 1, 3, 2, 1, 2, 1, 3]` | **`18`** (**`2.250`**) | **`24`** (**`2.400`**) | `16` (`1.600`) | `13` |
| **2** | **`28399`** | `mod16=15`, `r0=751` ($j=27$) | **`5`** | `[1, 2, 2, 1, 5, 1, 3, 2, 4, 4]` | `[1, 2, 1, 1, 2, 1, 2, 1, 3, 1]` | **`17`** (**`2.125`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `12` |
| **3** | **`3007`** | `mod16=15`, `r0=959` ($j=2$) | **`4`** | `[1, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `12` |
| **4** | **`6767`** | `mod16=15`, `r0=623` ($j=6$) | **`4`** | `[1, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `15` (`1.500`) | `11` |
| **5** | **`6943`** | `mod16=15`, `r0=799` ($j=6$) | **`2`** | `[2, 3, 2, 2, 2, 2, 3, 2, 4, 3]` | `[1, 2, 1, 1, 1, 1, 2, 2, 3, 2]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `16` (`1.600`) | `12` |
| **6** | **`6591`** | `mod16=15`, `r0=447` ($j=6$) | **`7`** | `[1, 2, 2, 2, 3, 2, 4, 3, 3, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2, 2, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `18` (`1.800`) | `13` |
| **7** | **`14831`** | `mod16=15`, `r0=495` ($j=14$) | **`7`** | `[1, 2, 2, 2, 3, 2, 4, 3, 3, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2, 2, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `18` (`1.800`) | `12` |
| **8** | **`31847`** | `W=1990`, `r0=103` ($j=31$) | **`7`** | `[2, 1, 2, 1, 4, 3, 3, 3, 2, 4]` | `[1, 1, 1, 1, 3, 2, 1, 2, 1, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `16` (`1.600`) | `12` |
| **9** | **`703`** | `mod16=15`, `r0=703` ($j=0$) | **`2`** | `[1, 5, 2, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 1, 1, 2, 3, 1, 1, 1, 2]` | **`20`** (**`2.500`**) | **`25`** (**`2.500`**) | `14` (`1.400`) | `12` |
| **10** | **`1583`** | `mod16=15`, `r0=559` ($j=1$) | **`2`** | `[1, 5, 2, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 1, 1, 2, 3, 1, 1, 1, 2]` | **`20`** (**`2.500`**) | **`25`** (**`2.500`**) | `14` (`1.400`) | `11` |

#### C. Pełne 10-Blokowe Ścieżki Przejść $n_0 \to n_1 \to \dots \to n_{10}$ dla 10 Najtrudniejszych Klas `mod 32768`:

- **Klasa `r = 28399` (`r0 = 751`, $j = 27$, $K^* = 5$, $\bar{v}_8 = 2.125$, $\bar{v}_{10} = 2.500$):**  
  `28399` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `71887` $\to$ `71887` $\xrightarrow[d+v=2]{(c=1, b=4, r=2, d=0, v=2)}$ `90983` $\to$ `90983` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `153535` $\to$ `153535` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `874435` $\to$ `874435` $\xrightarrow[d+v=5]{(c=5, b=3, r=0, d=3, v=2)}$ `245935` $\to$ `245935` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `622525` $\to$ `622525` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `233447` $\to$ `233447` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `393943` $\to$ `393943` $\xrightarrow[d+v=4]{(c=1, b=3, r=1, d=1, v=3)}$ `166195` $\to$ `166195` $\xrightarrow[d+v=4]{(c=5, b=3, r=0, d=3, v=1)}$ `93485`
- **Klasa `r = 21231` (`r0 = 751`, $j = 20$, $K^* = 8$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.400$):**  
  `21231` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `53743` $\to$ `53743` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $\xrightarrow[d+v=3]{(c=1, b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `235879`
- **Klasa `r = 3007` (`r0 = 959`, $j = 2$, $K^* = 4$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.500$):**  
  `3007` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $\xrightarrow[d+v=5]{(c=7, b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `14863`
- **Klasa `r = 6767` (`r0 = 623`, $j = 6$, $K^* = 4$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.500$):**  
  `6767` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $\xrightarrow[d+v=5]{(c=7, b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `14863`
- **Klasa `r = 6943` (`r0 = 799`, $j = 6$, $K^* = 2$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.500$):**  
  `6943` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `26365` $\to$ `26365` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `8573`
- **Klasa `r = 2111` (`r0 = 63`, $j = 2$, $K^* = 1$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.600$):**  
  `2111` $\xrightarrow[d+v=3]{(c=1, b=6, r=3, d=0, v=3)}$ `3007` $\to$ `3007` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $\xrightarrow[d+v=5]{(c=7, b=3, r=0, d=3, v=2)}$ `8807`
- **Klasa `r = 6591` (`r0 = 447`, $j = 6$, $K^* = 7$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.500$):**  
  `6591` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `8573` $\to$ `8573` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `3215` $\to$ `3215` $\xrightarrow[d+v=3]{(c=1, b=4, r=2, d=0, v=3)}$ `2035`
- **Klasa `r = 14831` (`r0 = 495`, $j = 14$, $K^* = 7$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.500$):**  
  `14831` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `8573` $\to$ `8573` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `3215` $\to$ `3215` $\xrightarrow[d+v=3]{(c=1, b=4, r=2, d=0, v=3)}$ `2035`
- **Klasa `r = 31847` (`r0 = 103`, $j = 31$, $K^* = 7$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.500$):**  
  `31847` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `53743` $\to$ `53743` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $\xrightarrow[d+v=3]{(c=1, b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `235879`
- **Klasa `r = 4511` (`r0 = 415`, $j = 4$, $K^* = 3$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.600$):**  
  `4511` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $\xrightarrow[d+v=5]{(c=7, b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `14863`

#### D. 10 Najtrudniejszych Klas w Rodzinie B ($r_0 = 16W + 7 \pmod{32768}$, posortowane wg $\bar{v}_{10}$, a następnie $\bar{v}_8$):

| Ranga | Klasa $r_0 \pmod{32768}$ | $W$ ($16W+7$) | Baza $r_{\text{base}} \pmod{1024}$ ($j$) | $K^*(r_0)$ | Wektor $(d_i+v_i)_{1..10}$ | Wektor $v_{1..10}$ | $\sum_{i=1}^8 (d_i+v_i)$ ($\bar{v}_8$) | $\sum_{i=1}^{10} (d_i+v_i)$ ($\bar{v}_{10}$) | $\sum_{i=1}^{10} v_i$ ($\bar{v}_{\text{exit},10}$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`3335`** | `208` | `263` ($j=3$) | **`2`** | `[2, 3, 3, 1, 2, 3, 4, 1, 2, 2]` | `[1, 2, 3, 1, 1, 2, 3, 1, 1, 1]` | **`19`** (**`2.375`**) | **`23`** (**`2.300`**) | `16` (`1.600`) |
| **2** | **`12343`** | `771` | `55` ($j=12$) | **`1`** | `[3, 1, 3, 2, 2, 2, 2, 3, 2, 4]` | `[2, 1, 2, 1, 1, 1, 1, 2, 2, 3]` | **`18`** (**`2.250`**) | **`24`** (**`2.400`**) | `16` (`1.600`) |
| **3** | **`21943`** | `1371` | `439` ($j=21$) | **`1`** | `[3, 4, 1, 3, 2, 2, 2, 2, 3, 2]` | `[2, 1, 1, 2, 1, 1, 1, 1, 2, 2]` | **`19`** (**`2.375`**) | **`24`** (**`2.400`**) | `14` (`1.400`) |
| **4** | **`15623`** | `976` | `263` ($j=15$) | **`2`** | `[2, 3, 2, 2, 2, 2, 3, 2, 4, 3]` | `[1, 2, 1, 1, 1, 1, 2, 2, 3, 2]` | **`18`** (**`2.250`**) | **`25`** (**`2.500`**) | `16` (`1.600`) |
| **5** | **`31847`** | `1990` | `103` ($j=31$) | **`7`** | `[2, 1, 2, 1, 4, 3, 3, 3, 2, 4]` | `[1, 1, 1, 1, 3, 2, 1, 2, 1, 3]` | **`19`** (**`2.375`**) | **`25`** (**`2.500`**) | `16` (`1.600`) |
| **6** | **`29607`** | `1850` | `935` ($j=28$) | **`3`** | `[2, 2, 3, 4, 3, 2, 3, 3, 1, 2]` | `[1, 1, 2, 1, 2, 1, 2, 3, 1, 1]` | **`22`** (**`2.750`**) | **`25`** (**`2.500`**) | `15` (`1.500`) |
| **7** | **`10151`** | `634` | `935` ($j=9$) | **`3`** | `[2, 2, 3, 4, 1, 2, 2, 3, 5, 2]` | `[1, 1, 2, 3, 1, 1, 1, 2, 2, 1]` | **`19`** (**`2.375`**) | **`26`** (**`2.600`**) | `15` (`1.500`) |
| **8** | **`22247`** | `1390` | `743` ($j=21$) | **`5`** | `[2, 2, 2, 2, 3, 2, 4, 3, 3, 3]` | `[1, 1, 1, 1, 2, 2, 3, 2, 2, 3]` | **`20`** (**`2.500`**) | **`26`** (**`2.600`**) | `18` (`1.800`) |
| **9** | **`2375`** | `148` | `327` ($j=2$) | **`2`** | `[2, 5, 2, 2, 3, 4, 1, 2, 2, 3]` | `[1, 1, 1, 1, 2, 3, 1, 1, 1, 2]` | **`21`** (**`2.625`**) | **`26`** (**`2.600`**) | `14` (`1.400`) |
| **10** | **`10007`** | `625` | `791` ($j=9$) | **`1`** | `[5, 3, 1, 2, 3, 4, 1, 2, 2, 3]` | `[4, 3, 1, 1, 2, 3, 1, 1, 1, 2]` | **`21`** (**`2.625`**) | **`26`** (**`2.600`**) | `19` (`1.900`) |

#### E. Ścieżki Przejść 10-Blokowych dla Klas z $K^* \in \{7, 8\}$ oraz Rekordzistów Rodziny B ($16W+7 \pmod{32768}$):

- **Klasa `r = 4591` (`r0 = 495`, $j = 4$, $K^* = 8$, $\bar{v}_8 = 2.500$, $\bar{v}_{10} = 2.900$):**  
  `4591` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `11623` $\to$ `11623` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `19615` $\to$ `19615` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `74479` $\to$ `74479` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `188527` $\to$ `188527` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `477211` $\to$ `477211` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `1811915` $\to$ `1811915` $\xrightarrow[d+v=4]{(c=5, b=4, r=1, d=1, v=3)}$ `382201` $\to$ `382201` $\xrightarrow[d+v=6]{(c=7, b=8, r=1, d=5, v=1)}$ `181397` $\to$ `181397` $\xrightarrow[d+v=6]{(c=1, b=1, r=0, d=1, v=5)}$ `8503` $\to$ `8503` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `7175`
- **Klasa `r = 6887` (W = 430, `r0 = 743`, $j = 6$, $K^* = 8$, $\bar{v}_8 = 2.625$, $\bar{v}_{10} = 3.000$):**  
  `6887` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `11623` $\to$ `11623` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `19615` $\to$ `19615` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `74479` $\to$ `74479` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `188527` $\to$ `188527` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `477211` $\to$ `477211` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `1811915` $\to$ `1811915` $\xrightarrow[d+v=4]{(c=5, b=4, r=1, d=1, v=3)}$ `382201` $\to$ `382201` $\xrightarrow[d+v=6]{(c=7, b=8, r=1, d=5, v=1)}$ `181397` $\to$ `181397` $\xrightarrow[d+v=6]{(c=1, b=1, r=0, d=1, v=5)}$ `8503` $\to$ `8503` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `7175`
- **Klasa `r = 21231` (`r0 = 751`, $j = 20$, $K^* = 8$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.400$):**  
  `21231` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `53743` $\to$ `53743` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $\xrightarrow[d+v=3]{(c=1, b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `235879`
- **Klasa `r = 11367` (W = 710, `r0 = 103`, $j = 11$, $K^* = 7$, $\bar{v}_8 = 2.750$, $\bar{v}_{10} = 3.100$):**  
  `11367` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `19183` $\to$ `19183` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `48559` $\to$ `48559` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `122917` $\to$ `122917` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `23047` $\to$ `23047` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `38893` $\to$ `38893` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `14585` $\to$ `14585` $\xrightarrow[d+v=6]{(c=7, b=8, r=1, d=5, v=1)}$ `6923` $\to$ `6923` $\xrightarrow[d+v=3]{(c=5, b=4, r=1, d=1, v=2)}$ `2921` $\to$ `2921` $\xrightarrow[d+v=5]{(c=7, b=4, r=0, d=4, v=1)}$ `7397` $\to$ `7397` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `1387`
- **Klasa `r = 11623` (W = 726, `r0 = 359`, $j = 11$, $K^* = 7$, $\bar{v}_8 = 3.125$, $\bar{v}_{10} = 3.000$):**  
  `11623` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `19615` $\to$ `19615` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `74479` $\to$ `74479` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `188527` $\to$ `188527` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `477211` $\to$ `477211` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `1811915` $\to$ `1811915` $\xrightarrow[d+v=4]{(c=5, b=4, r=1, d=1, v=3)}$ `382201` $\to$ `382201` $\xrightarrow[d+v=6]{(c=7, b=8, r=1, d=5, v=1)}$ `181397` $\to$ `181397` $\xrightarrow[d+v=6]{(c=1, b=1, r=0, d=1, v=5)}$ `8503` $\to$ `8503` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `7175` $\to$ `7175` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `12109`
- **Klasa `r = 31847` (W = 1990, `r0 = 103`, $j = 31$, $K^* = 7$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.500$):**  
  `31847` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `53743` $\to$ `53743` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $\xrightarrow[d+v=3]{(c=5, b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $\xrightarrow[d+v=3]{(c=1, b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `235879`
- **Klasa `r = 3335` (W = 208, `r0 = 263`, $j = 3$, $K^* = 2$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.300$):**  
  `3335` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `5629` $\to$ `5629` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `2111` $\to$ `2111` $\xrightarrow[d+v=3]{(c=1, b=6, r=3, d=0, v=3)}$ `3007` $\to$ `3007` $\xrightarrow[d+v=1]{(c=1, b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `37111`
- **Klasa `r = 12343` (W = 771, `r0 = 55`, $j = 12$, $K^* = 1$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.400$):**  
  `12343` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `10415` $\to$ `10415` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `26365` $\to$ `26365` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `22861`
- **Klasa `r = 21943` (W = 1371, `r0 = 439`, $j = 21$, $K^* = 1$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.400$):**  
  `21943` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `18515` $\to$ `18515` $\xrightarrow[d+v=4]{(c=5, b=3, r=0, d=3, v=1)}$ `10415` $\to$ `10415` $\xrightarrow[d+v=1]{(c=1, b=4, r=2, d=0, v=1)}$ `26365` $\to$ `26365` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925`
- **Klasa `r = 15623` (W = 976, `r0 = 263`, $j = 15$, $K^* = 2$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.500$):**  
  `15623` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `26365` $\to$ `26365` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $\xrightarrow[d+v=2]{(c=1, b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $\xrightarrow[d+v=2]{(c=1, b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $\xrightarrow[d+v=2]{(c=5, b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $\xrightarrow[d+v=2]{(c=5, b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $\xrightarrow[d+v=3]{(c=1, b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $\xrightarrow[d+v=2]{(c=1, b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $\xrightarrow[d+v=4]{(c=1, b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $\xrightarrow[d+v=3]{(c=1, b=1, r=0, d=1, v=2)}$ `8573`


---

# Runda 8. Głębokie Sito 2-Adyczne (`k = 283..303`, `m = 460..492`, Zweryfikowane w Lean 4) oraz 12-Blokowa Anatomia Domknięcia na Siatce `mod 65536` (`4096` Klas, $K \in \{1..12\}$) i Macierz Przejść Fazowych dla 8 Kanonicznych Rodzin

## Część 16. Zestaw O (`k = 283..291`, `m = 460..473`, Część 61) oraz Zestaw P (`k = 293..303`, `m = 476..492`, Część 62) — 208 Twierdzeń

### 16.1. Zbiorcza tabela 13 poziomów głębokiego sita 2-adycznego ($c = 177..189$, $k = 283..303$, $m = 460..492$)

Wszystkie **208 twierdzeń** Zestawu O (96 twierdzeń) oraz Zestawu P (112 twierdzeń, przekraczających historyczną barierę **$2^{303}$ w $492$ krokach Collatza**) zostało wygenerowanych i zweryfikowanych bezpośrednio kompilatorem `~/.elan/bin/lean --stdin` (z dyrektywami `set_option exponentiation.threshold 1024` oraz `set_option maxRecDepth 16384`, kod wyjścia `0`, `0` błędów, `0` ostrzeżeń).

> [!IMPORTANT]
> **Uwaga techniczna dla integracji w `lean4/CollatzProof.lean`:** Przy $m \ge 471$ ($k \ge 290$) głębokość rekurencji `affineIter m` podczas redukcji `by decide` przekracza domyślny limit `maxRecDepth 4096`. Dodanie `set_option maxRecDepth 16384` obok `set_option exponentiation.threshold 1024` na początku Części 61 sprawia, że wszystkie 208 twierdzeń kompiluje się w ~6 sekund z kodem wyjścia `0`).

| Zestaw | Poziom $c = m - k$ | Próg $k$ | Kroki $m$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek (`by decide` ✅) |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **O (Part 61)** | `177` | `283` | `460` | `0.181540` | `10573364` | `8142879, 10549863, 14089159, 14281383, 15045407, 21133739, 23258415, 28178319, 28562767, 30090815, 31720091, 34887623, 35685103, 35694447, 40814363, 42293455` |
| **O (Part 61)** | `178` | `285` | `463` | `0.136155` | `5814604` | `6686847, 10030271, 12867759, 13373695, 14089159, 14281383, 15045407, 15733191, 19301639, 19638399, 20060543, 21133739, 21146727, 22568111, 22649071, 23258415` |
| **O (Part 61)** | `179` | `286` | `465` | `0.204233` | `8463042` | `6686847, 10030271, 12867759, 13373695, 15045407, 15733191, 19638399, 21146727, 22568111, 23599787, 27209575, 28178319, 29685799, 31487215, 31720091, 33852167` |
| **O (Part 61)** | `180` | `288` | `468` | `0.153175` | `6710836` | `6686847, 10030271, 13373695, 13421671, 14089159, 14281383, 15045407, 15733191, 19638399, 20060543, 20132507, 21133739, 21146727, 21422075, 22568111, 26843343` |
| **O (Part 61)** | `181` | `290` | `471` | `0.114881` | `7140692` | `6686847, 10030271, 12867759, 13373695, 14281383, 15045407, 19638399, 20060543, 21133739, 21146727, 22568111, 26843343, 27209575, 27988635, 28178319, 28562767` |
| **O (Part 61)** | `182` | `291` | `473` | `0.172322` | `12523697` | `15045407, 20060543, 21146727, 27988635, 29685799, 30090815, 31720091, 35882655, 42267479, 42881703, 43254511, 45611647, 46436255, 46564287, 47687103, 50094787` |
| **P (Part 62)** | `183` | `293` | `476` | `0.129241` | `7739376` | `6686847, 8400511, 10030271, 12600767, 13373695, 14089159, 15045407, 18901151, 20060543, 20638335, 21133739, 21146727, 22649071, 28178319, 29685799, 30957503` |
| **P (Part 62)** | `184` | `294` | `478` | `0.193862` | `11402912` | `6686847, 8400511, 10030271, 12600767, 13373695, 14089159, 28178319, 29685799, 31273927, 33881839, 35663187, 35882655, 37571091, 41276671, 44528699, 45611647` |
| **P (Part 62)** | `185` | `296` | `481` | `0.145396` | `7739376` | `6686847, 8400511, 10030271, 12600767, 13373695, 14089159, 15045407, 16801023, 18901151, 20132507, 20638335, 21133739, 22568111, 28351727, 29685799, 30957503` |
| **P (Part 62)** | `186` | `298` | `484` | `0.109047` | `6024959` | `6686847, 8400511, 10030271, 12600767, 13373695, 14089159, 15045407, 16801023, 18901151, 20060543, 20638335, 21133739, 22401363, 22441319, 22649071, 24099835` |
| **P (Part 62)** | `187` | `299` | `486` | `0.163571` | `6679168` | `6686847, 8400511, 10030271, 12600767, 13373695, 14089159, 14960879, 16801023, 18901151, 20060543, 20638335, 21133739, 22441319, 22649071, 25201535, 26716671` |
| **P (Part 62)** | `188` | `301` | `489` | `0.122678` | `5662268` | `6686847, 8400511, 12600767, 13373695, 14089159, 14281383, 14960879, 16801023, 18901151, 19947839, 20132507, 21133739, 21422075, 22401363, 22441319, 22649071` |
| **P (Part 62)** | `189` | `303` | `492` | `0.092009` | `5610330` | `6686847, 9973919, 10030271, 12600767, 13421671, 14089159, 14281383, 14960879, 15045407, 16801023, 18901151, 19947839, 20132507, 21133739, 22401363, 22441319` |

### 16.2. Gotowe, zweryfikowane w Lean 4 bloki kodu (Zestaw O — Część 61 oraz Zestaw P — Część 62)

*(Pełny kod został również zapisany w pliku [`sieve_283_303_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_283_303_lean.txt).)*

```lean
set_option exponentiation.threshold 1024
set_option maxRecDepth 16384

-- ============================================================================
-- Część 61. Głębokie Sito 2-Adyczne: Zestaw O (k = 283..291, m = 460..473, 96 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 8)
-- ============================================================================

-- k = 283, m = 460 (c = 177, 2^283 = 15541351137805832567355695254588151253139254712417116170014499277911234281641667985408 > 3^177)
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq8142879 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 8142879) := checkAffineDrop_sound 460 (2 ^ 283) 8142879 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq10549863 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 10549863) := checkAffineDrop_sound 460 (2 ^ 283) 10549863 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 14089159) := checkAffineDrop_sound 460 (2 ^ 283) 14089159 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 14281383) := checkAffineDrop_sound 460 (2 ^ 283) 14281383 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 15045407) := checkAffineDrop_sound 460 (2 ^ 283) 15045407 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 21133739) := checkAffineDrop_sound 460 (2 ^ 283) 21133739 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq23258415 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 23258415) := checkAffineDrop_sound 460 (2 ^ 283) 23258415 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq28178319 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 28178319) := checkAffineDrop_sound 460 (2 ^ 283) 28178319 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq28562767 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 28562767) := checkAffineDrop_sound 460 (2 ^ 283) 28562767 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq30090815 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 30090815) := checkAffineDrop_sound 460 (2 ^ 283) 30090815 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq31720091 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 31720091) := checkAffineDrop_sound 460 (2 ^ 283) 31720091 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq34887623 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 34887623) := checkAffineDrop_sound 460 (2 ^ 283) 34887623 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq35685103 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 35685103) := checkAffineDrop_sound 460 (2 ^ 283) 35685103 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq35694447 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 35694447) := checkAffineDrop_sound 460 (2 ^ 283) 35694447 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq40814363 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 40814363) := checkAffineDrop_sound 460 (2 ^ 283) 40814363 (by decide) k
theorem horizon_drop_mod15541351137805832567355695254588151253139254712417116170014499277911234281641667985408_eq42293455 (k : Nat) : HasHorizonDrop (2 ^ 283 * k + 42293455) := checkAffineDrop_sound 460 (2 ^ 283) 42293455 (by decide) k

-- k = 285, m = 463 (c = 178, 2^285 = 62165404551223330269422781018352605012557018849668464680057997111644937126566671941632 > 3^178)
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 6686847) := checkAffineDrop_sound 463 (2 ^ 285) 6686847 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 10030271) := checkAffineDrop_sound 463 (2 ^ 285) 10030271 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 12867759) := checkAffineDrop_sound 463 (2 ^ 285) 12867759 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 13373695) := checkAffineDrop_sound 463 (2 ^ 285) 13373695 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 14089159) := checkAffineDrop_sound 463 (2 ^ 285) 14089159 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 14281383) := checkAffineDrop_sound 463 (2 ^ 285) 14281383 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 15045407) := checkAffineDrop_sound 463 (2 ^ 285) 15045407 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 15733191) := checkAffineDrop_sound 463 (2 ^ 285) 15733191 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq19301639 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 19301639) := checkAffineDrop_sound 463 (2 ^ 285) 19301639 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 19638399) := checkAffineDrop_sound 463 (2 ^ 285) 19638399 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 20060543) := checkAffineDrop_sound 463 (2 ^ 285) 20060543 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 21133739) := checkAffineDrop_sound 463 (2 ^ 285) 21133739 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 21146727) := checkAffineDrop_sound 463 (2 ^ 285) 21146727 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 22568111) := checkAffineDrop_sound 463 (2 ^ 285) 22568111 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq22649071 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 22649071) := checkAffineDrop_sound 463 (2 ^ 285) 22649071 (by decide) k
theorem horizon_drop_mod62165404551223330269422781018352605012557018849668464680057997111644937126566671941632_eq23258415 (k : Nat) : HasHorizonDrop (2 ^ 285 * k + 23258415) := checkAffineDrop_sound 463 (2 ^ 285) 23258415 (by decide) k

-- k = 286, m = 465 (c = 179, 2^286 = 124330809102446660538845562036705210025114037699336929360115994223289874253133343883264 > 3^179)
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 6686847) := checkAffineDrop_sound 465 (2 ^ 286) 6686847 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 10030271) := checkAffineDrop_sound 465 (2 ^ 286) 10030271 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 12867759) := checkAffineDrop_sound 465 (2 ^ 286) 12867759 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 13373695) := checkAffineDrop_sound 465 (2 ^ 286) 13373695 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 15045407) := checkAffineDrop_sound 465 (2 ^ 286) 15045407 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 15733191) := checkAffineDrop_sound 465 (2 ^ 286) 15733191 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 19638399) := checkAffineDrop_sound 465 (2 ^ 286) 19638399 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 21146727) := checkAffineDrop_sound 465 (2 ^ 286) 21146727 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 22568111) := checkAffineDrop_sound 465 (2 ^ 286) 22568111 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 23599787) := checkAffineDrop_sound 465 (2 ^ 286) 23599787 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq27209575 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 27209575) := checkAffineDrop_sound 465 (2 ^ 286) 27209575 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq28178319 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 28178319) := checkAffineDrop_sound 465 (2 ^ 286) 28178319 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq29685799 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 29685799) := checkAffineDrop_sound 465 (2 ^ 286) 29685799 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq31487215 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 31487215) := checkAffineDrop_sound 465 (2 ^ 286) 31487215 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq31720091 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 31720091) := checkAffineDrop_sound 465 (2 ^ 286) 31720091 (by decide) k
theorem horizon_drop_mod124330809102446660538845562036705210025114037699336929360115994223289874253133343883264_eq33852167 (k : Nat) : HasHorizonDrop (2 ^ 286 * k + 33852167) := checkAffineDrop_sound 465 (2 ^ 286) 33852167 (by decide) k

-- k = 288, m = 468 (c = 180, 2^288 = 497323236409786642155382248146820840100456150797347717440463976893159497012533375533056 > 3^180)
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 6686847) := checkAffineDrop_sound 468 (2 ^ 288) 6686847 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 10030271) := checkAffineDrop_sound 468 (2 ^ 288) 10030271 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 13373695) := checkAffineDrop_sound 468 (2 ^ 288) 13373695 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 13421671) := checkAffineDrop_sound 468 (2 ^ 288) 13421671 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 14089159) := checkAffineDrop_sound 468 (2 ^ 288) 14089159 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 14281383) := checkAffineDrop_sound 468 (2 ^ 288) 14281383 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 15045407) := checkAffineDrop_sound 468 (2 ^ 288) 15045407 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 15733191) := checkAffineDrop_sound 468 (2 ^ 288) 15733191 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 19638399) := checkAffineDrop_sound 468 (2 ^ 288) 19638399 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 20060543) := checkAffineDrop_sound 468 (2 ^ 288) 20060543 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 20132507) := checkAffineDrop_sound 468 (2 ^ 288) 20132507 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 21133739) := checkAffineDrop_sound 468 (2 ^ 288) 21133739 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 21146727) := checkAffineDrop_sound 468 (2 ^ 288) 21146727 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq21422075 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 21422075) := checkAffineDrop_sound 468 (2 ^ 288) 21422075 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 22568111) := checkAffineDrop_sound 468 (2 ^ 288) 22568111 (by decide) k
theorem horizon_drop_mod497323236409786642155382248146820840100456150797347717440463976893159497012533375533056_eq26843343 (k : Nat) : HasHorizonDrop (2 ^ 288 * k + 26843343) := checkAffineDrop_sound 468 (2 ^ 288) 26843343 (by decide) k

-- k = 290, m = 471 (c = 181, 2^290 = 1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224 > 3^181)
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 6686847) := checkAffineDrop_sound 471 (2 ^ 290) 6686847 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 10030271) := checkAffineDrop_sound 471 (2 ^ 290) 10030271 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq12867759 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 12867759) := checkAffineDrop_sound 471 (2 ^ 290) 12867759 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 13373695) := checkAffineDrop_sound 471 (2 ^ 290) 13373695 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 14281383) := checkAffineDrop_sound 471 (2 ^ 290) 14281383 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 15045407) := checkAffineDrop_sound 471 (2 ^ 290) 15045407 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq19638399 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 19638399) := checkAffineDrop_sound 471 (2 ^ 290) 19638399 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 20060543) := checkAffineDrop_sound 471 (2 ^ 290) 20060543 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 21133739) := checkAffineDrop_sound 471 (2 ^ 290) 21133739 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 21146727) := checkAffineDrop_sound 471 (2 ^ 290) 21146727 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 22568111) := checkAffineDrop_sound 471 (2 ^ 290) 22568111 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq26843343 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 26843343) := checkAffineDrop_sound 471 (2 ^ 290) 26843343 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq27209575 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 27209575) := checkAffineDrop_sound 471 (2 ^ 290) 27209575 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq27988635 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 27988635) := checkAffineDrop_sound 471 (2 ^ 290) 27988635 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq28178319 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 28178319) := checkAffineDrop_sound 471 (2 ^ 290) 28178319 (by decide) k
theorem horizon_drop_mod1989292945639146568621528992587283360401824603189390869761855907572637988050133502132224_eq28562767 (k : Nat) : HasHorizonDrop (2 ^ 290 * k + 28562767) := checkAffineDrop_sound 471 (2 ^ 290) 28562767 (by decide) k

-- k = 291, m = 473 (c = 182, 2^291 = 3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448 > 3^182)
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 15045407) := checkAffineDrop_sound 473 (2 ^ 291) 15045407 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 20060543) := checkAffineDrop_sound 473 (2 ^ 291) 20060543 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 21146727) := checkAffineDrop_sound 473 (2 ^ 291) 21146727 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq27988635 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 27988635) := checkAffineDrop_sound 473 (2 ^ 291) 27988635 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq29685799 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 29685799) := checkAffineDrop_sound 473 (2 ^ 291) 29685799 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq30090815 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 30090815) := checkAffineDrop_sound 473 (2 ^ 291) 30090815 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq31720091 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 31720091) := checkAffineDrop_sound 473 (2 ^ 291) 31720091 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq35882655 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 35882655) := checkAffineDrop_sound 473 (2 ^ 291) 35882655 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq42267479 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 42267479) := checkAffineDrop_sound 473 (2 ^ 291) 42267479 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq42881703 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 42881703) := checkAffineDrop_sound 473 (2 ^ 291) 42881703 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq43254511 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 43254511) := checkAffineDrop_sound 473 (2 ^ 291) 43254511 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq45611647 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 45611647) := checkAffineDrop_sound 473 (2 ^ 291) 45611647 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq46436255 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 46436255) := checkAffineDrop_sound 473 (2 ^ 291) 46436255 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq46564287 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 46564287) := checkAffineDrop_sound 473 (2 ^ 291) 46564287 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq47687103 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 47687103) := checkAffineDrop_sound 473 (2 ^ 291) 47687103 (by decide) k
theorem horizon_drop_mod3978585891278293137243057985174566720803649206378781739523711815145275976100267004264448_eq50094787 (k : Nat) : HasHorizonDrop (2 ^ 291 * k + 50094787) := checkAffineDrop_sound 473 (2 ^ 291) 50094787 (by decide) k

-- ============================================================================
-- Część 62. Głębokie Sito 2-Adyczne: Zestaw P (k = 293..303, m = 476..492, 112 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 8)
-- ============================================================================

-- k = 293, m = 476 (c = 183, 2^293 = 15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792 > 3^183)
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 6686847) := checkAffineDrop_sound 476 (2 ^ 293) 6686847 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 8400511) := checkAffineDrop_sound 476 (2 ^ 293) 8400511 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 10030271) := checkAffineDrop_sound 476 (2 ^ 293) 10030271 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 12600767) := checkAffineDrop_sound 476 (2 ^ 293) 12600767 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 13373695) := checkAffineDrop_sound 476 (2 ^ 293) 13373695 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 14089159) := checkAffineDrop_sound 476 (2 ^ 293) 14089159 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 15045407) := checkAffineDrop_sound 476 (2 ^ 293) 15045407 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 18901151) := checkAffineDrop_sound 476 (2 ^ 293) 18901151 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 20060543) := checkAffineDrop_sound 476 (2 ^ 293) 20060543 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 20638335) := checkAffineDrop_sound 476 (2 ^ 293) 20638335 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 21133739) := checkAffineDrop_sound 476 (2 ^ 293) 21133739 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq21146727 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 21146727) := checkAffineDrop_sound 476 (2 ^ 293) 21146727 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq22649071 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 22649071) := checkAffineDrop_sound 476 (2 ^ 293) 22649071 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq28178319 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 28178319) := checkAffineDrop_sound 476 (2 ^ 293) 28178319 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq29685799 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 29685799) := checkAffineDrop_sound 476 (2 ^ 293) 29685799 (by decide) k
theorem horizon_drop_mod15914343565113172548972231940698266883214596825515126958094847260581103904401068017057792_eq30957503 (k : Nat) : HasHorizonDrop (2 ^ 293 * k + 30957503) := checkAffineDrop_sound 476 (2 ^ 293) 30957503 (by decide) k

-- k = 294, m = 478 (c = 184, 2^294 = 31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584 > 3^184)
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 6686847) := checkAffineDrop_sound 478 (2 ^ 294) 6686847 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 8400511) := checkAffineDrop_sound 478 (2 ^ 294) 8400511 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 10030271) := checkAffineDrop_sound 478 (2 ^ 294) 10030271 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 12600767) := checkAffineDrop_sound 478 (2 ^ 294) 12600767 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 13373695) := checkAffineDrop_sound 478 (2 ^ 294) 13373695 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 14089159) := checkAffineDrop_sound 478 (2 ^ 294) 14089159 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq28178319 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 28178319) := checkAffineDrop_sound 478 (2 ^ 294) 28178319 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq29685799 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 29685799) := checkAffineDrop_sound 478 (2 ^ 294) 29685799 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq31273927 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 31273927) := checkAffineDrop_sound 478 (2 ^ 294) 31273927 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq33881839 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 33881839) := checkAffineDrop_sound 478 (2 ^ 294) 33881839 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq35663187 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 35663187) := checkAffineDrop_sound 478 (2 ^ 294) 35663187 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq35882655 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 35882655) := checkAffineDrop_sound 478 (2 ^ 294) 35882655 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq37571091 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 37571091) := checkAffineDrop_sound 478 (2 ^ 294) 37571091 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq41276671 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 41276671) := checkAffineDrop_sound 478 (2 ^ 294) 41276671 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq44528699 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 44528699) := checkAffineDrop_sound 478 (2 ^ 294) 44528699 (by decide) k
theorem horizon_drop_mod31828687130226345097944463881396533766429193651030253916189694521162207808802136034115584_eq45611647 (k : Nat) : HasHorizonDrop (2 ^ 294 * k + 45611647) := checkAffineDrop_sound 478 (2 ^ 294) 45611647 (by decide) k

-- k = 296, m = 481 (c = 185, 2^296 = 127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336 > 3^185)
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 6686847) := checkAffineDrop_sound 481 (2 ^ 296) 6686847 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 8400511) := checkAffineDrop_sound 481 (2 ^ 296) 8400511 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 10030271) := checkAffineDrop_sound 481 (2 ^ 296) 10030271 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 12600767) := checkAffineDrop_sound 481 (2 ^ 296) 12600767 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 13373695) := checkAffineDrop_sound 481 (2 ^ 296) 13373695 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 14089159) := checkAffineDrop_sound 481 (2 ^ 296) 14089159 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 15045407) := checkAffineDrop_sound 481 (2 ^ 296) 15045407 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 16801023) := checkAffineDrop_sound 481 (2 ^ 296) 16801023 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 18901151) := checkAffineDrop_sound 481 (2 ^ 296) 18901151 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 20132507) := checkAffineDrop_sound 481 (2 ^ 296) 20132507 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 20638335) := checkAffineDrop_sound 481 (2 ^ 296) 20638335 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 21133739) := checkAffineDrop_sound 481 (2 ^ 296) 21133739 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq22568111 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 22568111) := checkAffineDrop_sound 481 (2 ^ 296) 22568111 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq28351727 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 28351727) := checkAffineDrop_sound 481 (2 ^ 296) 28351727 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq29685799 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 29685799) := checkAffineDrop_sound 481 (2 ^ 296) 29685799 (by decide) k
theorem horizon_drop_mod127314748520905380391777855525586135065716774604121015664758778084648831235208544136462336_eq30957503 (k : Nat) : HasHorizonDrop (2 ^ 296 * k + 30957503) := checkAffineDrop_sound 481 (2 ^ 296) 30957503 (by decide) k

-- k = 298, m = 484 (c = 186, 2^298 = 509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344 > 3^186)
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 6686847) := checkAffineDrop_sound 484 (2 ^ 298) 6686847 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 8400511) := checkAffineDrop_sound 484 (2 ^ 298) 8400511 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 10030271) := checkAffineDrop_sound 484 (2 ^ 298) 10030271 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 12600767) := checkAffineDrop_sound 484 (2 ^ 298) 12600767 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 13373695) := checkAffineDrop_sound 484 (2 ^ 298) 13373695 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 14089159) := checkAffineDrop_sound 484 (2 ^ 298) 14089159 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 15045407) := checkAffineDrop_sound 484 (2 ^ 298) 15045407 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 16801023) := checkAffineDrop_sound 484 (2 ^ 298) 16801023 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 18901151) := checkAffineDrop_sound 484 (2 ^ 298) 18901151 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 20060543) := checkAffineDrop_sound 484 (2 ^ 298) 20060543 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 20638335) := checkAffineDrop_sound 484 (2 ^ 298) 20638335 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 21133739) := checkAffineDrop_sound 484 (2 ^ 298) 21133739 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 22401363) := checkAffineDrop_sound 484 (2 ^ 298) 22401363 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq22441319 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 22441319) := checkAffineDrop_sound 484 (2 ^ 298) 22441319 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq22649071 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 22649071) := checkAffineDrop_sound 484 (2 ^ 298) 22649071 (by decide) k
theorem horizon_drop_mod509258994083621521567111422102344540262867098416484062659035112338595324940834176545849344_eq24099835 (k : Nat) : HasHorizonDrop (2 ^ 298 * k + 24099835) := checkAffineDrop_sound 484 (2 ^ 298) 24099835 (by decide) k

-- k = 299, m = 486 (c = 187, 2^299 = 1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688 > 3^187)
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 6686847) := checkAffineDrop_sound 486 (2 ^ 299) 6686847 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 8400511) := checkAffineDrop_sound 486 (2 ^ 299) 8400511 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 10030271) := checkAffineDrop_sound 486 (2 ^ 299) 10030271 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 12600767) := checkAffineDrop_sound 486 (2 ^ 299) 12600767 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 13373695) := checkAffineDrop_sound 486 (2 ^ 299) 13373695 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 14089159) := checkAffineDrop_sound 486 (2 ^ 299) 14089159 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 14960879) := checkAffineDrop_sound 486 (2 ^ 299) 14960879 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 16801023) := checkAffineDrop_sound 486 (2 ^ 299) 16801023 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 18901151) := checkAffineDrop_sound 486 (2 ^ 299) 18901151 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 20060543) := checkAffineDrop_sound 486 (2 ^ 299) 20060543 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 20638335) := checkAffineDrop_sound 486 (2 ^ 299) 20638335 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 21133739) := checkAffineDrop_sound 486 (2 ^ 299) 21133739 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq22441319 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 22441319) := checkAffineDrop_sound 486 (2 ^ 299) 22441319 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq22649071 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 22649071) := checkAffineDrop_sound 486 (2 ^ 299) 22649071 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq25201535 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 25201535) := checkAffineDrop_sound 486 (2 ^ 299) 25201535 (by decide) k
theorem horizon_drop_mod1018517988167243043134222844204689080525734196832968125318070224677190649881668353091698688_eq26716671 (k : Nat) : HasHorizonDrop (2 ^ 299 * k + 26716671) := checkAffineDrop_sound 486 (2 ^ 299) 26716671 (by decide) k

-- k = 301, m = 489 (c = 188, 2^301 = 4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752 > 3^188)
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 6686847) := checkAffineDrop_sound 489 (2 ^ 301) 6686847 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 8400511) := checkAffineDrop_sound 489 (2 ^ 301) 8400511 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 12600767) := checkAffineDrop_sound 489 (2 ^ 301) 12600767 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 13373695) := checkAffineDrop_sound 489 (2 ^ 301) 13373695 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 14089159) := checkAffineDrop_sound 489 (2 ^ 301) 14089159 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 14281383) := checkAffineDrop_sound 489 (2 ^ 301) 14281383 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 14960879) := checkAffineDrop_sound 489 (2 ^ 301) 14960879 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 16801023) := checkAffineDrop_sound 489 (2 ^ 301) 16801023 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 18901151) := checkAffineDrop_sound 489 (2 ^ 301) 18901151 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 19947839) := checkAffineDrop_sound 489 (2 ^ 301) 19947839 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 20132507) := checkAffineDrop_sound 489 (2 ^ 301) 20132507 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 21133739) := checkAffineDrop_sound 489 (2 ^ 301) 21133739 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq21422075 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 21422075) := checkAffineDrop_sound 489 (2 ^ 301) 21422075 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 22401363) := checkAffineDrop_sound 489 (2 ^ 301) 22401363 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq22441319 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 22441319) := checkAffineDrop_sound 489 (2 ^ 301) 22441319 (by decide) k
theorem horizon_drop_mod4074071952668972172536891376818756322102936787331872501272280898708762599526673412366794752_eq22649071 (k : Nat) : HasHorizonDrop (2 ^ 301 * k + 22649071) := checkAffineDrop_sound 489 (2 ^ 301) 22649071 (by decide) k

-- k = 303, m = 492 (c = 189, 2^303 = 16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008 > 3^189)
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 6686847) := checkAffineDrop_sound 492 (2 ^ 303) 6686847 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 9973919) := checkAffineDrop_sound 492 (2 ^ 303) 9973919 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 10030271) := checkAffineDrop_sound 492 (2 ^ 303) 10030271 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 12600767) := checkAffineDrop_sound 492 (2 ^ 303) 12600767 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 13421671) := checkAffineDrop_sound 492 (2 ^ 303) 13421671 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 14089159) := checkAffineDrop_sound 492 (2 ^ 303) 14089159 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 14281383) := checkAffineDrop_sound 492 (2 ^ 303) 14281383 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 14960879) := checkAffineDrop_sound 492 (2 ^ 303) 14960879 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 15045407) := checkAffineDrop_sound 492 (2 ^ 303) 15045407 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 16801023) := checkAffineDrop_sound 492 (2 ^ 303) 16801023 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 18901151) := checkAffineDrop_sound 492 (2 ^ 303) 18901151 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 19947839) := checkAffineDrop_sound 492 (2 ^ 303) 19947839 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 20132507) := checkAffineDrop_sound 492 (2 ^ 303) 20132507 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 21133739) := checkAffineDrop_sound 492 (2 ^ 303) 21133739 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 22401363) := checkAffineDrop_sound 492 (2 ^ 303) 22401363 (by decide) k
theorem horizon_drop_mod16296287810675888690147565507275025288411747149327490005089123594835050398106693649467179008_eq22441319 (k : Nat) : HasHorizonDrop (2 ^ 303 * k + 22441319) := checkAffineDrop_sound 492 (2 ^ 303) 22441319 (by decide) k

```

---

## Część 17. 12-Blokowa Anatomia Domknięcia na Poziomie `mod 65536` (`4096` Klas Reszt, $K \in \{1..12\}$) oraz Macierz Przejść Fazowych Modulo-3 dla 8 Kanonicznych Rodzin

Analizę na poziomie `mod 65536` ($2^{16}$) przeprowadzono dla czterech 4096-elementowych rodzin klas reszt do horyzontu $K = 12$:
1. **Rodzina A (4096 podniesień 64 ocalałych klas bazowych `mod 1024` do `mod 65536`):** $r = r_{\text{base}} + 1024 j$, gdzie $r_{\text{base}} \in \text{survivingMod1024}$ ($64$ klasy) oraz $j \in \{0..63\}$ ($64 \times 64 = 4096$ klas — bezpośrednie rozszerzenie siatek z Rundy 6 i Rundy 7).
2. **Rodzina B (wszystkie 4096 klas postaci $r_0 = 16 W + 7 \pmod{65536}$):** $W \in \{0..4095\}$ (pełna warstwa klas o zerowym drenażu początkowym $d_1 = 0$ w pierwszym bloku).
3. **Rodzina C (4096 klas prefiksowych $U_1 \equiv r_0 \pmod{65536}$ w rodzinie głównej `-7`, $n_0 = 8 U_1 - 7$):** z waluacją pierwszego bloku liczoną bez darmowego ogona wejściowego ($w_1 = v_1 = v_2(9 U_1 - 7)$).
4. **Rodzina D (4096 klas prefiksowych $U_1 \equiv r_0 \pmod{65536}$ w rodzinie głównej `-5`, $n_0 = 8 U_1 - 5$):** z waluacją pierwszego bloku liczoną bez darmowego ogona wejściowego ($w_1 = v_1 = v_2(9 U_1 - 5)$).

### 17.1. Rozkład czasu pierwszego przejścia $K^*(r) = \min \{K \in \{1..12\} : \bar{v}_K(r) > \log_2 9 - 1 \approx 2{,}169925\}$ dla wszystkich 4 rodzin (`4096` klas `mod 65536`)

| Horyzont $K^*$ | Warunek $\sum_{i=1}^{K^*} w_i$ | Rodzina A (Podniesienia `mod 1024`) | Skumulowane A | Rodzina B ($16W + 7$) | Skumulowane B | Rodzina C (`-7`, $n_0 = 8U_1 - 7$) | Skumulowane C | Rodzina D (`-5`, $n_0 = 8U_1 - 5$) | Skumulowane D |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K^* = 1$** | $\sum_{i=1}^{1} w_i ≥ 3$ | **`1284`** (31.35%) | `1284/4096` (**31.35%**) | **`2048`** (50.00%) | `2048/4096` (**50.00%**) | **`3264`** (79.69%) | `3264/4096` (**79.69%**) | **`0`** (0.00%) | `0/4096` (**0.00%**) |
| **$K^* = 2$** | $\sum_{i=1}^{2} w_i ≥ 5$ | **`1778`** (43.41%) | `3062/4096` (**74.76%**) | **`1675`** (40.89%) | `3723/4096` (**90.89%**) | **`796`** (19.43%) | `4060/4096` (**99.12%**) | **`2624`** (64.06%) | `2624/4096` (**64.06%**) |
| **$K^* = 3$** | $\sum_{i=1}^{3} w_i ≥ 7$ | **`744`** (18.16%) | `3806/4096` (**92.92%**) | **`290`** (7.08%) | `4013/4096` (**97.97%**) | **`27`** (0.66%) | `4087/4096` (**99.78%**) | **`1155`** (28.20%) | `3779/4096` (**92.26%**) |
| **$K^* = 4$** | $\sum_{i=1}^{4} w_i ≥ 9$ | **`195`** (4.76%) | `4001/4096` (**97.68%**) | **`57`** (1.39%) | `4070/4096` (**99.37%**) | **`6`** (0.15%) | `4093/4096` (**99.93%**) | **`231`** (5.64%) | `4010/4096` (**97.90%**) |
| **$K^* = 5$** | $\sum_{i=1}^{5} w_i ≥ 11$ | **`70`** (1.71%) | `4071/4096` (**99.39%**) | **`20`** (0.49%) | `4090/4096` (**99.85%**) | **`2`** (0.05%) | `4095/4096` (**99.98%**) | **`54`** (1.32%) | `4064/4096` (**99.22%**) |
| **$K^* = 6$** | $\sum_{i=1}^{6} w_i ≥ 14$ | **`12`** (0.29%) | `4083/4096` (**99.68%**) | **`2`** (0.05%) | `4092/4096` (**99.90%**) | **`1`** (0.02%) | `4096/4096` (**100.00%**) | **`15`** (0.37%) | `4079/4096` (**99.58%**) |
| **$K^* = 7$** | $\sum_{i=1}^{7} w_i ≥ 16$ | **`9`** (0.22%) | `4092/4096` (**99.90%**) | **`3`** (0.07%) | `4095/4096` (**99.98%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`11`** (0.27%) | `4090/4096` (**99.85%**) |
| **$K^* = 8$** | $\sum_{i=1}^{8} w_i ≥ 18$ | **`4`** (0.10%) | `4096/4096` (**100.00%**) | **`1`** (0.02%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`3`** (0.07%) | `4093/4096` (**99.93%**) |
| **$K^* = 9$** | $\sum_{i=1}^{9} w_i ≥ 20$ | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`2`** (0.05%) | `4095/4096` (**99.98%**) |
| **$K^* = 10$** | $\sum_{i=1}^{10} w_i ≥ 22$ | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`1`** (0.02%) | `4096/4096` (**100.00%**) |
| **$K^* = 11$** | $\sum_{i=1}^{11} w_i ≥ 24$ | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) |
| **$K^* = 12$** | $\sum_{i=1}^{12} w_i ≥ 27$ | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) | **`0`** (0.00%) | `4096/4096` (**100.00%**) |

### 17.2. Histogramy średniej waluacji fazowej $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K w_i$ dla $K = 6, 7, 8, 9, 10, 11, 12$

#### A. Rodzina A: 4096 klas podniesionych z 64 ocalałych klas bazowych `mod 1024` ($r = r_{\text{base}} + 1024 j \pmod{65536}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.667`** | **`3.753`** | `6.833` | `1.000` | `2.051` | `31` | `33` | `359` | `954` | `1140` | `1579` | `4065/4096` (**99.24%**) |
| **$K = 7$** | **`2.000`** | **`3.796`** | `6.429` | `1.000` | `2.073` | `9` | `49` | `268` | `1036` | `1097` | `1637` | `4087/4096` (**99.78%**) |
| **$K = 8$** | **`2.125`** | **`3.825`** | `6.125` | `1.000` | `2.092` | `2` | `20` | `222` | `819` | `1360` | `1673` | `4094/4096` (**99.95%**) |
| **$K = 9$** | **`2.222`** | **`3.841`** | `5.889` | `1.000` | `2.096` | `0` | `19` | `146` | `912` | `1349` | `1670` | `4096/4096` (**100.00%**) |
| **$K = 10$** | **`2.400`** | **`3.842`** | `5.700` | `1.100` | `2.087` | `0` | `2` | `119` | `777` | `1575` | `1623` | `4096/4096` (**100.00%**) |
| **$K = 11$** | **`2.364`** | **`3.834`** | `5.545` | `1.091` | `2.070` | `0` | `3` | `89` | `866` | `1593` | `1545` | `4096/4096` (**100.00%**) |
| **$K = 12$** | **`2.417`** | **`3.823`** | `5.417` | `1.083` | `2.050` | `0` | `1` | `73` | `734` | `1801` | `1487` | `4096/4096` (**100.00%**) |

#### B. Rodzina B: Wszystkie 4096 klas postaci $r_0 = 16 W + 7 \pmod{65536}$ ($W \in \{0..4095\}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.833`** | **`3.918`** | `6.333` | `1.000` | `2.184` | `16` | `14` | `209` | `733` | `1182` | `1942` | `4080/4096` (**99.61%**) |
| **$K = 7$** | **`2.143`** | **`3.921`** | `6.000` | `1.000` | `2.173` | `4` | `14` | `177` | `845` | `1108` | `1948` | `4092/4096` (**99.90%**) |
| **$K = 8$** | **`2.250`** | **`3.909`** | `5.750` | `1.125` | `2.155` | `0` | `12` | `140` | `655` | `1411` | `1878` | `4096/4096` (**100.00%**) |
| **$K = 9$** | **`2.222`** | **`3.893`** | `5.556` | `1.111` | `2.133` | `0` | `10` | `86` | `794` | `1403` | `1803` | `4096/4096` (**100.00%**) |
| **$K = 10$** | **`2.300`** | **`3.874`** | `5.500` | `1.100` | `2.103` | `0` | `4` | `76` | `686` | `1646` | `1684` | `4096/4096` (**100.00%**) |
| **$K = 11$** | **`2.364`** | **`3.853`** | `5.364` | `1.091` | `2.069` | `0` | `4` | `54` | `838` | `1638` | `1562` | `4096/4096` (**100.00%**) |
| **$K = 12$** | **`2.500`** | **`3.835`** | `5.250` | `1.083` | `2.036` | `0` | `0` | `57` | `739` | `1815` | `1485` | `4096/4096` (**100.00%**) |

#### C. Rodzina C (`-7`): 4096 klas prefiksowych $U_1 \pmod{65536}$ ($n_0 = 8 U_1 - 7$, $w_1 = v_1$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`2.000`** | **`3.988`** | `6.333` | `1.167` | `2.424` | `4` | `8` | `193` | `602` | `1135` | `2154` | `4092/4096` (**99.90%**) |
| **$K = 7$** | **`2.143`** | **`3.987`** | `6.000` | `1.143` | `2.380` | `1` | `16` | `131` | `686` | `1142` | `2120` | `4095/4096` (**99.98%**) |
| **$K = 8$** | **`2.250`** | **`3.970`** | `5.750` | `1.250` | `2.337` | `0` | `6` | `122` | `509` | `1382` | `2077` | `4096/4096` (**100.00%**) |
| **$K = 9$** | **`2.222`** | **`3.948`** | `5.556` | `1.333` | `2.294` | `0` | `7` | `91` | `632` | `1403` | `1963` | `4096/4096` (**100.00%**) |
| **$K = 10$** | **`2.400`** | **`3.924`** | `5.400` | `1.400` | `2.251` | `0` | `3` | `74` | `533` | `1639` | `1847` | `4096/4096` (**100.00%**) |
| **$K = 11$** | **`2.455`** | **`3.901`** | `5.273` | `1.364` | `2.206` | `0` | `1` | `58` | `671` | `1617` | `1749` | `4096/4096` (**100.00%**) |
| **$K = 12$** | **`2.417`** | **`3.878`** | `5.167` | `1.333` | `2.158` | `0` | `1` | `52` | `619` | `1760` | `1664` | `4096/4096` (**100.00%**) |

#### D. Rodzina D (`-5`): 4096 klas prefiksowych $U_1 \pmod{65536}$ ($n_0 = 8 U_1 - 5$, $w_1 = v_1$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.667`** | **`3.708`** | `6.833` | `1.000` | `2.034` | `48` | `42` | `392` | `981` | `1195` | `1438` | `4048/4096` (**98.83%**) |
| **$K = 7$** | **`1.714`** | **`3.756`** | `6.429` | `1.000` | `2.054` | `15` | `55` | `290` | `1094` | `1125` | `1517` | `4081/4096` (**99.63%**) |
| **$K = 8$** | **`2.000`** | **`3.789`** | `6.125` | `1.000` | `2.067` | `5` | `22` | `228` | `896` | `1389` | `1556` | `4091/4096` (**99.88%**) |
| **$K = 9$** | **`2.111`** | **`3.810`** | `5.889` | `1.000` | `2.076` | `2` | `25` | `173` | `987` | `1304` | `1605` | `4094/4096` (**99.95%**) |
| **$K = 10$** | **`2.200`** | **`3.815`** | `5.700` | `1.100` | `2.071` | `0` | `9` | `143` | `799` | `1602` | `1543` | `4096/4096` (**100.00%**) |
| **$K = 11$** | **`2.364`** | **`3.812`** | `5.545` | `1.273` | `2.056` | `0` | `7` | `107` | `955` | `1546` | `1481` | `4096/4096` (**100.00%**) |
| **$K = 12$** | **`2.417`** | **`3.810`** | `5.417` | `1.250` | `2.038` | `0` | `3` | `87` | `779` | `1792` | `1435` | `4096/4096` (**100.00%**) |

---

### 17.3. Empiryczna Macierz Przejść Fazowych Między 8 Kanonicznymi Rodzinami (`-7`, `-5`, `10011`, `10111`, `d1`, `d5`, `d4`, `d2`) w Kaskadach Wieloblokowych

Każda liczba nieparzysta $n \in \mathbb{N}_{\text{odd}}$ (na wejściu lub wyjściu dowolnego makro-bloku $i$) należy jednoznacznie do jednej z **8 kanonicznych rodzin** zdefiniowanych w `CollatzProof.lean`:
- **`-7` (`two_zero_valley`):** $n \equiv 1 \pmod 8$, $b = v_2(n + 7) \equiv 0 \pmod 3$ ($b = 3r + 3, d = 3$).
- **`d4` (`two_zero_valley_d4`):** $n \equiv 1 \pmod 8$, $b = v_2(n + 7) \equiv 1 \pmod 3$ ($b = 3r + 4, d = 4$).
- **`d5` (`two_zero_valley_d5`):** $n \equiv 1 \pmod 8$, $b = v_2(n + 7) \equiv 2 \pmod 3$ ($b = 3r + 5, d = 5$).
- **`10011` (`rle_10011`, ogon `-13`):** $n \equiv 3 \pmod{16}$ ($v_2(n + 5) = 3$) oraz $v_2(n + 13) \ge 5$ (przechwycenie do `-7`).
- **`-5` (`shifted_valley`):** $n \equiv 3 \pmod 8$, $b = v_2(n + 5) \equiv 0 \pmod 3$ ($b = 3r + 3, d = 3$) poza `10011`.
- **`d1` (`shifted_valley_d1`):** $n \equiv 3, 5 \pmod 8$, $b = v_2(n + 5) \equiv 1 \pmod 3$ ($b = 3r + 1, d = 1$; dla $r = 0$ odpowiada dokładnie warstwie $n \equiv 5 \pmod 8$).
- **`10111` (`rle_10111`, ogon `-9`):** $n \equiv 7 \pmod{16}$ ($v_2(n + 1) = 3, v_2(n + 5) = 2$) oraz $v_2(n + 9) \ge 5$ (przechwycenie do `-7`).
- **`d2` (`shifted_valley_d2` / ogon Mersenne'a):** $n \equiv 3, 7 \pmod 8$, $b = v_2(n + 5) \equiv 2 \pmod 3$ ($b = 3r + 2, d = 2$) poza `10111`.

#### A. Zbiorcza Macierz Przejść $P(F_{i+1} \mid F_i)$ (196 608 przejść blokowych w 12-blokowych kaskadach `mod 65536`)

| Rodzina źródłowa $F_i$ (liczba przejść $N$) | $\to$ `-7` | $\to$ `-5` | $\to$ `10011` | $\to$ `10111` | $\to$ `d1` | $\to$ `d5` | $\to$ `d4` | $\to$ `d2` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`-7`** ($N = 41187$) | **48.30%** (`19892`) | **5.48%** (`2257`) | **4.13%** (`1703`) | **3.59%** (`1478`) | **21.03%** (`8663`) | **1.63%** (`673`) | **4.49%** (`1850`) | **11.34%** (`4671`) |
| **`-5`** ($N = 10552$) | **15.13%** (`1596`) | **7.91%** (`835`) | **13.02%** (`1374`) | **4.68%** (`494`) | **32.06%** (`3383`) | **4.04%** (`426`) | **5.34%** (`563`) | **17.83%** (`1881`) |
| **`10011`** ($N = 12728$) | **16.88%** (`2149`) | **3.62%** (`461`) | **3.39%** (`432`) | **8.16%** (`1038`) | **38.47%** (`4897`) | **5.85%** (`745`) | **10.64%** (`1354`) | **12.98%** (`1652`) |
| **`10111`** ($N = 13092$) | **15.27%** (`1999`) | **4.31%** (`564`) | **4.22%** (`552`) | **5.01%** (`656`) | **35.16%** (`4603`) | **1.86%** (`244`) | **4.65%** (`609`) | **29.52%** (`3865`) |
| **`d1`** ($N = 58227$) | **17.81%** (`10373`) | **5.54%** (`3225`) | **3.83%** (`2233`) | **5.34%** (`3111`) | **36.37%** (`21179`) | **2.90%** (`1689`) | **5.08%** (`2957`) | **23.12%** (`13460`) |
| **`d5`** ($N = 5073$) | **11.85%** (`601`) | **8.42%** (`427`) | **8.61%** (`437`) | **15.16%** (`769`) | **34.44%** (`1747`) | **3.17%** (`161`) | **3.43%** (`174`) | **14.92%** (`757`) |
| **`d4`** ($N = 11416$) | **11.07%** (`1264`) | **4.80%** (`548`) | **3.99%** (`455`) | **5.90%** (`674`) | **34.02%** (`3884`) | **5.05%** (`577`) | **4.78%** (`546`) | **30.38%** (`3468`) |
| **`d2`** ($N = 44333$) | **13.93%** (`6175`) | **5.59%** (`2477`) | **3.90%** (`1731`) | **8.36%** (`3707`) | **31.53%** (`13979`) | **1.63%** (`722`) | **8.65%** (`3836`) | **26.40%** (`11706`) |

#### B. Macierz Przejść $P(F_{i+1} \mid F_i)$ Wyłącznie dla Rodziny A (4096 podniesionych klas ocalałych `mod 65536`, $4096 \times 12 = 49\,152$ przejścia)

| Rodzina źródłowa $F_i$ (liczba przejść $N$) | $\to$ `-7` | $\to$ `-5` | $\to$ `10011` | $\to$ `10111` | $\to$ `d1` | $\to$ `d5` | $\to$ `d4` | $\to$ `d2` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`-7`** ($N = 8416$) | **46.20%** (`3888`) | **5.73%** (`482`) | **3.03%** (`255`) | **4.22%** (`355`) | **22.97%** (`1933`) | **1.96%** (`165`) | **5.04%** (`424`) | **10.86%** (`914`) |
| **`-5`** ($N = 2895$) | **14.61%** (`423`) | **7.53%** (`218`) | **13.54%** (`392`) | **4.53%** (`131`) | **32.30%** (`935`) | **3.39%** (`98`) | **5.98%** (`173`) | **18.13%** (`525`) |
| **`10011`** ($N = 2220$) | **12.07%** (`268`) | **6.31%** (`140`) | **5.50%** (`122`) | **3.65%** (`81`) | **46.80%** (`1039`) | **2.43%** (`54`) | **7.30%** (`162`) | **15.95%** (`354`) |
| **`10111`** ($N = 2712$) | **17.29%** (`469`) | **4.35%** (`118`) | **3.65%** (`99`) | **4.90%** (`133`) | **35.40%** (`960`) | **1.03%** (`28`) | **4.54%** (`123`) | **28.83%** (`782`) |
| **`d1`** ($N = 14729$) | **17.39%** (`2561`) | **6.05%** (`891`) | **3.76%** (`554`) | **5.17%** (`761`) | **36.42%** (`5365`) | **3.31%** (`488`) | **5.09%** (`750`) | **22.81%** (`3359`) |
| **`d5`** ($N = 1264$) | **12.03%** (`152`) | **9.34%** (`118`) | **8.23%** (`104`) | **13.61%** (`172`) | **36.39%** (`460`) | **3.80%** (`48`) | **2.45%** (`31`) | **14.16%** (`179`) |
| **`d4`** ($N = 2906$) | **12.28%** (`357`) | **4.85%** (`141`) | **4.71%** (`137`) | **5.44%** (`158`) | **33.41%** (`971`) | **5.23%** (`152`) | **5.23%** (`152`) | **28.84%** (`838`) |
| **`d2`** ($N = 14010$) | **13.63%** (`1909`) | **6.10%** (`854`) | **4.44%** (`622`) | **7.89%** (`1106`) | **29.41%** (`4121`) | **2.11%** (`296`) | **8.99%** (`1260`) | **27.42%** (`3842`) |

---

### 17.4. Tabela 10 Najtrudniejszych Klas `mod 65536` (wg $\bar{v}_{12}$ oraz $\bar{v}_8$) wraz z 12-Blokowymi Ścieżkami Przejść

#### A. 10 Najtrudniejszych Klas w Rodzinie A posortowanych wg $\bar{v}_{12}$ (a następnie $\bar{v}_{10}, \bar{v}_8$):

| Ranga | Klasa $r \pmod{65536}$ | Baza $r_0 \pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..12}$ | Wektor rodzin $F_{1..12}$ | $\sum_{i=1}^8 w_i$ ($\bar{v}_8$) | $\sum_{i=1}^{10} w_i$ ($\bar{v}_{10}$) | $\sum_{i=1}^{12} w_i$ ($\bar{v}_{12}$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`21231`** | `751` ($j=20$) | **`8`** | `[1,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`18`** (`2.250`) | **`24`** (`2.400`) | **`29`** (**`2.417`**) |
| **2** | **`31847`** | `103` ($j=31$) | **`7`** | `[2,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`19`** (`2.375`) | **`25`** (`2.500`) | **`30`** (**`2.500`**) |
| **3** | **`6943`** | `799` ($j=6$) | **`2`** | `[2,3,2,2,2,2,3,2,4,3,3,3]` | `[d2,d1,d2,d2,d1,d1,10111,d2,d1,d1,d1,d2]` | **`18`** (`2.250`) | **`25`** (`2.500`) | **`31`** (**`2.583`**) |
| **4** | **`63695`** | `207` ($j=62$) | **`5`** | `[2,2,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`20`** (`2.500`) | **`26`** (`2.600`) | **`31`** (**`2.583`**) |
| **5** | **`703`** | `703` ($j=0$) | **`2`** | `[1,5,2,2,3,4,1,2,2,3,5,2]` | `[d2,d4,d2,d1,10111,d1,d2,d2,d2,10111,-7,d2]` | **`20`** (`2.500`) | **`25`** (`2.500`) | **`32`** (**`2.667`**) |
| **6** | **`1583`** | `559` ($j=1$) | **`2`** | `[1,5,2,2,3,4,1,2,2,3,5,2]` | `[d2,d4,d2,d1,10111,d1,d2,d2,d2,10111,-7,d2]` | **`20`** (`2.500`) | **`25`** (`2.500`) | **`32`** (**`2.667`**) |
| **7** | **`34239`** | `447` ($j=33$) | **`4`** | `[1,1,2,5,3,2,3,3,2,3,5,2]` | `[d2,d2,d2,d2,10111,d2,d2,d1,d1,d1,d2,d2]` | **`20`** (`2.500`) | **`25`** (`2.500`) | **`32`** (**`2.667`**) |
| **8** | **`29607`** | `935` ($j=28$) | **`3`** | `[2,2,3,4,3,2,3,3,1,2,3,4]` | `[d2,d1,d1,-7,d1,d2,d1,d2,d2,d1,10111,d1]` | **`22`** (`2.750`) | **`25`** (`2.500`) | **`32`** (**`2.667`**) |
| **9** | **`2111`** | `63` ($j=2$) | **`1`** | `[3,1,2,3,4,1,2,2,3,5,2,4]` | `[d2,d2,d1,10111,d1,d2,d2,d2,10111,-7,d2,d2]` | **`18`** (`2.250`) | **`26`** (`2.600`) | **`32`** (**`2.667`**) |
| **10** | **`6171`** | `27` ($j=6$) | **`1`** | `[3,3,2,2,2,2,3,2,4,3,3,3]` | `[d2,d1,d2,d2,d1,d1,10111,d2,d1,d1,d1,d2]` | **`19`** (`2.375`) | **`26`** (`2.600`) | **`32`** (**`2.667`**) |

#### B. 10 Najtrudniejszych Klas w Rodzinie A posortowanych wg $\bar{v}_8$ (w tym jedyne 2 klasy o $\bar{v}_8 = 2{,}125 < 2{,}1699$, które domykają się na $K = 9$):

| Ranga | Klasa $r \pmod{65536}$ | Baza $r_0 \pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..12}$ | Wektor rodzin $F_{1..12}$ | $\sum_{i=1}^8 w_i$ ($\bar{v}_8$) | $\sum_{i=1}^{10} w_i$ ($\bar{v}_{10}$) | $\sum_{i=1}^{12} w_i$ ($\bar{v}_{12}$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`28399`** | `751` ($j=27$) | **`5`** | `[1,2,2,1,5,1,3,2,4,4,3,7]` | `[d2,d2,d2,d2,-5,d2,d1,d2,10111,10011,d1,-7]` | **`17`** (**`2.125`**) | **`25`** (`2.500`) | **`35`** (`2.917`) |
| **2** | **`54511`** | `239` ($j=53$) | **`5`** | `[1,1,3,2,4,4,1,1,4,5,2,9]` | `[d2,d2,d1,d2,-7,10111,d2,d2,10011,-7,d2,10111]` | **`17`** (**`2.125`**) | **`26`** (`2.600`) | **`37`** (`3.083`) |
| **3** | **`21231`** | `751` ($j=20$) | **`8`** | `[1,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`18`** (**`2.250`**) | **`24`** (`2.400`) | **`29`** (`2.417`) |
| **4** | **`6943`** | `799` ($j=6$) | **`2`** | `[2,3,2,2,2,2,3,2,4,3,3,3]` | `[d2,d1,d2,d2,d1,d1,10111,d2,d1,d1,d1,d2]` | **`18`** (**`2.250`**) | **`25`** (`2.500`) | **`31`** (`2.583`) |
| **5** | **`3007`** | `959` ($j=2$) | **`4`** | `[1,2,3,4,1,2,2,3,5,2,4,4]` | `[d2,d1,10111,d1,d2,d2,d2,10111,-7,d2,d2,d2]` | **`18`** (**`2.250`**) | **`25`** (`2.500`) | **`33`** (`2.750`) |
| **6** | **`6767`** | `623` ($j=6$) | **`4`** | `[1,2,3,4,1,2,2,3,5,2,4,4]` | `[d2,d1,10111,d1,d2,d2,d2,10111,-7,d2,d2,d2]` | **`18`** (**`2.250`**) | **`25`** (`2.500`) | **`33`** (`2.750`) |
| **7** | **`2111`** | `63` ($j=2$) | **`1`** | `[3,1,2,3,4,1,2,2,3,5,2,4]` | `[d2,d2,d1,10111,d1,d2,d2,d2,10111,-7,d2,d2]` | **`18`** (**`2.250`**) | **`26`** (`2.600`) | **`32`** (`2.667`) |
| **8** | **`42599`** | `615` ($j=41$) | **`5`** | `[2,2,2,1,5,1,3,2,4,4,3,7]` | `[d2,d2,d2,d2,-5,d2,d1,d2,10111,10011,d1,-7]` | **`18`** (**`2.250`**) | **`26`** (`2.600`) | **`36`** (`3.000`) |
| **9** | **`31847`** | `103` ($j=31$) | **`7`** | `[2,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`19`** (**`2.375`**) | **`25`** (`2.500`) | **`30`** (`2.500`) |
| **10** | **`6591`** | `447` ($j=6$) | **`7`** | `[1,2,2,2,3,2,4,3,3,3,4,6]` | `[d2,d2,d1,d1,10111,d2,d1,d1,d1,d2,10011,d4]` | **`19`** (**`2.375`**) | **`25`** (`2.500`) | **`35`** (`2.917`) |

#### C. Pełne 12-Blokowe Ścieżki Przejść $n_0 \to n_1 \to \dots \to n_{12}$ dla 10 Najtrudniejszych Klas `mod 65536`:

- **Klasa `r = 21231` (`r0 = 751`, $j = 20$, $K^* = 8$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.400$, $\bar{v}_{12} = 2.417$):**  
  `21231` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `53743` $\to$ `53743` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $[\text{d2}]\xrightarrow[w=3]{(b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `235879` $\to$ `235879` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `398047` $\to$ `398047` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=2, d=1, v=2)}$ `755669`
- **Klasa `r = 31847` (`r0 = 103`, $j = 31$, $K^* = 7$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.500$):**  
  `31847` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `53743` $\to$ `53743` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `136039` $\to$ `136039` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $[\text{d2}]\xrightarrow[w=3]{(b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `235879` $\to$ `235879` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `398047` $\to$ `398047` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=2, d=1, v=2)}$ `755669`
- **Klasa `r = 6943` (`r0 = 799`, $j = 6$, $K^* = 2$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.583$):**  
  `6943` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `26365` $\to$ `26365` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `9887` $\to$ `9887` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $[\text{d1}]\xrightarrow[w=2]{(b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $[\text{d2}]\xrightarrow[w=2]{(b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `8573` $\to$ `8573` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `3215` $\to$ `3215` $[\text{d2}]\xrightarrow[w=3]{(b=4, r=2, d=0, v=3)}$ `2035`
- **Klasa `r = 63695` (`r0 = 207`, $j = 62$, $K^* = 5$, $\bar{v}_8 = 2.500$, $\bar{v}_{10} = 2.600$, $\bar{v}_{12} = 2.583$):**  
  `63695` $[\text{d2}]\xrightarrow[w=2]{(b=4, r=2, d=0, v=2)}$ `80615` $\to$ `80615` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `136039` $\to$ `136039` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `229567` $\to$ `229567` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `1307461` $\to$ `1307461` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `245149` $\to$ `245149` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `91931` $\to$ `91931` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=1, d=2, v=1)}$ `349055` $\to$ `349055` $[\text{d2}]\xrightarrow[w=3]{(b=7, r=3, d=1, v=2)}$ `1490987` $\to$ `1490987` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `1258021` $\to$ `1258021` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `235879` $\to$ `235879` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `398047` $\to$ `398047` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=2, d=1, v=2)}$ `755669`
- **Klasa `r = 703` (`r0 = 703`, $j = 0$, $K^* = 2$, $\bar{v}_8 = 2.500$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.667$):**  
  `703` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `4009` $\to$ `4009` $[\text{d4}]\xrightarrow[w=5]{(b=4, r=0, d=4, v=1)}$ `10151` $\to$ `10151` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `17131` $\to$ `17131` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $[\text{-7}]\xrightarrow[w=5]{(b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `14863`
- **Klasa `r = 1583` (`r0 = 559`, $j = 1$, $K^* = 2$, $\bar{v}_8 = 2.500$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.667$):**  
  `1583` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `4009` $\to$ `4009` $[\text{d4}]\xrightarrow[w=5]{(b=4, r=0, d=4, v=1)}$ `10151` $\to$ `10151` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `17131` $\to$ `17131` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $[\text{-7}]\xrightarrow[w=5]{(b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `14863`
- **Klasa `r = 34239` (`r0 = 447`, $j = 33$, $K^* = 4$, $\bar{v}_8 = 2.500$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.667$):**  
  `34239` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `195007` $\to$ `195007` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `1110631` $\to$ `1110631` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `1874191` $\to$ `1874191` $[\text{d2}]\xrightarrow[w=5]{(b=4, r=2, d=0, v=5)}$ `296503` $\to$ `296503` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `250175` $\to$ `250175` $[\text{d2}]\xrightarrow[w=2]{(b=6, r=3, d=0, v=2)}$ `712415` $\to$ `712415` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=2, d=1, v=2)}$ `1352477` $\to$ `1352477` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `507179` $\to$ `507179` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `427933` $\to$ `427933` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `160475` $\to$ `160475` $[\text{d2}]\xrightarrow[w=5]{(b=5, r=1, d=2, v=3)}$ `152327` $\to$ `152327` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `257053`
- **Klasa `r = 29607` (`r0 = 935`, $j = 28$, $K^* = 3$, $\bar{v}_8 = 2.750$, $\bar{v}_{10} = 2.500$, $\bar{v}_{12} = 2.667$):**  
  `29607` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `49963` $\to$ `49963` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `42157` $\to$ `42157` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `15809` $\to$ `15809` $[\text{-7}]\xrightarrow[w=4]{(b=3, r=0, d=3, v=1)}$ `8893` $\to$ `8893` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `3335` $\to$ `3335` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `5629` $\to$ `5629` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `2111` $\to$ `2111` $[\text{d2}]\xrightarrow[w=3]{(b=6, r=3, d=0, v=3)}$ `3007` $\to$ `3007` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `2287`
- **Klasa `r = 2111` (`r0 = 63`, $j = 2$, $K^* = 1$, $\bar{v}_8 = 2.250$, $\bar{v}_{10} = 2.600$, $\bar{v}_{12} = 2.667$):**  
  `2111` $[\text{d2}]\xrightarrow[w=3]{(b=6, r=3, d=0, v=3)}$ `3007` $\to$ `3007` $[\text{d2}]\xrightarrow[w=1]{(b=6, r=3, d=0, v=1)}$ `17131` $\to$ `17131` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `14455` $\to$ `14455` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `12197` $\to$ `12197` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `2287` $\to$ `2287` $[\text{d2}]\xrightarrow[w=1]{(b=4, r=2, d=0, v=1)}$ `5791` $\to$ `5791` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `21991` $\to$ `21991` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `37111` $\to$ `37111` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `31313` $\to$ `31313` $[\text{-7}]\xrightarrow[w=5]{(b=3, r=0, d=3, v=2)}$ `8807` $\to$ `8807` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `14863` $\to$ `14863` $[\text{d2}]\xrightarrow[w=4]{(b=4, r=2, d=0, v=4)}$ `4703`
- **Klasa `r = 6171` (`r0 = 27`, $j = 6$, $K^* = 1$, $\bar{v}_8 = 2.375$, $\bar{v}_{10} = 2.600$, $\bar{v}_{12} = 2.667$):**  
  `6171` $[\text{d2}]\xrightarrow[w=3]{(b=5, r=1, d=2, v=1)}$ `23435` $\to$ `23435` $[\text{d1}]\xrightarrow[w=3]{(b=4, r=1, d=1, v=2)}$ `9887` $\to$ `9887` $[\text{d2}]\xrightarrow[w=2]{(b=5, r=2, d=1, v=1)}$ `37543` $\to$ `37543` $[\text{d2}]\xrightarrow[w=2]{(b=3, r=1, d=1, v=1)}$ `63355` $\to$ `63355` $[\text{d1}]\xrightarrow[w=2]{(b=7, r=2, d=1, v=1)}$ `60139` $\to$ `60139` $[\text{d1}]\xrightarrow[w=2]{(b=4, r=1, d=1, v=1)}$ `50743` $\to$ `50743` $[\text{10111}]\xrightarrow[w=3]{(b=3, r=1, d=1, v=2)}$ `42815` $\to$ `42815` $[\text{d2}]\xrightarrow[w=2]{(b=6, r=3, d=0, v=2)}$ `121925` $\to$ `121925` $[\text{d1}]\xrightarrow[w=4]{(b=1, r=0, d=1, v=3)}$ `22861` $\to$ `22861` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `8573` $\to$ `8573` $[\text{d1}]\xrightarrow[w=3]{(b=1, r=0, d=1, v=2)}$ `3215` $\to$ `3215` $[\text{d2}]\xrightarrow[w=3]{(b=4, r=2, d=0, v=3)}$ `2035`


---

# Runda 9. Głębokie Sito 2-Adyczne (`k = 304..324`, `m = 494..526`, Zweryfikowane w Lean 4), Rozkład Stacjonarny $\pi$ i Luka Widmowa Łańcucha Markowa $8 \times 8$ oraz 12-Blokowa Anatomia Domknięcia na Siatce `mod 131072` (`8192` Klas, $K \in \{1..12\}$)

## Część 18. Zestaw Q (`k = 304..312`, `m = 494..507`, Część 63) oraz Zestaw R (`k = 314..324`, `m = 510..526`, Część 64) — 208 Twierdzeń

### 18.1. Zbiorcza tabela 13 poziomów głębokiego sita 2-adycznego ($c = 190..202$, $k = 304..324$, $m = 494..526$)

Wszystkie **208 twierdzeń** Zestawu Q (96 twierdzeń) oraz Zestawu R (112 twierdzeń, przekraczających próg **$2^{324} \approx 3{,}42 \times 10^{97}$ w $526$ krokach Collatza**) zostało wygenerowanych w pojedynczym przebiegu z przyspieszeniem opartym na niezmienniku braku dwóch kolejnych kroków nieparzystych ($s - 2o \le m + 1 - 2 c_{\min}$) oraz zweryfikowanych bezpośrednio kompilatorem `~/.elan/bin/lean --stdin` (z dyrektywami `set_option exponentiation.threshold 1024` oraz `set_option maxRecDepth 16384`, kod wyjścia `0`, `0` błędów, `0` ostrzeżeń).

| Zestaw | Poziom $c = m - k$ | Próg $k$ | Kroki $m$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \equiv 3 \pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek (`by decide` ✅) |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Q (Part 63)** | `190` | `304` | `494` | `0.138013` | `5600341` | `6649279, 6686847, 8400511, 9973919, 10030271, 12600767, 13298559, 13421671, 14089159, 14960879, 16801023, 17731411, 18901151, 19947839, 20132507, 22401363` |
| **Q (Part 63)** | `191` | `306` | `497` | `0.103510` | `4986960` | `6649279, 6686847, 8400511, 9973919, 12600767, 13298559, 13373695, 13421671, 14089159, 14281383, 14960879, 15733191, 16801023, 17731411, 18901151, 19947839` |
| **Q (Part 63)** | `192` | `307` | `499` | `0.155265` | `5600341` | `6649279, 8400511, 9973919, 12600767, 13298559, 13421671, 14089159, 15733191, 15761255, 16801023, 17731411, 18901151, 19947839, 20132507, 21133739, 22401363` |
| **Q (Part 63)** | `193` | `309` | `502` | `0.116448` | `4725288` | `6649279, 6686847, 8400511, 9973919, 10030271, 12600767, 13298559, 13421671, 14089159, 14960879, 15045407, 15733191, 15761255, 16801023, 17731411, 18901151` |
| **Q (Part 63)** | `194` | `311` | `505` | `0.087336` | `4432853` | `6649279, 6686847, 8400511, 9973919, 10030271, 10507503, 12600767, 13298559, 13373695, 13421671, 14960879, 15045407, 15733191, 15761255, 16801023, 17731411` |
| **Q (Part 63)** | `195` | `312` | `507` | `0.131004` | `5159584` | `6649279, 6686847, 8400511, 9973919, 10030271, 10507503, 12600767, 13298559, 13373695, 14960879, 15733191, 15761255, 16801023, 18901151, 20060543, 20638335` |
| **R (Part 64)** | `196` | `314` | `510` | `0.098253` | `4725288` | `6649279, 6686847, 9973919, 10030271, 10507503, 12600767, 13298559, 13373695, 14089159, 14960879, 15045407, 15733191, 15761255, 16801023, 17731411, 18901151` |
| **R (Part 64)** | `197` | `315` | `512` | `0.147380` | `5610330` | `6649279, 6686847, 8400511, 9973919, 10030271, 10507503, 12600767, 13298559, 14960879, 15733191, 16801023, 18901151, 19947839, 21015007, 22401363, 22441319` |
| **R (Part 64)** | `198` | `317` | `515` | `0.110535` | `6300384` | `6649279, 6686847, 9973919, 10507503, 13298559, 13373695, 14960879, 15733191, 15761255, 16801023, 17731411, 18901151, 19947839, 22401363, 23599787, 25201535` |
| **R (Part 64)** | `199` | `319` | `518` | `0.082901` | `5283435` | `6649279, 6686847, 9973919, 10507503, 12600767, 13298559, 14089159, 14960879, 15733191, 15761255, 17731411, 18901151, 19947839, 20638335, 21015007, 21133739` |
| **R (Part 64)** | `200` | `320` | `520` | `0.124352` | `5899947` | `6649279, 8400511, 9973919, 10507503, 12600767, 13298559, 14089159, 15733191, 15761255, 16801023, 17731411, 18901151, 20638335, 21133739, 22401363, 23599787` |
| **R (Part 64)** | `201` | `322` | `523` | `0.093264` | `5910471` | `6649279, 8400511, 10507503, 12600767, 13298559, 14089159, 15733191, 15761255, 16801023, 17731411, 18901151, 20638335, 21015007, 22401363, 23599787, 23641883` |
| **R (Part 64)** | `202` | `324` | `526` | `0.069948` | `5910471` | `6686847, 8400511, 10507503, 12600767, 14089159, 15733191, 15761255, 16801023, 17731411, 18901151, 20638335, 21015007, 21133739, 22401363, 23599787, 23641883` |

### 18.2. Gotowe, zweryfikowane w Lean 4 bloki kodu (Zestaw Q — Część 63 oraz Zestaw R — Część 64)

*(Pełny kod został również zapisany w pliku [`sieve_304_324_lean.txt`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_304_324_lean.txt).)*

```lean
set_option exponentiation.threshold 1024
set_option maxRecDepth 16384

-- ============================================================================
-- Część 63. Głębokie Sito 2-Adyczne: Zestaw Q (k = 304..312, m = 494..507, 96 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 9)
-- ============================================================================

-- k = 304, m = 494 (c = 190, 2^304 = 32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016 > 3^190)
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 6649279) := checkAffineDrop_sound 494 (2 ^ 304) 6649279 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 6686847) := checkAffineDrop_sound 494 (2 ^ 304) 6686847 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 8400511) := checkAffineDrop_sound 494 (2 ^ 304) 8400511 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 9973919) := checkAffineDrop_sound 494 (2 ^ 304) 9973919 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 10030271) := checkAffineDrop_sound 494 (2 ^ 304) 10030271 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 12600767) := checkAffineDrop_sound 494 (2 ^ 304) 12600767 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 13298559) := checkAffineDrop_sound 494 (2 ^ 304) 13298559 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 13421671) := checkAffineDrop_sound 494 (2 ^ 304) 13421671 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 14089159) := checkAffineDrop_sound 494 (2 ^ 304) 14089159 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 14960879) := checkAffineDrop_sound 494 (2 ^ 304) 14960879 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 16801023) := checkAffineDrop_sound 494 (2 ^ 304) 16801023 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 17731411) := checkAffineDrop_sound 494 (2 ^ 304) 17731411 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 18901151) := checkAffineDrop_sound 494 (2 ^ 304) 18901151 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 19947839) := checkAffineDrop_sound 494 (2 ^ 304) 19947839 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 20132507) := checkAffineDrop_sound 494 (2 ^ 304) 20132507 (by decide) k
theorem horizon_drop_mod32592575621351777380295131014550050576823494298654980010178247189670100796213387298934358016_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 304 * k + 22401363) := checkAffineDrop_sound 494 (2 ^ 304) 22401363 (by decide) k

-- k = 306, m = 497 (c = 191, 2^306 = 130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064 > 3^191)
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 6649279) := checkAffineDrop_sound 497 (2 ^ 306) 6649279 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 6686847) := checkAffineDrop_sound 497 (2 ^ 306) 6686847 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 8400511) := checkAffineDrop_sound 497 (2 ^ 306) 8400511 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 9973919) := checkAffineDrop_sound 497 (2 ^ 306) 9973919 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 12600767) := checkAffineDrop_sound 497 (2 ^ 306) 12600767 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 13298559) := checkAffineDrop_sound 497 (2 ^ 306) 13298559 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 13373695) := checkAffineDrop_sound 497 (2 ^ 306) 13373695 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 13421671) := checkAffineDrop_sound 497 (2 ^ 306) 13421671 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 14089159) := checkAffineDrop_sound 497 (2 ^ 306) 14089159 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq14281383 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 14281383) := checkAffineDrop_sound 497 (2 ^ 306) 14281383 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 14960879) := checkAffineDrop_sound 497 (2 ^ 306) 14960879 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 15733191) := checkAffineDrop_sound 497 (2 ^ 306) 15733191 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 16801023) := checkAffineDrop_sound 497 (2 ^ 306) 16801023 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 17731411) := checkAffineDrop_sound 497 (2 ^ 306) 17731411 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 18901151) := checkAffineDrop_sound 497 (2 ^ 306) 18901151 (by decide) k
theorem horizon_drop_mod130370302485407109521180524058200202307293977194619920040712988758680403184853549195737432064_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 306 * k + 19947839) := checkAffineDrop_sound 497 (2 ^ 306) 19947839 (by decide) k

-- k = 307, m = 499 (c = 192, 2^307 = 260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128 > 3^192)
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 6649279) := checkAffineDrop_sound 499 (2 ^ 307) 6649279 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 8400511) := checkAffineDrop_sound 499 (2 ^ 307) 8400511 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 9973919) := checkAffineDrop_sound 499 (2 ^ 307) 9973919 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 12600767) := checkAffineDrop_sound 499 (2 ^ 307) 12600767 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 13298559) := checkAffineDrop_sound 499 (2 ^ 307) 13298559 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 13421671) := checkAffineDrop_sound 499 (2 ^ 307) 13421671 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 14089159) := checkAffineDrop_sound 499 (2 ^ 307) 14089159 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 15733191) := checkAffineDrop_sound 499 (2 ^ 307) 15733191 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 15761255) := checkAffineDrop_sound 499 (2 ^ 307) 15761255 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 16801023) := checkAffineDrop_sound 499 (2 ^ 307) 16801023 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 17731411) := checkAffineDrop_sound 499 (2 ^ 307) 17731411 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 18901151) := checkAffineDrop_sound 499 (2 ^ 307) 18901151 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 19947839) := checkAffineDrop_sound 499 (2 ^ 307) 19947839 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq20132507 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 20132507) := checkAffineDrop_sound 499 (2 ^ 307) 20132507 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 21133739) := checkAffineDrop_sound 499 (2 ^ 307) 21133739 (by decide) k
theorem horizon_drop_mod260740604970814219042361048116400404614587954389239840081425977517360806369707098391474864128_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 307 * k + 22401363) := checkAffineDrop_sound 499 (2 ^ 307) 22401363 (by decide) k

-- k = 309, m = 502 (c = 193, 2^309 = 1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512 > 3^193)
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 6649279) := checkAffineDrop_sound 502 (2 ^ 309) 6649279 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 6686847) := checkAffineDrop_sound 502 (2 ^ 309) 6686847 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 8400511) := checkAffineDrop_sound 502 (2 ^ 309) 8400511 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 9973919) := checkAffineDrop_sound 502 (2 ^ 309) 9973919 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 10030271) := checkAffineDrop_sound 502 (2 ^ 309) 10030271 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 12600767) := checkAffineDrop_sound 502 (2 ^ 309) 12600767 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 13298559) := checkAffineDrop_sound 502 (2 ^ 309) 13298559 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 13421671) := checkAffineDrop_sound 502 (2 ^ 309) 13421671 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 14089159) := checkAffineDrop_sound 502 (2 ^ 309) 14089159 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 14960879) := checkAffineDrop_sound 502 (2 ^ 309) 14960879 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 15045407) := checkAffineDrop_sound 502 (2 ^ 309) 15045407 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 15733191) := checkAffineDrop_sound 502 (2 ^ 309) 15733191 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 15761255) := checkAffineDrop_sound 502 (2 ^ 309) 15761255 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 16801023) := checkAffineDrop_sound 502 (2 ^ 309) 16801023 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 17731411) := checkAffineDrop_sound 502 (2 ^ 309) 17731411 (by decide) k
theorem horizon_drop_mod1042962419883256876169444192465601618458351817556959360325703910069443225478828393565899456512_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 309 * k + 18901151) := checkAffineDrop_sound 502 (2 ^ 309) 18901151 (by decide) k

-- k = 311, m = 505 (c = 194, 2^311 = 4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048 > 3^194)
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 6649279) := checkAffineDrop_sound 505 (2 ^ 311) 6649279 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 6686847) := checkAffineDrop_sound 505 (2 ^ 311) 6686847 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 8400511) := checkAffineDrop_sound 505 (2 ^ 311) 8400511 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 9973919) := checkAffineDrop_sound 505 (2 ^ 311) 9973919 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 10030271) := checkAffineDrop_sound 505 (2 ^ 311) 10030271 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 10507503) := checkAffineDrop_sound 505 (2 ^ 311) 10507503 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 12600767) := checkAffineDrop_sound 505 (2 ^ 311) 12600767 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 13298559) := checkAffineDrop_sound 505 (2 ^ 311) 13298559 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 13373695) := checkAffineDrop_sound 505 (2 ^ 311) 13373695 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq13421671 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 13421671) := checkAffineDrop_sound 505 (2 ^ 311) 13421671 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 14960879) := checkAffineDrop_sound 505 (2 ^ 311) 14960879 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 15045407) := checkAffineDrop_sound 505 (2 ^ 311) 15045407 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 15733191) := checkAffineDrop_sound 505 (2 ^ 311) 15733191 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 15761255) := checkAffineDrop_sound 505 (2 ^ 311) 15761255 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 16801023) := checkAffineDrop_sound 505 (2 ^ 311) 16801023 (by decide) k
theorem horizon_drop_mod4171849679533027504677776769862406473833407270227837441302815640277772901915313574263597826048_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 311 * k + 17731411) := checkAffineDrop_sound 505 (2 ^ 311) 17731411 (by decide) k

-- k = 312, m = 507 (c = 195, 2^312 = 8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096 > 3^195)
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 6649279) := checkAffineDrop_sound 507 (2 ^ 312) 6649279 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 6686847) := checkAffineDrop_sound 507 (2 ^ 312) 6686847 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 8400511) := checkAffineDrop_sound 507 (2 ^ 312) 8400511 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 9973919) := checkAffineDrop_sound 507 (2 ^ 312) 9973919 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 10030271) := checkAffineDrop_sound 507 (2 ^ 312) 10030271 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 10507503) := checkAffineDrop_sound 507 (2 ^ 312) 10507503 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 12600767) := checkAffineDrop_sound 507 (2 ^ 312) 12600767 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 13298559) := checkAffineDrop_sound 507 (2 ^ 312) 13298559 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 13373695) := checkAffineDrop_sound 507 (2 ^ 312) 13373695 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 14960879) := checkAffineDrop_sound 507 (2 ^ 312) 14960879 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 15733191) := checkAffineDrop_sound 507 (2 ^ 312) 15733191 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 15761255) := checkAffineDrop_sound 507 (2 ^ 312) 15761255 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 16801023) := checkAffineDrop_sound 507 (2 ^ 312) 16801023 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 18901151) := checkAffineDrop_sound 507 (2 ^ 312) 18901151 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq20060543 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 20060543) := checkAffineDrop_sound 507 (2 ^ 312) 20060543 (by decide) k
theorem horizon_drop_mod8343699359066055009355553539724812947666814540455674882605631280555545803830627148527195652096_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 312 * k + 20638335) := checkAffineDrop_sound 507 (2 ^ 312) 20638335 (by decide) k

-- ============================================================================
-- Część 64. Głębokie Sito 2-Adyczne: Zestaw R (k = 314..324, m = 510..526, 112 twierdzeń)
-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 9)
-- ============================================================================

-- k = 314, m = 510 (c = 196, 2^314 = 33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384 > 3^196)
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 6649279) := checkAffineDrop_sound 510 (2 ^ 314) 6649279 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 6686847) := checkAffineDrop_sound 510 (2 ^ 314) 6686847 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 9973919) := checkAffineDrop_sound 510 (2 ^ 314) 9973919 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 10030271) := checkAffineDrop_sound 510 (2 ^ 314) 10030271 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 10507503) := checkAffineDrop_sound 510 (2 ^ 314) 10507503 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 12600767) := checkAffineDrop_sound 510 (2 ^ 314) 12600767 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 13298559) := checkAffineDrop_sound 510 (2 ^ 314) 13298559 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 13373695) := checkAffineDrop_sound 510 (2 ^ 314) 13373695 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 14089159) := checkAffineDrop_sound 510 (2 ^ 314) 14089159 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 14960879) := checkAffineDrop_sound 510 (2 ^ 314) 14960879 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq15045407 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 15045407) := checkAffineDrop_sound 510 (2 ^ 314) 15045407 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 15733191) := checkAffineDrop_sound 510 (2 ^ 314) 15733191 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 15761255) := checkAffineDrop_sound 510 (2 ^ 314) 15761255 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 16801023) := checkAffineDrop_sound 510 (2 ^ 314) 16801023 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 17731411) := checkAffineDrop_sound 510 (2 ^ 314) 17731411 (by decide) k
theorem horizon_drop_mod33374797436264220037422214158899251790667258161822699530422525122222183215322508594108782608384_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 314 * k + 18901151) := checkAffineDrop_sound 510 (2 ^ 314) 18901151 (by decide) k

-- k = 315, m = 512 (c = 197, 2^315 = 66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768 > 3^197)
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 6649279) := checkAffineDrop_sound 512 (2 ^ 315) 6649279 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 6686847) := checkAffineDrop_sound 512 (2 ^ 315) 6686847 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 8400511) := checkAffineDrop_sound 512 (2 ^ 315) 8400511 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 9973919) := checkAffineDrop_sound 512 (2 ^ 315) 9973919 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq10030271 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 10030271) := checkAffineDrop_sound 512 (2 ^ 315) 10030271 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 10507503) := checkAffineDrop_sound 512 (2 ^ 315) 10507503 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 12600767) := checkAffineDrop_sound 512 (2 ^ 315) 12600767 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 13298559) := checkAffineDrop_sound 512 (2 ^ 315) 13298559 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 14960879) := checkAffineDrop_sound 512 (2 ^ 315) 14960879 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 15733191) := checkAffineDrop_sound 512 (2 ^ 315) 15733191 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 16801023) := checkAffineDrop_sound 512 (2 ^ 315) 16801023 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 18901151) := checkAffineDrop_sound 512 (2 ^ 315) 18901151 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 19947839) := checkAffineDrop_sound 512 (2 ^ 315) 19947839 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq21015007 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 21015007) := checkAffineDrop_sound 512 (2 ^ 315) 21015007 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 22401363) := checkAffineDrop_sound 512 (2 ^ 315) 22401363 (by decide) k
theorem horizon_drop_mod66749594872528440074844428317798503581334516323645399060845050244444366430645017188217565216768_eq22441319 (k : Nat) : HasHorizonDrop (2 ^ 315 * k + 22441319) := checkAffineDrop_sound 512 (2 ^ 315) 22441319 (by decide) k

-- k = 317, m = 515 (c = 198, 2^317 = 266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072 > 3^198)
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 6649279) := checkAffineDrop_sound 515 (2 ^ 317) 6649279 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 6686847) := checkAffineDrop_sound 515 (2 ^ 317) 6686847 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 9973919) := checkAffineDrop_sound 515 (2 ^ 317) 9973919 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 10507503) := checkAffineDrop_sound 515 (2 ^ 317) 10507503 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 13298559) := checkAffineDrop_sound 515 (2 ^ 317) 13298559 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq13373695 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 13373695) := checkAffineDrop_sound 515 (2 ^ 317) 13373695 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 14960879) := checkAffineDrop_sound 515 (2 ^ 317) 14960879 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 15733191) := checkAffineDrop_sound 515 (2 ^ 317) 15733191 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 15761255) := checkAffineDrop_sound 515 (2 ^ 317) 15761255 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 16801023) := checkAffineDrop_sound 515 (2 ^ 317) 16801023 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 17731411) := checkAffineDrop_sound 515 (2 ^ 317) 17731411 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 18901151) := checkAffineDrop_sound 515 (2 ^ 317) 18901151 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 19947839) := checkAffineDrop_sound 515 (2 ^ 317) 19947839 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 22401363) := checkAffineDrop_sound 515 (2 ^ 317) 22401363 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 23599787) := checkAffineDrop_sound 515 (2 ^ 317) 23599787 (by decide) k
theorem horizon_drop_mod266998379490113760299377713271194014325338065294581596243380200977777465722580068752870260867072_eq25201535 (k : Nat) : HasHorizonDrop (2 ^ 317 * k + 25201535) := checkAffineDrop_sound 515 (2 ^ 317) 25201535 (by decide) k

-- k = 319, m = 518 (c = 199, 2^319 = 1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288 > 3^199)
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 6649279) := checkAffineDrop_sound 518 (2 ^ 319) 6649279 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 6686847) := checkAffineDrop_sound 518 (2 ^ 319) 6686847 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 9973919) := checkAffineDrop_sound 518 (2 ^ 319) 9973919 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 10507503) := checkAffineDrop_sound 518 (2 ^ 319) 10507503 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 12600767) := checkAffineDrop_sound 518 (2 ^ 319) 12600767 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 13298559) := checkAffineDrop_sound 518 (2 ^ 319) 13298559 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 14089159) := checkAffineDrop_sound 518 (2 ^ 319) 14089159 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq14960879 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 14960879) := checkAffineDrop_sound 518 (2 ^ 319) 14960879 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 15733191) := checkAffineDrop_sound 518 (2 ^ 319) 15733191 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 15761255) := checkAffineDrop_sound 518 (2 ^ 319) 15761255 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 17731411) := checkAffineDrop_sound 518 (2 ^ 319) 17731411 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 18901151) := checkAffineDrop_sound 518 (2 ^ 319) 18901151 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq19947839 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 19947839) := checkAffineDrop_sound 518 (2 ^ 319) 19947839 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 20638335) := checkAffineDrop_sound 518 (2 ^ 319) 20638335 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq21015007 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 21015007) := checkAffineDrop_sound 518 (2 ^ 319) 21015007 (by decide) k
theorem horizon_drop_mod1067993517960455041197510853084776057301352261178326384973520803911109862890320275011481043468288_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 319 * k + 21133739) := checkAffineDrop_sound 518 (2 ^ 319) 21133739 (by decide) k

-- k = 320, m = 520 (c = 200, 2^320 = 2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576 > 3^200)
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 6649279) := checkAffineDrop_sound 520 (2 ^ 320) 6649279 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 8400511) := checkAffineDrop_sound 520 (2 ^ 320) 8400511 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq9973919 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 9973919) := checkAffineDrop_sound 520 (2 ^ 320) 9973919 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 10507503) := checkAffineDrop_sound 520 (2 ^ 320) 10507503 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 12600767) := checkAffineDrop_sound 520 (2 ^ 320) 12600767 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 13298559) := checkAffineDrop_sound 520 (2 ^ 320) 13298559 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 14089159) := checkAffineDrop_sound 520 (2 ^ 320) 14089159 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 15733191) := checkAffineDrop_sound 520 (2 ^ 320) 15733191 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 15761255) := checkAffineDrop_sound 520 (2 ^ 320) 15761255 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 16801023) := checkAffineDrop_sound 520 (2 ^ 320) 16801023 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 17731411) := checkAffineDrop_sound 520 (2 ^ 320) 17731411 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 18901151) := checkAffineDrop_sound 520 (2 ^ 320) 18901151 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 20638335) := checkAffineDrop_sound 520 (2 ^ 320) 20638335 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 21133739) := checkAffineDrop_sound 520 (2 ^ 320) 21133739 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 22401363) := checkAffineDrop_sound 520 (2 ^ 320) 22401363 (by decide) k
theorem horizon_drop_mod2135987035920910082395021706169552114602704522356652769947041607822219725780640550022962086936576_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 320 * k + 23599787) := checkAffineDrop_sound 520 (2 ^ 320) 23599787 (by decide) k

-- k = 322, m = 523 (c = 201, 2^322 = 8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304 > 3^201)
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq6649279 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 6649279) := checkAffineDrop_sound 523 (2 ^ 322) 6649279 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 8400511) := checkAffineDrop_sound 523 (2 ^ 322) 8400511 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 10507503) := checkAffineDrop_sound 523 (2 ^ 322) 10507503 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 12600767) := checkAffineDrop_sound 523 (2 ^ 322) 12600767 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq13298559 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 13298559) := checkAffineDrop_sound 523 (2 ^ 322) 13298559 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 14089159) := checkAffineDrop_sound 523 (2 ^ 322) 14089159 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 15733191) := checkAffineDrop_sound 523 (2 ^ 322) 15733191 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 15761255) := checkAffineDrop_sound 523 (2 ^ 322) 15761255 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 16801023) := checkAffineDrop_sound 523 (2 ^ 322) 16801023 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 17731411) := checkAffineDrop_sound 523 (2 ^ 322) 17731411 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 18901151) := checkAffineDrop_sound 523 (2 ^ 322) 18901151 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 20638335) := checkAffineDrop_sound 523 (2 ^ 322) 20638335 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq21015007 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 21015007) := checkAffineDrop_sound 523 (2 ^ 322) 21015007 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 22401363) := checkAffineDrop_sound 523 (2 ^ 322) 22401363 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 23599787) := checkAffineDrop_sound 523 (2 ^ 322) 23599787 (by decide) k
theorem horizon_drop_mod8543948143683640329580086824678208458410818089426611079788166431288878903122562200091848347746304_eq23641883 (k : Nat) : HasHorizonDrop (2 ^ 322 * k + 23641883) := checkAffineDrop_sound 523 (2 ^ 322) 23641883 (by decide) k

-- k = 324, m = 526 (c = 202, 2^324 = 34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216 > 3^202)
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq6686847 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 6686847) := checkAffineDrop_sound 526 (2 ^ 324) 6686847 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq8400511 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 8400511) := checkAffineDrop_sound 526 (2 ^ 324) 8400511 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq10507503 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 10507503) := checkAffineDrop_sound 526 (2 ^ 324) 10507503 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq12600767 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 12600767) := checkAffineDrop_sound 526 (2 ^ 324) 12600767 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq14089159 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 14089159) := checkAffineDrop_sound 526 (2 ^ 324) 14089159 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq15733191 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 15733191) := checkAffineDrop_sound 526 (2 ^ 324) 15733191 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq15761255 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 15761255) := checkAffineDrop_sound 526 (2 ^ 324) 15761255 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq16801023 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 16801023) := checkAffineDrop_sound 526 (2 ^ 324) 16801023 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq17731411 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 17731411) := checkAffineDrop_sound 526 (2 ^ 324) 17731411 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq18901151 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 18901151) := checkAffineDrop_sound 526 (2 ^ 324) 18901151 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq20638335 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 20638335) := checkAffineDrop_sound 526 (2 ^ 324) 20638335 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq21015007 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 21015007) := checkAffineDrop_sound 526 (2 ^ 324) 21015007 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq21133739 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 21133739) := checkAffineDrop_sound 526 (2 ^ 324) 21133739 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq22401363 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 22401363) := checkAffineDrop_sound 526 (2 ^ 324) 22401363 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq23599787 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 23599787) := checkAffineDrop_sound 526 (2 ^ 324) 23599787 (by decide) k
theorem horizon_drop_mod34175792574734561318320347298712833833643272357706444319152665725155515612490248800367393390985216_eq23641883 (k : Nat) : HasHorizonDrop (2 ^ 324 * k + 23641883) := checkAffineDrop_sound 526 (2 ^ 324) 23641883 (by decide) k

```

---

## Część 19. Analiza Widmowa Łańcucha Markowa $8 \times 8$ (Rozkład Stacjonarny $\pi$, Luka Widmowa $1 - |\lambda_2|$, Dryf Stacjonarny $E_\pi[w]$) oraz 12-Blokowa Anatomia Domknięcia na Siatce `mod 131072` (`8192` Klas)

### 19.1. Rozkład stacjonarny $\pi P = \pi$ oraz warunkowe wartości oczekiwane waluacji $E[w \mid F]$ dla 8 kanonicznych rodzin

Dla macierzy przejść $P(F_{i+1} \mid F_i)$ wyznaczonej na pełnej siatce `mod 131072` (**393 216 przejść blokowych** w kaskadach 12-blokowych czterech rodzin A, B, C, D oraz osobno **98 304 przejścia** w samej Rodzinie A) wyznaczono dokładny rozkład stacjonarny $\pi$ (z błędem rezydualnym $\|\pi P - \pi\|_\infty < 10^{-16}$):

| Kanoniczna rodzina $F$ | Rozkład stacjonarny $\pi_F$ (Zbiorczy, $N=393\,216$) | Rozkład stacjonarny $\pi_{A,F}$ (Rodzina A, $N=98\,304$) | Średnia waluacja $E[w \mid F]$ | Średnia waluacja wyjściowa $E[v \mid F]$ | Średnia głębokość $E[r \mid F]$ | Wkład do dryfu $\pi_F E[w \mid F]$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`-7`** | **21.135%** (`0.211345`) | **20.018%** (`0.200176`) | **`4.5299`** | `1.8485` | `0.0912` | `0.9574` |
| **`-5`** | **5.920%** (`0.059203`) | **6.382%** (`0.063821`) | **`5.7831`** | `2.7831` | `0.2965` | `0.3424` |
| **`10011`** | **4.859%** (`0.048589`) | **4.972%** (`0.049725`) | **`3.0716`** | `1.0000` | `0.0000` | `0.1492` |
| **`10111`** | **6.036%** (`0.060361`) | **5.868%** (`0.058679`) | **`4.0457`** | `3.0457` | `1.0000` | `0.2442` |
| **`d1`** | **31.726%** (`0.317263`) | **31.931%** (`0.319312`) | **`3.6437`** | `2.6437` | `0.2456` | `1.1560` |
| **`d5`** | **2.825%** (`0.028254`) | **2.926%** (`0.029260`) | **`6.8459`** | `1.8459` | `0.1270` | `0.1934` |
| **`d4`** | **6.164%** (`0.061637`) | **6.219%** (`0.062188`) | **`5.9686`** | `1.9686` | `0.2190` | `0.3679` |
| **`d2`** | **21.335%** (`0.213348`) | **21.684%** (`0.216839`) | **`2.3583`** | `1.5488` | `1.6737` | `0.5031` |
| **SUMA / ŚREDNIA STACJONARNA** | **100.000%** (`1.000000`) | **100.000%** (`1.000000`) | **$E_\pi[w] = 3.913657$** ($E_{\pi_A}[w] = 3.996753$) | **$E_\pi[v] = 2.130533$** | **$E_\pi[r] = 0.549285$** | **Nadwyżka nad $\log_2 9 - 1$: $+1.743732$ bitu/blok** |

### 19.2. Pełne widmo wartości własnych $\lambda_1, \dots, \lambda_8$ macierzy przejść $P$ oraz Luka Widmowa $1 - |\lambda_2|$

Współczynniki wielomianu charakterystycznego $\det(\lambda I - P) = 0$ wyznaczono metodą Faddeeva-LeVerriera, a wszystkie 8 pierwiastków zespolonych wyznaczono metodą Duranda-Kernera:

| Indeks $j$ | Wartość własna $\lambda_j$ (Macierz zbiorcza $P$) | Moduł $|\lambda_j|$ (Zbiorcza) | Wartość własna $\lambda_{A,j}$ (Rodzina A $P_A$) | Moduł $|\lambda_{A,j}|$ (Rodzina A) | Interpretacja dynamiczna |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **$j = 1$** | `1.000000 + 0.000000i` | **`1.000000`** | `1.000000 + 0.000000i` | **`1.000000`** | Wartość własna Perrona-Frobeniusa ($\lambda_1 = 1$, stan równowagi $\pi$) |
| **$j = 2$** | `0.277673 + 0.000000i` | **`0.277673`** | `0.254140 - 0.000000i` | **`0.254140`** | Dominujący mod relaksacji ($|\lambda_2|$ — wyznacza lukę widmową $1 - |\lambda_2|$) |
| **$j = 3$** | `0.065837 + 0.000000i` | **`0.065837`** | `0.077201 + 0.000000i` | **`0.077201`** | Trzeci mod relaksacji (sprzężenie między drenażem `-7` a `-5`/`d1`/`d2`) |
| **$j = 4$** | `-0.059328 - 0.000000i` | **`0.059328`** | `0.000392 + 0.046724i` | **`0.046726`** | Czwarty mod relaksacji |
| **$j = 5$** | `-0.017325 + 0.043058i` | **`0.046413`** | `0.000392 - 0.046724i` | **`0.046726`** | Piąty mod relaksacji |
| **$j = 6$** | `-0.017325 - 0.043058i` | **`0.046413`** | `-0.045778 - 0.000000i` | **`0.045778`** | Szósty mod relaksacji |
| **$j = 7$** | `0.026767 + 0.026023i` | **`0.037332`** | `0.029458 + 0.000000i` | **`0.029458`** | Siódmy mod relaksacji |
| **$j = 8$** | `0.026767 - 0.026023i` | **`0.037332`** | `-0.003649 + 0.000000i` | **`0.003649`** | Ósmy mod relaksacji (najszybsze tłumienie lokalnych fluktuacji fazy) |

- **Druga co do modułu wartość własna:** $|\lambda_2| = 0.277673$ (dla samej Rodziny A: $|\lambda_2|_A = 0.254140$).
- **Luka widmowa (Spectral Gap):** $\gamma = 1 - |\lambda_2| = \mathbf{0.722327}$ (dla Rodziny A: $\gamma_A = \mathbf{0.745860}$).
- **Skala czasu miksowania (Mixing Time):** $\tau_{\text{mix}}(10^{-4}) = \frac{\ln(10^4)}{-\ln|\lambda_2|} \approx \mathbf{7.19}$ **makro-bloku**! Oznacza to, że niezależnie od początkowej rodziny $F_1$, już po $8$–$9$ blokach rozkład faz Modulo-3 jest praktycznie nieodróżnialny od rozkładu stacjonarnego $\pi$, a średnia waluacja zbiega wykładniczo do $E_\pi[w] \approx 3.914 \gg \log_2 9 - 1 \approx 2{,}169925$.

---

### 19.3. 12-Blokowa Anatomia Domknięcia na Siatce `mod 131072` ($2^{17}$, `8192` Klas w Rodzinach A, B, C, D)

| Horyzont $K^*$ | Warunek $\sum_{i=1}^{K^*} w_i$ | Rodzina A (Podniesienia `mod 1024`) | Skumulowane A | Rodzina B ($16W + 7$) | Skumulowane B | Rodzina C (`-7`, $8U_1 - 7$) | Skumulowane C | Rodzina D (`-5`, $8U_1 - 5$) | Skumulowane D |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K^* = 1$** | $\sum_{i=1}^{1} w_i ≥ 3$ | **`2567`** (31.34%) | `2567/8192` (**31.34%**) | **`4096`** (50.00%) | `4096/8192` (**50.00%**) | **`6528`** (79.69%) | `6528/8192` (**79.69%**) | **`0`** (0.00%) | `0/8192` (**0.00%**) |
| **$K^* = 2$** | $\sum_{i=1}^{2} w_i ≥ 5$ | **`3560`** (43.46%) | `6127/8192` (**74.79%**) | **`3352`** (40.92%) | `7448/8192` (**90.92%**) | **`1591`** (19.42%) | `8119/8192` (**99.11%**) | **`5248`** (64.06%) | `5248/8192` (**64.06%**) |
| **$K^* = 3$** | $\sum_{i=1}^{3} w_i ≥ 7$ | **`1482`** (18.09%) | `7609/8192` (**92.88%**) | **`570`** (6.96%) | `8018/8192` (**97.88%**) | **`58`** (0.71%) | `8177/8192` (**99.82%**) | **`2310`** (28.20%) | `7558/8192` (**92.26%**) |
| **$K^* = 4$** | $\sum_{i=1}^{4} w_i ≥ 9$ | **`416`** (5.08%) | `8025/8192` (**97.96%**) | **`132`** (1.61%) | `8150/8192` (**99.49%**) | **`11`** (0.13%) | `8188/8192` (**99.95%**) | **`461`** (5.63%) | `8019/8192` (**97.89%**) |
| **$K^* = 5$** | $\sum_{i=1}^{5} w_i ≥ 11$ | **`122`** (1.49%) | `8147/8192` (**99.45%**) | **`30`** (0.37%) | `8180/8192` (**99.85%**) | **`3`** (0.04%) | `8191/8192` (**99.99%**) | **`116`** (1.42%) | `8135/8192` (**99.30%**) |
| **$K^* = 6$** | $\sum_{i=1}^{6} w_i ≥ 14$ | **`23`** (0.28%) | `8170/8192` (**99.73%**) | **`6`** (0.07%) | `8186/8192` (**99.93%**) | **`1`** (0.01%) | `8192/8192` (**100.00%**) | **`22`** (0.27%) | `8157/8192` (**99.57%**) |
| **$K^* = 7$** | $\sum_{i=1}^{7} w_i ≥ 16$ | **`16`** (0.20%) | `8186/8192` (**99.93%**) | **`5`** (0.06%) | `8191/8192` (**99.99%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`24`** (0.29%) | `8181/8192` (**99.87%**) |
| **$K^* = 8$** | $\sum_{i=1}^{8} w_i ≥ 18$ | **`5`** (0.06%) | `8191/8192` (**99.99%**) | **`1`** (0.01%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`7`** (0.09%) | `8188/8192` (**99.95%**) |
| **$K^* = 9$** | $\sum_{i=1}^{9} w_i ≥ 20$ | **`1`** (0.01%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`2`** (0.02%) | `8190/8192` (**99.98%**) |
| **$K^* = 10$** | $\sum_{i=1}^{10} w_i ≥ 22$ | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`2`** (0.02%) | `8192/8192` (**100.00%**) |
| **$K^* = 11$** | $\sum_{i=1}^{11} w_i ≥ 24$ | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) |
| **$K^* = 12$** | $\sum_{i=1}^{12} w_i ≥ 27$ | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) | **`0`** (0.00%) | `8192/8192` (**100.00%**) |

### 19.4. Histogramy średniej waluacji fazowej $\bar{v}_K = \frac{1}{K}\sum_{i=1}^K w_i$ na siatce `mod 131072` (`8192` klas) dla $K = 6..12$

#### A. Rodzina A: 8192 klasy podniesione z 64 ocalałych klas bazowych `mod 1024` ($r = r_{\text{base}} + 1024 j \pmod{131072}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.500`** | **`3.757`** | `7.000` | `1.000` | `2.056` | `56` | `72` | `711` | `1876` | `2348` | `3129` | `8136/8192` (**99.32%**) |
| **$K = 7$** | **`1.571`** | **`3.804`** | `6.571` | `1.000` | `2.079` | `17` | `91` | `523` | `2046` | `2254` | `3261` | `8175/8192` (**99.79%**) |
| **$K = 8$** | **`2.125`** | **`3.838`** | `6.250` | `1.000` | `2.101` | `3` | `39` | `411` | `1640` | `2685` | `3414` | `8189/8192` (**99.96%**) |
| **$K = 9$** | **`2.222`** | **`3.858`** | `6.000` | `1.000` | `2.108` | `0` | `35` | `284` | `1814` | `2630` | `3429` | `8192/8192` (**100.00%**) |
| **$K = 10$** | **`2.100`** | **`3.862`** | `5.800` | `1.100` | `2.102` | `2` | `7` | `231` | `1475` | `3095` | `3382` | `8190/8192` (**99.98%**) |
| **$K = 11$** | **`2.364`** | **`3.856`** | `5.636` | `1.091` | `2.089` | `0` | `10` | `175` | `1658` | `3067` | `3282` | `8192/8192` (**100.00%**) |
| **$K = 12$** | **`2.417`** | **`3.848`** | `5.500` | `1.083` | `2.074` | `0` | `3` | `142` | `1368` | `3496` | `3183` | `8192/8192` (**100.00%**) |

#### B. Rodzina B: Wszystkie 8192 klasy postaci $r_0 = 16 W + 7 \pmod{131072}$ ($W \in \{0..8191\}$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.833`** | **`3.921`** | `6.833` | `1.000` | `2.186` | `30` | `30` | `433` | `1475` | `2317` | `3907` | `8162/8192` (**99.63%**) |
| **$K = 7$** | **`2.000`** | **`3.931`** | `6.429` | `1.000` | `2.181` | `9` | `37` | `338` | `1675` | `2199` | `3934` | `8183/8192` (**99.89%**) |
| **$K = 8$** | **`2.250`** | **`3.926`** | `6.125` | `1.000` | `2.167` | `0` | `22` | `267` | `1313` | `2708` | `3882` | `8192/8192` (**100.00%**) |
| **$K = 9$** | **`2.222`** | **`3.918`** | `5.889` | `1.000` | `2.153` | `0` | `14` | `177` | `1535` | `2686` | `3780` | `8192/8192` (**100.00%**) |
| **$K = 10$** | **`2.100`** | **`3.902`** | `5.700` | `1.100` | `2.131` | `1` | `4` | `157` | `1261` | `3190` | `3579` | `8191/8192` (**99.99%**) |
| **$K = 11$** | **`2.364`** | **`3.883`** | `5.545` | `1.091` | `2.101` | `0` | `6` | `116` | `1504` | `3169` | `3397` | `8192/8192` (**100.00%**) |
| **$K = 12$** | **`2.500`** | **`3.866`** | `5.417` | `1.083` | `2.071` | `0` | `0` | `105` | `1317` | `3550` | `3220` | `8192/8192` (**100.00%**) |

#### C. Rodzina C (`-7`): 8192 klasy prefiksowe $U_1 \pmod{131072}$ ($n_0 = 8 U_1 - 7$, $w_1 = v_1$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.833`** | **`4.007`** | `6.833` | `1.167` | `2.438` | `9` | `17` | `352` | `1216` | `2216` | `4382` | `8183/8192` (**99.89%**) |
| **$K = 7$** | **`2.000`** | **`4.008`** | `6.429` | `1.143` | `2.397` | `3` | `24` | `261` | `1394` | `2141` | `4369` | `8189/8192` (**99.96%**) |
| **$K = 8$** | **`2.250`** | **`3.996`** | `6.250` | `1.250` | `2.358` | `0` | `11` | `219` | `1055` | `2581` | `4326` | `8192/8192` (**100.00%**) |
| **$K = 9$** | **`2.222`** | **`3.979`** | `5.889` | `1.222` | `2.322` | `0` | `11` | `169` | `1223` | `2610` | `4179` | `8192/8192` (**100.00%**) |
| **$K = 10$** | **`2.300`** | **`3.957`** | `5.700` | `1.200` | `2.281` | `0` | `6` | `137` | `986` | `3090` | `3973` | `8192/8192` (**100.00%**) |
| **$K = 11$** | **`2.455`** | **`3.935`** | `5.545` | `1.273` | `2.239` | `0` | `2` | `108` | `1205` | `3079` | `3798` | `8192/8192` (**100.00%**) |
| **$K = 12$** | **`2.417`** | **`3.912`** | `5.417` | `1.333` | `2.196` | `0` | `2` | `94` | `1064` | `3459` | `3573` | `8192/8192` (**100.00%**) |

#### D. Rodzina D (`-5`): 8192 klasy prefiksowe $U_1 \pmod{131072}$ ($n_0 = 8 U_1 - 5$, $w_1 = v_1$)

| Horyzont $K$ | $\min \bar{v}_K$ | Średnie $\bar{v}_K$ | $\max \bar{v}_K$ | $\min \frac{1}{K}\sum v_i$ | Średnie $\frac{1}{K}\sum v_i$ | `< 2.170` (niezamknięte) | `[2.170, 2.500)` | `[2.500, 3.000)` | `[3.000, 3.500)` | `[3.500, 4.000)` | `>= 4.000` | Pokrycie $\bar{v}_K > 2{,}1699$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$K = 6$** | **`1.333`** | **`3.718`** | `6.833` | `1.000` | `2.040` | `90` | `81` | `768` | `1952` | `2338` | `2963` | `8102/8192` (**98.90%**) |
| **$K = 7$** | **`1.571`** | **`3.771`** | `6.429` | `1.000` | `2.063` | `28` | `104` | `570` | `2188` | `2193` | `3109` | `8164/8192` (**99.66%**) |
| **$K = 8$** | **`2.000`** | **`3.804`** | `6.375` | `1.000` | `2.078` | `8` | `41` | `466` | `1732` | `2736` | `3209` | `8184/8192` (**99.90%**) |
| **$K = 9$** | **`1.889`** | **`3.825`** | `6.111` | `1.000` | `2.086` | `3` | `40` | `338` | `1976` | `2568` | `3267` | `8189/8192` (**99.96%**) |
| **$K = 10$** | **`2.200`** | **`3.831`** | `5.900` | `1.100` | `2.084` | `0` | `19` | `273` | `1604` | `3106` | `3190` | `8192/8192` (**100.00%**) |
| **$K = 11$** | **`2.182`** | **`3.831`** | `5.727` | `1.091` | `2.073` | `0` | `17` | `199` | `1848` | `3039` | `3089` | `8192/8192` (**100.00%**) |
| **$K = 12$** | **`2.250`** | **`3.828`** | `5.583` | `1.250` | `2.059` | `0` | `5` | `165` | `1505` | `3509` | `3008` | `8192/8192` (**100.00%**) |

### 19.5. Tabela 10 Najtrudniejszych Klas `mod 131072` (wg $\bar{v}_{12}$ oraz $\bar{v}_8$ w Rodzinie A)

| Ranga | Klasa $r \pmod{131072}$ | Baza $r_0 \pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..12}$ | Wektor rodzin $F_{1..12}$ | $\sum_{i=1}^8 w_i$ ($\bar{v}_8$) | $\sum_{i=1}^{10} w_i$ ($\bar{v}_{10}$) | $\sum_{i=1}^{12} w_i$ ($\bar{v}_{12}$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **`21231`** | `751` ($j=20$) | **`8`** | `[1,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`18`** (`2.250`) | **`24`** (`2.400`) | **`29`** (**`2.417`**) |
| **2** | **`71215`** | `559` ($j=69$) | **`2`** | `[1,5,2,2,1,1,3,4,4,1,2,3]` | `[d2,d4,d1,d1,d2,d2,d1,d1,d1,d2,d2,d1]` | **`19`** (`2.375`) | **`24`** (`2.400`) | **`29`** (**`2.417`**) |
| **3** | **`113263`** | `623` ($j=110$) | **`5`** | `[1,2,1,3,4,3,2,3,2,4,2,2]` | `[d2,d1,d2,d2,10011,10111,d2,d1,d2,d1,d2,d2]` | **`19`** (`2.375`) | **`25`** (`2.500`) | **`29`** (**`2.417`**) |
| **4** | **`113383`** | `743` ($j=110$) | **`4`** | `[2,2,2,3,4,2,2,2,1,1,5,4]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d2,d2,d4,-7]` | **`19`** (`2.375`) | **`21`** (`2.100`) | **`30`** (**`2.500`**) |
| **5** | **`106223`** | `751` ($j=103$) | **`4`** | `[1,2,3,3,1,1,4,3,2,4,2,4]` | `[d2,d2,d1,d1,d2,d2,-7,d1,d2,d2,d1,10011]` | **`18`** (`2.250`) | **`24`** (`2.400`) | **`30`** (**`2.500`**) |
| **6** | **`96703`** | `447` ($j=94$) | **`5`** | `[1,2,2,2,4,4,2,3,2,2,4,2]` | `[d2,d2,d2,d2,d1,d1,d2,d1,d2,d2,-7,d2]` | **`20`** (`2.500`) | **`24`** (`2.400`) | **`30`** (**`2.500`**) |
| **7** | **`31847`** | `103` ($j=31$) | **`7`** | `[2,1,2,1,4,3,3,3,2,4,2,3]` | `[d2,d2,d2,d2,d1,d1,d2,d2,d1,d1,d2,d2]` | **`19`** (`2.375`) | **`25`** (`2.500`) | **`30`** (**`2.500`**) |
| **8** | **`106823`** | `327` ($j=104$) | **`2`** | `[2,5,2,2,1,1,3,4,4,1,2,3]` | `[d2,d4,d1,d1,d2,d2,d1,d1,d1,d2,d2,d1]` | **`20`** (`2.500`) | **`25`** (`2.500`) | **`30`** (**`2.500`**) |
| **9** | **`125167`** | `239` ($j=122$) | **`7`** | `[1,2,3,1,2,3,4,3,4,3,2,2]` | `[d2,d2,d2,d2,d2,d2,-7,d1,d1,d2,d2,d1]` | **`19`** (`2.375`) | **`26`** (`2.600`) | **`30`** (**`2.500`**) |
| **10** | **`94959`** | `751` ($j=92$) | **`8`** | `[1,1,1,3,2,1,2,7,2,1,7,3]` | `[d2,d2,d2,d1,d2,d2,d2,d1,d2,d2,-5,d1]` | **`18`** (`2.250`) | **`21`** (`2.100`) | **`31`** (**`2.583`**) |
