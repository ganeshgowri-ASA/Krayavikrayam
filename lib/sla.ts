export function getSlaStatus(deadline: Date | null): "ok" | "warning" | "breached" {
  if (!deadline) return "ok";
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff < 0) return "breached";
  if (diff < 3600000) return "warning"; // < 1 hour
  return "ok";
}

export function computeSlaDeadline(createdAt: Date, hoursToResolve: number): Date {
  return new Date(createdAt.getTime() + hoursToResolve * 3600000);
}

export async function escalateBreachedTickets(): Promise<void> {
  // Stub: escalation logic runs server-side via cron
}
