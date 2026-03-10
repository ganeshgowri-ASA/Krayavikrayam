import { NextRequest, NextResponse } from "next/server";
import { orchestrate, agentTools } from "@/agents/orchestrator";

// GET /api/agents — list available agents and their definitions
export async function GET() {
  const agents = Object.entries(agentTools).map(([name, tool]) => ({
    name,
    description: tool.description,
    parameters: tool.parameters,
    enabled: true,
  }));

  return NextResponse.json({ agents });
}

// POST /api/agents — trigger a specific agent
export async function POST(req: NextRequest) {
  try {
    const { agentName, query, orgId, context } = await req.json();

    if (!agentName || !query) {
      return NextResponse.json(
        { error: "agentName and query are required" },
        { status: 400 }
      );
    }

    const result = await orchestrate(query, orgId ?? "default-org", {
      ...context,
      forcedAgent: agentName,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
