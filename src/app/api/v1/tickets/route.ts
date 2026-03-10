import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const status = searchParams.get("status");

  const where = {
    orgId: orgId!,
    ...(status ? { status } : {}),
  };

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { contact: true },
    }),
    prisma.ticket.count({ where }),
  ]);

  return NextResponse.json({
    data: tickets,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const body = await req.json();
  const { subject, description, priority, channel, contactId, assigneeId } = body;

  if (!subject || !contactId) {
    return NextResponse.json({ error: "subject and contactId are required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      priority: priority || "medium",
      channel: channel || "email",
      contactId,
      assigneeId,
      orgId: orgId!,
    },
    include: { contact: true },
  });

  return NextResponse.json({ data: ticket }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const body = await req.json();
  const result = await prisma.ticket.updateMany({
    where: { id, orgId: orgId! },
    data: body,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const updated = await prisma.ticket.findUnique({ where: { id }, include: { contact: true } });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const result = await prisma.ticket.deleteMany({ where: { id, orgId: orgId! } });
  if (result.count === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Ticket deleted" });
}
