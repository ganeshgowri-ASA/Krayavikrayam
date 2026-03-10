"use client";

import { CheckCircle, Phone, Mail, Calendar, FileText, ArrowRight } from "lucide-react";

interface Activity {
  id: string;
  type: "deal_won" | "call" | "email" | "meeting" | "proposal";
  description: string;
  person: string;
  time: string;
}

const activities: Activity[] = [
  { id: "1", type: "deal_won", description: "Closed deal with", person: "Acme Corp", time: "12 min ago" },
  { id: "2", type: "call", description: "Discovery call with", person: "TechStart Inc", time: "45 min ago" },
  { id: "3", type: "email", description: "Follow-up sent to", person: "Global Systems", time: "1h ago" },
  { id: "4", type: "meeting", description: "Demo scheduled with", person: "Innovate Labs", time: "2h ago" },
  { id: "5", type: "proposal", description: "Proposal sent to", person: "DataFlow Co", time: "3h ago" },
  { id: "6", type: "email", description: "Cold outreach to", person: "CloudNine SaaS", time: "4h ago" },
];

const typeIcons: Record<Activity["type"], React.ElementType> = {
  deal_won: CheckCircle,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  proposal: FileText,
};

const typeColors: Record<Activity["type"], string> = {
  deal_won: "text-green-500",
  call: "text-blue-500",
  email: "text-purple-500",
  meeting: "text-amber-500",
  proposal: "text-cyan-500",
};

export function RecentActivities() {
  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Recent Activities
        </h3>
        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-4 w-4 ${typeColors[activity.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.description}{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.person}
                  </span>
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
