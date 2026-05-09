"use client";

import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  value?: string;
  hint?: string;
  multiline?: boolean;
}

function Field({ label, value, hint, multiline }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={
          multiline
            ? "min-h-[4rem] rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
            : "rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
        }
        aria-readonly
      >
        {value ?? <span className="italic">— not set —</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function ScopePanel() {
  return (
    <StepShell
      title="1. Scope"
      description="Define what is being procured and which plant and buyer own it."
    >
      <Field label="RFQ title" hint="Short, human-readable name." />
      <Field label="Category" hint="Material category from master." />
      <Field label="Plant" hint="Site requesting the procurement." />
      <Field label="Buyer" hint="RFQ owner." />
      <Field label="Priority" hint="low / medium / high / urgent." />
      <div className="sm:col-span-2">
        <Field label="Description" multiline hint="Scope narrative for suppliers." />
      </div>
    </StepShell>
  );
}

export function ItemsPanel() {
  return (
    <StepShell
      title="2. Items"
      description="Line items requested. Read-only stub; row editor lands later."
    >
      <div className="sm:col-span-2 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <div className="grid grid-cols-6 gap-2 text-xs font-medium uppercase tracking-wide">
          <div>Material</div>
          <div className="col-span-2">Description</div>
          <div>Qty</div>
          <div>UoM</div>
          <div>Target price</div>
        </div>
        <div className="mt-3 italic">— no line items —</div>
      </div>
      <Field label="Total target value" hint="Auto-computed from line items." />
      <Field label="Earliest delivery date" hint="Min across line items." />
    </StepShell>
  );
}

export function SuppliersPanel() {
  return (
    <StepShell
      title="3. Suppliers"
      description="Invited vendors and rationale for selection."
    >
      <Field label="Invited suppliers" hint="Multi-select from supplier master." />
      <Field label="Minimum invites" value="3 (recommended)" />
      <div className="sm:col-span-2">
        <Field label="Selection rationale" multiline />
      </div>
    </StepShell>
  );
}

export function TimelinePanel() {
  return (
    <StepShell
      title="4. Timeline"
      description="Key dates that govern the RFQ lifecycle."
    >
      <Field label="Issue date" hint="When RFQ opens to suppliers." />
      <Field label="Response due" hint="Submission cutoff." />
      <Field label="Q&A cutoff" hint="Last day for clarifications." />
      <Field label="Award target" hint="Internal target date." />
    </StepShell>
  );
}

export function TermsPanel() {
  return (
    <StepShell
      title="5. Terms & Conditions"
      description="Commercial terms, attachments, and compliance flags."
    >
      <Field label="Incoterm" hint="EXW / FOB / CIF / DDP / ..." />
      <Field label="Payment terms" />
      <Field label="Warranty (months)" />
      <Field label="Compliance flags" hint="GST, MSME, ISO9001, ..." />
      <div className="sm:col-span-2">
        <Field label="Attachments" multiline hint="Drawings, specs, NDAs." />
      </div>
    </StepShell>
  );
}

export function PublishPanel() {
  return (
    <StepShell
      title="6. Publish"
      description="Read-only summary. Submit is intentionally not wired yet."
    >
      <div className="sm:col-span-2 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Validation summary</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Scope, items, suppliers, timeline and T&amp;C will be summarized here.</li>
          <li>Blocking errors and soft warnings appear before publish.</li>
        </ul>
        <p className="mt-3 italic">
          Publish CTA is disabled in this skeleton — wired in a later session.
        </p>
      </div>
    </StepShell>
  );
}
