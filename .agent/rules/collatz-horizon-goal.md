---
trigger: model_decision
description: Reguła ciągłej pętli badawczej (/goal) oraz Orkiestracji 4-Modelowej Rady Dowodowej poszukującej domknięcia brakujących 1.769% klas reszt (h_horizon) w Hipotezie Collatza w Lean 4 (lean4/CollatzProof.lean).
---

# Continuous Collatz Horizon Hunter & 4-Agent Debate Council Rule (`h_horizon` / $1.769\%$ Loop)

Gdy użytkownik uruchomi tryb `/goal` lub poleci kontynuowanie poszukiwania brakujących klas dla `h_horizon` w `collatz-lab`:

## 1. Cel Główny (Zero `sorryAx`, Zero Blefu)
Twoim zadaniem jest **ciągłe, iteracyjne zawężanie i domykanie warunku `HasHorizonDrop` (`h_horizon`) w pliku `lean4/CollatzProof.lean`** poprzez:
1. Rozbijanie brakujących 1,769% (1,189% powyżej $\bmod 2^{29}$) na podrzedne hipotezy strukturalne:
   - Prawa 2-adycznej okresowości i podnoszenia Hensela dla $(9^k) \bmod 2^v$ (`pow9_mod256`, `pow9_mod512`, ogólny podnośnik Hensela),
   - Kaskady rezonansu 2-adycznego $\bmod 2^v$ dla wszystkich 6 faz Modulo-3 wykładnika $b \bmod 3 \in \{0, 1, 2\}$ w rodzinach `-7`, `-5`, `-9`, `-13`, `-29`,
   - Indukcyjne twierdzenia o składaniu wielu bloków makro-erozji RLE (**Multi-Block RLE Coupling**), pokonujące barierę $(9/8)^r$,
   - Głębokie sito 2-adyczne ($k = 143 \dots 200+$).

## 2. Orkiestracja 4-Modelowej Rady Dowodowej i Katalog Roboczy `tmp/`
Wszystkie wnioski, hipotezy podrzędne, logi debaty i skrypty pomocnicze zapisuj w katalogu `/Users/gkucmierz/workspace/collatz-lab/tmp/`:
- `tmp/frontier-status.md` — aktualny stan frontu dowodowego i zidentyfikowane wąskie gardła matematyczne.
- `tmp/debate-board.md` — wspólna tablica (Blackboard) dla 4 ról / subagentów:
  1. **Główny Konstruktor Formalny (Lead Prover — Gemini 4 Argon High)**: syntetyzuje dowody bezpośrednio w `lean4/CollatzProof.lean` i weryfikuje je komendą `npm run proof`.
  2. **`collatz-2adic-theorist` (Fotel Teoretyka 2-Adycznego — profil Opus)**: wyprowadza prawa podnoszenia Hensela $(9^k \bmod 2^v)$ i twierdzenia o sprzężeniu wieloblokowym RLE.
  3. **`collatz-rle-automaton` (Fotel Inżyniera Automatu RLE — profil Sonnet)**: buduje decyzyjne weryfikatory rekurencyjne i lematy faz Modulo-3 w Lean 4.
  4. **`collatz-counterexample-hunter` (Fotel Eksploratora Kontrprzykładów — profil GPT-OSS)**: testuje w Node.js najtrudniejsze ocalałe klasy i dostarcza tabele świadków kontrakcji.

## 3. Protokół Pętli Badawczej (Wykonywany Bez Przerwy do Zatrzymania przez Użytkownika)
1. W każdej iteracji aktualizuj wnioski w `tmp/debate-board.md`, rozgałęziaj kolejne podhipotezy i dopisuj formalne twierdzenia bez `sorry` do `lean4/CollatzProof.lean`.
2. Po każdej zmianie w `lean4/CollatzProof.lean` uruchom `npm --prefix /Users/gkucmierz/workspace/collatz-lab run proof` (`exit code 0`, `0 sorryAx`).
3. Natychmiast przechodź do kolejnej iteracji pętli bez pytania użytkownika o zgodę, dopóki sam nie zatrzyma zadania.
