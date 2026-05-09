import type { Metadata } from "next";
import { FileText, PackageCheck, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Orders — Krayavikrayam",
  description:
    "Procurement orders shell: PO list, GRN, Invoice/3-way match, payment status. Per PRD v3 §7.",
};

type Kpi = {
  id: string;
  label: string;
  count: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const kpis: Kpi[] = [
  {
    id: "open-pos",
    label: "Open POs",
    count: 24,
    hint: "Purchase orders awaiting fulfilment",
    icon: FileText,
    accent: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    id: "grn-pending",
    label: "GRN pending",
    count: 11,
    hint: "Goods receipt notes awaiting confirmation",
    icon: PackageCheck,
    accent: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    id: "invoices-pending",
    label: "Invoices pending",
    count: 7,
    hint: "Supplier invoices awaiting 3-way match",
    icon: Receipt,
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
];

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          PO list, PO detail, GRN, Invoice/3-way match, payment status.
        </p>
      </header>

      <section
        aria-label="Order KPIs"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article
              key={kpi.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${kpi.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
                {kpi.count}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
