import { useStore } from '../store/useStore'

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',    icon: HomeIcon    },
  { id: 'timer',   label: 'Study',   icon: TimerIcon   },
  { id: 'room',    label: 'Room',    icon: RoomIcon    },
  { id: 'groups',  label: 'Groups',  icon: GroupsIcon  },
  { id: 'shop',    label: 'Store',   icon: ShopIcon    },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
]

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#60a5fa' : 'none'} stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function TimerIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function RoomIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18"/>
      <path d="M9 21V9"/>
    </svg>
  )
}

function ShopIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}

function GroupsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function Navigation() {
  const { activePage, setPage, isStudying } = useStore()

  return (
    <nav className="flex-shrink-0 border-t border-blue-900/40 bg-firefly-navy/90 backdrop-blur-md">
      <div className="flex items-center justify-around px-1 py-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 relative"
              style={{ minWidth: 44 }}
            >
              {/* Active background glow */}
              {active && (
                <div className="absolute inset-0 rounded-xl bg-blue-500/10 border border-blue-500/20" />
              )}

              {/* Studying indicator dot */}
              {id === 'timer' && isStudying && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 online-dot" />
              )}

              <Icon active={active} />
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{ color: active ? '#60a5fa' : '#6b7280' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
