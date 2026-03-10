import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krayavikrayam - Sales CRM",
  description: "AI-native Sales & Marketing CRM Platform",
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
