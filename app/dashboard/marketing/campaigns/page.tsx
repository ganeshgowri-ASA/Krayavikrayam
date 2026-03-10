"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mockCampaigns, type CampaignStatus, type CampaignType } from "@/lib/marketing-data";
import { Plus, Search, Mail, MessageSquare, Share2, ArrowUpRight } from "lucide-react";

const statusVariant: Record<CampaignStatus, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  DRAFT: "secondary",
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "default",
};

const typeIcon: Record<CampaignType, React.ReactNode> = {
  EMAIL: <Mail className="h-4 w-4" />,
  SMS: <MessageSquare className="h-4 w-4" />,
  SOCIAL: <Share2 className="h-4 w-4" />,
};

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockCampaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">Manage your email, SMS, and social media campaigns</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <option value="all">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <option value="all">All Types</option>
          <option value="EMAIL">Email</option>
          <option value="SMS">SMS</option>
          <option value="SOCIAL">Social</option>
        </Select>
      </div>

      <div className="grid gap-4">
        {filtered.map((campaign) => (
          <Link key={campaign.id} href={`/dashboard/marketing/campaigns/${campaign.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted">
                      {typeIcon[campaign.type]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge variant={statusVariant[campaign.status]}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {campaign.type} &middot; Created {campaign.createdAt} &middot; by {campaign.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    {campaign.sent ? (
                      <>
                        <div className="text-center">
                          <p className="text-muted-foreground">Sent</p>
                          <p className="font-semibold">{campaign.sent?.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Open Rate</p>
                          <p className="font-semibold">{campaign.openRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">CTR</p>
                          <p className="font-semibold">{campaign.clickRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-emerald-600">${campaign.revenue?.toLocaleString()}</p>
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not launched yet</span>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No campaigns found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
