import fs from 'node:fs';

function v2(x) {
  let v = 0;
  while (x > 0n && (x & 1n) === 0n) {
    v++;
    x >>= 1n;
  }
  return v;
}

const FAMILIES_8 = ['-7', '-5', '10011', '10111', 'd1', 'd5', 'd4', 'd2'];

function classifyCanonical8(n) {
  const mod8 = Number(n % 8n);
  if (mod8 === 1) {
    const b = v2(n + 7n);
    const rem = b % 3;
    if (rem === 0) return '-7';
    if (rem === 1) return 'd4';
    return 'd5';
  }
  if (mod8 === 3) {
    const b = v2(n + 5n);
    const rem = b % 3;
    if (rem === 0) {
      if (b === 3 && v2(n + 13n) >= 5) return '10011';
      return '-5';
    }
    if (rem === 1) return 'd1';
    return 'd2';
  }
  if (mod8 === 5) {
    return 'd1';
  }
  if (Number(n % 16n) === 7 && v2(n + 9n) >= 5) {
    return '10111';
  }
  return 'd2';
}

function macroBlockStep(n) {
  const fam = classifyCanonical8(n);
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
    return { n, fam, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN };
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
    return { n, fam, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN };
  } else {
    const c = 7;
    const b = v2(n + 7n);
    const U = (n + 7n) >> BigInt(b);
    let d = b % 3;
    if (d === 0) d = 3;
    else if (d === 1) d = 4;
    else d = 5;
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
    return { n, fam, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN };
  }
}

const survivingMod1024 = [
  71, 327, 839, 167, 679, 935, 103, 615, 359, 871, 231, 743, 487, 207, 719, 463,
  47, 559, 303, 111, 623, 879, 239, 751, 495, 1007, 27, 539, 283, 795, 155, 667,
  411, 91, 603, 859, 251, 763, 1019, 31, 543, 799, 159, 671, 415, 927, 223, 479,
  991, 63, 319, 831, 191, 703, 447, 959, 127, 639, 383, 895, 255, 767, 511, 1023
];

function analyzeFamily(items, maxK = 12, stripInitialValleyD = false) {
  const distKStar = {};
  for (let k = 1; k <= maxK; k++) distKStar[k] = 0;
  distKStar['>maxK'] = 0;

  const transCounts = {};
  const rowTotals = {};
  for (const f1 of FAMILIES_8) {
    transCounts[f1] = {};
    rowTotals[f1] = 0;
    for (const f2 of FAMILIES_8) transCounts[f1][f2] = 0;
  }

  const records = [];
  for (const item of items) {
    let cur = BigInt(item.n0 !== undefined ? item.n0 : item.r);
    const blocks = [];
    for (let i = 0; i < maxK; i++) {
      const blk = macroBlockStep(cur);
      const effDV = (i === 0 && stripInitialValleyD) ? blk.v : blk.dv;
      blocks.push({ ...blk, effDV });
      cur = blk.nextN;
    }
    for (let i = 0; i < maxK; i++) {
      const f1 = blocks[i].fam;
      const f2 = i + 1 < maxK ? blocks[i + 1].fam : classifyCanonical8(blocks[i].nextN);
      transCounts[f1][f2]++;
      rowTotals[f1]++;
    }

    let kStarDV = null;
    let sumDV = 0;
    for (let i = 0; i < maxK; i++) {
      const K = i + 1;
      sumDV += blocks[i].effDV;
      if (kStarDV === null && (9n ** BigInt(K)) < (1n << BigInt(K + sumDV))) {
        kStarDV = K;
      }
    }
    if (kStarDV !== null) distKStar[kStarDV]++;
    else distKStar['>maxK']++;

    const statsByK = {};
    for (let K = 1; K <= maxK; K++) {
      const sDV = blocks.slice(0, K).reduce((a, x) => a + x.effDV, 0);
      const sV = blocks.slice(0, K).reduce((a, x) => a + x.v, 0);
      const sR = blocks.slice(0, K).reduce((a, x) => a + x.r, 0);
      statsByK[K] = {
        sumDV: sDV,
        avgDV: sDV / K,
        sumV: sV,
        avgV: sV / K,
        sumR: sR,
      };
    }

    records.push({
      ...item,
      blocks,
      kStarDV,
      statsByK,
    });
  }

  return { distKStar, records, transCounts, rowTotals };
}

