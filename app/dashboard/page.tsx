"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Users, DollarSign, CheckCircle, XCircle, Target, BarChart3 } from "lucide-react";

// --- Mock Data ---
const funnelStages = [
  { id: "leads",       label: "Leads",       count: 320, value: 4800000, color: "#6366f1", widthPct: 100 },
  { id: "qualified",   label: "Qualified",   count: 144, value: 2880000, color: "#3b82f6", widthPct: 78  },
  { id: "proposal",    label: "Proposal",    count: 72,  value: 1620000, color: "#8b5cf6", widthPct: 58  },
  { id: "negotiation", label: "Negotiation", count: 38,  value: 980000,  color: "#f59e0b", widthPct: 40  },
  { id: "won",         label: "Won",         count: 24,  value: 680000,  color: "#22c55e", widthPct: 24  },
  { id: "lost",        label: "Lost",        count: 14,  value: 300000,  color: "#ef4444", widthPct: 14  },
];

const conversionRates = [
  { from: "Lead → Qualified",        rate: 45, up: true  },
  { from: "Qualified → Proposal",    rate: 50, up: true  },
  { from: "Proposal → Negotiation",  rate: 53, up: false },
  { from: "Negotiation → Won",       rate: 63, up: true  },
];

const summaryCards = [
  { label: "Total Leads",     value: "320",    icon: Users,       colorClass: "bg-indigo-50 text-indigo-600",   sub: "+28 this month"   },
  { label: "Qualified Leads", value: "144",    icon: Target,      colorClass: "bg-blue-50 text-blue-600",       sub: "45% from leads"   },
  { label: "Proposals Sent",  value: "72",     icon: BarChart3,   colorClass: "bg-purple-50 text-purple-600",   sub: "50% of qualified" },
  { label: "Deals Won",       value: "24",     icon: CheckCircle, colorClass: "bg-green-50 text-green-600",     sub: "This quarter"     },
  { label: "Deals Lost",      value: "14",     icon: XCircle,     colorClass: "bg-red-50 text-red-600",         sub: "This quarter"     },
  { label: "Win Rate",        value: "63%",    icon: TrendingUp,  colorClass: "bg-amber-50 text-amber-600",     sub: "+5% vs last qtr"  },
  { label: "Avg Deal Size",   value: "$28.3K", icon: DollarSign,  colorClass: "bg-emerald-50 text-emerald-600", sub: "Closed Won avg"   },
  { label: "Total Revenue",   value: "$680K",  icon: DollarSign,  colorClass: "bg-teal-50 text-teal-600",       sub: "Closed Won value" },
];

const recentActivity = [
  { id: 1, type: "won",   deal: "Stark Industries - Integration",  from: "Negotiation", to: "Won",         time: "2 hours ago",  value: "$180K", user: "Alice Johnson" },
  { id: 2, type: "moved", deal: "Acme Corp - Enterprise Plan",     from: "Qualified",   to: "Proposal",    time: "4 hours ago",  value: "$120K", user: "Alice Johnson" },
  { id: 3, type: "moved", deal: "Globex - Annual License",         from: "Proposal",    to: "Negotiation", time: "Yesterday",    value: "$85K",  user: "Alice Johnson" },
  { id: 4, type: "new",   deal: "Initech - Starter Pack",          from: "",            to: "Lead",        time: "Yesterday",    value: "$15K",  user: "Bob Martinez"  },
  { id: 5, type: "lost",  deal: "Oscorp - Research License",       from: "Negotiation", to: "Lost",        time: "2 days ago",   value: "$45K",  user: "Bob Martinez"  },
  { id: 6, type: "moved", deal: "Umbrella Corp - Platform",        from: "Lead",        to: "Qualified",   time: "3 days ago",   value: "$250K", user: "Alice Johnson" },
];

