"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, Building2, Activity } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="text-gray-600 mb-8">Manage your contacts, accounts, and deals.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/contacts"
          className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
          </div>
          <p className="text-sm text-gray-500">Manage your contacts, track leads, and nurture relationships.</p>
        </Link>

        <Link
          href="/dashboard/accounts"
          className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Building2 size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Accounts</h2>
          </div>
          <p className="text-sm text-gray-500">Track companies, industries, and organizational relationships.</p>
        </Link>

        <div className="bg-white rounded-lg border p-6 opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Deals</h2>
          </div>
          <p className="text-sm text-gray-500">Pipeline management coming soon.</p>
        </div>
      </div>
    </div>
  );
}