// 1. Family A: 4096 lifts of survivingMod1024 to mod 65536 (64 * 64 = 4096)
const itemsLifted4096 = [];
for (let j = 0; j < 64; j++) {
  for (const r0 of survivingMod1024) {
    itemsLifted4096.push({ r: r0 + 1024 * j, r0, j });
  }
}
itemsLifted4096.sort((a, b) => a.r - b.r);

// 2. Family B: All 4096 classes r0 = 16 * W + 7 (mod 65536), W = 0..4095
const items16W7 = [];
for (let W = 0; W < 4096; W++) {
  const r = 16 * W + 7;
  items16W7.push({ r, r0: r % 1024, j: Math.floor(r / 1024), W });
}

// 3. Family C (-7 main family, prefix U1 in 4096 lifted surviving classes, n0 = 8*U1 - 7, with w1 = v1)
const itemsMinus7_Lifted = itemsLifted4096.map(item => ({
  ...item,
  n0: BigInt(item.r) * 8n - 7n,
}));

// 4. Family D (-5 main family, prefix U1 in 4096 lifted surviving classes, n0 = 8*U1 - 5, with w1 = v1)
const itemsMinus5_Lifted = itemsLifted4096.map(item => ({
  ...item,
  n0: BigInt(item.r) * 8n - 5n,
}));

const analysisLifted = analyzeFamily(itemsLifted4096, 12, false);
const analysis16W7 = analyzeFamily(items16W7, 12, false);
const analysisMinus7 = analyzeFamily(itemsMinus7_Lifted, 12, true);
const analysisMinus5 = analyzeFamily(itemsMinus5_Lifted, 12, true);

for (const [label, an] of [
  ['Family C (-7, w1=v1): 4096 Lifted Prefixes U1 mod 65536, n0 = 8*U1 - 7', analysisMinus7],
  ['Family D (-5, w1=v1): 4096 Lifted Prefixes U1 mod 65536, n0 = 8*U1 - 5', analysisMinus5],
]) {
  console.log(`\n=== ${label} ===`);
  let cum = 0;
  for (let k = 1; k <= 12; k++) {
    cum += an.distKStar[k];
    console.log(`  K* = ${k}: ${an.distKStar[k]} (cum: ${cum}/4096 = ${(100 * cum / 4096).toFixed(2)}%)`);
  }
  for (const K of [6, 7, 8, 9, 10, 11, 12]) {
    const vals = an.records.map(x => x.statsByK[K].avgDV);
    const pass = vals.filter(v => v > Math.log2(9) - 1).length;
    console.log(`  Horizon K=${K}: min=${Math.min(...vals).toFixed(3)}, avg=${(vals.reduce((a,b)=>a+b,0)/4096).toFixed(3)}, pass=${pass}/4096 (${(100*pass/4096).toFixed(2)}%)`);
  }
}

// Parse sieve_283_303_lean.txt to get exact resultsO and resultsP for the markdown table
const leanTheorems = fs.readFileSync('/Users/gkucmierz/workspace/collatz-lab/tmp/sieve_283_303_lean.txt', 'utf8');

const setOData = [
  { set: 'O (Part 61)', c: 177, k: 283, m: 460, tested: 10573364 },
  { set: 'O (Part 61)', c: 178, k: 285, m: 463, tested: 5814604 },
  { set: 'O (Part 61)', c: 179, k: 286, m: 465, tested: 8463042 },
  { set: 'O (Part 61)', c: 180, k: 288, m: 468, tested: 6710836 },
  { set: 'O (Part 61)', c: 181, k: 290, m: 471, tested: 7140692 },
  { set: 'O (Part 61)', c: 182, k: 291, m: 473, tested: 12523697 },
];

