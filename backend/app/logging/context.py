"""
Rine Forge Systems V5 - Request Context Management
Stores request-scoped context variables accessible throughout the call chain.
"""
from contextvars import ContextVar
from typing import Optional

current_request_id: ContextVar[Optional[str]] = ContextVar("current_request_id", default=None)

def get_current_request_id() -> Optional[str]:
    """Returns the active request ID in current async context."""
    return current_request_id.get()

get_request_id = get_current_request_id

def set_current_request_id(request_id: str):
    """Sets the active request ID in current async context."""
    return current_request_id.set(request_id)
