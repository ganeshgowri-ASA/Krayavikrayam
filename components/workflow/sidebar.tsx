"use client";

import {
  UserPlus, DollarSign, Ticket, Clock,
  GitBranch,
  Mail, MessageSquare, Webhook, RefreshCw, Zap, Bell,
} from "lucide-react";

const triggerItems = [
  { type: "new_contact", label: "New Contact", icon: UserPlus },
  { type: "deal_stage_change", label: "Deal Stage Change", icon: DollarSign },
  { type: "ticket_created", label: "Ticket Created", icon: Ticket },
  { type: "scheduled", label: "Scheduled", icon: Clock },
];

const conditionItems = [
  { type: "if_else", label: "If / Else", icon: GitBranch },
];

const actionItems = [
  { type: "send_email", label: "Send Email (Resend)", icon: Mail },
  { type: "send_sms", label: "Send SMS", icon: MessageSquare },
  { type: "call_webhook", label: "Call Webhook", icon: Webhook },
  { type: "update_record", label: "Update Record", icon: RefreshCw },
  { type: "create_task", label: "Create Task", icon: Zap },
  { type: "notify_slack", label: "Notify Slack", icon: Bell },
];

function DragItem({ label, icon: Icon, nodeType, subType }: {
  label: string;
  icon: typeof Mail;
  nodeType: string;
  subType: string;
}) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow-type", nodeType);
    e.dataTransfer.setData("application/reactflow-subtype", subType);
    e.dataTransfer.setData("application/reactflow-label", label);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm cursor-grab hover:shadow-md transition-shadow"
    >
      <Icon className="h-4 w-4 text-gray-500" />
      <span>{label}</span>
    </div>
  );
}

export function WorkflowSidebar() {
  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Triggers</h3>
      <div className="space-y-2 mb-6">
        {triggerItems.map((item) => (
          <DragItem key={item.type} label={item.label} icon={item.icon} nodeType="trigger" subType={item.type} />
        ))}
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Conditions</h3>
      <div className="space-y-2 mb-6">
        {conditionItems.map((item) => (
          <DragItem key={item.type} label={item.label} icon={item.icon} nodeType="condition" subType={item.type} />
        ))}
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Actions</h3>
      <div className="space-y-2">
        {actionItems.map((item) => (
          <DragItem key={item.type} label={item.label} icon={item.icon} nodeType="action" subType={item.type} />
        ))}
      </div>
    </div>
  );
}
