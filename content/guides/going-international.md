---
title: Going international — selling abroad, foreign payments, subsidiaries and flips
section: Trade & global
order: 3
summary: Exporting services and software from India (LUT, FIRA, SOFTEX, EDF), receiving foreign money compliantly, when and how to set up a foreign entity under the 2022 ODI rules, the Delaware/Singapore flip and the reverse flip, and selling to Indian customers from abroad (OIDAR).
updated: 2026-10-23
affects: [saas, freelancer, exporter, company]
topics: [rbi-fema, gst, trade]
numbers: [export-realisation]
portals: [rbi, dgft, stpi, gst, rbi-firms]
related: [export-from-india, banking-and-payments, funding-and-schemes, gst-registration]
sources:
  - Treelife — FEMA ODI rules for Indian startups investing abroad | https://treelife.in/legal/fema-odi-rules-and-regulations/
  - Treelife — foreign subsidiary jurisdiction (two-layer rule) | https://treelife.in/legal/foreign-subsidiary-jurisdiction/
  - Commenda — FEMA and Indian startups (automatic route since Aug 2022) | https://www.commenda.io/blog/fema-indian-startups
  - Treelife — the reverse flip playbook | https://treelife.in/reports/the-reverse-flip-playbook-for-indian-founders/
  - Skydo — Stripe alternatives for Indian exporters 2026 (Stripe invite-only) | https://www.skydo.com/compare/stripe-alternatives
  - Winvesta — Stripe went invite-only in India (May 2024) | https://www.winvesta.in/blog/businesses/stripe-alternatives-for-india-best-payment-platforms-for-freelancers-and-businesses
  - Skydo — SOFTEX for software exporters | https://www.skydo.com/blog/softex-form-guide-indian-exporters
  - PwC — FEM (Export and Import of Goods and Services) Regulations 2026 | https://www.pwc.in/assets/pdfs/news-alert/regulatory-insights/2026/pwc_india_regulatory_insights_19_january_2026_foreign_exchange_management_export_and_import_of_goods_and_services_regulations_2026.pdf
---

An Indian founder can sell to the world from India on day one. The rules that matter are **FEMA** (every rupee that crosses the border), **GST** (exports are zero-rated), and — if you ever set up a company abroad — the **Overseas Investment Rules, 2022**. This guide covers the sequence most founders actually follow: sell from India first, structure abroad only when a customer, investor or law forces it.

## Stage 1 — Sell abroad from your Indian entity

### Services and software exports
- **GST**: export of services is zero-rated when the recipient is outside India, the place of supply is outside India, payment is received in convertible foreign exchange (or INR through a permitted Vostro account) and you are **not an intermediary** (agents arranging others’ supplies pay 18%). File a **LUT** each April; keep invoices in a separate series; claim ITC refunds.
- **FEMA**: receive the money into your Indian bank with a **purpose code** (e.g., P0802 software consultancy, P1006/P1007 business services) and get a **FIRA/e-FIRC**. Under the 2026 regulations service exporters also file the **Export Declaration Form** flow through the bank/portal — ask your bank how it operationalises it. Realise payment within the RBI period (**9 months** after the 22 Sep 2026 amendment; verify).
- **SOFTEX**: software and IT-enabled service exporters declare each export (or a monthly bunch) on SOFTEX, certified by **STPI** — register as a **non-STP unit** at your nearest STPI centre (annual charge by export slab). Banks increasingly refuse to close large IT receipts without SOFTEX numbers.
- **IEC**: not mandatory for pure service exports unless you claim FTP benefits, but it costs ₹500 and many banks and platforms ask for it. Services exporters can take **SEPC** membership for incentives.
- **Income tax**: worldwide income is taxed in India; foreign withholding (e.g., 10% in some countries on technical fees) is credited via **Form 67** under the treaty. US clients will ask for **W-8BEN-E** (treaty claim, Article 12 royalties/FTS vs business profits).

### Getting paid
| Method | Fits | Cost | Notes |
|---|---|---|---|
| SWIFT wire to your current account | Invoices > ₹2–3 lakh | ₹500–2,000 + correspondent fees + FX spread | Bank issues FIRA; purpose code at inward |
| Cross-border PAs (Razorpay International, Skydo, Xflow) | Freelancers and SaaS invoicing | ~0.5–1.5% + transparent FX | Auto FIRA/e-FIRC; local USD/GBP/EUR accounts |
| **PayPal** | Marketplace freelancers, small tickets | ~4.4% + FX | Auto-withdrawal to India within a day (RBI rule); FIRA available |
| **Payoneer** | Upwork/Fiverr/Amazon payouts | 1–3% | Issues FIRA |
| **Stripe** | Card checkout for SaaS | ~2.9–4.3% + FX | **Invite-only in India since May 2024**; existing accounts work |
| Merchant of record (Paddle, Lemon Squeezy, FastSpring, Gumroad) | Selling software/digital goods globally | 5–8% | They collect foreign VAT/sales tax; pay you as an export of services — one customer, one FIRA |

