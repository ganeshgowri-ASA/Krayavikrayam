import type { AgentInput, AgentResult, DealForecast } from "./types";

interface DealData {
  dealId: string;
  dealName: string;
  value: number;
  stage: string;
  createdDate: string;
  expectedCloseDate: string;
  probability?: number;
  activitiesCount?: number;
  stakeholdersCount?: number;
  competitorPresent?: boolean;
}

const STAGE_BASE_PROBABILITY: Record<string, number> = {
  prospecting: 0.1,
  qualification: 0.2,
  "needs-analysis": 0.35,
  "value-proposition": 0.5,
  "decision-makers": 0.6,
  "proposal-sent": 0.7,
  negotiation: 0.8,
  "closed-won": 1.0,
  "closed-lost": 0.0,
};

function predictCloseProbability(deal: DealData): number {
  let probability = STAGE_BASE_PROBABILITY[deal.stage] ?? 0.3;

  // Activity adjustment
  const activities = deal.activitiesCount ?? 0;
  if (activities > 10) probability += 0.1;
  else if (activities > 5) probability += 0.05;
  else if (activities < 2) probability -= 0.1;

  // Stakeholder adjustment
  const stakeholders = deal.stakeholdersCount ?? 1;
  if (stakeholders >= 3) probability += 0.08;
  else if (stakeholders === 1) probability -= 0.05;

  // Competition adjustment
  if (deal.competitorPresent) probability -= 0.1;

  // Deal age adjustment — deals stale too long lose probability
  const dealAgeDays = Math.floor(
    (Date.now() - new Date(deal.createdDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (dealAgeDays > 90) probability -= 0.15;
  else if (dealAgeDays > 60) probability -= 0.08;

  return Math.max(0, Math.min(1, Number(probability.toFixed(2))));
}

function identifyRiskFactors(deal: DealData): string[] {
  const risks: string[] = [];
  const dealAgeDays = Math.floor(
    (Date.now() - new Date(deal.createdDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dealAgeDays > 90) risks.push("Deal has been open for over 90 days");
  if ((deal.activitiesCount ?? 0) < 3) risks.push("Low activity count — engagement may be dropping");
  if (deal.competitorPresent) risks.push("Competitor presence detected");
  if ((deal.stakeholdersCount ?? 0) < 2) risks.push("Single stakeholder — decision may stall");

  const daysToClose = Math.floor(
    (new Date(deal.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysToClose < 0) risks.push("Past expected close date");
  else if (daysToClose < 7) risks.push("Close date approaching rapidly");

  return risks;
}

function predictCloseDate(deal: DealData, probability: number): string {
  if (probability >= 0.8) {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  }
  if (probability >= 0.5) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  }
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return date.toISOString().split("T")[0];
}

export async function forecastDeals(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const deals: DealData[] = (input.context?.deals as DealData[]) ?? [];

    const forecasts: DealForecast[] = deals.map((deal) => {
      const closeProbability = predictCloseProbability(deal);
      return {
        dealId: deal.dealId,
        closeProbability,
        expectedCloseDate: predictCloseDate(deal, closeProbability),
        predictedRevenue: Number((deal.value * closeProbability).toFixed(2)),
        riskFactors: identifyRiskFactors(deal),
      };
    });

    const totalPredictedRevenue = forecasts.reduce((sum, f) => sum + f.predictedRevenue, 0);

    return {
      agentType: "forecasting",
      input: input.query,
      output: {
        result: forecasts,
        confidence: 0.78,
        metadata: {
          totalDeals: deals.length,
          totalPredictedRevenue,
          avgCloseProbability:
            forecasts.length > 0
              ? Number(
                  (forecasts.reduce((s, f) => s + f.closeProbability, 0) / forecasts.length).toFixed(2)
                )
              : 0,
        },
      },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "forecasting",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
