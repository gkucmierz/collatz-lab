/**
 * Collatz.7u.pl — Mathematical, 2-Adic Binary Space & Genetic Algorithm Engine
 *
 * Implements:
 * 1. Exact BigInt hailstone trajectory computation (standard & accelerated Syracuse T(n) = (3n+1)/2^v2)
 * 2. Binary Space cellular automaton decomposition: 3n + 1 = n + (n << 1) + 1 with carry propagation
 * 3. Trailing-1 run-length & Hamming weight (popcount) telemetry
 * 4. Rigorous 2-adic modular sieve mod 2^k contraction verification
 * 5. Genetic Algorithm (Evolutionary Search) over K-bit odd binary chromosomes
 */

export const FAMOUS_SEEDS = [
  { n: 27, label: 'n = 27 (Klasyczny Szczyt 9232, 111 kroków)' },
  { n: 97, label: 'n = 97 (118 kroków)' },
  { n: 871, label: 'n = 871 (178 kroków, szczyt 190 996)' },
  { n: 6171, label: 'n = 6171 (261 kroków, szczyt 975 400)' },
  { n: 77031, label: 'n = 77031 (350 kroków, szczyt 21 933 016)' },
  { n: 837799, label: 'n = 837799 (Rekord < 10⁶: 524 kroki)' }
];

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
    const numVal = val <= 9007199254740991n ? Number(val) : Number(val);

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

  return {
    startN: Number(initialN),
    startBits: initialN.toString(2),
    totalSteps: step,
    oddSteps: oddStepCount,
    evenSteps: evenStepCount,
    glideSteps: droppedBelowInitial ? glideSteps : step,
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
 * showing the exact bit-by-bit cellular automaton rule and carry chain.
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
  // Since 3n + 1 = n + 2n + 1, the initial carry-in at bit 0 is c_0 = 1!
  const carries = new Array(width).fill(0);
  let carry = 1; // +1 in 3n + 1
  for (let i = width - 1; i >= 0; i--) {
    carries[i] = carry;
    const bN = nBits[i] === '1' ? 1 : 0;
    const b2N = shiftBits[i] === '1' ? 1 : 0;
    const sum = bN + b2N + carry;
    carry = sum >= 2 ? 1 : 0;
  }

  return {
    oddN: Number(n),
    nBits,
    shiftBits,
    carries: carries.join(''),
    outBits,
    v2,
    syracuseNext: Number(syracuseNext),
    syracuseNextBits: syracuseNext.toString(2),
    trailingOnesCount: countTrailingOnesBigInt(n)
  };
}

/**
 * Rigorous 2-adic modular sieve mod 2^k (Terras / Garner / Tao parity vector theorem).
 * For each odd residue r in {1, 3, ..., 2^k - 1}, applies up to k steps of
 * T(x) = (3x+1)/2 (when odd) or x/2 (when even).
 * Since the first k parities depend ONLY on r mod 2^k:
 *   T^k(2^k * m + r) = 3^c * m + T^k(r)
 * Whenever 3^c < 2^k (i.e. c/k < ln(2)/ln(3) ≈ 0.63093) at any step m <= k,
 * all sufficiently large integers n ≡ r (mod 2^k) strictly satisfy T^m(n) < n!
 */
export function compute2AdicSieveCertificate(k = 10) {
  const safeK = Math.max(3, Math.min(14, Math.floor(k)));
  const mod = 1 << safeK;
  const totalOddResidues = mod >> 1;
  let contractedCount = 0;
  const survivingResidues = [];
  const sampleClasses = [];

  for (let r = 1; r < mod; r += 2) {
    let val = r;
    let oddCount = 0;
    let contractedAtStep = null;
    const parityVector = [];

    for (let step = 1; step <= safeK; step++) {
      if ((val & 1) === 1) {
        val = (3 * val + 1) / 2;
        oddCount++;
        parityVector.push(1);
      } else {
        val = val / 2;
        parityVector.push(0);
      }
      // Check contraction coefficient: 3^oddCount < 2^step
      if (Math.pow(3, oddCount) < Math.pow(2, step)) {
        contractedAtStep = step;
        break;
      }
    }

    const coeffRatio = Math.pow(3, oddCount) / Math.pow(2, contractedAtStep || safeK);
    if (contractedAtStep !== null) {
      contractedCount++;
    } else if (survivingResidues.length < 24) {
      survivingResidues.push({
        residue: r,
        binary: r.toString(2).padStart(safeK, '0'),
        parityVector: parityVector.join(''),
        oddCount,
        coeffRatio
      });
    }

    if (sampleClasses.length < 12) {
      sampleClasses.push({
        residue: r,
        binary: r.toString(2).padStart(safeK, '0'),
        contracted: contractedAtStep !== null,
        contractedAtStep,
        coeffRatio
      });
    }
  }

  return {
    k: safeK,
    modulus: mod,
    totalOddResidues,
    contractedCount,
    survivingCount: totalOddResidues - contractedCount,
    contractedPercent: (contractedCount / totalOddResidues) * 100,
    survivingResidues,
    sampleClasses
  };
}

/**
 * Genetic Algorithm (Evolutionary Search) in Binary Space {0,1}^K.
 * Evolves K-bit odd integers (MSB = 1, LSB = 1) to discover extremal bit-patterns
 * (e.g., maximum stopping-time ratio σ(n)/K or maximum glide steps).
 */
export function createRandomChromosome(bitLength = 20) {
  const L = Math.max(6, Math.min(48, bitLength));
  let bits = '1';
  for (let i = 1; i < L - 1; i++) {
    bits += Math.random() < 0.55 ? '1' : '0';
  }
  bits += '1';
  return bits;
}

export function evaluateChromosome(bits) {
  const n = BigInt('0b' + bits);
  const traj = computeCollatzTrajectory(n, 2000);
  const bitLen = bits.length;
  const stoppingRatio = traj.totalSteps / Math.max(1, bitLen);
  const glideRatio = traj.glideSteps / Math.max(1, bitLen);

  return {
    bits,
    n: Number(n),
    bitLength: bitLen,
    totalSteps: traj.totalSteps,
    oddSteps: traj.oddSteps,
    glideSteps: traj.glideSteps,
    peakLog2: traj.peakLog2,
    hammingWeight: countOnesBigInt(n),
    trailingOnes: countTrailingOnesBigInt(n),
    fitness: stoppingRatio * 0.7 + glideRatio * 0.3
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
