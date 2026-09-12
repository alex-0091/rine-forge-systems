import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import engine, Base, AsyncSessionLocal

@pytest_asyncio.fixture(scope="function", autouse=True)
async def prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def async_session():
    async with AsyncSessionLocal() as session:
        yield session
