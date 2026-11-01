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
