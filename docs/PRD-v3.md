# Krayavikrayam — PRD v3

Supersedes PRD-v2 by adding: (a) canonical TBE schema (see TBE-SCHEMA.md), (b) deeper ProcureNXT findings, (c) parallelizable Claude Code session map (see CLAUDE-SESSIONS.md and CLAUDE-SESSIONS-v3.md).

## 1. Vision
Krayavikrayam is an open-source, ProcureNXT-aligned procurement suite with an AI Procurement Copilot. Frontend on Vercel; backend on Railway; repo `ganeshgowri-ASA/Krayavikrayam`.

## 2. Scope (v3)
- Buyer portal shell (left nav, top bar, action-required home).
- Modules: Purchase Requests, RFQs + TBE, Orders + GRN/Invoice, Material Inspection, Service Certification, Supplier Management, Workforce, Access Management, Analytics, Master Data.
- Procurement Copilot: chat side panel + slash actions on PR/RFQ/TBE/Order pages.

## 3. Information Architecture (verified live)
Left nav, in order: Home, Purchase requests, RFQs, Material inspection, Service certification, Orders, Supplier management, Workforce management, Access management, Analytics, Master data. Some modules redirect to federated portals; we will replicate native screens in Krayavikrayam.

## 4. Home Dashboard
- "Action required" cards: Purchase Requests, RFQs, Pre-delivery inspection, Post-delivery inspection, etc., each showing count + deeplink.
- "Recent notifications" panel.
- Top bar: help, notifications bell, user chip with role.

## 5. Purchase Requests
- Tabs: Draft, Pending for approval, Under rework, Need clarification, All.
- Search by + filters; Create new request CTA.
- PR detail (discovery PR): line items, attachments, approval timeline, comments.

## 6. RFQs + TBE
- RFQ wizard (discovery PR): scope, items, suppliers, timeline, T&C, publish.
- TBE per RFQ using canonical schema (see TBE-SCHEMA.md). Templates for TCPS10, PID-20-Ch, 4-in-1, UV2; tracker template for Equipment.

## 7. Orders
- PO list, PO detail, GRN, Invoice/3-way match, Payment status (discovery PR for forms).

## 8. Inspection & Certification
- Material inspection: pre-delivery, post-delivery checklists; pass/fail with photos.
- Service certification: workforce-linked SLAs; certification trail.

## 9. Supplier Management
- Onboarding wizard; KYC docs; performance score; blacklist/whitelist; categories.

## 10. Workforce Management
- Manpower roster, certifications expiry, deployment per service order.

## 11. Access Management
- Roles (Buyer, Approver, Inspector, Supplier, Admin), permissions matrix, delegation, audit log.

## 12. Analytics
- Spend by category/supplier, cycle times, OTIF, TBE turnaround, copilot usage.

## 13. Master Data
- Items, UOM, HSN, Categories, Cost centers, Plants, Tax codes, Currencies, Approval matrices.

## 14. Procurement Copilot (AI)
- RAG over PRs, RFQs, TBEs, Orders, Supplier docs.
- Slash commands: /summarize, /compare-suppliers, /draft-rfq, /score-tbe, /risk-check.
- Backend service on Railway; frontend chat panel served from Vercel.

## 15. Non-Functional
- Auth: SSO + email/password fallback. RBAC enforced server-side.
- Audit: append-only log per entity.
- Performance: list pages < 1.5s p75; TBE editor handles 200 criteria × 8 suppliers smoothly.
- Reliability: Prisma migrations gated; no `DATABASE_URL` work in postinstall.

## 16. Architecture
- Next.js (App Router) on Vercel for the buyer shell.
- Module microsites federated via Module Federation or route-level isolation.
- Node/Express (or Next route handlers) + Prisma + Postgres on Railway.
- Object storage for attachments (S3-compatible).

## 17. Migration & Reuse
- Audit `antaryami-os` for any procurement-copilot code accidentally committed; cherry-pick into Krayavikrayam under `apps/copilot/` and `packages/rag/`.
- No redundant rewrites; replace only when copyright/license-clean.

## 18. Coverage Disclosure
Verified live at list level: Home, Purchase Requests, RFQs, Orders, Material Inspection, Service Certification entry points, Master data top-level. Federated/redirected: Supplier Mgmt, Workforce, Access Mgmt, Analytics. Discovery PRs are required for: PR detail, RFQ wizard, Orders detail/GRN/Invoice, Inspection forms, Manpower Cert, Supplier onboarding, Master Data CRUD.

## 19. Acceptance for v3
- TBE-SCHEMA.md merged.
- CLAUDE-SESSIONS-v3.md merged with parallelizable tracks.
- First three sessions (Foundations, Shell, PR list) opened as draft PRs.
