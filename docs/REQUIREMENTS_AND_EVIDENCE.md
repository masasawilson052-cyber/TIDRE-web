# TIDRE rebuild: needs, scope and evidence

Reviewed: 8 September 2026. Product: TIDRE. Existing submission URL: https://masasawilson052-cyber.github.io/TRA-SmartTax-Web/

## Submission alignment

The controlling reference for this rebuild is the 21-page `DOC-20260730-WA0040.pdf`, titled **TIDRE AI: Intelligent Tax Assistance and Digital Record-Keeping for Tanzania’s Micro and Small Businesses**. Its final application page contains the existing live URL. The earlier 17-page SmartTax proposal is background; this rebuild does not substitute TIDRE's officer-risk platform or alter the submitted documents.

The 21-page proposal calls for a public prototype using illustrative data, editable receipt extraction, human confirmation, duplicate checks, records, controlled estimates, English/Kiswahili guidance, deadlines and eventual approved integrations. It proposes **1,000 businesses, two regions, four sectors and six months** of operational testing, not a completed pilot.

## Needs and implemented responses

| Need | Working response | Acceptance evidence |
|---|---|---|
| Small traders need fast daily capture | Manual sale/expense entry and camera-compatible receipt upload | Required date, amount and description; positive whole-TZS validation |
| Receipts contain uncertain or misread fields | Actual OCR/PDF text extraction, original evidence, editable form and extracted-text inspection | No fabricated OCR result; missing values remain blank; confirmation required |
| Repeated uploads inflate records | File fingerprint and same-party/date/value comparison | Duplicate override needs an explicit explanation |
| Totals must be understandable | Sales, expenses and net recorded movement derived from confirmed records | Review and void records excluded; tests reproduce exact seed totals |
| Records need continuity | Device-local persistence, original files, edits, voids and change history | Save completes before success; failed saves keep the form open |
| Tax calculations need a defensible basis | Eligibility gate, full-year confirmation, rule ID, source and formula | Boundaries tested; corporate/transport/professional cases routed to verification |
| A judge needs an inspectable result | PDF, CSV, JSON and calendar downloads | Files contain actual selected-period records and actual user inputs |
| Low bandwidth and uneven connectivity | No framework/CDN startup requests; local fonts, lazy document tools and cached shell | The OCR engine and language data load only when scanning is requested |
| Taxpayer control and inclusion | English/Kiswahili UI, editable values, light/dark theme, mobile navigation | No automatic liability, official filing or payment claims |
| Guidance must acknowledge uncertainty | Small source-linked guidance library and unknown-question fallback | Not presented as a generative AI model; no fabricated answer confidence |

These needs are grounded in the submitted proposal and public guidance. This session did not conduct interviews or measure user adoption; those remain pilot work.

## Tax-source discrepancy and decision

- [TRA: Income tax for individuals](https://www.tra.go.tz/page/income-tax-for-individuals), accessed 8 September 2026, shows different treatment for complete/incomplete records in the bands up to TZS 11 million; its upper band lists 4% and a TZS 200 million ceiling.
- The [official 2026/27 budget speech](https://www.tra.go.tz/images/uploads/public_notice/english/HOTUBA_YA_BAJETI_YA_SERIKALI_2026-2027.pdf) proposes a 4.5% upper-band rate. A budget proposal alone is not proof of the enacted rate and its application date.

**Implementation decision:** withhold calculations above TZS 11 million until the enacted legislation and effective period are verified. Never silently retain the original site's 3.5% value. Show both sources and an explicit next step. New-business relief also requires TRA confirmation; it is not automatically granted.

Supported lower-band formulas are isolated in `core.js`, identified as a public-source planning snapshot and tested at each boundary. Amounts use whole TZS; the app does not treat recorded expenses as presumptive-tax deductions or revenue as corporate profit. It does not extrapolate a month into annual sales without user confirmation.

Other authoritative routes: [Starting a business](https://www.tra.go.tz/page/starting-business-income-for-individuals-and-paying-taxes), [TRA Taxpayer Portal](https://taxpayerportal.tra.go.tz/), [TRA service and contact page](https://www.tra.go.tz/). These open as external official services. The prototype never impersonates them.

## Architecture and honest capability boundary

The replaceable static delivery is deliberate: it can run at the URL already printed in the submitted PDF. HTML/CSS/ES modules provide the working interface; Tesseract's actual OCR model runs locally; PDF.js reads one-page documents; jsPDF creates downloads. Browser storage holds example records and IndexedDB holds receipt evidence. There is no API key, hidden third-party receipt upload, cloud synchronization or verified identity service.

The public demo uses a deterministic category dictionary, which is explainable but is not a trained classification model. It never infers a VAT exemption from a category. Its help surface retrieves curated answers; it does not pretend to be an LLM. This distinction is shown in the app's capability page.

The secure pilot still requires authenticated accounts, authorized TIN verification, server-side data isolation, encryption, durable audit records, retention controls, backup/recovery, monitoring, maintained and approved tax rules, role-based officer access and formally approved TRA/EFD/filing/payment interfaces. None is falsely marked complete.

## Proposed improvement programme

1. **Co-design:** observe 12–20 consenting traders across the four submitted sectors and 4–6 relevant staff; measure record tasks and common misunderstandings. These counts are a proposed initial discovery sample, not completed research or a change to the submitted pilot scope.
2. **Model evaluation:** build a consented, redacted receipt evaluation set spanning printed, photographed, faded and handwritten examples. Report exact-match date/amount/vendor accuracy by document type and language. OCR confidence is not an accuracy guarantee.
3. **Rules governance:** resolve the conflicting band from enacted law, establish effective dates and approval ownership, then run fixed boundary and eligibility tests before activating a rule.
4. **Security and integration:** add the secure pilot service and obtain access to the approved interfaces before handling live taxpayer records. Keep a human review step.
5. **Six-month controlled pilot:** measure completion time, field corrections, record completeness, on-time completion, support demand, retention and cost per active business against baseline/comparison. Evaluate compliance outcomes separately from UI usage. Pre-register decision thresholds after the baseline; no invented revenue uplift or winning probability.

## Verification status

Automated checks cover functional logic, data validation, document structure, local assets and vendor integrity. PDF exports are generated from the app's export code and rendered for layout checks. The generated UI images are design concepts, not evidence of browser execution. Actual camera access, Safari/Android behavior, focus handling, browser storage quotas, service-worker offline recovery and browser OCR/PDF integration require device/browser QA before pilot use. No official judging rubric or award outcome is claimed.
