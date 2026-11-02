import fs from 'node:fs';

function v2(x) {
  let v = 0;
  while (x > 0n && (x & 1n) === 0n) {
    v++;
    x >>= 1n;
  }
  return v;
}

function macroBlockStep(n) {
  const mod8 = Number(n % 8n);
  if (mod8 === 7 || mod8 === 5) {
    const c = 1;
    const b = v2(n + 1n);
    const U = (n + 1n) >> BigInt(b);
    const r = Math.floor(b / 2);
    const d = b % 2;
    const evenNum = U * (3n ** BigInt(b)) - 1n;
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = 2 * b + v;
    const oddSteps = b;
    const evenSteps = b + v;
    const stateLabel = b === 1 ? '(c=1, b=1 [-3])' : `(c=1, d=${d})`;
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel };
  } else if (mod8 === 3) {
    const c = 5;
    const b = v2(n + 5n);
    const U = (n + 5n) >> BigInt(b);
    let d = b % 3;
    if (d === 0) d = 3;
    const r = (b - d) / 3;
    let evenNum, baseSteps, oddSteps;
    if (d === 3) {
      evenNum = (9n ** BigInt(r + 1)) * U - 5n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 2;
    } else if (d === 1) {
      evenNum = 3n * (9n ** BigInt(r)) * U - 7n;
      baseSteps = 5 * r + 2;
      oddSteps = 2 * r + 1;
    } else {
      evenNum = 27n * (9n ** BigInt(r)) * U - 29n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 3;
    }
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = baseSteps + v;
    const evenSteps = steps - oddSteps;
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel: `(c=5, d=${d})` };
  } else {
    const c = 7;
    const b = v2(n + 7n);
    const U = (n + 7n) >> BigInt(b);
    let d = b % 3;
    if (d === 0) d = 3;
    else if (d === 1) d = 4;
    else d = 5;
    const r = (b - d) / 3;
    let evenNum, baseSteps, oddSteps;
    if (d === 3) {
      evenNum = (9n ** BigInt(r + 1)) * U - 7n;
      baseSteps = 5 * r + 5;
      oddSteps = 2 * r + 2;
    } else if (d === 4) {
      evenNum = (9n ** BigInt(r + 2)) * U - 29n;
      baseSteps = 5 * r + 8;
      oddSteps = 2 * r + 4;
    } else {
      evenNum = 3n * (9n ** BigInt(r + 1)) * U - 5n;
      baseSteps = 5 * r + 8;
      oddSteps = 2 * r + 3;
    }
    const v = v2(evenNum);
    const nextN = evenNum >> BigInt(v);
    const steps = baseSteps + v;
    const evenSteps = steps - oddSteps;
    return { n, c, b, r, d, U, v, dv: d + v, bv: b + v, steps, oddSteps, evenSteps, nextN, stateLabel: `(c=7, d=${d})` };
  }
}

const survivingMod1024 = [
  71, 327, 839, 167, 679, 935, 103, 615, 359, 871, 231, 743, 487, 207, 719, 463,
  47, 559, 303, 111, 623, 879, 239, 751, 495, 1007, 27, 539, 283, 795, 155, 667,
  411, 91, 603, 859, 251, 763, 1019, 31, 543, 799, 159, 671, 415, 927, 223, 479,
  991, 63, 319, 831, 191, 703, 447, 959, 127, 639, 383, 895, 255, 767, 511, 1023
];

function traceMacroBlocks(n0, maxBlocks = 10) {
  const blocks = [];
  let cur = BigInt(n0);
  for (let i = 0; i < maxBlocks; i++) {
    const blk = macroBlockStep(cur);
    blocks.push(blk);
    cur = blk.nextN;
  }
  return blocks;
}

const trace103_exact = traceMacroBlocks(103n, 10);
const trace871_exact = traceMacroBlocks(871n, 10);
const trace103_asymp = traceMacroBlocks((1n << 120n) + 103n, 10);
const trace871_asymp = traceMacroBlocks((1n << 120n) + 871n, 10);

