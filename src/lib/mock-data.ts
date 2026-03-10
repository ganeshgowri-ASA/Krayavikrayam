import type {
  Pipeline,
  PipelineStage,
  Deal,
  DealActivity,
  Quota,
  ForecastData,
  WinLossData,
  PipelineValueData,
} from "./types";

const stages: PipelineStage[] = [
  { id: "s1", name: "Lead", order: 0, probability: 10, pipelineId: "p1", color: "#94a3b8" },
  { id: "s2", name: "Qualified", order: 1, probability: 25, pipelineId: "p1", color: "#3b82f6" },
  { id: "s3", name: "Proposal", order: 2, probability: 50, pipelineId: "p1", color: "#8b5cf6" },
  { id: "s4", name: "Negotiation", order: 3, probability: 75, pipelineId: "p1", color: "#f59e0b" },
  { id: "s5", name: "Closed Won", order: 4, probability: 100, pipelineId: "p1", color: "#22c55e" },
  { id: "s6", name: "Closed Lost", order: 5, probability: 0, pipelineId: "p1", color: "#ef4444" },
];

export const mockPipeline: Pipeline = {
  id: "p1",
  name: "Default Pipeline",
  orgId: "org1",
  isDefault: true,
  stages,
};

export const mockDeals: Deal[] = [
  {
    id: "d1", title: "Acme Corp - Enterprise Plan", value: 120000, currency: "USD",
    expectedCloseDate: "2026-04-15", stageId: "s3", contactId: "c1", contactName: "John Smith",
    accountId: "a1", accountName: "Acme Corp", ownerId: "u1", ownerName: "Alice Johnson",
    orgId: "org1", probability: 50, status: "OPEN", notes: "Awaiting proposal review",
    createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-03-08T00:00:00Z",
    stage: stages[2], activities: [],
  },
  {
    id: "d2", title: "Globex - Annual License", value: 85000, currency: "USD",
    expectedCloseDate: "2026-03-30", stageId: "s4", contactId: "c2", contactName: "Jane Doe",
    accountId: "a2", accountName: "Globex Inc", ownerId: "u1", ownerName: "Alice Johnson",
    orgId: "org1", probability: 75, status: "OPEN", notes: "Final terms negotiation",
    createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-03-09T00:00:00Z",
    stage: stages[3], activities: [],
  },
  {
    id: "d3", title: "Initech - Starter Pack", value: 15000, currency: "USD",
    expectedCloseDate: "2026-05-01", stageId: "s1", contactId: "c3", contactName: "Bob Wilson",
    accountId: "a3", accountName: "Initech", ownerId: "u2", ownerName: "Bob Martinez",
    orgId: "org1", probability: 10, status: "OPEN", notes: null,
    createdAt: "2026-03-05T00:00:00Z", updatedAt: "2026-03-05T00:00:00Z",
    stage: stages[0], activities: [],
  },
  {
    id: "d4", title: "Umbrella Corp - Platform", value: 250000, currency: "USD",
    expectedCloseDate: "2026-06-15", stageId: "s2", contactId: "c4", contactName: "Sarah Chen",
    accountId: "a4", accountName: "Umbrella Corp", ownerId: "u1", ownerName: "Alice Johnson",
    orgId: "org1", probability: 25, status: "OPEN", notes: "Discovery call completed",
    createdAt: "2026-02-20T00:00:00Z", updatedAt: "2026-03-07T00:00:00Z",
    stage: stages[1], activities: [],
  },
  {
    id: "d5", title: "Wayne Enterprises - Premium", value: 340000, currency: "USD",
    expectedCloseDate: "2026-04-30", stageId: "s3", contactId: "c5", contactName: "Bruce Wayne",
    accountId: "a5", accountName: "Wayne Enterprises", ownerId: "u2", ownerName: "Bob Martinez",
    orgId: "org1", probability: 50, status: "OPEN", notes: "Technical review in progress",
    createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-03-06T00:00:00Z",
    stage: stages[2], activities: [],
  },
  {
    id: "d6", title: "Stark Industries - Integration", value: 180000, currency: "USD",
    expectedCloseDate: "2026-03-20", stageId: "s5", contactId: "c6", contactName: "Tony Stark",
    accountId: "a6", accountName: "Stark Industries", ownerId: "u1", ownerName: "Alice Johnson",
    orgId: "org1", probability: 100, status: "WON", notes: "Contract signed",
    createdAt: "2025-12-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
    stage: stages[4], activities: [],
  },
  {
    id: "d7", title: "Oscorp - Research License", value: 45000, currency: "USD",
    expectedCloseDate: "2026-02-28", stageId: "s6", contactId: "c7", contactName: "Norman Osborn",
    accountId: "a7", accountName: "Oscorp", ownerId: "u2", ownerName: "Bob Martinez",
    orgId: "org1", probability: 0, status: "LOST", notes: "Went with competitor",
    createdAt: "2025-12-15T00:00:00Z", updatedAt: "2026-02-28T00:00:00Z",
    stage: stages[5], activities: [],
  },
  {
    id: "d8", title: "LexCorp - Consulting", value: 60000, currency: "USD",
    expectedCloseDate: "2026-04-10", stageId: "s2", contactId: "c8", contactName: "Lex Luthor",
    accountId: "a8", accountName: "LexCorp", ownerId: "u1", ownerName: "Alice Johnson",
    orgId: "org1", probability: 25, status: "OPEN", notes: "Need follow-up meeting",
    createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-09T00:00:00Z",
    stage: stages[1], activities: [],
  },
];

