import { cn } from "@/lib/utils";
import type { RfqStatus } from "../types";
import { STATUS_COLOR, STATUS_LABEL } from "../lib/utils";

export function RfqStatusBadge({
  status,
  className,
}: {
  status: RfqStatus;
  className?: string;
}) {
  return (
    <span
      data-testid="rfq-status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_COLOR[status],
        className
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
