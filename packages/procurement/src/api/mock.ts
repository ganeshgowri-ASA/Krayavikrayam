import type {
  OfferVersion,
  QueryThread,
  Rfq,
  RfqStatus,
  Vendor,
} from "../types";

const buyers = [
  { id: "u1", name: "Aanya Sharma", email: "aanya@krayavikrayam.com", role: "Senior Buyer" },
  { id: "u2", name: "Rohan Patel", email: "rohan@krayavikrayam.com", role: "Category Lead" },
  { id: "u3", name: "Mei Lin", email: "mei@krayavikrayam.com", role: "Buyer" },
  { id: "u4", name: "Diego Rivera", email: "diego@krayavikrayam.com", role: "Buyer" },
];

const plants = [
  { id: "p1", name: "Pune Plant", country: "IN", city: "Pune" },
  { id: "p2", name: "Stuttgart Plant", country: "DE", city: "Stuttgart" },
  { id: "p3", name: "Suzhou Plant", country: "CN", city: "Suzhou" },
  { id: "p4", name: "Monterrey Plant", country: "MX", city: "Monterrey" },
];

const materials = [
  { code: "MAT-1001", description: "Cold-rolled steel coil 1.2mm", uom: "MT", category: "Steel" },
  { code: "MAT-1002", description: "Hex bolt M12x60 grade 8.8", uom: "EA", category: "Fasteners" },
  { code: "MAT-1003", description: "PCB FR-4 4-layer", uom: "EA", category: "Electronics" },
  { code: "MAT-1004", description: "Lithium-ion cell 18650 3000mAh", uom: "EA", category: "Battery" },
  { code: "MAT-1005", description: "Aluminum extrusion 6063 T5", uom: "M", category: "Aluminium" },
];

const statuses: RfqStatus[] = ["draft", "published", "in_review", "awarded", "cancelled", "closed"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const MOCK_RFQS: Rfq[] = Array.from({ length: 200 }, (_, i) => {
  const buyer = pick(buyers, i);
  const plant = pick(plants, i + 1);
  const status = pick(statuses, i + 2);
  const material = pick(materials, i);
  const dueOffset = ((i * 7) % 60) - 5;
  const value = 5_000 + ((i * 1337) % 250_000);
  return {
    id: `rfq-${i + 1}`,
    number: `RFQ-2026-${String(1000 + i).padStart(5, "0")}`,
    title: `${material.category} sourcing for ${plant.name}`,
    status,
    priority: (["low", "medium", "high", "urgent"] as const)[i % 4]!,
    buyer,
    plant,
    materialCodes: [material.code],
    estimatedValue: { amount: value, currency: i % 3 === 0 ? "EUR" : i % 3 === 1 ? "USD" : "INR" },
    dueDate: daysFromNow(dueOffset),
    createdAt: daysFromNow(-30 - (i % 60)),
    updatedAt: daysFromNow(-(i % 5)),
    collaborators: buyers.slice(0, (i % 4) + 1),
    lineItems: [
      {
        id: `li-${i}-1`,
        material,
        quantity: 100 + (i % 900),
        targetPrice: { amount: 100 + (i % 50), currency: "USD" },
        deliveryDate: daysFromNow(dueOffset + 14),
      },
    ],
    invitedVendorIds: [`v${(i % 5) + 1}`, `v${(i % 5) + 2}`],
    openQueriesCount: i % 7,
  };
});

export const MOCK_VENDORS: Vendor[] = Array.from({ length: 8 }, (_, i) => ({
  id: `v${i + 1}`,
  name: `Vendor ${String.fromCharCode(65 + i)} Industries`,
  country: ["IN", "DE", "CN", "US", "JP", "KR", "VN", "BR"][i]!,
  rating: 3 + ((i * 0.3) % 2),
  onTimeDelivery: 70 + ((i * 3) % 30),
  qualityScore: 80 + ((i * 2) % 20),
  totalSpend: { amount: 100_000 + i * 50_000, currency: "USD" },
  activeRfqCount: (i % 5) + 1,
  certifications: ["ISO-9001", i % 2 === 0 ? "ISO-14001" : "IATF-16949"],
  contacts: [{ id: `vc${i}`, name: `Contact ${i + 1}`, email: `contact${i}@vendor.com` }],
  riskScore: (["low", "medium", "high"] as const)[i % 3]!,
}));

export const MOCK_OFFER_VERSIONS: OfferVersion[] = [
  {
    id: "ov-1",
    rfqId: "rfq-1",
    vendorId: "v1",
    versionNumber: 1,
    submittedAt: daysFromNow(-10),
    submittedBy: { id: "vc0", name: "Contact 1", email: "contact1@vendor.com" },
    totalValue: { amount: 124_500, currency: "USD" },
    validUntil: daysFromNow(20),
    lines: [
      {
        materialCode: "MAT-1001",
        quantity: 500,
        unitPrice: { amount: 249, currency: "USD" },
        leadTimeDays: 30,
        incoterm: "FOB",
      },
    ],
    notes: "Initial offer.",
  },
  {
    id: "ov-2",
    rfqId: "rfq-1",
    vendorId: "v1",
    versionNumber: 2,
    submittedAt: daysFromNow(-3),
    submittedBy: { id: "vc0", name: "Contact 1", email: "contact1@vendor.com" },
    totalValue: { amount: 119_750, currency: "USD" },
    validUntil: daysFromNow(30),
    lines: [
      {
        materialCode: "MAT-1001",
        quantity: 500,
        unitPrice: { amount: 239.5, currency: "USD" },
        leadTimeDays: 28,
        incoterm: "CIF",
      },
    ],
    notes: "Revised after price negotiation.",
  },
];

export const MOCK_QUERY_THREADS: QueryThread[] = [
  {
    id: "qt-1",
    rfqId: "rfq-1",
    subject: "Clarification on packaging spec",
    status: "open",
    createdAt: daysFromNow(-2),
    participants: buyers.slice(0, 2),
    messages: [
      {
        id: "qm-1",
        threadId: "qt-1",
        authorId: "u1",
        author: buyers[0]!,
        body: "Hi @Rohan Patel, could you confirm the export packaging requirement?",
        mentions: ["u2"],
        createdAt: daysFromNow(-2),
      },
      {
        id: "qm-2",
        threadId: "qt-1",
        authorId: "u2",
        author: buyers[1]!,
        body: "Yes, sea-worthy crates with desiccant.",
        mentions: [],
        createdAt: daysFromNow(-1),
      },
    ],
  },
];

export const MOCK_USERS = buyers;
