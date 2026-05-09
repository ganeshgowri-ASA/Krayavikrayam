export const RFQ_STATUSES = ["Draft", "Open", "Closed", "Awarded"] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];

/**
 * Canonical TBE (Technical Bid Evaluation) categories per docs/TBE-SCHEMA.md.
 */
export const TBE_CATEGORIES = [
  "TCPS10",
  "PID-20-Ch",
  "4-in-1",
  "UV2",
  "Equipment",
  "Generic",
] as const;
export type TbeCategory = (typeof TBE_CATEGORIES)[number];

export interface Rfq {
  id: string;
  rfqNo: string;
  title: string;
  category: TbeCategory;
  suppliersCount: number;
  status: RfqStatus;
  deadline: string;
}

export interface RfqFilters {
  status: RfqStatus[];
  category: TbeCategory[];
  deadlineFrom?: string;
  deadlineTo?: string;
}
