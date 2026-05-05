# Deployment

## Vercel environment variables

`vercel.json` references the secrets below. They must already exist in
the Vercel project (Vercel CLI: `vercel env add <name>`). `vercel.json`
itself cannot create secret values.

| Name                                     | Scope             | Required | Notes |
|------------------------------------------|-------------------|----------|-------|
| `DATABASE_URL`                           | preview, prod     | yes      | Postgres connection string for Prisma. |
| `RESEND_API_KEY`                         | preview, prod     | yes      | Outbound email via Resend. |
| `NEXT_PUBLIC_SENTRY_DSN`                 | preview, prod     | optional | Browser Sentry DSN. |
| `NEXT_PUBLIC_PROCUREMENT_COPILOT_URL`    | preview, prod     | optional | Base URL of the antaryami-os FastAPI procurement copilot. Empty falls back to in-process mocks in `packages/procurement/src/api/mock.ts`. |

The procurement var is referenced under both top-level `env` and
`build.env` in `vercel.json` so it is available at static-build time
for Next.js' `NEXT_PUBLIC_*` inlining.

```jsonc
// vercel.json (excerpt)
"build": {
  "env": {
    "NEXT_PUBLIC_PROCUREMENT_COPILOT_URL": "@next_public_procurement_copilot_url"
  }
},
"env": {
  "NEXT_PUBLIC_PROCUREMENT_COPILOT_URL": "@next_public_procurement_copilot_url"
}
```

### Adding the procurement copilot URL

```bash
# Production
vercel env add NEXT_PUBLIC_PROCUREMENT_COPILOT_URL production
# Preview
vercel env add NEXT_PUBLIC_PROCUREMENT_COPILOT_URL preview
```

## Procurement bridge SDK

`@anahatasri/procurement-bridge` is pinned via git+https in
`package.json` to the `jnana-setu` repository at commit
`e5f972a8dff3adb93149154e4f20aa4452f24a9a`. The package ships built
artifacts only via npm publish; on the git ref the `dist/` folder is
absent. The dependency is installed for type-resolution and downstream
wiring; runtime imports should be guarded until a tagged release with
`dist/` is published.

## CI scoping

GitHub Actions runs:

```bash
npx tsc -p tsconfig.procurement.json
npm run test:procurement
npm run build
```

Type-checking is scoped to `packages/procurement/**` and the
procurement route files. Repo-wide TS errors in `src/server/**` are
tracked separately as tech debt.

## Production deploy

Deploys are triggered by merges to `main`. Manual override:

```bash
vercel --prod
```

The procurement vertical lives at `/procurement` and `/dashboard/procurement`.
