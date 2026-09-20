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
    KnowledgeDocument, KnowledgeChunk, Automation, Customer, Lead, Workspace,
    V5Prospect, V5ProspectObservation, V5ProspectOpportunity,
    V5ProspectOutreach, V5OutreachEvent, V5LeadSearch, V5LeadSearchResult
)
from backend.app.auth.security import hash_password
from backend.app.ai.provider_abstraction import ai_provider

logger = logging.getLogger("rine_forge_systems.seed")

DEMO_BUSINESS_ID = "00000000-0000-0000-0000-000000000001"
INTERNAL_SALES_ID = "00000000-0000-0000-0000-000000000002"

async def seed_v5_database():
    """
    Idempotent database seeder for V5.
    Creates demo clinic tenant and internal sales tenant if not present.
    """
    logger.info("Checking V5 database seeding status...")
    async with AsyncSessionLocal() as session:
        try:
            stmt = select(Business).where(Business.id == DEMO_BUSINESS_ID)
            res = await session.execute(stmt)
            existing_biz = res.scalar_one_or_none()

            if not existing_biz:
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

                # 3b. Default Workspace
                demo_ws = Workspace(
                    business_id=business.id,
                    name="Clinical Operations",
                    slug="default",
                    status="ACTIVE"
                )
                session.add(demo_ws)

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
                await session.commit()
                logger.info("✅ V5 Demo Tenant seeded successfully with services, staff, RAG chunks, and Elena AI Receptionist!")

            # --------------------------------------------------------
            # 10. Rine Forge Internal Sales Engine Tenant (Meta-Dogfooding)
            # --------------------------------------------------------
            stmt_sales = select(Business).where(Business.id == INTERNAL_SALES_ID)
            res_sales = await session.execute(stmt_sales)
            existing_sales = res_sales.scalar_one_or_none()

            if not existing_sales:
                logger.info("Seeding V5 Internal Sales Tenant: Rine Forge Systems...")
                
                # Check if founder user exists
                stmt_u = select(User).where(User.email == "founder@rineforge.com")
                res_u = await session.execute(stmt_u)
                founder_user = res_u.scalar_one_or_none()
                if not founder_user:
                    founder_user = User(
                        email="founder@rineforge.com",
                        name="Rine Forge Founder",
                        password_hash=hash_password("Forge2026!Sales"),
                        role="SUPER_ADMIN",
                        status="ACTIVE"
                    )
                    session.add(founder_user)
                    await session.flush()

                sales_biz = Business(
                    id=INTERNAL_SALES_ID,
                    owner_id=founder_user.id,
                    name="Rine Forge Systems (Sales Engine)",
                    industry="AI & Software Automation",
                    description="Autonomous Lead Discovery, website inspection, and high-conversion client acquisition engine for Rine Forge Systems.",
                    phone="+1 (512) 555-0100",
                    email="sales@rineforge.com",
                    address="100 Congress Ave, Suite 2000, Austin, TX 78701",
                    timezone="America/Chicago",
                    status="ACTIVE",
                    settings_json={
                        "default_review_mode": "REVIEW",
                        "target_metro": "Austin, TX",
                        "target_industry": "Dental"
                    }
                )
                session.add(sales_biz)
                await session.flush()

                session.add(BusinessUser(
                    business_id=sales_biz.id,
                    user_id=founder_user.id,
                    role="OWNER"
                ))

                # Default Workspace for Sales Engine
                sales_ws = Workspace(
                    business_id=sales_biz.id,
                    name="Sales & Growth",
                    slug="default",
                    status="ACTIVE"
                )
                session.add(sales_ws)

                # Lead Search Audit Record
                search_run = V5LeadSearch(
                    business_id=sales_biz.id,
                    query="Dental in Austin, TX",
                    industry="Dental",
                    location="Austin, TX",
                    services=["Cleaning", "Whitening", "Cosmetic Dentistry", "Invisalign"],
                    results_count=3,
                    status="COMPLETED"
                )
                session.add(search_run)
                await session.flush()

                # Prospect 1: Austin Premier Dental Care (REVIEW mode, pending draft)
                p1 = V5Prospect(
                    business_id=sales_biz.id,
                    prospect_type="B2B_BUSINESS",
                    company_name="Austin Premier Dental Care",
                    website="https://austinpremierdental.com",
                    industry="Dental",
                    location="Austin, TX",
                    city="Austin",
                    state="TX",
                    country="USA",
                    email="contact@austinpremierdental.com",
                    phone="+1 (512) 555-0199",
                    source="PUBLIC_BUSINESS_DATA",
                    source_url="https://austinpremierdental.com",
                    score=88,
                    score_breakdown={"intent": 90, "relevance": 95, "recency": 85, "geo_fit": 100, "engagement": 80, "consent": 100},
                    outreach_status="PENDING_REVIEW",
                    contact_status="UNCONTACTED",
                    consent_status="PUBLIC_COMMERCIAL",
                    pipeline_stage="REVIEW",
                    review_mode="REVIEW",
                    next_action="AWAITING_HUMAN_APPROVAL",
                    meta_json={"sources": ["PUBLIC_BUSINESS_DATA"], "why_it_matched": "Dental practice in Austin with high patient inquiry traffic and 24-48h form delay"}
                )
                session.add(p1)
                await session.flush()

                session.add(V5LeadSearchResult(search_id=search_run.id, prospect_id=p1.id))

                session.add_all([
                    V5ProspectObservation(
                        prospect_id=p1.id,
                        observation="Contact form explicitly states: 'Please allow 24-48 hours for inquiry response.'",
                        source="https://austinpremierdental.com/contact",
                        confidence=0.96,
                        category="SPEED_TO_LEAD"
                    ),
                    V5ProspectObservation(
                        prospect_id=p1.id,
                        observation="No automated calendar booking widget (Calendly, Acuity, NexHealth) detected on website.",
                        source="https://austinpremierdental.com",
                        confidence=0.92,
                        category="BOOKING_FLOW"
                    )
                ])

                session.add_all([
                    V5ProspectOpportunity(
                        prospect_id=p1.id,
                        type="SPEED_TO_LEAD",
                        reason="Contact channels promise delayed turnaround ('24-48 hours'). High-intent patients consult competitors who respond within minutes.",
                        evidence="Contact form states: 'Please allow 24-48 hours for inquiry response.'",
                        confidence=0.95
                    ),
                    V5ProspectOpportunity(
                        prospect_id=p1.id,
                        type="AI_RECEPTIONIST",
                        reason="Website has no conversational assistant to qualify patients, answer common pricing/insurance questions, or resolve inquiries in real-time.",
                        evidence="No live chat widget, interactive assistant, or 24/7 inquiry agent found on landing page.",
                        confidence=0.92
                    )
                ])

                p1_outreach = V5ProspectOutreach(
                    business_id=sales_biz.id,
                    prospect_id=p1.id,
                    channel="EMAIL",
                    subject="Quick note regarding Austin Premier Dental Care's website booking",
                    message=(
                        "Hi team at Austin Premier Dental Care,\n\n"
                        "I was reviewing your website and noticed your contact form mentions a 24-48 hour response time. "
                        "For patients looking for same-day appointments or cleanings, that delay often means they call the next clinic on Google.\n\n"
                        "Rine Forge deploys an AI receptionist (Elena) that engages website and WhatsApp visitors in under 30 seconds, "
                        "answers specific service questions, and schedules directly into your calendar.\n\n"
                        "Would you be open to a 2-minute preview showing how Elena handles after-hours patient inquiries for Austin Premier Dental Care?\n\n"
                        "Best regards,\nElena at Rine Forge Systems\n\n---\nReply STOP to opt out."
                    ),
                    reason="Initial evidence-grounded outreach draft",
                    status="PENDING_REVIEW",
                    step_number=0,
                    meta_json={"body_html": "<p>Hi team at Austin Premier Dental Care...</p>"}
                )
                session.add(p1_outreach)
                await session.flush()

                session.add(V5OutreachEvent(
                    outreach_id=p1_outreach.id,
                    event_type="DRAFTED",
                    payload={"step": 0, "status": "PENDING_REVIEW"}
                ))

                # Prospect 2: South Congress Cosmetic Dentistry (REVIEW mode)
                p2 = V5Prospect(
                    business_id=sales_biz.id,
                    prospect_type="B2B_BUSINESS",
                    company_name="South Congress Cosmetic Dentistry",
                    website="https://socodental.com",
                    industry="Dental",
                    location="Austin, TX",
                    city="Austin",
                    state="TX",
                    country="USA",
                    email="info@socodental.com",
                    phone="+1 (512) 555-0248",
                    source="PUBLIC_BUSINESS_DATA",
                    source_url="https://socodental.com",
                    score=82,
                    score_breakdown={"intent": 85, "relevance": 90, "recency": 80, "geo_fit": 100, "engagement": 75, "consent": 100},
                    outreach_status="PENDING_REVIEW",
                    contact_status="UNCONTACTED",
                    consent_status="PUBLIC_COMMERCIAL",
                    pipeline_stage="REVIEW",
                    review_mode="REVIEW",
                    next_action="AWAITING_HUMAN_APPROVAL",
                    meta_json={"sources": ["PUBLIC_BUSINESS_DATA"], "why_it_matched": "Cosmetic dentist in central Austin with no instant WhatsApp communication"}
                )
                session.add(p2)
                await session.flush()

                session.add(V5LeadSearchResult(search_id=search_run.id, prospect_id=p2.id))

                session.add(V5ProspectObservation(
                    prospect_id=p2.id,
                    observation="No WhatsApp contact button or wa.me link found on website",
                    source="https://socodental.com",
                    confidence=0.90,
                    category="WHATSAPP"
                ))

                session.add(V5ProspectOpportunity(
                    prospect_id=p2.id,
                    type="WHATSAPP_EMPLOYEE",
                    reason="Modern dental patients prefer WhatsApp over phone calls. An AI receptionist on WhatsApp provides zero-friction booking.",
                    evidence="No WhatsApp link detected on homepage or contact page.",
                    confidence=0.88
                ))

                p2_outreach = V5ProspectOutreach(
                    business_id=sales_biz.id,
                    prospect_id=p2.id,
                    channel="EMAIL",
                    subject="Quick note regarding South Congress Cosmetic Dentistry",
                    message=(
                        "Hi team at South Congress Cosmetic Dentistry,\n\n"
                        "I took a look at your website and noticed you don't currently offer WhatsApp booking for mobile visitors...\n\n"
                        "Best regards,\nElena at Rine Forge Systems\n\n---\nReply STOP to opt out."
                    ),
                    reason="Initial evidence-grounded outreach draft",
                    status="PENDING_REVIEW",
                    step_number=0,
                    meta_json={"body_html": "<p>Hi team at South Congress Cosmetic Dentistry...</p>"}
                )
                session.add(p2_outreach)
                await session.flush()

                session.add(V5OutreachEvent(
                    outreach_id=p2_outreach.id,
                    event_type="DRAFTED",
                    payload={"step": 0, "status": "PENDING_REVIEW"}
                ))

                # Prospect 3: Hill Country Family Dental (Already CONTACTED)
                p3 = V5Prospect(
                    business_id=sales_biz.id,
                    prospect_type="B2B_BUSINESS",
                    company_name="Hill Country Family Dental",
                    website="https://hillcountrydental.com",
                    industry="Dental",
                    location="Austin, TX",
                    city="Austin",
                    state="TX",
                    country="USA",
                    email="reception@hillcountrydental.com",
                    phone="+1 (512) 555-0371",
                    source="PUBLIC_BUSINESS_DATA",
                    source_url="https://hillcountrydental.com",
                    score=76,
                    score_breakdown={"intent": 80, "relevance": 85, "recency": 75, "geo_fit": 100, "engagement": 65, "consent": 100},
                    outreach_status="SENT",
                    contact_status="IN_PROGRESS",
                    consent_status="PUBLIC_COMMERCIAL",
                    pipeline_stage="CONTACTED",
                    review_mode="REVIEW",
                    next_action="AWAITING_REPLY_OR_STEP_1",
                    meta_json={"sources": ["PUBLIC_BUSINESS_DATA"], "why_it_matched": "Family dental clinic with zero weekend coverage"}
                )
                session.add(p3)
                await session.flush()

                session.add(V5LeadSearchResult(search_id=search_run.id, prospect_id=p3.id))

                session.add(V5ProspectObservation(
                    prospect_id=p3.id,
                    observation="Office schedule shows closed Saturdays and Sundays; inquiries outside 9am-5pm go to voicemail.",
                    source="https://hillcountrydental.com/hours",
                    confidence=0.94,
                    category="AFTER_HOURS_COVERAGE"
                ))

                session.add(V5ProspectOpportunity(
                    prospect_id=p3.id,
                    type="AFTER_HOURS_COVERAGE",
                    reason="Inquiries after 5 PM and on weekends are lost to voicemail, risking drop-off until Monday morning.",
                    evidence="Published office schedule: Mon-Fri only.",
                    confidence=0.89
                ))

                sent_time = datetime.now(timezone.utc)
                p3.last_contacted = sent_time
                p3_outreach = V5ProspectOutreach(
                    business_id=sales_biz.id,
                    prospect_id=p3.id,
                    channel="EMAIL",
                    subject="After-hours patient coverage for Hill Country Family Dental",
                    message="Hi team,\n\nFollowing up on after-hours coverage...\n\nReply STOP to opt out.",
                    status="SENT",
                    step_number=0,
                    sent_at=sent_time,
                    external_message_id="<mock-hillcountry-001@rineforge.com>"
                )
                session.add(p3_outreach)
                await session.flush()

                session.add(V5OutreachEvent(
                    outreach_id=p3_outreach.id,
                    event_type="SENT",
                    payload={"provider": "EmailOutreachProvider", "message_id": "<mock-hillcountry-001@rineforge.com>"}
                ))

                await session.commit()
                logger.info("✅ V5 Internal Sales Tenant (Rine Forge) seeded with 3 Austin dental prospects, observations, and outreach drafts!")

        except Exception as e:
            await session.rollback()
            logger.error(f"Error during V5 database seeding: {e}", exc_info=True)

