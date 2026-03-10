import { NextResponse } from "next/server";
import { escalateBreachedTickets } from "@/lib/sla";

export async function POST() {
  const count = await escalateBreachedTickets();
  return NextResponse.json({
    message: `Escalated ${count} ticket(s)`,
    escalatedCount: count,
  });
}
