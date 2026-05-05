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
  MOCK_RFQS,
  MOCK_VENDORS,
} from "./mock";

export const procurementKeys = {
  all: ["procurement"] as const,
  rfqs: (filters?: RfqFilters) => ["procurement", "rfqs", filters ?? {}] as const,
  rfq: (id: string) => ["procurement", "rfq", id] as const,
  vendor: (id: string) => ["procurement", "vendor", id] as const,
  offers: (rfqId: string, vendorId: string) =>
    ["procurement", "offers", rfqId, vendorId] as const,
  threads: (rfqId: string) => ["procurement", "threads", rfqId] as const,
};

const SIMULATED_LATENCY_MS = 150;
const wait = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));

export function applyFilters(rfqs: Rfq[], f: RfqFilters | undefined): Rfq[] {
  if (!f) return rfqs;
  return rfqs.filter((r) => {
    if (f.status?.length && !f.status.includes(r.status)) return false;
    if (f.buyerId?.length && !f.buyerId.includes(r.buyer.id)) return false;
    if (f.country?.length && !f.country.includes(r.plant.country)) return false;
    if (f.plantId?.length && !f.plantId.includes(r.plant.id)) return false;
    if (
      f.materialCode?.length &&
      !r.materialCodes.some((c) => f.materialCode!.includes(c))
    )
      return false;
    if (f.dueDateFrom && new Date(r.dueDate) < new Date(f.dueDateFrom)) return false;
    if (f.dueDateTo && new Date(r.dueDate) > new Date(f.dueDateTo)) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const blob = `${r.number} ${r.title} ${r.buyer.name} ${r.plant.name}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export async function fetchRfqs(filters?: RfqFilters): Promise<Rfq[]> {
  return wait(applyFilters(MOCK_RFQS, filters));
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

export function useRfqs(filters?: RfqFilters) {
  return useQuery({
    queryKey: procurementKeys.rfqs(filters),
    queryFn: () => fetchRfqs(filters),
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
