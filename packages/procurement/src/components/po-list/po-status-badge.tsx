import { cn } from "@/lib/utils";
import type { PoStatus } from "../../types";
import { PO_STATUS_COLOR, PO_STATUS_LABEL } from "../../lib/po-utils";

export function PoStatusBadge({
  status,
  className,
}: {
  status: PoStatus;
  className?: string;
}) {
  return (
    <span
      data-testid="po-status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        PO_STATUS_COLOR[status],
        className,
      )}
    >
      {PO_STATUS_LABEL[status]}
    </span>
  );
}
