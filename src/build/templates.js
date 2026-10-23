// HTML templates. Every URL is relative (the site is served under /vyapaar-shuru/ on GitHub Pages).
import { escapeHtml as esc } from './markdown.js';

export const SITE = {
  name: 'Vyapaar Shuru',
  tagline: 'Start your business in India without missing a step',
  description: 'Vyapaar Shuru is a free, research-backed guide for Indian founders: business structures, registrations, licences, GST, income tax, audits, record-keeping, selling online and offline, import–export and going international — plus a daily feed of regulatory updates.',
  repo: 'https://github.com/Sudish007/vyapaar-shuru',
  reviewed: '2026-10-23',
};

export const NAV = [
  { href: 'paths/', label: 'Paths' },
  { href: 'guides/', label: 'Guides' },
  { href: 'plan/', label: 'My plan' },
  { href: 'tools/', label: 'Tools' },
  { href: 'calendar/', label: 'Calendar' },
  { href: 'updates/', label: 'Updates' },
];

const ICONS = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  theme: '<svg viewBox="0 0 24 24" aria-hidden="true" class="theme-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
};

export function rel(depth) {
  return depth ? '../'.repeat(depth) : './';
}

export function formatDate(iso, { withTime = false } = {}) {
  if (!iso) return '';
  const d = new Date(iso);
  const opts = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' };
  if (withTime) Object.assign(opts, { hour: '2-digit', minute: '2-digit', hour12: false });
  return new Intl.DateTimeFormat('en-IN', opts).format(d) + (withTime ? ' IST' : '');
}

