import uuid
import os
from datetime import datetime, timezone
from typing import AsyncGenerator
from sqlalchemy import DateTime, String, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from backend.app.config import settings

def _build_engine_url(url: str) -> str:
    """
    Normalizes DATABASE_URL for async SQLAlchemy:
    - Neon/PostgreSQL: 'postgresql://' -> 'postgresql+asyncpg://'
    - Neon/PostgreSQL: 'postgres://' -> 'postgresql+asyncpg://'  (Render/Vercel style)
    - SQLite: kept as-is (already uses aiosqlite dialect)
    """
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url

# Allow Vercel / Neon DATABASE_URL env var to override the config default
_raw_url = os.environ.get("DATABASE_URL") or settings.DATABASE_URL
# Strip empty string — if DATABASE_URL="" treat as not set
if not _raw_url or not _raw_url.strip():
    _raw_url = settings.DATABASE_URL
_db_url = _build_engine_url(_raw_url)

_is_postgres = "postgresql" in _db_url

# Engine settings differ between SQLite (single-threaded) and PostgreSQL (pooled)
if _is_postgres:
    engine = create_async_engine(
        _db_url,
        echo=False,
        future=True,
        pool_pre_ping=True,       # Detect stale Neon connections after scale-to-zero
        pool_size=3,               # Small pool — Neon free tier limits concurrent connections
        max_overflow=2,
        pool_timeout=30,
        pool_recycle=1800,         # Recycle connections every 30 min
    )
else:
    # SQLite: simple async engine, no pooling tweaks needed for aiosqlite
    engine = create_async_engine(
        _db_url,
        echo=False,
        future=True,
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Creates all tables. Resilient to repeated calls and serverless cold starts."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"init_db warning (non-fatal on serverless): {e}")
