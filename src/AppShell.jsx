import {NavLink, Link, Outlet, useLocation} from 'react-router-dom'
import {useEffect} from 'react'
import {useStore} from './store'

const nav = [
  ['/dashboard', '🏠', 'Home'],
  ['/challenges', '🔥', 'Challenges'],
  ['/explore', '🌎', 'Explore'],
  ['/profile', '📊', 'Progress']
]

const cls = ({isActive}) => (isActive ? 'on' : '')

export default function AppShell() {
  const {s, toast} = useStore()
  const {pathname} = useLocation()
  const act = s?.ch ? s.ch.filter((c) => c.own && c.st === 'active').length : 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <header className="top">
        <Link className="logo" to="/dashboard">
          <i>🔥</i>Challenge
        </Link>
        <div className="search hd mut">🔍 Search challenges…</div>
        <div className="sp" />
        {s?.auth?.type === 'guest' && (
          <Link
            to={`/login${pathname !== '/login' && pathname !== '/signup' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`}
            className="btn"
            style={{ fontSize: 13, padding: '6px 14px', marginRight: 4 }}
          >
            Log In
          </Link>
        )}
        <Link className="ib" to="/notifications" aria-label="Notifications">
          🔔<span className="dot" />
        </Link>
        <Link to="/profile" aria-label="Profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="av">{s?.me ? s.me[0].toUpperCase() : 'U'}</span>
        </Link>
      </header>

      <div className="shell">
        <nav className="side" aria-label="Main Navigation">
          {nav.map(([to, e, l]) => (
            <NavLink key={to} to={to} end={to === '/challenges'} className={cls}>
              {e} {l}
            </NavLink>
          ))}
          <Link className="btn p" style={{textAlign: 'center', margin: '14px 0'}} to="/challenges/create">
            + Create challenge
          </Link>
          <NavLink to="/notifications" className={cls}>
            ⚙ Settings
          </NavLink>
        </nav>

        <main className="main" key={pathname}>
          <Outlet />
        </main>

        <aside className="rail">
          <div className="card">
            <h2>Your progress</h2>
            <div className="g" style={{marginTop: 14}}>
              <div>🔥 <b>{s?.streak ?? 0}</b> day streak</div>
              <div>🏆 <b>{s?.done ?? 0}</b> completed</div>
              <div>🎯 <b>{act}</b> active</div>
              <div>✍️ <b>{s?.commits ?? 0}</b> commits</div>
            </div>
          </div>
        </aside>
      </div>

      <nav className="bn" aria-label="Bottom Navigation">
        <NavLink to="/dashboard" className={cls}>🏠</NavLink>
        <NavLink to="/explore" className={cls}>🔎</NavLink>
        <Link className="plus" to="/challenges/create" aria-label="Create challenge">+</Link>
        <NavLink to="/challenges" end className={cls}>🔥</NavLink>
        <NavLink to="/profile" className={cls}>👤</NavLink>
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
