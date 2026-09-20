"""
Rine Forge Systems V5 - API v1 Master Router
Unifies all enterprise multi-tenant endpoint modules under `/api/v1`.
"""
from fastapi import APIRouter

from .auth import router as auth_router
from .businesses import router as businesses_router
from .ai_employees import router as ai_employees_router
from .services import router as services_router
from .staff import router as staff_router
from .knowledge import router as knowledge_router
from .customers import router as customers_router
from .conversations import router as conversations_router
from .appointments import router as appointments_router
from .leads import router as leads_router
from .automations import router as automations_router
from .integrations import router as integrations_router
from .analytics import router as analytics_router
from .admin import router as admin_router
from .health import router as health_router
from .lead_engine import router as lead_engine_router
from .ai import router as ai_router
from backend.app.handoffs.router import router as handoffs_router
from backend.app.channels.voice.router import router as voice_router
from backend.app.webhooks.router import router as webhooks_router
from .agent_generator import router as agent_generator_router
from backend.app.workbench.router import router as workbench_router
from .intelligence import router as intelligence_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(businesses_router)
api_v1_router.include_router(ai_employees_router)
api_v1_router.include_router(services_router)
api_v1_router.include_router(staff_router)
api_v1_router.include_router(knowledge_router)
api_v1_router.include_router(customers_router)
api_v1_router.include_router(conversations_router)
api_v1_router.include_router(appointments_router)
api_v1_router.include_router(leads_router)
api_v1_router.include_router(automations_router)
api_v1_router.include_router(integrations_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(health_router)
api_v1_router.include_router(lead_engine_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(handoffs_router)
api_v1_router.include_router(voice_router)
api_v1_router.include_router(webhooks_router)
api_v1_router.include_router(agent_generator_router)
api_v1_router.include_router(workbench_router)
api_v1_router.include_router(intelligence_router)

__all__ = ["api_v1_router"]


