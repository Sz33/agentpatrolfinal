import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { createWriteStream } from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { URL } from 'url';

const BASE = '/home/ubuntu/agent-sz/cloned website/my-clone';
const REFS = `${BASE}/docs/design-references`;
const PUBLIC = `${BASE}/public/images`;

mkdirSync(REFS, { recursive: true });
mkdirSync(PUBLIC, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (!url || url.startsWith('data:')) { resolve(false); return; }
    try {
      const parsed = new URL(url);
      const proto = parsed.protocol === 'https:' ? https : http;
      const file = createWriteStream(dest);
      const req = proto.get(url, { timeout: 15000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          downloadFile(res.headers.location, dest).then(resolve);
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      });
      req.on('error', () => { file.close(); resolve(false); });
      req.on('timeout', () => { req.destroy(); file.close(); resolve(false); });
    } catch (e) { resolve(false); }
  });
}

async function safeScreenshot(page, outPath, opts = {}) {
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.id = '__recon_stop_anim__';
    s.textContent = `*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }`;
    document.head.appendChild(s);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: outPath, ...opts });
  await page.evaluate(() => { document.getElementById('__recon_stop_anim__')?.remove(); });
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();

  console.log('Navigating to https://solais.ai/ ...');
  try {
    await page.goto('https://solais.ai/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.log('domcontentloaded timeout, continuing...');
  }
  await page.waitForTimeout(3000);

  // Dismiss any overlays/cookies
  for (const sel of ['[aria-label="Accept"]','button:has-text("Accept")','button:has-text("OK")','button:has-text("Got it")']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) { await btn.click().catch(() => {}); break; }
  }
  await page.waitForTimeout(1000);

  // === Desktop screenshots ===
  console.log('Taking desktop full-page screenshot...');
  await safeScreenshot(page, `${REFS}/desktop-full.png`, { fullPage: true });

  // Viewport shots at key sections
  await safeScreenshot(page, `${REFS}/desktop-viewport.png`);

  // === Scroll through to capture sections ===
  const scrollPositions = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000];
  for (const pos of scrollPositions) {
    await page.evaluate(y => window.scrollTo(0, y), pos);
    await page.waitForTimeout(800);
    await safeScreenshot(page, `${REFS}/scroll-${pos}.png`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // === Extract all design tokens and page data ===
  console.log('Extracting design data...');
  const data = await page.evaluate(() => {
    const props = [
      'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
      'textTransform','backgroundColor','background','backgroundImage',
      'padding','margin','width','height','maxWidth','minWidth',
      'display','flexDirection','justifyContent','alignItems','gap',
      'gridTemplateColumns','borderRadius','border','boxShadow','overflow',
      'position','top','right','bottom','left','zIndex',
      'opacity','transform','transition','animation','cursor',
      'objectFit','whiteSpace','textOverflow','mixBlendMode','filter','backdropFilter'
    ];

    function getStyles(el) {
      const cs = getComputedStyle(el);
      const out = {};
      props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') out[p] = v; });
      return out;
    }

    function walk(el, depth) {
      if (depth > 5) return null;
      const children = [...el.children].slice(0, 15);
      const isText = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: [...el.classList].slice(0, 8).join(' '),
        text: isText ? el.textContent.trim().slice(0, 300) : null,
        innerText: el.innerText ? el.innerText.trim().slice(0, 500) : null,
        styles: getStyles(el),
        src: el.tagName === 'IMG' ? el.src : null,
        alt: el.tagName === 'IMG' ? el.alt : null,
        href: el.tagName === 'A' ? el.href : null,
        children: children.map(c => walk(c, depth + 1)).filter(Boolean)
      };
    }

    // Global tokens
    const body = document.body;
    const bodyStyles = getComputedStyle(body);
    const html = document.documentElement;

    // Fonts
    const fonts = new Set();
    [...document.querySelectorAll('link[rel="stylesheet"]')].forEach(l => fonts.add(l.href));
    [...document.querySelectorAll('*')].slice(0, 300).forEach(el => {
      const ff = getComputedStyle(el).fontFamily;
      if (ff) fonts.add(ff);
    });

    // All images
    const images = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.currentSrc || img.getAttribute('src'),
      alt: img.alt,
      w: img.naturalWidth, h: img.naturalHeight,
      parentClass: img.parentElement?.className?.toString().slice(0, 100),
      position: getComputedStyle(img).position,
    }));

    // Background images
    const bgImages = [...document.querySelectorAll('*')].filter(el => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && bg !== 'none' && bg.includes('url(');
    }).slice(0, 40).map(el => ({
      element: el.tagName + (el.id ? '#' + el.id : '') + '.' + [...el.classList].slice(0, 3).join('.'),
      backgroundImage: getComputedStyle(el).backgroundImage.slice(0, 300),
    }));

    // SVGs
    const svgs = [...document.querySelectorAll('svg')].slice(0, 20).map(svg => ({
      outerHTML: svg.outerHTML.slice(0, 2000),
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
      viewBox: svg.getAttribute('viewBox'),
      parentClass: svg.parentElement?.className?.toString().slice(0, 80),
    }));

    // Videos
    const videos = [...document.querySelectorAll('video, source')].map(v => ({
      src: v.src || v.getAttribute('src'),
      type: v.getAttribute('type'),
      poster: v.poster,
    }));

    // CSS custom properties
    const cssVars = {};
    const sheets = [...document.styleSheets];
    sheets.forEach(sheet => {
      try {
        [...sheet.cssRules || []].forEach(rule => {
          if (rule.style) {
            const txt = rule.cssText;
            const matches = txt.matchAll(/--([\w-]+):\s*([^;}{]+)/g);
            for (const m of matches) cssVars['--' + m[1]] = m[2].trim();
          }
        });
      } catch (e) {}
    });

    // Section mapping - find main sections
    const sections = [...document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="about"], [class*="feature"], [class*="marquee"], [class*="process"], [class*="industry"], [class*="stat"], [class*="footer"]')]
      .slice(0, 20)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        classes: [...el.classList].slice(0, 6).join(' '),
        rect: el.getBoundingClientRect(),
        innerText: el.innerText?.trim().slice(0, 400),
      }));

    // All text content grouped
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({
      tag: h.tagName, text: h.innerText.trim().slice(0, 300), styles: getStyles(h)
    }));

    const links = [...document.querySelectorAll('nav a, header a')].map(a => ({ text: a.innerText.trim(), href: a.href }));

    // Key computed colors
    const bodyBg = bodyStyles.backgroundColor;
    const bodyColor = bodyStyles.color;
    const bodyFont = bodyStyles.fontFamily;

    // Page DOM walk (top level sections)
    const mainEl = document.querySelector('main') || document.body;
    const domTree = walk(mainEl, 0);

    return {
      title: document.title,
      bodyBg, bodyColor, bodyFont,
      fonts: [...fonts].slice(0, 20),
      images, bgImages, svgs, videos,
      cssVars: Object.fromEntries(Object.entries(cssVars).slice(0, 100)),
      sections,
      headings,
      links,
      domTree,
      meta: {
        description: document.querySelector('meta[name=description]')?.content,
        ogImage: document.querySelector('meta[property="og:image"]')?.content,
      }
    };
  });

  writeFileSync(`${BASE}/docs/research/recon-data.json`, JSON.stringify(data, null, 2));
  console.log('Saved recon-data.json');
  console.log('Title:', data.title);
  console.log('Body BG:', data.bodyBg, '| Body Color:', data.bodyColor);
  console.log('Fonts found:', data.fonts.slice(0, 5).join(' | '));
  console.log('Images:', data.images.length, '| BG Images:', data.bgImages.length, '| SVGs:', data.svgs.length);
  console.log('Headings:', data.headings.map(h => h.tag + ': ' + h.text.slice(0, 60)).join('\n  '));
  console.log('\nSections found:', data.sections.map(s => `${s.tag}#${s.id || ''}.${s.classes.slice(0,40)}`).join('\n  '));

  // === Mobile screenshot ===
  console.log('\nTaking mobile screenshots...');
  const mob = await ctx.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  try { await mob.goto('https://solais.ai/', { waitUntil: 'domcontentloaded', timeout: 30000 }); } catch (e) {}
  await mob.waitForTimeout(2500);
  await safeScreenshot(mob, `${REFS}/mobile-viewport.png`);
  await mob.close();

  // === Download assets ===
  console.log('\nDownloading assets...');
  const allUrls = [
    ...data.images.map(i => i.src),
    ...data.bgImages.map(b => {
      const m = b.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      return m ? m[1] : null;
    }),
    ...data.svgs.filter(s => s.src).map(s => s.src),
    data.meta?.ogImage,
  ].filter(u => u && u.startsWith('http'));

  const downloaded = [];
  const batch = 4;
  for (let i = 0; i < allUrls.length; i += batch) {
    const chunk = allUrls.slice(i, i + batch);
    await Promise.all(chunk.map(async (url) => {
      try {
        const parsed = new URL(url);
        const ext = path.extname(parsed.pathname) || '.bin';
        const fname = parsed.pathname.split('/').pop() || `asset-${Date.now()}${ext}`;
        const dest = `${PUBLIC}/${fname}`;
        const ok = await downloadFile(url, dest);
        if (ok) downloaded.push({ url, local: `/images/${fname}` });
      } catch (e) {}
    }));
  }
  writeFileSync(`${BASE}/docs/research/assets-map.json`, JSON.stringify(downloaded, null, 2));
  console.log(`Downloaded ${downloaded.length} assets`);
  downloaded.forEach(d => console.log(' ', d.local, '<-', d.url.slice(0, 80)));

  // === Extract specific sections with CSS ===
  console.log('\nExtracting section-specific CSS...');

  async function extractSection(selector, label) {
    try {
      const result = await page.evaluate((sel) => {
        const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
          'textTransform','backgroundColor','background','backgroundImage',
          'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
          'margin','width','height','maxWidth','minHeight',
          'display','flexDirection','justifyContent','alignItems','gap','flexWrap',
          'gridTemplateColumns','borderRadius','border','boxShadow','overflow',
          'position','top','right','bottom','left','zIndex',
          'opacity','transform','transition','animation','cursor',
          'objectFit','whiteSpace','textOverflow','backdropFilter','filter'];
        function getS(el) {
          const cs = getComputedStyle(el);
          const o = {};
          props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') o[p] = v; });
          return o;
        }
        function walk(el, d) {
          if (d > 4) return null;
          const kids = [...el.children].slice(0, 12);
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id, classes: [...el.classList].slice(0, 6).join(' '),
            text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim().slice(0, 300) : null,
            innerText: el.innerText?.trim().slice(0, 600),
            styles: getS(el),
            src: el.tagName === 'IMG' ? el.src : null,
            alt: el.tagName === 'IMG' ? el.alt : null,
            children: kids.map(c => walk(c, d + 1)).filter(Boolean)
          };
        }
        const el = document.querySelector(sel);
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        return walk(el, 0);
      }, selector);
      if (result) {
        writeFileSync(`${BASE}/docs/research/${label}-extract.json`, JSON.stringify(result, null, 2));
        console.log(`  Extracted: ${label}`);
      } else {
        console.log(`  Not found: ${selector} (${label})`);
      }
    } catch (e) { console.log(`  Error extracting ${label}:`, e.message); }
  }

  // Try various selectors for key sections
  const sectionSelectors = [
    ['body > *:first-child, header, nav, [class*="nav"], [class*="header"]', 'navbar'],
    ['[class*="hero"], [class*="Hero"], section:first-of-type', 'hero'],
    ['[class*="marquee"], [class*="ticker"], [class*="scroll"]', 'marquee'],
    ['[class*="process"], [class*="step"], [class*="how"]', 'process'],
    ['[class*="dashboard"], [class*="screenshot"], [class*="preview"]', 'dashboard'],
    ['[class*="industry"], [class*="carousel"], [class*="drag"]', 'carousel'],
    ['[class*="stat"], [class*="count"], [class*="metric"], [class*="number"]', 'stats'],
    ['footer, [class*="footer"], [class*="Footer"]', 'footer'],
  ];

  for (const [sel, label] of sectionSelectors) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await extractSection(sel, label);
  }

  // Scroll-triggered header behavior
  console.log('\nCapturing scroll behaviors...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const navBefore = await page.evaluate(() => {
    const nav = document.querySelector('header, nav, [class*="nav"], [class*="header"]');
    if (!nav) return null;
    const cs = getComputedStyle(nav);
    return { bg: cs.backgroundColor, backdropFilter: cs.backdropFilter, boxShadow: cs.boxShadow, height: cs.height, position: cs.position };
  });

  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(800);

  const navAfter = await page.evaluate(() => {
    const nav = document.querySelector('header, nav, [class*="nav"], [class*="header"]');
    if (!nav) return null;
    const cs = getComputedStyle(nav);
    return { bg: cs.backgroundColor, backdropFilter: cs.backdropFilter, boxShadow: cs.boxShadow, height: cs.height };
  });

  writeFileSync(`${BASE}/docs/research/nav-scroll-behavior.json`, JSON.stringify({ before: navBefore, after: navAfter }, null, 2));
  console.log('Nav scroll behavior:', JSON.stringify({ before: navBefore, after: navAfter }));

  // Hover states for buttons/cards
  const buttonStyles = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button, a[class*="btn"], a[class*="button"], [class*="cta"]')].slice(0, 5);
    return buttons.map(b => {
      const cs = getComputedStyle(b);
      return {
        text: b.innerText?.trim().slice(0, 40),
        classes: [...b.classList].slice(0, 5).join(' '),
        bg: cs.backgroundColor, color: cs.color, border: cs.border,
        borderRadius: cs.borderRadius, padding: cs.padding,
        transition: cs.transition,
      };
    });
  });
  writeFileSync(`${BASE}/docs/research/button-styles.json`, JSON.stringify(buttonStyles, null, 2));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Final full page screenshot with animations
  await page.screenshot({ path: `${REFS}/desktop-final.png`, fullPage: true });
  console.log('\nSaved desktop-final.png');

  await browser.close();
  console.log('\n=== RECON COMPLETE ===');
  console.log('Files saved to docs/research/ and docs/design-references/');
})();
