export type PrStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "UNDER_REWORK"
  | "NEEDS_CLARIFICATION"
  | "APPROVED"
  | "REJECTED";

export type PrTab =
  | "all"
  | "draft"
  | "pending"
  | "rework"
  | "clarification";

export interface PurchaseRequest {
  id: string;
  number: string;
  title: string;
  requester: { id: string; name: string };
  plant: { id: string; name: string };
  amount: number;
  currency: string;
  status: PrStatus;
  createdAt: string;
  updatedAt: string;
}

export const TAB_TO_STATUSES: Record<PrTab, PrStatus[] | null> = {
  all: null,
  draft: ["DRAFT"],
  pending: ["PENDING_APPROVAL"],
  rework: ["UNDER_REWORK"],
  clarification: ["NEEDS_CLARIFICATION"],
};

const REQUESTERS = [
  { id: "u-1", name: "Asha Rao" },
  { id: "u-2", name: "Ben Carter" },
  { id: "u-3", name: "Chitra Iyer" },
  { id: "u-4", name: "Devdatta Joshi" },
  { id: "u-5", name: "Esha Patel" },
];

const PLANTS = [
  { id: "p-bom", name: "Mumbai Plant" },
  { id: "p-blr", name: "Bengaluru Plant" },
  { id: "p-del", name: "Delhi Plant" },
  { id: "p-mds", name: "Chennai Plant" },
];

const STATUSES: PrStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "UNDER_REWORK",
  "NEEDS_CLARIFICATION",
  "APPROVED",
  "REJECTED",
];

const TITLES = [
  "Bearings replacement — line A",
  "Annual lubricant supply",
  "PLC modules upgrade",
  "Pallet jacks (x6)",
  "Chemical reagents Q3",
  "Forklift maintenance kit",
  "Workshop safety gear",
  "Electrical conduits — bay 2",
  "Stainless steel sheets",
  "Hydraulic hose assembly",
  "Industrial lighting retrofit",
  "Compressor spares",
  "Welding consumables",
  "Coolant for CNC machines",
  "Quality lab glassware",
];

function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x1_0000_0000;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateMockPurchaseRequests(count = 73): PurchaseRequest[] {
  const rng = seededRand(42);
  const baseTime = Date.UTC(2026, 0, 1);
  const day = 86_400_000;
  return Array.from({ length: count }, (_, i) => {
    const created = baseTime + i * day - Math.floor(rng() * day * 30);
    const updated = created + Math.floor(rng() * day * 14);
    const amount = Math.round((rng() * 980_000 + 5_000) * 100) / 100;
    const idx = String(i + 1).padStart(4, "0");
    return {
      id: `pr-${idx}`,
      number: `PR-2026-${idx}`,
      title: pick(rng, TITLES),
      requester: pick(rng, REQUESTERS),
      plant: pick(rng, PLANTS),
      amount,
      currency: "INR",
      status: pick(rng, STATUSES),
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(updated).toISOString(),
    };
  });
}

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] =
  generateMockPurchaseRequests();
