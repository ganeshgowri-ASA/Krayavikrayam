"use client";

import { useQuery } from "@tanstack/react-query";
import type { PoListFilters, PoListResult } from "../types";
import { applyPoFilters, paginate } from "../lib/po-utils";
import { MOCK_PURCHASE_ORDERS } from "./po-mock";

const SIMULATED_LATENCY_MS = 120;

const wait = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));

export const poKeys = {
  all: ["procurement", "po"] as const,
  list: (filters?: PoListFilters, page = 1, pageSize = 10) =>
    ["procurement", "po", "list", filters ?? {}, page, pageSize] as const,
};

export interface FetchPoListArgs {
  filters?: PoListFilters;
  page?: number;
  pageSize?: number;
}

export async function fetchPurchaseOrders({
  filters,
  page = 1,
  pageSize = 10,
}: FetchPoListArgs = {}): Promise<PoListResult> {
  const filtered = applyPoFilters(MOCK_PURCHASE_ORDERS, filters);
  const paged = paginate(filtered, page, pageSize);
  return wait({
    rows: paged.rows,
    total: paged.total,
    page: paged.page,
    pageSize: paged.pageSize,
  });
}

export function usePurchaseOrders(args: FetchPoListArgs = {}) {
  const { filters, page = 1, pageSize = 10 } = args;
  return useQuery({
    queryKey: poKeys.list(filters, page, pageSize),
    queryFn: () => fetchPurchaseOrders({ filters, page, pageSize }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
