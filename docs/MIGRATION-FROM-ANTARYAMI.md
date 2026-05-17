# H3 — Migration audit from `antaryami-os`

Session: **H3 — Migration audit from antaryami-os**
Target: `ganeshgowri-ASA/Krayavikrayam`, branch `claude/audit-antaryami-procurement-Aih78`.
Mode: **read-only** against `antaryami-os`; no commits or PRs pushed there.

## 1. Scope

Per PRD v3 §17:

> Audit `antaryami-os` for any procurement-copilot code accidentally
> committed; cherry-pick into Krayavikrayam under `apps/copilot/` and
> `packages/rag/`. No redundant rewrites; replace only when
> copyright/license-clean.

This document is the inventory + plan. The actual cherry-pick is staged
as a skeleton (see §6) and finalised once an operator with access to
`antaryami-os` runs the checklist in §7.

## 2. Access status (blocker)

The session environment has **no access** to
`ganeshgowri-ASA/antaryami-os`:

| Channel | Result |
|---|---|
| `mcp__github__*` tools | Denied — session scope is `ganeshgowri-asa/krayavikrayam` only. |
| Public `github.com/ganeshgowri-ASA/antaryami-os` | HTTP 404. |
| `api.github.com/repos/ganeshgowri-ASA/antaryami-os` | HTTP 403. |
| `gh` CLI / `GITHUB_TOKEN` | Not present in the session. |

So the audit below documents **only the antaryami-os surface that is
already referenced from this repo**, plus a checklist for an operator
with credentials to complete the file-by-file inventory.

## 3. Known anchors into `antaryami-os`

These are pinned in Krayavikrayam today and form the canonical
references for the audit:

| Anchor | Source line | Notes |
|---|---|---|
| Repo | `ganeshgowri-ASA/antaryami-os` | apps/procurement-copilot/README.md |
| Path  | `apps/procurement-copilot/` | apps/procurement-copilot/README.md |
| Commit | `cc207c5` (squash-merged from PR #139) | apps/procurement-copilot/README.md |
| Tag   | `v0.1.0-procurement-copilot` | apps/procurement-copilot/README.md, app/procurement/page.tsx:81 |
| Deploy target | Railway (Vercel cannot run Python FastAPI) | apps/procurement-copilot/README.md, DEPLOY.md |
| Agents | Intake, Sourcing, Negotiation, Compliance, Award (5× LangGraph) | apps/procurement-copilot/README.md |
| Required env vars at the copilot service | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `REDIS_URL`, `BRIDGE_BASE_URL` | apps/procurement-copilot/README.md |

Per the existing README, this split is **intentional**: the Python
backend stays in `antaryami-os` because Vercel's Node runtime can't
serve FastAPI. So coupling to `antaryami-os` is not *per se* accidental
— what we need to find is procurement-copilot **frontend / shared**
pieces that landed in `antaryami-os` by mistake and should live in this
repo instead.

## 4. Krayavikrayam → antaryami-os coupling (audited locally)

`grep -r` over this repo for `antaryami`, `jnana-setu`,
`procurement-bridge`, `NEXT_PUBLIC_PROCUREMENT_API_URL`,
`BRIDGE_BASE_URL`, `NEXT_PUBLIC_PROCUREMENT_COPILOT_URL`:

| Location | Coupling | Verdict |
|---|---|---|
| `apps/procurement-copilot/README.md` | Reservation README — points to antaryami-os as backend source of truth | Intentional. Keep. |
| `app/procurement/page.tsx:21` | Reads `NEXT_PUBLIC_PROCUREMENT_API_URL` | Intentional API-boundary call. Keep. |
| `app/procurement/page.tsx:81` | Footer credits `Migrated from antaryami-os@cc207c5` | Intentional attribution. Keep. |
| `packages/procurement/src/api/client.ts:19,24` | Reads `NEXT_PUBLIC_PROCUREMENT_COPILOT_URL` | Intentional. **Env-var name drift** vs `page.tsx`. See §5. |
| `packages/procurement/package.json:9` & `package.json:25` | `@anahatasri/procurement-bridge` pinned to `jnana-setu` commit `e5f972a8` | Third-repo dependency, not antaryami-os. Out of scope for H3 — flag for separate audit. |
| `DEPLOY.md:14, 43-50` | Documents both the env var and the bridge SDK pin | Keep; possibly update env-var name to match (see §5). |
| `docs/PRD-*.md`, `docs/CLAUDE-SESSIONS*.md` | Mentions of antaryami-os | Intentional. Keep. |

**No accidentally-imported antaryami-os source files were found in
Krayavikrayam.** Imports are limited to env-var reads and the
third-repo SDK pin above.

## 5. Findings (this side of the boundary)

1. **Env-var name drift.** `app/procurement/page.tsx` reads
   `NEXT_PUBLIC_PROCUREMENT_API_URL`; `packages/procurement/src/api/client.ts`
   and `DEPLOY.md` reference `NEXT_PUBLIC_PROCUREMENT_COPILOT_URL`. One
   of the two callers will silently get an empty string in production.
   *Not fixed in this PR* — flagged for a follow-up surgical change so
   it doesn't get lost in this audit's diff.
2. **No `.env.example` entry** for either copilot URL. Add when the
   drift in (1) is reconciled.
3. **`@anahatasri/procurement-bridge` pin** points at a commit in a
   third repo (`jnana-setu`) without a `dist/` folder at that ref. Per
   `DEPLOY.md` this is type-resolution only — confirm before any
   runtime import lands.

## 6. Cherry-pick plan (target layout)

Two new package roots are created in this PR as **empty skeletons** so
later sessions / operators can drop in files without further
re-organising:

```
apps/copilot/            # Next.js copilot UI surface (chat side panel,
                         # slash actions). NOT the FastAPI backend
                         # (that stays in antaryami-os on Railway).
packages/rag/            # Retrieval-augmented generation primitives:
                         # embedders, chunkers, retriever clients,
                         # prompt scaffolds. Pure TS, server-or-edge.
```

Distinction from existing roots:

- `apps/procurement-copilot/` remains a **pointer-only** reservation
  README (do not delete — external docs link to it).
- `packages/procurement/` remains the **RFx Manager UI vertical**
  (RFQ list, vendor 360, offer diff, query thread) — unrelated to the
  copilot/RAG split.

## 7. Operator checklist — run this against `antaryami-os`

To be executed by someone with read access to `ganeshgowri-ASA/antaryami-os`:

```bash
git clone --depth=1 --branch v0.1.0-procurement-copilot \
  git@github.com:ganeshgowri-ASA/antaryami-os.git /tmp/antaryami-os
cd /tmp/antaryami-os

# 1. Confirm the anchor commit
git log -1 cc207c5 --format='%H %s'

# 2. Enumerate procurement-copilot tree (expected: FastAPI + 5 agents)
find apps/procurement-copilot -type f -not -path '*/node_modules/*' \
  -not -path '*/__pycache__/*' | sort > /tmp/h3-procurement-tree.txt

# 3. Check for procurement-copilot leakage OUTSIDE its directory
#    (these are the accidental commits H3 wants to find)
git grep -l -E \
  '(procurement[_-]?copilot|langgraph|RFQ|TBE|vendor360|offer.*diff)' \
  -- ':!apps/procurement-copilot' ':!docs' ':!*.md' | sort \
  > /tmp/h3-leakage.txt

# 4. Check for Krayavikrayam-specific names that leaked the other way
git grep -l -E \
  '(krayavikrayam|@krayavikrayam|jnana-setu|anahatasri)' \
  | sort > /tmp/h3-reverse-leakage.txt

# 5. License header check on every file in apps/procurement-copilot
for f in $(find apps/procurement-copilot -type f \
            \( -name '*.py' -o -name '*.ts' -o -name '*.tsx' \
               -o -name '*.js' -o -name '*.json' \)); do
  head -n 5 "$f" | grep -qE '(MIT|Apache|Copyright)' \
    || echo "missing-header: $f"
done > /tmp/h3-headers.txt
```

Then, for each path in `/tmp/h3-leakage.txt`:

| Decision | Criterion |
|---|---|
| **Reuse (cherry-pick)** | Pure copilot/RAG logic, MIT-compatible header, no antaryami-os-specific config | Copy into `apps/copilot/` or `packages/rag/` here with the attribution comment template in §8. |
| **Rewrite** | Mixed with antaryami-os concerns, missing license header, or > 6 months stale | Re-implement clean in `apps/copilot/` / `packages/rag/`. |
| **Leave in antaryami-os** | FastAPI backend itself, deployable Python service | Keep; rely on the existing API-boundary integration. |

Append the results back to this file under §9 once the operator runs the checklist.

## 8. Attribution header template

For any file copied into `apps/copilot/` or `packages/rag/` from
`antaryami-os`:

```ts
/**
 * Migrated from antaryami-os @ cc207c5 (v0.1.0-procurement-copilot).
 * Original path: apps/procurement-copilot/<...>
 * Upstream license: MIT (ganeshgowri-ASA/antaryami-os).
 */
```

Python equivalent:

```python
# Migrated from antaryami-os @ cc207c5 (v0.1.0-procurement-copilot).
# Original path: apps/procurement-copilot/<...>
# Upstream license: MIT (ganeshgowri-ASA/antaryami-os).
```

## 9. Inventory results

*Populated by operator running §7. Empty in this PR — access blocker.*

| Upstream path | Kind | License header | Decision | Destination |
|---|---|---|---|---|
| _(pending §7 run)_ | | | | |

## 10. Out of scope for H3

- Fixing the env-var name drift in §5.1.
- Auditing `jnana-setu` / `@anahatasri/procurement-bridge`.
- Any change to `apps/procurement-copilot/README.md` (the reservation
  pointer).
- Backend (FastAPI) code migration — that remains on Railway from
  `antaryami-os` by design.