Never route export income through a relative abroad, a personal NRE account or crypto; the GST is already zero — the risk is a FEMA contravention (compounding is now delegated to RBI regional offices, so enforcement is faster).

### Selling to Indian consumers from a foreign platform
If you (or your foreign entity) supply digital services to Indian consumers from outside India, the **OIDAR** rules make the foreign supplier liable for 18% GST with a simplified registration. App stores and MoR platforms handle this for you; a Delaware entity selling directly to Indian consumers must register.

## Stage 2 — A foreign entity, done compliantly

### Why founders do it
A US customer that will only sign with a US entity; a US investor insisting on a Delaware parent; access to Stripe/credit-card processing and US banking; a Singapore holding for Asia; a UAE free-zone company for Gulf trade.

### The rule
Any Indian resident (individual or company) acquiring **control** or **10%+** of a foreign entity makes an **Overseas Direct Investment** — reportable even if **no money** moves (a $0 LLC formed by you is ODI). Since August 2022 most ODI is under the **automatic route** through your **AD bank**:

1. Pick the structure: **India parent → foreign subsidiary** (most common; profits come back as dividends) or **foreign parent → Indian subsidiary** (“flip”). Maximum **two layers** of subsidiaries.
2. Fund it: individuals under **LRS** (US$250,000 a year, 20% TCS above ₹10 lakh for most purposes); companies within **400% of net worth**. Bootstrapped founders usually remit the formation costs under LRS and file.
3. File **Form FC** with the bank **before or within 30 days** of the remittance/acquisition, with a valuation (CA certificate for small amounts), get the **UIN**.
4. Every year: **Annual Performance Report** (by 31 December, based on the foreign entity’s audited/certified accounts) and the **FLA** return (15 July). Repatriate dues (dividends, royalties) within 90 days of falling due.
5. Round-tripping (foreign entity investing back into India) is allowed on the automatic route as long as the two-layer limit holds and it is not designed for tax evasion.

### Delaware vs Singapore vs UAE
- **Delaware C-Corp**: the standard for US VC; formation US$300–800 via Stripe Atlas/Clerky/Firstbase; US federal tax 21% + state; needs an EIN, registered agent, annual franchise tax, Form 5472 for foreign-owned entities; Indian founders cannot form an **S-Corp**. An LLC owned by a non-resident is simple but creates US tax filings regardless of income.
- **Singapore Pte Ltd**: 17% corporate tax with exemptions, strong treaty network, a resident director required (nominee services S$2–5k/yr), substance expectations for treaty benefits.
- **UAE free zone**: 0% corporate tax up to thresholds for qualifying income (9% otherwise), good for Gulf trade; substance and banking take time.

### Tax reality
A foreign entity controlled from India can be an Indian tax resident under **POEM** (place of effective management) rules if its turnover exceeds ₹50 crore — board meetings and decisions must genuinely happen abroad. Intercompany pricing between the Indian and foreign entities needs **transfer-pricing** documentation (Budget 2026 widened the IT/ITeS safe harbour to companies up to ₹2,000 crore with a 15.5% margin). Dividends from the subsidiary are taxed in India with foreign tax credit.

## Stage 3 — The flip and the reverse flip

A **flip** moves the parent abroad (founders swap Indian shares for foreign-parent shares; the Indian company becomes a subsidiary). It is a taxable share swap for founders, requires FC-TRS/ODI filings, and later makes an Indian IPO hard. From 2023–25 many unicorns **reverse-flipped** back to India (PhonePe, Groww, Zepto, Razorpay, Pine Labs, Meesho) because Indian listings and the end of angel tax made India the better domicile; the 2025 fast-track merger route (no NCLT for foreign-parent-into-Indian-subsidiary mergers) cut the time to months. Lesson for a new founder: **do not flip pre-emptively** — flip only when a specific investor or customer requires it, with tax advice, and keep IP ownership deliberate.

## Checklist for the first foreign dollar

- [ ] LUT filed for the year; export invoice series set
- [ ] Bank/PA account with purpose codes and FIRA issuance confirmed
- [ ] IEC (cheap insurance) and STPI non-STP registration if you export software
- [ ] Invoice template with IEC, GSTIN, LUT ARN, HS/SAC, currency, payment terms within the RBI realisation window
- [ ] Form 67 workflow for foreign tax credits; W-8BEN-E ready for US clients
- [ ] If forming a foreign entity: AD bank briefed, Form FC drafted, LRS/ODI route chosen, two-layer check, APR calendar entry
