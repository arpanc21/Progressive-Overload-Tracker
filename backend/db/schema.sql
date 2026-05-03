-- ─────────────────────────────────────────────────────────────────────────────
-- Overload — PostgreSQL Schema
-- Run this once to set up your database:
--   psql -U postgres -d overload -f schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS exercises (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL UNIQUE,
    increment NUMERIC(5,2) NOT NULL DEFAULT 2.5  -- lbs to add each session
);

CREATE TABLE IF NOT EXISTS sessions (
    id          SERIAL PRIMARY KEY,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    logged_at   DATE NOT NULL DEFAULT CURRENT_DATE,
    notes       TEXT
);

CREATE TABLE IF NOT EXISTS sets (
    id         SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps       INTEGER NOT NULL,
    weight     NUMERIC(6,2) NOT NULL  -- lbs
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_exercise ON sessions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date     ON sessions(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sets_session      ON sets(session_id);

-- ── Seed exercises ────────────────────────────────────────────────────────────
INSERT INTO exercises (name, increment) VALUES
    ('Bench Press',  2.5),
    ('Squat',        5.0),
    ('Deadlift',     5.0),
    ('OHP',          2.5),
    ('Barbell Row',  2.5)
ON CONFLICT (name) DO NOTHING;
