import { INC } from '../data/constants'

export const maxW         = s    => Math.max(...s.sets.map(x => x.weight))
export const fmtDate      = d    => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
export const sessionLabel = s    => `${s.sets.length}×${s.sets[0].reps} @ ${maxW(s)} lbs`
export const getInc       = (ex) => INC[ex] ?? 2.5
export const nextTarget   = (s, ex) => `${s.sets.length}×${s.sets[0].reps} @ ${maxW(s) + getInc(ex)} lbs`
export const mkSets       = ()   => [{ id: 1, reps: '5', weight: '' }, { id: 2, reps: '5', weight: '' }, { id: 3, reps: '5', weight: '' }]
