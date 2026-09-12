import asyncio
import httpx
from backend.app.database import init_db

async def run_verification():
    print("Testing backend startup and database initialization...")
    await init_db()
    print("✅ Database initialized successfully.")

if __name__ == "__main__":
    asyncio.run(run_verification())
