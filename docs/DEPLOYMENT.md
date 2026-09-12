# Production Deployment Guide

Deploying OWAIS OUTREACH AI on cloud servers (Ubuntu / Debian / Docker / Railway / Render / AWS).

---

## 1. Docker Deployment

Create a `Dockerfile` for the FastAPI backend:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t owais-outreach-ai .
docker run -d -p 8000:8000 --env-file .env owais-outreach-ai
```

---

## 2. PostgreSQL Setup

For production, replace SQLite with PostgreSQL:
```env
DATABASE_URL=postgresql+asyncpg://owais_user:secure_password@postgres-host:5432/outreach_ai
```

---

## 3. Reverse Proxy (Nginx) & SSL

Configure Nginx with Certbot SSL:
```nginx
server {
    server_name outreach.owais-ai.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
