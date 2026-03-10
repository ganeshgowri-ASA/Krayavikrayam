import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krayavikrayam - CRM/ERP",
  description: "AI-native Sales & Marketing CRM/ERP SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
