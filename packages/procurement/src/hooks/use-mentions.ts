"use client";

import { useMemo, useState } from "react";
import type { User } from "../types";

const MENTION_RE = /@([A-Za-z][A-Za-z0-9 .'-]{0,40})$/;

export function extractMentions(body: string, users: User[]): string[] {
  const matched = new Set<string>();
  for (const u of users) {
    const re = new RegExp(`@${u.name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`);
    if (re.test(body)) matched.add(u.id);
  }
  return Array.from(matched);
}

export function useMentions(users: User[]) {
  const [draft, setDraft] = useState("");
  const trigger = useMemo(() => {
    const m = MENTION_RE.exec(draft);
    return m ? m[1].toLowerCase() : null;
  }, [draft]);

  const suggestions = useMemo(() => {
    if (trigger == null) return [];
    return users
      .filter((u) => u.name.toLowerCase().includes(trigger))
      .slice(0, 6);
  }, [trigger, users]);

  const insertMention = (user: User) => {
    setDraft((d) => d.replace(MENTION_RE, `@${user.name} `));
  };

  const mentionedIds = useMemo(() => extractMentions(draft, users), [draft, users]);

  return {
    draft,
    setDraft,
    trigger,
    suggestions,
    insertMention,
    mentionedIds,
    reset: () => setDraft(""),
  };
}
