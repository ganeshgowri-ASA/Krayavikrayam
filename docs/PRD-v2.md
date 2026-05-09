# Krayavikrayam — PRD v2

Status: Draft (Session 1)
Owner: ganeshgowri-ASA
Repo: ganeshgowri-ASA/Krayavikrayam
Frontend: Vercel (krayavikrayam.vercel.app)
Backend (procurement copilot): Railway (Python)
Reference UI: RIL ProcureNXT (Buyer v2)

---

## 1. Purpose

Krayavikrayam is an end-to-end procure-to-pay (P2P) platform inspired by RIL's updated ProcureNXT Buyer v2. PRD v2 revises the product scope to mirror the latest ProcureNXT information architecture (IA) and to formalize the Technical Bid Evaluation (TBE) comparison model derived from the attached XLSX templates.

## 2. Source Inputs

- ProcureNXT Buyer v2 UI screenshots and live walk-through (May 2026).
- 5 comparison spreadsheets (canonical TBE templates):
  - PID-20-Ch-Comparison-File.xlsx
  - Flasher-A-A-A-Comparison.xlsx
  - TCPS10_Comparison_File.xlsx
  - UV2_Comparison_File.xlsx
  - 4-in-1-Comparison-File.xlsx

## 3. Information Architecture (mirrors ProcureNXT left nav)

1. Home (dashboard, KPIs, pending actions)
2. Purchase Requests (PR)
3. RFQs
4. Material Inspection (Pre-delivery, Post-delivery)
5. Service Certification (Manpower Certification)
6. Orders (Materials, Services)
7. Supplier Management (Registration Status, Onboarding, Blocking/Unblocking, Relationship, Performance)
8. Workforce Management (Contract Workforce Attendance)
9. Access Management (Access first, Access control)
10. Analytics (Power BI)
11. Master Data (Material master, Service master)

Persona shown in reference UI: Business User. Role-based access required.

## 4. Purchase Requests — Detailed Spec

Header: "Purchase requests" with back arrow + "Create new request" CTA + fullscreen toggle.

Filter chips with counts: Search by, Draft, Pending for approval, Under rework, Need Clarification, All, plus filter/settings icon.

List table columns: Description | PR No | Action.
Pagination: « ‹ Page [n] of N › ».

Lifecycle: Draft → Pending for approval → (Under rework | Need Clarification) → Approved → RFQ.

## 5. RFQ & TBE Comparison Model (from XLSX templates)

- Item header: Tag No, Description, Make/Model, Quantity, UoM.
- Bidder columns: Bidder 1..N (technical + commercial sections).
- Compliance row per parameter: Specified | Offered | Compliance (C / NC / D) | Remarks.
- Sections: General, Electrical, Mechanical, Environmental, Testing & Certification, Documentation, Spares, Commercial.
- Roll-up: Auto compliance score per bidder; recommended bidder flag.

Deliverable: a TBE engine that ingests an item template and N bidder offers, produces a comparison sheet identical in structure to the reference XLSX files.

## 6. Bite-sized Sessions Plan

- S1 (this PR): PRD v2 documentation.
- S2: IA scaffolding — left-nav modules + Home dashboard cards + Quick actions.
- S3: Purchase Requests list view (chips + table + pagination + Filter drawer with Request type / Urgency / Request Status taxonomies).
- S4: Create new PR/SR router + forms (S4a PR-Material, S4b PR-Service, S4c Bulk PR, S4d SR-Service).
- S5: Approval workflow (A1/A2/A3/A7/AN + TC).
- S6: RFQ list view with the 7 columns from §9.6.
- S6.5: Orders page (Request-to-Order / Order-to-Material) with Material/Service sub-nav.
- S7: TBE schema + XLSX import.
- S8: TBE comparison view + compliance scoring.
- S9: Procurement copilot wiring (Railway backend, API/MCP).
- S10: Analytics + Master Data.
- S11: Federation/SSO scaffolding for external sub-apps.

## 7. Non-Functional Requirements

