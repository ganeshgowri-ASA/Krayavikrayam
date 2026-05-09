import { PurchaseRequestsTable } from "./PurchaseRequestsTable";

export const metadata = {
  title: "Purchase Requests · Krayavikrayam",
  description: "Browse purchase requests with server-style pagination.",
};

export default function PurchaseRequestsPage() {
  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Purchase Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All purchase requests across plants. Use pagination to navigate.
        </p>
      </header>
      <PurchaseRequestsTable />
    </main>
  );
}
