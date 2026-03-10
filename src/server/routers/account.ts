import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import {
  accountCreateSchema,
  accountUpdateSchema,
  accountFilterSchema,
} from "@/lib/validators";
import { Prisma } from "@prisma/client";

export const accountRouter = router({
  list: protectedProcedure
    .input(accountFilterSchema)
    .query(async ({ ctx, input }) => {
      const { search, industry, page, limit } = input;
      const orgId = ctx.user.orgId;
      if (!orgId) throw new TRPCError({ code: "BAD_REQUEST", message: "No organization" });

      const where: Prisma.AccountWhereInput = { orgId };

      if (search) {
        where.OR = [
          { companyName: { contains: search, mode: "insensitive" } },
          { industry: { contains: search, mode: "insensitive" } },
          { website: { contains: search, mode: "insensitive" } },
        ];
      }
      if (industry) where.industry = industry;

      const [accounts, total] = await Promise.all([
        ctx.prisma.account.findMany({
          where,
          include: { _count: { select: { contacts: true } } },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.account.count({ where }),
      ]);

      return { accounts, total, pages: Math.ceil(total / limit), page };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findUnique({
        where: { id: input.id },
        include: {
          contacts: {
            include: {
              contactTags: { include: { tag: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!account || account.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return account;
    }),

  create: protectedProcedure
    .input(accountCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const orgId = ctx.user.orgId;
      if (!orgId) throw new TRPCError({ code: "BAD_REQUEST", message: "No organization" });

      if (ctx.user.role === "VIEWER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.prisma.account.create({
        data: {
          ...input,
          industry: input.industry || null,
          website: input.website || null,
          size: input.size || null,
          revenue: input.revenue || null,
          address: input.address || null,
          orgId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: accountUpdateSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.account.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (ctx.user.role === "VIEWER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.prisma.account.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.account.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.account.delete({ where: { id: input.id } });
      return { success: true };
    }),

  industries: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.user.orgId;
    if (!orgId) return [];

    const results = await ctx.prisma.account.findMany({
      where: { orgId, industry: { not: null } },
      select: { industry: true },
      distinct: ["industry"],
    });

    return results.map((r) => r.industry).filter(Boolean) as string[];
  }),
});
