"use client";

import { cn } from "@/lib/utils";
import { differenceInHours, differenceInMinutes, isPast } from "date-fns";

export function SlaCountdown({
  deadline,
  resolvedAt,
}: {
  deadline: string | null;
  resolvedAt: string | null;
}) {
  if (!deadline) return <span className="text-gray-400 text-sm">No SLA</span>;

  const deadlineDate = new Date(deadline);
  const isResolved = !!resolvedAt;
  const breached = isPast(deadlineDate) && !isResolved;

  if (isResolved) {
    const resolvedDate = new Date(resolvedAt);
    const wasBreached = resolvedDate > deadlineDate;
    return (
      <span
        className={cn(
          "text-sm font-medium",
          wasBreached ? "text-red-600" : "text-green-600"
        )}
      >
        {wasBreached ? "SLA Breached" : "Met SLA"}
      </span>
    );
  }

  if (breached) {
    return (
      <span className="text-sm font-medium text-red-600 animate-pulse">
        SLA Breached
      </span>
    );
  }

  const now = new Date();
  const hoursLeft = differenceInHours(deadlineDate, now);
  const minutesLeft = differenceInMinutes(deadlineDate, now) % 60;

  const isWarning = hoursLeft < 2;

  return (
    <span
      className={cn(
        "text-sm font-medium",
        isWarning ? "text-orange-600" : "text-green-600"
      )}
    >
      {hoursLeft}h {minutesLeft}m left
    </span>
  );
}

export function SlaStatusBar({
  deadline,
  createdAt,
  resolvedAt,
}: {
  deadline: string | null;
  createdAt: string;
  resolvedAt: string | null;
}) {
  if (!deadline)
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-gray-500 text-sm">
        No SLA configured
      </div>
    );

  const deadlineDate = new Date(deadline);
  const created = new Date(createdAt);
  const now = resolvedAt ? new Date(resolvedAt) : new Date();
  const totalDuration = deadlineDate.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const breached = now > deadlineDate;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">SLA Progress</span>
        <SlaCountdown deadline={deadline} resolvedAt={resolvedAt} />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={cn(
            "h-2.5 rounded-full transition-all",
            breached
              ? "bg-red-500"
              : pct > 75
                ? "bg-orange-500"
                : "bg-green-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
