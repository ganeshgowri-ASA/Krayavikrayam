"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Zap, GitBranch, Mail, MessageSquare, Webhook, RefreshCw, Bell,
  Clock, UserPlus, DollarSign, Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const triggerIcons: Record<string, typeof Zap> = {
  new_contact: UserPlus,
  deal_stage_change: DollarSign,
  ticket_created: Ticket,
  scheduled: Clock,
};

const actionIcons: Record<string, typeof Zap> = {
  send_email: Mail,
  send_sms: MessageSquare,
  call_webhook: Webhook,
  update_record: RefreshCw,
  create_task: Zap,
  notify_slack: Bell,
};

export function TriggerNode({ data }: NodeProps) {
  const Icon = triggerIcons[data.triggerType as string] || Zap;
  return (
    <div className="rounded-lg border-2 border-indigo-400 bg-indigo-50 px-4 py-3 shadow-md min-w-[180px]">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-700">Trigger</span>
      </div>
      <p className="mt-1 text-xs text-indigo-600">{data.label as string}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500" />
    </div>
  );
}

export function ConditionNode({ data }: NodeProps) {
  return (
    <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 shadow-md min-w-[180px]">
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-semibold text-amber-700">Condition</span>
      </div>
      <p className="mt-1 text-xs text-amber-600">{data.label as string}</p>
      <Handle type="source" position={Position.Bottom} id="yes" className={cn("!bg-green-500 !left-[30%]")} />
      <Handle type="source" position={Position.Bottom} id="no" className={cn("!bg-red-500 !left-[70%]")} />
    </div>
  );
}

export function ActionNode({ data }: NodeProps) {
  const Icon = actionIcons[data.actionType as string] || Zap;
  return (
    <div className="rounded-lg border-2 border-emerald-400 bg-emerald-50 px-4 py-3 shadow-md min-w-[180px]">
      <Handle type="target" position={Position.Top} className="!bg-emerald-500" />
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-700">Action</span>
      </div>
      <p className="mt-1 text-xs text-emerald-600">{data.label as string}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500" />
    </div>
  );
}

export const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};
