import sys
import os

# Ensure app directory is added to Python path for Vercel Serverless Functions
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app.main import app

# Export app for Vercel
app = app
