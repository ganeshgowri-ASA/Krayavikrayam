"use client";

import Link from "next/link";
import { Bot, LayoutDashboard, ArrowRight, Sparkles, BarChart3, MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 dark:from-gray-950 dark:to-gray-900">
      <div className="mb-12 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg">
            K
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Krayavikrayam
          </h1>
        </div>
        <p className="mx-auto max-w-lg text-lg text-gray-600 dark:text-gray-400">
          AI-native Sales &amp; Marketing CRM with agentic intelligence, pipeline management, and real-time insights.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-purple-500" />
          <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">6 AI Agents</h3>
          <p className="text-xs text-gray-500">Lead scoring, forecasting, churn prediction, and more</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-blue-500" />
          <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Smart Dashboard</h3>
          <p className="text-xs text-gray-500">Drag-and-drop widgets with real-time data</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <MessageCircle className="mx-auto mb-3 h-8 w-8 text-green-500" />
          <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">AI Chatbot</h3>
          <p className="text-xs text-gray-500">Natural language queries across your CRM data</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <LayoutDashboard className="h-4 w-4" />
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/dashboard/ai-agents"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Bot className="h-4 w-4" />
          Manage AI Agents
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Press <kbd className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-gray-600">Cmd+K</kbd> to open the command palette
      </p>
    </div>
  );
}
