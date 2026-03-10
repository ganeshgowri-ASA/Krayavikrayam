import prisma from "./prisma";
import { TicketPriority } from "../../generated/prisma/client";

/**
 * Applies SLA deadline to a ticket based on org SLA rules and priority.
 * Returns the computed SLA deadline.
 */
export async function computeSlaDeadline(
  orgId: string,
  priority: TicketPriority,
  createdAt: Date = new Date()
): Promise<Date | null> {
  const rule = await prisma.slaRule.findFirst({
    where: { orgId, priority },
  });
  if (!rule) return null;
  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + rule.resolutionTimeHours);
  return deadline;
}

/**
 * Checks all open/in-progress tickets for SLA breaches and escalates them
 * by bumping priority one level if the SLA deadline has passed.
 */
export async function escalateBreachedTickets(): Promise<number> {
  const now = new Date();

  const breachedTickets = await prisma.ticket.findMany({
    where: {
      status: { in: ["open", "in_progress"] },
      slaDeadline: { lt: now },
    },
  });

  const priorityEscalation: Record<TicketPriority, TicketPriority> = {
    low: "medium",
    medium: "high",
    high: "urgent",
    urgent: "urgent",
  };

  let escalatedCount = 0;
  for (const ticket of breachedTickets) {
    const newPriority = priorityEscalation[ticket.priority];
    if (newPriority !== ticket.priority) {
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { priority: newPriority },
      });
      escalatedCount++;
    }
  }

  return escalatedCount;
}
