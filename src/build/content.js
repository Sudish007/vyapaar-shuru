// Load and validate all content: guides (Markdown + front matter), paths, steps, thresholds,
// portals, glossary, calendar. Throws on broken cross-references so the build (and tests) fail loudly.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontMatter, renderMarkdown } from './markdown.js';

export const SECTIONS = ['Decide', 'Register', 'Tax', 'Licences & IP', 'Money', 'Sell', 'Trade & global', 'People & data', 'Run'];

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export function parseSources(list = []) {
  return list.map((s) => {
    const [title, url] = String(s).split('|').map((x) => x.trim());
    return { title, url };
  });
}

export function readingMinutes(text) {
  const words = String(text).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function loadContent(contentDir) {
  const guidesDir = path.join(contentDir, 'guides');
  const pathsDir = path.join(contentDir, 'paths');
  const dataDir = path.join(contentDir, 'data');

  const guides = [];
  for (const file of (await readdir(guidesDir)).filter((f) => f.endsWith('.md')).sort()) {
    const raw = await readFile(path.join(guidesDir, file), 'utf8');
    const { data, body } = parseFrontMatter(raw);
    const headings = [];
    const html = renderMarkdown(body, { headings });
    const slug = file.replace(/\.md$/, '');
    if (!data.title || !data.section || !data.summary) throw new Error(`guide ${slug}: title, section and summary are required`);
    if (!SECTIONS.includes(data.section)) throw new Error(`guide ${slug}: unknown section "${data.section}"`);
    guides.push({
      slug,
      title: data.title,
      section: data.section,
      order: Number(data.order || 99),
      summary: data.summary,
      updated: String(data.updated || ''),
      affects: data.affects || [],
      topics: data.topics || [],
      numbers: data.numbers || [],
      portals: data.portals || [],
      related: data.related || [],
      sources: parseSources(data.sources || []),
      headings: headings.filter((h) => h.depth === 2 || h.depth === 3),
      html,
      minutes: readingMinutes(body),
      words: body.split(/\s+/).filter(Boolean).length,
    });
  }
  guides.sort((a, b) => SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) || a.order - b.order || a.title.localeCompare(b.title));

  const paths = [];
  for (const file of (await readdir(pathsDir)).filter((f) => f.endsWith('.json')).sort()) {
    paths.push(await readJson(path.join(pathsDir, file)));
  }
  const PATH_ORDER = ['freelancer', 'd2c-brand', 'marketplace-seller', 'saas-digital', 'services-agency', 'local-store', 'food-business', 'manufacturing', 'import-trading', 'export-business', 'social-enterprise'];
  paths.sort((a, b) => PATH_ORDER.indexOf(a.slug) - PATH_ORDER.indexOf(b.slug));

  const stepsFile = await readJson(path.join(dataDir, 'steps.json'));
  const thresholds = await readJson(path.join(dataDir, 'thresholds.json'));
  const portals = await readJson(path.join(dataDir, 'portals.json'));
  const glossary = await readJson(path.join(dataDir, 'glossary.json'));
  const calendar = await readJson(path.join(dataDir, 'calendar.json'));

  const content = {
    guides,
    paths,
    stages: stepsFile.stages,
    steps: stepsFile.steps,
    thresholds,
    portals,
    glossary,
    calendar,
    byGuide: Object.fromEntries(guides.map((g) => [g.slug, g])),
    byStep: Object.fromEntries(stepsFile.steps.map((s) => [s.id, s])),
    byThreshold: Object.fromEntries(thresholds.map((t) => [t.id, t])),
    byPortal: Object.fromEntries(portals.map((p) => [p.id, p])),
  };
  validate(content);
  return content;
}

export function validate(c) {
  const errors = [];
  const stageIds = new Set(c.stages.map((s) => s.id));
  for (const s of c.steps) {
    if (!stageIds.has(s.stage)) errors.push(`step ${s.id}: unknown stage ${s.stage}`);
    if (s.guide && !c.byGuide[s.guide]) errors.push(`step ${s.id}: unknown guide ${s.guide}`);
    if (s.portal && !c.byPortal[s.portal]) errors.push(`step ${s.id}: unknown portal ${s.portal}`);
    if (!s.title || !s.why || !s.how) errors.push(`step ${s.id}: title/why/how required`);
  }
  for (const p of c.paths) {
    for (const id of p.steps) if (!c.byStep[id]) errors.push(`path ${p.slug}: unknown step ${id}`);
    for (const g of p.guides || []) if (!c.byGuide[g]) errors.push(`path ${p.slug}: unknown guide ${g}`);
    if (!p.selections || !p.structure) errors.push(`path ${p.slug}: selections and structure required`);
  }
  for (const g of c.guides) {
    for (const r of g.related) if (!c.byGuide[r]) errors.push(`guide ${g.slug}: unknown related ${r}`);
    for (const n of g.numbers) if (!c.byThreshold[n]) errors.push(`guide ${g.slug}: unknown threshold ${n}`);
    for (const p of g.portals) if (!c.byPortal[p]) errors.push(`guide ${g.slug}: unknown portal ${p}`);
    for (const s of g.sources) if (!s.url || !/^https?:\/\//.test(s.url)) errors.push(`guide ${g.slug}: bad source "${s.title}"`);
  }
  for (const t of c.thresholds) if (t.guide && !c.byGuide[t.guide]) errors.push(`threshold ${t.id}: unknown guide ${t.guide}`);
  for (const e of c.calendar.events) if (e.portal && !c.byPortal[e.portal]) errors.push(`calendar event "${e.what}": unknown portal ${e.portal}`);
  if (errors.length) throw new Error('Content validation failed:\n' + errors.join('\n'));
}
