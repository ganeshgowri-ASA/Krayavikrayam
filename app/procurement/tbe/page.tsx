import fs from "node:fs";
import path from "node:path";

import Link from "next/link";

type VendorTotal = { score: number; percent: number };

type TBESummary = {
  package: string;
  date: string;
  template: string;
  evidence: string;
  output_xlsx: string;
  rows: number;
  vendors: string[];
  cells_filled: number;
  capex_cells: number;
  totals_per_vendor: Record<string, VendorTotal>;
  anomalies: string[];
};

const OUTPUT_DIR = path.join(process.cwd(), "07-output");
const RULES_PATH = path.join(process.cwd(), "00-rules", "CLAUDE.md");

function listSummaries(): TBESummary[] {
  if (!fs.existsSync(OUTPUT_DIR)) return [];
  return fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), "utf8")) as TBESummary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function rulesPresent(): boolean {
  return fs.existsSync(RULES_PATH);
}

export const dynamic = "force-dynamic";

export default function TBEPage() {
  const summaries = listSummaries();
  const haveRules = rulesPresent();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-bold tracking-tight">TBE Scoring Engine</h1>
          <Link href="/procurement" className="text-sm underline text-muted-foreground">
            ← Procurement Copilot
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Deterministic vendor scoring from <code>06-scripts/fill_tbe.py</code>. Rules locked in{" "}
          <code>00-rules/CLAUDE.md</code>. No fabrication — missing facts carry an explicit penalty.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Rules file: {haveRules ? "loaded" : <span className="text-red-600">missing</span>} ·
          Output folder: <code>07-output/</code>
        </p>
      </header>

      {summaries.length === 0 && (
        <section className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No filled TBEs yet. Run:
          <pre className="mt-3 inline-block rounded bg-muted px-3 py-2 text-xs">
            uv run python 06-scripts/fill_tbe.py --package UV-2
          </pre>
        </section>
      )}

      {summaries.map((s) => (
        <section key={s.package + s.date} className="mb-10 rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {s.package} <span className="ml-2 font-mono text-xs text-muted-foreground">{s.date}</span>
            </h2>
            <div className="text-xs text-muted-foreground">
              {s.rows} rows · {s.vendors.length} vendors · {s.cells_filled} scoring cells ·{" "}
              {s.capex_cells} Capex placeholders
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Weighted totals (/ 1000)
              </h3>
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-1">Vendor</th>
                    <th className="py-1 text-right">Score</th>
                    <th className="py-1 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(s.totals_per_vendor).map(([vendor, t]) => (
                    <tr key={vendor} className="border-b last:border-0">
                      <td className="py-1.5 font-medium">{vendor}</td>
                      <td className="py-1.5 text-right font-mono">{t.score.toFixed(1)}</td>
                      <td className="py-1.5 text-right font-mono">{t.percent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Anomalies ({s.anomalies.length})
              </h3>
              <ul className="max-h-72 list-disc overflow-auto pl-5 text-xs text-muted-foreground">
                {s.anomalies.slice(0, 40).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
                {s.anomalies.length > 40 && <li>+{s.anomalies.length - 40} more</li>}
              </ul>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Inputs: <code>{s.template}</code>, <code>{s.evidence}</code>
            <br />
            Output workbook: <code>{s.output_xlsx}</code> (download from repo; Vercel does not serve
            non-public paths)
          </div>
        </section>
      ))}

      <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
        <p>
          This page is a server-rendered stub. It reads JSON sidecars written by{" "}
          <code>fill_tbe.py</code> alongside each <code>.xlsx</code>. Protected sheets (
          <code>1-comparison</code>, <code>2-Utilities</code>, <code>3-Warranty</code>,{" "}
          <code>4-BOM</code>) are never written.
        </p>
      </footer>
    </main>
  );
}
