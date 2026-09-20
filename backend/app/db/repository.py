"""
Rine Forge Systems V5 - Base Repository Pattern
Provides clean database abstraction isolating SQLAlchemy queries from API route handlers.
Translates underlying database exceptions into standard DatabaseError.
"""
from typing import TypeVar, Generic, Type, Optional, List, Any, Dict
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from backend.app.errors.exceptions import DatabaseError, NotFoundError

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    """
    Generic async repository providing CRUD operations
    with error handling and tenant awareness.
    """
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_by_id(self, session: AsyncSession, id: str) -> Optional[ModelType]:
        try:
            stmt = select(self.model).where(self.model.id == id)
            result = await session.execute(stmt)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseError(
                message="Failed to retrieve record from database.",
                technical_error=str(e)
            )

    async def list_all(
        self,
        session: AsyncSession,
        limit: int = 50,
        offset: int = 0,
        **filters
    ) -> List[ModelType]:
        try:
            stmt = select(self.model)
            for field, value in filters.items():
                if hasattr(self.model, field) and value is not None:
                    stmt = stmt.where(getattr(self.model, field) == value)
            stmt = stmt.limit(limit).offset(offset)
            result = await session.execute(stmt)
            return list(result.scalars().all())
        except SQLAlchemyError as e:
            raise DatabaseError(
                message="Failed to query records from database.",
                technical_error=str(e)
            )

    async def create(self, session: AsyncSession, **attributes) -> ModelType:
        try:
            instance = self.model(**attributes)
            session.add(instance)
            await session.flush()
            return instance
        except SQLAlchemyError as e:
            raise DatabaseError(
                message="Failed to insert record into database.",
                technical_error=str(e)
            )

    async def update(self, session: AsyncSession, id: str, **attributes) -> Optional[ModelType]:
        try:
            instance = await self.get_by_id(session, id)
            if not instance:
                return None
            for key, val in attributes.items():
                if hasattr(instance, key):
                    setattr(instance, key, val)
            await session.flush()
            return instance
        except SQLAlchemyError as e:
            raise DatabaseError(
                message="Failed to update database record.",
                technical_error=str(e)
            )

    async def delete(self, session: AsyncSession, id: str) -> bool:
        try:
            instance = await self.get_by_id(session, id)
            if not instance:
                return False
            await session.delete(instance)
            await session.flush()
            return True
        except SQLAlchemyError as e:
            raise DatabaseError(
                message="Failed to delete database record.",
                technical_error=str(e)
            )
