import { useState } from 'react'
import { useStore } from '../store/useStore'
import { SHOP_ITEMS, RARITY_STYLE } from '../data/items'
import AvatarDisplay from '../components/AvatarDisplay'

const CATEGORIES = ['All', 'Hats', 'Frames', 'Backgrounds']

export default function Shop() {
  const { user, buyItem, updateAvatar } = useStore()
  const [category, setCategory] = useState('All')
  const [toast, setToast] = useState(null)

  const filtered = SHOP_ITEMS.filter((item) => {
    if (category === 'All') return true
    if (category === 'Hats') return item.type === 'hat'
    if (category === 'Frames') return item.type === 'frame'
    if (category === 'Backgrounds') return item.type === 'background'
    return true
  })

  const handleBuy = (item) => {
    if (user.ownedItems.includes(item.id)) {
      // Equip
      if (item.type === 'hat') updateAvatar('hat', item.hatId)
      if (item.type === 'frame') updateAvatar('frame', item.frameId)
      if (item.type === 'background') updateAvatar('background', item.bgId)
      setToast({ msg: `Equipped ${item.name}!`, type: 'equip' })
    } else {
      if (user.fireflies < item.cost) {
        setToast({ msg: 'Not enough fireflies!', type: 'error' })
      } else {
        buyItem(item.id, item.cost)
        if (item.type === 'hat') updateAvatar('hat', item.hatId)
        if (item.type === 'frame') updateAvatar('frame', item.frameId)
        if (item.type === 'background') updateAvatar('background', item.bgId)
        setToast({ msg: `Bought ${item.name}!`, type: 'success' })
      }
    }
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="p-4 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white glow-text">Shop</h1>
            <p className="text-xs text-blue-400 mt-0.5">Customize your firefly</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/40 rounded-full px-3 py-1.5">
            <span>🪲</span>
            <span className="text-sm font-bold text-amber-400">{user.fireflies.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Avatar preview */}
      <div className="px-4 flex-shrink-0">
        <div className="glow-card rounded-2xl p-4 flex items-center gap-4">
          <AvatarDisplay avatar={user.avatar} size="lg" />
          <div>
            <div className="text-sm font-bold text-white">Your Avatar</div>
            <div className="text-xs text-gray-500 mt-1">Tap items below to equip or buy</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.avatar.hat && (
                <div className="text-xs bg-blue-950 border border-blue-900/40 rounded-full px-2 py-0.5 text-blue-300">
                  Hat equipped
                </div>
              )}
              <div className="text-xs bg-blue-950 border border-blue-900/40 rounded-full px-2 py-0.5 text-blue-300">
                {user.avatar.frame} frame
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto flex-shrink-0 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: category === c ? '#2563eb' : '#0a1628',
              border: `1px solid ${category === c ? '#3b82f6' : '#1d4ed830'}`,
              color: category === c ? '#fff' : '#6b7280',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => {
            const owned = user.ownedItems.includes(item.id)
            const canAfford = user.fireflies >= item.cost
            const style = RARITY_STYLE[item.rarity]

            return (
              <div
                key={item.id}
                className="rounded-2xl p-3 flex flex-col gap-2 transition-all duration-200"
                style={{
                  background: owned ? '#0a1628' : '#060f23',
                  border: owned ? `1px solid #3b82f640` : `1px solid #1d4ed825`,
                  boxShadow: owned ? '0 0 12px #3b82f615' : 'none',
                }}
              >
                {/* Item emoji & rarity */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: '#0a1628', border: `1px solid ${style.border.replace('border-', '')}` }}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className="text-[10px] font-bold rounded-full px-2 py-0.5"
                    style={{
                      background: owned ? '#1e3a5f' : '#0a1628',
                      color: style.text.replace('text-', ''),
                      border: `1px solid`,
                      borderColor: style.border.replace('border-', ''),
                    }}
                  >
                    {style.label}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">{item.description}</div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  className="mt-auto py-2 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{
                    background: owned
                      ? '#1d4ed820'
                      : canAfford
                        ? 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                        : '#1c1917',
                    border: owned
                      ? '1px solid #3b82f640'
                      : canAfford
                        ? '1px solid #3b82f660'
                        : '1px solid #44403c40',
                    color: owned ? '#60a5fa' : canAfford ? '#fff' : '#57534e',
                    boxShadow: owned ? 'none' : canAfford ? '0 0 8px #3b82f630' : 'none',
                  }}
                >
                  {owned ? 'Equip' : item.cost === 0 ? 'Free' : `🪲 ${item.cost}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium text-white z-50 transition-all"
          style={{
            background: toast.type === 'error' ? '#7f1d1d' : toast.type === 'equip' ? '#1d4ed8' : '#14532d',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'equip' ? '#3b82f6' : '#22c55e'}40`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
