#!/usr/bin/env node
// Refresh the Updates feed: data/updates.json, data/meta.json, data/archive/YYYY-MM.json
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHttpClient } from '../src/http.js';
import { runPipeline } from '../src/feed/pipeline.js';
import { SOURCES } from '../sources.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.env.VYAPAAR_DATA_DIR ? path.resolve(process.env.VYAPAAR_DATA_DIR) : path.join(root, 'data');
await mkdir(path.join(outDir, 'archive'), { recursive: true });

let previous = null;
const prevPath = path.join(outDir, 'updates.json');
if (existsSync(prevPath)) {
  try { previous = JSON.parse(await readFile(prevPath, 'utf8')); } catch { previous = null; }
}

const http = createHttpClient({ timeoutMs: 25000, retries: 2 });
const started = Date.now();
const { items, meta } = await runPipeline({ sources: SOURCES, http, previous, log: (line) => console.log(line) });

await writeFile(path.join(outDir, 'updates.json'), JSON.stringify({ generatedAt: meta.generatedAt, items }, null, 0) + '\n');
await writeFile(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

// Monthly archive: union of everything seen for that month (never shrinks).
const byMonth = new Map();
for (const it of items) {
  const m = it.publishedAt.slice(0, 7);
  if (!byMonth.has(m)) byMonth.set(m, []);
  byMonth.get(m).push(it);
}
for (const [month, list] of byMonth) {
  const file = path.join(outDir, 'archive', `${month}.json`);
  let existing = [];
  if (existsSync(file)) { try { existing = JSON.parse(await readFile(file, 'utf8')).items || []; } catch { existing = []; } }
  const seen = new Map(existing.map((i) => [i.id, i]));
  for (const i of list) seen.set(i.id, i);
  const merged = [...seen.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await writeFile(file, JSON.stringify({ month, items: merged }, null, 0) + '\n');
}
const archiveIndex = [...byMonth.keys()].sort().reverse();
await writeFile(path.join(outDir, 'archive', 'index.json'), JSON.stringify({ months: archiveIndex }) + '\n');

console.log(`\n${items.length} items · sources ok=${meta.counts.ok} empty=${meta.counts.empty} failed=${meta.counts.failed} · ${((Date.now() - started) / 1000).toFixed(1)}s → ${outDir}`);
if (!items.length) { console.error('No items at all — refusing to publish an empty feed.'); process.exit(1); }
