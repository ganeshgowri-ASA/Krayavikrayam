export type PrStatus =
  | "draft"
  | "pending_approval"
  | "under_rework"
  | "need_clarification";

export interface PrFilters {
  q: string;
  status: PrStatus[];
  requester: string;
  plant: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: PrFilters = {
  q: "",
  status: [],
  requester: "",
  plant: "",
  from: "",
  to: "",
};

export const STATUS_OPTIONS: { value: PrStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending for approval" },
  { value: "under_rework", label: "Under rework" },
  { value: "need_clarification", label: "Need clarification" },
];

export interface NamedOption {
  value: string;
  label: string;
}

export function countActiveFilters(f: PrFilters): number {
  return (
    (f.q ? 1 : 0) +
    (f.status.length > 0 ? 1 : 0) +
    (f.requester ? 1 : 0) +
    (f.plant ? 1 : 0) +
    (f.from ? 1 : 0) +
    (f.to ? 1 : 0)
  );
}
