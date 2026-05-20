export const SHOP_ITEMS = [
  // Hats
  { id: 'hat_crown', type: 'hat', hatId: 'crown', name: 'Royal Crown', description: 'For the academic royalty', cost: 300, rarity: 'epic', emoji: '👑' },
  { id: 'hat_wizard', type: 'hat', hatId: 'wizard', name: 'Wizard Hat', description: 'Channel your inner scholar', cost: 150, rarity: 'rare', emoji: '🧙' },
  { id: 'hat_cap', type: 'hat', hatId: 'cap', name: 'Study Cap', description: 'Casual and cool', cost: 80, rarity: 'common', emoji: '🧢' },
  { id: 'hat_tophat', type: 'hat', hatId: 'tophat', name: 'Top Hat', description: 'Distinguished gentleman', cost: 120, rarity: 'rare', emoji: '🎩' },
  { id: 'hat_graduate', type: 'hat', hatId: 'graduate', name: 'Grad Cap', description: 'Earned through knowledge', cost: 200, rarity: 'rare', emoji: '🎓' },
  { id: 'hat_flower', type: 'hat', hatId: 'flower', name: 'Cherry Blossom', description: 'Bloom with every session', cost: 180, rarity: 'rare', emoji: '🌸' },
  { id: 'hat_halo', type: 'hat', hatId: 'halo', name: 'Study Halo', description: 'Pure academic dedication', cost: 250, rarity: 'epic', emoji: '😇' },
  { id: 'hat_star', type: 'hat', hatId: 'star', name: 'Star Crown', description: 'Shine like a star', cost: 350, rarity: 'epic', emoji: '⭐' },

  // Frames
  { id: 'frame_default', type: 'frame', frameId: 'default', name: 'Standard Frame', description: 'The classic look', cost: 0, rarity: 'common', emoji: '🔵' },
  { id: 'frame_gold', type: 'frame', frameId: 'gold', name: 'Gold Frame', description: 'Glittering gold border', cost: 400, rarity: 'epic', emoji: '🟡' },
  { id: 'frame_neon', type: 'frame', frameId: 'neon', name: 'Neon Frame', description: 'Electric blue glow', cost: 300, rarity: 'rare', emoji: '💠' },
  { id: 'frame_rainbow', type: 'frame', frameId: 'rainbow', name: 'Rainbow Frame', description: 'All the colors of study', cost: 600, rarity: 'legendary', emoji: '🌈' },
  { id: 'frame_fire', type: 'frame', frameId: 'fire', name: 'Fire Frame', description: 'Burning passion for learning', cost: 450, rarity: 'epic', emoji: '🔥' },
  { id: 'frame_ice', type: 'frame', frameId: 'ice', name: 'Ice Frame', description: 'Cool as a cucumber', cost: 350, rarity: 'rare', emoji: '❄️' },

  // Backgrounds
  { id: 'bg_space', type: 'background', bgId: 'space', name: 'Deep Space', description: 'Study among the stars', cost: 0, rarity: 'common', emoji: '🌌' },
  { id: 'bg_forest', type: 'background', bgId: 'forest', name: 'Enchanted Forest', description: 'Study in the woods', cost: 200, rarity: 'rare', emoji: '🌿' },
  { id: 'bg_ocean', type: 'background', bgId: 'ocean', name: 'Ocean Depths', description: 'Dive deep into knowledge', cost: 200, rarity: 'rare', emoji: '🌊' },
  { id: 'bg_night', type: 'background', bgId: 'night', name: 'Starry Night', description: 'Night owl approved', cost: 250, rarity: 'rare', emoji: '🌙' },
  { id: 'bg_sunset', type: 'background', bgId: 'sunset', name: 'Golden Sunset', description: 'End every day strong', cost: 300, rarity: 'epic', emoji: '🌅' },
  { id: 'bg_aurora', type: 'background', bgId: 'aurora', name: 'Aurora Borealis', description: 'Rare beauty for rare minds', cost: 700, rarity: 'legendary', emoji: '✨' },
]

export const ACHIEVEMENTS = [
  { id: 'streak_7', name: '7-Day Streak', emoji: '🔥', description: 'Study 7 days in a row', reward: 100 },
  { id: 'streak_30', name: '30-Day Streak', emoji: '💥', description: 'Study 30 days in a row', reward: 500 },
  { id: 'streak_100', name: '100-Day Legend', emoji: '🏆', description: 'The ultimate dedication', reward: 2000 },
  { id: 'study_10h', name: '10 Hours', emoji: '⏱️', description: 'Total 10 hours of study', reward: 150 },
  { id: 'study_100h', name: '100 Hours', emoji: '📚', description: 'Total 100 hours of study', reward: 800 },
  { id: 'first_room', name: 'Social Scholar', emoji: '👥', description: 'Join your first study room', reward: 50 },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Study after midnight', reward: 200 },
  { id: 'early_bird', name: 'Early Bird', emoji: '🌅', description: 'Study before 7am', reward: 200 },
]

export const RARITY_STYLE = {
  common: { text: 'text-gray-400', bg: 'bg-gray-800', border: 'border-gray-600', label: 'Common' },
  rare: { text: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-600', label: 'Rare' },
  epic: { text: 'text-purple-400', bg: 'bg-purple-950', border: 'border-purple-600', label: 'Epic' },
  legendary: { text: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-500', label: 'Legendary' },
}
