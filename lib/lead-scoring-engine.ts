/**
 * Lead Scoring Engine
 *
 * Calculates a composite lead score (0-100) based on weighted factors:
 * - Email engagement (opens, clicks)
 * - Website activity (page visits, time on site)
 * - Purchase history (recency, frequency, monetary value)
 * - Social engagement (follows, likes, shares)
 * - Form submissions and downloads
 *
 * Scores are bucketed into tiers:
 *   Hot (80-100)   - Sales-ready, prioritize outreach
 *   Warm (60-79)   - Nurture with targeted content
 *   Cool (40-59)   - Continue awareness campaigns
 *   Cold (0-39)    - Low priority, automated drip sequences
 */

export interface ScoringFactor {
  name: string;
  weight: number; // 0-1, all weights should sum to 1
  value: number;  // 0-100 raw score for this factor
}

export interface LeadScoreResult {
  score: number;
  tier: "hot" | "warm" | "cool" | "cold";
  factors: ScoringFactor[];
  recommendations: string[];
}

export function calculateLeadScore(factors: ScoringFactor[]): LeadScoreResult {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const normalizedFactors = totalWeight > 0
    ? factors.map(f => ({ ...f, weight: f.weight / totalWeight }))
    : factors;

  const score = Math.round(
    normalizedFactors.reduce((sum, f) => sum + f.weight * f.value, 0)
  );

  const tier = score >= 80 ? "hot" : score >= 60 ? "warm" : score >= 40 ? "cool" : "cold";

  const recommendations = generateRecommendations(tier, normalizedFactors);

  return { score, tier, factors: normalizedFactors, recommendations };
}

function generateRecommendations(tier: string, factors: ScoringFactor[]): string[] {
  const weakest = [...factors].sort((a, b) => a.value - b.value);
  const recs: string[] = [];

  switch (tier) {
    case "hot":
      recs.push("Schedule a personalized sales call");
      recs.push("Send exclusive offer or demo invitation");
      break;
    case "warm":
      recs.push("Send targeted case studies relevant to their industry");
      recs.push("Invite to upcoming webinar or event");
      break;
    case "cool":
      recs.push("Add to awareness newsletter segment");
      recs.push("Retarget with educational content");
      break;
    case "cold":
      recs.push("Enroll in automated drip sequence");
      recs.push("Monitor for re-engagement signals");
      break;
  }

  if (weakest.length > 0 && weakest[0].value < 40) {
    recs.push(`Improve ${weakest[0].name.toLowerCase()} - currently the weakest factor`);
  }

  return recs;
}

export function getScoreTierColor(tier: string): string {
  switch (tier) {
    case "hot": return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
    case "warm": return "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400";
    case "cool": return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
    case "cold": return "text-slate-600 bg-slate-50 dark:bg-slate-950 dark:text-slate-400";
    default: return "text-muted-foreground bg-muted";
  }
}

export function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-blue-500";
  return "bg-slate-400";
}
