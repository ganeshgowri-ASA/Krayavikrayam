"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQueryThreads } from "../api/client";
import { MOCK_USERS } from "../api/mock";
import { useMentions } from "../hooks/use-mentions";
import type { QueryMessage } from "../types";
import { Drawer } from "./drawer";

export function QueryThreadDrawer({
  rfqId,
  open,
  onOpenChange,
}: {
  rfqId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: threads = [], isLoading } = useQueryThreads(rfqId);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const { draft, setDraft, suggestions, insertMention, mentionedIds, reset } =
    useMentions(MOCK_USERS);

  const submit = () => {
    if (!draft.trim() || !active) return;
    reset();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Query thread"
      description={active?.subject}
      testId="query-thread-drawer"
      width={460}
      footer={
        active && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="relative flex flex-col gap-2"
          >
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Reply… use @ to mention a teammate"
              className="min-h-[72px] text-sm"
            />
            {suggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Mention suggestions"
                className="absolute bottom-[80px] left-0 z-10 w-64 rounded-md border bg-popover shadow-md"
              >
                {suggestions.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => insertMention(u)}
                      className="flex w-full items-center justify-between px-2 py-1.5 text-left text-sm hover:bg-accent"
                    >
                      <span>{u.name}</span>
                      <span className="text-xs text-muted-foreground">{u.role}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {mentionedIds.length > 0
                  ? `Notifying ${mentionedIds.length}`
                  : "No @mentions"}
              </span>
              <Button type="submit" size="sm" className="gap-1" disabled={!draft.trim()}>
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </div>
          </form>
        )
      }
    >
      {isLoading && <p className="text-sm text-muted-foreground">Loading queries…</p>}
      {!isLoading && threads.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No open queries on this RFQ.
        </p>
      )}
      {threads.length > 0 && (
        <>
          <ul className="mb-3 flex flex-wrap gap-1">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs",
                    (active?.id === t.id ? "border-primary bg-primary text-primary-foreground" : "")
                  )}
                >
                  {t.subject}
                </button>
              </li>
            ))}
          </ul>
          {active && (
            <ol className="flex flex-col gap-3">
              {active.messages.map((m) => (
                <MessageItem key={m.id} message={m} />
              ))}
            </ol>
          )}
        </>
      )}
    </Drawer>
  );
}

function MessageItem({ message }: { message: QueryMessage }) {
  const rendered = message.body.split(/(@[\w .'-]+)/g).map((chunk, i) =>
    chunk.startsWith("@") ? (
      <span
        key={i}
        className="rounded bg-blue-100 px-1 font-medium text-blue-800"
      >
        {chunk}
      </span>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
  return (
    <li className="rounded-md border bg-card p-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold">{message.author.name}</span>
        <time className="text-muted-foreground" dateTime={message.createdAt}>
          {new Date(message.createdAt).toLocaleString()}
        </time>
      </div>
      <p className="text-sm leading-relaxed">{rendered}</p>
    </li>
  );
}
