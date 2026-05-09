"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  OfferVersion,
  QueryThread,
  Rfq,
  RfqFilters,
  Vendor,
} from "../types";
import {
  MOCK_OFFER_VERSIONS,
  MOCK_QUERY_THREADS,
  MOCK_VENDORS,
} from "./mock";
import { applyFilters } from "./filters";

export { applyFilters };

/**
 * Base URL of the antaryami-os FastAPI procurement copilot.
 * Configure via NEXT_PUBLIC_PROCUREMENT_COPILOT_URL on Vercel; empty
 * string falls back to the in-process mock layer.
 */
export const PROCUREMENT_COPILOT_URL =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_PROCUREMENT_COPILOT_URL) ||
  "";

export function copilotEndpoint(path: string): string {
  if (!PROCUREMENT_COPILOT_URL) return "";
  const base = PROCUREMENT_COPILOT_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export const procurementKeys = {
  all: ["procurement"] as const,
  rfqs: (filters?: RfqFilters, page?: number, pageSize?: number) =>
    ["procurement", "rfqs", filters ?? {}, page ?? 1, pageSize ?? 25] as const,
  rfq: (id: string) => ["procurement", "rfq", id] as const,
  vendor: (id: string) => ["procurement", "vendor", id] as const,
  offers: (rfqId: string, vendorId: string) =>
    ["procurement", "offers", rfqId, vendorId] as const,
  threads: (rfqId: string) => ["procurement", "threads", rfqId] as const,
};

const SIMULATED_LATENCY_MS = 150;
const wait = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));

export interface RfqListResponse {
  items: Rfq[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RfqListQuery {
  filters?: RfqFilters;
  page?: number;
  pageSize?: number;
}

function appendCsv(params: URLSearchParams, key: string, values?: string[]) {
  if (values?.length) params.set(key, values.join(","));
}

export function buildRfqListSearchParams(query: RfqListQuery = {}): URLSearchParams {
  const params = new URLSearchParams();
  const { filters, page, pageSize } = query;
  if (page) params.set("page", String(page));
  if (pageSize) params.set("pageSize", String(pageSize));
  if (filters) {
    appendCsv(params, "status", filters.status);
    appendCsv(params, "buyerId", filters.buyerId);
    appendCsv(params, "country", filters.country);
    appendCsv(params, "plantId", filters.plantId);
    appendCsv(params, "materialCode", filters.materialCode);
    if (filters.dueDateFrom) params.set("dueDateFrom", filters.dueDateFrom);
    if (filters.dueDateTo) params.set("dueDateTo", filters.dueDateTo);
    if (filters.search) params.set("search", filters.search);
  }
  return params;
}

export async function fetchRfqs(query: RfqListQuery = {}): Promise<RfqListResponse> {
  const params = buildRfqListSearchParams(query);
  const qs = params.toString();
  const res = await fetch(`/api/rfqs${qs ? `?${qs}` : ""}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch RFQs: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as RfqListResponse;
}

export async function fetchRfq(id: string): Promise<Rfq> {
  const res = await fetch(`/api/rfqs/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch RFQ ${id}: ${res.status}`);
  }
  return (await res.json()) as Rfq;
}

export async function createRfq(input: Partial<Rfq>): Promise<{ id: string; rfq: Rfq }> {
  const res = await fetch(`/api/rfqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create RFQ: ${res.status}`);
  }
  return (await res.json()) as { id: string; rfq: Rfq };
}

export async function fetchVendor(id: string): Promise<Vendor | null> {
  return wait(MOCK_VENDORS.find((v) => v.id === id) ?? null);
}

export async function fetchOfferVersions(
  rfqId: string,
  vendorId: string
): Promise<OfferVersion[]> {
  return wait(
    MOCK_OFFER_VERSIONS.filter((o) => o.rfqId === rfqId && o.vendorId === vendorId)
  );
}

export async function fetchQueryThreads(rfqId: string): Promise<QueryThread[]> {
  return wait(MOCK_QUERY_THREADS.filter((t) => t.rfqId === rfqId));
}

export function useRfqs(filters?: RfqFilters, page = 1, pageSize = 25) {
  return useQuery({
    queryKey: procurementKeys.rfqs(filters, page, pageSize),
    queryFn: () => fetchRfqs({ filters, page, pageSize }),
    staleTime: 30_000,
  });
}

export function useVendor(vendorId: string | null) {
  return useQuery({
    queryKey: procurementKeys.vendor(vendorId ?? "none"),
    queryFn: () => fetchVendor(vendorId!),
    enabled: !!vendorId,
  });
}

export function useOfferVersions(rfqId: string | null, vendorId: string | null) {
  return useQuery({
    queryKey: procurementKeys.offers(rfqId ?? "none", vendorId ?? "none"),
    queryFn: () => fetchOfferVersions(rfqId!, vendorId!),
    enabled: !!rfqId && !!vendorId,
  });
}

export function useQueryThreads(rfqId: string | null) {
  return useQuery({
    queryKey: procurementKeys.threads(rfqId ?? "none"),
    queryFn: () => fetchQueryThreads(rfqId!),
    enabled: !!rfqId,
  });
}