const setPData = [
  { set: 'P (Part 62)', c: 183, k: 293, m: 476, tested: 7739376 },
  { set: 'P (Part 62)', c: 184, k: 294, m: 478, tested: 11402912 },
  { set: 'P (Part 62)', c: 185, k: 296, m: 481, tested: 7739376 },
  { set: 'P (Part 62)', c: 186, k: 298, m: 484, tested: 6024959 },
  { set: 'P (Part 62)', c: 187, k: 299, m: 486, tested: 6679168 },
  { set: 'P (Part 62)', c: 188, k: 301, m: 489, tested: 5662268 },
  { set: 'P (Part 62)', c: 189, k: 303, m: 492, tested: 5610330 },
];

for (const row of [...setOData, ...setPData]) {
  const regex = new RegExp(`HasHorizonDrop \\(2 \\^ ${row.k} \\* k \\+ (\\d+)\\)`, 'g');
  row.found = [...leanTheorems.matchAll(regex)].map(m => Number(m[1]));
  row.mod = 1n << BigInt(row.k);
  row.pow3 = 3n ** BigInt(row.c);
  if (row.found.length !== 16) {
    throw new Error(`Expected 16 classes for k=${row.k}, found ${row.found.length}`);
  }
}

// Hardest 10 in Family A (sorted by avgDV_12 ascending, then avgDV_10, then avgDV_8)
const hardest10ByK12_A = [...analysisLifted.records].sort((a, b) => {
  if (a.statsByK[12].sumDV !== b.statsByK[12].sumDV) return a.statsByK[12].sumDV - b.statsByK[12].sumDV;
  if (a.statsByK[10].sumDV !== b.statsByK[10].sumDV) return a.statsByK[10].sumDV - b.statsByK[10].sumDV;
  if (a.statsByK[8].sumDV !== b.statsByK[8].sumDV) return a.statsByK[8].sumDV - b.statsByK[8].sumDV;
  return a.r - b.r;
}).slice(0, 10);

const hardest10ByK8_A = [...analysisLifted.records].sort((a, b) => {
  if (a.statsByK[8].sumDV !== b.statsByK[8].sumDV) return a.statsByK[8].sumDV - b.statsByK[8].sumDV;
  if (a.statsByK[10].sumDV !== b.statsByK[10].sumDV) return a.statsByK[10].sumDV - b.statsByK[10].sumDV;
  if (a.statsByK[12].sumDV !== b.statsByK[12].sumDV) return a.statsByK[12].sumDV - b.statsByK[12].sumDV;
  return a.r - b.r;
}).slice(0, 10);

console.log('\nHardest 10 in Family A (sorted by v_bar_12):');
for (const h of hardest10ByK12_A) {
  console.log(`  r=${h.r} (r0=${h.r0}, j=${h.j}): K*=${h.kStarDV}, sumDV_8=${h.statsByK[8].sumDV} (${h.statsByK[8].avgDV.toFixed(3)}), sumDV_10=${h.statsByK[10].sumDV} (${h.statsByK[10].avgDV.toFixed(3)}), sumDV_12=${h.statsByK[12].sumDV} (${h.statsByK[12].avgDV.toFixed(3)}), dv12=[${h.blocks.map(b=>b.effDV).join(',')}]`);
}

console.log('\nHardest 10 in Family A (sorted by v_bar_8):');
for (const h of hardest10ByK8_A) {
  console.log(`  r=${h.r} (r0=${h.r0}, j=${h.j}): K*=${h.kStarDV}, sumDV_8=${h.statsByK[8].sumDV} (${h.statsByK[8].avgDV.toFixed(3)}), sumDV_10=${h.statsByK[10].sumDV} (${h.statsByK[10].avgDV.toFixed(3)}), sumDV_12=${h.statsByK[12].sumDV} (${h.statsByK[12].avgDV.toFixed(3)}), dv12=[${h.blocks.map(b=>b.effDV).join(',')}]`);
}

const buckets = [
  { label: '`< 2.170` (niezamknięte)', test: v => v <= Math.log2(9) - 1 },
  { label: '`[2.170, 2.500)`', test: v => v > Math.log2(9) - 1 && v < 2.5 },
  { label: '`[2.500, 3.000)`', test: v => v >= 2.5 && v < 3.0 },
  { label: '`[3.000, 3.500)`', test: v => v >= 3.0 && v < 3.5 },
  { label: '`[3.500, 4.000)`', test: v => v >= 3.5 && v < 4.0 },
  { label: '`>= 4.000`', test: v => v >= 4.0 },
];

