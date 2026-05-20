import { useState } from 'react'
import { useStore } from '../store/useStore'
import { LOOTBOX_TYPES } from '../data/lootboxes'
import { RARITY_COLORS, RARITY_GLOW } from '../data/avatars'

const RARITY_BG = {
  common:    '#111827',
  rare:      '#0d1f3c',
  epic:      '#1e1b4b',
  legendary: '#1c1400',
}

const RARITY_BORDER = {
  common:    '#374151',
  rare:      '#1d4ed8',
  epic:      '#7c3aed',
  legendary: '#d97706',
}

export default function LootboxModal() {
  const { pendingLootboxes, openNextLootbox } = useStore()
  const [phase, setPhase] = useState('idle') // idle | shaking | opening | revealed
  const [result, setResult] = useState(null)

  const pending = pendingLootboxes[0]
  if (!pending) return null

  const boxInfo = LOOTBOX_TYPES[pending.boxType]

  const handleOpen = () => {
    if (phase !== 'idle') return
    setPhase('shaking')
    setTimeout(() => setPhase('opening'), 700)
    setTimeout(() => {
      const res = openNextLootbox()
      setResult(res)
      setPhase('revealed')
    }, 1400)
  }

  const handleClaim = () => {
    setResult(null)
    setPhase('idle')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(3,7,18,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative mx-4 rounded-3xl p-6 flex flex-col items-center gap-5 w-full max-w-sm"
        style={{
          background: '#060f23',
          border: '1px solid #1d4ed840',
          boxShadow: '0 0 60px #1d4ed820',
        }}
      >
        {/* Count badge */}
        {pendingLootboxes.length > 1 && phase === 'idle' && (
          <div
            className="absolute top-4 right-4 text-xs font-bold rounded-full px-2 py-0.5"
            style={{ background: '#1d4ed8', color: '#fff' }}
          >
            {pendingLootboxes.length} pending
          </div>
        )}

        {phase !== 'revealed' ? (
          <>
            <div className="text-center">
              <div className="text-sm text-blue-400 font-medium uppercase tracking-wider mb-1">
                Lootbox Earned!
              </div>
              <div className="text-xl font-black text-white">{boxInfo?.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{boxInfo?.description}</div>
            </div>

            {/* Chest */}
            <div
              className={`text-8xl select-none ${
                phase === 'shaking' ? 'lb-shake' : phase === 'opening' ? 'lb-open' : 'float-anim'
              }`}
            >
              {boxInfo?.emoji}
            </div>

            <div
              className="w-full rounded-2xl p-3 text-center text-xs text-gray-500"
              style={{ background: '#0a1628', border: '1px solid #1d4ed820' }}
            >
              <span style={{ color: boxInfo?.color }}>
                {boxInfo?.rarity?.charAt(0).toUpperCase() + boxInfo?.rarity?.slice(1)}
              </span>
              {' '}lootbox · tap to reveal your reward
            </div>

            <button
              onClick={handleOpen}
              disabled={phase !== 'idle'}
              className="w-full py-4 rounded-2xl text-white font-black text-lg transition-all"
              style={{
                background: phase === 'idle'
                  ? `linear-gradient(135deg, ${boxInfo?.color}cc, ${boxInfo?.color}88)`
                  : '#1d4ed840',
                border: `2px solid ${boxInfo?.color}60`,
                boxShadow: phase === 'idle' ? `0 0 24px ${boxInfo?.color}40` : 'none',
                opacity: phase === 'idle' ? 1 : 0.6,
              }}
            >
              {phase === 'idle' ? '✨ Open Box' : phase === 'shaking' ? 'Opening…' : '🎊 Revealing…'}
            </button>
          </>
        ) : (
          <RewardReveal result={result} onClaim={handleClaim} morePending={pendingLootboxes.length > 0} />
        )}
      </div>
    </div>
  )
}

function RewardReveal({ result, onClaim, morePending }) {
  if (!result) return null
  const { reward, lootbox } = result
  const rarity = reward.rarity || 'common'
  const rarityColor = RARITY_COLORS[rarity]
  const glowStyle = RARITY_GLOW[rarity]

  return (
    <div className="flex flex-col items-center gap-4 w-full lb-reveal">
      <div className="text-sm text-blue-400 font-medium uppercase tracking-wider">You received…</div>

      {/* Reward card */}
      <div
        className="w-full rounded-2xl p-5 flex flex-col items-center gap-3"
        style={{
          background: RARITY_BG[rarity],
          border: `2px solid ${RARITY_BORDER[rarity]}`,
          boxShadow: glowStyle !== 'none' ? glowStyle : undefined,
        }}
      >
        <div
          className="text-7xl"
          style={{ filter: glowStyle !== 'none' ? `drop-shadow(0 0 16px ${rarityColor})` : undefined }}
        >
          {reward.emoji}
        </div>

        <div className="text-center">
          <div className="text-xl font-black text-white">{reward.label}</div>
          {reward.description && (
            <div className="text-sm text-gray-400 mt-0.5">{reward.description}</div>
          )}
        </div>

        <div
          className="text-xs font-bold rounded-full px-3 py-1"
          style={{ background: `${rarityColor}20`, color: rarityColor, border: `1px solid ${rarityColor}40` }}
        >
          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
        </div>
      </div>

      <button
        onClick={onClaim}
        className="w-full py-4 rounded-2xl text-white font-black text-base transition-all"
        style={{
          background: 'linear-gradient(135deg, #1d4ed8cc, #1d4ed888)',
          border: '2px solid #3b82f660',
          boxShadow: '0 0 20px #3b82f630',
        }}
      >
        {morePending ? '🎁 Claim & Open Next' : '✅ Claim'}
      </button>
    </div>
  )
}
