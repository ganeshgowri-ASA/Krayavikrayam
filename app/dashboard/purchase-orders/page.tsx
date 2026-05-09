"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown, Search, X } from "lucide-react";

type POStatus = "Draft" | "Issued" | "Partially Received" | "Closed" | "Cancelled";

const PO_STATUSES: POStatus[] = [
  "Draft",
  "Issued",
  "Partially Received",
  "Closed",
  "Cancelled",
];

const PLANTS = [
  { code: "BLR-01", name: "Bengaluru Plant 01" },
  { code: "PUN-02", name: "Pune Plant 02" },
  { code: "CHN-03", name: "Chennai Plant 03" },
  { code: "DEL-04", name: "Delhi Plant 04" },
  { code: "HYD-05", name: "Hyderabad Plant 05" },
];

const SUPPLIERS = [
  { id: "s1", name: "Ramesh Steel & Alloys" },
  { id: "s2", name: "Priya Industrial Supplies" },
  { id: "s3", name: "Arjun Engineering Works" },
  { id: "s4", name: "Suresh Polymers Pvt Ltd" },
  { id: "s5", name: "Kavitha Chemicals" },
  { id: "s6", name: "Deepak Electricals" },
  { id: "s7", name: "Nandini Packaging Co" },
  { id: "s8", name: "Amar Hydraulics" },
];

interface PurchaseOrder {
  id: string;
  poNo: string;
  supplierId: string;
  supplier: string;
  plant: string;
  value: number;
  status: POStatus;
  deliveryDate: string;
  issuedDate: string;
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "po1", poNo: "PO-2026-0001", supplierId: "s1", supplier: "Ramesh Steel & Alloys",     plant: "BLR-01", value: 1450000, status: "Issued",              deliveryDate: "2026-05-20", issuedDate: "2026-04-20" },
  { id: "po2", poNo: "PO-2026-0002", supplierId: "s2", supplier: "Priya Industrial Supplies", plant: "PUN-02", value: 280000,  status: "Draft",               deliveryDate: "2026-05-25", issuedDate: "2026-04-22" },
  { id: "po3", poNo: "PO-2026-0003", supplierId: "s3", supplier: "Arjun Engineering Works",   plant: "CHN-03", value: 845000,  status: "Partially Received",  deliveryDate: "2026-05-10", issuedDate: "2026-04-10" },
  { id: "po4", poNo: "PO-2026-0004", supplierId: "s4", supplier: "Suresh Polymers Pvt Ltd",   plant: "DEL-04", value: 165000,  status: "Closed",              deliveryDate: "2026-04-28", issuedDate: "2026-04-05" },
  { id: "po5", poNo: "PO-2026-0005", supplierId: "s5", supplier: "Kavitha Chemicals",         plant: "HYD-05", value: 67500,   status: "Cancelled",           deliveryDate: "2026-04-30", issuedDate: "2026-04-02" },
  { id: "po6", poNo: "PO-2026-0006", supplierId: "s6", supplier: "Deepak Electricals",        plant: "BLR-01", value: 432000,  status: "Issued",              deliveryDate: "2026-05-18", issuedDate: "2026-04-18" },
  { id: "po7", poNo: "PO-2026-0007", supplierId: "s7", supplier: "Nandini Packaging Co",      plant: "PUN-02", value: 92000,   status: "Issued",              deliveryDate: "2026-05-12", issuedDate: "2026-04-15" },
  { id: "po8", poNo: "PO-2026-0008", supplierId: "s8", supplier: "Amar Hydraulics",           plant: "CHN-03", value: 1280000, status: "Partially Received",  deliveryDate: "2026-05-08", issuedDate: "2026-04-08" },
  { id: "po9", poNo: "PO-2026-0009", supplierId: "s1", supplier: "Ramesh Steel & Alloys",     plant: "DEL-04", value: 540000,  status: "Closed",              deliveryDate: "2026-04-15", issuedDate: "2026-03-25" },
  { id: "po10", poNo: "PO-2026-0010", supplierId: "s3", supplier: "Arjun Engineering Works",  plant: "HYD-05", value: 215000,  status: "Draft",               deliveryDate: "2026-06-01", issuedDate: "2026-04-25" },
];

const statusBadge: Record<POStatus, string> = {
  Draft:                "bg-gray-100 text-gray-700",
  Issued:               "bg-blue-100 text-blue-700",
  "Partially Received": "bg-amber-100 text-amber-800",
  Closed:               "bg-green-100 text-green-700",
  Cancelled:            "bg-red-100 text-red-700",
};

