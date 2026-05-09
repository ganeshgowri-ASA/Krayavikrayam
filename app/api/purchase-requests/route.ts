import { NextRequest, NextResponse } from "next/server";
import { ALL_PURCHASE_REQUESTS } from "@/app/purchase-requests/data";
import type { PurchaseRequestListResponse } from "@/app/purchase-requests/types";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageRaw = Number(searchParams.get("page") ?? "1");
  const pageSizeRaw = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
    ? Math.min(Math.floor(pageSizeRaw), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const total = ALL_PURCHASE_REQUESTS.length;
  const start = (page - 1) * pageSize;
  const rows = ALL_PURCHASE_REQUESTS.slice(start, start + pageSize);

  const body: PurchaseRequestListResponse = { rows, total, page, pageSize };
  return NextResponse.json(body);
}
