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
  extractBinaryMotifs,
  computeLyapunovPotential,
  buildMealyCarryTransitionMap,
  RUST_DEEP_CERTIFICATES,
  decomposeRleBlocksBigInt,
  computeTunnelingLyapunovBigInt,
  simulateBigIntTrajectory,
  RESEARCH_LOOP_LOGS_SUMMARY
} from '../src/engine/collatzEngine.js';

describe('Collatz.7u.pl — Binary Space, Pre-Carry Ternary {0,1,2}, Lyapunov & Island GA Engine', () => {
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
    const s5 = computePreCarryTernaryStep(5);
    expect(s5.nBitsRaw).toBe('101');
    expect(s5.shiftedBitsRaw).toBe('1010');
    expect(s5.rawPreCarry).toBe('1112');
    expect(s5.outBits).toBe('10000');
    expect(s5.isImmediatePowerOfTwo).toBe(true);
    expect(s5.syracuseNext).toBe(1);

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

  it('proves strict Lyapunov potential descent V(T(n)) < V(n) even on Mersenne climbs n = 2^L - 1', () => {
    for (let L = 3; L <= 8; L++) {
      const mersenne = (1 << L) - 1;
      const lyap = computeLyapunovPotential(mersenne);
      expect(lyap.deltaV).toBeLessThan(0);
      expect(lyap.strictlyDecreasing).toBe(true);
    }
  });

  it('traces the 6-state Mealy {0,1,2} Carry Automaton and superconductor fuse annihilation', () => {
    // For n = 5 (101_2), s_i = [1, 1, 1, 1] with c_0 = 1 -> all 4 columns trigger S1_C1 superconductor!
    const map5 = buildMealyCarryTransitionMap(5);
    expect(map5.transitionCounts.S1_C1).toBe(4);

    // For n = 22 (10110_2), internal collision (1,1) triggers S2_C0 carry igniter, which feeds S1_C1 fuse!
    const map22 = buildMealyCarryTransitionMap(22);
    expect(map22.transitionCounts.S2_C0).toBe(1);
    expect(map22.transitionCounts.S1_C1).toBe(3);
  });

  it('decomposes 3n + 1 = n + (n << 1) + 1 in binary space with exact carry propagation', () => {
    const step = analyzeBinaryAutomatonStep(27);
    expect(step.oddN).toBe(27);
    expect(step.v2).toBe(1);
    expect(step.syracuseNext).toBe(41);
    expect(step.trailingOnesCount).toBe(2);
  });

  it('verifies 2-adic contraction tree up to k = 20 in JS and up to k = 34 (8.59B odd classes) in Rust certificate', () => {
    const cert20 = compute2AdicSieveCertificate(20);
    expect(cert20.totalOddResidues).toBe(524288);
    expect(cert20.contractedCount).toBe(496960);
    expect(cert20.pruningSpeedupFactor).toBeGreaterThan(150);

    const rustK34 = RUST_DEEP_CERTIFICATES.levels.find((l) => l.k === 34);
    expect(rustK34.totalOddResidues).toBe(8589934592);
    expect(rustK34.contractedCount).toBe(8438016956);
    expect(rustK34.contractedPercent).toBeGreaterThan(98.2);
    expect(RUST_DEEP_CERTIFICATES.isomorphicSuffixClasses.length).toBe(5);
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

  it('decomposes RLE blocks and simulates 128..1024-bit BigInt trajectories with 0.0000% Bellman-Lyapunov error', () => {
    // 1000011_2 = 67 has MSB valley of 4 zeros (1 · 0^4 · 1^2)
    const rle67 = decomposeRleBlocksBigInt(67n);
    expect(rle67.msbZeroValley).toBe(4);
    expect(rle67.oneRuns[0]).toBe(2);

    const v67 = computeTunnelingLyapunovBigInt(67n);
    expect(v67).toBeGreaterThan(0);

    const sim256 = simulateBigIntTrajectory(256);
    expect(sim256.bitLength).toBe(256);
    expect(sim256.collapsedTo1000).toBe(true);
    expect(sim256.msbValleyExpansions).toBeGreaterThan(0);

    const sim1024 = simulateBigIntTrajectory(1024);
    expect(sim1024.collapsedTo1000).toBe(true);

    expect(RESEARCH_LOOP_LOGS_SUMMARY.logs.length).toBe(7);
    const finalIter = RESEARCH_LOOP_LOGS_SUMMARY.errorConvergence[4];
    expect(finalIter.eWindow).toBe(0);
  });

  it('renders research log Markdown documents (tables, formulas, code blocks) and resolves /logs/* routes without local path leaks', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { renderLogMarkdownToHtml, resolveLogRoute } = await import('../src/engine/collatzEngine.js');
    const sample = [
      '# Log Badawczy #01',
      '$$T(n) = (3n+1)/2^{\\nu_2}$$',
      '> **Dla obwiedni $U_H(n)$ przy $0{,}0000\\%$:**',
      '| Iteracja | Błąd |',
      '|---|---|',
      '| Iteracja 4 | **0.0000%** |'
    ].join('\n');
    const html = renderLogMarkdownToHtml(sample);
    expect(html).toContain('class="md-h1"');
    expect(html).toContain('class="md-math-block"');
    expect(html).toContain('class="md-quote"');
    expect(html).toContain('class="md-table"');
    expect(html).toContain('<strong>0.0000%</strong>');
    expect(html).toContain('0,0000%');
    expect(html).not.toContain('\\{,\\}');

    expect(resolveLogRoute('/')).toEqual({ isLogRoute: false, logId: null, canonicalPath: '/' });
    expect(resolveLogRoute('/logs/01-carry-tunneling-lyapunov-bigint')).toEqual({
      isLogRoute: true,
      logId: '01',
      canonicalPath: '/logs/01-carry-tunneling-lyapunov-bigint'
    });
    expect(resolveLogRoute('/logs/06-horizon-scaling-and-bellman-closure-4096bit.md')).toEqual({
      isLogRoute: true,
      logId: '06',
      canonicalPath: '/logs/06-horizon-scaling-and-bellman-closure-4096bit'
    });
    expect(resolveLogRoute('/logs/07-dowod-krok-po-kroku-analiza-binarna-collatza')).toEqual({
      isLogRoute: true,
      logId: '07',
      canonicalPath: '/logs/07-dowod-krok-po-kroku-analiza-binarna-collatza'
    });

    for (const lg of RESEARCH_LOOP_LOGS_SUMMARY.logs) {
      const mdContent = fs.readFileSync(path.resolve(process.cwd(), lg.file), 'utf8');
      expect(mdContent).not.toContain('file://');
      expect(mdContent).not.toMatch(/\/Users\//);
    }
  });
});
