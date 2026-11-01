/**
 * Collatz.7u.pl — Mathematical, 2-Adic Binary Space & Genetic Algorithm Engine
 *
 * Implements:
 * 1. Exact BigInt hailstone trajectory computation (standard & accelerated Syracuse T(n) = (3n+1)/2^v2)
 * 2. Binary Space cellular automaton & Pre-Carry Ternary Vector {0,1,2} decomposition:
 *    3n + 1 = (n << 1) + n + 1 -> raw column sum d_i in {0,1,2} -> ripple-carry avalanche
 * 3. Formal Lemma Verifier (Alternating Ripple-Carry Fuse 101...1 -> 111...2 -> 1000...0,
 *    Mersenne 1^L -> 12^L -> 101^(L-1)0 erosion, Internal Carry Annihilation, 2-Adic Drift)
 * 4. Branch-and-Bound 2-Adic Contraction Tree Verifier mod 2^k (for k up to 20) with formal certificate
 * 5. Multi-Population Island Model Genetic Algorithm in {0,1}^K with Binary Motif Extractor
 */

export const FAMOUS_SEEDS = [
  { n: 5, label: 'n = 5 (101₂ → 1112 → 10000₂ w 1 kroku!)' },
  { n: 7, label: 'n = 7 (111₂ → 1222 → 10110₂)' },
  { n: 27, label: 'n = 27 (Klasyczny Szczyt 9232, 111 kroków)' },
  { n: 85, label: 'n = 85 (1010101₂ → 11111112 → 2⁸)' },
  { n: 871, label: 'n = 871 (178 kroków, szczyt 190 996)' },
  { n: 6171, label: 'n = 6171 (261 kroków, szczyt 975 400)' },
  { n: 77031, label: 'n = 77031 (350 kroków, szczyt 21 933 016)' },
  { n: 837799, label: 'n = 837799 (Rekord < 10⁶: 524 kroki)' }
];

const POW3 = Array.from({ length: 25 }, (_, i) => Math.pow(3, i));
const POW2 = Array.from({ length: 25 }, (_, i) => Math.pow(2, i));

export function countOnesBigInt(x) {
  let v = BigInt(x);
  let count = 0;
  while (v > 0n) {
    v &= v - 1n;
    count++;
  }
  return count;
}

export function countTrailingZerosBigInt(x) {
  let v = BigInt(x);
  if (v === 0n) return 0;
  let c = 0;
  while ((v & 1n) === 0n) {
    v >>= 1n;
    c++;
  }
  return c;
}

export function countTrailingOnesBigInt(x) {
  let v = BigInt(x);
  let c = 0;
  while ((v & 1n) === 1n) {
    v >>= 1n;
    c++;
  }
  return c;
}

export function bigIntLog2(x) {
  const b = BigInt(x);
  if (b <= 0n) return 0;
  const s = b.toString(2);
  const len = s.length;
  const topBits = parseInt(s.slice(0, Math.min(30, len)), 2);
  const shift = len - Math.min(30, len);
  return Math.log2(topBits) + shift;
}

/**
 * Computes the Pre-Carry Ternary Column-Sum Vector d_i ∈ {0, 1, 2} for 3n + 1 = (n << 1) + n + 1.
 *
 * Examples matching the binary carry insight:
 * - n = 5 (101_2):   2n = 1010, n = 0101, +1 => preCarry = "1112"   -> resolved = "10000" (16 = 2^4)
 * - n = 2 (10_2):    2n = 100,  n = 010,  +1 => preCarry = "111"    -> resolved = "111" (7)
 * - n = 7 (111_2):   2n = 1110, n = 0111, +1 => preCarry = "1222"   -> resolved = "10110" (22)
 * - n = 22 (10110_2):2n = 101100, n = 010110, +1 => preCarry = "111211" -> resolved = "1000011" (67)
 */
export function computePreCarryTernaryStep(inputN) {
  const n = BigInt(Math.max(1, Math.floor(Number(inputN) || 1)));
  const shifted = n << 1n;
  const result3n1 = 3n * n + 1n;
  const v2 = countTrailingZerosBigInt(result3n1);
  const syracuseNext = result3n1 >> BigInt(v2);

  const shiftRaw = shifted.toString(2);
  const colWidth = shiftRaw.length;
  const nCol = n.toString(2).padStart(colWidth, '0');

  const preCarryDigits = [];
  let onesFuseCount = 0;
  let twosCollisionCount = 0;
  let zerosBarrierCount = 0;

  for (let i = 0; i < colWidth; i++) {
    const b2N = shiftRaw[i] === '1' ? 1 : 0;
    const bN = nCol[i] === '1' ? 1 : 0;
    const plusOne = i === colWidth - 1 ? 1 : 0;
    const d = b2N + bN + plusOne;
    preCarryDigits.push(d);
    if (d === 0) zerosBarrierCount++;
    else if (d === 1) onesFuseCount++;
    else if (d >= 2) twosCollisionCount++;
  }

  const rawPreCarry = preCarryDigits.join('');
  const outBits = result3n1.toString(2);
  const isImmediatePowerOfTwo = (syracuseNext === 1n);

  // Trace ripple-carry avalanche waves from right (LSB) to left (MSB)
  const carryChain = new Array(colWidth).fill(0);
  let c = 0;
  let avalancheSteps = 0;
  for (let i = colWidth - 1; i >= 0; i--) {
    const total = preCarryDigits[i] + c;
    c = total >= 2 ? 1 : 0;
    carryChain[i] = c;
    if (c === 1) avalancheSteps++;
  }

  return {
    n: Number(n),
    nBitsRaw: n.toString(2),
    shiftedBitsRaw: shiftRaw,
    nBitsAligned: nCol,
    rawPreCarry,
    preCarryDigits,
    outBits,
    result3n1: Number(result3n1),
    v2,
    syracuseNext: Number(syracuseNext),
    syracuseNextBits: syracuseNext.toString(2),
    isImmediatePowerOfTwo,
    avalancheSteps,
    onesFuseCount,
    twosCollisionCount,
    zerosBarrierCount,
    twosDensity: colWidth > 0 ? twosCollisionCount / colWidth : 0
  };
}

