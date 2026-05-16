import Link from "next/link";
import { buildRfqListQuery, RFQ_LIST_PAGE_SIZE_OPTIONS } from "@procurement/lib/rfq-list";

export interface RfqPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  start: number;
  end: number;
  baseQuery: Record<string, string | number | string[] | undefined>;
}

function href(
  baseQuery: RfqPaginationProps["baseQuery"],
  overrides: Record<string, string | number | undefined>
) {
  return `/rfqs${buildRfqListQuery({ ...baseQuery, ...overrides })}`;
}

export function RfqPagination({
  page,
  pageSize,
  totalPages,
  total,
  start,
  end,
  baseQuery,
}: RfqPaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
      aria-label="Pagination"
      data-testid="rfq-list-pagination"
    >
      <div className="text-muted-foreground">
        {total === 0 ? (
          "0 results"
        ) : (
          <>
            Showing <span className="text-foreground">{start + 1}</span>–
            <span className="text-foreground">{end}</span> of{" "}
            <span className="text-foreground">{total}</span> · page {page} of {totalPages}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <form action="/rfqs" className="flex items-center gap-2">
          {Object.entries(baseQuery).map(([k, v]) => {
            if (k === "page" || k === "pageSize") return null;
            if (v === undefined || v === "" || v === null) return null;
            const value = Array.isArray(v) ? v.join(",") : String(v);
            return <input key={k} type="hidden" name={k} value={value} />;
          })}
          <input type="hidden" name="page" value={1} />
          <label htmlFor="pageSize" className="text-muted-foreground">
            Per page
          </label>
          <select
            id="pageSize"
            name="pageSize"
            defaultValue={pageSize}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {RFQ_LIST_PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-8 rounded-md border bg-background px-3 text-sm hover:bg-accent"
          >
            Apply
          </button>
        </form>
        <div className="flex gap-2">
          {hasPrev ? (
            <Link
              href={href(baseQuery, { page: page - 1 })}
              className="h-8 rounded-md border bg-background px-3 leading-8 hover:bg-accent"
              rel="prev"
            >
              Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="h-8 rounded-md border bg-background px-3 leading-8 text-muted-foreground opacity-50"
            >
              Previous
            </span>
          )}
          {hasNext ? (
            <Link
              href={href(baseQuery, { page: page + 1 })}
              className="h-8 rounded-md border bg-background px-3 leading-8 hover:bg-accent"
              rel="next"
            >
              Next
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="h-8 rounded-md border bg-background px-3 leading-8 text-muted-foreground opacity-50"
            >
              Next
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
