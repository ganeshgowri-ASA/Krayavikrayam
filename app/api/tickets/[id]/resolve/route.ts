import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { triggerCsatSurvey } from "@/lib/csat";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticket = await prisma.ticket.update({
    where: { id: params.id },
    data: {
      status: "resolved",
      resolvedAt: new Date(),
    },
  });

  await triggerCsatSurvey(ticket.id);

  return NextResponse.json(ticket);
}
