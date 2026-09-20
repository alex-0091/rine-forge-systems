"""
Rine Forge Systems V5 - CORS Security Configuration
Remediates P0-1 wildcard CORS vulnerability by validating allowed origins.
"""
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def configure_cors(app: FastAPI, allowed_origins: List[str]):
    """
    Safely configures CORS middleware.
    If credentials are true, wildcard '*' is forbidden per W3C specification.
    """
    origins = [o.strip() for o in allowed_origins if o.strip()]
    if not origins:
        origins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "https://rine-forge-systems.vercel.app"
        ]

    # Verify no wildcard origin with credentials
    if "*" in origins:
        # Fallback to safe localhost list if wildcard was mistakenly passed
        origins = [o for o in origins if o != "*"]
        if not origins:
            origins = ["http://localhost:5173", "https://rine-forge-systems.vercel.app"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"]
    )
