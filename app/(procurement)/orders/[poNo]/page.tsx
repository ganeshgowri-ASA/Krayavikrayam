import { OrderDetailPage } from "@procurement/index";

export const metadata = {
  title: "Procurement · Purchase Order Detail",
  description:
    "Purchase order detail view (header, lines, GRNs, invoices, 3-way match, payment) backed by the KV-E1.6 MSW mock API.",
};

interface Params {
  params: { poNo: string };
}

export default function OrderDetailRoutePage({ params }: Params) {
  return <OrderDetailPage poNo={params.poNo} />;
}
