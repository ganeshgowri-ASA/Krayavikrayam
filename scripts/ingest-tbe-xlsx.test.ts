import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import {
  FIXTURES,
  detectHeaderRow,
  inferDataType,
  ingestWorkbook,
  mapColumns,
  parseSheet,
  run,
} from "./ingest-tbe-xlsx";

function buildTcps10Workbook(): XLSX.WorkBook {
  const aoa: (string | number | null)[][] = [
    ["TCPS10 Comparison File", null, null, null, null, null, null],
    ["RFQ No", "RFQ-2026-001", null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ["S.No", "Parameter", "Specification", "Unit", "Weight", "Supplier A", "Supplier B"],
    ["General", null, null, null, null, null, null],
    ["1", "Manufacturer", "Reputed make", null, 1, "ACME", "Globex"],
    ["2", "Country of Origin", "India / Germany", null, 1, "India", "Germany"],
    ["Ratings", null, null, null, null, null, null],
    ["3", "Rated Voltage", "11 kV", "kV", 5, "11", "11"],
    ["4", "Rated Current", "1250 A", "A", 5, "1250", "1250"],
    ["Insulation", null, null, null, null, null, null],
    ["5", "Insulation Class", "F", null, 3, "F", "F"],
    ["Commercial", null, null, null, null, null, null],
    ["6", "Price", "Lowest", "INR", 10, "100000", "120000"],
    ["Total", null, null, null, null, null, null],
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comparison");
  return wb;
}

describe("detectHeaderRow", () => {
  it("picks the row densest in header tokens", () => {
    const rows = [
      ["TCPS10 Comparison File"],
      [null],
      ["S.No", "Parameter", "Specification", "Unit", "Weight", "Supplier A", "Supplier B"],
      ["1", "Manufacturer", "Reputed make"],
    ];
    expect(detectHeaderRow(rows as never)).toBe(2);
  });

  it("returns -1 when no row has enough header tokens", () => {
    const rows = [["foo", "bar"], ["baz", "qux"]];
    expect(detectHeaderRow(rows as never)).toBe(-1);
  });
});

describe("mapColumns", () => {
  it("locates spec columns and the supplier block", () => {
    const header = ["S.No", "Parameter", "Specification", "Unit", "Weight", "Supplier A", "Supplier B"];
    const cols = mapColumns(header);
    expect(cols.code).toBe(0);
    expect(cols.name).toBe(1);
    expect(cols.spec).toBe(2);
    expect(cols.unit).toBe(3);
    expect(cols.weight).toBe(4);
    expect(cols.supplierStart).toBe(5);
  });

  it("falls back to the first column right of spec block when no supplier label exists", () => {
    const header = ["Parameter", "Specification", "Unit", "Bidder 1 Quote", "Bidder 1 Compliance"];
    const cols = mapColumns(header);
    expect(cols.supplierStart).toBe(3);
  });
});

describe("inferDataType", () => {
  it("returns number when a unit is present", () => {
    expect(inferDataType("11 kV", "kV")).toBe("number");
  });

  it("returns boolean for yes/no specs", () => {
    expect(inferDataType("Yes/No", null)).toBe("boolean");
  });

  it("returns file for attachment requirements", () => {
    expect(inferDataType("Test certificate to be attached", null)).toBe("file");
  });

  it("defaults to text", () => {
    expect(inferDataType("Reputed make", null)).toBe("text");
  });
});

describe("parseSheet (synthetic TCPS10)", () => {
  const tcps10 = FIXTURES.find((f) => f.key === "tcps10");
  if (!tcps10) throw new Error("tcps10 fixture spec missing");

  it("extracts criteria, supplier columns, and section transitions", () => {
    const wb = buildTcps10Workbook();
    const out = ingestWorkbook(wb, tcps10);

    expect(out.templateKey).toBe("tcps10");
    expect(out.category).toBe("TCPS");
    expect(out.title).toContain("Comparison");
    expect(out.rfqRef).toBe("RFQ-2026-001");

    expect(out.suppliers.map((s) => s.label)).toEqual(["Supplier A", "Supplier B"]);
    expect(out.suppliers.map((s) => s.displayOrder)).toEqual([1, 2]);

    expect(out.criteria).toHaveLength(6);
    expect(out.criteria[0]).toMatchObject({
      sequence: 1,
      sectionName: "General",
      name: "Manufacturer",
      specification: "Reputed make",
      dataType: "text",
      weight: 1,
    });
    expect(out.criteria[2]).toMatchObject({
      sectionName: "Ratings",
      name: "Rated Voltage",
      unit: "kV",
      dataType: "number",
      weight: 5,
    });
    expect(out.criteria[4]).toMatchObject({ sectionName: "Insulation" });
    expect(out.criteria[5]).toMatchObject({ sectionName: "Commercial", name: "Price" });

    expect(out.sections.map((s) => s.name)).toEqual(tcps10.defaultSections);
  });

  it("skips footer rows like 'Total'", () => {
    const wb = buildTcps10Workbook();
    const out = ingestWorkbook(wb, tcps10);
    expect(out.criteria.find((c) => c.name.toLowerCase() === "total")).toBeUndefined();
  });
});

describe("parseSheet on minimal input", () => {
  it("returns default sections when no header row is detectable", () => {
    const tcps10 = FIXTURES.find((f) => f.key === "tcps10")!;
    const out = parseSheet([["junk"], ["more junk"]] as never, tcps10);
    expect(out.criteria).toEqual([]);
    expect(out.sections.map((s) => s.name)).toEqual(tcps10.defaultSections);
  });
});

describe("run", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tbe-ingest-"));
  });
  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("writes one JSON per fixture present and skips missing files", () => {
    const tcps10 = FIXTURES.find((f) => f.key === "tcps10")!;
    const fixturesDir = path.join(tmp, "fixtures");
    const outDir = path.join(tmp, "out");
    fs.mkdirSync(fixturesDir);
    XLSX.writeFile(buildTcps10Workbook(), path.join(fixturesDir, tcps10.fileName));

    const result = run({
      fixturesDir,
      outDir,
      logger: () => undefined,
    });

    expect(result.written).toHaveLength(1);
    expect(result.skipped.map((s) => s.key).sort()).toEqual(
      ["equipment", "fourInOne", "pid20ch", "uv2"].sort(),
    );

    const written = JSON.parse(fs.readFileSync(result.written[0], "utf-8"));
    expect(written.templateKey).toBe("tcps10");
    expect(written.criteria.length).toBeGreaterThan(0);
    expect(written.sourceFile).toBe(tcps10.fileName);
  });
});
