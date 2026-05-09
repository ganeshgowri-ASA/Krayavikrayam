# Deployment

This document describes how `apps/web` (Vercel) and `apps/api` (Railway) are deployed.

## Topology

| Service     | Platform | Config         | Root         |
|-------------|----------|----------------|--------------|
| `apps/web`  | Vercel   | `vercel.json`  | `apps/web`   |
| `apps/api`  | Railway  | `railway.toml` | `apps/api`   |

- Vercel hosts the Next.js front-end. Framework is `nextjs`; root is `apps/web`.
- Railway hosts the API. Build: `pnpm --filter api build`. Start: `node dist/server.js`.

> Deploys are triggered by platform integrations on merge to `main`. Do not run
> `vercel --prod` or `railway up` manually unless you intend a hotfix.

## Required environment variables

Set these in each platform's project settings before the first deploy.

### Shared

| Name                | Required | Where  | Notes                                                   |
|---------------------|----------|--------|---------------------------------------------------------|
| `DATABASE_URL`      | yes      | both   | Postgres connection string (Prisma).                    |
| `REDIS_URL`         | yes      | both   | Redis connection string (queues, rate-limit, cache).    |
| `OPENAI_API_KEY`    | yes      | api    | OpenAI key for AI features.                             |
| `NODE_ENV`          | yes      | both   | `production` on prod, `preview` on Vercel preview.      |

### `apps/web` (Vercel)

| Name                          | Required | Notes                                                              |
|-------------------------------|----------|--------------------------------------------------------------------|
| `NEXTAUTH_SECRET`             | yes      | Random 32+ byte secret for NextAuth session signing.               |
| `NEXTAUTH_URL`                | yes      | Public URL of the web app (e.g. `https://app.example.com`).        |
| `NEXT_PUBLIC_API_BASE_URL`    | yes      | Public URL of the Railway API (e.g. `https://api.example.com`).    |
| `NEXT_PUBLIC_SENTRY_DSN`      | optional | Browser Sentry DSN.                                                |
| `SENTRY_AUTH_TOKEN`           | optional | Required only if uploading source maps at build time.              |
| `RESEND_API_KEY`              | optional | Outbound email via Resend (only if used by web routes).            |

### `apps/api` (Railway)

| Name                  | Required | Notes                                                       |
|-----------------------|----------|-------------------------------------------------------------|
| `PORT`                | yes      | Provided by Railway; the server must bind `process.env.PORT`. |
| `NEXTAUTH_SECRET`     | yes      | Must match the value set on Vercel (shared session signing).  |
| `WEB_ORIGIN`          | yes      | CORS allow-list origin, e.g. `https://app.example.com`.     |
| `OPENAI_API_KEY`      | yes      | OpenAI key for AI features.                                 |
| `SENTRY_DSN`          | optional | Server Sentry DSN.                                          |
| `RESEND_API_KEY`      | optional | Outbound email via Resend.                                  |

## Vercel notes

- `vercel.json` sets `framework: "nextjs"` and `rootDirectory: "apps/web"`. Do
  not override the build command; let Vercel auto-detect Next.js.
- Do **not** add `prisma generate` to the build command. Prisma's client is
  generated as part of the package's own build step.
- Add env vars via `vercel env add <NAME> production|preview|development` or
  the dashboard.

## Railway notes

- `railway.toml` sets the build to `pnpm --filter api build` and the start to
  `node dist/server.js`. The service root is `apps/api`.
- Provision Postgres and Redis as separate Railway services and reference them
  via `${{Postgres.DATABASE_URL}}` / `${{Redis.REDIS_URL}}` in the API
  service's variables.

## First-time setup checklist

1. Create the Vercel project, link to the repo, set root to `apps/web`.
2. Create the Railway project, link to the repo, set root to `apps/api`.
3. Populate the env vars above in both platforms.
4. Merge to `main`; platform integrations handle the deploy.
