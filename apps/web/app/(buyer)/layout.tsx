import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { getCurrentUser } from "@/lib/auth";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user =
    getCurrentUser() ??
    (process.env.NEXT_PUBLIC_AUTH_BYPASS === "1"
      ? {
          id: "user_demo",
          name: "Asha Kumar",
          email: "asha@krayavikrayam.dev",
          role: "Buyer" as const,
        }
      : null);

  if (!user) redirect("/login");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-1.5 focus:text-sm focus:text-foreground focus:shadow"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar user={user} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
