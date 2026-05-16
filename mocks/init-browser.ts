"use client";

let started: Promise<void> | null = null;

export function isMswEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_API_MOCKING === "disabled") return false;
  return process.env.NODE_ENV !== "production";
}

export function startMswBrowser(): Promise<void> {
  if (!isMswEnabled()) return Promise.resolve();
  if (started) return started;
  started = import("./browser").then(({ worker }) =>
    worker
      .start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
      })
      .then(() => undefined)
  );
  return started;
}
