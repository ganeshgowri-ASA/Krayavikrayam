import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { triggerCsatSurvey } from "@/lib/csat";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      csatSurvey: true,
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.status) data.status = body.status;
  if (body.priority) data.priority = body.priority;
  if (body.assignedTo !== undefined) data.assignedTo = body.assignedTo;
  if (body.subject) data.subject = body.subject;
  if (body.description) data.description = body.description;

  if (body.status === "resolved" || body.status === "closed") {
    data.resolvedAt = new Date();
  }

  const ticket = await prisma.ticket.update({
    where: { id: params.id },
    data,
    include: { comments: true, csatSurvey: true },
  });

  if (body.status === "resolved" || body.status === "closed") {
    await triggerCsatSurvey(ticket.id);
  }

  return NextResponse.json(ticket);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.ticket.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
