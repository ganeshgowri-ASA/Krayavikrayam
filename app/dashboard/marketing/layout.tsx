"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Megaphone,
  Mail,
  Users,
  Share2,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const marketingNav = [
  { name: "Campaigns", href: "/dashboard/marketing/campaigns", icon: Megaphone },
  { name: "Email Builder", href: "/dashboard/marketing/email-builder", icon: Mail },
  { name: "Lead Scoring", href: "/dashboard/marketing/leads", icon: Users },
  { name: "Channels", href: "/dashboard/marketing/channels", icon: Share2 },
  { name: "Social Dashboard", href: "/dashboard/marketing/social-dashboard", icon: BarChart3 },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-xl font-bold tracking-tight">Marketing Hub</h1>
      </div>

      <nav className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {marketingNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
