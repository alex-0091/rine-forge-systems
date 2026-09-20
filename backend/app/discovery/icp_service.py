"""
Rine Forge Systems V5 - Ideal Customer Profile (ICP) Service
Defines, validates, and manages B2B Ideal Customer Profiles.
Transforms business targeting criteria into authoritative search specifications.
"""
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.lead_engine import V5IdealCustomerProfile
from backend.app.discovery.pipeline_v5 import lead_discovery_pipeline

logger = logging.getLogger("rine_forge_systems.discovery.icp")

class ICPService:
    """
    Manages Ideal Customer Profile definitions and search executions.
    """

    async def create_icp(
        self,
        session: AsyncSession,
        business_id: str,
        name: str,
        industry: str,
        company_size: str = "5-50",
        country: str = "USA",
        city_region: str = "Austin, TX",
        services: Optional[List[str]] = None,
        technologies: Optional[List[str]] = None,
        revenue_range: Optional[str] = None,
        target_roles: Optional[List[str]] = None,
        keywords: Optional[List[str]] = None,
        business_characteristics: Optional[List[str]] = None,
        exclusions: Optional[List[str]] = None
    ) -> V5IdealCustomerProfile:
        """Creates a new Ideal Customer Profile specification."""
        icp = V5IdealCustomerProfile(
            business_id=business_id,
            name=name.strip(),
            industry=industry.strip(),
            company_size=company_size,
            country=country.strip(),
            city_region=city_region.strip(),
            services=services or [],
            technologies=technologies or [],
            revenue_range=revenue_range,
            target_roles=target_roles or ["Owner", "Practice Manager"],
            keywords=keywords or [],
            business_characteristics=business_characteristics or [],
            exclusions=exclusions or [],
            is_active=True
        )
        session.add(icp)
        await session.commit()
        await session.refresh(icp)
        logger.info(f"Created ICP '{icp.name}' (#{icp.id}) for business #{business_id}")
        return icp

    async def get_icp(
        self,
        session: AsyncSession,
        business_id: str,
        icp_id: str
    ) -> V5IdealCustomerProfile:
        """Fetches an ICP ensuring strict tenant isolation."""
        stmt = select(V5IdealCustomerProfile).where(
            V5IdealCustomerProfile.id == icp_id,
            V5IdealCustomerProfile.business_id == business_id
        )
        res = await session.execute(stmt)
        icp = res.scalar_one_or_none()
        if not icp:
            raise HTTPException(status_code=404, detail=f"ICP #{icp_id} not found")
        return icp

    async def list_icps(
        self,
        session: AsyncSession,
        business_id: str
    ) -> List[V5IdealCustomerProfile]:
        """Lists all ICPs belonging to the authenticated tenant."""
        stmt = select(V5IdealCustomerProfile).where(
            V5IdealCustomerProfile.business_id == business_id
        ).order_by(V5IdealCustomerProfile.created_at.desc())
        res = await session.execute(stmt)
        return list(res.scalars().all())

    async def update_icp(
        self,
        session: AsyncSession,
        business_id: str,
        icp_id: str,
        updates: Dict[str, Any]
    ) -> V5IdealCustomerProfile:
        """Updates an ICP specification within tenant scope."""
        icp = await self.get_icp(session, business_id, icp_id)
        
        allowed_fields = [
            "name", "industry", "company_size", "country", "city_region",
            "services", "technologies", "revenue_range", "target_roles",
            "keywords", "business_characteristics", "exclusions", "is_active"
        ]
        for field in allowed_fields:
            if field in updates:
                setattr(icp, field, updates[field])

        await session.commit()
        await session.refresh(icp)
        logger.info(f"Updated ICP #{icp.id} for business #{business_id}")
        return icp

    async def delete_icp(
        self,
        session: AsyncSession,
        business_id: str,
        icp_id: str
    ) -> bool:
        """Deletes an ICP specification."""
        icp = await self.get_icp(session, business_id, icp_id)
        await session.delete(icp)
        await session.commit()
        logger.info(f"Deleted ICP #{icp_id} for business #{business_id}")
        return True

    async def run_discovery_from_icp(
        self,
        session: AsyncSession,
        business_id: str,
        icp_id: str,
        max_results: int = 10,
        auto_draft_outreach: bool = True
    ) -> Dict[str, Any]:
        """
        Executes a targeted discovery run using the ICP as the search specification.
        """
        icp = await self.get_icp(session, business_id, icp_id)
        logger.info(f"Executing discovery run using ICP '{icp.name}' ({icp.industry} in {icp.city_region})")

        res = await lead_discovery_pipeline.execute_discovery_run(
            session=session,
            business_id=business_id,
            industry=icp.industry,
            location=icp.city_region,
            services=icp.services or [f"{icp.industry} Services"],
            source_type="PUBLIC_BUSINESS_DATA",
            max_results=max_results,
            auto_draft_outreach=auto_draft_outreach
        )
        res["discovered_count"] = res.get("total_enrolled", 0)
        return res

icp_service = ICPService()
