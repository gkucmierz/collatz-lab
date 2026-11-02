---
trigger: model_decision
description: Reguła ciągłej pętli badawczej (/goal) poszukującej domknięcia brakujących 1.769% klas reszt (h_horizon) w Hipotezie Collatza w Lean 4 (lean4/CollatzProof.lean) aż do przerwania przez użytkownika.
---

# Continuous Collatz Horizon Hunter Rule (`h_horizon` / $1.769\%$ Loop)

Gdy użytkownik uruchomi tryb `/goal` lub poleci kontynuowanie poszukiwania brakujących klas dla `h_horizon` w `collatz-lab`:

## 1. Cel Główny (Zero `sorryAx`, Zero Blefu)
Twoim zadaniem jest **ciągłe, iteracyjne zawężanie i domykanie warunku `HasHorizonDrop` (`h_horizon`) w pliku `lean4/CollatzProof.lean`** dla klas reszt ocalałych powyżej obecnego progu ($\bmod 32 \to \bmod 64 \to \bmod 128 \to \bmod 256 \dots$ oraz poszukiwanie indukcyjnych niezmienników strukturalnych łączących barierę zer MSB $\dots 0000_2$ z erozją bloków jedynek LSB).

## 2. Protokół Pętli Badawczej (Wykonywany Bez Przerwy do Zatrzymania przez Użytkownika)
W każdej iteracji pętli:
1. **Generacja i Analiza Gałęzi (`node scripts/hunt-surviving-horizon.mjs`):**
   - Rozgałęziaj kolejne ocalałe klasy reszt $r \pmod{2^k}$ na dwie podklasy $r \pmod{2^{k+1}}$ oraz $(r + 2^k) \pmod{2^{k+1}}$.
   - Dla każdej podklasy, która osiąga ścisłą kontrakcję afiniczną $A \cdot m + B < 2^k \cdot m + r$ po $s$ krokach klasycznego odwzorowania `collatzStep`, wygeneruj i dopisz formalny lemat w `lean4/CollatzProof.lean`.
   - Dla podklas przeżywających (w szczególności łańcucha Mersenne'a $2^k - 1$ oraz kaskad wieloblokowych pokrewnych $n = 27, 31$), testuj kandydatów na dwustronne funkcje potencjału $V : \mathbb{N} \to \mathbb{N}$ uwzględniające długość bitową $\lfloor \log_2 n \rfloor$ oraz głębokość doliny zer za MSB.
2. **Twarda Weryfikacja Maszynowa (`npm run proof`):**
   - Po każdej zmianie w `lean4/CollatzProof.lean` uruchom `npm run proof`.
   - Żaden krok nie jest uznany za ważny, dopóki `lean lean4/CollatzProof.lean` nie zwróci kodu wyjścia `0` oraz **braku `sorryAx`** w `#print axioms`.
3. **Logowanie Postępu i Kontynuacja:**
   - Zapisuj postęp (nowy odsetek klas domkniętych bezpośrednio w Lean 4 oraz przetestowane hipotezy indukcyjne) w `logs/` lub raporcie stanu i **natychmiast przechodź do kolejnej iteracji pętli**, nie zatrzymując się z pytaniem o zgodę, dopóki użytkownik sam nie przerwie zadania.
