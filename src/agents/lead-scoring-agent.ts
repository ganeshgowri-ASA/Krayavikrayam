import type { AgentInput, AgentResult, LeadScore } from "./types";

interface LeadData {
  contactId: string;
  emailOpens?: number;
  emailClicks?: number;
  websiteVisits?: number;
  meetingsAttended?: number;
  lastActivityDate?: string;
  companySize?: string;
  industry?: string;
  jobTitle?: string;
  dealValue?: number;
}

function calculateEngagementScore(data: LeadData): number {
  let score = 0;
  score += Math.min((data.emailOpens ?? 0) * 3, 25);
  score += Math.min((data.emailClicks ?? 0) * 5, 25);
  score += Math.min((data.websiteVisits ?? 0) * 2, 25);
  score += Math.min((data.meetingsAttended ?? 0) * 10, 25);
  return score;
}

function calculateFirmographicScore(data: LeadData): number {
  let score = 0;

  const sizeScores: Record<string, number> = {
    enterprise: 25,
    "mid-market": 20,
    small: 15,
    startup: 10,
  };
  score += sizeScores[data.companySize?.toLowerCase() ?? ""] ?? 10;

  const highValueIndustries = ["technology", "finance", "healthcare", "saas"];
  if (highValueIndustries.includes(data.industry?.toLowerCase() ?? "")) {
    score += 15;
  } else {
    score += 8;
  }

  const seniorTitles = ["ceo", "cto", "vp", "director", "head"];
  if (seniorTitles.some((t) => data.jobTitle?.toLowerCase().includes(t))) {
    score += 10;
  } else {
    score += 5;
  }

  return Math.min(score, 25);
}

function calculateRecencyScore(data: LeadData): number {
  if (!data.lastActivityDate) return 5;
  const daysSinceActivity = Math.floor(
    (Date.now() - new Date(data.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceActivity <= 1) return 25;
  if (daysSinceActivity <= 3) return 22;
  if (daysSinceActivity <= 7) return 18;
  if (daysSinceActivity <= 14) return 14;
  if (daysSinceActivity <= 30) return 10;
  return 5;
}

function calculateBehaviorScore(data: LeadData): number {
  let score = 0;
  if ((data.dealValue ?? 0) > 100000) score += 15;
  else if ((data.dealValue ?? 0) > 50000) score += 10;
  else if ((data.dealValue ?? 0) > 10000) score += 7;
  else score += 3;

  if ((data.meetingsAttended ?? 0) > 2) score += 10;
  return Math.min(score, 25);
}

function getRecommendation(score: number): string {
  if (score >= 80) return "Hot lead — prioritize immediate outreach";
  if (score >= 60) return "Warm lead — schedule follow-up within 48 hours";
  if (score >= 40) return "Nurture lead — add to drip campaign";
  if (score >= 20) return "Cold lead — monitor for engagement spikes";
  return "Low priority — keep in long-term nurture";
}

export async function scoreLeads(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const leads: LeadData[] = (input.context?.leads as LeadData[]) ?? [];

    const scores: LeadScore[] = leads.map((lead) => {
      const engagement = calculateEngagementScore(lead);
      const firmographic = calculateFirmographicScore(lead);
      const recency = calculateRecencyScore(lead);
      const behavior = calculateBehaviorScore(lead);
      const totalScore = Math.min(engagement + firmographic + recency + behavior, 100);

      return {
        contactId: lead.contactId,
        score: totalScore,
        factors: { engagement, firmographic, recency, behavior },
        recommendation: getRecommendation(totalScore),
      };
    });

    return {
      agentType: "lead-scoring",
      input: input.query,
      output: { result: scores, confidence: 0.85, metadata: { leadsProcessed: leads.length } },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "lead-scoring",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
