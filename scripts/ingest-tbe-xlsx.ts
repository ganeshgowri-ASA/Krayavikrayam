/**
 * TBE XLSX ingestor.
 *
 * Reads the five reference TBE comparison spreadsheets (when present at
 * scripts/fixtures/*.xlsx) and emits normalized JSON templates into
 * apps/api/prisma/seed/tbe-templates/<key>.json, matching the schema in
 * docs/TBE-SCHEMA.md §2.
 *
 * The detection is intentionally heuristic: comparison spreadsheets across
 * the five categories share a common shape (header block, criteria rows,
 * supplier columns) but their exact column order, label casing, and
 * header-row position vary. We scan the sheet to:
 *
 *   1. Locate the header row by keyword frequency.
 *   2. Identify spec columns (parameter / specification / unit / weight)
 *      and the contiguous block of supplier columns to their right.
 *   3. Walk subsequent rows as criteria, switching section when we hit a
 *      label-only row that matches a known section name for the category.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as XLSX from "xlsx";

export type TemplateKey = "tcps10" | "pid20ch" | "equipment" | "fourInOne" | "uv2";

export interface FixtureSpec {
  key: TemplateKey;
  fileName: string;
  category: string;
  defaultSections: string[];
}

export const FIXTURES: FixtureSpec[] = [
  {
    key: "tcps10",
    fileName: "TCPS10_Comparison_File.xlsx",
    category: "TCPS",
    defaultSections: [
      "General",
      "Ratings",
      "Insulation",
      "Protection",
      "Testing",
      "Documentation",
      "Commercial",
    ],
  },
  {
    key: "pid20ch",
    fileName: "PID-20-Ch-Comparison-File.xlsx",
    category: "PID",
    defaultSections: [
      "General",
      "Channel Spec",
      "Signal Type",
      "Accuracy",
      "Environmental",
      "Communication",
      "Documentation",
      "Commercial",
    ],
  },
  {
    key: "equipment",
    fileName: "Equipment-procurement-tracker.xlsx",
    category: "Equipment",
    defaultSections: [
      "Identification",
      "Vendor",
      "Delivery Schedule",
      "Inspection",
      "Dispatch",
      "GRN",
      "Payment",
    ],
  },
  {
    key: "fourInOne",
    fileName: "4-in-1-Comparison-File.xlsx",
    category: "4-in-1",
    defaultSections: [
      "General",
      "Functional Group A",
      "Functional Group B",
      "Functional Group C",
      "Functional Group D",
      "Common Utilities",
      "Documentation",
      "Commercial",
    ],
  },
  {
    key: "uv2",
    fileName: "UV2_Comparison_File.xlsx",
    category: "UV2",
    defaultSections: [
      "General",
      "UV Source",
      "Optics",
      "Control",
      "Safety",
      "Documentation",
      "Commercial",
    ],
  },
];

export interface IngestedCriterion {
  sequence: number;
  sectionName: string;
  code: string | null;
  name: string;
  specification: string | null;
  unit: string | null;
  dataType: "text" | "number" | "enum" | "boolean" | "file";
  mandatory: boolean;
  weight: number | null;
  enumOptions: string[];
}

export interface IngestedSection {
  sequence: number;
  name: string;
}

export interface IngestedSupplier {
  displayOrder: number;
  label: string;
}

export interface IngestedTemplate {
  templateKey: TemplateKey;
  category: string;
  title: string | null;
  rfqRef: string | null;
  sourceFile: string;
  sections: IngestedSection[];
  criteria: IngestedCriterion[];
  suppliers: IngestedSupplier[];
}

type Cell = string | number | boolean | null;
type Row = Cell[];

const HEADER_TOKENS = [
  "parameter",
  "specification",
  "spec",
  "requirement",
  "unit",
  "weight",
  "supplier",
  "vendor",
  "compliance",
  "remarks",
  "make",
  "model",
];

const SPEC_LABELS = {
  name: ["parameter", "criterion", "description", "item", "attribute", "feature"],
  spec: ["specification", "spec", "requirement", "buyer requirement", "required"],
  unit: ["unit", "uom"],
  weight: ["weight", "wt", "weightage"],
  code: ["code", "sl", "sl no", "sl.no", "s.no", "sr", "sr no", "ref"],
  mandatory: ["mandatory", "must", "critical"],
};

const SUPPLIER_LABELS = ["supplier", "vendor", "bidder", "make", "offer"];

/** Normalize a cell to a trimmed string for label comparison. */
function asLabel(cell: Cell): string {
  if (cell === null || cell === undefined) return "";
  return String(cell).trim().toLowerCase();
}

