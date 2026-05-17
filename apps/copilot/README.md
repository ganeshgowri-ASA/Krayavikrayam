# `apps/copilot` — Procurement Copilot UI surface

Next.js App Router surface for the Procurement Copilot: chat side
panel, slash actions on PR / RFQ / TBE / Order pages, and the thin
client that talks to the FastAPI backend.

This is **not** the FastAPI service itself. The backend stays in
`ganeshgowri-ASA/antaryami-os` (see
[`docs/MIGRATION-FROM-ANTARYAMI.md`](../../docs/MIGRATION-FROM-ANTARYAMI.md)
and `apps/procurement-copilot/README.md` for the rationale).

## Status

**Skeleton.** Files migrated from `antaryami-os@cc207c5` land here per
the cherry-pick plan in `docs/MIGRATION-FROM-ANTARYAMI.md` §6. Each
file copied in must carry the attribution header in §8 of that
document.

## Layout (planned)

```
apps/copilot/
  README.md
  app/                  # Route segment: /copilot, slash-action handlers
  components/           # ChatPanel, SlashMenu, MessageList
  lib/                  # Client SDK wrapping NEXT_PUBLIC_PROCUREMENT_COPILOT_URL
```

## Relationship to other roots

- `apps/procurement-copilot/` — pointer README only; do not put code there.
- `packages/procurement/` — RFx Manager UI vertical (unrelated).
- `packages/rag/` — retrieval primitives consumed from here.
