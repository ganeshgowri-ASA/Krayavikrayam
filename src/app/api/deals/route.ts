import { NextRequest, NextResponse } from "next/server";
import { mockDeals } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const stageId = searchParams.get("stageId");
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const search = searchParams.get("search");

  let deals = [...mockDeals];

  if (status) {
    deals = deals.filter((d) => d.status === status);
  }

  if (stageId) {
    deals = deals.filter((d) => d.stageId === stageId);
  }

  if (search) {
    const q = search.toLowerCase();
    deals = deals.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.contactName?.toLowerCase().includes(q) ||
        d.accountName?.toLowerCase().includes(q)
    );
  }

  deals.sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newDeal = {
    id: `d${Date.now()}`,
    title: body.title,
    value: body.value || 0,
    currency: body.currency || "USD",
    expectedCloseDate: body.expectedCloseDate || null,
    stageId: body.stageId,
    contactId: body.contactId || null,
    contactName: body.contactName || null,
    accountId: body.accountId || null,
    accountName: body.accountName || null,
    ownerId: body.ownerId || null,
    ownerName: body.ownerName || null,
    orgId: body.orgId || "org1",
    probability: body.probability || 0,
    status: "OPEN" as const,
    notes: body.notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activities: [],
  };

  return NextResponse.json(newDeal, { status: 201 });
}
