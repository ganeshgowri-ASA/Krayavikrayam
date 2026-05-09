# Krayavikrayam

Krayavikrayam (क्रयविक्रयम्) is a procurement platform covering the buy-sell lifecycle: purchase requests, RFQs, supplier negotiation, orders (POs), GRN, invoicing, and three-way match.

This repository (`ganeshgowri-ASA/Krayavikrayam`) is the single source of truth. All work is tracked as `KV-<TRACK><PARENT>.<CHILD>` sessions; see the index below.

## Documentation

- [Product Requirements (v3)](docs/PRD-v3.md) — current PRD; supersedes v2.
- [TBE Schema](docs/TBE-SCHEMA.md) — Technical/Bid Evaluation data model.
- [Claude Sessions (v3)](docs/CLAUDE-SESSIONS-v3.md) — session playbook and umbrella tracks.
- [Session Index](docs/SESSION-INDEX.md) — live list of bite-sized child sessions, IDs, and Definition of Done.

## Stack

- **Web**: Next.js 14 (App Router), TypeScript, Tailwind.
- **API**: Express + TypeScript + Prisma (schema only at this stage; no generate/migrate in postinstall or build).
- **Shared**: `packages/ui` (components), `packages/config` (eslint/tsconfig/tailwind presets).
- **Tooling**: pnpm workspaces, ESLint (flat), Prettier, Husky, lint-staged, commitlint, Vitest, Playwright.

## Getting started

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

See individual `apps/*` and `packages/*` READMEs for app-specific scripts.

## Deployment

- **Web (`apps/web`)**: deployed to **Vercel**. See [`DEPLOY.md`](DEPLOY.md) and [`vercel.json`](vercel.json).
- **API (`apps/api`)**: deployed to **Railway**. Prisma `generate`/`migrate` run as explicit deploy steps — never in `postinstall` or `build`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. Branches and PR titles follow the `KV-<id>` convention from the [Session Index](docs/SESSION-INDEX.md).

## License

[MIT](LICENSE)
