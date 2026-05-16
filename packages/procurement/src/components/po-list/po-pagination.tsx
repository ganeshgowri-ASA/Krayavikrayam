"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PoPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PoPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PoPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <div
      data-testid="po-pagination"
      className={cn(
        "flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500",
        className,
      )}
    >
      <span>
        Showing <span className="font-medium text-gray-900">{start}</span>–
        <span className="font-medium text-gray-900">{end}</span> of{" "}
        <span className="font-medium text-gray-900">{total}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={atStart}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </button>
        <span>
          Page <span className="font-medium text-gray-900">{page}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </span>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={atEnd}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
