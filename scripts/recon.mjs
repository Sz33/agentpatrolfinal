import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TARGET = 'https://www.chaingpt.org/';

const refs = path.join(ROOT, 'docs/design-references');
const research = path.join(ROOT, 'docs/research');

async function run() {
  const browser = await chromium.launch({ headless: true });

  // ─── Desktop recon ───────────────────────────────────────────────────────────
  const desktop = await browser.newPage();
  await desktop.setViewportSize({ width: 1440, height: 900 });
  console.log('Navigating to', TARGET, '…');
  await desktop.goto(TARGET, { waitUntil: 'load', timeout: 60000 });
  await desktop.waitForTimeout(3000);

  // Full-page screenshot desktop
  await desktop.screenshot({ path: path.join(refs, 'desktop-full.png'), fullPage: true });
  console.log('Desktop screenshot saved.');

  // ─── Extract global design tokens ───────────────────────────────────────────
  const tokens = await desktop.evaluate(() => {
    const all = [...document.querySelectorAll('*')];

    // Collect all computed font families
    const fonts = [...new Set(all.slice(0, 400).map(el => getComputedStyle(el).fontFamily))].filter(Boolean);

    // Collect all colors (text + background)
    const colors = [...new Set([
      ...all.slice(0, 300).map(el => getComputedStyle(el).color),
      ...all.slice(0, 300).map(el => getComputedStyle(el).backgroundColor),
    ])].filter(c => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'rgb(0, 0, 0)');

    // Google Fonts links
    const fontLinks = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map(l => l.href)
      .filter(h => h.includes('fonts.googleapis') || h.includes('fonts.gstatic'));

    // Favicon / meta links
    const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString(), rel: l.rel }));
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;
    const metaDesc = document.querySelector('meta[name="description"]')?.content;
    const title = document.title;

    // Body/root computed styles
    const body = getComputedStyle(document.body);
    const bodyStyles = {
      fontFamily: body.fontFamily,
      fontSize: body.fontSize,
      lineHeight: body.lineHeight,
      color: body.color,
      backgroundColor: body.backgroundColor,
    };

    // Check for smooth scroll libs
    const hasLenis = !!document.querySelector('.lenis, [data-lenis-prevent]') || !!window.lenis;
    const hasLocomotive = !!document.querySelector('.locomotive-scroll, [data-scroll-container]');

    // All font @import / style tags
    const styleSheets = [...document.styleSheets].map(ss => {
      try { return { href: ss.href, rules: ss.cssRules?.length }; } catch { return { href: ss.href }; }
    });

    return { fonts, colors, fontLinks, favicons, ogImage, metaDesc, title, bodyStyles, hasLenis, hasLocomotive, styleSheets };
  });

  fs.writeFileSync(path.join(research, 'DESIGN_TOKENS.json'), JSON.stringify(tokens, null, 2));
  console.log('Design tokens extracted.');

  // ─── Page topology ───────────────────────────────────────────────────────────
  const topology = await desktop.evaluate(() => {
    // Map major sections
    const sections = [...document.querySelectorAll('section, [class*="section"], header, nav, footer, main > div, main > section')];
    return sections.map((el, i) => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: el.className?.toString().split(' ').filter(Boolean).slice(0, 8).join(' '),
        position: cs.position,
        zIndex: cs.zIndex,
        height: Math.round(rect.height),
        offsetTop: Math.round(el.getBoundingClientRect().top + window.scrollY),
        display: cs.display,
        firstHeading: el.querySelector('h1,h2,h3,h4')?.textContent?.trim().slice(0, 80) || null,
        childCount: el.children.length,
      };
    });
  });

  fs.writeFileSync(path.join(research, 'PAGE_TOPOLOGY.json'), JSON.stringify(topology, null, 2));
  console.log(`Page topology: ${topology.length} sections found.`);

  // ─── Asset discovery ─────────────────────────────────────────────────────────
  const assets = await desktop.evaluate(() => {
    const images = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.currentSrc,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      parentClasses: img.parentElement?.className?.toString().slice(0, 60),
      position: getComputedStyle(img).position,
      zIndex: getComputedStyle(img).zIndex,
    }));

    const videos = [...document.querySelectorAll('video')].map(v => ({
      src: v.src || v.querySelector('source')?.src,
      poster: v.poster,
      autoplay: v.autoplay,
      loop: v.loop,
      muted: v.muted,
    }));

    const bgImages = [...document.querySelectorAll('*')].filter(el => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && bg !== 'none';
    }).map(el => ({
      url: getComputedStyle(el).backgroundImage,
      element: el.tagName + (el.className ? '.' + el.className?.toString().split(' ')[0] : ''),
    })).slice(0, 50);

    const svgCount = document.querySelectorAll('svg').length;
    const inlineSvgs = [...document.querySelectorAll('svg')].slice(0, 20).map(svg => ({
      outerHTML: svg.outerHTML.slice(0, 500),
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
      viewBox: svg.getAttribute('viewBox'),
      parentClass: svg.parentElement?.className?.toString().slice(0, 40),
    }));

    return { images, videos, bgImages, svgCount, inlineSvgs };
  });

  fs.writeFileSync(path.join(research, 'ASSETS.json'), JSON.stringify(assets, null, 2));
  console.log(`Assets: ${assets.images.length} images, ${assets.videos.length} videos, ${assets.svgCount} SVGs.`);

  // ─── Scroll sweep – behaviors ────────────────────────────────────────────────
  // Capture header at scroll=0
  const headerEl = await desktop.$('header, nav, [class*="navbar"], [class*="nav-"]');
  let headerBefore = null, headerAfter = null;
  if (headerEl) {
    headerBefore = await desktop.evaluate(el => {
      const cs = getComputedStyle(el);
      return { backgroundColor: cs.backgroundColor, boxShadow: cs.boxShadow, height: cs.height, position: cs.position, backdropFilter: cs.backdropFilter };
    }, headerEl);
    await desktop.evaluate(() => window.scrollTo(0, 300));
    await desktop.waitForTimeout(800);
    headerAfter = await desktop.evaluate(el => {
      const cs = getComputedStyle(el);
      return { backgroundColor: cs.backgroundColor, boxShadow: cs.boxShadow, height: cs.height, position: cs.position, backdropFilter: cs.backdropFilter };
    }, headerEl);
    await desktop.evaluate(() => window.scrollTo(0, 0));
    await desktop.waitForTimeout(500);
  }

  // ─── Per-section screenshots ─────────────────────────────────────────────────
  // Take viewport screenshots at each major scroll position
  const pageHeight = await desktop.evaluate(() => document.body.scrollHeight);
  const viewH = 900;
  const positions = [];
  for (let y = 0; y < pageHeight; y += viewH) positions.push(y);

  for (let i = 0; i < Math.min(positions.length, 20); i++) {
    await desktop.evaluate(y => window.scrollTo(0, y), positions[i]);
    await desktop.waitForTimeout(600);
    await desktop.screenshot({ path: path.join(refs, `section-${String(i).padStart(2,'0')}.png`) });
  }
  console.log(`Captured ${Math.min(positions.length, 20)} section screenshots.`);

  // ─── Mobile screenshot ────────────────────────────────────────────────────────
  const mobile = await browser.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(TARGET, { waitUntil: 'load', timeout: 60000 });
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: path.join(refs, 'mobile-full.png'), fullPage: true });
  console.log('Mobile screenshot saved.');
  await mobile.close();

  // ─── Extract all text content per section ────────────────────────────────────
  const textContent = await desktop.evaluate(() => {
    window.scrollTo(0, 0);
    const sections = [...document.querySelectorAll('section, header, footer, [class*="section"]')];
    return sections.map((el, i) => ({
      index: i,
      heading: el.querySelector('h1,h2,h3')?.textContent?.trim().slice(0, 200),
      allText: el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 1000),
      buttons: [...el.querySelectorAll('button, a[class*="btn"], a[class*="button"]')].map(b => b.textContent?.trim()).filter(Boolean).slice(0, 10),
    }));
  });

  fs.writeFileSync(path.join(research, 'TEXT_CONTENT.json'), JSON.stringify(textContent, null, 2));
  console.log('Text content extracted.');

  // ─── Extract computed CSS for key sections ────────────────────────────────────
  const cssExtract = await desktop.evaluate(() => {
    function extractStyles(element) {
      const cs = getComputedStyle(element);
      const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
        'textTransform','backgroundColor','background','padding','paddingTop','paddingRight',
        'paddingBottom','paddingLeft','margin','width','height','maxWidth','display',
        'flexDirection','justifyContent','alignItems','gap','gridTemplateColumns',
        'borderRadius','border','boxShadow','overflow','position','zIndex','opacity',
        'transform','transition','backdropFilter','backgroundImage','backgroundSize','backgroundPosition'];
      const styles = {};
      props.forEach(p => {
        const v = cs[p];
        if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v;
      });
      return styles;
    }

    function walk(el, depth) {
      if (depth > 3) return null;
      return {
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString().split(' ').filter(Boolean).slice(0, 6).join(' '),
        text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent?.trim().slice(0, 150) : null,
        styles: extractStyles(el),
        children: [...el.children].slice(0, 10).map(c => walk(c, depth + 1)).filter(Boolean),
      };
    }

    const sections = [...document.querySelectorAll('section, header, footer, main > div')];
    return sections.slice(0, 15).map((el, i) => ({
      index: i,
      selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className?.toString().split(' ')[0] ? '.' + el.className.toString().split(' ')[0] : ''),
      tree: walk(el, 0),
    }));
  });

  fs.writeFileSync(path.join(research, 'CSS_EXTRACT.json'), JSON.stringify(cssExtract, null, 2));
  console.log('CSS extraction done.');

  // ─── Behaviors summary ────────────────────────────────────────────────────────
  const behaviorsReport = {
    url: TARGET,
    capturedAt: new Date().toISOString(),
    headerScrollBehavior: { before: headerBefore, after: headerAfter, changes: headerBefore && headerAfter ? 'See before/after' : 'No header found' },
    smoothScrollLibs: { lenis: tokens.hasLenis, locomotive: tokens.hasLocomotive },
    pageHeight,
    totalSections: topology.length,
    notes: 'Run recon.mjs with interactive scroll to capture all behaviors.',
  };

  fs.writeFileSync(path.join(research, 'BEHAVIORS.md'), `# Behaviors Report\n\`\`\`json\n${JSON.stringify(behaviorsReport, null, 2)}\n\`\`\`\n`);
  console.log('Behaviors recorded.');

  await desktop.close();
  await browser.close();
  console.log('\n✅ Reconnaissance complete. Artifacts saved to docs/research/ and docs/design-references/');
}

run().catch(err => { console.error(err); process.exit(1); });
