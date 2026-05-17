"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: number | null | undefined;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accentClassName?: string;
  isLoading?: boolean;
  testId?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accentClassName,
  isLoading = false,
  testId,
}: KpiCardProps) {
  const isEmpty = !isLoading && (value === null || value === undefined);

  return (
    <article
      data-testid={testId ?? "kpi-card"}
      data-state={isLoading ? "loading" : isEmpty ? "empty" : "ready"}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {Icon && (
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
              accentClassName ?? "bg-gray-50 text-gray-700 ring-gray-100"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="mt-3 h-9">
        {isLoading ? (
          <span
            data-testid="kpi-card-skeleton"
            aria-hidden="true"
            className="block h-8 w-20 animate-pulse rounded-md bg-gray-100"
          />
        ) : isEmpty ? (
          <span
            data-testid="kpi-card-empty"
            className="text-3xl font-semibold tracking-tight text-gray-300"
          >
            —
          </span>
        ) : (
          <span
            data-testid="kpi-card-value"
            className="text-3xl font-semibold tracking-tight text-gray-900"
          >
            {value!.toLocaleString()}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </article>
  );
}
