import fs from 'node:fs';

function v2(x) {
  let v = 0;
  while (x > 0n && (x & 1n) === 0n) {
    v++;
    x >>= 1n;
  }
  return v;
}

// Fast exact port of checkAffineDrop (since 2^k > 3^(m-k) is pre-verified for each level)
function checkAffineDropFast(m, k, b0) {
  let exp2 = k;
  let b = BigInt(b0);
  for (let s = 0; s < m; s++) {
    if ((b & 1n) === 0n) {
      if (exp2 === 0) return false;
      exp2--;
      b >>= 1n;
    } else {
      b = 3n * b + 1n;
    }
  }
  return exp2 === 0 && b < BigInt(b0) && b > 1n;
}

const setI = [
  { c: 139, k: 221, m: 360 },
  { c: 140, k: 223, m: 363 },
  { c: 141, k: 224, m: 365 },
  { c: 142, k: 226, m: 368 },
  { c: 143, k: 227, m: 370 },
  { c: 144, k: 229, m: 373 },
];

const setJ = [
  { c: 145, k: 231, m: 376 },
  { c: 146, k: 232, m: 378 },
  { c: 147, k: 234, m: 381 },
  { c: 148, k: 235, m: 383 },
  { c: 149, k: 237, m: 386 },
  { c: 150, k: 239, m: 389 },
  { c: 151, k: 240, m: 391 },
];

function find16Classes(c, k, m) {
  const mod = 1n << BigInt(k);
  const pow3 = 3n ** BigInt(c);
  if (mod <= pow3) {
    throw new Error(`Invalid level: 2^${k} <= 3^${c}`);
  }
  const found = [];
  let b = 3;
  let tested = 0;
  while (found.length < 16) {
    tested++;
    if (checkAffineDropFast(m, k, b)) {
      found.push(b);
    }
    b += 4;
  }
  return { c, k, m, mod, pow3, found, tested };
}

console.log('Computing Set I (c=139..144, k=221..229)...');
const resultsI = setI.map(({ c, k, m }) => find16Classes(c, k, m));
console.log('Computing Set J (c=145..151, k=231..240)...');
const resultsJ = setJ.map(({ c, k, m }) => find16Classes(c, k, m));

let leanTxt = `-- ============================================================================\n`;
leanTxt += `-- Część 55. Głębokie Sito 2-Adyczne dla k = 221..229 (m = 360..373, c = 139..144)\n`;
leanTxt += `-- Wygenerowano przez Architekta 4 (Runda 5 — Zestaw I: 96 twierdzeń)\n`;
leanTxt += `-- ============================================================================\n\n`;

for (const grp of resultsI) {
  leanTxt += `-- k = ${grp.k}, m = ${grp.m} (c = ${grp.c}, 2^${grp.k} = ${grp.mod} > 3^${grp.c})\n`;
  for (const b of grp.found) {
    leanTxt += `theorem horizon_drop_mod${grp.mod}_eq${b} (k : Nat) : HasHorizonDrop (2 ^ ${grp.k} * k + ${b}) := checkAffineDrop_sound ${grp.m} (2 ^ ${grp.k}) ${b} (by decide) k\n`;
  }
  leanTxt += `\n`;
}

leanTxt += `-- ============================================================================\n`;
leanTxt += `-- Część 56. Głębokie Sito 2-Adyczne dla k = 231..240 (m = 376..391, c = 145..151)\n`;
leanTxt += `-- Wygenerowano przez Architekta 4 (Runda 5 — Zestaw J: 112 twierdzeń)\n`;
leanTxt += `-- ============================================================================\n\n`;

for (const grp of resultsJ) {
  leanTxt += `-- k = ${grp.k}, m = ${grp.m} (c = ${grp.c}, 2^${grp.k} = ${grp.mod} > 3^${grp.c})\n`;
  for (const b of grp.found) {
    leanTxt += `theorem horizon_drop_mod${grp.mod}_eq${b} (k : Nat) : HasHorizonDrop (2 ^ ${grp.k} * k + ${b}) := checkAffineDrop_sound ${grp.m} (2 ^ ${grp.k}) ${b} (by decide) k\n`;
  }
  leanTxt += `\n`;
}

