"""End-to-end orchestrator.

For each (package, vendor) pair:
  1. ``rag_retrieve`` -> evidence JSON
  2. ``fill_tbe``     -> per-package TBE workbook + master summary
  3. ``gen_query_doc`` -> per-package vendor clarification .docx
  4. ``gen_email``    -> per-package HOD email (.eml + .html)

Logs coverage % and counts of 'Not declared' rows per (package, vendor).
Returns nonzero exit status if any package failed entirely (i.e. no
deliverables produced); per-row 'Not declared' rows are *not* failures
because the locked rules require the pipeline to record them and apply
the prescribed penalty.

Usage::

    python -m scripts.run_pipeline \\
        --packages UV2,UV4in1,DH20 \\
        --vendors Atlas,Zenitek,Espec \\
        --facts-dir facts/ \\
        --to hod@example.com
"""

from __future__ import annotations

import argparse
import json
import logging
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from .fill_tbe import (
    DELIVERABLES_ROOT,
    EVIDENCE_ROOT,
    fill_for_package,
    write_master_summary,
)
from .gen_email import compose_email
from .gen_query_doc import generate_doc
from .packages import NOT_DECLARED, PACKAGES, by_key
from .rag_retrieve import AssistantClient, retrieve_for_vendor


log = logging.getLogger("run_pipeline")


@dataclass
class PackageReport:
    package: str
    vendors: list[str]
    tbe_path: Path | None
    docx_path: Path | None
    eml_path: Path | None
    html_path: Path | None
    coverage_pct_by_vendor: dict[str, float]
    not_declared_by_vendor: dict[str, int]
    error: str | None = None


def _load_facts_for(facts_dir: Path | None, package: str, vendor: str) -> dict:
    if not facts_dir:
        return {}
    candidates = [
        facts_dir / f"{package}__{vendor}.json",
        facts_dir / f"{vendor}.json",
        facts_dir / package / f"{vendor}.json",
    ]
    for c in candidates:
        if c.exists():
            try:
                return json.loads(c.read_text())
            except json.JSONDecodeError as exc:
                log.error("Could not parse facts file %s: %s", c, exc)
                return {}
    return {}


def run(
    packages: list[str],
    vendors: list[str],
    facts_dir: Path | None = None,
    to: str = "hod-procurement@example.invalid",
    cc: list[str] | None = None,
    evidence_root: Path = EVIDENCE_ROOT,
    out_root: Path = DELIVERABLES_ROOT,
    client: AssistantClient | None = None,
) -> list[PackageReport]:
    client = client or AssistantClient()
    reports: list[PackageReport] = []
    per_package_scores: dict[str, list] = {}

    for pkg_key in packages:
        log.info("=== Package: %s ===", pkg_key)
        try:
            package = by_key(pkg_key)
        except KeyError as exc:
            reports.append(PackageReport(pkg_key, vendors, None, None, None, None,
                                          {}, {}, error=str(exc)))
            continue

        # 1. retrieval
        for vendor in vendors:
            facts = _load_facts_for(facts_dir, pkg_key, vendor)
            try:
                retrieve_for_vendor(
                    package_key=pkg_key,
                    vendor=vendor,
                    facts=facts,
                    client=client,
                    out_root=evidence_root,
                )
            except Exception as exc:
                log.exception("Retrieval failed for %s/%s: %s", pkg_key, vendor, exc)

        # 2. TBE
        try:
            tbe_path, scores = fill_for_package(
                package_key=pkg_key,
                vendors=vendors,
                evidence_root=evidence_root,
                out_root=out_root,
            )
            per_package_scores[pkg_key] = scores
        except Exception as exc:
            log.exception("TBE fill failed for %s: %s", pkg_key, exc)
            reports.append(PackageReport(pkg_key, vendors, None, None, None, None,
                                          {}, {}, error=str(exc)))
            continue

        # 3. clarification doc
        try:
            docx_path = generate_doc(
                package_key=pkg_key,
                vendors=vendors,
                evidence_root=evidence_root,
                out_root=out_root,
            )
        except Exception as exc:
            log.exception("Clarification doc failed for %s: %s", pkg_key, exc)
            docx_path = None

        # 4. email
        eml_path = html_path = None
        try:
            attachments = [p for p in (tbe_path, docx_path) if p]
            eml_path, html_path = compose_email(
                package_key=pkg_key,
                vendors=vendors,
                to=to,
                cc=cc,
                attachments=attachments,
                evidence_root=evidence_root,
                out_root=out_root,
            )
        except Exception as exc:
            log.exception("Email compose failed for %s: %s", pkg_key, exc)

        coverage_by_vendor = {s.vendor: s.coverage_pct for s in scores}
        not_declared_by_vendor = {
            s.vendor: sum(1 for l in s.lines if l.value == NOT_DECLARED) for s in scores
        }

        reports.append(PackageReport(
            package=pkg_key,
            vendors=vendors,
            tbe_path=tbe_path,
            docx_path=docx_path,
            eml_path=eml_path,
            html_path=html_path,
            coverage_pct_by_vendor=coverage_by_vendor,
            not_declared_by_vendor=not_declared_by_vendor,
        ))

    # Master summary across all processed packages.
    if per_package_scores:
        try:
            master_path = out_root / f"TBE-Master-Summary-v{datetime.utcnow():%Y%m%d}.xlsx"
            write_master_summary(per_package_scores, master_path)
            log.info("Master summary: %s", master_path)
        except Exception as exc:
            log.exception("Master summary failed: %s", exc)

    return reports


def _print_summary(reports: list[PackageReport]) -> None:
    print()
    print("=" * 78)
    print("PIPELINE SUMMARY")
    print("=" * 78)
    for r in reports:
        if r.error:
            print(f"  {r.package:18s} ERROR: {r.error}")
            continue
        print(f"  {r.package:18s} tbe={_p(r.tbe_path)}  docx={_p(r.docx_path)}  "
              f"email={_p(r.eml_path)}")
        for v in r.vendors:
            cov = r.coverage_pct_by_vendor.get(v, 0.0)
            nd = r.not_declared_by_vendor.get(v, 0)
            print(f"      {v:18s} coverage={cov:5.1f}%  not_declared_rows={nd}")
    print("=" * 78)


def _p(path: Path | None) -> str:
    return str(path) if path else "<missing>"


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser(description="Run the end-to-end RAG-TBE pipeline.")
    parser.add_argument(
        "--packages",
        default=",".join(p.key for p in PACKAGES),
        help="Comma-separated package keys (default: all)",
    )
    parser.add_argument("--vendors", required=True, help="Comma-separated vendor names")
    parser.add_argument("--facts-dir", default=None)
    parser.add_argument("--to", default="hod-procurement@example.invalid")
    parser.add_argument("--cc", default="")
    parser.add_argument("--evidence-root", default=str(EVIDENCE_ROOT))
    parser.add_argument("--out-root", default=str(DELIVERABLES_ROOT))
    args = parser.parse_args(argv)

    packages = [p.strip() for p in args.packages.split(",") if p.strip()]
    vendors = [v.strip() for v in args.vendors.split(",") if v.strip()]
    cc = [c.strip() for c in args.cc.split(",") if c.strip()]
    facts_dir = Path(args.facts_dir) if args.facts_dir else None

    reports = run(
        packages=packages,
        vendors=vendors,
        facts_dir=facts_dir,
        to=args.to,
        cc=cc,
        evidence_root=Path(args.evidence_root),
        out_root=Path(args.out_root),
    )
    _print_summary(reports)
    failed = [r for r in reports if r.error]
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
