import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Krayavikrayam
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-native Sales &amp; Marketing CRM/ERP SaaS with Agentic AI, Pipeline Management, and Smart Automations
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard/automations"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            View Automations
          </Link>
        </div>
      </div>
    </div>
  );
}