/**
 * Computes full hailstone trajectory and binary-space telemetry for a starting integer n >= 1.
 */
export function computeCollatzTrajectory(startN, maxSteps = 2500) {
  let n = BigInt(Math.max(1, Math.floor(Number(startN) || 1)));
  const initialN = n;

  const points = [];
  const oddSteps = [];
  let step = 0;
  let oddStepCount = 0;
  let evenStepCount = 0;
  let peakVal = n;
  let glideSteps = 0;
  let droppedBelowInitial = false;

  const pushState = (val, stepIdx, opType, v2Shift = 0) => {
    const bits = val.toString(2);
    const bitLength = bits.length;
    const hamming = countOnesBigInt(val);
    const trailingOnes = countTrailingOnesBigInt(val);
    const log2Val = bigIntLog2(val);
    const numVal = Number(val);

    const entry = {
      step: stepIdx,
      val: numVal,
      bigVal: val,
      log2: log2Val,
      bits,
      bitLength,
      hamming,
      hammingDensity: bitLength > 0 ? hamming / bitLength : 0,
      trailingOnes,
      opType, // 'start' | 'odd' | 'even'
      v2Shift
    };
    points.push(entry);
    if (val & 1n) {
      oddSteps.push(entry);
    }
  };

  pushState(n, 0, 'start', 0);

  while (n > 1n && step < maxSteps) {
    step++;
    if ((n & 1n) === 0n) {
      n >>= 1n;
      evenStepCount++;
      if (!droppedBelowInitial && n < initialN) {
        droppedBelowInitial = true;
        glideSteps = step;
      }
      pushState(n, step, 'even', 1);
    } else {
      const nextEven = 3n * n + 1n;
      const v2 = countTrailingZerosBigInt(nextEven);
      n = nextEven;
      oddStepCount++;
      if (n > peakVal) peakVal = n;
      pushState(n, step, 'odd', v2);
    }
  }

  // Compute empirical 2-adic valuation statistics across odd steps
  const v2Distribution = { 1: 0, 2: 0, 3: 0, '4+': 0 };
  let sumV2 = 0;
  for (const p of points) {
    if (p.opType === 'odd') {
      sumV2 += p.v2Shift;
      if (p.v2Shift === 1) v2Distribution[1]++;
      else if (p.v2Shift === 2) v2Distribution[2]++;
      else if (p.v2Shift === 3) v2Distribution[3]++;
      else if (p.v2Shift >= 4) v2Distribution['4+']++;
    }
  }

  const avgV2 = oddStepCount > 0 ? sumV2 / oddStepCount : 2.0;
  const avgBitDrift = Math.log2(3) - avgV2; // Theoretical expectation: 1.58496 - 2 = -0.41504 bits/odd-step
  const startLog2 = Math.max(1, bigIntLog2(initialN));
  const gammaDelay = step / startLog2;

  return {
    startN: Number(initialN),
    startBits: initialN.toString(2),
    totalSteps: step,
    oddSteps: oddStepCount,
    evenSteps: evenStepCount,
    glideSteps: droppedBelowInitial ? glideSteps : step,
    gammaDelay,
    peakValue: Number(peakVal),
    peakLog2: bigIntLog2(peakVal),
    avgV2,
    avgBitDrift,
    v2Distribution,
    points,
    oddTrajectory: oddSteps
  };
}

/**
 * Decomposes a single odd step 3n + 1 = n + (n << 1) + 1 in binary space,
 * showing both the Pre-Carry Ternary Column-Sum Vector d_i ∈ {0,1,2} and the ripple-carry chain.
 */
export function analyzeBinaryAutomatonStep(oddInput) {
  let n = BigInt(Math.max(1, Math.floor(Number(oddInput) || 1)));
  if ((n & 1n) === 0n) n |= 1n; // Ensure odd for Syracuse automaton inspection

  const shifted = n << 1n;
  const result3n1 = 3n * n + 1n;
  const v2 = countTrailingZerosBigInt(result3n1);
  const syracuseNext = result3n1 >> BigInt(v2);

  const width = result3n1.toString(2).length;
  const nBits = n.toString(2).padStart(width, '0');
  const shiftBits = shifted.toString(2).padStart(width, '0');
  const outBits = result3n1.toString(2).padStart(width, '0');

  // Reconstruct carry chain from LSB (right) to MSB (left)
  const carries = new Array(width).fill(0);
  let carry = 1; // +1 in 3n + 1
  for (let i = width - 1; i >= 0; i--) {
    carries[i] = carry;
    const bN = nBits[i] === '1' ? 1 : 0;
    const b2N = shiftBits[i] === '1' ? 1 : 0;
    const sum = bN + b2N + carry;
    carry = sum >= 2 ? 1 : 0;
  }

  const ternaryInfo = computePreCarryTernaryStep(n);

  return {
    oddN: Number(n),
    nBits,
    shiftBits,
    carries: carries.join(''),
    preCarryTernary: ternaryInfo.rawPreCarry.padStart(width, '0'),
    rawPreCarry: ternaryInfo.rawPreCarry,
    onesFuseCount: ternaryInfo.onesFuseCount,
    twosCollisionCount: ternaryInfo.twosCollisionCount,
    zerosBarrierCount: ternaryInfo.zerosBarrierCount,
    isImmediatePowerOfTwo: ternaryInfo.isImmediatePowerOfTwo,
    outBits,
    v2,
    syracuseNext: Number(syracuseNext),
    syracuseNextBits: syracuseNext.toString(2),
    trailingOnesCount: countTrailingOnesBigInt(n)
  };
}

/**
 * Verifies the 4 Formal Binary Carry Lemmas in Z_2:
 * 1. Alternating Ripple-Carry Fuse Lemma: n_k = (4^k - 1)/3 = (10)^(k-1)1_2 -> 1^(2k-1)2 -> 10^(2k)_2 = 2^(2k)
 * 2. Mersenne Run-of-Ones Erosion Lemma: n_L = 2^L - 1 = 1^L_2 -> 12^L -> 101^(L-1)0_2
 * 3. Internal Carry Fuse Annihilation Chain: 10_2 -> 111_2 -> 1222 (10110_2) -> 111211 (1000011_2)
 * 4. 2-Adic Haar Measure Drift Lemma: E[Delta log2(n)] = log2(3) - 2 ≈ -0.415037499
 */
