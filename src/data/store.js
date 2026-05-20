// Daily, weekly, and seasonal store rotations
// "Today" is seeded by day-of-year so items rotate predictably

export const BOOST_CATALOG = [
  {
    id: 'boost_ff_2x_30m',
    type: 'ff',
    name: 'Coin Frenzy',
    description: '2× coins for 30 minutes',
    emoji: '🪙',
    multiplier: 2,
    durationMs: 30 * 60 * 1000,
    durationLabel: '30 min',
    rarity: 'common',
  },
  {
    id: 'boost_ff_2x_1h',
    type: 'ff',
    name: 'Glow Rush',
    description: '2× coins for 1 hour',
    emoji: '✨',
    multiplier: 2,
    durationMs: 60 * 60 * 1000,
    durationLabel: '1 hr',
    rarity: 'rare',
  },
  {
    id: 'boost_ff_3x_30m',
    type: 'ff',
    name: 'Swarm Mode',
    description: '3× coins for 30 minutes',
    emoji: '🌟',
    multiplier: 3,
    durationMs: 30 * 60 * 1000,
    durationLabel: '30 min',
    rarity: 'epic',
  },
  {
    id: 'boost_ff_2x_day',
    type: 'ff',
    name: 'Coin Rain',
    description: '2× coins all day',
    emoji: '🌧️',
    multiplier: 2,
    durationMs: 24 * 60 * 60 * 1000,
    durationLabel: '24 hrs',
    rarity: 'legendary',
  },
  {
    id: 'boost_xp_2x_1h',
    type: 'xp',
    name: 'Brain Boost',
    description: '2× XP for 1 hour',
    emoji: '🧠',
    multiplier: 2,
    durationMs: 60 * 60 * 1000,
    durationLabel: '1 hr',
    rarity: 'common',
  },
  {
    id: 'boost_xp_2x_2h',
    type: 'xp',
    name: 'Scholar Mode',
    description: '2× XP for 2 hours',
    emoji: '📖',
    multiplier: 2,
    durationMs: 2 * 60 * 60 * 1000,
    durationLabel: '2 hrs',
    rarity: 'rare',
  },
  {
    id: 'boost_xp_3x_1h',
    type: 'xp',
    name: 'Genius Hour',
    description: '3× XP for 1 hour',
    emoji: '💡',
    multiplier: 3,
    durationMs: 60 * 60 * 1000,
    durationLabel: '1 hr',
    rarity: 'epic',
  },
  {
    id: 'boost_streak_shield',
    type: 'shield',
    name: 'Streak Shield',
    description: 'Protect your streak for 1 missed day',
    emoji: '🛡️',
    multiplier: 1,
    durationMs: 48 * 60 * 60 * 1000,
    durationLabel: '48 hrs',
    rarity: 'rare',
  },
  {
    id: 'boost_streak_shield_7',
    type: 'shield',
    name: 'Iron Shield',
    description: 'Protect streak for up to 3 days',
    emoji: '⚔️',
    multiplier: 1,
    durationMs: 7 * 24 * 60 * 60 * 1000,
    durationLabel: '7 days',
    rarity: 'legendary',
  },
]

// Seasonal cosmetics (Spring 2026 theme)
export const SEASONAL_COSMETICS = [
  { id: 'seas_hat_flower_crown', type: 'hat', hatId: 'flower', name: 'Spring Crown', description: 'Cherry blossoms in full bloom', emoji: '🌸', rarity: 'seasonal' },
  { id: 'seas_hat_butterfly', type: 'hat', hatId: 'star', name: 'Butterfly Halo', description: 'Flutter through exams', emoji: '🦋', rarity: 'seasonal' },
  { id: 'seas_frame_bloom', type: 'frame', frameId: 'rainbow', name: 'Bloom Frame', description: 'Spring rainbow border', emoji: '🌈', rarity: 'seasonal' },
  { id: 'seas_bg_blossom', type: 'background', bgId: 'aurora', name: 'Blossom Night', description: 'Cherry trees under aurora', emoji: '🌌', rarity: 'seasonal' },
  { id: 'seas_bg_meadow', type: 'background', bgId: 'forest', name: 'Spring Meadow', description: 'Study in a blooming field', emoji: '🌿', rarity: 'seasonal' },
]

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

