"""Tests for the RAG retrieval layer.

We never hit Pinecone live in CI -- instead we inject a fake
``AssistantClient`` that returns canned JSON.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import pytest

from scripts.packages import NOT_DECLARED
from scripts.queries import STANDARD_QUERIES, SUN_SIMULATOR_QUERIES, queries_for
from scripts.rag_retrieve import AssistantClient, retrieve_for_vendor


class _FakeClient(AssistantClient):
    def __init__(self, responses: dict[str, str], available: bool = True):
        # Skip parent __post_init__ network setup.
        self.name = "test"
        self._impl = object() if available else None
        self._responses = responses

    def available(self) -> bool:
        return self._impl is not None

    def ask(self, prompt: str) -> str:
        for key, response in self._responses.items():
            if key in prompt.lower():
                return response
        return ""


def test_queries_for_standard_package_returns_eight():
    qs = queries_for(package_is_sun_simulator=False)
    assert len(qs) == 8
    assert qs == STANDARD_QUERIES


def test_queries_for_sun_simulator_returns_ten():
    qs = queries_for(package_is_sun_simulator=True)
    assert len(qs) == 10
    assert qs[-2:] == SUN_SIMULATOR_QUERIES


def test_retrieve_without_pinecone_records_not_declared(tmp_path):
    client = _FakeClient({}, available=False)
    out = retrieve_for_vendor("DH20", "Atlas", client=client, out_root=tmp_path)
    evidence = json.loads(out.read_text())
    for q in STANDARD_QUERIES:
        assert q.key in evidence
        assert evidence[q.key]["provenance"] == "no-pinecone"
        # Every schema field must be Not declared (no fabrication).
        for field in q.schema:
            assert evidence[q.key]["value"][field] == NOT_DECLARED


def test_retrieve_parses_json_with_markdown_fences(tmp_path):
    response = """Sure, here is the data:

```json
{"fc": 40, "pc": 5, "dnc": 1,
 "source_file": "UV2.xlsx", "sheet": "Compliance",
 "row_range": "10-55", "verbatim_quote": "FC=40 PC=5 DNC=1"}
```
"""
    client = _FakeClient({"tally": response})
    out = retrieve_for_vendor("UV2", "Atlas", client=client, out_root=tmp_path)
    evidence = json.loads(out.read_text())
    val = evidence["compliance_tally"]["value"]
    assert val["fc"] == 40
    assert val["source_file"] == "UV2.xlsx"


def test_user_facts_override_pinecone(tmp_path):
    client = _FakeClient({})
    facts = {"compliance_tally": {"fc": 99, "pc": 1, "dnc": 0,
                                    "source_file": "user.xlsx",
                                    "sheet": "x", "row": 1,
                                    "verbatim_quote": "user-declared"}}
    out = retrieve_for_vendor("DH20", "Atlas", facts=facts, client=client, out_root=tmp_path)
    evidence = json.loads(out.read_text())
    assert evidence["compliance_tally"]["value"]["fc"] == 99
    assert "user" in evidence["compliance_tally"]["provenance"]


def test_sun_simulator_package_runs_extra_queries(tmp_path):
    client = _FakeClient({}, available=False)
    out = retrieve_for_vendor("AAA-Flasher", "Wacom", client=client, out_root=tmp_path)
    evidence = json.loads(out.read_text())
    assert "spectral_match" in evidence
    assert "lamp_life" in evidence


def test_pinecone_failure_marks_provenance_error(tmp_path):
    class _BoomClient(_FakeClient):
        def ask(self, prompt):
            raise RuntimeError("simulated network error")

    client = _BoomClient({})
    out = retrieve_for_vendor("DH20", "Atlas", client=client, out_root=tmp_path)
    evidence = json.loads(out.read_text())
    assert evidence["compliance_tally"]["provenance"].startswith("error:")
    # Still no fabricated values.
    assert evidence["compliance_tally"]["value"]["fc"] == NOT_DECLARED


def test_no_cross_vendor_transfer(tmp_path):
    """Atlas evidence must never appear in a Zenitek evidence file."""
    atlas_response = json.dumps({
        "fc": 50, "pc": 0, "dnc": 0,
        "source_file": "Atlas.xlsx", "sheet": "C", "row_range": "1",
        "verbatim_quote": "Atlas FC=50",
    })
    client = _FakeClient({"tally": atlas_response})
    retrieve_for_vendor("DH20", "Atlas", client=client, out_root=tmp_path)
    # Now Zenitek with a different fake response.
    zen_response = json.dumps({
        "fc": 30, "pc": 5, "dnc": 0,
        "source_file": "Zenitek.xlsx", "sheet": "C", "row_range": "1",
        "verbatim_quote": "Zenitek FC=30",
    })
    client2 = _FakeClient({"tally": zen_response})
    retrieve_for_vendor("DH20", "Zenitek", client=client2, out_root=tmp_path)

    atlas = json.loads((tmp_path / "DH20" / "Atlas.json").read_text())
    zen = json.loads((tmp_path / "DH20" / "Zenitek.json").read_text())
    assert atlas["compliance_tally"]["value"]["source_file"] == "Atlas.xlsx"
    assert zen["compliance_tally"]["value"]["source_file"] == "Zenitek.xlsx"
    # The two files must never share verbatim quotes.
    assert atlas["compliance_tally"]["value"]["verbatim_quote"] != zen["compliance_tally"]["value"]["verbatim_quote"]