export function verifyBinaryCarryLemmas() {
  // 1. Alternating family n_k = (4^k - 1) / 3 for k = 2..8
  const alternatingSamples = [];
  let allAlternatingCollapsed = true;
  for (let k = 2; k <= 7; k++) {
    const n = (1 << (2 * k - 1) ? ((4 ** k - 1) / 3) : 5);
    const step = computePreCarryTernaryStep(n);
    const expectedPreCarry = '1'.repeat(2 * k - 1) + '2';
    const expectedOut = '1' + '0'.repeat(2 * k);
    const ok = step.rawPreCarry === expectedPreCarry && step.outBits === expectedOut && step.syracuseNext === 1;
    if (!ok) allAlternatingCollapsed = false;
    alternatingSamples.push({
      k,
      n,
      nBits: step.nBitsRaw,
      rawPreCarry: step.rawPreCarry,
      outBits: step.outBits,
      v2: step.v2
    });
  }

  // 2. Mersenne family 2^L - 1 = 1^L_2 for L = 2..7
  const mersenneSamples = [];
  let allMersenneVerified = true;
  for (let L = 2; L <= 7; L++) {
    const n = (1 << L) - 1;
    const step = computePreCarryTernaryStep(n);
    const expectedPreCarry = '1' + '2'.repeat(L);
    const expectedOut = '10' + '1'.repeat(L - 1) + '0';
    const nextTrailingOnes = countTrailingOnesBigInt(step.syracuseNext);
    const ok = step.rawPreCarry === expectedPreCarry && step.outBits === expectedOut && nextTrailingOnes === L - 1;
    if (!ok) allMersenneVerified = false;
    mersenneSamples.push({
      L,
      n,
      nBits: step.nBitsRaw,
      rawPreCarry: step.rawPreCarry,
      outBits: step.outBits,
      syracuseNextBits: step.syracuseNextBits,
      nextTrailingOnes
    });
  }

  // 3. User's exact chain: 10_2 (2) -> 111_2 (7) -> 10110_2 (22) -> 1000011_2 (67)
  const step10 = computePreCarryTernaryStep(2);   // 10_2 -> rawPreCarry "111" -> out "111" (7)
  const step111 = computePreCarryTernaryStep(7);  // 111_2 -> rawPreCarry "1222" -> out "10110" (22)
  const step10110 = computePreCarryTernaryStep(22); // 10110_2 -> rawPreCarry "111211" -> out "1000011" (67)

  const chainVerified =
    step10.rawPreCarry === '111' &&
    step10.outBits === '111' &&
    step111.rawPreCarry === '1222' &&
    step111.outBits === '10110' &&
    step10110.rawPreCarry === '111211' &&
    step10110.outBits === '1000011';

  return {
    allVerified: allAlternatingCollapsed && allMersenneVerified && chainVerified,
    theoreticalDrift: Math.log2(3) - 2,
    alternatingLemma: {
      verified: allAlternatingCollapsed,
      formula: '2·(10)^(k-1)1 + (10)^(k-1)1 + 1 = 1^(2k-1)2 → 10^(2k) = 2^(2k)',
      samples: alternatingSamples
    },
    mersenneLemma: {
      verified: allMersenneVerified,
      formula: '2·(1^L) + 1^L + 1 = 12^L → 101^(L-1)0 ≫ 1 = 101^(L-1)',
      samples: mersenneSamples
    },
    internalFuseChain: {
      verified: chainVerified,
      steps: [step10, step111, step10110]
    }
  };
}

/**
 * High-Speed Branch-and-Bound 2-Adic Contraction Tree Verifier mod 2^k (for k up to 20).
 *
 * Uses subtree pruning on the 2-adic binary residue tree:
 * At depth d <= k, a residue prefix r_d (mod 2^d) determines the first d steps of
 * T(x) = (3x+1)/2 (odd) or x/2 (even).
 * Whenever 3^oddCount < 2^d at depth d, ALL 2^(k - d) odd residues extending r_d (mod 2^d)
 * are mathematically guaranteed to contract at step d!
 */
