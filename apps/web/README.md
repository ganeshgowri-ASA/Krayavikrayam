# @krayavikrayam/web-e2e

Playwright + axe-core smoke tests for the Krayavikrayam web app (KV-C1.6).

## Run locally

```bash
# from repo root, install root deps once
npm install

# install Playwright browsers (one-time)
npm --prefix apps/web run test:install

# run tests (auto-starts `next dev` from repo root)
npm --prefix apps/web run test:e2e
```

The Playwright config boots the Next.js dev server via `npm run dev` from the repo
root and points the suite at `http://127.0.0.1:3000` by default. Override with
`PLAYWRIGHT_BASE_URL=...` to test against an already-running deployment.

## What is covered

`e2e/purchase-requests.spec.ts`:

1. `/purchase-requests` renders the header, tablist and data table.
2. Switching to the "Pending for approval" tab updates `?tab=pending` and the
   visible rows reflect that status.
3. Typing in **Search by** debounces and updates `?q=` in the URL, then filters
   the table rows.
4. axe-core scan on the page surface — the suite fails on any
   `serious` or `critical` accessibility violations.
