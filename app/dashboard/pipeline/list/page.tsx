import Link from "next/link";
import { DealsTable } from "@/components/pipeline/deals-table";
import { mockDeals } from "@/lib/mock-data";

export default function DealsListPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Deals</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            All deals across your pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/pipeline"
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--accent)] transition-colors"
          >
            Kanban View
          </Link>
          <Link
            href="/dashboard/deals/new"
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            + New Deal
          </Link>
        </div>
      </div>
      <DealsTable deals={mockDeals} />
    </div>
  );
}
