"use client";

import { useEffect, useState, type ReactNode } from "react";

const ENABLED =
  typeof process !== "undefined" &&
  (process.env?.NEXT_PUBLIC_ENABLE_MSW === "1" ||
    process.env?.NODE_ENV === "development");

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!ENABLED);

  useEffect(() => {
    if (!ENABLED || typeof window === "undefined") {
      setReady(true);
      return;
    }
    let cancelled = false;
    import("./browser")
      .then(({ startMockServiceWorker }) => startMockServiceWorker())
      .catch((err) => {
        console.warn("[msw] failed to start worker", err);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
