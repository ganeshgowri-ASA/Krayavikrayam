"use client";

import { useState, useCallback } from "react";
import { ResponsiveGridLayout, useContainerWidth, verticalCompactor } from "react-grid-layout";
import type { Layout, ResponsiveLayouts } from "react-grid-layout";
import { RevenueChart } from "./RevenueChart";
import { PipelineFunnel } from "./PipelineFunnel";
import { TeamLeaderboard } from "./TeamLeaderboard";
import { CampaignROICards } from "./CampaignROICards";
import { RecentActivities } from "./RecentActivities";
import { AIInsightsPanel } from "./AIInsightsPanel";
import "react-grid-layout/css/styles.css";

const defaultLayouts: ResponsiveLayouts = {
  lg: [
    { i: "revenue", x: 0, y: 0, w: 6, h: 4 },
    { i: "pipeline", x: 6, y: 0, w: 6, h: 4 },
    { i: "leaderboard", x: 0, y: 4, w: 4, h: 4 },
    { i: "campaigns", x: 4, y: 4, w: 4, h: 4 },
    { i: "activities", x: 8, y: 4, w: 4, h: 4 },
    { i: "insights", x: 0, y: 8, w: 12, h: 4 },
  ],
};

const WIDGET_MAP: Record<string, React.ComponentType> = {
  revenue: RevenueChart,
  pipeline: PipelineFunnel,
  leaderboard: TeamLeaderboard,
  campaigns: CampaignROICards,
  activities: RecentActivities,
  insights: AIInsightsPanel,
};

export function DashboardGrid() {
  const [layouts, setLayouts] = useState(defaultLayouts);
  const { width, containerRef, mounted } = useContainerWidth();

  const onLayoutChange = useCallback((_: Layout, allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  }, []);

  return (
    <div ref={containerRef}>
      {mounted && width > 0 && (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          rowHeight={80}
          width={width}
          onLayoutChange={onLayoutChange}
          dragConfig={{ enabled: true, handle: ".drag-handle" }}
          resizeConfig={{ enabled: true }}
          compactor={verticalCompactor}
        >
          {Object.entries(WIDGET_MAP).map(([key, Component]) => (
            <div key={key} className="relative">
              <div className="drag-handle absolute left-0 right-0 top-0 z-10 h-8 cursor-move" />
              <Component />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
