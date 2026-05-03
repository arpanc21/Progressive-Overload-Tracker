# Overload — Progressive Overload Tracker

A focused gym tracker that tells you exactly what weight to lift next session. No bloat — just progressive overload.

## Why I built this

Every gym app is either bloated (MyFitnessPal) or too simple (Notes app). Progressive overload — consistently adding weight over time — is the single most important variable for getting stronger, but no app makes it the main feature. Overload does one thing: after you log a session, it tells you what to hit next time.

## Features

- Log workouts — exercise, sets, reps, weight
- After each session it tells you exactly what to hit next time
- Progress chart per exercise — visualize your strength curve over time
- Personal records flagged automatically

## Tech Stack

- **Frontend:** React + Recharts
- **Backend:** Python (Flask or FastAPI) — *coming soon*
- **Database:** PostgreSQL — stores users, exercises, and session history
- **Tools:** Git, GitHub, VS Code, Vite

## Project Structure

```
overload/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component + routing state
    ├── index.css             # Global styles
    ├── components/
    │   ├── Dashboard.jsx     # Exercise list + next targets
    │   ├── LogSession.jsx    # Log a workout session
    │   └── ExerciseDetail.jsx # Chart + history per exercise
    ├── data/
    │   └── constants.js      # Exercise list, increments, seed data
    └── utils/
        └── helpers.js        # Shared utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

## Roadmap

- [ ] Connect to PostgreSQL backend (Flask/FastAPI)
- [ ] User authentication
- [ ] Custom exercises
- [ ] Rest timer
- [ ] Export to CSV
