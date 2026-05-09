import type { PurchaseRequest, PurchaseRequestStatus } from "./types";

const REQUESTERS = [
  "Ananya Sharma",
  "Vikram Iyer",
  "Priya Nair",
  "Rohit Verma",
  "Kavya Reddy",
  "Arjun Mehta",
  "Sneha Patil",
  "Manish Gupta",
];

const PLANTS = [
  "Pune-1",
  "Chennai-2",
  "Bengaluru-3",
  "Hyderabad-1",
  "Ahmedabad-2",
];

const TITLES = [
  "Hydraulic press spares",
  "Industrial lubricants Q2",
  "PPE kits restock",
  "CNC tooling consumables",
  "Forklift maintenance contract",
  "Packaging film rolls",
  "Calibration services",
  "Conveyor belt replacement",
  "Office IT peripherals",
  "Welding consumables",
];

const STATUSES: PurchaseRequestStatus[] = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "ordered",
  "closed",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function generateRows(count: number): PurchaseRequest[] {
  const now = Date.now();
  const rows: PurchaseRequest[] = [];
  for (let i = 0; i < count; i++) {
    const updatedAt = new Date(now - i * 1000 * 60 * 37).toISOString();
    rows.push({
      id: `PR-${String(10001 + i)}`,
      title: pick(TITLES, i + (i % 3)),
      requester: pick(REQUESTERS, i + (i % 5)),
      plant: pick(PLANTS, i + (i % 4)),
      amount: 25000 + ((i * 13931) % 4_750_000),
      currency: "INR",
      status: pick(STATUSES, i + (i % 7)),
      updatedAt,
    });
  }
  return rows;
}

export const ALL_PURCHASE_REQUESTS: PurchaseRequest[] = generateRows(137);
