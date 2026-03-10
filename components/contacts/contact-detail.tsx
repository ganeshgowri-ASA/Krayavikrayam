"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  MessageSquare,
  PhoneCall,
  Video,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { ContactForm } from "./contact-form";

const activityIcons: Record<string, React.ElementType> = {
  CALL: PhoneCall,
  EMAIL: MessageSquare,
  MEETING: Video,
  NOTE: FileText,
};

const statusColors: Record<string, string> = {
  LEAD: "bg-blue-100 text-blue-800",
  PROSPECT: "bg-yellow-100 text-yellow-800",
  CUSTOMER: "bg-green-100 text-green-800",
  CHURNED: "bg-red-100 text-red-800",
  INACTIVE: "bg-gray-100 text-gray-800",
};

export function ContactDetail({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({
    type: "NOTE" as "CALL" | "EMAIL" | "MEETING" | "NOTE",
    subject: "",
    description: "",
  });

  const { data: contact, isLoading } = trpc.contact.getById.useQuery({ id: contactId });
  const utils = trpc.useUtils();

  const deleteContact = trpc.contact.delete.useMutation({
    onSuccess: () => router.push("/dashboard/contacts"),
  });

  const createActivity = trpc.activity.create.useMutation({
    onSuccess: () => {
      setShowActivityForm(false);
      setActivityForm({ type: "NOTE", subject: "", description: "" });
      utils.contact.getById.invalidate({ id: contactId });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-gray-500">Loading...</div>;
  }

  if (!contact) {
    return <div className="flex items-center justify-center py-12 text-gray-500">Contact not found</div>;
  }

  if (showEdit) {
    return (
      <div>
        <button onClick={() => setShowEdit(false)} className="flex items-center gap-1 text-sm text-gray-600 mb-4 hover:text-gray-900">
          <X size={16} /> Close editor
        </button>
        <ContactForm
          initialData={{
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            source: contact.source,
            status: contact.status,
            accountId: contact.accountId,
            contactTags: contact.contactTags,
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Profile Card */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{contact.name}</h1>
                <p className="text-sm text-gray-500">{contact.company || "No company"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={cn("px-2 py-1 text-xs font-medium rounded-full", statusColors[contact.status])}>
                {contact.status}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {contact.source.replace("_", " ")}
              </span>
              {contact.contactTags.map((ct) => (
                <span key={ct.tagId} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {ct.tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this contact?")) {
                  deleteContact.mutate({ id: contact.id });
                }
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400" />
              {contact.email}
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={16} className="text-gray-400" />
              {contact.phone}
            </div>
          )}
          {contact.account && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={16} className="text-gray-400" />
              <a href={`/dashboard/accounts/${contact.account.id}`} className="text-blue-600 hover:underline">
                {contact.account.companyName}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            Created {new Date(contact.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
          <button
            onClick={() => setShowActivityForm(!showActivityForm)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={14} /> Log Activity
          </button>
        </div>

        {showActivityForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <select
                value={activityForm.type}
                onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as "CALL" | "EMAIL" | "MEETING" | "NOTE" })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="NOTE">Note</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
              </select>
              <input
                type="text"
                placeholder="Subject"
                value={activityForm.subject}
                onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <textarea
              placeholder="Description..."
              value={activityForm.description}
              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!activityForm.subject.trim()) return;
                  createActivity.mutate({
                    type: activityForm.type,
                    subject: activityForm.subject,
                    description: activityForm.description,
                    contactId: contact.id,
                  });
                }}
                disabled={createActivity.isPending}
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {createActivity.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowActivityForm(false)}
                className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {contact.activities.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No activities yet</p>
          ) : (
            contact.activities.map((activity) => {
              const Icon = activityIcons[activity.type] || FileText;
              return (
                <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{activity.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {activity.type}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.user.name || "Unknown"} &middot;{" "}
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
