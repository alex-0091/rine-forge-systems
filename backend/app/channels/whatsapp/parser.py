import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from backend.app.channels.contract import (
    ChannelType,
    MessageContentType,
    CustomerIdentity,
    MediaAttachment,
    MessagePayload,
    NormalizedInboundMessage
)

logger = logging.getLogger("rine_forge_systems.whatsapp.parser")

def parse_meta_timestamp(ts_val: Any) -> datetime:
    """Converts Meta's string or integer Unix timestamp to timezone-aware UTC datetime."""
    try:
        ts_int = int(ts_val)
        return datetime.fromtimestamp(ts_int, tz=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)

def parse_meta_webhook(payload: Dict[str, Any]) -> List[NormalizedInboundMessage]:
    """
    Parses a raw Meta WhatsApp Cloud API webhook JSON payload into normalized inbound message envelopes.
    
    Handles:
    - Text messages
    - Audio voice notes
    - Image attachments
    - Document attachments
    - Status updates (delivered, read - ignored gracefully)
    - Empty or malformed payloads without crashing
    """
    normalized_messages: List[NormalizedInboundMessage] = []

    if not isinstance(payload, dict):
        return normalized_messages

    # Meta events must have object="whatsapp_business_account"
    if payload.get("object") != "whatsapp_business_account":
        logger.debug(f"Ignoring non-whatsapp webhook object: {payload.get('object')}")
        return normalized_messages

    entries = payload.get("entry", [])
    if not isinstance(entries, list):
        return normalized_messages

    for entry in entries:
        waba_id = entry.get("id")
        changes = entry.get("changes", [])

        for change in changes:
            field = change.get("field")
            if field != "messages":
                continue

            val = change.get("value", {})
            if not isinstance(val, dict):
                continue

            metadata_dict = val.get("metadata", {})
            phone_number_id = metadata_dict.get("phone_number_id")
            display_phone_number = metadata_dict.get("display_phone_number")

            # Extract contact profile map by wa_id
            contacts_map: Dict[str, str] = {}
            for contact in val.get("contacts", []):
                wa_id = contact.get("wa_id")
                profile = contact.get("profile", {})
                name = profile.get("name")
                if wa_id:
                    contacts_map[wa_id] = name

            # Inbound messages
            raw_messages = val.get("messages", [])
            for raw_msg in raw_messages:
                msg_id = raw_msg.get("id")
                from_phone = raw_msg.get("from")
                msg_type_str = raw_msg.get("type", "text")
                ts = parse_meta_timestamp(raw_msg.get("timestamp"))

                customer_name = contacts_map.get(from_phone)

                customer_identity = CustomerIdentity(
                    name=customer_name,
                    phone=f"+{from_phone}" if from_phone and not from_phone.startswith("+") else from_phone,
                    wa_id=from_phone,
                    metadata={"waba_id": waba_id, "phone_number_id": phone_number_id}
                )

                extracted_text: Optional[str] = None
                media_attachment: Optional[MediaAttachment] = None
                content_type = MessageContentType.TEXT

                if msg_type_str == "text":
                    content_type = MessageContentType.TEXT
                    text_obj = raw_msg.get("text", {})
                    extracted_text = text_obj.get("body", "").strip()

                elif msg_type_str == "audio":
                    content_type = MessageContentType.AUDIO
                    audio_obj = raw_msg.get("audio", {})
                    media_attachment = MediaAttachment(
                        type=MessageContentType.AUDIO,
                        provider_media_id=audio_obj.get("id"),
                        mime_type=audio_obj.get("mime_type", "audio/ogg"),
                        sha256=audio_obj.get("sha256")
                    )
                    extracted_text = "[Voice Note Received]"

                elif msg_type_str == "image":
                    content_type = MessageContentType.IMAGE
                    image_obj = raw_msg.get("image", {})
                    media_attachment = MediaAttachment(
                        type=MessageContentType.IMAGE,
                        provider_media_id=image_obj.get("id"),
                        mime_type=image_obj.get("mime_type", "image/jpeg"),
                        sha256=image_obj.get("sha256")
                    )
                    extracted_text = image_obj.get("caption", "[Image Attachment Received]")

                elif msg_type_str == "document":
                    content_type = MessageContentType.DOCUMENT
                    doc_obj = raw_msg.get("document", {})
                    media_attachment = MediaAttachment(
                        type=MessageContentType.DOCUMENT,
                        provider_media_id=doc_obj.get("id"),
                        mime_type=doc_obj.get("mime_type", "application/pdf"),
                        filename=doc_obj.get("filename"),
                        sha256=doc_obj.get("sha256")
                    )
                    extracted_text = doc_obj.get("caption", f"[Document: {doc_obj.get('filename', 'file')}]")

                elif msg_type_str == "interactive":
                    content_type = MessageContentType.INTERACTIVE
                    interactive_obj = raw_msg.get("interactive", {})
                    i_type = interactive_obj.get("type")
                    if i_type == "button_reply":
                        extracted_text = interactive_obj.get("button_reply", {}).get("title")
                    elif i_type == "list_reply":
                        extracted_text = interactive_obj.get("list_reply", {}).get("title")
                    else:
                        extracted_text = str(interactive_obj)

                else:
                    logger.info(f"Received unhandled message type: {msg_type_str}")
                    extracted_text = f"[{msg_type_str.capitalize()} Attachment]"

                msg_payload = MessagePayload(
                    id=msg_id or str(raw_msg.get("id")),
                    type=content_type,
                    text=extracted_text,
                    timestamp=ts,
                    raw_channel_payload=raw_msg
                )

                normalized = NormalizedInboundMessage(
                    channel=ChannelType.WHATSAPP,
                    customer=customer_identity,
                    message=msg_payload,
                    media=media_attachment,
                    metadata={
                        "waba_id": waba_id,
                        "phone_number_id": phone_number_id,
                        "display_phone_number": display_phone_number,
                        "meta_message_id": msg_id,
                        "meta_raw_type": msg_type_str
                    }
                )
                normalized_messages.append(normalized)

    return normalized_messages
