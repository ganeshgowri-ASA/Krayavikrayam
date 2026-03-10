import type { AgentInput, AgentResult, FollowUpEmail } from "./types";

interface DealContext {
  dealId: string;
  contactName: string;
  companyName: string;
  dealStage: string;
  lastContactDate: string;
  dealValue: number;
  notes?: string;
  productInterest?: string;
}

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  "no-response": {
    subject: "Quick follow-up on our conversation, {{contactName}}",
    body: `Hi {{contactName}},

I wanted to circle back on our previous conversation about {{productInterest}} for {{companyName}}.

I understand things get busy, but I wanted to make sure you had everything you needed to move forward. Is there anything I can help clarify or any concerns I can address?

I'd love to schedule a quick 15-minute call this week to discuss next steps.

Best regards`,
  },
  "proposal-sent": {
    subject: "Thoughts on the proposal, {{contactName}}?",
    body: `Hi {{contactName}},

I hope you've had a chance to review the proposal I sent over for {{companyName}}. I'm confident that {{productInterest}} will help your team achieve the goals we discussed.

A few key points I wanted to highlight:
- Implementation timeline aligned with your Q{{quarter}} targets
- ROI projections based on similar companies in your industry
- Dedicated support during the onboarding phase

Would you be available for a brief call to discuss any questions?

Best regards`,
  },
  "demo-completed": {
    subject: "Next steps after our demo, {{contactName}}",
    body: `Hi {{contactName}},

Thank you for taking the time to see {{productInterest}} in action. Based on the questions your team asked during the demo, I can see there's a strong fit for {{companyName}}.

Here's what I'd suggest as next steps:
1. I'll send over a customized proposal based on your specific requirements
2. We can arrange a technical deep-dive with your IT team if needed
3. I'll include case studies from similar companies in your industry

Does this sound good? Let me know your preferred timeline.

Best regards`,
  },
  default: {
    subject: "Checking in, {{contactName}}",
    body: `Hi {{contactName}},

I hope all is well at {{companyName}}. I wanted to reach out and see if there's anything new on your end regarding {{productInterest}}.

We've recently made some exciting updates that I think could be particularly valuable for your team. Would you be open to a quick catch-up call?

Looking forward to hearing from you.

Best regards`,
  },
};

function selectTemplate(deal: DealContext): { subject: string; body: string } {
  const daysSinceContact = Math.floor(
    (Date.now() - new Date(deal.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (deal.dealStage === "demo-completed") return EMAIL_TEMPLATES["demo-completed"];
  if (deal.dealStage === "proposal-sent") return EMAIL_TEMPLATES["proposal-sent"];
  if (daysSinceContact > 7) return EMAIL_TEMPLATES["no-response"];
  return EMAIL_TEMPLATES["default"];
}

function fillTemplate(template: string, deal: DealContext): string {
  const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
  return template
    .replace(/\{\{contactName\}\}/g, deal.contactName)
    .replace(/\{\{companyName\}\}/g, deal.companyName)
    .replace(/\{\{productInterest\}\}/g, deal.productInterest ?? "our solution")
    .replace(/\{\{quarter\}\}/g, String(quarter));
}

function getSuggestedSendTime(): string {
  const now = new Date();
  const suggested = new Date(now);
  suggested.setDate(suggested.getDate() + 1);
  suggested.setHours(9, 30, 0, 0);
  if (suggested.getDay() === 0) suggested.setDate(suggested.getDate() + 1);
  if (suggested.getDay() === 6) suggested.setDate(suggested.getDate() + 2);
  return suggested.toISOString();
}

function getTone(deal: DealContext): string {
  const daysSinceContact = Math.floor(
    (Date.now() - new Date(deal.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceContact > 30) return "re-engagement";
  if (deal.dealValue > 100000) return "consultative";
  return "friendly-professional";
}

export async function generateFollowUps(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const deals: DealContext[] = (input.context?.deals as DealContext[]) ?? [];

    const emails: FollowUpEmail[] = deals.map((deal) => {
      const template = selectTemplate(deal);
      return {
        dealId: deal.dealId,
        subject: fillTemplate(template.subject, deal),
        body: fillTemplate(template.body, deal),
        tone: getTone(deal),
        suggestedSendTime: getSuggestedSendTime(),
      };
    });

    return {
      agentType: "follow-up",
      input: input.query,
      output: {
        result: emails,
        confidence: 0.9,
        metadata: { emailsGenerated: emails.length },
      },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "follow-up",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
