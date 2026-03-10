import { NextRequest, NextResponse } from "next/server";
import { mockPipeline, getDealsByStage } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeDeals = searchParams.get("includeDeals") === "true";

  const pipeline = { ...mockPipeline };

  if (includeDeals) {
    pipeline.stages = pipeline.stages.map((stage) => ({
      ...stage,
      deals: getDealsByStage(stage.id),
    }));
  }

  return NextResponse.json(pipeline);
}
