"""Viewport screenshots + numeric UI audits for Vyapaar Shuru (run with the workspace .venv Playwright).
Usage: python scripts/shots.py [base_url]   (default http://127.0.0.1:8790/vyapaar-shuru/)
Writes docs/screenshots/<page>-<width>-<theme>.png (never taller than 1080 px; 2560 shot at DSF 0.75)."""
import sys, json, os, time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8790/vyapaar-shuru/"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "screenshots")
os.makedirs(OUT, exist_ok=True)
PAGES = {
    "home": "",
    "guide-gst": "guides/gst-registration/",
    "path-d2c": "paths/d2c-brand/",
    "plan": "plan/?path=d2c-brand",
    "tools": "tools/#gst",
    "updates": "updates/",
    "calendar": "calendar/",
    "guides-index": "guides/",
}
WIDTHS = [(390, 844, 1), (820, 1180, 1), (1440, 900, 1), (1920, 1080, 1), (2560, 1440, 0.75)]

AUDIT_JS = """
() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const skip = (el) => { for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.position === 'fixed') return true; if (n !== el && /(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true; } return false; };
  const over = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !skip(el); }).slice(0, 5).map(el => el.tagName + '.' + (el.className || '').toString().split(' ')[0]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const small = []; let n;
  while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.closest('[aria-hidden="true"], .visually-hidden, script, style, template, dialog')) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 12 && el.getBoundingClientRect().width > 0) small.push(el.tagName + ':' + fs.toFixed(1) + ':' + n.textContent.trim().slice(0, 20)); }
  const body = parseFloat(getComputedStyle(document.body).fontSize);
  const container = document.querySelector('main .container');
  const box = container ? container.getBoundingClientRect() : null;
  const ratio = box ? ((box.width - parseFloat(getComputedStyle(container).paddingLeft) - parseFloat(getComputedStyle(container).paddingRight)) / vw) : null;
  const controls = [...document.querySelectorAll('button, .btn, .chip, input:not([type=checkbox]):not([type=radio]), select')].filter(el => el.getBoundingClientRect().width > 0 && !el.closest('dialog')).map(el => el.getBoundingClientRect().height).filter(h => h < 38);
  // overlapping boxes inside cards/steps
  let overlaps = 0;
  for (const card of document.querySelectorAll('.step, .card, .feed-item, .update-row')) {
    const kids = [...card.children].filter(k => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position !== 'absolute');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect(); if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) overlaps++; }
  }
  const h1 = document.querySelector('h1'); const h1fs = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
  return { vw, sw, over, smallCount: small.length, small: small.slice(0, 5), body, ratio: ratio ? +ratio.toFixed(3) : null, shortControls: controls.length, overlaps, h1fs, theme: document.documentElement.getAttribute('data-theme') || 'light' };
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True, args=["--disable-lcd-text"])
    report = []
    for theme in ("light", "dark"):
        for (w, h, dsf) in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf, reduced_motion="reduce")
            page = ctx.new_page()
            page.goto(BASE, wait_until="networkidle")
            page.evaluate("t => localStorage.setItem('vyapaarshuru:theme', JSON.stringify(t))", theme)
            for name, path in PAGES.items():
                if theme == "dark" and name not in ("home", "guide-gst", "updates"):
                    continue
                if w in (820,) and name not in ("home", "path-d2c"):
                    continue
                page.goto(BASE + path, wait_until="networkidle")
                page.wait_for_timeout(900)
                if name == "plan":
                    page.wait_for_timeout(400)
                audit = page.evaluate(AUDIT_JS)
                audit.update({"page": name, "width": w, "theme": theme})
                report.append(audit)
                page.screenshot(path=os.path.join(OUT, f"{name}-{w}-{theme}.png"), full_page=False)
            ctx.close()
    browser.close()

bad = [r for r in report if r["sw"] > r["vw"] or r["smallCount"] or r["overlaps"] or r["shortControls"]]
for r in report:
    flag = "FAIL" if (r["sw"] > r["vw"] or r["smallCount"] or r["overlaps"] or r["shortControls"]) else "ok  "
    print(f"{flag} {r['page']:<13} {r['width']:>4} {r['theme']:<5} body={r['body']:.1f} h1={r['h1fs']:.0f} ratio={r['ratio']} overflow={r['sw']-r['vw']} small={r['smallCount']} {r['small']} short={r['shortControls']} overlaps={r['overlaps']} over={r['over']}")
print(f"\n{len(report)} audits, {len(bad)} with findings")
json.dump(report, open(os.path.join(OUT, "audit.json"), "w"), indent=1)
