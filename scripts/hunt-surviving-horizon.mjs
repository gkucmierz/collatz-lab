#!/usr/bin/env node
/**
 * Autonomous Symbolic Branch & Horizon Hunter for CollatzProof.lean
 *
 * Traces symbolic affine forms (M * q + R) under classical collatzStep(n)
 * to discover exact unconditional horizon drops (A * q + B < M * q + R for all q >= 0)
 * on the surviving mod 2^k residue classes, and outputs Lean 4 proof obligations.
 */

function traceSymbolicAffine(modPow2, residue, maxSteps = 64) {
  // Represents n_0 = 2^modPow2 * q + residue
  // At step s, if parity of (coeff * q + const) is determined (i.e. coeff is even),
  // we can step symbolically for ALL q >= 0!
  let coeffExp2 = modPow2; // current coefficient is 2^coeffExp2 * 3^coeffExp3
  let coeffExp3 = 0n;
  let constant = BigInt(residue);

  const history = [];

  for (let step = 1; step <= maxSteps; step++) {
    if (coeffExp2 <= 0) {
      // Parity now depends on q%2! Must branch on q = 2*q' vs q = 2*q' + 1
      break;
    }

    const isEven = (constant & 1n) === 0n;
    if (isEven) {
      coeffExp2 -= 1;
      constant = constant / 2n;
      history.push({ step, op: 'even', coeffExp2, coeffExp3: Number(coeffExp3), constant });
    } else {
      coeffExp3 += 1n;
      constant = 3n * constant + 1n;
      history.push({ step, op: 'odd', coeffExp2, coeffExp3: Number(coeffExp3), constant });
    }

    // Check if current affine value (2^coeffExp2 * 3^coeffExp3) * q + constant
    // is strictly less than initial (2^modPow2) * q + residue for all q >= 0:
    const curCoeff = (1n << BigInt(coeffExp2)) * (3n ** coeffExp3);
    const initCoeff = 1n << BigInt(modPow2);
    if (curCoeff < initCoeff && constant < BigInt(residue) && constant > 1n) {
      return {
        contracted: true,
        steps: step,
        initMod: initCoeff.toString(),
        residue: residue.toString(),
        finalCoeff: curCoeff.toString(),
        finalConst: constant.toString(),
        history
      };
    }
  }

  return {
    contracted: false,
    initMod: (1n << BigInt(modPow2)).toString(),
    residue: residue.toString(),
    history
  };
}

function huntLevels(maxBitDepth = 7) {
  let surviving = [7n, 15n, 27n, 31n]; // Surviving classes at mod 32 (2^5)
  console.log(`[Collatz Horizon Hunter] Starting from mod 32 surviving classes: {${surviving.join(', ')}} (4/32 = 12.500%)`);

  for (let k = 6; k <= maxBitDepth; k++) {
    const mod = 1n << BigInt(k);
    const halfMod = 1n << BigInt(k - 1);
    const nextSurviving = [];
    const newlyClosed = [];

    for (const r of surviving) {
      for (const cand of [r, r + halfMod]) {
        const res = traceSymbolicAffine(k, cand, k * 3);
        if (res.contracted) {
          newlyClosed.push(res);
        } else {
          nextSurviving.push(cand);
        }
      }
    }

    const closedCount = mod - BigInt(nextSurviving.length);
    const closedRatio = (Number(closedCount * 1000000n / mod) / 10000).toFixed(4);
    console.log(
      `\n=== Depth k = ${k} (mod ${mod}) ===\n` +
      `  Newly closed infinite families : ${newlyClosed.length}\n` +
      `  Total closed in N              : ${closedCount} / ${mod} (${closedRatio}%)\n` +
      `  Remaining surviving classes    : ${nextSurviving.length} / ${mod}` +
      (nextSurviving.length <= 64 ? ` ({${nextSurviving.join(', ')}})` : '')
    );

    for (const c of newlyClosed.slice(0, 20)) {
      console.log(
        `  [PROVED mod ${c.initMod}] n = ${c.initMod}*k + ${c.residue} --(${c.steps} steps)--> ` +
        `${c.finalCoeff}*k + ${c.finalConst} < ${c.initMod}*k + ${c.residue} (for all k >= 0)`
      );
    }

    surviving = nextSurviving;
  }
  return surviving;
}

function huntInfiniteFamilyForResidue(r0) {
  const r = BigInt(r0);
  let cur = r;
  let evenSteps = 0n;
  let oddSteps = 0n;
  let totalSteps = 0;

  while (true) {
    totalSteps++;
    if ((cur & 1n) === 0n) {
      evenSteps++;
      cur /= 2n;
    } else {
      oddSteps++;
      cur = 3n * cur + 1n;
    }
    const twoK = 1n << evenSteps;
    const threeO = 3n ** oddSteps;
    if (threeO < twoK && cur < r && cur > 1n) {
      return {
        residue: r0,
        bitDepthK: Number(evenSteps),
        stepsM: totalSteps,
        oddSteps: Number(oddSteps),
        finalConst: cur.toString()
      };
    }
  }
}

const targetDepth = Number(process.argv[2] || 12);
huntLevels(targetDepth);

console.log('\n=== Deep Infinite-Family Horizon Contraction for Mersenne Progressions M_p = 2^p - 1 ===');
for (let p = 3; p <= 35; p++) {
  const mp = (1n << BigInt(p)) - 1n;
  const info = huntInfiniteFamilyForResidue(mp);
  console.log(
    `  M_${p} = ${mp}: 2^${info.bitDepthK}*k + ${mp} --(${info.stepsM} steps)--> ` +
    `3^${info.oddSteps}*k + ${info.finalConst} < 2^${info.bitDepthK}*k + ${mp} (Lean 4: checkAffineDrop_sound ${info.stepsM} (2 ^ ${info.bitDepthK}) ${mp})`
  );
}

console.log('\n=== Deep 2-Adic Threshold Levels k = 40, 42, 43 (up to mod 2^43 = 8796093022208) ===');
const deepTargets = { 40: [], 42: [], 43: [] };
for (let r0 = 3; r0 < 50000; r0 += 2) {
  const info = huntInfiniteFamilyForResidue(r0);
  if (deepTargets[info.bitDepthK] && deepTargets[info.bitDepthK].length < 8) {
    deepTargets[info.bitDepthK].push(info);
  }
}
for (const k of [40, 42, 43]) {
  const mod = 1n << BigInt(k);
  console.log(`  [Level k = ${k}, mod ${mod}]: ${deepTargets[k].map((x) => `${x.residue} (${x.stepsM} steps)`).join(', ')}`);
}
