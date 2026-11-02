#!/usr/bin/env node
import fs from 'node:fs';

function v2(x) {
  let v = 0;
  while (x > 0n && (x & 1n) === 0n) {
    v++;
    x >>= 1n;
  }
  return v;
}

function checkAffineDrop(m, k, b0) {
  let exp2 = BigInt(k);
  let exp3 = 0n;
  let b = BigInt(b0);
  for (let i = 0; i < m; i++) {
    if (exp2 <= 0n) return false;
    if ((b & 1n) === 0n) {
      exp2 -= 1n;
      b /= 2n;
    } else {
      exp3 += 1n;
      b = 3n * b + 1n;
    }
  }
  const aPrime = (1n << exp2) * (3n ** exp3);
  const a = 1n << BigInt(k);
  return exp2 === 0n && aPrime < a && b < BigInt(b0) && b > 1n;
}

function generateLevelBlock(k, m) {
  const M = (1n << BigInt(k)).toString();
  const c = m - k;
  const residues = [];
  for (let b = 3; b < 3000000 && residues.length < 16; b += 4) {
    if (checkAffineDrop(m, k, b)) {
      residues.push(b);
    }
  }
  const lines = [];
  lines.push(`-- k=${k}, M=${M}=2^${k}, m=${m}, c=${c}`);
  for (const r of residues) {
    const rPad = String(r).padEnd(6, ' ');
    lines.push(
      `theorem horizon_drop_mod${M}_eq${r} (k : Nat) : HasHorizonDrop (2 ^ ${k} * k + ${rPad}) := checkAffineDrop_sound ${m} (2 ^ ${k}) ${rPad} (by decide) k`
    );
  }
  return { k, m, c, M, residues, text: lines.join('\n') };
}

function macroBlockStep(n) {
  const mod8 = Number(n % 8n);
  if (mod8 === 7 || mod8 === 5) {
    const c = 1;
    const b = v2(n + 1n);
    const U = (n + 1n) >> BigInt(b);
    const r = Math.floor(b / 2);
    const d = b % 2;
    const evenNum = U * (3n ** BigInt(b)) - 1n;
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = 2 * b + v;
    const oddSteps = b;
    const evenSteps = b + v;
    return {
      c,
      b,
      r,
      d,
      U,
      v,
      steps,
      oddSteps,
      evenSteps,
      nextN,
      family: b === 1 ? 'c=1 (b=1, -3)' : 'c=1 (-1)'
    };
  } else if (mod8 === 3) {
    const c = 5;
    const b = v2(n + 5n);
    const U = (n + 5n) >> BigInt(b);
    let d = b % 3;
    if (d === 0) d = 3;
    const r = (b - d) / 3;
    let evenNum, baseSteps, oddSteps;
    if (d === 3) {
      evenNum = (9n ** BigInt(r + 1)) * U - 5n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 2;
    } else if (d === 1) {
      evenNum = 3n * (9n ** BigInt(r)) * U - 7n;
      baseSteps = 5 * r + 2;
      oddSteps = 2 * r + 1;
    } else {
      evenNum = 27n * (9n ** BigInt(r)) * U - 29n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 3;
    }
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = baseSteps + v;
    const evenSteps = steps - oddSteps;
    return { c, b, r, d, U, v, steps, oddSteps, evenSteps, nextN, family: `c=5 (d=${d})` };
  } else {
    const c = 7;
    const b = v2(n + 7n);
    const U = (n + 7n) >> BigInt(b);
    let d = b % 3;
    if (d === 0) d = 3;
    else if (d === 1) d = 4;
    else if (d === 2) d = 5;
    const r = (b - d) / 3;
    let evenNum, baseSteps, oddSteps;
    if (d === 3) {
      evenNum = (9n ** BigInt(r + 1)) * U - 7n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 2;
    } else if (d === 4) {
      evenNum = (9n ** BigInt(r + 2)) * U - 29n;
      baseSteps = 5 * r + 8;
      oddSteps = 2 * r + 4;
    } else {
      evenNum = 3n * (9n ** BigInt(r + 1)) * U - 5n;
      baseSteps = 5 * r + 8;
      oddSteps = 2 * r + 3;
    }
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = baseSteps + v;
    const evenSteps = steps - oddSteps;
    return { c, b, r, d, U, v, steps, oddSteps, evenSteps, nextN, family: `c=7 (d=${d})` };
  }
}

