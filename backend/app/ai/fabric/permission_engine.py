"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Tool Permission Engine
Evaluates caller identity, workspace boundaries, agent scopes, policies,
and human confirmation gates before EVERY tool execution.
Returns ALLOW, DENY, or REQUIRES_APPROVAL.
"""
from typing import Dict, Any, List, Optional, Tuple
from enum import Enum
import logging

from backend.app.ai.fabric.tool_registry import ForgeToolRegistry
from backend.app.ai.fabric.agent_registry import AgentRegistry
from backend.app.ai.fabric.constants import RiskLevel

logger = logging.getLogger("rine_forge.fabric.permission_engine")


class PermissionDecision(str, Enum):
    ALLOW = "ALLOW"
    DENY = "DENY"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"


class ToolPermissionEngine:
    """Rigorous gatekeeper enforcing zero-trust execution on all model tool requests."""

    # Explicit actions that always require human approval by default
    APPROVAL_REQUIRED_TOOLS = {
        "sendWhatsApp",
        "sendEmail",
        "sendSMS",
        "updateCRM"
    }

    @classmethod
    def evaluate(
        cls,
        tool_name: str,
        agent_name: str,
        workspace_id: str,
        user_id: Optional[str] = "operator",
        user_permissions: Optional[List[str]] = None,
        policy: str = "LOCAL_FIRST",
        bypass_approval_with_flag: bool = False
    ) -> Dict[str, Any]:
        """
        Evaluates tool execution feasibility and safety.
        Returns structured decision: ALLOW, DENY, or REQUIRES_APPROVAL with diagnostic reasons.
        """
        user_perms = set(user_permissions or ["read", "write", "generate"])

        # 1. Check Tool Registration
        tool = ForgeToolRegistry.get(tool_name)
        if not tool:
            return {
                "decision": PermissionDecision.DENY.value,
                "reason": f"Tool '{tool_name}' is not registered in ForgeToolRegistry.",
                "tool_name": tool_name
            }

        # 2. Check Workspace Requirement
        if tool.requires_workspace and not workspace_id:
            return {
                "decision": PermissionDecision.DENY.value,
                "reason": f"Tool '{tool_name}' requires an active workspace_id tenant context.",
                "tool_name": tool_name
            }

        # 3. Check Agent Scope
        agent = AgentRegistry.get(agent_name)
        if agent and tool_name not in agent.allowed_tools:
            return {
                "decision": PermissionDecision.DENY.value,
                "reason": f"Agent '{agent_name}' is not permitted to execute tool '{tool_name}'. Allowed: {agent.allowed_tools}",
                "tool_name": tool_name
            }

        # 4. Check User Permission
        # Tools declare e.g. "communications.send_whatsapp"
        base_perm = tool.permission.split(".")[0]
        if base_perm not in user_perms and "admin" not in user_perms and "write" not in user_perms:
            return {
                "decision": PermissionDecision.DENY.value,
                "reason": f"User '{user_id}' lacks permission '{tool.permission}' required for tool '{tool_name}'.",
                "tool_name": tool_name
            }

        # 5. Check Consequential Side Effects & Human Approval Requirement
        if tool_name in cls.APPROVAL_REQUIRED_TOOLS:
            if not bypass_approval_with_flag:
                logger.info(f"[PermissionEngine] Tool '{tool_name}' intercepted: requires human operator confirmation.")
                return {
                    "decision": PermissionDecision.REQUIRES_APPROVAL.value,
                    "reason": f"Consequential tool '{tool_name}' has external side effects and requires explicit human approval.",
                    "tool_name": tool_name,
                    "risk_level": tool.risk_level
                }

        # 6. Policy Check
        if policy == "LOCAL_ONLY" and tool_name in ["searchWeb", "fetchWebsite"]:
            # Local-only policy prohibits external network probes
            return {
                "decision": PermissionDecision.DENY.value,
                "reason": f"Tool '{tool_name}' requires external network egress which is prohibited under LOCAL_ONLY policy.",
                "tool_name": tool_name
            }

        # Passed all checks
        return {
            "decision": PermissionDecision.ALLOW.value,
            "reason": f"Execution of tool '{tool_name}' authorized for agent '{agent_name}'.",
            "tool_name": tool_name,
            "risk_level": tool.risk_level
        }
