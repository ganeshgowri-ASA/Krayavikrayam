export type StepId =
  | "scope"
  | "items"
  | "suppliers"
  | "timeline"
  | "terms"
  | "publish";

export interface StepDef {
  id: StepId;
  label: string;
  description: string;
}

export const STEPS: readonly StepDef[] = [
  {
    id: "scope",
    label: "Scope",
    description: "What is being procured, for which plant and buyer.",
  },
  {
    id: "items",
    label: "Items",
    description: "Line items: material, quantity, UoM, target price, delivery.",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Invited vendors and selection rationale.",
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Issue date, response window, Q&A cutoff, award target.",
  },
  {
    id: "terms",
    label: "T&C",
    description: "Incoterms, payment, warranty, attachments, compliance.",
  },
  {
    id: "publish",
    label: "Publish",
    description: "Read-only summary; publish CTA wired later.",
  },
] as const;

export function stepIndex(id: string | null | undefined): number {
  if (!id) return 0;
  const idx = STEPS.findIndex((s) => s.id === id);
  return idx === -1 ? 0 : idx;
}

export function clampStep(idx: number): number {
  if (idx < 0) return 0;
  if (idx > STEPS.length - 1) return STEPS.length - 1;
  return idx;
}
