import { OrdersListPage } from "@procurement/index";

export const metadata = {
  title: "Procurement · Purchase Orders",
  description:
    "Purchase orders list backed by the KV-E1.6 MSW mock API. Filters by status, supplier, plant, and date range.",
};

export default function OrdersRoutePage() {
  return <OrdersListPage />;
}
