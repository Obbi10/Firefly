import { useState } from 'react'
import { useStore } from '../store/useStore'
import AvatarDisplay from '../components/AvatarDisplay'
import DonutChart from '../components/DonutChart'
import { ANIMALS, COLOR_SCHEMES, HATS, FRAMES, BACKGROUNDS, getAnimal, RARITY_COLORS } from '../data/avatars'
import { ACHIEVEMENTS } from '../data/items'
import { SUBJECTS } from '../data/subjects'

const TABS = ['Avatar', 'Stats', 'Badges']

export default function Profile() {
  const { user, updateAvatar, setPage } = useStore()
  const [tab, setTab] = useState('Avatar')
  const [avatarTab, setAvatarTab] = useState('animal')

  const hoursTotal = Math.floor(user.totalMinutes / 60)
  const level = user.level

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pt-6 pb-4 relative"
        style={{ background: 'linear-gradient(180deg, #0d1f3c 0%, #060f23 100%)' }}
      >
        {/* Edit button */}
        <div className="flex justify-end mb-2">
          <button className="text-xs text-blue-400 border border-blue-900/40 rounded-full px-3 py-1">
            Edit Name
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <AvatarDisplay avatar={user.avatar} size="xl" />
            {/* Level badge */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-black rounded-full px-2 py-0.5 text-white"
              style={{ background: '#1d4ed8', border: '2px solid #060f23', boxShadow: '0 0 8px #3b82f660' }}
            >
              Lv {level}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="streak-fire text-base">🔥</span>
              <span className="text-sm font-bold text-amber-400">{user.streak} day streak</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-center">
                <div className="text-lg font-black text-white">{hoursTotal}</div>
                <div className="text-[10px] text-gray-500">hours</div>
              </div>
              <div className="w-px h-6 bg-blue-900/40" />
              <div className="text-center">
                <div className="text-lg font-black text-white">{user.longestStreak}</div>
                <div className="text-[10px] text-gray-500">best streak</div>
              </div>
              <div className="w-px h-6 bg-blue-900/40" />
              <div className="text-center">
                <div className="text-lg font-black text-white">{user.achievements.length}</div>
                <div className="text-[10px] text-gray-500">badges</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Level {level}</span>
            <span>{user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()} XP</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-2.5 bg-blue-950 rounded-full overflow-hidden">
            <div
              className="h-full xp-shimmer rounded-full"
              style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex border-b border-blue-900/30 flex-shrink-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-3 text-sm font-medium transition-colors duration-200 relative"
            style={{ color: tab === t ? '#60a5fa' : '#6b7280' }}
          >
            {t}
            {tab === t && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'Avatar' && <AvatarCustomizer avatarTab={avatarTab} setAvatarTab={setAvatarTab} />}
        {tab === 'Stats' && <StatsView />}
        {tab === 'Badges' && <BadgesView />}
      </div>
    </div>
  )
}

