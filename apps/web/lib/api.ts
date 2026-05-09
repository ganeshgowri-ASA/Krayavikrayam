import { getPurchaseOrderFixture } from "../mocks/po-data";
import type { PurchaseOrderDetail } from "./types";

/**
 * Read-only loader for a Purchase Order detail.
 *
 * On the server we resolve directly from the fixture so the page renders without
 * a network round-trip. In the browser, MSW intercepts `GET /api/orders/:poNo`
 * (see `mocks/handlers.ts`) for client-side refetches and tests.
 */
export async function getPurchaseOrder(
  poNo: string,
): Promise<PurchaseOrderDetail | null> {
  if (typeof window === "undefined") {
    return getPurchaseOrderFixture(poNo);
  }
  const res = await fetch(`/api/orders/${encodeURIComponent(poNo)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load PO ${poNo}: ${res.status}`);
  return (await res.json()) as PurchaseOrderDetail;
}
