import { z } from "zod";

export const contactCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  source: z.enum(["WEBSITE", "REFERRAL", "LINKEDIN", "COLD_CALL", "TRADE_SHOW", "ADVERTISEMENT", "OTHER"]).default("OTHER"),
  status: z.enum(["LEAD", "PROSPECT", "CUSTOMER", "CHURNED", "INACTIVE"]).default("LEAD"),
  customFields: z.any().optional(),
  accountId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const contactUpdateSchema = contactCreateSchema.partial();

export const accountCreateSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  size: z.string().optional().or(z.literal("")),
  revenue: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export const accountUpdateSchema = accountCreateSchema.partial();

export const activityCreateSchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "NOTE"]),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional().or(z.literal("")),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const activityUpdateSchema = activityCreateSchema.partial();

export const contactFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["LEAD", "PROSPECT", "CUSTOMER", "CHURNED", "INACTIVE"]).optional(),
  source: z.enum(["WEBSITE", "REFERRAL", "LINKEDIN", "COLD_CALL", "TRADE_SHOW", "ADVERTISEMENT", "OTHER"]).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const accountFilterSchema = z.object({
  search: z.string().optional(),
  industry: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
