"""
Rine Forge Systems V5 - Integrations API Router
Manages external connections (WhatsApp Meta API, Google Calendar, Stripe) without exposing raw secrets.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import Integration, Business
from backend.app.auth.dependencies import get_current_tenant, require_role

router = APIRouter(prefix="/integrations", tags=["V5 Integrations"])

class IntegrationConfigureRequest(BaseModel):
    provider: str # meta_whatsapp, google_calendar, stripe, hubspot
    type: str = "messaging" # messaging, calendar, crm, payments
    status: str = "CONNECTED"
    metadata: Optional[Dict[str, Any]] = None

@router.get("")
async def list_integrations(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists external system connections for current tenant."""
    stmt = select(Integration).where(Integration.business_id == tenant.id)
    res = await session.execute(stmt)
    integrations = res.scalars().all()

    # If tenant has no custom integrations yet, provide standard platform matrix
    if not integrations:
        return [
            {"provider": "meta_whatsapp", "type": "messaging", "status": "CONNECTED", "notes": "Meta Cloud WhatsApp Gateway"},
            {"provider": "google_calendar", "type": "calendar", "status": "CONNECTED", "notes": "Internal Sync Engine"},
            {"provider": "stripe", "type": "payments", "status": "NOT_CONNECTED", "notes": "Payment Processing"},
            {"provider": "hubspot", "type": "crm", "status": "NOT_CONNECTED", "notes": "CRM Bi-directional Sync"}
        ]

    return [
        {
            "id": i.id,
            "provider": i.provider,
            "type": i.type,
            "status": i.status,
            "metadata": {k: ("***" if "token" in k or "secret" in k or "key" in k else v) for k, v in i.metadata_json.items()}
        }
        for i in integrations
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def configure_integration(
    payload: IntegrationConfigureRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Configures or updates an integration for this business tenant."""
    stmt = select(Integration).where(
        Integration.business_id == tenant.id,
        Integration.provider == payload.provider
    )
    res = await session.execute(stmt)
    integ = res.scalar_one_or_none()

    if not integ:
        integ = Integration(
            business_id=tenant.id,
            provider=payload.provider,
            type=payload.type,
            status=payload.status,
            metadata_json=payload.metadata or {}
        )
        session.add(integ)
    else:
        integ.type = payload.type
        integ.status = payload.status
        if payload.metadata:
            integ.metadata_json = payload.metadata

    await session.commit()
    await session.refresh(integ)

    return {
        "status": "success",
        "integration_id": integ.id,
        "provider": integ.provider,
        "connection_status": integ.status
    }
