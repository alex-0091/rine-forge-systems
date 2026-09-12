# Setup & Installation Guide

Follow these steps to set up and run **OWAIS OUTREACH AI** on a local development or server environment.

---

## 1. Prerequisites
- Python 3.10+ (Python 3.14 supported)
- Node.js 18+ and npm
- (Optional) PostgreSQL 14+ for production

---

## 2. Backend Setup

1. **Create and Activate Virtual Environment**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux / macOS:
   source venv/bin/activate
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and configure:
   - `GEMINI_API_KEY`: Your Google Gemini API Key (optional for dry-run/mock mode).
   - `DRY_RUN`: Set to `true` by default for safe local development.
   - `DATABASE_URL`: `sqlite+aiosqlite:///./outreach_ai.db` or PostgreSQL connection string.

4. **Run Backend Server**:
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```
   API Docs available at: `http://localhost:8000/docs`

---

## 3. Frontend Setup

1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Dashboard available at: `http://localhost:5173`
