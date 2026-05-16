import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import {
  fetch as undiciFetch,
  Headers as UndiciHeaders,
  Request as UndiciRequest,
  Response as UndiciResponse,
  FormData as UndiciFormData,
} from "undici";
import { server } from "./mocks/server";

function resolvedFetch(input: unknown, init?: unknown) {
  let url = input as string | URL | Request;
  if (typeof url === "string" && url.startsWith("/")) {
    const origin =
      (typeof window !== "undefined" && window.location?.origin) ||
      "http://test.local";
    url = `${origin}${url}`;
  }
  return (undiciFetch as unknown as typeof fetch)(
    url as RequestInfo,
    init as RequestInit | undefined
  );
}

const g = globalThis as unknown as Record<string, unknown>;
g.fetch = resolvedFetch;
g.Headers = UndiciHeaders;
g.Request = UndiciRequest;
g.Response = UndiciResponse;
g.FormData = UndiciFormData;

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
