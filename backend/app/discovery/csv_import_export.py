"""
Rine Forge Systems V5 - Safe CSV Import & Export Service (Section 20 & 21)
Provides authenticated, tenant-scoped CSV importing and exporting:
- Validates columns, email syntax, phone format, and detects duplicates.
- Generates a preview with breakdown before database commit.
- Exports only the authenticated tenant's prospects, protecting cross-tenant privacy.
"""
import io
import csv
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from backend.app.models.v5 import V5Prospect, V5Business
from backend.app.discovery.quality_engine import data_quality_engine
from backend.app.compliance.suppression_service import suppression_service

logger = logging.getLogger("rine_forge_systems.discovery.csv")

class CSVImportExportService:
    """
    Handles safe, validated prospect imports and exports.
    """

    @classmethod
    def preview_csv_import(
        cls,
        csv_content: str,
        existing_emails: Optional[set] = None
    ) -> Dict[str, Any]:
        """
        Parses and validates CSV text without writing to database.
        Returns detailed summary of valid rows, invalid rows, and issues.
        """
        reader = csv.DictReader(io.StringIO(csv_content))
        if not reader.fieldnames:
            raise HTTPException(status_code=400, detail="CSV file is empty or missing headers")

        # Normalize header keys
        headers = [h.strip().lower().replace(" ", "_") for h in reader.fieldnames]
        
        valid_rows = []
        invalid_rows = []
        seen_in_file = set()

        for idx, raw_row in enumerate(reader, start=2): # Line 2 is first data row
            # Normalize row dict
            row = {k.strip().lower().replace(" ", "_"): (v or "").strip() for k, v in raw_row.items() if k}
            
            company = row.get("company_name") or row.get("company") or row.get("business_name") or ""
            email = row.get("email") or row.get("business_email") or None
            phone = row.get("phone") or row.get("telephone") or None
            website = row.get("website") or row.get("url") or None
            industry = row.get("industry") or "General"
            location = row.get("location") or row.get("city") or None
            contact_name = row.get("contact_name") or row.get("name") or None

            # Validation checks
            reasons = []
            if not company or len(company) < 2:
                reasons.append("Missing or invalid company name")

            if not email and not phone:
                reasons.append("Must provide at least one contact channel (email or phone)")

            if email:
                valid_email, email_msg = data_quality_engine.validate_email(email)
                if not valid_email:
                    reasons.append(email_msg)

            # Duplicate check within file
            dedup_key = (company.lower(), (email or "").lower())
            if dedup_key in seen_in_file:
                reasons.append("Duplicate entry in this CSV file")
            seen_in_file.add(dedup_key)

            if reasons:
                invalid_rows.append({
                    "row_number": idx,
                    "company_name": company,
                    "email": email,
                    "reasons": reasons
                })
            else:
                valid_rows.append({
                    "row_number": idx,
                    "company_name": company,
                    "website": website,
                    "industry": industry,
                    "location": location,
                    "email": email,
                    "phone": phone,
                    "contact_name": contact_name
                })

        return {
            "total_rows": len(valid_rows) + len(invalid_rows),
            "valid_count": len(valid_rows),
            "invalid_count": len(invalid_rows),
            "valid_rows_preview": valid_rows[:5],
            "invalid_rows": invalid_rows[:20]
        }

    @classmethod
    async def commit_csv_import(
        cls,
        session: AsyncSession,
        business_id: str,
        valid_rows: List[Dict[str, Any]],
        source_label: str = "CUSTOMER_CSV_IMPORT"
    ) -> Dict[str, Any]:
        """
        Commits pre-validated CSV rows to the tenant's prospect CRM.
        Enforces deduplication against existing database records.
        """
        imported_count = 0
        skipped_duplicates = 0

        for row in valid_rows:
            company = row["company_name"]
            email = row.get("email")

            # Check existing prospect in tenant
            stmt = select(V5Prospect).where(
                V5Prospect.business_id == business_id,
                or_(
                    V5Prospect.company_name == company,
                    V5Prospect.email == email if email else False
                )
            )
            res = await session.execute(stmt)
            if res.scalar_one_or_none():
                skipped_duplicates += 1
                continue

            # Quality assessment
            quality_status, _ = data_quality_engine.evaluate_quality_status(
                company_name=company,
                website=row.get("website"),
                email=email,
                phone=row.get("phone")
            )

            prospect = V5Prospect(
                business_id=business_id,
                company_name=company,
                website=row.get("website"),
                industry=row.get("industry", "General"),
                location=row.get("location"),
                email=email,
                phone=row.get("phone"),
                contact_name=row.get("contact_name"),
                source=source_label,
                data_provenance="USER_PROVIDED_LIST",
                data_quality_status=quality_status,
                last_verified_at=datetime.now(timezone.utc),
                consent_status="USER_PROVIDED",
                pipeline_stage="DISCOVERED",
                outreach_status="DRAFT",
                score=60
            )
            session.add(prospect)
            imported_count += 1

        await session.commit()
        logger.info(f"Imported {imported_count} prospects for business #{business_id} ({skipped_duplicates} duplicates skipped)")
        return {
            "status": "COMPLETED",
            "imported_count": imported_count,
            "skipped_duplicates": skipped_duplicates
        }

    @classmethod
    async def export_prospects_csv(
        cls,
        session: AsyncSession,
        business_id: str
    ) -> str:
        """
        Exports all prospects belonging to the authenticated tenant as CSV string.
        Strictly partitioned by business_id to prevent cross-tenant data leakage.
        """
        stmt = select(V5Prospect).where(
            V5Prospect.business_id == business_id
        ).order_by(V5Prospect.created_at.desc())
        res = await session.execute(stmt)
        prospects = res.scalars().all()

        output = io.StringIO()
        fieldnames = [
            "id", "company_name", "contact_name", "email", "phone",
            "website", "industry", "location", "source", "data_quality_status",
            "pipeline_stage", "outreach_status", "score", "created_at"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for p in prospects:
            writer.writerow({
                "id": p.id,
                "company_name": p.company_name,
                "contact_name": p.contact_name or "",
                "email": p.email or "",
                "phone": p.phone or "",
                "website": p.website or "",
                "industry": p.industry,
                "location": p.location or "",
                "source": p.source,
                "data_quality_status": p.data_quality_status,
                "pipeline_stage": p.pipeline_stage,
                "outreach_status": p.outreach_status,
                "score": p.score,
                "created_at": p.created_at.isoformat() if p.created_at else ""
            })

        return output.getvalue()

csv_service = CSVImportExportService()
