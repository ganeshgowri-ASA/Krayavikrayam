import { setupServer } from "msw/node";
import { ordersHandlers } from "./handlers";

export function setupOrdersServer() {
  return setupServer(...ordersHandlers);
}
