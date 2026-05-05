# Procurement Copilot (Backend)

This directory is reserved for the **Procurement Copilot FastAPI backend** (5 LangGraph agents:
Intake, Sourcing, Negotiation, Compliance, Award).

## Source of truth

The deployable backend code currently lives at:

- Repo: `ganeshgowri-ASA/antaryami-os`
- Path: `apps/procurement-copilot/`
- Pinned commit: `cc207c5` (squash-merged from PR #139)
- Release tag: `v0.1.0-procurement-copilot`

This is intentional: Vercel cannot run Python, so the FastAPI service is deployed to **Railway**
(see antaryami-os `DEPLOY.md`). Keeping the deployable code in one place avoids redundancy.

## Frontend integration

The Krayavikrayam Next.js app exposes a `/procurement` page (`app/procurement/page.tsx`)
which calls the FastAPI backend via the env var:

```
NEXT_PUBLIC_PROCUREMENT_API_URL=https://<railway-app>.up.railway.app
```

Set this in Vercel project env vars once Railway is deployed.

## Future integration paths

- **API**: REST/JSON over HTTPS (current; `NEXT_PUBLIC_PROCUREMENT_API_URL`)
- **MCP**: Expose agents as Model Context Protocol tools for Claude/Cursor/Copilot consumers
- **SSH**: Tunneled access for internal admin/debug flows

## Deploy command (Railway)

```bash
railway login
railway link
railway up --service procurement-copilot
# Required env vars:
#   OPENAI_API_KEY
#   ANTHROPIC_API_KEY
#   REDIS_URL
#   BRIDGE_BASE_URL
```

## Why no Python code in this repo?

Vercel's Node runtime cannot serve Python FastAPI. Duplicating 44 files here would create a
second source of truth that drifts from antaryami-os. The migration strategy is
**API-boundary, not code-copy**: frontend here, backend there, contract via env var.
