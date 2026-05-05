import { RfqListPage } from "@procurement/index";

export const metadata = {
  title: "Procurement · RFx Manager",
  description: "RFQ list, faceted filters, vendor 360, offer diff and queries.",
};

export default function ProcurementRouteGroupPage() {
  return <RfqListPage />;
}
