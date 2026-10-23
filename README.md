# Vyapaar Shuru — start your business in India without missing a step

**Vyapaar Shuru** (व्यापार शुरू, “start the business”) is a free, static, research-backed guide for people starting a business in India — from a freelancer on their own PAN to a private limited company exporting abroad. It covers structures, incorporation, GST, income tax under the Income-tax Act 2025, TDS, audits and records, licences (FSSAI, BIS, Legal Metrology, pollution, Shops & Establishment…), trademarks, funding, hiring under the Labour Codes, DPDP, selling online and offline, sourcing, importing, exporting and going international — and keeps itself current with a scheduled feed of regulatory updates.

Live: https://sudish007.github.io/vyapaar-shuru/

## What is inside

- **27 guides** (`content/guides/*.md`) — plain-language, each with sources, the official portal, the thresholds it relies on and a review date.
- **11 paths** (`content/paths/*.json`) — ordered checklists for a business type (freelancer, D2C brand, marketplace seller, SaaS, agency, local shop, food, manufacturing, import, export, non-profit) with structure recommendation, costs, taxes, channels, sourcing and pitfalls.
- **62 steps** (`content/data/steps.json`) — the shared step library with applicability rules, powering the paths and the **My plan** builder.
- **Numbers** (`content/data/thresholds.json`) — every threshold/fee with value, basis date and source.
- **Portals**, **glossary**, **compliance calendar** (`content/data/*.json`).
- **Tools** — structure chooser, GST applicability checker, import duty estimator, set-up cost estimator.
- **Updates feed** — `scripts/fetch.mjs` reads the sources in `sources.config.mjs` (RBI RSS, business press RSS, targeted Google News queries for portals without feeds), filters with keyword rules, de-duplicates across publishers, tags topics and audiences, and writes `data/updates.json`, `data/meta.json` (per-source health) and monthly archives. No model-written text anywhere; tags are labelled “keyword-tagged”.

## Stack

Node ≥ 22, plain ESM, two dependencies (`marked` for Markdown, `fast-xml-parser` for feeds), `node:test`. No framework, bundler, server or database. Output is a static `dist/` deployed to GitHub Pages under `/vyapaar-shuru/`; every URL is relative.

```
npm install
npm run fetch     # refresh data/ from the sources (≈5 s)
npm run build     # content + data → dist/
npm run serve     # http://127.0.0.1:8790/vyapaar-shuru/
npm test          # 33 tests: parsing, classification, dedupe, pipeline, content validation, built HTML
```

Screenshots and the numeric UI audit (overflow, 12 px floor, control heights, overlaps) come from `scripts/shots.py` (Playwright, workspace venv) into `docs/screenshots/`.

## Deployment

`.github/workflows/refresh.yml` runs every six hours (off-peak minute), on push to `main` and on dispatch: tests → fetch → commit `data/` back as `github-actions[bot]` → build → deploy Pages. GitHub may delay or skip scheduled runs; the Updates page shows the real refresh time.

## Editing content

- Add a guide: create `content/guides/<slug>.md` with front matter (`title`, `section`, `summary`, `updated`, `affects`, `topics`, `numbers`, `portals`, `related`, `sources` as `Title | URL`). The build validates every reference.
- Add a step: append to `content/data/steps.json` with an `applies` rule; reference it from paths.
- Add a source: one entry in `sources.config.mjs`.
- Change a threshold: edit `content/data/thresholds.json` (value, `since`, `source`) and the guide text that quotes it.

## Honesty

Content was researched against official portals and reputable professional sources and reviewed on 23 October 2026. It is not legal, tax or accounting advice. Every page carries its sources and the portal to confirm on; the Sources page lists source health and the full bibliography.

Text: CC BY 4.0. Code: MIT.
