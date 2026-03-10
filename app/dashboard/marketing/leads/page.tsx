"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockLeads } from "@/lib/marketing-data";
import { calculateLeadScore, getScoreTierColor, getScoreBarColor } from "@/lib/lead-scoring-engine";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, Users, Target, Flame } from "lucide-react";

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  const scoredLeads = useMemo(() => {
    return mockLeads
      .map((lead) => {
        const result = calculateLeadScore(lead.factors);
        return { ...lead, ...result };
      })
      .sort((a, b) => b.score - a.score);
  }, []);

  const filtered = scoredLeads.filter((lead) => {
    if (!search) return true;
    return (
      lead.contactName.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  const tierCounts = useMemo(() => {
    const counts = { hot: 0, warm: 0, cool: 0, cold: 0 };
    scoredLeads.forEach((l) => { counts[l.tier]++; });
    return counts;
  }, [scoredLeads]);

  const summaryCards = [
    { label: "Total Leads", value: scoredLeads.length, icon: Users, color: "text-blue-600" },
    { label: "Hot Leads", value: tierCounts.hot, icon: Flame, color: "text-red-600" },
    { label: "Warm Leads", value: tierCounts.warm, icon: TrendingUp, color: "text-orange-600" },
    { label: "Avg Score", value: Math.round(scoredLeads.reduce((s, l) => s + l.score, 0) / scoredLeads.length), icon: Target, color: "text-purple-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Lead Scoring</h2>
        <p className="text-muted-foreground">AI-powered lead scoring to prioritize your outreach</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {lead.contactName.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{lead.contactName}</h3>
                    <Badge className={getScoreTierColor(lead.tier)}>
                      {lead.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{lead.contactEmail}</p>
                </div>

                {/* Sparkline */}
                <div className="w-24 h-10 hidden sm:block">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lead.trend.map((v, i) => ({ v, i }))}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={lead.score >= 80 ? "#ef4444" : lead.score >= 60 ? "#f97316" : lead.score >= 40 ? "#3b82f6" : "#94a3b8"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold">{lead.score}</p>
                  <div className="w-20 h-1.5 rounded-full bg-muted mt-1">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(lead.score)}`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Factor breakdown */}
              <div className="mt-3 pt-3 border-t flex flex-wrap gap-3">
                {lead.factors.map((factor) => (
                  <div key={factor.name} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{factor.name}:</span>
                    <div className="w-16 h-1 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                    <span className="font-medium">{factor.value}</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {lead.recommendations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lead.recommendations.slice(0, 2).map((rec, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {rec}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
