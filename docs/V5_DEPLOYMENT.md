# RINE FORGE SYSTEMS — V5 PRODUCTION DEPLOYMENT GUIDE

## 1. Production Architecture Overview
- **Frontend**: React + Vite SPA deployed on Vercel (`https://rine-forge-systems.vercel.app/`).
- **Backend**: FastAPI Python 3.12+ ASGI application deployable on Vercel Serverless, AWS ECS/Lambda, Google Cloud Run, or Docker containers.
- **Database**: PostgreSQL (managed RDS/Neon/Supabase) in production; SQLite for local and CI development.

---

## 2. Environment Variables Checklist
Configure these variables in your deployment environment:

```env
# Application Core
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=generate_a_secure_random_64_character_hex_string
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@db.example.com:5432/rineforge

# AI Providers
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=AIzaSy...

# WhatsApp Meta Cloud API
WHATSAPP_TOKEN=EAAB...
WHATSAPP_PHONE_NUMBER_ID=1092837465...
WHATSAPP_VERIFY_TOKEN=your_custom_webhook_verify_token
```

---

## 3. Database Initialization & Seeding
On application cold start, `init_db()` automatically runs `Base.metadata.create_all()` to ensure all tables and indexes exist.
The seeder `seed_v5_database()` automatically and idempotently creates the verified demo clinic:
- **Tenant ID**: `00000000-0000-0000-0000-000000000001`
- **Clinic**: Rine Dental & Facial Aesthetics
- **AI Employee**: Elena (Front Desk AI Receptionist)
- **Services**: 6 medical treatments with exact pricing and durations
- **Staff**: Dr. Sarah Evans, DDS & Dr. Michael Lee, DMD
- **RAG Chunks**: 4 vector-indexed knowledge documents

---

## 4. Health Check Verification
Post-deployment, verify operational readiness using the health endpoints:
```bash
curl https://api.rineforge.ai/api/v1/health
curl https://api.rineforge.ai/api/v1/health/database
curl https://api.rineforge.ai/api/v1/health/ai
```
