import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Demo org ID for development
const DEMO_ORG_ID = "demo-org-id";

export async function GET() {
  const workflows = await prisma.workflow.findMany({
    where: { orgId: DEMO_ORG_ID },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: workflows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, triggerType, triggerConfig, conditions, actions, nodes, edges } = body;

  const workflow = await prisma.workflow.create({
    data: {
      name,
      triggerType,
      triggerConfig: triggerConfig || {},
      conditions: conditions || [],
      actions: actions || [],
      nodes: nodes || [],
      edges: edges || [],
      orgId: DEMO_ORG_ID,
    },
  });

  return NextResponse.json({ data: workflow }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json();
  const workflow = await prisma.workflow.update({
    where: { id },
    data: {
      name: body.name,
      triggerType: body.triggerType,
      triggerConfig: body.triggerConfig,
      conditions: body.conditions,
      actions: body.actions,
      nodes: body.nodes,
      edges: body.edges,
      isActive: body.isActive,
    },
  });

  return NextResponse.json({ data: workflow });
}
