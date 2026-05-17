import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm"
      >
        <h1
          id="login-title"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Sign in to Krayavikrayam
        </h1>
        <p className="mt-2 text-sm text-muted">
          Auth lands in a follow-up session (Track F). For local development,
          set <code className="rounded bg-border/40 px-1">NEXT_PUBLIC_AUTH_BYPASS=1</code>
          {" "}to bypass.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Continue to buyer portal
        </Link>
      </section>
    </main>
  );
}
