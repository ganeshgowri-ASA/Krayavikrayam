"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DealCard } from "./deal-card";
import { formatCurrency } from "@/lib/utils";
import type { Deal, PipelineStage } from "@/lib/types";

interface StageColumnProps {
  stage: PipelineStage;
  deals: Deal[];
}

export function StageColumn({ stage, deals }: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      className={`flex flex-col rounded-lg bg-[var(--muted)] min-w-[280px] w-[280px] transition-colors ${
        isOver ? "ring-2 ring-[var(--primary)]" : ""
      }`}
    >
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="text-sm font-semibold truncate">{stage.name}</h3>
          <span className="ml-auto text-xs text-[var(--muted-foreground)] bg-[var(--background)] rounded-full px-2 py-0.5">
            {deals.length}
          </span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {formatCurrency(totalValue)} &middot; {stage.probability}%
        </p>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]"
      >
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="text-center text-sm text-[var(--muted-foreground)] py-8">
            No deals
          </div>
        )}
      </div>
    </div>
  );
}
