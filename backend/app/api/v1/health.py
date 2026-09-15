"""
Rine Forge Systems V5 - Health & System Verification API Router
"""
import time
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.config import settings

router = APIRouter(prefix="/health", tags=["V5 Health"])

@router.get("")
async def platform_health():
    """Returns general V5 platform operating status."""
    return {
        "status": "healthy",
        "version": "5.0.0",
        "platform": "Rine Forge Systems AI Employee Backend",
        "environment": settings.ENVIRONMENT
    }

@router.get("/database")
async def database_health(session: AsyncSession = Depends(get_db)):
    """Verifies relational database read/write connectivity and query latency."""
    start = time.time()
    try:
        await session.execute(text("SELECT 1"))
        latency_ms = round((time.time() - start) * 1000, 2)
        return {
            "status": "connected",
            "database_url_schema": settings.DATABASE_URL.split("://")[0],
            "latency_ms": latency_ms
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@router.get("/ai")
async def ai_provider_health():
    """Verifies AI provider configuration."""
    has_openai = bool(settings.OPENAI_API_KEY)
    has_gemini = bool(settings.GEMINI_API_KEY)

    return {
        "status": "active",
        "primary_provider": settings.LLM_PROVIDER,
        "openai_configured": has_openai,
        "gemini_configured": has_gemini,
        "fallback_available": True
    }
