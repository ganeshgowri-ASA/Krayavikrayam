import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { marketingRouter } from "./marketing";

export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
  marketing: marketingRouter,
});

export type AppRouter = typeof appRouter;
