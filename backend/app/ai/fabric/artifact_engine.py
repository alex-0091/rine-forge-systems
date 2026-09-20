"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Artifact Engine
Manages 16 canonical deliverable artifact types with multi-tenant isolation,
versioning, provenance tracking, and export capabilities.
"""
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from backend.app.ai.fabric.constants import ArtifactType


class FabricArtifact(BaseModel):
    id: str
    workspace_id: str
    owner_id: str = "operator"
    name: str
    artifact_type: str
    type: str = ""
    version: int = 1
    status: str = "READY"  # DRAFT, READY, ARCHIVED, ERROR
    provenance: Dict[str, Any] = Field(default_factory=dict)
    data: Dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def __getitem__(self, item: str) -> Any:
        if item == "type":
            return self.type or self.artifact_type
        return getattr(self, item)

    def get(self, item: str, default: Any = None) -> Any:
        if item == "type":
            return self.type or self.artifact_type
        return getattr(self, item, default)


class ArtifactEngine:
    """In-memory and persistent manager for multi-tenant workspace artifacts."""

    _store: Dict[str, Dict[str, FabricArtifact]] = {}  # workspace_id -> {artifact_id: artifact}

    @classmethod
    def create_artifact(
        cls,
        workspace_id: str,
        name: str,
        artifact_type: str,
        data: Dict[str, Any],
        model_metadata: Optional[Dict[str, Any]] = None,
        owner_id: str = "operator"
    ) -> FabricArtifact:
        if artifact_type not in [a.value for a in ArtifactType]:
            artifact_type = ArtifactType.REPORT.value

        art_id = f"art-{uuid.uuid4().hex[:10]}"
        provenance = {
            "model": (model_metadata or {}).get("model", "local"),
            "provider": (model_metadata or {}).get("provider", "ollama"),
            "is_local": (model_metadata or {}).get("is_local", True),
            "generated_at": datetime.now(timezone.utc).isoformat()
        }

        artifact = FabricArtifact(
            id=art_id,
            workspace_id=workspace_id,
            owner_id=owner_id,
            name=name,
            artifact_type=artifact_type,
            type=artifact_type,
            version=1,
            status="READY",
            provenance=provenance,
            data=data
        )

        if workspace_id not in cls._store:
            cls._store[workspace_id] = {}
        cls._store[workspace_id][art_id] = artifact

        return artifact

    @classmethod
    def update_artifact(
        cls,
        workspace_id: str,
        artifact_id: str,
        data: Dict[str, Any]
    ) -> Optional[FabricArtifact]:
        ws = cls._store.get(workspace_id, {})
        artifact = ws.get(artifact_id)
        if not artifact:
            return None

        artifact.version += 1
        artifact.data.update(data)
        artifact.updated_at = datetime.now(timezone.utc).isoformat()
        return artifact

    @classmethod
    def get_artifact(cls, workspace_id: str, artifact_id: str) -> Optional[FabricArtifact]:
        return cls._store.get(workspace_id, {}) .get(artifact_id)

    @classmethod
    def list_artifacts(cls, workspace_id: str) -> List[FabricArtifact]:
        return list(cls._store.get(workspace_id, {}).values())

    @classmethod
    def export_artifact(cls, workspace_id: str, artifact_id: str, export_format: str = "json") -> Dict[str, Any]:
        artifact = cls.get_artifact(workspace_id, artifact_id)
        if not artifact:
            return {"error": "Artifact not found"}

        if export_format == "html" and "html_code" in artifact.data:
            return {"content": artifact.data["html_code"], "content_type": "text/html"}
        elif export_format == "csv" and "csv_content" in artifact.data:
            return {"content": artifact.data["csv_content"], "content_type": "text/csv"}
        return {"content": artifact.model_dump(), "content_type": "application/json"}
