"use client";

import Link from "next/link";
import { Mail, Share2, Radio, Users, TrendingUp, Eye, MousePointerClick, DollarSign } from "lucide-react";

const marketingModules = [
  {
    href: "/dashboard/marketing/campaigns",
    icon: Mail,
    title: "Campaigns",
    description: "Create and manage email, SMS, and social campaigns.",
    color: "bg-blue-500",
    stat: "12 Active",
  },
  {
    href: "/dashboard/marketing/social-dashboard",
    icon: Share2,
    title: "Social Dashboard",
    description: "Monitor and schedule posts across all social platforms.",
    color: "bg-pink-500",
    stat: "6 Platforms",
  },
  {
    href: "/dashboard/marketing/channels",
    icon: Radio,
    title: "Channels",
    description: "Connect and configure your marketing channels.",
    color: "bg-purple-500",
    stat: "8 Connected",
  },
  {
    href: "/dashboard/marketing/leads",
    icon: Users,
    title: "Lead Scoring",
    description: "AI-powered lead scoring and prioritization.",
    color: "bg-green-500",
    stat: "247 Leads",
  },
  {
    href: "/dashboard/marketing/email-builder",
    icon: Mail,
    title: "Email Builder",
    description: "Design beautiful email templates with drag & drop.",
    color: "bg-orange-500",
    stat: "34 Templates",
  },
];

const kpis = [
  { label: "Total Reach", value: "1.2M", change: "+18%", icon: Eye, color: "text-blue-600" },
  { label: "Engagement Rate", value: "4.7%", change: "+0.8%", icon: MousePointerClick, color: "text-green-600" },
  { label: "Leads Generated", value: "247", change: "+32", icon: Users, color: "text-purple-600" },
  { label: "Marketing Revenue", value: "$84K", change: "+$12K", icon: DollarSign, color: "text-orange-600" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.4%", icon: TrendingUp, color: "text-pink-600" },
];

export default function MarketingHubPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Marketing Hub</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Your central command for all marketing activities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[var(--muted-foreground)]">{kpi.label}</p>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-green-600 mt-1">{kpi.change} this month</p>
            </div>
          );
        })}
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Marketing Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketingModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-md transition-all hover:border-[var(--primary)]"
              >
                <div className="flex items-start gap-4">
                  <div className={`${mod.color} p-2.5 rounded-lg text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                        {mod.title}
                      </h3>
                      <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">
                        {mod.stat}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
