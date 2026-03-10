import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const quotes = await prisma.quote.findMany({
    where,
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const quote = await prisma.quote.create({
    data: {
      quoteNumber: generateNumber("QT"),
      dealId: body.dealId,
      contactId: body.contactId,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
    },
  });
  return NextResponse.json(quote, { status: 201 });
}
