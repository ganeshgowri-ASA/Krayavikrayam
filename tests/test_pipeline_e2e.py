"""End-to-end pipeline smoke test (no Pinecone)."""

from __future__ import annotations

import email
from pathlib import Path

from scripts.packages import NOT_DECLARED, by_key
from scripts.run_pipeline import run


def test_pipeline_runs_offline(tmp_path):
    """With PINECONE_API_KEY unset and no facts dir, the pipeline still
    produces deliverables for every requested package."""
    reports = run(
        packages=["DH20", "UV2", "AAA-SSS"],
        vendors=["Atlas", "Zenitek"],
        facts_dir=None,
        to="hod@test.invalid",
        evidence_root=tmp_path / "evidence",
        out_root=tmp_path / "deliverables",
    )
    assert len(reports) == 3
    for r in reports:
        assert r.error is None, f"Package {r.package} errored: {r.error}"
        assert r.tbe_path and r.tbe_path.exists()
        assert r.docx_path and r.docx_path.exists()
        assert r.eml_path and r.eml_path.exists()
        assert r.html_path and r.html_path.exists()
        # With no evidence, every truly missing row reads Not declared;
        # rule-driven rows (multilingual HMI "Not awarded", SSS "n/a")
        # still count as declared in coverage, so coverage > 0 here.
        for v in r.vendors:
            assert r.not_declared_by_vendor[v] >= 10  # at minimum the 10 rows that need evidence


def test_email_has_required_parts(tmp_path):
    reports = run(
        packages=["DH20"],
        vendors=["Atlas"],
        evidence_root=tmp_path / "evidence",
        out_root=tmp_path / "deliverables",
    )
    r = reports[0]
    msg = email.message_from_bytes(r.eml_path.read_bytes())
    assert msg["Subject"].startswith("[TBE]")
    assert msg["To"] == "hod-procurement@example.invalid"
    # Must be multipart with text + html + attachments.
    parts = list(msg.walk())
    has_html = any(p.get_content_type() == "text/html" for p in parts)
    has_text = any(p.get_content_type() == "text/plain" for p in parts)
    has_xlsx = any(
        p.get_content_type() == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        for p in parts
    )
    has_docx = any(
        p.get_content_type() == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        for p in parts
    )
    assert has_html and has_text and has_xlsx and has_docx


def test_master_summary_written(tmp_path):
    run(
        packages=["DH20", "UV2"],
        vendors=["Atlas"],
        evidence_root=tmp_path / "evidence",
        out_root=tmp_path / "deliverables",
    )
    masters = list((tmp_path / "deliverables").glob("TBE-Master-Summary-v*.xlsx"))
    assert len(masters) == 1
