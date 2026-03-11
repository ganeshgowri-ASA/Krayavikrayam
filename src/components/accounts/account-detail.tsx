"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  X,
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

export function AccountDetail({ accountId }: { accountId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    industry: "",
    website: "",
    size: "",
    revenue: "",
    address: "",
  });

  const { data: account, isLoading } = trpc.account.getById.useQuery({ id: accountId });
  const utils = trpc.useUtils();

  const updateAccount = trpc.account.update.useMutation({
    onSuccess: () => {
      setEditing(false);
      utils.account.getById.invalidate({ id: accountId });
    },
  });

  const deleteAccount = trpc.account.delete.useMutation({
    onSuccess: () => router.push("/dashboard/accounts"),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-gray-500">Loading...</div>;
  }

  if (!account) {
    return <div className="flex items-center justify-center py-12 text-gray-500">Account not found</div>;
  }

  const startEdit = () => {
    setEditForm({
      companyName: account.companyName,
      industry: account.industry || "",
      website: account.website || "",
      size: account.size || "",
      revenue: account.revenue || "",
      address: account.address || "",
    });
    setEditing(true);
  };

  return (
    <div className="max-w-4xl">
      {/* Account Card */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        {editing ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Account</h2>
              <button onClick={() => setEditing(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={editForm.industry}
                  onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                  type="text"
                  value={editForm.size}
                  onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
                <input
                  type="text"
                  value={editForm.revenue}
                  onChange={(e) => setEditForm({ ...editForm, revenue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateAccount.mutate({ id: accountId, data: editForm })}
                disabled={updateAccount.isPending}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateAccount.isPending ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                  <Building2 size={24} className="text-gray-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{account.companyName}</h1>
                  {account.industry && <p className="text-sm text-gray-500">{account.industry}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={startEdit} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this account?")) {
                      deleteAccount.mutate({ id: accountId });
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
              {account.website && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={16} className="text-gray-400" />
                  {account.website}
                </div>
              )}
              {account.size && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} className="text-gray-400" />
                  {account.size} employees
                </div>
              )}
              {account.revenue && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} className="text-gray-400" />
                  {account.revenue}
                </div>
              )}
              {account.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  {account.address}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Linked Contacts */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contacts ({account.contacts.length})
        </h2>
        {account.contacts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No linked contacts</p>
        ) : (
          <div className="divide-y">
            {account.contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/dashboard/contacts/${contact.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.email || contact.phone || "No contact info"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", statusColors[contact.status])}>
                    {contact.status}
                  </span>
                  {contact.contactTags.map((ct) => (
                    <span key={ct.tagId} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {ct.tag.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
