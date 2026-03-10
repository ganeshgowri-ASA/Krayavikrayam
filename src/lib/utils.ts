import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 80) return "#22c55e";
  if (probability >= 60) return "#3b82f6";
  if (probability >= 40) return "#f59e0b";
  if (probability >= 20) return "#f97316";
  return "#ef4444";
}

export function calculateDealScore(
  stageProbability: number,
  lastActivityDaysAgo: number
): number {
  const activityDecay = Math.max(0, 1 - lastActivityDaysAgo / 30);
  const activityWeight = 0.3;
  const stageWeight = 0.7;
  return Math.round(
    stageProbability * stageWeight + activityDecay * 100 * activityWeight
  );
}
