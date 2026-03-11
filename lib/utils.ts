import { type ClassValue, clsx } from "clsx";
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

export function calculateDealScore(stageProbability: number, lastActivityDaysAgo: number): number {
  const activityDecay = Math.max(0, 1 - lastActivityDaysAgo / 30);
  return Math.round(stageProbability * 0.7 + activityDecay * 100 * 0.3);
}

export function generateNumber(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateApiKey(prefix = "kv"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = `${prefix}_`;
  for (let i = 0; i < 40; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
