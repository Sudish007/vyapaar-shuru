---
title: GST compliance — invoices, returns, credit, e-invoicing and e-way bills
section: Tax
order: 2
summary: What a valid invoice must carry, the monthly/quarterly return cycle, how input tax credit actually works after IMS, composition and QRMP, e-invoicing above ₹5 crore, e-way bills, and the rate structure after GST 2.0.
updated: 2026-10-23
affects: [ecommerce, retailer, manufacturer, saas, exporter]
topics: [gst]
numbers: [gst-rates, gst-einvoice, gst-annual-return, gst-composition]
portals: [gst, einvoice, ewaybill]
related: [gst-registration, books-and-records, compliance-calendar, selling-on-marketplaces]
sources:
  - PIB — GST simplified to a two-slab structure (5% & 18%) | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/sep/doc202594628401.pdf
  - ClearTax — GST rates after the 56th Council | https://cleartax.in/s/gst-rates/
  - Treelife — GST compliance calendar 2026 (3-year hard block, IMS) | https://treelife.in/calendar/gst-compliance-calendar/
  - GST e-invoice portal | https://einvoice1.gst.gov.in/
  - GST Council — composition levy flyer | https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/composition-levy-scheme.pdf
---

Once you hold a GSTIN, GST becomes a monthly rhythm: issue compliant invoices, upload sales, reconcile purchases, pay the net tax, file. Get the rhythm right in month one and it stays a two-hour job; get it wrong and you spend years reconciling.

## Rates after GST 2.0 (from 22 September 2025)

The 56th GST Council collapsed four slabs into two: **5%** (merit) and **18%** (standard), with a **40%** rate for a short list of sin and luxury goods (tobacco, pan masala, aerated and caffeinated drinks, high-end cars, yachts, betting). Nil-rated/exempt lists continue (unbranded food staples, many education and health services). Many items moved — most packaged food, textiles, footwear under ₹2,500, small cars and appliances landed at 5% or 18%. Always read the rate against your **HSN** (goods) or **SAC** (services) on the GST rate finder, and watch the Updates feed: rate notifications are frequent.

## What a tax invoice must carry (Rule 46)

Name, address and GSTIN of the supplier · consecutive serial number (≤16 characters, unique per financial year) · date · recipient’s name, address and GSTIN (for B2B) or state for B2C above ₹50,000 · HSN/SAC (4 digits up to ₹5 crore turnover, 6 digits above) · description, quantity, unit · taxable value and discounts · rate and amount of CGST/SGST or IGST · **place of supply** with state name for inter-state · whether tax is on reverse charge · signature or digital signature (not needed on e-invoices). B2C invoices below ₹200 can be consolidated daily. Composition dealers issue a **bill of supply**, not a tax invoice.

Keep separate series for exports (“EXP/26-27/001”), and issue **credit notes** for returns, **debit notes** for under-billing, and receipt/refund vouchers for advances.

## The return cycle

| Taxpayer | What | When |
|---|---|---|
| Regular, monthly (turnover > ₹5 crore, or opted) | GSTR-1 (sales) | 11th of next month |
| | GSTR-3B (summary + payment) | 20th |
| Regular, **QRMP** (≤ ₹5 crore) | IFF (optional B2B upload, months 1–2) | 13th |
| | PMT-06 tax payment (months 1–2) | 25th |
| | GSTR-1 and GSTR-3B (quarterly) | 13th and 22nd/24th of the month after the quarter |
| Composition | CMP-08 (payment) | 18th after the quarter |
| | GSTR-4 (annual) | 30 April |
| Everyone > ₹2 crore | GSTR-9 annual return | 31 December |
| Everyone > ₹5 crore | GSTR-9C reconciliation | 31 December |

GSTR-3B is increasingly **auto-populated and locked** from GSTR-1 and the IMS; corrections go through GSTR-1A before 3B. Returns more than **three years** past due can no longer be filed (hard block since 2025) — a dormant GSTIN with unfiled returns becomes a permanent problem; cancel it instead.

