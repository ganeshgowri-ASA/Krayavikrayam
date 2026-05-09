import {
  RFQ_STATUSES,
  TBE_CATEGORIES,
  type Rfq,
  type RfqFilters,
} from "./types";

function daysFromNow(days: number): string {
  const d = new Date(Date.UTC(2026, 4, 9));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const TITLES = [
  "Transformer panel sourcing — Pune",
  "20-channel instrumentation refresh — Stuttgart",
  "4-in-1 comparator package — Suzhou",
  "UV-2 spectrophotometer lot — Monterrey",
  "Equipment tracker overhaul — Pune",
  "Generic MRO consumables — Stuttgart",
  "Switchgear cluster — Bengaluru",
  "Field instrumentation — Chennai",
];

export const MOCK_RFQS: Rfq[] = Array.from({ length: 24 }, (_, i) => ({
  id: `rfq-${i + 1}`,
  rfqNo: `RFQ-2026-${String(1000 + i).padStart(5, "0")}`,
  title: TITLES[i % TITLES.length]!,
  category: TBE_CATEGORIES[i % TBE_CATEGORIES.length]!,
  suppliersCount: 2 + ((i * 3) % 7),
  status: RFQ_STATUSES[i % RFQ_STATUSES.length]!,
  deadline: daysFromNow(((i * 11) % 80) - 10),
}));

export function applyFilters(rows: Rfq[], f: RfqFilters): Rfq[] {
  return rows.filter((r) => {
    if (f.status.length && !f.status.includes(r.status)) return false;
    if (f.category.length && !f.category.includes(r.category)) return false;
    if (f.deadlineFrom && r.deadline < f.deadlineFrom) return false;
    if (f.deadlineTo && r.deadline > f.deadlineTo) return false;
    return true;
  });
}
