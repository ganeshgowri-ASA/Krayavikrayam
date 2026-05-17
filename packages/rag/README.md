# `@krayavikrayam/rag` — Retrieval-augmented generation primitives

Pure TypeScript primitives for the Procurement Copilot's retrieval
layer: document chunkers, embedder clients, retriever interfaces, and
prompt scaffolds. Server-or-edge runtime; no React, no DOM.

## Status

**Skeleton.** Files migrated from `antaryami-os@cc207c5` land here per
the cherry-pick plan in
[`docs/MIGRATION-FROM-ANTARYAMI.md`](../../docs/MIGRATION-FROM-ANTARYAMI.md)
§6. Each file copied in must carry the attribution header in §8 of
that document.

## Layout (planned)

```
packages/rag/
  README.md
  package.json
  src/
    index.ts            # Public exports
    chunk/              # Token / heading / table chunkers
    embed/              # OpenAI / Anthropic / local embedder clients
    retrieve/           # Vector store clients (pgvector, in-memory)
    prompt/             # Prompt scaffolds for /summarize, /compare-suppliers,
                        # /draft-rfq, /score-tbe, /risk-check
```

## Consumers

- `apps/copilot/` — UI surface for the copilot.
- Future: any module that wants RAG over its own corpus (PR detail,
  RFQ wizard, TBE editor).
