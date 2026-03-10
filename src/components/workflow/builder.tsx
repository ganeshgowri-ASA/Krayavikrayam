"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes";
import { WorkflowSidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

interface WorkflowBuilderProps {
  workflowId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  workflowName?: string;
}

export function WorkflowBuilder({
  workflowId,
  initialNodes = [],
  initialEdges = [],
  workflowName = "New Workflow",
}: WorkflowBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState(workflowName);
  const [saving, setSaving] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow-type");
      const subType = e.dataTransfer.getData("application/reactflow-subtype");
      const label = e.dataTransfer.getData("application/reactflow-label");

      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = {
        x: e.clientX - (bounds?.left || 0) - 90,
        y: e.clientY - (bounds?.top || 0) - 20,
      };

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: {
          label,
          ...(type === "trigger" ? { triggerType: subType } : {}),
          ...(type === "action" ? { actionType: subType } : {}),
          ...(type === "condition" ? { conditionType: subType } : {}),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        name,
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle })),
        triggerType: nodes.find((n) => n.type === "trigger")?.data?.triggerType || "new_contact",
      };

      const url = workflowId ? `/api/automations?id=${workflowId}` : "/api/automations";
      const method = workflowId ? "PUT" : "POST";

      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <WorkflowSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
            placeholder="Workflow name..."
          />
          <Button onClick={handleSave} disabled={saving} size="sm">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