const reqByK12 = {
  1: '≥ 3', 2: '≥ 5', 3: '≥ 7', 4: '≥ 9', 5: '≥ 11', 6: '≥ 14',
  7: '≥ 16', 8: '≥ 18', 9: '≥ 20', 10: '≥ 22', 11: '≥ 24', 12: '≥ 27'
};

// Build Round 8 Markdown report
let md = `\n\n---\n\n`;
md += `# Runda 8. Głębokie Sito 2-Adyczne (\`k = 283..303\`, \`m = 460..492\`, Zweryfikowane w Lean 4) oraz 12-Blokowa Anatomia Domknięcia na Siatce \`mod 65536\` (\`4096\` Klas, $K \\in \\{1..12\\}$) i Macierz Przejść Fazowych dla 8 Kanonicznych Rodzin\n\n`;
md += `## Część 16. Zestaw O (\`k = 283..291\`, \`m = 460..473\`, Część 61) oraz Zestaw P (\`k = 293..303\`, \`m = 476..492\`, Część 62) — 208 Twierdzeń\n\n`;
md += `### 16.1. Zbiorcza tabela 13 poziomów głębokiego sita 2-adycznego ($c = 177..189$, $k = 283..303$, $m = 460..492$)\n\n`;
md += `Wszystkie **208 twierdzeń** Zestawu O (96 twierdzeń) oraz Zestawu P (112 twierdzeń, przekraczających historyczną barierę **$2^{303}$ w $492$ krokach Collatza**) zostało wygenerowanych i zweryfikowanych bezpośrednio kompilatorem \`~/.elan/bin/lean --stdin\` (z dyrektywami \`set_option exponentiation.threshold 1024\` oraz \`set_option maxRecDepth 16384\`, kod wyjścia \`0\`, \`0\` błędów, \`0\` ostrzeżeń).\n\n`;
md += `> [!IMPORTANT]\n`;
md += `> **Uwaga techniczna dla integracji w \`lean4/CollatzProof.lean\`:** Przy $m \\ge 471$ ($k \\ge 290$) głębokość rekurencji \`affineIter m\` podczas redukcji \`by decide\` przekracza domyślny limit \`maxRecDepth 4096\`. Dodanie \`set_option maxRecDepth 16384\` obok \`set_option exponentiation.threshold 1024\` na początku Części 61 sprawia, że wszystkie 208 twierdzeń kompiluje się w ~6 sekund z kodem wyjścia \`0\`).\n\n`;

md += `| Zestaw | Poziom $c = m - k$ | Próg $k$ | Kroki $m$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \\equiv 3 \\pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek (\`by decide\` ✅) |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

for (const grp of [...setOData, ...setPData]) {
  const ratio = (Number(grp.pow3) / Number(grp.mod)).toFixed(6);
  md += `| **${grp.set}** | \`${grp.c}\` | \`${grp.k}\` | \`${grp.m}\` | \`${ratio}\` | \`${grp.tested}\` | \`${grp.found.join(', ')}\` |\n`;
}

md += `\n### 16.2. Gotowe, zweryfikowane w Lean 4 bloki kodu (Zestaw O — Część 61 oraz Zestaw P — Część 62)\n\n`;
md += `*(Pełny kod został również zapisany w pliku [\`sieve_283_303_lean.txt\`](file:///Users/gkucmierz/workspace/collatz-lab/tmp/sieve_283_303_lean.txt).)*\n\n`;
md += `\`\`\`lean\n${leanTheorems}\`\`\`\n\n`;

