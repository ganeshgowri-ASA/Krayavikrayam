"use client";

import { Bot, Lightbulb, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "recommendation" | "alert" | "opportunity";
  agent: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    id: "1",
    type: "alert",
    agent: "churn-prediction",
    title: "3 Enterprise Accounts at Risk",
    description:
      "Login frequency dropped 60% for MegaCorp, DataVault, and StreamLine. Immediate outreach recommended.",
    priority: "high",
  },
  {
    id: "2",
    type: "opportunity",
    agent: "lead-scoring",
    title: "5 Hot Leads Ready for Outreach",
    description:
      "Leads from TechFusion, CloudBase, and 3 others scored above 85. Engagement spiked this week.",
    priority: "high",
  },
  {
    id: "3",
    type: "recommendation",
    agent: "forecasting",
    title: "Q1 Revenue Target Achievable",
    description:
      "Pipeline analysis shows 92% probability of hitting Q1 target if 4 key deals close on schedule.",
    priority: "medium",
  },
  {
    id: "4",
    type: "recommendation",
    agent: "follow-up",
    title: "12 Deals Need Follow-Up",
    description:
      "Deals in proposal stage with no activity in 7+ days. Personalized templates ready to send.",
    priority: "medium",
  },
];

const typeConfig = {
  recommendation: { icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  alert: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  opportunity: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
};

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
};

export function AIInsightsPanel() {
  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
        </div>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {insights.length} new
        </span>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={insight.id}
              className={cn(
                "rounded-lg border-l-4 p-3",
                priorityColors[insight.priority],
                config.bg
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {insight.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  via {insight.agent} agent
                </span>
                <button className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Take action <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
