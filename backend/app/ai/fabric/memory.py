"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Project Memory
Maintains contextual memory across sessions and tasks.
Distinguishes epistemological certainty: USER_PROVIDED, AI_GENERATED, AI_INFERRED, VERIFIED, APPROVED.
Never treats an AI inference as an approved business fact.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from backend.app.ai.fabric.constants import FactProvenance


class MemoryItem(BaseModel):
    key: str
    value: Any
    provenance: str = FactProvenance.AI_INFERRED.value
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ForgeProjectMemory:
    """Epistemologically strict project memory store for workspace state."""

    _store: Dict[str, Dict[str, MemoryItem]] = {}  # workspace_id -> {key: MemoryItem}
    _approved_facts: Dict[str, List[str]] = {}
    _rejected_ideas: Dict[str, List[str]] = {}

    @classmethod
    def set(
        cls,
        workspace_id: str,
        key: str,
        value: Any,
        provenance: str = FactProvenance.AI_INFERRED.value
    ):
        if workspace_id not in cls._store:
            cls._store[workspace_id] = {}

        cls._store[workspace_id][key] = MemoryItem(
            key=key,
            value=value,
            provenance=provenance,
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat()
        )

    @classmethod
    def get(cls, workspace_id: str, key: str) -> Optional[Any]:
        item = cls._store.get(workspace_id, {}).get(key)
        return item.value if item else None

    @classmethod
    def get_with_provenance(cls, workspace_id: str, key: str) -> Optional[MemoryItem]:
        return cls._store.get(workspace_id, {}).get(key)

    @classmethod
    def get_all_context(cls, workspace_id: str) -> Dict[str, Any]:
        """Returns normalized context dictionary separating authoritative facts from inferences."""
        items = cls._store.get(workspace_id, {})
        facts: Dict[str, Any] = {}
        inferences: Dict[str, Any] = {}

        for k, item in items.items():
            if item.provenance in [FactProvenance.USER_PROVIDED.value, FactProvenance.VERIFIED.value, FactProvenance.APPROVED.value]:
                facts[k] = item.value
            else:
                inferences[k] = item.value

        return {
            "authoritative_facts": facts,
            "inferences": inferences,
            "approved_facts": cls._approved_facts.get(workspace_id, []),
            "rejected_ideas": cls._rejected_ideas.get(workspace_id, [])
        }

    @classmethod
    def approve_fact(cls, workspace_id: str, fact: str):
        """Operator explicitly marks a fact as verified/approved."""
        if workspace_id not in cls._approved_facts:
            cls._approved_facts[workspace_id] = []
        if fact not in cls._approved_facts[workspace_id]:
            cls._approved_facts[workspace_id].append(fact)

    @classmethod
    def reject_idea(cls, workspace_id: str, idea: str):
        """Operator records a rejected idea to avoid re-proposing."""
        if workspace_id not in cls._rejected_ideas:
            cls._rejected_ideas[workspace_id] = []
        if idea not in cls._rejected_ideas[workspace_id]:
            cls._rejected_ideas[workspace_id].append(idea)
