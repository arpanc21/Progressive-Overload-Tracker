"""
Overload — Flask API
Run:  python app.py
"""
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from dotenv import load_dotenv
from db import queries

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Vite dev server


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


# ── Exercises ─────────────────────────────────────────────────────────────────

@app.get("/api/exercises")
def list_exercises():
    """GET /api/exercises → list of all exercises"""
    rows = queries.get_all_exercises()
    return jsonify([dict(r) for r in rows])


# ── Sessions ──────────────────────────────────────────────────────────────────

@app.get("/api/sessions")
def list_sessions():
    """GET /api/sessions → all sessions (optionally ?exercise_id=1)"""
    exercise_id = request.args.get("exercise_id", type=int)
    if exercise_id:
        rows = queries.get_sessions_by_exercise(exercise_id)
    else:
        rows = queries.get_all_sessions()
    return jsonify([dict(r) for r in rows])


@app.post("/api/sessions")
def create_session():
    """
    POST /api/sessions
    Body: {
        "exercise_id": 1,
        "date": "2025-04-23",          # optional, defaults to today
        "sets": [{"reps": 5, "weight": 135}, ...],
        "notes": "felt strong"          # optional
    }
    """
    data = request.get_json(force=True)

    exercise_id = data.get("exercise_id")
    sets = data.get("sets", [])

    if not exercise_id or not sets:
        abort(400, "exercise_id and sets are required")

    from datetime import date
    logged_date = data.get("date") or date.today().isoformat()

    session_id = queries.create_session(
        exercise_id=exercise_id,
        date=logged_date,
        sets=sets,
        notes=data.get("notes"),
    )
    return jsonify({"id": session_id}), 201


@app.delete("/api/sessions/<int:session_id>")
def delete_session(session_id):
    """DELETE /api/sessions/:id"""
    queries.delete_session(session_id)
    return jsonify({"deleted": session_id})


# ── Personal records ──────────────────────────────────────────────────────────

@app.get("/api/prs")
def personal_records():
    """GET /api/prs → {exercise: pr_weight} for all exercises"""
    rows = queries.get_pr_per_exercise()
    return jsonify([dict(r) for r in rows])


# ── Next targets ──────────────────────────────────────────────────────────────

@app.get("/api/next-targets")
def next_targets():
    """GET /api/next-targets → what to lift next session per exercise"""
    rows = queries.get_next_targets()
    return jsonify([dict(r) for r in rows])


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)
