import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { api, authUrl, useBasePath } from '../api.js'
import ToastContainer, { useToast } from './ToastSystem.jsx'

/* ── Inline SVG icons ── */
export function Icon({ name, size = 18 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  const paths = {
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    chevron: <><polyline points="9 18 15 12 9 6"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  }
  return <svg {...props}>{paths[name] || <circle cx="12" cy="12" r="5"/>}</svg>
}

/* ── AppLayout wraps every page ── */
export default function AppLayout({ children, title }) {
  const navigate = useNavigate()
  const basePath = useBasePath()
  const { toasts, addToast, removeToast } = useToast()
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    if (title) document.title = `${title} — CollaBro Photography`
    else document.title = 'CollaBro Photography Dashboard'
  }, [title])

  useEffect(() => {
    api.getProfile()
      .then(setUser)
      .catch((err) => {
        if (err.status !== 401) console.error(err)
        setUser(null)
      })
      .finally(() => setUserLoading(false))
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') { setProfileOpen(false); setSidebarOpen(false) }
    }
    document.addEventListener('mousedown', close)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const logout = async () => {
    try {
      await api.logout()
      window.location.assign(authUrl())
    } catch (err) {
      addToast('error', 'Sign-out failed', err.message)
    }
  }

  const displayName = user?.displayName || user?.name || 'Photographer'
  const avatarSrc = user?.profilePicture || null

  return (
    <div className="pd-shell">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="pd-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`pd-sidebar ${sidebarOpen ? 'pd-sidebar--open' : ''}`}>
        <div className="pd-sidebar-brand">
          <Link to={basePath || '/'} className="pd-brand-link" onClick={() => setSidebarOpen(false)}>
            <span className="pd-brand-icon"><Icon name="camera" size={20} /></span>
            <span className="pd-brand-text">COLLAB<span>R</span>O</span>
          </Link>
          <button className="pd-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <Icon name="x" size={18} />
          </button>
        </div>

        <nav className="pd-nav" aria-label="Main navigation">
          <NavLink to={basePath || '/'} className={({ isActive }) => `pd-nav-item ${isActive ? 'pd-nav-item--active' : ''}`} end onClick={() => setSidebarOpen(false)}>
            <Icon name="home" size={16} /><span>Dashboard</span>
          </NavLink>
          <NavLink to={`${basePath}/portfolio`} className={({ isActive }) => `pd-nav-item ${isActive ? 'pd-nav-item--active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <Icon name="image" size={16} /><span>Portfolio</span>
          </NavLink>
          <NavLink to={`${basePath}/projects`} className={({ isActive }) => `pd-nav-item ${isActive ? 'pd-nav-item--active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <Icon name="briefcase" size={16} /><span>Client Projects</span>
          </NavLink>
          <NavLink to={`${basePath}/profile`} className={({ isActive }) => `pd-nav-item ${isActive ? 'pd-nav-item--active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <Icon name="user" size={16} /><span>Profile</span>
          </NavLink>
        </nav>

        <div className="pd-sidebar-footer">
          <button className="pd-logout-btn" onClick={logout}>
            <Icon name="logout" size={15} /><span>Sign out</span>
          </button>
          <div className="pd-sidebar-tag">PHOTOGRAPHY DASHBOARD</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="pd-content">
        {/* Topbar */}
        <header className="pd-topbar">
          <button className="pd-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={20} />
          </button>
          <div className="pd-topbar-title">{title || 'Dashboard'}</div>
          <div className="pd-topbar-right">
            {!userLoading && !user && (
              <a href={authUrl()} className="pd-signin-link">Sign in</a>
            )}
            {user && (
              <div className="pd-profile-wrap" ref={profileRef}>
                <button
                  className="pd-avatar-btn"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  {avatarSrc
                    ? <img src={avatarSrc} alt="" className="pd-avatar pd-avatar--sm" />
                    : <span className="pd-avatar pd-avatar--sm pd-avatar--fallback">{displayName[0]?.toUpperCase()}</span>
                  }
                  <span className="pd-avatar-name">{displayName}</span>
                  <Icon name="chevronDown" size={13} />
                </button>
                {profileOpen && (
                  <div className="pd-profile-dropdown">
                    <div className="pd-profile-header">
                      {avatarSrc
                        ? <img src={avatarSrc} alt="" className="pd-avatar pd-avatar--md" />
                        : <span className="pd-avatar pd-avatar--md pd-avatar--fallback">{displayName[0]?.toUpperCase()}</span>
                      }
                      <div>
                        <strong>{displayName}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <Link to={`${basePath}/profile`} className="pd-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Icon name="user" size={14} /> Edit Profile
                    </Link>
                    <Link to={`${basePath}/portfolio`} className="pd-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Icon name="image" size={14} /> My Portfolio
                    </Link>
                    <Link to={`${basePath}/projects`} className="pd-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Icon name="briefcase" size={14} /> Client Projects
                    </Link>
                    <button className="pd-dropdown-item pd-dropdown-item--danger" onClick={logout}>
                      <Icon name="logout" size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>


        {/* Page content */}
        <main className="pd-main">
          {children}
        </main>
      </div>
    </div>
  )
}

/* ── Re-export useToast so pages can use it ── */
export { useToast }