md += `---\n\n`;
md += `## Część 17. 12-Blokowa Anatomia Domknięcia na Poziomie \`mod 65536\` (\`4096\` Klas Reszt, $K \\in \\{1..12\\}$) oraz Macierz Przejść Fazowych Modulo-3 dla 8 Kanonicznych Rodzin\n\n`;
md += `Analizę na poziomie \`mod 65536\` ($2^{16}$) przeprowadzono dla czterech 4096-elementowych rodzin klas reszt do horyzontu $K = 12$:\n`;
md += `1. **Rodzina A (4096 podniesień 64 ocalałych klas bazowych \`mod 1024\` do \`mod 65536\`):** $r = r_{\\text{base}} + 1024 j$, gdzie $r_{\\text{base}} \\in \\text{survivingMod1024}$ ($64$ klasy) oraz $j \\in \\{0..63\\}$ ($64 \\times 64 = 4096$ klas — bezpośrednie rozszerzenie siatek z Rundy 6 i Rundy 7).\n`;
md += `2. **Rodzina B (wszystkie 4096 klas postaci $r_0 = 16 W + 7 \\pmod{65536}$):** $W \\in \\{0..4095\\}$ (pełna warstwa klas o zerowym drenażu początkowym $d_1 = 0$ w pierwszym bloku).\n`;
md += `3. **Rodzina C (4096 klas prefiksowych $U_1 \\equiv r_0 \\pmod{65536}$ w rodzinie głównej \`-7\`, $n_0 = 8 U_1 - 7$):** z waluacją pierwszego bloku liczoną bez darmowego ogona wejściowego ($w_1 = v_1 = v_2(9 U_1 - 7)$).\n`;
md += `4. **Rodzina D (4096 klas prefiksowych $U_1 \\equiv r_0 \\pmod{65536}$ w rodzinie głównej \`-5\`, $n_0 = 8 U_1 - 5$):** z waluacją pierwszego bloku liczoną bez darmowego ogona wejściowego ($w_1 = v_1 = v_2(9 U_1 - 5)$).\n\n`;

md += `### 17.1. Rozkład czasu pierwszego przejścia $K^*(r) = \\min \\{K \\in \\{1..12\\} : \\bar{v}_K(r) > \\log_2 9 - 1 \\approx 2{,}169925\\}$ dla wszystkich 4 rodzin (\`4096\` klas \`mod 65536\`)\n\n`;
md += `| Horyzont $K^*$ | Warunek $\\sum_{i=1}^{K^*} w_i$ | Rodzina A (Podniesienia \`mod 1024\`) | Skumulowane A | Rodzina B ($16W + 7$) | Skumulowane B | Rodzina C (\`-7\`, $n_0 = 8U_1 - 7$) | Skumulowane C | Rodzina D (\`-5\`, $n_0 = 8U_1 - 5$) | Skumulowane D |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

let cA = 0, cB = 0, cC = 0, cD = 0;
for (let k = 1; k <= 12; k++) {
  const nA = analysisLifted.distKStar[k];
  const nB = analysis16W7.distKStar[k];
  const nC = analysisMinus7.distKStar[k];
  const nD = analysisMinus5.distKStar[k];
  cA += nA; cB += nB; cC += nC; cD += nD;
  md += `| **$K^* = ${k}$** | $\\sum_{i=1}^{${k}} w_i ${reqByK12[k]}$ | **\`${nA}\`** (${(100 * nA / 4096).toFixed(2)}%) | \`${cA}/4096\` (**${(100 * cA / 4096).toFixed(2)}%**) | **\`${nB}\`** (${(100 * nB / 4096).toFixed(2)}%) | \`${cB}/4096\` (**${(100 * cB / 4096).toFixed(2)}%**) | **\`${nC}\`** (${(100 * nC / 4096).toFixed(2)}%) | \`${cC}/4096\` (**${(100 * cC / 4096).toFixed(2)}%**) | **\`${nD}\`** (${(100 * nD / 4096).toFixed(2)}%) | \`${cD}/4096\` (**${(100 * cD / 4096).toFixed(2)}%**) |\n`;
}

md += `\n### 17.2. Histogramy średniej waluacji fazowej $\\bar{v}_K = \\frac{1}{K}\\sum_{i=1}^K w_i$ dla $K = 6, 7, 8, 9, 10, 11, 12$\n\n`;