function weekOfYear() {
  return Math.floor(dayOfYear() / 7)
}

// ms until midnight UTC
export function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setUTCHours(24, 0, 0, 0)
  return midnight - now
}

// ms until next Monday 00:00 UTC
export function msUntilMonday() {
  const now = new Date()
  const day = now.getUTCDay() // 0=Sun, 1=Mon...
  const daysUntilMonday = (8 - day) % 7 || 7
  const nextMonday = new Date(now)
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday)
  nextMonday.setUTCHours(0, 0, 0, 0)
  return nextMonday - now
}

// Spring 2026 ends June 20 2026
export function msUntilSeasonEnd() {
  const end = new Date('2026-06-21T00:00:00Z')
  return Math.max(0, end - Date.now())
}

export function getDailyStore() {
  const day = dayOfYear()
  const boosts = seededShuffle(BOOST_CATALOG, day * 13).slice(0, 3)
  const costs = [45, 75, 120]
  return boosts.map((b, i) => ({ ...b, cost: costs[i], storeType: 'daily' }))
}

export const LOOTBOX_STORE_ITEMS = [
  {
    id: 'lb_spark',
    type: 'lootbox',
    boxType: 'spark',
    name: 'Spark Box',
    description: 'Common lootbox — coins, hats & frames',
    emoji: '📦',
    rarity: 'common',
    cost: 200,
    storeType: 'weekly',
  },
  {
    id: 'lb_glow',
    type: 'lootbox',
    boxType: 'glow',
    name: 'Glow Box',
    description: 'Rare lootbox — rare items & animals',
    emoji: '🎁',
    rarity: 'rare',
    cost: 450,
    storeType: 'weekly',
  },
  {
    id: 'lb_radiant',
    type: 'lootbox',
    boxType: 'radiant',
    name: 'Radiant Box',
    description: 'Epic lootbox — epic creatures & gear',
    emoji: '✨',
    rarity: 'epic',
    cost: 800,
    storeType: 'weekly',
  },
  {
    id: 'lb_celestial',
    type: 'lootbox',
    boxType: 'celestial',
    name: 'Celestial Box',
    description: 'Legendary lootbox — legendary creatures only',
    emoji: '🌟',
    rarity: 'legendary',
    cost: 1500,
    storeType: 'weekly',
  },
]

export function getWeeklyStore() {
  const week = weekOfYear()
  const boosts = seededShuffle(BOOST_CATALOG, week * 37).slice(0, 3)
  const cosmetics = seededShuffle(SEASONAL_COSMETICS, week * 71).slice(0, 2)
  const boostCosts = [90, 140, 220]
  const cosmeticCosts = [350, 500]
  // Rotate 2 lootboxes into the weekly store
  const lootboxes = seededShuffle(LOOTBOX_STORE_ITEMS, week * 53).slice(0, 2)
  return [
    ...boosts.map((b, i) => ({ ...b, id: b.id + '_w', cost: boostCosts[i], storeType: 'weekly' })),
    ...cosmetics.map((c, i) => ({ ...c, id: c.id + '_w', cost: cosmeticCosts[i], storeType: 'weekly' })),
    ...lootboxes,
  ]
}

export function getSeasonalStore() {
  return [
    ...SEASONAL_COSMETICS.map((c) => ({ ...c, cost: 600, storeType: 'seasonal' })),
    { ...BOOST_CATALOG[3], cost: 400, storeType: 'seasonal' }, // Firefly Rain
    { ...BOOST_CATALOG[8], cost: 550, storeType: 'seasonal' }, // Iron Shield
  ]
}

export function formatCountdown(ms) {
  if (ms <= 0) return 'Refreshing…'
  const totalSeconds = Math.floor(ms / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export const RARITY_STYLE = {
  common: { text: '#9ca3af', border: '#374151', bg: '#111827', label: 'Common' },
  rare: { text: '#60a5fa', border: '#1d4ed8', bg: '#0d1f3c', label: 'Rare' },
  epic: { text: '#c084fc', border: '#7c3aed', bg: '#1e1b4b', label: 'Epic' },
  legendary: { text: '#fbbf24', border: '#d97706', bg: '#1c1400', label: 'Legendary' },
  seasonal: { text: '#34d399', border: '#059669', bg: '#022c22', label: '🌸 Seasonal' },
}
