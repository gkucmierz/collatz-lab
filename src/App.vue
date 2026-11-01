<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
  analyzeBinaryAutomatonStep,
  compute2AdicSieveCertificate,
  createRandomChromosome,
  evaluateChromosome,
  evolveGeneticGeneration
} from './engine/collatzEngine.js';

const theme = ref(localStorage.getItem('collatz_theme') || 'dark');
const locale = ref(localStorage.getItem('collatz_locale') || 'pl');
const helpDialogRef = ref(null);

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

// Binary Space Automaton Inspector
const binaryAlignMode = ref('lsb'); // 'lsb' (2-adic) | 'msb'
const binarySelectedOdd = ref(27);
const automatonStep = computed(() => analyzeBinaryAutomatonStep(binarySelectedOdd.value));

// 2-Adic Modular Sieve (mod 2^k)
const sieveDepthK = ref(9);
const sieveCertificate = computed(() => compute2AdicSieveCertificate(sieveDepthK.value));

// Genetic Algorithm (Evolutionary Search in {0,1}^K)
const gaBitLength = ref(20);
const gaPopSize = ref(28);
const gaMutationRate = ref(0.08);
const gaGeneration = ref(0);
const gaRunning = ref(false);
const gaPopulation = ref([]);
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
      spawnTrajectory(pickNextStreamNumber());
    } else {
      const latest = activeTrajectories.value[activeTrajectories.value.length - 1];
      if (latest.drawnSteps < latest.points.length) {
        latest.drawnSteps = Math.min(latest.points.length, latest.drawnSteps + stepsPerFrame.value);
      } else if (streamMode.value !== 'single') {
        spawnTrajectory(pickNextStreamNumber());
      }
    }
  }

  drawTrajectoryCanvas();
  drawScatterCanvas();
};

// Genetic Algorithm Controls
const initGeneticPopulation = () => {
  gaGeneration.value = 1;
  const pop = [];
  for (let i = 0; i < gaPopSize.value; i++) {
    const bits = createRandomChromosome(gaBitLength.value);
    pop.push(evaluateChromosome(bits));
  }
  pop.sort((a, b) => b.fitness - a.fitness);
  gaPopulation.value = pop;
  gaHistoryBest.value = [pop[0]];
};

const stepGeneticAlgorithm = () => {
  if (gaPopulation.value.length === 0) {
    initGeneticPopulation();
    return;
  }
  gaGeneration.value++;
  gaPopulation.value = evolveGeneticGeneration(gaPopulation.value, {
    bitLength: gaBitLength.value,
    mutationRate: gaMutationRate.value
  });
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
  singleSeed.value = cand.n;
  spawnTrajectory(cand.n);
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
    isStreaming.value = !isStreaming.value;
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
  spawnTrajectory(27);
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
});
</script>