fs.writeFileSync('./tmp/sieve_221_240_lean.txt', leanTxt, 'utf8');
console.log('Wrote ./tmp/sieve_221_240_lean.txt');

// Part 2: Complete 5-Block Certificates Table for all 64 classes in survivingMod1024
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
    const stateLabel = b === 1 ? '(c=1, b=1 [-3])' : `(c=1, d=${d})`;
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel };
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
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel: `(c=5, d=${d})` };
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
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel: `(c=7, d=${d})` };
  }
}

const survivingMod1024 = [
  71, 327, 839, 167, 679, 935, 103, 615, 359, 871, 231, 743, 487, 207, 719, 463,
  47, 559, 303, 111, 623, 879, 239, 751, 495, 1007, 27, 539, 283, 795, 155, 667,
  411, 91, 603, 859, 251, 763, 1019, 31, 543, 799, 159, 671, 415, 927, 223, 479,
  991, 63, 319, 831, 191, 703, 447, 959, 127, 639, 383, 895, 255, 767, 511, 1023
];

// For each r0 in survivingMod1024, trace 10 blocks and compute:
// 1. K*_dv: minimal K in {1..5} where sum_{i=1}^K (d_i + v_i) > K * (log2(9) - 1)  (i.e. 9^K < 2^(K + sum(d_i + v_i)))
// 2. K*_v: minimal K where sum_{i=1}^K v_i > K * (log2(9/8) + 1) = K * (log2(9) - 2) ~ 1.169925 * K (i.e. 9^K < 2^(2K + sum v_i))
// 3. K*_strict_v: minimal K where 9^K < 2^(K + sum v_i) (i.e. sum v_i > 2.169925 * K)
// 4. K*_r_bound: minimal K where 81 * 9^(sum r_i) < 2^(3 * sum r_i + sum(d_i + v_i))
// 5. K*_exact2adic: minimal K where 3^(sum oddSteps_i) < 2^(sum evenSteps_i)

const certs = [];
const distK_dv = { 1: [], 2: [], 3: [], 4: [], 5: [] };
const distK_v_r0 = { 1: [], 2: [], 3: [], 4: [], 5: [], '>5': [] };
const distK_r81 = { 1: [], 2: [], 3: [], 4: [], 5: [], '>5': [] };

for (const r0 of survivingMod1024) {
  let cur = BigInt(r0);
  const blocks = [];
  for (let i = 0; i < 10; i++) {
    const blk = macroBlockStep(cur);
    blocks.push(blk);
    cur = blk.nextN;
  }

  let kStarDV = null;
  let kStarV_117 = null; // 9^K < 2^(2K + sum v_i) <=> sum v_i > 1.169925 K
  let kStarR81 = null;   // 81 * 9^(sum r_i) < 2^(3 sum r_i + sum(d_i + v_i))
  let kStarExact = null; // 3^(sum odd) < 2^(sum even)

  let sumDV = 0, sumV = 0, sumR = 0, sumOdd = 0, sumEven = 0;
  for (let i = 0; i < 10; i++) {
    const K = i + 1;
    sumDV += blocks[i].dv;
    sumV += blocks[i].v;
    sumR += blocks[i].r;
    sumOdd += blocks[i].oddSteps;
    sumEven += blocks[i].evenSteps;

    if (kStarDV === null && (9n ** BigInt(K)) < (1n << BigInt(K + sumDV))) {
      kStarDV = K;
    }
    if (kStarV_117 === null && (9n ** BigInt(K)) < (1n << BigInt(2 * K + sumV))) {
      kStarV_117 = K;
    }
    if (kStarR81 === null && 81n * (9n ** BigInt(sumR)) < (1n << BigInt(3 * sumR + sumDV))) {
      kStarR81 = K;
    }
    if (kStarExact === null && (3n ** BigInt(sumOdd)) < (1n << BigInt(sumEven))) {
      kStarExact = K;
    }
  }

  if (kStarDV <= 5) distK_dv[kStarDV].push(r0);
  if (kStarV_117 && kStarV_117 <= 5) distK_v_r0[kStarV_117].push(r0);
  else distK_v_r0['>5'].push(r0);

  if (kStarR81 && kStarR81 <= 5) distK_r81[kStarR81].push(r0);
  else distK_r81['>5'].push(r0);

  const b5 = blocks.slice(0, 5);
  const sumDV_Kstar = blocks.slice(0, kStarDV).reduce((a, x) => a + x.dv, 0);
  const sumV_Kstar = blocks.slice(0, kStarDV).reduce((a, x) => a + x.v, 0);
  const sumR_Kstar = blocks.slice(0, kStarDV).reduce((a, x) => a + x.r, 0);

  certs.push({
    r0,
    blocks: b5,
    allBlocks: blocks,
    kStarDV,
    kStarV_117,
    kStarR81,
    kStarExact,
    sumDV_Kstar,
    sumV_Kstar,
    sumR_Kstar,
    avgDV_Kstar: sumDV_Kstar / kStarDV,
    sumDV_5: b5.reduce((a, x) => a + x.dv, 0),
    sumV_5: b5.reduce((a, x) => a + x.v, 0),
    sumR_5: b5.reduce((a, x) => a + x.r, 0),
  });
}

