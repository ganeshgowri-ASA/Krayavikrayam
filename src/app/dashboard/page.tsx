"use client";

import dynamic from "next/dynamic";

const DashboardGrid = dynamic(
  () => import("@/components/dashboard/DashboardGrid").then((m) => m.DashboardGrid),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Drag and drop widgets to customize your view. AI-powered insights update in real time.
        </p>
      </div>
      <DashboardGrid />
    </div>
  );
}
