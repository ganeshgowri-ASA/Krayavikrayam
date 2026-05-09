import {
  Home,
  FileText,
  ClipboardList,
  PackageSearch,
  BadgeCheck,
  Truck,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  Database,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Order matches ProcureNXT IA documented in docs/PRD-v3.md §3.
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Purchase requests", href: "/purchase-requests", icon: FileText },
  { label: "RFQs", href: "/rfqs", icon: ClipboardList },
  { label: "Material inspection", href: "/material-inspection", icon: PackageSearch },
  { label: "Service certification", href: "/service-certification", icon: BadgeCheck },
  { label: "Orders", href: "/orders", icon: Truck },
  { label: "Supplier management", href: "/supplier-management", icon: Building2 },
  { label: "Workforce management", href: "/workforce-management", icon: Users },
  { label: "Access management", href: "/access-management", icon: ShieldCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Master data", href: "/master-data", icon: Database },
];
