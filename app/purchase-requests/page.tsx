import { MswBoot } from "./msw-boot";
import { PurchaseRequestList } from "./pr-list";

export const metadata = {
  title: "Purchase Requests · Krayavikrayam",
  description: "List, filter, and triage purchase requests.",
};

export default function PurchaseRequestsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review and act on PRs across plants and requesters.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Create PR
        </button>
      </header>
      <MswBoot>
        <PurchaseRequestList />
      </MswBoot>
    </main>
  );
}
