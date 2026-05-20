import { getAnimal, getColorScheme, getFrame, getBackground, getHat, RARITY_GLOW } from '../data/avatars'

export default function AvatarDisplay({ avatar, size = 'md', showName = false, name = '' }) {
  const animal = getAnimal(avatar.animal)
  const color = getColorScheme(avatar.colorScheme)
  const frame = getFrame(avatar.frame)
  const bg = getBackground(avatar.background)
  const hat = getHat(avatar.hat)
  const rarityGlow = RARITY_GLOW[animal.rarity] || 'none'

  const sizes = {
    xs: { outer: 40, emoji: 18, hat: 12 },
    sm: { outer: 56, emoji: 26, hat: 16 },
    md: { outer: 80, emoji: 38, hat: 22 },
    lg: { outer: 110, emoji: 52, hat: 30 },
    xl: { outer: 140, emoji: 68, hat: 38 },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        {/* Background circle */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background: bg.bg,
            ...frame.style,
            boxShadow: [frame.style?.boxShadow, rarityGlow].filter(Boolean).join(', ') || undefined,
          }}
        >
          {/* Ring color accent */}
          <div
            className="absolute inset-1 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${color.ring}40 0%, transparent 70%)` }}
          />
          {/* Animal emoji */}
          <span
            className="relative z-10 select-none"
            style={{ fontSize: s.emoji, lineHeight: 1 }}
            role="img"
            aria-label={animal.name}
          >
            {animal.emoji}
          </span>
        </div>

        {/* Hat overlay */}
        {hat && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 select-none"
            style={{ fontSize: s.hat, lineHeight: 1 }}
          >
            {hat.emoji}
          </div>
        )}
      </div>

      {showName && name && (
        <span className="text-xs text-blue-300 font-medium truncate max-w-[70px] text-center">
          {name}
        </span>
      )}
    </div>
  )
}
