"""
Rine Forge Systems V5 - Auth API Router
Handles User Registration, Login, Current User profile, and Logout.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import User
from backend.app.auth.service import auth_service
from backend.app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["V5 Auth"])

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    role: Optional[str] = "BUSINESS_OWNER"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest, session: AsyncSession = Depends(get_db)):
    """Registers a new user and provisions their primary business tenant."""
    return await auth_service.register_user(
        session=session,
        email=payload.email,
        name=payload.name,
        password=payload.password,
        role=payload.role or "BUSINESS_OWNER",
        business_name=payload.business_name
    )

@router.post("/login")
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_db)):
    """Authenticates credentials and returns a JWT bearer token."""
    return await auth_service.authenticate_user(
        session=session,
        email=payload.email,
        password=payload.password
    )

@router.get("/me")
async def get_current_user_profile(user: User = Depends(get_current_user)):
    """Returns profile information for the authenticated user."""
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    """Acknowledges token invalidation for stateless JWT."""
    return {"status": "success", "message": "Successfully logged out"}
