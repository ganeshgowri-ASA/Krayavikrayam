"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Search,
  TrendingUp,
  Users,
  Mail,
  BarChart3,
  Shield,
  FileText,
  Building2,
} from "lucide-react";

const PAGES = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Agents", href: "/dashboard/ai-agents", icon: Bot },
];

const AI_QUERIES = [
  { name: "Score my leads", query: "Score my top leads", icon: TrendingUp },
  { name: "Pipeline forecast", query: "What is my pipeline value?", icon: BarChart3 },
  { name: "At-risk accounts", query: "Which accounts are at risk of churning?", icon: Shield },
  { name: "Draft follow-up email", query: "Draft a follow-up email for inactive deals", icon: Mail },
  { name: "Team performance", query: "Show team performance stats", icon: Users },
  { name: "Generate proposal", query: "Generate a sales proposal", icon: FileText },
  { name: "Enrich company", query: "Look up company information", icon: Building2 },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const navigateTo = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const runAiQuery = async (query: string) => {
    setOpen(false);
    // Dispatch custom event that FloatingChatbot listens for
    window.dispatchEvent(
      new CustomEvent("ai-query", { detail: { query } })
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <div className="absolute left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2">
        <Command className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-700">
            <Search className="h-4 w-4 text-gray-400" />
            <Command.Input
              placeholder="Search pages, run AI queries..."
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-white"
              autoFocus
            />
            <kbd className="rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-500 dark:border-gray-600">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages" className="mb-2">
              {PAGES.map((page) => (
                <Command.Item
                  key={page.href}
                  onSelect={() => navigateTo(page.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 aria-selected:bg-blue-50 aria-selected:text-blue-600 dark:text-gray-300 dark:aria-selected:bg-blue-900/30"
                >
                  <page.icon className="h-4 w-4" />
                  {page.name}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <Command.Group heading="AI Queries" className="mt-2">
              {AI_QUERIES.map((item) => (
                <Command.Item
                  key={item.name}
                  onSelect={() => runAiQuery(item.query)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 aria-selected:bg-blue-50 aria-selected:text-blue-600 dark:text-gray-300 dark:aria-selected:bg-blue-900/30"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
            <p className="text-xs text-gray-400">
              <kbd className="rounded border border-gray-300 px-1 text-[10px] dark:border-gray-600">↑↓</kbd>{" "}
              Navigate{" "}
              <kbd className="rounded border border-gray-300 px-1 text-[10px] dark:border-gray-600">↵</kbd>{" "}
              Select{" "}
              <kbd className="rounded border border-gray-300 px-1 text-[10px] dark:border-gray-600">ESC</kbd>{" "}
              Close
            </p>
          </div>
        </Command>
      </div>
    </div>
  );
}
