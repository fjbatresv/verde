import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PAGES,
  REPO_URL,
  escapePlaceholders,
  mapOutsideCode,
  renderPage,
  resolveLink,
  rewriteWikilinks,
  splitFrontmatter,
  tasksToSymbols,
  sync,
} from './sync-docs.mjs';

test('links to synced files become site routes, with anchors', () => {
  assert.equal(resolveLink('CHANGELOG.md', 'VERDE.md'), '/changelog/');
  assert.equal(resolveLink('vault/08-Status/2026-11-19%20Status.md', 'examples/acme/README.md'), '/ejemplo/status/');
  assert.equal(resolveLink('../../../../VERDE.md#8-la-puerta', 'templates/repo/docs/guides/review.md'), '/estandar/#8-la-puerta');
});

test('links to other repo files go to GitHub (blob for files, tree for folders)', () => {
  assert.equal(resolveLink('LICENSE', 'README.md'), `${REPO_URL}/blob/main/LICENSE`);
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
  const out = rewriteWikilinks('Ver [[ACME-12-revision]], [[Otra nota|alias]] y ![[captura.png]].');
  assert.equal(out, 'Ver [ACME-12-revision](/ejemplo/revision/), alias y *(captura: captura.png)*.');
});

test('frontmatter is split from the body', () => {
  assert.deepEqual(splitFrontmatter('---\na: 1\n---\n# T\n'), { frontmatter: 'a: 1', body: '# T\n' });
  assert.deepEqual(splitFrontmatter('# T\n'), { frontmatter: '', body: '# T\n' });
});

test('rendered page has Starlight frontmatter and no H1', () => {
  const page = PAGES.find((p) => p.dest === 'ejemplo/revision.md');
  const out = renderPage(page, '---\ntipo: revision\n---\n\n# Revisión\n\nTexto [[ACME-12-agente1-cancelar-reserva]].\n');
  assert.match(out, /^---\ntitle: "Revisión · ACME-12"\n/);
  assert.match(out, /editUrl: "https:\/\/github\.com\/fjbatresv\/verde\/edit\/main\/examples\/acme\/vault\/06-Revisiones\/ACME-12-revision\.md"/);
  assert.match(out, /sidebar:\n {2}label: "4\. Revisión"\n {2}order: 4\n---/);
  assert.match(out, /```yaml\ntipo: revision\n```/);
  assert.doesNotMatch(out, /^# Revisión/m);
  assert.match(out, /\[ACME-12-agente1-cancelar-reserva\]\(\/ejemplo\/encargo\/\)/);
});

test('sync generates every page from the real repo, with no relative links left', () => {
  const docs = mkdtempSync(join(tmpdir(), 'verde-docs-'));
  assert.equal(sync({ docs }), PAGES.length);
  for (const page of PAGES) {
    const file = join(docs, page.dest);
    assert.ok(existsSync(file), page.dest);
    const body = readFileSync(file, 'utf8');
    assert.doesNotMatch(body, /\]\((?!https?:|\/|#)[^)]+\)/, `relative link left in ${page.dest}`);
    assert.doesNotMatch(body, /\[\[/, `wikilink left in ${page.dest}`);
  }
});

test('task lists become symbols, outside code only', () => {
  const out = tasksToSymbols('- [ ] pendiente\n  - [x] hecho\n\n```md\n- [ ] código\n```\n');
  assert.equal(out, '- ☐ pendiente\n  - ☑ hecho\n\n```md\n- [ ] código\n```\n');
});
