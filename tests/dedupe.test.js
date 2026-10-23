import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, dedupe, jaccard, titleTokens, stableId } from '../src/feed/dedupe.js';

test('normalizeUrl strips tracking params, fragments, www and trailing slash', () => {
  assert.equal(normalizeUrl('https://www.Example.com/a/?utm_source=x&id=2&fbclid=9#top'), 'https://example.com/a?id=2');
  assert.equal(normalizeUrl('not a url'), 'not a url');
});

test('stableId is deterministic and short', () => {
  assert.equal(stableId('a|b'), stableId('a|b'));
  assert.equal(stableId('a|b').length, 12);
  assert.notEqual(stableId('a|b'), stableId('a|c'));
});

test('jaccard over title tokens ignores stopwords', () => {
  const a = titleTokens('Govt to bear certification costs for micro, small exporters: Goyal');
  const b = titleTokens('Government to bear certification cost for MSME exporters: Goyal');
  assert.ok(jaccard(a, b) > 0.3);
  assert.ok(!a.has('to') && !a.has('for'));
});

function item(title, url, publishedAt, publisher) {
  return { title, url, publishedAt, publisher, sourceName: publisher, topics: ['gst'], affects: [], alsoReportedBy: [] };
}

test('dedupe merges identical URLs and near-duplicate titles into one lead with alsoReportedBy', () => {
  const items = [
    item('Simplified GST registration for small e-commerce sellers from Nov 1', 'https://a.com/x', '2026-10-22T10:00:00.000Z', 'A'),
    item('Simplified GST registration for small e-commerce sellers from Nov 1', 'https://a.com/x?utm_source=rss', '2026-10-22T11:00:00.000Z', 'A'),
    item('Small e-commerce sellers get simplified GST registration from Nov 1', 'https://b.com/y', '2026-10-22T12:00:00.000Z', 'B'),
    item('RBI delegates FEMA compounding to regional offices', 'https://c.com/z', '2026-10-22T13:00:00.000Z', 'C'),
  ];
  const out = dedupe(items);
  assert.equal(out.length, 2);
  const lead = out.find((i) => i.url.startsWith('https://a.com'));
  assert.ok(lead, 'earliest sighting leads');
  assert.deepEqual(lead.alsoReportedBy.map((x) => x.name), ['B']);
});

test('dedupe does not merge different stories that share a few words', () => {
  const items = [
    item('GST Council meeting on 8 October: key decisions', 'https://a.com/1', '2026-10-08T10:00:00.000Z', 'A'),
    item('GST collections rise 9% in September', 'https://b.com/2', '2026-10-08T10:00:00.000Z', 'B'),
  ];
  assert.equal(dedupe(items).length, 2);
});
