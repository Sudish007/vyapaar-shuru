// Small HTTP client for the feed pipeline: browser-like headers, timeout, body cap,
// bounded retries, and bounded error details (status + diagnostic headers + snippet).
// No secrets are used anywhere in this project, but detail strings are still capped.

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const DEFAULT_ACCEPT = 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.9, text/html;q=0.8, */*;q=0.5';

export class HttpError extends Error {
  constructor(status, url, detail) {
    super(`HTTP ${status} for ${url}`);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
    this.detail = detail;
  }
}
export class TimeoutError extends Error {
  constructor(url) { super(`timeout for ${url}`); this.name = 'TimeoutError'; }
}
export class BodyTooLarge extends Error {
  constructor(url, max) { super(`body exceeds ${max} bytes for ${url}`); this.name = 'BodyTooLarge'; }
}

export function errorSummary(err) {
  if (!err) return 'unknown error';
  if (err instanceof HttpError) return `HTTP ${err.status}${err.detail ? ' ' + err.detail : ''}`.slice(0, 160);
  if (err.name === 'TimeoutError') return 'timeout';
  if (err.name === 'BodyTooLarge') return 'body too large';
  const cause = err.cause && err.cause.code ? ` ${err.cause.code}` : '';
  return `${err.name || 'Error'}${cause}: ${String(err.message || '').slice(0, 100)}`.slice(0, 160);
}

function headerDetail(res) {
  const parts = [];
  for (const k of ['server', 'cf-mitigated', 'content-type']) {
    const v = res.headers.get(k);
    if (v) parts.push(`${k}=${v.split(';')[0].slice(0, 40)}`);
  }
  return parts.join(' ');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createHttpClient({ fetchImpl = globalThis.fetch, timeoutMs = 20000, maxBytes = 3_000_000, retries = 2, backoffMs = 1500, sleepImpl = sleep } = {}) {
  async function once(url, headers) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, { headers, redirect: 'follow', signal: ac.signal });
      const text = await res.text();
      if (text.length > maxBytes) throw new BodyTooLarge(url, maxBytes);
      if (!res.ok) {
        const snippet = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
        throw new HttpError(res.status, url, `${headerDetail(res)}${snippet ? ' | ' + snippet : ''}`.trim());
      }
      return { text, contentType: (res.headers.get('content-type') || '').split(';')[0], finalUrl: res.url || url };
    } catch (err) {
      if (err && err.name === 'AbortError') throw new TimeoutError(url);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    /** GET text with retries on 429/5xx/network/timeout. Never retries 4xx other than 429. */
    async getText(url, { accept = DEFAULT_ACCEPT } = {}) {
      const headers = { 'User-Agent': CHROME_UA, Accept: accept, 'Accept-Language': 'en-IN,en;q=0.9' };
      let lastErr;
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await once(url, headers);
        } catch (err) {
          lastErr = err;
          const status = err instanceof HttpError ? err.status : 0;
          const retryable = err.name === 'TimeoutError' || err.name === 'TypeError' || status === 429 || status >= 500;
          if (!retryable || attempt === retries) break;
          await sleepImpl(backoffMs * (attempt + 1));
        }
      }
      throw lastErr;
    },
  };
}
