"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ensureOrdersWorker } from "../../orders/browser";
import {
  useOrder,
  useOrderGrns,
  useOrderInvoices,
} from "../../orders/api";

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

interface Props {
  poNo: string;
}

export function OrderDetailPage({ poNo }: Props) {
  const [workerReady, setWorkerReady] = useState(typeof window === "undefined");

  useEffect(() => {
    const promise = ensureOrdersWorker();
    if (!promise) {
      setWorkerReady(true);
      return;
    }
    let cancelled = false;
    promise
      .then(() => {
        if (!cancelled) setWorkerReady(true);
      })
      .catch(() => {
        if (!cancelled) setWorkerReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const enabledKey = workerReady ? poNo : null;
  const { data: po, isLoading, isError, error } = useOrder(enabledKey);
  const { data: grns = [] } = useOrderGrns(enabledKey);
  const { data: invoices = [] } = useOrderInvoices(enabledKey);

  if (!workerReady || isLoading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-muted-foreground">Loading purchase order…</p>
      </main>
    );
  }

  if (isError) {
    const status = (error as Error)?.message?.includes("404") ? 404 : 0;
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-xl font-semibold">
          {status === 404 ? `PO ${poNo} not found` : "Could not load PO"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {(error as Error)?.message}
        </p>
        <Link href="/orders" className="mt-4 inline-block underline">
          Back to orders
        </Link>
      </main>
    );
  }

  if (!po) return null;

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/orders" className="text-xs text-muted-foreground underline">
            ← Orders
          </Link>
          <h1 className="text-2xl font-bold tracking-tight font-mono">
            {po.poNo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {po.supplier.name} → {po.plant.name} · {po.status} · issued {po.issueDate}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">
            {formatMoney(po.total.amount, po.total.currency)}
          </div>
          <div className="text-xs text-muted-foreground">
            Subtotal {formatMoney(po.subtotal.amount, po.subtotal.currency)} · Tax{" "}
            {formatMoney(po.taxTotal.amount, po.taxTotal.currency)}
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="text-sm font-semibold">Header</h2>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Status</dt><dd>{po.status}</dd></div>
            <div className="flex justify-between"><dt>Issue date</dt><dd>{po.issueDate}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{po.deliveryDate}</dd></div>
            <div className="flex justify-between"><dt>Currency</dt><dd>{po.currency}</dd></div>
            <div className="flex justify-between"><dt>Inco terms</dt><dd>{po.incoTerms}</dd></div>
            <div className="flex justify-between"><dt>Payment</dt><dd>{po.paymentTerms}</dd></div>
            <div className="flex justify-between"><dt>Buyer</dt><dd>{po.buyer.name}</dd></div>
          </dl>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-sm font-semibold">3-way match</h2>
          <p className="mt-2 text-sm">{po.match.status}</p>
          <p className="text-xs text-muted-foreground">
            Tolerance {po.match.tolerancePct}% · evaluated{" "}
            {po.match.lastEvaluatedAt.slice(0, 10)}
          </p>
          {po.match.mismatches.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {po.match.mismatches.map((m, i) => (
                <li key={i}>
                  Line {m.lineId} · {m.dimension} Δ {m.deltaPct}%
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-sm font-semibold">Payment</h2>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Status</dt><dd>{po.payment.status}</dd></div>
            <div className="flex justify-between"><dt>Due</dt><dd>{po.payment.dueDate}</dd></div>
            <div className="flex justify-between">
              <dt>Paid</dt>
              <dd>{formatMoney(po.payment.paidAmount.amount, po.payment.paidAmount.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Outstanding</dt>
              <dd>
                {formatMoney(
                  po.payment.outstandingAmount.amount,
                  po.payment.outstandingAmount.currency
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-lg border">
        <h2 className="border-b px-4 py-2 text-sm font-semibold">Lines</h2>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Material</th>
              <th className="px-3 py-2 text-right">Ordered</th>
              <th className="px-3 py-2 text-right">Received</th>
              <th className="px-3 py-2 text-right">Invoiced</th>
              <th className="px-3 py-2 text-right">Unit price</th>
              <th className="px-3 py-2 text-right">Line value</th>
            </tr>
          </thead>
          <tbody>
            {po.lines.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-3 py-2">{l.lineNo}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{l.material.code}</div>
                  <div className="text-xs text-muted-foreground">{l.material.description}</div>
                </td>
                <td className="px-3 py-2 text-right">{l.quantityOrdered} {l.material.uom}</td>
                <td className="px-3 py-2 text-right">{l.quantityReceived}</td>
                <td className="px-3 py-2 text-right">{l.quantityInvoiced}</td>
                <td className="px-3 py-2 text-right">
                  {formatMoney(l.unitPrice.amount, l.unitPrice.currency)}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatMoney(l.lineValue.amount, l.lineValue.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border">
          <h2 className="border-b px-4 py-2 text-sm font-semibold">GRNs ({grns.length})</h2>
          {grns.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No GRNs yet.</p>
          ) : (
            <ul className="divide-y">
              {grns.map((g) => (
                <li key={g.id} className="px-4 py-2 text-sm">
                  <div className="font-mono">{g.grnNo}</div>
                  <div className="text-xs text-muted-foreground">
                    Received {g.receivedAt.slice(0, 10)} by {g.receivedBy.name} · {g.lines.length} line(s)
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border">
          <h2 className="border-b px-4 py-2 text-sm font-semibold">
            Invoices ({invoices.length})
          </h2>
          {invoices.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <ul className="divide-y">
              {invoices.map((inv) => (
                <li key={inv.id} className="px-4 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono">{inv.invoiceNo}</span>
                    <span>{formatMoney(inv.total.amount, inv.total.currency)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {inv.invoiceDate} · due {inv.dueDate} · {inv.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
