---
title: Banking and payments — current account, UPI, gateways and invoicing
section: Money
order: 1
summary: Opening a current account (documents by structure, charges, neobanks), UPI for business, choosing a payment gateway, international receipts, invoicing software, cash rules, and what the RBI’s payment-aggregator licensing means for you.
updated: 2026-10-23
affects: [freelancer, ecommerce, retailer, saas, company]
topics: [rbi-fema, gst]
portals: [rbi, gst]
related: [going-international, gst-compliance, books-and-records, selling-online-and-offline]
sources:
  - Skydo — best payment gateways for startups in India 2026 | https://www.skydo.com/blog/best-payment-gateways-for-startups-india
  - Skydo — Stripe vs Razorpay for international payments | https://www.skydo.com/compare/stripe-vs-razorpay
  - Reserve Bank of India — payment systems | https://www.rbi.org.in/
---

Money in a business account is the backbone of every return you will file: GST reconciliation, income-tax computation, audits and loan applications all start from the bank statement. Set it up properly in week one.

## Current account

### Documents by structure
| Structure | Documents |
|---|---|
| Proprietor | PAN, Aadhaar, photo; **two business proofs** from: Udyam, GSTIN, Shops & Establishment, trade licence, FSSAI, professional tax, IEC; address proof of the shop/office |
| Partnership | Deed, registration certificate (if registered), firm PAN, partners’ KYC, partners’ authority letter, business address proof |
| LLP | Certificate of incorporation, LLP agreement, PAN, designated partners’ KYC, resolution/authority, office proof |
| Company | Certificate of incorporation, MoA/AoA, PAN, board resolution naming signatories, directors’ KYC, office proof, list of beneficial owners above 10% (BO declaration) |

Banks now verify through MCA/GST APIs; video KYC is common. Expect 2–7 days.

### Choosing
- **Minimum average balance**: ₹0 (some startup programmes) to ₹25,000+; penalties for shortfall.
- **Charges**: NEFT/IMPS mostly free online; cash deposit limits; cheque book; forex markup (1–2% is typical; negotiate if you export).
- **Startup programmes**: ICICI iStartup, HDFC SmartUp, Axis Startup, Kotak, IDFC First, RBL — free banking for 1–2 years with DPIIT recognition.
- **Neobanks** (Open, RazorpayX, Jupiter Business, Fi Business) sit on partner banks and add payouts, vendor payments and payroll APIs; the account itself is with the partner bank.
- Public-sector banks are still better for **MUDRA/CGTMSE** and export packing credit.
- Keep a **second account** for GST/tax reserves if cash discipline is weak; never run business money through savings accounts once you have an entity.

## UPI for business

Get a **merchant UPI QR** (your bank app, PhonePe for Business, Paytm, BharatPe, Razorpay) linked to the current account. Merchant payments above ₹2,000 via UPI on prepaid instruments carry interchange, but bank-to-bank UPI is free for merchants today. Keep the soundbox/app settlement reports — they are your sales register for a shop.

## Payment gateways and aggregators

RBI licenses **Payment Aggregators**; use a licensed one (Razorpay, Cashfree, PayU, PhonePe PG, Paytm, Easebuzz, CCAvenue, Instamojo, Zaakpay, Pine Labs, Juspay, Stripe for existing accounts).

- **Onboarding**: PAN, bank proof, business proof, directors’ KYC, and a **website/app** with terms, privacy, refund, shipping, contact and pricing pages; category restrictions (crypto, gambling, some supplements). 1–5 days.
- **Pricing**: ~2% + 18% GST per domestic transaction (UPI often lower or zero for small merchants; cards 1.8–2.5%; international cards 3–4% + FX), settlement T+1/T+2 (instant settlement for a fee), chargeback fees.
- **Features to check**: payment links, subscriptions/e-mandates (RBI rules for recurring payments require AFA and pre-debit notifications), split settlements for marketplaces (needs the PA’s marketplace product), COD reconciliation via aggregators, Tokenisation (card-on-file tokens are mandatory; you cannot store card numbers).
- **Your own GST**: the gateway invoices you with GST (input credit); the customer pays your GST-inclusive price.
- If you **hold customer funds** or route payments for third parties you may yourself need a PA licence — most sellers do not.

## International receipts

Covered in detail in *Going international*: SWIFT to your account, cross-border PAs (Razorpay International, Skydo, Xflow, PayPal, Payoneer) with automatic **FIRA**, Stripe invite-only; purpose codes and realisation periods; never personal accounts or crypto.

## Invoicing and accounting

- Invoice from software that numbers sequentially per financial year, stores HSN/SAC and tax splits, generates e-invoices when needed and feeds GSTR-1: **Zoho Books/Invoice**, **Tally Prime**, **Vyapar**, **Refrens**, **Swipe**, **myBillBook**.
- Mandatory invoice fields are in the GST compliance guide; add **bank details and UPI QR** to get paid faster and your **Udyam number** to trigger the 45-day rule.
- Payment terms: due dates, late-payment interest (MSMED Act gives you 3× bank rate against buyers anyway), and TDS expectations (“TDS certificate to be shared”).

## Cash rules you must respect

- Do not **receive ₹2 lakh or more in cash** from one person in a day/transaction/event (penalty = amount).
- Do not **pay more than ₹10,000 in cash** per person per day for expenses (disallowed) or **₹20,000** for loans/deposits (penalty).
- Cash deposits/withdrawals above ₹10 lakh a year in current accounts are reported in SFT; **TDS on cash withdrawals** above ₹1 crore (₹20 lakh for non-filers).
- Keep petty cash with vouchers; staff advances through bank.

## Loans, overdrafts and cards

Current accounts with 6–12 months of GST-matched turnover qualify for overdrafts; corporate cards (Kodo, Karbon, Volopay, bank cards) help with SaaS spends and expense control — pay by due date, book as expenses with GST invoices in the company name.

:::warning
Free “current accounts” sold by agents with a credit card or insurance attached are the usual source of surprise charges. Read the schedule of charges, especially forex markup if you plan to export.
:::
