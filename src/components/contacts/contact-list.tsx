"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  LEAD: "bg-blue-100 text-blue-800",
  PROSPECT: "bg-yellow-100 text-yellow-800",
  CUSTOMER: "bg-green-100 text-green-800",
  CHURNED: "bg-red-100 text-red-800",
  INACTIVE: "bg-gray-100 text-gray-800",
};

export function ContactList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  const filters = {
    search: search || undefined,
    status: (status || undefined) as "LEAD" | "PROSPECT" | "CUSTOMER" | "CHURNED" | "INACTIVE" | undefined,
    source: (source || undefined) as "WEBSITE" | "REFERRAL" | "LINKEDIN" | "COLD_CALL" | "TRADE_SHOW" | "ADVERTISEMENT" | "OTHER" | undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, refetch } = trpc.contact.list.useQuery(filters);
  const bulkDelete = trpc.contact.bulkDelete.useMutation({
    onSuccess: () => {
      setSelected(new Set());
      refetch();
    },
  });
  const bulkUpdateStatus = trpc.contact.bulkUpdateStatus.useMutation({
    onSuccess: () => {
      setSelected(new Set());
      refetch();
    },
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (!data) return;
    if (selected.size === data.contacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.contacts.map((c) => c.id)));
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      alert(`Imported: ${result.imported}, Skipped: ${result.skipped}${result.duplicates?.length ? `\nDuplicates: ${result.duplicates.join(", ")}` : ""}`);
      refetch();
    } catch {
      alert("Import failed");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="flex items-center gap-2">
          <label className={cn("flex items-center gap-2 px-3 py-2 text-sm border rounded-lg cursor-pointer hover:bg-gray-50", importing && "opacity-50")}>
            <Upload size={16} />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importing} />
          </label>
          <a
            href="/api/contacts/export"
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            <Download size={16} />
            Export
          </a>
          <Link
            href="/dashboard/contacts/new"
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            New Contact
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Statuses</option>
          <option value="LEAD">Lead</option>
          <option value="PROSPECT">Prospect</option>
          <option value="CUSTOMER">Customer</option>
          <option value="CHURNED">Churned</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Sources</option>
          <option value="WEBSITE">Website</option>
          <option value="REFERRAL">Referral</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="COLD_CALL">Cold Call</option>
          <option value="TRADE_SHOW">Trade Show</option>
          <option value="ADVERTISEMENT">Advertisement</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                bulkUpdateStatus.mutate({
                  ids: Array.from(selected),
                  status: e.target.value as "LEAD" | "PROSPECT" | "CUSTOMER" | "CHURNED" | "INACTIVE",
                });
                e.target.value = "";
              }
            }}
            className="px-2 py-1 border rounded text-sm"
            defaultValue=""
          >
            <option value="" disabled>Change Status</option>
            <option value="LEAD">Lead</option>
            <option value="PROSPECT">Prospect</option>
            <option value="CUSTOMER">Customer</option>
            <option value="CHURNED">Churned</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button
            onClick={() => {
              if (confirm(`Delete ${selected.size} contacts?`)) {
                bulkDelete.mutate({ ids: Array.from(selected) });
              }
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={data ? selected.size === data.contacts.length && data.contacts.length > 0 : false}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : data?.contacts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No contacts found</td>
              </tr>
            ) : (
              data?.contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleSelect(contact.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.company || contact.account?.companyName || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", statusColors[contact.status])}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.source.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {contact.contactTags.map((ct) => (
                        <span
                          key={ct.tagId}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                        >
                          {ct.tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm">
              Page {page} of {data.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
