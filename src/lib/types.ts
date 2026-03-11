export type DealStatus = "OPEN" | "WON" | "LOST";

export type ActivityType =
  | "NOTE"
  | "CALL"
  | "EMAIL"
  | "MEETING"
  | "STAGE_CHANGE"
  | "STATUS_CHANGE"
  | "TASK"
  | "OTHER";

export interface Pipeline {
  id: string;
  name: string;
  orgId: string;
  isDefault: boolean;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  pipelineId: string;
  color: string;
  deals?: Deal[];
  _count?: { deals: number };
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  expectedCloseDate: string | null;
  stageId: string;
  contactId: string | null;
  contactName: string | null;
  accountId: string | null;
  accountName: string | null;
  ownerId: string | null;
  ownerName: string | null;
  orgId: string;
  probability: number;
  status: DealStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  stage?: PipelineStage;
  activities?: DealActivity[];
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: ActivityType;
  title: string;
  notes: string | null;
  userId: string | null;
  userName: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Quota {
  id: string;
  userId: string;
  userName: string | null;
  period: string;
  targetAmount: number;
  achievedAmount: number;
  orgId: string;
}

export interface ForecastData {
  month: string;
  forecast: number;
  actual: number;
  weighted: number;
}

export interface WinLossData {
  name: string;
  value: number;
  color: string;
}

export interface PipelineValueData {
  stage: string;
  value: number;
  count: number;
  color: string;
}
