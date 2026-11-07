// Run with Playwright available to Node: node tests/client-feedback.cjs [base URL]
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseURL = process.argv[2] || 'http://127.0.0.1:8771';
const widths = [320, 393, 568, 768, 800, 801, 1024, 1440, 1920];

function luminance(rgb) {
  const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(Number)
    .map(value => value / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const results = [];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.locator('#prijzen').scrollIntoViewIfNeeded();
      await page.locator('[data-clinic-zone-reference] img').evaluate(image => image.decode());
      const state = await page.evaluate(() => {
        const headings = [...document.querySelectorAll('.price-card h3')].map(node => node.textContent);
        const prices = [...document.querySelectorAll('.price-amount strong')].map(node => node.textContent);
      const zoneImage = document.querySelector('[data-clinic-zone-reference] img');
      const images = !!zoneImage && zoneImage.complete && zoneImage.naturalWidth > 0;
        const markers = [...document.querySelectorAll('.zone-marker')].map(node => {
          const marker = node.getBoundingClientRect();
          const photo = node.parentElement.getBoundingClientRect();
          return marker.width > 0 && marker.left >= photo.left && marker.right <= photo.right
            && marker.top >= photo.top && marker.bottom <= photo.bottom;
        });
        const button = document.querySelector('.hero-buttons .button');
        const style = getComputedStyle(button);
        return {
          revision: document.documentElement.dataset.designRevision,
          overflow: document.documentElement.scrollWidth > innerWidth,
          headings, prices, images, markers,
          foreground: style.color, background: style.backgroundColor,
          disclosure: document.querySelector('.price-note').textContent,
          zonesExpanded: [...document.querySelectorAll('.zone-details')].every(node => node.open),
          faqCount: document.querySelectorAll('.faq-list details').length,
          faqImages: document.querySelectorAll('#vragen img').length,
          guideCount: document.querySelectorAll('.guide-card').length,
          font: getComputedStyle(document.body).fontFamily,
          height: document.documentElement.scrollHeight
        };
      });
      assert.equal(state.revision, '2026-11-07');
      assert.equal(state.overflow, false, `Horizontal overflow at ${width}px`);
      assert.deepEqual(state.headings, ['Kleine zone', 'Middelgrote zone', 'Grote zone']);
      assert.deepEqual(state.prices, ['€ 210', '€ 310', '€ 415']);
      assert(state.images && state.markers.every(Boolean), `Missing image or marker at ${width}px`);
      assert(state.disclosure.toLowerCase().includes('geen vaste dekking per ml'));
      assert.equal(state.zonesExpanded, width > 800);
      assert.equal(state.faqCount, 14);
      assert.equal(state.faqImages, 0);
      assert.equal(state.guideCount, 2);
      assert(state.font.includes('Bricolage Grotesque'));
      assert.equal(state.background, 'rgb(220, 231, 132)');
      assert(contrast(state.foreground, state.background) >= 4.5);
      const details = page.locator('.zone-details').first();
      await details.locator('summary').click();
      assert.equal(await details.evaluate(node => node.open), width <= 800);
      await details.locator('summary').click();
      results.push({ width, passed: true, height: state.height, ctaContrast: contrast(state.foreground, state.background).toFixed(2) });
    }

    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    const before = await page.locator('main').evaluate(node => node.getBoundingClientRect().top);
    const toggle = page.locator('.menu-toggle');
    const bounds = await toggle.boundingBox();
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('main').evaluate(node => node.getBoundingClientRect().top), before);
    assert.equal(await page.locator('main').evaluate(node => node.inert), true);
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('main').evaluate(node => node.inert), false);

    await page.locator('#in-beeld').scrollIntoViewIfNeeded();
    await page.locator('.video-card').first().click();
    await page.locator('#video-dialog').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.locator('#video-dialog').waitFor({ state: 'hidden' });
    await page.locator('.video-frame iframe').waitFor({ state: 'detached' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    const cta = page.locator('.hero-buttons .button');
    assert.equal(await cta.getAttribute('href'), 'https://booking.sarasinclinic.com/appointment/locations');
    await cta.hover();
    // Wait for the existing colour transition before reading its final state.
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-buttons .button')).backgroundColor === 'rgb(203, 216, 101)');
    const hover = await cta.evaluate(node => ({ foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
    assert(contrast(hover.foreground, hover.background) >= 4.5);
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await cta.focus();
    assert.equal(await cta.evaluate(node => node.matches(':focus-visible')), true);
    assert.equal(await cta.evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ baseURL, results, overlayWithoutLayoutShift: true, videoDialog: true, hoverContrast: contrast(hover.foreground, hover.background).toFixed(2), keyboardFocus: true, browserErrors: errors }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
