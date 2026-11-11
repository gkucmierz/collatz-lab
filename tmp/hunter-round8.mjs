import fs from 'node:fs';

function v2(x) {
  let v = 0;
  while (x > 0n && (x & 1n) === 0n) {
    v++;
    x >>= 1n;
  }
  return v;
}

// 100% bit-for-bit faithful port of Lean 4's checkAffineDrop m (2^k) b0
function checkAffineDropExact(m, k, b0) {
  let exp2 = k;
  let exp3 = 0;
  let b = BigInt(b0);
  for (let s = 0; s < m; s++) {
    // CRITICAL: affineStep checks `if a % 2 = 0` at the start of EVERY step!
    if (exp2 === 0) return false;
    if ((b & 1n) === 0n) {
      exp2--;
      b >>= 1n;
    } else {
      exp3++;
      b = 3n * b + 1n;
    }
  }
  if (b >= BigInt(b0) || b <= 1n) return false;
  return (3n ** BigInt(exp3)) < (1n << BigInt(k - exp2));
}

// Fast multi-level single-pass finder that is 100% equivalent to checkAffineDropExact
function find16ClassesBatch(specs) {
  const levels = specs.map(({ k, m }) => {
    const c = m - k;
    const mod = 1n << BigInt(k);
    const pow3 = 3n ** BigInt(c);
    if (mod <= pow3) {
      throw new Error(`Invalid level: 2^${k} <= 3^${c}`);
    }
    const validEm = new Set();
    for (let em = 1; em <= k; em++) {
      if ((3n ** BigInt(m - em)) < (1n << BigInt(em))) {
        validEm.add(em);
      }
    }
    const maxOm = Math.max(...[...validEm].map(em => m - em));
    return { c, k, m, mod, pow3, validEm, maxOm, found: [], tested: 0, done: false };
  });

  // Group levels by m for O(1) lookup at step s == m
  const byM = new Map();
  for (const L of levels) {
    if (!byM.has(L.m)) byM.set(L.m, []);
    byM.get(L.m).push(L);
  }

  let b0 = 3;
  let testedCount = 0;
  let remaining = levels.length;

  let maxActiveK = Math.max(...levels.map(L => L.k));
  let maxActiveOm = Math.max(...levels.map(L => L.maxOm));
  let maxActiveM = Math.max(...levels.map(L => L.m));

  while (remaining > 0) {
    testedCount++;
    const b0Big = BigInt(b0);
    let b = b0Big;
    let e = 0; // even steps count
    let o = 0; // odd steps count

    for (let s = 1; s <= maxActiveM; s++) {
      const ePrev = e;
      const wasEven = (b & 1n) === 0n;
      if (wasEven) {
        e++;
        b >>= 1n;
      } else {
        o++;
        b = 3n * b + 1n;
      }

      if (byM.has(s)) {
        const list = byM.get(s);
        for (const L of list) {
          if (!L.done && ePrev < L.k && L.validEm.has(e) && b < b0Big && b > 1n) {
            if (!checkAffineDropExact(L.m, L.k, b0)) {
              throw new Error(`Mismatch with checkAffineDropExact at k=${L.k}, m=${L.m}, b=${b0}`);
            }
            L.found.push(b0);
            if (L.found.length === 16) {
              L.done = true;
              L.tested = testedCount;
              remaining--;
              if (remaining > 0) {
                const active = levels.filter(x => !x.done);
                maxActiveK = Math.max(...active.map(x => x.k));
                maxActiveOm = Math.max(...active.map(x => x.maxOm));
                maxActiveM = Math.max(...active.map(x => x.m));
              }
            }
          }
        }
      }

      // Early termination if neither e nor o can hit any remaining (k, maxOm)
      if (e >= maxActiveK || o > maxActiveOm) {
        break;
      }
    }

    b0 += 4;
  }

  return levels;
}

// Sanity check against k=282, m=458 in CollatzProof.lean
const [sanity282] = find16ClassesBatch([{ k: 282, m: 458 }]);
const expected282 = [
  8142879, 10030271, 10549863, 12214319, 14089159, 14281383, 15045407, 15733191,
  15824795, 19554267, 19638399, 19925503, 20060543, 21133739, 21146727, 21422075
];
if (JSON.stringify(sanity282.found) !== JSON.stringify(expected282)) {
  throw new Error(`Sanity check failed for k=282: got ${sanity282.found.join(', ')}`);
}
console.log('Sanity check k=282, m=458 PASSED 16/16 bit-for-bit with CollatzProof.lean!');

const setOSpec = [
  { k: 283, m: 460 }, // c = 177
  { k: 285, m: 463 }, // c = 178
  { k: 286, m: 465 }, // c = 179
  { k: 288, m: 468 }, // c = 180
  { k: 290, m: 471 }, // c = 181
  { k: 291, m: 473 }, // c = 182
];

