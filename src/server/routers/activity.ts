import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { activityCreateSchema, activityUpdateSchema } from "@/lib/validators";

export const activityRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        contactId: z.string().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { userId: ctx.user.id };
      if (input.contactId) where.contactId = input.contactId;

      const [activities, total] = await Promise.all([
        ctx.prisma.activity.findMany({
          where,
          include: {
            contact: { select: { id: true, name: true } },
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.prisma.activity.count({ where }),
      ]);

      return { activities, total, pages: Math.ceil(total / input.limit) };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const activity = await ctx.prisma.activity.findUnique({
        where: { id: input.id },
        include: {
          contact: true,
          user: { select: { id: true, name: true } },
        },
      });

      if (!activity) throw new TRPCError({ code: "NOT_FOUND" });
      return activity;
    }),

  create: protectedProcedure
    .input(activityCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "VIEWER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.prisma.activity.create({
        data: {
          ...input,
          description: input.description || null,
          contactId: input.contactId || null,
          dealId: input.dealId || null,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
          userId: ctx.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: activityUpdateSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.activity.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.activity.update({
        where: { id: input.id },
        data: {
          ...input.data,
          scheduledAt: input.data.scheduledAt
            ? new Date(input.data.scheduledAt)
            : undefined,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.activity.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.activity.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
