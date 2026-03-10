export interface AgentInput {
  query: string;
  context?: Record<string, unknown>;
  orgId: string;
}

export interface AgentOutput {
  result: unknown;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AgentResult {
  agentType: string;
  input: string;
  output: AgentOutput;
  status: "success" | "error";
  durationMs: number;
}

export interface LeadScore {
  contactId: string;
  score: number;
  factors: {
    engagement: number;
    firmographic: number;
    recency: number;
    behavior: number;
  };
  recommendation: string;
}

export interface FollowUpEmail {
  dealId: string;
  subject: string;
  body: string;
  tone: string;
  suggestedSendTime: string;
}

export interface DealForecast {
  dealId: string;
  closeProbability: number;
  expectedCloseDate: string;
  predictedRevenue: number;
  riskFactors: string[];
}

export interface ChurnPrediction {
  contactId: string;
  riskScore: number;
  factors: string[];
  recommendedActions: string[];
}

export interface GeneratedContent {
  type: "email" | "proposal" | "social_post";
  subject?: string;
  body: string;
  tone: string;
  targetAudience?: string;
}

export interface EnrichedCompany {
  name: string;
  domain: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  description: string;
  technologies: string[];
  socialProfiles: Record<string, string>;
}
