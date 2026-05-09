import { Suspense } from "react";
import type { Metadata } from "next";
import { Wizard } from "./Wizard";

export const metadata: Metadata = {
  title: "New RFQ · Krayavikrayam",
  description: "Create a new Request for Quote (skeleton).",
};

export default function NewRfqPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 sm:p-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          RFQs
        </p>
        <h1 className="text-3xl font-bold tracking-tight">New RFQ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Skeleton wizard — fields are read-only placeholders. Spec:{" "}
          <code>docs/discovery/rfq-wizard.md</code>.
        </p>
      </header>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <Wizard />
      </Suspense>
    </main>
  );
}
