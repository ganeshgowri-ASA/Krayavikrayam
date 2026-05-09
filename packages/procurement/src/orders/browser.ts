"use client";

import type { SetupWorker } from "msw/browser";
import { ordersHandlers } from "./handlers";

let workerPromise: Promise<SetupWorker> | null = null;

/**
 * Lazily start the MSW browser worker for procurement endpoints. Call from a
 * client component on mount; subsequent calls are deduped. Returns the worker
 * once it has finished registering. No-op on the server.
 */
export function ensureOrdersWorker(): Promise<SetupWorker> | null {
  if (typeof window === "undefined") return null;
  if (!workerPromise) {
    workerPromise = import("msw/browser").then(async ({ setupWorker }) => {
      const worker = setupWorker(...ordersHandlers);
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
        quiet: true,
      });
      return worker;
    });
  }
  return workerPromise;
}
