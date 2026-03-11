import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { invoiceId, amount, method, reference } = body;

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      paymentDate: new Date(),
      method,
      reference,
    },
  });

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });

  if (invoice) {
    const totalPaid = invoice.payments.reduce((s: number, p: { amount: number }) => s + p.amount, 0);
    if (totalPaid >= invoice.totalAmount) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "paid" },
      });
    }
  }

  return NextResponse.json(payment, { status: 201 });
}
