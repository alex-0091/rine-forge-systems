"""
Rine Forge Systems V5 - Workspace Repository
Handles data access for workspace partitioning within an organization.
"""
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.repository import BaseRepository
from backend.app.models.v5 import V5Workspace

class WorkspaceRepository(BaseRepository[V5Workspace]):
    def __init__(self):
        super().__init__(V5Workspace)

    async def get_by_organization(
        self,
        session: AsyncSession,
        organization_id: str
    ) -> List[V5Workspace]:
        stmt = select(V5Workspace).where(V5Workspace.business_id == organization_id)
        res = await session.execute(stmt)
        return list(res.scalars().all())

    async def get_default_workspace(
        self,
        session: AsyncSession,
        organization_id: str
    ) -> Optional[V5Workspace]:
        stmt = (
            select(V5Workspace)
            .where(
                V5Workspace.business_id == organization_id,
                V5Workspace.slug == "default"
            )
            .limit(1)
        )
        res = await session.execute(stmt)
        ws = res.scalar_one_or_none()
        if not ws:
            # Fallback to first workspace in org
            stmt_any = (
                select(V5Workspace)
                .where(V5Workspace.business_id == organization_id)
                .limit(1)
            )
            res_any = await session.execute(stmt_any)
            ws = res_any.scalar_one_or_none()
        return ws

    async def create_workspace(
        self,
        session: AsyncSession,
        organization_id: str,
        name: str = "Default Workspace",
        slug: str = "default"
    ) -> V5Workspace:
        return await self.create(
            session,
            business_id=organization_id,
            name=name,
            slug=slug,
            status="ACTIVE"
        )

workspace_repository = WorkspaceRepository()
