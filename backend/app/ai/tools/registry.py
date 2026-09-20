"""
Rine Forge Systems V5 - Safe AI Tool Registry
Whitelists authorized tools, enforces tenant boundaries, guarantees timeouts,
and validates caller permissions before execution.
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.ai.tools.base import BaseTool
from backend.app.errors.exceptions import ForbiddenError, NotFoundError, AppException
from backend.app.models.v5 import Business, Service

logger = logging.getLogger("rine_forge_systems.ai.tools")

# --- Built-In Safe Tools ---

class GetBusinessHoursTool(BaseTool):
    name = "get_business_hours"
    description = "Retrieve the operating hours and open schedule for the business."
    parameters_schema = {
        "type": "object",
        "properties": {},
        "required": []
    }
    required_permission = "public"

    async def execute(
        self,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        stmt = select(Business).where(Business.id == business_id)
        res = await session.execute(stmt)
        biz = res.scalar_one_or_none()
        if not biz:
            return {"status": "error", "message": "Business tenant not found"}
        return {
            "status": "success",
            "business_name": biz.name,
            "business_hours": biz.business_hours or {
                "monday": "08:30 - 17:30",
                "tuesday": "08:30 - 17:30",
                "wednesday": "08:30 - 17:30",
                "thursday": "08:30 - 17:30",
                "friday": "08:30 - 17:30",
                "saturday": "Closed",
                "sunday": "Closed"
            },
            "timezone": biz.timezone or "America/Chicago"
        }

class GetServicesTool(BaseTool):
    name = "get_services"
    description = "List available verified services, descriptions, durations, and pricing."
    parameters_schema = {
        "type": "object",
        "properties": {
            "service_category": {
                "type": "string",
                "description": "Optional category filter"
            }
        },
        "required": []
    }
    required_permission = "public"

    async def execute(
        self,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        stmt = select(Service).where(Service.business_id == business_id, Service.active == True)
        res = await session.execute(stmt)
        services = res.scalars().all()
        return {
            "status": "success",
            "services": [
                {
                    "id": s.id,
                    "name": s.name,
                    "description": s.description,
                    "price": s.price,
                    "duration_minutes": s.duration,
                    "currency": s.currency
                }
                for s in services
            ]
        }

class GetCurrentTimeTool(BaseTool):
    name = "get_current_time"
    description = "Get current date, time, and day of week in the business's timezone."
    parameters_schema = {
        "type": "object",
        "properties": {},
        "required": []
    }
    required_permission = "public"

    async def execute(
        self,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        return {
            "status": "success",
            "current_utc": now.isoformat(),
            "day_of_week": now.strftime("%A"),
            "formatted_date": now.strftime("%Y-%m-%d")
        }

class RequestHumanHandoffTool(BaseTool):
    name = "request_human_handoff"
    description = "Escalate this conversation to human staff when user requests human or inquiry is outside scope."
    parameters_schema = {
        "type": "object",
        "properties": {
            "reason": {
                "type": "string",
                "description": "Reason for human escalation"
            },
            "urgency": {
                "type": "string",
                "enum": ["low", "medium", "high"],
                "description": "Escalation urgency level"
            }
        },
        "required": ["reason"]
    }
    required_permission = "public"

    async def execute(
        self,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        reason = arguments.get("reason", "Customer requested human representative")
        urgency = arguments.get("urgency", "medium")
        logger.info(f"[Handoff] Business #{business_id} -> Reason: {reason} (Urgency: {urgency})")
        return {
            "status": "escalated",
            "requires_human": True,
            "escalation_reason": reason,
            "urgency": urgency,
            "message": "The conversation has been flagged for immediate human team follow-up."
        }

# --- Safe Tool Registry ---

class SafeToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self._register_defaults()

    def _register_defaults(self):
        self.register(GetBusinessHoursTool())
        self.register(GetServicesTool())
        self.register(GetCurrentTimeTool())
        self.register(RequestHumanHandoffTool())

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def list_tools_schema(self, allowed_tool_names: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """Returns schemas for function calling, filtered by allowed tool names if specified."""
        schemas = []
        for name, tool in self._tools.items():
            if allowed_tool_names is None or name in allowed_tool_names:
                schemas.append(tool.get_tool_definition())
        return schemas

    async def execute_tool(
        self,
        name: str,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None,
        timeout_seconds: float = 5.0
    ) -> Dict[str, Any]:
        """
        Safely executes a whitelisted tool with bounded timeout and permissions enforcement.
        Arbitrary code/shell executions are strictly rejected by design.
        """
        tool = self.get_tool(name)
        if not tool:
            logger.warning(f"AI attempted to call unapproved or unknown tool: '{name}'")
            return {
                "status": "error",
                "error_code": "TOOL_NOT_FOUND",
                "message": f"Tool '{name}' is not authorized or does not exist."
            }

        # Permission check
        if tool.required_permission != "public":
            perms = caller_permissions or []
            if tool.required_permission not in perms and "admin" not in perms:
                logger.warning(f"Permission denied executing tool '{name}': required {tool.required_permission}")
                return {
                    "status": "error",
                    "error_code": "FORBIDDEN_TOOL",
                    "message": f"Execution of tool '{name}' requires permission '{tool.required_permission}'."
                }

        try:
            return await asyncio.wait_for(
                tool.execute(session, business_id, arguments, caller_permissions),
                timeout=timeout_seconds
            )
        except asyncio.TimeoutError:
            logger.error(f"Tool '{name}' timed out after {timeout_seconds}s")
            return {
                "status": "error",
                "error_code": "TOOL_TIMEOUT",
                "message": f"Tool '{name}' exceeded maximum execution timeout."
            }
        except Exception as e:
            logger.error(f"Error executing tool '{name}': {e}")
            return {
                "status": "error",
                "error_code": "TOOL_EXECUTION_ERROR",
                "message": str(e)
            }

# Global Safe Tool Registry Singleton
safe_tool_registry = SafeToolRegistry()
