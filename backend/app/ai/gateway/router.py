"""
Rine Forge Systems V5 - Policy-Based AI Model Router
Dynamically routes inference requests by requirement tier (FAST, QUALITY, CHEAP, LOCAL)
with automatic fallback to available alternatives and explicit model override support.
"""
import logging
from typing import Dict, Any, Optional, Tuple, List

from backend.app.config import settings
from backend.app.ai.gateway.interface import BaseAIProvider, AIOptions, ProviderHealth
from backend.app.ai.gateway.providers import (
    OpenAIProvider, GeminiProvider, OllamaProvider, MockProvider, GroqProvider
)
from backend.app.ai.gateway.errors import AIProviderUnavailableError

logger = logging.getLogger("rine_forge_systems.ai.gateway.router")

# Standard Model Requirement Tiers
TIER_FAST = "FAST_MODEL"
TIER_QUALITY = "QUALITY_MODEL"
TIER_CHEAP = "CHEAP_MODEL"
TIER_LOCAL = "LOCAL_MODEL"
TIER_EMBEDDING = "EMBEDDING_MODEL"

# Phase AR Capabilities
CAPABILITY_CHAT = "CHAT"
CAPABILITY_REASONING = "REASONING"
CAPABILITY_CODING = "CODING"
CAPABILITY_VISION = "VISION"
CAPABILITY_TOOLS = "TOOLS"
CAPABILITY_JSON = "JSON"
CAPABILITY_LONG_CONTEXT = "LONG_CONTEXT"

# Routing Policies (Phase AS)
POLICY_LOCAL_ONLY = "LOCAL_ONLY"
POLICY_LOCAL_FIRST = "LOCAL_FIRST"
POLICY_CLOUD_ALLOWED = "CLOUD_ALLOWED"
POLICY_CLOUD_PREFERRED = "CLOUD_PREFERRED"
POLICY_LOCAL_WITH_CLOUD_FALLBACK = "LOCAL_WITH_CLOUD_FALLBACK"

# Phase AS Authoritative 19 Task Types
TASK_CHAT = "CHAT"
TASK_CUSTOMER_RESPONSE = "CUSTOMER_RESPONSE"
TASK_CUSTOMER_ANALYSIS = "CUSTOMER_ANALYSIS"
TASK_VOICE_RESPONSE = "VOICE_RESPONSE"
TASK_WEBSITE_BUILD = "WEBSITE_BUILD"
TASK_CODE_GENERATION = "CODE_GENERATION"
TASK_CODE_REVIEW = "CODE_REVIEW"
TASK_WEBSITE_AUDIT = "WEBSITE_AUDIT"
TASK_BUSINESS_PLAN = "BUSINESS_PLAN"
TASK_MARKETING_PLAN = "MARKETING_PLAN"
TASK_FINANCIAL_ANALYSIS = "FINANCIAL_ANALYSIS"
TASK_DOCUMENT_ANALYSIS = "DOCUMENT_ANALYSIS"
TASK_VISION_ANALYSIS = "VISION_ANALYSIS"
TASK_IMAGE_ANALYSIS = "IMAGE_ANALYSIS"
TASK_RAG = "RAG"
TASK_EMBEDDINGS = "EMBEDDINGS"
TASK_LEAD_QUALIFICATION = "LEAD_QUALIFICATION"
TASK_SALES_ASSISTANT = "SALES_ASSISTANT"
TASK_AI_EMPLOYEE_GENERATION = "AI_EMPLOYEE_GENERATION"

ALL_TASK_TYPES = [
    TASK_CHAT, TASK_CUSTOMER_RESPONSE, TASK_CUSTOMER_ANALYSIS, TASK_VOICE_RESPONSE,
    TASK_WEBSITE_BUILD, TASK_CODE_GENERATION, TASK_CODE_REVIEW, TASK_WEBSITE_AUDIT,
    TASK_BUSINESS_PLAN, TASK_MARKETING_PLAN, TASK_FINANCIAL_ANALYSIS, TASK_DOCUMENT_ANALYSIS,
    TASK_VISION_ANALYSIS, TASK_IMAGE_ANALYSIS, TASK_RAG, TASK_EMBEDDINGS,
    TASK_LEAD_QUALIFICATION, TASK_SALES_ASSISTANT, TASK_AI_EMPLOYEE_GENERATION
]

