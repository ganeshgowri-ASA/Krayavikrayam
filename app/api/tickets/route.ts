import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeSlaDeadline } from "@/lib/sla";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const orgId = searchParams.get("orgId") || "default";

  const where: Record<string, unknown> = { orgId };
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const tickets = await prisma.ticket.findMany({
    where,
    include: { csatSurvey: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { subject, description, priority, contactId, assignedTo, orgId } = body;

  const slaDeadline = await computeSlaDeadline(
    orgId || "default",
    priority || "medium"
  );

  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      priority: priority || "medium",
      contactId,
      assignedTo,
      orgId: orgId || "default",
      slaDeadline,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