export const mockActivities: DealActivity[] = [
  { id: "act1", dealId: "d1", type: "NOTE", title: "Initial discovery call completed", notes: "Client interested in enterprise features", userId: "u1", userName: "Alice Johnson", metadata: null, createdAt: "2026-02-01T10:00:00Z" },
  { id: "act2", dealId: "d1", type: "EMAIL", title: "Sent proposal document", notes: null, userId: "u1", userName: "Alice Johnson", metadata: null, createdAt: "2026-02-15T14:00:00Z" },
  { id: "act3", dealId: "d1", type: "STAGE_CHANGE", title: "Moved from Qualified to Proposal", notes: null, userId: "u1", userName: "Alice Johnson", metadata: { from: "Qualified", to: "Proposal" }, createdAt: "2026-02-15T14:05:00Z" },
  { id: "act4", dealId: "d1", type: "MEETING", title: "Proposal review meeting", notes: "Client reviewing with their team", userId: "u1", userName: "Alice Johnson", metadata: null, createdAt: "2026-03-01T09:00:00Z" },
  { id: "act5", dealId: "d1", type: "CALL", title: "Follow-up call", notes: "Positive feedback, waiting for final approval", userId: "u1", userName: "Alice Johnson", metadata: null, createdAt: "2026-03-08T11:00:00Z" },
  { id: "act6", dealId: "d2", type: "STAGE_CHANGE", title: "Moved from Proposal to Negotiation", notes: null, userId: "u1", userName: "Alice Johnson", metadata: { from: "Proposal", to: "Negotiation" }, createdAt: "2026-03-05T10:00:00Z" },
  { id: "act7", dealId: "d2", type: "MEETING", title: "Contract terms discussion", notes: "Agreed on pricing, finalizing SLA", userId: "u1", userName: "Alice Johnson", metadata: null, createdAt: "2026-03-09T15:00:00Z" },
  { id: "act8", dealId: "d6", type: "STATUS_CHANGE", title: "Deal marked as Won", notes: "Contract signed and payment received", userId: "u1", userName: "Alice Johnson", metadata: { status: "WON" }, createdAt: "2026-03-01T10:00:00Z" },
];

export const mockQuotas: Quota[] = [
  { id: "q1", userId: "u1", userName: "Alice Johnson", period: "2026-Q1", targetAmount: 500000, achievedAmount: 180000, orgId: "org1" },
  { id: "q2", userId: "u2", userName: "Bob Martinez", period: "2026-Q1", targetAmount: 400000, achievedAmount: 0, orgId: "org1" },
  { id: "q3", userId: "u1", userName: "Alice Johnson", period: "2026-Q2", targetAmount: 600000, achievedAmount: 0, orgId: "org1" },
];

export const mockForecastData: ForecastData[] = [
  { month: "Jan", forecast: 150000, actual: 180000, weighted: 120000 },
  { month: "Feb", forecast: 200000, actual: 165000, weighted: 155000 },
  { month: "Mar", forecast: 280000, actual: 180000, weighted: 210000 },
  { month: "Apr", forecast: 320000, actual: 0, weighted: 240000 },
  { month: "May", forecast: 250000, actual: 0, weighted: 188000 },
  { month: "Jun", forecast: 380000, actual: 0, weighted: 285000 },
];

export const mockWinLossData: WinLossData[] = [
  { name: "Won", value: 12, color: "#22c55e" },
  { name: "Lost", value: 5, color: "#ef4444" },
  { name: "Open", value: 18, color: "#3b82f6" },
];

export const mockPipelineValueData: PipelineValueData[] = [
  { stage: "Lead", value: 15000, count: 1, color: "#94a3b8" },
  { stage: "Qualified", value: 310000, count: 2, color: "#3b82f6" },
  { stage: "Proposal", value: 460000, count: 2, color: "#8b5cf6" },
  { stage: "Negotiation", value: 85000, count: 1, color: "#f59e0b" },
  { stage: "Closed Won", value: 180000, count: 1, color: "#22c55e" },
];

export function getDealsByStage(stageId: string): Deal[] {
  return mockDeals.filter((d) => d.stageId === stageId);
}

export function getDealById(id: string): Deal | undefined {
  const deal = mockDeals.find((d) => d.id === id);
  if (deal) {
    deal.activities = mockActivities.filter((a) => a.dealId === id);
  }
  return deal;
}
