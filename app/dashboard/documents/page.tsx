"use client";

import { useState } from "react";
import {
  Plus, Search, FileText, Edit3, Copy, Eye, X, Bold, Italic,
  List, AlignLeft, Code, Save, Wand2
} from "lucide-react";

type TemplateCategory = "NDA" | "Terms & Conditions" | "Proposal" | "Quotation" | "Project Schedule" | "SLA" | "SOW";
type TemplateStatus = "Active" | "Draft";

interface DocTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  lastModified: string;
  version: string;
  status: TemplateStatus;
  content: string;
}

const sampleTemplates: DocTemplate[] = [
  {
    id: "t1",
    name: "Standard Non-Disclosure Agreement",
    category: "NDA",
    lastModified: "2026-03-08",
    version: "v2.1",
    status: "Active",
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of {{date}} between {{company_name}} ("Disclosing Party") and {{client_name}} ("Receiving Party").

1. CONFIDENTIAL INFORMATION
The Receiving Party agrees to keep confidential all proprietary information shared by the Disclosing Party in connection with {{project_name}}.

2. OBLIGATIONS
The Receiving Party shall:
(a) Use the Confidential Information solely for evaluation purposes
(b) Not disclose Confidential Information to third parties without prior written consent
(c) Protect Confidential Information with at least the same degree of care used to protect its own confidential information

3. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of signing.

4. GOVERNING LAW
This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of {{date}}.

{{company_name}}: _______________________
{{client_name}}: _______________________`,
  },
  {
    id: "t2",
    name: "Software Service Agreement — Terms & Conditions",
    category: "Terms & Conditions",
    lastModified: "2026-03-05",
    version: "v3.0",
    status: "Active",
    content: `TERMS AND CONDITIONS OF SERVICE

Effective Date: {{date}}
Service Provider: {{company_name}}
Client: {{client_name}}

1. SERVICES
{{company_name}} agrees to provide software services as described in the attached Scope of Work for {{project_name}}.

2. PAYMENT TERMS
Total Contract Value: {{amount}}
Payment Schedule: As per invoice milestones agreed upon.
Late payments attract 2% per month interest.

3. INTELLECTUAL PROPERTY
All software, code, and deliverables created under this agreement shall be the property of {{company_name}} until full payment is received.

4. LIMITATION OF LIABILITY
{{company_name}}'s liability shall not exceed the total amount paid by {{client_name}} in the preceding 3 months.

5. TERMINATION
Either party may terminate this agreement with 30 days written notice.`,
  },
  {
    id: "t3",
    name: "Business Proposal — Enterprise CRM",
    category: "Proposal",
    lastModified: "2026-03-10",
    version: "v1.2",
    status: "Active",
    content: `BUSINESS PROPOSAL

Prepared by: {{company_name}}
Prepared for: {{client_name}}
Date: {{date}}
Project: {{project_name}}

EXECUTIVE SUMMARY
We are pleased to submit this proposal for {{project_name}}. {{company_name}} has extensive experience delivering enterprise-grade solutions.

PROPOSED SOLUTION
Our solution includes:
• Complete CRM implementation tailored to your business
• Data migration and integration services
• Training and onboarding for your team
• 12 months post-go-live support

INVESTMENT
Total Project Value: {{amount}}
This includes all development, testing, deployment, and support costs.

TIMELINE
Phase 1 — Discovery & Design: 2 weeks
Phase 2 — Development: 6 weeks
Phase 3 — Testing & UAT: 2 weeks
Phase 4 — Go-Live: 1 week

WHY {{company_name}}?
✓ 10+ years of enterprise software experience
✓ 200+ successful CRM implementations
✓ Dedicated support team based in India`,
  },
  {
    id: "t4",
    name: "Project Quotation",
    category: "Quotation",
    lastModified: "2026-03-09",
    version: "v1.0",
    status: "Active",
    content: `QUOTATION

Quotation #: QT-2026-{{date}}
Date: {{date}}
Valid Until: 30 days from date of issue

FROM: {{company_name}}
TO: {{client_name}}

Re: {{project_name}}

SCOPE OF WORK & PRICING

| Item | Description | Qty | Rate (₹) | Amount (₹) |
|------|-------------|-----|----------|------------|
| 1 | Software License | 1 | - | - |
| 2 | Implementation & Setup | 1 | - | - |
| 3 | Training | 1 | - | - |
| 4 | Annual Support | 1 | - | - |

Subtotal: ₹ —
GST @ 18%: ₹ —
TOTAL: {{amount}}

TERMS: 50% advance, balance on go-live
This quotation is valid for 30 days.`,
  },
  {
    id: "t5",
    name: "Project Schedule & Milestone Plan",
    category: "Project Schedule",
    lastModified: "2026-03-07",
    version: "v1.3",
    status: "Active",
    content: `PROJECT SCHEDULE

Project: {{project_name}}
Client: {{client_name}}
Start Date: {{date}}
Project Manager: {{company_name}}

MILESTONE PLAN

Milestone 1: Project Kickoff & Requirements Gathering
Duration: Week 1-2
Deliverable: Requirements Document, Project Charter

Milestone 2: Design & Architecture
Duration: Week 3-4
Deliverable: System Design Document, UI Mockups

Milestone 3: Development Sprint 1
Duration: Week 5-8
Deliverable: Core Module — Working Build

Milestone 4: Development Sprint 2
Duration: Week 9-12
Deliverable: Integration & Secondary Modules

Milestone 5: Quality Assurance & UAT
Duration: Week 13-14
Deliverable: QA Report, UAT Sign-off

Milestone 6: Deployment & Go-Live
Duration: Week 15
Deliverable: Production Deployment

Milestone 7: Handover & Training
Duration: Week 16
Deliverable: Training Materials, Knowledge Transfer

Total Duration: 16 weeks
Total Investment: {{amount}}`,
  },
  {
    id: "t6",
    name: "Service Level Agreement (SLA)",
    category: "SLA",
    lastModified: "2026-02-28",
    version: "v2.0",
    status: "Active",
    content: `SERVICE LEVEL AGREEMENT

Parties: {{company_name}} ("Provider") and {{client_name}} ("Client")
Effective Date: {{date}}
Service: {{project_name}}

1. SERVICE AVAILABILITY
The Provider guarantees 99.9% uptime for all production systems, excluding scheduled maintenance windows.

2. RESPONSE TIMES
• P1 (Critical): Response within 1 hour, Resolution within 4 hours
• P2 (High): Response within 4 hours, Resolution within 24 hours
• P3 (Medium): Response within 24 hours, Resolution within 72 hours
• P4 (Low): Response within 48 hours, Resolution within 5 business days

3. SUPPORT HOURS
Standard Support: Monday to Saturday, 9 AM to 6 PM IST
Emergency Support: 24/7 for P1 issues

4. PENALTIES
For each hour of downtime beyond SLA, {{company_name}} will credit 1% of monthly service fee to {{client_name}}, up to a maximum of 10%.

5. REVIEW
SLA will be reviewed quarterly. Contract Value: {{amount}}`,
  },
  {
    id: "t7",
    name: "Statement of Work — Custom Development",
    category: "SOW",
    lastModified: "2026-03-01",
    version: "v1.1",
    status: "Draft",
    content: `STATEMENT OF WORK

Project: {{project_name}}
Client: {{client_name}}
Prepared by: {{company_name}}
Date: {{date}}

1. OVERVIEW
This Statement of Work defines the scope, deliverables, timelines, and responsibilities for {{project_name}}.

2. SCOPE OF WORK
IN SCOPE:
• [List specific features and modules]
• Integration with existing systems
• Data migration (up to 3 years of historical data)
• User acceptance testing support
• Go-live support

OUT OF SCOPE:
• Third-party software licensing costs
• Hardware procurement
• Network infrastructure changes

3. DELIVERABLES
1. Technical Specification Document
2. Source Code with documentation
3. Test cases and QA reports
4. Deployment runbook
5. User manual and admin guide

4. ACCEPTANCE CRITERIA
Each deliverable will be accepted upon client sign-off within 5 business days.

5. CHANGE MANAGEMENT
Changes to scope require written Change Request with impact assessment on cost/timeline.

6. TOTAL VALUE: {{amount}}`,
  },
];

const categoryColors: Record<TemplateCategory, string> = {
  "NDA": "bg-blue-100 text-blue-700",
  "Terms & Conditions": "bg-purple-100 text-purple-700",
  "Proposal": "bg-green-100 text-green-700",
  "Quotation": "bg-orange-100 text-orange-700",
  "Project Schedule": "bg-cyan-100 text-cyan-700",
  "SLA": "bg-red-100 text-red-700",
  "SOW": "bg-indigo-100 text-indigo-700",
};

const allCategories: (TemplateCategory | "All")[] = [
  "All", "NDA", "Terms & Conditions", "Proposal", "Quotation", "Project Schedule", "SLA", "SOW"
];

const variables = ["{{company_name}}", "{{client_name}}", "{{date}}", "{{project_name}}", "{{amount}}"];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "All">("All");
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({
    "{{company_name}}": "Krayavikrayam Technologies Pvt Ltd",
    "{{client_name}}": "Ramesh Enterprises",
    "{{date}}": "2026-03-11",
    "{{project_name}}": "CRM Enterprise Suite Implementation",
    "{{amount}}": "₹4,25,000",
  });

  const filtered = sampleTemplates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openTemplate = (t: DocTemplate) => {
    setSelectedTemplate(t);
    setEditorContent(t.content);
    setGeneratedDoc("");
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    let doc = editorContent;
    Object.entries(variableValues).forEach(([key, val]) => {
      doc = doc.replaceAll(key, val);
    });
    setTimeout(() => {
      setGeneratedDoc(doc);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and generate business documents from templates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c as typeof categoryFilter)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                categoryFilter === c ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                t.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {t.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{t.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[t.category]}`}>
                {t.category}
              </span>
              <span className="text-xs text-gray-400">{t.version}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Modified: {t.lastModified}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openTemplate(t)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit & Generate
              </button>
              <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-xs text-gray-500">{selectedTemplate.category} · {selectedTemplate.version}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left: Variables Panel */}
              <div className="w-64 border-r border-gray-100 p-4 shrink-0 overflow-y-auto">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Variables</h4>
                <div className="space-y-3">
                  {variables.map((v) => (
                    <div key={v}>
                      <label className="block text-xs font-medium text-gray-600 mb-1 font-mono">{v}</label>
                      <input
                        type="text"
                        value={variableValues[v] || ""}
                        onChange={(e) => setVariableValues((prev) => ({ ...prev, [v]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Click variable to insert at cursor:</p>
                  <div className="flex flex-wrap gap-1">
                    {variables.map((v) => (
                      <button
                        key={v}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-mono hover:bg-blue-100 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: Editor / Preview */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
                  {[
                    { icon: Bold, title: "Bold" },
                    { icon: Italic, title: "Italic" },
                    { icon: List, title: "List" },
                    { icon: AlignLeft, title: "Align" },
                    { icon: Code, title: "Code" },
                  ].map(({ icon: Icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      className="p-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    {isGenerating ? "Generating..." : "Generate from Template"}
                  </button>
                </div>

                {generatedDoc ? (
                  <div className="flex-1 overflow-auto p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        Generated Document
                      </span>
                      <button
                        onClick={() => setGeneratedDoc("")}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Back to Editor
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white border border-gray-200 rounded-xl p-5 leading-relaxed">
                      {generatedDoc}
                    </pre>
                  </div>
                ) : (
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="flex-1 p-4 text-sm font-mono text-gray-800 resize-none focus:outline-none leading-relaxed"
                    placeholder="Template content..."
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 shrink-0">
              <button onClick={() => setSelectedTemplate(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Close
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
