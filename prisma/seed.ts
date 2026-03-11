import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

function generateApiKeyValue(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "kv_";
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.integrationLog.deleteMany();
  await prisma.webhookConfig.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.workflowRun.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.task.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Organization
  const org = await prisma.organization.create({
    data: {
      id: "demo-org-id",
      name: "Krayavikrayam Demo",
      slug: "krayavikrayam-demo",
      plan: "free",
    },
  });

  console.log("Created organization:", org.name);

  // Users
  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Ganesh Gowri", email: "ganesh@example.com", role: "ADMIN", orgId: org.id },
    }),
    prisma.user.create({
      data: { name: "Priya Sharma", email: "priya@example.com", role: "MANAGER", orgId: org.id },
    }),
    prisma.user.create({
      data: { name: "Rahul Kumar", email: "rahul@example.com", role: "MEMBER", orgId: org.id },
    }),
    prisma.user.create({
      data: { name: "Anita Desai", email: "anita@example.com", role: "MEMBER", orgId: org.id },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Contacts
  const contactsData = [
    { firstName: "Vikram", lastName: "Patel", email: "vikram@techcorp.in", phone: "+919876543210", company: "TechCorp India", source: "website" },
    { firstName: "Meera", lastName: "Iyer", email: "meera@startupxyz.com", phone: "+919876543211", company: "StartupXYZ", source: "referral" },
    { firstName: "Arjun", lastName: "Singh", email: "arjun@megaenterprises.in", phone: "+919876543212", company: "Mega Enterprises", source: "linkedin" },
    { firstName: "Sunita", lastName: "Reddy", email: "sunita@cloudworks.io", phone: "+919876543213", company: "CloudWorks", source: "cold_email" },
    { firstName: "Rajesh", lastName: "Gupta", email: "rajesh@finserv.com", phone: "+919876543214", company: "FinServ Solutions", source: "trade_show" },
    { firstName: "Kavitha", lastName: "Nair", email: "kavitha@retailplus.in", phone: "+919876543215", company: "RetailPlus", source: "website" },
    { firstName: "Deepak", lastName: "Mehta", email: "deepak@healthai.in", phone: "+919876543216", company: "HealthAI", source: "referral" },
    { firstName: "Lakshmi", lastName: "Rao", email: "lakshmi@edulearntech.com", phone: "+919876543217", company: "EduLearn Tech", source: "linkedin" },
    { firstName: "Suresh", lastName: "Bhat", email: "suresh@agritech.co.in", phone: "+919876543218", company: "AgriTech Solutions", source: "website" },
    { firstName: "Aisha", lastName: "Khan", email: "aisha@mediahub.in", phone: "+919876543219", company: "MediaHub", source: "social_media" },
  ];

  const contacts = await Promise.all(
    contactsData.map((c) =>
      prisma.contact.create({
        data: { ...c, customFields: {}, orgId: org.id, createdById: users[0].id },
      })
    )
  );

  console.log(`Created ${contacts.length} contacts`);

  // Deals
  const stages = ["lead", "qualified", "proposal", "negotiation", "won", "lost"];
  const priorities = ["low", "medium", "high"];
  const deals = await Promise.all(
    contacts.slice(0, 8).map((contact, i) =>
      prisma.deal.create({
        data: {
          title: `${contact.company} - ${["CRM License", "Enterprise Plan", "Custom Integration", "Annual Contract", "Pilot Project", "Consulting", "API Access", "White Label"][i]}`,
          value: [150000, 500000, 250000, 1200000, 75000, 300000, 180000, 450000][i],
          currency: "INR",
          stage: stages[i % stages.length],
          priority: priorities[i % priorities.length],
          contactId: contact.id,
          assigneeId: users[i % users.length].id,
          orgId: org.id,
        },
      })
    )
  );

  console.log(`Created ${deals.length} deals`);

  // Tickets
  const ticketStatuses = ["open", "in_progress", "resolved", "closed"];
  const channels = ["email", "phone", "chat", "whatsapp"];
  const tickets = await Promise.all(
    contacts.slice(0, 6).map((contact, i) =>
      prisma.ticket.create({
        data: {
          subject: [
            "Login issue with dashboard",
            "Feature request: bulk import",
            "API rate limit exceeded",
            "Invoice discrepancy",
            "Integration setup help",
            "Data migration support",
          ][i],
          description: `Support ticket from ${contact.firstName} at ${contact.company}`,
          status: ticketStatuses[i % ticketStatuses.length],
          priority: priorities[i % priorities.length],
          channel: channels[i % channels.length],
          contactId: contact.id,
          assigneeId: users[i % users.length].id,
          orgId: org.id,
        },
      })
    )
  );

  console.log(`Created ${tickets.length} tickets`);

  // Tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: { title: "Follow up with TechCorp on proposal", status: "pending", dueDate: new Date("2026-03-15"), assigneeId: users[0].id },
    }),
    prisma.task.create({
      data: { title: "Prepare demo for StartupXYZ", status: "in_progress", dueDate: new Date("2026-03-12"), assigneeId: users[1].id },
    }),
    prisma.task.create({
      data: { title: "Send contract to Mega Enterprises", status: "completed", assigneeId: users[0].id },
    }),
    prisma.task.create({
      data: { title: "Review CloudWorks integration requirements", status: "pending", dueDate: new Date("2026-03-20"), assigneeId: users[2].id },
    }),
  ]);

  console.log(`Created ${tasks.length} tasks`);

  // Workflows
  const workflows = await Promise.all([
    prisma.workflow.create({
      data: {
        name: "Welcome New Contacts",
        description: "Sends a welcome email when a new contact is created",
        triggerType: "new_contact",
        triggerConfig: {},
        conditions: [{ field: "email", operator: "is_not_empty" }],
        actions: [{ type: "send_email", template: "welcome", delay: 0 }],
        nodes: [
          { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "New Contact", triggerType: "new_contact" } },
          { id: "2", type: "condition", position: { x: 250, y: 120 }, data: { label: "Has email?", conditionType: "if_else" } },
          { id: "3", type: "action", position: { x: 100, y: 260 }, data: { label: "Send Welcome Email", actionType: "send_email" } },
          { id: "4", type: "action", position: { x: 400, y: 260 }, data: { label: "Create Follow-up Task", actionType: "create_task" } },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
          { id: "e2-4", source: "2", target: "4", sourceHandle: "no" },
        ],
        isActive: true,
        runCount: 156,
        orgId: org.id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: "Deal Won Notification",
        description: "Notifies the team on Slack when a deal is won",
        triggerType: "deal_stage_change",
        triggerConfig: { stage: "won" },
        conditions: [{ field: "value", operator: "greater_than", value: 100000 }],
        actions: [{ type: "notify_slack", channel: "#sales-wins" }],
        nodes: [
          { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Deal Stage Change", triggerType: "deal_stage_change" } },
          { id: "2", type: "condition", position: { x: 250, y: 120 }, data: { label: "Value > 1L?", conditionType: "if_else" } },
          { id: "3", type: "action", position: { x: 250, y: 260 }, data: { label: "Notify Slack", actionType: "notify_slack" } },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
        ],
        isActive: true,
        runCount: 42,
        orgId: org.id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: "Ticket Escalation",
        description: "Escalates high-priority tickets to managers",
        triggerType: "ticket_created",
        triggerConfig: {},
        conditions: [{ field: "priority", operator: "equals", value: "high" }],
        actions: [
          { type: "send_email", to: "manager@example.com", template: "escalation" },
          { type: "notify_slack", channel: "#support-escalations" },
        ],
        nodes: [
          { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Ticket Created", triggerType: "ticket_created" } },
          { id: "2", type: "condition", position: { x: 250, y: 120 }, data: { label: "High priority?", conditionType: "if_else" } },
          { id: "3", type: "action", position: { x: 100, y: 260 }, data: { label: "Email Manager", actionType: "send_email" } },
          { id: "4", type: "action", position: { x: 400, y: 260 }, data: { label: "Slack Alert", actionType: "notify_slack" } },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
          { id: "e2-4", source: "2", target: "4", sourceHandle: "yes" },
        ],
        isActive: false,
        runCount: 89,
        orgId: org.id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: "Weekly Pipeline Report",
        description: "Sends a weekly pipeline summary every Monday at 9 AM",
        triggerType: "scheduled",
        triggerConfig: { cron: "0 9 * * 1" },
        conditions: [],
        actions: [{ type: "send_email", template: "weekly_report", to: "team@example.com" }],
        nodes: [
          { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Every Monday 9AM", triggerType: "scheduled" } },
          { id: "2", type: "action", position: { x: 250, y: 120 }, data: { label: "Send Report Email", actionType: "send_email" } },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
        ],
        isActive: true,
        runCount: 12,
        orgId: org.id,
      },
    }),
  ]);

  console.log(`Created ${workflows.length} workflows`);

  // Workflow Runs
  const workflowRuns = await Promise.all([
    prisma.workflowRun.create({
      data: { workflowId: workflows[0].id, status: "completed", triggeredBy: "contact.created", input: { contactId: contacts[0].id }, output: { emailSent: true }, completedAt: new Date() },
    }),
    prisma.workflowRun.create({
      data: { workflowId: workflows[0].id, status: "completed", triggeredBy: "contact.created", input: { contactId: contacts[1].id }, output: { emailSent: true }, completedAt: new Date() },
    }),
    prisma.workflowRun.create({
      data: { workflowId: workflows[0].id, status: "failed", triggeredBy: "contact.created", input: { contactId: contacts[2].id }, error: "Email delivery failed: invalid address", completedAt: new Date() },
    }),
    prisma.workflowRun.create({
      data: { workflowId: workflows[1].id, status: "completed", triggeredBy: "deal.stage_changed", input: { dealId: deals[4].id, newStage: "won" }, output: { slackNotified: true }, completedAt: new Date() },
    }),
  ]);

  console.log(`Created ${workflowRuns.length} workflow runs`);

  // Automation Rules
  const automationRules = await Promise.all([
    prisma.automationRule.create({
      data: {
        name: "Auto-assign new contacts",
        module: "contacts",
        event: "created",
        conditions: [{ field: "source", operator: "equals", value: "website" }],
        actionType: "update_field",
        actionConfig: { field: "tags", value: ["website-lead", "auto-assigned"] },
        orgId: org.id,
      },
    }),
    prisma.automationRule.create({
      data: {
        name: "Webhook on deal update",
        module: "deals",
        event: "updated",
        conditions: [],
        actionType: "webhook",
        actionConfig: { url: "https://hooks.zapier.com/example", method: "POST" },
        orgId: org.id,
      },
    }),
    prisma.automationRule.create({
      data: {
        name: "Email on deal stage change",
        module: "deals",
        event: "stage_changed",
        conditions: [{ field: "stage", operator: "equals", value: "won" }],
        actionType: "send_email",
        actionConfig: { template: "deal_won", to: "sales-team@example.com" },
        orgId: org.id,
      },
    }),
    prisma.automationRule.create({
      data: {
        name: "Create task for new tickets",
        module: "tickets",
        event: "created",
        conditions: [{ field: "priority", operator: "in", value: ["high", "critical"] }],
        actionType: "create_task",
        actionConfig: { title: "Respond to high-priority ticket", assignTo: "manager" },
        orgId: org.id,
      },
    }),
  ]);

  console.log(`Created ${automationRules.length} automation rules`);

  // Webhook Configs
  const webhookConfigs = await Promise.all([
    prisma.webhookConfig.create({
      data: {
        url: "https://hooks.zapier.com/hooks/catch/123456/example/",
        events: ["contact.created", "contact.updated", "deal.created", "deal.updated"],
        secret: "whsec_" + uuidv4().replace(/-/g, ""),
        isActive: true,
        orgId: org.id,
      },
    }),
    prisma.webhookConfig.create({
      data: {
        url: "https://example.com/webhooks/krayavikrayam",
        events: ["deal.stage_changed", "ticket.created"],
        secret: "whsec_" + uuidv4().replace(/-/g, ""),
        isActive: true,
        orgId: org.id,
      },
    }),
  ]);

  console.log(`Created ${webhookConfigs.length} webhook configs`);

  // Integration Logs
  const integrationLogs = await Promise.all([
    prisma.integrationLog.create({
      data: { integrationType: "resend", action: "send_email", status: "success", payload: { to: "vikram@techcorp.in", subject: "Welcome!" }, response: { id: "email_123" }, orgId: org.id },
    }),
    prisma.integrationLog.create({
      data: { integrationType: "slack", action: "send_notification", status: "success", payload: { channel: "#sales-wins", message: "Deal won: TechCorp" }, response: { ok: true }, orgId: org.id },
    }),
    prisma.integrationLog.create({
      data: { integrationType: "webhook", action: "contact.created", status: "success", payload: { contactId: contacts[0].id }, response: { status: 200 }, orgId: org.id },
    }),
    prisma.integrationLog.create({
      data: { integrationType: "google_calendar", action: "create_event", status: "error", payload: { title: "Follow-up call" }, response: { error: "Token expired" }, orgId: org.id },
    }),
    prisma.integrationLog.create({
      data: { integrationType: "razorpay", action: "create_invoice", status: "success", payload: { amount: 150000, currency: "INR" }, response: { invoiceId: "inv_abc123" }, orgId: org.id },
    }),
  ]);

  console.log(`Created ${integrationLogs.length} integration logs`);

  // API Keys
  const apiKeys = await Promise.all([
    prisma.apiKey.create({
      data: {
        name: "Production API",
        key: generateApiKeyValue(),
        prefix: "kv_prod_",
        isActive: true,
        orgId: org.id,
      },
    }),
    prisma.apiKey.create({
      data: {
        name: "Development API",
        key: generateApiKeyValue(),
        prefix: "kv_dev__",
        isActive: true,
        orgId: org.id,
      },
    }),
    prisma.apiKey.create({
      data: {
        name: "Zapier Integration",
        key: generateApiKeyValue(),
        prefix: "kv_zap__",
        isActive: false,
        orgId: org.id,
      },
    }),
  ]);

  console.log(`Created ${apiKeys.length} API keys`);

  console.log("\nSeed completed successfully!");
  console.log("Demo org ID:", org.id);
  console.log("Admin user:", users[0].email);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