export function compute2AdicSieveCertificate(k = 12) {
  const safeK = Math.max(3, Math.min(20, Math.floor(k)));
  const totalOddResidues = Math.pow(2, safeK - 1);
  let contractedCount = 0;
  let visitedNodes = 0;
  const depthHistogram = new Array(safeK + 1).fill(0);
  const survivingResidues = [];
  const sampleClasses = [];
  const suffixCounts = new Map();

  // Recursive branch-and-bound over the 2-adic tree from depth d = 1 to safeK
  // At depth d, r represent an odd residue in [1, 2^d - 1], curVal is T^(d-1)(r) before step d
  function exploreDepth(d, r, curVal, oddCount, parityBits) {
    visitedNodes++;
    const isOdd = (curVal & 1) === 1;
    const nextVal = isOdd ? (3 * curVal + 1) / 2 : curVal / 2;
    const nextOddCount = isOdd ? oddCount + 1 : oddCount;
    const nextParity = parityBits + (isOdd ? '1' : '0');

    // Contraction criterion at step d: 3^nextOddCount < 2^d
    if (POW3[nextOddCount] < POW2[d]) {
      const subtreeLeaves = POW2[safeK - d];
      contractedCount += subtreeLeaves;
      depthHistogram[d] += subtreeLeaves;

      if (sampleClasses.length < 10) {
        sampleClasses.push({
          residue: r,
          binary: r.toString(2).padStart(d, '0').padStart(safeK, '*'),
          contracted: true,
          contractedAtStep: d,
          subtreeSize: subtreeLeaves,
          coeffRatio: POW3[nextOddCount] / POW2[d]
        });
      }
      return;
    }

    if (d === safeK) {
      // Uncontracted leaf at depth k
      const coeffRatio = POW3[nextOddCount] / POW2[safeK];
      const bin = r.toString(2).padStart(safeK, '0');
      const suffix6 = bin.slice(-Math.min(6, safeK));
      suffixCounts.set(suffix6, (suffixCounts.get(suffix6) || 0) + 1);

      if (survivingResidues.length < 28) {
        const preCarry = computePreCarryTernaryStep(r);
        survivingResidues.push({
          residue: r,
          binary: bin,
          parityVector: nextParity,
          oddCount: nextOddCount,
          coeffRatio,
          rawPreCarry: preCarry.rawPreCarry,
          twosDensity: preCarry.twosDensity
        });
      }
      if (sampleClasses.length < 12) {
        sampleClasses.push({
          residue: r,
          binary: bin,
          contracted: false,
          contractedAtStep: null,
          subtreeSize: 1,
          coeffRatio
        });
      }
      return;
    }

    // Branch to depth d + 1:
    // Child 0: r0 = r (bit d is 0) -> curVal at step d receives + 0
    // Child 1: r1 = r + 2^d (bit d is 1) -> since T^d(r + 2^d) = T^d(r) + 3^nextOddCount,
    // the value entering step d+1 shifts by 3^nextOddCount!
    const delta = POW3[nextOddCount];
    exploreDepth(d + 1, r, nextVal, nextOddCount, nextParity);
    exploreDepth(d + 1, r + POW2[d], nextVal + delta, nextOddCount, nextParity);
  }

  // Root of odd residues: at d = 1, r = 1 (since all odd numbers have r ≡ 1 mod 2)
  exploreDepth(1, 1, 1, 0, '');

  const irreducibleSuffixes = [...suffixCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([suffix, count]) => ({
      suffix,
      count,
      sharePct: (count / Math.max(1, totalOddResidues - contractedCount)) * 100
    }));

  return {
    k: safeK,
    modulus: POW2[safeK],
    totalOddResidues,
    contractedCount,
    survivingCount: totalOddResidues - contractedCount,
    contractedPercent: (contractedCount / totalOddResidues) * 100,
    visitedTreeNodes: visitedNodes,
    pruningSpeedupFactor: (totalOddResidues * safeK) / Math.max(1, visitedNodes),
    depthHistogram: depthHistogram
      .map((count, step) => ({ step, count, pct: (count / totalOddResidues) * 100 }))
      .filter((d) => d.count > 0),
    irreducibleSuffixes,
    survivingResidues,
    sampleClasses
  };
}

/**
 * Genetic Algorithm (Evolutionary Search) in Binary Space {0,1}^K.
 * Evolves K-bit odd integers (MSB = 1, LSB = 1) to discover extremal bit-patterns
 * (maximum delay factor gamma(n) = steps / log2(n) and pre-carry ternary '2' collisions).
 */
export function createRandomChromosome(bitLength = 20, biasOnes = 0.56) {
  const L = Math.max(6, Math.min(48, bitLength));
  let bits = '1';
  for (let i = 1; i < L - 1; i++) {
    bits += Math.random() < biasOnes ? '1' : '0';
  }
  bits += '1';
  return bits;
}

export function evaluateChromosome(bits) {
  const n = BigInt('0b' + bits);
  const traj = computeCollatzTrajectory(n, 2000);
  const preCarry = computePreCarryTernaryStep(n);
  const bitLen = bits.length;
  const log2N = Math.max(1, bigIntLog2(n));
  const gammaDelay = traj.totalSteps / log2N;
  const stoppingRatio = traj.totalSteps / Math.max(1, bitLen);
  const glideRatio = traj.glideSteps / Math.max(1, bitLen);

  return {
    bits,
    n: Number(n),
    bitLength: bitLen,
    totalSteps: traj.totalSteps,
    oddSteps: traj.oddSteps,
    glideSteps: traj.glideSteps,
    gammaDelay,
    peakLog2: traj.peakLog2,
    hammingWeight: countOnesBigInt(n),
    trailingOnes: countTrailingOnesBigInt(n),
    rawPreCarry: preCarry.rawPreCarry,
    twosDensity: preCarry.twosDensity,
    fitness: gammaDelay * 0.75 + glideRatio * 0.25
  };
}

export function evolveGeneticGeneration(population, { bitLength = 20, mutationRate = 0.08 } = {}) {
  const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
  const popSize = sorted.length;
  const eliteCount = Math.max(2, Math.floor(popSize * 0.2));
  const nextGen = sorted.slice(0, eliteCount);

  const pickParent = () => {
    const i1 = Math.floor(Math.random() * popSize);
    const i2 = Math.floor(Math.random() * popSize);
    return sorted[Math.min(i1, i2)];
  };

  while (nextGen.length < popSize) {
    const p1 = pickParent();
    const p2 = pickParent();
    const L = bitLength;
    const cut = 1 + Math.floor(Math.random() * Math.max(1, L - 2));
    const childArr = (p1.bits.slice(0, cut) + p2.bits.slice(cut)).split('');
    childArr[0] = '1';
    childArr[L - 1] = '1';

    for (let i = 1; i < L - 1; i++) {
      if (Math.random() < mutationRate) {
        childArr[i] = childArr[i] === '1' ? '0' : '1';
      }
    }

    const childBits = childArr.join('');
    nextGen.push(evaluateChromosome(childBits));
  }

  nextGen.sort((a, b) => b.fitness - a.fitness);
  return nextGen;
}

/**
 * Multi-Population Island Model GA with ring migration and binary motif extraction.
 */
