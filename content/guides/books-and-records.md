---
title: Books of accounts and records you must keep
section: Run
order: 1
summary: What to record, which registers and documents each law demands, retention periods (8 years, 72 months, 6 years), accounting software with audit trail, and a month-end routine that keeps audits painless.
updated: 2026-10-23
affects: [company, freelancer, ecommerce, retailer, manufacturer]
topics: [companies, gst, income-tax]
numbers: [books-retention]
portals: [mca, gst, incometax]
related: [audits-and-annual-filings, gst-compliance, tds-tcs, banking-and-payments]
sources:
  - Companies Act 2013, section 128 — books of account | https://www.incometaxindia.gov.in/w/section-128-81
  - ClearTax — maintenance of books under Income Tax, GST and Companies Act | https://cleartax.in/s/maintenance-books-accounts
  - Tally — mandatory accounting records under the Companies Act | https://tallysolutions.com/accounting/mandatory-accounting-records-companies-act/
  - VJM Global — books of accounts under GST, Companies Act and Income tax | https://www.vjmglobal.com/blog/maintain-books-of-accounts
---

Three laws tell you what to write down: the **Companies Act** (companies and, lightly, LLPs), the **CGST Act** (every GST-registered person) and the **Income-tax Act, 2025** (everyone above small limits). They overlap heavily. One well-kept set of double-entry books in decent software satisfies all three; the differences are in the registers and how long you keep them.

## Who must keep books

- **Companies**: always, on accrual and double-entry basis, at the registered office (or another place notified to the ROC within 7 days), with **accounting software that keeps an edit log (audit trail)** — mandatory since 1 April 2023 and checked by auditors.
- **LLPs**: books on cash or accrual basis at the registered office.
- **GST-registered persons**: accounts at every registered place of business — production, inward and outward supplies, stock, input credit, output tax, advances.
- **Proprietors/firms under the Income-tax Act**: compulsory once business income exceeds ₹2.5 lakh or turnover ₹25 lakh in any of the three preceding years (₹1.2 lakh / ₹10 lakh for professionals; specified professionals keep prescribed books). Presumptive taxpayers are exempt — but keep bank statements and invoices anyway.

## The core records

| Record | What it is | Who needs it |
|---|---|---|
| Sales register | Every invoice with GST breakup, HSN, place of supply, customer GSTIN | Everyone registered |
| Purchase register | Supplier invoices, GSTIN, credit eligibility, payment date (180-day rule) | Everyone registered |
| Cash and bank books | All receipts/payments; monthly bank reconciliation | Everyone |
| Expense vouchers | Bills, receipts, approval; cash expense > ₹10,000 disallowed | Everyone |
| Stock register | Opening, receipts, issues, closing by SKU; job-work challans | Goods businesses |
| Fixed-asset register | Date, cost, depreciation, location, disposal | Everyone with assets |
| Payroll register | Wages, attendance, leave, PF/ESI/PT/TDS per employee (Labour Codes require electronic registers) | Employers |
| TDS register | Deductions by section, challans, returns, certificates | Deductors |
| Debtors/creditors ageing | With MSME flag for 45-day rule | Everyone |
| Loan and investment records | Agreements, charge filings (CHG-1), related-party terms | Companies especially |

### Company-only statutory records
Register of members (MGT-1), directors and KMP, charges (CHG-7), loans/guarantees/investments (MBP-2), contracts with related parties (MBP-4), share certificates and transfers, minutes of board and general meetings (signed within 30 days), attendance registers, DIR-8/MBP-1 disclosures from directors each year. Investors’ lawyers start diligence from these.

### Documents to keep behind the entries
Rent agreements, licences and registrations, insurance policies, customer contracts and purchase orders, delivery challans and e-way bills, export/import documents (shipping bills, bills of entry, e-BRCs, FIRAs), bank facility letters, board resolutions for every bank account and borrowing.

## Retention periods

| Law | Keep for |
|---|---|
| Companies Act (s.128) | **8 financial years** immediately preceding the current one (longer if an investigation is ordered) |
| GST (s.36) | **72 months** from the due date of the annual return for that year — roughly six years; longer while any appeal or investigation is pending |
| Income-tax Act 2025 | **6 years** from the end of the relevant tax year; indefinitely for years under reassessment; international transactions 8 years |
| Labour Codes | Wage and attendance records 3 years; EPF/ESI records as per scheme (long) |
| Customs | 5 years from the date of import/export |

Electronic records are fine everywhere if they are complete, backed up and producible on demand with the audit trail. Export the year-end books to PDF/CSV each year and store them outside the live software.

## Choosing software

- **Zoho Books**: GST returns, e-invoicing, audit trail, free tier for very small revenue, good for online businesses and services.
- **Tally Prime**: the CA ecosystem default; strong inventory, e-way bills, payroll add-on; desktop.
- **Busy, Vyapar, myBillBook**: SME invoicing and inventory; check that the plan includes an audit trail if you are a company.
- **Refrens, Swipe**: invoicing-first for freelancers.
- Payroll: greytHR, Keka, RazorpayX Payroll, Zoho Payroll for PF/ESI/PT/TDS automation.

Pick one that files GSTR-1 from the sales register and imports GSTR-2B for reconciliation; manual Excel books become the bottleneck at about 100 invoices a month.

## A month-end routine (two to four hours)

1. Import bank statements; post and reconcile every line.
2. Enter or import all sales (marketplace settlement reports, gateway payouts, invoices) and purchases (bills with GSTIN).
3. Match purchases with GSTR-2B/IMS; chase missing invoices; compute RCM on imports.
4. Run TDS register; pay by the 7th.
5. File GSTR-1 and 3B (or QRMP equivalents).
6. Payroll: PF/ESI by the 15th; PT by the state date.
7. Review debtors ageing (45-day MSME rule), inventory variances, cash.
8. Lock the month in software.

:::tip
Separate the **book-keeper** (who posts entries — you, an accountant or a bookkeeping service at ₹2,000–8,000 a month) from the **auditor** (independent CA). Mixing the two is a Companies Act violation for companies and a quality problem for everyone.
:::
