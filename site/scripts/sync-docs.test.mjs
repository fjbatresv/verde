import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  LOCALES,
  PAGES,
  REPO_URL,
  escapePlaceholders,
  localize,
  mapOutsideCode,
  renderPage,
  resolveLink,
  rewriteWikilinks,
  splitFrontmatter,
  splitVersions,
  sync,
  tasksToSymbols,
} from './sync-docs.mjs';

test('links to synced files become site routes, with anchors', () => {
  assert.equal(resolveLink('CHANGELOG.md', 'VERDE.md'), '/changelog/');
  assert.equal(resolveLink('vault/08-Status/2026-11-19%20Status.md', 'examples/acme/README.md'), '/ejemplo/status/');
  assert.equal(resolveLink('../../../../VERDE.md#8-la-puerta', 'templates/repo/docs/guides/review.md'), '/estandar/#8-la-puerta');
});

test('links from English sources go to English routes', () => {
  assert.equal(resolveLink('CHANGELOG.md', 'i18n/en/VERDE.md', 'en'), '/en/changelog/');
  assert.equal(resolveLink('templates/repo/docs/guides/review.md', 'i18n/en/VERDE.md', 'en'), '/en/guias/revision/');
  assert.equal(
    resolveLink('../../../../examples/acme/repo/docs/prs/ACME-12-cancelar-reserva.md', 'i18n/en/examples/acme/README.md', 'en'),
    '/en/ejemplo/archivo-de-pr/',
  );
  assert.equal(resolveLink('../../VERDE.md', 'i18n/en/CHANGELOG.md', 'en'), '/en/estandar/');
});

test('links to other repo files go to GitHub (blob for files, tree for folders)', () => {
  assert.equal(resolveLink('LICENSE', 'README.md'), `${REPO_URL}/blob/main/LICENSE`);
  assert.equal(resolveLink('../../LICENSE', 'i18n/en/VERDE.md', 'en'), `${REPO_URL}/blob/main/LICENSE`);
  assert.equal(resolveLink('templates/vault/', 'README.md'), `${REPO_URL}/tree/main/templates/vault`);
  assert.equal(resolveLink('runbook.md', 'templates/repo/docs/guides/review.md'), `${REPO_URL}/blob/main/templates/repo/docs/guides/runbook.md`);
});

test('external links and anchors are kept', () => {
  assert.equal(resolveLink('https://semver.org/lang/es/', 'CHANGELOG.md'), 'https://semver.org/lang/es/');
  assert.equal(resolveLink('#glosario', 'VERDE.md'), '#glosario');
});

test('placeholders outside code are escaped; code and real HTML are not', () => {
  const md = 'Use <KEY>-<n> and `<KEY>` here.<br/>\n\n```sh\necho <KEY>\n```\n<https://example.com>';
  const out = mapOutsideCode(md, escapePlaceholders);
  assert.match(out, /Use &lt;KEY>-&lt;n> and `<KEY>` here\.<br\/>/);
  assert.match(out, /echo <KEY>/);
  assert.match(out, /<https:\/\/example\.com>/);
});

test('wikilinks: known notes become links, images become a note, others plain text', () => {
  const md = 'Ver [[ACME-12-revision]], [[Otra nota|alias]] y ![[captura.png]].';
  assert.equal(rewriteWikilinks(md), 'Ver [ACME-12-revision](/ejemplo/revision/), alias y *(captura: captura.png)*.');
  assert.equal(rewriteWikilinks('[[ACME-12-revision]] ![[a.png]]', 'en'), '[ACME-12-revision](/en/ejemplo/revision/) *(screenshot: a.png)*');
});

test('task lists become symbols, outside code only', () => {
  const out = tasksToSymbols('- [ ] pendiente\n  - [x] hecho\n\n```md\n- [ ] código\n```\n');
  assert.equal(out, '- ☐ pendiente\n  - ☑ hecho\n\n```md\n- [ ] código\n```\n');
});

test('frontmatter is split from the body', () => {
  assert.deepEqual(splitFrontmatter('---\na: 1\n---\n# T\n'), { frontmatter: 'a: 1', body: '# T\n' });
  assert.deepEqual(splitFrontmatter('# T\n'), { frontmatter: '', body: '# T\n' });
});

test('localize uses the translation when it exists, the original otherwise', () => {
  const verde = localize(PAGES.find((p) => p.src === 'VERDE.md'), 'en');
  assert.equal(verde.src, 'i18n/en/VERDE.md');
  assert.equal(verde.dest, 'en/estandar.md');
  assert.equal(verde.route, '/en/estandar/');
  assert.equal(verde.title, 'The standard');
  const pr = localize(PAGES.find((p) => p.dest === 'ejemplo/archivo-de-pr.md'), 'en');
  assert.equal(pr.src, 'examples/acme/repo/docs/prs/ACME-12-cancelar-reserva.md');
  assert.equal(localize(PAGES[0], 'es').src, 'VERDE.md');
});

