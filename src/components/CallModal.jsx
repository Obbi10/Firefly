import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import AvatarDisplay from './AvatarDisplay'

export default function CallModal() {
  const { call, friends, user, endCall, toggleMyMute, toggleMyCamera, setSpeaking, callConnected } = useStore()
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef(null)

  const participants = call?.participants.map((id) => friends.find((f) => f.id === id)).filter(Boolean) ?? []

  // Mark connected after 1.5s
  useEffect(() => {
    if (!call) return
    const t = setTimeout(() => callConnected(), 1500)
    return () => clearTimeout(t)
  }, [call?.participants?.join(',')])

  // Duration counter
  useEffect(() => {
    if (!call || call.connecting) { setDuration(0); return }
    intervalRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    return () => clearInterval(intervalRef.current)
  }, [call?.connecting])

  // Rotate "speaking" indicator among participants
  useEffect(() => {
    if (!call || call.connecting) return
    const ids = [...call.participants, 'me']
    const t = setInterval(() => {
      const next = ids[Math.floor(Math.random() * ids.length)]
      setSpeaking(next)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(t)
  }, [call?.connecting, call?.participants?.join(',')])

  if (!call) return null

  const speakingId = call.speakingId
  const formatDur = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#030712f5', backdropFilter: 'blur(12px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">
            {call.connecting ? 'Connecting…' : 'Study Room Call'}
          </div>
          {!call.connecting && (
            <div className="text-sm font-bold text-white">{formatDur(duration)}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 bg-green-950/60 border border-green-800/40 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 online-dot" />
          <span className="text-xs text-green-400 font-medium">
            {call.connecting ? 'Calling…' : `${participants.length + 1} in call`}
          </span>
        </div>
      </div>

      {/* Participants grid */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {call.connecting ? (
          <ConnectingView participants={participants} />
        ) : (
          <>
            {/* Me */}
            <ParticipantTile
              avatar={user.avatar}
              name="You"
              isSpeaking={speakingId === 'me'}
              isMuted={call.myMuted}
              cameraOff={call.myCameraOff}
              isMe
            />

            {/* Others */}
            <div
              className="grid gap-3 w-full"
              style={{ gridTemplateColumns: participants.length === 1 ? '1fr' : participants.length <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' }}
            >
              {participants.map((f) => (
                <ParticipantTile
                  key={f.id}
                  avatar={f.avatar}
                  name={f.name}
                  isSpeaking={speakingId === f.id}
                  isMuted={false}
                  cameraOff={false}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-4 pb-12 pt-4">
        <CallButton
          icon={call.myMuted ? MicOffIcon : MicIcon}
          label={call.myMuted ? 'Unmute' : 'Mute'}
          active={call.myMuted}
          activeColor="#ef4444"
          onClick={toggleMyMute}
        />
        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            border: '2px solid #ef444460',
            boxShadow: '0 0 24px #ef444440',
          }}
        >
          <PhoneOffIcon />
        </button>
        <CallButton
          icon={call.myCameraOff ? CameraOffIcon : CameraIcon}
          label={call.myCameraOff ? 'Camera Off' : 'Camera On'}
          active={call.myCameraOff}
          activeColor="#f59e0b"
          onClick={toggleMyCamera}
        />
      </div>
    </div>
  )
}

function ParticipantTile({ avatar, name, isSpeaking, isMuted, cameraOff, isMe }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 relative"
      style={{
        background: isSpeaking ? '#0d1f3c' : '#060f23',
        border: `2px solid ${isSpeaking ? '#3b82f6' : '#1d4ed820'}`,
        boxShadow: isSpeaking ? '0 0 20px #3b82f630' : 'none',
        minWidth: isMe ? 180 : undefined,
      }}
    >
      {/* Speaking pulse ring */}
      {isSpeaking && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: '0 0 0 2px #3b82f680 inset',
            animation: 'pulse-online 1s ease-in-out infinite',
          }}
        />
      )}

      <AvatarDisplay avatar={avatar} size={isMe ? 'lg' : 'md'} />

      <div className="flex items-center gap-1.5">
        <span className="text-sm text-blue-200 font-medium">{name}</span>
        {isMuted && <span className="text-xs">🔇</span>}
        {cameraOff && <span className="text-xs">📵</span>}
      </div>

      {isSpeaking && (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-blue-400"
              style={{
                height: `${8 + Math.random() * 12}px`,
                animation: `float ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ConnectingView({ participants }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 flex items-center justify-center"
          style={{ animation: 'pulse-online 1.5s ease-in-out infinite' }}>
          <div className="w-16 h-16 rounded-full bg-blue-950 flex items-center justify-center text-3xl">📞</div>
        </div>
        <div className="absolute -inset-4 rounded-full border border-blue-400/10"
          style={{ animation: 'pulse-online 2s ease-in-out infinite' }} />
      </div>
      <div>
        <p className="text-white font-semibold text-center">Calling {participants.map((p) => p.name).join(', ')}</p>
        <p className="text-gray-500 text-sm text-center mt-1">Connecting to study room…</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500"
            style={{ animation: `float 1s ease-in-out ${i * 0.3}s infinite alternate` }}
          />
        ))}
      </div>
    </div>
  )
}

function CallButton({ icon: Icon, label, active, activeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: active ? `${activeColor}20` : '#0a1628',
          border: `1px solid ${active ? activeColor + '60' : '#1d4ed840'}`,
          boxShadow: active ? `0 0 12px ${activeColor}30` : 'none',
        }}
      >
        <Icon active={active} activeColor={activeColor} />
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </button>
  )
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}

function MicOffIcon({ activeColor }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeColor || '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}

function CameraOffIcon({ activeColor }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeColor || '#f59e0b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8"/>
    </svg>
  )
}

function PhoneOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/>
      <path d="M14.5 9.5A5 5 0 0 0 9.5 4.5"/>
      <line x1="23" y1="1" x2="1" y2="23"/>
    </svg>
  )
}