for (const [subTitle, an] of [
  ['A. Rodzina A: 4096 klas podniesionych z 64 ocalałych klas bazowych `mod 1024` ($r = r_{\\text{base}} + 1024 j \\pmod{65536}$)', analysisLifted],
  ['B. Rodzina B: Wszystkie 4096 klas postaci $r_0 = 16 W + 7 \\pmod{65536}$ ($W \\in \\{0..4095\\}$)', analysis16W7],
  ['C. Rodzina C (`-7`): 4096 klas prefiksowych $U_1 \\pmod{65536}$ ($n_0 = 8 U_1 - 7$, $w_1 = v_1$)', analysisMinus7],
  ['D. Rodzina D (`-5`): 4096 klas prefiksowych $U_1 \\pmod{65536}$ ($n_0 = 8 U_1 - 5$, $w_1 = v_1$)', analysisMinus5],
]) {
  md += `#### ${subTitle}\n\n`;
  md += `| Horyzont $K$ | $\\min \\bar{v}_K$ | Średnie $\\bar{v}_K$ | $\\max \\bar{v}_K$ | $\\min \\frac{1}{K}\\sum v_i$ | Średnie $\\frac{1}{K}\\sum v_i$ | \`< 2.170\` (niezamknięte) | \`[2.170, 2.500)\` | \`[2.500, 3.000)\` | \`[3.000, 3.500)\` | \`[3.500, 4.000)\` | \`>= 4.000\` | Pokrycie $\\bar{v}_K > 2{,}1699$ |\n`;
  md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  for (const K of [6, 7, 8, 9, 10, 11, 12]) {
    const valsDV = an.records.map(x => x.statsByK[K].avgDV);
    const valsV = an.records.map(x => x.statsByK[K].avgV);
    const minDV = Math.min(...valsDV).toFixed(3);
    const avgDV = (valsDV.reduce((a, b) => a + b, 0) / 4096).toFixed(3);
    const maxDV = Math.max(...valsDV).toFixed(3);
    const minV = Math.min(...valsV).toFixed(3);
    const avgV = (valsV.reduce((a, b) => a + b, 0) / 4096).toFixed(3);
    const bCounts = buckets.map(b => valsDV.filter(b.test).length);
    const passCount = 4096 - bCounts[0];
    const passPct = (100 * passCount / 4096).toFixed(2) + '%';
    md += `| **$K = ${K}$** | **\`${minDV}\`** | **\`${avgDV}\`** | \`${maxDV}\` | \`${minV}\` | \`${avgV}\` | \`${bCounts[0]}\` | \`${bCounts[1]}\` | \`${bCounts[2]}\` | \`${bCounts[3]}\` | \`${bCounts[4]}\` | \`${bCounts[5]}\` | \`${passCount}/4096\` (**${passPct}**) |\n`;
  }
  md += `\n`;
}

md += `---\n\n`;
md += `### 17.3. Empiryczna Macierz Przejść Fazowych Między 8 Kanonicznymi Rodzinami (\`-7\`, \`-5\`, \`10011\`, \`10111\`, \`d1\`, \`d5\`, \`d4\`, \`d2\`) w Kaskadach Wieloblokowych\n\n`;
md += `Każda liczba nieparzysta $n \\in \\mathbb{N}_{\\text{odd}}$ (na wejściu lub wyjściu dowolnego makro-bloku $i$) należy jednoznacznie do jednej z **8 kanonicznych rodzin** zdefiniowanych w \`CollatzProof.lean\`:\n`;
md += `- **\`-7\` (\`two_zero_valley\`):** $n \\equiv 1 \\pmod 8$, $b = v_2(n + 7) \\equiv 0 \\pmod 3$ ($b = 3r + 3, d = 3$).\n`;
md += `- **\`d4\` (\`two_zero_valley_d4\`):** $n \\equiv 1 \\pmod 8$, $b = v_2(n + 7) \\equiv 1 \\pmod 3$ ($b = 3r + 4, d = 4$).\n`;
md += `- **\`d5\` (\`two_zero_valley_d5\`):** $n \\equiv 1 \\pmod 8$, $b = v_2(n + 7) \\equiv 2 \\pmod 3$ ($b = 3r + 5, d = 5$).\n`;
md += `- **\`10011\` (\`rle_10011\`, ogon \`-13\`):** $n \\equiv 3 \\pmod{16}$ ($v_2(n + 5) = 3$) oraz $v_2(n + 13) \\ge 5$ (przechwycenie do \`-7\`).\n`;
md += `- **\`-5\` (\`shifted_valley\`):** $n \\equiv 3 \\pmod 8$, $b = v_2(n + 5) \\equiv 0 \\pmod 3$ ($b = 3r + 3, d = 3$) poza \`10011\`.\n`;
md += `- **\`d1\` (\`shifted_valley_d1\`):** $n \\equiv 3, 5 \\pmod 8$, $b = v_2(n + 5) \\equiv 1 \\pmod 3$ ($b = 3r + 1, d = 1$; dla $r = 0$ odpowiada dokładnie warstwie $n \\equiv 5 \\pmod 8$).\n`;
md += `- **\`10111\` (\`rle_10111\`, ogon \`-9\`):** $n \\equiv 7 \\pmod{16}$ ($v_2(n + 1) = 3, v_2(n + 5) = 2$) oraz $v_2(n + 9) \\ge 5$ (przechwycenie do \`-7\`).\n`;
md += `- **\`d2\` (\`shifted_valley_d2\` / ogon Mersenne'a):** $n \\equiv 3, 7 \\pmod 8$, $b = v_2(n + 5) \\equiv 2 \\pmod 3$ ($b = 3r + 2, d = 2$) poza \`10111\`.\n\n`;

