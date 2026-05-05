"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FacetOption {
  value: string;
  label: string;
  hint?: string;
}

export function FacetedFilter({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: FacetOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter((x) => x !== v));
    else onChange([...selected, v]);
  };

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{title}</span>
        {selected.length > 0 && (
          <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold">
            {selected.length}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </Button>
      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md"
          onMouseLeave={() => setOpen(false)}
        >
          {options.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">No options</div>
          )}
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                  checked && "bg-accent/60"
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      checked ? "bg-primary border-primary text-primary-foreground" : "border-input"
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span>{opt.label}</span>
                </span>
                {opt.hint && (
                  <span className="text-[10px] text-muted-foreground">{opt.hint}</span>
                )}
              </button>
            );
          })}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-sm px-2 py-1.5 text-center text-xs text-muted-foreground hover:bg-accent"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
