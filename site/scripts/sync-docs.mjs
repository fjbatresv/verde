// Genera las páginas del sitio desde los Markdown del repo, para que el sitio
// nunca diverja del estándar. Las páginas generadas no se versionan
// (site/.gitignore); se regeneran en cada `npm run dev` y `npm run build`.
//
// Uso: node scripts/sync-docs.mjs
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_URL = 'https://github.com/fjbatresv/verde';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOCS = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'docs');

/** Repo path → page. `route` is the site URL; `dest` the generated file. */
export const PAGES = [
  {
    src: 'VERDE.md',
    dest: 'estandar.md',
    route: '/estandar/',
    title: 'El estándar',
    description: 'VERDE completo: principios, pilares, roles, ciclo, convenciones, puerta, día 0, lecciones y glosario.',
  },
  {
    src: 'templates/repo/docs/guides/review.md',
    dest: 'guias/revision.md',
    route: '/guias/revision/',
    title: 'Guía del revisor',
    description: 'Cómo se revisa una entrega: verificar la evidencia, revisar en vivo, hallazgos R y N, lanzar y calibrar un agente revisor.',
  },
  {
    src: 'CHANGELOG.md',
    dest: 'changelog.md',
    route: '/changelog/',
    title: 'Changelog',
    description: 'Versiones de VERDE y qué cambió en cada una.',
  },
  {
    src: 'examples/acme/README.md',
    dest: 'ejemplo/index.md',
    route: '/ejemplo/',
    title: 'Ejemplo resuelto · ACME Salas',
    label: 'Introducción',
    order: 0,
  },
  {
    src: 'examples/acme/vault/02-Backlog/Backlog.md',
    dest: 'ejemplo/backlog.md',
    route: '/ejemplo/backlog/',
    title: 'Backlog',
    label: '1. Backlog',
    order: 1,
  },
  {
    src: 'examples/acme/vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md',
    dest: 'ejemplo/encargo.md',
    route: '/ejemplo/encargo/',
    title: 'Encargo · ACME-12',
    label: '2. Encargo',
    order: 2,
  },
  {
    src: 'examples/acme/repo/docs/prs/ACME-12-cancelar-reserva.md',
    dest: 'ejemplo/archivo-de-pr.md',
    route: '/ejemplo/archivo-de-pr/',
    title: 'Archivo de PR · ACME-12',
    label: '3. Archivo de PR',
    order: 3,
  },
  {
    src: 'examples/acme/vault/06-Revisiones/ACME-12-revision.md',
    dest: 'ejemplo/revision.md',
    route: '/ejemplo/revision/',
    title: 'Revisión · ACME-12',
    label: '4. Revisión',
    order: 4,
  },
  {
    src: 'examples/acme/vault/04-Decisiones/Registro-de-decisiones.md',
    dest: 'ejemplo/decisiones.md',
    route: '/ejemplo/decisiones/',
    title: 'Registro de decisiones',
    label: '5. Decisiones',
    order: 5,
  },
  {
    src: 'examples/acme/vault/08-Status/2026-11-19 Status.md',
    dest: 'ejemplo/status.md',
    route: '/ejemplo/status/',
    title: 'Status · 2026-11-19',
    label: '6. Status del día',
    order: 6,
  },
];

/** Pages written by hand in src/content/docs, so links to them resolve too. */
const EXTRA_ROUTES = { 'README.md': '/' };

const HTML_TAGS = new Set(['br', 'i', 'b', 'em', 'strong', 'sub', 'sup', 'kbd', 'details', 'summary', 'img', 'a', 'span', 'div', 'p']);

/** Splits YAML frontmatter from the body. */
export function splitFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  return match ? { frontmatter: match[1], body: text.slice(match[0].length) } : { frontmatter: '', body: text };
}

