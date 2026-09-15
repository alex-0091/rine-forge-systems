import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select

from backend.app.main import app
from backend.app.config import settings
from backend.app.channels.contract import ChannelType, MessageContentType
from backend.app.channels.whatsapp.parser import parse_meta_webhook
from backend.app.models.receptionist import ReceptionistConversation, ReceptionistMessage


@pytest.mark.asyncio
async def test_whatsapp_webhook_verification_success():
    """Verify Meta challenge verification with valid token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            "/api/whatsapp/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.challenge": "meta_challenge_nonce_8829",
                "hub.verify_token": settings.META_VERIFY_TOKEN
            }
        )
        assert response.status_code == 200
        assert response.text == "meta_challenge_nonce_8829"
        assert "text/plain" in response.headers.get("content-type", "")


@pytest.mark.asyncio
async def test_whatsapp_webhook_verification_invalid_token():
    """Verify Meta challenge verification rejection on invalid token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            "/api/whatsapp/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.challenge": "meta_challenge_nonce_8829",
                "hub.verify_token": "fraudulent_or_wrong_token"
            }
        )
        assert response.status_code == 403
        assert "Forbidden" in response.text


def test_whatsapp_parser_text_payload():
    """Verify Meta JSON webhook payload is accurately normalized into contract."""
    payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "WABA_10928374",
            "changes": [{
                "field": "messages",
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "15550001111",
                        "phone_number_id": "PN_99887766"
                    },
                    "contacts": [{
                        "profile": {"name": "Eleanor Vance"},
                        "wa_id": "15125559876"
                    }],
                    "messages": [{
                        "from": "15125559876",
                        "id": "wamid.HBgLMTUxMjU1NTk4NzYVAgASGB...",
                        "timestamp": "1773600000",
                        "text": {"body": "Hi, do you offer teeth whitening, and what does it cost?"},
                        "type": "text"
                    }]
                }
            }]
        }]
    }

    normalized = parse_meta_webhook(payload)
    assert len(normalized) == 1
    msg = normalized[0]
    assert msg.channel == ChannelType.WHATSAPP
    assert msg.customer.phone == "+15125559876"
    assert msg.customer.name == "Eleanor Vance"
    assert msg.customer.wa_id == "15125559876"
    assert msg.message.type == MessageContentType.TEXT
    assert msg.message.text == "Hi, do you offer teeth whitening, and what does it cost?"
    assert msg.metadata.get("phone_number_id") == "PN_99887766"
    assert msg.metadata.get("waba_id") == "WABA_10928374"


def test_whatsapp_parser_audio_voice_note():
    """Verify Meta audio voice note attachment parsing."""
    payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "WABA_10928374",
            "changes": [{
                "field": "messages",
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "15550001111",
                        "phone_number_id": "PN_99887766"
                    },
                    "contacts": [{
                        "profile": {"name": "Marcus Kane"},
                        "wa_id": "15125553344"
                    }],
                    "messages": [{
                        "from": "15125553344",
                        "id": "wamid.AUDIO12345",
                        "timestamp": "1773600100",
                        "type": "audio",
                        "audio": {
                            "id": "meta_audio_asset_7711",
                            "mime_type": "audio/ogg; codecs=opus",
                            "sha256": "abcdef1234567890"
                        }
                    }]
                }
            }]
        }]
    }

    normalized = parse_meta_webhook(payload)
    assert len(normalized) == 1
    msg = normalized[0]
    assert msg.message.type == MessageContentType.AUDIO
    assert msg.media is not None
    assert msg.media.provider_media_id == "meta_audio_asset_7711"
    assert "audio/ogg" in msg.media.mime_type
    assert msg.message.text == "[Voice Note Received]"


def test_whatsapp_parser_status_receipt_ignored():
    """Verify delivered/read status receipts are gracefully ignored without error."""
    payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "WABA_10928374",
            "changes": [{
                "field": "messages",
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "15550001111",
                        "phone_number_id": "PN_99887766"
                    },
                    "statuses": [{
                        "id": "wamid.HBgLMTUxMjU1NTk4NzYVAgASGB...",
                        "status": "delivered",
                        "timestamp": "1773600010",
                        "recipient_id": "15125559876"
                    }]
                }
            }]
        }]
    }

    normalized = parse_meta_webhook(payload)
    assert normalized == []


@pytest.mark.asyncio
async def test_whatsapp_webhook_post_e2e_conversation(async_session):
    """
    End-to-end integration test:
    Simulates inbound customer WhatsApp message to the webhook endpoint.
    Verifies that Elena answers with grounded business knowledge and creates persistent DB records.
    """
    payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "WABA_10928374",
            "changes": [{
                "field": "messages",
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "15550001111",
                        "phone_number_id": "PN_99887766"
                    },
                    "contacts": [{
                        "profile": {"name": "Clara Oswald"},
                        "wa_id": "15125558899"
                    }],
                    "messages": [{
                        "from": "15125558899",
                        "id": "wamid.TEST_CLARA_01",
                        "timestamp": "1773600500",
                        "text": {"body": "Hello, what are your opening hours on Monday?"},
                        "type": "text"
                    }]
                }
            }]
        }]
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/whatsapp/webhook", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        assert data.get("processed") == 1
        assert len(data.get("results")) == 1
        assert data["results"][0]["dispatch_status"] == "mock_sent"

    # Verify database persistence under channel="whatsapp"
    stmt = select(ReceptionistConversation).where(
        ReceptionistConversation.channel == "whatsapp",
        ReceptionistConversation.customer_contact == "+15125558899"
    )
    res = await async_session.execute(stmt)
    conv = res.scalar_one_or_none()
    assert conv is not None
    assert conv.customer_name == "Clara Oswald"

    # Verify messages in conversation
    stmt_msgs = select(ReceptionistMessage).where(
        ReceptionistMessage.conversation_id == conv.id
    ).order_by(ReceptionistMessage.created_at)
    res_msgs = await async_session.execute(stmt_msgs)
    msgs = res_msgs.scalars().all()
    assert len(msgs) == 2
    assert msgs[0].role == "user"
    assert msgs[0].content == "Hello, what are your opening hours on Monday?"
    assert msgs[1].role == "assistant"
    # Elena answers with opening hours
    assert any(term in msgs[1].content.lower() for term in ["8:00", "08:00", "5:00", "17:00", "monday", "open"])


@pytest.mark.asyncio
async def test_whatsapp_webhook_post_status_event():
    """Verify that posting a status event (delivered/read) returns 200 with 0 processed."""
    payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "WABA_10928374",
            "changes": [{
                "field": "messages",
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "15550001111",
                        "phone_number_id": "PN_99887766"
                    },
                    "statuses": [{
                        "id": "wamid.READ_123",
                        "status": "read",
                        "timestamp": "1773600600",
                        "recipient_id": "15125558899"
                    }]
                }
            }]
        }]
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/whatsapp/webhook", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        assert data.get("processed") == 0
