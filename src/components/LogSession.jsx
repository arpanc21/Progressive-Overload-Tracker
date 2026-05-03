import ExerciseCombobox from './ExerciseCombobox'
import { nextTarget } from '../utils/helpers'

export default function LogSession({
  logEx, logSets, lastSessions, knownExercises,
  onChangeEx, onChangeSet, onAddSet, onRemoveSet, onSave, onCancel
}) {
  return (
    <div className="log-wrap">
      <div style={{ marginBottom: 28 }}>
        <label className="form-label">Exercise</label>
        <ExerciseCombobox value={logEx} onChange={onChangeEx} knownExercises={knownExercises} />
      </div>

      {lastSessions[logEx] && (
        <div className="target-hint">
          Target this session: <span>{nextTarget(lastSessions[logEx], logEx)}</span>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <label className="form-label">Sets</label>
        <table className="sets-table">
          <thead>
            <tr>
              <th className="tbl-th" style={{ width: 36 }}>#</th>
              <th className="tbl-th">Reps</th>
              <th className="tbl-th">Weight (lbs)</th>
              <th className="tbl-th"></th>
            </tr>
          </thead>
          <tbody>
            {logSets.map((s, i) => (
              <tr key={s.id}>
                <td className="tbl-td"><span className="row-num">{i + 1}</span></td>
                <td className="tbl-td">
                  <input
                    type="number"
                    className="set-input"
                    value={s.reps}
                    onChange={e => onChangeSet(s.id, 'reps', e.target.value)}
                  />
                </td>
                <td className="tbl-td">
                  <input
                    type="number"
                    className="set-input"
                    placeholder="0"
                    value={s.weight}
                    onChange={e => onChangeSet(s.id, 'weight', e.target.value)}
                  />
                </td>
                <td className="tbl-td">
                  {logSets.length > 1 && (
                    <button className="del-btn" onClick={() => onRemoveSet(s.id)} title="Remove set">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-ghost" onClick={onAddSet}>+ Add Set</button>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <button className="btn" onClick={onSave}>Save Session</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
