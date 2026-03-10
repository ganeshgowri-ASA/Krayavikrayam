"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: string;
    status: string;
    accountId: string | null;
    contactTags: Array<{ tag: { name: string } }>;
  };
}

export function ContactForm({ initialData }: ContactFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    source: initialData?.source || "OTHER",
    status: initialData?.status || "LEAD",
    accountId: initialData?.accountId || "",
    tags: initialData?.contactTags.map((ct) => ct.tag.name).join(", ") || "",
  });

  const utils = trpc.useUtils();

  const create = trpc.contact.create.useMutation({
    onSuccess: (data) => {
      utils.contact.list.invalidate();
      router.push(`/dashboard/contacts/${data.id}`);
    },
    onError: (err) => setError(err.message),
  });

  const update = trpc.contact.update.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.contact.getById.invalidate({ id: initialData!.id });
      router.push(`/dashboard/contacts/${initialData!.id}`);
    },
    onError: (err) => setError(err.message),
  });

  const checkDuplicate = trpc.contact.checkDuplicate.useQuery(
    { email: form.email || undefined, phone: form.phone || undefined },
    {
      enabled: false,
    }
  );

  const handleBlur = async () => {
    if (!form.email && !form.phone) return;
    const result = await checkDuplicate.refetch();
    if (result.data?.duplicate && result.data.match) {
      const m = result.data.match;
      if (initialData && m.id === initialData.id) return;
      setDuplicateWarning(`Possible duplicate: ${m.name} (${m.email || m.phone})`);
    } else {
      setDuplicateWarning("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      source: form.source as "WEBSITE" | "REFERRAL" | "LINKEDIN" | "COLD_CALL" | "TRADE_SHOW" | "ADVERTISEMENT" | "OTHER",
      status: form.status as "LEAD" | "PROSPECT" | "CUSTOMER" | "CHURNED" | "INACTIVE",
      accountId: form.accountId || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (initialData) {
      update.mutate({ id: initialData.id, data: payload });
    } else {
      create.mutate(payload);
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? "Edit Contact" : "New Contact"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
      {duplicateWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg">
          {duplicateWarning}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="OTHER">Other</option>
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="COLD_CALL">Cold Call</option>
              <option value="TRADE_SHOW">Trade Show</option>
              <option value="ADVERTISEMENT">Advertisement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LEAD">Lead</option>
              <option value="PROSPECT">Prospect</option>
              <option value="CUSTOMER">Customer</option>
              <option value="CHURNED">Churned</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="e.g. VIP, Enterprise, Hot Lead"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          {isPending ? "Saving..." : initialData ? "Update Contact" : "Create Contact"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
