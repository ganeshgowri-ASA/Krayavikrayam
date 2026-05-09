import { notFound } from "next/navigation";
import Link from "next/link";
import { getPurchaseOrder } from "../../../lib/api";
import { POHeader } from "./_components/POHeader";
import { POLines } from "./_components/POLines";
import { GRNList } from "./_components/GRNList";
import { InvoiceList } from "./_components/InvoiceList";
import { ThreeWayMatch } from "./_components/ThreeWayMatch";
import { PaymentStatus } from "./_components/PaymentStatus";

interface PageProps {
  params: { poNo: string };
}

export default async function PurchaseOrderDetailPage({ params }: PageProps) {
  const detail = await getPurchaseOrder(params.poNo);
  if (!detail) notFound();

  const { header, lines, grns, invoices, match, payment } = detail;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/orders" className="hover:text-slate-700">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{header.poNo}</span>
      </nav>

      <POHeader header={header} />
      <POLines lines={lines} currency={header.currency} />
      <GRNList grns={grns} />
      <InvoiceList invoices={invoices} />
      <ThreeWayMatch rows={match} currency={header.currency} />
      <PaymentStatus summary={payment} currency={header.currency} />
    </main>
  );
}
