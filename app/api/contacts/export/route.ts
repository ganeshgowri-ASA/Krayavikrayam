import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; orgId: string | null };
  if (!user.orgId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const contacts = await prisma.contact.findMany({
    where: { orgId: user.orgId },
    include: {
      contactTags: { include: { tag: true } },
      account: { select: { companyName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const csvData = contacts.map((c) => ({
    name: c.name,
    email: c.email || "",
    phone: c.phone || "",
    company: c.company || "",
    source: c.source,
    status: c.status,
    account: c.account?.companyName || "",
    tags: c.contactTags.map((ct) => ct.tag.name).join("; "),
    created_at: c.createdAt.toISOString(),
  }));

  const csv = Papa.unparse(csvData);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="contacts-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