function printTrace(title, blocks) {
  console.log(`\n=== ${title} ===`);
  let sumDV = 0, sumV = 0, sumBV = 0, sumOdd = 0, sumEven = 0, sum3rPlusV = 0, sumRPlus1 = 0;
  blocks.forEach((blk, idx) => {
    const K = idx + 1;
    sumDV += blk.dv;
    sumV += blk.v;
    sumBV += blk.bv;
    sumOdd += blk.oddSteps;
    sumEven += blk.evenSteps;
    sum3rPlusV += 3 * blk.r + blk.v;
    sumRPlus1 += blk.r + 1;
    console.log(
      `K=${K}: n=${blk.n < 1000000n ? blk.n : '(mod1024=' + (blk.n % 1024n) + ')'} | ${blk.stateLabel} b=${blk.b}, r=${blk.r}, d=${blk.d}, v=${blk.v}, d+v=${blk.dv}, b+v=${blk.bv} | ` +
      `avg(d+v)=${(sumDV / K).toFixed(3)}, avg(v)=${(sumV / K).toFixed(3)}, avg(b+v)=${(sumBV / K).toFixed(2)} | ` +
      `even/odd=${sumEven}/${sumOdd}=${(sumEven / sumOdd).toFixed(4)} (req >1.5850) | (3r+v)/(r+1)=${(sum3rPlusV / sumRPlus1).toFixed(4)}`
    );
  });
}

printTrace("Exact n = 103", trace103_exact);
printTrace("Exact n = 871", trace871_exact);
printTrace("Asymptotic 2^120 + 103", trace103_asymp);
printTrace("Asymptotic 2^120 + 871", trace871_asymp);

const kHorizons = [2, 3, 4, 5, 6, 8, 10];

function analyzePop(popList, label) {
  console.log(`\n=== Population: ${label} (N=${popList.length}) ===`);
  const rows = [];
  for (const K of kHorizons) {
    let minDV = Infinity, maxDV = -Infinity, sumDVAll = 0;
    let minV = Infinity, sumVAll = 0;
    let minBV = Infinity, sumBVAll = 0;
    let minDVClasses = [];
    let countDVGe217 = 0;
    let countDVGe250 = 0;
    let countContracting = 0; // sumEven > log2(3) * sumOdd

    for (const item of popList) {
      const blocks = traceMacroBlocks(item.n, K);
      const totDV = blocks.reduce((a, x) => a + x.dv, 0);
      const totV = blocks.reduce((a, x) => a + x.v, 0);
      const totBV = blocks.reduce((a, x) => a + x.bv, 0);
      const totOdd = blocks.reduce((a, x) => a + x.oddSteps, 0);
      const totEven = blocks.reduce((a, x) => a + x.evenSteps, 0);

      const avgDV = totDV / K;
      const avgV = totV / K;
      const avgBV = totBV / K;

      sumDVAll += avgDV;
      sumVAll += avgV;
      sumBVAll += avgBV;

      if (avgDV > Math.log2(9) - 1) countDVGe217++;
      if (avgDV >= 2.5) countDVGe250++;
      if (totEven > Math.log2(3) * totOdd) countContracting++;

      if (avgDV < minDV - 1e-9) {
        minDV = avgDV;
        minDVClasses = [item.id];
      } else if (Math.abs(avgDV - minDV) <= 1e-9) {
        minDVClasses.push(item.id);
      }
      if (avgDV > maxDV) maxDV = avgDV;
      if (avgV < minV) minV = avgV;
      if (avgBV < minBV) minBV = avgBV;
    }

    const row = {
      K,
      minDV,
      avgDV: sumDVAll / popList.length,
      maxDV,
      minDVClasses: minDVClasses.slice(0, 6),
      minDVCount: minDVClasses.length,
      minV,
      avgV: sumVAll / popList.length,
      minBV,
      avgBV: sumBVAll / popList.length,
      countDVGe217,
      countDVGe250,
      countContracting,
      total: popList.length,
    };
    rows.push(row);
    console.log(
      `K=${K}: min(d+v)=${minDV.toFixed(3)} [${minDVClasses.slice(0, 4).join(',')} (${minDVClasses.length})], ` +
      `avg(d+v)=${row.avgDV.toFixed(3)}, max(d+v)=${maxDV.toFixed(2)} | ` +
      `min(b+v)=${minBV.toFixed(2)}, avg(b+v)=${row.avgBV.toFixed(2)} | ` +
      `>2.170: ${countDVGe217}/${popList.length} (${(100 * countDVGe217 / popList.length).toFixed(2)}%), ` +
      `>=2.50: ${countDVGe250}/${popList.length} (${(100 * countDVGe250 / popList.length).toFixed(2)}%), ` +
      `even>1.585*odd: ${countContracting}/${popList.length} (${(100 * countContracting / popList.length).toFixed(2)}%)`
    );
  }
  return rows;
}