function isBlankRow(row: Row): boolean {
  return row.every((c) => c === null || c === undefined || String(c).trim() === "");
}

function countTokens(row: Row): number {
  let n = 0;
  for (const c of row) {
    const v = asLabel(c);
    if (!v) continue;
    for (const tok of HEADER_TOKENS) if (v.includes(tok)) n += 1;
  }
  return n;
}

/**
 * Detect the header row index by picking the row with the most header
 * tokens (parameter/specification/supplier/...).  Returns -1 if no row
 * has at least two such tokens.
 */
export function detectHeaderRow(rows: Row[]): number {
  let bestIdx = -1;
  let bestScore = 1; // require at least 2 tokens
  for (let i = 0; i < Math.min(rows.length, 30); i += 1) {
    const score = countTokens(rows[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

interface ColumnMap {
  code: number | null;
  name: number | null;
  spec: number | null;
  unit: number | null;
  weight: number | null;
  mandatory: number | null;
  supplierStart: number | null;
}

function findLabelColumn(header: Row, candidates: string[]): number | null {
  for (let i = 0; i < header.length; i += 1) {
    const v = asLabel(header[i]);
    if (!v) continue;
    if (candidates.some((c) => v === c || v.includes(c))) return i;
  }
  return null;
}

export function mapColumns(header: Row): ColumnMap {
  const code = findLabelColumn(header, SPEC_LABELS.code);
  const name = findLabelColumn(header, SPEC_LABELS.name);
  const spec = findLabelColumn(header, SPEC_LABELS.spec);
  const unit = findLabelColumn(header, SPEC_LABELS.unit);
  const weight = findLabelColumn(header, SPEC_LABELS.weight);
  const mandatory = findLabelColumn(header, SPEC_LABELS.mandatory);

  let supplierStart: number | null = null;
  for (let i = 0; i < header.length; i += 1) {
    const v = asLabel(header[i]);
    if (!v) continue;
    if (SUPPLIER_LABELS.some((s) => v.includes(s))) {
      supplierStart = i;
      break;
    }
  }
  // Fallback: anything to the right of the rightmost spec column is supplier-side.
  if (supplierStart === null) {
    const rightmost = Math.max(
      code ?? -1,
      name ?? -1,
      spec ?? -1,
      unit ?? -1,
      weight ?? -1,
      mandatory ?? -1,
    );
    if (rightmost >= 0 && rightmost + 1 < header.length) supplierStart = rightmost + 1;
  }

  return { code, name, spec, unit, weight, mandatory, supplierStart };
}

/**
 * Heuristic data-type inference from the spec text + unit.  Errs toward
 * "text" — downstream review can promote to enum/number.
 */
export function inferDataType(spec: string | null, unit: string | null): IngestedCriterion["dataType"] {
  const blob = `${spec ?? ""} ${unit ?? ""}`.toLowerCase();
  if (/\b(yes\/no|y\/n|true\/false)\b/.test(blob)) return "boolean";
  if (/\battachment\b|\bcertificate\b|\bdrawing\b|\bdocument\b/.test(blob)) return "file";
  if (unit && unit.trim() !== "") return "number";
  if (/[+\-]?\d/.test(blob) && !/[a-z]{4,}/.test(blob)) return "number";
  if (/\bone of\b|\boption\b|\beither\b|\b\/\b/.test(blob) && spec && spec.includes("/")) return "enum";
  return "text";
}

function suppliersFromHeader(header: Row, supplierStart: number): IngestedSupplier[] {
  const seen = new Set<string>();
  const out: IngestedSupplier[] = [];
  for (let i = supplierStart; i < header.length; i += 1) {
    const raw = String(header[i] ?? "").trim();
    if (!raw) continue;
    // Skip per-supplier sub-columns (compliance / remarks) by deduping
    // on the bare supplier label after stripping common suffixes.
    const base = raw
      .replace(/\b(quoted|value|compliance|remark[s]?|deviation|y\/n)\b/gi, "")
      .replace(/[-:|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const norm = base.toLowerCase();
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push({ displayOrder: out.length + 1, label: base || raw });
  }
  return out;
}

function findSectionForRow(
  row: Row,
  cols: ColumnMap,
  sections: string[],
): string | null {
  // A section row typically has only the leftmost cell(s) populated and
  // matches a known section label.
  const firstFew = row
    .slice(0, Math.max(2, (cols.name ?? 1) + 1))
    .map(asLabel)
    .filter(Boolean)
    .join(" ");
  if (!firstFew) return null;
  const supplierFilled = cols.supplierStart !== null
    ? row.slice(cols.supplierStart).some((c) => c !== null && c !== undefined && String(c).trim() !== "")
    : false;
  const specFilled = cols.spec !== null && row[cols.spec] !== undefined && String(row[cols.spec] ?? "").trim() !== "";
  if (supplierFilled || specFilled) return null;
  for (const s of sections) {
    if (firstFew.includes(s.toLowerCase())) return s;
  }
  return null;
}

/** Extract title / RFQ ref from rows above the header. */
function extractMeta(rows: Row[], headerIdx: number): { title: string | null; rfqRef: string | null } {
  let title: string | null = null;
  let rfqRef: string | null = null;
  for (let i = 0; i < headerIdx; i += 1) {
    const row = rows[i];
    for (let j = 0; j < row.length; j += 1) {
      const v = String(row[j] ?? "").trim();
      const lv = v.toLowerCase();
      if (!v) continue;
      if (!rfqRef && /(rfq|enquiry|tender)\s*(no|ref|#|:)?/i.test(v)) {
        const next = String(row[j + 1] ?? "").trim();
        if (next) rfqRef = next;
        else {
          const m = v.match(/[:\-#]\s*(.+)$/);
          if (m) rfqRef = m[1].trim();
        }
      }
      if (!title && (lv.includes("comparison") || lv.includes("bid evaluation") || lv.includes("tbe"))) {
        title = v;
      }
    }
  }
  return { title, rfqRef };
}

export function parseSheet(
  rows: Row[],
  spec: FixtureSpec,
): Omit<IngestedTemplate, "sourceFile"> {
  const headerIdx = detectHeaderRow(rows);
  if (headerIdx < 0) {
    return {
      templateKey: spec.key,
      category: spec.category,
      title: null,
      rfqRef: null,
      sections: spec.defaultSections.map((name, i) => ({ sequence: i + 1, name })),
      criteria: [],
      suppliers: [],
    };
  }
  const header = rows[headerIdx];
  const cols = mapColumns(header);
  const meta = extractMeta(rows, headerIdx);

  const suppliers = cols.supplierStart !== null ? suppliersFromHeader(header, cols.supplierStart) : [];

  const sectionsSeen: string[] = [];
  const criteria: IngestedCriterion[] = [];
  let currentSection = spec.defaultSections[0] ?? "General";

  for (let i = headerIdx + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (isBlankRow(row)) continue;

    const sectionHit = findSectionForRow(row, cols, spec.defaultSections);
    if (sectionHit) {
      currentSection = sectionHit;
      if (!sectionsSeen.includes(currentSection)) sectionsSeen.push(currentSection);
      continue;
    }

    const nameIdx = cols.name ?? 0;
    const name = String(row[nameIdx] ?? "").trim();
    if (!name) continue;
    // Skip footer rows like "Total score", "Recommendation".
    const lname = name.toLowerCase();
    if (/^(total|recommend|signature|approved by|prepared by)/i.test(lname)) continue;

    const codeRaw = cols.code !== null ? String(row[cols.code] ?? "").trim() : "";
    const specRaw = cols.spec !== null ? String(row[cols.spec] ?? "").trim() : "";
    const unitRaw = cols.unit !== null ? String(row[cols.unit] ?? "").trim() : "";
    const weightRaw = cols.weight !== null ? row[cols.weight] : null;
    const mandRaw = cols.mandatory !== null ? String(row[cols.mandatory] ?? "").trim().toLowerCase() : "";

    const weight = typeof weightRaw === "number"
      ? weightRaw
      : weightRaw !== null && String(weightRaw).trim() !== "" && !Number.isNaN(Number(weightRaw))
        ? Number(weightRaw)
        : null;

    if (!sectionsSeen.includes(currentSection)) sectionsSeen.push(currentSection);

    criteria.push({
      sequence: criteria.length + 1,
      sectionName: currentSection,
      code: codeRaw || null,
      name,
      specification: specRaw || null,
      unit: unitRaw || null,
      dataType: inferDataType(specRaw || null, unitRaw || null),
      mandatory: ["y", "yes", "true", "mandatory"].includes(mandRaw),
      weight,
      enumOptions: [],
    });
  }

  // Ensure every default section is represented in the output, in order,
  // followed by any new sections encountered in the sheet.
  const ordered: string[] = [];
  for (const s of spec.defaultSections) if (!ordered.includes(s)) ordered.push(s);
  for (const s of sectionsSeen) if (!ordered.includes(s)) ordered.push(s);

  return {
    templateKey: spec.key,
    category: spec.category,
    title: meta.title,
    rfqRef: meta.rfqRef,
    sections: ordered.map((name, i) => ({ sequence: i + 1, name })),
    criteria,
    suppliers,
  };
}

export function ingestWorkbook(workbook: XLSX.WorkBook, spec: FixtureSpec): Omit<IngestedTemplate, "sourceFile"> {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Row>(sheet, {
    header: 1,
    blankrows: false,
    defval: null,
    raw: true,
  });
  return parseSheet(rows, spec);
}

export function ingestFile(filePath: string, spec: FixtureSpec): IngestedTemplate {
  const wb = XLSX.readFile(filePath);
  const parsed = ingestWorkbook(wb, spec);
  return { ...parsed, sourceFile: path.basename(filePath) };
}

export interface RunOptions {
  fixturesDir: string;
  outDir: string;
  fixtures?: FixtureSpec[];
  logger?: (msg: string) => void;
}

export interface RunResult {
  written: string[];
  skipped: { key: TemplateKey; reason: string }[];
}

export function run(opts: RunOptions): RunResult {
  const log = opts.logger ?? ((msg: string) => console.log(msg));
  const fixtures = opts.fixtures ?? FIXTURES;
  fs.mkdirSync(opts.outDir, { recursive: true });

  const written: string[] = [];
  const skipped: RunResult["skipped"] = [];

  for (const spec of fixtures) {
    const filePath = path.join(opts.fixturesDir, spec.fileName);
    if (!fs.existsSync(filePath)) {
      log(`[skip] ${spec.fileName} not found at ${filePath}`);
      skipped.push({ key: spec.key, reason: "not-found" });
      continue;
    }
    const out = ingestFile(filePath, spec);
    const outPath = path.join(opts.outDir, `${spec.key}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
    log(
      `[ok]   ${spec.fileName} -> ${outPath} (${out.sections.length} sections, ` +
        `${out.criteria.length} criteria, ${out.suppliers.length} suppliers)`,
    );
    written.push(outPath);
  }
  return { written, skipped };
}

function isMain(): boolean {
  if (typeof require !== "undefined" && typeof module !== "undefined") {
    return require.main === module;
  }
  return false;
}

if (isMain()) {
  const repoRoot = path.resolve(__dirname, "..");
  const fixturesDir = path.join(repoRoot, "scripts", "fixtures");
  const outDir = path.join(repoRoot, "apps", "api", "prisma", "seed", "tbe-templates");
  const result = run({ fixturesDir, outDir });
  console.log(
    `\nDone. ${result.written.length} template(s) written, ${result.skipped.length} skipped.`,
  );
}
