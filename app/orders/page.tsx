import { PurchaseOrderListPage } from "@procurement/index";

export const metadata = {
  title: "Orders · Purchase Orders",
  description: "Issued purchase orders across suppliers with status and delivery tracking.",
};

export default function OrdersRoute() {
  return <PurchaseOrderListPage />;
}
