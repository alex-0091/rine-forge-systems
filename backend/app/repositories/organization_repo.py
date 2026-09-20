"""
Rine Forge Systems V5 - Organization Repository
Handles data access for multi-tenant businesses and memberships.
"""
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.repository import BaseRepository
from backend.app.models.v5 import V5Business, V5BusinessUser

class OrganizationRepository(BaseRepository[V5Business]):
    def __init__(self):
        super().__init__(V5Business)

    async def get_membership(
        self,
        session: AsyncSession,
        organization_id: str,
        user_id: str
    ) -> Optional[V5BusinessUser]:
        stmt = select(V5BusinessUser).where(
            V5BusinessUser.business_id == organization_id,
            V5BusinessUser.user_id == user_id
        )
        res = await session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_user_organizations(
        self,
        session: AsyncSession,
        user_id: str
    ) -> List[V5Business]:
        stmt = (
            select(V5Business)
            .join(V5BusinessUser, V5BusinessUser.business_id == V5Business.id)
            .where(V5BusinessUser.user_id == user_id)
        )
        res = await session.execute(stmt)
        return list(res.scalars().all())

    async def add_membership(
        self,
        session: AsyncSession,
        organization_id: str,
        user_id: str,
        role: str = "BUSINESS_ADMIN",
        permissions: Optional[List[str]] = None
    ) -> V5BusinessUser:
        membership = V5BusinessUser(
            business_id=organization_id,
            user_id=user_id,
            role=role,
            permissions=permissions or ["ALL"]
        )
        session.add(membership)
        await session.flush()
        return membership

organization_repository = OrganizationRepository()
