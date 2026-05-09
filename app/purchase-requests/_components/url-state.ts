import { EMPTY_FILTERS, type PrFilters, type PrStatus, STATUS_OPTIONS } from "./types";

const STATUS_VALUES = new Set<string>(STATUS_OPTIONS.map((o) => o.value));

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function filtersFromQuery(params: URLSearchParams): PrFilters {
  const status = (params.get("status") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => STATUS_VALUES.has(s)) as PrStatus[];

  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  return {
    q: params.get("q") ?? "",
    status,
    requester: params.get("requester") ?? "",
    plant: params.get("plant") ?? "",
    from: ISO_DATE.test(from) ? from : "",
    to: ISO_DATE.test(to) ? to : "",
  };
}

export function filtersToQuery(filters: PrFilters, base?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(base ? base.toString() : "");
  const setOrDelete = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };

  setOrDelete("q", filters.q);
  setOrDelete("status", filters.status.join(","));
  setOrDelete("requester", filters.requester);
  setOrDelete("plant", filters.plant);
  setOrDelete("from", filters.from);
  setOrDelete("to", filters.to);

  return params;
}

export function isEmptyFilters(filters: PrFilters): boolean {
  return (
    filters.q === EMPTY_FILTERS.q &&
    filters.status.length === 0 &&
    filters.requester === EMPTY_FILTERS.requester &&
    filters.plant === EMPTY_FILTERS.plant &&
    filters.from === EMPTY_FILTERS.from &&
    filters.to === EMPTY_FILTERS.to
  );
}
