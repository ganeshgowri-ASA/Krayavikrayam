import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event, payload, orgId } = body;

  if (!event || !orgId) {
    return NextResponse.json({ error: "event and orgId are required" }, { status: 400 });
  }

  // Find all active webhook configs for this org that listen to this event
  const webhookConfigs = await prisma.webhookConfig.findMany({
    where: {
      orgId,
      isActive: true,
    },
  });

  const results = [];

  for (const config of webhookConfigs) {
    const events = config.events as string[];
    if (!events.includes(event)) continue;

    const timestamp = Date.now().toString();
    const signature = crypto
      .createHmac("sha256", config.secret)
      .update(`${timestamp}.${JSON.stringify(payload)}`)
      .digest("hex");

    try {
      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Timestamp": timestamp,
        },
        body: JSON.stringify({ event, payload, timestamp }),
      });

      await prisma.integrationLog.create({
        data: {
          integrationType: "webhook",
          action: event,
          status: response.ok ? "success" : "error",
          payload: { event, payload } as object,
          response: { status: response.status, statusText: response.statusText } as object,
          orgId,
        },
      });

      results.push({ configId: config.id, status: response.ok ? "success" : "error" });
    } catch (err) {
      await prisma.integrationLog.create({
        data: {
          integrationType: "webhook",
          action: event,
          status: "error",
          payload: { event, payload } as object,
          response: { error: (err as Error).message } as object,
          orgId,
        },
      });

      results.push({ configId: config.id, status: "error" });
    }
  }

  return NextResponse.json({ results });
}