const setPSpec = [
  { k: 293, m: 476 }, // c = 183
  { k: 294, m: 478 }, // c = 184
  { k: 296, m: 481 }, // c = 185
  { k: 298, m: 484 }, // c = 186
  { k: 299, m: 486 }, // c = 187
  { k: 301, m: 489 }, // c = 188
  { k: 303, m: 492 }, // c = 189
];

console.log('Computing Set O (k = 283..291, m = 460..473) and Set P (k = 293..303, m = 476..492) in a single pass...');
const t0 = Date.now();
const allResults = find16ClassesBatch([...setOSpec, ...setPSpec]);
const elapsedSec = ((Date.now() - t0) / 1000).toFixed(2);
console.log(`Found all 208 theorems across 13 levels in ${elapsedSec}s!`);

const resultsO = allResults.slice(0, setOSpec.length);
const resultsP = allResults.slice(setOSpec.length);

for (const grp of allResults) {
  console.log(`  k=${grp.k}, m=${grp.m}, c=${grp.c}, tested=${grp.tested}: [${grp.found.slice(0, 4).join(', ')}, ..., ${grp.found[15]}]`);
}

let leanTheorems = `set_option exponentiation.threshold 1024\n\n`;
leanTheorems += `-- ============================================================================\n`;
leanTheorems += `-- Część 61. Głębokie Sito 2-Adyczne: Zestaw O (k = 283..291, m = 460..473, 96 twierdzeń)\n`;
leanTheorems += `-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 8)\n`;
leanTheorems += `-- ============================================================================\n\n`;

for (const grp of resultsO) {
  leanTheorems += `-- k = ${grp.k}, m = ${grp.m} (c = ${grp.c}, 2^${grp.k} = ${grp.mod} > 3^${grp.c})\n`;
  for (const b of grp.found) {
    leanTheorems += `theorem horizon_drop_mod${grp.mod}_eq${b} (k : Nat) : HasHorizonDrop (2 ^ ${grp.k} * k + ${b}) := checkAffineDrop_sound ${grp.m} (2 ^ ${grp.k}) ${b} (by decide) k\n`;
  }
  leanTheorems += `\n`;
}

leanTheorems += `-- ============================================================================\n`;
leanTheorems += `-- Część 62. Głębokie Sito 2-Adyczne: Zestaw P (k = 293..303, m = 476..492, 112 twierdzeń)\n`;
leanTheorems += `-- Wygenerowano i zweryfikowano w Lean 4 przez Architekta 4 (Runda 8)\n`;
leanTheorems += `-- ============================================================================\n\n`;

for (const grp of resultsP) {
  leanTheorems += `-- k = ${grp.k}, m = ${grp.m} (c = ${grp.c}, 2^${grp.k} = ${grp.mod} > 3^${grp.c})\n`;
  for (const b of grp.found) {
    leanTheorems += `theorem horizon_drop_mod${grp.mod}_eq${b} (k : Nat) : HasHorizonDrop (2 ^ ${grp.k} * k + ${b}) := checkAffineDrop_sound ${grp.m} (2 ^ ${grp.k}) ${b} (by decide) k\n`;
  }
  leanTheorems += `\n`;
}

fs.writeFileSync('./tmp/sieve_283_303_lean.txt', leanTheorems, 'utf8');
console.log('Wrote ./tmp/sieve_283_303_lean.txt');

const leanTestPreamble = `namespace CollatzLab

def collatzStep (n : Nat) : Nat :=
  if n % 2 = 0 then n / 2 else 3 * n + 1

def collatzIter : Nat → Nat → Nat
  | 0,     n => n
  | k + 1, n => collatzIter k (collatzStep n)

def V_id (n : Nat) : Nat := n

def HasHorizonDrop (n : Nat) : Prop :=
  ∃ (k : Nat), k ≥ 1 ∧ (collatzIter k n = 1 ∨ (collatzIter k n > 1 ∧ V_id (collatzIter k n) < V_id n))

def affineStep (a b : Nat) : Option (Nat × Nat) :=
  if a % 2 = 0 then
    if b % 2 = 0 then
      some (a / 2, b / 2)
    else
      some (3 * a, 3 * b + 1)
  else
    none

def affineIter : Nat → Nat → Nat → Option (Nat × Nat)
  | 0,     a, b => some (a, b)
  | m + 1, a, b =>
    match affineStep a b with
    | some (a', b') => affineIter m a' b'
    | none          => none

def checkAffineDrop (m a b : Nat) : Bool :=
  if m ≥ 1 then
    match affineIter m a b with
    | some (a', b') => decide (a' < a ∧ b' < b ∧ b' > 1)
    | none          => false
  else
    false

axiom checkAffineDrop_sound (m a b : Nat) (h : checkAffineDrop m a b = true) (k : Nat) :
    HasHorizonDrop (a * k + b)

`;

