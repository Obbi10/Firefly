import { useState } from 'react'
import { useStore } from '../store/useStore'
import AvatarDisplay from '../components/AvatarDisplay'

const ROOM_MOODS = [
  { id: 'focus', label: '🎯 Deep Focus', vibe: 'Silent study session' },
  { id: 'chill', label: '☕ Chill Study', vibe: 'Relaxed atmosphere' },
  { id: 'hustle', label: '⚡ Hustle Mode', vibe: 'High energy grind' },
]

export default function StudyRoom() {
  const { user, friends, isStudying, startCall } = useStore()
  const [roomMood, setRoomMood] = useState('focus')
  const [messages, setMessages] = useState([
    { id: 1, from: 'Zara', text: 'Grinding through calculus 😤', time: '2m ago' },
    { id: 2, from: 'Mia', text: 'Anyone else on chapter 12?', time: '5m ago' },
    { id: 3, from: 'Aria', text: 'Just hit 2 hours! 🎉', time: '8m ago' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [callMenuOpen, setCallMenuOpen] = useState(false)

  const online = friends.filter((f) => f.status !== 'offline')
  const studying = friends.filter((f) => f.status === 'studying')

  const sendMessage = () => {
    if (!chatInput.trim()) return
    setMessages((m) => [{ id: Date.now(), from: 'You', text: chatInput, time: 'now' }, ...m])
    setChatInput('')
  }

  const handleGroupCall = () => {
    const ids = online.map((f) => f.id)
    startCall(ids)
    setCallMenuOpen(false)
  }

  const handleCallFriend = (friendId) => {
    startCall([friendId])
    setCallMenuOpen(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="p-4 pt-6 pb-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white glow-text">Study Room</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-green-400 online-dot" />
            <span className="text-sm text-green-400">{studying.length} studying now</span>
          </div>
        </div>
        {/* Call button group */}
        <div className="relative">
          <button
            onClick={() => setCallMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              border: '1px solid #22c55e50',
              boxShadow: '0 0 16px #22c55e30',
            }}
          >
            <PhoneIcon />
            Call
          </button>

          {callMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setCallMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-40 min-w-[200px]"
                style={{ background: '#0a1628', border: '1px solid #1d4ed840', boxShadow: '0 8px 32px #00000060' }}
              >
                <div className="p-2">
                  {/* Group call */}
                  <button
                    onClick={handleGroupCall}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-900/30 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-sm">👥</div>
                    <div>
                      <div className="text-sm font-semibold text-white">Group Call</div>
                      <div className="text-xs text-gray-500">All {online.length} online friends</div>
                    </div>
                  </button>

                  <div className="border-t border-blue-900/30 my-1" />

                  {/* Individual friends */}
                  {online.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleCallFriend(f.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-900/30 transition-colors text-left"
                    >
                      <AvatarDisplay avatar={f.avatar} size="xs" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">{f.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {f.status === 'studying' ? `Studying ${f.subject}` : 'On break'}
                        </div>
                      </div>
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: f.status === 'studying' ? '#4ade80' : '#f59e0b' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Room mood */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-3 flex-shrink-0">
        {ROOM_MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setRoomMood(m.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: roomMood === m.id ? '#1d4ed8' : '#0a1628',
              border: `1px solid ${roomMood === m.id ? '#3b82f6' : '#1d4ed830'}`,
              color: roomMood === m.id ? '#fff' : '#6b7280',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Room visualization */}
      <div className="px-4 flex-shrink-0">
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0d1f3c 0%, #060f23 100%)',
            border: '1px solid #1d4ed840',
            minHeight: 190,
          }}
        >
          <div className="absolute top-3 right-3 text-xs text-blue-500/60 italic">
            {ROOM_MOODS.find((m) => m.id === roomMood)?.vibe}
          </div>

          {/* Stars */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-blue-400/30"
              style={{ left: `${10 + i * 8}%`, top: `${15 + (i % 3) * 20}%` }}
            />
          ))}

          <div className="flex flex-wrap gap-4 justify-center items-end pt-4">
            {/* User */}
            <div className="flex flex-col items-center gap-1 relative">
              <AvatarDisplay avatar={user.avatar} size="md" />
              <div className="text-xs text-blue-300 font-medium">You</div>
              <div className="text-[10px] text-green-400 bg-green-950/50 rounded-full px-2 py-0.5">
                {isStudying ? 'Focusing' : 'Idle'}
              </div>
            </div>

            {online.map((f) => (
              <div key={f.id} className="flex flex-col items-center gap-1 relative">
                {f.status === 'studying' && (
                  <div className="absolute -top-2 -right-1">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white online-dot" />
                    </div>
                  </div>
                )}
                {f.status === 'break' && (
                  <div className="absolute -top-2 -right-1 text-sm">☕</div>
                )}
                {/* Individual call button on avatar hover */}
                <div className="relative group">
                  <AvatarDisplay avatar={f.avatar} size="md" />
                  <button
                    onClick={() => handleCallFriend(f.id)}
                    className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: '#16a34a99', backdropFilter: 'blur(4px)' }}
                  >
                    <span className="text-lg">📞</span>
                  </button>
                </div>
                <div className="text-xs text-blue-300 font-medium">{f.name}</div>
                <div
                  className="text-[10px] rounded-full px-2 py-0.5"
                  style={{
                    background: f.status === 'studying' ? '#052e16' : '#1c1917',
                    color: f.status === 'studying' ? '#4ade80' : '#a16207',
                  }}
                >
                  {f.status === 'studying' ? f.subject : 'On break'}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-800/30" />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 mt-3 flex-shrink-0">
        <div className="glow-card rounded-2xl p-3">
          <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-2">Today's Leaders</div>
          <div className="flex flex-col gap-2">
            {[...friends, { id: 'me', name: 'You', avatar: user.avatar, minutesToday: 55, streak: 14 }]
              .sort((a, b) => b.minutesToday - a.minutesToday)
              .slice(0, 4)
              .map((f, i) => (
                <div key={f.id} className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold w-5 text-center"
                    style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#4b5563' }}
                  >
                    {i + 1}
                  </span>
                  <AvatarDisplay avatar={f.avatar} size="xs" />
                  <span className="text-sm text-blue-200 flex-1">{f.name}</span>
                  <span className="text-xs text-gray-500">{f.minutesToday}m</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs text-amber-500">{f.streak}</span>
                  </div>
                  {f.id !== 'me' && (
                    <button
                      onClick={() => handleCallFriend(f.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-green-900/40 transition-colors"
                      title={`Call ${f.name}`}
                    >
                      📞
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="px-4 mt-3 flex flex-col flex-1 min-h-0">
        <div className="glow-card rounded-2xl flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-blue-900/30 flex-shrink-0 flex items-center justify-between">
            <span className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">Room Chat</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-2 min-h-0" style={{ maxHeight: 130 }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.from === 'You' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="rounded-2xl px-3 py-1.5 text-xs max-w-[75%]"
                  style={{
                    background: m.from === 'You' ? '#1d4ed8' : '#0a1628',
                    border: `1px solid ${m.from === 'You' ? '#3b82f640' : '#1d4ed830'}`,
                  }}
                >
                  {m.from !== 'You' && <div className="text-blue-400 font-medium mb-0.5">{m.from}</div>}
                  <div className="text-gray-200">{m.text}</div>
                  <div className="text-gray-600 text-[10px] mt-0.5">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-blue-900/30 flex gap-2 flex-shrink-0">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Encourage your squad…"
              className="flex-1 bg-blue-950/50 border border-blue-900/30 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-600"
            />
            <button
              onClick={sendMessage}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors flex-shrink-0"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div className="h-3 flex-shrink-0" />
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.53 2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.82-.82a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
