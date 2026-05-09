import type {
  Grn,
  Invoice,
  PoDetail,
  PoListItem,
  PoStatus,
  MatchStatus,
  PaymentStatus,
  PoLine,
} from "./types";

const SUPPLIERS = [
  { id: "s1", name: "Acme Steel Works", country: "IN" },
  { id: "s2", name: "Bharat Fasteners Ltd", country: "IN" },
  { id: "s3", name: "Stuttgart Precision GmbH", country: "DE" },
  { id: "s4", name: "Suzhou Electronics Co", country: "CN" },
  { id: "s5", name: "Monterrey Metals SA", country: "MX" },
  { id: "s6", name: "Yokohama Components KK", country: "JP" },
];

const PLANTS = [
  { id: "p1", name: "Pune Plant", country: "IN", city: "Pune" },
  { id: "p2", name: "Stuttgart Plant", country: "DE", city: "Stuttgart" },
  { id: "p3", name: "Suzhou Plant", country: "CN", city: "Suzhou" },
  { id: "p4", name: "Monterrey Plant", country: "MX", city: "Monterrey" },
];

const BUYERS = [
  { id: "u1", name: "Aanya Sharma", email: "aanya@krayavikrayam.com" },
  { id: "u2", name: "Rohan Patel", email: "rohan@krayavikrayam.com" },
  { id: "u3", name: "Mei Lin", email: "mei@krayavikrayam.com" },
  { id: "u4", name: "Diego Rivera", email: "diego@krayavikrayam.com" },
];

const MATERIALS = [
  { code: "MAT-1001", description: "Cold-rolled steel coil 1.2mm", uom: "MT" },
  { code: "MAT-1002", description: "Hex bolt M12x60 grade 8.8", uom: "EA" },
  { code: "MAT-1003", description: "PCB FR-4 4-layer", uom: "EA" },
  { code: "MAT-1004", description: "Lithium-ion cell 18650 3000mAh", uom: "EA" },
  { code: "MAT-1005", description: "Aluminum extrusion 6063 T5", uom: "M" },
];

const STATUSES: PoStatus[] = [
  "Draft",
  "Issued",
  "Issued",
  "PartiallyReceived",
  "PartiallyReceived",
  "Closed",
  "Cancelled",
];

const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Advance 20%"];
const INCO_TERMS = ["FOB", "CIF", "DAP", "EXW"];

const TOTAL_POS = 137;

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

