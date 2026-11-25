import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5199/harness.html', { waitUntil: 'networkidle' });
const out = await page.evaluate(() => {
  const popups = Array.from(document.querySelectorAll('div[style]')).filter(el => el.style.position === 'fixed');
  return popups.map(popup => {
    const vp = popup.querySelector('[data-slot="scrollarea-viewport"]');
    const ct = popup.querySelector('[data-slot="scrollarea-content"]');
    const titles = Array.from(popup.querySelectorAll('[role="menuitem"]')).map(row => {
      const s = row.querySelector('span.min-w-0 > span:first-child') ?? row.querySelector('span > span:first-child');
      return s ? { client: s.clientWidth, scroll: s.scrollWidth, truncated: s.scrollWidth > s.clientWidth + 1 } : null;
    });
    const r = popup.getBoundingClientRect();
    return { popupW: +r.width.toFixed(1), vpClient: vp?.clientWidth, vpScroll: vp?.scrollWidth,
             contentScroll: ct ? +ct.getBoundingClientRect().width.toFixed(1) : null, titles };
  });
});
console.log(JSON.stringify(out, null, 1));
await page.screenshot({ path: new URL('./kit-verify.png', import.meta.url).pathname, clip: { x: 0, y: 0, width: 900, height: 900 } });
await browser.close();
