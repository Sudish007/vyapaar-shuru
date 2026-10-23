// Build the static site into an output directory.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadContent } from './content.js';
import { SITE } from './templates.js';
import * as pages from './pages.js';

async function readJsonSafe(file, fallback) {
  if (!existsSync(file)) return fallback;
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return fallback; }
}

async function write(outDir, relPath, html) {
  const file = path.join(outDir, relPath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}

export function buildSearchIndex(c) {
  const docs = [];
  for (const g of c.guides) {
    docs.push({ kind: 'Guide', title: g.title, url: `guides/${g.slug}/`, text: g.summary, keywords: [g.section, ...g.topics, ...g.affects].join(' ') });
    for (const h of g.headings.filter((x) => x.depth === 2)) docs.push({ kind: 'Section', title: `${g.title} › ${h.text}`, url: `guides/${g.slug}/#${h.id}`, text: '', keywords: g.section });
  }
  for (const p of c.paths) docs.push({ kind: 'Path', title: p.title, url: `paths/${p.slug}/`, text: p.tagline, keywords: p.who.join(' ') });
  for (const s of c.steps) docs.push({ kind: 'Step', title: s.title, url: `plan/#${s.stage}`, text: s.why.slice(0, 160), keywords: s.stage });
  for (const t of c.thresholds) docs.push({ kind: 'Number', title: `${t.value} — ${t.what}`, url: `guides/${t.guide}/`, text: t.since, keywords: t.topic });
  for (const p of c.portals) docs.push({ kind: 'Portal', title: p.name, url: p.url, text: p.what, keywords: p.category, external: true });
  for (const g of c.glossary) docs.push({ kind: 'Glossary', title: g.term, url: `glossary/#${g.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, text: g.def.slice(0, 160), keywords: '' });
  docs.push({ kind: 'Page', title: 'Compliance calendar', url: 'calendar/', text: 'Due dates by month', keywords: 'deadline due date' });
  docs.push({ kind: 'Page', title: 'Tools', url: 'tools/', text: 'Structure chooser, GST applicability, import duty, set-up cost', keywords: 'calculator' });
  docs.push({ kind: 'Page', title: 'Updates', url: 'updates/', text: 'Regulatory updates feed', keywords: 'news notification circular' });
  return docs;
}

export async function buildSite({ root, outDir, basePath = '/vyapaar-shuru/' }) {
  const contentDir = path.join(root, 'content');
  const siteDir = path.join(root, 'site');
  const dataDir = path.join(root, 'data');
  const c = await loadContent(contentDir);
  const updates = await readJsonSafe(path.join(dataDir, 'updates.json'), { generatedAt: null, items: [] });
  const meta = await readJsonSafe(path.join(dataDir, 'meta.json'), { generatedAt: null, sources: [], counts: { ok: 0, empty: 0, failed: 0 }, topicCounts: {}, itemCount: 0, retentionDays: 60 });

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(siteDir, outDir, { recursive: true });
  if (existsSync(dataDir)) await cp(dataDir, path.join(outDir, 'data'), { recursive: true });
  else await mkdir(path.join(outDir, 'data'), { recursive: true });

  const written = [];
  const emit = async (relPath, html) => { await write(outDir, relPath, html); written.push(relPath); };

  await emit('index.html', pages.homePage(c, updates, meta));
  await emit('paths/index.html', pages.pathsIndexPage(c));
  for (const p of c.paths) await emit(`paths/${p.slug}/index.html`, pages.pathPage(p, c));
  await emit('guides/index.html', pages.guidesIndexPage(c));
  for (const g of c.guides) await emit(`guides/${g.slug}/index.html`, pages.guidePage(g, c));
  await emit('plan/index.html', pages.planPage(c));
  await emit('tools/index.html', pages.toolsPage(c));
  await emit('updates/index.html', pages.updatesPage(meta));
  await emit('calendar/index.html', pages.calendarPage(c));
  await emit('portals/index.html', pages.portalsPage(c));
  await emit('glossary/index.html', pages.glossaryPage(c));
  await emit('sources/index.html', pages.sourcesPage(c, meta));
  // 404 pages are served for any missing path, so relative URLs would break: pin the base.
  await emit('404.html', pages.notFoundPage().replace('<head>', `<head>\n<base href="${basePath}">`));

  await writeFile(path.join(outDir, 'data', 'search.json'), JSON.stringify(buildSearchIndex(c)));
  await writeFile(path.join(outDir, '.nojekyll'), '');
  await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://sudish007.github.io${basePath}sitemap.xml\n`);
  const urls = written.filter((w) => w !== '404.html').map((w) => `https://sudish007.github.io${basePath}${w.replace(/index\.html$/, '')}`);
  await writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${SITE.reviewed}</lastmod></url>`).join('\n')}\n</urlset>\n`);

  return { pages: written.length, guides: c.guides.length, paths: c.paths.length, steps: c.steps.length, items: updates.items.length, content: c };
}
