import { useState, useMemo } from 'react'
import Dashboard from './components/Dashboard'
import LogSession from './components/LogSession'
import ExerciseDetail from './components/ExerciseDetail'
import { EXERCISES, SEEDS } from './data/constants'
import { maxW, getInc, mkSets } from './utils/helpers'

export default function App() {
  const [sessions, setSessions] = useState(SEEDS)
  const [view, setView]         = useState('dash')
  const [selEx, setSelEx]       = useState(null)
  const [logEx, setLogEx]       = useState('Bench Press')
  const [logSets, setLogSets]   = useState(mkSets)
  const [newPR, setNewPR]       = useState(null)

  const allExercises = useMemo(() => {
    const custom = sessions.map(s => s.exercise).filter(ex => !EXERCISES.includes(ex))
    return [...EXERCISES, ...new Set(custom)]
  }, [sessions])

  const lastSessions = useMemo(() => {
    const r = {}
    for (const ex of allExercises)
      r[ex] = sessions.filter(s => s.exercise === ex).sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    return r
  }, [sessions, allExercises])

  const prs = useMemo(() => {
    const r = {}
    for (const ex of allExercises) {
      const s = sessions.filter(x => x.exercise === ex)
      r[ex] = s.length ? Math.max(...s.map(maxW)) : null
    }
    return r
  }, [sessions, allExercises])

  function openLog(ex) {
    const last = lastSessions[ex]
    setLogEx(ex)
    setLogSets(last
      ? last.sets.map((s, i) => ({ id: i + 1, reps: String(s.reps), weight: String(maxW(last) + getInc(ex)) }))
      : mkSets()
    )
    setView('log')
  }

  function handleChangeEx(ex) {
    const last = lastSessions[ex]
    setLogEx(ex)
    setLogSets(last
      ? last.sets.map((s, i) => ({ id: i + 1, reps: String(s.reps), weight: String(maxW(last) + getInc(ex)) }))
      : mkSets()
    )
  }

  function handleChangeSet(id, field, val) {
    setLogSets(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }

  function handleAddSet() {
    setLogSets(prev => [...prev, { id: Date.now(), reps: '5', weight: '' }])
  }

  function handleRemoveSet(id) {
    setLogSets(prev => prev.filter(s => s.id !== id))
  }

  function saveSession() {
    const valid = logSets.filter(s => s.weight && !isNaN(parseFloat(s.weight)))
    if (!valid.length) return
    const ns = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      exercise: logEx,
      sets: valid.map(s => ({ reps: parseInt(s.reps) || 5, weight: parseFloat(s.weight) }))
    }
    const nm = Math.max(...ns.sets.map(s => s.weight))
    if (!prs[logEx] || nm > prs[logEx]) setNewPR({ ex: logEx, weight: nm })
    setSessions(p => [...p, ns])
    setView('dash')
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="logo">OVERLOAD</div>
          <div className="logo-sub">Progressive overload tracker</div>
        </div>
        {view === 'dash' && (
          <button className="btn" onClick={() => openLog('Bench Press')}>+ Log Session</button>
        )}
      </header>

      {view === 'dash' && (
        <Dashboard
          sessions={sessions}
          lastSessions={lastSessions}
          prs={prs}
          newPR={newPR}
          onDismissPR={() => setNewPR(null)}
          onSelectExercise={ex => { setSelEx(ex); setView('detail') }}
        />
      )}

      {view === 'log' && (
        <LogSession
          logEx={logEx}
          logSets={logSets}
          lastSessions={lastSessions}
          knownExercises={allExercises}
          onChangeEx={handleChangeEx}
          onChangeSet={handleChangeSet}
          onAddSet={handleAddSet}
          onRemoveSet={handleRemoveSet}
          onSave={saveSession}
          onCancel={() => setView('dash')}
        />
      )}

      {view === 'detail' && (
        <ExerciseDetail
          exercise={selEx}
          sessions={sessions}
          pr={prs[selEx]}
          onBack={() => setView('dash')}
          onLog={() => openLog(selEx)}
        />
      )}
    </div>
  )
}
