import type { Metadata } from "next";
import { OrdersPageShell } from "@procurement/index";

export const metadata: Metadata = {
  title: "Orders — Krayavikrayam",
  description:
    "Procurement orders shell: PO list, GRN, Invoice/3-way match, payment status. Per PRD v3 §7.",
};

export default function OrdersRoutePage() {
  return <OrdersPageShell />;
}
