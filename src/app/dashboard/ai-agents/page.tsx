"use client";

import { useState } from "react";
import {
  Bot,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Mail,
  BarChart3,
  Shield,
  FileText,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  lastRun: string | null;
  avgDuration: string;
  totalRuns: number;
  successRate: number;
  status: "idle" | "running" | "error";
}

interface RunHistoryEntry {
  id: string;
  agentId: string;
  timestamp: string;
  status: "success" | "error";
  duration: string;
  input: string;
  output: string;
}

const initialAgents: Agent[] = [
  {
    id: "lead-scoring",
    name: "Lead Scoring Agent",
    description: "Scores leads 0-100 using engagement, firmographic data, and activity recency.",
    icon: TrendingUp,
    enabled: true,
    lastRun: "2 hours ago",
    avgDuration: "1.2s",
    totalRuns: 156,
    successRate: 98.7,
    status: "idle",
  },
  {
    id: "follow-up",
    name: "Follow-Up Agent",
    description: "Generates personalized follow-up emails for inactive deals.",
    icon: Mail,
    enabled: true,
    lastRun: "30 min ago",
    avgDuration: "2.1s",
    totalRuns: 89,
    successRate: 96.6,
    status: "idle",
  },
  {
    id: "forecasting",
    name: "Forecasting Agent",
    description: "Predicts deal close probability and monthly revenue forecasts.",
    icon: BarChart3,
    enabled: true,
    lastRun: "1 hour ago",
    avgDuration: "1.8s",
    totalRuns: 134,
    successRate: 94.8,
    status: "idle",
  },
  {
    id: "churn-prediction",
    name: "Churn Prediction Agent",
    description: "Flags at-risk accounts based on engagement drops and usage patterns.",
    icon: Shield,
    enabled: true,
    lastRun: "4 hours ago",
    avgDuration: "1.5s",
    totalRuns: 72,
    successRate: 97.2,
    status: "idle",
  },
  {
    id: "content-generation",
    name: "Content Generation Agent",
    description: "Drafts email templates, proposals, and social media posts.",
    icon: FileText,
    enabled: false,
    lastRun: "1 day ago",
    avgDuration: "3.4s",
    totalRuns: 45,
    successRate: 91.1,
    status: "idle",
  },
  {
    id: "data-enrichment",
    name: "Data Enrichment Agent",
    description: "Enriches company info including industry, size, revenue, and technologies.",
    icon: Building2,
    enabled: true,
    lastRun: "6 hours ago",
    avgDuration: "4.2s",
    totalRuns: 203,
    successRate: 88.7,
    status: "idle",
  },
];

const sampleHistory: RunHistoryEntry[] = [
  { id: "r1", agentId: "lead-scoring", timestamp: "2 hours ago", status: "success", duration: "1.1s", input: "Score top 20 leads", output: "20 leads scored, 5 hot leads identified" },
  { id: "r2", agentId: "follow-up", timestamp: "30 min ago", status: "success", duration: "2.3s", input: "Generate follow-ups for inactive Q1 deals", output: "8 personalized emails generated" },
  { id: "r3", agentId: "forecasting", timestamp: "1 hour ago", status: "success", duration: "1.6s", input: "Forecast Q1 pipeline", output: "Total predicted revenue: $1.2M, avg close probability: 62%" },
  { id: "r4", agentId: "churn-prediction", timestamp: "4 hours ago", status: "error", duration: "0.8s", input: "Analyze enterprise accounts", output: "Error: insufficient data for 2 accounts" },
  { id: "r5", agentId: "data-enrichment", timestamp: "6 hours ago", status: "success", duration: "4.5s", input: "Enrich 15 new companies", output: "15 companies enriched with industry, size, and tech stack" },
];

export default function AIAgentsPage() {
  const [agents, setAgents] = useState(initialAgents);
  const [history] = useState(sampleHistory);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const triggerAgent = async (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "running" as const } : a))
    );

    // Simulate agent run
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "idle" as const, lastRun: "Just now", totalRuns: a.totalRuns + 1 }
            : a
        )
      );
    }, 2000);
  };

  const filteredHistory = selectedAgent
    ? history.filter((h) => h.agentId === selectedAgent)
    : history;

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-purple-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage, monitor, and trigger your AI agents.
            </p>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              className={cn(
                "rounded-xl border p-4 transition-all",
                agent.enabled
                  ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  : "border-gray-100 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-950",
                selectedAgent === agent.id && "ring-2 ring-blue-500"
              )}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      agent.enabled
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-gray-200 dark:bg-gray-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        agent.enabled ? "text-purple-600 dark:text-purple-400" : "text-gray-400"
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {agent.name}
                    </h3>
                    {agent.status === "running" && (
                      <span className="flex items-center gap-1 text-[10px] text-blue-500">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" /> Running...
                      </span>
                    )}
                  </div>
                </div>

                {/* Enable/Disable toggle */}
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    agent.enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  )}
                  aria-label={`${agent.enabled ? "Disable" : "Enable"} ${agent.name}`}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                      agent.enabled ? "left-[18px]" : "left-0.5"
                    )}
                  />
                </button>
              </div>

              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                {agent.description}
              </p>

              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {agent.totalRuns}
                  </p>
                  <p className="text-[10px] text-gray-500">Runs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-600">{agent.successRate}%</p>
                  <p className="text-[10px] text-gray-500">Success</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {agent.avgDuration}
                  </p>
                  <p className="text-[10px] text-gray-500">Avg Time</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  {agent.lastRun ? `Last run: ${agent.lastRun}` : "Never run"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedAgent(selectedAgent === agent.id ? null : agent.id)
                    }
                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    aria-label="View history"
                  >
                    <Clock className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => triggerAgent(agent.id)}
                    disabled={!agent.enabled || agent.status === "running"}
                    className="rounded-md bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    aria-label="Run agent"
                  >
                    {agent.status === "running" ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Run History */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <RefreshCw className="h-4 w-4" />
            Run History
            {selectedAgent && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Filtered: {selectedAgent}
              </span>
            )}
          </h2>
          {selectedAgent && (
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700">
                <th className="pb-2 font-medium">Agent</th>
                <th className="pb-2 font-medium">Input</th>
                <th className="pb-2 font-medium">Output</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Duration</th>
                <th className="pb-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 font-medium text-gray-900 dark:text-white">
                    {entry.agentId}
                  </td>
                  <td className="max-w-[200px] truncate py-2 text-gray-600 dark:text-gray-400">
                    {entry.input}
                  </td>
                  <td className="max-w-[250px] truncate py-2 text-gray-600 dark:text-gray-400">
                    {entry.output}
                  </td>
                  <td className="py-2">
                    {entry.status === "success" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" /> Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="h-3.5 w-3.5" /> Error
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">{entry.duration}</td>
                  <td className="py-2 text-gray-400">{entry.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
