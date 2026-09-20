from typing import Optional, List
from fastapi import Depends, HTTPException, Header, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.auth.security import decode_access_token
from backend.app.models.v5 import User, Business, BusinessUser, Workspace

security_bearer = HTTPBearer(auto_error=False)

ROLE_LEVELS = {
    "STAFF": 1,
    "MEMBER": 1,
    "BUSINESS_ADMIN": 2,
    "ADMIN": 2,
    "BUSINESS_OWNER": 3,
    "OWNER": 3,
    "SUPER_ADMIN": 4,
}

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

# Standard alias
require_user = get_current_user

def require_role(allowed_roles: List[str]):
    """
    Platform Role-Based Access Control (RBAC) dependency factory.
    Allowed roles: SUPER_ADMIN, BUSINESS_OWNER, BUSINESS_ADMIN, STAFF (or OWNER, ADMIN, MEMBER)
    """
    # Normalize aliases
    alias_map = {"OWNER": "BUSINESS_OWNER", "ADMIN": "BUSINESS_ADMIN", "MEMBER": "STAFF"}
    normalized_roles = set()
    for r in allowed_roles:
        normalized_roles.add(r)
        if r in alias_map:
            normalized_roles.add(alias_map[r])

    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in normalized_roles and current_user.role != "SUPER_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action prohibited. Requires one of roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

async def get_current_tenant(
    business_id: Optional[str] = Header(None, alias="X-Business-ID"),
    organization_id: Optional[str] = Header(None, alias="X-Organization-ID"),
    query_biz_id: Optional[str] = Query(None, alias="business_id"),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
) -> Business:
    """
    Enforces strict tenant isolation at the database layer.
    Validates that:
    1. The requested business/organization exists.
    2. The authenticated user belongs to this business (via BusinessUser) OR is a SUPER_ADMIN.
    If unauthorized: Returns 403 Forbidden. Cross-tenant access is strictly blocked.
    """
    target_biz_id = business_id or organization_id or query_biz_id
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

# Standard aliases
require_tenant = get_current_tenant
require_organization_access = get_current_tenant

def require_organization_role(min_role: str):
    """
    Ensures the user has at least min_role within the current organization.
    Supported: OWNER, ADMIN, MEMBER
    """
    target_level = ROLE_LEVELS.get(min_role.upper(), 1)

    async def checker(
        tenant: Business = Depends(get_current_tenant),
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_db)
    ) -> Business:
        if current_user.role == "SUPER_ADMIN" or tenant.owner_id == current_user.id:
            return tenant

        stmt_membership = select(BusinessUser).where(
            BusinessUser.business_id == tenant.id,
            BusinessUser.user_id == current_user.id
        )
        res_mem = await session.execute(stmt_membership)
        membership = res_mem.scalar_one_or_none()

        user_level = ROLE_LEVELS.get(membership.role.upper() if membership else "MEMBER", 1)
        if user_level < target_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient organization permissions. Required role: {min_role}"
            )
        return tenant

    return checker

async def require_workspace_access(
    workspace_id: Optional[str] = Header(None, alias="X-Workspace-ID"),
    query_ws_id: Optional[str] = Query(None, alias="workspace_id"),
    tenant: Business = Depends(get_current_tenant),
    session: AsyncSession = Depends(get_db)
) -> Workspace:
    """
    Enforces workspace boundary within the authenticated organization.
    Ensures the workspace belongs to the verified tenant.
    """
    target_ws_id = workspace_id or query_ws_id
    if target_ws_id:
        stmt = select(Workspace).where(
            Workspace.id == target_ws_id,
            Workspace.business_id == tenant.id
        )
        res = await session.execute(stmt)
        ws = res.scalar_one_or_none()
        if not ws:
            # Check if workspace exists under another tenant
            stmt_other = select(Workspace).where(Workspace.id == target_ws_id)
            res_other = await session.execute(stmt_other)
            if res_other.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized: Workspace belongs to another organization."
                )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workspace #{target_ws_id} not found"
            )
        return ws

    # Fallback to default workspace
    stmt_def = select(Workspace).where(
        Workspace.business_id == tenant.id,
        Workspace.slug == "default"
    ).limit(1)
    res_def = await session.execute(stmt_def)
    ws = res_def.scalar_one_or_none()

    if not ws:
        # Fallback to any workspace in tenant or auto-create default workspace
        stmt_any = select(Workspace).where(Workspace.business_id == tenant.id).limit(1)
        res_any = await session.execute(stmt_any)
        ws = res_any.scalar_one_or_none()

    if not ws:
        ws = Workspace(
            business_id=tenant.id,
            name="Default Workspace",
            slug="default",
            status="ACTIVE"
        )
        session.add(ws)
        await session.commit()
        await session.refresh(ws)

    return ws
