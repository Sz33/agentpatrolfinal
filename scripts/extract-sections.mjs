import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TARGET = 'https://www.chaingpt.org/';
const refs = path.join(ROOT, 'docs/design-references');
const research = path.join(ROOT, 'docs/research');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || url.startsWith('data:')) return resolve(false);
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // ─── Extract detailed section CSS ──────────────────────────────────────────
  const sectionDetails = await page.evaluate(() => {
    const PROPS = [
      'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
      'textTransform','textDecoration','backgroundColor','background','backgroundImage',
      'backgroundSize','backgroundPosition','backgroundRepeat',
      'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
      'margin','marginTop','marginBottom',
      'width','height','maxWidth','minHeight',
      'display','flexDirection','justifyContent','alignItems','gap','flexWrap',
      'gridTemplateColumns','gridGap',
      'borderRadius','border','borderTop','borderBottom','boxShadow',
      'overflow','position','top','right','bottom','left','zIndex',
      'opacity','transform','transition','cursor',
      'objectFit','mixBlendMode','filter','backdropFilter',
      'whiteSpace','textOverflow',
    ];

    function cs(el, prop) {
      const v = getComputedStyle(el)[prop];
      if (!v || v === 'none' || v === 'normal' || v === 'auto' || v === '0px' || v === 'rgba(0, 0, 0, 0)' || v === 'rgb(0, 0, 0)' || v === 'static') return undefined;
      return v;
    }

    function extractEl(el, depth = 0) {
      if (depth > 3 || !el) return null;
      const styles = {};
      PROPS.forEach(p => { const v = cs(el, p); if (v) styles[p] = v; });
      const children = [...el.children].slice(0, 12).map(c => extractEl(c, depth + 1)).filter(Boolean);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        classes: el.className?.toString().split(' ').filter(Boolean).slice(0, 6).join(' ') || undefined,
        text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent?.trim().slice(0, 200) : undefined,
        href: el.href || undefined,
        src: (el.src || el.currentSrc) || undefined,
        alt: el.alt || undefined,
        styles,
        children: children.length ? children : undefined,
      };
    }

    // Key section selectors
    const selectors = {
      navbar: 'nav, [class*="navbar"], [class*="nav-wrap"], header',
      hero: '[class*="hero"], [class*="banner"], .section-heading',
      awards: '[class*="award"]',
      solutions: '[class*="solution"]',
      ecosystem: '[class*="ecosystem"]',
      pricing: '[class*="pricing"]',
      token: '[class*="token"]',
      footer: 'footer',
    };

    const results = {};
    for (const [name, selector] of Object.entries(selectors)) {
      const el = document.querySelector(selector);
      if (el) {
        results[name] = extractEl(el, 0);
      }
    }
    return results;
  });

  fs.writeFileSync(path.join(research, 'SECTION_CSS.json'), JSON.stringify(sectionDetails, null, 2));
  console.log('Section CSS extracted for:', Object.keys(sectionDetails).join(', '));

  // ─── Extract nav items and links ────────────────────────────────────────────
  const navData = await page.evaluate(() => {
    const nav = document.querySelector('nav, [class*="navbar"], header');
    if (!nav) return null;

    const links = [...nav.querySelectorAll('a')].map(a => ({
      text: a.textContent?.trim(),
      href: a.href,
      classes: a.className?.toString().slice(0, 50),
    }));

    const logo = nav.querySelector('img, svg, [class*="logo"]');
    const logoData = logo ? {
      src: logo.src || logo.currentSrc || null,
      outerHTML: logo.outerHTML?.slice(0, 500),
      alt: logo.alt,
    } : null;

    return { links, logo: logoData };
  });

  fs.writeFileSync(path.join(research, 'NAV_DATA.json'), JSON.stringify(navData, null, 2));
  console.log('Nav data extracted:', navData?.links?.length, 'links');

  // ─── Hero section deep extract ───────────────────────────────────────────────
  const heroData = await page.evaluate(() => {
    const hero = document.querySelector('[class*="hero"], .section-hero, main > div:first-child, .hero-section');
    if (!hero) {
      // Try to find the first big section
      const sections = [...document.querySelectorAll('section, main > div')];
      const big = sections.find(s => s.getBoundingClientRect().height > 400);
      return big ? {
        text: big.textContent?.trim().slice(0, 500),
        headings: [...big.querySelectorAll('h1,h2,h3')].map(h => h.textContent?.trim()),
        buttons: [...big.querySelectorAll('a, button')].map(b => ({ text: b.textContent?.trim(), href: b.href })).filter(b => b.text).slice(0, 8),
        images: [...big.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
        bgImage: getComputedStyle(big).backgroundImage,
      } : null;
    }
    return {
      text: hero.textContent?.trim().slice(0, 500),
      headings: [...hero.querySelectorAll('h1,h2,h3')].map(h => h.textContent?.trim()),
      buttons: [...hero.querySelectorAll('a, button')].map(b => ({ text: b.textContent?.trim(), href: b.href })).filter(b => b.text).slice(0, 8),
      images: [...hero.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
      bgImage: getComputedStyle(hero).backgroundImage,
    };
  });

  fs.writeFileSync(path.join(research, 'HERO_DATA.json'), JSON.stringify(heroData, null, 2));
  console.log('Hero data extracted');

  // ─── Solutions section ──────────────────────────────────────────────────────
  const solutionsData = await page.evaluate(() => {
    const el = document.querySelector('[class*="solution"]');
    if (!el) return null;

    const items = [...el.querySelectorAll('[class*="product"], [class*="item"], [class*="card"]')].slice(0, 10).map(item => ({
      heading: item.querySelector('h2,h3,h4')?.textContent?.trim(),
      desc: item.querySelector('p')?.textContent?.trim()?.slice(0, 200),
      link: item.querySelector('a')?.href,
      img: item.querySelector('img')?.src,
    }));

    return {
      heading: el.querySelector('h2,h3')?.textContent?.trim(),
      items,
    };
  });

  fs.writeFileSync(path.join(research, 'SOLUTIONS_DATA.json'), JSON.stringify(solutionsData, null, 2));

  // ─── Ecosystem section ──────────────────────────────────────────────────────
  const ecosystemData = await page.evaluate(() => {
    const el = document.querySelector('[class*="ecosystem"]');
    if (!el) return null;

    const products = [...el.querySelectorAll('[class*="product"], [class*="item"], [class*="card"], [class*="tab"]')].slice(0, 20).map(item => ({
      heading: item.querySelector('h2,h3,h4,h5')?.textContent?.trim(),
      desc: item.querySelector('p')?.textContent?.trim()?.slice(0, 200),
      img: item.querySelector('img')?.src,
    }));

    return {
      heading: el.querySelector('h2,h3')?.textContent?.trim(),
      products,
    };
  });

  fs.writeFileSync(path.join(research, 'ECOSYSTEM_DATA.json'), JSON.stringify(ecosystemData, null, 2));

  // ─── Pricing section ────────────────────────────────────────────────────────
  const pricingData = await page.evaluate(() => {
    const el = document.querySelector('[class*="pricing"]');
    if (!el) return null;

    const plans = [...el.querySelectorAll('[class*="plan"], [class*="tier"], [class*="card"]')].slice(0, 6).map(plan => ({
      name: plan.querySelector('h3,h4,h5')?.textContent?.trim(),
      price: plan.querySelector('[class*="price"]')?.textContent?.trim(),
      features: [...plan.querySelectorAll('li, [class*="feature"]')].map(f => f.textContent?.trim()).filter(Boolean).slice(0, 8),
    }));

    return {
      heading: el.querySelector('h2,h3')?.textContent?.trim(),
      plans,
    };
  });

  fs.writeFileSync(path.join(research, 'PRICING_DATA.json'), JSON.stringify(pricingData, null, 2));

  // ─── Footer section ─────────────────────────────────────────────────────────
  const footerData = await page.evaluate(() => {
    const el = document.querySelector('footer');
    if (!el) return null;

    const links = [...el.querySelectorAll('a')].map(a => ({
      text: a.textContent?.trim(),
      href: a.href,
    })).filter(l => l.text).slice(0, 40);

    const cols = [...el.querySelectorAll('[class*="col"], [class*="column"], [class*="group"]')].slice(0, 8).map(col => ({
      heading: col.querySelector('h3,h4,h5,strong')?.textContent?.trim(),
      links: [...col.querySelectorAll('a')].map(a => ({ text: a.textContent?.trim(), href: a.href })).filter(l => l.text),
    }));

    return {
      text: el.textContent?.trim().slice(0, 300),
      links,
      cols,
    };
  });

  fs.writeFileSync(path.join(research, 'FOOTER_DATA.json'), JSON.stringify(footerData, null, 2));
  console.log('All section data extracted');

  // ─── Download key assets ─────────────────────────────────────────────────────
  const imgDir = path.join(ROOT, 'public/images');
  const seoDir = path.join(ROOT, 'public/seo');

  // Key images to download
  const keyImages = [
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/648329053d5c25f54cbb89c2_chaingpt-logoLight-Neon-2.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/65490b8a07a8b7aa78eff4f1_logo-chainGPT-dark.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/644fa7cd9bc7d5ed92d90f21_corner-top-left.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/644fa7cdb9ca0ac43e739b5f_corner-top-right.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/644fa7ccf9e72f37ae5162ad_corner-bottom-right.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/644fa7ccb2061a3f72c97c6b_corner-bottom-left.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/6436bdb39b7ca6101e1a307d_ico-indicator-light.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/64491f577f22d780663c25d1_ico-arrow.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/64491fa5649dfb767a0c35ee_arrow-down.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/65490b8aeb8455bcc5cbf898_logo-Pad.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/668d4452d209630013ad3f7d_chain-gpt-labs.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67b6fd6c8515100d4ecc5b3c_CGPT%20Pad.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/65fabe9856a4dd78f7a11faf_CryptoGuardLogo.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67b6fcf3972a28a9b1ccec78_aivm-logo.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/6613b25be8b895f732812334_logo-ai-hub.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/65490b8a668f9f9f2645d7bb_logo-NFTGen.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738af6952a432d1ab4b5_img.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738a6b9c208845d8f5a8_ico1%205.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738a2e16087be33f1bad_img-1.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738aa36ba0b786b2b002_img-2.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738ad888a5e543e54e67_img-3.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67ab738ad28d710a7158a69d_ico1%2014.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/6707cae0d8efae23f6f99a63_icon-arrow-gray.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67aa2bb6751958738c9c854a_ico_DAO%201.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67aa2bb6742c0ef7f4560d34_ico1%204.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/67aa2afe78e2e34aea93bc57_ico1%201.webp',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/69b27a8d70884faddde0fbf9_ai-signals-hub.svg',
    'https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/69b27a6c48be9bdc770bf3a2_compliance-bot.svg',
  ];

  // Also get all favicons
  const faviconUrls = await page.evaluate(() => {
    return [...document.querySelectorAll('link[rel*="icon"]')].map(l => l.href);
  });

  console.log('\nDownloading assets...');
  let downloaded = 0;
  const allUrls = [...new Set([...keyImages, ...faviconUrls])];

  for (const url of allUrls) {
    const clean = url.split('?')[0];
    const filename = decodeURIComponent(path.basename(clean)).replace(/[^a-zA-Z0-9._-]/g, '_');
    const isSeo = url.includes('favicon') || url.includes('apple-touch') || url.includes('webmanifest');
    const dest = path.join(isSeo ? seoDir : imgDir, filename);
    try {
      const ok = await downloadFile(url, dest);
      if (ok) downloaded++;
    } catch {}
  }
  console.log(`Downloaded ${downloaded}/${allUrls.length} assets`);

  // Get all available images from page (get unique list)
  const allImgUrls = await page.evaluate(() => {
    return [...new Set([...document.querySelectorAll('img')].map(i => i.src || i.currentSrc).filter(s => s && !s.startsWith('data:') && !s.startsWith('blob:')))];
  });

  // Download remaining images (batch 5 at a time)
  const remaining = allImgUrls.filter(u => !keyImages.includes(u)).slice(0, 50);
  const batch = 5;
  for (let i = 0; i < remaining.length; i += batch) {
    const slice = remaining.slice(i, i + batch);
    await Promise.allSettled(slice.map(async url => {
      const clean = url.split('?')[0];
      const filename = decodeURIComponent(path.basename(clean)).replace(/[^a-zA-Z0-9._-]/g, '_');
      const dest = path.join(imgDir, filename);
      if (!fs.existsSync(dest)) {
        try { await downloadFile(url, dest); downloaded++; } catch {}
      }
    }));
  }
  console.log(`Total downloaded: ${downloaded} assets`);

  await browser.close();
  console.log('\n✅ Detailed extraction complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
