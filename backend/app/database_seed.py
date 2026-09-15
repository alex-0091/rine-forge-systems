"""
Rine Forge Systems V5 - Database Seeder
Populates initial multi-tenant data, demo clinic (Rine Dental & Facial Aesthetics),
official services, staff, RAG knowledge chunks, and Elena AI Employee.
"""
import logging
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import AsyncSessionLocal
from backend.app.models.v5 import (
    User, Business, BusinessUser, AIEmployee, Service, Staff,
    KnowledgeDocument, KnowledgeChunk, Automation, Customer, Lead
)
from backend.app.auth.security import hash_password
from backend.app.ai.provider_abstraction import ai_provider

logger = logging.getLogger("rine_forge_systems.seed")

DEMO_BUSINESS_ID = "00000000-0000-0000-0000-000000000001"

async def seed_v5_database():
    """
    Idempotent database seeder for V5.
    Creates demo clinic tenant if not present.
    """
    logger.info("Checking V5 database seeding status...")
    async with AsyncSessionLocal() as session:
        try:
            stmt = select(Business).where(Business.id == DEMO_BUSINESS_ID)
            res = await session.execute(stmt)
            existing_biz = res.scalar_one_or_none()

            if existing_biz:
                logger.info("Demo tenant Rine Dental & Facial Aesthetics already exists.")
                return

            logger.info("Seeding V5 Demo Tenant: Rine Dental & Facial Aesthetics...")

            # 1. Admin / Owner User
            pw_hash = hash_password("Forge2026!Admin")
            owner_user = User(
                email="admin@rinedental.com",
                name="Dr. Sarah Evans",
                password_hash=pw_hash,
                role="BUSINESS_OWNER",
                status="ACTIVE"
            )
            session.add(owner_user)
            await session.flush()

            # 2. Business Tenant
            business = Business(
                id=DEMO_BUSINESS_ID,
                owner_id=owner_user.id,
                name="Rine Dental & Facial Aesthetics",
                industry="Dentistry & Facial Aesthetics",
                description="Premier dental practice specializing in general, cosmetic, and aesthetic dental care with 24/7 AI Receptionist support.",
                phone="+1 (555) 234-5678",
                email="contact@rinedental.com",
                address="742 Evergreen Terrace, Suite 100, Springfield",
                timezone="America/New_York",
                business_hours={
                    "monday": "08:00-17:00",
                    "tuesday": "08:00-17:00",
                    "wednesday": "08:00-17:00",
                    "thursday": "08:00-17:00",
                    "friday": "08:00-17:00",
                    "saturday": "09:00-13:00",
                    "sunday": "CLOSED"
                },
                status="ACTIVE",
                settings_json={
                    "currency": "USD",
                    "appointment_buffer_minutes": 15,
                    "double_booking_allowed": False
                }
            )
            session.add(business)
            await session.flush()

            # 3. User Membership
            biz_user = BusinessUser(
                business_id=business.id,
                user_id=owner_user.id,
                role="BUSINESS_OWNER",
                permissions=["ALL"]
            )
            session.add(biz_user)

            # 4. AI Employee (Elena)
            elena = AIEmployee(
                business_id=business.id,
                name="Elena",
                role="Front Desk AI Receptionist",
                avatar="/avatars/elena.png",
                personality="Warm, attentive, highly professional, reassuring, and concise.",
                system_instructions=(
                    "You are Elena, front desk receptionist at Rine Dental & Facial Aesthetics. "
                    "Help patients check appointments, discover treatments, understand pricing, and schedule visits. "
                    "Never invent prices or open slots. Only provide facts from the clinic database."
                ),
                model="gpt-4o-mini",
                provider="openai",
                status="ACTIVE",
                language="en"
            )
            session.add(elena)

            # 5. Staff Practitioners
            dr_sarah = Staff(
                business_id=business.id,
                name="Dr. Sarah Evans, DDS",
                role="Lead Cosmetic Dentist & Implant Specialist",
                email="dr.sarah@rinedental.com",
                phone="+1 (555) 234-5671",
                working_hours={"monday": "08:00-17:00", "wednesday": "08:00-17:00", "friday": "08:00-17:00"},
                active=True
            )
            dr_michael = Staff(
                business_id=business.id,
                name="Dr. Michael Lee, DMD",
                role="Orthodontist & General Practitioner",
                email="dr.lee@rinedental.com",
                phone="+1 (555) 234-5672",
                working_hours={"tuesday": "08:00-17:00", "thursday": "08:00-17:00", "saturday": "09:00-13:00"},
                active=True
            )
            session.add_all([dr_sarah, dr_michael])

            # 6. Service Catalog
            services = [
                Service(
                    business_id=business.id,
                    name="Comprehensive Oral Exam & Cleaning",
                    description="Full dental examination, digital x-rays, periodontal evaluation, and ultrasonic teeth cleaning.",
                    price=120.0,
                    duration=45,
                    currency="USD",
                    active=True
                ),
                Service(
                    business_id=business.id,
                    name="In-Office Laser Teeth Whitening",
                    description="Professional medical-grade laser teeth whitening delivering up to 8 shades brighter in one 60-minute session.",
                    price=350.0,
                    duration=60,
                    currency="USD",
                    active=True
                ),
                Service(
                    business_id=business.id,
                    name="Porcelain Dental Veneers Consultation",
                    description="Cosmetic evaluation, digital smile design preview, and custom porcelain veneer planning.",
                    price=150.0,
                    duration=45,
                    currency="USD",
                    active=True
                ),
                Service(
                    business_id=business.id,
                    name="Clear Aligners (Invisalign) Evaluation",
                    description="3D digital intraoral scan and orthodontic alignment roadmap for discreet teeth straightening.",
                    price=100.0,
                    duration=30,
                    currency="USD",
                    active=True
                ),
                Service(
                    business_id=business.id,
                    name="Emergency Dental & Pain Relief Exam",
                    description="Urgent same-day dental assessment for acute toothaches, chipped teeth, or dental trauma.",
                    price=180.0,
                    duration=45,
                    currency="USD",
                    active=True
                ),
                Service(
                    business_id=business.id,
                    name="Facial Aesthetics & Botox Consultation",
                    description="Therapeutic and cosmetic facial aesthetics consult for TMJ jaw tension relief and forehead fine lines.",
                    price=200.0,
                    duration=30,
                    currency="USD",
                    active=True
                )
            ]
            session.add_all(services)

            # 7. Knowledge Documents & RAG Chunks
            doc1 = KnowledgeDocument(
                business_id=business.id,
                title="Clinic Location, Parking, and Accessibility",
                type="faq",
                content="Rine Dental is located at 742 Evergreen Terrace, Suite 100, Springfield. Dedicated patient parking is available directly behind the building. The facility has full wheelchair ramp accessibility and elevator access to Suite 100.",
                status="INDEXED"
            )
            doc2 = KnowledgeDocument(
                business_id=business.id,
                title="Insurance & Payment Options",
                type="policy",
                content="We are in-network with Delta Dental, Cigna, MetLife, Guardian, and Aetna PPO plans. We also offer interest-free CareCredit financing plans up to 12 months for cosmetic and orthodontic treatments.",
                status="INDEXED"
            )
            doc3 = KnowledgeDocument(
                business_id=business.id,
                title="Cancellation and Rescheduling Policy",
                type="policy",
                content="Appointments may be rescheduled or cancelled without fee with at least 24 hours advance notice. Cancellations made with less than 24 hours notice or missed appointments may incur a $50 late fee.",
                status="INDEXED"
            )
            doc4 = KnowledgeDocument(
                business_id=business.id,
                title="Teeth Whitening Preparation & Care",
                type="treatment_guide",
                content="Prior to in-office laser whitening, a recent dental cleaning is recommended. For 48 hours following whitening, patients must avoid staining substances such as coffee, black tea, red wine, and soy sauce (The White Diet).",
                status="INDEXED"
            )
            session.add_all([doc1, doc2, doc3, doc4])
            await session.flush()

            # Create Chunks with embeddings
            for doc in [doc1, doc2, doc3, doc4]:
                emb = await ai_provider.generate_embedding(doc.content)
                chunk = KnowledgeChunk(
                    document_id=doc.id,
                    business_id=business.id,
                    content=doc.content,
                    embedding=emb,
                    metadata_json={"title": doc.title, "type": doc.type}
                )
                session.add(chunk)

            # 8. Automations
            auto1 = Automation(
                business_id=business.id,
                name="High-Value Lead Escalation",
                trigger="NEW_LEAD",
                conditions=[{"field": "score", "operator": ">=", "value": 70}],
                actions=[
                    {"type": "NOTIFY_STAFF", "recipient": "reception@rinedental.com", "channel": "EMAIL", "message": "High-intent lead detected for {customer_name}: score {score}"}
                ],
                enabled=True
            )
            auto2 = Automation(
                business_id=business.id,
                name="Post-Booking Reminder Task",
                trigger="APPOINTMENT_CREATED",
                conditions=[],
                actions=[
                    {"type": "CREATE_TASK", "task_type": "REMINDER", "delay_minutes": 1440, "reason": "Pre-appointment reminder"}
                ],
                enabled=True
            )
            session.add_all([auto1, auto2])

            # 9. Demo Customer & Lead
            demo_cust = Customer(
                business_id=business.id,
                name="James Miller",
                phone="+1 (555) 892-1234",
                email="james.miller@example.com",
                source="website_chat",
                channel="website"
            )
            session.add(demo_cust)
            await session.flush()

            demo_lead = Lead(
                business_id=business.id,
                customer_id=demo_cust.id,
                status="QUALIFIED",
                score=85,
                intent="BOOK_APPOINTMENT",
                urgency="HIGH",
                notes="Inquired about teeth whitening for upcoming wedding."
            )
            session.add(demo_lead)

            await session.commit()
            logger.info("✅ V5 Demo Tenant seeded successfully with services, staff, RAG chunks, and Elena AI Receptionist!")

        except Exception as e:
            await session.rollback()
            logger.error(f"Error during V5 database seeding: {e}", exc_info=True)
