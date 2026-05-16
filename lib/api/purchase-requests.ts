"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type {
  PrStatus,
  PrTab,
  PurchaseRequest,
} from "@/mocks/data/purchase-requests";

export type { PurchaseRequest, PrStatus, PrTab };

export interface PurchaseRequestListResponse {
  items: PurchaseRequest[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PurchaseRequestQuery {
  tab?: PrTab;
  status?: PrStatus[];
  search?: string;
  page?: number;
  pageSize?: number;
}

export function buildPurchaseRequestUrl(
  params: PurchaseRequestQuery,
  base = "/api/purchase-requests"
): string {
  const sp = new URLSearchParams();
  if (params.tab) sp.set("tab", params.tab);
  if (params.status?.length) sp.set("status", params.status.join(","));
  if (params.search) sp.set("search", params.search);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function fetchPurchaseRequests(
  params: PurchaseRequestQuery,
  signal?: AbortSignal,
  base = "/api/purchase-requests"
): Promise<PurchaseRequestListResponse> {
  const res = await fetch(buildPurchaseRequestUrl(params, base), {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to load purchase requests (${res.status})`);
  }
  return res.json();
}

export const purchaseRequestKeys = {
  all: ["purchase-requests"] as const,
  list: (params: PurchaseRequestQuery) =>
    ["purchase-requests", "list", params] as const,
};

export function usePurchaseRequests(params: PurchaseRequestQuery) {
  return useQuery({
    queryKey: purchaseRequestKeys.list(params),
    queryFn: ({ signal }) => fetchPurchaseRequests(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
