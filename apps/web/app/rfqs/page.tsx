export default function RFQsPage() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">RFQs</h1>
        <button
          type="button"
          className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Create RFQ
        </button>
      </header>
      <section className="rounded-lg border p-6 text-sm text-muted-foreground">
        RFQ list shell. Per PRD-v3 §6, this page will host the RFQ list with
        filters, status tabs, and a publish wizard entry point.
      </section>
    </main>
  );
}
