import { useState } from 'react'
import { useStore } from '../store/useStore'
import AvatarDisplay from '../components/AvatarDisplay'

const ROOM_MOODS = [
  { id: 'focus', label: '🎯 Deep Focus', vibe: 'Silent study session' },
  { id: 'chill', label: '☕ Chill Study', vibe: 'Relaxed atmosphere' },
  { id: 'hustle', label: '⚡ Hustle Mode', vibe: 'High energy grind' },
]

export default function StudyRoom() {
  const { user, friends, isStudying, setStudying, setPage } = useStore()
  const [roomMood, setRoomMood] = useState('focus')
  const [inRoom, setInRoom] = useState(true)
  const [messages, setMessages] = useState([
    { id: 1, from: 'Zara', text: 'Grinding through calculus 😤', time: '2m ago' },
    { id: 2, from: 'Mia', text: 'Anyone else on chapter 12?', time: '5m ago' },
    { id: 3, from: 'Aria', text: 'Just hit 2 hours! 🎉', time: '8m ago' },
  ])
  const [chatInput, setChatInput] = useState('')

  const online = friends.filter((f) => f.status !== 'offline')
  const studying = friends.filter((f) => f.status === 'studying')

  const sendMessage = () => {
    if (!chatInput.trim()) return
    setMessages((m) => [
      { id: Date.now(), from: 'You', text: chatInput, time: 'now' },
      ...m,
    ])
    setChatInput('')
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
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">{online.length} online</div>
        </div>
      </div>

      {/* Room mood selector */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-3 flex-shrink-0">
        {ROOM_MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setRoomMood(m.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
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
            minHeight: 180,
          }}
        >
          {/* Room ambience text */}
          <div className="absolute top-3 right-3 text-xs text-blue-500/60 italic">
            {ROOM_MOODS.find((m) => m.id === roomMood)?.vibe}
          </div>

          {/* Stars/particles in room */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-blue-400/40"
              style={{ left: `${Math.random() * 90 + 5}%`, top: `${Math.random() * 80 + 5}%` }}
            />
          ))}

          {/* Avatars in room */}
          <div className="flex flex-wrap gap-4 justify-center items-end pt-4">
            {/* User */}
            {inRoom && (
              <div className="flex flex-col items-center gap-1 relative">
                <div className="absolute -top-2 -right-1 text-xs bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <AvatarDisplay avatar={user.avatar} size="md" />
                <div className="text-xs text-blue-300 font-medium">You</div>
                <div className="text-[10px] text-green-400 bg-green-950/50 rounded-full px-2 py-0.5">
                  {isStudying ? 'Focusing' : 'Idle'}
                </div>
              </div>
            )}

            {/* Friends */}
            {online.map((f) => (
              <div key={f.id} className="flex flex-col items-center gap-1 relative">
                {f.status === 'studying' && (
                  <div className="absolute -top-2 -right-1 text-xs">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white online-dot" />
                    </div>
                  </div>
                )}
                {f.status === 'break' && (
                  <div className="absolute -top-2 -right-1 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500/80 flex items-center justify-center text-[10px]">
                      ☕
                    </div>
                  </div>
                )}
                <AvatarDisplay avatar={f.avatar} size="md" />
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

          {/* Desk / ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-800/30" />
        </div>
      </div>

      {/* Leaderboard strip */}
      <div className="px-4 mt-3 flex-shrink-0">
        <div className="glow-card rounded-2xl p-3">
          <div className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-2">Today's Leaders</div>
          <div className="flex flex-col gap-2">
            {[...friends, { id: 'me', name: 'You', avatar: user.avatar, minutesToday: 55, streak: user.streak }]
              .sort((a, b) => b.minutesToday - a.minutesToday)
              .slice(0, 4)
              .map((f, i) => (
                <div key={f.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-5 text-center" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#4b5563' }}>
                    {i + 1}
                  </span>
                  <AvatarDisplay avatar={f.avatar} size="xs" />
                  <span className="text-sm text-blue-200 flex-1">{f.name}</span>
                  <span className="text-xs text-gray-500">{f.minutesToday}m</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs text-amber-500">{f.streak}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="px-4 mt-3 flex flex-col flex-1 min-h-0">
        <div className="glow-card rounded-2xl flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-blue-900/30 flex-shrink-0">
            <span className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">Room Chat</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-2 min-h-0" style={{ maxHeight: 140 }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.from === 'You' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="rounded-2xl px-3 py-1.5 text-xs max-w-[75%]"
                  style={{
                    background: m.from === 'You' ? '#1d4ed8' : '#0a1628',
                    border: `1px solid ${m.from === 'You' ? '#3b82f640' : '#1d4ed830'}`,
                  }}
                >
                  {m.from !== 'You' && (
                    <div className="text-blue-400 font-medium mb-0.5">{m.from}</div>
                  )}
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
              placeholder="Encourage your squad..."
              className="flex-1 bg-blue-950/50 border border-blue-900/30 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-600"
            />
            <button
              onClick={sendMessage}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 hover:bg-blue-500 transition-colors"
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