class ModelRouter:
    """
    Decouples application logic from specific LLM vendors.
    Maps task tiers to preferred providers and handles resilient fallbacks.
    """

    def __init__(self, force_mock: bool = False):
        self.force_mock = force_mock
        self.providers: Dict[str, BaseAIProvider] = {}
        self._init_providers()

    def _init_providers(self):
        """Initializes providers based on environment settings without crashing if unconfigured."""
        if self.force_mock:
            self.providers["mock"] = MockProvider()
            return

        # 1. Mock provider (always available for fallback/testing)
        self.providers["mock"] = MockProvider()

        # 2. OpenAI
        openai_p = OpenAIProvider()
        if openai_p.is_configured():
            self.providers["openai"] = openai_p
            logger.info("OpenAI provider initialized and registered in router.")
        else:
            logger.info("OpenAI provider not configured (missing OPENAI_API_KEY).")

        # 3. Gemini
        gemini_p = GeminiProvider()
        if gemini_p.is_configured():
            self.providers["gemini"] = gemini_p
            logger.info("Gemini provider initialized and registered in router.")
        else:
            logger.info("Gemini provider not configured (missing GEMINI_API_KEY).")

        # 4. Groq (free, ultra-fast LPU inference — Llama 3.3 70B free tier)
        groq_p = GroqProvider()
        if groq_p.is_configured():
            self.providers["groq"] = groq_p
            logger.info("Groq provider initialized and registered in router (FREE tier - Llama 3.3 70B).")
        else:
            logger.info("Groq provider not configured (missing GROQ_API_KEY).")

        # 5. Ollama
        ollama_p = OllamaProvider()
        self.providers["ollama"] = ollama_p

    def register_provider(self, name: str, provider: BaseAIProvider):
        """Registers or replaces a provider adapter (useful in testing)."""
        self.providers[name] = provider

    def get_provider(self, name: str) -> Optional[BaseAIProvider]:
        return self.providers.get(name)

    def resolve_route(self, options: Optional[AIOptions] = None) -> Tuple[BaseAIProvider, str]:
        """
        Determines the appropriate provider and model name based on:
        1. Explicit options.model override (e.g. 'gpt-4o', 'gemini-1.5-flash', 'llama3')
        2. Requirement tier (FAST_MODEL, QUALITY_MODEL, CHEAP_MODEL, LOCAL_MODEL)
        3. Configured provider preference
        """
        opts = options or AIOptions()
        model_override = opts.model
        tier = opts.tier or TIER_FAST

        # If running in test/force_mock mode, or dry-run without configured external keys
        has_configured_external = any(
            p.is_configured() for name, p in self.providers.items() if name in ("openai", "gemini")
        )
        if self.force_mock or (settings.LLM_PROVIDER.lower() == "mock") or (settings.DRY_RUN and not has_configured_external):
            if "mock" in self.providers:
                return self.providers["mock"], model_override or "mock-fast"

        # 1. Explicit model name override
        if model_override:
            if "gpt" in model_override.lower() and "openai" in self.providers:
                return self.providers["openai"], model_override
            elif "gemini" in model_override.lower() and "gemini" in self.providers:
                return self.providers["gemini"], model_override
            elif "groq" in model_override.lower() and "groq" in self.providers:
                return self.providers["groq"], model_override
            elif ("llama" in model_override.lower() or "mistral" in model_override.lower()) and "groq" in self.providers and self.providers["groq"].is_configured():
                return self.providers["groq"], model_override
            elif ("llama" in model_override.lower() or "mistral" in model_override.lower()) and "ollama" in self.providers:
                return self.providers["ollama"], model_override

        # 2. Local tier requested
        if tier == TIER_LOCAL:
            if "ollama" in self.providers:
                return self.providers["ollama"], "llama3"

        # 3. Quality tier (complex reasoning, negotiations)
        if tier == TIER_QUALITY:
            if "openai" in self.providers and self.providers["openai"].is_configured():
                return self.providers["openai"], "gpt-4o"
            elif "gemini" in self.providers and self.providers["gemini"].is_configured():
                return self.providers["gemini"], "gemini-1.5-pro"
            elif "groq" in self.providers and self.providers["groq"].is_configured():
                return self.providers["groq"], "llama-3.3-70b-versatile"

        # 4. Fast & Cheap tiers (classification, triage, speed-to-lead)
        # Check primary configured provider in settings
        preferred = settings.LLM_PROVIDER.lower()
        if preferred == "groq" and "groq" in self.providers and self.providers["groq"].is_configured():
            return self.providers["groq"], "llama-3.1-8b-instant"
        elif preferred == "gemini" and "gemini" in self.providers and self.providers["gemini"].is_configured():
            return self.providers["gemini"], "gemini-1.5-flash"
        elif preferred == "openai" and "openai" in self.providers and self.providers["openai"].is_configured():
            return self.providers["openai"], "gpt-4o-mini"
        elif "openai" in self.providers and self.providers["openai"].is_configured():
            return self.providers["openai"], "gpt-4o-mini"
        elif "gemini" in self.providers and self.providers["gemini"].is_configured():
            return self.providers["gemini"], "gemini-1.5-flash"
        elif "groq" in self.providers and self.providers["groq"].is_configured():
            return self.providers["groq"], "llama-3.3-70b-versatile"

        # 5. Safe Fallback: If no commercial API is configured, use deterministic mock
        if "mock" in self.providers:
            return self.providers["mock"], "mock-fast"

        if "ollama" in self.providers:
            return self.providers["ollama"], "llama3"

        return self.providers["mock"], "mock-fast"

    def resolve_route_by_capability(
        self,
        capability: str,
        policy: str = POLICY_LOCAL_ONLY,
        installed_models: Optional[List[str]] = None
    ) -> Tuple[BaseAIProvider, str, Dict[str, Any]]:
        """
        Phase AR: Automatic Model Routing based on capability requirements:
        - CHAT -> Fast local model (phi3:mini, qwen2:1.5b, llama3:8b)
        - REASONING -> Strategic reasoning model (llama3.1:8b, qwen2.5:14b, llama3:8b)
        - CODING -> Code synthesis model (deepseek-coder:6.7b, qwen2.5-coder:7b)
        - VISION -> Visual model (llava:7b)
        - LONG_CONTEXT -> Extended window model (llama3.1:8b)
        """
        installed = set(installed_models or [])

        mapping = {
            CAPABILITY_CHAT: ["phi3:mini", "qwen2:1.5b", "llama3:8b", "llama3"],
            CAPABILITY_REASONING: ["llama3.1:8b", "qwen2.5:14b", "llama3:8b", "llama3"],
            CAPABILITY_CODING: ["deepseek-coder:6.7b", "qwen2.5-coder:7b", "llama3:8b", "llama3"],
            CAPABILITY_VISION: ["llava:7b", "llama3.2-vision:11b"],
            CAPABILITY_LONG_CONTEXT: ["llama3.1:8b", "qwen2.5:14b", "llama3:8b"],
            CAPABILITY_TOOLS: ["llama3:8b", "llama3.1:8b", "phi3:mini"],
            CAPABILITY_JSON: ["llama3:8b", "phi3:mini"]
        }

        candidates = mapping.get(capability, ["llama3:8b", "llama3"])

        chosen_model = candidates[0]
        model_installed = False
        if installed:
            for cand in candidates:
                base_cand = cand.split(":")[0]
                if cand in installed or base_cand in installed:
                    chosen_model = cand
                    model_installed = True
                    break
        else:
            model_installed = True

        status = "READY" if model_installed else "MODEL_REQUIRED"
        instructions = None if model_installed else f"Model '{chosen_model}' required for {capability}. Install via 'ollama pull {chosen_model}'."

        provider = self.providers.get("ollama") or self.providers.get("mock")
        if not provider:
            from backend.app.ai.gateway.providers import MockProvider
            provider = MockProvider()

        meta = {
            "capability": capability,
            "target_model": chosen_model,
            "is_installed": model_installed,
            "status": status,
            "instructions": instructions,
            "policy": policy
        }

        return provider, chosen_model, meta

    def get_fallback_route(
        self,
        current_provider: str,
        options: Optional[AIOptions] = None
    ) -> Optional[Tuple[BaseAIProvider, str]]:
        """
        Determines secondary provider if current primary fails or is rate-limited.
        """
        opts = options or AIOptions()
        tier = opts.tier or TIER_FAST

        # Fallback chain: openai -> gemini -> groq -> mock
        if current_provider == "openai":
            if "gemini" in self.providers and self.providers["gemini"].is_configured():
                logger.info("[Router Fallback] OpenAI failed -> falling back to Gemini")
                return self.providers["gemini"], "gemini-1.5-flash"
            elif "groq" in self.providers and self.providers["groq"].is_configured():
                logger.info("[Router Fallback] OpenAI failed -> falling back to Groq")
                return self.providers["groq"], "llama-3.3-70b-versatile"

        elif current_provider == "gemini":
            if "groq" in self.providers and self.providers["groq"].is_configured():
                logger.info("[Router Fallback] Gemini failed -> falling back to Groq")
                return self.providers["groq"], "llama-3.3-70b-versatile"
            elif "openai" in self.providers and self.providers["openai"].is_configured():
                logger.info("[Router Fallback] Gemini failed -> falling back to OpenAI")
                return self.providers["openai"], "gpt-4o-mini"

        elif current_provider == "groq":
            if "gemini" in self.providers and self.providers["gemini"].is_configured():
                logger.info("[Router Fallback] Groq failed -> falling back to Gemini")
                return self.providers["gemini"], "gemini-1.5-flash"
            elif "openai" in self.providers and self.providers["openai"].is_configured():
                logger.info("[Router Fallback] Groq failed -> falling back to OpenAI")
                return self.providers["openai"], "gpt-4o-mini"

        elif current_provider == "ollama":
            if tier == TIER_LOCAL:
                mock_p = self.providers.get("mock")
                if mock_p:
                    return mock_p, "mock-fast"
            if "gemini" in self.providers and self.providers["gemini"].is_configured():
                return self.providers["gemini"], "gemini-3.6-flash"
            elif "groq" in self.providers and self.providers["groq"].is_configured():
                return self.providers["groq"], "llama-3.3-70b-versatile"
            elif "openai" in self.providers and self.providers["openai"].is_configured():
                return self.providers["openai"], "gpt-4o-mini"

        # Safe fallback: return mock if current is not already mock
        if current_provider != "mock":
            mock_p = self.providers.get("mock")
            if mock_p:
                return mock_p, "mock-fast"

        return None

    def route_task(
        self,
        task_type: str,
        required_capabilities: Optional[List[str]] = None,
        latency_preference: str = "BALANCED",
        quality_preference: str = "BALANCED",
        privacy_preference: str = "MAXIMUM",
        workspace_policy: str = POLICY_LOCAL_FIRST,
        hardware_capabilities: Optional[Dict[str, Any]] = None,
        installed_models: Optional[List[str]] = None,
        has_screenshots: bool = False
    ) -> Dict[str, Any]:
        """
        Phase AS: Authoritative Model Router mapping 19 task types to optimal models.
        Strictly enforces LOCAL_ONLY policy by prohibiting data egress to cloud providers.
        """
        installed = set(installed_models or [])

        # 1. Map Task Type to Candidate Models & Capabilities
        task_routing_table = {
            TASK_CHAT: ("phi3:mini", ["phi3:mini", "qwen2:1.5b", "llama3:8b"], 1, "Fast conversational response"),
            TASK_CUSTOMER_RESPONSE: ("phi3:mini", ["phi3:mini", "qwen2:1.5b", "llama3:8b"], 1, "Speed-to-lead customer inquiry response"),
            TASK_CUSTOMER_ANALYSIS: ("llama3.1:8b", ["llama3.1:8b", "qwen2.5:14b", "llama3:8b"], 2, "Customer sentiment and qualification analysis"),
            TASK_VOICE_RESPONSE: ("phi3:mini", ["phi3:mini", "qwen2:1.5b"], 1, "Low-latency streaming voice turn"),
            TASK_WEBSITE_BUILD: ("deepseek-coder:6.7b", ["qwen3-coder:latest", "deepseek-coder:6.7b", "qwen2.5-coder:7b", "llama3:8b"], 2, "Tailwind CSS & semantic HTML synthesis"),
            TASK_CODE_GENERATION: ("deepseek-coder:6.7b", ["qwen3-coder:latest", "deepseek-coder:6.7b", "qwen2.5-coder:7b", "llama3:8b"], 2, "Application and schema code generation"),
            TASK_CODE_REVIEW: ("qwen2.5-coder:7b", ["qwen3-coder:latest", "qwen2.5-coder:7b", "deepseek-coder:6.7b", "llama3:8b"], 2, "Syntax, security, and logic audit"),
            TASK_WEBSITE_AUDIT: (
                ("llava:7b", ["llava:7b"], 2, "Multimodal visual inspection of webpage layout") if has_screenshots
                else ("llama3.1:8b", ["llama3.1:8b", "qwen2.5:14b", "llama3:8b"], 2, "Textual audit across UX, accessibility, and SEO")
            ),
            TASK_BUSINESS_PLAN: ("qwen2.5:14b", ["qwen2.5:14b", "llama3.1:8b", "llama3:8b"], 3, "Strategic 8-section business planning"),
            TASK_MARKETING_PLAN: ("llama3:8b", ["mistral:7b", "llama3:8b", "llama3.1:8b"], 2, "Inbound acquisition & customer referral campaign design"),
            TASK_FINANCIAL_ANALYSIS: ("qwen2.5:14b", ["qwen2.5:14b", "llama3.1:8b", "llama3:8b"], 3, "Deterministic Python math engine coupled with local narrative explanation"),
            TASK_DOCUMENT_ANALYSIS: ("llama3.1:8b", ["llama3.1:8b", "qwen2.5:14b"], 3, "Extended 128k context document analysis"),
            TASK_VISION_ANALYSIS: ("llava:7b", ["llava:7b", "llama3.2-vision:11b"], 2, "Multimodal image and screenshot comprehension"),
            TASK_IMAGE_ANALYSIS: ("llava:7b", ["llava:7b", "llama3.2-vision:11b"], 2, "Visual asset inspection"),
            TASK_RAG: ("llama3.1:8b", ["llama3.1:8b", "llama3:8b"], 2, "Vector semantic retrieval grounded with business knowledge"),
            TASK_EMBEDDINGS: ("nomic-embed-text", ["nomic-embed-text"], 1, "Dense semantic vector extraction"),
            TASK_LEAD_QUALIFICATION: ("llama3:8b", ["llama3:8b", "phi3:mini"], 2, "Automated ICP lead scoring and triage"),
            TASK_SALES_ASSISTANT: ("phi3:mini", ["phi3:mini", "llama3:8b"], 1, "Real-time sales objection handling"),
            TASK_AI_EMPLOYEE_GENERATION: ("llama3.1:8b", ["llama3.1:8b", "qwen2.5:14b"], 3, "System prompt and tool binding formulation")
        }

        default_route = ("llama3:8b", ["llama3:8b", "phi3:mini"], 2, "General business task routing")
        pref_model, candidates, tier, reason = task_routing_table.get(task_type, default_route)

        # 2. Check Local Installation Match
        selected_model = pref_model
        is_installed = False

        if installed:
            for cand in candidates:
                base_c = cand.split(":")[0].lower()
                if cand.lower() in installed or base_c in installed:
                    selected_model = cand
                    is_installed = True
                    break
        else:
            # If installed models list not passed, assume target model is candidate
            is_installed = True

        # 3. Policy Enforcement
        # Under LOCAL_ONLY: strictly prohibit commercial cloud APIs
        if workspace_policy == POLICY_LOCAL_ONLY:
            provider = "ollama"
            if not is_installed:
                reason = f"[LOCAL_ONLY Policy] Model '{selected_model}' is required. No external cloud fallback permitted."
            else:
                reason = f"[LOCAL_ONLY Policy] Routed locally to '{selected_model}' ({reason})."
        elif workspace_policy == POLICY_CLOUD_PREFERRED:
            # Prefer commercial cloud if configured
            if "openai" in self.providers and self.providers["openai"].is_configured():
                return {
                    "provider": "openai",
                    "model": "gpt-4o-mini" if tier <= 2 else "gpt-4o",
                    "reason": f"[CLOUD_PREFERRED Policy] Routed to OpenAI for {task_type}.",
                    "estimatedResourceTier": tier
                }
            elif "gemini" in self.providers and self.providers["gemini"].is_configured():
                return {
                    "provider": "gemini",
                    "model": "gemini-1.5-flash" if tier <= 2 else "gemini-1.5-pro",
                    "reason": f"[CLOUD_PREFERRED Policy] Routed to Gemini for {task_type}.",
                    "estimatedResourceTier": tier
                }
            provider = "ollama"
        else:
            # LOCAL_FIRST (default) or CLOUD_ALLOWED
            provider = "ollama"

        return {
            "provider": provider,
            "model": selected_model,
            "reason": reason,
            "estimatedResourceTier": tier,
            "is_installed": is_installed,
            "policy": workspace_policy
        }

    async def check_all_health(self) -> Dict[str, ProviderHealth]:
        """Runs health checks on all registered adapters."""
        healths = {}
        for name, provider in self.providers.items():
            try:
                healths[name] = await provider.health_check()
            except Exception as e:
                healths[name] = ProviderHealth(
                    provider=name,
                    status="ERROR",
                    error_message=str(e)
                )
        return healths
