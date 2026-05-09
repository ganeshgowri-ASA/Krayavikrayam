# Claude Code Sessions v3 — Parallelizable Track Map

Repo: `ganeshgowri-ASA/Krayavikrayam`. Frontend → Vercel. Backend → Railway.

Each session below is a launchable Claude Code prompt. Sessions in the same Track must run sequentially; sessions in different Tracks can run in parallel.

## Track A — Foundations (sequential)

### A1. Repo skeleton
PROMPT:
"In repo `ganeshgowri-ASA/Krayavikrayam`, create a pnpm monorepo: `apps/web` (Next.js 14 App Router, TS), `apps/api` (Node/Express + Prisma), `packages/ui`, `packages/config`. Add `.env.example`, ESLint, Prettier, Husky. Do NOT run any Prisma command in postinstall or build. Open as PR."

### A2. CI
PROMPT:
"Add GitHub Actions: lint, typecheck, test, build for `apps/web` and `apps/api`. Cache pnpm. Open as PR."

### A3. Vercel + Railway wiring
PROMPT:
"Document and configure deploy: `apps/web` to Vercel; `apps/api` to Railway. Add `vercel.json`, `railway.toml`, env var lists. Open as PR."

## Track B — Buyer Shell (sequential, depends on A1)

### B1. App shell
PROMPT:
"Implement the buyer shell in `apps/web`: left nav (Home, Purchase requests, RFQs, Material inspection, Service certification, Orders, Supplier mgmt, Workforce, Access mgmt, Analytics, Master data), top bar (help, notifications, user chip), collapsible sidebar. Match ProcureNXT IA from PRD-v3 §3."

### B2. Home dashboard
PROMPT:
"Build Home: Action-required cards (PR, RFQ, Pre-delivery, Post-delivery) with counts and deeplinks; Recent notifications panel."

## Track C — Purchase Requests (depends on B1)

### C1. PR list
PROMPT:
"Build `/purchase-requests` with tabs Draft / Pending for approval / Under rework / Need clarification / All; search and filters; Create CTA."

### C2. PR detail (discovery PR)
PROMPT:
"Discovery PR: capture PR detail wireframe (line items, attachments, approval timeline, comments) under `docs/discovery/pr-detail.md`. Then implement read-only detail page."

### C3. PR create wizard
PROMPT:
"Implement Create new request wizard: scope, line items (Master Data items), attachments, approvers, submit."

## Track D — RFQ + TBE (depends on B1)

### D1. RFQ list + wizard discovery
PROMPT:
"Build RFQ list. Discovery PR for RFQ wizard under `docs/discovery/rfq-wizard.md`."

### D2. TBE schema + Prisma
PROMPT:
"Implement Prisma models per `docs/TBE-SCHEMA.md` (TBE, TBESection, TBECriterion, TBESupplier, TBEResponse, TBEScore). Migrations gated; seeds for TCPS10, PID-20-Ch, 4-in-1, UV2, Equipment tracker."

### D3. TBE editor UI
PROMPT:
"Spreadsheet-like TBE editor: rows=criteria grouped by section, cols=suppliers, sticky headers, inline compliance/deviation/remarks/attachment, right-rail score panel."

### D4. XLSX ingestor
PROMPT:
"Add `scripts/ingest-tbe-xlsx.ts` to parse the 5 reference XLSX files into JSON seed templates."

## Track E — Orders & Inspection (depends on B1)

### E1. Orders list + detail discovery
PROMPT:
"Implement PO list. Discovery PR for PO detail / GRN / Invoice / 3-way match under `docs/discovery/orders-detail.md`."

### E2. Material inspection
PROMPT:
"Pre/Post-delivery inspection checklists with photo upload, pass/fail, inspector signature."

### E3. Service certification
PROMPT:
"Service certification flow tied to workforce SLAs."

## Track F — Supplier / Workforce / Access (depends on A1)

### F1. Supplier onboarding
PROMPT:
"Supplier onboarding wizard, KYC docs, performance score, blacklist toggle."

### F2. Workforce
PROMPT:
"Manpower roster, certs expiry, deployment per service order."

### F3. Access management
PROMPT:
"Roles, permission matrix, delegation, audit log."

## Track G — Master Data & Analytics (depends on A1)

### G1. Master data CRUD
PROMPT:
"CRUD for Items, UOM, HSN, Categories, Cost centers, Plants, Tax codes, Currencies, Approval matrices."

### G2. Analytics
PROMPT:
"Dashboards: spend by category/supplier, cycle times, OTIF, TBE turnaround, copilot usage."

## Track H — Procurement Copilot (depends on A1, can run in parallel with B–G)

### H1. Copilot service skeleton
PROMPT:
"In `apps/api`, add `/copilot` routes; OpenAI-compatible client; deploy to Railway."

### H2. RAG ingest
PROMPT:
"`packages/rag`: ingest PRs, RFQs, TBEs, Orders, Supplier docs into pgvector."

### H3. Migration audit
PROMPT:
"Audit `antaryami-os` for any procurement-copilot code accidentally committed. Cherry-pick into `apps/copilot/` and `packages/rag/` with attribution; do NOT duplicate code."

### H4. Slash commands UI
PROMPT:
"Chat side panel with slash commands: /summarize, /compare-suppliers, /draft-rfq, /score-tbe, /risk-check."

## Parallelization Matrix
- After A1+A2+A3 land: start B1.
- After B1 lands: start C, D, E, F, G, H tracks IN PARALLEL.
- Within each track, sessions are sequential.
- D4 (XLSX ingestor) and H3 (migration audit) can be run by separate agents immediately after A1.

## Definition of Done (per session)
- One PR, scoped to the prompt.
- Lint/typecheck/test green in CI.
- Vercel preview (for `apps/web` changes) loads without runtime errors.
- Railway deploy (for `apps/api` changes) green; no Prisma postinstall/build coupling.
- Docs updated if behavior changed.
