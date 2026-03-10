import type { AgentInput, AgentResult, GeneratedContent } from "./types";

interface ContentRequest {
  type: "email" | "proposal" | "social_post";
  topic: string;
  targetAudience?: string;
  tone?: string;
  companyName?: string;
  productName?: string;
  keyPoints?: string[];
}

const EMAIL_TEMPLATES: Record<string, string> = {
  "cold-outreach": `Subject: {{topic}}

Hi {{targetAudience}},

I came across {{companyName}} and was impressed by your work in the industry. I believe {{productName}} could help your team achieve even greater results.

Here's what we can offer:
{{keyPoints}}

Would you be open to a brief 15-minute call to explore this further?

Best regards`,

  "product-update": `Subject: Exciting updates to {{productName}}

Hi {{targetAudience}},

We've been hard at work making {{productName}} even better for teams like yours at {{companyName}}.

Here's what's new:
{{keyPoints}}

We'd love to show you these improvements in action. Schedule a quick demo at your convenience.

Best regards`,

  nurture: `Subject: {{topic}}

Hi {{targetAudience}},

As someone in the {{companyName}} space, I thought you might find this valuable.

{{keyPoints}}

I'd love to hear your thoughts on this. Feel free to reply directly or schedule a call.

Best regards`,
};

const PROPOSAL_TEMPLATE = `# Proposal: {{topic}}

## Prepared for {{companyName}}

### Executive Summary
We are pleased to present this proposal for {{productName}} to address your team's needs. Based on our understanding of {{companyName}}'s goals, we believe this solution will deliver significant value.

### Objectives
{{keyPoints}}

### Proposed Solution
{{productName}} provides a comprehensive platform designed for teams like yours. Our solution addresses the core challenges discussed during our conversations.

### Investment
We will work together to define the right package for {{companyName}}'s needs and budget.

### Next Steps
1. Review this proposal with your team
2. Schedule a follow-up call to discuss questions
3. Begin pilot program at your convenience

### Why {{productName}}
- Proven track record with similar organizations
- Dedicated customer success team
- Continuous product innovation

We look forward to partnering with {{companyName}}.`;

const SOCIAL_TEMPLATES: Record<string, string> = {
  linkedin: `🚀 {{topic}}

{{keyPoints}}

What strategies have worked for your team? Share your thoughts below. 👇

#{{companyName}} #SalesInnovation #Growth`,

  twitter: `{{topic}}

{{keyPoints}}

Learn more → {{companyName}}`,

  default: `{{topic}}

{{keyPoints}}

Follow us for more insights on how {{productName}} is helping teams succeed.`,
};

function fillTemplate(template: string, req: ContentRequest): string {
  const keyPointsStr = (req.keyPoints ?? []).map((p) => `• ${p}`).join("\n");
  return template
    .replace(/\{\{topic\}\}/g, req.topic)
    .replace(/\{\{targetAudience\}\}/g, req.targetAudience ?? "there")
    .replace(/\{\{companyName\}\}/g, req.companyName ?? "your company")
    .replace(/\{\{productName\}\}/g, req.productName ?? "our solution")
    .replace(/\{\{keyPoints\}\}/g, keyPointsStr);
}

function generateEmail(req: ContentRequest): GeneratedContent {
  const tone = req.tone ?? "professional";
  let templateKey = "nurture";
  if (req.topic.toLowerCase().includes("outreach")) templateKey = "cold-outreach";
  if (req.topic.toLowerCase().includes("update")) templateKey = "product-update";

  const body = fillTemplate(EMAIL_TEMPLATES[templateKey], req);
  return { type: "email", subject: req.topic, body, tone, targetAudience: req.targetAudience };
}

function generateProposal(req: ContentRequest): GeneratedContent {
  const body = fillTemplate(PROPOSAL_TEMPLATE, req);
  return { type: "proposal", subject: `Proposal: ${req.topic}`, body, tone: "formal" };
}

function generateSocialPost(req: ContentRequest): GeneratedContent {
  const platform = req.tone ?? "default";
  const template = SOCIAL_TEMPLATES[platform] ?? SOCIAL_TEMPLATES["default"];
  const body = fillTemplate(template, req);
  return { type: "social_post", body, tone: platform, targetAudience: req.targetAudience };
}

export async function generateContent(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const request = (input.context?.request as ContentRequest) ?? {
      type: "email" as const,
      topic: input.query,
    };

    let content: GeneratedContent;
    switch (request.type) {
      case "email":
        content = generateEmail(request);
        break;
      case "proposal":
        content = generateProposal(request);
        break;
      case "social_post":
        content = generateSocialPost(request);
        break;
      default:
        content = generateEmail(request);
    }

    return {
      agentType: "content-generation",
      input: input.query,
      output: { result: content, confidence: 0.88 },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "content-generation",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