const setALevels = [
  [143, 233],
  [145, 236],
  [146, 238],
  [148, 241],
  [149, 243],
  [151, 246]
];

const setBCanonicalLevels = [
  [153, 249],
  [154, 251],
  [156, 254],
  [157, 256],
  [159, 259],
  [161, 262]
];

const setBExactKLevels = [
  [152, 247],
  [154, 251],
  [156, 254],
  [157, 256],
  [159, 259],
  [160, 260]
];

const setAResults = setALevels.map(([k, m]) => generateLevelBlock(k, m));
const setBCanonResults = setBCanonicalLevels.map(([k, m]) => generateLevelBlock(k, m));
const setBExactResults = setBExactKLevels.map(([k, m]) => generateLevelBlock(k, m));

const hardTargets = [27n, 31n, 703n, 1023n, 6171n, 94959n];
const trajectoryAnalyses = [];

for (const n0 of hardTargets) {
  let cur = n0;
  let cumSteps = 0;
  let cumR = 0;
  let cumV = 0;
  let cumOdd = 0;
  let cumEven = 0;
  const rows = [];
  let idx = 0;
  while (cur >= n0) {
    idx++;
    const blk = macroBlockStep(cur);
    cumSteps += blk.steps;
    cumR += blk.r;
    cumV += blk.v;
    cumOdd += blk.oddSteps;
    cumEven += blk.evenSteps;
    const rEff = cumOdd / 2;
    const netSurplus = cumEven - 1.5 * cumOdd;
    const reqSurplus = rEff * Math.log2(9 / 8);
    const affineContraction = (1n << BigInt(cumEven)) > (3n ** BigInt(cumOdd));
    const dropped = blk.nextN < n0;
    rows.push({
      idx,
      startN: cur,
      ...blk,
      cumSteps,
      cumR,
      cumV,
      cumOdd,
      cumEven,
      rEff: rEff.toFixed(1),
      netSurplus: netSurplus.toFixed(1),
      reqSurplus: reqSurplus.toFixed(3),
      affineContraction,
      dropped
    });
    cur = blk.nextN;
  }
  trajectoryAnalyses.push({
    n0,
    totalBlocks: rows.length,
    totalSteps: cumSteps,
    finalOdd: cur,
    cumR,
    cumV,
    cumOdd,
    cumEven,
    rows
  });
}

let md = `# Raport Rundy 1 — Architekt 4 (Eksplorator Kontrprzykładów i Łowca Ekstremalnych Klas)

Data analizy: \`2026-11-02\`  
Skrypt generujący: \`/Users/gkucmierz/workspace/collatz-lab/tmp/hunter-round1.mjs\`

---

## Część 1. Głębokie Sito 2-Adyczne na Poziomach \`k = 143..161\` (do Części 47 i 48 w \`CollatzProof.lean\`)

### 1.1. Kluczowa obserwacja diofantyczna (Przeskok progowy wykładnika dla \`c = 96\` i \`c = 101\`)

Warunek kontrakcji afinicznej na poziomie $2^k$ dla $c = m - k$ kroków nieparzystych wymaga:
$$3^c < 2^k \\iff k \\ge \\lceil c \\log_2 3 \\rceil.$$
Sprawdzenie dokładnych potęg w arytmetyce \`BigInt\` ujawnia dwa przeskoki diofantyczne w Zestawie B:
- Dla $c = 96$: $96 \\cdot \\log_2 3 \\approx 152{,}1564 > 152$, czyli:
  $$3^{96} = 636\\,268\\,544\\,113\\,594\\,235\\,847\\,482\\,876\\,253\\,853\\,423\\,089\\,021\\,6321 > 2^{152} = 570\\,899\\,077\\,082\\,383\\,952\\,423\\,314\\,387\\,779\\,798\\,054\\,553\\,098\\,6496.$$
  W konsekwencji dla $(k = 152, m = 248, c = 96)$ \`checkAffineDrop 248 (2^152) b\` wynosi \`false\` dla **każdego** $b$.  
  - Minimalny próg dla $c = 96$ to **$k = 153, m = 249$**.  
  - Z kolei na poziomie **$k = 152$** maksymalne dopuszczalne $c$ wynosi **$c = 95, m = 247$**.
- Dla $c = 101$: $101 \\cdot \\log_2 3 \\approx 160{,}0812 > 160$, czyli $3^{101} > 2^{160}$.  
  - Minimalny próg dla $c = 101$ to **$k = 161, m = 262$**.  
  - Z kolei na poziomie **$k = 160$** maksymalne dopuszczalne $c$ wynosi **$c = 100, m = 260$**.

Poniżej dostarczamy **zarówno** kanoniczny Zestaw B dla kolejnych wykładników $c \\in \\{96, 97, 98, 99, 100, 101\\}$ ($k \\in \\{153, 154, 156, 157, 159, 161\\}$), **jak i** wariant dla dokładnie wskazanych potęg $k \\in \\{152, 154, 156, 157, 159, 160\\}$ ($m \\in \\{247, 251, 254, 256, 259, 260\\}$).

### 1.2. Zbiorcza tabela 16 najniższych przeżywających klas (\`b ≡ 3 mod 4\`) na poziomach \`k = 143..161\`

| Zestaw | Poziom $k$ | Horyzont $m$ | Kroki nieparz. $c$ | 16 najgęstszych klas przeżywających $b \\in [3, \\dots]$ |
| :--- | :---: | :---: | :---: | :--- |
`;

