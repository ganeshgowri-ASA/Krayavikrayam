"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  FileText,
  DollarSign,
  UserPlus,
  CreditCard,
  Flag,
  Mail,
  Phone,
  Bell,
  BarChart2,
  RefreshCw,
  CheckCircle,
  Pause,
  Play,
  ArrowRight,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AutomationAction {
  label: string;
  icon: React.ElementType;
  color: string;
}

interface Automation {
  id: string;
  name: string;
  triggerLabel: string;
  triggerIcon: React.ElementType;
  triggerColor: string;
  actions: AutomationAction[];
  status: "active" | "paused";
  lastRun: string;
  runCount: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialAutomations: Automation[] = [
  {
    id: "auto-1",
    name: "Invoice Overdue → Reminder + AI Call",
    triggerLabel: "Invoice overdue > 7 days",
    triggerIcon: FileText,
    triggerColor: "red",
    actions: [
      { label: "Send payment reminder email", icon: Mail, color: "blue" },
      { label: "Schedule AI voice call", icon: Phone, color: "purple" },
    ],
    status: "active",
    lastRun: "2 hours ago",
    runCount: 84,
  },
  {
    id: "auto-2",
    name: "Deal Stage Changed → Notify + Forecast",
    triggerLabel: "Deal stage changed",
    triggerIcon: DollarSign,
    triggerColor: "blue",
    actions: [
      { label: "Notify team members", icon: Bell, color: "yellow" },
      { label: "Update revenue forecast", icon: BarChart2, color: "green" },
    ],
    status: "active",
    lastRun: "35 min ago",
    runCount: 213,
  },
  {
    id: "auto-3",
    name: "New Lead Assigned → Welcome + Intro Call",
    triggerLabel: "New lead assigned",
    triggerIcon: UserPlus,
    triggerColor: "green",
    actions: [
      { label: "Send welcome email", icon: Mail, color: "blue" },
      { label: "Schedule intro call", icon: Phone, color: "purple" },
    ],
    status: "active",
    lastRun: "1 hour ago",
    runCount: 156,
  },
  {
    id: "auto-4",
    name: "Payment Received → Update Ledger + Receipt",
    triggerLabel: "Payment received",
    triggerIcon: CreditCard,
    triggerColor: "green",
    actions: [
      { label: "Update ledger & records", icon: RefreshCw, color: "teal" },
      { label: "Send receipt to client", icon: Mail, color: "blue" },
      { label: "Send thank you call", icon: Phone, color: "purple" },
    ],
    status: "active",
    lastRun: "4 hours ago",
    runCount: 97,
  },
  {
    id: "auto-5",
    name: "Milestone Reached → Notify Stakeholders + Report",
    triggerLabel: "Project milestone reached",
    triggerIcon: Flag,
    triggerColor: "orange",
    actions: [
      { label: "Notify all stakeholders", icon: Bell, color: "yellow" },
      { label: "Generate progress report", icon: BarChart2, color: "green" },
    ],
    status: "paused",
    lastRun: "3 days ago",
    runCount: 28,
  },
];

// ─── Color maps ───────────────────────────────────────────────────────────────

const triggerBg: Record<string, string> = {
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

const actionBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(initialAutomations);

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a
      )
    );
  };

  const totalActive = automations.filter((a) => a.status === "active").length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runCount, 0);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
            <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automations</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure trigger-based workflows to automate your CRM processes
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          New Automation
        </button>
      </div>

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Automations</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{automations.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalActive}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Runs</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalRuns.toLocaleString()}</p>
        </div>
      </div>

      {/* Automation cards */}
      <div className="space-y-4">
        {automations.map((automation) => {
          const TriggerIcon = automation.triggerIcon;
          const isActive = automation.status === "active";

          return (
            <div
              key={automation.id}
              className={cn(
                "rounded-xl border bg-white transition-all dark:bg-gray-900",
                isActive
                  ? "border-gray-200 dark:border-gray-700"
                  : "border-gray-100 opacity-70 dark:border-gray-800"
              )}
            >
              <div className="p-5">
                {/* Top row: name + status toggle */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {automation.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      )}
                    >
                      {isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleStatus(automation.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                        : "border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                    )}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-3 w-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" /> Enable
                      </>
                    )}
                  </button>
                </div>

                {/* Trigger → Actions flow */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Trigger */}
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <div className={cn("rounded-lg p-1.5", triggerBg[automation.triggerColor])}>
                      <TriggerIcon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Trigger
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {automation.triggerLabel}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />

                  {/* Actions */}
                  {automation.actions.map((action, idx) => {
                    const ActionIcon = action.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        {idx > 0 && (
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        )}
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                          <div className={cn("rounded-lg p-1.5", actionBg[action.color])}>
                            <ActionIcon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                              Action {idx + 1}
                            </p>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {action.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer meta */}
                <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    Last run: <span className="text-gray-600 dark:text-gray-300">{automation.lastRun}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Activity className="h-3.5 w-3.5" />
                    Run count: <span className="font-medium text-gray-600 dark:text-gray-300">{automation.runCount.toLocaleString()}</span>
                  </div>
                  <button className="ml-auto text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                    Edit
                  </button>
                  <button className="text-xs text-gray-400 hover:text-red-500">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
