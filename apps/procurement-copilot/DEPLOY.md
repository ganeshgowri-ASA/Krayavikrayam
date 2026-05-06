# Deploy — Procurement Copilot

This document covers deployment of the FastAPI procurement copilot service
(`apps/procurement-copilot/`) to **Railway**. The service is a self-contained
Python 3.11 app with a Dockerfile; it has no database dependencies.

## Required environment variables

Set these in Railway **Variables** (or via `railway variables --set`):

| Variable | Required | Default | Notes |
| --------------------------------- | :------: | ------------- | ----------------------------------------------------------- |
| `PROCUREMENT_LLM_PROVIDER` | ✓ | `fake` | `openai` for production, `fake` for staging / smoke tests. |
| `PROCUREMENT_LLM_MODEL` | | `gpt-4o-mini` | Any OpenAI chat model. |
| `PROCUREMENT_LLM_TEMPERATURE` | | `0.0` | Keep low for reproducibility. |
| `OPENAI_API_KEY` | if `PROCUREMENT_LLM_PROVIDER=openai` | — | Standard OpenAI key. |
| `PROCUREMENT_HOST` | | `0.0.0.0` | Leave default on Railway. |
| `PROCUREMENT_PORT` | | `8088` | Railway sets `PORT`; map it (see below). |
| `PROCUREMENT_PII_REDACTION` | | `true` | Disable only for non-prod debugging. |
| `PROCUREMENT_HALLUCINATION_GUARD` | | `true` | Disable only for non-prod debugging. |
| `LOG_LEVEL` | | `INFO` | |

Railway injects its own `PORT` env var. Either set
`PROCUREMENT_PORT=$PORT` in the Railway start command, or change the
`CMD` in `Dockerfile` to `uvicorn procurement_copilot.main:app --host 0.0.0.0 --port ${PORT:-8088}`.

## Deploy via Railway CLI

```bash
# One-time
npm i -g @railway/cli
railway login

# From repo root
cd apps/procurement-copilot

# Create / link a service. Use --service to pick an existing one.
railway init --name antaryami-procurement-copilot

# Configure env vars
railway variables --set PROCUREMENT_LLM_PROVIDER=openai \
  --set PROCUREMENT_LLM_MODEL=gpt-4o-mini \
  --set PROCUREMENT_LLM_TEMPERATURE=0.0 \
  --set OPENAI_API_KEY=sk-... \
  --set PROCUREMENT_PII_REDACTION=true \
  --set PROCUREMENT_HALLUCINATION_GUARD=true

# Deploy from the current directory using the Dockerfile
railway up --detach

# Expose the service publicly and copy the URL
railway domain
```

The service answers on:

- `GET /healthz`
- `POST /v1/agents/vendor-recommender`
- `POST /v1/agents/query-triage`
- `POST /v1/agents/tbe-prescreen`
- `POST /v1/agents/offer-diff`
- `POST /v1/agents/sla-risk`

OpenAPI docs are served at `/docs` (Swagger UI) and `/redoc`.

## Smoke test the deployed service

```bash
BASE=https://<your-railway-domain>

curl -s "$BASE/healthz"

curl -s -X POST "$BASE/v1/agents/query-triage" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "query_id": "smoke-1",
      "rfq_id": "RFQ-S",
      "vendor_id": "V-S",
      "subject": "Payment terms",
      "body": "Confirm payment terms and incoterm.",
      "received_at": "2026-05-05T00:00:00Z"
    }
  }' | jq
```

Expected: `category: "commercial"`, `suggested_owner: "commercial"`.

## Deploy via Railway dashboard (no CLI)

1. New Project → Deploy from GitHub repo → pick this repo.
2. Set the **Root Directory** to `apps/procurement-copilot`.
3. Railway auto-detects the Dockerfile.
4. Add the env vars above under **Variables**.
5. Settings → Networking → **Generate Domain**.

## Rollback

Railway keeps prior deployments. Either:

- `railway redeploy --deployment <previous-deployment-id>`, or
- Dashboard → Deployments → click a green deployment → **Redeploy**.

For a code rollback, revert the offending commit on `main` and let CI deploy.
