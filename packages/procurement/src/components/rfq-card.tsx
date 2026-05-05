"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rfq } from "../types";
import { RfqStatusBadge } from "./status-badge";
import { SlaCountdown } from "./sla-countdown";
import { ValueChip } from "./value-chip";
import { CollaboratorCountBadge } from "./collaborator-count-badge";

export interface RfqCardProps {
  rfq: Rfq;
  onClick?: (rfq: Rfq) => void;
  onOpenQueries?: (rfq: Rfq) => void;
  className?: string;
}

export function RfqCard({ rfq, onClick, onOpenQueries, className }: RfqCardProps) {
  return (
    <article
      data-testid="rfq-card"
      data-rfq-id={rfq.id}
      onClick={() => onClick?.(rfq)}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
        onClick && "cursor-pointer",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">{rfq.number}</p>
          <h3 className="truncate text-sm font-semibold text-foreground">{rfq.title}</h3>
        </div>
        <RfqStatusBadge status={rfq.status} />
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div>
          <dt className="font-medium text-foreground/70">Buyer</dt>
          <dd className="truncate">{rfq.buyer.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground/70">Plant</dt>
          <dd className="truncate">
            {rfq.plant.name} · {rfq.plant.country}
          </dd>
        </div>
      </dl>

      <footer className="flex flex-wrap items-center gap-2">
        <SlaCountdown dueDate={rfq.dueDate} />
        <ValueChip value={rfq.estimatedValue} />
        <CollaboratorCountBadge collaborators={rfq.collaborators} />
        {rfq.openQueriesCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenQueries?.(rfq);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
          >
            <MessageSquare className="h-3 w-3" aria-hidden />
            {rfq.openQueriesCount} open
          </button>
        )}
      </footer>
    </article>
  );
}
