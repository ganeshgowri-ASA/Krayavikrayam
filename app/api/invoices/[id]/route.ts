import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      payments: { orderBy: { paymentDate: "desc" } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(invoice);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  if (body.items) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } });
    const totalAmount = body.items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        totalAmount,
        items: {
          create: body.items.map(
            (item: {
              productId: string;
              quantity: number;
              unitPrice: number;
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })
          ),
        },
      },
      include: { items: { include: { product: true } }, payments: true },
    });
    return NextResponse.json(invoice);
  }

  const invoice = await prisma.invoice.update({
    where: { id: params.id },
    data: body,
    include: { items: { include: { product: true } }, payments: true },
  });
  return NextResponse.json(invoice);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.invoice.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