for (const row of setAResults) {
  md += `| **A (Cz. 47)** | \`${row.k}\` | \`${row.m}\` | \`${row.c}\` | \`${row.residues.join(', ')}\` |\n`;
}
for (const row of setBExactResults) {
  if (row.k === 152 || row.k === 160) {
    md += `| **B (k=${row.k})** | \`${row.k}\` | \`${row.m}\` | \`${row.c}\` | \`${row.residues.join(', ')}\` |\n`;
  }
}
for (const row of setBCanonResults) {
  md += `| **B (Cz. 48)** | \`${row.k}\` | \`${row.m}\` | \`${row.c}\` | \`${row.residues.join(', ')}\` |\n`;
}

md += `
---

### 1.3. Gotowy kod Lean 4 — Zestaw A (do Części 47: \`k ∈ {143, 145, 146, 148, 149, 151}\`, \`m = 233..246\`, \`96\` twierdzeń)

\`\`\`lean
${setAResults.map(x => x.text).join('\n')}
\`\`\`

---

### 1.4. Gotowy kod Lean 4 — Zestaw B, Wariant I (dokładne \`k ∈ {152, 154, 156, 157, 159, 160}\`, \`m = 247, 251, 254, 256, 259, 260\`, \`96\` twierdzeń)

\`\`\`lean
${setBExactResults.map(x => x.text).join('\n')}
\`\`\`

---

### 1.5. Gotowy kod Lean 4 — Zestaw B, Wariant II (kanoniczny ciąg progów \`c = 96..101\`: \`k ∈ {153, 154, 156, 157, 159, 161}\`, \`m = 249, 251, 254, 256, 259, 262\`, \`96\` twierdzeń)

\`\`\`lean
${setBCanonResults.map(x => x.text).join('\n')}
\`\`\`

---

## Część 2. Empiryczny Rozkład Wieloblokowy RLE (\`Multi-Block Macro-Erosion\`) dla Najtrudniejszych Trajektorii

### 2.1. Kanoniczny Dispatcher Wieloblokowy $(r_i, d_i, c_i, v_i)$

Każda liczba nieparzysta $N_i > 1$ trafia deterministycznie (poprzez resztę $N_i \\bmod 8 \\in \\{1, 3, 5, 7\\}$) do jednej z trzech rodzin makro-erozji:
1. **Rodzina $c_i = 1$ (\`mersenneTail\` dla $N_i \\equiv 7 \\pmod 8$ oraz \`single_zero_fuse\` dla $N_i \\equiv 5 \\pmod 8$, gdzie $b_i = 1$):**
   $$N_i = U_i \\cdot 2^{b_i} - 1, \\quad b_i = v_2(N_i + 1) = 2 r_i + d_i \\implies N_{i+1} = \\frac{3^{b_i} U_i - 1}{2^{v_i}} \\quad (\\Delta m_i = 2 b_i + v_i).$$
2. **Rodzina $c_i = 5$ (\`shifted_valley\` dla $N_i \\equiv 3 \\pmod 8$):**
   $$N_i = U_i \\cdot 2^{3 r_i + d_i} - 5, \\quad b_i = v_2(N_i + 5) = 3 r_i + d_i,\\ d_i \\in \\{1, 2, 3\\}:$$
   - $d_i = 1$: $N_{i+1} = \\frac{3 \\cdot 9^{r_i} U_i - 7}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 2 + v_i$ krokach,
   - $d_i = 2$: $N_{i+1} = \\frac{27 \\cdot 9^{r_i} U_i - 29}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 5 + v_i$ krokach,
   - $d_i = 3$: $N_{i+1} = \\frac{9^{r_i+1} U_i - 5}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 5 + v_i$ krokach.
3. **Rodzina $c_i = 7$ (\`two_zero_valley\` dla $N_i \\equiv 1 \\pmod 8$):**
   $$N_i = U_i \\cdot 2^{3 r_i + d_i} - 7, \\quad b_i = v_2(N_i + 7) = 3 r_i + d_i,\\ d_i \\in \\{3, 4, 5\\}:$$
   - $d_i = 3$: $N_{i+1} = \\frac{9^{r_i+1} U_i - 7}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 5 + v_i$ krokach,
   - $d_i = 4$: $N_{i+1} = \\frac{9^{r_i+2} U_i - 29}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 8 + v_i$ krokach,
   - $d_i = 5$: $N_{i+1} = \\frac{3 \\cdot 9^{r_i+1} U_i - 5}{2^{v_i}}$ w $\\Delta m_i = 5 r_i + 8 + v_i$ krokach.

**Prawo przełamania bariery $(9/8)^R$:**
Niech $O_K = \\sum_{i=1}^K \\text{odd}_i$ oznacza skumulowaną liczbę kroków nieparzystych po $K$ blokach, a $E_K = \\sum_{i=1}^K \\text{even}_i$ skumulowaną liczbę kroków parzystych. Ponieważ $3^{O_K} = 9^{O_K/2}$ oraz $2^{E_K} = 8^{O_K/2} \\cdot 2^{E_K - \\frac{3}{2} O_K}$, mamy dokładną tożsamość:
$$\\frac{3^{O_K}}{2^{E_K}} = \\left(\\frac{9}{8}\\right)^{O_K / 2} \\cdot 2^{-\\Delta V_K}, \\qquad \\Delta V_K = E_K - \\frac{3}{2} O_K.$$
Trajektoria pokonuje barierę logarytmiczną $(9/8)^{O_K/2}$ dokładnie wtedy, gdy nadwyżka 2-adyczna $\\Delta V_K > \\frac{O_K}{2} \\log_2(9/8) \\approx 0{,}08496 \\cdot O_K$ (równoważnie: $2^{\\sum v_i} > (9/8)^{\\sum r_i}$ z korektą fazową $d_i$, czyli $2^{E_K} > 3^{O_K}$).

---

### 2.2. Podsumowanie porównawcze 6 ekstremalnych trajektorii

| $n_0$ | Zapis binarny $n_0$ | Liczba bloków RLE $K$ | Kroki do $N_K < n_0$ | $\\sum r_i$ | $\\sum v_i$ | $(O_K, E_K)$ | Średnie $v_i$ na blok | Finał $N_K < n_0$ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
`;

