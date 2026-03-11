"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 42000, target: 45000 },
  { month: "Feb", revenue: 48000, target: 47000 },
  { month: "Mar", revenue: 55000, target: 50000 },
  { month: "Apr", revenue: 51000, target: 52000 },
  { month: "May", revenue: 62000, target: 55000 },
  { month: "Jun", revenue: 68000, target: 58000 },
  { month: "Jul", revenue: 72000, target: 62000 },
  { month: "Aug", revenue: 78000, target: 65000 },
  { month: "Sep", revenue: 85000, target: 70000 },
  { month: "Oct", revenue: 91000, target: 75000 },
  { month: "Nov", revenue: 97000, target: 80000 },
  { month: "Dec", revenue: 105000, target: 85000 },
];

export function RevenueChart() {
  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Revenue Overview
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #fff)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fill="url(#revenueGradient)"
            strokeWidth={2}
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#10b981"
            fill="none"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
