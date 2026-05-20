import { useStore } from './store/useStore'
import FireflyBackground from './components/FireflyBackground'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import StudyTimer from './pages/StudyTimer'
import StudyRoom from './pages/StudyRoom'
import Shop from './pages/Shop'
import Profile from './pages/Profile'

const PAGES = {
  home: Dashboard,
  timer: StudyTimer,
  room: StudyRoom,
  shop: Shop,
  profile: Profile,
}

export default function App() {
  const activePage = useStore((s) => s.activePage)
  const PageComponent = PAGES[activePage] || Dashboard

  return (
    <div className="app-shell">
      <FireflyBackground />

      {/* Page content */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col page-enter" key={activePage}>
        <PageComponent />
      </div>

      {/* Bottom nav */}
      <div className="relative z-20">
        <Navigation />
      </div>
    </div>
  )
}