for (const t of trajectoryAnalyses) {
  md += `| **\`${t.n0}\`** | \`${t.n0.toString(2)}₂\` | **${t.totalBlocks}** | \`${t.totalSteps}\` | \`${t.cumR}\` | \`${t.cumV}\` | \`(${t.cumOdd}, ${t.cumEven})\` | \`${(t.cumV / t.totalBlocks).toFixed(2)}\` | \`${t.finalOdd}\` |\n`;
}

md += `\n---\n\n### 2.3. Szczegółowe tabele bloków makro-erozji $(r_i, d_i, c_i, v_i)$ dla każdego $n_0$\n\n`;

for (const t of trajectoryAnalyses) {
  md += `#### Trajektoria \`n = ${t.n0}\` (\`${t.n0.toString(2)}₂\`) — przełamanie bariery po **${t.totalBlocks} blokach RLE** (\`${t.totalSteps}\` kroków)\n\n`;
  md += `| Blok $i$ | Wejście $N_i$ | Rodzina $(c_i, d_i)$ | Prefiks $U_i$ | $b_i$ | $r_i$ | $v_i$ | Kroki $\\Delta m_i$ | $\\sum r_i$ | $\\sum v_i$ | $(O_i, E_i)$ | Nadwyżka $\\Delta V_i$ vs próg $\\log_2(9/8)^{O_i/2}$ | Wyjście $N_{i+1}$ |\n`;
  md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  for (const r of t.rows) {
    const status = r.dropped ? ' **SPADEK**' : '';
    md += `| **#${r.idx}** | \`${r.startN}\` | \`${r.family}\` | \`${r.U}\` | \`${r.b}\` | \`${r.r}\` | **\`${r.v}\`** | \`${r.steps}\` | \`${r.cumR}\` | \`${r.cumV}\` | \`(${r.cumOdd}, ${r.cumEven})\` | \`${r.netSurplus} / ${r.reqSurplus}\` | \`${r.nextN}\`${status} |\n`;
  }
  md += `\n`;
}

