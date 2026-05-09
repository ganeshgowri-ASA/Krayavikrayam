# @krayavikrayam/web

Next.js 14 (App Router) buyer portal shell for Krayavikrayam.

Implements the buyer portal IA documented in `docs/PRD-v3.md` §3:

- Left nav (collapsible, chevron toggle): Home, Purchase requests, RFQs, Material inspection, Service certification, Orders, Supplier management, Workforce management, Access management, Analytics, Master data.
- Top bar: Krayavikrayam brand, help icon, notifications bell with unread badge, user chip with name + role.
- Each nav item has a scaffolded route rendering a placeholder page.

## Develop

```bash
cd apps/web
npm install
npm run dev
```

The dev server listens on http://localhost:3001.

## Accessibility

- Sidebar toggle exposes `aria-expanded` / `aria-controls`.
- Active nav item carries `aria-current="page"`.
- Top-bar icon buttons have `aria-label`s; the notifications label includes the unread count.
- "Skip to main content" link is the first focusable element.
- All interactive controls are keyboard reachable; focus-visible ring is enforced globally.
