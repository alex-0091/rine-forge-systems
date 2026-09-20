"""
Rine Forge Systems V5 - Central Application Configuration
Defines strongly typed settings using pydantic-settings.
Separates configuration into Public, Server-Only, and Optional Integrations.
"""
import os
from typing import List, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_DEV_SECRET = "rine_forge_jwt_secret_key_prod_2026_change_in_production"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ============================================================
    # 1. PUBLIC CONFIG (Client-Visible / Operational Metadata)
    # ============================================================
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://rine-forge-systems.vercel.app"
    ]

    # ============================================================
    # 2. SERVER-ONLY CONFIG (Privileged Secrets & Core Infrastructure)
    # ============================================================
    SECRET_KEY: str = DEFAULT_DEV_SECRET
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database: Use DATABASE_URL env var if set (Neon PostgreSQL for production),
    # otherwise SQLite for local dev/testing
    DATABASE_URL: str = (
        "sqlite+aiosqlite:////tmp/outreach_ai.db"
        if (os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))
        else "sqlite+aiosqlite:///./outreach_ai.db"
    )

    # Operating Controls & Circuit Breakers
    DRY_RUN: bool = True
    AUTO_REPLY_ENABLED: bool = False
    GLOBAL_KILL_SWITCH: bool = False

    # Outbound Rate Limiting & Scheduling
    MAX_DAILY_EMAILS: int = 50
    MAX_HOURLY_EMAILS: int = 10
    MIN_SEND_DELAY_SECONDS: int = 180
    MAX_SEND_DELAY_SECONDS: int = 600
    SENDING_HOURS_START: int = 9
    SENDING_HOURS_END: int = 17
    SENDING_TIMEZONE: str = "UTC"

    DEFAULT_LEAD_THRESHOLD: int = 75
    DEFAULT_COUNTRY: str = "USA"

    # ============================================================
    # 3. OPTIONAL INTEGRATIONS (AI, Email, Channels)
    # ============================================================
    # AI / LLM
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_REASONING_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.6-flash"
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    LLM_PROVIDER: str = "auto"  # "auto", "openai", "gemini", "groq", "mock"
    DEFAULT_MODEL: str = "gemini-3.6-flash"
    REASONING_MODEL: str = "gemini-3.6-flash"

    # Email Infrastructure
    EMAIL_PROVIDER: str = "dry_run"  # "dry_run", "smtp", "resend"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = "alexrine691@gmail.com"
    SMTP_PASSWORD: Optional[str] = None
    SMTP_USE_TLS: bool = True

    # Sender Identity
    SENDER_NAME: str = "Alex Rine"
    SENDER_EMAIL: str = "alexrine691@gmail.com"
    SENDER_COMPANY: str = "Rine Forge Systems"
    SENDER_PHYSICAL_ADDRESS: str = "Rine Forge Systems, 100 Innovation Way, Suite 400, Austin, TX & Global"
    REPLY_TO_EMAIL: str = "alexrine691@gmail.com"

    # Escalations & Alerts
    ESCALATION_EMAIL_ALERT: bool = True
    ALERT_RECIPIENT_EMAIL: str = "alexrine691@gmail.com"

    # Portfolio Links
    PORTFOLIO_ORACLE_AI_URL: str = "https://oracle-ai.demo.local"
    PORTFOLIO_PLOT_TWIST_URL: str = "https://plot-twist.demo.local"
    PORTFOLIO_BRIGHT_STAR_URL: str = "https://bs-grammar-school.demo.local"

    # Meta WhatsApp Cloud API
    META_VERIFY_TOKEN: str = "rine_forge_whatsapp_verify_token_2026"
    META_ACCESS_TOKEN: Optional[str] = None
    META_PHONE_NUMBER_ID: Optional[str] = None
    META_WABA_ID: Optional[str] = None
    META_API_VERSION: str = "v21.0"

    @model_validator(mode="after")
    def validate_production_security(self) -> "Settings":
        """Fails gracefully with clear error if insecure config is detected in production."""
        if self.ENVIRONMENT.lower() == "production":
            if self.SECRET_KEY == DEFAULT_DEV_SECRET:
                raise ValueError(
                    "INSECURE CONFIGURATION ERROR: SECRET_KEY must be set to a strong secret in production. "
                    "Cannot use the default development key."
                )
            if self.DEBUG:
                # Force DEBUG false in production
                self.DEBUG = False
        return self

settings = Settings()
