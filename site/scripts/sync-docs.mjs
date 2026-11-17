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

/** Locales: Spanish at the root, English under /en/ with sources in i18n/en/. */
export const LOCALES = {
  es: {
    prefix: '', dir: '', srcRoot: '',
    metadata: 'Metadatos de la nota (frontmatter de Obsidian):', screenshot: 'captura',
    versions: 'Versiones', released: (date) => `Publicada el ${date}.`, unreleased: 'Cambios que entrarán en la próxima versión.',
    versionDescription: (title, date) => `Notas de la versión ${title} de VERDE, publicada el ${date}: qué cambió en el estándar respecto a la versión anterior.`,
    unreleasedDescription: 'Cambios de VERDE que entrarán en la próxima versión del estándar.',
  },
  en: {
    prefix: '/en', dir: 'en/', srcRoot: 'i18n/en/',
    metadata: 'Note metadata (Obsidian frontmatter):', screenshot: 'screenshot',
    versions: 'Versions', released: (date) => `Released on ${date}.`, unreleased: 'Changes for the next version.',
    versionDescription: (title, date) => `Release notes for VERDE ${title}, released on ${date}: what changed in the standard since the previous version.`,
    unreleasedDescription: 'VERDE changes that will ship in the next version of the standard.',
  },
};

