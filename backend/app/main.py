import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.database import init_db
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.leads import router as leads_router
from backend.app.api.campaigns import router as campaigns_router
from backend.app.api.outreach import router as outreach_router
from backend.app.api.inbox import router as inbox_router
from backend.app.api.compliance import router as compliance_router
from backend.app.api.kill_switch import router as kill_switch_router
from backend.app.api.public import router as public_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("owais_outreach_ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting RINE FORGE SYSTEMS Platform...")
    try:
        await init_db()
        logger.info(f"Database initialized. Operating Mode: DRY_RUN={settings.DRY_RUN}, LLM_PROVIDER={settings.LLM_PROVIDER}")
    except Exception as e:
        logger.warning(f"Database initialization warning in serverless: {e}")
    yield
    logger.info("🛑 Shutting down RINE FORGE SYSTEMS Platform...")

app = FastAPI(
    title="RINE FORGE SYSTEMS",
    description="Production AI Systems Platform & Client Acquisition OS",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard_router)
app.include_router(leads_router)
app.include_router(campaigns_router)
app.include_router(outreach_router)
app.include_router(inbox_router)
app.include_router(compliance_router)
app.include_router(kill_switch_router)
app.include_router(public_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "platform": "RINE FORGE SYSTEMS",
        "dry_run": settings.DRY_RUN,
        "environment": settings.ENVIRONMENT
    }

# Mount frontend/dist if built
import os
from pathlib import Path
from fastapi.responses import FileResponse, HTMLResponse

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
