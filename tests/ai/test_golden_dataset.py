import json
import pytest
from pathlib import Path
from backend.app.ai.personalization_scorer import personalization_scorer
from backend.app.inbox.buying_signals import buying_signal_extractor
from backend.app.ai.hallucination_firewall import hallucination_firewall
from backend.app.models.intelligence import Evidence

DATASET_PATH = Path(__file__).parent / "golden" / "dataset.json"

def load_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["cases"]

@pytest.mark.asyncio
async def test_golden_dataset_benchmarks():
    cases = load_dataset()
    assert len(cases) >= 50

    for case in cases:
        c_type = case["type"]
        cid = case["id"]

        if c_type == "REPLY_CLASSIFICATION":
            raw_text = case["input"]
            signals_res = buying_signal_extractor.analyze_signals(raw_text)
            if case.get("has_buying_signal"):
                assert signals_res["has_buying_signal"] is True, f"Failed on {cid}"
                for s in case.get("expected_signals", []):
                    assert s in signals_res["signals"], f"Missing signal {s} on {cid}"

        elif c_type == "OUTREACH_QUALITY":
            score_res = personalization_scorer.score_email(
                subject=case["subject"],
                body=case["body"],
                business_name=case["business_name"],
                industry=case["industry"],
                verified_facts=case.get("verified_facts", [])
            )
            assert score_res["passes_quality_gate"] == case["passes_quality_gate"], f"Quality gate mismatch on {cid}: {score_res}"
            if case["passes_quality_gate"]:
                assert score_res["personalization_score"] >= case["min_personalization_score"], f"Score too low on {cid}"

        elif c_type == "HALLUCINATION_VALIDATION":
            ev_models = [Evidence(business_id="b-1", claim_text=fact, confidence_score=0.95) for fact in case.get("evidence", [])]
            firewall_res = await hallucination_firewall.validate_draft(
                draft_email=case["body"],
                evidence_list=ev_models,
                business_name="Test Business"
            )
            assert firewall_res["verdict"] == case["expected_verdict"], f"Firewall verdict mismatch on {cid}: {firewall_res}"
