import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_SUBJECT_STATS } from '../data/subjects'
import { DEFAULT_UNLOCKED_ANIMALS } from '../data/avatars'
import { getLootboxForSession, rollLootbox } from '../data/lootboxes'

const defaultUser = {
  name: 'Scholar',
  level: 7,
  xp: 2340,
  xpToNext: 3000,
  streak: 14,
  longestStreak: 21,
  coins: 480,
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

const defaultBoosts = []

// ── Groups seed data ─────────────────────────────────────────────────────────
const SEEDED_MEMBERS = {
  f1: { id: 'f1', name: 'Zara',      avatar: { animal: 'fox',       colorScheme: 'orange', hat: 'crown',  frame: 'gold',    background: 'forest' }, minutesThisWeek: 340, minutesToday: 94,  streak: 22 },
  f2: { id: 'f2', name: 'Leo',       avatar: { animal: 'lion',      colorScheme: 'gold',   hat: null,     frame: 'default', background: 'space'  }, minutesThisWeek: 210, minutesToday: 47,  streak: 8  },
  f3: { id: 'f3', name: 'Mia',       avatar: { animal: 'panda',     colorScheme: 'purple', hat: 'wizard', frame: 'neon',    background: 'night'  }, minutesThisWeek: 510, minutesToday: 120, streak: 31 },
  f5: { id: 'f5', name: 'Aria',      avatar: { animal: 'butterfly', colorScheme: 'pink',   hat: 'flower', frame: 'rainbow', background: 'sunset' }, minutesThisWeek: 290, minutesToday: 73,  streak: 19 },
  f6: { id: 'f6', name: 'Ren',       avatar: { animal: 'dragon',    colorScheme: 'teal',   hat: null,     frame: 'neon',    background: 'forest' }, minutesThisWeek: 175, minutesToday: 58,  streak: 12 },
}

const defaultMyGroups = [
  {
    id: 'grp1',
    name: 'Year 11 Science',
    password: 'science11',
    emoji: '🔬',
    members: [
      SEEDED_MEMBERS.f1, SEEDED_MEMBERS.f3, SEEDED_MEMBERS.f5,
      { id: 'me', name: 'Scholar', avatar: { animal: 'owl', colorScheme: 'blue', hat: null, frame: 'default', background: 'space' }, minutesThisWeek: 480, minutesToday: 55, streak: 14 },
    ],
    chat: [
      { id: 1, from: 'Mia',  text: 'Anyone else revising acids and bases? 🧪', time: '4m ago' },
      { id: 2, from: 'Zara', text: 'Yes! Just finished mole calculations', time: '9m ago' },
      { id: 3, from: 'Aria', text: 'Good luck everyone 💪', time: '14m ago' },
    ],
  },
  {
    id: 'grp2',
    name: 'Maths Study Gang',
    password: 'maths2026',
    emoji: '📐',
    members: [
      SEEDED_MEMBERS.f2, SEEDED_MEMBERS.f6,
      { id: 'me', name: 'Scholar', avatar: { animal: 'owl', colorScheme: 'blue', hat: null, frame: 'default', background: 'space' }, minutesThisWeek: 480, minutesToday: 55, streak: 14 },
    ],
    chat: [
      { id: 1, from: 'Leo', text: 'Stuck on integration by parts 😭', time: '1m ago' },
      { id: 2, from: 'Ren', text: 'Use LIATE rule — log/inverse/algebraic/trig/exp', time: '3m ago' },
    ],
  },
]

const defaultGroupDirectory = [
  { id: 'grp1',  name: 'Year 11 Science',     password: 'science11',  emoji: '🔬', memberCount: 4 },
  { id: 'grp2',  name: 'Maths Study Gang',     password: 'maths2026',  emoji: '📐', memberCount: 3 },
  { id: 'grp3',  name: 'History Society',      password: 'tudor1485',  emoji: '📜', memberCount: 5 },
  { id: 'grp4',  name: 'Sixth Form CS',        password: 'code42',     emoji: '💻', memberCount: 6 },
  { id: 'grp5',  name: 'Bio Revision',         password: 'cells101',   emoji: '🌱', memberCount: 3 },
  { id: 'grp6',  name: 'English Lit Circle',   password: 'gatsby',     emoji: '📖', memberCount: 4 },
  { id: 'grp7',  name: 'Economics A-Level',    password: 'econ2026',   emoji: '📈', memberCount: 7 },
]

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

      subjectStats: { ...DEFAULT_SUBJECT_STATS },

      activeBoosts: defaultBoosts,

      // Lootbox state
      unlockedAnimals: [...DEFAULT_UNLOCKED_ANIMALS],
      pendingLootboxes: [],

      myGroups: defaultMyGroups,
      groupDirectory: defaultGroupDirectory,
      activeGroupId: null,

      call: null,

      setPage: (page) => set({ activePage: page }),

      setStudying: (val) => set({ isStudying: val }),

      setSubject: (subject) => set({ selectedSubject: subject }),

      completeSession: (rawMinutes, subject) => {
        const state = get()
        const now = Date.now()

        const liveBoosts = state.activeBoosts.filter((b) => b.expiresAt > now)

        const ffMulti = liveBoosts
          .filter((b) => b.type === 'ff')
          .reduce((acc, b) => acc * b.multiplier, 1)
        const xpMulti = liveBoosts
          .filter((b) => b.type === 'xp')
          .reduce((acc, b) => acc * b.multiplier, 1)

        const streakBonus = Math.min(0.5, Math.floor(state.user.streak / 7) * 0.05)
        const totalFfMulti = ffMulti * (1 + streakBonus)

        const baseCoins = rawMinutes
        const earnedCoins = Math.round(baseCoins * totalFfMulti)
        const earnedXP = Math.round(rawMinutes * 15 * xpMulti)

        const firstSessionBonus = state.todayMinutes === 0 ? 50 : 0
        const totalCoins = earnedCoins + firstSessionBonus

        const resolvedSubject = subject || state.selectedSubject || 'Mathematics'

        // Award lootbox based on session length
        const boxType = getLootboxForSession(rawMinutes)
        const newLootbox = boxType ? { id: `lb_${Date.now()}`, boxType } : null

        set((s) => ({
          activeBoosts: liveBoosts,
          todayMinutes: s.todayMinutes + rawMinutes,
          subjectStats: {
            ...s.subjectStats,
            [resolvedSubject]: (s.subjectStats[resolvedSubject] || 0) + rawMinutes,
          },
          user: {
            ...s.user,
            coins: s.user.coins + totalCoins,
            xp: s.user.xp + earnedXP,
            totalMinutes: s.user.totalMinutes + rawMinutes,
          },
          pendingLootboxes: newLootbox
            ? [...s.pendingLootboxes, newLootbox]
            : s.pendingLootboxes,
        }))

        return { earnedCoins: totalCoins, earnedXP, ffMulti: totalFfMulti, xpMulti, firstSessionBonus, subject: resolvedSubject, lootbox: newLootbox }
      },

      // Open the next pending lootbox and return the reward
      openNextLootbox: () => {
        const state = get()
        if (!state.pendingLootboxes.length) return null
        const [next, ...rest] = state.pendingLootboxes
        const reward = rollLootbox(next.boxType, state.user.ownedItems, state.unlockedAnimals)

        set((s) => {
          const updates = { pendingLootboxes: rest }
          if (reward.type === 'coins') {
            updates.user = { ...s.user, coins: s.user.coins + reward.amount }
          } else if (reward.type === 'animal') {
            updates.unlockedAnimals = [...s.unlockedAnimals, reward.animalId]
          } else if (reward.type === 'item') {
            updates.user = { ...s.user, ownedItems: [...s.user.ownedItems, reward.itemId] }
          }
          return updates
        })

        return { lootbox: next, reward }
      },

      // Buy a lootbox from store and add to pending
      awardLootbox: (boxType) =>
        set((s) => ({
          pendingLootboxes: [...s.pendingLootboxes, { id: `lb_${Date.now()}`, boxType }],
        })),

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

      pruneBoosts: () => {
        const now = Date.now()
        set((s) => ({ activeBoosts: s.activeBoosts.filter((b) => b.expiresAt > now) }))
      },

      addCoins: (amount) =>
        set((state) => ({ user: { ...state.user, coins: state.user.coins + amount } })),

      spendCoins: (amount) =>
        set((state) => ({ user: { ...state.user, coins: Math.max(0, state.user.coins - amount) } })),

      updateAvatar: (field, value) =>
        set((state) => ({
          user: { ...state.user, avatar: { ...state.user.avatar, [field]: value } },
        })),

      buyItem: (itemId, cost) => {
        const state = get()
        if (state.user.coins < cost) return false
        if (state.user.ownedItems.includes(itemId)) return false
        set((s) => ({
          user: {
            ...s.user,
            coins: s.user.coins - cost,
            ownedItems: [...s.user.ownedItems, itemId],
          },
        }))
        return true
      },

      buyBoost: (boost) => {
        const state = get()
        if (state.user.coins < boost.cost) return false
        set((s) => ({ user: { ...s.user, coins: s.user.coins - boost.cost } }))
        get().activateBoost(boost)
        return true
      },

      buyLootbox: (boxType, cost) => {
        const state = get()
        if (state.user.coins < cost) return false
        set((s) => ({
          user: { ...s.user, coins: s.user.coins - cost },
          pendingLootboxes: [...s.pendingLootboxes, { id: `lb_${Date.now()}`, boxType }],
        }))
        return true
      },

      addMinutesToday: (m) =>
        set((state) => ({ todayMinutes: state.todayMinutes + m })),

      // ─── Groups ───────────────────────────────────────────────────

      setActiveGroup: (id) => set({ activeGroupId: id }),

      createGroup: (name, password, emoji) => {
        const state = get()
        if (state.myGroups.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
          return { ok: false, error: 'A group with that name already exists.' }
        }
        const id = `grp_${Date.now()}`
        const meEntry = {
          id: 'me', name: state.user.name, avatar: state.user.avatar,
          minutesThisWeek: state.todayMinutes * 7, minutesToday: state.todayMinutes, streak: state.user.streak,
        }
        const newGroup = { id, name, password, emoji, members: [meEntry], chat: [] }
        const dirEntry = { id, name, password, emoji, memberCount: 1 }
        set((s) => ({
          myGroups: [...s.myGroups, newGroup],
          groupDirectory: [...s.groupDirectory, dirEntry],
          activeGroupId: id,
        }))
        return { ok: true }
      },

      joinGroup: (name, password) => {
        const state = get()
        const found = state.groupDirectory.find(
          (g) => g.name.toLowerCase() === name.trim().toLowerCase()
        )
        if (!found) return { ok: false, error: 'No group found with that name.' }
        if (found.password !== password) return { ok: false, error: 'Incorrect password.' }
        if (state.myGroups.some((g) => g.id === found.id)) {
          return { ok: false, error: "You're already in this group." }
        }
        const meEntry = {
          id: 'me', name: state.user.name, avatar: state.user.avatar,
          minutesThisWeek: state.todayMinutes * 7, minutesToday: state.todayMinutes, streak: state.user.streak,
        }
        const seededIds = ['f3', 'f1', 'f5', 'f2', 'f6']
        const memberCount = found.memberCount
        const simMembers = seededIds
          .slice(0, Math.min(memberCount - 1, seededIds.length))
          .map((fid) => SEEDED_MEMBERS[fid])
          .filter(Boolean)
        const fullGroup = {
          ...found,
          members: [...simMembers, meEntry],
          chat: [
            { id: Date.now(), from: simMembers[0]?.name || 'Member', text: 'Welcome to the group! 👋', time: 'just now' },
          ],
        }
        set((s) => ({
          myGroups: [...s.myGroups, fullGroup],
          activeGroupId: found.id,
        }))
        return { ok: true }
      },

      leaveGroup: (groupId) =>
        set((s) => ({
          myGroups: s.myGroups.filter((g) => g.id !== groupId),
          activeGroupId: s.activeGroupId === groupId ? null : s.activeGroupId,
        })),

      sendGroupMessage: (groupId, text) => {
        set((s) => ({
          myGroups: s.myGroups.map((g) =>
            g.id !== groupId ? g : {
              ...g,
              chat: [{ id: Date.now(), from: 'You', text, time: 'now' }, ...g.chat],
            }
          ),
        }))
      },

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
        subjectStats: state.subjectStats,
        myGroups: state.myGroups,
        groupDirectory: state.groupDirectory,
        unlockedAnimals: state.unlockedAnimals,
        pendingLootboxes: state.pendingLootboxes,
      }),
    }
  )
)
