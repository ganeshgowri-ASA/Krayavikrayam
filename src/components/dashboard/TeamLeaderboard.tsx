"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  dealsWon: number;
  revenue: number;
  winRate: number;
  trend: "up" | "down";
}

const teamData: TeamMember[] = [
  { name: "Sarah Chen", role: "Sr. Account Exec", dealsWon: 12, revenue: 284000, winRate: 68, trend: "up" },
  { name: "James Wilson", role: "Account Exec", dealsWon: 10, revenue: 215000, winRate: 62, trend: "up" },
  { name: "Priya Patel", role: "Sr. Account Exec", dealsWon: 9, revenue: 198000, winRate: 58, trend: "down" },
  { name: "Mike Johnson", role: "Account Exec", dealsWon: 8, revenue: 176000, winRate: 55, trend: "up" },
  { name: "Emily Davis", role: "SDR Lead", dealsWon: 7, revenue: 142000, winRate: 52, trend: "down" },
];

export function TeamLeaderboard() {
  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Team Performance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Deals</th>
              <th className="pb-2 font-medium">Revenue</th>
              <th className="pb-2 font-medium">Win %</th>
              <th className="pb-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member, idx) => (
              <tr
                key={member.name}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="py-2 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                <td className="py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </td>
                <td className="py-2 text-gray-900 dark:text-white">{member.dealsWon}</td>
                <td className="py-2 text-gray-900 dark:text-white">
                  ${member.revenue.toLocaleString()}
                </td>
                <td className="py-2 text-gray-900 dark:text-white">{member.winRate}%</td>
                <td className="py-2">
                  {member.trend === "up" ? (
                    <TrendingUp className={cn("h-4 w-4 text-green-500")} />
                  ) : (
                    <TrendingDown className={cn("h-4 w-4 text-red-500")} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
