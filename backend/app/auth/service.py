import logging
from typing import Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.v5 import User, Business, BusinessUser, AIEmployee, Workspace
from backend.app.auth.security import hash_password, verify_password, create_access_token

logger = logging.getLogger("rine_forge_systems.auth.service")

class AuthService:
    """
    Authoritative authentication service managing user registration,
    credential verification, tenant provisioning, and session tokens.
    """

    async def register_user(
        self,
        session: AsyncSession,
        email: str,
        name: str,
        password: str,
        role: str = "BUSINESS_OWNER",
        business_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Registers a new user and optionally provisions their primary business tenant.
        """
        clean_email = email.strip().lower()

        # Check existing user
        stmt = select(User).where(User.email == clean_email)
        res = await session.execute(stmt)
        if res.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email '{clean_email}' already exists"
            )

        # Create user
        pw_hash = hash_password(password)
        new_user = User(
            email=clean_email,
            name=name.strip(),
            password_hash=pw_hash,
            role=role,
            status="ACTIVE"
        )
        session.add(new_user)
        await session.flush()

        business_id = None
        # Provision primary business tenant if business_name provided or role is BUSINESS_OWNER
        if business_name or role in ["BUSINESS_OWNER", "BUSINESS_ADMIN"]:
            b_name = business_name or f"{name}'s Business"
            new_biz = Business(
                owner_id=new_user.id,
                name=b_name,
                industry="General Services",
                status="ACTIVE",
                business_hours={
                    "monday": "09:00-17:00",
                    "tuesday": "09:00-17:00",
                    "wednesday": "09:00-17:00",
                    "thursday": "09:00-17:00",
                    "friday": "09:00-17:00"
                }
            )
            session.add(new_biz)
            await session.flush()
            business_id = new_biz.id

            # Associate user with business
            biz_user = BusinessUser(
                business_id=new_biz.id,
                user_id=new_user.id,
                role="BUSINESS_OWNER",
                permissions=["ALL"]
            )
            session.add(biz_user)

            # Provision default Workspace for the business
            default_ws = Workspace(
                business_id=new_biz.id,
                name="Default Workspace",
                slug="default",
                status="ACTIVE"
            )
            session.add(default_ws)

            # Provision default Elena AI Employee for the business
            default_ai = AIEmployee(
                business_id=new_biz.id,
                name="Elena",
                role="AI Receptionist",
                model="gpt-4o-mini",
                provider="openai",
                status="ACTIVE"
            )
            session.add(default_ai)

        await session.commit()
        await session.refresh(new_user)

        token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})

        return {
            "token": token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "role": new_user.role
            },
            "business_id": business_id
        }

    async def authenticate_user(
        self,
        session: AsyncSession,
        email: str,
        password: str
    ) -> Dict[str, Any]:
        """
        Validates login credentials and returns signed JWT token.
        """
        clean_email = email.strip().lower()

        stmt = select(User).where(User.email == clean_email)
        res = await session.execute(stmt)
        user = res.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )

        if user.status != "ACTIVE":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive or suspended"
            )

        # Find user's primary business
        stmt_biz = select(BusinessUser).where(BusinessUser.user_id == user.id).limit(1)
        res_biz = await session.execute(stmt_biz)
        membership = res_biz.scalar_one_or_none()

        token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

        return {
            "token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            },
            "business_id": membership.business_id if membership else None
        }

auth_service = AuthService()
