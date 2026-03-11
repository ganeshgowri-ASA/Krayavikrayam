"use client";

import { useState } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
  Voicemail,
  Mic,
  Settings,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Plus,
  BarChart3,
  Users,
  TrendingUp,
  Headphones,
  ChevronDown,
  Volume2,
  FileText,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface VoiceOption {
  id: string;
  name: string;
  accent: string;
  gender: string;
  preview: string;
}

interface CallTemplate {
  id: string;
  name: string;
  description: string;
  script: string;
  color: string;
}

interface CallRecord {
  id: string;
  date: string;
  contact: string;
  company: string;
  template: string;
  duration: string;
  outcome: "answered" | "voicemail" | "no_answer";
  recording: boolean;
}

interface ScheduledCall {
  id: string;
  contact: string;
  company: string;
  template: string;
  scheduledAt: string;
  status: "pending" | "in_progress" | "done";
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const voices: VoiceOption[] = [
  { id: "rachel", name: "Rachel", accent: "American", gender: "Female", preview: "Warm & professional tone" },
  { id: "adam", name: "Adam", accent: "American", gender: "Male", preview: "Clear & authoritative" },
  { id: "emily", name: "Emily", accent: "British", gender: "Female", preview: "Polite & friendly" },
  { id: "james", name: "James", accent: "British", gender: "Male", preview: "Confident & trustworthy" },
  { id: "priya", name: "Priya", accent: "Indian", gender: "Female", preview: "Energetic & approachable" },
  { id: "carlos", name: "Carlos", accent: "Spanish", gender: "Male", preview: "Calm & reassuring" },
];

const callTemplates: CallTemplate[] = [
  {
    id: "payment_reminder",
    name: "Payment Reminder",
    description: "Remind clients about upcoming or overdue invoices",
    script:
      "Hi {contact_name}, this is {agent_name} calling from Krayavikrayam on behalf of {company_name}. I'm reaching out regarding invoice #{invoice_number} for {amount}, which {is_due / was_due on due_date}. I wanted to check if there are any questions I can help with...",
    color: "orange",
  },
  {
    id: "milestone_update",
    name: "Milestone Update",
    description: "Notify clients about project progress milestones",
    script:
      "Hello {contact_name}, this is {agent_name} from {company_name}. Great news — we've just completed {milestone_name} on your project. I wanted to personally let you know and walk you through what this means for the next phase...",
    color: "blue",
  },
  {
    id: "followup_call",
    name: "Follow-up Call",
    description: "Follow up on proposals, demos, or conversations",
    script:
      "Hi {contact_name}, this is {agent_name} from {company_name}. I'm following up on our {previous_interaction} from {date}. I wanted to check in and see if you had a chance to review {proposal / demo / information} and answer any questions...",
    color: "purple",
  },
  {
    id: "appointment_confirmation",
    name: "Appointment Confirmation",
    description: "Confirm upcoming meetings and calls",
    script:
      "Hello {contact_name}, this is a friendly reminder from {company_name} about your upcoming {appointment_type} scheduled for {date} at {time}. Please press 1 to confirm, or 2 to reschedule...",
    color: "green",
  },
  {
    id: "overdue_notice",
    name: "Overdue Notice",
    description: "Urgent notice for significantly overdue accounts",
    script:
      "Hi, this is an important message for {contact_name} from {company_name}. We have an outstanding balance of {amount} on your account that is now {days_overdue} days past due. To avoid any service interruptions, please contact us at your earliest convenience...",
    color: "red",
  },
];

const callHistory: CallRecord[] = [
  { id: "c1", date: "Mar 11, 2026 9:14 AM", contact: "Sarah Mitchell", company: "Acme Corp", template: "Payment Reminder", duration: "2m 34s", outcome: "answered", recording: true },
  { id: "c2", date: "Mar 11, 2026 9:02 AM", contact: "James Okafor", company: "TechStart Inc", template: "Follow-up Call", duration: "0m 58s", outcome: "voicemail", recording: true },
  { id: "c3", date: "Mar 10, 2026 4:30 PM", contact: "Linda Park", company: "NovaTech", template: "Overdue Notice", duration: "—", outcome: "no_answer", recording: false },
  { id: "c4", date: "Mar 10, 2026 2:15 PM", contact: "Raj Patel", company: "Omega Solutions", template: "Appointment Confirmation", duration: "1m 12s", outcome: "answered", recording: true },
  { id: "c5", date: "Mar 10, 2026 11:00 AM", contact: "Claire Thompson", company: "BlueWave Ltd", template: "Milestone Update", duration: "3m 45s", outcome: "answered", recording: true },
  { id: "c6", date: "Mar 9, 2026 3:00 PM", contact: "Tom Nguyen", company: "Prism Digital", template: "Payment Reminder", duration: "1m 20s", outcome: "voicemail", recording: true },
];

const scheduledCalls: ScheduledCall[] = [
  { id: "s1", contact: "Mark Evans", company: "Zenith Corp", template: "Follow-up Call", scheduledAt: "Mar 12, 2026 10:00 AM", status: "pending" },
  { id: "s2", contact: "Amy Chen", company: "DataPeak", template: "Payment Reminder", scheduledAt: "Mar 12, 2026 2:00 PM", status: "pending" },
  { id: "s3", contact: "Carlos Ruiz", company: "SummitTech", template: "Appointment Confirmation", scheduledAt: "Mar 13, 2026 9:30 AM", status: "pending" },
];

const analytics = {
  totalCalls: 284,
  answerRate: 68,
  avgDuration: "2m 18s",
  successRate: 74,
};

// ─── Helper components ───────────────────────────────────────────────────────

const templateColors: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function OutcomeBadge({ outcome }: { outcome: CallRecord["outcome"] }) {
  if (outcome === "answered")
    return (
      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
        <CheckCircle className="h-3.5 w-3.5" /> Answered
      </span>
    );
  if (outcome === "voicemail")
    return (
      <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
        <Voicemail className="h-3.5 w-3.5" /> Voicemail
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
      <PhoneMissed className="h-3.5 w-3.5" /> No Answer
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Tab = "config" | "templates" | "history" | "schedule" | "settings";

export default function AIAgentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [selectedVoice, setSelectedVoice] = useState("rachel");
  const [greetingMessage, setGreetingMessage] = useState(
    "Hi {contact_name}, this is {agent_name} from Krayavikrayam. How are you today?"
  );
  const [followUpScript, setFollowUpScript] = useState(
    "I'll follow up with a summary email. Thank you for your time!"
  );
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [vapiKey, setVapiKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [scheduledList, setScheduledList] = useState(scheduledCalls);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "config", label: "Voice Config", icon: Mic },
    { id: "templates", label: "Call Templates", icon: FileText },
    { id: "history", label: "Call History", icon: Clock },
    { id: "schedule", label: "Schedule Calls", icon: Calendar },
    { id: "settings", label: "Integrations", icon: Settings },
  ];

  const answeredCount = callHistory.filter((c) => c.outcome === "answered").length;

  return (
    <div className="min-h-screen p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <PhoneCall className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Voice Agents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure AI-powered voice calls with Vapi + ElevenLabs
          </p>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Calls", value: analytics.totalCalls.toString(), icon: Phone, color: "blue" },
          { label: "Answer Rate", value: `${analytics.answerRate}%`, icon: Headphones, color: "green" },
          { label: "Avg Duration", value: analytics.avgDuration, icon: Clock, color: "purple" },
          { label: "Success Rate", value: `${analytics.successRate}%`, icon: TrendingUp, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
              <div className={cn(
                "rounded-lg p-2",
                color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
                color === "green" && "bg-green-100 dark:bg-green-900/30",
                color === "purple" && "bg-purple-100 dark:bg-purple-900/30",
                color === "orange" && "bg-orange-100 dark:bg-orange-900/30",
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  color === "blue" && "text-blue-600 dark:text-blue-400",
                  color === "green" && "text-green-600 dark:text-green-400",
                  color === "purple" && "text-purple-600 dark:text-purple-400",
                  color === "orange" && "text-orange-600 dark:text-orange-400",
                )} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                activeTab === id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Voice Configuration ── */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Select Voice (ElevenLabs)</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {voices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        selectedVoice === voice.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                        selectedVoice === voice.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      )}>
                        {voice.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{voice.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{voice.accent} · {voice.gender}</p>
                        <p className="truncate text-xs text-gray-400">{voice.preview}</p>
                      </div>
                      {selectedVoice === voice.id && (
                        <Volume2 className="ml-auto h-4 w-4 flex-shrink-0 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
                  Greeting Message
                </label>
                <textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter the greeting message the agent will use..."
                />
                <p className="mt-1 text-xs text-gray-400">
                  Variables: {"{contact_name}"}, {"{agent_name}"}, {"{company_name}"}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
                  Follow-up / Sign-off Script
                </label>
                <textarea
                  value={followUpScript}
                  onChange={(e) => setFollowUpScript(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Save Configuration
              </button>
            </div>
          )}

          {/* ── Call Templates ── */}
          {activeTab === "templates" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a template to use when making AI voice calls
                </p>
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                  <Plus className="h-3.5 w-3.5" /> New Template
                </button>
              </div>
              {callTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <button
                    onClick={() => setExpandedTemplate(expandedTemplate === tpl.id ? null : tpl.id)}
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", templateColors[tpl.color])}>
                        {tpl.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{tpl.description}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        expandedTemplate === tpl.id && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedTemplate === tpl.id && (
                    <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
                      <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Script Preview
                      </p>
                      <p className="rounded-lg bg-white p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300 leading-relaxed">
                        {tpl.script}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400">
                          Edit Script
                        </button>
                        <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
                          <Play className="h-3 w-3" /> Preview Call
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Call History ── */}
          {activeTab === "history" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {callHistory.length} calls · {answeredCount} answered
                </p>
                <button className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Contact</th>
                      <th className="pb-3 font-medium">Template</th>
                      <th className="pb-3 font-medium">Duration</th>
                      <th className="pb-3 font-medium">Outcome</th>
                      <th className="pb-3 font-medium">Recording</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callHistory.map((call) => (
                      <tr key={call.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-xs text-gray-500 whitespace-nowrap">{call.date}</td>
                        <td className="py-3">
                          <p className="font-medium text-gray-900 dark:text-white">{call.contact}</p>
                          <p className="text-xs text-gray-400">{call.company}</p>
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {call.template}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-600 dark:text-gray-400">{call.duration}</td>
                        <td className="py-3">
                          <OutcomeBadge outcome={call.outcome} />
                        </td>
                        <td className="py-3">
                          {call.recording ? (
                            <button className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                              <Play className="h-3 w-3" /> Play
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Schedule Calls ── */}
          {activeTab === "schedule" && (
            <div className="space-y-5">
              {/* New call form */}
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-800/50">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Schedule New Call
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Contact
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900">
                      <Users className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Template
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                      {callTemplates.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Batch calling (multiple contacts)</span>
                    </label>
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                  <Phone className="h-4 w-4" /> Schedule Call
                </button>
              </div>

              {/* Scheduled calls list */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Upcoming Scheduled Calls
                </h3>
                <div className="space-y-2">
                  {scheduledList.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {call.contact}
                          </p>
                          <p className="text-xs text-gray-400">{call.company} · {call.template}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{call.scheduledAt}</span>
                        <button
                          onClick={() =>
                            setScheduledList((prev) => prev.filter((c) => c.id !== call.id))
                          }
                          className="rounded-lg border border-red-200 p-1.5 text-red-400 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {scheduledList.length === 0 && (
                    <p className="py-6 text-center text-sm text-gray-400">No calls scheduled</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Integration Settings ── */}
          {activeTab === "settings" && (
            <div className="max-w-lg space-y-5">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                API keys are stored as environment variables and never exposed to the browser.
              </div>

              {[
                { id: "vapi", label: "Vapi API Key", state: vapiKey, setState: setVapiKey, placeholder: "vapi_..." },
                { id: "elevenlabs", label: "ElevenLabs API Key", state: elevenLabsKey, setState: setElevenLabsKey, placeholder: "el_..." },
              ].map(({ id, label, state, setState, placeholder }) => (
                <div key={id}>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Key className="h-4 w-4 text-gray-400" />
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showKeys ? "text" : "password"}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {showKeys ? "Hide" : "Show"} Keys
                </button>
                <button className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save API Keys
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Connection Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Vapi</span>
                    <span className={cn("flex items-center gap-1 text-xs font-medium", vapiKey ? "text-green-600" : "text-gray-400")}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", vapiKey ? "bg-green-500" : "bg-gray-400")} />
                      {vapiKey ? "Connected" : "Not configured"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">ElevenLabs</span>
                    <span className={cn("flex items-center gap-1 text-xs font-medium", elevenLabsKey ? "text-green-600" : "text-gray-400")}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", elevenLabsKey ? "bg-green-500" : "bg-gray-400")} />
                      {elevenLabsKey ? "Connected" : "Not configured"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
