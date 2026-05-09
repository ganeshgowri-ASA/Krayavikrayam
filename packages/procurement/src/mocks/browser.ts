import { setupWorker } from "msw/browser";
import { rfqHandlers } from "./handlers";

export const worker = setupWorker(...rfqHandlers);

let started: Promise<unknown> | null = null;

export function startMockServiceWorker(): Promise<unknown> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!started) {
    started = worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
  }
  return started;
}
