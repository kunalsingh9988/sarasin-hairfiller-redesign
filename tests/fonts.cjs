const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8775';
const routes = ['/', '/content-check/', '/blog/', '/blog/hairfiller-voor-en-nazorg/', '/blog/haaruitval-consult-voorbereiden/', '/blog/hairfiller-of-reyu/', '/project/'];
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    for (const width of [393, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await Promise.all([400, 500, 600, 700].map(weight => document.fonts.load(`${weight} 16px "Bricolage Grotesque"`)));
          await document.fonts.ready;
        });
        const result = await page.evaluate(() => {
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const wrong = [];
          while (walker.nextNode()) {
            const node = walker.currentNode, element = node.parentElement;
            if (!node.textContent.trim() || ['SCRIPT', 'STYLE'].includes(element.tagName)) continue;
            const range = document.createRange(); range.selectNode(node);
            if (!range.getBoundingClientRect().width) continue;
            const family = getComputedStyle(element).fontFamily;
            if (!family.startsWith('"Bricolage Grotesque"')) wrong.push({ text: node.textContent.slice(0, 60), family });
          }
          return { wrong, loaded: [400, 500, 600, 700].every(weight => document.fonts.check(`${weight} 16px "Bricolage Grotesque"`)), overflow: document.documentElement.scrollWidth > innerWidth };
        });
        assert.deepEqual(result.wrong, [], `${route} at ${width}: inconsistent fonts`);
        assert(result.loaded, `${route}: fonts not loaded`);
        assert(!result.overflow, `${route} at ${width}: horizontal overflow`);
        console.log(`PASS ${width}px ${route}: Bricolage Grotesque, fonts loaded, no overflow`);
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
