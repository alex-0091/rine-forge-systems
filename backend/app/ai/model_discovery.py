"""
Rine Forge Systems V5 - Phase AS: Model Discovery & Hardware Tier Recommendation Service
Separates LOCAL INSTALLED MODELS from AVAILABLE MODELS.
Classifies models into 4 safe hardware installation tiers to prevent host memory exhaustion.
Includes support for modern coding models (Qwen3-Coder, Qwen2.5-Coder, DeepSeek-Coder).
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.workbench.hardware_profiler import hardware_profiler
from backend.app.ai.ollama_adapter import ollama_adapter, OllamaOfflineError

logger = logging.getLogger("rine_forge.ai.model_discovery")


# Comprehensive catalog of available open models in the Ollama ecosystem
OFFICIAL_AVAILABLE_MODELS = [
    {
        "model_id": "phi3:mini",
        "name": "Microsoft Phi-3 Mini",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "FAST", "TOOL_USE"],
        "parameter_size": "3.8B",
        "memory_requirement_gb": 4.0,
        "context_length": 4096,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": False,
        "coding_capability": False,
        "embedding_capability": False,
        "recommended_hardware_tier": 1,
        "description": "Ultra-fast, lightweight 3.8B model for real-time customer triage and low-latency receptionist dialogue."
    },
    {
        "model_id": "qwen2:1.5b",
        "name": "Qwen 2 1.5B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "FAST"],
        "parameter_size": "1.5B",
        "memory_requirement_gb": 2.0,
        "context_length": 4096,
        "vision_support": False,
        "tool_support": False,
        "reasoning_support": False,
        "coding_capability": False,
        "embedding_capability": False,
        "recommended_hardware_tier": 1,
        "description": "Ultra-compact model running comfortably on devices with 4 GB RAM."
    },
    {
        "model_id": "llama3:8b",
        "name": "Meta Llama 3 8B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "REASONING", "TOOL_USE", "CODING"],
        "parameter_size": "8.0B",
        "memory_requirement_gb": 8.0,
        "context_length": 8192,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 2,
        "description": "Standard business intelligence brain for synthesis, planning, and tool dispatch."
    },
    {
        "model_id": "mistral:7b",
        "name": "Mistral 7B Instruct",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "REASONING"],
        "parameter_size": "7.2B",
        "memory_requirement_gb": 8.0,
        "context_length": 8192,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": False,
        "embedding_capability": False,
        "recommended_hardware_tier": 2,
        "description": "High quality natural language generation, ideal for copywriting and email marketing."
    },
    {
        "model_id": "deepseek-coder:6.7b",
        "name": "DeepSeek Coder 6.7B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CODING", "TOOL_USE"],
        "parameter_size": "6.7B",
        "memory_requirement_gb": 8.0,
        "context_length": 16384,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 2,
        "description": "Specialized code generation for HTML/Tailwind, JavaScript, and database queries."
    },
    {
        "model_id": "qwen2.5-coder:7b",
        "name": "Qwen 2.5 Coder 7B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CODING", "TOOL_USE"],
        "parameter_size": "7.0B",
        "memory_requirement_gb": 8.0,
        "context_length": 32768,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 2,
        "description": "High accuracy coding model supporting modern frontend and API development."
    },
    {
        "model_id": "qwen3-coder:latest",
        "name": "Qwen 3 Coder (Configurable)",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["CODING", "REASONING", "TOOL_USE"],
        "parameter_size": "7B - 14B",
        "memory_requirement_gb": 12.0,
        "context_length": 32768,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 3,
        "description": "Next-generation autonomous coding model for full project synthesis."
    },
    {
        "model_id": "llava:7b",
        "name": "LLaVA 1.6 7B Vision",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["VISION", "GENERAL"],
        "parameter_size": "7.0B",
        "memory_requirement_gb": 8.0,
        "context_length": 4096,
        "vision_support": True,
        "tool_support": False,
        "reasoning_support": False,
        "coding_capability": False,
        "embedding_capability": False,
        "recommended_hardware_tier": 2,
        "description": "Multimodal vision model for webpage screenshot audits and UX inspections."
    },
    {
        "model_id": "llama3.1:8b",
        "name": "Meta Llama 3.1 8B (128k)",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "REASONING", "LONG_CONTEXT", "TOOL_USE"],
        "parameter_size": "8.0B",
        "memory_requirement_gb": 10.0,
        "context_length": 131072,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 3,
        "description": "Long-context 128,000-token window for analyzing large legal, financial, and strategy PDFs."
    },
    {
        "model_id": "qwen2.5:14b",
        "name": "Qwen 2.5 14B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "REASONING", "LONG_CONTEXT", "TOOL_USE"],
        "parameter_size": "14.7B",
        "memory_requirement_gb": 16.0,
        "context_length": 32768,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 3,
        "description": "Complex reasoning model for multi-agent workflows and detailed business plans."
    },
    {
        "model_id": "nomic-embed-text",
        "name": "Nomic Embed Text v1.5",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["EMBEDDING"],
        "parameter_size": "137M",
        "memory_requirement_gb": 1.0,
        "context_length": 8192,
        "vision_support": False,
        "tool_support": False,
        "reasoning_support": False,
        "coding_capability": False,
        "embedding_capability": True,
        "recommended_hardware_tier": 1,
        "description": "High-performance embedding model for business knowledge retrieval and semantic search."
    },
    {
        "model_id": "llama3:70b",
        "name": "Meta Llama 3 70B",
        "provider": "LOCAL_OLLAMA",
        "capabilities": ["GENERAL", "REASONING", "CODING", "TOOL_USE", "LONG_CONTEXT"],
        "parameter_size": "70.0B",
        "memory_requirement_gb": 48.0,
        "context_length": 8192,
        "vision_support": False,
        "tool_support": True,
        "reasoning_support": True,
        "coding_capability": True,
        "embedding_capability": False,
        "recommended_hardware_tier": 4,
        "description": "Frontier-tier enterprise model requiring server-grade multi-GPU infrastructure."
    }
]


class ModelDiscoveryService:
    """
    Manages local model discovery, hardware tier classification,
    and safe installation guardrails.
    """

    async def get_discovery_catalog(self) -> Dict[str, Any]:
        """
        Gathers installed models from Ollama, compares with available catalog,
        and annotates each with compatibility status for current host hardware.
        """
        caps = await hardware_profiler.get_normalized_capabilities()
        ram_gb = caps.get("ramGB", 8.0)
        vram_gb = caps.get("gpu", {}).get("vramGB", 0.0)
        effective_mem = max(ram_gb, vram_gb * 1.5)

        # Classify host into hardware tier (1 to 4)
        if effective_mem < 8.0:
            host_tier = 1
        elif effective_mem < 16.0:
            host_tier = 2
        elif effective_mem < 32.0:
            host_tier = 3
        else:
            host_tier = 4

        # Query local Ollama for installed models
        installed_list = await ollama_adapter.list_models()
        installed_map = {m["name"].lower(): m for m in installed_list}
        # Also index by base tag (e.g. "llama3" from "llama3:8b")
        for m in installed_list:
            base_tag = m["name"].split(":")[0].lower()
            if base_tag not in installed_map:
                installed_map[base_tag] = m

        catalog_out = []
        for model in OFFICIAL_AVAILABLE_MODELS:
            m_id = model["model_id"].lower()
            base_id = m_id.split(":")[0]

            is_installed = (m_id in installed_map) or (base_id in installed_map)
            is_compatible = model["memory_requirement_gb"] <= (effective_mem * 0.95)
            is_recommended = (model["recommended_hardware_tier"] == host_tier) and is_compatible

            # Compute unambiguous status
            if is_installed:
                status = "INSTALLED"
            elif not is_compatible:
                status = "INCOMPATIBLE"
            elif is_recommended:
                status = "RECOMMENDED"
            else:
                status = "AVAILABLE"

            entry = dict(model)
            entry["is_installed"] = is_installed
            entry["is_compatible"] = is_compatible
            entry["is_recommended"] = is_recommended
            entry["status"] = status
            entry["installed_meta"] = installed_map.get(m_id) or installed_map.get(base_id)
            catalog_out.append(entry)

        return {
            "host_tier": host_tier,
            "host_hardware": caps,
            "installed_count": len(installed_list),
            "available_count": len(OFFICIAL_AVAILABLE_MODELS),
            "models": catalog_out
        }

    async def install_model_safe(self, model_id: str, confirm_risk: bool = False) -> Dict[str, Any]:
        """
        Guarded installation: Prevents downloading models that exceed available hardware
        unless the operator explicitly confirms risk.
        """
        catalog_info = await self.get_discovery_catalog()
        target_model = None
        for m in catalog_info["models"]:
            if m["model_id"].lower() == model_id.lower():
                target_model = m
                break

        if not target_model:
            # Allow custom model tag with warning
            logger.info(f"Custom model '{model_id}' requested for installation.")
            return await ollama_adapter.pull_model(model_id)

        if not target_model["is_compatible"] and not confirm_risk:
            return {
                "status": "BLOCKED",
                "model": model_id,
                "reason": (
                    f"Model '{model_id}' requires {target_model['memory_requirement_gb']} GB RAM, "
                    f"which exceeds safe memory limits (detected available host memory is {catalog_info['host_hardware'].get('ramGB')} GB). "
                    "Installation was blocked to protect system stability. Set confirm_risk=True to override."
                ),
                "required_tier": target_model["recommended_hardware_tier"],
                "host_tier": catalog_info["host_tier"]
            }

        try:
            return await ollama_adapter.pull_model(model_id)
        except OllamaOfflineError:
            return {
                "status": "OFFLINE",
                "model": model_id,
                "error": "Ollama daemon is offline or unreachable. Please ensure 'ollama serve' is running."
            }


model_discovery_service = ModelDiscoveryService()