md += `---

## Część 3. Wnioski dla Architekta 1, 2 i 3 (Podstawa pod Hipotezę H3 — Multi-Block RLE Coupling)

1. **Kompresja wykładnicza trajektorii:**  
   Nawet najbardziej ekstremalne trajektorie znane w tym zakresie ($n = 27$ z 96 krokami, $n = 703$ ze 134 krokami, $n = 94959$ ze 149 krokami) rozpadają się na zaledwie **11 do 16 bloków makro-erozji** $(r_i, d_i, c_i, v_i)$, a czysty ogon Mersenne'a $n = 1023 = 2^{10} - 1$ zamyka się w **2 blokach** (\`#1: r=5, d=0, c=1, v=3 -> 7381\`, \`#2: r=0, d=1, c=1, v=6 -> 173 < 1023\`).
2. **Mechanizm dławienia puchnięcia $(9/8)^r$:**  
   W początkowych blokach trajektoria może utrzymywać minimalne $v_i = 1$ przez maksymalnie $3$–$4$ bloki z rzędu (np. bloki \`#1..#3\` dla $n = 94959$ lub \`#3..#6\` dla $n = 6171$), lecz każde przejście $U_i \\mapsto U_{i+1} = \\text{oddPart}(\\alpha_i 9^{r_i} U_i - \\beta_i)$ wykonuje **2-adyczne mieszanie bitów prefiksu $U_i$** (mnożenie przez nieparzystą potęgę trójki i odjęcie stałej), co nieuchronnie wrzuca trajektorię albo w:
   - **bezpośredni rezonans wysokiego rzędu** ($v_i \\in \\{3, 4, 5, 6\\}$, jak w bloku \`#8\` dla $n=94959$ z $v_8 = 6$, czy w blokach \`#13..#15\` dla $n=703$ z $v = 4, 3, 5$), albo
   - **kaskadę jedno-zerowych bezpieczników** \`c = 1 (b = 1, -3)\`, gdzie każdy blok ma $r_i = 0$ i $v_i \\ge 2$ (np. bloki \`#9..#11\` dla $n = 6171$ z $v = 3, 2, 2$), co błyskawicznie redukuje wysokość liczby bez dodawania nowych cykli $r_i$.
3. **Rekomendacja formalna do \`CollatzProof.lean\`:**  
   - **Do Części 47 i 48:** Wkleić wygenerowane wyżej 192 twierdzenia \`horizon_drop_mod...\` (Zestaw A + Zestaw B).
   - **Do Hipotezy H3:** Zdefiniować w Lean 4 funkcję \`macroBlockIter (K : Nat) (n : Nat) : Nat\` lub wieloblokowy weryfikator symboliczny łączący $K = 2, 3$ kolejne przejścia $(r_i, d_i, c_i, v_i)$, ponieważ złożenie już 2–3 bloków wycina klasy o $v_1 = 1$, które pojedynczy blok zostawia otwarte.
`;

fs.writeFileSync('/Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md', md, 'utf8');
console.log('Successfully wrote /Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md');
