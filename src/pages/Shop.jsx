import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SHOP_ITEMS } from '../data/items'
import {
  getDailyStore, getWeeklyStore, getSeasonalStore,
  msUntilMidnight, msUntilMonday, msUntilSeasonEnd,
  formatCountdown, RARITY_STYLE,
} from '../data/store'
import AvatarDisplay from '../components/AvatarDisplay'

const TABS = ['Daily', 'Weekly', 'Seasonal', 'Permanent']

export default function Shop() {
  const { user, buyItem, buyBoost, updateAvatar, activeBoosts, pruneBoosts } = useStore()
  const [tab, setTab] = useState('Daily')
  const [toast, setToast] = useState(null)
  const [, tick] = useState(0)

  // Refresh countdown every minute
  useEffect(() => {
    pruneBoosts()
    const id = setInterval(() => tick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleBuyCosmetic = (item) => {
    if (user.ownedItems.includes(item.id)) {
      if (item.type === 'hat') updateAvatar('hat', item.hatId)
      if (item.type === 'frame') updateAvatar('frame', item.frameId)
      if (item.type === 'background') updateAvatar('background', item.bgId)
      showToast(`Equipped ${item.name}!`, 'equip')
      return
    }
    if (user.fireflies < item.cost) { showToast('Not enough fireflies!', 'error'); return }
    buyItem(item.id, item.cost)
    if (item.type === 'hat') updateAvatar('hat', item.hatId)
    if (item.type === 'frame') updateAvatar('frame', item.frameId)
    if (item.type === 'background') updateAvatar('background', item.bgId)
    showToast(`Bought ${item.name}!`, 'success')
  }

  const handleBuyBoost = (boost) => {
    const already = activeBoosts.find((b) => b.id === boost.id && b.expiresAt > Date.now())
    if (already) { showToast('Boost already active!', 'error'); return }
    const ok = buyBoost(boost)
    if (!ok) { showToast('Not enough fireflies!', 'error'); return }
    showToast(`${boost.name} activated!`, 'success')
  }

  const dailyItems = getDailyStore()
  const weeklyItems = getWeeklyStore()
  const seasonalItems = getSeasonalStore()

  const dailyMs = msUntilMidnight()
  const weeklyMs = msUntilMonday()
  const seasonalMs = msUntilSeasonEnd()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white glow-text">Store</h1>
            <p className="text-xs text-blue-400 mt-0.5">Spend your hard-earned fireflies</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/40 rounded-full px-3 py-1">
              <span className="text-sm">🪲</span>
              <span className="text-sm font-bold text-amber-400">{user.fireflies.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Active boosts strip */}
        <ActiveBoostsStrip />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-900/30 flex-shrink-0 px-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-xs font-semibold transition-colors relative"
            style={{ color: tab === t ? '#60a5fa' : '#6b7280' }}
          >
            {t}
            {tab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-blue-400" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'Daily' && (
          <StoreSection
            items={dailyItems}
            countdown={formatCountdown(dailyMs)}
            countdownLabel="Refreshes in"
            accentColor="#3b82f6"
            accentEmoji="🌅"
            sectionLabel="Daily Deals"
            onBuyBoost={handleBuyBoost}
            onBuyCosmetic={handleBuyCosmetic}
            user={user}
            activeBoosts={activeBoosts}
          />
        )}
        {tab === 'Weekly' && (
          <StoreSection
            items={weeklyItems}
            countdown={formatCountdown(weeklyMs)}
            countdownLabel="Refreshes in"
            accentColor="#a855f7"
            accentEmoji="📅"
            sectionLabel="Weekly Selection"
            onBuyBoost={handleBuyBoost}
            onBuyCosmetic={handleBuyCosmetic}
            user={user}
            activeBoosts={activeBoosts}
          />
        )}
        {tab === 'Seasonal' && (
          <StoreSection
            items={seasonalItems}
            countdown={formatCountdown(seasonalMs)}
            countdownLabel="🌸 Spring 2026 — ends in"
            accentColor="#34d399"
            accentEmoji="🌸"
            sectionLabel="Spring Collection"
            onBuyBoost={handleBuyBoost}
            onBuyCosmetic={handleBuyCosmetic}
            user={user}
            activeBoosts={activeBoosts}
          />
        )}
        {tab === 'Permanent' && (
          <PermanentStore user={user} onBuyCosmetic={handleBuyCosmetic} />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium text-white z-50 whitespace-nowrap"
          style={{
            background: toast.type === 'error' ? '#7f1d1d' : toast.type === 'equip' ? '#1d4ed8' : '#14532d',
            border: `1px solid ${toast.type === 'error' ? '#ef444460' : toast.type === 'equip' ? '#3b82f660' : '#22c55e60'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function ActiveBoostsStrip() {
  const { activeBoosts } = useStore()
  const now = Date.now()
  const live = activeBoosts.filter((b) => b.expiresAt > now)
  if (!live.length) return null

  return (
    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
      {live.map((b) => {
        const remaining = b.expiresAt - now
        return (
          <div
            key={b.id}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: '#0a1628', border: '1px solid #22c55e40', color: '#4ade80' }}
          >
            <span>{b.emoji}</span>
            <span>{b.name}</span>
            <span className="text-green-600">· {formatCountdown(remaining)}</span>
          </div>
        )
      })}
    </div>
  )
}

function StoreSection({ items, countdown, countdownLabel, accentColor, accentEmoji, sectionLabel, onBuyBoost, onBuyCosmetic, user, activeBoosts }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Section header */}
      <div
        className="rounded-2xl p-3 flex items-center justify-between"
        style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}30` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{accentEmoji}</span>
          <span className="text-sm font-bold text-white">{sectionLabel}</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500">{countdownLabel}</div>
          <div className="text-xs font-bold" style={{ color: accentColor }}>{countdown}</div>
        </div>
      </div>

      {/* Earn rate reminder */}
      <EarnRateCard accentColor={accentColor} />

      {/* Item list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <StoreItemCard
            key={item.id}
            item={item}
            user={user}
            activeBoosts={activeBoosts}
            onBuyBoost={onBuyBoost}
            onBuyCosmetic={onBuyCosmetic}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  )
}

function EarnRateCard({ accentColor }) {
  const { activeBoosts } = useStore()
  const now = Date.now()
  const ffBoost = activeBoosts.filter((b) => b.type === 'ff' && b.expiresAt > now)
    .reduce((acc, b) => acc * b.multiplier, 1)
  const xpBoost = activeBoosts.filter((b) => b.type === 'xp' && b.expiresAt > now)
    .reduce((acc, b) => acc * b.multiplier, 1)

  return (
    <div className="glow-card rounded-xl p-3 flex items-center justify-between">
      <div className="text-xs text-gray-500">Current earn rate</div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-sm">🪲</span>
          <span className="text-sm font-bold text-amber-400">{ffBoost}×</span>
          <span className="text-xs text-gray-600">FF/min</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">⭐</span>
          <span className="text-sm font-bold text-blue-400">{xpBoost}×</span>
          <span className="text-xs text-gray-600">XP</span>
        </div>
      </div>
    </div>
  )
}

function StoreItemCard({ item, user, activeBoosts, onBuyBoost, onBuyCosmetic, accentColor }) {
  const isBoost = !!item.multiplier || item.type === 'shield'
  const isOwned = !isBoost && user.ownedItems.includes(item.id)
  const isActive = isBoost && activeBoosts.some((b) => b.id === item.id && b.expiresAt > Date.now())
  const canAfford = user.fireflies >= item.cost
  const style = RARITY_STYLE[item.rarity] || RARITY_STYLE.common

  const handleClick = () => isBoost ? onBuyBoost(item) : onBuyCosmetic(item)

  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-4 transition-all"
      style={{
        background: isOwned || isActive ? '#0d1f3c' : '#060f23',
        border: `1px solid ${isOwned || isActive ? accentColor + '40' : '#1d4ed820'}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
        style={{ background: style.bg, border: `1px solid ${style.border}` }}
      >
        {item.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white">{item.name}</span>
          <span
            className="text-[10px] font-bold rounded-full px-2 py-0.5"
            style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
          >
            {style.label}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5 leading-tight">{item.description}</div>
        {isBoost && item.durationLabel && (
          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: accentColor }}>
            <span>⏱</span>
            <span>{item.durationLabel}</span>
            {item.multiplier > 1 && <span>· {item.multiplier}× multiplier</span>}
          </div>
        )}
      </div>

      {/* Buy button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleClick}
          className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150"
          style={{
            background: isOwned
              ? '#1d4ed820'
              : isActive
                ? '#14532d'
                : canAfford
                  ? `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`
                  : '#1c1917',
            border: `1px solid ${isOwned ? '#3b82f640' : isActive ? '#22c55e60' : canAfford ? accentColor + '60' : '#44403c40'}`,
            color: isOwned ? '#60a5fa' : isActive ? '#4ade80' : canAfford ? '#fff' : '#57534e',
            boxShadow: canAfford && !isOwned && !isActive ? `0 0 10px ${accentColor}30` : 'none',
          }}
        >
          {isOwned ? 'Equip' : isActive ? 'Active' : item.cost === 0 ? 'Free' : `🪲 ${item.cost}`}
        </button>
      </div>
    </div>
  )
}

function PermanentStore({ user, onBuyCosmetic }) {
  const [category, setCategory] = useState('All')
  const cats = ['All', 'Hats', 'Frames', 'Backgrounds']
  const filtered = SHOP_ITEMS.filter((item) => {
    if (category === 'All') return true
    if (category === 'Hats') return item.type === 'hat'
    if (category === 'Frames') return item.type === 'frame'
    if (category === 'Backgrounds') return item.type === 'background'
    return true
  })

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
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
      <div className="flex flex-col gap-3">
        {filtered.map((item) => (
          <StoreItemCard
            key={item.id}
            item={item}
            user={user}
            activeBoosts={[]}
            onBuyBoost={() => {}}
            onBuyCosmetic={onBuyCosmetic}
            accentColor="#3b82f6"
          />
        ))}
      </div>
    </div>
  )
}