/** Repo path → page. `route` and `dest` are the Spanish ones; other locales get a prefix. */
export const PAGES = [
  {
    src: 'VERDE.md',
    dest: 'estandar.md',
    route: '/estandar/',
    es: { title: 'El estándar', description: 'VERDE completo: principios, pilares, roles, ciclo, convenciones, puerta, día 0, lecciones y glosario.' },
    en: { title: 'The standard', description: 'All of VERDE: principles, pillars, roles, cycle, conventions, gate, day 0, lessons and glossary.' },
  },
  {
    src: 'templates/repo/docs/guides/review.md',
    dest: 'guias/revision.md',
    route: '/guias/revision/',
    es: { title: 'Guía del revisor', description: 'Cómo se revisa una entrega: verificar la evidencia, revisar en vivo, hallazgos R y N, lanzar y calibrar un agente revisor.' },
    en: { title: 'Reviewer guide', description: 'How a delivery is reviewed: verify the evidence, review live, R and N findings, launch and calibrate a reviewer agent.' },
  },
  {
    src: 'guias/herramientas.md',
    dest: 'guias/herramientas.md',
    route: '/guias/herramientas/',
    es: { title: 'Herramientas recomendadas', description: 'Cómo montar VERDE: Orca, agentes por rol, Stitch, GitHub Actions, Snyk, SonarQube, CodeRabbit y Sentry, y dónde entra cada uno.' },
    en: { title: 'Recommended tools', description: 'How to set up VERDE: Orca, agents by role, Stitch, GitHub Actions, Snyk, SonarQube, CodeRabbit and Sentry, and where each one fits.' },
  },
  {
    src: 'CHANGELOG.md',
    dest: 'changelog/index.md',
    route: '/changelog/',
    split: 'versions',
    order: 0,
    es: { title: 'Changelog', label: 'Cómo se versiona', description: 'Versiones de VERDE y qué cambió en cada una.' },
    en: { title: 'Changelog', label: 'Versioning', description: 'VERDE versions and what changed in each one.' },
  },
  {
    src: 'examples/acme/README.md',
    dest: 'ejemplo/index.md',
    route: '/ejemplo/',
    order: 0,
    es: { title: 'Ejemplo resuelto · ACME Salas', label: 'Introducción', description: 'Un issue completo de ACME Salas, del backlog a la integración, escrito con las plantillas de VERDE: encargo, archivo de PR, revisión y status.' },
    en: { title: 'Worked example · ACME Salas', label: 'Introduction', description: 'A complete ACME Salas issue, from backlog to merge, written with the VERDE templates: brief, PR file, review and status.' },
  },
  {
    src: 'examples/acme/vault/02-Backlog/Backlog.md',
    dest: 'ejemplo/backlog.md',
    route: '/ejemplo/backlog/',
    order: 1,
    es: { title: 'Backlog', label: '1. Backlog', description: 'Backlog de ejemplo en VERDE: issues con estado, responsable y criterios de aceptación verificables, cada uno con la evidencia que exige.' },
    en: { title: 'Backlog', label: '1. Backlog', description: 'Example VERDE backlog: issues with status, owner and verifiable acceptance criteria, each with the evidence it requires.' },
  },
  {
    src: 'examples/acme/vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md',
    dest: 'ejemplo/encargo.md',
    route: '/ejemplo/encargo/',
    order: 2,
    es: { title: 'Encargo · ACME-12', label: '2. Encargo', description: 'Encargo de ejemplo para un agente de IA en VERDE: origen, alcance, rama y entorno de ACME-12, cancelar una reserva.' },
    en: { title: 'Brief · ACME-12', label: '2. Brief', description: 'Example VERDE brief for an AI agent: origin, scope, branch and environment for ACME-12, cancel a booking.' },
  },
  {
    src: 'examples/acme/repo/docs/prs/ACME-12-cancelar-reserva.md',
    dest: 'ejemplo/archivo-de-pr.md',
    route: '/ejemplo/archivo-de-pr/',
    order: 3,
    es: { title: 'Archivo de PR · ACME-12', label: '3. Archivo de PR', description: 'Archivo de PR de ejemplo en VERDE: resumen, cambios, evidencia por criterio de aceptación y resultado de la puerta de ACME-12.' },
    en: { title: 'PR file · ACME-12', label: '3. PR file', description: 'Example VERDE PR file: summary, changes, evidence per acceptance criterion and gate result for ACME-12.' },
  },
  {
    src: 'examples/acme/vault/06-Revisiones/ACME-12-revision.md',
    dest: 'ejemplo/revision.md',
    route: '/ejemplo/revision/',
    order: 4,
    es: { title: 'Revisión · ACME-12', label: '4. Revisión', description: 'Revisión de ejemplo en VERDE: veredicto por rondas, criterios de aceptación, revisión en vivo con Playwright y cambios requeridos de ACME-12.' },
    en: { title: 'Review · ACME-12', label: '4. Review', description: 'Example VERDE review: verdict by round, acceptance criteria, live review with Playwright and required changes for ACME-12.' },
  },
  {
    src: 'examples/acme/vault/04-Decisiones/Registro-de-decisiones.md',
    dest: 'ejemplo/decisiones.md',
    route: '/ejemplo/decisiones/',
    order: 5,
    es: { title: 'Registro de decisiones', label: '5. Decisiones', description: 'Registro de decisiones de ejemplo en VERDE: cada decisión con ID, fecha, origen y estado (vigente, reemplazada, en pausa o pendiente).' },
    en: { title: 'Decision record', label: '5. Decisions', description: 'Example VERDE decision record: each decision with ID, date, origin and status (active, replaced, paused or pending).' },
  },
  {
    src: 'examples/acme/vault/08-Status/2026-11-19 Status.md',
    dest: 'ejemplo/status.md',
    route: '/ejemplo/status/',
    order: 6,
    es: { title: 'Status · 2026-11-19', label: '6. Status del día', description: 'Status diario de ejemplo en VERDE: lo hecho, lo que está en curso, bloqueos y decisiones del día, y el plan para mañana.' },
    en: { title: 'Status · 2026-11-19', label: '6. Day status', description: 'Example VERDE daily status: what is done, what is in progress, blockers and decisions of the day, and the plan for tomorrow.' },
  },
];

/** A page as seen by one locale: its source (translation if it exists), file and route. */
export function localize(page, locale = 'es', root = ROOT) {
  const loc = LOCALES[locale];
  const translated = loc.srcRoot + page.src;
  const src = loc.srcRoot && existsSync(join(root, translated)) ? translated : page.src;
  return { ...page, ...page[locale], locale, src, dest: loc.dir + page.dest, route: loc.prefix + page.route };
}

