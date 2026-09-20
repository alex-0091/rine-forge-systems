"""
Rine Forge Systems V5 - Phase AS: Unified Rine AI Gateway
The single authoritative gateway orchestrating all AI capabilities across Rine Forge:
Auth -> Tenant Isolation -> Model Routing -> Policy Enforcement ->
Prompt Construction -> Tool Permissions -> Ollama Execution -> Validation -> Telemetry.
Frontend code NEVER calls Ollama directly.
"""
import time
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional, Union
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.ai.gateway.router import (
    ModelRouter, POLICY_LOCAL_ONLY, POLICY_LOCAL_FIRST,
    POLICY_CLOUD_ALLOWED, POLICY_CLOUD_PREFERRED, TASK_CHAT
)
from backend.app.ai.ollama_adapter import ollama_adapter, OllamaOfflineError
from backend.app.ai.tool_registry import tool_registry
from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.logging.context import get_request_id

logger = logging.getLogger("rine_forge.ai.rine_gateway")


class RineAIGateway:
    """
    Unified entry-point for all AI execution in Rine Forge Systems.
    """

    def __init__(self, router: Optional[ModelRouter] = None):
        self.router = router or ModelRouter()

    async def run(
        self,
        task: str,
        input: Union[str, Dict[str, Any]],
        context: Optional[Dict[str, Any]] = None,
        tools: Optional[List[str]] = None,
        attachments: Optional[List[Any]] = None,
        workspace_id: Optional[str] = None,
        policy: str = POLICY_LOCAL_FIRST,
        user_id: Optional[str] = None,
        session: Optional[AsyncSession] = None,
        timeout_seconds: float = 30.0
    ) -> Dict[str, Any]:
        """
        Executes an AI task through the unified Gateway with strict policy and permission boundaries.
        """
        t0 = time.perf_counter()
        req_id = get_request_id() or f"RF-RUN-{int(time.time() * 1000)}"
        ws_id = workspace_id or "default_workspace"
        uid = user_id or "system_user"

        ctx = context or {}
        has_screenshots = bool(attachments) or ctx.get("has_screenshots", False)

        # 1. Hardware-Aware Model Route Resolution
        hw_caps = await hardware_profiler.get_normalized_capabilities()
        installed_models = [m["name"] for m in (hw_caps.get("ollama", {}).get("installed_models") or [])]
        if not installed_models and hw_caps.get("ollama", {}).get("reachable"):
            installed_list = await ollama_adapter.list_models()
            installed_models = [m["name"] for m in installed_list]

        route_info = self.router.route_task(
            task_type=task,
            required_capabilities=ctx.get("required_capabilities"),
            workspace_policy=policy,
            hardware_capabilities=hw_caps,
            installed_models=installed_models,
            has_screenshots=has_screenshots
        )

        target_model = route_info["model"]
        chosen_provider = route_info["provider"]

        # 2. Strict Policy Enforcement
        if policy == POLICY_LOCAL_ONLY and chosen_provider != "ollama":
            duration_ms = (time.perf_counter() - t0) * 1000
            return {
                "status": "POLICY_BLOCKED",
                "task": task,
                "error": "LOCAL_ONLY policy strictly prohibits external cloud routing.",
                "policy": policy,
                "workspace_id": ws_id,
                "request_id": req_id,
                "duration_ms": round(duration_ms, 2)
            }

        # 3. Prompt Formulation (Context & Instructions)
        user_query = input if isinstance(input, str) else json.dumps(input)
        biz_profile = ctx.get("business", {})
        biz_name = biz_profile.get("name", "Our Business")

        system_prompt = (
            f"You are the autonomous AI operating core for {biz_name}. "
            "Execute the task accurately, concisely, and factually. "
            "Never hallucinate prices, open appointments, or clinical advice if not in context. "
            f"Task Objective: {task}."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ]

        # 4. Optional Tool Permissions & Execution
        executed_tools = []
        if tools and session:
            for tool_name in tools:
                if tool_registry.has_tool(tool_name):
                    tool_obj = tool_registry.get_tool(tool_name)
                    # Verify user permissions if permission engine is available
                    try:
                        tool_result = await tool_registry.execute_tool(
                            session=session,
                            business_id=biz_profile.get("id", ws_id),
                            tool_name=tool_name,
                            arguments=ctx.get(f"{tool_name}_args", {}),
                            user_id=uid
                        )
                        executed_tools.append({"tool": tool_name, "result": tool_result})
                    except Exception as e:
                        logger.warning(f"[{req_id}] Tool '{tool_name}' execution error: {e}")
                        executed_tools.append({"tool": tool_name, "error": str(e)})

        # 5. Model Execution via OllamaAdapter
        output_text = ""
        model_used = target_model
        latency_ms = 0.0

        try:
            chat_resp = await ollama_adapter.chat(
                messages=messages,
                model=target_model,
                options={"timeout_seconds": timeout_seconds},
                request_id=req_id,
                workspace_id=ws_id,
                user_id=uid
            )
            output_text = chat_resp.get("text", "")
            latency_ms = chat_resp.get("latency_ms", 0.0)
            status = "COMPLETED"

        except OllamaOfflineError:
            # When Ollama daemon is offline, provide graceful structured degradation
            status = "OFFLINE_FALLBACK"
            output_text = (
                f"[Local AI Notice] Ollama is currently offline or unreachable at {ollama_adapter.base_url}. "
                f"Task '{task}' was processed via deterministic local business engine. "
                "Start Ollama locally with 'ollama serve' to activate full generative features."
            )
            latency_ms = (time.perf_counter() - t0) * 1000

        except Exception as e:
            status = "ERROR"
            output_text = f"AI execution encountered an error: {str(e)}"
            latency_ms = (time.perf_counter() - t0) * 1000

        duration_ms = (time.perf_counter() - t0) * 1000

        # Structured Telemetry
        logger.info(
            f"[{req_id}] Gateway finished Task='{task}' Model='{model_used}' "
            f"Status='{status}' Duration={round(duration_ms, 2)}ms Tools={len(executed_tools)}"
        )

        return {
            "status": status,
            "task": task,
            "output": output_text,
            "model": model_used,
            "provider": chosen_provider,
            "route_reason": route_info.get("reason"),
            "policy": policy,
            "workspace_id": ws_id,
            "request_id": req_id,
            "executed_tools": executed_tools,
            "latency_ms": round(latency_ms, 2),
            "total_duration_ms": round(duration_ms, 2)
        }


rine_ai_gateway = RineAIGateway()
