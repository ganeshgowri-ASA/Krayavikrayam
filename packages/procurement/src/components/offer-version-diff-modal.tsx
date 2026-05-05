"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOfferVersions } from "../api/client";
import { formatMoney } from "../lib/utils";
import type { OfferLine, OfferVersion } from "../types";
import { Drawer } from "./drawer";

interface DiffRow {
  field: string;
  left: string;
  right: string;
  changed: boolean;
}

function lineKey(l: OfferLine) {
  return l.materialCode;
}

function buildDiff(a: OfferVersion, b: OfferVersion): DiffRow[] {
  const rows: DiffRow[] = [];
  const push = (field: string, left: string, right: string) =>
    rows.push({ field, left, right, changed: left !== right });

  push("Submitted at", a.submittedAt, b.submittedAt);
  push("Total value", formatMoney(a.totalValue), formatMoney(b.totalValue));
  push("Valid until", a.validUntil, b.validUntil);
  push("Notes", a.notes ?? "—", b.notes ?? "—");

  const codes = Array.from(new Set([...a.lines.map(lineKey), ...b.lines.map(lineKey)]));
  for (const code of codes) {
    const la = a.lines.find((l) => l.materialCode === code);
    const lb = b.lines.find((l) => l.materialCode === code);
    push(`${code} · qty`, la ? String(la.quantity) : "—", lb ? String(lb.quantity) : "—");
    push(
      `${code} · unit price`,
      la ? formatMoney(la.unitPrice) : "—",
      lb ? formatMoney(lb.unitPrice) : "—"
    );
    push(
      `${code} · lead time`,
      la ? `${la.leadTimeDays}d` : "—",
      lb ? `${lb.leadTimeDays}d` : "—"
    );
    push(`${code} · incoterm`, la?.incoterm ?? "—", lb?.incoterm ?? "—");
  }
  return rows;
}

export function OfferVersionDiffModal({
  rfqId,
  vendorId,
  open,
  onOpenChange,
}: {
  rfqId: string | null;
  vendorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: versions = [] } = useOfferVersions(rfqId, vendorId);
  const sorted = useMemo(
    () => [...versions].sort((a, b) => a.versionNumber - b.versionNumber),
    [versions]
  );

  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);

  const left =
    sorted.find((v) => v.id === leftId) ?? sorted[sorted.length - 2] ?? sorted[0];
  const right =
    sorted.find((v) => v.id === rightId) ?? sorted[sorted.length - 1];

  const diff = useMemo(() => (left && right ? buildDiff(left, right) : []), [left, right]);
  const changedCount = diff.filter((r) => r.changed).length;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      side="bottom"
      title="Offer version diff"
      description={
        sorted.length > 1
          ? `${changedCount} field${changedCount === 1 ? "" : "s"} changed`
          : "Need at least two versions to compare"
      }
      testId="offer-diff-modal"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      }
    >
      {sorted.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Only one version on file — submit a counter-offer to enable comparison.
        </p>
      )}
      {sorted.length >= 2 && left && right && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm">
            <select
              className="rounded-md border bg-background px-2 py-1 text-xs"
              value={left.id}
              onChange={(e) => setLeftId(e.target.value)}
            >
              {sorted.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.versionNumber}
                </option>
              ))}
            </select>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <select
              className="rounded-md border bg-background px-2 py-1 text-xs"
              value={right.id}
              onChange={(e) => setRightId(e.target.value)}
            >
              {sorted.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.versionNumber}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-1 pr-3 font-medium">Field</th>
                <th className="py-1 pr-3 font-medium">v{left.versionNumber}</th>
                <th className="py-1 pr-3 font-medium">v{right.versionNumber}</th>
              </tr>
            </thead>
            <tbody>
              {diff.map((row) => (
                <tr
                  key={row.field}
                  data-changed={row.changed}
                  className={cn("border-t", row.changed && "bg-amber-50/60")}
                >
                  <td className="py-1.5 pr-3 font-medium">{row.field}</td>
                  <td className="py-1.5 pr-3 text-muted-foreground">{row.left}</td>
                  <td className={cn("py-1.5 pr-3", row.changed && "font-semibold")}>
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Drawer>
  );
}
