import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function authenticateApiKey(req: NextRequest): Promise<{ orgId: string; userId: string } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const key = authHeader.slice(7);
  try {
    const apiKey = await prisma.apiKey.findUnique({ where: { key } });
    if (!apiKey || !apiKey.isActive) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;
    return { orgId: apiKey.orgId, userId: apiKey.userId };
  } catch {
    return null;
  }
}
