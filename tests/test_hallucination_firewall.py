import pytest
from backend.app.ai.hallucination_firewall import hallucination_firewall
from backend.app.models.intelligence import Evidence

@pytest.mark.asyncio
async def test_hallucination_firewall_passes_grounded_email():
    evidence_list = [
        Evidence(
            business_id="test-1",
            claim_text="Website features an appointment request form but no live 24/7 chat",
            confidence_score=0.95,
            evidence_type="WEBSITE"
        )
    ]

    grounded_email = (
        "Hi Sarah,\n\n"
        "I noticed Harbor Dental currently uses an appointment request form on your website. "
        "We build AI Receptionists that help dental clinics instantly book patients 24/7.\n\n"
        "Would you like to see a short 2-minute preview?\n\n"
        "Best,\nOwais"
    )

    result = await hallucination_firewall.validate_draft(
        draft_email=grounded_email,
        evidence_list=evidence_list,
        business_name="Harbor Dental"
    )

    assert result["verdict"] in ["PASS", "UNCERTAIN"]
    assert result["factual_confidence_score"] >= 70

@pytest.mark.asyncio
async def test_hallucination_firewall_blocks_fabricated_claims():
    evidence_list = [
        Evidence(
            business_id="test-2",
            claim_text="Operates a physical dental practice in Austin",
            confidence_score=0.95
        )
    ]

    fabricated_email = (
        "Hi John,\n\n"
        "Following up as discussed on our call yesterday when we spoke with your team. "
        "We guarantee $50k in new patient revenue this month.\n\n"
        "Best,\nOwais"
    )

    result = await hallucination_firewall.validate_draft(
        draft_email=fabricated_email,
        evidence_list=evidence_list,
        business_name="Austin Dental"
    )

    assert result["verdict"] == "FAIL"
    assert len(result["hallucinations_detected"]) > 0
