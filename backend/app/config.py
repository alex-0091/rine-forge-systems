import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database - in Vercel Serverless / Lambda use /tmp/ directory
    DATABASE_URL: str = (
        "sqlite+aiosqlite:////tmp/outreach_ai.db"
        if (os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))
        else "sqlite+aiosqlite:///./outreach_ai.db"
    )

    # AI / LLM Providers (OpenAI, Gemini, Mock)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_REASONING_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    LLM_PROVIDER: str = "auto"  # "auto", "openai", "gemini", "mock"
    DEFAULT_MODEL: str = "gpt-4o-mini"
    REASONING_MODEL: str = "gpt-4o"

    # Operating Mode & Controls
    DRY_RUN: bool = True
    AUTO_REPLY_ENABLED: bool = False
    GLOBAL_KILL_SWITCH: bool = False

    # Rate Limiting
    MAX_DAILY_EMAILS: int = 50
    MAX_HOURLY_EMAILS: int = 10
    MIN_SEND_DELAY_SECONDS: int = 180
    MAX_SEND_DELAY_SECONDS: int = 600
    SENDING_HOURS_START: int = 9
    SENDING_HOURS_END: int = 17
    SENDING_TIMEZONE: str = "UTC"

    # Lead defaults
    DEFAULT_LEAD_THRESHOLD: int = 75
    DEFAULT_COUNTRY: str = "USA"

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

settings = Settings()
