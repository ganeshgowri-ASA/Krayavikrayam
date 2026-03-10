"use client";

import { formatDate } from "@/lib/utils";
import type { DealActivity } from "@/lib/types";

const activityIcons: Record<string, string> = {
  NOTE: "N",
  CALL: "C",
  EMAIL: "E",
  MEETING: "M",
  STAGE_CHANGE: "S",
  STATUS_CHANGE: "!",
  TASK: "T",
  OTHER: "O",
};

const activityColors: Record<string, string> = {
  NOTE: "#64748b",
  CALL: "#3b82f6",
  EMAIL: "#8b5cf6",
  MEETING: "#f59e0b",
  STAGE_CHANGE: "#22c55e",
  STATUS_CHANGE: "#ef4444",
  TASK: "#06b6d4",
  OTHER: "#94a3b8",
};

interface ActivityTimelineProps {
  activities: DealActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-[var(--muted-foreground)] py-4">
        No activities yet
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border)]" />
      <div className="space-y-4">
        {sorted.map((activity) => (
          <div key={activity.id} className="relative flex gap-4 pl-0">
            <div
              className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: activityColors[activity.type] }}
            >
              {activityIcons[activity.type]}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activity.title}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {activity.type.replace("_", " ")}
                </span>
              </div>
              {activity.notes && (
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                  {activity.notes}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {formatDate(activity.createdAt)}
                </span>
                {activity.userName && (
                  <span className="text-xs text-[var(--muted-foreground)]">
                    by {activity.userName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