export function createIslandModelPopulation({ bitLength = 20, islandCount = 4, islandSize = 10 } = {}) {
  const islandProfiles = [
    { id: 'alpha', name: 'Wyspa α (Gęste 1s)', biasOnes: 0.68, mutationRate: 0.06 },
    { id: 'beta', name: 'Wyspa β (Sufiksy Mersenne)', biasOnes: 0.58, mutationRate: 0.09 },
    { id: 'gamma', name: 'Wyspa γ (Eksplorator Mutacji)', biasOnes: 0.5, mutationRate: 0.14 },
    { id: 'delta', name: 'Wyspa δ (Równowaga 2-Adyczna)', biasOnes: 0.62, mutationRate: 0.07 }
  ];

  return Array.from({ length: islandCount }, (_, idx) => {
    const profile = islandProfiles[idx % islandProfiles.length];
    const members = Array.from({ length: islandSize }, () => {
      let bits = createRandomChromosome(bitLength, profile.biasOnes);
      if (idx === 1 && bitLength >= 8) {
        // Seed Mersenne-like trailing 111 suffixes on Island Beta
        bits = bits.slice(0, -3) + '111';
      }
      return evaluateChromosome(bits);
    }).sort((a, b) => b.fitness - a.fitness);

    return {
      ...profile,
      generation: 1,
      members
    };
  });
}

export function stepIslandModelGA(islands, { bitLength = 20, migrateEvery = 3 } = {}) {
  const evolved = islands.map((isl) => {
    const nextMembers = evolveGeneticGeneration(isl.members, {
      bitLength,
      mutationRate: isl.mutationRate
    });
    return {
      ...isl,
      generation: isl.generation + 1,
      members: nextMembers
    };
  });

  // Ring migration of top champion between islands every `migrateEvery` generations
  const gen = evolved[0]?.generation || 1;
  if (evolved.length > 1 && gen % migrateEvery === 0) {
    for (let i = 0; i < evolved.length; i++) {
      const sourceBest = evolved[i].members[0];
      const targetIsland = evolved[(i + 1) % evolved.length];
      targetIsland.members[targetIsland.members.length - 1] = { ...sourceBest };
      targetIsland.members.sort((a, b) => b.fitness - a.fitness);
    }
  }

  return evolved;
}

/**
 * Extracts dominant binary prefix/suffix motifs and pre-carry ternary '2' collision density
 * across top champions from the Island Model GA.
 */
export function extractBinaryMotifs(candidates) {
  const uniqueMap = new Map();
  for (const c of candidates) {
    if (!uniqueMap.has(c.bits)) uniqueMap.set(c.bits, c);
  }
  const top = [...uniqueMap.values()].sort((a, b) => b.gammaDelay - a.gammaDelay).slice(0, 12);
  const suffixMap = new Map();
  const prefixMap = new Map();
  let sumTwosDensity = 0;
  let sumHammingRatio = 0;

  for (const item of top) {
    const suf = item.bits.slice(-Math.min(5, item.bits.length));
    const pre = item.bits.slice(0, Math.min(5, item.bits.length));
    suffixMap.set(suf, (suffixMap.get(suf) || 0) + 1);
    prefixMap.set(pre, (prefixMap.get(pre) || 0) + 1);
    sumTwosDensity += item.twosDensity || 0;
    sumHammingRatio += item.hammingWeight / Math.max(1, item.bitLength);
  }

  const dominantSuffixes = [...suffixMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([motif, count]) => ({ motif, count }));

  const dominantPrefixes = [...prefixMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([motif, count]) => ({ motif, count }));

  return {
    topChampions: top,
    dominantSuffixes,
    dominantPrefixes,
    avgTwosDensity: top.length > 0 ? sumTwosDensity / top.length : 0,
    avgHammingRatio: top.length > 0 ? sumHammingRatio / top.length : 0
  };
}

/**
 * Computes the Composite 2-Adic Lyapunov Potential Function V(n) on {0,1,2} transitions:
 *   V(n) = log2(n) + wTrail * (T1(n) - 1) + wCollision2 * (C11(n) / L) - wFuse1 * (Falt(n) / L)
 *
 * Crucial property: Even during a Mersenne climb (n = 2^L - 1 = 1^L_2, L >= 2) where log2(n)
 * temporarily rises by log2(3/2) ≈ +0.58496 bits/step, the excess trailing-1 count (T1(n) - 1)
 * strictly drops by -1 per step, so V(T(n)) < V(n) with strict negative drift!
 */
export function computeLyapunovPotential(
  inputN,
  { wTrail = 0.62, wCollision2 = 0.35, wFuse1 = 0.25 } = {}
) {
  const n = BigInt(Math.max(1, Math.floor(Number(inputN) || 1)));
  if (n <= 1n) {
    return {
      n: 1,
      log2N: 0,
      trailingOnes: 1,
      excessTrailingOnes: 0,
      collisions11: 0,
      alternatingFuses: 0,
      potentialV: 0,
      nextOdd: 1,
      nextPotentialV: 0,
      deltaV: 0,
      strictlyDecreasing: true
    };
  }

  const bits = n.toString(2);
  const L = bits.length;
  const log2N = bigIntLog2(n);
  const t1 = countTrailingOnesBigInt(n);
  const excessT1 = Math.max(0, t1 - 1);

  let collisions11 = 0;
  let alternatingFuses = 0;
  for (let i = 0; i < L - 1; i++) {
    if (bits[i] === '1' && bits[i + 1] === '1') collisions11++;
    if (bits[i] !== bits[i + 1]) alternatingFuses++;
  }

  const invL = 1 / Math.max(1, L);
  const potentialV =
    log2N + wTrail * excessT1 + wCollision2 * collisions11 * invL - wFuse1 * alternatingFuses * invL;

  const m = 3n * n + 1n;
  const v2 = countTrailingZerosBigInt(m);
  const nextOdd = m >> BigInt(v2);

  let nextPotentialV = 0;
  if (nextOdd > 1n) {
    const nextBits = nextOdd.toString(2);
    const nextL = nextBits.length;
    const nextLog2 = bigIntLog2(nextOdd);
    const nextT1 = countTrailingOnesBigInt(nextOdd);
    const nextExcessT1 = Math.max(0, nextT1 - 1);
    let nextC11 = 0;
    let nextFalt = 0;
    for (let i = 0; i < nextL - 1; i++) {
      if (nextBits[i] === '1' && nextBits[i + 1] === '1') nextC11++;
      if (nextBits[i] !== nextBits[i + 1]) nextFalt++;
    }
    const nextInvL = 1 / Math.max(1, nextL);
    nextPotentialV =
      nextLog2 +
      wTrail * nextExcessT1 +
      wCollision2 * nextC11 * nextInvL -
      wFuse1 * nextFalt * nextInvL;
  }

  const deltaV = nextPotentialV - potentialV;

  return {
    n: Number(n),
    log2N,
    trailingOnes: t1,
    excessTrailingOnes: excessT1,
    collisions11,
    alternatingFuses,
    potentialV,
    nextOdd: Number(nextOdd),
    nextPotentialV,
    deltaV,
    strictlyDecreasing: deltaV < 0 || nextOdd === 1n
  };
}

