// Fetch every source, parse, tag, gate, dedupe, merge with the previous snapshot and
// emit data/updates.json + data/meta.json (+ monthly archives). Pure functions where possible
// so tests can run it against fixtures.
import { parseFeed, splitGoogleNewsTitle } from './parse.js';
import { classify, isRelevant } from './classify.js';
import { dedupe, normalizeUrl, stableId } from './dedupe.js';
import { errorSummary } from '../http.js';

export const RETENTION_DAYS = 60;
export const MAX_ITEMS = 900;

// "Income Tax | Headline" style category prefixes (TaxGuru and similar) are display noise.
const CATEGORY_PREFIX = /^[A-Za-z ,&\/-]{2,30}\s\|\s/;

export function normalizeItem(raw, source, now) {
  let title = raw.title.trim().replace(CATEGORY_PREFIX, '');
  let publisher = null;
  if (source.kind === 'gnews') {
    const split = splitGoogleNewsTitle(title);
    title = split.title;
    publisher = split.publisher || raw.source || null;
  }
  const publishedAt = raw.publishedAt || now;
  const summary = source.kind === 'gnews' ? '' : raw.summary.slice(0, 320);
  const { topics, affects } = classify(title, summary);
  if (source.topicHint && !topics.includes(source.topicHint) && source.kind === 'official') topics.push(source.topicHint);
  return {
    id: stableId(normalizeUrl(raw.url) + '|' + title.toLowerCase()),
    title,
    url: raw.url,
    publisher: publisher || source.name,
    sourceId: source.id,
    sourceName: source.name,
    sourceKind: source.kind,
    publishedAt,
    summary,
    topics,
    affects,
    alsoReportedBy: [],
  };
}

export async function fetchSource(source, http, now) {
  const t0 = Date.now();
  try {
    const { text } = await http.getText(source.url);
    const parsed = parseFeed(text);
    const items = [];
    let filtered = 0;
    const cutoff = Date.parse(now) - RETENTION_DAYS * 86400_000;
    for (const raw of parsed) {
      const item = normalizeItem(raw, source, now);
      if (Date.parse(item.publishedAt) < cutoff) { filtered++; continue; }
      if (source.include && !source.include.test(`${item.title} ${item.summary}`)) { filtered++; continue; }
      if (!isRelevant(item.title, item.summary, item.topics, item.publisher, source.kind)) { filtered++; continue; }
      items.push(item);
    }
    return { source, status: parsed.length ? (items.length ? 'ok' : 'empty') : 'empty', fetched: parsed.length, kept: items.length, filtered, items, ms: Date.now() - t0, error: null };
  } catch (err) {
    return { source, status: 'failed', fetched: 0, kept: 0, filtered: 0, items: [], ms: Date.now() - t0, error: errorSummary(err) };
  }
}

export function mergeSnapshots(previousItems, freshItems, now) {
  const cutoff = Date.parse(now) - RETENTION_DAYS * 86400_000;
  const all = [...(previousItems || []), ...freshItems].filter((i) => Date.parse(i.publishedAt) >= cutoff && Date.parse(i.publishedAt) <= Date.parse(now) + 86400_000);
  const unique = dedupe(all);
  unique.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return unique.slice(0, MAX_ITEMS);
}

export async function runPipeline({ sources, http, previous, now = new Date().toISOString(), concurrency = 4, log = () => {} }) {
  const results = [];
  const queue = [...sources];
  async function worker() {
    while (queue.length) {
      const src = queue.shift();
      const r = await fetchSource(src, http, now);
      log(`${r.status.padEnd(6)} ${src.id.padEnd(18)} fetched=${r.fetched} kept=${r.kept} filtered=${r.filtered} ${r.ms}ms${r.error ? ' ' + r.error : ''}`);
      results.push(r);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, worker));
  results.sort((a, b) => sources.indexOf(a.source) - sources.indexOf(b.source));

  const fresh = results.flatMap((r) => r.items);
  const items = mergeSnapshots(previous && previous.items, fresh, now);
  const topicCounts = {};
  for (const it of items) for (const t of it.topics) topicCounts[t] = (topicCounts[t] || 0) + 1;

  const meta = {
    generatedAt: now,
    retentionDays: RETENTION_DAYS,
    itemCount: items.length,
    topicCounts,
    sources: results.map((r) => ({
      id: r.source.id,
      name: r.source.name,
      kind: r.source.kind,
      homepage: r.source.homepage,
      status: r.status,
      fetched: r.fetched,
      kept: r.kept,
      filtered: r.filtered,
      ms: r.ms,
      error: r.error,
      note: r.source.note || null,
    })),
    counts: {
      ok: results.filter((r) => r.status === 'ok').length,
      empty: results.filter((r) => r.status === 'empty').length,
      failed: results.filter((r) => r.status === 'failed').length,
    },
  };
  return { items, meta };
}
