import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import engine, Base, AsyncSessionLocal
import backend.app.models.v5  # Ensure all V5 models are registered with Base.metadata

_tables_created = False

@pytest_asyncio.fixture(scope="function", autouse=True)
async def prepare_database():
    global _tables_created
    if not _tables_created:
        async with engine.begin() as conn:
            await conn.exec_driver_sql("PRAGMA synchronous = OFF")
            await conn.exec_driver_sql("PRAGMA journal_mode = MEMORY")
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        _tables_created = True
    yield
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())

@pytest_asyncio.fixture
async def async_session():
    async with AsyncSessionLocal() as session:
        yield session

