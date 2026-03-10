"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Building2, TrendingUp, BarChart3, DollarSign,
  Mail, Megaphone, Share2, Radio, Ticket, BookOpen, FileText, Package,
  FileCheck, Bot, Zap, Puzzle, Settings, Menu, X, ChevronDown
} from "lucide-react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { href: "/dashboard/contacts", label: "Contacts", icon: Users },
      { href: "/dashboard/accounts", label: "Accounts", icon: Building2 },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/dashboard/pipeline", label: "Pipeline", icon: TrendingUp },
      { href: "/dashboard/deals", label: "Deals", icon: DollarSign },
      { href: "/dashboard/forecasting", label: "Forecasting", icon: BarChart3 },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/dashboard/campaigns", label: "Campaigns", icon: Mail },
      { href: "/dashboard/marketing", label: "Marketing Hub", icon: Megaphone },
      { href: "/dashboard/social", label: "Social Dashboard", icon: Share2 },
      { href: "/dashboard/channels", label: "Channels", icon: Radio },
    ],
  },
  {
    label: "Service & ERP",
    items: [
      { href: "/dashboard/tickets", label: "Tickets", icon: Ticket },
      { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen },
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/dashboard/products", label: "Products", icon: Package },
      { href: "/dashboard/quotes", label: "Quotes", icon: FileCheck },
    ],
  },
  {
    label: "AI & Automation",
    items: [
      { href: "/dashboard/ai-agents", label: "AI Agents", icon: Bot },
      { href: "/dashboard/automations", label: "Automations", icon: Zap },
      { href: "/dashboard/integrations", label: "Integrations", icon: Puzzle },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            K
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Krayavikrayam</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">{session.user?.name || "User"}</p>
              <p className="truncate text-[10px] text-gray-500">{session.user?.email || ""}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 lg:ml-0 ml-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {navSections.flatMap(s => s.items).find(i => i.href === pathname || (i.href !== "/dashboard" && pathname.startsWith(i.href)))?.label || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-[10px] text-gray-500">
              ⌘K
            </kbd>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
