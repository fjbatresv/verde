// Revisa que todos los enlaces internos del sitio construido (dist/) apunten a
// una página o archivo que existe, incluidos los anclas (#...).
// Uso: node scripts/check-links.mjs [dist]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const pages = new Map(); // ruta → html

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) pages.set('/' + relative(dist, path).replace(/index\.html$/, ''), readFileSync(path, 'utf8'));
  }
}
walk(dist);

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const broken = [];
for (const [from, html] of pages) {
  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#$)/.test(href)) continue;
    const [rawPath, hash] = href.split('#');
    const path = rawPath === '' ? from : decodeURI(rawPath);
    const target = pages.get(path) ?? pages.get(path.endsWith('/') ? path : path + '/');
    if (target === undefined && !existsSync(join(dist, path))) {
      broken.push(`${from} → ${href} (no existe)`);
    } else if (hash && target !== undefined && !ids(target).has(decodeURIComponent(hash))) {
      broken.push(`${from} → ${href} (no existe el ancla)`);
    }
  }
}

if (broken.length > 0) {
  console.error(`check-links: ${broken.length} enlace(s) roto(s)`);
  for (const line of broken) console.error('  ' + line);
  process.exit(1);
}
console.log(`check-links: ${pages.size} páginas, sin enlaces rotos`);
