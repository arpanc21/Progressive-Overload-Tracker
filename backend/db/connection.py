import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# ── Connection config ─────────────────────────────────────────────────────────
# Set these in your .env file (loaded by python-dotenv in app.py)
DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 5432)),
    "dbname":   os.getenv("DB_NAME", "overload"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}


def get_connection():
    """Return a new psycopg2 connection."""
    return psycopg2.connect(**DB_CONFIG)


@contextmanager
def get_cursor():
    """Context manager: yields a RealDictCursor and auto-commits/rolls back."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
