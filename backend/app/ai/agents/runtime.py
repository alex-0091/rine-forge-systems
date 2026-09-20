"""
Rine Forge Systems V5 - Generic Agent Runtime
Executes agent conversational turns, orchestrates tool dispatching,
enforces safety guardrails, and records end-to-end telemetry.
"""
import time
import json
import logging
from typing import Dict, Any, Optional, List, AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.v5 import Business, Service
from backend.app.ai.agents.config import AgentConfig, get_agent_config
from backend.app.ai.gateway.core import AIGateway, ai_gateway
from backend.app.ai.gateway.interface import AIOptions, ChatMessage, AIStreamChunk
from backend.app.ai.conversation.context_builder import ContextBuilder, context_builder
from backend.app.ai.conversation.service import ConversationService, conversation_service
from backend.app.ai.tools.registry import SafeToolRegistry, safe_tool_registry

logger = logging.getLogger("rine_forge_systems.ai.agents.runtime")

class AgentRuntime:
    def __init__(
        self,
        gateway: Optional[AIGateway] = None,
        tools: Optional[SafeToolRegistry] = None,
        conv_service: Optional[ConversationService] = None,
        builder: Optional[ContextBuilder] = None
    ):
        self.gateway = gateway or ai_gateway
        self.tools = tools or safe_tool_registry
        self.conv_service = conv_service or conversation_service
        self.builder = builder or context_builder

    async def _get_business_facts(self, session: AsyncSession, business_id: str) -> str:
        """Loads verified business facts for context grounding."""
        stmt = select(Business).where(Business.id == business_id)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if not biz:
            return "Business: Rine Forge Systems Demo Clinic."

        lines = [
            f"Business Name: {biz.name}",
            f"Industry: {biz.industry or 'Healthcare / Professional Services'}",
            f"Address: {biz.address or 'Austin, TX'}",
            f"Phone: {biz.phone or '+1 (512) 555-0199'}",
            f"Timezone: {biz.timezone or 'America/Chicago'}"
        ]
        if biz.business_hours:
            lines.append(f"Operating Hours: {json.dumps(biz.business_hours)}")

        # Fetch active services
        svc_stmt = select(Service).where(Service.business_id == business_id, Service.active == True)
        svc_res = await session.execute(svc_stmt)
        services = svc_res.scalars().all()
        if services:
            lines.append("Verified Services & Pricing:")
            for s in services:
                lines.append(f"- {s.name}: ${s.price} ({s.duration} min) - {s.description}")

        return "\n".join(lines)

    async def execute_turn(
        self,
        session: AsyncSession,
        business_id: str,
        user_message: str,
        agent_id: str = "receptionist",
        conversation_id: Optional[str] = None,
        customer_id: Optional[str] = None,
        channel: str = "website",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes a complete conversational turn:
        1. Resolves agent configuration
        2. Persists conversation and user message
        3. Builds grounded context within token budget
        4. Calls AI Gateway with allowed tools
        5. Executes authorized tools if requested by model
        6. Persists assistant reply and telemetry
        """
        t0 = time.time()
        agent_cfg = get_agent_config(agent_id)

        # 1. Database session & user message
        conv = await self.conv_service.get_or_create_conversation(
            session=session,
            business_id=business_id,
            conversation_id=conversation_id,
            customer_id=customer_id,
            channel=channel
        )
        await self.conv_service.add_message(
            session=session,
            conversation_id=conv.id,
            role="user",
            content=user_message,
            metadata=metadata
        )

        # 2. Retrieve history and verified business context
        history = await self.conv_service.get_recent_chat_messages(
            session=session,
            conversation_id=conv.id,
            limit=10
        )
        # Exclude the message we just added from history since ContextBuilder adds latest_user_input
        if history and history[-1].role == "user" and history[-1].content == user_message:
            history = history[:-1]

        business_facts = await self._get_business_facts(session, business_id)
        messages = self.builder.build_context(
            system_prompt=agent_cfg.system_prompt,
            business_context=business_facts,
            history=history,
            latest_user_input=user_message,
            max_context_tokens=agent_cfg.max_tokens * 4
        )

        # 3. Tool schemas for this agent
        allowed_tool_schemas = self.tools.list_tools_schema(agent_cfg.allowed_tools)

        opts = AIOptions(
            tier=agent_cfg.model_tier,
            temperature=agent_cfg.temperature,
            max_tokens=agent_cfg.max_tokens,
            tools=allowed_tool_schemas if allowed_tool_schemas else None
        )

        # 4. First Generation Turn
        response = await self.gateway.generate(messages, opts)

        executed_tool_name = None
        tool_result = None
        requires_human = False
        final_reply = response.text

        # 5. Handle Tool Calls
        if response.tool_calls:
            first_tool = response.tool_calls[0]
            func = first_tool.get("function", {})
            executed_tool_name = func.get("name")
            try:
                args = json.loads(func.get("arguments", "{}"))
            except Exception:
                args = {}

            tool_result = await self.tools.execute_tool(
                name=executed_tool_name,
                session=session,
                business_id=business_id,
                arguments=args
            )

            if tool_result.get("requires_human"):
                requires_human = True
                await self.conv_service.mark_human_handoff(
                    session=session,
                    conversation_id=conv.id,
                    reason=tool_result.get("escalation_reason")
                )

            # Follow-up synthesis turn with tool output
            messages.append(ChatMessage(role="assistant", content=response.text or f"Executing {executed_tool_name}..."))
            messages.append(ChatMessage(role="system", content=f"[TOOL RESULT for {executed_tool_name}]: {json.dumps(tool_result)}"))

            synthesis_opts = opts.model_copy(update={"tools": None})
            synth_res = await self.gateway.generate(messages, synthesis_opts)
            final_reply = synth_res.text
            response = synth_res

        total_latency = int((time.time() - t0) * 1000)

        # 6. Persist Assistant Turn
        await self.conv_service.add_message(
            session=session,
            conversation_id=conv.id,
            role="assistant",
            content=final_reply,
            model=response.model,
            tokens=response.usage.total_tokens,
            metadata={
                "provider": response.provider,
                "latency_ms": total_latency,
                "tool_executed": executed_tool_name,
                "agent_id": agent_cfg.agent_id
            }
        )
        await session.commit()

        return {
            "conversation_id": conv.id,
            "reply": final_reply,
            "agent_id": agent_cfg.agent_id,
            "agent_name": agent_cfg.name,
            "provider": response.provider,
            "model": response.model,
            "latency_ms": total_latency,
            "usage": response.usage.model_dump(),
            "action": executed_tool_name,
            "action_details": tool_result,
            "requires_human": requires_human
        }

# Global Agent Runtime Singleton
agent_runtime = AgentRuntime()
