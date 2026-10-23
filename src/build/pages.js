// Page renderers. Each returns the <main> inner HTML; layout() wraps it.
import { escapeHtml as esc } from './markdown.js';
import { SECTIONS } from './content.js';
import { SITE, layout, rel, formatDate, breadcrumbs, updateRow, stepCard, disclaimer, topicLabel } from './templates.js';

const AFFECT_LABELS = {
  ecommerce: 'Online sellers', exporter: 'Exporters', importer: 'Importers', saas: 'SaaS & digital', freelancer: 'Freelancers & consultants', food: 'Food businesses', manufacturer: 'Manufacturers', employer: 'Employers', company: 'Companies & LLPs', retailer: 'Local shops & services',
};
export const affectLabel = (id) => AFFECT_LABELS[id] || id;

function pathCard(p, r) {
  const sel = p.selections;
  return `<a class="card card-link path-card" href="${r}paths/${p.slug}/">
    <span class="eyebrow">${esc(p.structure.label || p.structure.recommended.split(/ \(|;| for | on your /)[0])}</span>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.tagline)}</p>
    <div class="meta"><span><b>${p.steps.length}</b> steps</span><span>Set-up <b>₹${p.costs.low.toLocaleString('en-IN')}–${p.costs.high.toLocaleString('en-IN')}</b></span>${sel.channels.includes('export') ? '<span class="tag">Exports</span>' : ''}</div>
  </a>`;
}

function numberCard(t, r) {
  return `<div class="number"><b>${esc(t.value)}</b><span class="what">${esc(t.what)}</span><span class="since">${esc(t.since)} · <a href="${r}guides/${esc(t.guide)}/">guide</a></span></div>`;
}