function formatValue(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function ActivityIcon({ type }: { type: string }) {
  if (type === "won") {
    return (
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <CheckCircle className="h-4 w-4 text-green-600" />
      </div>
    );
  }
  if (type === "lost") {
    return (
      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <XCircle className="h-4 w-4 text-red-600" />
      </div>
    );
  }
  if (type === "new") {
    return (
      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
        <Users className="h-4 w-4 text-indigo-600" />
      </div>
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
      <ArrowRight className="h-4 w-4 text-blue-600" />
    </div>
  );
}

export default function DashboardPage() {
  const wonCount = funnelStages.find((s) => s.id === "won")!.count;
  const totalLeads = funnelStages[0].count;
  const leadToOrderRate = Math.round((wonCount / totalLeads) * 100);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Welcome to Krayavikrayam — your commerce command center.
          </p>
        </div>
        <Link
          href="/dashboard/pipeline"
          className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          View Pipeline <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Lead-to-Order Banner */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-200">Lead-to-Order Conversion Rate</p>
            <p className="text-5xl font-bold mt-1">{leadToOrderRate}%</p>
            <p className="text-sm text-indigo-200 mt-2">
              {wonCount} deals won out of {totalLeads} total leads this quarter
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-indigo-100">Total Pipeline Value</p>
            <p className="text-2xl font-bold mt-1">{formatValue(funnelStages[0].value)}</p>
            <p className="text-xs text-indigo-200 mt-1">Across all stages</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${card.colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{card.label}</p>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Funnel Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-base font-semibold mb-6">Sales Funnel</h2>
          <div className="space-y-2">
            {funnelStages.map((stage, idx) => (
              <div key={stage.id}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-24 shrink-0">{stage.label}</span>
                  <div className="flex-1 relative h-10">
                    <div
                      className="h-10 rounded-md flex items-center px-4"
                      style={{ width: `${stage.widthPct}%`, backgroundColor: stage.color, opacity: 0.85 }}
                    >
                      <span className="text-white text-sm font-semibold">{stage.count}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold w-16 text-right shrink-0">
                    {formatValue(stage.value)}
                  </span>
                </div>
                {/* Conversion Rate Connector */}
                {idx < conversionRates.length && (
                  <div className="flex items-center gap-2 pl-[6.5rem] py-0.5">
                    <div className="h-3 border-l-2 border-dashed border-gray-300 ml-3" />
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {conversionRates[idx].from}:
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-0.5 ${
                        conversionRates[idx].up ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {conversionRates[idx].rate}%
                      {conversionRates[idx].up
                        ? <TrendingUp className="h-3 w-3" />
                        : <TrendingDown className="h-3 w-3" />
                      }
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Stage Legend */}
          <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
            {funnelStages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm inline-block" style={{ backgroundColor: stage.color }} />
                <span className="text-xs text-[var(--muted-foreground)]">{stage.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Conversion Panel */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-base font-semibold mb-5">Stage Conversions</h2>
          <div className="space-y-5">
            {conversionRates.map((cr) => (
              <div key={cr.from}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[var(--muted-foreground)]">{cr.from}</span>
                  <span className={`text-sm font-bold ${cr.up ? "text-green-600" : "text-red-500"}`}>
                    {cr.rate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cr.rate}%`, backgroundColor: cr.up ? "#22c55e" : "#ef4444" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-3">Win / Loss Split</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">63%</p>
                <p className="text-xs text-green-700 mt-1">Win Rate</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-500">37%</p>
                <p className="text-xs text-red-600 mt-1">Loss Rate</p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/forecasting"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            View Forecasting <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">Recent Deal Activity</h2>
          <Link
            href="/dashboard/deals"
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            View all deals <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <ActivityIcon type={activity.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{activity.deal}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {activity.type === "new"
                        ? `New lead entered pipeline`
                        : activity.type === "won"
                        ? `Moved to Won 🎉`
                        : activity.type === "lost"
                        ? `Marked as Lost`
                        : `${activity.from} → ${activity.to}`}
                      {" · "}{activity.user}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{activity.value}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
