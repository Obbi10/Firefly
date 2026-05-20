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
  const { isStudying, setStudying, selectedSubject, completeSession, activeBoosts, pruneBoosts } = useStore()
  const [mode, setMode] = useState('focus')
  const [seconds, setSeconds] = useState(25 * 60)
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [result, setResult] = useState(null) // { earnedFF, earnedXP, ffMulti, xpMulti, firstSessionBonus }
  const intervalRef = useRef(null)

  const selectedMode = MODES.find((m) => m.id === mode)
  const now = Date.now()
  const liveBoosts = activeBoosts.filter((b) => b.expiresAt > now)
  const ffMultiActive = liveBoosts.filter((b) => b.type === 'ff').reduce((acc, b) => acc * b.multiplier, 1)
  const xpMultiActive = liveBoosts.filter((b) => b.type === 'xp').reduce((acc, b) => acc * b.multiplier, 1)

  useEffect(() => {
    pruneBoosts()
  }, [])

  useEffect(() => {
    if (isStudying) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setStudying(false)
            const rawMinutes = Math.floor(totalSeconds / 60)
            const res = completeSession(rawMinutes)
            setResult(res)
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
    setResult(null)
  }

  const handleStartStop = () => {
    if (result) {
      setResult(null)
      setSeconds(selectedMode.minutes * 60)
      setTotalSeconds(selectedMode.minutes * 60)
      return
    }
    setStudying(!isStudying)
  }

  const handleReset = () => {
    setStudying(false)
    setSeconds(selectedMode.minutes * 60)
    setTotalSeconds(selectedMode.minutes * 60)
    setResult(null)
  }

  const progress = 1 - seconds / totalSeconds
  const circumference = 2 * Math.PI * 110
  const dashOffset = circumference * (1 - progress)

  // Projected earnings for current mode
  const projectedFF = Math.round(selectedMode.minutes * ffMultiActive)
  const projectedXP = Math.round(selectedMode.minutes * 15 * xpMultiActive)

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="p-4 pt-6">
        <h1 className="text-xl font-bold text-white glow-text">Study Timer</h1>
        <p className="text-sm text-blue-400 mt-0.5">{selectedSubject}</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-1 flex-shrink-0">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMode(m)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
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

      {/* Active boosts notice */}
      {liveBoosts.length > 0 && (
        <div className="mx-4 mt-3 rounded-xl p-2.5 flex flex-wrap gap-2" style={{ background: '#052e16', border: '1px solid #22c55e30' }}>
          {liveBoosts.map((b) => (
            <div key={b.id} className="flex items-center gap-1 text-xs text-green-400">
              <span>{b.emoji}</span>
              <span>{b.name} active</span>
            </div>
          ))}
        </div>
      )}

      {/* Timer */}
      <div className="flex flex-col items-center justify-center flex-1 py-6">
        {result ? (
          <CompletedView result={result} onNext={handleStartStop} />
        ) : (
          <>
            <div className="relative">
              <svg width="260" height="260" className="timer-ring -rotate-90">
                <circle cx="130" cy="130" r="110" fill="none" stroke="#0a1628" strokeWidth="12" />
                <circle
                  cx="130" cy="130" r="110"
                  fill="none"
                  stroke={selectedMode.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${selectedMode.color}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-white tracking-tight" style={{ textShadow: `0 0 20px ${selectedMode.color}60` }}>
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

            {/* Projected earnings card */}
            <div className="mt-4 mx-4 w-full max-w-xs">
              <div
                className="rounded-2xl p-3 grid grid-cols-2 gap-3"
                style={{ background: '#0a1628', border: '1px solid #1d4ed830' }}
              >
                <EarningPreview
                  icon="🪲"
                  label="Fireflies"
                  value={projectedFF}
                  multiplier={ffMultiActive}
                  color="#fbbf24"
                />
                <EarningPreview
                  icon="⭐"
                  label="XP"
                  value={projectedXP}
                  multiplier={xpMultiActive}
                  color="#60a5fa"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
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

            {/* Streak bonus note */}
            <div className="mt-4 text-xs text-gray-600 text-center px-8">
              Streak bonus: +{Math.min(50, Math.floor(14 / 7) * 5)}% fireflies from your 14-day streak
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EarningPreview({ icon, label, value, multiplier, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        <span className="text-base">{icon}</span>
        <span className="text-base font-black" style={{ color }}>+{value}</span>
      </div>
      <span className="text-[10px] text-gray-600">{label}</span>
      {multiplier > 1 && (
        <span className="text-[10px] font-bold text-green-400">{multiplier}× boost active</span>
      )}
    </div>
  )
}

function CompletedView({ result, onNext }) {
  const { earnedFF, earnedXP, ffMulti, xpMulti, firstSessionBonus } = result

  return (
    <div className="flex flex-col items-center gap-5 px-6 text-center">
      <div className="text-7xl float-anim">🎉</div>
      <div>
        <h2 className="text-2xl font-black text-white">Session Complete!</h2>
        <p className="text-blue-300 mt-1 text-sm">Keep that streak alive!</p>
      </div>

      {/* Earnings breakdown */}
      <div
        className="w-full rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}
      >
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider text-left">Earnings Breakdown</div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 flex items-center gap-1.5"><span>🪲</span> Base fireflies</span>
          <span className="text-sm font-bold text-white">+{Math.round(earnedFF / ffMulti)}</span>
        </div>

        {ffMulti > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-400 flex items-center gap-1.5"><span>✨</span> Boost ({ffMulti}×)</span>
            <span className="text-sm font-bold text-green-400">+{Math.round(earnedFF - earnedFF / ffMulti)}</span>
          </div>
        )}

        {firstSessionBonus > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-400 flex items-center gap-1.5"><span>🌅</span> First session bonus</span>
            <span className="text-sm font-bold text-amber-400">+{firstSessionBonus}</span>
          </div>
        )}

        <div className="border-t border-blue-900/30 pt-3 flex items-center justify-between">
          <span className="text-sm text-white font-semibold">Total fireflies</span>
          <div className="text-2xl font-black text-amber-400 glow-gold">+{earnedFF}</div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-blue-300 flex items-center gap-1.5"><span>⭐</span> XP earned</span>
          <span className="text-sm font-bold text-blue-300">+{earnedXP}</span>
        </div>
      </div>

      <button onClick={onNext} className="btn-primary rounded-2xl py-3 px-8 text-white font-bold w-full">
        Start Another Session
      </button>
    </div>
  )
}

function PlayIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
}
function PauseIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
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