<template>
  <div class="collatz-shell">
    <!-- Top Header -->
    <header class="collatz-header">
      <div class="brand-wrap">
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
        <button type="button" class="ctrl-btn primary" @click="isStreaming = !isStreaming">
          <Pause v-if="isStreaming" :size="15" />
          <Play v-else :size="15" />
          <span>{{ isStreaming ? (locale === 'pl' ? 'Pauza (Spacja)' : 'Pause (Space)') : (locale === 'pl' ? 'Rysuj Na Żywo' : 'Stream Live') }}</span>
        </button>

        <button type="button" class="ctrl-btn" @click="spawnTrajectory(pickNextStreamNumber())">
          <FastForward :size="15" />
          <span>{{ locale === 'pl' ? 'Następna liczba' : 'Next Number' }}</span>
        </button>

        <button type="button" class="ctrl-btn" @click="resetPlotter">
          <RotateCcw :size="15" />
          <span>Reset (R)</span>
        </button>

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

    <!-- Main 2-Row Research Grid -->
    <main class="collatz-grid">
      <!-- Left Column: Stream Controls + Live Trajectory Canvas + Scatter Plot -->
      <section class="panel-col">
        <!-- Stream Control Bar -->
        <div class="card control-bar-card">
          <div class="control-row">
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
                <input type="number" v-model.number="rangeMin" min="2" max="10000000" class="num-input" />
                <span>–</span>
                <input type="number" v-model.number="rangeMax" min="3" max="10000000" class="num-input" />
              </div>
            </div>

            <div v-else class="field-group compact">
              <label>{{ locale === 'pl' ? 'Liczba startowa n' : 'Start Number n' }}</label>
              <div class="range-inputs">
                <input
                  type="number"
                  v-model.number="singleSeed"
                  min="1"
                  max="1000000000"
                  class="num-input"
                  @change="spawnTrajectory(singleSeed)"
                />
                <button type="button" class="seg-btn active" @click="spawnTrajectory(singleSeed)">
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

      <!-- Right Column: Binary Space Cellular Automaton + Genetic Algorithm + 2-Adic Sieve -->
      <section class="panel-col">
        <!-- 1. Binary Space Waterfall & Carry Automaton -->
        <div class="card binary-card">
          <div class="card-header">
            <div class="card-title-group">
              <Binary :size="16" class="text-emerald" />
              <h2>
                {{
                  locale === 'pl'
                    ? 'Przestrzeń Binarna: Automat Komórkowy 3n+1 = n + (n ≪ 1) + 1'
                    : 'Binary Space Waterfall: 3n+1 = n + (n ≪ 1) + 1 Cellular Automaton'
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

          <!-- Bit-level Carry Decomposition Box -->
          <div class="carry-inspector">
            <div class="carry-header">
              <span>
                <strong>Lokalna reguła binarna dla n = {{ automatonStep.oddN }}:</strong>
                Końcowa seria jedynek <code>...01^{{ automatonStep.trailingOnesCount }}</code> wymusza dokładnie
                <strong>{{ automatonStep.trailingOnesCount }}</strong> wzrostowych kroków Syracuse, po czym
                znikają <strong>v₂(3n+1) = {{ automatonStep.v2 }}</strong> końcowe zera:
              </span>
            </div>
            <div class="carry-rows">
              <div class="carry-row">
                <span class="carry-label">Przeniesienie cᵢ:</span>
                <code class="bit-strip carry">{{ automatonStep.carries }}</code>
              </div>
              <div class="carry-row">
                <span class="carry-label">n (binarnie):</span>
                <code class="bit-strip n-val">{{ automatonStep.nBits }}</code>
              </div>
              <div class="carry-row">
                <span class="carry-label">2n = n ≪ 1:</span>
                <code class="bit-strip shift-val">{{ automatonStep.shiftBits }}</code>
              </div>
              <div class="carry-row result">
                <span class="carry-label">3n + 1 (suma):</span>
                <code class="bit-strip out-val">{{ automatonStep.outBits }}</code>
                <span class="v2-pill">≫ {{ automatonStep.v2 }} zer → {{ automatonStep.syracuseNextBits }}₂ ({{ automatonStep.syracuseNext }})</span>
              </div>
            </div>
          </div>

          <!-- Binary Waterfall Matrix for the Active Trajectory -->
          <div class="binary-waterfall">
            <div
              v-for="pt in inspectedTrajectory.oddTrajectory.slice(0, 28)"
              :key="pt.step"
              class="waterfall-row"
              :class="{ selected: pt.val === automatonStep.oddN }"
              @click="binarySelectedOdd = pt.val"
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

        <!-- 2. Genetic Algorithm & 2-Adic Contraction Sieve -->
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
            <!-- Left half: Evolved Bit-Motifs -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>Top Chromosomy Binarne (K = {{ gaBitLength }} bitów)</span>
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
                  <span class="ga-stat">n={{ cand.n }} · {{ cand.totalSteps }} kr. (T₁={{ cand.trailingOnes }})</span>
                </div>
              </div>
            </div>

            <!-- Right half: Rigorous 2-Adic Contraction Sieve mod 2^k -->
            <div class="ga-pane">
              <div class="pane-head">
                <span>Dowód Lokalny mod 2^{{ sieveDepthK }} ({{ sieveCertificate.totalOddResidues }} klas)</span>
                <input type="range" v-model.number="sieveDepthK" min="4" max="12" class="slider sm" />
              </div>
              <div class="sieve-summary">
                <div class="sieve-bar-track">
                  <div
                    class="sieve-bar-fill"
                    :style="{ width: `${sieveCertificate.contractedPercent}%` }"
                  ></div>
                </div>
                <p class="sieve-desc">
                  <strong>{{ sieveCertificate.contractedCount }} / {{ sieveCertificate.totalOddResidues }}</strong>
                  ({{ sieveCertificate.contractedPercent.toFixed(1) }}%) nieparzystych klas reszt
                  <code>r (mod 2^{{ sieveDepthK }})</code> ma <strong>ścisły dowód kontrakcji</strong>
                  <code>3^c &lt; 2^m ⇒ T^m(n) &lt; n</code>. Pozostałe klasy wymagają wyższego rzędu 2-adycznego:
                </p>
                <div class="surviving-chips">
                  <span
                    v-for="s in sieveCertificate.survivingResidues.slice(0, 6)"
                    :key="s.residue"
                    class="surv-chip"
                    @click="selectFamousSeed(s.residue)"
                  >
                    {{ s.binary }}₂ (r={{ s.residue }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

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
