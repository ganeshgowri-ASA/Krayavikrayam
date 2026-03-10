import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const orgId = searchParams.get("orgId") || "default";

  const where: Record<string, unknown> = { orgId, isPublished: true };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
    delete where.isPublished;
  }

  const articles = await prisma.knowledgeBase.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const article = await prisma.knowledgeBase.create({ data: body });
  return NextResponse.json(article, { status: 201 });
}
