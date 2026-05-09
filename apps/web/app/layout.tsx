import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krayavikrayam — Buyer portal",
  description:
    "Krayavikrayam buyer portal: purchase requests, RFQs, orders, inspection, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-1.5 focus:text-sm focus:shadow"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 overflow-y-auto px-6 py-6"
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
