import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const stage = searchParams.get("stage");

  const where = {
    orgId: orgId!,
    ...(stage ? { stage } : {}),
  };

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { contact: true },
    }),
    prisma.deal.count({ where }),
  ]);

  return NextResponse.json({
    data: deals,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const body = await req.json();
  const { title, value, currency, stage, priority, contactId, assigneeId } = body;

  if (!title || !contactId) {
    return NextResponse.json({ error: "title and contactId are required" }, { status: 400 });
  }

  const deal = await prisma.deal.create({
    data: {
      title,
      value: value || 0,
      currency: currency || "INR",
      stage: stage || "lead",
      priority: priority || "medium",
      contactId,
      assigneeId,
      orgId: orgId!,
    },
    include: { contact: true },
  });

  return NextResponse.json({ data: deal }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const body = await req.json();
  const result = await prisma.deal.updateMany({
    where: { id, orgId: orgId! },
    data: body,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const updated = await prisma.deal.findUnique({ where: { id }, include: { contact: true } });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const result = await prisma.deal.deleteMany({ where: { id, orgId: orgId! } });
  if (result.count === 0) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deal deleted" });
}
