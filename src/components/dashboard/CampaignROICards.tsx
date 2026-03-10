"use client";

import { Mail, Globe, Megaphone, Target } from "lucide-react";

interface Campaign {
  name: string;
  type: string;
  spend: number;
  revenue: number;
  roi: number;
  icon: React.ElementType;
}

const campaigns: Campaign[] = [
  { name: "Email Drip Q1", type: "Email", spend: 2400, revenue: 18600, roi: 675, icon: Mail },
  { name: "Google Ads", type: "PPC", spend: 8500, revenue: 42000, roi: 394, icon: Globe },
  { name: "LinkedIn Campaign", type: "Social", spend: 3200, revenue: 14800, roi: 363, icon: Megaphone },
  { name: "Retargeting", type: "Display", spend: 1800, revenue: 9200, roi: 411, icon: Target },
];

export function CampaignROICards() {
  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Campaign ROI
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.name}
            className="rounded-lg border border-gray-100 p-3 dark:border-gray-800"
          >
            <div className="mb-2 flex items-center gap-2">
              <campaign.icon className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {campaign.name}
              </span>
            </div>
            <p className="text-lg font-bold text-green-600">{campaign.roi}%</p>
            <p className="text-[10px] text-gray-500">
              ${campaign.spend.toLocaleString()} spent → ${campaign.revenue.toLocaleString()} revenue
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
