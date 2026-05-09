"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NamedOption } from "./types";

export function RequesterTypeahead({
  value,
  options,
  onChange,
}: {
  value: string;
  options: NamedOption[];
  onChange: (next: string) => void;
}) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return options.slice(0, 8);
    return options
      .filter((o) => o.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [text, options]);

  const commit = (next: string) => {
    setText(next);
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (text !== value) onChange(text);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => Math.min(h + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const pick = matches[highlight];
            commit(pick ? pick.label : text);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Requester"
        className="h-9 w-44 text-sm"
        role="combobox"
        aria-label="Requester"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && matches.length > 0 && (
        <ul
          role="listbox"
          aria-label="Requester suggestions"
          className="absolute z-30 mt-1 max-h-56 w-56 overflow-auto rounded-md border bg-popover p-1 shadow-md"
        >
          {matches.map((opt, idx) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={idx === highlight}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(opt.label);
                }}
                onMouseEnter={() => setHighlight(idx)}
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                  idx === highlight && "bg-accent/60"
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
