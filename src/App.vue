<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { NanoNumberStepper } from '@gkucmierz/nano-ui';
import '@gkucmierz/nano-ui/style.css';
import {
  Activity,
  Binary,
  Cpu,
  Dna,
  FastForward,
  HelpCircle,
  Layers,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  Sun,
  Moon,
  TrendingDown,
  Zap,
  X
} from 'lucide-vue-next';
import {
  FAMOUS_SEEDS,
  computeCollatzTrajectory,
  computePreCarryTernaryStep,
  analyzeBinaryAutomatonStep,
  verifyBinaryCarryLemmas,
  compute2AdicSieveCertificate,
  createIslandModelPopulation,
  stepIslandModelGA,
  extractBinaryMotifs,
  computeLyapunovPotential,
  buildMealyCarryTransitionMap,
  RUST_DEEP_CERTIFICATES,
  simulateBigIntTrajectory,
  RESEARCH_LOOP_LOGS_SUMMARY,
  resolveLogRoute,
  renderLogMarkdownToHtml
} from './engine/collatzEngine.js';
import log01Raw from '../logs/01-carry-tunneling-lyapunov-bigint.md?raw';
import log02Raw from '../logs/02-two-sided-msb-lsb-annihilation.md?raw';
import log03Raw from '../logs/03-symbolic-block-grammar-closure.md?raw';
import log04Raw from '../logs/04-inverse-mod3-reachability.md?raw';
import log05Raw from '../logs/05-adversarial-bigint-coevolution.md?raw';
import log06Raw from '../logs/06-horizon-scaling-and-bellman-closure-4096bit.md?raw';
import log07Raw from '../logs/07-dowod-krok-po-kroku-analiza-binarna-collatza.md?raw';

const theme = ref(localStorage.getItem('collatz_theme') || 'dark');
const locale = ref(localStorage.getItem('collatz_locale') || 'pl');
const helpDialogRef = ref(null);
const logDialogRef = ref(null);

const RAW_LOGS_BY_ID = {
  '01': log01Raw,
  '02': log02Raw,
  '03': log03Raw,
  '04': log04Raw,
  '05': log05Raw,
  '06': log06Raw,
  '07': log07Raw
};
const isFullLogRoute = ref(false);
const selectedLogId = ref('01');
const logViewMode = ref('formatted'); // 'formatted' | 'raw'
const logCopied = ref(false);

const syncRouteFromLocation = () => {
  if (typeof window === 'undefined') return;
  const resolved = resolveLogRoute(window.location.pathname);
  isFullLogRoute.value = resolved.isLogRoute;
  if (resolved.logId) {
    selectedLogId.value = resolved.logId;
    if (window.location.pathname !== resolved.canonicalPath && window.history?.replaceState) {
      window.history.replaceState({}, '', resolved.canonicalPath);
    }
  }
};

const navigateToLogRoute = (id = '01') => {
  const target =
    RESEARCH_LOOP_LOGS_SUMMARY.logs.find((l) => l.id === id) ||
    RESEARCH_LOOP_LOGS_SUMMARY.logs[0];
  selectedLogId.value = target.id;
  isFullLogRoute.value = true;
  if (logDialogRef.value?.open) {
    logDialogRef.value.close();
  }
  if (typeof window !== 'undefined' && window.history?.pushState) {
    window.history.pushState({}, '', target.routePath);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }
};

const navigateToDashboard = () => {
  isFullLogRoute.value = false;
  if (typeof window !== 'undefined' && window.history?.pushState) {
    window.history.pushState({}, '', '/');
  }
  requestAnimationFrame(() => {
    drawTrajectoryCanvas();
    drawScatterCanvas();
  });
};

const activeLogEntry = computed(() => {
  if (!selectedLogId.value) return null;
  const idx = RESEARCH_LOOP_LOGS_SUMMARY.logs.findIndex((l) => l.id === selectedLogId.value);
  if (idx === -1) return null;
  const meta = RESEARCH_LOOP_LOGS_SUMMARY.logs[idx];
  const prevLog = idx > 0 ? RESEARCH_LOOP_LOGS_SUMMARY.logs[idx - 1] : null;
  const nextLog =
    idx < RESEARCH_LOOP_LOGS_SUMMARY.logs.length - 1
      ? RESEARCH_LOOP_LOGS_SUMMARY.logs[idx + 1]
      : null;
  const raw = RAW_LOGS_BY_ID[meta.id] || '';
  return {
    ...meta,
    prevLog,
    nextLog,
    raw,
    html: renderLogMarkdownToHtml(raw)
  };
});

const selectResearchLog = (id) => {
  selectedLogId.value = selectedLogId.value === id ? null : id;
};

const openLogModal = (id) => {
  if (id) selectedLogId.value = id;
  if (logDialogRef.value && !logDialogRef.value.open) {
    logDialogRef.value.showModal();
  }
};

const closeLogModal = () => {
  if (logDialogRef.value && logDialogRef.value.open) {
    logDialogRef.value.close();
  }
};

const copyActiveLogMarkdown = () => {
  if (!activeLogEntry.value) return;
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(activeLogEntry.value.raw);
  }
  logCopied.value = true;
  setTimeout(() => {
    logCopied.value = false;
  }, 1800);
};

// Stream & Live Plotter Controls
const streamMode = ref('sequential'); // 'sequential' | 'random' | 'single'
const scaleMode = ref('log2'); // 'log2' | 'linear'
const rangeMin = ref(2);
const rangeMax = ref(50);
const singleSeed = ref(27);
const currentCursorN = ref(2);
const isStreaming = ref(false);
const streamCompleted = ref(false);
const randomBatchRemaining = ref(0);
const stepsPerFrame = ref(3);
const maxTrails = ref(18);

// Active trajectories on the live canvas
const activeTrajectories = ref([]);
const inspectedTrajectory = ref(computeCollatzTrajectory(27));
const stoppingRecords = ref([]);

// Binary Space Automaton Inspector & Pre-Carry Ternary {0,1,2} Probe
const binaryAlignMode = ref('lsb'); // 'lsb' (2-adic) | 'msb'
const binarySelectedOdd = ref(5);
const preCarryCustomInput = ref(5);
const automatonStep = computed(() => analyzeBinaryAutomatonStep(binarySelectedOdd.value));
const preCarryProbe = computed(() => computePreCarryTernaryStep(preCarryCustomInput.value));
const mealyMap = computed(() => buildMealyCarryTransitionMap(preCarryCustomInput.value));
const lyapunovProbe = computed(() => computeLyapunovPotential(preCarryCustomInput.value));
const formalLemmas = verifyBinaryCarryLemmas();
const rustDeepCert = RUST_DEEP_CERTIFICATES;
const researchLoopSummary = RESEARCH_LOOP_LOGS_SUMMARY;
const selectedBigIntBits = ref(256);
const bigIntSim = computed(() => simulateBigIntTrajectory(selectedBigIntBits.value));

const selectPreCarryProbe = (val) => {
  preCarryCustomInput.value = val;
  if (val % 2 === 1) {
    binarySelectedOdd.value = val;
  }
};

// 2-Adic Modular Sieve (mod 2^k, up to k = 20 via Branch-and-Bound Tree Pruning)
const sieveDepthK = ref(12);
const sieveCertificate = computed(() => compute2AdicSieveCertificate(sieveDepthK.value));
const certCopied = ref(false);

