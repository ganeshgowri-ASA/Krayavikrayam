import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "@/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const { message, orgId, context, pageUrl } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await orchestrate(message, orgId ?? "default-org", context, pageUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