export function homePage(c, updates, meta) {
  const r = rel(0);
  const latest = (updates.items || []).slice(0, 7);
  const failed = meta.counts ? meta.counts.failed : 0;
  const stepCount = c.steps.length;
  const keyNumbers = c.thresholds.filter((t) => ['gst-threshold-goods', 'gst-threshold-services', 'gst-einvoice', 'it-presumptive-business', 'it-tax-audit', 'mca-small-company', 'startup-definition', 'msme-micro', 'fssai-tiers', 'epf-esi', 'trademark-fee', 'ecommerce-rules-2026'].includes(t.id));
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) })).filter((x) => x.guides.length);
  const body = `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <p class="eyebrow">For founders in India · Reviewed ${formatDate(SITE.reviewed)}</p>
      <h1>Start your business in India <em>without missing a step.</em></h1>
      <p class="lede">Structures, registrations, licences, GST, income tax, audits and records; selling online, offline and abroad; importing, exporting and going global — explained for an Indian founder and kept current by a feed of official and expert updates.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${r}paths/">Find your path</a>
        <a class="btn btn-secondary" href="${r}plan/">Build my checklist</a>
        <a class="btn btn-ghost" href="${r}guides/">Browse all guides →</a>
      </div>
      <div class="hero-facts">
        <div><b class="num">${c.guides.length}</b><span>in-depth guides</span></div>
        <div><b class="num">${stepCount}</b><span>trackable steps</span></div>
        <div><b class="num">${c.paths.length}</b><span>business paths</span></div>
        <div><b class="num">${meta.sources ? meta.sources.length : 0}</b><span>update sources tracked</span></div>
      </div>
    </div>
    <aside class="panel" aria-labelledby="latest-title">
      <div class="panel-head"><h2 id="latest-title"><span class="live-dot" aria-hidden="true"></span>What changed recently</h2><a class="small" href="${r}updates/">All updates →</a></div>
      <div class="panel-body" data-feed-latest data-limit="7">${latest.map((i) => updateRow(i, r)).join('')}</div>
      <div class="panel-foot"><span>Keyword-tagged from ${meta.sources ? meta.sources.length : 0} sources · ${failed ? `${failed} failed on the last run` : 'all sources responded'} </span><span>Updated <time datetime="${esc(meta.generatedAt || '')}" data-feed-updated>${formatDate(meta.generatedAt, { withTime: true })}</time></span></div>
    </aside>
  </div>
</section>

<section class="section" id="paths">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">Pick your path</p><h2>What are you starting?</h2></div><p>Each path is an ordered checklist with the structure we would pick, the registrations, the taxes, where to sell and source, and the mistakes founders on that path make.</p></div>
    <div class="grid grid-cards">${c.paths.map((p) => pathCard(p, r)).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">The journey</p><h2>Ten stages, in the order they actually happen</h2></div><p>Most businesses touch every stage; the paths above decide which steps in each stage apply to you.</p></div>
    <div class="journey">${c.stages.map((s) => `<a href="${r}plan/#${s.id}"><b>${esc(s.title)}</b><span>${esc(s.blurb)}</span></a>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">Numbers you will meet</p><h2>Thresholds and limits, with the date we checked them</h2></div><p>Every figure links to the guide that explains it and to the official source. Watch the Updates feed for changes.</p></div>
    <div class="numbers">${keyNumbers.map((t) => numberCard(t, r)).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">Guides</p><h2>${c.guides.length} guides, grouped the way the work is grouped</h2></div><a class="btn btn-secondary btn-sm" href="${r}guides/">All guides</a></div>
    <div class="grid grid-3">${bySection.map((x) => `<div class="card"><p class="eyebrow">${esc(x.section)}</p><ul class="list-reset stack-sm" style="margin-top:.6rem">${x.guides.map((g) => `<li><a href="${r}guides/${g.slug}/"><b>${esc(g.title)}</b></a><br><span class="small muted">${esc(g.summary.split(' — ')[0].split('. ')[0]).slice(0, 110)}</span></li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">Tools</p><h2>Decide with numbers, not opinions</h2></div></div>
    <div class="grid grid-cards">
      <a class="card card-link" href="${r}tools/#structure"><h3>Structure chooser</h3><p class="muted">Answer six questions; get a recommendation with the reasons and the compliance cost it implies.</p></a>
      <a class="card card-link" href="${r}tools/#gst"><h3>GST applicability</h3><p class="muted">Mandatory, optional or not needed — and which scheme (regular, composition, QRMP, Rule 14A).</p></a>
      <a class="card card-link" href="${r}tools/#duty"><h3>Import duty estimator</h3><p class="muted">CIF + BCD + 10% SWS + IGST, with the creditable part separated.</p></a>
      <a class="card card-link" href="${r}tools/#costs"><h3>Set-up cost estimator</h3><p class="muted">Government fees and typical professional fees for the registrations you pick.</p></a>
      <a class="card card-link" href="${r}calendar/"><h3>Compliance calendar</h3><p class="muted">Your month-by-month due dates by structure and registrations.</p></a>
      <a class="card card-link" href="${r}plan/"><h3>My plan</h3><p class="muted">A personalised, saved checklist across all ten stages, exportable as Markdown or print.</p></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">Honesty</p><h2>What this site is, and is not</h2></div></div>
    <div class="grid grid-2">
      <div class="card stack"><h3>How it stays current</h3><p>A pipeline runs on a schedule, reads ${meta.sources ? meta.sources.length : 0} sources — RBI feeds, business press and targeted Google News queries that cover portals without feeds (GST, CBIC, MCA, DGFT, Startup India, FSSAI, MeitY) — filters them with keyword rules and publishes them on the <a href="${r}updates/">Updates</a> page. Nothing in the feed is written by a model; tags are keyword-based and labelled as such. Source health is public on the <a href="${r}sources/">Sources</a> page.</p></div>
      <div class="card stack"><h3>What to double-check</h3><p>Guides were researched against official portals and reputable professional sources and reviewed on ${formatDate(SITE.reviewed)}. Fees, thresholds and due dates move by notification. Each guide lists its sources and the portal to confirm on. This is not legal, tax or accounting advice — use it to ask your CA or CS the right questions.</p></div>
    </div>
  </div>
</section>`;
  return layout({ title: '', description: SITE.description, path: 'index.html', depth: 0, body, current: '' });
}

export function pathsIndexPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Paths' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Paths</p><h1>Choose the business you are starting</h1></div><p class="lede">Each path recommends a structure, orders the steps across the ten stages, estimates set-up cost and time, and lists the taxes, channels, sourcing routes and pitfalls specific to it. Tick steps as you go — progress is saved in this browser and shared with <a href="${r}plan/">My plan</a>.</p></div>
    <div class="grid grid-cards">${c.paths.map((p) => pathCard(p, r)).join('')}</div>
    <p class="muted small" style="margin-top:2rem">Not an exact fit? Build a custom checklist on <a href="${r}plan/">My plan</a> by answering six questions.</p>
  </div></section>`;
  return layout({ title: 'Paths — choose your business type', description: 'Eleven starting paths for Indian founders: freelancer, D2C brand, marketplace seller, SaaS, agency, local shop, food, manufacturing, import, export, non-profit.', path: 'paths/index.html', depth: 1, body, current: 'paths/' });
}

export function pathPage(p, c) {
  const r = rel(2);
  const stageOrder = c.stages.map((s) => s.id);
  const grouped = c.stages.map((stage) => ({ stage, steps: p.steps.map((id) => c.byStep[id]).filter((s) => s.stage === stage.id) })).filter((g) => g.steps.length);
  let index = 0;
  const stagesHtml = grouped.map((g) => `<section class="stage" id="${g.stage.id}" data-stage>
      <div class="stage-head"><h2>${esc(g.stage.title)}</h2><div class="progress" data-stage-progress><span class="bar"><i></i></span><span><span data-done>0</span>/<span data-total>${g.steps.length}</span> done</span></div></div>
      <ol class="steps list-reset">${g.steps.map((s) => stepCard(s, { r, index: index++, portals: c.byPortal })).join('')}</ol>
    </section>`).join('');
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { href: 'paths/', label: 'Paths' }, { label: p.title }])}
    <div class="hero-grid" style="margin-top:1rem; align-items:start">
      <div>
        <p class="eyebrow">Path</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.tagline)}</p>
        <div class="cluster" style="margin-top:1.25rem">${p.who.map((w) => `<span class="tag">${esc(w)}</span>`).join('')}</div>
      </div>
      <div class="card stack">
        <p class="eyebrow">Structure we would pick</p>
        <h2 style="font-size:var(--fs-h3)">${esc(p.structure.recommended)}</h2>
        <p>${esc(p.structure.why)}</p>
        <p class="small muted"><b>Alternatives:</b> ${esc(p.structure.alternatives)}</p>
        <div class="cluster"><a class="btn btn-secondary btn-sm" href="${r}tools/#structure">Check with the structure tool</a><a class="btn btn-primary btn-sm" href="${r}plan/?path=${esc(p.slug)}">Load into My plan</a></div>
      </div>
    </div>
  </div></section>
  <section class="section"><div class="container article-layout" style="padding-block:0">
    <nav class="toc" aria-label="Stages"><h2>Stages</h2><ol>${grouped.map((g) => `<li><a href="#${g.stage.id}">${esc(g.stage.title)}</a></li>`).join('')}<li><a href="#money">Money &amp; tax</a></li><li><a href="#channels">Sell &amp; source</a></li><li><a href="#pitfalls">Pitfalls</a></li></ol></nav>
    <div class="article">
      <div class="progress" style="margin-bottom:1.5rem" data-path-progress><span class="bar"><i></i></span><span><span data-done>0</span>/<span data-total>${p.steps.length}</span> steps done · saved in this browser</span></div>
      ${stagesHtml}
      <h2 id="money" style="margin-top:3rem">Money and tax on this path</h2>
      <div class="grid grid-2" style="margin-top:1rem">
        <div class="card"><h3>Set-up cost</h3><p class="result-big">₹${p.costs.low.toLocaleString('en-IN')} – ₹${p.costs.high.toLocaleString('en-IN')}</p><ul class="small" style="margin-top:.75rem; padding-left:1.2em">${p.costs.breakdown.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><p class="small muted" style="margin-top:.75rem">Indicative government and typical professional fees; excludes working capital, deposits and stock. Timeline: ${esc(p.timeline)}</p></div>
        <div class="card"><h3>Taxes you will meet</h3><ul style="padding-left:1.2em" class="stack-sm">${p.taxes.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
      <h2 id="channels" style="margin-top:3rem">Where to sell and where to source</h2>
      <div class="grid grid-2" style="margin-top:1rem">
        <div class="card"><h3>Selling channels</h3><ul style="padding-left:1.2em" class="stack-sm">${p.selling.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div class="card"><h3>Sourcing</h3><ul style="padding-left:1.2em" class="stack-sm">${p.sourcing.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
      <h2 id="pitfalls" style="margin-top:3rem">Pitfalls on this path</h2>
      <ul class="stack-sm" style="margin-top:1rem; padding-left:1.2em">${p.pitfalls.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="article-foot">${disclaimer()}</div>
    </div>
    <aside class="rail">
      <div class="card"><h2>Guides for this path</h2><ul>${(p.guides || []).map((g) => `<li><a href="${r}guides/${g}/">${esc(c.byGuide[g].title)}</a><small>${esc(c.byGuide[g].section)} · ${c.byGuide[g].minutes} min</small></li>`).join('')}</ul></div>
      <div class="card"><h2>Recent updates for ${esc(p.affects.map(affectLabel).join(', ').toLowerCase())}</h2><ul data-feed-affects="${esc(p.affects.join(','))}" data-limit="6"><li class="muted small">Loading…</li></ul><p class="small" style="margin-top:.75rem"><a href="${r}updates/?affects=${esc(p.affects[0])}">All updates →</a></p></div>
      <div class="card"><h2>Export this checklist</h2><div class="cluster"><button class="btn btn-secondary btn-sm" type="button" data-action="copy-md" data-title="${esc(p.title)}">Copy as Markdown</button><button class="btn btn-secondary btn-sm" type="button" data-action="print">Print</button></div></div>
    </aside>
  </div></section>`;
  return layout({ title: p.title, description: p.tagline, path: `paths/${p.slug}/index.html`, depth: 2, body, current: 'paths/' });
}

export function guidesIndexPage(c) {
  const r = rel(1);
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) })).filter((x) => x.guides.length);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Guides' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Guides</p><h1>${c.guides.length} guides for starting and running a business in India</h1></div><p class="lede">Each guide names its sources, the official portal, the thresholds it relies on and the date it was last reviewed. Together they cover the full arc from choosing a structure to exporting.</p></div>
    ${bySection.map((x) => `<h2 style="margin:2.5rem 0 1rem">${esc(x.section)}</h2><div class="grid grid-cards">${x.guides.map((g) => `<a class="card card-link" href="${r}guides/${g.slug}/"><h3>${esc(g.title)}</h3><p class="muted" style="margin-top:.5rem">${esc(g.summary)}</p><div class="meta" style="margin-top:.9rem"><span>${g.minutes} min read</span><span>Reviewed ${formatDate(g.updated)}</span><span>${g.sources.length} sources</span></div></a>`).join('')}</div>`).join('')}
  </div></section>`;
  return layout({ title: 'Guides', description: 'All guides: structures, incorporation, GST, income tax, TDS, audits, records, licences, trademarks, funding, hiring, DPDP, selling, sourcing, import, export, going international.', path: 'guides/index.html', depth: 1, body, current: 'guides/' });
}

export function guidePage(g, c) {
  const r = rel(2);
  const numbers = g.numbers.map((id) => c.byThreshold[id]);
  const portals = g.portals.map((id) => c.byPortal[id]);
  const related = g.related.map((s) => c.byGuide[s]);
  const stepsFromGuide = c.steps.filter((s) => s.guide === g.slug);
  const body = `<div class="container article-layout">
    <nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${g.headings.map((h) => `<li class="depth-${h.depth}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>
    <article class="article">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: 'Home' }, { href: 'guides/', label: 'Guides' }, { label: g.section }])}
        <p class="eyebrow" style="margin-top:1rem">${esc(g.section)}</p>
        <h1>${esc(g.title)}</h1>
        <p class="lede">${esc(g.summary)}</p>
        <div class="meta"><span>Reviewed <b>${formatDate(g.updated)}</b></span><span><b>${g.minutes}</b> min read</span><span><b>${g.sources.length}</b> sources</span>${g.affects.length ? `<span>For: ${g.affects.map((a) => `<span class="tag">${esc(affectLabel(a))}</span>`).join(' ')}</span>` : ''}</div>
      </header>
      <div class="prose">${g.html}</div>
      <footer class="article-foot">
        ${g.sources.length ? `<div><h2 style="font-size:var(--fs-h3); margin-bottom:.75rem">Sources</h2><ol class="sources-list" style="padding-left:1.2em">${g.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank">${esc(s.title)}</a></li>`).join('')}</ol></div>` : ''}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      ${numbers.length ? `<div class="card"><h2>Key numbers in this guide</h2><ul>${numbers.map((t) => `<li><b class="serif" style="font-size:1.25em">${esc(t.value)}</b><small>${esc(t.what)}</small><small class="muted">${esc(t.since)}</small></li>`).join('')}</ul></div>` : ''}
      ${portals.length ? `<div class="card"><h2>Official portals</h2><ul>${portals.map((p) => `<li><a href="${esc(p.url)}" rel="noopener noreferrer" target="_blank">${esc(p.name)}</a><small>${esc(p.what)}</small></li>`).join('')}</ul></div>` : ''}
      ${stepsFromGuide.length ? `<div class="card"><h2>Steps this guide supports</h2><ul>${stepsFromGuide.map((s) => `<li><a href="${r}plan/#${s.stage}">${esc(s.title)}</a></li>`).join('')}</ul></div>` : ''}
      ${g.topics.length ? `<div class="card"><h2>Recent updates on ${esc(g.topics.map(topicLabel).join(', '))}</h2><ul data-feed-topics="${esc(g.topics.join(','))}" data-limit="6"><li class="muted small">Loading…</li></ul><p class="small" style="margin-top:.75rem"><a href="${r}updates/?topic=${esc(g.topics[0])}">All updates →</a></p></div>` : ''}
      ${related.length ? `<div class="card"><h2>Related guides</h2><ul>${related.map((x) => `<li><a href="${r}guides/${x.slug}/">${esc(x.title)}</a><small>${esc(x.section)} · ${x.minutes} min</small></li>`).join('')}</ul></div>` : ''}
    </aside>
  </div>`;
  return layout({ title: g.title, description: g.summary, path: `guides/${g.slug}/index.html`, depth: 2, body, current: 'guides/' });
}

