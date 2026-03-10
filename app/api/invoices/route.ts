import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") || "default";
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { orgId };
  if (status) where.status = status;

  const invoices = await prisma.invoice.findMany({
    where,
    include: { items: { include: { product: true } }, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateNumber("INV"),
      contactId: body.contactId,
      accountId: body.accountId,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      orgId: body.orgId || "default",
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}
