"""Equipment packages and their TBE-row weighting profile.

The weighting rule the procurement team locked in:

  * UV2 and 4-in-1 packages       -> Design Concept = 30, Ease of Operation = 5
  * Every other package            -> Design Concept = 32, Ease of Operation = 7

Capex rows are never scored automatically; they are left blank and tagged
'TBC - Procurement Team assessment' (see ``CAPEX_PLACEHOLDER``).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Mapping


CAPEX_PLACEHOLDER = "TBC - Procurement Team assessment"
NOT_DECLARED = "Not declared"

# Locked Option-A penalty: applied when a vendor lists a China-origin spare
# but cannot prove either India stock or a contractual MTTR.
OPTION_A_PENALTY = -3

# Locked fluorescent-UV downgrade: applied to UV packages when the source is
# fluorescent (vs. metal-halide / LED). The score row is multiplied by this
# factor.
FLUORESCENT_UV_FACTOR = 0.5

# Multilingual HMI credit (locked): only Zenitek receives this credit and
# only when evidenced. Other vendors are scored on documented English-only
# HMIs even if they claim multilingual support without evidence.
MULTILINGUAL_HMI_CREDIT = 2
MULTILINGUAL_HMI_VENDOR = "Zenitek"


@dataclass(frozen=True)
class WeightProfile:
    design_concept: int
    ease_of_operation: int


@dataclass(frozen=True)
class Package:
    key: str                # filename-safe identifier
    display_name: str       # human-readable
    weights: WeightProfile
    is_sun_simulator: bool = False
    is_uv: bool = False


# Standard profile (Design Concept = 32, Ease of Operation = 7).
_STD = WeightProfile(design_concept=32, ease_of_operation=7)
# UV / 4-in-1 profile (Design Concept = 30, Ease of Operation = 5).
_UV = WeightProfile(design_concept=30, ease_of_operation=5)


# Locked package list from the procurement team. The order here is the
# order in which the orchestrator emits deliverables; do not re-sort.
PACKAGES: tuple[Package, ...] = (
    Package("UV2",            "UV-2 weather chamber",                 _UV,  is_uv=True),
    Package("UV4in1",         "4-in-1 (UV/Damp-Heat/Thermal)",        _UV,  is_uv=True),
    Package("DH20",           "Damp-Heat 20-chamber",                 _STD),
    Package("TCHFDH10",       "TC-HF + DH 10-chamber",                _STD),
    Package("TCHFDH20",       "TC-HF + DH 20-chamber",                _STD),
    Package("TCPS10-PID10",   "TC-PS 10 / PID-10 combo",              _STD),
    Package("PID20",          "PID-20 chamber",                       _STD),
    Package("TCHF-LETID-PS",  "TC-HF + LETID-PS",                     _STD),
    Package("MH-SSS",         "Metal-Halide Steady-State Sun Sim",    _STD, is_sun_simulator=True),
    Package("LED-SSS",        "LED Steady-State Sun Simulator",       _STD, is_sun_simulator=True),
    Package("BBA-SSS",        "BBA Steady-State Sun Simulator",       _STD, is_sun_simulator=True),
    Package("AAA-Flasher",    "AAA Pulsed Flasher",                   _STD, is_sun_simulator=True),
    Package("AAA-SSS",        "AAA Steady-State Sun Simulator",       _STD, is_sun_simulator=True),
)


def by_key(key: str) -> Package:
    for p in PACKAGES:
        if p.key == key:
            return p
    raise KeyError(f"Unknown package: {key}")


def packages_by_key() -> Mapping[str, Package]:
    return {p.key: p for p in PACKAGES}
