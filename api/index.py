import sys
from pathlib import Path

# Ensure root is in sys.path for Vercel serverless imports
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

# Handler for Vercel serverless functions
handler = app
