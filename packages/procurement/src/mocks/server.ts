import { setupServer } from "msw/node";
import { rfqHandlers } from "./handlers";

export const server = setupServer(...rfqHandlers);