const combTrans = {};
const combTotals = {};
for (const f1 of FAMILIES_8) {
  combTrans[f1] = {};
  combTotals[f1] = 0;
  for (const f2 of FAMILIES_8) {
    combTrans[f1][f2] =
      analysisLifted.transCounts[f1][f2] +
      analysis16W7.transCounts[f1][f2] +
      analysisMinus7.transCounts[f1][f2] +
      analysisMinus5.transCounts[f1][f2];
    combTotals[f1] += combTrans[f1][f2];
  }
}

md += `#### A. Zbiorcza Macierz Przejść $P(F_{i+1} \\mid F_i)$ (196 608 przejść blokowych w 12-blokowych kaskadach \`mod 65536\`)\n\n`;
md += `| Rodzina źródłowa $F_i$ (liczba przejść $N$) | $\\to$ \`-7\` | $\\to$ \`-5\` | $\\to$ \`10011\` | $\\to$ \`10111\` | $\\to$ \`d1\` | $\\to$ \`d5\` | $\\to$ \`d4\` | $\\to$ \`d2\` |\n`;
md += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

for (const f1 of FAMILIES_8) {
  const cells = FAMILIES_8.map(f2 => {
    const cnt = combTrans[f1][f2];
    const pct = combTotals[f1] > 0 ? (100 * cnt / combTotals[f1]).toFixed(2) : '0.00';
    return `**${pct}%** (\`${cnt}\`)`;
  });
  md += `| **\`${f1}\`** ($N = ${combTotals[f1]}$) | ${cells.join(' | ')} |\n`;
}

md += `\n#### B. Macierz Przejść $P(F_{i+1} \\mid F_i)$ Wyłącznie dla Rodziny A (4096 podniesionych klas ocalałych \`mod 65536\`, $4096 \\times 12 = 49\\,152$ przejścia)\n\n`;
md += `| Rodzina źródłowa $F_i$ (liczba przejść $N$) | $\\to$ \`-7\` | $\\to$ \`-5\` | $\\to$ \`10011\` | $\\to$ \`10111\` | $\\to$ \`d1\` | $\\to$ \`d5\` | $\\to$ \`d4\` | $\\to$ \`d2\` |\n`;
md += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

for (const f1 of FAMILIES_8) {
  const N = analysisLifted.rowTotals[f1];
  const cells = FAMILIES_8.map(f2 => {
    const cnt = analysisLifted.transCounts[f1][f2];
    const pct = N > 0 ? (100 * cnt / N).toFixed(2) : '0.00';
    return `**${pct}%** (\`${cnt}\`)`;
  });
  md += `| **\`${f1}\`** ($N = ${N}$) | ${cells.join(' | ')} |\n`;
}

md += `\n---\n\n`;
md += `### 17.4. Tabela 10 Najtrudniejszych Klas \`mod 65536\` (wg $\\bar{v}_{12}$ oraz $\\bar{v}_8$) wraz z 12-Blokowymi Ścieżkami Przejść\n\n`;

