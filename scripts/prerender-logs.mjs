import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RESEARCH_LOOP_LOGS_SUMMARY, renderLogMarkdownToHtml } from '../src/engine/collatzEngine.js';

const RESEARCH_LOGS = RESEARCH_LOOP_LOGS_SUMMARY.logs;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const logsSrcDir = path.join(rootDir, 'logs');
const logsDistDir = path.join(distDir, 'logs');

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceMetaTags(templateHtml, { title, description, canonicalUrl, mdUrl, bodyHtml }) {
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/i,
    `<meta name="description" content="${escapeAttr(description)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />${
      mdUrl ? `\n    <link rel="alternate" type="text/markdown" href="${escapeAttr(mdUrl)}" title="Raw Markdown Source" />` : ''
    }`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:description" content="${escapeAttr(description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:url" content="${escapeAttr(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`
  );

  html = html.replace(
    /<div id="app"><\/div>/i,
    `<div id="app">${bodyHtml}</div>`
  );

  return html;
}

function main() {
  const baseIndexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    throw new Error(`dist/index.html not found at ${baseIndexPath}. Run vite build first.`);
  }

  const templateHtml = fs.readFileSync(baseIndexPath, 'utf8');
  fs.mkdirSync(logsDistDir, { recursive: true });

  const indexLinksHtml = [];

  for (const log of RESEARCH_LOGS) {
    const mdFilePath = path.join(logsSrcDir, `${log.slug}.md`);
    if (!fs.existsSync(mdFilePath)) {
      console.warn(`[prerender-logs] Warning: missing markdown file ${mdFilePath}`);
      continue;
    }

    const rawMd = fs.readFileSync(mdFilePath, 'utf8');
    // 1. Copy raw .md file to dist/logs/<slug>.md for direct LLM / researcher download
    fs.copyFileSync(mdFilePath, path.join(logsDistDir, `${log.slug}.md`));

    // 2. Render semantic HTML + raw LaTeX/Markdown block for crawlers and LLMs (Gemini, ChatGPT, etc.)
    const renderedArticleHtml = renderLogMarkdownToHtml(rawMd);
    const canonicalUrl = `https://collatz.7u.pl/logs/${log.slug}`;
    const mdUrl = `https://collatz.7u.pl/logs/${log.slug}.md`;
    const pageTitle = `${log.title} — Collatz.7u.pl Research Log #${log.id}`;
    const pageDescription = `${log.verdict} Pełny tekst matematyczny, lematy i certyfikaty obliczeniowe w przestrzeni binarnej 3n+1.`;

    const staticBodyHtml = `
      <main class="ssr-log-prerender" style="max-width: 980px; margin: 0 auto; padding: 2rem 1.25rem;">
        <header style="margin-bottom: 1.5rem; border-bottom: 1px solid rgba(148,163,184,0.2); padding-bottom: 1rem;">
          <p style="font-family: monospace; font-size: 0.85rem; opacity: 0.8;">
            Collatz.7u.pl Research Log #${escapeHtml(log.id)}
            · <a href="${escapeAttr(mdUrl)}">Pobierz surowy plik Markdown / LaTeX (.md)</a>
            · <a href="https://collatz.7u.pl/">Powrót do laboratorium głównego</a>
          </p>
        </header>
        <article class="md-document">
          ${renderedArticleHtml}
        </article>
        <section style="margin-top: 2.5rem; border-top: 1px solid rgba(148,163,184,0.2); padding-top: 1rem;">
          <h2>Surowy zapis źródłowy Markdown / LaTeX (dla audytorów i modeli AI)</h2>
          <pre class="log-raw-source" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(rawMd)}</pre>
        </section>
      </main>
    `.trim();

    const routeHtml = replaceMetaTags(templateHtml, {
      title: pageTitle,
      description: pageDescription,
      canonicalUrl,
      mdUrl,
      bodyHtml: staticBodyHtml
    });

    // Write dist/logs/<slug>/index.html and dist/logs/<slug>.html and dist/logs/<id>/index.html
    const slugDir = path.join(logsDistDir, log.slug);
    fs.mkdirSync(slugDir, { recursive: true });
    fs.writeFileSync(path.join(slugDir, 'index.html'), routeHtml, 'utf8');
    fs.writeFileSync(path.join(logsDistDir, `${log.slug}.html`), routeHtml, 'utf8');

    const idDir = path.join(logsDistDir, log.id);
    fs.mkdirSync(idDir, { recursive: true });
    fs.writeFileSync(path.join(idDir, 'index.html'), routeHtml, 'utf8');

    indexLinksHtml.push(
      `<li><a href="/logs/${escapeAttr(log.slug)}"><strong>[${escapeHtml(log.id)}] ${escapeHtml(log.title)}</strong></a> — ${escapeHtml(log.verdict)} (<a href="/logs/${escapeAttr(log.slug)}.md">Markdown .md</a>)</li>`
    );
  }

  // Also enrich root dist/index.html with a crawlable summary & links to all 7 research logs inside #app
  const rootSummaryHtml = `
    <main class="ssr-home-prerender" style="max-width: 980px; margin: 0 auto; padding: 2rem 1.25rem;">
      <h1>Collatz.7u.pl — 3n+1 Binary Automaton, 2-Adic Sieve &amp; Step-by-Step Proof Lab</h1>
      <p>Interaktywne laboratorium Hipotezy Collatza (3n+1) w przestrzeni binarnej ℤ₂: 6-stanowy automat Mealy'ego przeniesień {0,1,2}, 3 ścisłe lematy tunelowania bitowego, sito 2-adyczne (k=34, 8.58 mld klas reszt) oraz obwiednia Bellmana-Lapunowa dla wielkich liczb BigInt do 4096 bitów.</p>
      <h2>Dokumenty Badawcze i Dowód Krok po Kroku (Dostępne jako HTML oraz surowy Markdown/LaTeX):</h2>
      <ul>
        ${indexLinksHtml.join('\n        ')}
      </ul>
    </main>
  `.trim();

  const updatedRootHtml = templateHtml.replace(
    /<div id="app"><\/div>/i,
    `<div id="app">${rootSummaryHtml}</div>`
  );
  fs.writeFileSync(baseIndexPath, updatedRootHtml, 'utf8');

  // Copy lean4 formal verification files into dist/lean4/ for direct public download
  const leanSrcDir = path.join(rootDir, 'lean4');
  const leanDistDir = path.join(distDir, 'lean4');
  if (fs.existsSync(leanSrcDir)) {
    fs.mkdirSync(leanDistDir, { recursive: true });
    for (const file of fs.readdirSync(leanSrcDir)) {
      fs.copyFileSync(path.join(leanSrcDir, file), path.join(leanDistDir, file));
    }
  }

  console.log(`[prerender-logs] Pre-rendered ${RESEARCH_LOGS.length} research logs into dist/logs/<slug>/index.html and dist/logs/<slug>.md`);
}

main();
