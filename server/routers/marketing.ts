import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const marketingRouter = createTRPCRouter({
  // Campaigns
  listCampaigns: protectedProcedure
    .input(z.object({
      organizationId: z.string().optional(),
      status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
      type: z.enum(["EMAIL", "SMS", "SOCIAL"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input?.organizationId) where.organizationId = input.organizationId;
      if (input?.status) where.status = input.status;
      if (input?.type) where.type = input.type;
      return ctx.db.campaign.findMany({ where, orderBy: { createdAt: "desc" } });
    }),

  getCampaign: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.campaign.findUnique({ where: { id: input.id } });
    }),

  createCampaign: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.enum(["EMAIL", "SMS", "SOCIAL"]),
      organizationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.campaign.create({
        data: {
          name: input.name,
          type: input.type,
          status: "DRAFT",
          organizationId: input.organizationId,
          createdBy: ctx.session.user.id,
        },
      });
    }),

  updateCampaignStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.campaign.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  // Email Templates
  listEmailTemplates: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.emailTemplate.findMany({ orderBy: { updatedAt: "desc" } });
    }),

  createEmailTemplate: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      subject: z.string().min(1),
      htmlBody: z.string(),
      jsonBody: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.emailTemplate.create({ data: input });
    }),

  // Lead Scores
  listLeadScores: protectedProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.leadScore.findMany({
        include: { contact: { select: { id: true, name: true, email: true } } },
        orderBy: { score: "desc" },
        take: input?.limit ?? 50,
      });
    }),

  // Social Accounts
  listSocialAccounts: protectedProcedure
    .input(z.object({ organizationId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input?.organizationId) where.organizationId = input.organizationId;
      return ctx.db.socialAccount.findMany({ where, include: { _count: { select: { posts: true } } } });
    }),

  // Social Posts
  listSocialPosts: protectedProcedure
    .input(z.object({
      socialAccountId: z.string().optional(),
      status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input?.socialAccountId) where.socialAccountId = input.socialAccountId;
      if (input?.status) where.status = input.status;
      return ctx.db.socialPost.findMany({
        where,
        include: { socialAccount: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  createSocialPost: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
      platforms: z.array(z.string()),
      scheduledAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, this would create posts for each selected platform
      // and schedule them via a job queue
      return { success: true, platforms: input.platforms };
    }),

  // Channel Metrics
  getChannelMetrics: protectedProcedure
    .input(z.object({
      socialAccountId: z.string(),
      days: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setDate(since.getDate() - (input.days ?? 30));
      return ctx.db.channelMetric.findMany({
        where: { socialAccountId: input.socialAccountId, date: { gte: since } },
        orderBy: { date: "asc" },
      });
    }),
});