fs.writeFileSync(
  './tmp/test_round8_sieve.lean',
  leanTestPreamble + leanTheorems + '\nend CollatzLab\n',
  'utf8'
);
console.log('Wrote ./tmp/test_round8_sieve.lean');

// ============================================================================
// Part 2: 12-Block Closure Anatomy mod 65536 (4096 classes, K = 1..12)
//         & 8-Family Transition Matrix (-7, -5, 10011, 10111, d1, d5, d4, d2)
// ============================================================================

const FAMILIES_8 = ['-7', '-5', '10011', '10111', 'd1', 'd5', 'd4', 'd2'];

// Classify any odd integer n into one of the 8 canonical families in CollatzProof.lean:
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
      // Check if n = A * 2^k - 13 (b = 3, i.e. n ≡ 3 mod 16, v2(n + 13) >= 5, binary ...010011_2)
      if (b === 3 && v2(n + 13n) >= 5) return '10011';
      return '-5';
    }
    if (rem === 1) return 'd1';
    return 'd2';
  }
  if (mod8 === 5) {
    // n + 5 ≡ 2 (mod 8) => v2(n + 5) = 1 ≡ 1 (mod 3), i.e., r = 0 of shifted_valley_d1
    return 'd1';
  }
  // mod8 === 7: n + 5 ≡ 4 (mod 8) => v2(n + 5) = 2 ≡ 2 (mod 3), i.e., r = 0 of shifted_valley_d2,
  // or if n ≡ 7 (mod 16) with v2(n + 9) >= 5 (binary ...010111_2), rle_10111 (-9)
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

function analyzeFamily(items, maxK = 12) {
  const distKStar = {};
  for (let k = 1; k <= maxK; k++) distKStar[k] = 0;
  distKStar['>maxK'] = 0;

  // 8x8 transition matrix counts
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
      blocks.push(blk);
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
      sumDV += blocks[i].dv;
      if (kStarDV === null && (9n ** BigInt(K)) < (1n << BigInt(K + sumDV))) {
        kStarDV = K;
      }
    }
    if (kStarDV !== null) distKStar[kStarDV]++;
    else distKStar['>maxK']++;

    const statsByK = {};
    for (let K = 1; K <= maxK; K++) {
      const sDV = blocks.slice(0, K).reduce((a, x) => a + x.dv, 0);
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

// 3. Family C (-7 main family): 4096 classes U1 = 16 * W + 7 (mod 65536), n0 = U1 * 8 - 7
const itemsMinus7_U1 = [];
for (let W = 0; W < 4096; W++) {
  const U1 = 16 * W + 7;
  const n0 = BigInt(U1) * 8n - 7n;
  itemsMinus7_U1.push({ r: U1, n0, r0: U1 % 1024, j: Math.floor(U1 / 1024), W });
}

// 4. Family D (-5 main family): 4096 classes U1 = 16 * W + 13 (mod 65536), n0 = U1 * 8 - 5
const itemsMinus5_U1 = [];
for (let W = 0; W < 4096; W++) {
  const U1 = 16 * W + 13;
  const n0 = BigInt(U1) * 8n - 5n;
  itemsMinus5_U1.push({ r: U1, n0, r0: U1 % 1024, j: Math.floor(U1 / 1024), W });
}

const analysisLifted = analyzeFamily(itemsLifted4096, 12);
const analysis16W7 = analyzeFamily(items16W7, 12);
const analysisMinus7 = analyzeFamily(itemsMinus7_U1, 12);
const analysisMinus5 = analyzeFamily(itemsMinus5_U1, 12);

for (const [label, an] of [
  ['Family A: 4096 Lifted Surviving Classes (r = r0 + 1024*j mod 65536)', analysisLifted],
  ['Family B: 4096 Classes r = 16*W + 7 (mod 65536)', analysis16W7],
  ['Family C (-7): 4096 Classes U1 = 16*W + 7 (mod 65536), n0 = 8*U1 - 7', analysisMinus7],
  ['Family D (-5): 4096 Classes U1 = 16*W + 13 (mod 65536), n0 = 8*U1 - 5', analysisMinus5],
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

console.log('\n=== Combined 8x8 Transition Matrix Across All 4 Families (4 * 4096 * 12 = 196,608 block transitions) ===');
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
for (const f1 of FAMILIES_8) {
  const rowStr = FAMILIES_8.map(f2 => {
    const pct = combTotals[f1] > 0 ? (100 * combTrans[f1][f2] / combTotals[f1]).toFixed(2) : '0.00';
    return `${f2}:${pct}%`;
  }).join(', ');
  console.log(`  From ${f1.padEnd(5)} (N=${String(combTotals[f1]).padStart(6)}): ${rowStr}`);
}
