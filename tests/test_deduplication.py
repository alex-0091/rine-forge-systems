import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.database import Base
from backend.app.models.business import Business
from backend.app.discovery.deduplicator import deduplicator
from backend.app.discovery.normalizer import normalizer

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.mark.asyncio
async def test_normalizer():
    assert normalizer.normalize_company_name("Biscayne Bay Dental, LLC") == "biscayne bay dental"
    assert normalizer.normalize_company_name("Apex Advisory Corp.") == "apex advisory"
    assert normalizer.normalize_domain("https://www.example.com/contact?ref=123") == "example.com"
    assert normalizer.normalize_domain("http://demo.example.co.uk/") == "demo.example.co.uk"
    assert normalizer.normalize_email("  Sarah.J@Clinic.com ") == "sarah.j@clinic.com"

@pytest.mark.asyncio
async def test_deduplication_by_domain_and_name(async_session: AsyncSession):
    # Insert initial business
    biz = Business(
        name="Biscayne Bay Dental Clinic",
        normalized_name="biscayne bay dental clinic",
        industry="Dental",
        country="USA",
        website_url="https://www.biscayne-dental-demo.com",
        normalized_domain="biscayne-dental-demo.com",
        primary_email="dr.sarah@biscayne-dental-demo.com"
    )
    async_session.add(biz)
    await async_session.commit()

    # 1. Deduplicate matching domain
    dup1 = await deduplicator.find_existing_business(
        session=async_session,
        name="Different Name But Same URL",
        website_url="https://biscayne-dental-demo.com/about"
    )
    assert dup1 is not None
    assert dup1.id == biz.id

    # 2. Deduplicate matching email
    dup2 = await deduplicator.find_existing_business(
        session=async_session,
        name="Another Name",
        email="dr.sarah@biscayne-dental-demo.com"
    )
    assert dup2 is not None
    assert dup2.id == biz.id

    # 3. Deduplicate matching normalized name
    dup3 = await deduplicator.find_existing_business(
        session=async_session,
        name="Biscayne Bay Dental Clinic, LLC"
    )
    assert dup3 is not None
    assert dup3.id == biz.id

    # 4. Truly new business
    new_biz = await deduplicator.find_existing_business(
        session=async_session,
        name="Unique Plumbing Services",
        website_url="https://unique-plumbing.com",
        email="info@unique-plumbing.com"
    )
    assert new_biz is None
