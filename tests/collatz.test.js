import { describe, it, expect } from 'vitest';
import {
  computeCollatzTrajectory,
  computePreCarryTernaryStep,
  analyzeBinaryAutomatonStep,
  verifyBinaryCarryLemmas,
  compute2AdicSieveCertificate,
  createRandomChromosome,
  evaluateChromosome,
  evolveGeneticGeneration,
  createIslandModelPopulation,
  stepIslandModelGA,
  extractBinaryMotifs
} from '../src/engine/collatzEngine.js';

describe('Collatz.7u.pl — Binary Space, Pre-Carry Ternary {0,1,2} & Island GA Engine', () => {
  it('computes exact trajectory for classic hailstone seed n = 27 (111 steps, peak 9232)', () => {
    const traj = computeCollatzTrajectory(27);
    expect(traj.startN).toBe(27);
    expect(traj.startBits).toBe('11011');
    expect(traj.totalSteps).toBe(111);
    expect(traj.oddSteps).toBe(41);
    expect(traj.evenSteps).toBe(70);
    expect(traj.peakValue).toBe(9232);
    expect(traj.points[traj.points.length - 1].val).toBe(1);
  });

  it('reproduces the exact Pre-Carry Ternary {0,1,2} observations: 101 -> 1112 -> 10000 and 10 -> 111 -> 1222 -> 10110 -> 111211 -> 1000011', () => {
    // 1. Alternating n = 5 (101_2): 1010 + 101 + 1 = 1112 -> 10000_2 (16 = 2^4 -> 1)
    const s5 = computePreCarryTernaryStep(5);
    expect(s5.nBitsRaw).toBe('101');
    expect(s5.shiftedBitsRaw).toBe('1010');
    expect(s5.rawPreCarry).toBe('1112');
    expect(s5.outBits).toBe('10000');
    expect(s5.isImmediatePowerOfTwo).toBe(true);
    expect(s5.syracuseNext).toBe(1);

    // 2. Chain: 10_2 (2) -> 111_2 (7) -> 1222 -> 10110_2 (22) -> 111211 -> 1000011_2 (67)
    const s2 = computePreCarryTernaryStep(2);
    expect(s2.rawPreCarry).toBe('111');
    expect(s2.outBits).toBe('111');

    const s7 = computePreCarryTernaryStep(7);
    expect(s7.rawPreCarry).toBe('1222');
    expect(s7.outBits).toBe('10110');

    const s22 = computePreCarryTernaryStep(22);
    expect(s22.rawPreCarry).toBe('111211');
    expect(s22.outBits).toBe('1000011');
  });

  it('formally verifies the Alternating Ripple-Carry Fuse, Mersenne Erosion, and 2-Adic Haar Drift lemmas', () => {
    const lemmas = verifyBinaryCarryLemmas();
    expect(lemmas.allVerified).toBe(true);
    expect(lemmas.alternatingLemma.verified).toBe(true);
    expect(lemmas.mersenneLemma.verified).toBe(true);
    expect(lemmas.internalFuseChain.verified).toBe(true);
    expect(lemmas.theoreticalDrift).toBeCloseTo(Math.log2(3) - 2, 6);
  });

  it('decomposes 3n + 1 = n + (n << 1) + 1 in binary space with exact carry propagation', () => {
    const step = analyzeBinaryAutomatonStep(27);
    expect(step.oddN).toBe(27);
    expect(step.v2).toBe(1); // 3*27 + 1 = 82 = 2 * 41
    expect(step.syracuseNext).toBe(41);
    expect(step.trailingOnesCount).toBe(2); // 27 = 11011_2 ends with two 1s
  });

  it('verifies 2-adic contraction tree up to k = 20 (524,288 odd residue classes) using branch-and-bound pruning', () => {
    const cert8 = compute2AdicSieveCertificate(8);
    expect(cert8.totalOddResidues).toBe(128);
    expect(cert8.contractedCount).toBeGreaterThan(80);

    const cert20 = compute2AdicSieveCertificate(20);
    expect(cert20.totalOddResidues).toBe(524288);
    expect(cert20.contractedCount).toBeGreaterThan(450000);
    expect(cert20.contractedPercent).toBeGreaterThan(85);
    expect(cert20.pruningSpeedupFactor).toBeGreaterThan(20);
    expect(cert20.irreducibleSuffixes.length).toBeGreaterThan(0);
  });

  it('evolves multi-population Island Model GA and extracts dominant binary motifs', () => {
    const pop = Array.from({ length: 12 }, () => evaluateChromosome(createRandomChromosome(16)));
    const next = evolveGeneticGeneration(pop, { bitLength: 16, mutationRate: 0.1 });
    expect(next.length).toBe(12);
    expect(next[0].fitness).toBeGreaterThanOrEqual(next[next.length - 1].fitness);

    const islands = createIslandModelPopulation({ bitLength: 16, islandCount: 4, islandSize: 6 });
    const evolvedIslands = stepIslandModelGA(islands, { bitLength: 16, migrateEvery: 1 });
    expect(evolvedIslands.length).toBe(4);
    const allMembers = evolvedIslands.flatMap((i) => i.members);
    const motifs = extractBinaryMotifs(allMembers);
    expect(motifs.dominantSuffixes.length).toBeGreaterThan(0);
    expect(motifs.topChampions[0].gammaDelay).toBeGreaterThan(0);
  });
});
