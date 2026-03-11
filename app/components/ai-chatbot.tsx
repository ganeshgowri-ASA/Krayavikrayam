"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Minimize2,
  ChevronDown,
  CreditCard,
  Bell,
  FileWarning,
  Calendar,
  BarChart2,
  FileText,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: "Check payment status", icon: CreditCard, intent: "check_payment_status" },
  { label: "Send payment reminder", icon: Bell, intent: "send_payment_reminder" },
  { label: "View overdue invoices", icon: FileWarning, intent: "view_overdue_invoices" },
  { label: "Schedule follow-up", icon: Calendar, intent: "schedule_followup" },
  { label: "Get deal summary", icon: BarChart2, intent: "get_deal_summary" },
  { label: "Generate report", icon: FileText, intent: "generate_report" },
];

const MOCK_RESPONSES: Record<string, string> = {
  check_payment_status: `Here's the current payment status overview:

• **Acme Corp** — Invoice #INV-2024-089 — $12,500 — Paid ✅
• **TechStart Inc** — Invoice #INV-2024-102 — $8,200 — Pending (due in 3 days) ⏳
• **Omega Solutions** — Invoice #INV-2024-098 — $5,750 — Overdue by 12 days ⚠️
• **BlueWave Ltd** — Invoice #INV-2024-115 — $3,400 — Paid ✅

Total outstanding: **$13,950** across 2 invoices.`,

  send_payment_reminder: `Payment reminders sent successfully!

I've sent reminders to:
• **TechStart Inc** — $8,200 due in 3 days (email + SMS)
• **Omega Solutions** — $5,750 overdue 12 days (email + phone call scheduled)

Reminder templates used: "Friendly Nudge" for TechStart, "Urgent Notice" for Omega Solutions.`,

  view_overdue_invoices: `Overdue Invoices Report:

| Client | Invoice | Amount | Days Overdue |
|--------|---------|--------|-------------|
| Omega Solutions | #INV-2024-098 | $5,750 | 12 days |
| NovaTech | #INV-2024-087 | $9,100 | 28 days |
| Prism Digital | #INV-2024-081 | $2,300 | 45 days |

**Total overdue: $17,150**
Recommended action: Schedule AI voice calls for NovaTech and Prism Digital.`,

  schedule_followup: `Follow-up scheduled!

I've added the following to your calendar:
• **Call with TechStart Inc** — Tomorrow at 2:00 PM
• **Email follow-up to Omega Solutions** — Today at 5:00 PM
• **Demo call with Prism Digital** — Friday at 10:00 AM

Would you like me to also prepare talking points for these meetings?`,

  get_deal_summary: `Deal Pipeline Summary:

**Q1 2026 Pipeline Value: $2.4M**

• 🔥 Hot Deals (5): $680,000 — Avg close prob: 82%
• 🌡️ Warm Deals (12): $1,100,000 — Avg close prob: 55%
• ❄️ Cold Deals (8): $620,000 — Avg close prob: 20%

Top deals this month:
1. **Enterprise SaaS Bundle** — $240,000 — Closing Friday
2. **Managed Services Contract** — $185,000 — Negotiation stage
3. **Platform License** — $120,000 — Demo scheduled`,

  generate_report: `Report generated successfully!

**Monthly Revenue Report — March 2026**
• Total Revenue: $145,200 (↑ 18% vs Feb)
• New Clients: 7
• Deals Closed: 14
• Average Deal Size: $10,371

📊 Report saved to your dashboard and emailed to admin@company.com.
Would you like me to also generate a forecast for Q2?`,
};

function getMockResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("payment status") || lower.includes("check payment"))
    return MOCK_RESPONSES.check_payment_status;
  if (lower.includes("payment reminder") || lower.includes("send reminder"))
    return MOCK_RESPONSES.send_payment_reminder;
  if (lower.includes("overdue") || lower.includes("late invoice"))
    return MOCK_RESPONSES.view_overdue_invoices;
  if (lower.includes("follow") || lower.includes("schedule"))
    return MOCK_RESPONSES.schedule_followup;
  if (lower.includes("deal") || lower.includes("pipeline") || lower.includes("summary"))
    return MOCK_RESPONSES.get_deal_summary;
  if (lower.includes("report") || lower.includes("generate"))
    return MOCK_RESPONSES.generate_report;

  return `I understand you're asking about "${text}". Here's what I can help you with in your CRM:

• **Payment tracking** — Check outstanding invoices and send reminders
• **Deal management** — View pipeline status and deal summaries
• **Follow-ups** — Schedule calls, emails, and meetings
• **Reports** — Generate revenue, activity, and forecast reports

Try one of the quick action buttons below, or ask me something specific!`;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Krayavikrayam AI assistant. I can help you check payment status, send reminders, view overdue invoices, and much more. What would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text?: string, intent?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setShowQuickActions(false);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            intent,
            pageUrl: window.location.pathname,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) throw new Error("API error");
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content:
              data.message ?? getMockResponse(messageText),
            timestamp: new Date(),
          },
        ]);
      } catch {
        // Graceful fallback to mock responses
        await new Promise((r) => setTimeout(r, 600));
        const mockReply = intent ? MOCK_RESPONSES[intent] : getMockResponse(messageText);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: mockReply,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[0]) => {
    sendMessage(action.label, action.intent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-700 active:scale-95"
        aria-label="Open AI assistant"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-xl transition-all hover:bg-blue-700"
      >
        <Bot className="h-5 w-5" />
        <span className="text-sm font-medium">Krayavikrayam AI</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-sm font-semibold">Krayavikrayam AI</span>
            <span className="block text-[10px] text-blue-100">
              {isLoading ? "Thinking..." : "Online"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded p-1.5 transition-colors hover:bg-blue-500"
            aria-label="Minimize"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1.5 transition-colors hover:bg-blue-500"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mt-1">
                <Bot className="h-3.5 w-3.5 text-blue-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span
                className={cn(
                  "mt-1 block text-[10px]",
                  msg.role === "user" ? "text-blue-100" : "text-gray-400"
                )}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mt-1">
              <Bot className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-gray-800">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="border-t border-gray-100 px-3 py-2 dark:border-gray-800">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.intent}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-left text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Icon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your CRM..."
            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:focus:bg-gray-750"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
