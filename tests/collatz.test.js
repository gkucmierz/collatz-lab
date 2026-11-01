import { describe, it, expect } from 'vitest';
import {
  computeCollatzTrajectory,
  analyzeBinaryAutomatonStep,
  compute2AdicSieveCertificate,
  createRandomChromosome,
  evaluateChromosome,
  evolveGeneticGeneration
} from '../src/engine/collatzEngine.js';

describe('Collatz.7u.pl — Binary Space & Genetic Engine', () => {
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

  it('decomposes 3n + 1 = n + (n << 1) + 1 in binary space with exact carry propagation', () => {
    const step = analyzeBinaryAutomatonStep(27);
    expect(step.oddN).toBe(27);
    expect(step.v2).toBe(1); // 3*27 + 1 = 82 = 2 * 41
    expect(step.syracuseNext).toBe(41);
    expect(step.trailingOnesCount).toBe(2); // 27 = 11011_2 ends with two 1s
  });

  it('proves contraction for the majority of odd residue classes mod 2^k via 2-adic sieve', () => {
    const cert = compute2AdicSieveCertificate(8);
    expect(cert.totalOddResidues).toBe(128);
    expect(cert.contractedCount).toBeGreaterThan(80);
    expect(cert.contractedPercent).toBeGreaterThan(60);
  });

  it('evolves K-bit odd binary chromosomes via genetic algorithm', () => {
    const pop = Array.from({ length: 12 }, () => evaluateChromosome(createRandomChromosome(16)));
    const next = evolveGeneticGeneration(pop, { bitLength: 16, mutationRate: 0.1 });
    expect(next.length).toBe(12);
    expect(next[0].fitness).toBeGreaterThanOrEqual(next[next.length - 1].fitness);
  });
});
