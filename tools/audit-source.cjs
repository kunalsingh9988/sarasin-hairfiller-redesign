const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const source = 'https://sarasinclinic.com/behandelingen/hairfiller/';
    await page.goto(source, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const audit = await page.evaluate(() => {
      const main = document.querySelector('main') || document.querySelector('#content') || document.body;
      return {
        text: main.innerText,
        headings: [...main.querySelectorAll('h1,h2,h3')].map(node => node.textContent.trim()),
        images: [...main.querySelectorAll('img')].map(node => ({ src: node.currentSrc || node.src, lazy: node.dataset.src, alt: node.alt })),
        links: [...main.querySelectorAll('a[href]')].map(node => ({ text: node.textContent.trim(), href: node.href })),
        videos: [...main.querySelectorAll('iframe,video')].map(node => ({ src: node.src })),
        reviews: [...document.querySelectorAll('[class*=review-content],[class*=review-text]')].map(node => node.textContent.trim()),
        inlineSVGCount: main.querySelectorAll('svg').length
      };
    });
    const dir = path.resolve(__dirname, '../audit');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'source-2026-11-07.json'), JSON.stringify({ source, capturedAt: new Date().toISOString(), ...audit }, null, 2) + '\n');
    console.log(JSON.stringify({ headings: audit.headings, images: audit.images, videos: audit.videos, reviewLinks: audit.links.filter(link => /review|ervaring|media|gunther|peter|consent|serum|roller/i.test(link.text + link.href)), tail: audit.text.slice(-6000) }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