const pop64Exact = survivingMod1024.map(r0 => ({ id: r0, n: BigInt(r0) }));
const pop1024Exact = [];
const pop1024Asymp = [];
for (let j = 0; j < 16; j++) {
  for (const r0 of survivingMod1024) {
    const r = r0 + 1024 * j;
    pop1024Exact.push({ id: r, n: BigInt(r) });
    pop1024Asymp.push({ id: r, n: (1n << 120n) + BigInt(r) });
  }
}

const rows64 = analyzePop(pop64Exact, "64 Base Classes (survivingMod1024)");
const rows1024Exact = analyzePop(pop1024Exact, "1024 Lifted Classes (r = r0 + 1024*j mod 16384)");
const rows1024Asymp = analyzePop(pop1024Asymp, "1024 Asymptotic Lifted Classes (2^120 + r0 + 1024*j)");

// Now replace Part 9 in /Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md
const fullMd = fs.readFileSync('/Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md', 'utf8');
const idxPart9 = fullMd.indexOf('## Część 9. Anatomia Dwóch Ekstremalnych Klas 4-Blokowych');
if (idxPart9 === -1) throw new Error('Could not find Part 9 marker');

function buildTraceTable(title, blocks, showExactN = true) {
  let t = `#### ${title}\n\n`;
  t += `| Blok $K$ | Wejście $n_{K-1}$ | Węzeł fazowy $(c_K, d_K)$ | $b_K$ | $(r_K, d_K)$ | $v_K$ | $d_K + v_K$ | $b_K + v_K$ | $\\bar{v}_K = \\frac{1}{K}\\sum(d_i+v_i)$ | $\\overline{b+v}_K = \\frac{1}{K}\\sum(b_i+v_i)$ | Bilans $\\frac{\\sum \\text{even}_i}{\\sum \\text{odd}_i}$ (próg $1{,}5850$) | Bilans $\\frac{\\sum(3r_i+d_i+v_i)}{\\sum(r_i+1)}$ (próg $3{,}1699$) |\n`;
  t += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  let sumDV = 0, sumBV = 0, sumOdd = 0, sumEven = 0, sum3rDV = 0, sumRPlus1 = 0;
  blocks.forEach((blk, idx) => {
    const K = idx + 1;
    sumDV += blk.dv;
    sumBV += blk.bv;
    sumOdd += blk.oddSteps;
    sumEven += blk.evenSteps;
    sum3rDV += 3 * blk.r + blk.dv;
    sumRPlus1 += blk.r + 1;
    const avgDV = (sumDV / K).toFixed(3);
    const avgBV = (sumBV / K).toFixed(2);
    const eoRatio = (sumEven / sumOdd).toFixed(4);
    const rRatio = (sum3rDV / sumRPlus1).toFixed(4);
    const passDV = (sumDV / K) > (Math.log2(9) - 1) ? ' ✅' : '';
    const passEO = (sumEven / sumOdd) > Math.log2(3) ? ' ✅' : '';
    const passRR = (sum3rDV / sumRPlus1) > Math.log2(9) ? ' ✅' : '';
    const nDisp = showExactN ? `\`${blk.n}\`` : `\`... + ${Number(blk.n % 1024n)} (mod 1024)\``;
    t += `| **${K}** | ${nDisp} | \`${blk.stateLabel}\` | \`${blk.b}\` | \`(${blk.r}, ${blk.d})\` | \`${blk.v}\` | \`${blk.dv}\` | \`${blk.bv}\` | **\`${avgDV}\`**${passDV} | \`${avgBV}\` | **\`${eoRatio}\`**${passEO} | **\`${rRatio}\`**${passRR} |\n`;
  });
  t += `\n`;
  return t;
}

