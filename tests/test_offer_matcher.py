import pytest
from backend.app.intelligence.offer_matcher import offer_matcher
from backend.app.models.business import Business
from backend.app.models.intelligence import Evidence

def test_offer_matcher_dental_receptionist():
    biz = Business(
        name="Oakland Family Dental",
        industry="Dental",
        has_online_booking=False,
        has_live_chat=False
    )
    evidences = [
        Evidence(business_id="1", claim_text="No automated booking system on landing page")
    ]

    matched = offer_matcher.match_best_offer(biz, evidences)
    assert matched["primary_offer"]["key"] == "AI_RECEPTIONIST_BOOKING"
    assert "24/7" in matched["primary_offer"]["name"]

def test_offer_matcher_real_estate_speed_to_lead():
    biz = Business(
        name="Prestige Realty Group",
        industry="Real Estate",
        has_online_booking=True,
        has_live_chat=False
    )
    evidences = []

    matched = offer_matcher.match_best_offer(biz, evidences)
    assert matched["primary_offer"]["key"] == "INSTANT_LEAD_RESPONDER"
    assert "Speed-to-Lead" in matched["primary_offer"]["name"]

def test_offer_matcher_hotel_concierge():
    biz = Business(
        name="Grand Azure Resort",
        industry="Hotel",
        has_online_booking=True,
        has_live_chat=False
    )
    evidences = []

    matched = offer_matcher.match_best_offer(biz, evidences)
    assert matched["primary_offer"]["key"] == "HOTEL_CONCIERGE_AI"
    assert "Concierge" in matched["primary_offer"]["name"]
