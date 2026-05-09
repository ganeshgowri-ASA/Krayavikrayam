# Krayavikrayam — Claude Code Session Plan

Derived from `docs/PRD-v2.md`. Each session is bite-sized (one PR, ideally < 500 LoC of meaningful change), green CI, and independently reviewable.

## Coverage disclosure

PRD v2 captured the verified surface of ProcureNXT Buyer v2 (shell, left nav, Home dashboard, Purchase Requests filter taxonomies, Create-new-request router, RFQ list columns, Orders tabs, federated sub-apps). Deep sub-screens (PR detail, RFQ wizard internals, Order detail, Inspection forms, Manpower Cert, Onboarding wizard, Master Data CRUD) were observed only at list level. A discovery task (D1–D8) is included before each implementation slice that depends on those screens, so we walk the live page first and then code.

---

## Phase 0 — Foundations

### S0.1 Repo hygiene & CI baseline
- Verify `main` is green after PR #19 (Prisma fix).
- Add `docs/` link to README; add CONTRIBUTING.md with the bite-size rule.
- Add commit-message + PR template; enable required checks on `main`.
- Acceptance: green CI, README links resolve.

### S0.2 Design system seed
- Adopt Tailwind + shadcn/ui (already present) + lucide-react icons.
- Add tokens for ProcureNXT-like palette (indigo primary, soft chips, rounded-2xl cards).
- Build primitives: `PageHeader`, `Chip`, `DataTable`, `FilterDrawer`, `Pagination`, `EmptyState`, `Card`, `KpiTile`.
- Acceptance: Storybook (or `/_kitchen-sink` route) renders all primitives.

### S0.3 Auth + RBAC scaffold
- NextAuth (or Clerk) with roles: BusinessUser, Approver, Buyer, Admin.
- Route guards + a `useRole()` hook.
- Acceptance: protected `/app/*` routes; role can be switched in dev.

---

## Phase 1 — Shell & Home

### S1.1 App shell
- Top bar (logo, Help, Notifications bell with badge, user pill).
- Collapsible left rail with the 11 modules from PRD §3.
- Active-state highlighting; sub-menu accordion.
- Acceptance: nav matches §9.2 of PRD verbatim.

### S1.2 Home — Action Required + Notifications
- KpiTile cards: Purchase Requests, RFQs, Pre-delivery inspection, Post-delivery inspection, Unit rate measurement, Manpower Certification.
- Recent Notifications panel with empty-state.
- Data wired to `/api/home/summary` (mocked initially).
- Acceptance: counts render, empty state matches.

### S1.3 Home — Request to Order + Order to Acceptance
- Two panels with Material/Service toggle; Request-to-Order shows {Total, Released PR, Unreleased PR}; Order-to-Acceptance shows {Total}.
- "View all" routes to Orders sub-tab.
- Acceptance: toggling material/service updates counters.

### S1.4 Home — Quick actions
- Buttons: Create new request, Add new material, Add new service.
- Routing: Create new request → PR/SR router; Add material/service → Master Data create.
- Acceptance: all three routes resolve.

---

## Phase 2 — Purchase Requests

### S2.1 PR list page
- Status chips (Draft, Pending for approval, Under rework, Need Clarification, All) with live counts.
- DataTable: Description (multi-line: title, code, PR/Item no), PR No (link), Action chevron.
- Search by, Sort, Pagination.
- Acceptance: chip filtering + pagination work against `/api/pr?status=...`.

### S2.2 PR Filter Drawer
- Right-side drawer with three sections from PRD §9.4:
  - Request type: PR-Material, PR-Service, SR-Service, SR-Material.
  - Urgency (12 values).
  - Request Status (incl. A1/A2/A3/A7/AN, TC).
- Reset / Apply footer.
- Acceptance: combined filters reflect in URL and result count.

### D3 (discovery) — PR detail screen
- Walk the live PR detail page; document fields, tabs, attachments, approval timeline.
- Output: `docs/discovery/pr-detail.md`.

### S2.3 PR detail view
- Implement the screen documented in D3: header, item table, attachments, approval ladder timeline, comments/clarification thread, audit log.
- Acceptance: read-only first, then enable approver actions in S3.

### S2.4 Create new request router
- Two-card chooser (PR vs SR) with the four buttons from PRD §9.5.
- Acceptance: each button routes to its form.

### D4 (discovery) — PR/SR forms
- Walk each of the 4 BPM forms; capture field list + validation rules.
- Output: `docs/discovery/pr-forms.md`.

### S2.5 PR-Material form (S4a)
### S2.6 PR-Service form (S4b)
### S2.7 Bulk PR Creation (S4c)
### S2.8 SR-Service form (S4d)
Each: form + Draft save + Submit → Pending for A1.

---

## Phase 3 — Approvals

### S3.1 Approval ladder engine
- State machine: Draft → A1 → A2 → A3 → A7 → AN → Released; parallel TC review; Under rework; Need Clarification (with comment loop).
- Configurable role → level mapping.
- Acceptance: unit tests cover all transitions including reject loops.

