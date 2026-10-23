/* Vyapaar Shuru client: theme, menu, search, step checklists, feed rendering, plan builder, tools, calendar. No frameworks. */
(() => {
  'use strict';
  const root = document.body.dataset.root || './';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const store = {
    get(k, d) { try { const v = localStorage.getItem('vyapaarshuru:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('vyapaarshuru:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  const TOPIC_LABELS = { gst: 'GST', 'income-tax': 'Income tax', companies: 'Companies & LLP', 'startup-india': 'Startup India', msme: 'MSME', trade: 'Import & export', 'rbi-fema': 'RBI & FEMA', labour: 'Labour & payroll', 'consumer-ecommerce': 'E-commerce & consumer', 'data-digital': 'Data & digital', 'food-fssai': 'Food & FSSAI', ip: 'IP & trademarks', 'budget-policy': 'Budget & policy', state: 'States' };
  const AFFECT_LABELS = { ecommerce: 'Online sellers', exporter: 'Exporters', importer: 'Importers', saas: 'SaaS & digital', freelancer: 'Freelancers & consultants', food: 'Food businesses', manufacturer: 'Manufacturers', employer: 'Employers', company: 'Companies & LLPs', retailer: 'Local shops & services' };
  const TOPIC_GUIDE = { gst: 'gst-compliance', 'income-tax': 'income-tax-for-businesses', companies: 'audits-and-annual-filings', 'startup-india': 'startup-india-dpiit', msme: 'udyam-msme-registration', trade: 'export-from-india', 'rbi-fema': 'going-international', labour: 'hiring-and-payroll', 'consumer-ecommerce': 'ecommerce-rules', 'data-digital': 'data-protection-dpdp', 'food-fssai': 'licences-directory', ip: 'trademark-and-ip', 'budget-policy': 'income-tax-for-businesses', state: 'licences-directory' };
  const fmtDate = (iso, withTime) => {
    if (!iso) return '';
    const o = { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' };
    if (withTime) Object.assign(o, { year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return new Intl.DateTimeFormat('en-IN', o).format(new Date(iso)) + (withTime ? ' IST' : '');
  };
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  /* ---------- Theme ---------- */
  const themeBtn = $('[data-action="theme"]');
  function applyTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    if (themeBtn) {
      const dark = t === 'dark';
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      const label = $('.theme-label', themeBtn); if (label) label.textContent = dark ? 'Dark' : 'Light';
      const icon = $('.theme-icon', themeBtn);
      if (icon) icon.innerHTML = dark ? '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>' : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/>';
    }
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = t === 'dark' ? '#141311' : '#f8f6f1';
  }
  applyTheme(store.get('theme', 'light'));
  themeBtn?.addEventListener('click', () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; store.set('theme', next); applyTheme(next); });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-action="menu"]'); const mobileNav = $('#mobile-nav');
  menuBtn?.addEventListener('click', () => { const open = mobileNav.dataset.open !== 'true'; mobileNav.dataset.open = String(open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2600); }

  /* ---------- Search ---------- */
  const dialog = $('#search-dialog'); const searchInput = $('#search-input'); const results = $('#search-results');
  let index = null;
  async function loadIndex() { if (index) return index; const res = await fetch(root + 'data/search.json'); index = await res.json(); return index; }
  function score(doc, q) {
    const t = doc.title.toLowerCase(); const words = q.split(/\s+/).filter(Boolean);
    let s = 0;
    for (const w of words) {
      if (t.startsWith(w)) s += 8; else if (t.includes(w)) s += 5;
      if ((doc.text || '').toLowerCase().includes(w)) s += 2;
      if ((doc.keywords || '').toLowerCase().includes(w)) s += 2;
    }
    if (words.length > 1 && t.includes(q)) s += 6;
    if (s && (doc.kind === 'Guide' || doc.kind === 'Path')) s += 4;
    return s;
  }
  function renderResults(q) {
    const query = q.trim().toLowerCase();
    if (!query) { results.innerHTML = '<li class="muted small" style="padding:.75rem 1rem">Type to search guides, steps, numbers, portals and glossary. Use ↑ ↓ and Enter.</li>'; return; }
    const hits = index.map((d) => ({ d, s: score(d, query) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 12);
    results.innerHTML = hits.length ? hits.map(({ d }) => `<li><a href="${d.external ? esc(d.url) : root + esc(d.url)}"${d.external ? ' rel="noopener noreferrer" target="_blank"' : ''}><span class="kind">${esc(d.kind)}</span><b>${esc(d.title)}</b>${d.text ? `<span>${esc(d.text)}</span>` : ''}</a></li>`).join('') : '<li class="muted small" style="padding:.75rem 1rem">No matches. Try a different word (e.g. “LUT”, “Udyam”, “tax audit”).</li>';
  }
  async function openSearch() { if (!dialog) return; await loadIndex(); renderResults(searchInput.value); dialog.showModal(); searchInput.focus(); searchInput.select(); }
  $$('[data-action="search"]').forEach((b) => b.addEventListener('click', openSearch));
  searchInput?.addEventListener('input', () => renderResults(searchInput.value));
  dialog?.addEventListener('keydown', (e) => {
    const links = $$('a', results); const i = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (links[i + 1] || links[0])?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) searchInput.focus(); else links[i - 1].focus(); }
    if (e.key === 'Enter' && document.activeElement === searchInput && links[0]) { e.preventDefault(); links[0].click(); }
  });
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) { e.preventDefault(); openSearch(); }
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') && !dialog?.open) themeBtn?.click();
  });

  /* ---------- Step checklists (shared store) ---------- */
  const doneSteps = store.get('steps', {});
  function syncStep(box) {
    const id = box.dataset.stepCheck; box.checked = !!doneSteps[id];
    box.closest('.step')?.classList.toggle('is-done', box.checked);
  }
  function updateProgress(scope = document) {
    $$('[data-stage]', scope).forEach((stage) => {
      const boxes = $$('[data-step-check]', stage); const done = boxes.filter((b) => b.checked).length;
      const p = $('[data-stage-progress]', stage); if (!p) return;
      $('[data-done]', p).textContent = done; $('[data-total]', p).textContent = boxes.length; $('.bar i', p).style.width = boxes.length ? (done / boxes.length) * 100 + '%' : '0%';
    });
    const all = $$('[data-step-check]', scope); const done = all.filter((b) => b.checked).length;
    $$('[data-path-progress]', scope).forEach((p) => { $('[data-done]', p).textContent = done; $('[data-total]', p).textContent = all.length; $('.bar i', p).style.width = all.length ? (done / all.length) * 100 + '%' : '0%'; });
  }
  function bindSteps(scope = document) {
    $$('[data-step-check]', scope).forEach((box) => { syncStep(box); box.addEventListener('change', () => { doneSteps[box.dataset.stepCheck] = box.checked; if (!box.checked) delete doneSteps[box.dataset.stepCheck]; store.set('steps', doneSteps); $$(`[data-step-check="${box.dataset.stepCheck}"]`).forEach(syncStep); updateProgress(); }); });
    updateProgress(scope);
  }
  bindSteps();

  /* ---------- Copy as Markdown / print ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="copy-md"]'); if (!btn) return;
    const lines = [`# ${btn.dataset.title || document.title}`, '', `Checklist from ${location.href}`, ''];
    $$('[data-stage]').forEach((stage) => { lines.push(`## ${$('h2', stage)?.textContent.trim()}`, ''); $$('.step', stage).forEach((s) => { const box = $('[data-step-check]', s); lines.push(`- [${box?.checked ? 'x' : ' '}] ${$('.step-title', s)?.textContent.trim()}`); }); lines.push(''); });
    navigator.clipboard?.writeText(lines.join('\n')).then(() => toast('Checklist copied as Markdown'), () => toast('Copy failed — select and copy manually'));
  });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-action="print"]')) window.print(); });

  /* ---------- TOC scrollspy (re-run after dynamic TOCs are built) ---------- */
  let tocUpdate = null;
  function initToc() {
    const tocLinks = $$('.toc a[href^="#"]');
    if (!tocLinks.length) { tocUpdate = null; return; }
    const targets = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
    tocUpdate = () => { const line = window.innerHeight * 0.3; let best = targets[0]; for (const t of targets) { if (t.getBoundingClientRect().top <= line) best = t; } tocLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + best?.id)); };
    tocUpdate();
  }
  let tocRaf = 0;
  window.addEventListener('scroll', () => { if (tocUpdate && !tocRaf) tocRaf = requestAnimationFrame(() => { tocRaf = 0; tocUpdate(); }); }, { passive: true });
  initToc();

  /* ---------- Feed ---------- */
  let feedPromise = null;
  function loadFeed() { if (!feedPromise) feedPromise = fetch(root + 'data/updates.json').then((r) => r.json()).catch(() => ({ items: [] })); return feedPromise; }
  function relatedGuide(item) { const t = item.topics[0]; return t && TOPIC_GUIDE[t] ? `<a href="${root}guides/${TOPIC_GUIDE[t]}/">${esc(TOPIC_LABELS[t] || t)} guide</a>` : ''; }
  function itemHtml(it) {
    const also = it.alsoReportedBy?.length ? `<span class="small muted">also: ${it.alsoReportedBy.slice(0, 3).map((a) => `<a href="${esc(a.url)}" rel="noopener noreferrer" target="_blank">${esc(a.name)}</a>`).join(', ')}${it.alsoReportedBy.length > 3 ? ` +${it.alsoReportedBy.length - 3}` : ''}</span>` : '';
    return `<article class="feed-item"><h3><a href="${esc(it.url)}" rel="noopener noreferrer" target="_blank">${esc(it.title)}</a></h3>${it.summary ? `<p class="summary">${esc(it.summary)}</p>` : ''}<div class="meta"><span><b>${esc(it.publisher)}</b></span><time datetime="${esc(it.publishedAt)}">${fmtDate(it.publishedAt)}</time>${also}</div><div class="meta"><span class="tags">${it.topics.map((t) => `<span class="tag">${esc(TOPIC_LABELS[t] || t)}</span>`).join('')}${it.affects.slice(0, 3).map((a) => `<span class="tag tag-accent">${esc(AFFECT_LABELS[a] || a)}</span>`).join('')}</span></div>${relatedGuide(it) ? `<p class="related">Keyword-tagged · related: ${relatedGuide(it)}</p>` : ''}</article>`;
  }
  const rowHtml = (it) => `<div class="update-row"><time datetime="${esc(it.publishedAt)}">${fmtDate(it.publishedAt)}</time><a href="${esc(it.url)}" rel="noopener noreferrer" target="_blank">${esc(it.title)}</a><div class="meta"><span>${esc(it.publisher)}</span>${it.topics.slice(0, 2).map((t) => `<span class="tag">${esc(TOPIC_LABELS[t] || t)}</span>`).join('')}</div></div>`;
  const liHtml = (it) => `<li><a href="${esc(it.url)}" rel="noopener noreferrer" target="_blank">${esc(it.title)}</a><small>${esc(it.publisher)} · ${fmtDate(it.publishedAt)}</small></li>`;

  const latestEl = $('[data-feed-latest]');
  if (latestEl) loadFeed().then((d) => { const items = (d.items || []).slice(0, Number(latestEl.dataset.limit || 7)); if (items.length) latestEl.innerHTML = items.map(rowHtml).join(''); const u = $('[data-feed-updated]'); if (u && d.generatedAt) { u.textContent = fmtDate(d.generatedAt, true); u.dateTime = d.generatedAt; } });
  $$('[data-feed-topics]').forEach((el) => loadFeed().then((d) => { const want = el.dataset.feedTopics.split(','); const items = (d.items || []).filter((i) => i.topics.some((t) => want.includes(t))).slice(0, Number(el.dataset.limit || 6)); el.innerHTML = items.length ? items.map(liHtml).join('') : '<li class="muted small">No updates on this topic in the window.</li>'; }));
  $$('[data-feed-affects]').forEach((el) => loadFeed().then((d) => { const want = el.dataset.feedAffects.split(','); const items = (d.items || []).filter((i) => i.affects.some((t) => want.includes(t))).slice(0, Number(el.dataset.limit || 6)); el.innerHTML = items.length ? items.map(liHtml).join('') : '<li class="muted small">No updates for this path in the window.</li>'; }));

  const feedList = $('[data-feed-list]');
  if (feedList) {
    const params = new URLSearchParams(location.search);
    const state = { topic: params.get('topic') || '', affects: params.get('affects') || '', kind: params.get('kind') || '', q: params.get('q') || '', shown: 40 };
    const searchBox = $('[data-feed-search]'); if (searchBox) searchBox.value = state.q;
    const moreBtn = $('[data-action="feed-more"]'); const countEl = $('[data-feed-count]');
    let all = [];
    function filtered() { const q = state.q.trim().toLowerCase(); return all.filter((i) => (!state.topic || i.topics.includes(state.topic)) && (!state.affects || i.affects.includes(state.affects)) && (!state.kind || i.sourceKind === state.kind) && (!q || (i.title + ' ' + i.summary + ' ' + i.publisher).toLowerCase().includes(q))); }
    function render() {
      const list = filtered(); const show = list.slice(0, state.shown);
      countEl.textContent = `${list.length} of ${all.length} updates`;
      if (!show.length) { feedList.innerHTML = '<div class="empty">Nothing matches these filters in the last 60 days. Try “All topics” or clear the search.</div>'; moreBtn.hidden = true; return; }
      let html = ''; let day = '';
      for (const it of show) { const d = fmtDate(it.publishedAt); if (d !== day) { day = d; html += `<h2 class="feed-day">${esc(d)}</h2>`; } html += itemHtml(it); }
      feedList.innerHTML = html; moreBtn.hidden = list.length <= state.shown;
      const url = new URL(location.href); ['topic', 'affects', 'kind', 'q'].forEach((k) => state[k] ? url.searchParams.set(k, state[k]) : url.searchParams.delete(k)); history.replaceState(null, '', url);
      $$('[data-filter]').forEach((g) => { const key = g.dataset.filter; $$('button', g).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === state[key]))); });
    }
    $$('[data-filter] button').forEach((b) => b.addEventListener('click', () => { const key = b.closest('[data-filter]').dataset.filter; state[key] = b.dataset.value; state.shown = 40; render(); }));
    searchBox?.addEventListener('input', () => { state.q = searchBox.value; state.shown = 40; render(); });
    moreBtn?.addEventListener('click', () => { state.shown += 40; render(); });
    loadFeed().then((d) => { all = d.items || []; render(); });
  }

  /* ---------- Plan builder ---------- */
  const planForm = $('[data-plan-form]');
  if (planForm) {
    const data = JSON.parse($('#steps-data').content.textContent);
    const out = $('#plan-output'); const stepsEl = $('[data-plan-steps]'); const tocEl = $('[data-plan-toc]'); const guidesEl = $('[data-plan-guides]'); const summaryEl = $('[data-plan-summary]'); const stateNote = $('[data-state-note]');
    const PT_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'West Bengal'];
    const SPECIAL = ['Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Uttarakhand', 'Puducherry', 'Telangana'];
    const EMP_MIN = { none: 0, '1-9': 1, '10-19': 10, '20+': 20 };
    function readForm() {
      const fd = new FormData(planForm);
      return { structure: fd.get('structure') || '', selling: fd.getAll('selling'), channels: fd.getAll('channels'), employees: fd.get('employees') || '', flags: fd.getAll('flags'), state: fd.get('state') || '' };
    }
    function writeForm(sel) {
      $$('input', planForm).forEach((i) => { if (i.type === 'radio') i.checked = sel[i.name] === i.value; if (i.type === 'checkbox') i.checked = (sel[i.name] || []).includes(i.value); });
      const st = $('#plan-state'); if (st) st.value = sel.state || '';
      noteState(sel.state);
    }
    function noteState(state) {
      if (!stateNote) return;
      if (!state) { stateNote.textContent = ''; return; }
      const notes = [];
      notes.push(PT_STATES.includes(state) ? `${state} levies professional tax — enrol the entity and deduct from salaries.` : `${state} does not levy professional tax.`);
      if (SPECIAL.includes(state)) notes.push('Special-category state for GST: lower registration thresholds (₹20 lakh goods / ₹10 lakh services) may apply — check the state notification.');
      stateNote.textContent = notes.join(' ');
    }
    function applies(step, sel) {
      const a = step.applies || {};
      if (a.always) return true;
      const structures = sel.structure === 'undecided' || !sel.structure ? ['proprietor', 'partnership', 'llp', 'opc', 'pvt'] : [sel.structure];
      if (a.structures && !a.structures.some((s) => structures.includes(s))) return false;
      if (a.selling && !a.selling.some((s) => sel.selling.includes(s))) return false;
      if (a.channels && !a.channels.some((s) => sel.channels.includes(s))) return false;
      if (a.flags && !a.flags.some((f) => sel.flags.includes(f))) {
        // flags are OR-ed with channels when both are present (e.g. BIS: electronics flag OR import channel)
        if (!(a.channels && a.channels.some((s) => sel.channels.includes(s)))) return false;
      }
      if (a.employeesMin != null && (EMP_MIN[sel.employees] ?? 0) < a.employeesMin) return false;
      return true;
    }
    function stepHtml(s, i) {
      const portal = s.portal && data.portals[s.portal];
      const dl = [portal ? ['Where', `<a href="${esc(portal.url)}" rel="noopener noreferrer" target="_blank">${esc(portal.name)}</a>`] : null, s.cost ? ['Cost', esc(s.cost)] : null, s.time ? ['Time', esc(s.time)] : null, s.when ? ['When', esc(s.when)] : null].filter(Boolean);
      return `<li class="step" data-step="${esc(s.id)}"><input type="checkbox" id="plan-${esc(s.id)}-${i}" data-step-check="${esc(s.id)}" aria-label="Mark “${esc(s.title)}” done"><label class="step-title" for="plan-${esc(s.id)}-${i}">${esc(s.title)}</label><div class="step-body"><p>${esc(s.why)}</p><details><summary>How to do it</summary><div class="more"><p>${esc(s.how)}</p>${dl.length ? `<dl>${dl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}${s.docs?.length ? `<div><b class="small">Documents</b><ul class="docs">${s.docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>` : ''}${s.guide ? `<p class="small"><a href="${root}guides/${esc(s.guide)}/">Read the guide →</a></p>` : ''}</div></details></div></li>`;
    }
    function build(sel) {
      const chosen = data.steps.filter((s) => applies(s, sel));
      let i = 0; const guides = new Set();
      stepsEl.innerHTML = data.stages.map((st) => { const list = chosen.filter((s) => s.stage === st.id); if (!list.length) return ''; list.forEach((s) => s.guide && guides.add(s.guide)); return `<section class="stage" id="${st.id}" data-stage><div class="stage-head"><h2>${esc(st.title)}</h2><div class="progress" data-stage-progress><span class="bar"><i></i></span><span><span data-done>0</span>/<span data-total>${list.length}</span> done</span></div></div><p class="muted small" style="margin-bottom:.75rem">${esc(st.blurb)}</p><ol class="steps list-reset">${list.map((s) => stepHtml(s, i++)).join('')}</ol></section>`; }).join('');
      tocEl.innerHTML = data.stages.filter((st) => chosen.some((s) => s.stage === st.id)).map((st) => `<li><a href="#${st.id}">${esc(st.title)}</a></li>`).join('');
      guidesEl.innerHTML = [...guides].slice(0, 10).map((g) => `<li><a href="${root}guides/${g}/">${esc(data.guides[g]?.title || g)}</a><small>${esc(data.guides[g]?.section || '')}</small></li>`).join('');
      summaryEl.textContent = `${chosen.length} steps across ${new Set(chosen.map((s) => s.stage)).size} stages`;
      out.hidden = false; bindSteps(out); initToc();
    }
    const params = new URLSearchParams(location.search);
    let sel = store.get('plan', null);
    if (params.get('path') && data.paths[params.get('path')]) {
      sel = { ...data.paths[params.get('path')], state: sel?.state || '' }; store.set('plan', sel);
      // Drop the parameter so a reload keeps the user's later edits instead of re-applying the path preset.
      const clean = new URL(location.href); clean.searchParams.delete('path'); history.replaceState(null, '', clean);
    }
    if (sel) { writeForm(sel); build(sel); }
    planForm.addEventListener('submit', (e) => { e.preventDefault(); sel = readForm(); if (!sel.structure) sel.structure = 'undecided'; store.set('plan', sel); build(sel); out.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    planForm.addEventListener('change', (e) => { if (e.target.name === 'state') noteState(e.target.value); });
    $('[data-action="plan-reset"]')?.addEventListener('click', () => { planForm.reset(); store.set('plan', null); out.hidden = true; summaryEl.textContent = ''; noteState(''); });
  }

  /* ---------- Tools ---------- */
  const toolPanels = $$('[data-tool-panel]');
  if (toolPanels.length) {
    function showTab() { const id = (location.hash || '#structure').slice(1); toolPanels.forEach((p) => { p.hidden = p.id !== id; }); $$('[data-tab]').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === id)); }
    window.addEventListener('hashchange', showTab); showTab();
    const val = (form, name) => new FormData(form).get(name);
    const has = (form, name) => new FormData(form).has(name);
    const calc = {
      structure(form) {
        const founders = val(form, 'founders'), equity = val(form, 'equity'), liability = val(form, 'liability'), profit = val(form, 'profit'), takehome = val(form, 'takehome'), profession = val(form, 'profession');
        const s = { proprietor: 0, partnership: 0, llp: 0, opc: 0, pvt: 0 }; const why = [];
        if (founders === '1') { s.proprietor += 3; s.opc += 2; s.partnership -= 9; s.llp -= 9; why.push('One founder rules out partnerships and LLPs (two partners needed).'); } else { s.llp += 3; s.pvt += 2; s.partnership += 1; s.proprietor -= 9; s.opc -= 9; why.push('Two or more founders need a partnership, LLP or company.'); }
        if (equity === 'yes') { s.pvt += 6; s.llp -= 3; s.proprietor -= 3; s.opc -= 2; why.push('Raising equity needs a private limited company — investors buy shares.'); } else { s.llp += 1; s.proprietor += 1; }
        if (liability === 'high') { s.llp += 2; s.pvt += 2; s.opc += 2; s.proprietor -= 4; s.partnership -= 4; why.push('High liability favours limited-liability structures.'); } else { s.proprietor += 1; }
        if (profit === 'gt50') { s.pvt += 2; s.proprietor -= 1; why.push('Above ₹50 lakh profit the 25.17% company rate beats 30%+ slab rates if profits are reinvested.'); }
        if (profit === 'lt12') { s.proprietor += 3; s.opc -= 1; s.pvt -= 1; why.push('Under ₹12 lakh a proprietor pays little or no income tax; a company would pay 25.17%.'); }
        if (takehome === 'yes') { s.proprietor += 2; s.llp += 2; s.pvt -= 2; s.opc -= 2; why.push('Taking profit home each year is cheapest as a proprietor/partner (no dividend tax).'); } else { s.pvt += 2; s.opc += 1; }
        if (profession === 'yes' && founders === '1') { s.proprietor += 3; why.push('Specified professionals can declare 50% of receipts as income under presumptive taxation — only as proprietors/firms.'); }
        if (profession === 'yes' && founders === '2') { s.partnership += 1; }
        const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
        const names = { proprietor: 'Sole proprietorship', partnership: 'Partnership firm', llp: 'Limited Liability Partnership', opc: 'One Person Company', pvt: 'Private limited company' };
        const cost = { proprietor: '₹5,000–30,000 a year', partnership: '₹10,000–30,000 a year', llp: '₹12,000–35,000 a year', opc: '₹35,000–80,000 a year', pvt: '₹40,000–1 lakh a year' };
        return `<h3>Suggested structure</h3><p class="result-big">${names[ranked[0][0]]}</p><p class="small muted">Runner-up: ${names[ranked[1][0]]}. Typical running compliance cost of the suggestion: <b>${cost[ranked[0][0]]}</b>.</p><ul class="small" style="margin-top:.75rem; padding-left:1.2em">${why.map((w) => `<li>${w}</li>`).join('')}</ul><p class="small" style="margin-top:.75rem">Basis: a points model over liability, tax regime, fundraising and presumptive-tax eligibility as described in the <a href="${root}guides/choose-a-structure/">structure guide</a>. Not advice.</p>`;
      },
      gst(form) {
        const supply = val(form, 'supply'), turnover = Number(val(form, 'turnover') || 0), special = val(form, 'state') === 'special', out = Number(val(form, 'outputtax') || 0);
        const threshold = supply === 'goods' ? (special ? 20 : 40) : (special ? 10 : 20);
        const reasons = []; let mandatory = false;
        if (turnover > threshold) { mandatory = true; reasons.push(`Turnover above the ₹${threshold} lakh threshold for ${supply === 'goods' ? 'goods' : 'services/mixed'} in your state.`); }
        if (has(form, 'interstate')) { mandatory = true; reasons.push('Inter-state supply of goods requires registration from the first sale (services may cross states up to the threshold).'); }
        if (has(form, 'marketplace')) { mandatory = true; reasons.push('Selling through an e-commerce operator that collects TCS requires registration regardless of turnover (limited intra-state relaxations exist).'); }
        if (has(form, 'foreignsaas')) { mandatory = true; reasons.push('Paying for imported services makes you liable under reverse charge, which requires registration.'); }
        const helpful = [];
        if (has(form, 'export')) helpful.push('Exports are zero-rated only with a GSTIN and a LUT; without registration you cannot claim input-credit refunds.');
        if (has(form, 'import')) helpful.push('IGST paid at customs is creditable only with a GSTIN.');
        if (has(form, 'b2b')) helpful.push('Business customers will want a tax invoice to claim credit.');
        let scheme = '';
        if (mandatory || helpful.length) {
          if (out <= 2.5) scheme += `<li><b>Rule 14A simplified registration</b> — output tax on B2B supplies within ₹2.5 lakh/month qualifies for approval in 3 working days.</li>`;
          if (turnover <= 500) scheme += `<li><b>QRMP</b> — quarterly returns with monthly payment are available up to ₹5 crore turnover.</li>`;
          if (turnover <= 150 && !has(form, 'interstate') && !has(form, 'marketplace') && !has(form, 'export') && !has(form, 'b2b') && !has(form, 'import')) scheme += `<li><b>Composition</b> possible (${has(form, 'restaurant') ? '5% for restaurants' : supply === 'goods' ? '1% of turnover' : '6% of turnover up to ₹50 lakh'}) — no input credit, no inter-state or marketplace sales.</li>`;
          if (has(form, 'marketplace') && supply === 'goods' && out <= 2.5) scheme += `<li><b>Rule 14B</b> (from Nov 2026, once notified) — register in other states using the marketplace warehouse as your place of business.</li>`;
        }
        const head = mandatory ? 'Registration is mandatory' : helpful.length ? 'Not mandatory yet — but useful' : 'Not required right now';
        return `<h3>Result</h3><p class="result-big">${head}</p>${reasons.length ? `<ul class="small" style="margin-top:.75rem; padding-left:1.2em">${reasons.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}${helpful.length ? `<p class="small" style="margin-top:.75rem"><b>Why you may still want it:</b></p><ul class="small" style="padding-left:1.2em">${helpful.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}${!mandatory && !helpful.length ? `<p class="small muted" style="margin-top:.75rem">Register when turnover approaches ₹${threshold} lakh, or earlier if any of the mandatory cases arise. Remember the threshold counts all supplies under your PAN across India.</p>` : ''}${scheme ? `<p class="small" style="margin-top:.75rem"><b>Routes and schemes to consider:</b></p><ul class="small" style="padding-left:1.2em">${scheme}</ul>` : ''}<p class="small" style="margin-top:.75rem">Basis: CGST Act sections 22 and 24 and the thresholds in the <a href="${root}guides/gst-registration/">GST registration guide</a>.</p>`;
      },
      duty(form) {
        const cif = Number(val(form, 'cif') || 0), bcdRate = Number(val(form, 'bcd') || 0), swsRate = Number(val(form, 'sws') || 0), cessRate = Number(val(form, 'cess') || 0), igstRate = Number(val(form, 'igst') || 0), add = Number(val(form, 'add') || 0), cha = Number(val(form, 'cha') || 0);
        const bcd = cif * bcdRate / 100; const sws = bcd * swsRate / 100; const cess = cif * cessRate / 100; const base = cif + bcd + sws + cess + add; const igst = base * igstRate / 100;
        const sunk = bcd + sws + cess + add; const landed = cif + sunk + igst + cha; const landedExIgst = cif + sunk + cha;
        return `<h3>Estimated landed cost</h3><p class="result-big">${inr(landed)}</p><p class="small muted">${inr(landedExIgst)} after taking the IGST credit (if GST-registered).</p><dl class="dl-grid small" style="margin-top:.9rem"><dt>CIF value</dt><dd>${inr(cif)}</dd><dt>BCD ${bcdRate}%</dt><dd>${inr(bcd)}</dd><dt>SWS ${swsRate}% of BCD</dt><dd>${inr(sws)}</dd>${cess ? `<dt>Cess ${cessRate}%</dt><dd>${inr(cess)}</dd>` : ''}${add ? `<dt>Anti-dumping/safeguard</dt><dd>${inr(add)}</dd>` : ''}<dt>IGST ${igstRate}% on ${inr(base)}</dt><dd>${inr(igst)} <span class="muted">(creditable)</span></dd><dt>Clearing &amp; local</dt><dd>${inr(cha)}</dd><dt>Effective non-creditable duty</dt><dd>${cif ? (sunk / cif * 100).toFixed(1) : 0}% of CIF</dd></dl><p class="small" style="margin-top:.75rem">Basis: Customs Tariff Act — BCD on assessable value, SWS on BCD, IGST on the sum (<a href="${root}guides/import-into-india/">import guide</a>). Check the ICEGATE calculator for the authoritative figure and FTA rates.</p>`;
      },
      costs(form) {
        const items = $$('input[name="item"]:checked', form); let gLo = 0, gHi = 0, pLo = 0, pHi = 0;
        items.forEach((i) => { gLo += +i.dataset.glo; gHi += +i.dataset.ghi; pLo += +i.dataset.plo; pHi += +i.dataset.phi; });
        if (!items.length) return `<h3>Estimated set-up cost</h3><p class="muted">Tick the registrations you need to see government and professional fee ranges.</p>`;
        return `<h3>Estimated set-up cost</h3><p class="result-big">${inr(gLo + pLo)} – ${inr(gHi + pHi)}</p><dl class="dl-grid small" style="margin-top:.9rem"><dt>Government fees</dt><dd>${inr(gLo)} – ${inr(gHi)}</dd><dt>Professional fees (typical)</dt><dd>${inr(pLo)} – ${inr(pHi)}</dd><dt>Items</dt><dd>${items.length}</dd></dl><p class="small" style="margin-top:.75rem">Government figures follow the fee schedules cited in the guides (state stamp duty ranges widely); professional fees are 2026 market ranges for small businesses. Excludes deposits, stock and working capital.</p>`;
      },
    };
    $$('[data-tool]').forEach((form) => { const run = () => { const out = $(`[data-tool-result="${form.dataset.tool}"]`); if (out) out.innerHTML = calc[form.dataset.tool](form); }; form.addEventListener('input', run); form.addEventListener('change', run); form.addEventListener('submit', (e) => { e.preventDefault(); run(); }); run(); });
  }

  /* ---------- Calendar ---------- */
  const calGrid = $('[data-cal-grid]');
  if (calGrid) {
    const data = JSON.parse($('#calendar-data').content.textContent);
    const filters = $('[data-cal-filters]'); let active = new Set(store.get('calendar', []));
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    function render() {
      $$('button', filters).forEach((b) => b.setAttribute('aria-pressed', String(active.has(b.dataset.value))));
      const show = (ev) => !active.size || ev.who.some((w) => active.has(w));
      let html = '';
      for (let k = 0; k < 12; k++) {
        const m = (now.getMonth() + k) % 12; const year = now.getFullYear() + Math.floor((now.getMonth() + k) / 12);
        const evs = data.events.filter((e) => show(e) && (e.every === 'month' || e.month === m + 1)).sort((a, b) => a.day - b.day);
        html += `<div class="month${k === 0 ? ' is-current' : ''}"><h3>${MONTHS[m]} ${year}${k === 0 ? ' <span class="tag tag-accent">this month</span>' : ''}</h3>${evs.length ? `<ul>${evs.map((e) => `<li><b>${e.day}</b>${esc(e.what)}${e.portal && data.portals[e.portal] ? ` <a class="small" href="${esc(data.portals[e.portal].url)}" rel="noopener noreferrer" target="_blank">${esc(data.portals[e.portal].short || data.portals[e.portal].name)}</a>` : ''}</li>`).join('')}</ul>` : '<p class="small muted">Nothing for the selected filters.</p>'}</div>`;
      }
      calGrid.innerHTML = html;
    }
    filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; active.has(b.dataset.value) ? active.delete(b.dataset.value) : active.add(b.dataset.value); store.set('calendar', [...active]); render(); });
    render();
  }

  /* ---------- Mark current nav ---------- */
  (function markNav() { const here = location.pathname; $$('.site-nav a, .mobile-nav a').forEach((a) => { const href = a.getAttribute('href').replace(/^(\.\.\/)+|^\.\//, ''); if (href && here.includes('/' + href)) a.setAttribute('aria-current', 'page'); }); })();
})();
