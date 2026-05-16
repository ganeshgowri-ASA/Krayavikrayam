"""Canonical query templates fed to the Pinecone Assistant.

Each query has:
  * ``key``       -- stable identifier used as the evidence field name
  * ``prompt``    -- the natural-language question sent to the Assistant
  * ``schema``    -- the keys expected back in the structured response
  * ``required``  -- whether absence of evidence should trigger a penalty

The Assistant is asked to return JSON conforming to ``schema`` so we never
parse free text. If it returns malformed JSON the field is recorded as
``Not declared`` and the prescribed penalty (see ``packages.py``) fires.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Query:
    key: str
    prompt: str
    schema: tuple[str, ...]
    required: bool = True


# 8 standard per-equipment extraction queries.
STANDARD_QUERIES: tuple[Query, ...] = (
    Query(
        key="compliance_tally",
        prompt=(
            "For the equipment package {package} from vendor {vendor}, "
            "tally the number of Full-Compliance (FC), Partial-Compliance (PC) "
            "and Did-Not-Comply (DNC) line items declared in the technical "
            "compliance sheet. Return JSON {{fc:int, pc:int, dnc:int, "
            "source_file, sheet, row_range, verbatim_quote}}."
        ),
        schema=("fc", "pc", "dnc", "source_file", "sheet", "row_range", "verbatim_quote"),
    ),
    Query(
        key="thermal_design",
        prompt=(
            "For {package} from {vendor}, extract refrigerant type, compressor "
            "make and model, material-of-construction of the chamber interior, "
            "and temperature/humidity uniformity figures. Return JSON "
            "{{refrigerant, compressor, moc, uniformity, source_file, sheet, "
            "row, verbatim_quote}}."
        ),
        schema=("refrigerant", "compressor", "moc", "uniformity", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="reliability",
        prompt=(
            "For {package} from {vendor}, extract MTBF (hours), MTTR (hours), "
            "claimed uptime (%) and India service-engineer headcount. Return "
            "JSON {{mtbf, mttr, uptime, headcount, source_file, sheet, row, "
            "verbatim_quote}}."
        ),
        schema=("mtbf", "mttr", "uptime", "headcount", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="bom_origin",
        prompt=(
            "For {package} from {vendor}, list the country of origin for each "
            "critical spare in the BoM, and for every China-origin spare state "
            "whether stock is held in India and the MTTR for replacement. "
            "Return JSON {{spares:[{{name, origin, india_stock_qty, mttr_hours, "
            "source_file, sheet, row}}], verbatim_quote}}."
        ),
        schema=("spares", "verbatim_quote"),
    ),
    Query(
        key="service_network",
        prompt=(
            "For {package} from {vendor}, describe the India service network: "
            "number of service centres, cities, contractual SLA in hours, "
            "and whether 24x7 support is offered. Return JSON {{centres:int, "
            "cities:[str], sla_hours, support_24x7:bool, source_file, sheet, "
            "row, verbatim_quote}}."
        ),
        schema=("centres", "cities", "sla_hours", "support_24x7", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="connectivity",
        prompt=(
            "For {package} from {vendor}, list which industrial protocols are "
            "supported: OPC-UA, MODBUS (RTU/TCP), REST API, LIMS integration. "
            "Return JSON {{opc_ua:bool, modbus_rtu:bool, modbus_tcp:bool, "
            "rest_api:bool, lims:bool, source_file, sheet, row, verbatim_quote}}."
        ),
        schema=("opc_ua", "modbus_rtu", "modbus_tcp", "rest_api", "lims", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="installed_base",
        prompt=(
            "For {package} from {vendor}, identify the OEM (if vendor is a "
            "reseller) and list the installed base in India and globally for "
            "this exact model. Return JSON {{oem, india_installs:int, "
            "global_installs:int, reference_sites:[str], source_file, sheet, "
            "row, verbatim_quote}}."
        ),
        schema=("oem", "india_installs", "global_installs", "reference_sites", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="ctq_deviations",
        prompt=(
            "For {package} from {vendor}, list every Critical-To-Quality (CTQ) "
            "parameter where the offer deviates from the RFQ, including "
            "magnitude of the deviation and any vendor justification. Return "
            "JSON {{deviations:[{{ctq, rfq_value, offered_value, delta, "
            "justification, source_file, sheet, row}}], verbatim_quote}}."
        ),
        schema=("deviations", "verbatim_quote"),
    ),
)


# 2 additional sun-simulator-only queries (only emitted for SSS / Flasher
# packages -- see ``packages.Package.is_sun_simulator``).
SUN_SIMULATOR_QUERIES: tuple[Query, ...] = (
    Query(
        key="spectral_match",
        prompt=(
            "For {package} from {vendor}, extract the spectral-match class "
            "(A/B/C per IEC 60904-9 ed.3), spatial non-uniformity (%), and "
            "temporal instability (STI/LTI %). Return JSON {{spectral_class, "
            "non_uniformity_pct, sti_pct, lti_pct, source_file, sheet, row, "
            "verbatim_quote}}."
        ),
        schema=("spectral_class", "non_uniformity_pct", "sti_pct", "lti_pct", "source_file", "sheet", "row", "verbatim_quote"),
    ),
    Query(
        key="lamp_life",
        prompt=(
            "For {package} from {vendor}, extract the lamp / LED life in "
            "hours, warranty in months on the light source, and HMI run-hour "
            "counter visibility (yes/no). Return JSON {{lamp_life_hours, "
            "warranty_months, hmi_run_hour_visible:bool, source_file, sheet, "
            "row, verbatim_quote}}."
        ),
        schema=("lamp_life_hours", "warranty_months", "hmi_run_hour_visible", "source_file", "sheet", "row", "verbatim_quote"),
    ),
)


def queries_for(package_is_sun_simulator: bool) -> tuple[Query, ...]:
    """Return the full query plan for a package."""
    if package_is_sun_simulator:
        return STANDARD_QUERIES + SUN_SIMULATOR_QUERIES
    return STANDARD_QUERIES
