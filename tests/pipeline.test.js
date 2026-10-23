import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline, normalizeItem, mergeSnapshots } from '../src/feed/pipeline.js';
import { createHttpClient, HttpError } from '../src/http.js';

const NOW = '2026-10-23T12:00:00.000Z';
const rss = (items) => `<rss version="2.0"><channel><title>x</title>${items.map((i) => `<item><title>${i.title}</title><link>${i.url}</link><pubDate>${i.date}</pubDate><description>${i.desc || ''}</description></item>`).join('')}</channel></rss>`;

function fakeFetch(map) {
  return async (url) => {
    const hit = map[url];
    if (!hit) return { ok: false, status: 404, url, headers: new Headers({ server: 'test' }), text: async () => 'not found' };
    if (hit.status && hit.status >= 400) return { ok: false, status: hit.status, url, headers: new Headers({ server: 'cloudflare', 'cf-mitigated': 'challenge' }), text: async () => '<html>Just a moment</html>' };
    return { ok: true, status: 200, url, headers: new Headers({ 'content-type': 'application/rss+xml' }), text: async () => hit.body };
  };
}

const sources = [
  { id: 'good', name: 'Good', kind: 'news', url: 'https://good/feed', homepage: 'https://good' },
  { id: 'blocked', name: 'Blocked', kind: 'news', url: 'https://blocked/feed', homepage: 'https://blocked', note: 'cf' },
  { id: 'gnews-x', name: 'Google News · X', kind: 'gnews', url: 'https://gn/feed', homepage: 'https://gn' },
  { id: 'empty', name: 'Empty', kind: 'news', url: 'https://empty/feed', homepage: 'https://empty' },
];

const map = {
  'https://good/feed': { body: rss([
    { title: 'CBIC issues GST notification on e-invoicing threshold', url: 'https://good/1', date: 'Thu, 22 Oct 2026 10:00:00 GMT' },
    { title: 'Sensex rallies 400 points', url: 'https://good/2', date: 'Thu, 22 Oct 2026 10:00:00 GMT' },
    { title: 'Old GST circular from last year', url: 'https://good/3', date: 'Thu, 22 Oct 2025 10:00:00 GMT' },
  ]) },
  'https://blocked/feed': { status: 403 },
  'https://gn/feed': { body: rss([
    { title: 'DGFT extends IEC update window for exporters - The Economic Times', url: 'https://news.google.com/rss/articles/abc?oc=5', date: 'Wed, 21 Oct 2026 09:00:00 GMT' },
    { title: 'Carney budget to help small businesses - National Post', url: 'https://news.google.com/rss/articles/def?oc=5', date: 'Wed, 21 Oct 2026 09:00:00 GMT' },
  ]) },
  'https://empty/feed': { body: rss([{ title: 'Cricket match preview', url: 'https://empty/1', date: 'Wed, 21 Oct 2026 09:00:00 GMT' }]) },
};

test('runPipeline records per-source status, filters noise, splits Google News publishers, drops stale items', async () => {
  const http = createHttpClient({ fetchImpl: fakeFetch(map), retries: 0, sleepImpl: async () => {} });
  const { items, meta } = await runPipeline({ sources, http, previous: null, now: NOW, concurrency: 2 });
  const byId = Object.fromEntries(meta.sources.map((s) => [s.id, s]));
  assert.equal(byId.good.status, 'ok');
  assert.equal(byId.good.kept, 1, 'market noise and stale items are not kept');
  assert.equal(byId.blocked.status, 'failed');
  assert.match(byId.blocked.error, /HTTP 403/);
  assert.match(byId.blocked.error, /cf-mitigated=challenge/);
  assert.equal(byId.empty.status, 'empty');
  assert.equal(byId['gnews-x'].kept, 1);
  assert.equal(meta.counts.failed, 1);
  assert.equal(meta.counts.empty, 1);
  assert.equal(items.length, 2);
  const gn = items.find((i) => i.sourceId === 'gnews-x');
  assert.equal(gn.publisher, 'The Economic Times');
  assert.equal(gn.title, 'DGFT extends IEC update window for exporters');
  assert.ok(gn.topics.includes('trade'));
  assert.ok(gn.affects.includes('exporter'));
  assert.deepEqual(Object.keys(meta.topicCounts).sort(), ['gst', 'trade']);
  assert.equal(items[0].publishedAt >= items[1].publishedAt, true, 'newest first');
});

test('mergeSnapshots keeps previous items inside the retention window and drops the rest', () => {
  const prev = [
    { id: 'p1', title: 'GST notification on refunds for exporters', url: 'https://p/1', publishedAt: '2026-09-30T00:00:00.000Z', topics: ['gst'], affects: [], alsoReportedBy: [] },
    { id: 'p2', title: 'Ancient GST news', url: 'https://p/2', publishedAt: '2026-06-01T00:00:00.000Z', topics: ['gst'], affects: [], alsoReportedBy: [] },
    { id: 'p3', title: 'Future dated item', url: 'https://p/3', publishedAt: '2026-11-30T00:00:00.000Z', topics: ['gst'], affects: [], alsoReportedBy: [] },
  ];
  const fresh = [{ id: 'f1', title: 'MCA circular on DIR-3 KYC', url: 'https://f/1', publishedAt: '2026-10-23T00:00:00.000Z', topics: ['companies'], affects: [], alsoReportedBy: [] }];
  const out = mergeSnapshots(prev, fresh, NOW);
  assert.deepEqual(out.map((i) => i.id), ['f1', 'p1']);
});

test('normalizeItem strips category prefixes and uses the source name as publisher for RSS', () => {
  const src = { id: 'taxguru', name: 'TaxGuru', kind: 'news' };
  const it = normalizeItem({ title: 'Goods and Services Tax | GST Rule 14B explained', url: 'https://t/1', publishedAt: NOW, summary: 'x' }, src, NOW);
  assert.equal(it.title, 'GST Rule 14B explained');
  assert.equal(it.publisher, 'TaxGuru');
  assert.equal(it.id.length, 12);
});

test('http client retries 5xx/429 but not 4xx, and surfaces HttpError details', async () => {
  let calls = 0;
  const fetchImpl = async (url) => { calls++; if (url.includes('flaky')) return { ok: calls >= 2, status: calls >= 2 ? 200 : 503, url, headers: new Headers(), text: async () => calls >= 2 ? 'ok' : 'busy' }; return { ok: false, status: 404, url, headers: new Headers(), text: async () => 'nope' }; };
  const http = createHttpClient({ fetchImpl, retries: 2, sleepImpl: async () => {} });
  const res = await http.getText('https://flaky');
  assert.equal(res.text, 'ok');
  assert.equal(calls, 2);
  calls = 0;
  await assert.rejects(() => http.getText('https://missing'), (e) => e instanceof HttpError && e.status === 404);
  assert.equal(calls, 1, '404 is not retried');
});
