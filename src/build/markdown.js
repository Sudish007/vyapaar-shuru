// Markdown → HTML for guides. marked with: heading ids + anchors, responsive table wrappers,
// external links opening safely, and ::: callout blocks (note | tip | warning | law).
import { Marked } from 'marked';

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const callout = {
  name: 'callout',
  level: 'block',
  start(src) { return src.match(/^:::/m)?.index; },
  tokenizer(src) {
    const m = /^:::(note|tip|warning|law|example)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::(?:\n|$)/.exec(src);
    if (!m) return undefined;
    return { type: 'callout', raw: m[0], kind: m[1], title: (m[2] || '').trim(), tokens: this.lexer.blockTokens(m[3]) };
  },
  renderer(token) {
    const labels = { note: 'Note', tip: 'Tip', warning: 'Watch out', law: 'The rule', example: 'Example' };
    const title = token.title || labels[token.kind];
    return `<aside class="callout callout-${token.kind}" role="note"><p class="callout-title">${escapeHtml(title)}</p>${this.parser.parse(token.tokens)}</aside>\n`;
  },
};

export function createMarkdown({ headings } = {}) {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({ extensions: [callout] });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, '');
        let id = slugify(plain) || `h-${depth}`;
        if (headings) {
          const seen = headings.filter((h) => h.id === id || h.id.startsWith(id + '-')).length;
          if (seen) id = `${id}-${seen + 1}`;
          headings.push({ depth, id, text: plain });
        }
        return `<h${depth} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      table(token) {
        const header = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</th>`).join('');
        const rows = token.rows
          .map((row) => `<tr>${row.map((c, i) => `<td${token.header[i]?.align ? ` style="text-align:${token.header[i].align}"` : ''}>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`)
          .join('');
        return `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//i.test(href);
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return external
          ? `<a href="${escapeHtml(href)}"${t} rel="noopener noreferrer" target="_blank">${text}</a>`
          : `<a href="${escapeHtml(href)}"${t}>${text}</a>`;
      },
    },
  });
  return marked;
}

export function renderMarkdown(src, { headings } = {}) {
  return createMarkdown({ headings }).parse(src);
}

/** Tiny front-matter parser: `key: value`, `key: [a, b]`, and `key:` followed by `- item` lines. */
export function parseFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let listKey = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) { data[listKey].push(coerce(item[1])); continue; }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === '') { data[key] = []; listKey = key; continue; }
    listKey = null;
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map((v) => coerce(v.trim())).filter((v) => v !== '');
    } else data[key] = coerce(value);
  }
  return { data, body: m[2] };
}

function coerce(v) {
  const s = String(v).trim().replace(/^["']|["']$/g, '');
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}
