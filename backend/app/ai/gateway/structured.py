"""
Rine Forge Systems V5 - Structured Output Engine
Enforces schema validation with Pydantic, automated clean up of markdown backticks,
and one-shot reprompt correction on invalid schemas. No fake confidence metrics.
"""
import json
import logging
from typing import Type, TypeVar, List, Optional
from pydantic import BaseModel, ValidationError

from backend.app.ai.gateway.interface import ChatMessage, AIOptions
from backend.app.ai.gateway.core import AIGateway
from backend.app.ai.gateway.errors import AIInvalidPromptError

logger = logging.getLogger("rine_forge_systems.ai.gateway.structured")

T = TypeVar("T", bound=BaseModel)

def _clean_json_markdown(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()

async def generate_structured(
    gateway: AIGateway,
    schema: Type[T],
    messages: List[ChatMessage],
    options: Optional[AIOptions] = None,
    system_instructions: Optional[str] = None
) -> T:
    """
    Executes inference requesting valid JSON conforming to the provided Pydantic schema.
    If the response fails schema validation, performs a single correction turn before erroring.
    """
    opts = (options or AIOptions()).model_copy(update={"response_format": "json_object"})

    schema_json = json.dumps(schema.model_json_schema(), indent=2)
    schema_directive = (
        f"\n\nYou MUST format your entire response as a valid JSON object strictly matching this schema:\n"
        f"{schema_json}\n"
        f"Do not include comments, extra keys, or markdown formatting around the JSON."
    )

    call_messages = list(messages)
    # Inject schema directive into the system message or create one
    system_msg_idx = next((i for i, m in enumerate(call_messages) if m.role == "system"), None)
    if system_msg_idx is not None:
        call_messages[system_msg_idx] = ChatMessage(
            role="system",
            content=call_messages[system_msg_idx].content + schema_directive
        )
    else:
        call_messages.insert(0, ChatMessage(
            role="system",
            content=(system_instructions or "You are a reliable structured data processor.") + schema_directive
        ))

    # Turn 1: Primary generation
    res = await gateway.generate(call_messages, opts)
    cleaned = _clean_json_markdown(res.text)

    try:
        parsed_data = json.loads(cleaned)
        return schema.model_validate(parsed_data)
    except (json.JSONDecodeError, ValidationError) as parse_err:
        logger.warning(f"Initial structured output parsing failed: {parse_err}. Attempting 1-turn repair...")

    # Turn 2: Automatic reprompt / self-correction turn
    repair_prompt = (
        f"Your previous output failed JSON/schema validation with this error:\n"
        f"{str(parse_err)}\n\n"
        f"Original raw output was:\n{res.text}\n\n"
        f"Please correct the output and respond strictly with valid JSON conforming to the schema."
    )
    repair_messages = list(call_messages)
    repair_messages.append(ChatMessage(role="assistant", content=res.text))
    repair_messages.append(ChatMessage(role="user", content=repair_prompt))

    res_retry = await gateway.generate(repair_messages, opts)
    cleaned_retry = _clean_json_markdown(res_retry.text)

    try:
        parsed_retry = json.loads(cleaned_retry)
        return schema.model_validate(parsed_retry)
    except Exception as final_err:
        logger.error(f"Structured output self-correction also failed: {final_err}. Output was: {res_retry.text}")
        raise AIInvalidPromptError(
            message=f"Model response failed Pydantic schema validation: {final_err}",
            technical_error=str(final_err)
        )
