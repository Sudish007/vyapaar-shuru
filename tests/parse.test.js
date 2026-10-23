import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, splitGoogleNewsTitle, stripHtml } from '../src/feed/parse.js';

const RSS = `<?xml version="1.0"?><rss version="2.0"><channel><title>T</title>
<item><title><![CDATA[GST Council recommends Rule 14B - TaxGuru]]></title><link>https://example.com/a?utm_source=x</link><pubDate>Thu, 22 Oct 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Some &amp; <b>bold</b> text</p>]]></description></item>
<item><title>No link item</title></item>
</channel></rss>`;

const ATOM = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>A</title>
<entry><title>RBI notification</title><link rel="alternate" href="https://rbi.org.in/x"/><link rel="self" href="https://rbi.org.in/self"/><updated>2026-10-21T05:00:00Z</updated><summary>Sum</summary></entry>
</feed>`;

test('parses RSS items with CDATA, dates and html-stripped descriptions', () => {
  const items = parseFeed(RSS);
  assert.equal(items.length, 1, 'items without a link are dropped');
  assert.equal(items[0].title, 'GST Council recommends Rule 14B - TaxGuru');
  assert.equal(items[0].url, 'https://example.com/a?utm_source=x');
  assert.equal(items[0].publishedAt, '2026-10-22T10:00:00.000Z');
  assert.equal(items[0].summary, 'Some & bold text');
});

test('parses Atom entries preferring the alternate link', () => {
  const items = parseFeed(ATOM);
  assert.equal(items.length, 1);
  assert.equal(items[0].url, 'https://rbi.org.in/x');
  assert.equal(items[0].publishedAt, '2026-10-21T05:00:00.000Z');
});

test('rejects non-feed documents', () => {
  assert.throws(() => parseFeed('<html><body>challenge</body></html>'), /not an RSS or Atom/);
});

test('splits Google News "Headline - Publisher" titles conservatively', () => {
  assert.deepEqual(splitGoogleNewsTitle('GST reforms from Nov 1 - The Economic Times'), { title: 'GST reforms from Nov 1', publisher: 'The Economic Times' });
  assert.deepEqual(splitGoogleNewsTitle('Income tax - a long trailing clause that is clearly not a publisher name at all here'), { title: 'Income tax - a long trailing clause that is clearly not a publisher name at all here', publisher: null });
  assert.deepEqual(splitGoogleNewsTitle('Plain title'), { title: 'Plain title', publisher: null });
});

test('stripHtml decodes entities and collapses whitespace', () => {
  assert.equal(stripHtml('<p>A&nbsp;&amp;  B &#8377;5 &lt;x&gt;</p>'), 'A & B ₹5 <x>');
});
