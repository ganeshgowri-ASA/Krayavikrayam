"use client";

import { useState } from "react";
import { WorkflowBuilder } from "@/components/workflow/builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Eye } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const demoWorkflows = [
  { id: "wf1", name: "Welcome New Contacts", triggerType: "new_contact", isActive: true, runCount: 156, lastRunAt: "2026-03-09T14:30:00Z" },
  { id: "wf2", name: "Deal Won Notification", triggerType: "deal_stage_change", isActive: true, runCount: 42, lastRunAt: "2026-03-09T10:15:00Z" },
  { id: "wf3", name: "Ticket Escalation", triggerType: "ticket_created", isActive: false, runCount: 89, lastRunAt: "2026-03-08T16:45:00Z" },
  { id: "wf4", name: "Weekly Report", triggerType: "scheduled", isActive: true, runCount: 12, lastRunAt: "2026-03-07T09:00:00Z" },
];

export default function AutomationsPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return (
      <div className="h-full">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <Button variant="ghost" size="sm" onClick={() => setShowBuilder(false)}>
            Back
          </Button>
        </div>
        <WorkflowBuilder />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-gray-500 text-sm mt-1">Build visual workflows to automate your business processes</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {demoWorkflows.map((wf) => (
          <Card key={wf.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{wf.name}</h3>
                  <p className="text-xs text-gray-400">
                    Trigger: {wf.triggerType.replace(/_/g, " ")} &middot; {wf.runCount} runs
                    {wf.lastRunAt && ` &middot; Last run ${formatDate(wf.lastRunAt)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={wf.isActive ? "success" : "default"}>
                  {wf.isActive ? "Active" : "Inactive"}
                </Badge>
                <Link href={`/dashboard/automations/${wf.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
