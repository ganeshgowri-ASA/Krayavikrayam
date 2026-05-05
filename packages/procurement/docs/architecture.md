# Procurement Vertical — Architecture

## Goal

A self-contained module that delivers the **RFx Manager** experience:
RFQ list, RFQ card, Vendor 360, Offer version diff, and inline Query
threads with @mentions. The package is consumed by the host Next.js app
at `app/dashboard/procurement` but has no inbound dependencies on the
rest of the application beyond the shared shadcn/ui primitives.

## Module layout

```
packages/procurement/
├── docs/architecture.md          ← you are here
├── src/
│   ├── types.ts                  ← Domain model (Rfq, Vendor, OfferVersion, QueryThread, …)
│   ├── api/
│   │   ├── client.ts             ← TanStack Query hooks + queryKeys + filter helpers
│   │   └── mock.ts               ← Deterministic in-memory fixtures
│   ├── components/
│   │   ├── status-badge.tsx              ← Color-coded RFQ status pill
│   │   ├── sla-countdown.tsx             ← Live SLA timer (breached / warning / ok)
│   │   ├── value-chip.tsx                ← Currency-formatted value pill
│   │   ├── collaborator-count-badge.tsx  ← Tooltip-listed collaborator count
│   │   ├── rfq-card.tsx                  ← Composes the four chips above
│   │   ├── drawer.tsx                    ← Lightweight side/bottom drawer primitive
│   │   ├── vendor-360-drawer.tsx         ← Right-side vendor profile
│   │   ├── offer-version-diff-modal.tsx  ← Bottom drawer with v→v field diff
│   │   ├── query-thread-drawer.tsx       ← Right-side thread + @mention composer
│   │   └── rfq-list/
│   │       ├── rfq-list-page.tsx ← Page composition: filters + saved views + table
│   │       ├── rfq-table.tsx     ← TanStack Table + TanStack Virtual
│   │       ├── faceted-filter.tsx
│   │       └── saved-views.tsx
│   ├── hooks/use-mentions.ts     ← Pure mention parser + suggestion state
│   ├── store/saved-views.ts      ← zustand + persist (localStorage)
│   ├── lib/utils.ts              ← formatMoney, timeRemaining, status maps
│   └── index.ts                  ← Public barrel
└── tests/
    ├── utils.test.ts
    ├── mentions.test.ts
    ├── rfq-card.test.tsx
    ├── sla-countdown.test.tsx
    └── saved-views.test.ts
```

`@procurement/*` resolves to `packages/procurement/src/*` via both
`tsconfig.json` paths and `vitest.config.ts` aliases. The package does
**not** publish a `package.json` of its own; it lives inside the host
app's TypeScript program.

## Data flow

```
┌──────────────────┐          ┌───────────────────────┐
│ RfqListPage      │── reads ─►│ useRfqs (TanStack Q) │
│ (state: filters) │          └───────────┬───────────┘
│                  │                      │
│   ┌──────────────┼──────────────────────┘
│   ▼              ▼
│ FacetedFilter  RfqTable (TanStack Table + Virtual)
│ SavedViewsBar     │
│                  ▼ row click
│           Vendor360Drawer ── useVendor
│           OfferVersionDiffModal ── useOfferVersions
│           QueryThreadDrawer ── useQueryThreads + useMentions
└────────────────────────────────────────────────────
```

All data access goes through `src/api/client.ts`. The mock layer is
swappable: replacing `fetchRfqs` etc. with real fetches (or tRPC calls)
leaves the React tree untouched. Query keys are namespaced under
`["procurement", …]` so cache invalidation stays scoped.

## Key design decisions

- **Virtualization**: `@tanstack/react-virtual` over the table body
  yields O(visible-rows) DOM regardless of result size. We use a single
  scroll container and synthetic top/bottom padding rows to preserve
  scroll height.
- **Filters as a single object**: `RfqFilters` is the shape stored in
  saved views, threaded through query keys, and used by the in-memory
  `applyFilters`. One source of truth → easy URL-syncing in the future.
- **Saved views in zustand + persist**: keeps the bar reactive without
  pulling in a server round-trip. Default views ship with the store.
- **Drawer primitive in-package**: the host project's `dialog.tsx` is
  centered-modal only. Rather than upgrade it for the whole app, we
  ship a focused side/bottom drawer here.
- **@mentions are pure**: `extractMentions(body, users)` is a plain
  function, easy to test and reuse server-side for notification fan-out.
- **SLA states are tri-valued**: `breached | warning (<24h) | ok`. The
  same helper drives both the chip color and the table's sort.

## Testing strategy

- **Unit**: pure helpers (`formatMoney`, `timeRemaining`, `applyFilters`,
  `extractMentions`) + the saved-views store.
- **Component**: `RfqCard` and `SlaCountdown` rendered with Testing
  Library + happy-dom. Stable `data-testid` hooks (`rfq-status-badge`,
  `value-chip`, `collaborator-count`, `sla-countdown`, `rfq-card`,
  `rfq-table`) keep selectors decoupled from copy.
- Run with `npm run test:procurement`.

## Extending

- **Replace mocks**: swap `fetchRfqs` etc. in `src/api/client.ts` with
  tRPC or REST calls. Query keys and component signatures are stable.
- **Add a column**: extend `columns` in `rfq-table.tsx`; sorting hooks
  into `getSortedRowModel`.
- **New facet**: add a key on `RfqFilters`, a branch in `applyFilters`,
  and a `<FacetedFilter />` instance in `rfq-list-page.tsx`.
- **Server-side filtering**: switch `useRfqs` to send `filters` to the
  server; the client-side `applyFilters` becomes a fallback for offline.
