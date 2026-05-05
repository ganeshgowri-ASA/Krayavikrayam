import { cn } from "@/lib/utils";
import type { Money } from "../types";
import { formatMoney } from "../lib/utils";

export function ValueChip({
  value,
  className,
}: {
  value: Money;
  className?: string;
}) {
  return (
    <span
      data-testid="value-chip"
      className={cn(
        "inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-200 tabular-nums",
        className
      )}
    >
      {formatMoney(value)}
    </span>
  );
}
