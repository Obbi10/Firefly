import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultUser = {
  name: 'Scholar',
  level: 7,
  xp: 2340,
  xpToNext: 3000,
  streak: 14,
  longestStreak: 21,
  fireflies: 480,
  embers: 12,
  totalMinutes: 4820,
  avatar: {
    animal: 'owl',
    colorScheme: 'blue',
    hat: null,
    frame: 'default',
    background: 'space',
  },
  ownedItems: ['frame_default', 'bg_space', 'hat_crown'],
  achievements: ['streak_7', 'study_10h', 'first_room'],
}

const friends = [
  {
    id: 'f1', name: 'Zara', streak: 22,
    avatar: { animal: 'fox', colorScheme: 'orange', hat: 'crown', frame: 'gold', background: 'forest' },
    status: 'studying', minutesToday: 94, subject: 'Mathematics',
  },
  {
    id: 'f2', name: 'Leo', streak: 8,
    avatar: { animal: 'lion', colorScheme: 'gold', hat: null, frame: 'default', background: 'space' },
    status: 'studying', minutesToday: 47, subject: 'Physics',
  },
  {
    id: 'f3', name: 'Mia', streak: 31,
    avatar: { animal: 'panda', colorScheme: 'purple', hat: 'wizard', frame: 'neon', background: 'night' },
    status: 'break', minutesToday: 120, subject: 'Chemistry',
  },
  {
    id: 'f4', name: 'Kai', streak: 5,
    avatar: { animal: 'wolf', colorScheme: 'grey', hat: 'cap', frame: 'default', background: 'ocean' },
    status: 'offline', minutesToday: 0, subject: '',
  },
  {
    id: 'f5', name: 'Aria', streak: 19,
    avatar: { animal: 'butterfly', colorScheme: 'pink', hat: 'flower', frame: 'rainbow', background: 'sunset' },
    status: 'studying', minutesToday: 73, subject: 'Biology',
  },
  {
    id: 'f6', name: 'Ren', streak: 12,
    avatar: { animal: 'dragon', colorScheme: 'teal', hat: null, frame: 'neon', background: 'forest' },
    status: 'studying', minutesToday: 58, subject: 'History',
  },
]

const weekData = [
  { day: 'M', studied: true, minutes: 68 },
  { day: 'T', studied: true, minutes: 102 },
  { day: 'W', studied: true, minutes: 45 },
  { day: 'T', studied: true, minutes: 90 },
  { day: 'F', studied: true, minutes: 120 },
  { day: 'S', studied: true, minutes: 55 },
  { day: 'S', studied: false, minutes: 0 },
]

// Active boost shape: { id, type, multiplier, expiresAt, label, emoji }
const defaultBoosts = []

