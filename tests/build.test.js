import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = await mkdtemp(path.join(tmpdir(), 'vyapaar-shuru-build-'));
const result = await buildSite({ root, outDir: out, basePath: '/vyapaar-shuru/' });

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
}
const files = await walk(out);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const pages = await Promise.all(htmlFiles.map(async (f) => ({ file: path.relative(out, f).replace(/\\/g, '/'), html: await readFile(f, 'utf8') })));

test('builds every page and the data artefacts', () => {
  assert.ok(result.pages >= 45, `pages: ${result.pages}`);
  for (const must of ['index.html', 'paths/index.html', 'guides/index.html', 'plan/index.html', 'tools/index.html', 'updates/index.html', 'calendar/index.html', 'portals/index.html', 'glossary/index.html', 'sources/index.html', '404.html', 'styles.css', 'app.js', 'favicon.svg', 'data/search.json', 'sitemap.xml', 'robots.txt', '.nojekyll', 'fonts/inter-normal-latin.woff2']) {
    assert.ok(files.some((f) => path.relative(out, f).replace(/\\/g, '/') === must), `missing ${must}`);
  }
});

test('every page has exactly one h1, a title, a description and the shared shell', () => {
  for (const { file, html } of pages) {
    const h1s = html.match(/<h1[\s>]/g) || [];
    assert.equal(h1s.length, 1, `${file}: ${h1s.length} h1`);
    assert.match(html, /<title>[^<]{5,}<\/title>/, file);
    assert.match(html, /<meta name="description" content="[^"]{20,}"/, file);
    assert.match(html, /<nav class="site-nav"/, file);
    assert.match(html, /app\.js" defer>/, file);
    assert.match(html, /<html lang="en-IN">/, file);
  }
});

test('all internal links are relative and resolve to built files; no absolute root links', () => {
  const set = new Set(files.map((f) => path.relative(out, f).replace(/\\/g, '/')));
  let checked = 0;
  for (const { file, html } of pages) {
    if (file === '404.html') continue;
    const dir = path.posix.dirname(file);
    for (const m of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|data:)/.test(href)) continue;
      assert.ok(!href.startsWith('/'), `${file}: absolute link ${href}`);
      const target = path.posix.normalize(path.posix.join(dir, href.split('?')[0]));
      const candidates = [target, path.posix.join(target, 'index.html'), target.replace(/\/$/, '') + '/index.html'];
      assert.ok(candidates.some((c) => set.has(c)), `${file}: broken link ${href}`);
      checked++;
    }
  }
  assert.ok(checked > 500, `checked ${checked} links`);
});

test('404 page pins its base path so relative URLs survive any missing path', () => {
  const p = pages.find((x) => x.file === '404.html');
  assert.match(p.html, /<base href="\/vyapaar-shuru\/">/);
});

test('guide pages render their sources, key numbers and a disclaimer; home shows real feed items', () => {
  const gst = pages.find((x) => x.file === 'guides/gst-registration/index.html');
  assert.match(gst.html, /Key numbers in this guide/);
  assert.match(gst.html, /₹40 lakh/);
  assert.match(gst.html, /<h2 style="font-size:var\(--fs-h3\); margin-bottom:.75rem">Sources<\/h2>/);
  assert.match(gst.html, /class="disclaimer"/);
  const home = pages.find((x) => x.file === 'index.html');
  assert.match(home.html, /data-feed-latest/);
  assert.ok((home.html.match(/class="update-row"/g) || []).length >= 1, 'home has feed rows from data/updates.json');
  assert.match(home.html, /in-depth guides/);
});

test('search index covers guides, paths, steps, portals and glossary', async () => {
  const idx = JSON.parse(await readFile(path.join(out, 'data', 'search.json'), 'utf8'));
  const kinds = new Set(idx.map((d) => d.kind));
  for (const k of ['Guide', 'Section', 'Path', 'Step', 'Number', 'Portal', 'Glossary']) assert.ok(kinds.has(k), k);
  for (const d of idx) assert.ok(d.title && d.url && !d.url.startsWith('/'), JSON.stringify(d));
});

test('sitemap lists the public pages with https URLs', async () => {
  const xml = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  assert.ok((xml.match(/<loc>https:\/\/sudish007\.github\.io\/vyapaar-shuru\//g) || []).length >= 45);
  assert.ok(!xml.includes('404.html'));
});

test.after(async () => { await rm(out, { recursive: true, force: true }); });
