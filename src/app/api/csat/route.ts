import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { ticketId, rating, feedback } = body;

  const survey = await prisma.csatSurvey.update({
    where: { ticketId },
    data: { rating, feedback },
  });

  return NextResponse.json(survey);
}
