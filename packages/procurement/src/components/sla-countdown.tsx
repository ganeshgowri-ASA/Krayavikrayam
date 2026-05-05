"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeRemaining } from "../lib/utils";

export function SlaCountdown({
  dueDate,
  tickMs = 30_000,
  className,
}: {
  dueDate: string;
  tickMs?: number;
  className?: string;
}) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  const { label, state } = timeRemaining(dueDate, now);
  const color =
    state === "breached"
      ? "text-rose-700 bg-rose-50 ring-rose-200"
      : state === "warning"
        ? "text-amber-800 bg-amber-50 ring-amber-200"
        : "text-emerald-800 bg-emerald-50 ring-emerald-200";

  return (
    <span
      data-testid="sla-countdown"
      data-state={state}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset tabular-nums",
        color,
        className
      )}
    >
      <Clock className="h-3 w-3" aria-hidden />
      {state === "breached" ? "Overdue" : `${label} left`}
    </span>
  );
}
