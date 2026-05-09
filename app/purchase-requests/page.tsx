import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PurchaseRequestTabs } from "./tabs";

export const metadata = {
  title: "Purchase Requests · Krayavikrayam",
  description: "Browse purchase requests by status — Draft, Pending for approval, Under rework, Need clarification.",
};

export default function PurchaseRequestsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Purchase Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and approve purchase requests across plants and requesters.
          </p>
        </div>
        <Link
          href="/purchase-requests/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New purchase request
        </Link>
      </header>

      <section className="mt-8">
        <Suspense fallback={<div className="h-10" aria-hidden="true" />}>
          <PurchaseRequestTabs />
        </Suspense>
      </section>
    </main>
  );
}
