"use client";

import { Bookmark, BookmarkPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RfqFilters } from "../../types";
import { useSavedViews } from "../../store/saved-views";

export function SavedViewsBar({
  currentFilters,
  onApply,
}: {
  currentFilters: RfqFilters;
  onApply: (filters: RfqFilters) => void;
}) {
  const { views, activeViewId, addView, removeView, setActive } = useSavedViews();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const apply = (id: string) => {
    const v = views.find((x) => x.id === id);
    if (!v) return;
    setActive(id);
    onApply(v.filters);
  };

  const save = () => {
    if (!name.trim()) return;
    const v = addView(name.trim(), currentFilters);
    onApply(v.filters);
    setName("");
    setCreating(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Bookmark className="h-3.5 w-3.5" /> Views:
      </span>
      {views.map((v) => (
        <div key={v.id} className="group relative">
          <button
            type="button"
            onClick={() => apply(v.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition",
              activeViewId === v.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent"
            )}
          >
            {v.name}
          </button>
          <button
            type="button"
            onClick={() => removeView(v.id)}
            aria-label={`Delete view ${v.name}`}
            className="absolute -right-1 -top-1 hidden rounded-full bg-rose-500 p-0.5 text-white group-hover:block"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </button>
        </div>
      ))}
      {creating ? (
        <div className="flex items-center gap-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="View name"
            className="h-7 w-36 text-xs"
            autoFocus
          />
          <Button size="sm" className="h-7" onClick={save}>
            Save
          </Button>
          <Button size="sm" variant="ghost" className="h-7" onClick={() => setCreating(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1 text-xs"
          onClick={() => setCreating(true)}
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          Save view
        </Button>
      )}
    </div>
  );
}
