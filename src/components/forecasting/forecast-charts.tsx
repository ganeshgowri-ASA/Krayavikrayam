"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type {
  ForecastData,
  WinLossData,
  PipelineValueData,
  Quota,
} from "@/lib/types";

interface ForecastChartsProps {
  forecast: ForecastData[];
  winLoss: WinLossData[];
  pipelineValue: PipelineValueData[];
  quotas: Quota[];
  summary: {
    totalPipelineValue: number;
    weightedPipelineValue: number;
    totalWonValue: number;
    winRate: number;
    avgDealSize: number;
    openDealsCount: number;
  };
  winLossAnalysis: {
    totalDeals: number;
    wonCount: number;
    lostCount: number;
    openCount: number;
    winRate: number;
    avgDealSize: number;
    avgTimeToClose: number;
    topLossReasons: { reason: string; count: number }[];
  };
  dealScores: {
    dealId: string;
    dealTitle: string;
    score: number;
    probability: number;
  }[];
}

function getProbScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function ForecastCharts({
  forecast,
  winLoss,
  pipelineValue,
  quotas,
  summary,
  winLossAnalysis,
  dealScores,
}: ForecastChartsProps) {
  const currentQuotas = quotas.filter((q) => q.period === "2026-Q1");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue Forecasting</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Pipeline analytics and revenue projections
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--muted-foreground)]">Pipeline Value</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.totalPipelineValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--muted-foreground)]">Weighted Value</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.weightedPipelineValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--muted-foreground)]">Win Rate</p>
            <p className="text-2xl font-bold">{summary.winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--muted-foreground)]">Avg Deal Size</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.avgDealSize)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} name="Forecast" />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="weighted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Weighted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win Rate Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={winLoss}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {winLoss.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Value by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineValue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
                  {pipelineValue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quota vs Achievement */}
        <Card>
          <CardHeader>
            <CardTitle>Quota vs Achievement (Q1 2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentQuotas.map((quota) => {
                const pct = Math.min(
                  100,
                  Math.round((quota.achievedAmount / quota.targetAmount) * 100)
                );
                const barColor = pct >= 100 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={quota.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{quota.userName}</span>
                      <span className="text-[var(--muted-foreground)]">
                        {formatCurrency(quota.achievedAmount)} / {formatCurrency(quota.targetAmount)}
                      </span>
                    </div>
                    <div className="h-6 bg-[var(--muted)] rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Auto-Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Probability Auto-Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Scores based on 70% stage probability + 30% activity recency (last 30 days)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dealScores.map((ds) => (
              <div
                key={ds.dealId}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{ds.dealTitle}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Stage: {ds.probability}%
                  </p>
                </div>
                <div
                  className="text-xl font-bold shrink-0 ml-3"
                  style={{ color: getProbScoreColor(ds.score) }}
                >
                  {ds.score}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Win/Loss Analysis Report */}
      <Card>
        <CardHeader>
          <CardTitle>Win/Loss Analysis Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Deals</p>
              <p className="text-2xl font-bold">{winLossAnalysis.totalDeals}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Won</p>
              <p className="text-2xl font-bold text-green-600">{winLossAnalysis.wonCount}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Lost</p>
              <p className="text-2xl font-bold text-red-600">{winLossAnalysis.lostCount}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Avg Time to Close</p>
              <p className="text-2xl font-bold">{winLossAnalysis.avgTimeToClose}d</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Loss Reasons</h4>
            <div className="space-y-2">
              {winLossAnalysis.topLossReasons.map((r) => (
                <div key={r.reason} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{r.reason}</span>
                      <span className="text-[var(--muted-foreground)]">{r.count} deals</span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{ width: `${(r.count / winLossAnalysis.lostCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
