import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const search = searchParams.get("search") || "";

  const where = {
    orgId: orgId!,
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({
    data: contacts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const body = await req.json();
  const { firstName, lastName, email, phone, company, source, tags, customFields } = body;

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "firstName and lastName are required" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      company,
      source,
      tags: tags || [],
      customFields: customFields || {},
      orgId: orgId!,
    },
  });

  return NextResponse.json({ data: contact }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const body = await req.json();
  const contact = await prisma.contact.updateMany({
    where: { id, orgId: orgId! },
    data: body,
  });

  if (contact.count === 0) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const updated = await prisma.contact.findUnique({ where: { id } });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const { error, orgId } = await authenticateApiKey(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });

  const result = await prisma.contact.deleteMany({ where: { id, orgId: orgId! } });
  if (result.count === 0) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Contact deleted" });
}
