"""Every score cell must carry a Ref: <file>!<sheet>!Row N citation."""

from __future__ import annotations

import json
from pathlib import Path

from scripts.fill_tbe import ROW_PLAN, score_vendor
from scripts.packages import CAPEX_PLACEHOLDER, NOT_DECLARED, by_key


def test_every_line_has_a_ref(evidence_atlas_uv2):
    pkg = by_key("UV2")
    score = score_vendor(pkg, "Atlas", evidence_atlas_uv2)
    assert score.lines, "Expected at least one score line"
    for line in score.lines:
        assert line.ref.startswith("Ref:"), f"Missing ref on row: {line.criterion}"


def test_capex_rows_blank_with_placeholder(evidence_atlas_uv2):
    pkg = by_key("UV2")
    score = score_vendor(pkg, "Atlas", evidence_atlas_uv2)
    capex_labels = ("Equipment purchase price", "Installation & commissioning",
                    "Annual maintenance contract (AMC)")
    capex_lines = [l for l in score.lines if l.criterion in capex_labels]
    assert len(capex_lines) == 3
    for line in capex_lines:
        assert line.value == CAPEX_PLACEHOLDER
        assert line.score == 0.0


def test_missing_evidence_recorded_as_not_declared():
    pkg = by_key("DH20")
    score = score_vendor(pkg, "GhostVendor", {})  # no evidence
    not_declared = [l for l in score.lines if l.value == NOT_DECLARED]
    # Non-Capex, non-SSS-n/a, non-multilingual-Zenitek-only rows should be
    # Not declared. DH20 has 16 rows total: 3 Capex (placeholder), 2
    # SSS-only ("n/a"), 1 multilingual HMI ("Not awarded ..."), leaving
    # 10 rows that must read Not declared.
    expected_min = len(ROW_PLAN) - 3 - 2 - 1
    assert len(not_declared) >= expected_min


def test_capex_total_always_zero(evidence_atlas_uv2):
    pkg = by_key("UV2")
    score = score_vendor(pkg, "Atlas", evidence_atlas_uv2)
    assert score.capex_total == 0.0


def test_design_concept_total_capped_at_weight(evidence_atlas_uv2):
    pkg = by_key("UV2")
    score = score_vendor(pkg, "Atlas", evidence_atlas_uv2)
    # UV2 weight profile: Design Concept = 30.
    assert score.design_total <= pkg.weights.design_concept


def test_ease_of_operation_total_capped_at_weight():
    pkg = by_key("DH20")  # Ease = 7
    # Forge evidence that would otherwise overshoot.
    evidence = {
        "connectivity": {
            "value": {
                "opc_ua": True, "modbus_rtu": True, "modbus_tcp": True,
                "rest_api": True, "lims": True,
                "verbatim_quote": "multilingual everywhere",
                "source_file": "x", "sheet": "y", "row": 1,
            },
        },
    }
    score = score_vendor(pkg, "Zenitek", evidence)
    assert score.ease_total <= pkg.weights.ease_of_operation


def test_ref_includes_filename_and_sheet_and_row(evidence_atlas_uv2):
    pkg = by_key("UV2")
    score = score_vendor(pkg, "Atlas", evidence_atlas_uv2)
    # Find a line backed by real evidence.
    bom_line = next(l for l in score.lines if l.criterion.startswith("Option-A"))
    assert "UV2_Comparison_File.xlsx" in bom_line.ref
    assert "BoM" in bom_line.ref
    assert "Row" in bom_line.ref
