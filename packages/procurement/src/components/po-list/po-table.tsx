"use client";

import { Inbox } from "lucide-react";
import type { PurchaseOrder } from "../../types";
import { formatInr, formatRelativeDate } from "../../lib/po-utils";
import { PoStatusBadge } from "./po-status-badge";

export interface PoTableProps {
  rows: PurchaseOrder[];
  loading?: boolean;
  now?: Date;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function PoTable({
  rows,
  loading = false,
  now,
  emptyTitle = "No purchase orders yet",
  emptyDescription = "When you issue a PO to a supplier, it will appear here with status and delivery tracking.",
}: PoTableProps) {
  if (!loading && rows.length === 0) {
    return (
      <div
        data-testid="po-empty-state"
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Inbox className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-gray-900">{emptyTitle}</h2>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="po-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <th className="text-left px-5 py-3 font-medium">PO #</th>
            <th className="text-left px-5 py-3 font-medium">Supplier</th>
            <th className="text-right px-5 py-3 font-medium">Value</th>
            <th className="text-left px-5 py-3 font-medium">Status</th>
            <th className="text-left px-5 py-3 font-medium">Delivery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading && rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                Loading purchase orders…
              </td>
            </tr>
          ) : (
            rows.map((po) => (
              <tr key={po.poNo} data-testid="po-row" className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">
                  {po.poNo}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{po.supplier}</td>
                <td className="px-5 py-3 text-right font-semibold text-gray-900 tabular-nums">
                  {formatInr(po.value)}
                </td>
                <td className="px-5 py-3">
                  <PoStatusBadge status={po.status} />
                </td>
                <td className="px-5 py-3 text-gray-600">
                  <span className="capitalize">{formatRelativeDate(po.deliveryDate, now)}</span>
                  <span className="ml-2 text-xs text-gray-400">{po.deliveryDate}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
