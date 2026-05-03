export const EXERCISES = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row']

export const INC = {
  'Bench Press':   2.5,
  'Squat':         5.0,
  'Deadlift':      5.0,
  'Overhead Press':2.5,
  'Barbell Row':   2.5,
}

export const SEEDS = [
  ...Array.from({length:8},(_,i)=>({id:i+1,  date:new Date(2025,0,6+i*7).toISOString().slice(0,10),exercise:'Bench Press',   sets:[{reps:5,weight:115+i*2.5},{reps:5,weight:115+i*2.5},{reps:5,weight:115+i*2.5}]})),
  ...Array.from({length:8},(_,i)=>({id:100+i, date:new Date(2025,0,6+i*7).toISOString().slice(0,10),exercise:'Squat',          sets:[{reps:5,weight:155+i*5},  {reps:5,weight:155+i*5},  {reps:5,weight:155+i*5}]})),
  ...Array.from({length:6},(_,i)=>({id:200+i, date:new Date(2025,0,8+i*8).toISOString().slice(0,10),exercise:'Deadlift',       sets:[{reps:5,weight:185+i*5},  {reps:5,weight:185+i*5}]})),
  ...Array.from({length:6},(_,i)=>({id:300+i, date:new Date(2025,0,7+i*7).toISOString().slice(0,10),exercise:'Overhead Press', sets:[{reps:5,weight:75+i*2.5}, {reps:5,weight:75+i*2.5}, {reps:5,weight:75+i*2.5}]})),
  ...Array.from({length:6},(_,i)=>({id:400+i, date:new Date(2025,0,8+i*7).toISOString().slice(0,10),exercise:'Barbell Row',    sets:[{reps:5,weight:95+i*2.5}, {reps:5,weight:95+i*2.5}]})),
]
