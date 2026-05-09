# @krayavikrayam/api

Express + TypeScript API service for Krayavikrayam.

## Scripts

- `pnpm dev` — start the dev server with hot reload (tsx watch)
- `pnpm build` — compile TypeScript to `dist/`
- `pnpm start` — run the compiled server
- `pnpm db:generate` — manually generate the Prisma client (not run automatically)

## Routes

- `GET /health` → `{ "ok": true }`

## Notes

`prisma generate` is intentionally **not** wired into `postinstall` or `build`.
Run `pnpm db:generate` explicitly when the schema changes.
