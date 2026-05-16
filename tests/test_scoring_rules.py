"""Unit tests for the five locked scoring rules."""

from __future__ import annotations

import pytest

from scripts.packages import (
    CAPEX_PLACEHOLDER,
    FLUORESCENT_UV_FACTOR,
    MULTILINGUAL_HMI_CREDIT,
    NOT_DECLARED,
    OPTION_A_PENALTY,
    by_key,
)
from scripts.scoring import (
    capex_row,
    compliance_tally_score,
    fluorescent_uv_adjustment,
    multilingual_hmi_credit,
    option_a_penalty,
    reliability_score,
)


# ---------------------------------------------------------------------------
# Rule 1: Option-A penalty
# ---------------------------------------------------------------------------


class TestOptionA:
    def test_no_evidence_yields_zero_with_ref(self):
        line = option_a_penalty(None)
        assert line.score == 0.0
        assert "Not declared" in line.ref
        assert line.value == NOT_DECLARED

    def test_china_spare_missing_india_stock_triggers_penalty(self):
        bom = {"value": {"spares": [
            {"name": "Magnetron", "origin": "China",
             "india_stock_qty": 0, "mttr_hours": 4,
             "source_file": "x.xlsx", "sheet": "BoM", "row": 10},
        ], "source_file": "x.xlsx", "sheet": "BoM", "row": 10}}
        line = option_a_penalty(bom)
        assert line.score == float(OPTION_A_PENALTY) == -3.0
        assert line.penalty_applied == -3.0
        assert "Magnetron" in line.value

    def test_china_spare_missing_mttr_triggers_penalty(self):
        bom = {"value": {"spares": [
            {"name": "PSU", "origin": "China",
             "india_stock_qty": 5, "mttr_hours": NOT_DECLARED,
             "source_file": "x.xlsx", "sheet": "BoM", "row": 11},
        ], "source_file": "x.xlsx", "sheet": "BoM", "row": 11}}
        line = option_a_penalty(bom)
        assert line.score == -3.0

    def test_china_spare_with_stock_and_mttr_passes(self):
        bom = {"value": {"spares": [
            {"name": "PSU", "origin": "China",
             "india_stock_qty": 5, "mttr_hours": 8,
             "source_file": "x.xlsx", "sheet": "BoM", "row": 11},
        ], "source_file": "x.xlsx", "sheet": "BoM", "row": 11}}
        line = option_a_penalty(bom)
        assert line.score == 0.0
        assert line.value == "Compliant"

    def test_non_china_spares_never_penalised(self):
        bom = {"value": {"spares": [
            {"name": "X", "origin": "Germany", "india_stock_qty": 0, "mttr_hours": NOT_DECLARED},
        ], "source_file": "x.xlsx", "sheet": "BoM", "row": 1}}
        line = option_a_penalty(bom)
        assert line.score == 0.0

    def test_ref_string_format(self):
        bom = {"value": {"spares": [
            {"name": "X", "origin": "China", "india_stock_qty": 0, "mttr_hours": None},
        ], "source_file": "UV2.xlsx", "sheet": "BoM", "row": 42}}
        line = option_a_penalty(bom)
        assert line.ref == "Ref: UV2.xlsx!BoM!Row 42"


# ---------------------------------------------------------------------------
# Rule 2: MTBF/warranty/HMI visibility
# ---------------------------------------------------------------------------


class TestReliability:
    def test_missing_reliability_yields_three_not_declared_rows(self):
        lines = reliability_score(None, None)
        assert len(lines) == 3
        assert all(l.value == NOT_DECLARED for l in lines)
        assert all(l.score == 0.0 for l in lines)
        # Every row has a ref string (never blank).
        assert all(l.ref.startswith("Ref:") for l in lines)

    def test_mtbf_scales_linearly_capped_at_4(self):
        rel = {"value": {"mtbf": 20000, "source_file": "x", "sheet": "y", "row": 1}}
        lines = reliability_score(rel, None)
        mtbf_line = next(l for l in lines if "MTBF" in l.criterion)
        assert mtbf_line.score == 2.0

        rel2 = {"value": {"mtbf": 1_000_000, "source_file": "x", "sheet": "y", "row": 1}}
        lines2 = reliability_score(rel2, None)
        mtbf_line2 = next(l for l in lines2 if "MTBF" in l.criterion)
        assert mtbf_line2.score == 4.0

    def test_warranty_capped_at_3(self):
        lamp = {"value": {"warranty_months": 60, "source_file": "x", "sheet": "y", "row": 1}}
        lines = reliability_score(None, lamp)
        warranty_line = next(l for l in lines if "Warranty" in l.criterion)
        assert warranty_line.score == 3.0

    def test_hmi_visible_true_gets_credit(self):
        lamp = {"value": {"hmi_run_hour_visible": True, "source_file": "x", "sheet": "y", "row": 1}}
        lines = reliability_score(None, lamp)
        hmi = next(l for l in lines if "HMI" in l.criterion)
        assert hmi.score == 1.0

    def test_hmi_visible_false_no_credit(self):
        lamp = {"value": {"hmi_run_hour_visible": False, "source_file": "x", "sheet": "y", "row": 1}}
        lines = reliability_score(None, lamp)
        hmi = next(l for l in lines if "HMI" in l.criterion)
        assert hmi.score == 0.0