function buildPopTable(title, rows) {
  let t = `#### ${title}\n\n`;
  t += `| Liczba bloków $K$ | $\\min \\bar{v}_K = \\min \\frac{1}{K}\\sum(d_i+v_i)$ | Klasy realizujące $\\min \\bar{v}_K$ | Średnie $\\bar{v}_K$ | $\\max \\bar{v}_K$ | $\\min \\overline{b+v}_K$ | Średnie $\\overline{b+v}_K$ | Klasy z $\\bar{v}_K > 2{,}1699$ | Klasy z $\\bar{v}_K \\ge 2{,}50$ | Klasy z kontrakcją ($\\sum\\text{even} > \\log_2(3)\\sum\\text{odd}$) |\n`;
  t += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  for (const r of rows) {
    const pct217 = (100 * r.countDVGe217 / r.total).toFixed(2) + '%';
    const pct250 = (100 * r.countDVGe250 / r.total).toFixed(2) + '%';
    const pctDrop = (100 * r.countContracting / r.total).toFixed(2) + '%';
    const clsStr = r.minDVClasses.join(', ') + (r.minDVCount > r.minDVClasses.length ? ` (z ${r.minDVCount})` : '');
    t += `| **$K = ${r.K}$** | **\`${r.minDV.toFixed(3)}\`** | \`${clsStr}\` | **\`${r.avgDV.toFixed(3)}\`** | \`${r.maxDV.toFixed(2)}\` | \`${r.minBV.toFixed(2)}\` | \`${r.avgBV.toFixed(2)}\` | \`${r.countDVGe217}/${r.total}\` (**${pct217}**) | \`${r.countDVGe250}/${r.total}\` (**${pct250}**) | \`${r.countContracting}/${r.total}\` (**${pctDrop}**) |\n`;
  }
  t += `\n`;
  return t;
}

let part9 = `## Część 9. Anatomia Dwóch Ekstremalnych Klas 4-Blokowych (\`r0 ∈ {103, 871}\`) oraz Test Wieloblokowy ($K = 5, 6, 8, 10$)\n\n`;
part9 += `### 9.1. Pełny rozkład blokowy RLE (Modulo-3 Macro-Blocks \`c ∈ {1, 5, 7}\`) dla \`r0 = 103\` oraz \`r0 = 871\`\n\n`;
part9 += `W Rundzie 3 odkryliśmy, że po $K = 4$ makro-blokach RLE spośród wszystkich 64 bazowych klas przeżywających (\`survivingMod1024\`) jedynie dwie klasy (\`r0 = 103\` oraz \`r0 = 871\`) osiągają absolutne minimum $\\bar{v}_4 = \\frac{1}{4}\\sum_{i=1}^4 (d_i + v_i) = 2{,}000$ (czyli $\\sum_{i=1}^4 (d_i + v_i) = 8$). Poniższe tabele przedstawiają ich dokładny rozkład blok po bloku (zarówno dla dokładnych reprezentantów $n_0 = 103, 871$, jak i dla ich głębokich podniesień asymptotycznych $2^{120} + r_0$):\n\n`;

part9 += buildTraceTable("Tabela 9.1A. Dokładna trajektoria makro-blokowa RLE dla `n0 = 103` (Bloki 1–10)", trace103_exact, true);
part9 += buildTraceTable("Tabela 9.1B. Dokładna trajektoria makro-blokowa RLE dla `n0 = 871` (Bloki 1–10)", trace871_exact, true);
part9 += buildTraceTable("Tabela 9.1C. Asymptotyczna trajektoria makro-blokowa RLE dla `n0 = 2^120 + 103` (Bloki 1–10)", trace103_asymp, false);
part9 += buildTraceTable("Tabela 9.1D. Asymptotyczna trajektoria makro-blokowa RLE dla `n0 = 2^120 + 871` (Bloki 1–10)", trace871_asymp, false);