function parseStatuses(raw: string | null): POStatus[] {
  if (!raw) return [];
  const valid = new Set<string>(PO_STATUSES);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => valid.has(s)) as POStatus[];
}

function setOrDelete(params: URLSearchParams, key: string, value: string | undefined) {
  if (value && value.length > 0) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

function PurchaseOrdersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = useMemo(() => parseStatuses(searchParams.get("status")), [searchParams]);
  const supplierId = searchParams.get("supplier") ?? "";
  const plant = searchParams.get("plant") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const supplierName = useMemo(
    () => SUPPLIERS.find((s) => s.id === supplierId)?.name ?? "",
    [supplierId]
  );

  const [supplierQuery, setSupplierQuery] = useState(supplierName);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const supplierBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSupplierQuery(supplierName);
  }, [supplierName]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (supplierBoxRef.current && !supplierBoxRef.current.contains(e.target as Node)) {
        setSupplierOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const updateParams = useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams ? searchParams.toString() : "");
      mutator(next);
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  const toggleStatus = (s: POStatus) => {
    const set = new Set(statusFilter);
    if (set.has(s)) set.delete(s);
    else set.add(s);
    updateParams((p: URLSearchParams) =>
      setOrDelete(p, "status", Array.from(set).join(","))
    );
  };

  const setSupplier = (id: string) => {
    updateParams((p: URLSearchParams) => setOrDelete(p, "supplier", id));
    setSupplierOpen(false);
  };

  const setPlant = (code: string) => {
    updateParams((p: URLSearchParams) => setOrDelete(p, "plant", code));
  };

  const setDate = (key: "from" | "to", value: string) => {
    updateParams((p: URLSearchParams) => setOrDelete(p, key, value));
  };

  const clearAll = () => {
    router.replace("?", { scroll: false });
  };

  const supplierMatches = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return SUPPLIERS;
    return SUPPLIERS.filter((s) => s.name.toLowerCase().includes(q));
  }, [supplierQuery]);

  const filtered = useMemo(() => {
    return PURCHASE_ORDERS.filter((po) => {
      if (statusFilter.length > 0 && !statusFilter.includes(po.status)) return false;
      if (supplierId && po.supplierId !== supplierId) return false;
      if (plant && po.plant !== plant) return false;
      if (dateFrom && po.deliveryDate < dateFrom) return false;
      if (dateTo && po.deliveryDate > dateTo) return false;
      return true;
    });
  }, [statusFilter, supplierId, plant, dateFrom, dateTo]);

  const activeCount =
    statusFilter.length +
    (supplierId ? 1 : 0) +
    (plant ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Filter POs by status, supplier, plant and delivery date.
          </p>
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters ({activeCount})
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 mr-1">
            Status
          </span>
          {PO_STATUSES.map((s) => {
            const active = statusFilter.includes(s);
            return (
              <button
                key={s}
                aria-pressed={active}
                onClick={() => toggleStatus(s)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Supplier typeahead */}
          <div ref={supplierBoxRef} className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Supplier
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={supplierQuery}
                placeholder="Type to search suppliers..."
                onFocus={() => setSupplierOpen(true)}
                onChange={(e) => {
                  setSupplierQuery(e.target.value);
                  setSupplierOpen(true);
                  if (e.target.value.trim() === "" && supplierId) {
                    setSupplier("");
                  }
                }}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {supplierQuery && (
                <button
                  type="button"
                  aria-label="Clear supplier"
                  onClick={() => {
                    setSupplierQuery("");
                    setSupplier("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {supplierOpen && supplierMatches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {supplierMatches.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSupplier(s.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        s.id === supplierId ? "bg-blue-50 text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Plant select */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Plant
            </label>
            <div className="relative">
              <select
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All plants</option>
                {PLANTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Delivery from
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(e) => setDate("from", e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date to */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Delivery to
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDate("to", e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">PO #</th>
                <th className="text-left px-5 py-3 font-medium">Supplier</th>
                <th className="text-left px-5 py-3 font-medium">Plant</th>
                <th className="text-right px-5 py-3 font-medium">Value</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Delivery date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">
                    {po.poNo}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{po.supplier}</td>
                  <td className="px-5 py-3 text-gray-600">{po.plant}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">
                    ₹{po.value.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[po.status]}`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{po.deliveryDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500">
                    No purchase orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {PURCHASE_ORDERS.length} purchase orders
        </div>
      </div>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <PurchaseOrdersInner />
    </Suspense>
  );
}
