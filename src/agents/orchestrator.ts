import { scoreLeads } from "./lead-scoring-agent";
import { generateFollowUps } from "./follow-up-agent";
import { forecastDeals } from "./forecasting-agent";
import { predictChurn } from "./churn-prediction-agent";
import { generateContent } from "./content-generation-agent";
import { enrichData } from "./data-enrichment-agent";
import type { AgentInput, AgentResult } from "./types";

/**
 * Tool definitions following the Vercel AI SDK tool-calling pattern.
 * Each tool maps to an agent with a description for Claude to select from.
 */
export const agentTools = {
  score_leads: {
    description:
      "Score leads from 0-100 based on engagement, firmographic data, and activity recency. Use when the user asks about lead quality, hot leads, or lead prioritization.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        leads: {
          type: "array",
          description: "Array of lead data objects",
          items: { type: "object" },
        },
      },
      required: ["query"],
    },
  },
  generate_follow_ups: {
    description:
      "Generate personalized follow-up emails for inactive deals. Use when the user asks to draft emails, follow up with contacts, or re-engage deals.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        deals: {
          type: "array",
          description: "Array of deal context objects",
          items: { type: "object" },
        },
      },
      required: ["query"],
    },
  },
  forecast_deals: {
    description:
      "Predict deal close probability, expected close dates, and monthly revenue. Use when the user asks about pipeline forecasts, revenue predictions, or deal probabilities.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        deals: {
          type: "array",
          description: "Array of deal data objects",
          items: { type: "object" },
        },
      },
      required: ["query"],
    },
  },
  predict_churn: {
    description:
      "Flag at-risk accounts based on engagement drops, support tickets, and usage patterns. Use when the user asks about churn risk, at-risk accounts, or customer health.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        accounts: {
          type: "array",
          description: "Array of account data objects",
          items: { type: "object" },
        },
      },
      required: ["query"],
    },
  },
  generate_content: {
    description:
      "Draft email templates, proposals, and social media posts. Use when the user asks to create content, write emails, draft proposals, or compose social posts.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        request: {
          type: "object",
          description: "Content generation request with type, topic, tone, etc.",
        },
      },
      required: ["query"],
    },
  },
  enrich_company: {
    description:
      "Enrich company information from the web including industry, size, revenue, technologies, and social profiles. Use when the user asks about a company or wants to look up company details.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "The user's request" },
        companies: {
          type: "array",
          description: "Array of company enrichment requests",
          items: { type: "object" },
        },
      },
      required: ["query"],
    },
  },
};

type ToolName = keyof typeof agentTools;

const agentMap: Record<ToolName, (input: AgentInput) => Promise<AgentResult>> = {
  score_leads: scoreLeads,
  generate_follow_ups: generateFollowUps,
  forecast_deals: forecastDeals,
  predict_churn: predictChurn,
  generate_content: generateContent,
  enrich_company: enrichData,
};

/**
 * Determines the best agent to handle a user query based on keyword matching.
 * In production, Claude API would be used for intent classification.
 */
function classifyIntent(query: string): ToolName | null {
  const lower = query.toLowerCase();

  const patterns: Record<ToolName, string[]> = {
    score_leads: ["lead", "score", "priorit", "hot lead", "qualify", "ranking"],
    generate_follow_ups: ["follow up", "follow-up", "email", "draft", "re-engage", "reach out", "inactive deal"],
    forecast_deals: [
      "forecast",
      "predict",
      "revenue",
      "pipeline",
      "close probability",
      "deal closing",
      "monthly revenue",
      "pipeline value",
    ],
    predict_churn: ["churn", "at-risk", "at risk", "retention", "losing", "engagement drop"],
    generate_content: ["content", "proposal", "social post", "template", "write", "compose", "blog"],
    enrich_company: ["company info", "enrich", "look up", "company detail", "about company"],
  };

  let bestMatch: ToolName | null = null;
  let maxMatchCount = 0;

  for (const [tool, keywords] of Object.entries(patterns)) {
    const matchCount = keywords.filter((k) => lower.includes(k)).length;
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatch = tool as ToolName;
    }
  }

  return bestMatch;
}

/**
 * Main orchestrator: receives natural language input, decides which agent to call,
 * executes the agent, and returns structured results.
 *
 * Follows the Vercel AI SDK tool-calling pattern where the orchestrator acts as
 * the decision layer between user intent and agent execution.
 */
export async function orchestrate(
  query: string,
  orgId: string,
  context?: Record<string, unknown>,
  pageUrl?: string
): Promise<{
  message: string;
  agentUsed: string | null;
  result: AgentResult | null;
  toolDefinitions: typeof agentTools;
}> {
  // Step 1: Classify the user's intent to determine which tool/agent to invoke
  const selectedTool = classifyIntent(query);

  if (!selectedTool) {
    return {
      message: generateHelpMessage(query, pageUrl),
      agentUsed: null,
      result: null,
      toolDefinitions: agentTools,
    };
  }

  // Step 2: Build the agent input, incorporating page context
  const agentInput: AgentInput = {
    query,
    context: {
      ...context,
      pageUrl,
    },
    orgId,
  };

  // Step 3: Execute the selected agent
  const agentFn = agentMap[selectedTool];
  const result = await agentFn(agentInput);

  // Step 4: Format the response
  const message = formatAgentResponse(selectedTool, result);

  return {
    message,
    agentUsed: selectedTool,
    result,
    toolDefinitions: agentTools,
  };
}

function formatAgentResponse(toolName: ToolName, result: AgentResult): string {
  if (result.status === "error") {
    return `I encountered an issue running the ${result.agentType} agent. Please try again or rephrase your request.`;
  }

  const output = result.output;
  const responses: Record<ToolName, string> = {
    score_leads: `I've scored your leads. ${(output.metadata as Record<string, unknown>)?.leadsProcessed ?? 0} leads processed with ${((output.confidence ?? 0) * 100).toFixed(0)}% confidence.`,
    generate_follow_ups: `I've generated ${(output.metadata as Record<string, unknown>)?.emailsGenerated ?? 0} personalized follow-up emails for your inactive deals.`,
    forecast_deals: `Here's your pipeline forecast. Total predicted revenue: $${((output.metadata as Record<string, unknown>)?.totalPredictedRevenue as number)?.toLocaleString() ?? "N/A"}. Average close probability: ${(((output.metadata as Record<string, unknown>)?.avgCloseProbability as number) * 100)?.toFixed(0) ?? "N/A"}%.`,
    predict_churn: `Churn analysis complete. ${(output.metadata as Record<string, unknown>)?.atRiskCount ?? 0} accounts flagged as at-risk out of ${(output.metadata as Record<string, unknown>)?.totalAccounts ?? 0} total.`,
    generate_content: `I've drafted your content. Review and customize it before sending.`,
    enrich_company: `Company enrichment complete for ${(output.metadata as Record<string, unknown>)?.companiesEnriched ?? 0} companies.`,
  };

  return responses[toolName];
}

function generateHelpMessage(query: string, pageUrl?: string): string {
  const contextHint = pageUrl ? ` I can see you're on ${pageUrl}.` : "";
  return `I'm not sure which tool to use for "${query}".${contextHint} Here's what I can help with:

• **Score leads** — rank and prioritize your leads
• **Draft follow-ups** — create personalized emails for inactive deals
• **Forecast pipeline** — predict deal close probability and revenue
• **Predict churn** — identify at-risk accounts
• **Generate content** — draft emails, proposals, and social posts
• **Enrich companies** — look up company information

Try rephrasing your question or ask about one of these topics.`;
}

export type { ToolName };
