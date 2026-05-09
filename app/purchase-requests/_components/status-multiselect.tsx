"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, type PrStatus } from "./types";

export function StatusMultiSelect({
  value,
  onChange,
}: {
  value: PrStatus[];
  onChange: (next: PrStatus[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const toggle = (v: PrStatus) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-1"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Status"
      >
        <span>Status</span>
        {value.length > 0 && (
          <span
            data-testid="status-count"
            className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
          >
            {value.length}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </Button>
      {open && (
        <div
          role="listbox"
          aria-label="Status options"
          className="absolute z-30 mt-1 w-60 rounded-md border bg-popover p-1 shadow-md"
        >
          {STATUS_OPTIONS.map((opt) => {
            const checked = value.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                  checked && "bg-accent/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                  aria-hidden="true"
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-sm px-2 py-1.5 text-center text-xs text-muted-foreground hover:bg-accent"
            >
              Clear status
            </button>
          )}
        </div>
      )}
    </div>
  );
}
