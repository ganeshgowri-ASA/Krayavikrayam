export type RfqStatus =
  | "draft"
  | "published"
  | "in_review"
  | "awarded"
  | "cancelled"
  | "closed";

export type RfqPriority = "low" | "medium" | "high" | "urgent";

export interface Money {
  amount: number;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface Plant {
  id: string;
  name: string;
  country: string;
  city?: string;
}

export interface Material {
  code: string;
  description: string;
  uom: string;
  category?: string;
}

export interface RfqLineItem {
  id: string;
  material: Material;
  quantity: number;
  targetPrice?: Money | null;
  deliveryDate?: string | null;
}

export interface Rfq {
  id: string;
  number: string;
  title: string;
  status: RfqStatus;
  priority: RfqPriority;
  buyer: User;
  plant: Plant;
  materialCodes: string[];
  estimatedValue: Money;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  collaborators: User[];
  lineItems: RfqLineItem[];
  invitedVendorIds: string[];
  openQueriesCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  country: string;
  rating: number;
  onTimeDelivery: number;
  qualityScore: number;
  totalSpend: Money;
  activeRfqCount: number;
  certifications: string[];
  contacts: User[];
  riskScore: "low" | "medium" | "high";
}

export interface OfferLine {
  materialCode: string;
  quantity: number;
  unitPrice: Money;
  leadTimeDays: number;
  incoterm: string;
}

export interface OfferVersion {
  id: string;
  rfqId: string;
  vendorId: string;
  versionNumber: number;
  submittedAt: string;
  submittedBy: User;
  totalValue: Money;
  validUntil: string;
  lines: OfferLine[];
  notes?: string;
}

export interface QueryMessage {
  id: string;
  threadId: string;
  authorId: string;
  author: User;
  body: string;
  mentions: string[];
  createdAt: string;
  attachments?: { name: string; url: string }[];
}

export interface QueryThread {
  id: string;
  rfqId: string;
  subject: string;
  status: "open" | "answered" | "resolved";
  createdAt: string;
  participants: User[];
  messages: QueryMessage[];
}

export interface RfqFilters {
  status?: RfqStatus[];
  buyerId?: string[];
  country?: string[];
  plantId?: string[];
  materialCode?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: RfqFilters;
  isDefault?: boolean;
  createdAt: string;
}
