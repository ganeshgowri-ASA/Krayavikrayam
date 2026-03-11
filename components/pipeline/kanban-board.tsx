"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { StageColumn } from "./stage-column";
import { DealCard } from "./deal-card";
import type { Deal, PipelineStage } from "@/lib/types";

interface KanbanBoardProps {
  stages: PipelineStage[];
  initialDeals: Deal[];
}

export function KanbanBoard({ stages, initialDeals }: KanbanBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const deal = deals.find((d) => d.id === event.active.id);
      if (deal) setActiveDeal(deal);
    },
    [deals]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDeal(null);
      const { active, over } = event;

      if (!over) return;

      const dealId = active.id as string;
      const overId = over.id as string;

      const targetStage = stages.find((s) => s.id === overId);
      if (!targetStage) return;

      setDeals((prev) =>
        prev.map((d) => {
          if (d.id === dealId) {
            return {
              ...d,
              stageId: targetStage.id,
              probability: targetStage.probability,
              stage: targetStage,
            };
          }
          return d;
        })
      );
    },
    [stages]
  );

  const visibleStages = stages.filter((s) => s.order <= 4);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-6">
        {visibleStages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            deals={deals.filter((d) => d.stageId === stage.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
