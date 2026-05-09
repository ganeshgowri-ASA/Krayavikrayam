"use client";

import { cn } from "@/lib/utils";
import { STEPS, type StepId } from "./steps";

interface StepperProps {
  current: StepId;
  onSelect: (id: StepId) => void;
}

export function Stepper({ current, onSelect }: StepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex w-full items-center gap-2 overflow-x-auto pb-2">
      {STEPS.map((step, idx) => {
        const isActive = step.id === current;
        const isComplete = idx < currentIdx;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary/5 text-foreground"
                  : isComplete
                  ? "border-muted-foreground/40 text-muted-foreground hover:bg-accent"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isComplete
                    ? "border-muted-foreground/40 bg-muted-foreground/10"
                    : "border-border",
                )}
              >
                {idx + 1}
              </span>
              <span className="truncate">{step.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <span className="hidden h-px w-4 bg-border sm:block" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
