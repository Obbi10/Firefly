import { useStore } from './store/useStore'
import FireflyBackground from './components/FireflyBackground'
import Navigation from './components/Navigation'
import CallModal from './components/CallModal'
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
  const call = useStore((s) => s.call)
  const PageComponent = PAGES[activePage] || Dashboard

  return (
    <div className="app-shell">
      <FireflyBackground />

      <div className="flex-1 relative z-10 overflow-hidden flex flex-col page-enter" key={activePage}>
        <PageComponent />
      </div>

      <div className="relative z-20">
        <Navigation />
      </div>

      {/* Call overlay — rendered above everything */}
      {call && <CallModal />}
    </div>
  )
}
