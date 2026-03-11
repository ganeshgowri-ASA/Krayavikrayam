import type { AgentInput, AgentResult, EnrichedCompany } from "./types";

interface EnrichmentRequest {
  companyName: string;
  domain?: string;
}

// Simulated enrichment data — in production this would call external APIs
const INDUSTRY_KEYWORDS: Record<string, string> = {
  tech: "Technology",
  software: "Software",
  health: "Healthcare",
  finance: "Financial Services",
  bank: "Banking",
  retail: "Retail",
  media: "Media & Entertainment",
  edu: "Education",
  energy: "Energy",
  auto: "Automotive",
};

function inferIndustry(name: string, domain?: string): string {
  const combined = `${name} ${domain ?? ""}`.toLowerCase();
  for (const [keyword, industry] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (combined.includes(keyword)) return industry;
  }
  return "Technology";
}

function inferCompanySize(name: string): string {
  // Heuristic — in production, this would use external data
  const knownEnterprise = ["microsoft", "google", "amazon", "apple", "meta", "salesforce"];
  if (knownEnterprise.some((e) => name.toLowerCase().includes(e))) return "Enterprise (10,000+)";
  return "Mid-Market (50-500)";
}

function generateDomain(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
}

async function enrichCompany(request: EnrichmentRequest): Promise<EnrichedCompany> {
  const domain = request.domain ?? generateDomain(request.companyName);

  return {
    name: request.companyName,
    domain,
    industry: inferIndustry(request.companyName, domain),
    size: inferCompanySize(request.companyName),
    revenue: "Estimated $10M - $50M",
    location: "United States",
    description: `${request.companyName} is a company operating in the ${inferIndustry(request.companyName, domain)} sector. They provide innovative solutions to their customers and have been growing steadily.`,
    technologies: ["Cloud Infrastructure", "CRM", "Analytics Platform", "API Integration"],
    socialProfiles: {
      linkedin: `https://linkedin.com/company/${domain.replace(".com", "")}`,
      twitter: `https://twitter.com/${domain.replace(".com", "")}`,
    },
  };
}

export async function enrichData(input: AgentInput): Promise<AgentResult> {
  const start = Date.now();

  try {
    const requests: EnrichmentRequest[] = (input.context?.companies as EnrichmentRequest[]) ?? [
      { companyName: input.query },
    ];

    const enrichedCompanies = await Promise.all(requests.map(enrichCompany));

    return {
      agentType: "data-enrichment",
      input: input.query,
      output: {
        result: enrichedCompanies,
        confidence: 0.75,
        metadata: { companiesEnriched: enrichedCompanies.length },
      },
      status: "success",
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      agentType: "data-enrichment",
      input: input.query,
      output: { result: null, metadata: { error: String(error) } },
      status: "error",
      durationMs: Date.now() - start,
    };
  }
}