md += `#### A. 10 Najtrudniejszych Klas w Rodzinie A posortowanych wg $\\bar{v}_{12}$ (a następnie $\\bar{v}_{10}, \\bar{v}_8$):\n\n`;
md += `| Ranga | Klasa $r \\pmod{65536}$ | Baza $r_0 \\pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..12}$ | Wektor rodzin $F_{1..12}$ | $\\sum_{i=1}^8 w_i$ ($\\bar{v}_8$) | $\\sum_{i=1}^{10} w_i$ ($\\bar{v}_{10}$) | $\\sum_{i=1}^{12} w_i$ ($\\bar{v}_{12}$) |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

hardest10ByK12_A.forEach((h, idx) => {
  const dvVec = `\`[${h.blocks.map(b => b.effDV).join(',')}]\``;
  const famVec = `\`[${h.blocks.map(b => b.fam).join(',')}]\``;
  md += `| **${idx + 1}** | **\`${h.r}\`** | \`${h.r0}\` ($j=${h.j}$) | **\`${h.kStarDV}\`** | ${dvVec} | ${famVec} | **\`${h.statsByK[8].sumDV}\`** (\`${h.statsByK[8].avgDV.toFixed(3)}\`) | **\`${h.statsByK[10].sumDV}\`** (\`${h.statsByK[10].avgDV.toFixed(3)}\`) | **\`${h.statsByK[12].sumDV}\`** (**\`${h.statsByK[12].avgDV.toFixed(3)}\`**) |\n`;
});

md += `\n#### B. 10 Najtrudniejszych Klas w Rodzinie A posortowanych wg $\\bar{v}_8$ (w tym jedyne 2 klasy o $\\bar{v}_8 = 2{,}125 < 2{,}1699$, które domykają się na $K = 9$):\n\n`;
md += `| Ranga | Klasa $r \\pmod{65536}$ | Baza $r_0 \\pmod{1024}$ ($j$) | $K^*(r)$ | Wektor $(d_i+v_i)_{1..12}$ | Wektor rodzin $F_{1..12}$ | $\\sum_{i=1}^8 w_i$ ($\\bar{v}_8$) | $\\sum_{i=1}^{10} w_i$ ($\\bar{v}_{10}$) | $\\sum_{i=1}^{12} w_i$ ($\\bar{v}_{12}$) |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

hardest10ByK8_A.forEach((h, idx) => {
  const dvVec = `\`[${h.blocks.map(b => b.effDV).join(',')}]\``;
  const famVec = `\`[${h.blocks.map(b => b.fam).join(',')}]\``;
  md += `| **${idx + 1}** | **\`${h.r}\`** | \`${h.r0}\` ($j=${h.j}$) | **\`${h.kStarDV}\`** | ${dvVec} | ${famVec} | **\`${h.statsByK[8].sumDV}\`** (**\`${h.statsByK[8].avgDV.toFixed(3)}\`**) | **\`${h.statsByK[10].sumDV}\`** (\`${h.statsByK[10].avgDV.toFixed(3)}\`) | **\`${h.statsByK[12].sumDV}\`** (\`${h.statsByK[12].avgDV.toFixed(3)}\`) |\n`;
});

md += `\n#### C. Pełne 12-Blokowe Ścieżki Przejść $n_0 \\to n_1 \\to \\dots \\to n_{12}$ dla 10 Najtrudniejszych Klas \`mod 65536\`:\n\n`;
for (const h of hardest10ByK12_A) {
  const steps = h.blocks.map(b => `\`${b.n}\` $[\\text{${b.fam}}]\\xrightarrow[w=${b.effDV}]{(b=${b.b}, r=${b.r}, d=${b.d}, v=${b.v})}$ \`${b.nextN}\``).join(' $\\to$ ');
  md += `- **Klasa \`r = ${h.r}\` (\`r0 = ${h.r0}\`, $j = ${h.j}$, $K^* = ${h.kStarDV}$, $\\bar{v}_8 = ${h.statsByK[8].avgDV.toFixed(3)}$, $\\bar{v}_{10} = ${h.statsByK[10].avgDV.toFixed(3)}$, $\\bar{v}_{12} = ${h.statsByK[12].avgDV.toFixed(3)}$):**  \n  ${steps}\n`;
}

fs.appendFileSync('/Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md', md, 'utf8');
console.log('Appended Round 8 report to /Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md');
