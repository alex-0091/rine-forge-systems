# Backup and Disaster Recovery Plan

> **Path**: `/docs/BACKUP_AND_DR.md`  
> **Version**: Rine Forge Systems V5  
> **Target RPO**: < 15 Minutes | **Target RTO**: < 30 Minutes

---

## 1. Database Persistence & Replication Strategy

Rine Forge Systems stores multi-tenant state in PostgreSQL 16 with pgvector.
- **Primary Data**: Workspaces, businesses, conversations, appointments, leads, knowledge embeddings.
- **Continuous Archiving**: Write-Ahead Logging (WAL) shipping enabled to S3/GCS compliant object storage with 7-day point-in-time recovery (PITR).
- **Daily Full Snapshot**: Automated `pg_dump` executed every 24 hours at 02:00 UTC.

---

## 2. Disaster Recovery Scenarios

| Disaster Event | Recovery Procedure | Target RTO |
| :--- | :--- | :--- |
| **Primary DB Instance Failure** | Automated failover to hot standby replica via managed PostgreSQL high availability pool. | < 2 minutes |
| **Data Corruption / Erroneous Migration** | Restore from latest point-in-time WAL archive to an isolated instance. | < 25 minutes |
| **Cloud Region Outage** | Redeploy Docker container stack to secondary cloud region; restore latest daily snapshot and apply WAL delta. | < 30 minutes |

---

## 3. SQLite Local Dev Migration to PostgreSQL

In local development, the system defaults to SQLite (`outreach_ai.db`). To transition to production PostgreSQL:
1. Export environment variable:
   ```bash
   DATABASE_URL="postgresql+asyncpg://rine_user:secure_password@postgres-host:5432/rine_forge_db"
   ```
2. Run database initialization and seed:
   ```bash
   python -c "import asyncio; from backend.app.database import init_db; from backend.app.database_seed import seed_v5_database; asyncio.run(init_db()); asyncio.run(seed_v5_database())"
   ```
