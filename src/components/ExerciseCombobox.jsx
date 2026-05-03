import { useState, useEffect, useRef } from 'react'

export default function ExerciseCombobox({ value, onChange, knownExercises }) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState(value)
  const wrapRef           = useRef(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const suggestions = knownExercises.filter(ex =>
    ex.toLowerCase().includes(query.toLowerCase()) && ex !== query
  )

  function pick(ex) {
    setQuery(ex)
    onChange(ex)
    setOpen(false)
  }

  function handleInput(e) {
    setQuery(e.target.value)
    onChange(e.target.value)
    setOpen(true)
  }

  return (
    <div className="combo" ref={wrapRef}>
      <input
        className="combo-input"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder="Type or pick an exercise..."
        autoComplete="off"
        spellCheck="false"
      />
      {open && suggestions.length > 0 && (
        <div className="combo-dropdown">
          {suggestions.map(ex => (
            <div key={ex} className="combo-option" onMouseDown={() => pick(ex)}>{ex}</div>
          ))}
        </div>
      )}
    </div>
  )
}