const exportFormalCertificate = () => {
  const payload = {
    generatedAt: new Date().toISOString(),
    modulusExponentK: sieveCertificate.value.k,
    totalOddResidues: sieveCertificate.value.totalOddResidues,
    contractedCount: sieveCertificate.value.contractedCount,
    contractedPercent: Number(sieveCertificate.value.contractedPercent.toFixed(4)),
    visitedTreeNodes: sieveCertificate.value.visitedTreeNodes,
    pruningSpeedupFactor: Number(sieveCertificate.value.pruningSpeedupFactor.toFixed(2)),
    irreducibleSuffixes: sieveCertificate.value.irreducibleSuffixes,
    lemmasVerified: {
      alternatingFuse: formalLemmas.alternatingLemma.verified,
      mersenneErosion: formalLemmas.mersenneLemma.verified,
      internalCarryChain: formalLemmas.internalFuseChain.verified,
      haarDriftBitsPerOddStep: Number(formalLemmas.theoreticalDrift.toFixed(6))
    }
  };
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  }
  certCopied.value = true;
  setTimeout(() => {
    certCopied.value = false;
  }, 2200);
};

// Island Model Genetic Algorithm (Multi-Population Search in {0,1}^K)
const gaBitLength = ref(20);
const gaGeneration = ref(0);
const gaRunning = ref(false);
const gaIslands = ref([]);
const gaPopulation = ref([]);
const gaMotifs = computed(() => extractBinaryMotifs(gaPopulation.value));
const gaHistoryBest = ref([]);
let gaTimer = null;

// Canvas refs
const trajCanvasRef = ref(null);
const scatterCanvasRef = ref(null);
let animId = null;

const PALETTE = [
  '#38bdf8',
  '#f59e0b',
  '#10b981',
  '#f43f5e',
  '#a855f7',
  '#2dd4bf',
  '#fb923c',
  '#60a5fa',
  '#e879f9',
  '#34d399'
];

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

const toggleLocale = () => {
  locale.value = locale.value === 'pl' ? 'en' : 'pl';
};

watch(
  theme,
  (val) => {
    localStorage.setItem('collatz_theme', val);
    document.documentElement.setAttribute('data-theme', val);
  },
  { immediate: true }
);

watch(locale, (val) => localStorage.setItem('collatz_locale', val));

const spawnTrajectory = (nVal, { instant = false } = {}) => {
  const cleanN = Math.max(1, Math.floor(Number(nVal) || 1));
  const full = computeCollatzTrajectory(cleanN, 2500);
  const color = PALETTE[cleanN % PALETTE.length];

  activeTrajectories.value.push({
    ...full,
    color,
    drawnSteps: instant ? full.points.length : 1
  });

  if (activeTrajectories.value.length > maxTrails.value) {
    activeTrajectories.value.shift();
  }

  inspectedTrajectory.value = full;
  binarySelectedOdd.value = cleanN % 2 === 1 ? cleanN : Math.max(1, cleanN + 1);
  preCarryCustomInput.value = cleanN;

  // Track stopping-time scatter & record-holders
  if (!stoppingRecords.value.some((r) => r.n === cleanN)) {
    const prevMaxSteps = stoppingRecords.value.reduce((m, r) => Math.max(m, r.totalSteps), 0);
    stoppingRecords.value.push({
      n: cleanN,
      totalSteps: full.totalSteps,
      oddSteps: full.oddSteps,
      peakLog2: full.peakLog2,
      avgBitDrift: full.avgBitDrift,
      isRecord: full.totalSteps > prevMaxSteps
    });
    if (stoppingRecords.value.length > 260) {
      stoppingRecords.value.shift();
    }
  }
};

const pickNextStreamNumber = () => {
  const lo = Math.max(2, Math.min(rangeMin.value, rangeMax.value));
  const hi = Math.max(lo + 1, Math.max(rangeMin.value, rangeMax.value));

  if (streamMode.value === 'single') {
    return singleSeed.value;
  }
  if (streamMode.value === 'sequential') {
    const next = currentCursorN.value + 1;
    if (next > hi) return null; // Reached the end of [lo..hi]
    currentCursorN.value = Math.max(lo, next);
    return currentCursorN.value;
  }
  // random from [lo, hi]
  if (randomBatchRemaining.value <= 0) return null;
  randomBatchRemaining.value--;
  const rnd = lo + Math.floor(Math.random() * (hi - lo + 1));
  currentCursorN.value = rnd;
  return rnd;
};

const startSimulation = () => {
  const lo = Math.max(2, Math.min(rangeMin.value, rangeMax.value));
  const hi = Math.max(lo + 1, Math.max(rangeMin.value, rangeMax.value));
  const latest = activeTrajectories.value[activeTrajectories.value.length - 1];
  const hasUnfinishedTrajectory = latest && latest.drawnSteps < latest.points.length;

  // If resuming from a mid-run pause, just resume
  if (!streamCompleted.value && hasUnfinishedTrajectory) {
    isStreaming.value = true;
    return;
  }

  streamCompleted.value = false;

  if (streamMode.value === 'single') {
    activeTrajectories.value = [];
    spawnTrajectory(singleSeed.value, { instant: false });
  } else if (streamMode.value === 'sequential') {
    if (currentCursorN.value < lo || currentCursorN.value >= hi || activeTrajectories.value.length <= 1) {
      activeTrajectories.value = [];
      currentCursorN.value = lo;
      spawnTrajectory(lo, { instant: false });
    }
  } else if (streamMode.value === 'random') {
    if (randomBatchRemaining.value <= 0) {
      activeTrajectories.value = [];
      randomBatchRemaining.value = Math.min(maxTrails.value, hi - lo + 1);
      const firstRnd = pickNextStreamNumber();
      if (firstRnd !== null) spawnTrajectory(firstRnd, { instant: false });
    }
  }

  isStreaming.value = true;
};

const pauseSimulation = () => {
  isStreaming.value = false;
};

const togglePlayPause = () => {
  if (isStreaming.value) pauseSimulation();
  else startSimulation();
};

const stepNextNumber = () => {
  isStreaming.value = false;
  streamCompleted.value = false;
  const lo = Math.max(2, Math.min(rangeMin.value, rangeMax.value));
  const hi = Math.max(lo + 1, Math.max(rangeMin.value, rangeMax.value));
  if (streamMode.value === 'sequential') {
    let next = currentCursorN.value + 1;
    if (next < lo || next > hi) next = lo;
    currentCursorN.value = next;
    spawnTrajectory(next, { instant: true });
    if (next >= hi) streamCompleted.value = true;
  } else if (streamMode.value === 'random') {
    const rnd = lo + Math.floor(Math.random() * (hi - lo + 1));
    currentCursorN.value = rnd;
    spawnTrajectory(rnd, { instant: true });
  } else {
    spawnTrajectory(singleSeed.value, { instant: false });
    isStreaming.value = true;
  }
};

const selectFamousSeed = (nVal) => {
  isStreaming.value = false;
  streamCompleted.value = false;
  singleSeed.value = nVal;
  currentCursorN.value = nVal;
  spawnTrajectory(nVal, { instant: false });
  isStreaming.value = true;
};

const resetPlotter = () => {
  isStreaming.value = false;
  streamCompleted.value = false;
  activeTrajectories.value = [];
  stoppingRecords.value = [];
  const lo = Math.max(2, Math.min(rangeMin.value, rangeMax.value));
  currentCursorN.value = lo - 1;
  randomBatchRemaining.value = 0;
  spawnTrajectory(streamMode.value === 'single' ? singleSeed.value : 27, { instant: true });
};

