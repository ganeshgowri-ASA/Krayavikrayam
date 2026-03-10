"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityTimeline } from "./activity-timeline";
import {
  formatCurrency,
  formatDate,
  getProbabilityColor,
  calculateDealScore,
} from "@/lib/utils";
import type { Deal } from "@/lib/types";

interface DealDetailViewProps {
  deal: Deal;
}

export function DealDetailView({ deal }: DealDetailViewProps) {
  const daysSinceActivity = Math.floor(
    (Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const autoScore = calculateDealScore(deal.probability, daysSinceActivity);
  const probColor = getProbabilityColor(deal.probability);

  const statusVariant =
    deal.status === "WON"
      ? "success"
      : deal.status === "LOST"
      ? "danger"
      : "default";

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard/pipeline"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          &larr; Back to Pipeline
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{deal.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={statusVariant}>{deal.status}</Badge>
            <span className="text-2xl font-bold text-[var(--primary)]">
              {formatCurrency(deal.value, deal.currency)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[var(--muted-foreground)]">AI Score</div>
          <div
            className="text-3xl font-bold"
            style={{ color: getProbabilityColor(autoScore) }}
          >
            {autoScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">Stage</dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: deal.stage?.color }}
                    />
                    <span className="font-medium">{deal.stage?.name}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    Probability
                  </dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: probColor }}
                    />
                    <span className="font-medium">{deal.probability}%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    Expected Close
                  </dt>
                  <dd className="font-medium mt-1">
                    {deal.expectedCloseDate
                      ? formatDate(deal.expectedCloseDate)
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    Created
                  </dt>
                  <dd className="font-medium mt-1">
                    {formatDate(deal.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    Owner
                  </dt>
                  <dd className="font-medium mt-1">
                    {deal.ownerName || "Unassigned"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    Last Updated
                  </dt>
                  <dd className="font-medium mt-1">
                    {formatDate(deal.updatedAt)}
                  </dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {deal.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={deal.activities || []} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              {deal.contactName ? (
                <div>
                  <p className="font-medium">{deal.contactName}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    ID: {deal.contactId}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No contact linked
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              {deal.accountName ? (
                <div>
                  <p className="font-medium">{deal.accountName}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    ID: {deal.accountId}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No account linked
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scoring Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Stage probability
                  </span>
                  <span className="font-medium">{deal.probability}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Days since activity
                  </span>
                  <span className="font-medium">{daysSinceActivity}d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Activity recency factor
                  </span>
                  <span className="font-medium">
                    {Math.round(Math.max(0, 1 - daysSinceActivity / 30) * 100)}%
                  </span>
                </div>
                <hr className="border-[var(--border)]" />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Auto-Score</span>
                  <span style={{ color: getProbabilityColor(autoScore) }}>
                    {autoScore}/100
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Score = 70% stage probability + 30% activity recency
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
