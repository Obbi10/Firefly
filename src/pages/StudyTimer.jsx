import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import { SUBJECTS, getSubject } from '../data/subjects'

const MODES = [
  { id: 'focus', label: 'Focus',       minutes: 25, color: '#3b82f6' },
  { id: 'short', label: 'Short Break', minutes: 5,  color: '#10b981' },
  { id: 'long',  label: 'Long Break',  minutes: 15, color: '#a855f7' },
  { id: 'custom',label: 'Custom',      minutes: 60, color: '#f59e0b' },
]

function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function StudyTimer() {
  const { isStudying, setStudying, selectedSubject, setSubject, completeSession, subjectStats, activeBoosts, pruneBoosts } = useStore()

  // Phase: 'pick' | 'timer'
  const [phase, setPhase] = useState('pick')
  const [mode, setMode] = useState('focus')
  const [seconds, setSeconds] = useState(25 * 60)
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [result, setResult] = useState(null)
  const intervalRef = useRef(null)

  const selectedMode = MODES.find((m) => m.id === mode)
  const subjectData = getSubject(selectedSubject)

  const now = Date.now()
  const liveBoosts = activeBoosts.filter((b) => b.expiresAt > now)
  const ffMultiActive = liveBoosts.filter((b) => b.type === 'ff').reduce((acc, b) => acc * b.multiplier, 1)
  const xpMultiActive = liveBoosts.filter((b) => b.type === 'xp').reduce((acc, b) => acc * b.multiplier, 1)

  useEffect(() => { pruneBoosts() }, [])

  // Stop timer if we go back to subject picker
  useEffect(() => {
    if (phase === 'pick') {
      setStudying(false)
      clearInterval(intervalRef.current)
    }
  }, [phase])

  useEffect(() => {
    if (isStudying) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setStudying(false)
            const rawMins = Math.floor(totalSeconds / 60)
            const res = completeSession(rawMins, selectedSubject)
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

  const handleSelectSubject = (subjectId) => {
    setSubject(subjectId)
    setPhase('timer')
    setResult(null)
  }

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

  const projectedFF = Math.round(selectedMode.minutes * ffMultiActive)
  const projectedXP = Math.round(selectedMode.minutes * 15 * xpMultiActive)

  // ── Subject picker phase ──────────────────────────────────────────
  if (phase === 'pick') {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 pt-6 pb-4 flex-shrink-0">
          <h1 className="text-xl font-bold text-white glow-text">What are you studying?</h1>
          <p className="text-sm text-blue-400 mt-0.5">Pick a subject to start your session</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.map((s) => {
              const mins = subjectStats?.[s.id] || 0
              const hrs = (mins / 60).toFixed(1)
              const isSelected = selectedSubject === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSubject(s.id)}
                  className="flex flex-col items-start gap-2 p-4 rounded-2xl text-left transition-all duration-200 active:scale-95"
                  style={{
                    background: isSelected ? `${s.color}18` : '#060f23',
                    border: `1px solid ${isSelected ? s.color + '60' : '#1d4ed820'}`,
                    boxShadow: isSelected ? `0 0 16px ${s.color}25` : 'none',
                  }}
                >
                  {/* Emoji + rarity dot row */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl">{s.emoji}</span>
                    {mins > 0 && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
                      />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{s.label}</div>
                    {mins > 0 ? (
                      <div className="text-xs mt-0.5" style={{ color: s.color + 'cc' }}>
                        {hrs}h studied
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 mt-0.5">Not started yet</div>
                    )}
                  </div>

                  {/* Mini progress bar showing proportion of total */}
                  {mins > 0 && (
                    <SubjectMiniBar
                      mins={mins}
                      total={Object.values(subjectStats || {}).reduce((a, b) => a + b, 0)}
                      color={s.color}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Timer phase ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Subject header — tap to change */}
      <div className="px-4 pt-5 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
              style={{ background: subjectData.color + '20', border: `1px solid ${subjectData.color}40` }}
            >
              {subjectData.emoji}
            </div>
            <div>
              <div className="text-base font-bold text-white">{subjectData.label}</div>
              <div className="text-xs text-gray-500">
                {((subjectStats?.[selectedSubject] || 0) / 60).toFixed(1)}h studied total
              </div>
            </div>
          </div>
          <button
            onClick={() => { setStudying(false); setPhase('pick') }}
            className="text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{ background: '#0a1628', border: '1px solid #1d4ed840', color: '#60a5fa' }}
          >
            Change
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2 flex-shrink-0">
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

      {/* Active boosts */}
      {liveBoosts.length > 0 && (
        <div className="mx-4 mb-1 rounded-xl p-2.5 flex flex-wrap gap-2" style={{ background: '#052e16', border: '1px solid #22c55e30' }}>
          {liveBoosts.map((b) => (
            <span key={b.id} className="text-xs text-green-400">{b.emoji} {b.name} active</span>
          ))}
        </div>
      )}

      {/* Timer + controls */}
      <div className="flex flex-col items-center justify-center flex-1 py-4">
        {result ? (
          <CompletedView result={result} subjectData={subjectData} onNext={handleStartStop} onPickNew={() => { setPhase('pick'); setResult(null) }} />
        ) : (
          <>
            {/* Ring */}
            <div className="relative">
              <svg width="260" height="260" className="timer-ring -rotate-90">
                <circle cx="130" cy="130" r="110" fill="none" stroke="#0a1628" strokeWidth="12" />
                <circle
                  cx="130" cy="130" r="110"
                  fill="none"
                  stroke={subjectData.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${subjectData.color}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-white tracking-tight" style={{ textShadow: `0 0 20px ${subjectData.color}60` }}>
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

            {/* Projected earnings */}
            <div className="mt-4 mx-4 w-full max-w-xs">
              <div className="rounded-2xl p-3 grid grid-cols-2 gap-3" style={{ background: '#0a1628', border: '1px solid #1d4ed830' }}>
                <EarningPreview icon="🪲" label="Fireflies" value={projectedFF} multiplier={ffMultiActive} color="#fbbf24" />
                <EarningPreview icon="⭐" label="XP" value={projectedXP} multiplier={xpMultiActive} color="#60a5fa" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
              <CtrlBtn onClick={handleReset}><ResetIcon /></CtrlBtn>
              <button
                onClick={handleStartStop}
                className="w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200"
                style={{
                  background: isStudying ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : `linear-gradient(135deg,${subjectData.color}cc,${subjectData.color}88)`,
                  border: `2px solid ${isStudying ? '#ef4444' : subjectData.color}60`,
                  boxShadow: `0 0 24px ${isStudying ? '#ef444440' : subjectData.color + '40'}`,
                }}
              >
                {isStudying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <CtrlBtn><SkipIcon /></CtrlBtn>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              Streak bonus: +{Math.min(50, Math.floor(14 / 7) * 5)}% fireflies
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function SubjectMiniBar({ mins, total, color }) {
  const pct = total > 0 ? (mins / total) * 100 : 0
  return (
    <div className="w-full h-1 bg-blue-950 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
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
      {multiplier > 1 && <span className="text-[10px] font-bold text-green-400">{multiplier}× boost</span>}
    </div>
  )
}

function CtrlBtn({ onClick, children }) {
  return (
    <button onClick={onClick} className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-950 border border-blue-900/40 text-gray-400 hover:text-white transition-colors">
      {children}
    </button>
  )
}

function CompletedView({ result, subjectData, onNext, onPickNew }) {
  const { earnedFF, earnedXP, ffMulti, firstSessionBonus } = result
  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <div className="text-7xl float-anim">🎉</div>
      <div>
        <h2 className="text-2xl font-black text-white">Session Complete!</h2>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span>{subjectData.emoji}</span>
          <span className="text-sm font-medium" style={{ color: subjectData.color }}>{subjectData.label}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full rounded-2xl p-4 flex flex-col gap-2.5" style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}>
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider text-left mb-1">Earnings Breakdown</div>
        <Row label="🪲 Base fireflies" value={`+${Math.round(earnedFF / ffMulti)}`} />
        {ffMulti > 1 && <Row label={`✨ Boost (${ffMulti}×)`} value={`+${Math.round(earnedFF - earnedFF / ffMulti)}`} color="#4ade80" />}
        {firstSessionBonus > 0 && <Row label="🌅 First session bonus" value={`+${firstSessionBonus}`} color="#fbbf24" />}
        <div className="border-t border-blue-900/30 pt-2.5 flex items-center justify-between">
          <span className="text-sm text-white font-semibold">Total fireflies</span>
          <span className="text-2xl font-black text-amber-400 glow-gold">+{earnedFF}</span>
        </div>
        <Row label="⭐ XP earned" value={`+${earnedXP}`} color="#60a5fa" />
      </div>

      <div className="flex gap-3 w-full">
        <button onClick={onPickNew} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-blue-300" style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}>
          New Subject
        </button>
        <button onClick={onNext} className="flex-1 btn-primary rounded-2xl py-3 text-white font-bold text-sm">
          Same Subject
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, color = '#9ca3af' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function PlayIcon()  { return <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function PauseIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> }
function ResetIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg> }
function SkipIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg> }
