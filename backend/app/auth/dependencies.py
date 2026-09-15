from typing import Optional, List
from fastapi import Depends, HTTPException, Header, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.auth.security import decode_access_token
from backend.app.models.v5 import User, Business, BusinessUser

security_bearer = HTTPBearer(auto_error=False)

async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    session: AsyncSession = Depends(get_db)
) -> User:
    """
    Authenticates the current user via JWT Bearer token.
    Enforces server-side identity resolution. Never trusts user IDs sent by clients.
    """
    if not auth_header or not auth_header.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(auth_header.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    stmt = select(User).where(User.id == user_id)
    res = await session.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated or suspended"
        )

    return user

def require_role(allowed_roles: List[str]):
    """
    Role-Based Access Control (RBAC) dependency factory.
    Allowed roles: SUPER_ADMIN, BUSINESS_OWNER, BUSINESS_ADMIN, STAFF
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "SUPER_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action prohibited. Requires one of roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

from fastapi import Depends, HTTPException, status, Header, Query

async def get_current_tenant(
    business_id: Optional[str] = Header(None, alias="X-Business-ID"),
    query_biz_id: Optional[str] = Query(None, alias="business_id"),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
) -> Business:
    """
    Enforces strict tenant isolation at the database layer.
    Validates that:
    1. The requested business exists.
    2. The authenticated user belongs to this business (via BusinessUser) OR is a SUPER_ADMIN.
    If unauthorized: Returns 403 Forbidden. Cross-tenant access is strictly blocked.
    """
    target_biz_id = business_id or query_biz_id
    if not target_biz_id:
        stmt_mem = select(BusinessUser).where(BusinessUser.user_id == current_user.id).limit(1)
        res_mem = await session.execute(stmt_mem)
        mem = res_mem.scalar_one_or_none()
        if mem:
            target_biz_id = mem.business_id
        else:
            stmt_own = select(Business).where(Business.owner_id == current_user.id).limit(1)
            res_own = await session.execute(stmt_own)
            own = res_own.scalar_one_or_none()
            if own:
                target_biz_id = own.id

    if not target_biz_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business tenant context required."
        )

    # 1. Fetch business
    stmt_biz = select(Business).where(Business.id == target_biz_id)
    res_biz = await session.execute(stmt_biz)
    biz = res_biz.scalar_one_or_none()

    if not biz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business #{target_biz_id} not found"
        )

    # 2. Super admin bypasses tenant ownership checks
    if current_user.role == "SUPER_ADMIN":
        return biz

    # 3. Check tenant membership
    stmt_membership = select(BusinessUser).where(
        BusinessUser.business_id == target_biz_id,
        BusinessUser.user_id == current_user.id
    )
    res_mem = await session.execute(stmt_membership)
    membership = res_mem.scalar_one_or_none()

    if not membership and biz.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Access to another business's data is strictly prohibited."
        )

    return biz