/** Applies `fn` only to the parts of the Markdown outside code (fenced and inline). */
export function mapOutsideCode(markdown, fn) {
  return markdown
    .split(/(^```[\s\S]*?^```[^\n]*$)/m)
    .map((chunk, i) =>
      i % 2 === 1 ? chunk : chunk.split(/(`[^`\n]*`)/).map((part, j) => (j % 2 === 1 ? part : fn(part))).join(''),
    )
    .join('');
}

/** `<KEY>` outside code would be parsed as an HTML tag and disappear: escape it. */
export function escapePlaceholders(text) {
  return text.replace(/<(\/?)([A-Za-z][^<>\s]*)([^<>]*)>/g, (whole, slash, name) =>
    HTML_TAGS.has(name.toLowerCase().replace(/\/$/, '')) || /^[a-z]+:/i.test(name) ? whole : `&lt;${slash}${name}${whole.slice(1 + slash.length + name.length)}`,
  );
}

const routeBySrc = () => Object.fromEntries([...PAGES.map((p) => [p.src, p.route]), ...Object.entries(EXTRA_ROUTES)]);

/** Resolves a relative link of `fromSrc` to a site route or to the file on GitHub. */
export function resolveLink(target, fromSrc) {
  if (/^([a-z]+:|#|\/)/i.test(target)) return target;
  const [rawPath, hash = ''] = target.split('#');
  const path = posix.normalize(posix.join(posix.dirname(fromSrc), decodeURI(rawPath)));
  const anchor = hash ? `#${hash}` : '';
  const route = routeBySrc()[path.replace(/\/$/, '')];
  if (route) return route + anchor;
  const onDisk = join(ROOT, path);
  const isDir = rawPath.endsWith('/') || (existsSync(onDisk) && statSync(onDisk).isDirectory());
  return `${REPO_URL}/${isDir ? 'tree' : 'blob'}/main/${encodeURI(path.replace(/\/$/, ''))}${anchor}`;
}

/** Rewrites Markdown links `[text](target)` that point inside the repo. */
export function rewriteLinks(markdown, fromSrc) {
  return mapOutsideCode(markdown, (text) =>
    text.replace(/(\]\()([^)\s]+)(\))/g, (_, open, target, close) => open + resolveLink(target, fromSrc) + close),
  );
}

/** Obsidian links: [[note]] → page link (or plain text); ![[image.png]] → a short note. */
export function rewriteWikilinks(markdown) {
  const byName = Object.fromEntries(PAGES.map((p) => [posix.basename(p.src, '.md'), p.route]));
  return mapOutsideCode(markdown, (text) =>
    text
      .replace(/!\[\[([^\]|]+)(\|[^\]]*)?\]\]/g, (_, file) => `*(captura: ${file})*`)
      .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, name, alias) => {
        const label = alias || name;
        return byName[name] ? `[${label}](${byName[name]})` : label;
      }),
  );
}

/** GFM task lists render as checkboxes without labels (an accessibility error): use symbols. */
export function tasksToSymbols(markdown) {
  return mapOutsideCode(markdown, (text) =>
    text.replace(/^(\s*[-*+] )\[( |x|X)\] /gm, (_, bullet, mark) => `${bullet}${mark === ' ' ? '☐' : '☑'} `),
  );
}

/** Removes the first H1: Starlight shows the page title from the frontmatter. */
export function dropFirstH1(markdown) {
  return markdown.replace(/^\s*# [^\n]*\n+/, '');
}

const yamlString = (value) => JSON.stringify(value);

/** Builds the generated page for one entry of PAGES. */
export function renderPage(page, sourceText) {
  const { frontmatter, body } = splitFrontmatter(sourceText.replace(/\r\n/g, '\n'));
  let content = dropFirstH1(body);
  content = rewriteWikilinks(content);
  content = rewriteLinks(content, page.src);
  content = mapOutsideCode(content, escapePlaceholders);
  content = tasksToSymbols(content);
  if (frontmatter) {
    content = `Metadatos de la nota (frontmatter de Obsidian):\n\n\`\`\`yaml\n${frontmatter}\n\`\`\`\n\n${content}`;
  }
  const head = [
    '---',
    `title: ${yamlString(page.title)}`,
    page.description ? `description: ${yamlString(page.description)}` : null,
    `editUrl: ${yamlString(`${REPO_URL}/edit/main/${encodeURI(page.src)}`)}`,
    page.label || page.order !== undefined
      ? `sidebar:\n${page.label ? `  label: ${yamlString(page.label)}\n` : ''}${page.order !== undefined ? `  order: ${page.order}` : ''}`.trimEnd()
      : null,
    '---',
    '',
    `<!-- Generado por site/scripts/sync-docs.mjs desde ${page.src}. No editar aquí. -->`,
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');
  return `${head}${content.trimEnd()}\n`;
}

export function sync({ root = ROOT, docs = DOCS } = {}) {
  for (const dir of ['guias', 'ejemplo']) rmSync(join(docs, dir), { recursive: true, force: true });
  for (const page of PAGES) {
    const out = join(docs, page.dest);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, renderPage(page, readFileSync(join(root, page.src), 'utf8')));
  }
  return PAGES.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const count = sync();
  console.log(`sync-docs: ${count} páginas generadas en src/content/docs`);
}