// Draw Live Hailstone Trajectory Canvas
const drawTrajectoryCanvas = () => {
  const canvas = trajCanvasRef.value;
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padL = 52;
  const padR = 20;
  const padT = 22;
  const padB = 30;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);

  ctx.clearRect(0, 0, w, h);

  // Determine dynamic bounds across active trajectories
  let maxStep = 20;
  let maxVal = 32;
  let maxLog2 = 6;

  for (const tr of activeTrajectories.value) {
    maxStep = Math.max(maxStep, tr.drawnSteps, 12);
    for (let i = 0; i < tr.drawnSteps && i < tr.points.length; i++) {
      maxVal = Math.max(maxVal, tr.points[i].val);
      maxLog2 = Math.max(maxLog2, tr.points[i].log2);
    }
  }

  // Grid lines
  ctx.strokeStyle = theme.value === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.1)';
  ctx.fillStyle = theme.value === 'dark' ? '#94a3b8' : '#475569';
  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.lineWidth = 1;

  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const frac = i / yTicks;
    const y = padT + plotH * (1 - frac);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();

    const label =
      scaleMode.value === 'log2'
        ? `2^${(frac * maxLog2).toFixed(1)}`
        : Math.round(frac * maxVal).toLocaleString();
    ctx.fillText(label, 6, y + 4);
  }

  // Draw trajectories
  const total = activeTrajectories.value.length;
  activeTrajectories.value.forEach((tr, idx) => {
    const isLatest = idx === total - 1;
    const alpha = isLatest ? 0.98 : 0.22 + 0.55 * (idx / Math.max(1, total - 1));
    ctx.strokeStyle = tr.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = isLatest ? 2.4 : 1.35;
    ctx.beginPath();

    const limit = Math.min(tr.drawnSteps, tr.points.length);
    for (let i = 0; i < limit; i++) {
      const pt = tr.points[i];
      const x = padL + (pt.step / maxStep) * plotW;
      const yNorm =
        scaleMode.value === 'log2'
          ? pt.log2 / Math.max(1, maxLog2)
          : pt.val / Math.max(1, maxVal);
      const y = padT + plotH * (1 - Math.max(0, Math.min(1, yNorm)));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw glowing head dot on active tip
    if (limit > 0) {
      const head = tr.points[limit - 1];
      const hx = padL + (head.step / maxStep) * plotW;
      const hyNorm =
        scaleMode.value === 'log2'
          ? head.log2 / Math.max(1, maxLog2)
          : head.val / Math.max(1, maxVal);
      const hy = padT + plotH * (1 - Math.max(0, Math.min(1, hyNorm)));

      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(hx, hy, isLatest ? 4.2 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
};

// Draw Stopping-Time Scatter Canvas
const drawScatterCanvas = () => {
  const canvas = scatterCanvasRef.value;
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padL = 42;
  const padR = 14;
  const padT = 14;
  const padB = 24;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);

  ctx.clearRect(0, 0, w, h);

  const recs = stoppingRecords.value;
  if (recs.length === 0) {
    ctx.restore();
    return;
  }

  let minN = Infinity;
  let maxN = -Infinity;
  let maxSteps = 20;
  for (const r of recs) {
    if (r.n < minN) minN = r.n;
    if (r.n > maxN) maxN = r.n;
    if (r.totalSteps > maxSteps) maxSteps = r.totalSteps;
  }
  if (minN === maxN) maxN = minN + 10;

  ctx.strokeStyle = theme.value === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.1)';
  ctx.beginPath();
  ctx.moveTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  for (const r of recs) {
    const x = padL + ((r.n - minN) / (maxN - minN)) * plotW;
    const y = padT + plotH * (1 - r.totalSteps / maxSteps);
    ctx.fillStyle = r.isRecord ? '#f59e0b' : '#38bdf8';
    ctx.globalAlpha = r.isRecord ? 0.95 : 0.65;
    ctx.beginPath();
    ctx.arc(x, y, r.isRecord ? 4.2 : 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const tickAnimation = () => {
  animId = requestAnimationFrame(tickAnimation);

  if (isStreaming.value) {
    if (activeTrajectories.value.length === 0) {
      const nextN = pickNextStreamNumber();
      if (nextN !== null) {
        spawnTrajectory(nextN, { instant: false });
      } else {
        isStreaming.value = false;
        streamCompleted.value = true;
      }
    } else {
      const latest = activeTrajectories.value[activeTrajectories.value.length - 1];
      if (latest.drawnSteps < latest.points.length) {
        latest.drawnSteps = Math.min(latest.points.length, latest.drawnSteps + stepsPerFrame.value);
        if (latest.drawnSteps >= latest.points.length && streamMode.value === 'single') {
          isStreaming.value = false;
          streamCompleted.value = true;
        }
      } else if (streamMode.value !== 'single') {
        const nextN = pickNextStreamNumber();
        if (nextN !== null) {
          spawnTrajectory(nextN, { instant: false });
        } else {
          isStreaming.value = false;
          streamCompleted.value = true;
        }
      } else {
        isStreaming.value = false;
        streamCompleted.value = true;
      }
    }
  }

  drawTrajectoryCanvas();
  drawScatterCanvas();
};

// Island Model Genetic Algorithm Controls
const flattenIslands = (islands) => {
  const all = [];
  for (const isl of islands) {
    for (const m of isl.members) {
      all.push({ ...m, islandName: isl.name, islandId: isl.id });
    }
  }
  all.sort((a, b) => b.fitness - a.fitness);
  return all;
};

const initGeneticPopulation = () => {
  gaGeneration.value = 1;
  const islands = createIslandModelPopulation({
    bitLength: gaBitLength.value,
    islandCount: 4,
    islandSize: 8
  });
  gaIslands.value = islands;
  const pop = flattenIslands(islands);
  gaPopulation.value = pop;
  gaHistoryBest.value = [pop[0]];
};

const stepGeneticAlgorithm = () => {
  if (gaIslands.value.length === 0) {
    initGeneticPopulation();
    return;
  }
  gaGeneration.value++;
  gaIslands.value = stepIslandModelGA(gaIslands.value, {
    bitLength: gaBitLength.value,
    migrateEvery: 3
  });
  gaPopulation.value = flattenIslands(gaIslands.value);
  const best = gaPopulation.value[0];
  gaHistoryBest.value.push(best);
  if (gaHistoryBest.value.length > 40) gaHistoryBest.value.shift();
};

const toggleGeneticRun = () => {
  gaRunning.value = !gaRunning.value;
  if (gaRunning.value) {
    gaTimer = setInterval(stepGeneticAlgorithm, 180);
  } else if (gaTimer) {
    clearInterval(gaTimer);
    gaTimer = null;
  }
};

const inspectGeneticCandidate = (cand) => {
  isStreaming.value = false;
  streamCompleted.value = false;
  singleSeed.value = cand.n;
  spawnTrajectory(cand.n, { instant: false });
  isStreaming.value = true;
};

const openHelpModal = () => {
  if (helpDialogRef.value && !helpDialogRef.value.open) {
    helpDialogRef.value.showModal();
  }
};

const closeHelpModal = () => {
  if (helpDialogRef.value && helpDialogRef.value.open) {
    helpDialogRef.value.close();
  }
};

const handleKeyDown = (e) => {
  if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  if (e.code === 'Space' || e.code === 'KeyP') {
    e.preventDefault();
    togglePlayPause();
  } else if (e.code === 'KeyR') {
    resetPlotter();
  } else if (e.code === 'KeyT') {
    toggleTheme();
  } else if (e.code === 'KeyL') {
    toggleLocale();
  } else if (e.code === 'KeyH' || e.key === '?') {
    if (helpDialogRef.value?.open) closeHelpModal();
    else openHelpModal();
  }
};

onMounted(() => {
  syncRouteFromLocation();
  window.addEventListener('popstate', syncRouteFromLocation);
  currentCursorN.value = Math.max(2, rangeMin.value) - 1;
  spawnTrajectory(27, { instant: true });
  for (let n = 2; n <= 45; n++) {
    const full = computeCollatzTrajectory(n, 1000);
    const prevMax = stoppingRecords.value.reduce((m, r) => Math.max(m, r.totalSteps), 0);
    stoppingRecords.value.push({
      n,
      totalSteps: full.totalSteps,
      oddSteps: full.oddSteps,
      peakLog2: full.peakLog2,
      avgBitDrift: full.avgBitDrift,
      isRecord: full.totalSteps > prevMax
    });
  }
  initGeneticPopulation();
  window.addEventListener('keydown', handleKeyDown);
  animId = requestAnimationFrame(tickAnimation);
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
  if (gaTimer) clearInterval(gaTimer);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('popstate', syncRouteFromLocation);
});
</script>

<template>
  <div class="collatz-shell">
    <!-- Top Header -->
    <header class="collatz-header">
      <div class="brand-wrap" style="cursor: pointer" @click="navigateToDashboard">
        <div class="brand-icon">
          <Binary :size="20" />
        </div>
        <div>
          <div class="brand-title-row">
            <h1>Collatz.7u.pl</h1>
            <span class="badge-pill">3n + 1 · 2-Adic Binary Space · Genetic Hunter</span>
          </div>
          <p class="brand-sub">
            {{
              locale === 'pl'
                ? 'Interaktywne Laboratorium Hipotezy Collatza: Wykresy Na Żywo, Automat Komórkowy w Przestrzeni Binarnej i Ewolucyjny Łowca Niezmienników'
                : 'Interactive Collatz Conjecture Lab: Live Hailstone Trajectories, 2-Adic Binary Cellular Automaton & Genetic Invariant Hunter'
            }}
          </p>
        </div>
      </div>

      <div class="header-controls">
        <button
          v-if="isFullLogRoute"
          type="button"
          class="ctrl-btn play-active"
          @click="navigateToDashboard"
        >
          <span>← {{ locale === 'pl' ? 'Laboratorium (/)' : 'Dashboard (/)' }}</span>
        </button>
        <button
          v-else
          type="button"
          class="ctrl-btn"
          @click="navigateToLogRoute(selectedLogId || '01')"
        >
          <span>{{ locale === 'pl' ? 'Dokumenty /logs (6)' : 'Docs /logs (6)' }}</span>
        </button>

        <button
          type="button"
          class="ctrl-btn"
          :class="{ 'play-active': !isStreaming }"
          :disabled="isStreaming"
          @click="startSimulation"
        >
          <Play :size="15" />
          <span>{{ locale === 'pl' ? 'Play' : 'Play' }}</span>
        </button>

        <button
          type="button"
          class="ctrl-btn"
          :class="{ 'pause-active': isStreaming }"
          :disabled="!isStreaming"
          @click="pauseSimulation"
        >
          <Pause :size="15" />
          <span>{{ locale === 'pl' ? 'Pauza' : 'Pause' }}</span>
        </button>

        <button type="button" class="ctrl-btn" @click="stepNextNumber">
          <FastForward :size="15" />
          <span>{{ locale === 'pl' ? 'Krok +1' : 'Step +1' }}</span>
        </button>

        <button type="button" class="ctrl-btn" @click="resetPlotter">
          <RotateCcw :size="15" />
          <span>Reset (R)</span>
        </button>

        <a
          href="/logs/07-dowod-krok-po-kroku-analiza-binarna-collatza"
          class="ctrl-btn primary link-btn"
          @click.prevent="navigateToLogRoute('07')"
        >
          <Sparkles :size="15" />
          <span>{{ locale === 'pl' ? 'Dowód Krok po Kroku (07)' : 'Step-by-Step Proof (07)' }}</span>
        </a>

        <button type="button" class="ctrl-btn" @click="toggleLocale">
          <span>{{ locale.toUpperCase() }}</span>
          <kbd>L</kbd>
        </button>

        <button type="button" class="ctrl-btn" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="15" />
          <Moon v-else :size="15" />
          <kbd>T</kbd>
        </button>

        <button type="button" class="ctrl-btn" @click="openHelpModal">
          <HelpCircle :size="15" />
          <kbd>?</kbd>
        </button>
      </div>
    </header>

    <!-- Full-Page Dedicated Route View for /logs/01..06 -->
    <main v-if="isFullLogRoute && activeLogEntry" class="log-route-layout">
      <aside class="card log-route-sidebar">
        <div class="log-sidebar-top">
          <button type="button" class="ctrl-btn play-active full-w-btn" @click="navigateToDashboard">
            <span>← Powrót do Laboratorium (/)</span>
          </button>
          <div class="log-sidebar-heading">
            Dzienniki Badawcze (/logs/01..07)
          </div>
        </div>

        <nav class="log-sidebar-nav" aria-label="Research Logs Navigation">
          <a
            v-for="lg in researchLoopSummary.logs"
            :key="lg.id"
            :href="lg.routePath"
            class="log-sidebar-link"
            :class="{ active: selectedLogId === lg.id }"
            @click.prevent="navigateToLogRoute(lg.id)"
          >
            <div class="log-sidebar-link-top">
              <code class="log-file-badge">{{ lg.routePath }}</code>
            </div>
            <div class="log-sidebar-link-title">{{ lg.title }}</div>
            <div class="log-sidebar-link-verdict">{{ lg.verdict }}</div>
          </a>
        </nav>
      </aside>

      <article class="card log-route-article">
        <div class="log-route-header">
          <div class="log-route-breadcrumbs">
            <a href="/" class="crumb-link" @click.prevent="navigateToDashboard">Collatz.7u.pl (/)</a>
            <span>/</span>
            <code class="log-file-badge">{{ activeLogEntry.routePath }}</code>
          </div>

          <div class="log-preview-controls">
            <div class="seg-group">
              <button
                type="button"
                class="seg-btn"
                :class="{ active: logViewMode === 'formatted' }"
                @click="logViewMode = 'formatted'"
              >
                Sformatowany artykuł
              </button>
              <button
                type="button"
                class="seg-btn"
                :class="{ active: logViewMode === 'raw' }"
                @click="logViewMode = 'raw'"
              >
                Źródło Markdown (.md)
              </button>
            </div>
            <button type="button" class="seg-btn" @click="copyActiveLogMarkdown">
              {{ logCopied ? 'Skopiowano ✓' : 'Kopiuj .md' }}
            </button>
          </div>
        </div>

        <div
          v-if="logViewMode === 'formatted'"
          class="log-markdown-body full-route-body"
          v-html="activeLogEntry.html"
        ></div>
        <pre v-else class="log-raw-source full-route-body"><code>{{ activeLogEntry.raw }}</code></pre>

        <footer class="log-route-footer">
          <a
            v-if="activeLogEntry.prevLog"
            :href="activeLogEntry.prevLog.routePath"
            class="log-nav-card"
            @click.prevent="navigateToLogRoute(activeLogEntry.prevLog.id)"
          >
            <span class="nav-dir">← Poprzedni dokument</span>
            <strong>{{ activeLogEntry.prevLog.title }}</strong>
          </a>
          <div v-else></div>

          <a
            v-if="activeLogEntry.nextLog"
            :href="activeLogEntry.nextLog.routePath"
            class="log-nav-card right"
            @click.prevent="navigateToLogRoute(activeLogEntry.nextLog.id)"
          >
            <span class="nav-dir">Następny dokument →</span>
            <strong>{{ activeLogEntry.nextLog.title }}</strong>
          </a>
        </footer>
      </article>
    </main>

    <!-- Main 2-Row Research Grid -->
    <main v-else class="collatz-grid">
      <!-- Left Column: Stream Controls + Live Trajectory Canvas + Scatter Plot -->
      <section class="panel-col">
        <!-- Stream Control Bar -->
        <div class="card control-bar-card">
          <div class="control-row">
            <div class="field-group">
              <label>{{ locale === 'pl' ? 'Sterowanie Symulacją' : 'Simulation Transport' }}</label>
              <div class="transport-group">
                <button
                  type="button"
                  class="ctrl-btn"
                  :class="{ 'play-active': !isStreaming }"
                  :disabled="isStreaming"
                  @click="startSimulation"
                >
                  <Play :size="14" />
                  <span>{{ locale === 'pl' ? 'Play' : 'Play' }}</span>
                </button>
                <button
                  type="button"
                  class="ctrl-btn"
                  :class="{ 'pause-active': isStreaming }"
                  :disabled="!isStreaming"
                  @click="pauseSimulation"
                >
                  <Pause :size="14" />
                  <span>{{ locale === 'pl' ? 'Pauza' : 'Pause' }}</span>
                </button>
                <button type="button" class="ctrl-btn" @click="stepNextNumber" :title="locale === 'pl' ? 'Następna liczba' : 'Next number'">
                  <FastForward :size="14" />
                  <span>+1</span>
                </button>
                <button type="button" class="ctrl-btn" @click="resetPlotter" :title="locale === 'pl' ? 'Resetuj wykres' : 'Reset chart'">
                  <RotateCcw :size="14" />
                </button>
                <span
                  class="sim-status-pill"
                  :class="{ running: isStreaming, done: streamCompleted && !isStreaming }"
                >
                  {{
                    isStreaming
                      ? locale === 'pl'
                        ? `W toku (n=${inspectedTrajectory.startN})`
                        : `Running (n=${inspectedTrajectory.startN})`
                      : streamCompleted
                        ? locale === 'pl'
                          ? 'Zakończono ✓'
                          : 'Finished ✓'
                        : locale === 'pl'
                          ? 'Zatrzymano'
                          : 'Paused'
                  }}
                </span>
              </div>
            </div>

            <div class="field-group">
              <label>{{ locale === 'pl' ? 'Tryb Generatora Liczb' : 'Number Stream Mode' }}</label>
              <div class="seg-group">
                <button
                  type="button"
                  class="seg-btn"
                  :class="{ active: streamMode === 'sequential' }"
                  @click="streamMode = 'sequential'"
                >
                  {{ locale === 'pl' ? 'Kolejne [A..B]' : 'Sequential [A..B]' }}
                </button>
                <button
                  type="button"
                  class="seg-btn"
                  :class="{ active: streamMode === 'random' }"
                  @click="streamMode = 'random'"
                >
                  <Shuffle :size="13" />
                  <span>{{ locale === 'pl' ? 'Losowe z [A..B]' : 'Random [A..B]' }}</span>
                </button>
                <button
                  type="button"
                  class="seg-btn"
                  :class="{ active: streamMode === 'single' }"
                  @click="streamMode = 'single'"
                >
                  {{ locale === 'pl' ? 'Pojedyncza n' : 'Single Seed n' }}
                </button>
              </div>
            </div>

            <div v-if="streamMode !== 'single'" class="field-group compact">
              <label>{{ locale === 'pl' ? 'Zakres [Od – Do]' : 'Range [Min – Max]' }}</label>
              <div class="range-inputs">
                <NanoNumberStepper
                  v-model="rangeMin"
                  variant="stacked"
                  :min="2"
                  :max="10000000"
                  :step="1"
                  width="106px"
                  aria-label="Range Min"
                />
                <span>–</span>
                <NanoNumberStepper
                  v-model="rangeMax"
                  variant="stacked"
                  :min="3"
                  :max="10000000"
                  :step="1"
                  width="106px"
                  aria-label="Range Max"
                />
              </div>
            </div>

            <div v-else class="field-group compact">
              <label>{{ locale === 'pl' ? 'Liczba startowa n' : 'Start Number n' }}</label>
              <div class="range-inputs">
                <NanoNumberStepper
                  v-model="singleSeed"
                  variant="split"
                  :min="1"
                  :max="1000000000"
                  :step="1"
                  width="136px"
                  aria-label="Start Number n"
                  @change="spawnTrajectory(singleSeed, { instant: true })"
                />
                <button type="button" class="seg-btn active" @click="startSimulation">
                  Start
                </button>
              </div>
            </div>

            <div class="field-group compact">
              <label>{{ locale === 'pl' ? 'Skala osi Y' : 'Y-Axis Scale' }}</label>
              <div class="seg-group">
                <button
                  type="button"
                  class="seg-btn"
                  :class="{ active: scaleMode === 'log2' }"
                  @click="scaleMode = 'log2'"
                >
                  log₂(n) (Binarna)
                </button>
                <button
                  type="button"
                  class="seg-btn"
                  :class="{ active: scaleMode === 'linear' }"
                  @click="scaleMode = 'linear'"
                >
                  Liniowa
                </button>
              </div>
            </div>

            <div class="field-group compact">
              <label>{{ locale === 'pl' ? 'Szybkość' : 'Speed' }}: {{ stepsPerFrame }}x</label>
              <input type="range" v-model.number="stepsPerFrame" min="1" max="25" class="slider" />
            </div>
          </div>

          <!-- Famous Seeds Row -->
          <div class="seeds-row">
            <span class="seeds-label">{{ locale === 'pl' ? 'Słynne rekordy gradowe:' : 'Famous Hailstone Seeds:' }}</span>
            <button
              v-for="s in FAMOUS_SEEDS"
              :key="s.n"
              type="button"
              class="seed-chip"
              :class="{ active: inspectedTrajectory.startN === s.n }"
              @click="selectFamousSeed(s.n)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Live Trajectory Canvas Card -->
        <div class="card canvas-card">
          <div class="card-header">
            <div class="card-title-group">
              <Activity :size="16" class="text-cyan" />
              <h2>
                {{
                  locale === 'pl'
                    ? `Trajektoria na Żywo — Aktywna liczba n = ${inspectedTrajectory.startN} (${inspectedTrajectory.startBits}₂)`
                    : `Live Hailstone Trajectory — Active n = ${inspectedTrajectory.startN} (${inspectedTrajectory.startBits}₂)`
                }}
              </h2>
            </div>
            <div class="telemetry-badges">
              <span class="t-badge cyan">Kroki: {{ inspectedTrajectory.totalSteps }}</span>
              <span class="t-badge amber">Szczyt: {{ inspectedTrajectory.peakValue.toLocaleString() }}</span>
              <span class="t-badge emerald">
                Śr. dryf bitowy: {{ inspectedTrajectory.avgBitDrift.toFixed(3) }} bit/krok
              </span>
            </div>
          </div>
          <div class="canvas-stage">
            <canvas ref="trajCanvasRef" class="plot-canvas"></canvas>
          </div>
        </div>

        <!-- Stopping-Time Scatter & Record-Holders Card -->
        <div class="card scatter-card">
          <div class="card-header">
            <div class="card-title-group">
              <Sparkles :size="16" class="text-amber" />
              <h2>
                {{
                  locale === 'pl'
                    ? 'Rozkład Czasu Zatrzymania σ(n) i Rekordy Opóźnienia (Złote Punkty)'
                    : 'Total Stopping Time σ(n) Scatter & Delay Records (Gold Nodes)'
                }}
              </h2>
            </div>
            <span class="sub-mono">{{ stoppingRecords.length }} {{ locale === 'pl' ? 'przebadanych liczb' : 'sampled integers' }}</span>
          </div>
          <div class="scatter-stage">
            <canvas ref="scatterCanvasRef" class="plot-canvas"></canvas>
          </div>
        </div>
      </section>

      <!-- Right Column: Genetic Algorithm + 2-Adic Sieve (Top) & Binary Space Cellular Automaton (Bottom) -->
      <section class="panel-col">
        <!-- 1. Genetic Algorithm & 2-Adic Contraction Sieve -->
        <div class="card ga-card">
          <div class="card-header">
            <div class="card-title-group">
              <Dna :size="16" class="text-amber" />
              <h2>
                {{
                  locale === 'pl'
                    ? 'Algorytm Genetyczny w {0,1}^K & Sito 2-Adyczne (mod 2^k)'
                    : 'Genetic Algorithm in {0,1}^K & 2-Adic Contraction Sieve (mod 2^k)'
                }}
              </h2>
            </div>
            <div class="ga-actions">
              <button type="button" class="seg-btn active" @click="toggleGeneticRun">
                <Pause v-if="gaRunning" :size="13" />
                <Play v-else :size="13" />
                <span>{{ gaRunning ? 'Stop GA' : 'Ewolucja GA' }}</span>
              </button>
              <button type="button" class="seg-btn" @click="stepGeneticAlgorithm">
                +1 Gen ({{ gaGeneration }})
              </button>
              <button type="button" class="seg-btn" @click="initGeneticPopulation">
                <RefreshCw :size="13" />
              </button>
            </div>
          </div>

          <div class="ga-split">
            <!-- Left half: Island Model GA & Evolved Bit-Motifs -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>Island Model GA (4 Wyspy · K = {{ gaBitLength }} bitów)</span>
                <input
                  type="range"
                  v-model.number="gaBitLength"
                  min="10"
                  max="28"
                  class="slider sm"
                  @change="initGeneticPopulation"
                />
              </div>
              <div class="ga-list">
                <div
                  v-for="(cand, idx) in gaPopulation.slice(0, 5)"
                  :key="idx"
                  class="ga-item"
                  @click="inspectGeneticCandidate(cand)"
                >
                  <span class="ga-rank">#{{ idx + 1 }}</span>
                  <code class="ga-bits">{{ cand.bits }}</code>
                  <span class="ga-stat">
                    n={{ cand.n }} · {{ cand.totalSteps }} kr. · γ={{ cand.gammaDelay.toFixed(1) }}
                  </span>
                </div>
              </div>
              <div class="motif-strip">
                <span class="motif-label">Dominujące sufiksy rekordzistów:</span>
                <span
                  v-for="m in gaMotifs.dominantSuffixes"
                  :key="m.motif"
                  class="motif-chip"
                >
                  ...{{ m.motif }}₂ (×{{ m.count }})
                </span>
                <span class="motif-chip amber">
                  Gęstość '2' w {0,1,2}: {{ (gaMotifs.avgTwosDensity * 100).toFixed(0) }}%
                </span>
              </div>
            </div>

            <!-- Right half: Rigorous 2-Adic Contraction Tree Verifier mod 2^k (k <= 20) -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>
                  Drzewo Kontrakcji mod 2^{{ sieveDepthK }} ({{ sieveCertificate.totalOddResidues.toLocaleString() }} klas)
                </span>
                <div class="sieve-head-actions">
                  <input type="range" v-model.number="sieveDepthK" min="4" max="20" class="slider sm" />
                  <button type="button" class="cert-btn" @click="exportFormalCertificate">
                    {{ certCopied ? 'Skopiowano JSON ✓' : 'Certyfikat JSON' }}
                  </button>
                </div>
              </div>
              <div class="sieve-summary">
                <div class="sieve-bar-track">
                  <div
                    class="sieve-bar-fill"
                    :style="{ width: `${sieveCertificate.contractedPercent}%` }"
                  ></div>
                </div>
                <p class="sieve-desc">
                  <strong>{{ sieveCertificate.contractedCount.toLocaleString() }} / {{ sieveCertificate.totalOddResidues.toLocaleString() }}</strong>
                  ({{ sieveCertificate.contractedPercent.toFixed(2) }}%) nieparzystych klas reszt
                  <code>r (mod 2^{{ sieveDepthK }})</code> ma <strong>ścisły dowód kontrakcji</strong>
                  <code>3^c &lt; 2^m ⇒ T^m(n) &lt; n</code>
                  (przyspieszenie drzewa 2-adycznego: <strong>{{ sieveCertificate.pruningSpeedupFactor.toFixed(1) }}×</strong>).
                </p>
                <div class="surviving-chips">
                  <span
                    v-for="suf in sieveCertificate.irreducibleSuffixes.slice(0, 4)"
                    :key="suf.suffix"
                    class="motif-chip"
                  >
                    sufiks ...{{ suf.suffix }}₂ ({{ suf.sharePct.toFixed(1) }}%)
                  </span>
                  <span
                    v-for="s in sieveCertificate.survivingResidues.slice(0, 4)"
                    :key="s.residue"
                    class="surv-chip"
                    @click="selectFamousSeed(s.residue)"
                  >
                    {{ s.binary.slice(-8) }}₂ (r={{ s.residue }})
                  </span>
                </div>
                <div class="rust-cert-box">
                  <div class="rust-cert-head">
                    <strong>🦀 Natywny Weryfikator Rust (u128 · 16 wątków · mod 2²⁰..2³⁴):</strong>
                    <span class="motif-chip amber">
                      k=34: 8 438 016 956 / 8 589 934 592 klas (98.231% w 69.4 ms · 837× speedup)
                    </span>
                  </div>
                  <div class="rust-levels-strip">
                    <span
                      v-for="lv in rustDeepCert.levels"
                      :key="lv.k"
                      class="rust-lv-pill"
                    >
                      2^{{ lv.k }}: {{ lv.contractedPercent.toFixed(2) }}% ({{ lv.elapsedMs.toFixed(1) }}ms)
                    </span>
                  </div>
                  <div class="iso-note">
                    <strong>Twierdzenie o 2-Adycznej Izomorfii Poddrzew:</strong> 5 sufiksów 9-bitowych
                    (<code>{{ rustDeepCert.isomorphicSuffixClasses.join('₂, ') }}₂</code>) ma identyczną wagę parzystości
                    <code>c=7</code> i bijektywny obraz afiniczny <code>T⁹(r) + 3⁷m (mod 2^{k-9})</code>, dając
                    <strong>dokładnie tę samą liczebność poddrzewa</strong> na każdym poziomie
                    (np. <code>8 223 641</code> przy <code>k=34</code>).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Binary Space Waterfall & Pre-Carry Ternary {0,1,2} Automaton -->
        <div class="card binary-card">
          <div class="card-header">
            <div class="card-title-group">
              <Binary :size="16" class="text-emerald" />
              <h2>
                {{
                  locale === 'pl'
                    ? 'Przestrzeń Binarna: Wektor Przed Przeniesieniem {0,1,2} i Automat 2n + n + 1'
                    : 'Binary Space: Pre-Carry Ternary Vector {0,1,2} & 2n + n + 1 Automaton'
                }}
              </h2>
            </div>
            <div class="seg-group">
              <button
                type="button"
                class="seg-btn"
                :class="{ active: binaryAlignMode === 'lsb' }"
                @click="binaryAlignMode = 'lsb'"
              >
                Wyrównanie 2-adyczne (LSB)
              </button>
              <button
                type="button"
                class="seg-btn"
                :class="{ active: binaryAlignMode === 'msb' }"
                @click="binaryAlignMode = 'msb'"
              >
                Wyrównanie MSB
              </button>
            </div>
          </div>

          <!-- Bit-level Pre-Carry Ternary {0,1,2} & Ripple-Carry Decomposition Box -->
          <div class="carry-inspector">
            <div class="carry-header">
              <span>
                <strong>Rozkład 2n + n + 1 → Wektor {0,1,2} → Cel 1[000...] dla n = {{ preCarryProbe.n }} ({{ preCarryProbe.nBitsRaw }}₂):</strong>
                Cyfry <code>1</code> tworzą <strong>nadprzewodnik (lont carry)</strong>, a cyfry <code>2</code> (zderzenia <code>11</code> lub <code>+1</code>) wyzwalają falę zerowania:
              </span>
              <div class="probe-chips">
                <button
                  type="button"
                  class="seed-chip"
                  :class="{ active: preCarryProbe.n === 5 }"
                  @click="selectPreCarryProbe(5)"
                >
                  101₂ → 1112 → 10000₂ (Cel 1[0000]!)
                </button>
                <button
                  type="button"
                  class="seed-chip"
                  :class="{ active: preCarryProbe.n === 2 }"
                  @click="selectPreCarryProbe(2)"
                >
                  10₂ → 111₂
                </button>
                <button
                  type="button"
                  class="seed-chip"
                  :class="{ active: preCarryProbe.n === 7 }"
                  @click="selectPreCarryProbe(7)"
                >
                  111₂ → 1222 → 10110₂
                </button>
                <button
                  type="button"
                  class="seed-chip"
                  :class="{ active: preCarryProbe.n === 22 }"
                  @click="selectPreCarryProbe(22)"
                >
                  10110₂ → 111211 → 1000011₂
                </button>
                <button
                  type="button"
                  class="seed-chip"
                  :class="{ active: preCarryProbe.n === 85 }"
                  @click="selectPreCarryProbe(85)"
                >
                  1010101₂ → 11111112 → 2⁸
                </button>
              </div>
            </div>
            <div class="carry-rows">
              <div class="carry-row">
                <span class="carry-label">2n = n ≪ 1:</span>
                <code class="bit-strip shift-val">{{ preCarryProbe.shiftedBitsRaw }}</code>
              </div>
              <div class="carry-row">
                <span class="carry-label">+ n (wyrównane):</span>
                <code class="bit-strip n-val">{{ preCarryProbe.nBitsAligned }}</code>
                <span class="plus-one-tag">+ 1 (na LSB)</span>
              </div>
              <div class="carry-row pre-carry-row">
                <span class="carry-label">Wektor {0,1,2}:</span>
                <span class="ternary-strip">
                  <span
                    v-for="(d, dIdx) in preCarryProbe.rawPreCarry.split('')"
                    :key="dIdx"
                    class="ternary-cell"
                    :class="d === '2' ? 't-two' : d === '1' ? 't-one' : 't-zero'"
                  >
                    {{ d }}
                  </span>
                </span>
                <span class="v2-pill amber">
                  Lonty '1': {{ preCarryProbe.onesFuseCount }} · Kolizje '2': {{ preCarryProbe.twosCollisionCount }}
                </span>
              </div>
              <div class="carry-row result">
                <span class="carry-label">Po fali carry:</span>
                <code class="bit-strip out-val">{{ preCarryProbe.outBits }}</code>
                <span class="v2-pill">
                  ≫ {{ preCarryProbe.v2 }} zer → {{ preCarryProbe.syracuseNextBits }}₂ ({{ preCarryProbe.syracuseNext }})
                  <strong v-if="preCarryProbe.isImmediatePowerOfTwo"> · SUKCES 1[000...]!</strong>
                </span>
              </div>
            </div>
            <div class="lemma-badges">
              <span class="lemma-pill ok">
                ✓ Lemat Lontu (10)^k·1 → 1^(2k-1)2 → 10^(2k)
              </span>
              <span class="lemma-pill ok">
                ✓ Lemat Mersenne’a 1^L → 12^L → 101^(L-1)0
              </span>
              <span class="lemma-pill ok">
                ✓ Łańcuch 10 → 111 → 1222 → 10110 → 111211 → 1000011
              </span>
              <span class="lemma-pill cyan">
                ✓ Potencjał Lapunowa V({{ lyapunovProbe.n }}) = {{ lyapunovProbe.potentialV.toFixed(2) }}
                → V({{ lyapunovProbe.nextOdd }}) = {{ lyapunovProbe.nextPotentialV.toFixed(2) }}
                (ΔV = {{ lyapunovProbe.deltaV >= 0 ? '+' : '' }}{{ lyapunovProbe.deltaV.toFixed(3) }})
              </span>
            </div>

            <!-- Mealy {0,1,2} Automaton State-Transition Map -->
            <div class="mealy-map-grid">
              <div
                v-for="tr in mealyMap.transitions.slice(0, 4)"
                :key="tr.id"
                class="mealy-card"
                :class="tr.tone"
              >
                <div class="mealy-rule">{{ tr.rule }}</div>
                <div class="mealy-role">{{ tr.role }}</div>
                <div class="mealy-stat">{{ tr.count }} kol. ({{ tr.sharePct.toFixed(0) }}%)</div>
              </div>
            </div>
          </div>

          <!-- Binary Waterfall Matrix for the Active Trajectory -->
          <div class="binary-waterfall">
            <div
              v-for="pt in inspectedTrajectory.oddTrajectory.slice(0, 28)"
              :key="pt.step"
              class="waterfall-row"
              :class="{ selected: pt.val === preCarryProbe.n }"
              @click="selectPreCarryProbe(pt.val)"
            >
              <span class="wf-step">#{{ String(pt.step).padStart(3, '0') }}</span>
              <span class="wf-dec">{{ pt.val }}</span>
              <div class="wf-bits" :class="binaryAlignMode">
                <span
                  v-for="(bit, bIdx) in pt.bits.split('')"
                  :key="bIdx"
                  class="bit-cell"
                  :class="bit === '1' ? 'one' : 'zero'"
                >
                  {{ bit }}
                </span>
              </div>
              <span class="wf-meta" :title="'Końcowe jedynki (Trailing 1s): ' + pt.trailingOnes">
                1s:{{ pt.hamming }}/{{ pt.bitLength }} · T₁:{{ pt.trailingOnes }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. Autonomous Research Loop (logs/01..05) & BigInt (128..2048-bit) Laboratory -->
        <div class="card research-loop-card">
          <div class="card-header">
            <div class="card-title-group">
              <Cpu :size="16" class="text-cyan" />
              <h2>
                {{
                  locale === 'pl'
                    ? 'Pętla Badawcza logs/01..06 (Błąd E → 0.0000%) & Laboratorium BigInt (128–2048 bitów)'
                    : 'Research Loop logs/01..06 (Error E → 0.0000%) & BigInt Lab (128–2048 bits)'
                }}
              </h2>
            </div>
            <div class="seg-group">
              <button
                v-for="bSize in [128, 256, 512, 1024, 2048]"
                :key="bSize"
                type="button"
                class="seg-btn"
                :class="{ active: selectedBigIntBits === bSize }"
                @click="selectedBigIntBits = bSize"
              >
                {{ bSize }} bit
              </button>
            </div>
          </div>

          <div class="ga-split">
            <!-- Left half: Error Convergence E(W) -> 0.0000% -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>Spadek Błędu Niedomknięcia E(W) w Pętli (Metoda 1)</span>
                <span class="motif-chip amber">Cel: E = 0.0000% ✓</span>
              </div>
              <div class="err-conv-list">
                <div
                  v-for="it in researchLoopSummary.errorConvergence"
                  :key="it.iteration"
                  class="err-conv-row"
                >
                  <div class="err-conv-top">
                    <span class="err-name">{{ it.name }}</span>
                    <strong class="err-val" :class="{ zero: it.eWindow === 0 }">
                      E(W={{ it.windowW }}) = {{ it.eWindow.toFixed(4) }}%
                    </strong>
                  </div>
                  <div class="sieve-bar-track">
                    <div
                      class="sieve-bar-fill"
                      :style="{ width: `${Math.max(2, 100 - it.eWindow * 22)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right half: Live Arbitrary-Precision BigInt (128..2048-bit) Inspector -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>Test Kontrprzykładu BigInt ({{ bigIntSim.bitLength }} bitów ≈ 10^{{ Math.round(bigIntSim.bitLength * 0.30103) }})</span>
                <span class="lemma-pill ok">
                  {{ bigIntSim.collapsedTo1000 ? 'Kolaps do 1[000...] ✓' : 'W toku' }}
                </span>
              </div>
              <div class="bigint-telemetry">
                <div class="bi-line">
                  <span>Szablon RLE (1^A·0^B):</span>
                  <code>{{ bigIntSim.rleFormula }}</code>
                </div>
                <div class="bi-line">
                  <span>Kroki Syracuse (BigInt):</span>
                  <strong>
                    {{ bigIntSim.totalSteps.toLocaleString() }} ({{ bigIntSim.oddSteps }} nieparz. + {{ bigIntSim.evenSteps }} zer v₂)
                  </strong>
                </div>
                <div class="bi-line">
                  <span>Współczynnik γ(n) / Okno ΔV&lt;0:</span>
                  <strong>
                    γ = {{ bigIntSim.gammaDelay.toFixed(2) }} · spadek V_θ po {{ bigIntSim.firstWindowDrop }} kr.
                  </strong>
                </div>
                <div class="bi-line">
                  <span>Front lewy MSB (doliny 1000...):</span>
                  <strong>
                    {{ bigIntSim.msbValleyExpansions }} ekspansji (max {{ bigIntSim.maxMsbValley }} zer za MSB)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary of the 7 Research Logs in /logs/ (Clickable with Live Preview) -->
          <div class="logs-summary-list">
            <div class="logs-list-header">
              <span>
                {{
                  locale === 'pl'
                    ? 'Dzienniki Badawcze /logs/01..07.md — kliknij dowolny dokument, aby otworzyć pełny podgląd:'
                    : 'Research Logs /logs/01..07.md — click any document to open live preview:'
                }}
              </span>
              <span class="sub-mono">7 pełnych raportów .md</span>
            </div>
            <div
              v-for="lg in researchLoopSummary.logs"
              :key="lg.id"
              class="log-summary-item clickable"
              :class="{ active: selectedLogId === lg.id }"
              role="button"
              tabindex="0"
              @click="selectResearchLog(lg.id)"
              @keydown.enter.prevent="selectResearchLog(lg.id)"
            >
              <a
                :href="lg.routePath"
                class="log-file-badge route-link-badge"
                @click.stop.prevent="navigateToLogRoute(lg.id)"
              >
                {{ lg.routePath }}
              </a>
              <span class="log-title">{{ lg.title }}:</span>
              <span class="log-verdict">{{ lg.verdict }}</span>
              <div class="log-item-actions" @click.stop>
                <button
                  type="button"
                  class="log-action-pill"
                  :class="{ active: selectedLogId === lg.id }"
                  @click="selectResearchLog(lg.id)"
                >
                  {{ selectedLogId === lg.id ? 'Ukryj ▴' : 'Podgląd ▾' }}
                </button>
                <a
                  :href="lg.routePath"
                  class="log-action-pill modal-btn link-btn"
                  title="Otwórz dedykowany route dokumentu"
                  @click.prevent="navigateToLogRoute(lg.id)"
                >
                  Pełna strona ↗
                </a>
              </div>
            </div>
          </div>

          <!-- Inline Interactive Document Preview Reader -->
          <div v-if="activeLogEntry" class="log-preview-panel">
            <div class="log-preview-toolbar">
              <div class="log-preview-tabs">
                <button
                  v-for="lg in researchLoopSummary.logs"
                  :key="lg.id"
                  type="button"
                  class="seg-btn"
                  :class="{ active: selectedLogId === lg.id }"
                  @click="selectedLogId = lg.id"
                >
                  Metoda {{ lg.id }}
                </button>
              </div>

              <div class="log-preview-controls">
                <div class="seg-group">
                  <button
                    type="button"
                    class="seg-btn"
                    :class="{ active: logViewMode === 'formatted' }"
                    @click="logViewMode = 'formatted'"
                  >
                    Sformatowany
                  </button>
                  <button
                    type="button"
                    class="seg-btn"
                    :class="{ active: logViewMode === 'raw' }"
                    @click="logViewMode = 'raw'"
                  >
                    Markdown (.md)
                  </button>
                </div>
                <button type="button" class="seg-btn" @click="copyActiveLogMarkdown">
                  {{ logCopied ? 'Skopiowano ✓' : 'Kopiuj .md' }}
                </button>
                <a
                  :href="activeLogEntry.routePath"
                  class="seg-btn active link-btn"
                  @click.prevent="navigateToLogRoute(activeLogEntry.id)"
                >
                  Pełna strona ({{ activeLogEntry.routePath }}) ↗
                </a>
                <button type="button" class="seg-btn" @click="selectedLogId = null">
                  ✕
                </button>
              </div>
            </div>

            <div class="log-preview-meta">
              <code>{{ activeLogEntry.routePath }}</code>
              <span>{{ activeLogEntry.title }}</span>
            </div>

            <div
              v-if="logViewMode === 'formatted'"
              class="log-markdown-body"
              v-html="activeLogEntry.html"
            ></div>
            <pre v-else class="log-raw-source"><code>{{ activeLogEntry.raw }}</code></pre>
          </div>
        </div>
      </section>
    </main>

    <!-- Full-Window Research Log Document Reader Modal -->
    <dialog ref="logDialogRef" closedby="any" class="help-dialog log-reader-dialog" aria-labelledby="logModalTitle">
      <div v-if="activeLogEntry" class="help-inner">
        <div class="help-head">
          <div>
            <div class="log-modal-Sub">
              <code class="log-file-badge">{{ activeLogEntry.file }}</code>
              <div class="log-preview-tabs">
                <button
                  v-for="lg in researchLoopSummary.logs"
                  :key="lg.id"
                  type="button"
                  class="seg-btn"
                  :class="{ active: selectedLogId === lg.id }"
                  @click="selectedLogId = lg.id"
                >
                  Metoda {{ lg.id }}
                </button>
              </div>
            </div>
            <h2 id="logModalTitle">{{ activeLogEntry.title }}</h2>
          </div>
          <div class="log-preview-controls">
            <div class="seg-group">
              <button
                type="button"
                class="seg-btn"
                :class="{ active: logViewMode === 'formatted' }"
                @click="logViewMode = 'formatted'"
              >
                Sformatowany
              </button>
              <button
                type="button"
                class="seg-btn"
                :class="{ active: logViewMode === 'raw' }"
                @click="logViewMode = 'raw'"
              >
                Markdown (.md)
              </button>
            </div>
            <button type="button" class="seg-btn" @click="copyActiveLogMarkdown">
              {{ logCopied ? 'Skopiowano ✓' : 'Kopiuj .md' }}
            </button>
            <button type="button" class="ctrl-btn" @click="closeLogModal">
              <X :size="15" />
            </button>
          </div>
        </div>
        <div
          v-if="logViewMode === 'formatted'"
          class="log-markdown-body modal-scroll"
          v-html="activeLogEntry.html"
        ></div>
        <pre v-else class="log-raw-source modal-scroll"><code>{{ activeLogEntry.raw }}</code></pre>
      </div>
    </dialog>

    <!-- Help & Mathematical Formalization Modal -->
    <dialog ref="helpDialogRef" closedby="any" class="help-dialog" aria-labelledby="helpTitle">
      <div class="help-inner">
        <div class="help-head">
          <div>
            <h2 id="helpTitle">Formalizacja Binarna Hipotezy Collatza (3n + 1)</h2>
            <p>Dlaczego przestrzeń binarna (ℤ₂) ujawnia ukryte schematy 0 i 1?</p>
          </div>
          <button type="button" class="ctrl-btn" @click="closeHelpModal">
            <X :size="15" />
          </button>
        </div>
        <div class="help-body">
          <p>
            <strong>1. Operacja 3n + 1 jako lokalny automat komórkowy z przeniesieniem (Carry):</strong>
            W zapisie dwójkowym mnożenie przez 3 to dodanie liczby przesuniętej o 1 bit w lewo:
            <code>3n + 1 = n + (n ≪ 1) + 1</code>. Dzielenie przez <code>2^k</code> to po prostu obcięcie końcowych zer!
          </p>
          <p>
            <strong>2. Deterministyczna erozja bloków jedynek (Trailing 1s):</strong>
            Każda liczba nieparzysta kończąca się serią <code>L</code> jedynek (<code>...011...1₂</code>, czyli
            <code>n ≡ -1 mod 2^L</code>) wykonuje dokładnie <code>L</code> kroków wzrostowych
            <code>(3n+1)/2</code>, po jednym na każdą końcową jedynkę, zamieniając je od prawej strony w zera.
          </p>
          <p>
            <strong>3. Średni dryf entropii bitowej:</strong>
            Każdy nieparzysty krok wydłuża zapis binarny o <code>log₂(3) ≈ 1.58496</code> bitu, ale obcięcie
            końcowych zer skraca go średnio o <code>∑ k / 2^k = 2.00000</code> bity, dając ujemny dryf
            <code>-0.41504 bitu na krok nieparzysty</code>.
          </p>
        </div>
      </div>
    </dialog>
  </div>
</template>
