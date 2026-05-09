# Krayavikrayam — Session Index (traceable)

Repo: `ganeshgowri-ASA/Krayavikrayam`. All sessions live here. None target `antaryami-os` (read-only audit only via H3-*).

ID format: `KV-<TRACK><PARENT>.<CHILD>` — e.g., `KV-A1.2` is child #2 of A1.
PR title MUST start with the ID, e.g., `KV-A1.2: Tooling configs (eslint/prettier/husky)`.
Branch name: `kv/<id-lowercased>` — e.g., `kv/a1-2-tooling`.

## Wave 1 — Bite-sized child sessions (launching now in parallel)

### Track A1 — Monorepo skeleton (parent KV-A1)
- KV-A1.1 — Workspace bootstrap: pnpm-workspace.yaml, root package.json with workspaces+scripts (lint/typecheck/build/test), .gitignore, .nvmrc.
- KV-A1.2 — Tooling: ESLint flat config, Prettier, Husky pre-commit, lint-staged, commitlint.
- KV-A1.3 — apps/web scaffold: Next.js 14 App Router + TS + Tailwind, hello page, no Prisma calls anywhere.
- KV-A1.4 — apps/api scaffold: Express + TS + Prisma schema stub (no generate in postinstall/build), /health route.
- KV-A1.5 — packages/ui + packages/config: shared Button/Card and shared eslint/tsconfig/tailwind presets.
- KV-A1.6 — Root README + CONTRIBUTING pointing to docs/PRD-v3.md, TBE-SCHEMA.md, CLAUDE-SESSIONS-v3.md, and this index.

### Track C1 — Purchase Requests list (parent KV-C1, depends on KV-A1.3)
- KV-C1.1 — Route + page shell at /purchase-requests with header and Create CTA.
- KV-C1.2 — Tabs: Draft / Pending for approval / Under rework / Need clarification / All — URL-synced via query param.
- KV-C1.3 — Filter bar: Search by, status, requester, plant, date range; debounced.
- KV-C1.4 — Data table: id, title, requester, plant, amount, status, updatedAt; pagination + empty state.
- KV-C1.5 — Mock API + MSW handlers for PR list (until apps/api lands real endpoints).
- KV-C1.6 — a11y + responsive + Playwright smoke test for tabs and filters.

### Track D1 — RFQ list + wizard discovery (parent KV-D1, depends on KV-A1.3)
- KV-D1.1 — Route + page shell at /rfqs with Create RFQ CTA.
- KV-D1.2 — RFQ list table: rfqNo, title, category, suppliersCount, status, deadline.
- KV-D1.3 — Filters: status (Draft/Open/Closed/Awarded), category, deadline range.
- KV-D1.4 — Discovery doc docs/discovery/rfq-wizard.md: steps Scope → Items → Suppliers → Timeline → T&C → Publish; field-level spec.
- KV-D1.5 — Wizard skeleton (read-only stubs) wired to the discovery spec; no submit yet.
- KV-D1.6 — Mock API + MSW handlers for RFQ list + draft RFQ.

### Track E1 — Orders list + detail discovery (parent KV-E1, depends on KV-A1.3)
- KV-E1.1 — Route + page shell at /orders with KPIs (open POs, GRN pending, invoices pending).
- KV-E1.2 — PO list table: poNo, supplier, value, status, deliveryDate.
- KV-E1.3 — Filters: status (Draft/Issued/Partially Received/Closed/Cancelled), supplier, plant, date range.
- KV-E1.4 — Discovery doc docs/discovery/orders-detail.md: PO header, lines, GRN, Invoice, 3-way match, payment status; field-level spec.
- KV-E1.5 — PO detail read-only page wired to the discovery spec (no mutations).
- KV-E1.6 — Mock API + MSW handlers for PO list + detail.

## Definition of Done (every child)
- Branch `kv/<id>`; PR title starts with the ID.
- Lint + typecheck + tests + build green in CI.
- No Prisma generate/migrate in postinstall or build.
- No changes outside the child's stated surface area.
- Updates this index if scope shifts.

## Status (live)
| ID | Title | State |
|---|---|---|
| KV-A1.1..6 | Monorepo skeleton (split) | launching |
| KV-C1.1..6 | PR list (split) | launching |
| KV-D1.1..6 | RFQ list + wizard discovery (split) | launching |
| KV-E1.1..6 | Orders list + detail discovery (split) | launching |

Earlier coarse parents A1/A2/A3/B1/D2/D4/H3 from CLAUDE-SESSIONS-v3.md remain valid as umbrellas; if a parent session has already produced a PR, the child sessions above will rebase or pick up the remaining surface area only.