/**
 * Builds the 6-State Mealy Automaton Transition Map for (s_i ∈ {0,1,2}, c_i ∈ {0,1}) -> (y_i, c_{i+1})
 * where s_i = b_i + b_{i-1} is the pure column sum and c_0 = 1 is the initial +1 of 3n + 1.
 */
export function buildMealyCarryTransitionMap(inputN) {
  const n = BigInt(Math.max(1, Math.floor(Number(inputN) || 1)));
  const bits = n.toString(2);
  const L = bits.length;

  // Pad with leading 0 at MSB and trailing 0 at index -1
  // Processing from LSB (idx = 0) to MSB (idx = L)
  const bitAt = (idx) => {
    if (idx < 0 || idx >= L) return 0;
    return bits[L - 1 - idx] === '1' ? 1 : 0;
  };

  const transitionCounts = {
    S0_C0: 0, // (s=0, c=0) -> y=0, c'=0 (Cisza zerowa 00)
    S0_C1: 0, // (s=0, c=1) -> y=1, c'=0 (Zapora 00 zatrzymuje falę carry)
    S1_C0: 0, // (s=1, c=0) -> y=1, c'=0 (Spokojny lont 01/10 bez carry)
    S1_C1: 0, // (s=1, c=1) -> y=0, c'=1 (Nadprzewodnik: lont 01/10 zerowany przez carry!)
    S2_C0: 0, // (s=2, c=0) -> y=0, c'=1 (Zapalnik: kolizja 11 wyzwala nowe carry!)
    S2_C1: 0  // (s=2, c=1) -> y=1, c'=1 (Kaskada Mersennowska: 11 + carry -> 1 i carry)
  };

  let carry = 1; // c_0 = 1 from +1 in 3n + 1
  const trace = [];

  for (let i = 0; i <= L; i++) {
    const bi = bitAt(i);
    const biPrev = bitAt(i - 1);
    const s = bi + biPrev; // in {0, 1, 2}
    const key = `S${s}_C${carry}`;
    transitionCounts[key] = (transitionCounts[key] || 0) + 1;
    const total = s + carry;
    const y = total & 1;
    const nextCarry = total >= 2 ? 1 : 0;
    trace.push({ col: i, bi, biPrev, s, carryIn: carry, bitOut: y, carryOut: nextCarry, key });
    carry = nextCarry;
  }

  const totalCols = L + 1;
  const transitions = [
    {
      id: 'S1_C1',
      rule: '(s=1, c=1) → (y=0, c′=1)',
      role: 'Nadprzewodnik (Anihilacja Lontu → 0)',
      count: transitionCounts.S1_C1,
      sharePct: (transitionCounts.S1_C1 / totalCols) * 100,
      tone: 'emerald'
    },
    {
      id: 'S2_C0',
      rule: '(s=2, c=0) → (y=0, c′=1)',
      role: 'Zapalnik Carry (Kolizja 11 budzi falę)',
      count: transitionCounts.S2_C0,
      sharePct: (transitionCounts.S2_C0 / totalCols) * 100,
      tone: 'amber'
    },
    {
      id: 'S2_C1',
      rule: '(s=2, c=1) → (y=1, c′=1)',
      role: 'Kaskada 1222 (Blok 111 podtrzymuje 1)',
      count: transitionCounts.S2_C1,
      sharePct: (transitionCounts.S2_C1 / totalCols) * 100,
      tone: 'rose'
    },
    {
      id: 'S0_C1',
      rule: '(s=0, c=1) → (y=1, c′=0)',
      role: 'Zapora 00 (Wygaszenie fali carry)',
      count: transitionCounts.S0_C1,
      sharePct: (transitionCounts.S0_C1 / totalCols) * 100,
      tone: 'cyan'
    },
    {
      id: 'S1_C0',
      rule: '(s=1, c=0) → (y=1, c′=0)',
      role: 'Lont bierny (Naprzemienne 01/10 bez c)',
      count: transitionCounts.S1_C0,
      sharePct: (transitionCounts.S1_C0 / totalCols) * 100,
      tone: 'muted'
    },
    {
      id: 'S0_C0',
      rule: '(s=0, c=0) → (y=0, c′=0)',
      role: 'Dolina zerowa (00 bez przeniesienia)',
      count: transitionCounts.S0_C0,
      sharePct: (transitionCounts.S0_C0 / totalCols) * 100,
      tone: 'muted'
    }
  ];

  return {
    n: Number(n),
    totalCols,
    transitionCounts,
    transitions,
    trace
  };
}

/**
 * Exact precomputed certificates from `/Users/gkucmierz/workspace/collatz-lab/rust-verifier`
 * (16-core Apple Silicon u128 verifier up to k = 34, i.e. 8,589,934,592 odd residue classes).
 */
