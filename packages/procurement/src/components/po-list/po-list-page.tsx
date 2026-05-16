"use client";

import { useState } from "react";
import { usePurchaseOrders } from "../../api/po-client";
import { PoTable } from "./po-table";
import { PoPagination } from "./po-pagination";

export interface PoListPageProps {
  pageSize?: number;
  now?: Date;
}

export function PoListPage({ pageSize = 10, now }: PoListPageProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePurchaseOrders({ page, pageSize });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All issued POs across suppliers.
        </p>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <PoTable rows={rows} loading={isLoading} now={now} />
        {total > 0 && (
          <PoPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
