const fs = require('node:fs');
const path = require('node:path');
const audit = require('../audit/source-2026-11-07.json');

(async () => {
  const selected = audit.images.filter(image => image.src.startsWith('https://sarasinclinic.com/wp-content/uploads/') && !/transparent-background|CTA-header|SkincareQuiz/.test(image.src));
  const unique = [...new Map(selected.map(image => [image.src, image])).values()];
  const dir = path.resolve(__dirname, '../assets/source');
  fs.mkdirSync(dir, { recursive: true });
  const results = [];
  // Limit concurrent requests to the clinic server.
  for (let index = 0; index < unique.length; index += 4) {
    const batch = await Promise.all(unique.slice(index, index + 4).map(async image => {
      const filename = decodeURIComponent(new URL(image.src).pathname.split('/').pop());
      const target = path.join(dir, filename);
      if (!fs.existsSync(target)) {
        const response = await fetch(image.src);
        if (!response.ok) throw new Error(`${response.status}: ${image.src}`);
        fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
      }
      return { ...image, local: `assets/source/${filename}`, bytes: fs.statSync(target).size };
    }));
    results.push(...batch);
  }
  fs.writeFileSync(path.resolve(__dirname, '../audit/source-assets.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ downloaded: results.length, bytes: results.reduce((sum, image) => sum + image.bytes, 0) }));
})().catch(error => { console.error(error); process.exitCode = 1; });