- Auth + RBAC (Business User, Approver, Buyer, Admin).
- Audit log on every state transition.
- Vercel build must remain green (no Prisma postinstall failures — see PR #19).
- Backend procurement copilot hosted on Railway, integrated via API/MCP.
- Avoid redundant code; reuse migrated assets from antaryami-os where applicable.

## 8. Open Items

- Byte-exact migration of Python sources/tests/data from antaryami-os.
- Vercel Production redeploy verification post PR #19.
- Railway backend provisioning.

---

## 9. ProcureNXT — Nano-Granular Review (live walk-through, May 2026)

### 9.1 Authentication & shell

- Root URL redirects to `/buyerlogin/?redirectURL=https://procurenxt.ril.com/buyerv2/`.
- Authenticated landing: `/buyerv2/landing-page/redirect-app`.
- Top bar: ProcureNXT logo (Reliance), Help (?), Notifications bell (badge 0), user pill `GG  Gowri Ganesh / Business User`.
- Left rail collapsible (« toggle at bottom).

### 9.2 Left navigation — full taxonomy

1. Home
2. Purchase requests
3. RFQs
4. Material inspection ▾ Post-delivery inspection, Pre-delivery inspection
5. Service certification ▾ Manpower Certification
6. Orders ▾ Materials, Services
7. Supplier management ▾ Supplier Registration Request Status, Supplier Onboarding, Supplier Blocking/Unblocking, Supplier Relationship Management, Supplier Performance Management (→ spm.ril.com)
8. Workforce management (→ acplcloud.com/ril_clas/ — ACPL CLAS Contract Workforce Attendance System)
9. Access management ▾ Access first, Access control
10. Analytics (→ app.powerbi.com)
11. Master data ▾ Material master, Service master

Observation: ProcureNXT is a portal shell that federates several specialist apps (BPM forms on rbpmapps.ril.com, SCM on scm.ril.com, SPM on spm.ril.com, attendance on acplcloud.com, analytics on Power BI).

### 9.3 Home dashboard

- Two-column layout: Action required cards (left) + Recent notifications (right).
- Action-required cards: Purchase Requests, RFQs, Pre-delivery inspection, Post-delivery inspection, Unit rate measurement, Manpower Certification.
- Request to Order panel: dropdown {Material | Service}; counters {Total, Released PR, Unreleased PR}; View all.
- Order to acceptance panel: dropdown {Material | Service}; counter {Total}; View all.
- Quick action row: Create new request, Add new material, Add new service.
- Recent notifications empty-state: "No notifications found."

### 9.4 Purchase requests page

- Header: back arrow + title; right side: Create new request CTA + fullscreen toggle.
- Search: Search by input.
- Status chips with counts: Draft, Pending for approval, Under rework, Need Clarification, All.
- Sort + Filter icons.
- Columns: Description (item description, code in parens, PR/Item no), PR No (hyperlinked), Action chevron.
- Pagination.

Filter drawer exposes canonical taxonomy:
- Request type: PR-Material, PR-Service, SR-Service, SR-Material.
- Urgency: Catalogue Procurement Item, Emergency Purchase, Expediting, Ext.Proc Approved after Spr. Check, Fast Moving Material - Neg PSQ, Fast Moving Material Determination, Future Surplus Available at Sites, Inter Company Transfer, Material Sparable at Sites, Negligible/value filter PSQ, Normal, Potential Sparable Qty Not exists.
- Request Status: Blocked, Clarification Received, Contract Exists, Draft PO, Held PO, Not Processed Released PR, Partially Ordered, Pending For A1/A2/A3/A7/AN Approval, Pending For TC Approval, PO Cancelled, Sent for Clarification, Sparability Block, Stock Transfer Request.
- Footer: Reset / Apply.

Approval ladder: A1 → A2 → A3 → A7 → AN, plus parallel TC approval.

### 9.5 Create new request (entry router)

- PR card (when code available): Bulk Purchase request Creation, Purchase request for Material, Purchase request for Service.
- SR card (last resort, no code): Sourcing request for Service.
- All buttons → BPM runtime: rbpmapps.ril.com/Runtime/Runtime/Form/P2P.FORM.CreateNewRequest/.

### 9.6 RFQs page

- Tabs: Open RFQs (n), All (n).
- Columns: RFX Description, Created By, Released, Due Date, RFX Status, Technical Review Status, Supplier Quoted/Invited.
- Empty state: "No items to display."
- Terminology mixes RFQ/RFX; PRD v2 uses RFQ externally and RFX internally.

### 9.7 Orders page

- Tabs: Request To Order, Order To Material.
- Sub-nav: Materials | Services.
- Columns include Description, PR Number.

### 9.8 Federated/external modules

- Supplier Performance Management → spm.ril.com/spm/#/tenant.
- Legacy supplier portal → scm.ril.com (Supply Chain Management) with NEW SUPPLIER / MODIFY DRAFT.
- Workforce management → ACPL CLAS (acplcloud.com/ril_clas/) — Contractor / EIC / Other roles, Login ID + Get OTP, Android app (ACPL Workman Attendance).
- Analytics → Power BI report.

### 9.9 Implications for Krayavikrayam PRD v2

1. Shell-first IA with 11 modules; some are thin wrappers around specialist services.
2. Pluggable form runtime for PR/SR creation (own React forms first; BPM-replaceable later).
3. Status/urgency vocabularies become canonical enums.
4. Approval ladder (A1–A3, A7, AN, TC) modeled as configurable roles.
5. Federation auth/SSO for sub-apps.
6. TBE engine integrates with RFQ; add Technical Review Status and Supplier Quoted/Invited to RFX entity.
7. Home dashboard parity with Action Required + Request-to-Order + Order-to-Acceptance.
8. Quick actions on Home: Create new request, Add new material, Add new service.

### 9.10 Scope adjustments to the session plan (Section 6)

- S2 → add Home dashboard cards + Quick actions.
- S3 → add Filter drawer with the three taxonomies.
- S4 → split into S4a/S4b/S4c/S4d.
- S5 → model approval ladder A1/A2/A3/A7/AN + TC.
- S6 → RFQ list with 7 columns.
- New S6.5: Orders page.
- New S11: Federation/SSO.
