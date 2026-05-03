/**
 * api.js — all calls to the Flask backend live here.
 * Swap BASE_URL if you deploy the backend elsewhere.
 */

const BASE_URL = "http://localhost:5000/api";

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Exercises ──────────────────────────────────────────────────────────────
export const getExercises    = ()      => req("/exercises");

// ── Sessions ───────────────────────────────────────────────────────────────
export const getAllSessions   = ()      => req("/sessions");
export const getSessionsByEx  = (id)   => req(`/sessions?exercise_id=${id}`);
export const deleteSession    = (id)   => req(`/sessions/${id}`, { method: "DELETE" });

export const createSession = (exercise_id, date, sets, notes = null) =>
  req("/sessions", {
    method: "POST",
    body: JSON.stringify({ exercise_id, date, sets, notes }),
  });

// ── PRs & Targets ──────────────────────────────────────────────────────────
export const getPRs         = ()      => req("/prs");
export const getNextTargets = ()      => req("/next-targets");
