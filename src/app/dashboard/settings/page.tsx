"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Building2, Users, CreditCard, Key, Plus, Copy, Trash2, Eye, EyeOff,
} from "lucide-react";

const tabs = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api-keys", label: "API Keys", icon: Key },
];

const demoUsers = [
  { id: "u1", name: "Ganesh Gowri", email: "ganesh@example.com", role: "admin" },
  { id: "u2", name: "Priya Sharma", email: "priya@example.com", role: "manager" },
  { id: "u3", name: "Rahul Kumar", email: "rahul@example.com", role: "member" },
];

const demoApiKeys = [
  { id: "k1", name: "Production API", prefix: "kv_prod_", createdAt: "2026-02-15", lastUsedAt: "2026-03-09", isActive: true },
  { id: "k2", name: "Development API", prefix: "kv_dev_", createdAt: "2026-01-20", lastUsedAt: "2026-03-08", isActive: true },
  { id: "k3", name: "Zapier Integration", prefix: "kv_zap_", createdAt: "2026-03-01", lastUsedAt: null, isActive: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("org");
  const [showNewKey, setShowNewKey] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === "org" && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Manage your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Krayavikrayam Demo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    defaultValue="krayavikrayam-demo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>INR - Indian Rupee</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>
                <Button size="sm">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Users & Role Management</CardTitle>
                  <CardDescription>Manage team members and their permissions</CardDescription>
                </div>
                <Button size="sm"><Plus className="h-4 w-4" /> Invite User</Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {demoUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={user.role}
                          className="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your plan and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-indigo-900">Free Plan</h3>
                      <p className="text-sm text-indigo-700">Up to 500 contacts, 3 users, 5 automations</p>
                    </div>
                    <Button size="sm">Upgrade</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Usage</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Contacts", used: 142, limit: 500 },
                      { label: "Users", used: 3, limit: 3 },
                      { label: "Automations", used: 4, limit: 5 },
                      { label: "API Calls (this month)", used: 2847, limit: 10000 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium">{item.used} / {item.limit}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "api-keys" && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API keys for external integrations</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowNewKey(true)}>
                    <Plus className="h-4 w-4" /> Create Key
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {demoApiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{apiKey.name}</p>
                            <Badge variant={apiKey.isActive ? "success" : "default"}>
                              {apiKey.isActive ? "Active" : "Revoked"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {revealedKeys[apiKey.id] ? `${apiKey.prefix}${"x".repeat(32)}` : `${apiKey.prefix}${"•".repeat(32)}`}
                            </code>
                            <button onClick={() => setRevealedKeys((p) => ({ ...p, [apiKey.id]: !p[apiKey.id] }))}>
                              {revealedKeys[apiKey.id] ? <EyeOff className="h-3 w-3 text-gray-400" /> : <Eye className="h-3 w-3 text-gray-400" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Created {apiKey.createdAt}
                            {apiKey.lastUsedAt && ` · Last used ${apiKey.lastUsedAt}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Modal open={showNewKey} onClose={() => setShowNewKey(false)} title="Create API Key">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Production API"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option>Never</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowNewKey(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => setShowNewKey(false)}>Create Key</Button>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
