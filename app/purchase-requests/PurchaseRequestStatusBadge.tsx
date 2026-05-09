import { cn } from "@/lib/utils";
import type { PurchaseRequestStatus } from "./types";
import { STATUS_VARIANT } from "./utils";

export function PurchaseRequestStatusBadge({
  status,
  className,
}: {
  status: PurchaseRequestStatus;
  className?: string;
}) {
  const v = STATUS_VARIANT[status];
  return (
    <span
      data-testid="pr-status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        v.className,
        className,
      )}
    >
      {v.label}
    </span>
  );
}
