---
title: Data protection — DPDP Act 2023 and the 2025 Rules
section: People & data
order: 2
summary: Who is a Data Fiduciary (almost every business), the three-phase timeline to 13 May 2027, consent notices, rights, breach reporting in 72 hours, children’s data, retention, cross-border transfers, penalties, and a startup-sized compliance plan.
updated: 2026-10-23
affects: [saas, ecommerce, employer, company]
topics: [data-digital]
numbers: [dpdp-deadline]
related: [ecommerce-rules, hiring-and-payroll, going-international, selling-online-and-offline]
sources:
  - PwC — MeitY notifies the DPDP Rules 2025 (13 Nov 2025) | https://www.pwc.in/assets/pdfs/news-alert/regulatory-insights/2025/pwc_india_regulatory_insights_16_november_2025_meity_notifies_digital_personal_data_protection_rules_2025.pdf
  - Grant Thornton — DPDP Rules, Nov 2025 (phased timelines, G.S.R. 843–846) | https://www.grantthornton.in/globalassets/1.-member-firms/india/assets/pdfs/flyers/dpdp-rules-nov-2025.pdf
  - Grant Thornton — Privacy compliance guide 2025 (72-hour breach reporting, 90-day grievance) | https://www.grantthornton.in/globalassets/1.-member-firms/india/assets/pdfs/flyers/privacy-compliance-guide-2025-3.pdf
  - Qodequay — DPDPA compliance timeline (Nov 2026 and May 2027) | https://www.qodequay.com/dpdpa-compliance-timeline-phases-deadlines
---

The **Digital Personal Data Protection Act, 2023** is India’s first comprehensive privacy law. Its Rules were notified on **13 November 2025** with a phased start: the Data Protection Board first, **Consent Managers from November 2026**, and **every operational duty from 13 May 2027**. If your business collects a name, phone number, email, address or payment detail in digital form — a store, an app, a CRM, even a payroll — you are a **Data Fiduciary** and the clock is running.

## Key concepts

- **Personal data**: any data about an identifiable individual. **Digital** personal data (or digitised later) is covered; purely offline paper records are not.
- **Data Principal**: the individual. **Data Fiduciary**: whoever decides purpose and means (you). **Data Processor**: a vendor processing for you (cloud, CRM, gateway) — you remain responsible.
- **Significant Data Fiduciaries** (to be notified by volume/sensitivity) carry extra duties (DPO in India, annual audits, DPIAs, algorithmic checks).
- Applies to processing in India and to processing outside India in connection with offering goods or services to people in India.

## Lawful basis

Only two: **consent** or **legitimate uses** (data voluntarily provided for a specified purpose — e.g., a customer gives an address for delivery; employment purposes; legal obligations; medical emergencies; state functions). Most marketing, analytics beyond the purpose, and sharing with partners needs **consent**.

## Consent — what the Rules require

- A **notice** in clear, plain language (English or any Eighth Schedule language), standalone from other terms, listing the **itemised personal data**, the **specified purposes**, the goods/services or uses enabled, **how to withdraw consent** (as easy as giving it), how to exercise rights, and how to complain to the Board.
- Consent must be **free, specific, informed, unconditional, unambiguous**, by a clear affirmative act — no pre-ticked boxes, no bundling with unrelated purposes.
- Keep **records of consent** (who, when, what notice) — the burden of proof is on you.
- **Consent Managers** (registered platforms, from Nov 2026) let users give/withdraw consent across services; interoperability duties come later.

## Duties of every Data Fiduciary

1. **Purpose limitation and data minimisation** — collect what the purpose needs.
2. **Accuracy** when data affects decisions or is shared.
3. **Security safeguards**: encryption/obfuscation, access controls, logging and monitoring, backups, contracts with processors — the Rules list minimum measures.
4. **Breach notification**: inform **every affected Data Principal** (nature, consequences, mitigation, contact) and the **Data Protection Board** promptly, with a detailed report **within 72 hours** (extendable on request). CERT-In’s 6-hour incident-reporting direction runs in parallel.
5. **Retention and erasure**: delete when the purpose is served or consent withdrawn, unless law requires retention (tax records, KYC); for large e-commerce/gaming/social platforms, data of users inactive for **three years** must be erased with 48 hours’ notice. Publish retention periods.
6. **Rights**: access to a summary of data and processing, correction, completion, updating, erasure, grievance redressal (respond within **90 days**), nomination. Provide a published contact for rights requests and the grievance officer/DPO.
7. **Children (under 18)**: **verifiable parental consent** (via identity/age tokens, DigiLocker or similar), no tracking, behavioural monitoring or targeted advertising to children, except exempted classes (education, health) and purposes.
8. **Processors**: written contracts; processors delete data when the engagement ends.
9. **Cross-border transfers**: allowed except to countries the Central Government restricts (blacklist approach), subject to conditions it notifies — most US/EU cloud use remains permitted; sector regulators (RBI payments localisation) still override.

## Penalties

Up to **₹250 crore** per instance for failing security safeguards, **₹200 crore** for breach-notification and children’s-data failures, ₹150 crore for SDF duties, and ₹50 crore for other breaches — decided by the Data Protection Board, appealable to TDSAT. Data Principals who file false complaints can be fined ₹10,000.

## A startup-sized plan (4–6 weeks)

1. **Inventory**: list every place personal data lives — forms, app events, analytics SDKs, payment gateway, CRM, email tools, support desk, payroll, backups — with purpose, legal basis, retention and vendors.
2. **Notice and consent**: rewrite the privacy notice to the Rules’ format; add itemised, purpose-wise consent checkboxes at collection; implement withdrawal (account settings/email) and a consent log.
3. **Rights workflow**: a form/email for access/correction/erasure; identity verification; 90-day SLA (aim for 30).
4. **Security baseline**: TLS, encryption at rest, MFA for admin tools, least-privilege access, logs retained 1 year, vendor DPAs, backups tested.
5. **Breach playbook**: who decides, template notices for users and the Board, 72-hour clock, CERT-In 6-hour report.
6. **Children**: if under-18 users are possible, add age gating and parental-consent flows; turn off targeted ads for them.
7. **Employees**: HR data is personal data — notice to staff, retention schedule, access controls.
8. **Governance**: name a privacy owner (DPO only if designated as an SDF); review annually and at every new feature.

## Related laws still in force

IT Act **section 43A** and the **SPDI Rules 2011** (until repealed by DPDP’s full commencement), **IT Rules 2021** for intermediaries, **CERT-In directions 2022** (6-hour reporting, 180-day logs, KYC for VPN/cloud providers), **RBI data-localisation** for payment data, **SEBI/IRDAI** sector rules, **Consumer Protection** rules on use of consumer data by marketplaces (2026 amendments restrict using marketplace data to sell private labels).

:::tip
Enterprise customers and investors already ask for DPDP readiness in diligence. The notice, consent log, retention schedule and breach plan are a week’s work for a small team — do them before May 2027 makes them mandatory.
:::