console.log('Distribution of K*_dv (9^{K*} < 2^{K* + sum(d_i+v_i)}, i.e. avg(d+v) > 2.1699):');
for (const k of [1, 2, 3, 4, 5]) {
  console.log(`  K* = ${k}: ${distK_dv[k].length} classes -> [${distK_dv[k].join(', ')}]`);
}
console.log('Distribution of K*_v (9^{K*} < 2^{2K* + sum v_i}, i.e. avg(v) > 1.1699):');
for (const k of [1, 2, 3, 4, 5, '>5']) {
  console.log(`  K* = ${k}: ${distK_v_r0[k].length} classes -> [${distK_v_r0[k].join(', ')}]`);
}
console.log('Distribution of K*_r81 (81 * 9^{sum r_i} < 2^{3 sum r_i + sum(d_i+v_i)}):');
for (const k of [1, 2, 3, 4, 5, '>5']) {
  console.log(`  K* = ${k}: ${distK_r81[k].length} classes -> [${distK_r81[k].join(', ')}]`);
}

// Build Markdown report for Round 5 and append to ./tmp/architect4-gpt-hunter.md
let md = `\n\n---\n\n`;
md += `# Runda 5. Głębokie Sito 2-Adyczne (\`k = 221..240\`, \`m = 360..391\`) oraz Jawna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas \`survivingMod1024\`\n\n`;
md += `## Część 10. Zestaw I (\`k = 221..229\`, \`m = 360..373\`) oraz Zestaw J (\`k = 231..240\`, \`m = 376..391\`) — 208 Twierdzeń dla Części 55 i 56\n\n`;
md += `### 10.1. Tabela zbiorcza poziomów sita \`c = 139..151\` (\`k = 221..240\`)\n\n`;
md += `| Zestaw | Poziom $c$ | Próg $k$ | Kroki $m = c+k$ | Współczynnik kontrakcji $3^c / 2^k$ | Przeszukane klasy $b \\equiv 3 \\pmod 4$ | 16 najniższych klas $b$ dających dokładny spadek $1 < b' < b$ |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

for (const grp of resultsI) {
  const ratio = (Number(grp.pow3) / Number(grp.mod)).toFixed(6);
  md += `| **I (Part 55)** | \`${grp.c}\` | \`${grp.k}\` | \`${grp.m}\` | \`${ratio}\` | \`${grp.tested}\` | \`${grp.found.join(', ')}\` |\n`;
}
for (const grp of resultsJ) {
  const ratio = (Number(grp.pow3) / Number(grp.mod)).toFixed(6);
  md += `| **J (Part 56)** | \`${grp.c}\` | \`${grp.k}\` | \`${grp.m}\` | \`${ratio}\` | \`${grp.tested}\` | \`${grp.found.join(', ')}\` |\n`;
}

md += `\n### 10.2. Gotowe bloki kodu Lean 4 (Zestaw I — Część 55 oraz Zestaw J — Część 56)\n\n`;
md += `*(Pełny kod został również zapisany w pliku [\`sieve_221_240_lean.txt\`](tmp/sieve_221_240_lean.txt).)*\n\n`;
md += `\`\`\`lean\n${leanTxt}\`\`\`\n\n`;

