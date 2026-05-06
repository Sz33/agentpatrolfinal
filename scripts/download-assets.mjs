import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const BASE = '/home/ubuntu/agent-sz/cloned website/my-clone/public';

const assets = [
  { url: 'https://solais.ai/wp-content/themes/startdigital/static/dashboard.png', dest: 'images/dashboard.png' },
  { url: 'https://solais.ai/wp-content/uploads/2025/03/cropped-Favicon-32x32.png', dest: 'seo/favicon-32.png' },
  { url: 'https://solais.ai/wp-content/uploads/2025/03/cropped-Favicon-192x192.png', dest: 'seo/favicon-192.png' },
  { url: 'https://solais.ai/wp-content/uploads/2025/03/cropped-Favicon-180x180.png', dest: 'seo/favicon-180.png' },
  { url: 'https://solais.ai/wp-content/uploads/2026/02/Solais-Social-Image.png', dest: 'seo/og-image.png' },
  { url: 'https://solais.ai/wp-content/themes/startdigital/static/font/ki.woff', dest: '../src/app/fonts/ki.woff' },
  { url: 'https://solais.ai/wp-content/themes/startdigital/static/font/nb_architekt_bold.woff2', dest: '../src/app/fonts/nb_architekt_bold.woff2' },
];

async function download(url, dest) {
  const fullDest = dest.startsWith('../') ? path.join(BASE, dest) : path.join(BASE, dest);
  mkdirSync(path.dirname(fullDest), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`SKIP ${url}: ${res.status}`); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(fullDest, buf);
    console.log(`OK ${dest} (${buf.length} bytes)`);
  } catch (e) {
    console.log(`ERR ${url}: ${e.message}`);
  }
}

const results = await Promise.all(assets.map(a => download(a.url, a.dest)));
console.log('Done.');