/** Pages written by hand in src/content/docs, so links to them resolve too. */
const EXTRA_ROUTES = { 'README.md': '/' };

/** `i18n/en/VERDE.md` → `VERDE.md`: the path a translation stands for. */
const canonical = (path) => path.replace(/^i18n\/[a-z]{2}\//, '');

const HTML_TAGS = new Set(['br', 'i', 'b', 'em', 'strong', 'sub', 'sup', 'kbd', 'details', 'summary', 'img', 'a', 'span', 'div', 'p']);

/** Splits YAML frontmatter from the body. */
export function splitFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  return match ? { frontmatter: match[1], body: text.slice(match[0].length) } : { frontmatter: '', body: text };
}

/**
 * Splits Markdown into [outside, code, outside, code, …] by fenced code blocks
 * (CommonMark): the opening fence sets the character (` or ~) and the length; a
 * line closes the block only with the same character, at least that length and
 * nothing after it but spaces. An unclosed block runs to the end. Indentation is
 * allowed so fences inside list items count too.
 */
export function splitFences(markdown) {
  const chunks = [];
  let current = '';
  let fence = null;
  for (const line of markdown.split(/(?<=\n)/)) {
    const text = line.replace(/\r?\n$/, '');
    if (!fence) {
      const open = /^[ \t]*(`{3,}|~{3,})(.*)$/.exec(text);
      if (open && !(open[1][0] === '`' && open[2].includes('`'))) {
        chunks.push(current);
        current = line;
        fence = { char: open[1][0], length: open[1].length };
        continue;
      }
      current += line;
    } else {
      current += line;
      const close = /^[ \t]*(`{3,}|~{3,})[ \t]*$/.exec(text);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) {
        chunks.push(current);
        current = '';
        fence = null;
      }
    }
  }
  chunks.push(current);
  if (fence) chunks.push('');
  return chunks;
}