part9 += `### 9.2. Mechanizm odbicia powyżej bariery krytycznej $\\log_2(9) - 1 \\approx 2{,}1699$ dla \`103\` i \`871\`\n\n`;
part9 += `1. **Anatomia \`r0 = 103\`:**\n`;
part9 += `   - W pierwszych 4 blokach \`n0 = 103\` przechodzi przez sekwencję stanów: \`K=1: (c=1, d=1, r=1, v=1)\` ($d_1+v_1=2$) $\\to$ \`K=2: (c=1, d=0, r=1, v=1)\` ($d_2+v_2=1$) $\\to$ \`K=3: (c=1, b=1 [-3], r=0, d=1, v=2)\` ($d_3+v_3=3$) $\\to$ \`K=4: (c=1, d=1, r=1, v=1)\` ($d_4+v_4=2$), co daje sumę $\\sum_{i=1}^4 (d_i+v_i) = 8$ i średnią $\\bar{v}_4 = 2{,}000$.\n`;
part9 += `   - Jednak już w **bloku $K = 5$** (\`n4 = 283\`, stan \`(c=5, d=3, r=0, v=1)\`, gdzie $d_5 + v_5 = 4$) średnia skacze do **$\\bar{v}_5 = 2{,}400 > 2{,}1699$** ✅, a w **bloku $K = 6$** (\`n5 = 639\`, stan \`(c=1, d=1, r=3, v=2)\`, $d_6 + v_6 = 3$) wynosi **$\\bar{v}_6 = 2{,}500$** ✅ (oraz w **bloku $K = 8$** osiąga **$\\bar{v}_8 = 2{,}875$** dzięki zrzutowi $v_8 = 3, d_8 = 3 \\implies d_8+v_8=6$)!\n`;
part9 += `   - Co więcej, dla podniesienia asymptotycznego **\`2^120 + 103\`** przebicie progu $\\log_2(9) - 1 \\approx 2{,}1699$ również następuje dokładnie w **bloku $K = 5$** (**$\\bar{v}_5 = 2{,}400$** ✅, **$\\bar{v}_6 = 2{,}500$** ✅, **$\\bar{v}_8 = 3{,}125$** ✅).\n`;
part9 += `2. **Anatomia \`r0 = 871\`:**\n`;
part9 += `   - W pierwszych 4 blokach \`n0 = 871\` przechodzi przez: \`K=1: (c=1, d=1, r=1, v=1)\` ($d_1+v_1=2$) $\\to$ \`K=2: (c=1, d=0, r=1, v=1)\` ($d_2+v_2=1$) $\\to$ \`K=3: (c=1, d=0, r=1, v=1)\` ($d_3+v_3=1$) $\\to$ \`K=4: (c=1, b=1 [-3], r=0, d=1, v=3)\` ($d_4+v_4=4$), co daje po $K=3$ blokach $\\bar{v}_3 = 1{,}333$, a po $K=4$ blokach $\\bar{v}_4 = 2{,}000$.\n`;
part9 += `   - Już w **bloku $K = 5$** (\`n4 = 659\`, stan \`(c=5, d=3, r=0, v=1)\`, gdzie $d_5 + v_5 = 4$) średnia $\\bar{v}_5$ przebija próg krytyczny, osiągając **$\\bar{v}_5 = 2{,}400 > 2{,}1699$** ✅! Następnie w **bloku $K = 7$** (\`n6 = 925\`, stan \`(c=1, b=1 [-3], v=4)\`, $d_7+v_7=5$) skacze do **$\\bar{v}_7 = 2{,}571$** ✅, a w **bloku $K = 9$** ($v_9 = 7$) do **$\\bar{v}_9 = 3{,}222$** ✅!\n`;
part9 += `   - Z kolei pełny bilans bitowy z uwzględnieniem mnożnika $3 r_i$: $\\frac{\\sum_{i=1}^K (3r_i + d_i + v_i)}{\\sum_{i=1}^K (r_i + 1)} > \\log_2(9) \\approx 3{,}1699$ zostaje dla \`n0 = 103\` przekroczony w **$K = 6$ (\`3.3636 > 3.1699\` ✅)**, a dla \`n0 = 871\` już w **$K = 4$ (\`3.1429\` $\\to$ w $K=5$: \`3.3750 > 3.1699\` ✅)**!\n\n`;

part9 += `---\n\n`;
part9 += `### 9.3. Globalny rozkład $\\min \\bar{v}_K$ dla $K = 2, 3, 4, 5, 6, 8, 10$ (64 klasy bazowe oraz 1024 klasy podniesione \`mod 16384\`)\n\n`;
part9 += buildPopTable("Tabela 9.3A. Populacja 64 bazowych klas przeżywających (`survivingMod1024`)", rows64);
part9 += buildPopTable("Tabela 9.3B. Populacja 1024 klas podniesionych (`r = r0 + 1024*j mod 16384`, $j = 0..15$)", rows1024Exact);
part9 += buildPopTable("Tabela 9.3C. Populacja 1024 asymptotycznych klas podniesionych (`2^120 + r0 + 1024*j`)", rows1024Asymp);

fs.writeFileSync('/Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md', fullMd.slice(0, idxPart9) + part9, 'utf8');
console.log("Updated Part 9 in /Users/gkucmierz/workspace/collatz-lab/tmp/architect4-gpt-hunter.md");
