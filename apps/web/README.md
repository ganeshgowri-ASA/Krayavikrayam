# apps/web

Next.js 14 (App Router) frontend for Krayavikrayam.

> Scaffolded incrementally per the [session index](../../docs/SESSION-INDEX.md).
> The shared bootstrap (`next.config`, `tailwind.config`, root layout) lands with
> KV-A1.3; this directory currently hosts only the surface area added by KV-E1.5.

## KV-E1.5 — PO detail (read-only)

Route: `/orders/[poNo]`. Composed of six stacked sections matching the discovery
spec at [`docs/discovery/orders-detail.md`](../../docs/discovery/orders-detail.md):

1. PO header
2. Lines
3. GRN list
4. Invoices
5. 3-way match summary
6. Payment status

The page is a server component that loads data via `lib/api.ts#getPurchaseOrder`.
On the server it reads from the local fixture; in the browser, MSW intercepts
`GET /api/orders/:poNo` (handlers in `mocks/handlers.ts`). MSW worker setup lives
in `mocks/browser.ts` and is wired up to the app shell in KV-E1.6.

No mutations happen on this page. All write actions (post GRN, book invoice,
trigger payment, edit header) are out of scope until later milestones.

## Layout

```
apps/web/
├── app/orders/[poNo]/
│   ├── page.tsx                # server component, composes sections
│   └── _components/
│       ├── Section.tsx         # shared section/stat shell
│       ├── StatusBadge.tsx     # tone-mapped enum badges
│       ├── POHeader.tsx
│       ├── POLines.tsx
│       ├── GRNList.tsx
│       ├── InvoiceList.tsx
│       ├── ThreeWayMatch.tsx
│       └── PaymentStatus.tsx
├── lib/
│   ├── types.ts                # PO/GRN/Invoice/Match/Payment domain types
│   ├── format.ts               # money/date/number helpers
│   └── api.ts                  # getPurchaseOrder loader
└── mocks/
    ├── po-data.ts              # in-memory fixtures
    ├── handlers.ts             # MSW v2 handlers
    └── browser.ts              # MSW browser worker
```

## Fixture PO numbers

`PO-2025-00042` (Partially Received, with GRN + invoices + payment in flight),
`PO-2025-00043` (Issued, no GRN yet). Anything else returns 404.