/** Applies `fn` only to the parts of the Markdown outside code (fenced and inline). */
export function mapOutsideCode(markdown, fn) {
  return splitFences(markdown)
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

const routeBySrc = (locale) =>
  Object.fromEntries([
    ...PAGES.map((p) => [p.src, LOCALES[locale].prefix + p.route]),
    ...Object.entries(EXTRA_ROUTES).map(([src, route]) => [src, LOCALES[locale].prefix + route]),
  ]);

/** Resolves a relative link of `fromSrc` to a site route or to the file on GitHub. */
export function resolveLink(target, fromSrc, locale = 'es') {
  if (/^([a-z]+:|#|\/)/i.test(target)) return target;
  const [rawPath, hash = ''] = target.split('#');
  let path = posix.normalize(posix.join(posix.dirname(fromSrc), decodeURI(rawPath)));
  const anchor = hash ? `#${hash}` : '';
  const route = routeBySrc(locale)[canonical(path).replace(/\/$/, '')];
  if (route) return route + anchor;
  if (!existsSync(join(ROOT, path))) path = canonical(path);
  const onDisk = join(ROOT, path);
  const isDir = rawPath.endsWith('/') || (existsSync(onDisk) && statSync(onDisk).isDirectory());
  return `${REPO_URL}/${isDir ? 'tree' : 'blob'}/main/${encodeURI(path.replace(/\/$/, ''))}${anchor}`;
}

/** Rewrites Markdown links `[text](target)` that point inside the repo. */
export function rewriteLinks(markdown, fromSrc, locale = 'es') {
  return mapOutsideCode(markdown, (text) =>
    text.replace(/(\]\()([^)\s]+)(\))/g, (_, open, target, close) => open + resolveLink(target, fromSrc, locale) + close),
  );
}

/** Obsidian links: [[note]] → page link (or plain text); ![[image.png]] → a short note. */
export function rewriteWikilinks(markdown, locale = 'es') {
  const { prefix, screenshot } = LOCALES[locale];
  const byName = Object.fromEntries(PAGES.map((p) => [posix.basename(p.src, '.md'), prefix + p.route]));
  return mapOutsideCode(markdown, (text) =>
    text
      .replace(/!\[\[([^\]|]+)(\|[^\]]*)?\]\]/g, (_, file) => `*(${screenshot}: ${file})*`)
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

/** Builds the generated page for one localized entry of PAGES (see `localize`). */
export function renderPage(page, sourceText) {
  const locale = page.locale ?? 'es';
  const { frontmatter, body } = splitFrontmatter(sourceText.replace(/\r\n/g, '\n'));
  let content = dropFirstH1(body);
  content = rewriteWikilinks(content, locale);
  content = rewriteLinks(content, page.src, locale);
  // "English translation of X" points to X itself: send it to the original page.
  if (LOCALES[locale].prefix) content = content.replaceAll(`](${page.route})`, `](${page.route.slice(LOCALES[locale].prefix.length)})`);
  content = mapOutsideCode(content, escapePlaceholders);
  content = tasksToSymbols(content);
  if (frontmatter) {
    content = `${LOCALES[locale].metadata}\n\n\`\`\`yaml\n${frontmatter}\n\`\`\`\n\n${content}`;
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

/**
 * Splits a changelog into its intro and one section per `## ` heading.
 * `## v1.3.0 — 2026-11-13` → { slug: 'v1-3-0', title: 'v1.3.0', date: '2026-11-13' };
 * `## Sin publicar` / `## Unreleased` → { slug: 'sin-publicar', … } (same slug in every locale).
 */
export function splitVersions(text) {
  const { body } = splitFrontmatter(text.replace(/\r\n/g, '\n'));
  const [intro, ...parts] = dropFirstH1(body).split(/^## /m);
  const sections = parts.map((part) => {
    const [heading, ...rest] = part.split('\n');
    const [title, date = ''] = heading.split(/\s+—\s+/);
    const isVersion = /^v\d/.test(title.trim());
    return {
      slug: isVersion ? title.trim().replaceAll('.', '-') : 'sin-publicar',
      title: title.trim(),
      date: date.trim(),
      released: isVersion,
      body: rest.join('\n').trim(),
    };
  });
  return { intro: intro.trim(), sections };
}

/** The changelog's index page plus one page per version. */
function renderVersions(page, text) {
  const loc = LOCALES[page.locale];
  const { intro, sections } = splitVersions(text);
  const dir = posix.dirname(page.dest);
  const list = sections
    .map((v) => `- [${v.title}](${page.route}${v.slug}/)${v.date ? ` · ${v.date}` : ''}`)
    .join('\n');
  const files = [[page.dest, renderPage(page, `# ${page.title}\n\n${intro}\n\n## ${loc.versions}\n\n${list}\n`)]];
  sections.forEach((v, i) => {
    const versionPage = {
      ...page,
      title: v.released ? `VERDE ${v.title}` : v.title,
      label: v.title,
      description: v.released ? loc.versionDescription(v.title, v.date) : loc.unreleasedDescription,
      order: i + 1,
      dest: `${dir}/${v.slug}.md`,
      route: `${page.route}${v.slug}/`,
    };
    const lead = v.released ? loc.released(v.date) : loc.unreleased;
    files.push([versionPage.dest, renderPage(versionPage, `# ${v.title}\n\n${lead}\n\n${v.body}\n`)]);
  });
  return files;
}

export function sync({ root = ROOT, docs = DOCS } = {}) {
  let count = 0;
  for (const [locale, { dir }] of Object.entries(LOCALES)) {
    for (const sub of ['guias', 'ejemplo', 'changelog', 'changelog.md']) rmSync(join(docs, dir, sub), { recursive: true, force: true });
    for (const base of PAGES) {
      const page = localize(base, locale, root);
      const text = readFileSync(join(root, page.src), 'utf8');
      const files = page.split === 'versions' ? renderVersions(page, text) : [[page.dest, renderPage(page, text)]];
      for (const [dest, content] of files) {
        const out = join(docs, dest);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, content);
        count += 1;
      }
    }
  }
  return count;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const count = sync();
  console.log(`sync-docs: ${count} páginas generadas en src/content/docs`);
}
