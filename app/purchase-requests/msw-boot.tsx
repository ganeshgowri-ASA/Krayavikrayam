"use client";

import { useEffect, useState } from "react";
import { isMswEnabled, startMswBrowser } from "@/mocks/init-browser";

export function MswBoot({ children }: { children: React.ReactNode }) {
  const enabled = isMswEnabled();
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    startMswBrowser()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  if (!ready) return null;
  return <>{children}</>;
}
