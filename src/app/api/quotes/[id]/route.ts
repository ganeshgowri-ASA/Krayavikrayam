import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(quote);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  if (body.items) {
    await prisma.quoteItem.deleteMany({ where: { quoteId: params.id } });
    const totalAmount = body.items.reduce(
      (
        sum: number,
        item: {
          quantity: number;
          unitPrice: number;
          discountPercent?: number;
        }
      ) => {
        const discount = item.discountPercent || 0;
        return sum + item.quantity * item.unitPrice * (1 - discount / 100);
      },
      0
    );

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: body.status,
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
        totalAmount,
        items: {
          create: body.items.map(
            (item: {
              productId: string;
              quantity: number;
              unitPrice: number;
              discountPercent?: number;
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discountPercent: item.discountPercent || 0,
            })
          ),
        },
      },
      include: { items: { include: { product: true } } },
    });
    return NextResponse.json(quote);
  }

  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: body,
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(quote);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.quote.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
