import Link from "next/link";
import { Bell, HelpCircle } from "lucide-react";
import type { CurrentUser } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";

const NOTIFICATION_COUNT = 3;

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

type TopBarProps = {
  user: CurrentUser;
  notificationCount?: number;
};

export function TopBar({ user, notificationCount = NOTIFICATION_COUNT }: TopBarProps) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-6"
    >
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="Krayavikrayam home"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground"
        >
          K
        </span>
        <span className="text-base font-semibold tracking-tight text-foreground">
          Krayavikrayam
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Help"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-border/40 hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={
            notificationCount > 0
              ? `Notifications (${notificationCount} unread)`
              : "Notifications"
          }
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-border/40 hover:text-foreground"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {notificationCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white"
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="ml-2 h-6 w-px bg-border" aria-hidden="true" />

        <button
          type="button"
          aria-label={`Account menu for ${user.name}, ${user.role}`}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-border/40"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"
          >
            {initials(user.name)}
          </span>
          <span className="flex flex-col text-left leading-tight">
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted">{user.role}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
