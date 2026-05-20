import { ANIMALS } from './avatars'
import { SHOP_ITEMS } from './items'

export const LOOTBOX_TYPES = {
  spark: {
    id: 'spark',
    name: 'Spark Box',
    emoji: '📦',
    color: '#9ca3af',
    glowColor: '#9ca3af50',
    rarity: 'common',
    sessionMinutes: 25,
    description: 'Earned after a 25-min session',
  },
  glow: {
    id: 'glow',
    name: 'Glow Box',
    emoji: '🎁',
    color: '#3b82f6',
    glowColor: '#3b82f660',
    rarity: 'rare',
    sessionMinutes: 60,
    description: 'Earned after a 60-min session',
  },
  radiant: {
    id: 'radiant',
    name: 'Radiant Box',
    emoji: '✨',
    color: '#a855f7',
    glowColor: '#a855f770',
    rarity: 'epic',
    sessionMinutes: 90,
    description: 'Earned after a 90-min session',
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Box',
    emoji: '🌟',
    color: '#f59e0b',
    glowColor: '#f59e0b80',
    rarity: 'legendary',
    sessionMinutes: 120,
    description: 'Earned after a 120-min session',
  },
}

// Drop tables — each entry: { weight (out of 100), type, rarity, subtype }
const DROP_TABLES = {
  spark: [
    { weight: 35, type: 'coins', min: 25,  max: 150  },
    { weight: 20, type: 'item',  rarity: 'common',    subtype: 'hat'        },
    { weight: 15, type: 'item',  rarity: 'common',    subtype: 'frame'      },
    { weight: 10, type: 'item',  rarity: 'common',    subtype: 'background' },
    { weight: 10, type: 'item',  rarity: 'rare',      subtype: 'hat'        },
    { weight:  5, type: 'animal',rarity: 'rare'                             },
    { weight:  4, type: 'item',  rarity: 'epic',      subtype: 'hat'        },
    { weight:  1, type: 'animal',rarity: 'epic'                             },
  ],
  glow: [
    { weight: 22, type: 'coins', min: 150, max: 400  },
    { weight: 18, type: 'item',  rarity: 'rare',      subtype: 'hat'        },
    { weight: 15, type: 'item',  rarity: 'rare',      subtype: 'frame'      },
    { weight: 12, type: 'item',  rarity: 'rare',      subtype: 'background' },
    { weight: 12, type: 'animal',rarity: 'rare'                             },
    { weight:  9, type: 'item',  rarity: 'epic',      subtype: 'frame'      },
    { weight:  7, type: 'animal',rarity: 'epic'                             },
    { weight:  4, type: 'item',  rarity: 'legendary', subtype: 'hat'        },
    { weight:  1, type: 'animal',rarity: 'legendary'                        },
  ],
  radiant: [
    { weight: 18, type: 'coins', min: 300, max: 800  },
    { weight: 20, type: 'item',  rarity: 'epic',      subtype: 'hat'        },
    { weight: 15, type: 'item',  rarity: 'epic',      subtype: 'frame'      },
    { weight: 12, type: 'item',  rarity: 'epic',      subtype: 'background' },
    { weight: 16, type: 'animal',rarity: 'epic'                             },
    { weight:  8, type: 'item',  rarity: 'legendary', subtype: 'frame'      },
    { weight:  7, type: 'item',  rarity: 'legendary', subtype: 'hat'        },
    { weight:  4, type: 'animal',rarity: 'legendary'                        },
  ],
  celestial: [
    { weight: 12, type: 'coins', min: 800, max: 2000 },
    { weight: 35, type: 'animal',rarity: 'legendary'                        },
    { weight: 22, type: 'item',  rarity: 'legendary', subtype: 'frame'      },
    { weight: 16, type: 'item',  rarity: 'legendary', subtype: 'hat'        },
    { weight: 10, type: 'item',  rarity: 'legendary', subtype: 'background' },
    { weight:  5, type: 'animal',rarity: 'epic'                             },
  ],
}

function pickByRarityAndSubtype(rarity, subtype) {
  const pool = SHOP_ITEMS.filter((i) => i.rarity === rarity && i.type === subtype)
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function pickAnimalByRarity(rarity) {
  const pool = ANIMALS.filter((a) => a.rarity === rarity)
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function rollLootbox(boxType, ownedItems = [], unlockedAnimals = []) {
  const table = DROP_TABLES[boxType]
  if (!table) return { type: 'coins', amount: 50, label: '50 Coins', emoji: '🪙', rarity: 'common' }

  const roll = Math.random() * 100
  let cumulative = 0
  let entry = table[table.length - 1]

  for (const e of table) {
    cumulative += e.weight
    if (roll < cumulative) { entry = e; break }
  }

  if (entry.type === 'coins') {
    const amount = Math.floor(Math.random() * (entry.max - entry.min + 1)) + entry.min
    return { type: 'coins', amount, label: `${amount} Coins`, emoji: '🪙', rarity: 'common' }
  }

  if (entry.type === 'animal') {
    const animal = pickAnimalByRarity(entry.rarity)
    if (!animal || unlockedAnimals.includes(animal.id)) {
      // Consolation: give coins
      const amount = entry.rarity === 'legendary' ? 400 : entry.rarity === 'epic' ? 150 : 60
      return { type: 'coins', amount, label: `${amount} Coins (duplicate)`, emoji: '🪙', rarity: entry.rarity }
    }
    return {
      type: 'animal',
      animalId: animal.id,
      label: animal.name,
      emoji: animal.emoji,
      rarity: animal.rarity,
      description: `New creature unlocked!`,
    }
  }

  if (entry.type === 'item') {
    const item = pickByRarityAndSubtype(entry.rarity, entry.subtype)
    if (!item || ownedItems.includes(item.id)) {
      const amount = entry.rarity === 'legendary' ? 300 : entry.rarity === 'epic' ? 100 : 40
      return { type: 'coins', amount, label: `${amount} Coins (duplicate)`, emoji: '🪙', rarity: entry.rarity }
    }
    return {
      type: 'item',
      itemId: item.id,
      item,
      label: item.name,
      emoji: item.emoji,
      rarity: item.rarity,
      description: item.description,
    }
  }

  return { type: 'coins', amount: 50, label: '50 Coins', emoji: '🪙', rarity: 'common' }
}

export function getLootboxForSession(minutes) {
  if (minutes >= 120) return 'celestial'
  if (minutes >= 90)  return 'radiant'
  if (minutes >= 60)  return 'glow'
  if (minutes >= 25)  return 'spark'
  return null
}
