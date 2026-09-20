"""
Rine Forge Systems V5 - Phase AR: Three-Layer Cognitive Memory Architecture
Strictly segregates and manages:
1. Session Memory: Ephemeral turn-by-turn context for active interactions.
2. Conversation Memory: Threaded interaction history, Progressive Intent, and customer preferences.
3. Business Memory: Tenant-isolated core operational facts, hours, catalog rules, and constraints.
Guarantees absolute tenant isolation: data is never mixed across workspaces.
"""
import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger("rine_forge.ai.memory")


class SessionMemory:
    """
    Short-lived in-memory cache for an active turn or session.
    Example: 'Customer is currently choosing between Tuesday and Wednesday.'
    """
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}

    def set(self, session_key: str, key: str, value: Any, ttl_seconds: int = 1800):
        if session_key not in self._store:
            self._store[session_key] = {"data": {}, "expires_at": time.time() + ttl_seconds}
        self._store[session_key]["data"][key] = value
        self._store[session_key]["expires_at"] = time.time() + ttl_seconds

    def get(self, session_key: str, key: str, default: Any = None) -> Any:
        entry = self._store.get(session_key)
        if not entry or time.time() > entry["expires_at"]:
            return default
        return entry["data"].get(key, default)

    def clear(self, session_key: str):
        self._store.pop(session_key, None)


class ConversationMemory:
    """
    Threaded conversational context tracking progressive customer intent,
    collected entities, and historical dialogue turns.
    Example: 'Customer prefers afternoon slots; primary service is Dental Implants.'
    """
    def __init__(self):
        self._threads: Dict[str, Dict[str, Any]] = {}

    def record_turn(self, conversation_id: str, role: str, message: str, intent: Optional[str] = None):
        if conversation_id not in self._threads:
            self._threads[conversation_id] = {
                "turns": [],
                "extracted_entities": {},
                "last_intent": None,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        thread = self._threads[conversation_id]
        thread["turns"].append({
            "role": role,
            "message": message,
            "intent": intent,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        if intent:
            thread["last_intent"] = intent
        thread["updated_at"] = datetime.now(timezone.utc).isoformat()

    def set_entity(self, conversation_id: str, entity_key: str, entity_value: Any):
        if conversation_id not in self._threads:
            self.record_turn(conversation_id, "system", "Init conversation context")
        self._threads[conversation_id]["extracted_entities"][entity_key] = entity_value

    def get_context(self, conversation_id: str) -> Dict[str, Any]:
        return self._threads.get(conversation_id, {"turns": [], "extracted_entities": {}, "last_intent": None})


class BusinessMemory:
    """
    Tenant-isolated operational memory storing business rules, operating hours,
    pricing boundaries, and strategic preferences.
    Guarantees that no customer or operational data crosses workspace boundaries.
    Example: 'Clinic opens Mon-Fri 9-17; emergency surcharge is $50.'
    """
    def __init__(self):
        self._workspaces: Dict[str, Dict[str, Any]] = {}

    def set_rule(self, workspace_id: str, rule_key: str, rule_value: Any):
        if workspace_id not in self._workspaces:
            self._workspaces[workspace_id] = {"rules": {}, "operating_facts": {}}
        self._workspaces[workspace_id]["rules"][rule_key] = rule_value

    def set_fact(self, workspace_id: str, fact_key: str, fact_value: Any):
        if workspace_id not in self._workspaces:
            self._workspaces[workspace_id] = {"rules": {}, "operating_facts": {}}
        self._workspaces[workspace_id]["operating_facts"][fact_key] = fact_value

    def get_business_context(self, workspace_id: str) -> Dict[str, Any]:
        return self._workspaces.get(workspace_id, {"rules": {}, "operating_facts": {}})


class MemoryManager:
    """
    Unified manager orchestrating Session, Conversation, and Business memory.
    """
    def __init__(self):
        self.session = SessionMemory()
        self.conversation = ConversationMemory()
        self.business = BusinessMemory()

    def get_scoped_prompt_context(
        self,
        workspace_id: str,
        conversation_id: Optional[str] = None,
        session_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves relevant contextual layers without prompt bloat.
        """
        biz_data = self.business.get_business_context(workspace_id)
        conv_data = self.conversation.get_context(conversation_id) if conversation_id else {}
        sess_data = self.session.get(session_key, "active_task") if session_key else None

        return {
            "business_rules": biz_data.get("rules", {}),
            "business_facts": biz_data.get("operating_facts", {}),
            "conversation_entities": conv_data.get("extracted_entities", {}),
            "last_customer_intent": conv_data.get("last_intent"),
            "active_session_task": sess_data
        }


memory_manager = MemoryManager()
