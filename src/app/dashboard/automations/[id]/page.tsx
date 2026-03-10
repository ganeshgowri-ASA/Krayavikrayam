"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowBuilder } from "@/components/workflow/builder";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Pause } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const demoRuns = [
  { id: "run1", status: "completed", triggeredBy: "contact.created", startedAt: "2026-03-09T14:30:00Z", completedAt: "2026-03-09T14:30:02Z" },
  { id: "run2", status: "completed", triggeredBy: "contact.created", startedAt: "2026-03-09T10:15:00Z", completedAt: "2026-03-09T10:15:01Z" },
  { id: "run3", status: "failed", triggeredBy: "contact.created", startedAt: "2026-03-08T16:45:00Z", completedAt: "2026-03-08T16:45:03Z", error: "Email delivery failed" },
  { id: "run4", status: "completed", triggeredBy: "contact.created", startedAt: "2026-03-08T09:00:00Z", completedAt: "2026-03-08T09:00:01Z" },
];

const demoNodes = [
  { id: "1", type: "trigger" as const, position: { x: 250, y: 0 }, data: { label: "New Contact", triggerType: "new_contact" } },
  { id: "2", type: "condition" as const, position: { x: 250, y: 120 }, data: { label: "Has email?", conditionType: "if_else" } },
  { id: "3", type: "action" as const, position: { x: 100, y: 260 }, data: { label: "Send Welcome Email", actionType: "send_email" } },
  { id: "4", type: "action" as const, position: { x: 400, y: 260 }, data: { label: "Create Follow-up Task", actionType: "create_task" } },
];

const demoEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
  { id: "e2-4", source: "2", target: "4", sourceHandle: "no" },
];

export default function WorkflowDetailPage() {
  const params = useParams();
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return (
      <div className="h-full">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <Button variant="ghost" size="sm" onClick={() => setShowBuilder(false)}>
            Back to Details
          </Button>
        </div>
        <WorkflowBuilder
          workflowId={params.id as string}
          initialNodes={demoNodes}
          initialEdges={demoEdges}
          workflowName="Welcome New Contacts"
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/automations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Welcome New Contacts</h1>
          <p className="text-sm text-gray-500">Workflow ID: {params.id}</p>
        </div>
        <Badge variant="success">Active</Badge>
        <Button variant="outline" size="sm" onClick={() => setShowBuilder(true)}>
          Edit Workflow
        </Button>
        <Button variant="secondary" size="sm">
          <Pause className="h-4 w-4" />
          Pause
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">98.7%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Last Run</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2m ago</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {demoRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Badge variant={run.status === "completed" ? "success" : "error"}>
                    {run.status}
                  </Badge>
                  <span className="text-sm text-gray-600">{run.triggeredBy}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatDate(run.startedAt)}</p>
                  {run.error && <p className="text-xs text-red-500">{run.error}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
