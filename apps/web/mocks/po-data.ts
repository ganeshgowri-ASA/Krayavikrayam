import type { PurchaseOrderDetail } from "../lib/types";

const PO_2025_00042: PurchaseOrderDetail = {
  header: {
    poNo: "PO-2025-00042",
    status: "Partially Received",
    supplier: { name: "Acme Steel Co.", code: "SUP-1042" },
    plant: "PLNT-MUM-01",
    buyer: "Priya Nair",
    currency: "INR",
    value: 1_250_000,
    issuedAt: "2025-04-12",
    expectedDelivery: "2025-05-15",
    paymentTerms: "Net 30",
    incoterm: "FOB Mumbai",
  },
  lines: [
    {
      lineNo: 1,
      itemCode: "STL-RD-12",
      description: "Steel rod, 12mm, TMT grade Fe550",
      uom: "MT",
      qtyOrdered: 50,
      qtyReceived: 30,
      qtyInvoiced: 30,
      unitPrice: 18_000,
      lineTotal: 900_000,
      deliveryDate: "2025-05-10",
    },
    {
      lineNo: 2,
      itemCode: "STL-PL-08",
      description: "Steel plate, 8mm, hot-rolled",
      uom: "MT",
      qtyOrdered: 20,
      qtyReceived: 20,
      qtyInvoiced: 20,
      unitPrice: 17_500,
      lineTotal: 350_000,
      deliveryDate: "2025-05-15",
    },
  ],
  grns: [
    {
      grnNo: "GRN-2025-00118",
      receivedAt: "2025-04-28",
      receivedBy: "R. Kulkarni",
      status: "Posted",
      lines: [
        { lineNo: 1, qty: 30 },
        { lineNo: 2, qty: 20 },
      ],
    },
  ],
  invoices: [
    {
      invoiceNo: "INV-AC-99231",
      invoiceDate: "2025-04-29",
      dueDate: "2025-05-29",
      amount: 540_000,
      currency: "INR",
      status: "Approved",
      matchStatus: "Matched",
    },
    {
      invoiceNo: "INV-AC-99244",
      invoiceDate: "2025-04-30",
      dueDate: "2025-05-30",
      amount: 350_000,
      currency: "INR",
      status: "Paid",
      matchStatus: "Matched",
    },
  ],
  match: [
    {
      lineNo: 1,
      qtyOrdered: 50,
      qtyReceived: 30,
      qtyInvoiced: 30,
      priceOrdered: 18_000,
      priceInvoiced: 18_000,
      qtyVariance: 0,
      priceVariance: 0,
      result: "OK",
    },
    {
      lineNo: 2,
      qtyOrdered: 20,
      qtyReceived: 20,
      qtyInvoiced: 20,
      priceOrdered: 17_500,
      priceInvoiced: 17_500,
      qtyVariance: 0,
      priceVariance: 0,
      result: "OK",
    },
  ],
  payment: {
    totalInvoiced: 890_000,
    totalPaid: 350_000,
    outstanding: 540_000,
    nextDueDate: "2025-05-29",
    state: "Partially Paid",
  },
};

const PO_2025_00043: PurchaseOrderDetail = {
  header: {
    poNo: "PO-2025-00043",
    status: "Issued",
    supplier: { name: "Bharat Polymers Ltd.", code: "SUP-2207" },
    plant: "PLNT-PUN-02",
    buyer: "Anil Mehta",
    currency: "INR",
    value: 420_000,
    issuedAt: "2025-05-01",
    expectedDelivery: "2025-05-25",
    paymentTerms: "Net 45",
    incoterm: "DAP Pune",
  },
  lines: [
    {
      lineNo: 1,
      itemCode: "PLY-HDPE-25",
      description: "HDPE granules, natural, 25kg bag",
      uom: "BAG",
      qtyOrdered: 200,
      qtyReceived: 0,
      qtyInvoiced: 0,
      unitPrice: 2_100,
      lineTotal: 420_000,
      deliveryDate: "2025-05-25",
    },
  ],
  grns: [],
  invoices: [],
  match: [
    {
      lineNo: 1,
      qtyOrdered: 200,
      qtyReceived: 0,
      qtyInvoiced: 0,
      priceOrdered: 2_100,
      priceInvoiced: 0,
      qtyVariance: 0,
      priceVariance: 0,
      result: "OK",
    },
  ],
  payment: {
    totalInvoiced: 0,
    totalPaid: 0,
    outstanding: 0,
    nextDueDate: null,
    state: "Unpaid",
  },
};

const FIXTURES: Record<string, PurchaseOrderDetail> = {
  [PO_2025_00042.header.poNo]: PO_2025_00042,
  [PO_2025_00043.header.poNo]: PO_2025_00043,
};

export function getPurchaseOrderFixture(
  poNo: string,
): PurchaseOrderDetail | null {
  return FIXTURES[poNo] ?? null;
}

export function listFixturePoNumbers(): string[] {
  return Object.keys(FIXTURES);
}
