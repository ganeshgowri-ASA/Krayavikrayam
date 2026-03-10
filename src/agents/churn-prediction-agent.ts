import type { AgentInput, AgentResult, ChurnPrediction } from "./types";

interface AccountData {
  contactId: string;
  accountName: string;
  loginFrequency: number; // logins per month
  previousLoginFrequency?: number;
  supportTickets?: number;
  npsScore?: number;
  contractEndDate?: string;
  lastActivityDate?: string;
  usageScore?: number; // 0-100
  previousUsageScore?: number;
  paymentIssues?: boolean;
}

function calculateChurnRisk(account: AccountData): number {
  let risk = 0;

  // Login frequency drop
  if (account.previousLoginFrequency && account.previousLoginFrequency > 0) {
    const loginDrop =
      (account.previousLoginFrequency - account.loginFrequency) / account.previousLoginFrequency;
    if (loginDrop > 0.5) risk += 30;
    else if (loginDrop > 0.25) risk += 20;
    else if (loginDrop > 0) risk += 10;
  }

  // Usage score decline
  if (account.previousUsageScore && account.usageScore !== undefined) {
    const usageDrop = account.previousUsageScore - account.usageScore;
    if (usageDrop > 30) risk += 25;
    else if (usageDrop > 15) risk += 15;
    else if (usageDrop > 0) risk += 5;
  }

  // Support tickets spike
  if ((account.supportTickets ?? 0) > 5) risk += 15;
  else if ((account.supportTickets ?? 0) > 2) risk += 8;

  // Low NPS
  if (account.npsScore !== undefined) {
    if (account.npsScore <= 3) risk += 20;
    else if (account.npsScore <= 5) risk += 10;
  }

  // Contract ending soon
  if (account.contractEndDate) {
    const daysToEnd = Math.floor(
      (new Date(account.contractEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysToEnd <= 30) risk += 15;
    else if (daysToEnd <= 60) risk += 8;
  }

  // Payment issues
  if (account.paymentIssues) risk += 10;

  // Inactivity
  if (account.lastActivityDate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(account.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 30) risk += 20;
    else if (daysSince > 14) risk += 10;
  }

  return Math.min(100, risk);
}

function identifyFactors(account: AccountData): string[] {
  const factors: string[] = [];

  if (account.previousLoginFrequency && account.loginFrequency < account.previousLoginFrequency * 0.5) {
    factors.push("Login frequency dropped by more than 50%");
  }
  if (account.previousUsageScore && account.usageScore !== undefined) {
    if (account.previousUsageScore - account.usageScore > 15) {
      factors.push("Significant usage score decline");
    }
  }
  if ((account.supportTickets ?? 0) > 3) {
    factors.push(`${account.supportTickets} support tickets raised recently`);
  }
  if (account.npsScore !== undefined && account.npsScore <= 5) {
    factors.push(`Low NPS score (${account.npsScore}/10)`);
  }
  if (account.paymentIssues) {
    factors.push("Recent payment issues detected");
  }
  if (account.lastActivityDate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(account.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 14) {
      factors.push(`No activity in ${daysSince} days`);
    }
  }

  return factors;
}

function recommendActions(riskScore: number, factors: string[]): string[] {
  const actions: string[] = [];

  if (riskScore >= 70) {
    actions.push("Immediate executive outreach required");
    actions.push("Schedule urgent account review meeting");
    actions.push("Prepare retention offer or custom discount");
  } else if (riskScore >= 40) {
    actions.push("Schedule customer success check-in call");
    actions.push("Send personalized value-recap email");
    if (factors.some((f) => f.includes("support tickets"))) {
      actions.push("Escalate open support tickets to priority queue");
    }
  } else {
    actions.push("Continue regular engagement cadence");
    actions.push("Include in upcoming customer success newsletter");
  }

  if (factors.some((f) => f.includes("usage"))) {
    actions.push("Offer product training or onboarding refresher");
  }

  return actions;
}

export async function predictChurn(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const accounts: AccountData[] = (input.context?.accounts as AccountData[]) ?? [];

    const predictions: ChurnPrediction[] = accounts.map((account) => {
      const riskScore = calculateChurnRisk(account);
      const factors = identifyFactors(account);
      return {
        contactId: account.contactId,
        riskScore,
        factors,
        recommendedActions: recommendActions(riskScore, factors),
      };
    });

    const atRisk = predictions.filter((p) => p.riskScore >= 50);

    return {
      agentType: "churn-prediction",
      input: input.query,
      output: {
        result: predictions,
        confidence: 0.82,
        metadata: {
          totalAccounts: accounts.length,
          atRiskCount: atRisk.length,
          avgRiskScore:
            predictions.length > 0
              ? Number(
                  (predictions.reduce((s, p) => s + p.riskScore, 0) / predictions.length).toFixed(1)
                )
              : 0,
        },
      },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "churn-prediction",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
