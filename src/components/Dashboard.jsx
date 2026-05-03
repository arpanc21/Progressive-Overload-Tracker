import { useMemo } from 'react'
import { EXERCISES } from '../data/constants'
import { maxW, fmtDate, sessionLabel, nextTarget, getInc } from '../utils/helpers'

export default function Dashboard({ sessions, lastSessions, prs, newPR, onDismissPR, onSelectExercise }) {
  const allExercises = useMemo(() => {
    const custom = sessions.map(s => s.exercise).filter(ex => !EXERCISES.includes(ex))
    return [...EXERCISES, ...new Set(custom)]
  }, [sessions])

  return (
    <div>
      {newPR && (
        <div className="pr-banner">
          <div>
            <div className="pr-banner-label">New personal record — {newPR.ex}</div>
            <div className="pr-banner-value">{newPR.weight} lbs</div>
          </div>
          <button className="btn btn-ghost" onClick={onDismissPR}>✕</button>
        </div>
      )}

      <div className="section-label">Next session targets</div>

      {allExercises.map(ex => {
        const last = lastSessions[ex]
        const pr   = prs[ex]
        const nextW = last ? maxW(last) + getInc(ex) : null
        const isNextPR = !!nextW && (!pr || nextW > pr)

        return (
          <div key={ex} className="exercise-card" onClick={() => onSelectExercise(ex)}>
            <div>
              <div className="exercise-name">
                {ex}
                {isNextPR && <span className="pr-badge">PR</span>}
              </div>
              <div className="exercise-meta">
                {last
                  ? `Last: ${sessionLabel(last)} · ${fmtDate(last.date)}`
                  : 'No sessions yet — log your first lift'}
              </div>
            </div>
            <div>
              <div className="next-label">Hit next</div>
              {last
                ? <div className="next-value">{nextTarget(last, ex)}</div>
                : <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '16px', color: '#555', textAlign: 'right' }}>—</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
