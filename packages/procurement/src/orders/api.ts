"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Grn,
  Invoice,
  PoDetail,
  PoListQuery,
  PoListResponse,
} from "./types";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (query?: PoListQuery) => ["orders", "list", query ?? {}] as const,
  detail: (poNo: string) => ["orders", "detail", poNo] as const,
  grns: (poNo: string) => ["orders", "grns", poNo] as const,
  invoices: (poNo: string) => ["orders", "invoices", poNo] as const,
};

function buildListSearch(query?: PoListQuery): string {
  const params = new URLSearchParams();
  if (!query) return "";
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.sort) params.set("sort", query.sort);
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (query.q) params.set("q", query.q);
  for (const s of query.status ?? []) params.append("status", s);
  for (const id of query.supplierId ?? []) params.append("supplierId", id);
  for (const id of query.plantId ?? []) params.append("plantId", id);
  const s = params.toString();
  return s ? `?${s}` : "";
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request to ${url} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export function fetchOrders(query?: PoListQuery): Promise<PoListResponse> {
  return getJson<PoListResponse>(`/api/orders${buildListSearch(query)}`);
}

export function fetchOrder(poNo: string): Promise<PoDetail> {
  return getJson<PoDetail>(`/api/orders/${encodeURIComponent(poNo)}`);
}

export function fetchOrderGrns(poNo: string): Promise<Grn[]> {
  return getJson<Grn[]>(`/api/orders/${encodeURIComponent(poNo)}/grns`);
}

export function fetchOrderInvoices(poNo: string): Promise<Invoice[]> {
  return getJson<Invoice[]>(`/api/orders/${encodeURIComponent(poNo)}/invoices`);
}

export function useOrders(query?: PoListQuery) {
  return useQuery({
    queryKey: ordersKeys.list(query),
    queryFn: () => fetchOrders(query),
    staleTime: 30_000,
  });
}

export function useOrder(poNo: string | null) {
  return useQuery({
    queryKey: ordersKeys.detail(poNo ?? "none"),
    queryFn: () => fetchOrder(poNo!),
    enabled: !!poNo,
  });
}

export function useOrderGrns(poNo: string | null) {
  return useQuery({
    queryKey: ordersKeys.grns(poNo ?? "none"),
    queryFn: () => fetchOrderGrns(poNo!),
    enabled: !!poNo,
  });
}

export function useOrderInvoices(poNo: string | null) {
  return useQuery({
    queryKey: ordersKeys.invoices(poNo ?? "none"),
    queryFn: () => fetchOrderInvoices(poNo!),
    enabled: !!poNo,
  });
}