function AvatarCustomizer({ avatarTab, setAvatarTab }) {
  const { user, updateAvatar } = useStore()
  const avTabs = [
    { id: 'animal', label: '🐾 Animal' },
    { id: 'color', label: '🎨 Color' },
    { id: 'hat', label: '🎩 Hat' },
    { id: 'frame', label: '🖼 Frame' },
    { id: 'bg', label: '🌌 Scene' },
  ]

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Avatar preview */}
      <div className="flex justify-center py-2">
        <div className="float-anim">
          <AvatarDisplay avatar={user.avatar} size="xl" />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {avTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setAvatarTab(t.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: avatarTab === t.id ? '#1d4ed8' : '#0a1628',
              border: `1px solid ${avatarTab === t.id ? '#3b82f6' : '#1d4ed830'}`,
              color: avatarTab === t.id ? '#fff' : '#6b7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Options */}
      {avatarTab === 'animal' && (
        <div className="grid grid-cols-4 gap-3">
          {ANIMALS.map((a) => (
            <button
              key={a.id}
              onClick={() => updateAvatar('animal', a.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
              style={{
                background: user.avatar.animal === a.id ? '#0d1f3c' : '#060f23',
                border: `1px solid ${user.avatar.animal === a.id ? '#3b82f6' : '#1d4ed820'}`,
                boxShadow: user.avatar.animal === a.id ? '0 0 12px #3b82f640' : 'none',
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-[10px] text-gray-400 truncate w-full text-center">{a.name}</span>
              <span
                className="text-[9px] font-bold"
                style={{ color: RARITY_COLORS[a.rarity] }}
              >
                {a.rarity}
              </span>
            </button>
          ))}
        </div>
      )}

      {avatarTab === 'color' && (
        <div className="grid grid-cols-4 gap-3">
          {COLOR_SCHEMES.map((c) => (
            <button
              key={c.id}
              onClick={() => updateAvatar('colorScheme', c.id)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
              style={{
                background: user.avatar.colorScheme === c.id ? '#0d1f3c' : '#060f23',
                border: `1px solid ${user.avatar.colorScheme === c.id ? c.ring : '#1d4ed820'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full"
                style={{ background: c.bg, border: `3px solid ${c.ring}`, boxShadow: `0 0 10px ${c.ring}60` }}
              />
              <span className="text-[10px] text-gray-400">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {avatarTab === 'hat' && (
        <div className="grid grid-cols-4 gap-3">
          {/* No hat option */}
          <button
            onClick={() => updateAvatar('hat', null)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
            style={{
              background: user.avatar.hat === null ? '#0d1f3c' : '#060f23',
              border: `1px solid ${user.avatar.hat === null ? '#3b82f6' : '#1d4ed820'}`,
            }}
          >
            <span className="text-2xl opacity-30">🚫</span>
            <span className="text-[10px] text-gray-400">None</span>
          </button>
          {HATS.map((h) => (
            <button
              key={h.id}
              onClick={() => updateAvatar('hat', h.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
              style={{
                background: user.avatar.hat === h.id ? '#0d1f3c' : '#060f23',
                border: `1px solid ${user.avatar.hat === h.id ? '#3b82f6' : '#1d4ed820'}`,
                boxShadow: user.avatar.hat === h.id ? '0 0 12px #3b82f640' : 'none',
              }}
            >
              <span className="text-2xl">{h.emoji}</span>
              <span className="text-[10px] text-gray-400 text-center leading-tight">{h.name}</span>
            </button>
          ))}
        </div>
      )}

      {avatarTab === 'frame' && (
        <div className="grid grid-cols-2 gap-3">
          {FRAMES.map((f) => (
            <button
              key={f.id}
              onClick={() => updateAvatar('frame', f.id)}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: user.avatar.frame === f.id ? '#0d1f3c' : '#060f23',
                border: `1px solid ${user.avatar.frame === f.id ? '#3b82f6' : '#1d4ed820'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={f.style}
              >
                🐾
              </div>
              <span className="text-xs text-gray-300">{f.name}</span>
            </button>
          ))}
        </div>
      )}

      {avatarTab === 'bg' && (
        <div className="grid grid-cols-2 gap-3">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              onClick={() => updateAvatar('background', b.id)}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: user.avatar.background === b.id ? '#0d1f3c' : '#060f23',
                border: `1px solid ${user.avatar.background === b.id ? '#3b82f6' : '#1d4ed820'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full"
                style={{ background: b.bg }}
              />
              <span className="text-xs text-gray-300">{b.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsView() {
  const { user, weekData, subjectStats } = useStore()
  const hoursTotal = Math.floor(user.totalMinutes / 60)
  const avgDaily = Math.round(user.totalMinutes / 30)

  const stats = [
    { label: 'Total Hours',    value: hoursTotal,         unit: 'hrs',  icon: '⏱️' },
    { label: 'Current Streak', value: user.streak,        unit: 'days', icon: '🔥' },
    { label: 'Longest Streak', value: user.longestStreak, unit: 'days', icon: '🏆' },
    { label: 'Daily Average',  value: avgDaily,           unit: 'min',  icon: '📈' },
    { label: 'Level',          value: user.level,         unit: '',     icon: '⭐' },
    { label: 'Fireflies',      value: user.fireflies,     unit: '',     icon: '🪲' },
  ]

  // Build donut data from subjectStats
  const donutData = SUBJECTS
    .map((s) => ({ label: s.label, emoji: s.emoji, minutes: subjectStats?.[s.id] || 0, color: s.color }))
    .filter((d) => d.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const totalTracked = donutData.reduce((s, d) => s + d.minutes, 0)

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Summary stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glow-card rounded-2xl p-3">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-white">
              {s.value.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-1">{s.unit}</span>
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subject breakdown — pie chart */}
      <div className="glow-card rounded-2xl p-4">
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-4">Time by Subject</div>

        <div className="flex items-center gap-5">
          <DonutChart data={donutData} size={160} thickness={28} showTotal />

          {/* Legend */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {donutData.slice(0, 6).map((d) => {
              const pct = totalTracked > 0 ? Math.round((d.minutes / totalTracked) * 100) : 0
              const hrs = (d.minutes / 60).toFixed(1)
              return (
                <div key={d.label} className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}80` }} />
                  <span className="text-xs text-gray-300 flex-1 truncate">{d.emoji} {d.label}</span>
                  <span className="text-xs font-bold text-white flex-shrink-0">{hrs}h</span>
                  <span className="text-[10px] text-gray-600 w-7 text-right flex-shrink-0">{pct}%</span>
                </div>
              )
            })}
            {donutData.length === 0 && (
              <p className="text-xs text-gray-600">Complete sessions to see your breakdown</p>
            )}
          </div>
        </div>

        {/* Full subject bars */}
        {donutData.length > 0 && (
          <div className="mt-4 flex flex-col gap-2.5 border-t border-blue-900/30 pt-4">
            {donutData.map((d) => {
              const pct = totalTracked > 0 ? (d.minutes / totalTracked) * 100 : 0
              const hrs = (d.minutes / 60).toFixed(1)
              return (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{d.emoji} {d.label}</span>
                    <span className="text-gray-500">{hrs}h · {Math.round(pct)}%</span>
                  </div>
                  <div className="h-1.5 bg-blue-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{ width: `${pct}%`, background: d.color, boxShadow: `0 0 6px ${d.color}80` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Weekly bar chart */}
      <div className="glow-card rounded-2xl p-4">
        <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-3">This Week</div>
        <div className="flex items-end gap-2 h-24">
          {weekData.map((d, i) => {
            const maxMins = Math.max(...weekData.map((w) => w.minutes), 1)
            const heightPct = d.minutes / maxMins
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm relative" style={{ height: 80 }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md transition-all"
                    style={{
                      height: `${heightPct * 100}%`,
                      background: d.studied ? 'linear-gradient(180deg, #60a5fa, #1d4ed8)' : '#0a1628',
                      boxShadow: d.studied ? '0 0 6px #3b82f640' : 'none',
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-600">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BadgesView() {
  const { user } = useStore()

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const earned = user.achievements.includes(a.id)
          return (
            <div
              key={a.id}
              className="rounded-2xl p-3 flex flex-col gap-2 transition-all"
              style={{
                background: earned ? '#0a1628' : '#060f23',
                border: `1px solid ${earned ? '#3b82f640' : '#1d4ed815'}`,
                opacity: earned ? 1 : 0.5,
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: earned ? '#0d1f3c' : '#060f23',
                    filter: earned ? 'none' : 'grayscale(100%)',
                  }}
                >
                  {a.emoji}
                </div>
                {earned && (
                  <span className="text-[10px] font-bold text-green-400 bg-green-950 border border-green-800/40 rounded-full px-2 py-0.5">
                    Earned
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{a.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{a.description}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <span>🪲</span>
                <span>{a.reward} fireflies</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
