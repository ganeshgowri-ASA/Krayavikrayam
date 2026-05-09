import Link from "next/link";
import { Bell, HelpCircle } from "lucide-react";

type User = {
  name: string;
  role: string;
};

const CURRENT_USER: User = {
  name: "Asha Kumar",
  role: "Buyer",
};

const NOTIFICATION_COUNT = 3;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function TopBar() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6"
    >
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="Krayavikrayam home"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-accent text-xs font-bold text-white"
        >
          K
        </span>
        <span className="text-base font-semibold tracking-tight text-slate-900">
          Krayavikrayam
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Help"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={
            NOTIFICATION_COUNT > 0
              ? `Notifications (${NOTIFICATION_COUNT} unread)`
              : "Notifications"
          }
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {NOTIFICATION_COUNT > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white"
            >
              {NOTIFICATION_COUNT > 9 ? "9+" : NOTIFICATION_COUNT}
            </span>
          )}
        </button>

        <div className="ml-2 h-6 w-px bg-slate-200" aria-hidden="true" />

        <button
          type="button"
          aria-label={`Account menu for ${CURRENT_USER.name}, ${CURRENT_USER.role}`}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-slate-100"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white"
          >
            {initials(CURRENT_USER.name)}
          </span>
          <span className="flex flex-col text-left leading-tight">
            <span className="text-sm font-medium text-slate-900">
              {CURRENT_USER.name}
            </span>
            <span className="text-xs text-slate-500">{CURRENT_USER.role}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
