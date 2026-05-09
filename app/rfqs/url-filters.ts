import {
  RFQ_STATUSES,
  TBE_CATEGORIES,
  type RfqFilters,
  type RfqStatus,
  type TbeCategory,
} from "./types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  const set = new Set<T>();
  for (const part of raw.split(",")) {
    const v = part.trim();
    if (v && (allowed as readonly string[]).includes(v)) set.add(v as T);
  }
  return Array.from(set);
}

export function parseFiltersFromParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): RfqFilters {
  const get = (k: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(k);
    const v = params[k];
    if (Array.isArray(v)) return v[0] ?? null;
    return v ?? null;
  };
  const from = get("from");
  const to = get("to");
  return {
    status: parseList<RfqStatus>(get("status"), RFQ_STATUSES),
    category: parseList<TbeCategory>(get("category"), TBE_CATEGORIES),
    deadlineFrom: from && ISO_DATE.test(from) ? from : undefined,
    deadlineTo: to && ISO_DATE.test(to) ? to : undefined,
  };
}

export function filtersToQueryString(f: RfqFilters): string {
  const sp = new URLSearchParams();
  if (f.status.length) sp.set("status", f.status.join(","));
  if (f.category.length) sp.set("category", f.category.join(","));
  if (f.deadlineFrom) sp.set("from", f.deadlineFrom);
  if (f.deadlineTo) sp.set("to", f.deadlineTo);
  return sp.toString();
}

export function isFilterActive(f: RfqFilters): boolean {
  return (
    f.status.length > 0 ||
    f.category.length > 0 ||
    !!f.deadlineFrom ||
    !!f.deadlineTo
  );
}
