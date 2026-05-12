import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/home/ubuntu/agent-sz/cloned website/my-clone/.audit-screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

// Capture sequential scroll positions
const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = 900;
const sections = Math.ceil(totalHeight / vh);
console.log(`totalHeight=${totalHeight} sections=${sections}`);

for (let i = 0; i < Math.min(sections, 14); i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * vh);
  await page.waitForTimeout(900);
  const file = `${OUT}/section-${String(i).padStart(2,'0')}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

// Mobile snapshot
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
const mp = await mob.newPage();
await mp.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await mp.waitForTimeout(2000);
await mp.screenshot({ path: `${OUT}/mobile-top.png` });
await mp.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
await mp.waitForTimeout(800);
await mp.screenshot({ path: `${OUT}/mobile-mid.png` });

await browser.close();
console.log('done');
