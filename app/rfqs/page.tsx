import { MOCK_RFQS } from "@procurement/api/mock";
import {
  applyRfqListFilters,
  paginate,
  parsePositiveInt,
  parseRfqListFilters,
  RFQ_LIST_DEFAULT_PAGE_SIZE,
  RFQ_LIST_MAX_PAGE_SIZE,
  uniqCategories,
  type RfqListSearchParams,
} from "@procurement/lib/rfq-list";
import { RfqTable } from "./rfq-table";
import { RfqPagination } from "./pagination";
import { RfqFilters } from "./filters";

export const metadata = {
  title: "RFQs · Krayavikrayam",
  description: "List of Requests for Quote with status, suppliers and deadline.",
};

export const dynamic = "force-dynamic";

export default function RfqsPage({
  searchParams,
}: {
  searchParams?: RfqListSearchParams;
}) {
  const params = searchParams ?? {};
  const filters = parseRfqListFilters(params);

  const pageSize = Math.min(
    parsePositiveInt(params.pageSize, RFQ_LIST_DEFAULT_PAGE_SIZE),
    RFQ_LIST_MAX_PAGE_SIZE
  );
  const requestedPage = parsePositiveInt(params.page, 1);

  const filtered = applyRfqListFilters(MOCK_RFQS, filters);
  const result = paginate(filtered, requestedPage, pageSize);

  const categories = uniqCategories(MOCK_RFQS);

  const baseQuery: Record<string, string | number | string[] | undefined> = {
    status: filters.status,
    category: filters.category,
    q: filters.search,
    pageSize,
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">RFQs</h1>
          <p className="text-sm text-muted-foreground" data-testid="rfq-list-summary">
            {result.total} matching RFQ{result.total === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <RfqFilters categories={categories} pageSize={pageSize} />

      <RfqTable rows={result.rows} />

      <RfqPagination
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        total={result.total}
        start={result.start}
        end={result.end}
        baseQuery={baseQuery}
      />
    </div>
  );
}
