import { useStore } from '../store/useStore'
import AvatarDisplay from '../components/AvatarDisplay'
import DonutChart from '../components/DonutChart'
import { formatCountdown } from '../data/store'
import { SUBJECTS as SUBJECT_LIST } from '../data/subjects'

export default function Dashboard() {
  const { user, weekData, todayMinutes, dailyGoalMinutes, setPage, subjectStats, activeBoosts } = useStore()
  const now = Date.now()
  const liveBoosts = activeBoosts.filter((b) => b.expiresAt > now)
  const progressPct = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))
  const hoursTotal = Math.floor(user.totalMinutes / 60)

  return (
    <div className="flex flex-col gap-4 p-4 pb-2 overflow-y-auto flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white glow-text">Firefly</span>
            <span className="text-lg">🪙</span>
          </div>
          <p className="text-sm text-blue-300 mt-0.5">Good evening, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Coin balance */}
          <div className="flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/40 rounded-full px-3 py-1">
            <span className="text-sm">🪙</span>
            <span className="text-sm font-bold text-blue-300">{user.coins.toLocaleString()}</span>
          </div>
          <button onClick={() => setPage('profile')}>
            <AvatarDisplay avatar={user.avatar} size="sm" />
          </button>
        </div>
      </div>

      {/* Streak Card */}
      <div className="streak-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-400/70 font-medium uppercase tracking-wider mb-1">Current Streak</div>
            <div className="flex items-center gap-2">
              <span className="streak-fire text-4xl">🔥</span>
              <div>
                <div className="text-5xl font-black text-white glow-gold">{user.streak}</div>
                <div className="text-xs text-amber-400/80">days</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Best: {user.longestStreak} days</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Level {user.level}</div>
            <div className="text-3xl font-black text-amber-400">{hoursTotal}h</div>
            <div className="text-xs text-gray-500">total study</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{user.xp.toLocaleString()} XP</span>
            <span>Level {user.level + 1} at {user.xpToNext.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
            <div
              className="h-full xp-shimmer rounded-full progress-fill"
              style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active boosts */}
      {liveBoosts.length > 0 && (
        <div className="rounded-2xl p-3 flex flex-col gap-2" style={{ background: '#052e16', border: '1px solid #22c55e30' }}>
          <div className="text-xs text-green-400/70 font-medium uppercase tracking-wider">Active Boosts</div>
          <div className="flex flex-wrap gap-2">
            {liveBoosts.map((b) => (
              <div key={b.id} className="flex items-center gap-1.5 bg-green-950/60 border border-green-800/30 rounded-full px-3 py-1 text-xs">
                <span>{b.emoji}</span>
                <span className="text-green-300 font-medium">{b.name}</span>
                <span className="text-green-700">· {formatCountdown(b.expiresAt - now)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Calendar */}
      <div className="glow-card rounded-2xl p-4">
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-3">This Week</div>
        <div className="flex justify-between">
          {weekData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg relative"
                style={{
                  background: day.studied ? 'linear-gradient(135deg, #d97706, #92400e)' : '#0a1628',
                  border: day.studied ? '1px solid #f59e0b60' : '1px solid #1d4ed830',
                  boxShadow: day.studied ? '0 0 12px #f59e0b40' : 'none',
                }}
              >
                {day.studied ? '🔥' : ''}
              </div>
              <span className="text-[10px] text-gray-500">{day.day}</span>
              {day.studied && (
                <span className="text-[9px] text-amber-600">{day.minutes}m</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Goal */}
      <div className="glow-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">Today's Goal</div>
          <div className="text-sm font-bold text-white">{todayMinutes} / {dailyGoalMinutes} min</div>
        </div>
        <div className="h-3 bg-blue-950 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full progress-fill transition-all"
            style={{
              width: `${progressPct}%`,
              background: progressPct >= 100
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
              boxShadow: progressPct >= 100 ? '0 0 8px #10b98180' : '0 0 8px #3b82f680',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progressPct >= 100 ? '🎉 Goal complete!' : `${progressPct}% complete`}</span>
          <span>{Math.max(0, dailyGoalMinutes - todayMinutes)} min left</span>
        </div>
      </div>

      {/* Subject mini chart */}
      <SubjectSummaryCard subjectStats={subjectStats} onStudy={() => setPage('timer')} />

      {/* Quick Start */}
      <button
        onClick={() => setPage('timer')}
        className="btn-primary rounded-2xl py-4 text-lg font-bold text-white w-full"
      >
        <span className="mr-2">⚡</span>
        Start Studying
      </button>

      {/* Friends studying now */}
      <div className="glow-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">Friends Studying Now</div>
          <button onClick={() => setPage('room')} className="text-xs text-blue-400 hover:text-blue-300">
            View All →
          </button>
        </div>
        <StudyingNow />
      </div>

      {/* Achievements */}
      <div className="glow-card rounded-2xl p-4 mb-2">
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-3">Recent Achievements</div>
        <div className="flex gap-3">
          {[
            { emoji: '🔥', label: '7-Day Streak' },
            { emoji: '📚', label: '10 Hours' },
            { emoji: '👥', label: 'Social Scholar' },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-1 achievement-pop">
              <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800/40 flex items-center justify-center text-2xl">
                {a.emoji}
              </div>
              <span className="text-[9px] text-gray-500 text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StudyingNow() {
  const { friends } = useStore()
  const active = friends.filter((f) => f.status === 'studying').slice(0, 4)

  return (
    <div className="flex items-center gap-3">
      {active.map((f) => (
        <div key={f.id} className="flex flex-col items-center gap-1">
          <div className="relative">
            <AvatarDisplay avatar={f.avatar} size="sm" />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-firefly-navy online-dot" />
          </div>
          <span className="text-[10px] text-gray-400 truncate max-w-[52px] text-center">{f.name}</span>
          <span className="text-[9px] text-blue-500">{f.minutesToday}m</span>
        </div>
      ))}
      {active.length === 0 && (
        <span className="text-sm text-gray-600">No friends studying right now</span>
      )}
    </div>
  )
}

function SubjectSummaryCard({ subjectStats, onStudy }) {
  const donutData = SUBJECT_LIST
    .map((s) => ({ label: s.label, emoji: s.emoji, minutes: subjectStats?.[s.id] || 0, color: s.color }))
    .filter((d) => d.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const top3 = donutData.slice(0, 3)

  return (
    <div className="glow-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">Subject Breakdown</div>
        <button onClick={onStudy} className="text-xs text-blue-400 hover:text-blue-300">
          Study now →
        </button>
      </div>

      <div className="flex items-center gap-4">
        <DonutChart data={donutData} size={110} thickness={20} showTotal={false} />

        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          {top3.length === 0 ? (
            <p className="text-xs text-gray-600">Start a session to see your breakdown</p>
          ) : (
            top3.map((d) => {
              const total = donutData.reduce((s, x) => s + x.minutes, 0)
              const pct = total > 0 ? Math.round((d.minutes / total) * 100) : 0
              return (
                <div key={d.label} className="min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300 flex items-center gap-1">
                      <span>{d.emoji}</span>
                      <span className="truncate">{d.label}</span>
                    </span>
                    <span className="text-gray-500 flex-shrink-0 ml-2">{pct}%</span>
                  </div>
                  <div className="h-1 bg-blue-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: d.color, boxShadow: `0 0 4px ${d.color}80` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
