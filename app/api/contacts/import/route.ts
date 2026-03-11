import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role: string; orgId: string | null };
  if (!user.orgId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }
  if (user.role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const { data, errors } = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return NextResponse.json({ error: "CSV parsing errors", details: errors }, { status: 400 });
    }

    const validSources = ["WEBSITE", "REFERRAL", "LINKEDIN", "COLD_CALL", "TRADE_SHOW", "ADVERTISEMENT", "OTHER"];
    const validStatuses = ["LEAD", "PROSPECT", "CUSTOMER", "CHURNED", "INACTIVE"];

    let imported = 0;
    let skipped = 0;
    const duplicates: string[] = [];

    for (const row of data) {
      const name = row.name?.trim();
      if (!name) {
        skipped++;
        continue;
      }

      const email = row.email?.trim() || null;
      const phone = row.phone?.trim() || null;

      // Duplicate detection
      if (email || phone) {
        const conditions = [];
        if (email) conditions.push({ email });
        if (phone) conditions.push({ phone });

        const existing = await prisma.contact.findFirst({
          where: { orgId: user.orgId, OR: conditions },
        });
        if (existing) {
          duplicates.push(name);
          skipped++;
          continue;
        }
      }

      const source = validSources.includes(row.source?.toUpperCase())
        ? (row.source.toUpperCase() as "WEBSITE" | "REFERRAL" | "LINKEDIN" | "COLD_CALL" | "TRADE_SHOW" | "ADVERTISEMENT" | "OTHER")
        : "OTHER";
      const status = validStatuses.includes(row.status?.toUpperCase())
        ? (row.status.toUpperCase() as "LEAD" | "PROSPECT" | "CUSTOMER" | "CHURNED" | "INACTIVE")
        : "LEAD";

      await prisma.contact.create({
        data: {
          name,
          email,
          phone,
          company: row.company?.trim() || null,
          source,
          status,
          orgId: user.orgId,
          createdById: user.id,
        },
      });
      imported++;
    }

    return NextResponse.json({ imported, skipped, duplicates });
  } catch {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
