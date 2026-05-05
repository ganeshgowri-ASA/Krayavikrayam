import type { Money, RfqStatus } from "../types";

export function formatMoney(m: Money | undefined | null): string {
  if (!m) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: m.currency,
      maximumFractionDigits: 0,
    }).format(m.amount);
  } catch {
    return `${m.amount.toLocaleString()} ${m.currency}`;
  }
}

export const STATUS_LABEL: Record<RfqStatus, string> = {
  draft: "Draft",
  published: "Published",
  in_review: "In Review",
  awarded: "Awarded",
  cancelled: "Cancelled",
  closed: "Closed",
};

export const STATUS_COLOR: Record<RfqStatus, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  published: "bg-blue-100 text-blue-800 ring-blue-200",
  in_review: "bg-amber-100 text-amber-900 ring-amber-200",
  awarded: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
  closed: "bg-zinc-200 text-zinc-700 ring-zinc-300",
};

export function timeRemaining(due: string, now = new Date()): {
  ms: number;
  label: string;
  state: "breached" | "warning" | "ok";
} {
  const dueAt = new Date(due).getTime();
  const ms = dueAt - now.getTime();
  if (ms <= 0) {
    return { ms, label: "Overdue", state: "breached" };
  }
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  let label: string;
  if (days > 0) label = `${days}d ${hours}h`;
  else if (hours > 0) label = `${hours}h ${minutes}m`;
  else label = `${minutes}m`;
  const warningThreshold = 24 * 60 * 60_000;
  return { ms, label, state: ms < warningThreshold ? "warning" : "ok" };
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
