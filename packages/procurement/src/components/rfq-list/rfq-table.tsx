"use client";

import { useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rfq } from "../../types";
import { formatMoney } from "../../lib/utils";
import { RfqStatusBadge } from "../status-badge";
import { SlaCountdown } from "../sla-countdown";
import { ValueChip } from "../value-chip";
import { CollaboratorCountBadge } from "../collaborator-count-badge";

const ROW_HEIGHT = 56;

export interface RfqTableProps {
  rows: Rfq[];
  onRowClick?: (rfq: Rfq) => void;
  height?: number;
}

export function RfqTable({ rows, onRowClick, height = 600 }: RfqTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dueDate", desc: false },
  ]);

  const columns = useMemo<ColumnDef<Rfq>[]>(
    () => [
      {
        accessorKey: "number",
        header: "RFQ",
        size: 160,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.number}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 320,
        cell: ({ row }) => (
          <span className="truncate font-medium">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ row }) => <RfqStatusBadge status={row.original.status} />,
      },
      {
        id: "buyer",
        accessorFn: (r) => r.buyer.name,
        header: "Buyer",
        size: 160,
        cell: ({ row }) => row.original.buyer.name,
      },
      {
        id: "plant",
        accessorFn: (r) => `${r.plant.name} (${r.plant.country})`,
        header: "Plant",
        size: 180,
      },
      {
        id: "value",
        accessorFn: (r) => r.estimatedValue.amount,
        header: "Est. value",
        size: 140,
        cell: ({ row }) => <ValueChip value={row.original.estimatedValue} />,
        sortingFn: (a, b) =>
          a.original.estimatedValue.amount - b.original.estimatedValue.amount,
      },
      {
        accessorKey: "dueDate",
        header: "Due",
        size: 160,
        cell: ({ row }) => <SlaCountdown dueDate={row.original.dueDate} />,
        sortingFn: (a, b) =>
          new Date(a.original.dueDate).getTime() -
          new Date(b.original.dueDate).getTime(),
      },
      {
        id: "collaborators",
        header: "Team",
        size: 80,
        cell: ({ row }) => (
          <CollaboratorCountBadge collaborators={row.original.collaborators} />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { rows: tableRows } = table.getRowModel();
  const virtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const totalSize = virtualizer.getTotalSize();
  const items = virtualizer.getVirtualItems();
  const paddingTop = items[0]?.start ?? 0;
  const paddingBottom = items.length ? totalSize - (items[items.length - 1]!.end ?? 0) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-auto rounded-lg border bg-card"
      style={{ height }}
      data-testid="rfq-table"
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{ width: h.getSize() }}
                  className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  <button
                    type="button"
                    onClick={h.column.getToggleSortingHandler()}
                    className={cn(
                      "inline-flex items-center gap-1",
                      h.column.getCanSort() && "cursor-pointer hover:text-foreground"
                    )}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getCanSort() && (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr aria-hidden>
              <td colSpan={columns.length} style={{ height: paddingTop }} />
            </tr>
          )}
          {items.map((vi) => {
            const row = tableRows[vi.index]!;
            return (
              <tr
                key={row.id}
                data-testid="rfq-row"
                onClick={() => onRowClick?.(row.original)}
                style={{ height: ROW_HEIGHT }}
                className="cursor-pointer border-b transition hover:bg-accent/40"
              >
                {row.getVisibleCells().map((c) => (
                  <td key={c.id} className="truncate px-3 py-2 align-middle">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr aria-hidden>
              <td colSpan={columns.length} style={{ height: paddingBottom }} />
            </tr>
          )}
          {tableRows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                No RFQs match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
