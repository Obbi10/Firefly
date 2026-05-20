export const SUBJECTS = [
  { id: 'Mathematics', label: 'Mathematics', emoji: '📐', color: '#3b82f6' },
  { id: 'Physics',     label: 'Physics',     emoji: '⚛️',  color: '#8b5cf6' },
  { id: 'Chemistry',   label: 'Chemistry',   emoji: '🧪',  color: '#10b981' },
  { id: 'Biology',     label: 'Biology',     emoji: '🌱',  color: '#f59e0b' },
  { id: 'History',     label: 'History',     emoji: '📜',  color: '#ef4444' },
  { id: 'English',     label: 'English',     emoji: '📝',  color: '#ec4899' },
  { id: 'CS',          label: 'Computer Sci',emoji: '💻',  color: '#06b6d4' },
  { id: 'Languages',   label: 'Languages',   emoji: '🗣️',  color: '#f97316' },
  { id: 'Geography',   label: 'Geography',   emoji: '🌍',  color: '#84cc16' },
  { id: 'Economics',   label: 'Economics',   emoji: '📈',  color: '#a855f7' },
  { id: 'Psychology',  label: 'Psychology',  emoji: '🧠',  color: '#fb923c' },
  { id: 'Philosophy',  label: 'Philosophy',  emoji: '💭',  color: '#94a3b8' },
]

export const getSubject = (id) => SUBJECTS.find((s) => s.id === id) || SUBJECTS[0]

// Seed stats so the chart is populated from day one
export const DEFAULT_SUBJECT_STATS = {
  Mathematics: 180,
  Physics:     95,
  Chemistry:   60,
  Biology:     45,
  History:     30,
  English:     85,
  CS:          120,
  Languages:   25,
}
