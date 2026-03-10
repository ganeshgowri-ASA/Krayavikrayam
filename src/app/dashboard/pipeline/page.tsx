import Link from "next/link";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { mockPipeline, mockDeals } from "@/lib/mock-data";

export default function PipelinePage() {
  const openDeals = mockDeals.filter((d) => d.status === "OPEN");

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {mockPipeline.name} &middot; {openDeals.length} open deals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/pipeline/list"
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--accent)] transition-colors"
          >
            List View
          </Link>
          <Link
            href="/dashboard/deals/new"
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            + New Deal
          </Link>
        </div>
      </div>
      <KanbanBoard stages={mockPipeline.stages} initialDeals={openDeals} />
    </div>
  );
}
