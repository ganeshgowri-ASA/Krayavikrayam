"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Mail, Calendar, MessageCircle, CreditCard, Bell, Webhook } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: typeof Mail;
  color: string;
  category: string;
  connected: boolean;
  configFields: { key: string; label: string; type: string; placeholder: string }[];
}

const integrations: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync emails, send campaigns, and track opens with Gmail OAuth",
    icon: Mail,
    color: "text-red-600 bg-red-50",
    category: "Email",
    connected: false,
    configFields: [
      { key: "clientId", label: "OAuth Client ID", type: "text", placeholder: "your-client-id.apps.googleusercontent.com" },
      { key: "clientSecret", label: "OAuth Client Secret", type: "password", placeholder: "Client secret" },
    ],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync meetings, schedule follow-ups, and auto-create calendar events",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50",
    category: "Productivity",
    connected: true,
    configFields: [
      { key: "calendarId", label: "Calendar ID", type: "text", placeholder: "primary" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Send notifications, templates, and chat with contacts via WhatsApp Business API",
    icon: MessageCircle,
    color: "text-green-600 bg-green-50",
    category: "Messaging",
    connected: false,
    configFields: [
      { key: "phoneNumberId", label: "Phone Number ID", type: "text", placeholder: "Phone number ID" },
      { key: "accessToken", label: "Access Token", type: "password", placeholder: "Bearer token" },
    ],
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Accept payments, create invoices, and track revenue with Razorpay gateway",
    icon: CreditCard,
    color: "text-indigo-600 bg-indigo-50",
    category: "Payments",
    connected: false,
    configFields: [
      { key: "keyId", label: "Key ID", type: "text", placeholder: "rzp_live_..." },
      { key: "keySecret", label: "Key Secret", type: "password", placeholder: "Key secret" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get real-time notifications for deals, tickets, and automations in Slack channels",
    icon: Bell,
    color: "text-purple-600 bg-purple-50",
    category: "Notifications",
    connected: true,
    configFields: [
      { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://hooks.slack.com/services/..." },
      { key: "channel", label: "Default Channel", type: "text", placeholder: "#general" },
    ],
  },
  {
    id: "zapier",
    name: "Zapier Webhooks",
    description: "Connect to 5,000+ apps via Zapier webhooks for custom integrations",
    icon: Webhook,
    color: "text-orange-600 bg-orange-50",
    category: "Automation",
    connected: false,
    configFields: [
      { key: "zapierWebhookUrl", label: "Zapier Webhook URL", type: "text", placeholder: "https://hooks.zapier.com/..." },
    ],
  },
];

export default function IntegrationsPage() {
  const [configModal, setConfigModal] = useState<Integration | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  );

  const toggleConnect = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
    setConfigModal(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-500 text-sm mt-1">Connect your favorite tools to supercharge your workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-lg p-3 ${integration.color}`}>
                  <integration.icon className="h-6 w-6" />
                </div>
                <Badge variant={connected[integration.id] ? "success" : "default"}>
                  {connected[integration.id] ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{integration.description}</p>
              <div className="flex items-center gap-2">
                {connected[integration.id] ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setConfigModal(integration)} className="flex-1">
                      Configure
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => toggleConnect(integration.id)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setConfigModal(integration)} className="flex-1">
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {configModal && (
        <Modal
          open={!!configModal}
          onClose={() => setConfigModal(null)}
          title={`Configure ${configModal.name}`}
        >
          <div className="space-y-4">
            {configModal.configFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setConfigModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => toggleConnect(configModal.id)}>
                {connected[configModal.id] ? "Save Changes" : "Connect"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
