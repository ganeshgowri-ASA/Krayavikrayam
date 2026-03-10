import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function authenticateApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid Authorization header. Use: Bearer <api_key>" },
        { status: 401 }
      ),
      orgId: null,
    };
  }

  const key = authHeader.slice(7);
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });

  if (!apiKey || !apiKey.isActive) {
    return {
      error: NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 }),
      orgId: null,
    };
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return {
      error: NextResponse.json({ error: "API key has expired" }, { status: 401 }),
      orgId: null,
    };
  }

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { error: null, orgId: apiKey.orgId };
}
