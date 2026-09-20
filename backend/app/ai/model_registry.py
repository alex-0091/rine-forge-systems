"""
Rine Forge Systems V5 - Phase AR: Relational Model Registry Service
Tracks available open/local models, capabilities (CHAT, REASONING, CODING, VISION, TOOLS, JSON, LONG_CONTEXT),
speed classes, RAM/VRAM requirements, and installation states in Ollama.
"""
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import V5RegisteredModel
from backend.app.workbench.hardware_profiler import hardware_profiler

logger = logging.getLogger("rine_forge.ai.model_registry")


DEFAULT_OPEN_MODELS = [
    {
        "name": "llama3:8b",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CHAT", "REASONING", "TOOLS", "JSON"],
        "context_length": 8192,
        "vision": False,
        "tools": True,
        "reasoning": True,
        "coding": True,
        "speed_class": "BALANCED",
        "memory_requirement": "8 GB RAM",
        "enabled": True,
        "is_default": True,
        "metadata_json": {"description": "Meta Llama 3 8B - Standard enterprise business brain."}
    },
    {
        "name": "phi3:mini",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CHAT", "TOOLS", "JSON"],
        "context_length": 4096,
        "vision": False,
        "tools": True,
        "reasoning": False,
        "coding": False,
        "speed_class": "FAST",
        "memory_requirement": "4 GB RAM",
        "enabled": True,
        "is_default": False,
        "metadata_json": {"description": "Microsoft Phi-3 Mini 3.8B - Ultra-fast front-line triage & chat."}
    },
    {
        "name": "qwen2.5:14b",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CHAT", "REASONING", "TOOLS", "JSON", "LONG_CONTEXT"],
        "context_length": 32768,
        "vision": False,
        "tools": True,
        "reasoning": True,
        "coding": True,
        "speed_class": "DEEP_REASONING",
        "memory_requirement": "16 GB RAM / 8 GB VRAM",
        "enabled": True,
        "is_default": False,
        "metadata_json": {"description": "Qwen 2.5 14B - High-precision strategic reasoning & business planning."}
    },
    {
        "name": "deepseek-coder:6.7b",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CODING", "TOOLS", "JSON"],
        "context_length": 16384,
        "vision": False,
        "tools": True,
        "reasoning": True,
        "coding": True,
        "speed_class": "BALANCED",
        "memory_requirement": "8 GB RAM",
        "enabled": True,
        "is_default": False,
        "metadata_json": {"description": "DeepSeek Coder 6.7B - Specialized web & application code synthesis."}
    },
    {
        "name": "llava:7b",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["VISION", "CHAT"],
        "context_length": 4096,
        "vision": True,
        "tools": False,
        "reasoning": False,
        "coding": False,
        "speed_class": "BALANCED",
        "memory_requirement": "8 GB RAM",
        "enabled": True,
        "is_default": False,
        "metadata_json": {"description": "LLaVA 7B - Multi-modal visual inspection & website screenshot analysis."}
    },
    {
        "name": "llama3.1:8b",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CHAT", "REASONING", "TOOLS", "JSON", "LONG_CONTEXT"],
        "context_length": 131072,
        "vision": False,
        "tools": True,
        "reasoning": True,
        "coding": True,
        "speed_class": "BALANCED",
        "memory_requirement": "8 GB RAM",
        "enabled": True,
        "is_default": False,
        "metadata_json": {"description": "Meta Llama 3.1 8B - Extended 128k context document analyzer."}
    }
]


class ModelRegistryService:
    """
    Database-backed model registry management.
    """

    async def seed_default_models_if_needed(self, session: AsyncSession) -> int:
        """Seeds standard open models if the registry is empty."""
        stmt = select(V5RegisteredModel)
        res = await session.execute(stmt)
        existing = res.scalars().all()
        if existing:
            return len(existing)

        count = 0
        for m_data in DEFAULT_OPEN_MODELS:
            m = V5RegisteredModel(**m_data)
            session.add(m)
            count += 1

        await session.commit()
        logger.info(f"Seeded {count} open models into V5RegisteredModel registry.")
        return count

    async def list_models(self, session: AsyncSession, enabled_only: bool = False) -> List[Dict[str, Any]]:
        """Lists registered models merged with live local Ollama installed status."""
        stmt = select(V5RegisteredModel)
        if enabled_only:
            stmt = stmt.where(V5RegisteredModel.enabled == True)
        stmt = stmt.order_by(V5RegisteredModel.is_default.desc(), V5RegisteredModel.name.asc())

        res = await session.execute(stmt)
        models = res.scalars().all()

        # If DB was empty, auto-seed and reload
        if not models:
            await self.seed_default_models_if_needed(session)
            res = await session.execute(stmt)
            models = res.scalars().all()

        # Probe Ollama for live installed models
        ollama_status = await hardware_profiler.check_ollama_status()
        installed_names = set()
        if ollama_status.get("is_reachable"):
            installed_names = {m.get("name", "").split(":")[0] for m in ollama_status.get("installed_models", [])}
            installed_names.update(m.get("name", "") for m in ollama_status.get("installed_models", []))

        output = []
        for m in models:
            is_installed = m.name in installed_names or m.name.split(":")[0] in installed_names
            status = "INSTALLED" if is_installed else "NOT_INSTALLED"
            if not ollama_status.get("is_reachable"):
                status = "OFFLINE"

            output.append({
                "id": m.id,
                "name": m.name,
                "provider": m.provider,
                "capabilities": m.capabilities,
                "context_length": m.context_length,
                "vision": m.vision,
                "tools": m.tools,
                "reasoning": m.reasoning,
                "coding": m.coding,
                "speed_class": m.speed_class,
                "memory_requirement": m.memory_requirement,
                "enabled": m.enabled,
                "is_default": m.is_default,
                "status": status,
                "is_installed": is_installed,
                "metadata": m.metadata_json
            })

        return output

    async def set_default_model(self, session: AsyncSession, model_name: str) -> bool:
        """Sets the active default model."""
        await session.execute(update(V5RegisteredModel).values(is_default=False))
        stmt = update(V5RegisteredModel).where(V5RegisteredModel.name == model_name).values(is_default=True)
        res = await session.execute(stmt)
        await session.commit()
        return res.rowcount > 0

    async def register_model(self, session: AsyncSession, model_data: Dict[str, Any]) -> Dict[str, Any]:
        """Adds or updates a model definition in the registry."""
        stmt = select(V5RegisteredModel).where(V5RegisteredModel.name == model_data["name"])
        res = await session.execute(stmt)
        existing = res.scalar_one_or_none()

        if existing:
            for k, v in model_data.items():
                if hasattr(existing, k) and k != "id":
                    setattr(existing, k, v)
            await session.commit()
            await session.refresh(existing)
            return {"status": "UPDATED", "model": existing.name}
        else:
            m = V5RegisteredModel(**model_data)
            session.add(m)
            await session.commit()
            await session.refresh(m)
            return {"status": "CREATED", "model": m.name}


model_registry_service = ModelRegistryService()
