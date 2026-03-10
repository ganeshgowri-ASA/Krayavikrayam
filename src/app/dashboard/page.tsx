"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, Building2, Activity, TrendingUp, Mail, Ticket, Bot, Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const modules = [
    { href: "/dashboard/contacts", label: "Contacts", icon: Users, color: "blue", desc: "Manage contacts and leads" },
    { href: "/dashboard/accounts", label: "Accounts", icon: Building2, color: "green", desc: "Track companies and orgs" },
    { href: "/dashboard/pipeline", label: "Pipeline", icon: TrendingUp, color: "purple", desc: "Manage deals and pipeline" },
    { href: "/dashboard/campaigns", label: "Marketing", icon: Mail, color: "orange", desc: "Campaigns and email marketing" },
    { href: "/dashboard/tickets", label: "Tickets", icon: Ticket, color: "red", desc: "Support tickets and SLA" },
    { href: "/dashboard/ai-agents", label: "AI Agents", icon: Bot, color: "indigo", desc: "Autonomous AI assistants" },
    { href: "/dashboard/automations", label: "Automations", icon: Zap, color: "yellow", desc: "Workflows and automation" },
    { href: "/dashboard/activities", label: "Activities", icon: Activity, color: "teal", desc: "Track all activities" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-native CRM/ERP — manage sales, marketing, service, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-lg bg-${mod.color}-100 dark:bg-${mod.color}-900/30 flex items-center justify-center`}>
                  <Icon size={18} className={`text-${mod.color}-600 dark:text-${mod.color}-400`} />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{mod.label}</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mod.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
