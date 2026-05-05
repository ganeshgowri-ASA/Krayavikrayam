# `@procurement` — RFx Manager vertical

Self-contained Next.js App Router module providing the RFQ list, RFQ
card, Vendor 360, Offer Version diff, and Query thread experiences.

- Next.js 15 App Router compatible (App Router server/client split)
- shadcn/ui + Tailwind tokens (consumes the host app's UI primitives)
- TanStack Query for data, TanStack Table + Virtual for the list
- TypeScript strict
- Vitest tests

## Usage

```tsx
// app/dashboard/procurement/page.tsx
import { RfqListPage } from "@procurement/index";

export default function Page() {
  return <RfqListPage />;
}
```

## Run tests

```
npm run test:procurement
```

See [`docs/architecture.md`](./docs/architecture.md) for the full
design.
