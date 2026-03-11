import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import {
  contactCreateSchema,
  contactUpdateSchema,
  contactFilterSchema,
} from "@/lib/validators";
import { Prisma } from "@prisma/client";

export const contactRouter = router({
  list: protectedProcedure
    .input(contactFilterSchema)
    .query(async ({ ctx, input }) => {
      const { search, status, source, tags, page, limit } = input;
      const orgId = ctx.user.orgId;
      if (!orgId) throw new TRPCError({ code: "BAD_REQUEST", message: "No organization" });

      const where: Prisma.ContactWhereInput = { orgId };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
          { company: { contains: search, mode: "insensitive" } },
        ];
      }
      if (status) where.status = status;
      if (source) where.source = source;
      if (tags && tags.length > 0) {
        where.contactTags = { some: { tag: { name: { in: tags } } } };
      }

      const [contacts, total] = await Promise.all([
        ctx.prisma.contact.findMany({
          where,
          include: {
            contactTags: { include: { tag: true } },
            account: true,
            createdBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.contact.count({ where }),
      ]);

      return {
        contacts,
        total,
        pages: Math.ceil(total / limit),
        page,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findUnique({
        where: { id: input.id },
        include: {
          contactTags: { include: { tag: true } },
          account: true,
          activities: {
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, name: true } } },
          },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });

      if (!contact || contact.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return contact;
    }),

  create: protectedProcedure
    .input(contactCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const orgId = ctx.user.orgId;
      if (!orgId) throw new TRPCError({ code: "BAD_REQUEST", message: "No organization" });

      const { tags, ...data } = input;

      // Duplicate detection
      if (data.email || data.phone) {
        const duplicateWhere: Prisma.ContactWhereInput = {
          orgId,
          OR: [],
        };
        if (data.email) (duplicateWhere.OR as Prisma.ContactWhereInput[]).push({ email: data.email });
        if (data.phone) (duplicateWhere.OR as Prisma.ContactWhereInput[]).push({ phone: data.phone });

        const existing = await ctx.prisma.contact.findFirst({ where: duplicateWhere });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Duplicate contact found: ${existing.name} (${existing.email || existing.phone})`,
          });
        }
      }

      const contact = await ctx.prisma.contact.create({
        data: {
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          company: data.company || null,
          source: data.source,
          status: data.status,
          customFields: data.customFields ?? undefined,
          organization: { connect: { id: orgId } },
          createdBy: { connect: { id: ctx.user.id } },
          account: data.accountId ? { connect: { id: data.accountId } } : undefined,
          contactTags: tags?.length
            ? {
                create: tags.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: { name: tagName },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
          contactTags: { include: { tag: true } },
        },
      });

      return contact;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: contactUpdateSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contact.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // RBAC: viewers cannot update
      if (ctx.user.role === "VIEWER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { tags, ...data } = input.data;

      // Duplicate detection on update
      if (data.email || data.phone) {
        const duplicateWhere: Prisma.ContactWhereInput = {
          orgId: existing.orgId,
          id: { not: input.id },
          OR: [],
        };
        if (data.email) (duplicateWhere.OR as Prisma.ContactWhereInput[]).push({ email: data.email });
        if (data.phone) (duplicateWhere.OR as Prisma.ContactWhereInput[]).push({ phone: data.phone });

        if ((duplicateWhere.OR as Prisma.ContactWhereInput[]).length > 0) {
          const dup = await ctx.prisma.contact.findFirst({ where: duplicateWhere });
          if (dup) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Duplicate contact found: ${dup.name} (${dup.email || dup.phone})`,
            });
          }
        }
      }

      if (tags !== undefined) {
        await ctx.prisma.contactTag.deleteMany({ where: { contactId: input.id } });
        if (tags.length > 0) {
          for (const tagName of tags) {
            const tag = await ctx.prisma.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName },
            });
            await ctx.prisma.contactTag.create({
              data: { contactId: input.id, tagId: tag.id },
            });
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accountId, customFields, ...updateData } = data;
      return ctx.prisma.contact.update({
        where: { id: input.id },
        data: {
          ...updateData,
          email: data.email || undefined,
          phone: data.phone || undefined,
          company: data.company || undefined,
          customFields: customFields ?? undefined,
          account: accountId ? { connect: { id: accountId } } : undefined,
        },
        include: {
          contactTags: { include: { tag: true } },
        },
      });
    }),

  delete: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contact.findUnique({
        where: { id: input.id },
      });
      if (!existing || existing.orgId !== ctx.user.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.contact.delete({ where: { id: input.id } });
      return { success: true };
    }),

  bulkDelete: managerProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.contact.deleteMany({
        where: {
          id: { in: input.ids },
          orgId: ctx.user.orgId!,
        },
      });
      return { success: true, count: input.ids.length };
    }),

  bulkUpdateStatus: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        status: z.enum(["LEAD", "PROSPECT", "CUSTOMER", "CHURNED", "INACTIVE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "VIEWER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.contact.updateMany({
        where: {
          id: { in: input.ids },
          orgId: ctx.user.orgId!,
        },
        data: { status: input.status },
      });
      return { success: true };
    }),

  checkDuplicate: protectedProcedure
    .input(z.object({ email: z.string().optional(), phone: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const orgId = ctx.user.orgId;
      if (!orgId) return { duplicate: false };

      const conditions: Prisma.ContactWhereInput[] = [];
      if (input.email) conditions.push({ email: input.email });
      if (input.phone) conditions.push({ phone: input.phone });

      if (conditions.length === 0) return { duplicate: false };

      const existing = await ctx.prisma.contact.findFirst({
        where: { orgId, OR: conditions },
        select: { id: true, name: true, email: true, phone: true },
      });

      return { duplicate: !!existing, match: existing };
    }),
});
