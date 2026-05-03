"""
All SQL queries live here — keeps app.py clean.
"""
from db.connection import get_cursor


# ── Exercises ─────────────────────────────────────────────────────────────────

def get_all_exercises():
    with get_cursor() as cur:
        cur.execute("SELECT id, name, increment FROM exercises ORDER BY name")
        return cur.fetchall()


# ── Sessions ──────────────────────────────────────────────────────────────────

def get_sessions_by_exercise(exercise_id: int):
    """Return all sessions for an exercise, newest first, with their sets."""
    with get_cursor() as cur:
        cur.execute("""
            SELECT
                s.id,
                s.logged_at::text AS date,
                e.name            AS exercise,
                e.increment,
                json_agg(
                    json_build_object(
                        'set_number', st.set_number,
                        'reps',       st.reps,
                        'weight',     st.weight
                    ) ORDER BY st.set_number
                ) AS sets
            FROM sessions s
            JOIN exercises e ON e.id = s.exercise_id
            JOIN sets      st ON st.session_id = s.id
            WHERE s.exercise_id = %s
            GROUP BY s.id, e.name, e.increment
            ORDER BY s.logged_at DESC
        """, (exercise_id,))
        return cur.fetchall()


def get_all_sessions():
    """Return every session across all exercises, newest first."""
    with get_cursor() as cur:
        cur.execute("""
            SELECT
                s.id,
                s.logged_at::text AS date,
                e.name            AS exercise,
                e.id              AS exercise_id,
                e.increment,
                json_agg(
                    json_build_object(
                        'set_number', st.set_number,
                        'reps',       st.reps,
                        'weight',     st.weight
                    ) ORDER BY st.set_number
                ) AS sets
            FROM sessions s
            JOIN exercises e ON e.id = s.exercise_id
            JOIN sets      st ON st.session_id = s.id
            GROUP BY s.id, e.name, e.id, e.increment
            ORDER BY s.logged_at DESC
        """)
        return cur.fetchall()


def create_session(exercise_id: int, date: str, sets: list, notes: str = None):
    """
    Insert a session + its sets. Returns the new session id.

    sets: list of dicts — [{reps: int, weight: float}, ...]
    """
    with get_cursor() as cur:
        cur.execute("""
            INSERT INTO sessions (exercise_id, logged_at, notes)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (exercise_id, date, notes))
        session_id = cur.fetchone()["id"]

        for i, s in enumerate(sets, start=1):
            cur.execute("""
                INSERT INTO sets (session_id, set_number, reps, weight)
                VALUES (%s, %s, %s, %s)
            """, (session_id, i, s["reps"], s["weight"]))

        return session_id


def delete_session(session_id: int):
    """Delete a session (sets cascade automatically)."""
    with get_cursor() as cur:
        cur.execute("DELETE FROM sessions WHERE id = %s", (session_id,))


# ── Personal records ──────────────────────────────────────────────────────────

def get_pr_per_exercise():
    """Return the all-time max weight lifted per exercise."""
    with get_cursor() as cur:
        cur.execute("""
            SELECT
                e.name AS exercise,
                MAX(st.weight) AS pr
            FROM sets st
            JOIN sessions s ON s.id = st.session_id
            JOIN exercises e ON e.id = s.exercise_id
            GROUP BY e.name
        """)
        return cur.fetchall()


# ── Next target ───────────────────────────────────────────────────────────────

def get_next_targets():
    """
    For each exercise, return last session's max weight + increment = next target.
    """
    with get_cursor() as cur:
        cur.execute("""
            WITH last_sessions AS (
                SELECT DISTINCT ON (exercise_id)
                    exercise_id,
                    id AS session_id,
                    logged_at
                FROM sessions
                ORDER BY exercise_id, logged_at DESC
            ),
            last_max AS (
                SELECT
                    ls.exercise_id,
                    MAX(st.weight) AS last_weight
                FROM last_sessions ls
                JOIN sets st ON st.session_id = ls.session_id
                GROUP BY ls.exercise_id
            )
            SELECT
                e.name                        AS exercise,
                lm.last_weight                AS last_weight,
                lm.last_weight + e.increment  AS next_target,
                e.increment
            FROM last_max lm
            JOIN exercises e ON e.id = lm.exercise_id
            ORDER BY e.name
        """)
        return cur.fetchall()