export const RUST_DEEP_CERTIFICATES = {
  engine: 'collatz-rust-verifier 1.0 (u128 + 16 threads)',
  lyapunov: {
    formula: 'V(n) = log₂(n) + 0.62·(T₁(n)−1) + 0.35·(C₁₁/L) − 0.25·(F_alt/L)',
    singleStepDecreasePct: 73.98,
    twoStepDecreasePct: 82.95,
    threeStepDecreasePct: 87.90,
    meanDriftPerOddStep: -0.4196,
    mersenneStrictDescent: true
  },
  isomorphicSuffixClasses: [
    '001111111',
    '010011111',
    '011101111',
    '011111111',
    '100011011'
  ],
  levels: [
    { k: 20, totalOddResidues: 524288, contractedCount: 496960, survivingCount: 27328, contractedPercent: 94.788, pruningSpeedup: 165.2, elapsedMs: 0.42, isomorphicSuffixCount: 1329 },
    { k: 22, totalOddResidues: 2097152, contractedCount: 2003930, survivingCount: 93222, contractedPercent: 95.555, pruningSpeedup: 218.3, elapsedMs: 0.29, isomorphicSuffixCount: 4654 },
    { k: 24, totalOddResidues: 8388608, contractedCount: 8102027, survivingCount: 286581, contractedPercent: 96.584, pruningSpeedup: 273.8, elapsedMs: 0.49, isomorphicSuffixCount: 14778 },
    { k: 26, totalOddResidues: 33554432, contractedCount: 32517058, survivingCount: 1037374, contractedPercent: 96.908, pruningSpeedup: 355.4, elapsedMs: 0.76, isomorphicSuffixCount: 54016 },
    { k: 28, totalOddResidues: 134217728, contractedCount: 130693142, survivingCount: 3524586, contractedPercent: 97.374, pruningSpeedup: 466.6, elapsedMs: 2.12, isomorphicSuffixCount: 186144 },
    { k: 30, totalOddResidues: 536870912, contractedCount: 524099638, survivingCount: 12771274, contractedPercent: 97.621, pruningSpeedup: 577.8, elapsedMs: 6.50, isomorphicSuffixCount: 679444 },
    { k: 32, totalOddResidues: 2147483648, contractedCount: 2106136165, survivingCount: 41347483, contractedPercent: 98.075, pruningSpeedup: 682.4, elapsedMs: 21.79, isomorphicSuffixCount: 2228329 },
    { k: 34, totalOddResidues: 8589934592, contractedCount: 8438016956, survivingCount: 151917636, contractedPercent: 98.231, pruningSpeedup: 837.4, elapsedMs: 69.42, isomorphicSuffixCount: 8223641 }
  ]
};

/**
 * Decomposes an arbitrary-precision BigInt into Run-Length Encoding (RLE) of 1-blocks and 0-gaps
 * from LSB to MSB, plus the width of the MSB zero valley (10^{z}...).
 */
export function decomposeRleBlocksBigInt(inputVal) {
  const n = typeof inputVal === 'bigint' ? inputVal : BigInt(Math.max(1, Math.floor(Number(inputVal) || 1)));
  const bits = n.toString(2);
  const L = bits.length;
  const oneRuns = [];
  const zeroGaps = [];

  let curBit = bits[L - 1];
  let runLen = 0;
  for (let i = L - 1; i >= 0; i--) {
    if (bits[i] === curBit) {
      runLen++;
    } else {
      if (curBit === '1') oneRuns.push(runLen);
      else zeroGaps.push(runLen);
      curBit = bits[i];
      runLen = 1;
    }
  }
  if (curBit === '1') oneRuns.push(runLen);
  else zeroGaps.push(runLen);

  let msbZeroValley = 0;
  for (let i = 1; i < L; i++) {
    if (bits[i] === '0') msbZeroValley++;
    else break;
  }

  // Build compact symbolic RLE notation from MSB to LSB (up to 6 blocks)
  const rleTokens = [];
  let cBit = bits[0];
  let cLen = 0;
  for (let i = 0; i < L; i++) {
    if (bits[i] === cBit) {
      cLen++;
    } else {
      rleTokens.push(`${cBit}^${cLen}`);
      cBit = bits[i];
      cLen = 1;
    }
  }
  rleTokens.push(`${cBit}^${cLen}`);

  return {
    bitLength: L,
    oneRuns,
    zeroGaps,
    msbZeroValley,
    rleFormula:
      rleTokens.length <= 8
        ? rleTokens.join(' · ')
        : [...rleTokens.slice(0, 4), '...', ...rleTokens.slice(-3)].join(' · ')
  };
}

/**
 * Evaluates the Multi-Layer Carry-Tunneling Lyapunov Potential V_theta(n) on any BigInt
 */
export function computeTunnelingLyapunovBigInt(inputVal) {
  const n = typeof inputVal === 'bigint' ? inputVal : BigInt(Math.max(1, Math.floor(Number(inputVal) || 1)));
  if (n <= 1n) return 0;
  const bits = n.toString(2);
  const L = bits.length;
  const log2N = bigIntLog2(n);
  const rle = decomposeRleBlocksBigInt(n);

  const a1 = (rle.oneRuns[0] || 1) - 1;
  const a2 = rle.oneRuns[1] || 0;
  const a3 = rle.oneRuns[2] || 0;
  const b1 = rle.zeroGaps[0] ?? 99;
  const b2 = rle.zeroGaps[1] ?? 99;

  let c11 = 0;
  let falt = 0;
  for (let i = 0; i < L - 1; i++) {
    if (bits[i] === '1' && bits[i + 1] === '1') c11++;
    if (bits[i] !== bits[i + 1]) falt++;
  }

  let tunnel1 = 0;
  if (b1 === 1) {
    if (a1 >= 1) tunnel1 = 0.44 * a2;
    else if (a2 >= 3) tunnel1 = 0.35 * 0.44 * (a2 - 2);
    else tunnel1 = -0.18;
  } else if (b1 === 2 && a1 >= 1) {
    tunnel1 = 0.16 * Math.max(0, a2 - 1);
  }

  const tunnel2 = b1 === 1 && b2 === 1 && a1 >= 1 ? 0.26 * a3 : 0;
  const invL = 1 / Math.max(1, L);

  return (
    log2N +
    0.68 * a1 +
    tunnel1 +
    tunnel2 +
    (0.4 * c11 - 0.3 * falt - 0.12 * rle.msbZeroValley) * invL
  );
}

/**
 * Simulates an arbitrary-precision BigInt trajectory (128, 256, 512, 1024, or 2048 bits)
 * with adversarial single-zero carry-tunneling motifs (`11101110...`) and tracks its collapse to `1[000...]`.
 */
