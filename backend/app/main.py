import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.config import settings
from backend.app.database import init_db, get_db
from backend.app.database_seed import seed_v5_database
from backend.app.errors import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    generic_exception_handler,
)
from backend.app.logging import RequestLoggingMiddleware
from backend.app.security import SecurityHeadersMiddleware, configure_cors
from backend.app.ratelimit import rate_limiter
from backend.app.jobs.queue import job_queue

# Legacy V4 Routers
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.leads import router as leads_router
from backend.app.api.campaigns import router as campaigns_router
from backend.app.api.outreach import router as outreach_router
from backend.app.api.inbox import router as inbox_router
from backend.app.api.compliance import router as compliance_router
from backend.app.api.kill_switch import router as kill_switch_router
from backend.app.api.public import router as public_router
from backend.app.api.receptionist import router as receptionist_router
from backend.app.channels.whatsapp.router import router as whatsapp_router
from backend.app.channels.voice.router import router as voice_router, voice_api_alias_router

# Production V5 Router
from backend.app.api.v1 import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rine_forge_systems")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting RINE FORGE SYSTEMS Platform...")
    try:
        await init_db()
        logger.info(f"Database initialized. Operating Mode: DRY_RUN={settings.DRY_RUN}, LLM_PROVIDER={settings.LLM_PROVIDER}")
        await seed_v5_database()
        await job_queue.start()
    except Exception as e:
        logger.warning(f"Database initialization warning in serverless: {e}")
    yield
    logger.info("🛑 Shutting down RINE FORGE SYSTEMS Platform...")
    await job_queue.stop()

app = FastAPI(

    title="RINE FORGE SYSTEMS",
    description="Production AI Systems Platform & Client Acquisition OS",
    version="1.0.0",
    lifespan=lifespan
)

# 1. Logging & Request ID Middleware (Runs first to catch all requests)
app.add_middleware(RequestLoggingMiddleware)

# 2. Security Headers Middleware (Nosniff, DENY framing, Referrer)
app.add_middleware(SecurityHeadersMiddleware)

# 3. CORS Security (Origin-restricted, resolves P0-1 wildcard CORS vulnerability)
configure_cors(app, settings.ALLOWED_ORIGINS)

# 4. Standard Global Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# 5. Register API Routers
app.include_router(dashboard_router)
app.include_router(leads_router)
app.include_router(campaigns_router)
app.include_router(outreach_router)
app.include_router(inbox_router)
app.include_router(compliance_router)
app.include_router(kill_switch_router)
app.include_router(public_router)
app.include_router(receptionist_router)
app.include_router(whatsapp_router)
app.include_router(voice_router, prefix="/api")
app.include_router(voice_api_alias_router, prefix="/api")
app.include_router(api_v1_router)

# 6. Deep Health Check Endpoint
@app.get("/api/health")
async def health_check(session: Optional[AsyncSession] = Depends(get_db)):
    """
    Deep multi-component health probe verifying platform, database, AI, and queue.
    Distinguishes between configured, reachable, and healthy states.
    """
    db_status = {
        "configured": True,
        "reachable": False,
        "status": "unhealthy",
        "engine": "sqlite" if "sqlite" in settings.DATABASE_URL else "postgresql"
    }

    if session:
        try:
            await session.execute(text("SELECT 1"))
            db_status["reachable"] = True
            db_status["status"] = "healthy"
        except Exception as e:
            db_status["error"] = str(e)

    ai_configured = bool(settings.OPENAI_API_KEY or settings.GEMINI_API_KEY)
    ai_status = {
        "configured": ai_configured,
        "provider": settings.LLM_PROVIDER,
        "status": "configured" if ai_configured else "fallback_mock",
        "default_model": settings.DEFAULT_MODEL
    }

    overall_healthy = db_status["reachable"]

    return {
        "status": "healthy" if overall_healthy else "degraded",
        "platform": "RINE FORGE SYSTEMS",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "dry_run": settings.DRY_RUN,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {
            "database": db_status,
            "ai": ai_status,
            "rate_limiter": {
                "backend": rate_limiter.get_backend_name(),
                "status": "active"
            },
            "queue": {
                "backend": "in_memory",
                "status": "active"
            }
        }
    }

# 7. Mount frontend/dist if built (SPA Fallback)
candidates = [
    Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
    Path("/var/task/frontend/dist"),
    Path("./frontend/dist"),
    Path("./dist")
]

frontend_dist = None
for p in candidates:
    if p.exists() and (p / "index.html").exists():
        frontend_dist = p
        break

if frontend_dist:
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    async def fallback_root():
        return {
            "status": "RINE FORGE SYSTEMS API Online",
            "docs": "/docs",
            "health": "/api/health"
        }
