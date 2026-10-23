"""Functional smoke test of the client behaviour (Playwright, workspace venv). Exits non-zero on failure."""
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8790/vyapaar-shuru/"
fails = []
def check(name, cond, extra=""):
    print(("ok   " if cond else "FAIL ") + name + (f"  {extra}" if extra else ""))
    if not cond: fails.append(name)

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

    # Theme toggle persists
    page.goto(BASE, wait_until="networkidle")
    check("light is first paint", page.evaluate("document.documentElement.getAttribute('data-theme')") is None)
    page.click('[data-action="theme"]')
    check("toggle sets dark + label", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "Dark")
    page.reload(wait_until="networkidle")
    check("dark persists after reload", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark")
    page.click('[data-action="theme"]')

    # Home feed panel has rows and the updated time
    check("home feed rows", page.locator("[data-feed-latest] .update-row").count() >= 5)

    # Search
    page.keyboard.press("/")
    page.wait_for_timeout(300)
    check("search dialog opens on /", page.evaluate("document.getElementById('search-dialog').open"))
    page.fill("#search-input", "udyam")
    page.wait_for_timeout(200)
    first = page.locator("#search-results a").first
    check("search finds Udyam guide", "Udyam" in first.inner_text(), first.inner_text()[:60])
    page.keyboard.press("Escape")

    # Path page: tick a step, verify persistence and progress
    page.goto(BASE + "paths/freelancer/", wait_until="networkidle")
    total = int(page.inner_text("[data-path-progress] [data-total]"))
    page.check('[data-step-check="udyam"]')
    done = int(page.inner_text("[data-path-progress] [data-done]"))
    check("ticking a step updates progress", done == 1 and total >= 15, f"{done}/{total}")
    check("ticked step gets is-done", page.evaluate("document.querySelector('[data-step=\"udyam\"]').classList.contains('is-done')"))
    page.goto(BASE + "paths/d2c-brand/", wait_until="networkidle")
    check("tick is shared across paths", page.is_checked('[data-step-check="udyam"]'))
    check("path rail shows feed items", page.locator("[data-feed-affects] li a").count() >= 1)

    # Plan builder from a path, then custom answers
    page.goto(BASE + "plan/?path=saas-digital", wait_until="networkidle")
    page.wait_for_timeout(300)
    check("plan prefilled from path", page.is_checked('input[name="structure"][value="pvt"]') and not page.evaluate("document.getElementById('plan-output').hidden"))
    n_saas = page.locator("[data-plan-steps] .step").count()
    check("plan has steps", n_saas >= 25, str(n_saas))
    check("plan includes SOFTEX for digital exporters", page.locator('[data-plan-steps] [data-step="softex"]').count() == 1)
    check("plan excludes FSSAI without food flag", page.locator('[data-plan-steps] [data-step="fssai"]').count() == 0)
    check("plan keeps the shared tick", page.is_checked('[data-plan-steps] [data-step-check="udyam"]'))
    page.check('input[name="structure"][value="proprietor"]')
    page.uncheck('input[name="channels"][value="export"]')
    page.check('input[name="flags"][value="food"]')
    page.check('input[name="employees"][value="10-19"]')
    page.select_option("#plan-state", "Maharashtra")
    page.click('#plan-form button[type="submit"]')
    page.wait_for_timeout(300)
    check("proprietor plan drops SPICe+", page.locator('[data-plan-steps] [data-step="spice-plus"]').count() == 0)
    check("food flag adds FSSAI", page.locator('[data-plan-steps] [data-step="fssai"]').count() == 1)
    check("10-19 employees adds POSH and ESI", page.locator('[data-plan-steps] [data-step="posh"]').count() == 1 and page.locator('[data-plan-steps] [data-step="epf-esi"]').count() == 1)
    check("state note mentions professional tax", "professional tax" in page.inner_text("[data-state-note]"))
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(300)
    check("plan answers persist", page.is_checked('input[name="structure"][value="proprietor"]') and page.locator("[data-plan-steps] .step").count() > 0)

    # Tools
    page.goto(BASE + "tools/#gst", wait_until="networkidle")
    page.wait_for_timeout(200)
    check("gst tab shown", not page.evaluate("document.getElementById('gst').hidden") and page.evaluate("document.getElementById('structure').hidden"))
    page.check('input[name="marketplace"]')
    check("marketplace makes GST mandatory", "mandatory" in page.inner_text('[data-tool-result="gst"]').lower())
    page.goto(BASE + "tools/#duty", wait_until="networkidle")
    page.fill("#duty-cif", "100000"); page.fill("#duty-bcd", "20"); page.fill("#duty-cha", "0")
    page.wait_for_timeout(100)
    txt = page.inner_text('[data-tool-result="duty"]')
    check("duty maths: 1,00,000 @20% BCD, 18% IGST → 1,43,960", "1,43,960" in txt, txt[:80].replace("\n", " "))
    page.goto(BASE + "tools/#costs", wait_until="networkidle")
    page.check('input[value="pvt"]'); page.check('input[value="tm2"]')
    txt = page.inner_text('[data-tool-result="costs"]')
    check("cost estimator sums", "₹" in txt and "Government fees" in txt)
    page.goto(BASE + "tools/#structure", wait_until="networkidle")
    page.check('input[name="equity"][value="yes"]'); page.check('input[name="founders"][value="2"]')
    check("structure tool recommends a company when raising equity", "Private limited" in page.inner_text('[data-tool-result="structure"]'))

    # Updates filters and search
    page.goto(BASE + "updates/?topic=gst", wait_until="networkidle")
    page.wait_for_timeout(400)
    count_txt = page.inner_text("[data-feed-count]")
    check("updates filtered by topic from URL", "of" in count_txt and page.locator(".feed-item").count() > 0, count_txt)
    check("topic button reflects state", page.evaluate("document.querySelector('[data-filter=\"topic\"] button[data-value=\"gst\"]').getAttribute('aria-pressed')") == "true")
    page.fill("[data-feed-search]", "zzzzqqq")
    page.wait_for_timeout(200)
    check("empty search state", page.locator(".empty").count() == 1)

    # Calendar filters
    page.goto(BASE + "calendar/", wait_until="networkidle")
    page.click('[data-cal-filters] button[data-value="llp"]')
    page.wait_for_timeout(100)
    body = page.inner_text("[data-cal-grid]")
    check("LLP filter shows Form 11 and hides AOC-4", "Form 11" in body and "AOC-4" not in body)
    check("current month flagged", page.locator(".month.is-current").count() == 1)

    # Mobile menu
    m = b.new_context(viewport={"width": 390, "height": 844})
    mp = m.new_page(); mp.goto(BASE, wait_until="networkidle")
    mp.click('[data-action="menu"]')
    check("mobile menu opens", mp.evaluate("document.getElementById('mobile-nav').dataset.open") == "true")
    m.close()

    check("no console/page errors so far", not errors, "; ".join(errors)[:300])
    errors.clear()

    # 404 page under the sub-path keeps working links (the 404 itself logs a resource error — ignored)
    page.goto(BASE + "no/such/page/", wait_until="networkidle")
    check("404 served", "not here" in page.inner_text("h1"))
    href = page.get_attribute("a.btn.btn-secondary", "href")
    check("404 links resolve via base", page.evaluate("document.querySelector('a.btn.btn-secondary').href").endswith("/vyapaar-shuru/guides/"), href)

    check("no page errors on the 404 page", not [e for e in errors if "404" not in e], "; ".join(errors)[:300])
    b.close()

print(f"\n{len(fails)} failures" if fails else "\nall checks passed")
sys.exit(1 if fails else 0)