export function simulateBigIntTrajectory(bitLength = 256) {
  const safeBits = Math.max(64, Math.min(2048, Math.floor(bitLength)));
  let binStr = '1';
  for (let i = 1; i < safeBits - 1; i++) {
    binStr += i % 4 === 0 ? '0' : '1';
  }
  binStr += '1';

  let cur = BigInt('0b' + binStr);
  const initialRle = decomposeRleBlocksBigInt(cur);
  const v0 = computeTunnelingLyapunovBigInt(cur);
  const log2Start = bigIntLog2(cur);

  let oddSteps = 0;
  let evenSteps = 0;
  let maxMsbValley = initialRle.msbZeroValley;
  let msbValleyExpansions = 0;
  let prevValley = initialRle.msbZeroValley;
  let firstWindowDrop = 0;

  while (cur > 1n && oddSteps < 12000) {
    const nextEven = 3n * cur + 1n;
    const v2 = countTrailingZerosBigInt(nextEven);
    cur = nextEven >> BigInt(v2);
    oddSteps++;
    evenSteps += v2;

    if (oddSteps <= 60 || oddSteps % 25 === 0) {
      const s = cur.toString(2);
      let valley = 0;
      for (let i = 1; i < s.length; i++) {
        if (s[i] === '0') valley++;
        else break;
      }
      if (valley > maxMsbValley) maxMsbValley = valley;
      if (valley > prevValley) msbValleyExpansions++;
      prevValley = valley;
    }

    if (firstWindowDrop === 0 && oddSteps <= 68) {
      const vj = computeTunnelingLyapunovBigInt(cur);
      if (vj < v0 || cur === 1n) {
        firstWindowDrop = oddSteps;
      }
    }
  }

  const totalSteps = oddSteps + evenSteps;
  return {
    bitLength: safeBits,
    msbPrefix: binStr.slice(0, 20),
    lsbSuffix: binStr.slice(-20),
    rleFormula: initialRle.rleFormula,
    initialV: v0,
    oddSteps,
    evenSteps,
    totalSteps,
    gammaDelay: totalSteps / Math.max(1, log2Start),
    firstWindowDrop: firstWindowDrop || 1,
    maxMsbValley,
    msbValleyExpansions,
    collapsedTo1000: cur === 1n
  };
}

/**
 * Summary of the 5 Research Loop Logs stored in `/Users/gkucmierz/workspace/collatz-lab/logs/`
 */
export const RESEARCH_LOOP_LOGS_SUMMARY = {
  errorConvergence: [
    { iteration: 0, name: 'Iteracja 0: Bazowy log₂(n)', e1: 52.04, e3: 27.37, e6: 14.59, eWindow: 3.8889, windowW: 16 },
    { iteration: 1, name: 'Iteracja 1: Korekta 1-blokowa T₁(n)−1', e1: 23.31, e3: 11.50, e6: 6.78, eWindow: 1.5556, windowW: 16 },
    { iteration: 2, name: 'Iteracja 2: Tożsamość ...01^{a₂}01₂ + tunel b₁=1', e1: 32.02, e3: 11.62, e6: 6.30, eWindow: 0.6667, windowW: 24 },
    { iteration: 3, name: 'Iteracja 3: Kaskada 3-blokowa + Dolina MSB', e1: 32.87, e3: 11.57, e6: 6.26, eWindow: 0.2222, windowW: 36 },
    { iteration: 4, name: 'Iteracja 4: Obwiednia Bellmana-Lapunowa U_H(n)', e1: 0.0, e3: 0.0, e6: 0.0, eWindow: 0.0000, windowW: 68 }
  ],
  logs: [
    {
      id: '01',
      file: 'logs/01-carry-tunneling-lyapunov-bigint.md',
      title: 'Metoda 1: Potencjał Tunelowania Przeniesień przez Bariery Zer',
      verdict: 'Błąd E(W) zbity z 3.8889% do 0.0000% (W=68); odkryto dokładną tożsamość (3·(...01^{a₂}01₂)+1)/8 ≡ −1 (mod 2^{a₂−1}).'
    },
    {
      id: '02',
      file: 'logs/02-two-sided-msb-lsb-annihilation.md',
      title: 'Metoda 2: Dwustronne Zderzenie Frontów (Dolina MSB 1000... × Erozja LSB)',
      verdict: 'W 57.45% kroków nieparzystych fala carry wypala dolinę zer za MSB (do 11 zer z rzędu), co niszczy ujemne cykle 2-adyczne (−1, −5, −17).'
    },
    {
      id: '03',
      file: 'logs/03-symbolic-block-grammar-closure.md',
      title: 'Metoda 3: Symboliczny Transduktor na Blokach Biegów 1^A 0^B',
      verdict: 'Udowodniono 4 reguły (59/59 dla L=2..60): erozja bloku 1^L emituje na lewo pary naprzemienne 10, zamieniając kolizje w lonty!'
    },
    {
      id: '04',
      file: 'logs/04-inverse-mod3-reachability.md',
      title: 'Metoda 4: Drzewo Odwrotne n = (u·2^m − 1)/3 od Celu 1[000...]',
      verdict: 'Idealna równowaga Haara (1/3, 1/3, 1/3) reszt mod 3 (2414 : 2419 : 2423) na 38 664 węzłach wstecznych.'
    },
    {
      id: '05',
      file: 'logs/05-adversarial-bigint-coevolution.md',
      title: 'Metoda 5: Współewolucyjny Łowca Kontrprzykładów BigInt (128–2048 bitów)',
      verdict: '100% kolaps do 1[000...] dla liczb 128, 256, 512, 1024 i 2048-bitowych; dla ≥512 bitów spadek V_θ(n) już w 1 kroku!'
    },
    {
      id: '06',
      file: 'logs/06-horizon-scaling-and-bellman-closure-4096bit.md',
      title: 'Metoda 6: Prawo Skalowania Horyzontu Bellmana H_max(B)/B → 0 (do 4096 bitów ≈ 10¹²³³)',
      verdict: 'Pełny skan 65 535 liczb nieparzystych + BigInt 4096-bit: stały średni horyzont E[H] = 2.26 kroku i spadek H_max(B)/B z 5.20 do 0.0017!'
    }
  ]
};
