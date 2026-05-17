# @krayavikrayam/web

Next.js 14 (App Router) buyer portal shell for Krayavikrayam.

Implements the buyer portal IA documented in `docs/PRD-v3.md` §3:

- Left nav (collapsible, chevron toggle, state persisted to `localStorage`): Home, Purchase requests, RFQs, Material inspection, Service certification, Orders, Supplier management, Workforce management, Access management, Analytics, Master data.
- Top bar: Krayavikrayam brand, theme toggle, help icon, notifications bell with unread badge, user chip with name + role.
- Each nav item has a scaffolded route rendering a placeholder page.
- `(buyer)` route group wraps the shell; `/login` lives outside the group.
- Auth guard via `middleware.ts` redirects unauthenticated requests to `/login`; bypass for local dev with `NEXT_PUBLIC_AUTH_BYPASS=1`.
- Theming: CSS variable tokens, `dark` class on `<html>`, persisted to `localStorage`, no-flash inline script in `<head>`.

## Develop

```bash
cd apps/web
npm install
NEXT_PUBLIC_AUTH_BYPASS=1 npm run dev
```

The dev server listens on http://localhost:3001.

## Scripts

- `npm run dev` — Next dev server on port 3001.
- `npm run build` — Production build.
- `npm run typecheck` — `tsc --noEmit`.
- `npm test` — Vitest unit tests (jsdom + Testing Library).

## Accessibility

- Sidebar toggle exposes `aria-expanded` / `aria-controls`.
- Active nav item carries `aria-current="page"`.
- Top-bar icon buttons have `aria-label`s; the notifications label includes the unread count, and the theme toggle exposes `aria-pressed`.
- "Skip to main content" link is the first focusable element.
- All interactive controls are keyboard reachable; focus-visible ring is enforced globally.

## Structure

```
apps/web
├── app
│   ├── (buyer)               # authenticated shell route group
│   │   ├── layout.tsx        # sidebar + topbar, redirects to /login if no user
│   │   ├── page.tsx          # Home
│   │   └── <module>/page.tsx # one per nav item
│   ├── login/page.tsx        # public
│   ├── globals.css           # tailwind + token CSS variables
│   └── layout.tsx            # html/body + ThemeProvider + no-flash script
├── components                # sidebar, topbar, placeholder, theme provider/toggle
├── lib                       # nav config, auth stub
├── middleware.ts             # auth guard
└── tests                     # vitest + RTL
```
