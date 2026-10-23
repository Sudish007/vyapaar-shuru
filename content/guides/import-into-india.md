---
title: Importing into India — duty, clearance and compliance
section: Trade & global
order: 1
summary: IEC, ITC-HS classification, how duty is actually computed (BCD + SWS + IGST), restricted items, BIS/FSSAI/Legal Metrology at the border, Bill of Entry and customs brokers, paying suppliers through your bank, courier-mode imports and FTAs.
updated: 2026-10-23
affects: [importer, ecommerce, manufacturer]
topics: [trade, gst]
numbers: [iec-fee]
portals: [dgft, icegate, cbic, bis, legalmetrology, foscos]
related: [sourcing-and-procurement, gst-registration, licences-directory, export-from-india]
sources:
  - DGFT — Customs import/export procedures handbook | https://content.dgft.gov.in/Website/CIEP.pdf
  - Skydo — customs duty types, rates and calculation | https://www.skydo.com/blog/customs-duty
  - Invest India — calculation of import duty | https://www.investindia.gov.in/blogs/calculation-import-duty-india-formula-online-tools-and-exemptions
  - ICEGATE — duty calculator | https://www.icegate.gov.in/Webappl/index.jsp
---

Importing is procedurally simple — an IEC, a customs broker and a bank — but expensive to get wrong: the duty structure stacks, some products need pre-approvals the goods cannot clear without, and payment must flow through your bank against the customs documents.

## Before you order

1. **IEC** from DGFT (₹500, online, same day; one per PAN). Update it every April–June.
2. **GST registration** — to claim the IGST paid at import as credit, and because every B2B buyer will want a tax invoice.
3. **Classify the product**: find the 8-digit **ITC-HS** code on the CBIC tariff/ICEGATE. The code decides duty, policy (free/restricted/prohibited) and which agency must sign off.
4. **Check the import policy** for the code on DGFT: most goods are *free*; some are *restricted* (need a licence/authorisation — e.g., certain IT hardware under the import management system, second-hand goods, some chemicals and drones), some *prohibited*.
5. **Check compulsory standards**: **BIS** (CRS for electronics — the *foreign factory* must be registered; ISI for QCO items like toys, footwear, steel, appliances), **FSSAI** (food — importer needs a Central licence and products need FSSAI clearance at the port), **CDSCO** (cosmetics registration, drugs, devices), **WPC/ETA** (wireless devices), **plant/animal quarantine** (agri products), **Legal Metrology** labelling for packaged goods, **EPR** registration for electronics, batteries and plastic packaging.
6. **Anti-dumping / safeguard duties**: check CBIC notifications for your code and origin (common on Chinese steel, chemicals, solar, tiles, aluminium).
7. **FTA concessions**: ASEAN, Japan, Korea, UAE (CEPA), Australia (ECTA), EFTA (TEPA), Mauritius, the UK agreement and the New Zealand FTA in force from 20 October 2026 cut BCD if you get a **certificate of origin** and meet value-addition rules (CAROTAR).

## How duty is computed

Customs values goods on **CIF** (cost + insurance + freight; add 1% landing charges in older methods — now generally actual costs). Then:

| Step | Formula | Note |
|---|---|---|
| Assessable value (AV) | CIF in INR at the customs exchange rate | Rate notified fortnightly by CBIC |
| **Basic Customs Duty (BCD)** | AV × rate (0–150%, typically 10–20% for consumer goods; FTA rate if eligible) | Cost — not creditable |
| **Social Welfare Surcharge (SWS)** | **10% of BCD** | Cost |
| Agriculture Infrastructure and Development Cess (AIDC) / other cesses | On specified goods (gold, some agri, fuels) | Cost |
| **IGST** | (AV + BCD + SWS + cesses) × GST rate (5/18/40%) | **Creditable** against output GST |
| Compensation cess | Luxury/sin goods | Creditable only against cess |

Example: AV ₹1,00,000, BCD 20% → ₹20,000; SWS → ₹2,000; IGST 18% on ₹1,22,000 → ₹21,960. Total outlay ₹43,960; of that ₹21,960 comes back as ITC, so the true duty cost is ₹22,000 (22%). Use the **duty tool** on this site for quick estimates and the ICEGATE calculator for the authoritative number.

## Paying the supplier

- Payments go through your **AD bank** as import remittances (Form A1/online), quoting the invoice and, after clearance, matched to the **Bill of Entry** in the bank’s IDPMS system within the RBI period (generally **6 months** from remittance for advance payments, extendable). Unmatched advances become FEMA compliance issues.
- Advance payments above USD 200,000 may need a bank guarantee/standby LC from the supplier; most banks are comfortable with 30% advance + 70% against documents.
- Use **Letters of Credit** or **Alibaba Trade Assurance**-type escrow for new suppliers; **never** pay a trade supplier through personal remittance apps, crypto or a friend abroad.
- No income-tax TCS applies to business import payments through the bank (unlike LRS personal remittances); TDS under section 195 does not apply to purchase of goods.

## Clearance

1. Supplier ships; forwarder issues the **bill of lading** (sea) or **airway bill** (air). Documents: commercial invoice, packing list, certificate of origin, insurance, licences/BIS/FSSAI docs, catalogue.
2. Your **customs broker (CHA)** files the **Bill of Entry** on ICEGATE (up to 30 days before arrival, mandatory within a day after), self-assesses duty; customs may examine (RMS decides). Pay duty via ICEGATE e-payment.
3. For packaged consumer goods, **Legal Metrology declarations (MRP, importer name, country of origin, quantity, dates)** must be on the packs **before** clearance — arrange stickering at origin or in a bonded warehouse.
4. **Out of charge** → pick up from the port/CFS → pay the forwarder’s destination charges, demurrage if slow.
5. Book the IGST as ITC in the month of the Bill of Entry (it appears in GSTR-2B from ICEGATE data).

Typical CHA fee ₹3,000–8,000 per Bill of Entry plus port, CFS and transport charges; sea freight LCL from China ₹8,000–25,000 per cubic metre all-in in 2026 (volatile); air ₹250–600/kg.

## Small and e-commerce imports

- **Courier mode** (DHL, FedEx, Aramex, India Post): the courier files a Courier Bill of Entry (CBE); duty is collected on delivery; commercial samples under ₹10,000 can be duty-free with conditions; CRS/FSSAI rules still apply.
- Gifts and personal imports are not a route for trade — misdeclaring commercial goods as gifts is smuggling.
- **Dropshipping** into India from foreign suppliers makes *your customer* the importer of record, with duty on delivery — a poor experience; most Indian dropshippers import in bulk instead.

## Records and after-care

Keep import files (BoE, invoice, BL, payment proofs, COO, licences) for **5 years**; reconcile IGST credit with GSTR-2B; file **Bill of Entry amendments** for errors promptly; check whether your product needs **post-import** compliance (EPR returns, BIS marking, warranty obligations under the Consumer Protection Act).

:::warning
The three ways new importers lose a container: (1) electronics without the factory’s BIS registration, (2) packs without MRP/importer labels, (3) undervalued invoices flagged by the customs valuation database. All three are avoidable before the order is placed.
:::