Late fee: ₹50 a day (₹20 for nil returns) per return, capped by turnover; interest 18% a year on late tax.

## Input tax credit — the rules that actually bite

1. You need a **valid tax invoice** and the goods/services must have been received.
2. The supplier must have **filed GSTR-1** so the invoice appears in your **GSTR-2B**; since the **Invoice Management System (IMS)** you accept, reject or keep invoices pending and 2B is built from that.
3. You must pay the supplier within **180 days** or reverse the credit.
4. Claim by **30 November** of the following year (or the annual return, whichever is earlier).
5. **Blocked credits** (section 17(5)): most motor vehicles, food and beverages, club memberships, personal consumption, construction of immovable property, goods lost or given free. The 57th Council (Oct 2026) relaxed outdoor catering credit in some cases — check the notification.
6. Credit used for exempt supplies must be proportionately reversed (Rule 42/43).

Practical rule: reconcile purchases with 2B **every month** before filing 3B. Chasing a supplier a year later rarely works.

## Reverse charge you will meet

- **Imported services** (foreign SaaS, cloud, ads billed from abroad to your GSTIN): you pay IGST yourself and claim it as credit the same month — cash-neutral but mandatory.
- Goods transport agencies, legal services from advocates, sponsorships, security services to companies, director fees — the recipient pays.
- Purchases from unregistered persons are **not** under reverse charge in general (only notified categories).

## Composition scheme — simple but limiting

Turnover ≤ ₹1.5 crore (₹75 lakh in special states): traders and manufacturers pay 1%, restaurants 5%, services up to ₹50 lakh pay 6%. Quarterly payment, annual return. You cannot claim credit, cannot charge GST on invoices, cannot make inter-state supplies, cannot supply through TCS-collecting marketplaces (relaxations for intra-state are rolling out), and must print “composition taxable person” on every bill. Good for local B2C trade; wrong for anyone selling B2B or online across states.

## E-invoicing (turnover > ₹5 crore)

If aggregate turnover in **any** financial year since 2017-18 exceeded ₹5 crore, every B2B invoice, export invoice, credit and debit note must be reported to an Invoice Registration Portal, which returns an **IRN** and QR code — within 30 days of the invoice date for larger taxpayers. Accounting software does this through APIs; penalties for non-generation are ₹10,000 per invoice or 100% of tax. In October 2026 the system added categories for reverse-charge self-invoices; B2C e-invoicing remains voluntary.

## E-way bills

Movement of goods worth more than **₹50,000** needs an e-way bill (Part A by the supplier/recipient, Part B vehicle details by the transporter) generated on ewaybillgst.gov.in before the goods move. Many states extend it to intra-state movements with their own thresholds. Validity: one day per 200 km. Detention under section 129 for missing or wrong e-way bills costs 200% of tax — the most common “sudden” GST penalty for new traders.

## Place of supply in two lines

Goods: where the movement **ends** (the delivery address state). Services: the **recipient’s** registered location for B2B; the recipient’s address on record for B2C; special rules for property, events, transport, OIDAR and intermediaries. Inter-state → IGST; intra-state → CGST + SGST. Your GSTIN’s state does not need to match the buyer’s — one registration covers sales to every state.

## Monthly checklist

- [ ] All sales invoiced in the right series, with HSN and place of supply
- [ ] E-invoices generated (if applicable) and e-way bills closed
- [ ] Purchase invoices matched in IMS; suppliers who have not filed chased
- [ ] Reverse-charge liabilities (imports, GTA, legal) self-invoiced and paid
- [ ] Marketplace TCS credits accepted in the TDS/TCS credit statement
- [ ] GSTR-1 by the 11th, 3B and payment by the 20th (or QRMP dates)
- [ ] Books tie to the return — differences explained in a working file for the annual return
