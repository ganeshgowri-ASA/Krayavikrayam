import { router } from "../trpc";
import { contactRouter } from "./contact";
import { accountRouter } from "./account";
import { activityRouter } from "./activity";

export const appRouter = router({
  contact: contactRouter,
  account: accountRouter,
  activity: activityRouter,
});

export type AppRouter = typeof appRouter;
