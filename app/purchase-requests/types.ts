export type PurchaseRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "ordered"
  | "closed";

export interface PurchaseRequest {
  id: string;
  title: string;
  requester: string;
  plant: string;
  amount: number;
  currency: "INR";
  status: PurchaseRequestStatus;
  updatedAt: string;
}

export interface PurchaseRequestListResponse {
  rows: PurchaseRequest[];
  total: number;
  page: number;
  pageSize: number;
}
