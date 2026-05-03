import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { maxW, fmtDate } from '../utils/helpers'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{payload[0].payload.date}</div>
      <div className="chart-tooltip-value">{payload[0].value} lbs</div>
    </div>
  )
}

export default function ExerciseDetail({ exercise, sessions, pr, onBack, onLog }) {
  const history = sessions
    .filter(s => s.exercise === exercise)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const chartData = sessions
    .filter(s => s.exercise === exercise)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(s => ({ date: fmtDate(s.date), weight: maxW(s) }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <button className="back-btn" onClick={onBack}>← Back to dashboard</button>
        <button className="btn" onClick={onLog}>+ Log Session</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="detail-title">{exercise}</div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '13px', color: '#666', marginTop: 8, letterSpacing: '1px' }}>
            {history.length} SESSIONS LOGGED
          </div>
        </div>
        {pr && (
          <div style={{ textAlign: 'right' }}>
            <div className="pr-all-time-label">All-time PR</div>
            <div className="pr-all-time-value">{pr} lbs</div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="chart-wrap">
          <div className="section-label" style={{ marginBottom: 16 }}>Strength curve</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#333' }} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#b8ff57" strokeWidth={2}
                dot={{ fill: '#0b0b0b', stroke: '#b8ff57', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#b8ff57', stroke: '#0b0b0b', strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="section-label">Session history</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className="hist-th">Date</th>
            <th className="hist-th">Sets × Reps</th>
            <th className="hist-th">Weight</th>
            <th className="hist-th"></th>
          </tr>
        </thead>
        <tbody>
          {history.map(s => {
            const w = maxW(s), isPR = w === pr
            return (
              <tr key={s.id}>
                <td className="hist-td">{fmtDate(s.date)}</td>
                <td className="hist-td">{s.sets.length}×{s.sets[0].reps}</td>
                <td className="hist-td" style={{ color: isPR ? '#ffc107' : '#ddd', fontWeight: isPR ? 700 : 400 }}>{w} lbs</td>
                <td className="hist-td">{isPR && <span className="pr-badge">PR</span>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
