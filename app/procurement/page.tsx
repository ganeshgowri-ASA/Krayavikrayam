"use client";

import { useState } from "react";

type AgentResult = {
  agent: string;
  status: "idle" | "running" | "ok" | "error";
  message?: string;
};

const AGENTS = [
  { id: "intake", name: "Intake Agent", desc: "Parses RFx requirements and structures requisitions" },
  { id: "sourcing", name: "Sourcing Agent", desc: "Identifies qualified vendors from supplier master" },
  { id: "negotiation", name: "Negotiation Agent", desc: "Drafts counter-offers with guardrailed boundaries" },
  { id: "compliance", name: "Compliance Agent", desc: "Validates terms against policy & regulatory rules" },
  { id: "award", name: "Award Agent", desc: "Recommends winning bid with justification trace" },
];

export default function ProcurementCopilotPage() {
  const [results, setResults] = useState<Record<string, AgentResult>>({});
  const backendUrl = process.env.NEXT_PUBLIC_PROCUREMENT_API_URL ?? "";

  async function runAgent(agentId: string) {
    setResults((r) => ({ ...r, [agentId]: { agent: agentId, status: "running" } }));
    if (!backendUrl) {
      setResults((r) => ({
        ...r,
        [agentId]: {
          agent: agentId,
          status: "error",
          message: "Backend not configured. Set NEXT_PUBLIC_PROCUREMENT_API_URL once FastAPI is deployed on Railway.",
        },
      }));
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/agents/${agentId}/run`, { method: "POST" });
      const data = await res.json();
      setResults((r) => ({ ...r, [agentId]: { agent: agentId, status: "ok", message: JSON.stringify(data) } }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setResults((r) => ({ ...r, [agentId]: { agent: agentId, status: "error", message: msg } }));
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Procurement Copilot</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          5 LangGraph agents orchestrating RFx intake → sourcing → negotiation → compliance → award.
          Backend (FastAPI) deployed separately on Railway. See <code>apps/procurement-copilot/</code>.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Backend status: {backendUrl ? `connected to ${backendUrl}` : "not configured (set NEXT_PUBLIC_PROCUREMENT_API_URL)"}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {AGENTS.map((a) => {
          const r = results[a.id];
          return (
            <article key={a.id} className="rounded-lg border p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{a.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              <button
                onClick={() => runAgent(a.id)}
                className="mt-3 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                {r?.status === "running" ? "Running…" : "Run agent"}
              </button>
              {r?.message && (
                <pre className="mt-3 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">{r.message}</pre>
              )}
            </article>
          );
        })}
      </section>

      <footer className="mt-10 text-xs text-muted-foreground">
        v0.1.0-procurement-copilot · Migrated from antaryami-os@cc207c5 · Future integration via API / MCP / SSH.
      </footer>
    </main>
  );
}
