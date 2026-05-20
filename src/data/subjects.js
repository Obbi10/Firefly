export const SUBJECTS = [
  // Sciences
  { id: 'Mathematics',    label: 'Mathematics',       emoji: '📐', color: '#3b82f6' },
  { id: 'Further Maths',  label: 'Further Maths',     emoji: '📊', color: '#60a5fa' },
  { id: 'Statistics',     label: 'Statistics',        emoji: '📉', color: '#93c5fd' },
  { id: 'Physics',        label: 'Physics',           emoji: '⚛️',  color: '#8b5cf6' },
  { id: 'Chemistry',      label: 'Chemistry',         emoji: '🧪', color: '#10b981' },
  { id: 'Biology',        label: 'Biology',           emoji: '🌱', color: '#f59e0b' },
  { id: 'Environmental',  label: 'Environmental Sci', emoji: '🌍', color: '#86efac' },
  { id: 'Geology',        label: 'Geology',           emoji: '🪨', color: '#a8a29e' },
  { id: 'Astronomy',      label: 'Astronomy',         emoji: '🔭', color: '#818cf8' },
  { id: 'Engineering',    label: 'Engineering',       emoji: '🔧', color: '#6ee7b7' },
  // Humanities
  { id: 'History',        label: 'History',           emoji: '📜', color: '#ef4444' },
  { id: 'Geography',      label: 'Geography',         emoji: '🗺️',  color: '#84cc16' },
  { id: 'Politics',       label: 'Politics',          emoji: '🏛️',  color: '#38bdf8' },
  { id: 'Economics',      label: 'Economics',         emoji: '📈', color: '#a855f7' },
  { id: 'Law',            label: 'Law',               emoji: '⚖️',  color: '#fde047' },
  { id: 'Philosophy',     label: 'Philosophy',        emoji: '💭', color: '#94a3b8' },
  { id: 'RE',             label: 'Religious Studies', emoji: '✨', color: '#a78bfa' },
  { id: 'Sociology',      label: 'Sociology',         emoji: '👥', color: '#fb7185' },
  { id: 'Psychology',     label: 'Psychology',        emoji: '🧠', color: '#fb923c' },
  // Languages & English
  { id: 'English',        label: 'English',           emoji: '📝', color: '#ec4899' },
  { id: 'English Lit',    label: 'English Lit',       emoji: '📖', color: '#f472b6' },
  { id: 'Languages',      label: 'Languages',         emoji: '🗣️',  color: '#f97316' },
  // Technology & Creative
  { id: 'CS',             label: 'Computer Sci',      emoji: '💻', color: '#06b6d4' },
  { id: 'Business',       label: 'Business',          emoji: '💼', color: '#fdba74' },
  { id: 'Media Studies',  label: 'Media Studies',     emoji: '📱', color: '#67e8f9' },
  { id: 'DT',             label: 'Design & Tech',     emoji: '⚙️',  color: '#4ade80' },
  // Arts & PE
  { id: 'Art',            label: 'Art & Design',      emoji: '🎨', color: '#f43f5e' },
  { id: 'Music',          label: 'Music',             emoji: '🎵', color: '#d946ef' },
  { id: 'Drama',          label: 'Drama',             emoji: '🎭', color: '#facc15' },
  { id: 'PE',             label: 'Physical Education',emoji: '🏃', color: '#22d3ee' },
  { id: 'Food Science',   label: 'Food Science',      emoji: '🍽️',  color: '#bbf7d0' },
]

export const getSubject = (id) => SUBJECTS.find((s) => s.id === id) || SUBJECTS[0]

export const DEFAULT_SUBJECT_STATS = {
  Mathematics:   180,
  Physics:        95,
  Chemistry:      60,
  Biology:        45,
  History:        30,
  English:        85,
  CS:            120,
  Languages:      25,
  Economics:      40,
  Psychology:     35,
}
