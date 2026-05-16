"""Locked TBE scoring rules.

These rules are *not* configurable -- they were ratified by the
procurement team and any change must go through PR review. The rules are:

  1. Option-A penalty: -3 to any vendor that lists a China-origin spare
     without (a) India stock and (b) a contractual MTTR.
  2. MTBF, warranty, and HMI run-hour visibility carry into the score
     only when explicitly declared; otherwise the row reads ``Not
     declared`` and the row contribution is 0.
  3. Fluorescent-UV sources are downgraded vs. metal-halide / LED
     (multiplier from ``packages.FLUORESCENT_UV_FACTOR``).
  4. Multilingual HMI credit is awarded *only* to Zenitek and *only* if
     the evidence explicitly states multilingual support. Other vendors
     claiming multilingual HMI without evidence get no credit.
  5. Capex rows are never auto-scored -- they remain blank with the
     placeholder text from ``packages.CAPEX_PLACEHOLDER``.

Every scoring decision produces a :class:`ScoreLine` with a ``ref``
string of the form ``Ref: <file>!<sheet>!Row N`` which is written into
the TBE Comments column. No score cell is ever written without a ref.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .packages import (
    CAPEX_PLACEHOLDER,
    FLUORESCENT_UV_FACTOR,
    MULTILINGUAL_HMI_CREDIT,
    MULTILINGUAL_HMI_VENDOR,
    NOT_DECLARED,
    OPTION_A_PENALTY,
    Package,
)


@dataclass
class ScoreLine:
    """A single TBE row contribution for one vendor."""

    criterion: str
    value: Any
    score: float
    ref: str
    comment: str = ""
    penalty_applied: float = 0.0

    def to_row(self) -> tuple[Any, ...]:
        return (self.criterion, self.value, self.score, self.ref, self.comment)


# ---------------------------------------------------------------------------
# Reference helper
# ---------------------------------------------------------------------------


def make_ref(evidence_field: dict[str, Any] | None) -> str:
    """Build a 'Ref: <file>!<sheet>!Row N' string from an evidence field.

    Falls back to a 'Not declared' marker so we never emit a blank ref.
    """
    if not evidence_field:
        return f"Ref: {NOT_DECLARED}"
    value = evidence_field.get("value", {}) if isinstance(evidence_field, dict) else {}
    src = value.get("source_file", NOT_DECLARED)
    sheet = value.get("sheet", NOT_DECLARED)
    row = value.get("row") or value.get("row_range") or NOT_DECLARED
    return f"Ref: {src}!{sheet}!Row {row}"


# ---------------------------------------------------------------------------
# Rule 1 -- Option A penalty (China-origin spares without India stock/MTTR)
# ---------------------------------------------------------------------------


def option_a_penalty(bom_field: dict[str, Any] | None) -> ScoreLine:
    """Apply the locked Option-A penalty.

    Returns a ScoreLine with ``score = OPTION_A_PENALTY`` (-3) when any
    China-origin spare is missing India stock AND MTTR. Otherwise score
    is 0.
    """
    ref = make_ref(bom_field)
    if not bom_field or not isinstance(bom_field, dict):
        return ScoreLine("Option-A (BoM origin)", NOT_DECLARED, 0.0, ref,
                         "No BoM evidence; cannot evaluate Option A.")
    value = bom_field.get("value", {})
    spares = value.get("spares", [])
    if not isinstance(spares, list) or not spares:
        return ScoreLine("Option-A (BoM origin)", NOT_DECLARED, 0.0, ref,
                         "BoM did not list spares.")
    offending = []
    for spare in spares:
        if not isinstance(spare, dict):
            continue
        origin = str(spare.get("origin", "")).strip().lower()
        if origin != "china":
            continue
        india_stock = spare.get("india_stock_qty")
        mttr = spare.get("mttr_hours")
        # Either truly missing OR self-declared as Not declared / 0 / empty.
        no_stock = india_stock in (None, 0, "", NOT_DECLARED)
        no_mttr = mttr in (None, 0, "", NOT_DECLARED)
        if no_stock or no_mttr:
            offending.append(spare.get("name", "<unnamed>"))
    if not offending:
        return ScoreLine("Option-A (BoM origin)", "Compliant", 0.0, ref,
                         "All China-origin spares have India stock and MTTR.")
    return ScoreLine(
        "Option-A (BoM origin)",
        f"China spares lacking India stock/MTTR: {', '.join(offending)}",
        float(OPTION_A_PENALTY),
        ref,
        "Locked Option-A penalty applied.",
        penalty_applied=float(OPTION_A_PENALTY),
    )


# ---------------------------------------------------------------------------
# Rule 2 -- MTBF / warranty / HMI run-hour visibility
# ---------------------------------------------------------------------------


def reliability_score(reliability_field: dict[str, Any] | None,
                       lamp_life_field: dict[str, Any] | None = None) -> list[ScoreLine]:
    """Score reliability declarations.

    Each of MTBF, warranty, and HMI-run-hour visibility contributes only
    when explicitly declared. Missing fields produce 'Not declared' rows
    with score 0 (no credit, no penalty -- the row simply does not
    accrue).
    """
    lines: list[ScoreLine] = []
    rel_ref = make_ref(reliability_field)
    rel_value = (reliability_field or {}).get("value", {}) if reliability_field else {}

    mtbf = rel_value.get("mtbf", NOT_DECLARED)
    if mtbf == NOT_DECLARED or mtbf in (None, ""):
        lines.append(ScoreLine("MTBF (hours)", NOT_DECLARED, 0.0, rel_ref, "No credit -- not declared."))
    else:
        # Linear credit, capped at 4: 1pt per 10k hours of declared MTBF.
        try:
            mtbf_hours = float(mtbf)
            score = min(4.0, mtbf_hours / 10000.0)
        except (TypeError, ValueError):
            score = 0.0
        lines.append(ScoreLine("MTBF (hours)", mtbf, round(score, 2), rel_ref))

    # Warranty + HMI run-hour visibility live in the sun-simulator
    # lamp_life evidence, but a generic chamber may surface them in the
    # reliability evidence as well -- check both.
    warranty = (lamp_life_field or {}).get("value", {}).get("warranty_months", NOT_DECLARED) if lamp_life_field else NOT_DECLARED
    if warranty == NOT_DECLARED:
        warranty = rel_value.get("warranty_months", NOT_DECLARED)
    warranty_ref = make_ref(lamp_life_field or reliability_field)
    if warranty in (NOT_DECLARED, None, ""):
        lines.append(ScoreLine("Warranty (months)", NOT_DECLARED, 0.0, warranty_ref, "No credit -- not declared."))
    else:
        try:
            months = float(warranty)
            score = min(3.0, months / 12.0)
        except (TypeError, ValueError):
            score = 0.0
        lines.append(ScoreLine("Warranty (months)", warranty, round(score, 2), warranty_ref))

    hmi_visible = (lamp_life_field or {}).get("value", {}).get("hmi_run_hour_visible", NOT_DECLARED) if lamp_life_field else NOT_DECLARED
    if hmi_visible == NOT_DECLARED:
        lines.append(ScoreLine("HMI run-hour visibility", NOT_DECLARED, 0.0, warranty_ref, "No credit -- not declared."))
    else:
        score = 1.0 if hmi_visible is True else 0.0
        lines.append(ScoreLine("HMI run-hour visibility", hmi_visible, score, warranty_ref))

    return lines


# ---------------------------------------------------------------------------
# Rule 3 -- Fluorescent-UV downgrade
# ---------------------------------------------------------------------------


def fluorescent_uv_adjustment(package: Package, design_score: float,
                              thermal_field: dict[str, Any] | None) -> tuple[float, str]:
    """If the package is UV and the source is fluorescent, downgrade the
    Design Concept score by the locked factor.

    Returns (adjusted_score, comment).
    """
    if not package.is_uv:
        return design_score, ""
    if not thermal_field:
        return design_score, ""
    value = thermal_field.get("value", {})
    # The compressor field in UV evidence is repurposed to capture the
    # lamp source ("fluorescent" / "metal-halide" / "LED") so the schema
    # stays uniform across packages.
    lamp = str(value.get("compressor", "")).strip().lower()
    if "fluoresc" in lamp:
        adjusted = round(design_score * FLUORESCENT_UV_FACTOR, 2)
        return adjusted, f"Fluorescent-UV downgrade applied (x{FLUORESCENT_UV_FACTOR})."
    return design_score, ""


# ---------------------------------------------------------------------------
# Rule 4 -- Multilingual HMI credit (Zenitek only, evidenced)
# ---------------------------------------------------------------------------


def multilingual_hmi_credit(vendor: str, connectivity_field: dict[str, Any] | None) -> ScoreLine:
    ref = make_ref(connectivity_field)
    if vendor.strip().lower() != MULTILINGUAL_HMI_VENDOR.lower():
        return ScoreLine(
            "Multilingual HMI credit",
            "Not awarded (vendor != Zenitek)",
            0.0,
            ref,
            "Locked rule: multilingual HMI credit is Zenitek-only.",
        )
    value = (connectivity_field or {}).get("value", {})
    quote = str(value.get("verbatim_quote", "")).lower()
    if "multilingual" in quote or "multi-lingual" in quote or "multi lingual" in quote:
        return ScoreLine(
            "Multilingual HMI credit",
            "Awarded",
            float(MULTILINGUAL_HMI_CREDIT),
            ref,
            "Evidence quote mentions multilingual HMI.",
        )
    return ScoreLine(
        "Multilingual HMI credit",
        "Not awarded (no evidence quote)",
        0.0,
        ref,
        "Locked rule: requires verbatim evidence of multilingual HMI.",
    )


# ---------------------------------------------------------------------------
# Rule 5 -- Capex rows blank
# ---------------------------------------------------------------------------


def capex_row(label: str) -> ScoreLine:
    """A Capex row never carries an automatic score; always blank."""
    return ScoreLine(label, CAPEX_PLACEHOLDER, 0.0, "Ref: n/a (Capex)",
                     "Capex never auto-scored; procurement team fills in.")


# ---------------------------------------------------------------------------
# Compliance tally (FC/PC/DNC) -> headline score
# ---------------------------------------------------------------------------


def compliance_tally_score(tally_field: dict[str, Any] | None) -> ScoreLine:
    """Convert FC/PC/DNC tally into a single Design Concept input.

    Score = FC * 1.0 + PC * 0.5 - DNC * 0.5, normalised to 0-30 range.
    The normalised value is the input that gets adjusted by rule 3
    (fluorescent-UV downgrade) in the caller.
    """
    ref = make_ref(tally_field)
    if not tally_field:
        return ScoreLine("Compliance tally (FC/PC/DNC)", NOT_DECLARED, 0.0, ref,
                         "No compliance tally; row reads Not declared.")
    value = tally_field.get("value", {})
    try:
        fc = float(value.get("fc", 0) or 0)
        pc = float(value.get("pc", 0) or 0)
        dnc = float(value.get("dnc", 0) or 0)
    except (TypeError, ValueError):
        return ScoreLine("Compliance tally (FC/PC/DNC)", NOT_DECLARED, 0.0, ref,
                         "Non-numeric tally; treated as Not declared.")
    total = fc + pc + dnc
    if total == 0:
        return ScoreLine("Compliance tally (FC/PC/DNC)", "0/0/0", 0.0, ref,
                         "Empty tally; row contributes 0.")
    raw = fc * 1.0 + pc * 0.5 - dnc * 0.5
    normalised = max(0.0, raw / total) * 30.0  # leave room for downgrade
    return ScoreLine(
        "Compliance tally (FC/PC/DNC)",
        f"{int(fc)}/{int(pc)}/{int(dnc)}",
        round(normalised, 2),
        ref,
    )
