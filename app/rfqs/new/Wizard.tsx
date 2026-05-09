"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { STEPS, type StepId, clampStep, stepIndex } from "./steps";
import { Stepper } from "./Stepper";
import {
  ItemsPanel,
  PublishPanel,
  ScopePanel,
  SuppliersPanel,
  TermsPanel,
  TimelinePanel,
} from "./StepPanels";

const PANELS: Record<StepId, () => JSX.Element> = {
  scope: ScopePanel,
  items: ItemsPanel,
  suppliers: SuppliersPanel,
  timeline: TimelinePanel,
  terms: TermsPanel,
  publish: PublishPanel,
};

export function Wizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentIdx = stepIndex(stepParam);
  const current = STEPS[currentIdx];

  const goTo = useCallback(
    (idx: number) => {
      const next = STEPS[clampStep(idx)];
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", next.id);
      router.replace(`/rfqs/new?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const onSelect = useCallback(
    (id: StepId) => {
      goTo(STEPS.findIndex((s) => s.id === id));
    },
    [goTo],
  );

  const Panel = useMemo(() => PANELS[current.id], [current.id]);

  const isFirst = currentIdx === 0;
  const isLast = currentIdx === STEPS.length - 1;

  return (
    <div className="space-y-6">
      <Stepper current={current.id} onSelect={onSelect} />

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Panel />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => goTo(currentIdx - 1)}
          disabled={isFirst}
        >
          Back
        </Button>
        <p className="text-xs text-muted-foreground">
          Step {currentIdx + 1} of {STEPS.length} · {current.label}
        </p>
        <Button onClick={() => goTo(currentIdx + 1)} disabled={isLast}>
          Next
        </Button>
      </div>
    </div>
  );
}