export function layout({ title, description, path, depth = 0, body, current = '', extraHead = '', bodyClass = '' }) {
  const r = rel(depth);
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const navLinks = NAV.map((n) => `<a href="${r}${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${n.label}</a>`).join('');
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || SITE.description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f8f6f1">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || SITE.description)}">
<meta property="og:type" content="website">
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${r}fonts/inter-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}styles.css">
<script>(function(){try{var t=localStorage.getItem('vyapaarshuru:theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();</script>
${extraHead}
</head>
<body class="${bodyClass}" data-root="${r}" data-path="${esc(path)}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="${r}" aria-label="${SITE.name} home"><span class="brand-mark" aria-hidden="true"></span>${SITE.name}<small>India</small></a>
    <nav class="site-nav" aria-label="Primary">${navLinks}</nav>
    <div class="header-actions">
      <button class="icon-btn" type="button" data-action="search" aria-label="Search (press slash)">${ICONS.search}<span class="label">Search</span><kbd aria-hidden="true">/</kbd></button>
      <button class="icon-btn" type="button" data-action="theme" aria-label="Switch to dark theme" aria-pressed="false">${ICONS.theme}<span class="label theme-label">Light</span></button>
      <button class="icon-btn menu-btn" type="button" data-action="menu" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${ICONS.menu}</button>
    </div>
  </div>
  <nav class="container mobile-nav" id="mobile-nav" aria-label="Primary (mobile)" data-open="false">${navLinks}</nav>
</header>
<main id="main">
${body}
</main>
${footer(r)}
<dialog class="search" id="search-dialog" aria-label="Search the site">
  <form class="search-head" method="dialog" role="search">
    ${ICONS.search}
    <input type="search" id="search-input" placeholder="Search guides, steps, portals, glossary…" autocomplete="off" aria-label="Search">
    <button class="icon-btn" type="submit" aria-label="Close search">Esc</button>
  </form>
  <ul class="search-results" id="search-results" aria-live="polite"></ul>
</dialog>
<script src="${r}app.js" defer></script>
</body>
</html>
`;
}

function footer(r) {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h2>About</h2>
        <p>${SITE.name} (शुरुआत, “the beginning”) is an independent, free guide for people starting a business in India. Content reviewed ${formatDate(SITE.reviewed)}. Laws and fees change; every page names its sources and the portal where you can confirm the current rule.</p>
      </div>
      <div>
        <h2>Start</h2>
        <ul>
          <li><a href="${r}paths/">Choose a path</a></li>
          <li><a href="${r}plan/">Build my checklist</a></li>
          <li><a href="${r}guides/choose-a-structure/">Choose a business structure</a></li>
          <li><a href="${r}guides/gst-registration/">Register for GST</a></li>
          <li><a href="${r}calendar/">Compliance calendar</a></li>
        </ul>
      </div>
      <div>
        <h2>Reference</h2>
        <ul>
          <li><a href="${r}guides/">All guides</a></li>
          <li><a href="${r}portals/">Government portals</a></li>
          <li><a href="${r}glossary/">Glossary</a></li>
          <li><a href="${r}updates/">Regulatory updates</a></li>
          <li><a href="${r}sources/">Sources &amp; method</a></li>
        </ul>
      </div>
      <div>
        <h2>Not legal advice</h2>
        <p>This site explains rules in plain language and links to the official text. It is not legal, tax or accounting advice. For your specific facts, confirm with a Chartered Accountant or Company Secretary before you file or pay.</p>
      </div>
    </div>
    <div class="footer-note">
      <span>© ${new Date().getUTCFullYear()} ${SITE.name}. Text licensed CC BY 4.0; code MIT.</span>
      <span><a href="${SITE.repo}" rel="noopener noreferrer" target="_blank">Source on GitHub</a></span>
    </div>
  </div>
</footer>`;
}

export function breadcrumbs(r, trail) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${trail
    .map((t, i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(t.label)}</span>` : `<a href="${r}${t.href}">${esc(t.label)}</a><span aria-hidden="true">›</span>`))
    .join('')}</nav>`;
}

export function updateRow(item, r) {
  const d = formatDate(item.publishedAt);
  return `<div class="update-row"><time datetime="${esc(item.publishedAt)}">${d}</time><a href="${esc(item.url)}" rel="noopener noreferrer" target="_blank">${esc(item.title)}</a><div class="meta"><span>${esc(item.publisher)}</span>${item.topics.slice(0, 2).map((t) => `<span class="tag">${esc(topicLabel(t))}</span>`).join('')}</div></div>`;
}

const TOPIC_LABELS = {
  gst: 'GST', 'income-tax': 'Income tax', companies: 'Companies & LLP', 'startup-india': 'Startup India', msme: 'MSME', trade: 'Import & export', 'rbi-fema': 'RBI & FEMA', labour: 'Labour & payroll', 'consumer-ecommerce': 'E-commerce & consumer', 'data-digital': 'Data & digital', 'food-fssai': 'Food & FSSAI', ip: 'IP & trademarks', 'budget-policy': 'Budget & policy', state: 'States',
};
export function topicLabel(id) { return TOPIC_LABELS[id] || id; }

export function stepCard(step, { r, index, portals }) {
  const portal = step.portal && portals[step.portal];
  const dl = [
    portal ? ['Where', `<a href="${esc(portal.url)}" rel="noopener noreferrer" target="_blank">${esc(portal.name)}</a>`] : null,
    step.cost ? ['Cost', esc(step.cost)] : null,
    step.time ? ['Time', esc(step.time)] : null,
    step.when ? ['When', esc(step.when)] : null,
  ].filter(Boolean);
  const docs = (step.docs || []).length ? `<div><b class="small">Documents</b><ul class="docs">${step.docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>` : '';
  const guide = step.guide ? `<p class="small"><a href="${r}guides/${esc(step.guide)}/">Read the guide →</a></p>` : '';
  return `<li class="step" data-step="${esc(step.id)}">
  <input type="checkbox" id="step-${esc(step.id)}-${index}" data-step-check="${esc(step.id)}" aria-label="Mark “${esc(step.title)}” done">
  <label class="step-title" for="step-${esc(step.id)}-${index}">${esc(step.title)}</label>
  <div class="step-body">
    <p>${esc(step.why)}</p>
    <details><summary>How to do it</summary><div class="more"><p>${esc(step.how)}</p>${dl.length ? `<dl>${dl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}${docs}${guide}</div></details>
  </div>
</li>`;
}

export function disclaimer() {
  return `<p class="disclaimer">Plain-language explanation, not legal or tax advice. Thresholds, fees and forms change through notifications; the figures here were checked against the sources listed on ${formatDate(SITE.reviewed)}. Confirm on the official portal before you act, and use a Chartered Accountant or Company Secretary for your specific facts.</p>`;
}