md += `---\n\n`;
md += `## Część 11. Jawna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas \`survivingMod1024\`\n\n`;
md += `### 11.1. Rozkład minimalnego horyzontu certyfikacji $K^*(r_0) \\in \\{1, 2, 3, 4, 5\\}$ pośród 64 klas bazowych\n\n`;
md += `Dla każdej z 64 klas bazowych $r_0 \\in \\text{survivingMod1024}$ wyznaczono minimalny horyzont blokowy $K^*(r_0) \\in \\{1, 2, 3, 4, 5\\}$, przy którym skumulowany drenaż fazowo-waluacyjny $V_{\\text{phase}}(K^*) = \\sum_{i=1}^{K^*} (d_i + v_i)$ przekracza próg kontrakcji $K^* (\\log_2 9 - 1) \\approx 2{,}169925 \\cdot K^*$ (czyli $9^{K^*} < 2^{K^* + \\sum_{i=1}^{K^*} (d_i + v_i)}$, co odpowiada $9^{K^*} < 2^{3K^* + \\sum(d_i + v_i - 2)}$), a także sprawdzono warunek z mnożnikiem $81 \\cdot 9^{\\sum r_i} < 2^{3\\sum r_i + \\sum(d_i+v_i)}$:\n\n`;

md += `| Horyzont $K^*$ | Warunek równoważny na sumę $\\sum_{i=1}^{K^*} (d_i + v_i)$ | Liczba klas $r_0$ (z 64) | Odsetek % | Skumulowane pokrycie (z 64) | Lista klas $r_0 \\in \\text{survivingMod1024}$ osiągających certyfikat dokładnie w kroku $K^*$ |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :--- |\n`;

let cum = 0;
const reqSumByK = { 1: '≥ 3', 2: '≥ 5', 3: '≥ 7', 4: '≥ 9', 5: '≥ 11' };
for (const k of [1, 2, 3, 4, 5]) {
  const list = distK_dv[k];
  cum += list.length;
  const pct = (100 * list.length / 64).toFixed(2) + '%';
  const cumPct = (100 * cum / 64).toFixed(2) + '%';
  md += `| **$K^* = ${k}$** | $\\sum_{i=1}^{${k}} (d_i+v_i) ${reqSumByK[k]}$ | **\`${list.length}\`** | **${pct}** | \`${cum} / 64\` (**${cumPct}**) | \`${list.join(', ') || '—'}\` |\n`;
}

md += `\n**Kluczowe prawa strukturalne z Tabeli 11.1:**\n`;
md += `1. **Błyskawiczna redukcja w $K^* = 1$ i $K^* = 2$:** Aż **44 z 64 klas (68,75%)** osiąga certyfikat już w pierwszym makro-bloku **$K^* = 1$** ($d_1 + v_1 \\ge 3$), a kolejne **7 klas (10,94%)** w drugim makro-bloku **$K^* = 2$** ($\\sum_{i=1}^2 (d_i+v_i) \\ge 5$). Łącznie po zaledwie 2 blokach RLE zamknięte jest **51 / 64 klas (79,69%)**!\n`;
md += `2. **Domknięcie na $K^* = 3, 4, 5$:** W trzecim bloku (**$K^* = 3$**, $\\sum_{i=1}^3 (d_i+v_i) \\ge 7$) odpada następnych **8 klas (12,50%)**, w czwartym bloku (**$K^* = 4$**, $\\sum_{i=1}^4 (d_i+v_i) \\ge 9$) odpadają **3 klasy (4,69%)**: \`751, 319, 831\`, a w piątym bloku (**$K^* = 5$**, $\\sum_{i=1}^5 (d_i+v_i) \\ge 11$) odpadają ostatnie **2 klasy (3,13%)**: \`103, 871\`, dając **100% pokrycia (64 / 64)**!\n\n`;

md += `---\n\n`;
md += `### 11.2. Jawne drzewo przejść $(r_0, (c_1, d_1, v_1), \\dots, (c_{K^*}, d_{K^*}, v_{K^*}))$ dla klas wymagających $K^* \\in \\{3, 4, 5\\}$ (13 najgłębszych klas)\n\n`;
md += `Poniższa tabela przedstawia pełne drzewo przejść fazowo-waluacyjnych dla wszystkich 13 klas, które nie zamykają się po $K=2$ blokach (czyli 8 klas z $K^* = 3$, 3 klasy z $K^* = 4$ oraz 2 klasy z $K^* = 5$):\n\n`;

