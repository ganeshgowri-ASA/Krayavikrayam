"""Shared test fixtures.

We add the repository root to ``sys.path`` so the ``scripts`` package
can be imported regardless of how pytest is invoked.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


@pytest.fixture
def evidence_atlas_uv2() -> dict:
    """A realistic-shaped evidence object for vendor 'Atlas' on UV2."""
    return {
        "_meta": {"package": "UV2", "vendor": "Atlas", "assistant": "test",
                   "generated_at": "2026-05-16T00:00:00+00:00"},
        "compliance_tally": {
            "value": {
                "fc": 42, "pc": 6, "dnc": 2,
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Compliance", "row_range": "12-62",
                "verbatim_quote": "FC=42 PC=6 DNC=2",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "thermal_design": {
            "value": {
                "refrigerant": "R-449A",
                "compressor": "metal-halide",
                "moc": "SS316L",
                "uniformity": "±2°C / ±5%RH",
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Thermal", "row": 14,
                "verbatim_quote": "metal-halide source, R-449A refrigerant",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "reliability": {
            "value": {
                "mtbf": 25000, "mttr": 4, "uptime": 99.2, "headcount": 12,
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Reliability", "row": 22,
                "verbatim_quote": "MTBF 25000h MTTR 4h",
                "warranty_months": 24,
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "bom_origin": {
            "value": {
                "spares": [
                    {"name": "Magnetron", "origin": "China",
                     "india_stock_qty": 0, "mttr_hours": "Not declared",
                     "source_file": "UV2_Comparison_File.xlsx",
                     "sheet": "BoM", "row": 33},
                    {"name": "PLC", "origin": "Germany",
                     "india_stock_qty": 5, "mttr_hours": 8,
                     "source_file": "UV2_Comparison_File.xlsx",
                     "sheet": "BoM", "row": 34},
                ],
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "BoM", "row_range": "33-34",
                "verbatim_quote": "Magnetron sourced from China; PLC from Germany",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "service_network": {
            "value": {
                "centres": 3, "cities": ["Bengaluru", "Pune", "Chennai"],
                "sla_hours": 24, "support_24x7": True,
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Service", "row": 45,
                "verbatim_quote": "3 centres, 24h SLA, 24x7 support",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "connectivity": {
            "value": {
                "opc_ua": True, "modbus_rtu": True, "modbus_tcp": False,
                "rest_api": True, "lims": True,
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Connectivity", "row": 52,
                "verbatim_quote": "OPC-UA, Modbus RTU, REST, LIMS supported",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "installed_base": {
            "value": {
                "oem": "Atlas", "india_installs": 4, "global_installs": 312,
                "reference_sites": ["NREL", "Fraunhofer"],
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Installs", "row": 60,
                "verbatim_quote": "4 India, 312 global",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
        "ctq_deviations": {
            "value": {
                "deviations": [
                    {"ctq": "UV irradiance", "rfq_value": "60 W/m²",
                     "offered_value": "55 W/m²", "delta": "-5",
                     "justification": "lamp constraints",
                     "source_file": "UV2_Comparison_File.xlsx",
                     "sheet": "Deviations", "row": 71},
                ],
                "source_file": "UV2_Comparison_File.xlsx",
                "sheet": "Deviations", "row_range": "71",
                "verbatim_quote": "UV irradiance reduced",
            },
            "provenance": "pinecone",
            "retrieved_at": "2026-05-16T00:00:00+00:00",
        },
    }


@pytest.fixture
def evidence_zenitek_dh20() -> dict:
    """Minimal Zenitek evidence including multilingual HMI quote."""
    return {
        "_meta": {"package": "DH20", "vendor": "Zenitek", "assistant": "test"},
        "compliance_tally": {
            "value": {"fc": 50, "pc": 0, "dnc": 0,
                      "source_file": "Zen.xlsx", "sheet": "Comp",
                      "row_range": "1-50", "verbatim_quote": "all FC"},
            "provenance": "pinecone",
        },
        "connectivity": {
            "value": {
                "opc_ua": True, "modbus_rtu": True, "modbus_tcp": True,
                "rest_api": True, "lims": True,
                "source_file": "Zen.xlsx", "sheet": "Conn", "row": 12,
                "verbatim_quote": "HMI is multilingual (English/Hindi/Mandarin)",
            },
            "provenance": "pinecone",
        },
        "bom_origin": {
            "value": {
                "spares": [
                    {"name": "Sensor", "origin": "Germany",
                     "india_stock_qty": 10, "mttr_hours": 4},
                ],
                "source_file": "Zen.xlsx", "sheet": "BoM", "row_range": "1",
                "verbatim_quote": "All German spares",
            },
        },
    }
