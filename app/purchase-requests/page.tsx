import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Purchase requests — Krayavikrayam",
};

export default function PurchaseRequestsPage() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link
        href="/"
        aria-label="Back"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <header className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Purchase requests</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create new request
        </Button>
      </header>
    </main>
  );
}
