"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function AccountList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    companyName: "",
    industry: "",
    website: "",
    size: "",
    revenue: "",
    address: "",
  });

  const filters = {
    search: search || undefined,
    industry: industry || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, refetch } = trpc.account.list.useQuery(filters);
  const { data: industries } = trpc.account.industries.useQuery();
  const utils = trpc.useUtils();

  const createAccount = trpc.account.create.useMutation({
    onSuccess: (data) => {
      setShowCreate(false);
      setCreateForm({ companyName: "", industry: "", website: "", size: "", revenue: "", address: "" });
      utils.account.list.invalidate();
      router.push(`/dashboard/accounts/${data.id}`);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> New Account
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Account</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                value={createForm.companyName}
                onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                value={createForm.industry}
                onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={createForm.website}
                onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select
                value={createForm.size}
                onChange={(e) => setCreateForm({ ...createForm, size: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Select...</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1001+">1001+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
              <input
                type="text"
                value={createForm.revenue}
                onChange={(e) => setCreateForm({ ...createForm, revenue: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="e.g. $1M - $10M"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                if (!createForm.companyName.trim()) return;
                createAccount.mutate(createForm);
              }}
              disabled={createAccount.isPending}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createAccount.isPending ? "Creating..." : "Create"}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Industries</option>
          {industries?.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacts</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : data?.accounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No accounts found</td>
              </tr>
            ) : (
              data?.accounts.map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Building2 size={16} className="text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">{account.companyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{account.industry || "—"}</td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {account.website ? (
                      <span onClick={(e) => e.stopPropagation()}>{account.website}</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{account.size || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{account._count.contacts}</td>
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
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm">Page {page} of {data.pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="p-2 border rounded-lg disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
