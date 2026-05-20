import { useState, useRef } from 'react'
import { useStore } from '../store/useStore'
import AvatarDisplay from '../components/AvatarDisplay'

const GROUP_EMOJIS = ['🔬', '📐', '📖', '💻', '🎯', '⚡', '🌟', '🏆', '🧠', '🎨', '🌍', '🚀']

export default function Groups() {
  const { myGroups, activeGroupId, setActiveGroup } = useStore()

  if (activeGroupId) {
    const group = myGroups.find((g) => g.id === activeGroupId)
    if (group) return <GroupDetail group={group} />
  }

  return <GroupsList />
}

// ── Groups list ──────────────────────────────────────────────────────────────

function GroupsList() {
  const { myGroups, user, todayMinutes, setActiveGroup } = useStore()
  const [modal, setModal] = useState(null) // 'create' | 'join'

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white glow-text">Groups</h1>
            <p className="text-xs text-blue-400 mt-0.5">Study together, compete together</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal('join')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 transition-all"
              style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}
            >
              Join
            </button>
            <button
              onClick={() => setModal('create')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all btn-primary"
            >
              + Create
            </button>
          </div>
        </div>
      </div>

      {/* Group cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {myGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
            <div className="text-6xl float-anim">👥</div>
            <div className="text-center">
              <p className="text-white font-bold">No groups yet</p>
              <p className="text-sm text-gray-500 mt-1">Create one or join with a name and password</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal('join')} className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-300" style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}>
                Join Group
              </button>
              <button onClick={() => setModal('create')} className="px-4 py-2 rounded-xl text-sm font-bold text-white btn-primary">
                Create Group
              </button>
            </div>
          </div>
        )}

        {myGroups.map((group) => {
          const meEntry = group.members.find((m) => m.id === 'me')
          const myMinutes = meEntry ? meEntry.minutesThisWeek : todayMinutes
          const sorted = [...group.members].sort((a, b) => b.minutesThisWeek - a.minutesThisWeek)
          const myRank = sorted.findIndex((m) => m.id === 'me') + 1
          const topMember = sorted[0]

          return (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className="glow-card rounded-2xl p-4 text-left w-full transition-all hover:border-blue-500/40 active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                {/* Emoji badge */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}
                >
                  {group.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-white">{group.name}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{group.members.length} members</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: myRank === 1 ? '#1c1400' : '#0a1628', color: myRank === 1 ? '#fbbf24' : myRank <= 3 ? '#9ca3af' : '#4b5563', border: `1px solid ${myRank === 1 ? '#f59e0b40' : '#1d4ed830'}` }}>
                      #{myRank}
                    </span>
                  </div>

                  {/* Member avatar strip */}
                  <div className="flex items-center gap-1 mt-2">
                    {sorted.slice(0, 4).map((m) => (
                      <div key={m.id} className="relative" style={{ marginRight: -8 }}>
                        <AvatarDisplay avatar={m.avatar} size="xs" />
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <span className="text-[10px] text-gray-500 ml-3">+{group.members.length - 4}</span>
                    )}
                  </div>

                  {/* Top member */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      🏆 <span className="text-amber-400">{topMember?.name}</span> leading with {topMember?.minutesThisWeek}m
                    </div>
                    <span className="text-[10px] text-gray-600">→</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}

        {/* Discover hint */}
        {myGroups.length > 0 && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#060f23', border: '1px dashed #1d4ed840' }}
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="text-sm text-gray-400 font-medium">Find more groups</p>
              <p className="text-xs text-gray-600">Ask a friend for the name and password to join</p>
            </div>
            <button onClick={() => setModal('join')} className="ml-auto text-xs text-blue-400 flex-shrink-0 hover:text-blue-300">
              Join →
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'create' && <CreateGroupModal onClose={() => setModal(null)} />}
      {modal === 'join' && <JoinGroupModal onClose={() => setModal(null)} />}
    </div>
  )
}

// ── Create modal ─────────────────────────────────────────────────────────────

function CreateGroupModal({ onClose }) {
  const { createGroup, setActiveGroup } = useStore()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [emoji, setEmoji] = useState('🔬')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) { setError('Group name is required.'); return }
    if (!password.trim()) { setError('Password is required.'); return }
    const result = createGroup(name.trim(), password, emoji)
    if (!result.ok) { setError(result.error); return }
    onClose()
  }

  return (
    <Backdrop onClose={onClose}>
      <h2 className="text-lg font-black text-white mb-1">Create Group</h2>
      <p className="text-xs text-gray-500 mb-5">Others join using the exact name + password</p>

      {/* Emoji picker */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-2 block">Group icon</label>
        <div className="flex flex-wrap gap-2">
          {GROUP_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
              style={{
                background: emoji === e ? '#0d1f3c' : '#060f23',
                border: `1px solid ${emoji === e ? '#3b82f6' : '#1d4ed820'}`,
                boxShadow: emoji === e ? '0 0 10px #3b82f640' : 'none',
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <Field label="Group name" value={name} onChange={setName} placeholder="e.g. Year 12 Physics" />

      <div className="mt-3 relative">
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Share this with members"
          type={showPass ? 'text' : 'password'}
        />
        <button
          onClick={() => setShowPass((s) => !s)}
          className="absolute right-3 bottom-2.5 text-xs text-gray-500 hover:text-gray-300"
        >
          {showPass ? 'Hide' : 'Show'}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <div className="flex gap-3 mt-5">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400" style={{ background: '#060f23', border: '1px solid #1d4ed820' }}>
          Cancel
        </button>
        <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white btn-primary">
          Create Group
        </button>
      </div>
    </Backdrop>
  )
}

// ── Join modal ────────────────────────────────────────────────────────────────

function JoinGroupModal({ onClose }) {
  const { joinGroup } = useStore()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleJoin = () => {
    if (!name.trim()) { setError('Enter the group name.'); return }
    if (!password.trim()) { setError('Enter the password.'); return }
    const result = joinGroup(name.trim(), password)
    if (!result.ok) { setError(result.error); return }
    onClose()
  }

  return (
    <Backdrop onClose={onClose}>
      <h2 className="text-lg font-black text-white mb-1">Join Group</h2>
      <p className="text-xs text-gray-500 mb-5">Enter the exact group name and password</p>

      <Field label="Group name" value={name} onChange={setName} placeholder="e.g. Year 12 Physics" />

      <div className="mt-3 relative">
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Ask a group member"
          type={showPass ? 'text' : 'password'}
          onEnter={handleJoin}
        />
        <button
          onClick={() => setShowPass((s) => !s)}
          className="absolute right-3 bottom-2.5 text-xs text-gray-500 hover:text-gray-300"
        >
          {showPass ? 'Hide' : 'Show'}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <div className="flex gap-3 mt-5">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400" style={{ background: '#060f23', border: '1px solid #1d4ed820' }}>
          Cancel
        </button>
        <button onClick={handleJoin} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white btn-primary">
          Join Group
        </button>
      </div>
    </Backdrop>
  )
}

// ── Group detail ─────────────────────────────────────────────────────────────

function GroupDetail({ group }) {
  const { setActiveGroup, leaveGroup, sendGroupMessage, user, todayMinutes } = useStore()
  const [tab, setTab] = useState('leaderboard')
  const [chatInput, setChatInput] = useState('')
  const [showLeave, setShowLeave] = useState(false)

  // Patch in live user minutes
  const members = group.members.map((m) =>
    m.id === 'me' ? { ...m, minutesToday: todayMinutes, minutesThisWeek: m.minutesThisWeek - m.minutesToday + todayMinutes } : m
  )
  const sorted = [...members].sort((a, b) => b.minutesThisWeek - a.minutesThisWeek)
  const myRank = sorted.findIndex((m) => m.id === 'me') + 1

  const handleSend = () => {
    if (!chatInput.trim()) return
    sendGroupMessage(group.id, chatInput.trim())
    setChatInput('')
  }

  const handleLeave = () => {
    leaveGroup(group.id)
    setShowLeave(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center gap-3 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #0d1f3c 0%, #060f23 100%)' }}>
        <button
          onClick={() => setActiveGroup(null)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
          style={{ background: '#0a1628', border: '1px solid #1d4ed830' }}
        >
          ←
        </button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: '#0a1628', border: '1px solid #1d4ed840' }}
        >
          {group.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-white truncate">{group.name}</h2>
          <p className="text-xs text-gray-500">{members.length} members · Your rank: #{myRank}</p>
        </div>

        <button
          onClick={() => setShowLeave(true)}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
        >
          Leave
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-900/30 flex-shrink-0">
        {['leaderboard', 'chat'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-xs font-semibold capitalize transition-colors relative"
            style={{ color: tab === t ? '#60a5fa' : '#6b7280' }}
          >
            {t === 'leaderboard' ? '🏆 Leaderboard' : '💬 Chat'}
            {tab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-blue-400" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'leaderboard' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {/* Top 3 podium */}
          {sorted.length >= 3 && <Podium top3={sorted.slice(0, 3)} />}

          {/* Full list */}
          <div className="glow-card rounded-2xl overflow-hidden">
            {sorted.map((member, i) => {
              const isMe = member.id === 'me'
              const rankColor = i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2e' : '#4b5563'
              const hrs = (member.minutesThisWeek / 60).toFixed(1)
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-blue-900/20 last:border-0 transition-all"
                  style={{ background: isMe ? '#0d1f3c' : 'transparent' }}
                >
                  <span className="text-sm font-black w-5 text-center" style={{ color: rankColor }}>
                    {i + 1}
                  </span>
                  <AvatarDisplay avatar={member.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white">{member.name}</span>
                      {isMe && <span className="text-[10px] text-blue-400 bg-blue-950 rounded-full px-1.5">you</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px]">🔥</span>
                        <span className="text-[10px] text-amber-500">{member.streak}</span>
                      </div>
                      <span className="text-[10px] text-gray-600">{member.minutesToday}m today</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{hrs}h</div>
                    <div className="text-[10px] text-gray-600">this week</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Password share card */}
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: '#060f23', border: '1px dashed #1d4ed830' }}>
            <span className="text-lg">🔑</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">Invite others</p>
              <p className="text-xs text-gray-600">Name: <span className="text-gray-400">{group.name}</span> · Password: <span className="text-gray-400">{group.password}</span></p>
            </div>
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-2">
            {group.chat.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.from === 'You' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="rounded-2xl px-3 py-2 text-xs max-w-[78%]"
                  style={{
                    background: m.from === 'You' ? '#1d4ed8' : '#0a1628',
                    border: `1px solid ${m.from === 'You' ? '#3b82f640' : '#1d4ed830'}`,
                  }}
                >
                  {m.from !== 'You' && <div className="text-blue-400 font-semibold mb-0.5">{m.from}</div>}
                  <div className="text-gray-200">{m.text}</div>
                  <div className="text-gray-600 text-[10px] mt-0.5">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-blue-900/30 flex gap-2 flex-shrink-0">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message the group…"
              className="flex-1 bg-blue-950/50 border border-blue-900/30 rounded-full px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-600"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors flex-shrink-0"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Leave confirm */}
      {showLeave && (
        <Backdrop onClose={() => setShowLeave(false)}>
          <div className="text-3xl mb-3 text-center">👋</div>
          <h2 className="text-base font-bold text-white text-center mb-1">Leave {group.name}?</h2>
          <p className="text-xs text-gray-500 text-center mb-5">You'll need the password to rejoin.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowLeave(false)} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400" style={{ background: '#060f23', border: '1px solid #1d4ed820' }}>
              Cancel
            </button>
            <button onClick={handleLeave} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7f1d1d,#991b1b)', border: '1px solid #ef444440' }}>
              Leave
            </button>
          </div>
        </Backdrop>
      )}
    </div>
  )
}

// ── Podium ────────────────────────────────────────────────────────────────────

function Podium({ top3 }) {
  const order = [top3[1], top3[0], top3[2]] // 2nd, 1st, 3rd
  const heights = [70, 90, 55]
  const medals = ['🥈', '🥇', '🥉']
  const colors = ['#9ca3af', '#f59e0b', '#cd7c2e']

  return (
    <div className="glow-card rounded-2xl p-4">
      <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-4 text-center">This Week's Podium</div>
      <div className="flex items-end justify-center gap-3">
        {order.map((member, i) => (
          <div key={member.id} className="flex flex-col items-center gap-1.5">
            <span className="text-lg">{medals[i]}</span>
            <AvatarDisplay avatar={member.avatar} size="sm" />
            <div className="text-xs text-white font-semibold truncate max-w-[60px] text-center">{member.name}</div>
            <div
              className="w-16 rounded-t-xl flex items-end justify-center pb-2"
              style={{ height: heights[i], background: `linear-gradient(180deg, ${colors[i]}30, ${colors[i]}10)`, border: `1px solid ${colors[i]}40`, borderBottom: 'none' }}
            >
              <span className="text-xs font-bold" style={{ color: colors[i] }}>
                {(member.minutesThisWeek / 60).toFixed(1)}h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = 'text', onEnter }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        type={type}
        placeholder={placeholder}
        className="w-full bg-blue-950/50 border border-blue-900/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

function Backdrop({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: '#00000080', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-[430px] rounded-t-3xl p-6 pb-8"
        style={{ background: '#0a1628', border: '1px solid #1d4ed840', borderBottom: 'none' }}
      >
        {children}
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
