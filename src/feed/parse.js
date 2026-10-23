// Parse RSS 2.0 / Atom feeds into plain items. Google News RSS titles carry
// "Headline - Publisher"; the publisher is split off and kept.
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '#cdata',
  textNodeName: '#text',
  trimValues: true,
  parseTagValue: false,
  processEntities: true,
});

function text(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return text(node[0]);
  if (typeof node === 'object') {
    if (node['#cdata'] != null) return text(node['#cdata']);
    if (node['#text'] != null) return text(node['#text']);
    if (node['@_href']) return node['@_href'];
  }
  return '';
}

export function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

function atomLink(entry) {
  const links = Array.isArray(entry.link) ? entry.link : [entry.link].filter(Boolean);
  const alt = links.find((l) => l && typeof l === 'object' && (!l['@_rel'] || l['@_rel'] === 'alternate'));
  return text(alt || links[0]);
}

function parseDate(value) {
  const s = text(value);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Split "Headline - Publisher" (Google News) into parts; returns {title, publisher|null}. */
export function splitGoogleNewsTitle(title) {
  const idx = title.lastIndexOf(' - ');
  if (idx <= 0 || idx > title.length - 4) return { title: title.trim(), publisher: null };
  const publisher = title.slice(idx + 3).trim();
  if (publisher.length > 60 || publisher.split(' ').length > 7) return { title: title.trim(), publisher: null };
  return { title: title.slice(0, idx).trim(), publisher };
}

/** @returns {{title:string,url:string,publishedAt:string|null,summary:string,publisher:string|null}[]} */
export function parseFeed(xml) {
  let doc;
  try {
    doc = parser.parse(xml);
  } catch (err) {
    throw new Error(`xml parse failed: ${String(err.message || err).slice(0, 80)}`);
  }
  const items = [];
  if (doc.rss && doc.rss.channel) {
    const channel = Array.isArray(doc.rss.channel) ? doc.rss.channel[0] : doc.rss.channel;
    const list = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];
    for (const it of list) {
      items.push({
        title: stripHtml(text(it.title)),
        url: text(it.link) || text(it.guid),
        publishedAt: parseDate(it.pubDate) || parseDate(it['dc:date']),
        summary: stripHtml(text(it.description) || text(it['content:encoded'])),
        source: stripHtml(text(it.source)) || null,
      });
    }
  } else if (doc.feed) {
    const list = doc.feed.entry ? (Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry]) : [];
    for (const e of list) {
      items.push({
        title: stripHtml(text(e.title)),
        url: atomLink(e),
        publishedAt: parseDate(e.published) || parseDate(e.updated),
        summary: stripHtml(text(e.summary) || text(e.content)),
        source: null,
      });
    }
  } else {
    throw new Error('not an RSS or Atom document');
  }
  return items.filter((i) => i.title && i.url).map((i) => ({ ...i, publisher: null }));
}
