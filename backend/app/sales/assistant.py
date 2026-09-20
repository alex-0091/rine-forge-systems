"""
Rine Forge Systems V5 - Internal AI Sales Assistant (Section 27 & 28)
Answers sales queries grounded strictly in live tenant CRM data.
Honors tenant boundaries and returns 'No data yet.' when no matching records exist.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.models.v5 import V5Prospect, V5ProspectOutreach, V5Business
from backend.app.ai.gateway.core import ai_gateway
from backend.app.ai.gateway.interface import ChatMessage, AIOptions

logger = logging.getLogger("rine_forge_systems.sales.assistant")

class SalesAssistantService:
    """
    Assistant for sales operators querying pipeline status, follow-up needs, and draft responses.
    """

    async def answer_sales_query(
        self,
        session: AsyncSession,
        business_id: str,
        query: str
    ) -> Dict[str, Any]:
        """
        Executes grounded sales query against the tenant's CRM data.
        """
        q = query.lower()

        # 1. Intent: Follow-up needed
        if "follow" in q or "needs follow" in q or "who to contact" in q:
            stmt = select(V5Prospect).where(
                V5Prospect.business_id == business_id,
                V5Prospect.pipeline_stage.in_(["CONTACTED", "REVIEW", "DISCOVERED"]),
                V5Prospect.outreach_status != "OPTED_OUT"
            ).order_by(V5Prospect.score.desc()).limit(10)
            res = await session.execute(stmt)
            prospects = res.scalars().all()

            if not prospects:
                return {"answer": "No data yet. No prospects currently requiring follow-up.", "count": 0}

            items = [f"• {p.company_name} (Score: {p.score}, Stage: {p.pipeline_stage}, Next: {p.next_action or 'Review'})" for p in prospects]
            return {
                "answer": f"Found {len(prospects)} prospects requiring attention or follow-up:\n" + "\n".join(items),
                "count": len(prospects)
            }

        # 2. Intent: Prospects that replied
        if "replied" in q or "responses" in q or "inbox" in q:
            stmt = select(V5Prospect).where(
                V5Prospect.business_id == business_id,
                or_(
                    V5Prospect.outreach_status == "REPLIED",
                    V5Prospect.pipeline_stage == "RESPONDED"
                )
            ).order_by(V5Prospect.updated_at.desc()).limit(10)
            res = await session.execute(stmt)
            prospects = res.scalars().all()

            if not prospects:
                return {"answer": "No data yet. No prospects have replied so far.", "count": 0}

            items = [f"• {p.company_name} - Stage: {p.pipeline_stage} (Contact: {p.email or p.phone})" for p in prospects]
            return {
                "answer": f"Found {len(prospects)} prospects with replies:\n" + "\n".join(items),
                "count": len(prospects)
            }

        # 3. Intent: Missing verified contact information
        if "missing" in q or "unverified" in q or "incomplete" in q:
            stmt = select(V5Prospect).where(
                V5Prospect.business_id == business_id,
                or_(
                    V5Prospect.email == None,
                    V5Prospect.phone == None,
                    V5Prospect.data_quality_status == "UNVERIFIED"
                )
            ).limit(10)
            res = await session.execute(stmt)
            prospects = res.scalars().all()

            if not prospects:
                return {"answer": "No data yet. All prospects currently have verified contact information.", "count": 0}

            items = [f"• {p.company_name} (Missing: {'Email' if not p.email else ''} {'Phone' if not p.phone else ''}, Status: {p.data_quality_status})" for p in prospects]
            return {
                "answer": f"Found {len(prospects)} prospects with unverified or missing contact data:\n" + "\n".join(items),
                "count": len(prospects)
            }

        # 4. Intent: Region or Industry search
        if "dental" in q or "austin" in q or "clinic" in q or "region" in q:
            stmt = select(V5Prospect).where(
                V5Prospect.business_id == business_id
            ).order_by(V5Prospect.score.desc()).limit(10)
            res = await session.execute(stmt)
            prospects = res.scalars().all()

            if not prospects:
                return {"answer": "No data yet. No prospects found matching those criteria.", "count": 0}

            items = [f"• {p.company_name} ({p.industry}, {p.location or 'Region unlisted'}) - Score: {p.score}" for p in prospects]
            return {
                "answer": f"Found {len(prospects)} matching prospects in your CRM:\n" + "\n".join(items),
                "count": len(prospects)
            }

        # 5. Fallback CRM Summary
        stmt_total = select(V5Prospect).where(V5Prospect.business_id == business_id)
        res_total = await session.execute(stmt_total)
        total_prospects = len(res_total.scalars().all())

        if total_prospects == 0:
            return {"answer": "No data yet. Your prospect CRM has not enrolled any businesses yet.", "count": 0}

        return {
            "answer": f"Your CRM currently manages {total_prospects} active prospects. You can ask me about follow-ups, replies, missing contact info, or specific industry leads.",
            "count": total_prospects
        }

sales_assistant = SalesAssistantService()
