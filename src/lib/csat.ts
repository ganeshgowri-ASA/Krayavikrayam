import prisma from "./prisma";

/**
 * Creates a CSAT survey record when a ticket is resolved/closed.
 * The survey is created with no rating — the customer fills it in later.
 */
export async function triggerCsatSurvey(ticketId: string): Promise<void> {
  const existing = await prisma.csatSurvey.findUnique({
    where: { ticketId },
  });
  if (existing) return;

  await prisma.csatSurvey.create({
    data: { ticketId },
  });
}
