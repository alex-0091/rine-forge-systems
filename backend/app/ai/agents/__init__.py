"""
Rine Forge Systems V5 - Generic Agent Module
"""
from .config import AgentConfig, DEFAULT_AGENTS, get_agent_config
from .runtime import AgentRuntime, agent_runtime

__all__ = [
    "AgentConfig",
    "DEFAULT_AGENTS",
    "get_agent_config",
    "AgentRuntime",
    "agent_runtime"
]
