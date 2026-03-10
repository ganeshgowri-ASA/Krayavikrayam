import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { userId, content, isInternal } = body;

  const comment = await prisma.ticketComment.create({
    data: {
      ticketId: params.id,
      userId: userId || "system",
      content,
      isInternal: isInternal || false,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
