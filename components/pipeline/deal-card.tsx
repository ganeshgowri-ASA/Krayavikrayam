"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { formatCurrency, getProbabilityColor } from "@/lib/utils";
import type { Deal } from "@/lib/types";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id, data: { deal } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const probColor = getProbabilityColor(deal.probability);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <Link
        href={`/dashboard/deals/${deal.id}`}
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-2">
            {deal.title}
          </h4>
          <span
            className="shrink-0 h-2.5 w-2.5 rounded-full mt-1"
            style={{ backgroundColor: probColor }}
            title={`${deal.probability}% probability`}
          />
        </div>
        <p className="text-base font-semibold text-[var(--primary)]">
          {formatCurrency(deal.value, deal.currency)}
        </p>
        {deal.contactName && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {deal.contactName}
          </p>
        )}
        {deal.accountName && (
          <p className="text-xs text-[var(--muted-foreground)]">
            {deal.accountName}
          </p>
        )}
        {deal.expectedCloseDate && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
          </p>
        )}
      </Link>
    </div>
  );
}