export function planPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'My plan' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">My plan</p><h1>Your checklist, built from six answers</h1></div><p class="lede">Pick what describes your business and the plan assembles the steps that apply across all ten stages. Answers and ticks are saved in this browser only — export to keep them.</p></div>
    <form class="card" id="plan-form" data-plan-form>
      <div class="grid grid-2">
        <div class="field"><span class="label">Structure</span><div class="options">${[['proprietor', 'Sole proprietorship'], ['partnership', 'Partnership firm'], ['llp', 'LLP'], ['opc', 'One Person Company'], ['pvt', 'Private limited'], ['undecided', 'Not decided yet']].map(([v, l]) => `<label class="option"><input type="radio" name="structure" value="${v}">${l}</label>`).join('')}</div><p class="hint">Not sure? Use the <a href="${r}tools/#structure">structure chooser</a>; “not decided” includes steps for all structures.</p></div>
        <div class="field"><span class="label">What do you sell?</span><div class="options">${[['goods', 'Physical goods'], ['digital', 'Digital products / software'], ['services', 'Services / consulting']].map(([v, l]) => `<label class="option"><input type="checkbox" name="selling" value="${v}">${l}</label>`).join('')}</div></div>
        <div class="field"><span class="label">Where will you sell?</span><div class="options">${[['own-site', 'My own website/app'], ['marketplace', 'Marketplaces (Amazon, Flipkart, Swiggy…)'], ['offline-store', 'A physical shop/outlet'], ['b2b', 'To businesses (B2B)'], ['export', 'To customers abroad'], ['import', 'I will import goods']].map(([v, l]) => `<label class="option"><input type="checkbox" name="channels" value="${v}">${l}</label>`).join('')}</div></div>
        <div class="field"><span class="label">Employees in the first year</span><div class="options">${[['none', 'Just me / co-founders'], ['1-9', '1–9'], ['10-19', '10–19'], ['20+', '20 or more']].map(([v, l]) => `<label class="option"><input type="radio" name="employees" value="${v}">${l}</label>`).join('')}</div></div>
        <div class="field"><span class="label">Anything special?</span><div class="options">${[['food', 'Food or beverages'], ['packaged-goods', 'Pre-packed products with labels'], ['manufacturing', 'I will manufacture'], ['electronics', 'Electronics / IT hardware'], ['foreign-payments', 'I will receive foreign payments'], ['foreign-entity', 'I may set up a company abroad'], ['foreign-investors', 'I may take foreign investors'], ['regulated', 'A regulated sector (pharma, finance, education…)']].map(([v, l]) => `<label class="option"><input type="checkbox" name="flags" value="${v}">${l}</label>`).join('')}</div></div>
        <div class="field"><label for="plan-state">State (for state-specific notes)</label><select id="plan-state" name="state" class="input"><option value="">Choose a state</option>${['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map((s) => `<option>${s}</option>`).join('')}</select><p class="hint" data-state-note></p></div>
      </div>
      <div class="cluster" style="margin-top:1.25rem"><button class="btn btn-primary" type="submit">Build my plan</button><button class="btn btn-secondary" type="button" data-action="plan-reset">Reset answers</button><span class="small muted" data-plan-summary></span></div>
    </form>
    <div id="plan-output" class="article-layout" style="padding-block:2.5rem 0" hidden>
      <nav class="toc" aria-label="Stages"><h2>Stages</h2><ol data-plan-toc></ol></nav>
      <div class="article">
        <div class="progress" style="margin-bottom:1.5rem" data-path-progress><span class="bar"><i></i></span><span><span data-done>0</span>/<span data-total>0</span> steps done · saved in this browser</span></div>
        <div data-plan-steps></div>
        <div class="article-foot">${disclaimer()}</div>
      </div>
      <aside class="rail">
        <div class="card"><h2>Export</h2><div class="cluster"><button class="btn btn-secondary btn-sm" type="button" data-action="copy-md" data-title="My plan">Copy as Markdown</button><button class="btn btn-secondary btn-sm" type="button" data-action="print">Print</button></div><p class="small muted" style="margin-top:.75rem">Ticks are shared with the path pages; nothing leaves this browser.</p></div>
        <div class="card"><h2>Next reads</h2><ul data-plan-guides></ul></div>
      </aside>
    </div>
    <template id="steps-data" data-json>${esc(JSON.stringify({ stages: c.stages, steps: c.steps, portals: Object.fromEntries(c.portals.map((p) => [p.id, { name: p.name, url: p.url }])), guides: Object.fromEntries(c.guides.map((g) => [g.slug, { title: g.title, section: g.section }])), paths: Object.fromEntries(c.paths.map((p) => [p.slug, p.selections])) }))}</template>
  </div></section>`;
  return layout({ title: 'My plan — personalised checklist', description: 'Answer six questions and get a saved, exportable checklist of every registration, licence, tax and compliance step for your business in India.', path: 'plan/index.html', depth: 1, body, current: 'plan/' });
}

export function toolsPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Tools' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Tools</p><h1>Four quick calculators</h1></div><p class="lede">Each result shows its basis. They are estimators built from the published rules on ${formatDate(SITE.reviewed)} — not filings.</p></div>
    <nav class="tool-tabs" aria-label="Tools"><a class="chip" href="#structure" data-tab="structure">Structure chooser</a><a class="chip" href="#gst" data-tab="gst">GST applicability</a><a class="chip" href="#duty" data-tab="duty">Import duty</a><a class="chip" href="#costs" data-tab="costs">Set-up cost</a></nav>

    <section id="structure" class="tool" data-tool-panel>
      <form class="card stack" data-tool="structure">
        <h2 style="font-size:var(--fs-h3)">Which structure fits?</h2>
        <div class="field"><span class="label">How many founders?</span><div class="options"><label class="option"><input type="radio" name="founders" value="1" checked>Just me</label><label class="option"><input type="radio" name="founders" value="2">Two or more</label></div></div>
        <div class="field"><span class="label">Will you raise equity (angels, VCs) within three years?</span><div class="options"><label class="option"><input type="radio" name="equity" value="no" checked>No / unlikely</label><label class="option"><input type="radio" name="equity" value="yes">Yes</label></div></div>
        <div class="field"><span class="label">Liability exposure of the business</span><div class="options"><label class="option"><input type="radio" name="liability" value="low" checked>Low (services, small volumes)</label><label class="option"><input type="radio" name="liability" value="high">High (imports, manufacturing, platforms, user data)</label></div></div>
        <div class="field"><span class="label">Expected annual profit after two years</span><div class="options"><label class="option"><input type="radio" name="profit" value="lt12" checked>Under ₹12 lakh</label><label class="option"><input type="radio" name="profit" value="12-50">₹12–50 lakh</label><label class="option"><input type="radio" name="profit" value="gt50">Over ₹50 lakh</label></div></div>
        <div class="field"><span class="label">Do you want to take most profit home each year?</span><div class="options"><label class="option"><input type="radio" name="takehome" value="yes" checked>Yes, it is my income</label><label class="option"><input type="radio" name="takehome" value="no">No, reinvest</label></div></div>
        <div class="field"><span class="label">Are you in a specified profession (IT, design, consulting, legal, medical, accountancy, engineering, architecture)?</span><div class="options"><label class="option"><input type="radio" name="profession" value="yes">Yes</label><label class="option"><input type="radio" name="profession" value="no" checked>No</label></div></div>
      </form>
      <div class="result" data-tool-result="structure" aria-live="polite"></div>
    </section>

    <section id="gst" class="tool" data-tool-panel hidden>
      <form class="card stack" data-tool="gst">
        <h2 style="font-size:var(--fs-h3)">Do I need GST registration?</h2>
        <div class="field"><span class="label">What do you supply?</span><div class="options"><label class="option"><input type="radio" name="supply" value="goods" checked>Only goods</label><label class="option"><input type="radio" name="supply" value="services">Services (or goods + services)</label></div></div>
        <div class="field"><label for="gst-turnover">Expected aggregate turnover this financial year (₹ lakh)</label><input id="gst-turnover" class="input" type="number" name="turnover" min="0" step="1" value="15"></div>
        <div class="field"><span class="label">Your state</span><div class="options"><label class="option"><input type="radio" name="state" value="normal" checked>Any other state</label><label class="option"><input type="radio" name="state" value="special">Special-category state (NE states, Uttarakhand, Puducherry, Telangana for goods)</label></div></div>
        <div class="field"><span class="label">Tick all that apply</span><div class="options">
          <label class="option"><input type="checkbox" name="interstate">I will sell goods to other states</label>
          <label class="option"><input type="checkbox" name="marketplace">I will sell through Amazon, Flipkart, Meesho, Swiggy or similar</label>
          <label class="option"><input type="checkbox" name="export">I will export goods or services</label>
          <label class="option"><input type="checkbox" name="import">I will import goods</label>
          <label class="option"><input type="checkbox" name="foreignsaas">I pay for foreign software/ads (reverse charge)</label>
          <label class="option"><input type="checkbox" name="b2b">My customers are mostly GST-registered businesses</label>
          <label class="option"><input type="checkbox" name="restaurant">I run a restaurant/café/cloud kitchen</label>
        </div></div>
        <div class="field"><label for="gst-outputtax">Expected monthly output tax on B2B sales (₹ lakh) — for the simplified route</label><input id="gst-outputtax" class="input" type="number" name="outputtax" min="0" step="0.1" value="0.5"></div>
      </form>
      <div class="result" data-tool-result="gst" aria-live="polite"></div>
    </section>

    <section id="duty" class="tool" data-tool-panel hidden>
      <form class="card stack" data-tool="duty">
        <h2 style="font-size:var(--fs-h3)">Landed duty on an import</h2>
        <div class="field"><label for="duty-cif">CIF value in INR (goods + insurance + freight)</label><input id="duty-cif" class="input" type="number" name="cif" min="0" step="100" value="100000"></div>
        <div class="field"><label for="duty-bcd">Basic Customs Duty rate (%) — from the ITC-HS tariff</label><input id="duty-bcd" class="input" type="number" name="bcd" min="0" max="150" step="0.5" value="20"></div>
        <div class="field"><label for="duty-sws">Social Welfare Surcharge (% of BCD)</label><input id="duty-sws" class="input" type="number" name="sws" min="0" max="10" step="1" value="10"></div>
        <div class="field"><label for="duty-cess">Other cess on value (%, e.g. AIDC; usually 0)</label><input id="duty-cess" class="input" type="number" name="cess" min="0" max="100" step="0.5" value="0"></div>
        <div class="field"><span class="label">IGST rate</span><div class="options"><label class="option"><input type="radio" name="igst" value="5">5%</label><label class="option"><input type="radio" name="igst" value="18" checked>18%</label><label class="option"><input type="radio" name="igst" value="40">40%</label><label class="option"><input type="radio" name="igst" value="0">0% (exempt)</label></div></div>
        <div class="field"><label for="duty-adv">Anti-dumping / safeguard duty (₹, if any)</label><input id="duty-adv" class="input" type="number" name="add" min="0" step="100" value="0"></div>
        <div class="field"><label for="duty-cha">Clearing, port and local transport (₹)</label><input id="duty-cha" class="input" type="number" name="cha" min="0" step="100" value="12000"></div>
      </form>
      <div class="result" data-tool-result="duty" aria-live="polite"></div>
    </section>

    <section id="costs" class="tool" data-tool-panel hidden>
      <form class="card stack" data-tool="costs">
        <h2 style="font-size:var(--fs-h3)">What will set-up cost?</h2>
        <p class="muted small">Government fees are fixed where the law fixes them; professional fees are typical 2026 market ranges. Tick what you will need.</p>
        <div class="options" data-cost-items>
          ${[
            ['pvt', 'Private limited incorporation (2 DSCs, name, SPICe+, stamp duty)', 3200, 12000, 7000, 21000],
            ['llp', 'LLP incorporation (DSCs, FiLLiP, agreement duty, Form 3)', 2200, 9000, 6000, 15000],
            ['partnership', 'Partnership deed + registration', 1000, 6000, 2000, 8000],
            ['gst', 'GST registration', 0, 0, 1000, 3000],
            ['udyam', 'Udyam registration', 0, 0, 0, 0],
            ['dpiit', 'DPIIT startup recognition', 0, 0, 0, 5000],
            ['tm1', 'Trademark — 1 class (startup/MSME rate)', 4500, 4500, 3000, 8000],
            ['tm2', 'Trademark — 2 classes (startup/MSME rate)', 9000, 9000, 5000, 12000],
            ['iec', 'IEC + AD code', 500, 2500, 0, 2000],
            ['fssai-reg', 'FSSAI registration (≤ ₹1.5 cr)', 100, 100, 500, 1500],
            ['fssai-state', 'FSSAI State licence', 2000, 5000, 2000, 6000],
            ['shops', 'Shops & Establishment registration', 0, 5000, 500, 2000],
            ['trade', 'Municipal trade licence', 500, 10000, 500, 3000],
            ['lmpc', 'Legal Metrology packer/importer registration', 500, 2000, 1000, 3000],
            ['bis-crs', 'BIS CRS for one electronic model (incl. testing)', 25000, 150000, 10000, 30000],
            ['pollution', 'Pollution CTE/CTO (Green/Orange, small unit)', 2000, 50000, 5000, 25000],
            ['epf-esi', 'EPF + ESI registration', 0, 0, 1000, 4000],
            ['pt', 'Professional tax enrolment (PTEC, 1 year)', 2500, 2500, 0, 1500],
            ['current', 'Current account (first-year minimum balance range)', 0, 10000, 0, 0],
            ['software', 'Accounting software (year 1)', 0, 12000, 0, 0],
            ['audit', 'Statutory audit + ROC filings (year 1, small company)', 1200, 2400, 25000, 60000],
          ].map(([id, label, gLo, gHi, pLo, pHi]) => `<label class="option"><input type="checkbox" name="item" value="${id}" data-glo="${gLo}" data-ghi="${gHi}" data-plo="${pLo}" data-phi="${pHi}">${label}</label>`).join('')}
        </div>
      </form>
      <div class="result" data-tool-result="costs" aria-live="polite"></div>
    </section>
    <p class="disclaimer" style="margin-top:2rem">Estimators, not quotes. Government fees follow the fee schedules linked in the guides; professional fees vary by city and firm. Confirm on the portal before paying anyone.</p>
  </div></section>`;
  return layout({ title: 'Tools — structure, GST, duty and cost calculators', description: 'Structure chooser, GST applicability checker, import duty estimator and set-up cost estimator for Indian businesses.', path: 'tools/index.html', depth: 1, body, current: 'tools/' });
}

export function updatesPage(meta) {
  const r = rel(1);
  const topics = Object.entries(meta.topicCounts || {}).sort((a, b) => b[1] - a[1]);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Updates' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Updates</p><h1>Regulatory updates for Indian founders</h1></div><p class="lede">Notifications, circulars, rule changes, scheme launches and expert explainers from RBI feeds, the business press and targeted news queries — filtered for relevance, de-duplicated, keyword-tagged and linked to the guide they affect. Last ${meta.retentionDays || 60} days.</p></div>
    <div class="feed-layout">
      <aside class="feed-filters">
        <div><h2>Topic</h2><div class="filter-list" data-filter="topic"><button type="button" data-value="" aria-pressed="true">All topics <span class="count" data-count-all>${meta.itemCount || 0}</span></button>${topics.map(([t, n]) => `<button type="button" data-value="${esc(t)}" aria-pressed="false">${esc(topicLabel(t))} <span class="count">${n}</span></button>`).join('')}</div></div>
        <div><h2>Who it affects</h2><div class="filter-list" data-filter="affects"><button type="button" data-value="" aria-pressed="true">Everyone</button>${Object.entries(AFFECT_LABELS).map(([k, v]) => `<button type="button" data-value="${k}" aria-pressed="false">${v}</button>`).join('')}</div></div>
        <div><h2>Source type</h2><div class="filter-list" data-filter="kind"><button type="button" data-value="" aria-pressed="true">All sources</button><button type="button" data-value="official" aria-pressed="false">Official (RBI)</button><button type="button" data-value="news" aria-pressed="false">Business press</button><button type="button" data-value="gnews" aria-pressed="false">News queries</button></div></div>
        <div><h2>Source health</h2><div class="health" data-health>${(meta.sources || []).map((s) => `<div class="health-row"><span><span class="dot dot-${s.status}" aria-hidden="true"></span>${esc(s.name)}</span><span class="muted">${s.status === 'failed' ? esc((s.error || 'failed').slice(0, 28)) : `${s.kept}`}</span></div>`).join('')}</div><p class="small muted" style="margin-top:.5rem">Numbers are items kept after filtering on the last run (${formatDate(meta.generatedAt, { withTime: true })}). <a href="${r}sources/">Method →</a></p></div>
      </aside>
      <div>
        <div class="feed-toolbar"><input class="input" type="search" placeholder="Search updates…" aria-label="Search updates" data-feed-search><span class="small muted" data-feed-count></span></div>
        <div class="feed-list" data-feed-list><p class="muted">Loading updates…</p></div>
        <div style="margin-top:1.5rem" class="cluster"><button class="btn btn-secondary" type="button" data-action="feed-more" hidden>Show more</button></div>
      </div>
    </div>
  </div></section>`;
  return layout({ title: 'Updates — regulatory changes for Indian businesses', description: 'A filtered feed of GST, income-tax, MCA, DGFT, RBI, labour, e-commerce, data-protection and FSSAI updates for founders in India.', path: 'updates/index.html', depth: 1, body, current: 'updates/' });
}

export function calendarPage(c) {
  const r = rel(1);
  const cal = c.calendar;
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Calendar' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Compliance calendar</p><h1>Your due dates, by month</h1></div><p class="lede">${esc(cal.note)}</p></div>
    <div class="card" style="margin-bottom:1.5rem"><p class="label" style="font-weight:650; margin-bottom:.6rem">Show obligations for</p><div class="chip-row" data-cal-filters>${cal.filters.map((f) => `<button type="button" class="chip" data-value="${f.id}" aria-pressed="false">${esc(f.label)}</button>`).join('')}</div><p class="small muted" style="margin-top:.6rem">Nothing selected shows everything. Choices are saved in this browser.</p></div>
    <div class="month-grid" data-cal-grid></div>
    <template id="calendar-data" data-json>${esc(JSON.stringify({ events: cal.events, portals: Object.fromEntries(c.portals.map((p) => [p.id, { name: p.name, short: p.short || p.name, url: p.url }])) }))}</template>
    <p class="disclaimer" style="margin-top:2rem">Indicative dates compiled on ${formatDate(SITE.reviewed)} from the portals and sources linked in the Run guides. Extensions are announced on the GST, income-tax and MCA portals and appear in the Updates feed.</p>
  </div></section>`;
  return layout({ title: 'Compliance calendar', description: 'Month-by-month GST, TDS, income-tax, ROC, LLP, EPF/ESI and export due dates for Indian businesses, filtered by structure.', path: 'calendar/index.html', depth: 1, body, current: 'calendar/' });
}

export function portalsPage(c) {
  const r = rel(1);
  const cats = [...new Set(c.portals.map((p) => p.category))];
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Portals' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Directory</p><h1>Government portals you will actually use</h1></div><p class="lede">${c.portals.length} official sites, grouped by what you do there. Every registration on this site happens on one of these — never through a third party’s “official-looking” page.</p></div>
    ${cats.map((cat) => `<h2 style="margin:2.5rem 0 1rem">${esc(cat)}</h2><div class="directory">${c.portals.filter((p) => p.category === cat).map((p) => `<div class="card"><h3><a href="${esc(p.url)}" rel="noopener noreferrer" target="_blank">${esc(p.name)}</a></h3><p>${esc(p.what)}</p><span class="small muted">${esc(new URL(p.url).hostname)}</span></div>`).join('')}</div>`).join('')}
  </div></section>`;
  return layout({ title: 'Government portals directory', description: 'MCA, GST, Income Tax, DGFT, ICEGATE, Udyam, Startup India, IP India, FoSCoS, EPFO, ESIC, RBI FIRMS and more — what each portal is for.', path: 'portals/index.html', depth: 1, body, current: '' });
}

export function glossaryPage(c) {
  const r = rel(1);
  const sorted = [...c.glossary].sort((a, b) => a.term.localeCompare(b.term));
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Glossary' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Glossary</p><h1>${sorted.length} terms, decoded</h1></div><p class="lede">The acronyms your CA, the portals and the notifications use — with the number behind each one where there is one.</p></div>
    <div class="article-layout" style="padding-block:0"><div></div><dl class="glossary">${sorted.map((g) => `<dt id="${esc(g.term.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${esc(g.term)}</dt><dd>${esc(g.def)}</dd>`).join('')}</dl><div></div></div>
  </div></section>`;
  return layout({ title: 'Glossary', description: 'Plain-language definitions of GST, company-law, tax, trade, FEMA and labour terms used when starting a business in India.', path: 'glossary/index.html', depth: 1, body, current: '' });
}

export function sourcesPage(c, meta) {
  const r = rel(1);
  const allSources = new Map();
  for (const g of c.guides) for (const s of g.sources) allSources.set(s.url, s.title);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: 'Home' }, { label: 'Sources & method' }])}
    <div class="section-head" style="margin-top:1rem"><div><p class="eyebrow">Sources &amp; method</p><h1>How this site is researched and kept current</h1></div></div>
    <div class="article-layout" style="padding-block:0"><div></div><div class="prose">
      <h2 id="guides">The guides</h2>
      <p>${c.guides.length} guides were written against official portals (MCA, GST, Income Tax, DGFT, ICEGATE, Udyam, Startup India, IP India, FoSCoS, RBI) and reputable professional sources (Big Four alerts, law-firm notes, established tax publishers) and reviewed on ${formatDate(SITE.reviewed)}. Each guide lists its sources at the bottom and links the portal where the current rule can be confirmed. Thresholds and fees are also kept in one place — the “Numbers you will meet” list — with the date and source for each.</p>
      <p>Where a rule had just changed or was still awaiting notification when we wrote (for example GST Rule 14B, the September 2026 export-realisation amendment, or the Budget 2026 return-filing window), the text says so and asks you to verify. The guides are plain-language explanations, not legal advice.</p>
      <h2 id="feed">The Updates feed</h2>
      <p>A scheduled job fetches ${meta.sources ? meta.sources.length : 0} sources: RBI’s press-release and notification RSS feeds; business-press RSS feeds (Economic Times, Business Standard, Mint, BusinessLine, Inc42, YourStory, TaxGuru); and Google News RSS queries built for the portals that publish no machine-readable feed (GST portal and CBIC, MCA, DGFT, Startup India/DPIIT, MSME ministry, EPFO/ESIC, FSSAI, MeitY, Consumer Affairs). Items go through relevance rules — a topic keyword must match, obvious market/personal-finance/case-law/foreign stories are dropped — then near-duplicates from several publishers are merged into one item listing who else reported it. Topics and “who it affects” tags are keyword rules, labelled as such; no text on the feed is generated by a model.</p>
      <p>The feed keeps ${meta.retentionDays || 60} days of items and archives older months. The job runs on a schedule through GitHub Actions, which may delay or skip scheduled runs; the real “updated” time is shown on the Updates page. Google News links open through news.google.com and land on the publisher.</p>
      <h2 id="health">Source health (last run ${formatDate(meta.generatedAt, { withTime: true })})</h2>
      <div class="table-wrap"><table><thead><tr><th>Source</th><th>Type</th><th>Status</th><th>Fetched</th><th>Kept</th><th>Note</th></tr></thead><tbody>${(meta.sources || []).map((s) => `<tr><td><a href="${esc(s.homepage || '#')}" rel="noopener noreferrer" target="_blank">${esc(s.name)}</a></td><td>${esc(s.kind)}</td><td><span class="dot dot-${s.status}" aria-hidden="true"></span>${esc(s.status)}</td><td>${s.fetched}</td><td>${s.kept}</td><td class="small muted">${esc(s.error || s.note || '')}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted">“empty” means the source answered but nothing passed the relevance rules in the window; only “failed” means the fetch itself broke.</p>
      <h2 id="limits">Known limits</h2>
      <ul>
        <li>State-level rules (Shops &amp; Establishment, professional tax, trade licences, state startup policies) vary; the guides describe the pattern and point to the state portal.</li>
        <li>Fees quoted as ranges are market observations for small businesses in 2026, not official tariffs.</li>
        <li>Keyword tagging misses and over-includes some items; the search box and topic filters help.</li>
        <li>Nothing here replaces a Chartered Accountant or Company Secretary for your specific facts.</li>
      </ul>
      <h2 id="bibliography">Bibliography (${allSources.size} sources cited across guides)</h2>
      <ol class="sources-list">${[...allSources.entries()].map(([url, title]) => `<li><a href="${esc(url)}" rel="noopener noreferrer" target="_blank">${esc(title)}</a></li>`).join('')}</ol>
      <h2 id="contribute">Corrections</h2>
      <p>Found an error or a changed rule? Open an issue or pull request on <a href="${SITE.repo}" rel="noopener noreferrer" target="_blank">GitHub</a>. Text is CC BY 4.0; code is MIT.</p>
    </div><div></div></div>
  </div></section>`;
  return layout({ title: 'Sources & method', description: 'How Vyapaar Shuru is researched, how the updates feed works, source health and the full bibliography.', path: 'sources/index.html', depth: 1, body, current: '' });
}

export function notFoundPage() {
  const r = rel(0);
  const body = `<section class="section"><div class="container" style="text-align:center; padding-block:4rem"><p class="eyebrow">404</p><h1>That page is not here</h1><p class="lede" style="margin:1rem auto">The address may have changed. Try the guides index or search.</p><div class="cluster" style="justify-content:center; margin-top:1.5rem"><a class="btn btn-primary" href="${r}">Home</a><a class="btn btn-secondary" href="${r}guides/">Guides</a></div></div></section>`;
  return layout({ title: 'Page not found', description: 'The page you asked for is not on Vyapaar Shuru. Use the guides index or search to find it.', path: '404.html', depth: 0, body, current: '' });
}
