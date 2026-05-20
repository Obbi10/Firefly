export const ANIMALS = [
  { id: 'owl', emoji: '🦉', name: 'Owl', rarity: 'common' },
  { id: 'fox', emoji: '🦊', name: 'Fox', rarity: 'common' },
  { id: 'wolf', emoji: '🐺', name: 'Wolf', rarity: 'common' },
  { id: 'bear', emoji: '🐻', name: 'Bear', rarity: 'common' },
  { id: 'panda', emoji: '🐼', name: 'Panda', rarity: 'common' },
  { id: 'lion', emoji: '🦁', name: 'Lion', rarity: 'rare' },
  { id: 'tiger', emoji: '🐯', name: 'Tiger', rarity: 'rare' },
  { id: 'koala', emoji: '🐨', name: 'Koala', rarity: 'rare' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', rarity: 'epic' },
  { id: 'eagle', emoji: '🦅', name: 'Eagle', rarity: 'epic' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', rarity: 'legendary' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', rarity: 'legendary' },
]

export const COLOR_SCHEMES = [
  { id: 'blue', name: 'Ocean', bg: '#0a1628', ring: '#3b82f6', label: '#60a5fa' },
  { id: 'orange', name: 'Ember', bg: '#1a0800', ring: '#f97316', label: '#fb923c' },
  { id: 'gold', name: 'Solar', bg: '#1a1000', ring: '#f59e0b', label: '#fbbf24' },
  { id: 'purple', name: 'Cosmic', bg: '#0f0a1a', ring: '#a855f7', label: '#c084fc' },
  { id: 'grey', name: 'Arctic', bg: '#111827', ring: '#6b7280', label: '#9ca3af' },
  { id: 'pink', name: 'Blossom', bg: '#1a0818', ring: '#ec4899', label: '#f472b6' },
  { id: 'teal', name: 'Glacier', bg: '#00181a', ring: '#14b8a6', label: '#2dd4bf' },
  { id: 'green', name: 'Forest', bg: '#001a0a', ring: '#22c55e', label: '#4ade80' },
]

export const HATS = [
  { id: 'crown', emoji: '👑', name: 'Crown', position: 'top' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard Hat', position: 'top' },
  { id: 'cap', emoji: '🧢', name: 'Cap', position: 'top' },
  { id: 'tophat', emoji: '🎩', name: 'Top Hat', position: 'top' },
  { id: 'graduate', emoji: '🎓', name: 'Grad Cap', position: 'top' },
  { id: 'flower', emoji: '🌸', name: 'Flower', position: 'top' },
  { id: 'halo', emoji: '😇', name: 'Halo', position: 'top' },
  { id: 'star', emoji: '⭐', name: 'Star', position: 'top' },
]

export const FRAMES = [
  { id: 'default', name: 'Default', style: { border: '2px solid #1d4ed8' } },
  { id: 'gold', name: 'Gold', style: { border: '2px solid #f59e0b', boxShadow: '0 0 12px #f59e0b50' } },
  { id: 'neon', name: 'Neon Blue', style: { border: '2px solid #38bdf8', boxShadow: '0 0 16px #38bdf870' } },
  { id: 'rainbow', name: 'Rainbow', style: { border: '2px solid transparent', background: 'linear-gradient(#0a1628, #0a1628) padding-box, linear-gradient(135deg, #f59e0b, #ec4899, #3b82f6, #10b981) border-box' } },
  { id: 'fire', name: 'Fire', style: { border: '2px solid #ef4444', boxShadow: '0 0 16px #ef444460' } },
  { id: 'ice', name: 'Ice', style: { border: '2px solid #bfdbfe', boxShadow: '0 0 16px #bfdbfe60' } },
]

export const BACKGROUNDS = [
  { id: 'space', name: 'Space', bg: 'radial-gradient(ellipse at center, #0d1f3c 0%, #030712 70%)' },
  { id: 'forest', name: 'Forest', bg: 'radial-gradient(ellipse at center, #052e16 0%, #030712 70%)' },
  { id: 'ocean', name: 'Ocean', bg: 'radial-gradient(ellipse at center, #0c4a6e 0%, #030712 70%)' },
  { id: 'night', name: 'Night', bg: 'radial-gradient(ellipse at center, #1e1b4b 0%, #030712 70%)' },
  { id: 'sunset', name: 'Sunset', bg: 'radial-gradient(ellipse at center, #431407 0%, #030712 70%)' },
  { id: 'aurora', name: 'Aurora', bg: 'radial-gradient(ellipse at center, #064e3b 0%, #1e1b4b 50%, #030712 100%)' },
]

export const RARITY_COLORS = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

export const getAnimal = (id) => ANIMALS.find((a) => a.id === id) || ANIMALS[0]
export const getColorScheme = (id) => COLOR_SCHEMES.find((c) => c.id === id) || COLOR_SCHEMES[0]
export const getHat = (id) => HATS.find((h) => h.id === id) || null
export const getFrame = (id) => FRAMES.find((f) => f.id === id) || FRAMES[0]
export const getBackground = (id) => BACKGROUNDS.find((b) => b.id === id) || BACKGROUNDS[0]
