import { RfqsClient } from "./rfqs-client";
import { parseFiltersFromParams } from "./url-filters";

export const metadata = {
  title: "RFQs · Krayavikrayam",
  description: "Request for Quotes with status, category, and deadline filters.",
};

export default function RfqsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const initialFilters = parseFiltersFromParams(searchParams ?? {});
  return <RfqsClient initialFilters={initialFilters} />;
}
