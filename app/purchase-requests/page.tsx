import { Suspense } from "react";
import { PrFilterBar } from "./_components/filter-bar";
import type { NamedOption } from "./_components/types";

export const metadata = {
  title: "Purchase Requests · Krayavikrayam",
  description: "Browse and filter purchase requests.",
};

const REQUESTERS: NamedOption[] = [
  { value: "u-aarav", label: "Aarav Mehta" },
  { value: "u-isha", label: "Isha Rao" },
  { value: "u-kabir", label: "Kabir Shah" },
  { value: "u-meera", label: "Meera Iyer" },
  { value: "u-nikhil", label: "Nikhil Verma" },
  { value: "u-priya", label: "Priya Nair" },
  { value: "u-rohan", label: "Rohan Gupta" },
  { value: "u-sneha", label: "Sneha Joshi" },
];

const PLANTS: NamedOption[] = [
  { value: "P-BLR1", label: "Bengaluru — Plant 1" },
  { value: "P-PUN1", label: "Pune — Plant 1" },
  { value: "P-CHN1", label: "Chennai — Plant 1" },
  { value: "P-HYD1", label: "Hyderabad — Plant 1" },
];

export default function PurchaseRequestsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
          <p className="text-sm text-muted-foreground">
            Filter, find, and triage incoming PRs.
          </p>
        </div>
      </header>

      <Suspense fallback={null}>
        <PrFilterBar requesters={REQUESTERS} plants={PLANTS} />
      </Suspense>

      <div
        data-testid="pr-table-placeholder"
        className="rounded-lg border bg-card p-6 text-sm text-muted-foreground"
      >
        Purchase request table will appear here.
      </div>
    </div>
  );
}
