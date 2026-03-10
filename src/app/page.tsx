import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Krayavikrayam</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          AI-native Sales &amp; Marketing CRM Platform
        </p>
        <Link
          href="/dashboard/pipeline"
          className="rounded-lg bg-[var(--primary)] px-6 py-3 text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
