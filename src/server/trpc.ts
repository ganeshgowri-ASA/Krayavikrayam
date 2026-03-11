import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/server/auth/options";
import type { Role } from "@prisma/client";

export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions);
  return { prisma, session };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const user = ctx.session.user as {
    id: string;
    role: Role;
    orgId: string | null;
  };
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const hasRole = (allowedRoles: Role[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = ctx.session.user as { id: string; role: Role; orgId: string | null };
    if (!allowedRoles.includes(user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Insufficient permissions",
      });
    }
    return next({ ctx: { ...ctx, user } });
  });

export const adminProcedure = t.procedure.use(hasRole(["ADMIN"]));
export const managerProcedure = t.procedure.use(hasRole(["ADMIN", "MANAGER"]));
