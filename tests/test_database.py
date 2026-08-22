import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import verify_connection


if __name__ == "__main__":
    try:
        verify_connection()
        print("CognoDB connection successful!")
    except Exception as error:
        print(f"CognoDB connection failed: {error}")