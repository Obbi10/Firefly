import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

const MODES = [
  { id: 'focus', label: 'Focus', minutes: 25, color: '#3b82f6' },
  { id: 'short', label: 'Short Break', minutes: 5, color: '#10b981' },
  { id: 'long', label: 'Long Break', minutes: 15, color: '#a855f7' },
  { id: 'custom', label: 'Custom', minutes: 60, color: '#f59e0b' },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function StudyTimer() {
  const { isStudying, setStudying, selectedSubject, addFireflies, addMinutesToday } = useStore()
  const [mode, setMode] = useState('focus')
  const [seconds, setSeconds] = useState(25 * 60)
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [sessionEarned, setSessionEarned] = useState(0)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef(null)

  const selectedMode = MODES.find((m) => m.id === mode)

  useEffect(() => {
    if (isStudying) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setStudying(false)
            const earned = Math.floor(totalSeconds / 60) * 10
            setSessionEarned(earned)
            addFireflies(earned)
            addMinutesToday(Math.floor(totalSeconds / 60))
            setCompleted(true)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isStudying])

  const handleMode = (m) => {
    setMode(m.id)
    setSeconds(m.minutes * 60)
    setTotalSeconds(m.minutes * 60)
    setStudying(false)
    setCompleted(false)
    setSessionEarned(0)
  }

  const handleStartStop = () => {
    if (completed) {
      setCompleted(false)
      setSeconds(selectedMode.minutes * 60)
      setTotalSeconds(selectedMode.minutes * 60)
      setSessionEarned(0)
      return
    }
    setStudying(!isStudying)
  }

  const handleReset = () => {
    setStudying(false)
    setSeconds(selectedMode.minutes * 60)
    setTotalSeconds(selectedMode.minutes * 60)
    setCompleted(false)
    setSessionEarned(0)
  }

  const progress = 1 - seconds / totalSeconds
  const circumference = 2 * Math.PI * 110
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="p-4 pt-6">
        <h1 className="text-xl font-bold text-white glow-text">Study Timer</h1>
        <p className="text-sm text-blue-400 mt-0.5">{selectedSubject}</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMode(m)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: mode === m.id ? m.color : '#0a1628',
              border: `1px solid ${mode === m.id ? m.color : '#1d4ed830'}`,
              color: mode === m.id ? '#fff' : '#6b7280',
              boxShadow: mode === m.id ? `0 0 12px ${m.color}50` : 'none',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center justify-center flex-1 py-8">
        {completed ? (
          <CompletedView earned={sessionEarned} onNext={handleStartStop} />
        ) : (
          <>
            <div className="relative">
              <svg width="260" height="260" className="timer-ring -rotate-90">
                {/* Background ring */}
                <circle
                  cx="130" cy="130" r="110"
                  fill="none" stroke="#0a1628" strokeWidth="12"
                />
                {/* Progress ring */}
                <circle
                  cx="130" cy="130" r="110"
                  fill="none"
                  stroke={selectedMode.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: 'stroke-dashoffset 1s linear',
                    filter: `drop-shadow(0 0 8px ${selectedMode.color}80)`,
                  }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-5xl font-black text-white tracking-tight"
                  style={{ textShadow: `0 0 20px ${selectedMode.color}60` }}
                >
                  {formatTime(seconds)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{selectedMode.label}</div>
                {isStudying && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 online-dot" />
                    <span className="text-xs text-green-400">Studying</span>
                  </div>
                )}
              </div>
            </div>

            {/* Earnings preview */}
            <div className="mt-4 flex items-center gap-2 bg-blue-950/40 border border-blue-900/30 rounded-full px-4 py-2">
              <span className="text-sm">🪲</span>
              <span className="text-sm text-blue-300">
                Earn <span className="font-bold text-white">{selectedMode.minutes * 10}</span> fireflies on completion
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-950 border border-blue-900/40 text-gray-400 hover:text-white transition-colors"
              >
                <ResetIcon />
              </button>

              <button
                onClick={handleStartStop}
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white transition-all duration-200"
                style={{
                  background: isStudying
                    ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                    : `linear-gradient(135deg, ${selectedMode.color}cc, ${selectedMode.color}88)`,
                  border: `2px solid ${isStudying ? '#ef4444' : selectedMode.color}60`,
                  boxShadow: `0 0 24px ${isStudying ? '#ef444440' : selectedMode.color + '40'}`,
                }}
              >
                {isStudying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-950 border border-blue-900/40 text-gray-400 hover:text-white transition-colors">
                <SkipIcon />
              </button>
            </div>

            {/* Session stats */}
            <div className="mt-8 w-full px-4">
              <div className="glow-card rounded-2xl p-4">
                <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-3">Session Stats</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatBox label="Focus Mode" value={selectedMode.label} />
                  <StatBox label="Time Left" value={formatTime(seconds)} />
                  <StatBox label="Reward" value={`${selectedMode.minutes * 10}🪲`} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div>
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function CompletedView({ earned, onNext }) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 text-center">
      <div className="text-7xl float-anim">🎉</div>
      <div>
        <h2 className="text-2xl font-black text-white">Session Complete!</h2>
        <p className="text-blue-300 mt-2">Amazing work. Keep the streak alive!</p>
      </div>
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-4 w-full">
        <div className="text-4xl font-black text-amber-400 glow-gold">+{earned}</div>
        <div className="text-sm text-amber-500/70 mt-1 flex items-center justify-center gap-1">
          <span>🪲</span> fireflies earned
        </div>
      </div>
      <button onClick={onNext} className="btn-primary rounded-2xl py-3 px-8 text-white font-bold">
        Start Another
      </button>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
    </svg>
  )
}

function SkipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4"/>
      <line x1="19" y1="5" x2="19" y2="19"/>
    </svg>
  )
}
