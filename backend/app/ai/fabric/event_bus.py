"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Event Bus
Publish/subscribe event backbone for 14 internal telemetry and lifecycle events.
Provides audit tracing without cluttering core AI logic.
"""
from typing import Dict, Any, List, Callable, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from backend.app.ai.fabric.constants import FabricEvent


class EventMessage(BaseModel):
    event_type: str
    workspace_id: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ForgeEventBus:
    """Internal event bus for auditing, telemetry, and workflow hooks."""

    _subscribers: Dict[str, List[Callable[[EventMessage], None]]] = {}
    _recent_events: List[EventMessage] = []
    _max_history: int = 100

    @classmethod
    def subscribe(cls, event_type: str, handler: Callable[[EventMessage], None]):
        if event_type not in cls._subscribers:
            cls._subscribers[event_type] = []
        cls._subscribers[event_type].append(handler)

    @classmethod
    def publish(cls, event_type: str, workspace_id: str, payload: Optional[Dict[str, Any]] = None):
        msg = EventMessage(
            event_type=event_type,
            workspace_id=workspace_id,
            payload=payload or {}
        )

        cls._recent_events.append(msg)
        if len(cls._recent_events) > cls._max_history:
            cls._recent_events.pop(0)

        handlers = cls._subscribers.get(event_type, [])
        for h in handlers:
            try:
                h(msg)
            except Exception:
                pass

    @classmethod
    def get_recent_events(cls, workspace_id: Optional[str] = None, limit: int = 25) -> List[Dict[str, Any]]:
        events = cls._recent_events
        if workspace_id:
            events = [e for e in events if e.workspace_id == workspace_id]
        return [e.model_dump() for e in reversed(events[-limit:])]
