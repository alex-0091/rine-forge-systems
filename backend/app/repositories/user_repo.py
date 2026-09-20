"""
Rine Forge Systems V5 - User Repository
Handles data access for platform user accounts.
"""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.repository import BaseRepository
from backend.app.models.v5 import V5User

class UserRepository(BaseRepository[V5User]):
    def __init__(self):
        super().__init__(V5User)

    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[V5User]:
        clean_email = email.strip().lower()
        stmt = select(V5User).where(V5User.email == clean_email)
        res = await session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_user(
        self,
        session: AsyncSession,
        email: str,
        name: str,
        password_hash: str,
        role: str = "BUSINESS_OWNER"
    ) -> V5User:
        return await self.create(
            session,
            email=email.strip().lower(),
            name=name.strip(),
            password_hash=password_hash,
            role=role,
            status="ACTIVE"
        )

user_repository = UserRepository()