export const useStore = create(
  persist(
    (set, get) => ({
      user: defaultUser,
      friends,
      weekData,
      activePage: 'home',
      isStudying: false,
      studySeconds: 0,
      selectedSubject: 'Mathematics',
      dailyGoalMinutes: 120,
      todayMinutes: 55,

      // Active boosts (persisted so they survive page reloads)
      activeBoosts: defaultBoosts,

      // Call state (not persisted)
      call: null, // null | { participants: [...friendIds], myMuted: false, myCameraOff: false, speakingId: null }

      setPage: (page) => set({ activePage: page }),

      setStudying: (val) => set({ isStudying: val }),

      setSubject: (subject) => set({ selectedSubject: subject }),

      // Called when a study session ends — handles currency, XP, boosts
      completeSession: (rawMinutes) => {
        const state = get()
        const now = Date.now()

        // Clear expired boosts first
        const liveBoosts = state.activeBoosts.filter((b) => b.expiresAt > now)

        // Calculate multipliers from active boosts
        const ffMulti = liveBoosts
          .filter((b) => b.type === 'ff')
          .reduce((acc, b) => acc * b.multiplier, 1)
        const xpMulti = liveBoosts
          .filter((b) => b.type === 'xp')
          .reduce((acc, b) => acc * b.multiplier, 1)

        // Streak bonus: +5% per 7-day block, capped at 50%
        const streakBonus = Math.min(0.5, Math.floor(state.user.streak / 7) * 0.05)
        const totalFfMulti = ffMulti * (1 + streakBonus)

        const baseFF = rawMinutes // 1 firefly per minute base
        const earnedFF = Math.round(baseFF * totalFfMulti)
        const earnedXP = Math.round(rawMinutes * 15 * xpMulti)

        // First session bonus of the day (simplified: always give it if todayMinutes was 0 before)
        const firstSessionBonus = state.todayMinutes === 0 ? 50 : 0

        const totalFF = earnedFF + firstSessionBonus

        set((s) => ({
          activeBoosts: liveBoosts,
          todayMinutes: s.todayMinutes + rawMinutes,
          user: {
            ...s.user,
            fireflies: s.user.fireflies + totalFF,
            xp: s.user.xp + earnedXP,
            totalMinutes: s.user.totalMinutes + rawMinutes,
          },
        }))

        return { earnedFF: totalFF, earnedXP, ffMulti: totalFfMulti, xpMulti, firstSessionBonus }
      },

      // Activate a boost item
      activateBoost: (boost) => {
        const now = Date.now()
        const expiresAt = now + boost.durationMs
        set((s) => ({
          activeBoosts: [
            ...s.activeBoosts.filter((b) => b.type !== boost.type || b.id !== boost.id),
            { ...boost, expiresAt, activatedAt: now },
          ],
        }))
      },

      // Prune expired boosts
      pruneBoosts: () => {
        const now = Date.now()
        set((s) => ({ activeBoosts: s.activeBoosts.filter((b) => b.expiresAt > now) }))
      },

      addFireflies: (amount) =>
        set((state) => ({ user: { ...state.user, fireflies: state.user.fireflies + amount } })),

      spendFireflies: (amount) =>
        set((state) => ({ user: { ...state.user, fireflies: Math.max(0, state.user.fireflies - amount) } })),

      updateAvatar: (field, value) =>
        set((state) => ({
          user: { ...state.user, avatar: { ...state.user.avatar, [field]: value } },
        })),

      buyItem: (itemId, cost) => {
        const state = get()
        if (state.user.fireflies < cost) return false
        if (state.user.ownedItems.includes(itemId)) return false
        set((s) => ({
          user: {
            ...s.user,
            fireflies: s.user.fireflies - cost,
            ownedItems: [...s.user.ownedItems, itemId],
          },
        }))
        return true
      },

      // Buy a consumable (boost) — doesn't add to ownedItems, just activates it
      buyBoost: (boost) => {
        const state = get()
        if (state.user.fireflies < boost.cost) return false
        set((s) => ({ user: { ...s.user, fireflies: s.user.fireflies - boost.cost } }))
        get().activateBoost(boost)
        return true
      },

      addMinutesToday: (m) =>
        set((state) => ({ todayMinutes: state.todayMinutes + m })),

      // ─── Call state ───────────────────────────────────────────────
      startCall: (friendIds) =>
        set({
          call: {
            participants: friendIds,
            myMuted: false,
            myCameraOff: false,
            speakingId: friendIds[0] || null,
            connecting: true,
          },
        }),

      callConnected: () =>
        set((s) => ({ call: s.call ? { ...s.call, connecting: false } : null })),

      endCall: () => set({ call: null }),

      toggleMyMute: () =>
        set((s) => ({ call: s.call ? { ...s.call, myMuted: !s.call.myMuted } : null })),

      toggleMyCamera: () =>
        set((s) => ({ call: s.call ? { ...s.call, myCameraOff: !s.call.myCameraOff } : null })),

      setSpeaking: (id) =>
        set((s) => ({ call: s.call ? { ...s.call, speakingId: id } : null })),
    }),
    {
      name: 'firefly-store',
      partialize: (state) => ({
        user: state.user,
        activeBoosts: state.activeBoosts,
        todayMinutes: state.todayMinutes,
        selectedSubject: state.selectedSubject,
      }),
    }
  )
)
