// Read-only source capture. Does not alter the clinic site or the review design.
const fs = require('node:fs');
const {chromium} = require('playwright');
const sourceURL = 'https://sarasinclinic.com/behandelingen/hairfiller/';
const output = process.argv[2] || 'audit/source-complete-2026-11-10.json';
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(sourceURL, {waitUntil: 'domcontentloaded', timeout: 60000});
    await page.locator('main h1').waitFor();
    const capture = await page.evaluate(() => {
      const root = document.querySelector('main');
      if (!root) throw new Error('Source main-content boundary missing');
      const norm = s => s.replace(/\s+/g, ' ').trim();
      const clean = root.cloneNode(true);
      clean.querySelectorAll('script,style,noscript,template').forEach(n => n.remove());
      const texts = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (n.parentElement.closest('script,style,noscript,template')) continue;
        const text = norm(n.nodeValue);
        if (text) texts.push({text, tag: n.parentElement.tagName, heading: n.parentElement.closest('section')?.querySelector('h1,h2,h3,h4,h5,h6')?.textContent.trim() || ''});
      }
      return {
        source: location.href, capturedAt: new Date().toISOString(),
        boundary: 'main#content', originalHTML: clean.innerHTML,
        visibleText: root.innerText, allText: norm(clean.textContent), textNodes: texts,
        headings: [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(n => ({level: n.tagName,text: norm(n.textContent)})),
        tables: [...root.querySelectorAll('table')].map(n => ({caption: norm(n.caption?.textContent || ''), rows: [...n.rows].map(r => [...r.cells].map(c => norm(c.textContent)))})),
        links: [...root.querySelectorAll('a[href]')].map(n => ({text: norm(n.textContent),url: n.href,label: n.getAttribute('aria-label')})),
        images: [...root.querySelectorAll('img')].map(n => ({src: n.getAttribute('src'),loadedSrc: n.currentSrc,srcset: n.getAttribute('srcset'),dataSrc: n.getAttribute('data-src'),alt: n.alt})),
        videos: [...root.querySelectorAll('iframe,video,source,[data-video]')].map(n => ({tag: n.tagName,src: n.getAttribute('src'),dataVideo: n.getAttribute('data-video'),title: n.getAttribute('title')})),
        labelledControls: [...root.querySelectorAll('button,input,[role="button"]')].map(n => ({tag:n.tagName,text:norm(n.textContent),label:n.getAttribute('aria-label'),value:n.value||''})),
      };
    });
    const previous = require('../audit/source-parity-2026-11-08.json');
    const norm = s => s.replace(/\s+/g, ' ').trim();
    capture.previousBlockComparison = previous.blocks.map(b => ({id:b.id,text:b.text,stillPresent: norm(capture.visibleText).includes(norm(b.text))}));
    capture.limits = ['Main treatment content only; global navigation/footer are not treatment copy.', 'HTML and text capture do not prove copyright permission or clinical accuracy.', 'External embeds may require separate access; their source URLs are inventoried.', 'This inventory does not assert that the redesigned page includes every item yet.'];
    fs.writeFileSync(output, JSON.stringify(capture, null, 2) + '\n');
    console.log(JSON.stringify({output,textNodes:capture.textNodes.length,headings:capture.headings.length,tables:capture.tables.length,images:capture.images.length,links:capture.links.length,videoElements:capture.videos.length,previousBlocksPresent:capture.previousBlockComparison.filter(b=>b.stillPresent).length,previousBlocks:previous.blocks.length,changedBlocks:capture.previousBlockComparison.filter(b=>!b.stillPresent).map(b=>b.id)},null,2));
  } finally {await browser.close();}
})().catch(e => {console.error(e); process.exitCode=1;});