test('rendered page has Starlight frontmatter and no H1', () => {
  const page = localize(PAGES.find((p) => p.dest === 'ejemplo/revision.md'), 'es');
  const out = renderPage(page, '---\ntipo: revision\n---\n\n# Revisión\n\nTexto [[ACME-12-agente1-cancelar-reserva]].\n');
  assert.match(out, /^---\ntitle: "Revisión · ACME-12"\n/);
  assert.match(out, /editUrl: "https:\/\/github\.com\/fjbatresv\/verde\/edit\/main\/examples\/acme\/vault\/06-Revisiones\/ACME-12-revision\.md"/);
  assert.match(out, /sidebar:\n {2}label: "4\. Revisión"\n {2}order: 4\n---/);
  assert.match(out, /Metadatos de la nota[^\n]*\n\n```yaml\ntipo: revision\n```/);
  assert.doesNotMatch(out, /^# Revisión/m);
  assert.match(out, /\[ACME-12-agente1-cancelar-reserva\]\(\/ejemplo\/encargo\/\)/);
});

test('English page is labelled and edited in English', () => {
  const page = localize(PAGES.find((p) => p.dest === 'ejemplo/revision.md'), 'en');
  const out = renderPage(page, '---\ntipo: revision\n---\n\n# Review\n\n[[ACME-12-agente1-cancelar-reserva]]\n');
  assert.match(out, /title: "Review · ACME-12"/);
  assert.match(out, /edit\/main\/i18n\/en\/examples\/acme\/vault\/06-Revisiones\/ACME-12-revision\.md/);
  assert.match(out, /Note metadata/);
  assert.match(out, /\(\/en\/ejemplo\/encargo\/\)/);
});

test('an English page that links to its own original points to the Spanish page', () => {
  const page = localize(PAGES.find((p) => p.src === 'VERDE.md'), 'en');
  const out = renderPage(page, '# VERDE\n\n> English translation of [`VERDE.md`](../../VERDE.md).\n\nSee [CHANGELOG](CHANGELOG.md).\n');
  assert.match(out, /\[`VERDE\.md`\]\(\/estandar\/\)/);
  assert.match(out, /\[CHANGELOG\]\(\/en\/changelog\/\)/);
});

test('sync generates every page in every locale, with no relative links left', () => {
  const docs = mkdtempSync(join(tmpdir(), 'verde-docs-'));
  assert.ok(sync({ docs }) > PAGES.length * Object.keys(LOCALES).length);
  for (const dir of ['', 'en/']) {
    for (const version of ['index', 'sin-publicar', 'v1-3-0', 'v1-0']) {
      assert.ok(existsSync(join(docs, `${dir}changelog/${version}.md`)), `${dir}changelog/${version}.md`);
    }
  }
  for (const locale of Object.keys(LOCALES)) {
    for (const base of PAGES) {
      const page = localize(base, locale);
      const file = join(docs, page.dest);
      assert.ok(existsSync(file), page.dest);
      const body = readFileSync(file, 'utf8');
      assert.doesNotMatch(body, /\]\((?!https?:|\/|#)[^)]+\)/, `relative link left in ${page.dest}`);
      assert.doesNotMatch(body, /\[\[/, `wikilink left in ${page.dest}`);
      if (locale === 'en') {
        const spanish = [...body.matchAll(/\]\((\/(?:estandar|guias|ejemplo|changelog)[^)#]*)/g)].map((m) => m[1]);
        assert.ok(spanish.every((route) => route === base.route), `Spanish route in ${page.dest}: ${spanish}`);
      }
    }
  }
});

test('the changelog is split into one page per version, with the same slugs in every locale', () => {
  const es = splitVersions('# Changelog\n\nIntro.\n\n## Sin publicar\n\n- Algo.\n\n## v1.3.0 — 2026-11-13\n\n- Otro.\n\n## v1.2 — 2026-11-12\n\n- Más.\n');
  assert.equal(es.intro, 'Intro.');
  assert.deepEqual(es.sections.map((s) => [s.slug, s.title, s.date, s.released]), [
    ['sin-publicar', 'Sin publicar', '', false],
    ['v1-3-0', 'v1.3.0', '2026-11-13', true],
    ['v1-2', 'v1.2', '2026-11-12', true],
  ]);
  const en = splitVersions('# Changelog\n\n## Unreleased\n\n- Something.\n');
  assert.equal(en.sections[0].slug, 'sin-publicar');
  assert.equal(en.sections[0].body, '- Something.');
});
