"""
Rine Forge Systems - Vercel Serverless Entry Point
Handles cold-start database initialization, error recovery, and ASGI routing.
"""
import sys
import logging
import os
from pathlib import Path

# Ensure root is in sys.path for Vercel serverless imports
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Set up logging for Vercel
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rine_forge_systems.vercel")

try:
    from backend.app.main import app
    logger.info("Rine Forge Systems app loaded successfully on Vercel.")
except Exception as e:
    logger.error(f"Failed to load app: {e}", exc_info=True)
    # Create a minimal fallback app so Vercel doesn't return a raw 500
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI()

    @app.get("/api/health")
    async def health():
        return JSONResponse(
            {"status": "degraded", "error": str(e), "message": "App failed to start — check Vercel function logs."},
            status_code=503
        )

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    async def catch_all(path: str):
        return JSONResponse(
            {"error": "Service temporarily unavailable", "detail": str(e)},
            status_code=503
        )

# Handler for Vercel serverless functions
handler = app
