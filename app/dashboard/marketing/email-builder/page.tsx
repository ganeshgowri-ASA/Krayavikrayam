"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Type, Image, Columns, Minus, Square, MousePointerClick,
  GripVertical, Eye, Code, Trash2, MoveUp, MoveDown, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BlockType = "heading" | "text" | "image" | "button" | "divider" | "columns";

interface EmailBlock {
  id: string;
  type: BlockType;
  content: Record<string, string>;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Heading", icon: <Type className="h-5 w-5" /> },
  { type: "text", label: "Text Block", icon: <Square className="h-5 w-5" /> },
  { type: "image", label: "Image", icon: <Image className="h-5 w-5" /> },
  { type: "button", label: "Button", icon: <MousePointerClick className="h-5 w-5" /> },
  { type: "divider", label: "Divider", icon: <Minus className="h-5 w-5" /> },
  { type: "columns", label: "Two Columns", icon: <Columns className="h-5 w-5" /> },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function defaultContent(type: BlockType): Record<string, string> {
  switch (type) {
    case "heading": return { text: "Your Heading Here" };
    case "text": return { text: "Add your email content here. You can customize this text block with your message." };
    case "image": return { src: "https://placehold.co/600x200/f97316/white?text=Your+Image", alt: "Image" };
    case "button": return { text: "Click Here", url: "#", color: "#f97316" };
    case "divider": return {};
    case "columns": return { left: "Left column content", right: "Right column content" };
  }
}

export default function EmailBuilderPage() {
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [subject, setSubject] = useState("Your email subject line");
  const [blocks, setBlocks] = useState<EmailBlock[]>([
    { id: generateId(), type: "heading", content: { text: "Welcome to Krayavikrayam!" } },
    { id: generateId(), type: "text", content: { text: "We're excited to have you on board. Here's what you can expect from us." } },
    { id: generateId(), type: "image", content: { src: "https://placehold.co/600x200/f97316/white?text=Hero+Image", alt: "Hero" } },
    { id: generateId(), type: "button", content: { text: "Get Started", url: "#", color: "#f97316" } },
    { id: generateId(), type: "divider", content: {} },
    { id: generateId(), type: "text", content: { text: "If you have any questions, feel free to reach out to our support team." } },
  ]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "code">("edit");

  const addBlock = useCallback((type: BlockType) => {
    setBlocks((prev) => [...prev, { id: generateId(), type, content: defaultContent(type) }]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  }, [selectedBlock]);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated;
    });
  }, []);

  const updateBlockContent = useCallback((id: string, key: string, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => b.id === id ? { ...b, content: { ...b.content, [key]: value } } : b)
    );
  }, []);

  const renderBlock = (block: EmailBlock) => {
    switch (block.type) {
      case "heading":
        return <h2 className="text-2xl font-bold text-gray-900">{block.content.text}</h2>;
      case "text":
        return <p className="text-gray-600 leading-relaxed">{block.content.text}</p>;
      case "image":
        return (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.content.src} alt={block.content.alt} className="max-w-full rounded-lg mx-auto" />
          </div>
        );
      case "button":
        return (
          <div className="text-center">
            <span className="inline-block px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: block.content.color }}>
              {block.content.text}
            </span>
          </div>
        );
      case "divider":
        return <hr className="border-gray-200 my-2" />;
      case "columns":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">{block.content.left}</div>
            <div className="p-3 bg-gray-50 rounded">{block.content.right}</div>
          </div>
        );
    }
  };

  const generateHtml = () => {
    const bodyHtml = blocks.map((block) => {
      switch (block.type) {
        case "heading": return `<h2 style="font-size:24px;font-weight:bold;color:#111;margin:16px 0">${block.content.text}</h2>`;
        case "text": return `<p style="color:#666;line-height:1.6;margin:12px 0">${block.content.text}</p>`;
        case "image": return `<div style="text-align:center;margin:16px 0"><img src="${block.content.src}" alt="${block.content.alt}" style="max-width:100%;border-radius:8px" /></div>`;
        case "button": return `<div style="text-align:center;margin:20px 0"><a href="${block.content.url}" style="display:inline-block;padding:12px 24px;background:${block.content.color};color:#fff;text-decoration:none;border-radius:8px;font-weight:500">${block.content.text}</a></div>`;
        case "divider": return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />`;
        case "columns": return `<table width="100%"><tr><td width="50%" style="padding:8px">${block.content.left}</td><td width="50%" style="padding:8px">${block.content.right}</td></tr></table>`;
        default: return "";
      }
    }).join("\n");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${subject}</title></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">${bodyHtml}</body></html>`;
  };

  const selected = blocks.find((b) => b.id === selectedBlock);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Builder</h2>
          <p className="text-muted-foreground">Drag-and-drop email template designer</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            {(["edit", "preview", "code"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                {mode === "code" ? <Code className="h-4 w-4" /> : mode === "preview" ? <Eye className="h-4 w-4" /> : mode}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Block palette */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Template Name</Label>
                <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Subject Line</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Add Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
                  >
                    {bt.icon}
                    <span className="text-xs">{bt.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selected && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Edit Block</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(selected.content).map(([key, value]) => (
                  <div key={key}>
                    <Label className="capitalize">{key}</Label>
                    {value.length > 50 ? (
                      <Textarea
                        value={value}
                        onChange={(e) => updateBlockContent(selected.id, key, e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => updateBlockContent(selected.id, key, e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Canvas */}
        <div className="col-span-9">
          {viewMode === "code" ? (
            <Card>
              <CardContent className="p-4">
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                  {generateHtml()}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-900 p-8 min-h-[600px]">
                  <div className="max-w-[600px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 space-y-4">
                      {blocks.map((block, idx) => (
                        <div
                          key={block.id}
                          className={cn(
                            "group relative rounded-lg transition-all",
                            viewMode === "edit" && "hover:ring-2 hover:ring-primary/30 p-2 -mx-2",
                            selectedBlock === block.id && viewMode === "edit" && "ring-2 ring-primary"
                          )}
                          onClick={() => viewMode === "edit" && setSelectedBlock(block.id)}
                        >
                          {viewMode === "edit" && (
                            <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1">
                              <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }} className="p-1 rounded hover:bg-muted" title="Move up">
                                <MoveUp className="h-3 w-3" />
                              </button>
                              <GripVertical className="h-3 w-3 text-muted-foreground mx-auto" />
                              <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }} className="p-1 rounded hover:bg-muted" title="Move down">
                                <MoveDown className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          {renderBlock(block)}
                          {viewMode === "edit" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                              className="absolute -right-2 -top-2 hidden group-hover:flex p-1 rounded-full bg-destructive text-destructive-foreground shadow-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {blocks.length === 0 && viewMode === "edit" && (
                        <div className="text-center py-20 text-muted-foreground">
                          <p>No blocks yet. Add blocks from the sidebar to start building your email.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
