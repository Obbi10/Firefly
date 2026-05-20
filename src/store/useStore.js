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

      setPage: (page) => set({ activePage: page }),

      setStudying: (val) => set({ isStudying: val }),

      addSeconds: (s) => set((state) => ({ studySeconds: state.studySeconds + s })),

      resetTimer: () => set({ studySeconds: 0, isStudying: false }),

      setSubject: (subject) => set({ selectedSubject: subject }),

      addFireflies: (amount) =>
        set((state) => ({ user: { ...state.user, fireflies: state.user.fireflies + amount } })),

      spendFireflies: (amount) =>
        set((state) => ({
          user: { ...state.user, fireflies: Math.max(0, state.user.fireflies - amount) },
        })),

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

      addMinutesToday: (m) =>
        set((state) => ({ todayMinutes: state.todayMinutes + m })),
    }),
    { name: 'firefly-store' }
  )
)