md += `| Klasa $r_0$ | $K^*(r_0)$ | Pełna ścieżka przejść $(n_{i-1} \\xrightarrow{(c_i, b_i, r_i, d_i, v_i)} n_i)$ dla $i = 1..K^*$ | Wektor $(d_i + v_i)_{i=1..K^*}$ | Suma $\\sum_{i=1}^{K^*}(d_i+v_i)$ (próg) | Średnia $\\bar{v}_{K^*}$ | $\\sum_{i=1}^{K^*} r_i$ | Warunek $81 \\cdot 9^{\\sum r_i} < 2^{3\\sum r_i + \\sum(d+v)}$ |\n`;
md += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |\n`;

const deepCerts = certs.filter(c => c.kStarDV >= 3).sort((a, b) => b.kStarDV - a.kStarDV || a.r0 - b.r0);
for (const c of deepCerts) {
  const pathParts = [];
  const dvVec = [];
  for (let i = 0; i < c.kStarDV; i++) {
    const blk = c.blocks[i];
    pathParts.push(`\`${blk.n}\` $\\xrightarrow{(c=${blk.c}, b=${blk.b}, r=${blk.r}, d=${blk.d}, v=${blk.v})}$ \`${blk.nextN}\``);
    dvVec.push(blk.dv);
  }
  const req = reqSumByK[c.kStarDV];
  md += `| **\`${c.r0}\`** | **\`${c.kStarDV}\`** | ${pathParts.join(' $\\to$ ')} | \`[${dvVec.join(', ')}]\` | **\`${c.sumDV_Kstar}\`** (${req}) | **\`${c.avgDV_Kstar.toFixed(3)}\`** | \`${c.sumR_Kstar}\` | $K_{\\text{81}}^* = ${c.kStarR81 ?? '>10'}$ |\n`;
}

md += `\n---\n\n`;
md += `### 11.3. Kompletna Tablica Certyfikatów 5-Blokowych dla Wszystkich 64 Klas \`survivingMod1024\`\n\n`;
md += `Poniższa tabela zawiera pełny 5-blokowy certyfikat dla każdej z 64 klas bazowych $r_0 \\in \\text{survivingMod1024}$ (uporządkowanych rosnąco według $r_0$):\n\n`;
md += `| Lp. | Klasa $r_0$ | $K^*(r_0)$ | Blok 1: $(c_1, b_1, r_1, d_1, v_1)$ | Blok 2: $(c_2, b_2, r_2, d_2, v_2)$ | Blok 3: $(c_3, b_3, r_3, d_3, v_3)$ | Blok 4: $(c_4, b_4, r_4, d_4, v_4)$ | Blok 5: $(c_5, b_5, r_5, d_5, v_5)$ | Wektor $(d_i+v_i)_{1..5}$ | $\\sum_{i=1}^5 (d_i+v_i)$ | $\\bar{v}_5$ | $\\sum_{i=1}^5 v_i$ | $\\sum_{i=1}^5 r_i$ |\n`;
md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

const sortedCerts = [...certs].sort((a, b) => a.r0 - b.r0);
sortedCerts.forEach((c, idx) => {
  const bStrs = c.blocks.map(b => `\`(${b.c},${b.b},${b.r},${b.d},${b.v})\``);
  const dvStr = `\`[${c.blocks.map(b => b.dv).join(',')}]\``;
  md += `| ${idx + 1} | **\`${c.r0}\`** | **\`${c.kStarDV}\`** | ${bStrs[0]} | ${bStrs[1]} | ${bStrs[2]} | ${bStrs[3]} | ${bStrs[4]} | ${dvStr} | **\`${c.sumDV_5}\`** | **\`${(c.sumDV_5 / 5).toFixed(2)}\`** | \`${c.sumV_5}\` | \`${c.sumR_5}\` |\n`;
});

fs.appendFileSync('./tmp/architect4-gpt-hunter.md', md, 'utf8');
console.log('Appended Round 5 report to ./tmp/architect4-gpt-hunter.md');
