// URL normalisation + near-duplicate clustering (same story from several publishers).
import { createHash } from 'node:crypto';

const TRACKING = /^(utm_\w+|ref|ref_src|fbclid|gclid|igshid|mc_cid|mc_eid|oc|source)$/i;

export function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    u.hash = '';
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
    for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
    u.pathname = u.pathname.replace(/\/+$/, '') || '/';
    let s = u.toString();
    if (s.endsWith('/')) s = s.slice(0, -1);
    return s;
  } catch {
    return String(raw).trim();
  }
}

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'with', 'by', 'at', 'from', 'as', 'is', 'are', 'be', 'this', 'that', 'its', 'it', 'new', 'india', 'indian', 'govt', 'government', 'says', 'how', 'what', 'why', 'will', 'may', 'can', 'you', 'your', 'latest', 'update', 'updates', 'explained', 'here', 'know', 'key', 'all', 'about', 'after', 'over', 'into', 'per', 'cent', 'rs', 'crore', 'lakh', 'vs']);

export function titleTokens(title) {
  return new Set(
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s%₹-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

export function stableId(seed) {
  return createHash('sha1').update(seed).digest('hex').slice(0, 12);
}

/**
 * Groups items that share a normalised URL, or whose titles overlap ≥ threshold within `windowMs`.
 * Keeps the earliest-published item as the lead; others become `alsoReportedBy`.
 */
export function dedupe(items, { threshold = 0.5, windowMs = 3 * 86400_000 } = {}) {
  const byUrl = new Map();
  for (const it of items) {
    const key = normalizeUrl(it.url);
    const prev = byUrl.get(key);
    if (!prev || (it.publishedAt && prev.publishedAt && it.publishedAt < prev.publishedAt)) byUrl.set(key, { ...it, url: it.url, alsoReportedBy: prev ? mergeAlso(prev, it) : [] });
    else if (prev) prev.alsoReportedBy = mergeAlso(prev, it);
  }
  // Earliest sighting first, so the first publisher to report a story leads its cluster.
  const unique = [...byUrl.values()].sort((a, b) => String(a.publishedAt || '').localeCompare(String(b.publishedAt || '')));
  const clusters = [];
  for (const it of unique) {
    const toks = titleTokens(it.title);
    const t = it.publishedAt ? Date.parse(it.publishedAt) : 0;
    let home = null;
    for (const c of clusters) {
      if (Math.abs(c.time - t) > windowMs) continue;
      const j = jaccard(c.tokens, toks);
      let shared = 0;
      for (const w of toks) if (c.tokens.has(w)) shared++;
      if (j >= threshold || (shared >= 4 && j >= 0.35)) { home = c; break; }
    }
    if (home) {
      home.lead.alsoReportedBy = mergeAlso(home.lead, it);
      for (const tag of it.topics || []) if (!home.lead.topics.includes(tag)) home.lead.topics.push(tag);
      for (const tag of it.affects || []) if (!home.lead.affects.includes(tag)) home.lead.affects.push(tag);
      if (!home.lead.publishedAt || (it.publishedAt && it.publishedAt > home.lead.publishedAt)) {
        // keep the lead's own timestamp (earliest sighting); nothing to do
      }
    } else {
      clusters.push({ lead: it, tokens: toks, time: t });
    }
  }
  return clusters.map((c) => c.lead);
}

function mergeAlso(lead, other) {
  const list = Array.isArray(lead.alsoReportedBy) ? [...lead.alsoReportedBy] : [];
  const name = other.publisher || other.sourceName;
  if (!name) return list;
  if (name === (lead.publisher || lead.sourceName)) return list;
  if (list.some((x) => x.name === name)) return list;
  list.push({ name, url: other.url });
  return list.slice(0, 6);
}
