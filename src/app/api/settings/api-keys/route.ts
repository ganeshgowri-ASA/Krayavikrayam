import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/utils";

const DEMO_ORG_ID = "demo-org-id";

export async function GET() {
  const keys = await prisma.apiKey.findMany({
    where: { orgId: DEMO_ORG_ID },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ data: keys });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, expiresInDays } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const key = generateApiKey();
  const prefix = key.slice(0, 8);

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      key,
      prefix,
      expiresAt,
      orgId: DEMO_ORG_ID,
    },
  });

  // Return the full key only on creation
  return NextResponse.json({
    data: {
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Full key shown only once
      prefix: apiKey.prefix,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
    },
  }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.apiKey.updateMany({
    where: { id, orgId: DEMO_ORG_ID },
    data: { isActive: false },
  });

  return NextResponse.json({ message: "API key revoked" });
}