# ---------------------------------------------------------------------------
# Rule 3: Fluorescent-UV downgrade
# ---------------------------------------------------------------------------


class TestFluorescentUVDowngrade:
    def test_no_downgrade_for_non_uv_package(self):
        pkg = by_key("DH20")
        adjusted, comment = fluorescent_uv_adjustment(pkg, 20.0, {"value": {"compressor": "fluorescent"}})
        assert adjusted == 20.0
        assert comment == ""

    def test_fluorescent_uv_downgrade_applies(self):
        pkg = by_key("UV2")
        adjusted, comment = fluorescent_uv_adjustment(pkg, 20.0, {"value": {"compressor": "fluorescent"}})
        assert adjusted == round(20.0 * FLUORESCENT_UV_FACTOR, 2)
        assert "Fluorescent" in comment

    def test_metal_halide_uv_not_downgraded(self):
        pkg = by_key("UV2")
        adjusted, comment = fluorescent_uv_adjustment(pkg, 20.0, {"value": {"compressor": "metal-halide"}})
        assert adjusted == 20.0
        assert comment == ""

    def test_no_thermal_evidence_no_downgrade(self):
        pkg = by_key("UV2")
        adjusted, comment = fluorescent_uv_adjustment(pkg, 20.0, None)
        assert adjusted == 20.0
        assert comment == ""


# ---------------------------------------------------------------------------
# Rule 4: Multilingual HMI credit (Zenitek-only, evidenced)
# ---------------------------------------------------------------------------


class TestMultilingualHMI:
    def test_only_zenitek_eligible(self):
        line = multilingual_hmi_credit("Atlas", {"value": {"verbatim_quote": "multilingual HMI"}})
        assert line.score == 0.0
        assert "Zenitek-only" in line.comment

    def test_zenitek_with_evidence_gets_credit(self):
        line = multilingual_hmi_credit(
            "Zenitek",
            {"value": {"verbatim_quote": "HMI is multilingual (English/Hindi/Mandarin)",
                       "source_file": "Zen.xlsx", "sheet": "Conn", "row": 12}},
        )
        assert line.score == float(MULTILINGUAL_HMI_CREDIT) == 2.0

    def test_zenitek_without_evidence_no_credit(self):
        line = multilingual_hmi_credit(
            "Zenitek",
            {"value": {"verbatim_quote": "HMI supports English",
                       "source_file": "Zen.xlsx", "sheet": "Conn", "row": 12}},
        )
        assert line.score == 0.0

    def test_zenitek_case_insensitive(self):
        line = multilingual_hmi_credit(
            "ZENITEK",
            {"value": {"verbatim_quote": "MULTI-LINGUAL HMI",
                       "source_file": "x", "sheet": "y", "row": 1}},
        )
        assert line.score == 2.0


# ---------------------------------------------------------------------------
# Rule 5: Capex rows always blank
# ---------------------------------------------------------------------------


class TestCapex:
    def test_capex_value_is_placeholder(self):
        line = capex_row("Equipment purchase price")
        assert line.value == CAPEX_PLACEHOLDER
        assert line.score == 0.0
        assert "Capex" in line.comment

    def test_capex_ref_is_not_applicable(self):
        line = capex_row("AMC")
        assert "n/a" in line.ref.lower()


# ---------------------------------------------------------------------------
# Compliance-tally score normalisation
# ---------------------------------------------------------------------------


class TestComplianceTally:
    @pytest.mark.parametrize("fc,pc,dnc,expected_max", [
        (10, 0, 0, 30.0),  # all FC -> max
        (0, 0, 10, 0.0),   # all DNC -> 0 (clamped at 0)
        (5, 5, 0, 22.5),   # half FC half PC
    ])
    def test_tally_normalisation(self, fc, pc, dnc, expected_max):
        line = compliance_tally_score({
            "value": {"fc": fc, "pc": pc, "dnc": dnc,
                      "source_file": "x", "sheet": "y", "row": 1},
        })
        assert line.score == expected_max

    def test_empty_tally(self):
        line = compliance_tally_score({"value": {"fc": 0, "pc": 0, "dnc": 0,
                                                  "source_file": "x", "sheet": "y", "row": 1}})
        assert line.score == 0.0

    def test_missing_tally(self):
        line = compliance_tally_score(None)
        assert line.score == 0.0
        assert line.value == NOT_DECLARED
