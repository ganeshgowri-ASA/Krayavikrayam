"use client";

import { FileText, PackageCheck, Receipt } from "lucide-react";
import type { OrdersKpis } from "../../types";
import { useOrdersKpis } from "../../api/client";
import { KpiCard } from "../kpi-card";

interface KpiSpec {
  key: keyof OrdersKpis;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClassName: string;
  testId: string;
}

const KPIS: KpiSpec[] = [
  {
    key: "openPoCount",
    label: "Open POs",
    hint: "Purchase orders awaiting fulfilment",
    icon: FileText,
    accentClassName: "bg-blue-50 text-blue-700 ring-blue-100",
    testId: "kpi-open-pos",
  },
  {
    key: "grnPendingCount",
    label: "GRN pending",
    hint: "Goods receipt notes awaiting confirmation",
    icon: PackageCheck,
    accentClassName: "bg-amber-50 text-amber-700 ring-amber-100",
    testId: "kpi-grn-pending",
  },
  {
    key: "invoicesPendingCount",
    label: "Invoices pending",
    hint: "Supplier invoices awaiting 3-way match",
    icon: Receipt,
    accentClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    testId: "kpi-invoices-pending",
  },
];

export function OrdersPageShell() {
  const { data, isLoading, isError } = useOrdersKpis();

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-8" data-testid="orders-page">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          PO list, PO detail, GRN, Invoice/3-way match, payment status.
        </p>
      </header>

      <section
        aria-label="Order KPIs"
        data-testid="orders-kpis"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {KPIS.map((spec) => (
          <KpiCard
            key={spec.key}
            label={spec.label}
            hint={spec.hint}
            icon={spec.icon}
            accentClassName={spec.accentClassName}
            isLoading={isLoading}
            value={isError ? null : data?.[spec.key]}
            testId={spec.testId}
          />
        ))}
      </section>

      {isError && (
        <p
          role="alert"
          data-testid="orders-kpis-error"
          className="mt-4 text-sm text-red-600"
        >
          Could not load KPI counts. Please retry.
        </p>
      )}
    </main>
  );
}
