import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, validate } from '../src/build/content.js';
import { parseFrontMatter, renderMarkdown } from '../src/build/markdown.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = await loadContent(path.join(root, 'content'));

test('content loads with the expected shape and cross-references validate', () => {
  assert.ok(content.guides.length >= 25, 'at least 25 guides');
  assert.equal(content.paths.length, 11);
  assert.ok(content.steps.length >= 60);
  assert.ok(content.thresholds.length >= 25);
  assert.ok(content.portals.length >= 50);
  assert.ok(content.glossary.length >= 60);
  assert.doesNotThrow(() => validate(content));
});

test('every guide has a review date, a summary, at least one source and at least three sections', () => {
  for (const g of content.guides) {
    assert.match(g.updated, /^\d{4}-\d{2}-\d{2}$/, g.slug);
    assert.ok(g.summary.length > 60 && g.summary.length < 400, `${g.slug} summary length`);
    assert.ok(g.sources.length >= 1, `${g.slug} sources`);
    assert.ok(g.headings.filter((h) => h.depth === 2).length >= 3, `${g.slug} sections`);
    assert.ok(g.words >= 500, `${g.slug} is substantive (${g.words} words)`);
  }
});

test('every path recommends a structure, lists costs, taxes, pitfalls and unique resolvable steps covering the core stages', () => {
  for (const p of content.paths) {
    assert.ok(p.structure.recommended && p.structure.why, p.slug);
    assert.ok(p.costs.low <= p.costs.high && p.costs.breakdown.length >= 3, p.slug);
    assert.ok(p.taxes.length >= 3 && p.pitfalls.length >= 3 && p.selling.length >= 2, p.slug);
    assert.equal(new Set(p.steps).size, p.steps.length, `${p.slug}: duplicate steps`);
    const stages = new Set(p.steps.map((id) => content.byStep[id].stage));
    for (const must of ['decide', 'tax', 'bank', 'run']) assert.ok(stages.has(must), `${p.slug}: no ${must} step`);
    assert.ok(['proprietor', 'partnership', 'llp', 'opc', 'pvt'].includes(p.selections.structure), p.slug);
  }
});

test('steps use only known applicability keys and selection values', () => {
  const KEYS = new Set(['always', 'structures', 'selling', 'channels', 'flags', 'employeesMin']);
  const STRUCTURES = new Set(['proprietor', 'partnership', 'llp', 'opc', 'pvt']);
  const SELLING = new Set(['goods', 'digital', 'services']);
  const CHANNELS = new Set(['own-site', 'marketplace', 'offline-store', 'b2b', 'export', 'import']);
  const FLAGS = new Set(['food', 'packaged-goods', 'manufacturing', 'electronics', 'foreign-payments', 'foreign-entity', 'foreign-investors', 'regulated']);
  for (const s of content.steps) {
    for (const k of Object.keys(s.applies)) assert.ok(KEYS.has(k), `${s.id}: key ${k}`);
    for (const v of s.applies.structures || []) assert.ok(STRUCTURES.has(v), `${s.id}: structure ${v}`);
    for (const v of s.applies.selling || []) assert.ok(SELLING.has(v), `${s.id}: selling ${v}`);
    for (const v of s.applies.channels || []) assert.ok(CHANNELS.has(v), `${s.id}: channel ${v}`);
    for (const v of s.applies.flags || []) assert.ok(FLAGS.has(v), `${s.id}: flag ${v}`);
  }
  const ids = content.steps.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'step ids unique');
});

test('thresholds carry a value, a dated basis, an official-looking source and a guide', () => {
  for (const t of content.thresholds) {
    assert.ok(t.value && t.what && t.since && t.detail, t.id);
    assert.match(t.source.url, /^https:\/\//, t.id);
    assert.ok(content.byGuide[t.guide], `${t.id} → ${t.guide}`);
  }
});

test('front matter parser handles scalars, inline arrays and dash lists', () => {
  const { data, body } = parseFrontMatter('---\ntitle: Hi there\norder: 2\ntags: [a, b]\nsources:\n  - One | https://x\n  - Two | https://y\n---\nBody');
  assert.deepEqual(data, { title: 'Hi there', order: 2, tags: ['a', 'b'], sources: ['One | https://x', 'Two | https://y'] });
  assert.equal(body, 'Body');
});

test('markdown renders callouts, heading anchors, wrapped tables and safe external links', () => {
  const headings = [];
  const html = renderMarkdown('## Rules\n\n:::warning Careful\nText here\n:::\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[x](https://ex.com) and [y](../other/)', { headings });
  assert.match(html, /<h2 id="rules">Rules<a class="anchor"/);
  assert.match(html, /callout callout-warning/);
  assert.match(html, /<p class="callout-title">Careful<\/p>/);
  assert.match(html, /<div class="table-wrap"><table>/);
  assert.match(html, /href="https:\/\/ex.com" rel="noopener noreferrer" target="_blank"/);
  assert.match(html, /<a href="..\/other\/">y<\/a>/);
  assert.deepEqual(headings, [{ depth: 2, id: 'rules', text: 'Rules' }]);
});
