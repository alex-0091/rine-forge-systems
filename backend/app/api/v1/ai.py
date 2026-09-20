"""
Rine Forge Systems V5 - AI Core Master Router
Endpoints for non-streaming chat, real Server-Sent Events (SSE) streaming,
deep provider health checks, and dynamic agent configurations.
"""
import json
import time
import asyncio
import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.ai.gateway.core import ai_gateway
from backend.app.ai.agents.config import DEFAULT_AGENTS, get_agent_config
from backend.app.ai.agents.runtime import agent_runtime
from backend.app.ai.gateway.interface import ChatMessage, AIOptions
from backend.app.logging.context import get_request_id

logger = logging.getLogger("rine_forge_systems.api.ai")

router = APIRouter(prefix="/ai", tags=["V5 AI Core"])

class AIChatRequest(BaseModel):
    message: str
    agent_id: str = "receptionist"
    business_id: Optional[str] = None
    conversation_id: Optional[str] = None
    customer_id: Optional[str] = None
    channel: str = "website"
    metadata: Optional[Dict[str, Any]] = None

@router.get("/status")
async def get_ai_status():
    """
    Truthful diagnostic health status of all registered AI providers (OpenAI, Gemini, Ollama, Mock).
    Explicitly distinguishes between CONFIGURED, AVAILABLE, NOT_CONFIGURED, and UNAVAILABLE states.
    """
    return await ai_gateway.get_health_status()

@router.get("/agents")
async def list_available_agents():
    """Returns available AI agent blueprints (Elena, Marcus, Aria, Kael)."""
    return [
        {
            "agent_id": a.agent_id,
            "name": a.name,
            "role": a.role,
            "persona": a.persona,
            "allowed_tools": a.allowed_tools,
            "model_tier": a.model_tier,
            "greeting": a.greeting
        }
        for a in DEFAULT_AGENTS.values()
    ]

@router.post("/chat")
async def chat_turn(
    payload: AIChatRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Standard synchronous chat turn executed through the Centralized AI Gateway and Agent Runtime.
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    biz_id = payload.business_id or "00000000-0000-0000-0000-000000000001"

    try:
        result = await agent_runtime.execute_turn(
            session=session,
            business_id=biz_id,
            user_message=payload.message,
            agent_id=payload.agent_id,
            conversation_id=payload.conversation_id,
            customer_id=payload.customer_id,
            channel=payload.channel,
            metadata=payload.metadata
        )
        return result
    except Exception as e:
        logger.error(f"Error in chat turn: {e}", exc_info=True)
        raise

@router.post("/chat/stream")
async def chat_stream(
    request: Request,
    payload: AIChatRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Production Server-Sent Events (SSE) streaming endpoint.
    Emits real-time token events and handles client disconnects gracefully.
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    biz_id = payload.business_id or "00000000-0000-0000-0000-000000000001"
    agent_cfg = get_agent_config(payload.agent_id)
    t0 = time.time()
    req_id = get_request_id() or "RF-SSE"

    async def sse_event_generator():
        try:
            # Prepare conversation and context
            conv = await agent_runtime.conv_service.get_or_create_conversation(
                session=session,
                business_id=biz_id,
                conversation_id=payload.conversation_id,
                customer_id=payload.customer_id,
                channel=payload.channel
            )
            await agent_runtime.conv_service.add_message(
                session=session,
                conversation_id=conv.id,
                role="user",
                content=payload.message,
                metadata=payload.metadata
            )

            history = await agent_runtime.conv_service.get_recent_chat_messages(
                session=session,
                conversation_id=conv.id,
                limit=10
            )
            if history and history[-1].role == "user" and history[-1].content == payload.message:
                history = history[:-1]

            business_facts = await agent_runtime._get_business_facts(session, biz_id)
            messages = agent_runtime.builder.build_context(
                system_prompt=agent_cfg.system_prompt,
                business_context=business_facts,
                history=history,
                latest_user_input=payload.message,
                max_context_tokens=agent_cfg.max_tokens * 4
            )

            opts = AIOptions(
                tier=agent_cfg.model_tier,
                temperature=agent_cfg.temperature,
                max_tokens=agent_cfg.max_tokens
            )

            accumulated_text = []

            # Stream from AI Gateway
            async for chunk in ai_gateway.generate_stream(messages, opts):
                if await request.is_disconnected():
                    logger.info(f"[{req_id}] Client disconnected from SSE stream.")
                    break

                if chunk.text:
                    accumulated_text.append(chunk.text)
                    data_str = json.dumps({"text": chunk.text, "conversation_id": conv.id})
                    yield f"event: token\ndata: {data_str}\n\n"

                if chunk.is_final:
                    total_latency = int((time.time() - t0) * 1000)
                    final_full_text = "".join(accumulated_text)

                    # Persist assistant turn
                    await agent_runtime.conv_service.add_message(
                        session=session,
                        conversation_id=conv.id,
                        role="assistant",
                        content=final_full_text,
                        tokens=chunk.usage.total_tokens if chunk.usage else None,
                        metadata={"latency_ms": total_latency, "streamed": True}
                    )
                    await session.commit()

                    done_data = json.dumps({
                        "text": "",
                        "finish_reason": chunk.finish_reason or "stop",
                        "conversation_id": conv.id,
                        "latency_ms": total_latency,
                        "usage": chunk.usage.model_dump() if chunk.usage else None
                    })
                    yield f"event: done\ndata: {done_data}\n\n"

        except asyncio.CancelledError:
            logger.info(f"[{req_id}] SSE stream cancelled by client.")
        except Exception as e:
            logger.error(f"[{req_id}] SSE stream error: {e}")
            err_data = json.dumps({"error": str(e), "code": "AI_STREAM_ERROR"})
            yield f"event: error\ndata: {err_data}\n\n"

    return StreamingResponse(
        sse_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
