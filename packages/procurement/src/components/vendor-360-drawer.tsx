"use client";

import { Building2, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVendor } from "../api/client";
import { formatMoney } from "../lib/utils";
import { Drawer } from "./drawer";

export function Vendor360Drawer({
  vendorId,
  open,
  onOpenChange,
}: {
  vendorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: vendor, isLoading } = useVendor(vendorId);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={vendor ? vendor.name : "Vendor 360"}
      description={vendor ? `${vendor.country} · risk ${vendor.riskScore}` : undefined}
      testId="vendor-360-drawer"
      width={520}
    >
      {isLoading && <p className="text-sm text-muted-foreground">Loading vendor…</p>}
      {!isLoading && !vendor && (
        <p className="text-sm text-muted-foreground">Select an RFQ row to view its vendor.</p>
      )}
      {vendor && (
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-3">
            <Stat icon={<Star className="h-4 w-4" />} label="Rating" value={vendor.rating.toFixed(1)} />
            <Stat
              icon={<TrendingUp className="h-4 w-4" />}
              label="On-time"
              value={`${vendor.onTimeDelivery}%`}
            />
            <Stat
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Quality"
              value={`${vendor.qualityScore}%`}
            />
            <Stat
              icon={<Building2 className="h-4 w-4" />}
              label="Active RFQs"
              value={String(vendor.activeRfqCount)}
            />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Spend
            </h3>
            <p className="text-2xl font-semibold tabular-nums">
              {formatMoney(vendor.totalSpend)}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Certifications
            </h3>
            <ul className="flex flex-wrap gap-1">
              {vendor.certifications.map((c) => (
                <li
                  key={c}
                  className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200"
                >
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Primary contacts
            </h3>
            <ul className="space-y-1 text-sm">
              {vendor.contacts.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span>{c.name}</span>
                  <a
                    className="text-blue-600 hover:underline"
                    href={`mailto:${c.email}`}
                  >
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Risk
            </h3>
            <span
              className={cn(
                "inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                vendor.riskScore === "low" && "bg-emerald-50 text-emerald-800 ring-emerald-200",
                vendor.riskScore === "medium" && "bg-amber-50 text-amber-800 ring-amber-200",
                vendor.riskScore === "high" && "bg-rose-50 text-rose-800 ring-rose-200"
              )}
            >
              {vendor.riskScore.toUpperCase()}
            </span>
          </section>
        </div>
      )}
    </Drawer>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