function dayIso(offsetDays: number): string {
  const d = new Date(Date.UTC(2026, 0, 15));
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function dateTimeIso(offsetDays: number, hourUtc = 9): string {
  const d = new Date(Date.UTC(2026, 0, 15, hourUtc));
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString();
}

function currencyFor(country: string): string {
  switch (country) {
    case "IN":
      return "INR";
    case "DE":
      return "EUR";
    case "CN":
      return "CNY";
    case "MX":
      return "MXN";
    case "JP":
      return "JPY";
    default:
      return "USD";
  }
}

function buildLines(seed: number, currency: string): PoLine[] {
  const lineCount = (seed % 3) + 1;
  return Array.from({ length: lineCount }, (_, k) => {
    const material = pick(MATERIALS, seed + k);
    const quantityOrdered = 100 + ((seed * 13 + k * 7) % 900);
    const unitPriceAmount = 25 + ((seed * 11 + k * 5) % 475);
    const taxRate = [0, 5, 12, 18][k % 4]!;
    const fillStage = seed % 4;
    const quantityReceived =
      fillStage === 0
        ? 0
        : fillStage === 1
        ? Math.floor(quantityOrdered * 0.5)
        : quantityOrdered;
    const quantityInvoiced =
      fillStage === 0
        ? 0
        : fillStage === 1
        ? 0
        : fillStage === 2
        ? Math.floor(quantityOrdered * 0.5)
        : quantityOrdered;
    return {
      id: `pol-${seed}-${k + 1}`,
      lineNo: k + 1,
      material,
      quantityOrdered,
      quantityReceived,
      quantityInvoiced,
      unitPrice: { amount: unitPriceAmount, currency },
      taxRate,
      lineValue: { amount: unitPriceAmount * quantityOrdered, currency },
      deliveryDate: dayIso(((seed + k * 3) % 60) - 5),
      notes: k === 0 && seed % 5 === 0 ? "Expedite delivery" : undefined,
    };
  });
}

function matchStatusFor(status: PoStatus, seed: number): MatchStatus {
  if (status === "Draft" || status === "Cancelled") return "NotApplicable";
  const r = seed % 5;
  if (r === 0) return "Unmatched";
  if (r === 1 || r === 2) return "PartiallyMatched";
  return "Matched";
}

function paymentStatusFor(status: PoStatus, seed: number): PaymentStatus {
  if (status === "Draft" || status === "Cancelled") return "NotDue";
  const r = seed % 6;
  if (r === 0) return "OnHold";
  if (r === 1) return "PartiallyPaid";
  if (r === 2) return "Paid";
  if (r === 3) return "Due";
  return "NotDue";
}

interface PoSeed {
  detail: PoDetail;
  list: PoListItem;
  grns: Grn[];
  invoices: Invoice[];
}

function buildPo(i: number): PoSeed {
  const supplier = pick(SUPPLIERS, i);
  const plant = pick(PLANTS, i + 1);
  const buyer = pick(BUYERS, i + 2);
  const status = pick(STATUSES, i);
  const currency = currencyFor(plant.country);
  const incoTerms = pick(INCO_TERMS, i);
  const paymentTerms = pick(PAYMENT_TERMS, i);
  const lines = buildLines(i + 1, currency);
  const subtotal = lines.reduce((sum, l) => sum + l.lineValue.amount, 0);
  const taxTotal = lines.reduce(
    (sum, l) => sum + (l.lineValue.amount * l.taxRate) / 100,
    0
  );
  const total = subtotal + taxTotal;
  const issueOffset = -90 + ((i * 11) % 80);
  const deliveryOffset = issueOffset + 14 + ((i * 3) % 30);
  const poNo = `PO-2026-${String(i + 1).padStart(5, "0")}`;
  const matchStatus = matchStatusFor(status, i);
  const paymentStatus = paymentStatusFor(status, i);
  const paid =
    paymentStatus === "Paid"
      ? total
      : paymentStatus === "PartiallyPaid"
      ? Math.round(total * 0.4)
      : 0;

  const grns: Grn[] =
    status === "PartiallyReceived" || status === "Closed"
      ? [
          {
            id: `grn-${i + 1}-1`,
            grnNo: `GRN-2026-${String((i + 1) * 10).padStart(5, "0")}`,
            poNo,
            receivedAt: dateTimeIso(issueOffset + 7),
            receivedBy: pick(BUYERS, i + 1),
            lines: lines.map((l) => ({
              poLineId: l.id,
              quantity: l.quantityReceived || Math.floor(l.quantityOrdered * 0.5),
              condition: i % 7 === 0 ? "Damaged" : "OK",
              remarks: i % 7 === 0 ? "2 cartons crushed in transit" : undefined,
            })),
            attachments:
              i % 4 === 0
                ? [
                    {
                      name: "delivery-note.pdf",
                      url: `https://files.example.com/grn/${i + 1}/note.pdf`,
                    },
                  ]
                : [],
          },
        ]
      : [];

  if (status === "Closed" && i % 3 === 0) {
    grns.push({
      id: `grn-${i + 1}-2`,
      grnNo: `GRN-2026-${String((i + 1) * 10 + 1).padStart(5, "0")}`,
      poNo,
      receivedAt: dateTimeIso(issueOffset + 14),
      receivedBy: pick(BUYERS, i + 2),
      lines: lines.map((l) => ({
        poLineId: l.id,
        quantity: Math.max(0, l.quantityOrdered - Math.floor(l.quantityOrdered * 0.5)),
        condition: "OK",
      })),
      attachments: [],
    });
  }

  const invoices: Invoice[] =
    status === "Closed" || (status === "PartiallyReceived" && i % 2 === 0)
      ? [
          {
            id: `inv-${i + 1}-1`,
            invoiceNo: `SUP-INV-${String(i + 1).padStart(5, "0")}-A`,
            poNo,
            invoiceDate: dayIso(issueOffset + 10),
            dueDate: dayIso(issueOffset + 40),
            lines: lines.map((l) => ({
              poLineId: l.id,
              quantity: Math.min(l.quantityOrdered, l.quantityReceived || l.quantityOrdered),
              unitPrice: l.unitPrice,
              taxRate: l.taxRate,
              lineTotal: {
                amount:
                  l.unitPrice.amount *
                  Math.min(l.quantityOrdered, l.quantityReceived || l.quantityOrdered) *
                  (1 + l.taxRate / 100),
                currency,
              },
            })),
            subtotal: { amount: subtotal, currency },
            taxTotal: { amount: taxTotal, currency },
            total: { amount: total, currency },
            status:
              paymentStatus === "Paid"
                ? "Paid"
                : matchStatus === "Unmatched"
                ? "UnderReview"
                : "Approved",
            attachments: [
              {
                name: "invoice.pdf",
                url: `https://files.example.com/inv/${i + 1}.pdf`,
              },
            ],
          },
        ]
      : [];

  const detail: PoDetail = {
    poNo,
    status,
    issueDate: dayIso(issueOffset),
    deliveryDate: dayIso(deliveryOffset),
    currency,
    incoTerms,
    paymentTerms,
    notes: i % 6 === 0 ? "Critical priority — confirm acknowledgement within 24h." : undefined,
    createdBy: buyer,
    createdAt: dateTimeIso(issueOffset - 2),
    updatedAt: dateTimeIso(issueOffset + Math.min(grns.length, 2) * 7),
    supplier: {
      ...supplier,
      contact: {
        id: `${supplier.id}-c1`,
        name: `${supplier.name.split(" ")[0]} Sales`,
        email: `sales@${supplier.id}.example.com`,
      },
    },
    plant,
    buyer,
    lines,
    subtotal: { amount: subtotal, currency },
    taxTotal: { amount: taxTotal, currency },
    total: { amount: total, currency },
    match: {
      status: matchStatus,
      tolerancePct: 2.0,
      mismatches:
        matchStatus === "Matched" || matchStatus === "NotApplicable"
          ? []
          : [
              {
                lineId: lines[0]!.id,
                dimension: "quantity",
                poValue: lines[0]!.quantityOrdered,
                grnValue: lines[0]!.quantityReceived,
                invoiceValue: lines[0]!.quantityInvoiced,
                deltaPct: 5.5,
              },
            ],
      lastEvaluatedAt: dateTimeIso(issueOffset + 12),
    },
    payment: {
      status: paymentStatus,
      dueDate: dayIso(issueOffset + 40),
      paidAmount: { amount: paid, currency },
      outstandingAmount: { amount: total - paid, currency },
      lastPaymentAt: paid > 0 ? dateTimeIso(issueOffset + 35) : null,
    },
    rfqId: i % 3 === 0 ? `rfq-${(i % 50) + 1}` : undefined,
    prIds: i % 4 === 0 ? [`pr-${(i % 30) + 1}`] : undefined,
  };

  const list: PoListItem = {
    poNo,
    supplier: { id: supplier.id, name: supplier.name, country: supplier.country },
    plant: { id: plant.id, name: plant.name },
    value: { amount: total, currency },
    status,
    issueDate: detail.issueDate,
    deliveryDate: detail.deliveryDate,
    grnCount: grns.length,
    invoiceCount: invoices.length,
    matchStatus,
  };

  return { detail, list, grns, invoices };
}

const SEEDS: PoSeed[] = Array.from({ length: TOTAL_POS }, (_, i) => buildPo(i));

export const MOCK_PO_DETAILS: PoDetail[] = SEEDS.map((s) => s.detail);
export const MOCK_PO_LIST: PoListItem[] = SEEDS.map((s) => s.list);
export const MOCK_PO_GRNS: Record<string, Grn[]> = Object.fromEntries(
  SEEDS.map((s) => [s.detail.poNo, s.grns])
);
export const MOCK_PO_INVOICES: Record<string, Invoice[]> = Object.fromEntries(
  SEEDS.map((s) => [s.detail.poNo, s.invoices])
);

export function findPoDetail(poNo: string): PoDetail | undefined {
  return MOCK_PO_DETAILS.find((p) => p.poNo === poNo);
}
