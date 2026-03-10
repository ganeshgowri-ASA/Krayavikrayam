import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { FloatingChatbot } from "@/components/chatbot/FloatingChatbot";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krayavikrayam — AI-native Sales & Marketing CRM",
  description:
    "Agentic AI-powered CRM/ERP SaaS with chatbot, pipeline management, and intelligent automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingChatbot />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