### S3.2 Approver inbox
- "Pending for me" view with bulk approve / reject / send for clarification.
- Acceptance: actions emit audit events.

### S3.3 Clarification thread
- Threaded comments per PR with @mentions and attachments.
- Acceptance: thread persists and renders in PR detail.

---

## Phase 4 — RFQ / RFX + TBE

### D5 (discovery) — RFQ creation wizard
- Walk the live RFQ creation flow.
- Output: `docs/discovery/rfq-wizard.md`.

### S4.1 RFQ list page
- Tabs: Open RFQs, All.
- Columns: RFX Description, Created By, Released, Due Date, RFX Status, Technical Review Status, Supplier Quoted/Invited.
- Acceptance: matches PRD §9.6.

### S4.2 RFQ creation wizard
- Steps: Items (from approved PR), Suppliers, Schedule, Documents, Review.
- Acceptance: produces a Draft RFX.

### S4.3 Supplier invitation + quote intake
- Invite suppliers; capture quoted prices + technical bid attachments.
- Acceptance: `Supplier Quoted/Invited` column updates.

### S4.4 TBE schema
- Entities: TbeTemplate (sections), TbeParameter, TbeOffer, TbeCompliance.
- Sections per PRD §5: General, Electrical, Mechanical, Environmental, Testing & Cert, Documentation, Spares, Commercial.
- Acceptance: schema migrates; seed from one of the 5 reference XLSX files.

### S4.5 TBE XLSX import
- Parse the 5 reference comparison files into TbeTemplate.
- Acceptance: round-trip parse for all 5 files.

### S4.6 TBE comparison view
- Bidder-by-bidder grid; Specified | Offered | C/NC/D | Remarks.
- Per-bidder compliance score; recommended bidder flag.
- Acceptance: visually mirrors the reference XLSX layout.

### S4.7 TBE export
- Export comparison back to XLSX (openpyxl) and PDF.
- Acceptance: exported XLSX byte-compatible with reference templates.

---

## Phase 5 — Orders

### D6 (discovery) — Orders detail
- Walk Order detail, GRN, invoice tabs.
- Output: `docs/discovery/orders.md`.

### S5.1 Orders list
- Tabs: Request To Order, Order To Material; sub-nav Materials | Services.
- Columns include Description, PR Number (full set from D6).

### S5.2 PO creation from approved RFX
### S5.3 Order detail + lifecycle (Held, Cancelled, Partially Ordered)

---

## Phase 6 — Inspection & Certification

### D7 (discovery) — Inspection forms
- Walk Pre- and Post-delivery inspection forms; Manpower Certification.
- Output: `docs/discovery/inspection.md`.

### S6.1 Pre-delivery inspection
### S6.2 Post-delivery inspection
### S6.3 Manpower Certification
### S6.4 Unit rate measurement (referenced on Home dashboard)

---

## Phase 7 — Supplier Management

### D8 (discovery) — Supplier flows
- Walk: Registration Request Status, Onboarding wizard, Blocking/Unblocking, SRM, SPM (external).
- Output: `docs/discovery/supplier.md`.

### S7.1 Supplier Registration Request Status
### S7.2 Supplier Onboarding wizard
### S7.3 Blocking / Unblocking + reason codes
### S7.4 Supplier Relationship Management
### S7.5 Supplier Performance Management (federated link / embed)

---

## Phase 8 — Master Data

### S8.1 Material master (list + create + edit)
### S8.2 Service master (list + create + edit)
### S8.3 Codelist admin (Urgency, Status, Request Type as editable enums)

---

## Phase 9 — Access Management

### S9.1 Access first (initial role assignment)
### S9.2 Access control (granular permission matrix)

---

## Phase 10 — Analytics

### S10.1 Embedded dashboard (Power BI replacement: Recharts/Tremor)
- KPIs: PR cycle time, RFQ TAT, supplier compliance, spend by category.

---

## Phase 11 — Federation & SSO

### S11.1 Federation registry
- Config-driven list of external sub-apps (SPM, ACPL CLAS, Power BI) with deep links + role gating.

### S11.2 SSO
- OIDC bridge so sub-apps don't re-prompt.

---

## Phase 12 — Procurement Copilot (Railway backend)

### S12.1 Migrate Python sources from antaryami-os (byte-exact, via local git).
### S12.2 Railway deploy + health checks.
### S12.3 Frontend → backend wiring (REST + MCP tool).
### S12.4 Copilot UX: side-panel chat with PR/RFQ context awareness.

---

## Execution rules per session

1. One PR per session; description links the corresponding S-id.
2. CI must remain green; Vercel preview must build.
3. Each session ships a short demo GIF or screenshot in the PR.
4. Discovery (Dx) PRs only add `docs/discovery/*.md` — no code.
5. After every 3 sessions, update `docs/PRD-v2.md` with corrections from reality.

## Suggested order (first 10 PRs)

S0.1 → S0.2 → S0.3 → S1.1 → S1.2 → S1.3 → S1.4 → S2.1 → S2.2 → D3.
