"""
Rine Forge Systems V5 - Safe AI Tool Interface
Defines the base class and validation requirements for all agent tools.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

class BaseTool(ABC):
    """
    Contract for tools callable by AI agents.
    Enforces parameter schema specification, permission validation, and execution safety.
    """
    name: str
    description: str
    parameters_schema: Dict[str, Any]
    required_permission: str = "public" # public, read_services, book_appointment, admin

    def get_tool_definition(self) -> Dict[str, Any]:
        """Returns standard function calling schema format."""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters_schema
            }
        }

    @abstractmethod
    async def execute(
        self,
        session: AsyncSession,
        business_id: str,
        arguments: Dict[str, Any],
        caller_permissions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Executes the tool logic strictly scoped to tenant business_id."""
        pass
