import Link from "next/link";

const navItems = [
  { href: "/dashboard/pipeline", label: "Pipeline" },
  { href: "/dashboard/pipeline/list", label: "Deals List" },
  { href: "/dashboard/deals/new", label: "New Deal" },
  { href: "/dashboard/forecasting", label: "Forecasting" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="flex h-14 items-center px-6">
          <Link href="/dashboard/pipeline" className="text-lg font-bold mr-8">
            Krayavikrayam
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
