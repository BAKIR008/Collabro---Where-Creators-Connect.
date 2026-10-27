import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PROJECT_STATUSES, authUrl, useBasePath } from '../api.js'

function StatCard({ label, value, sub, color, to }) {
  const inner = (
    <div className="pd-stat-card" style={{ '--stat-accent': color }}>
      <div className="pd-stat-value">{value ?? '—'}</div>
      <div className="pd-stat-label">{label}</div>
      {sub && <div className="pd-stat-sub">{sub}</div>}
    </div>
  )
  return to ? <Link to={to} className="pd-stat-link">{inner}</Link> : inner
}

function RecentProjectItem({ project, basePath = '' }) {
  const status = PROJECT_STATUSES[project.status] || { label: project.status, color: '#888' }
  return (
    <Link to={`${basePath}/projects/${project._id}`} className="pd-recent-project">
      <div className="pd-rp-info">
        <span className="pd-rp-title">{project.title}</span>
        <span className="pd-rp-client">{project.clientName || 'No client set'}</span>
      </div>
      <span className="pd-status-badge" style={{ '--status-color': status.color }}>{status.label}</span>
    </Link>
  )
}


export default function Dashboard() {
  const { addToast } = useToast()
  const basePath = useBasePath()
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentProjects, setRecentProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [authFailed, setAuthFailed] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([api.getDashboard(), api.getProfile(), api.listProjects(1)])
      .then(([s, p, proj]) => {
        if (!active) return
        setStats(s)
        setProfile(p)
        setRecentProjects((proj.projects || []).slice(0, 5))
      })
      .catch((err) => {
        if (!active) return
        if (err.status === 401) setAuthFailed(true)
        else addToast('error', 'Could not load dashboard', err.message)
      })
      .finally(() => { if (active) setStatsLoading(false) })
    return () => { active = false }
  }, [addToast])

  if (authFailed) {
    return (
      <AppLayout title="Dashboard">
        <div className="pd-auth-wall">
          <Icon name="camera" size={48} />
          <h1>Sign in to access your Photography Dashboard</h1>
          <p>Your portfolio, client projects, and statistics are waiting for you.</p>
          <a href={authUrl()} className="pd-btn pd-btn--primary">Sign in to CollaBro</a>
        </div>
      </AppLayout>
    )
  }

  const displayName = profile?.displayName || profile?.name || 'Photographer'
  const firstName = displayName.split(' ')[0]

  return (
    <AppLayout title="Dashboard">
      {/* Hero */}
      <div className="pd-hero">
        <div className="pd-hero-text">
          <div className="pd-hero-eyebrow"><Icon name="camera" size={14} /> Your Photography Studio</div>
          <h1 className="pd-hero-title">
            {statsLoading ? 'Welcome back' : `Hey ${firstName}`}<span className="pd-hero-dot">.</span>
          </h1>
          <p className="pd-hero-sub">
            Manage your portfolio, track client projects, and deliver stunning work.
          </p>
          <div className="pd-hero-actions">
            <Link to={`${basePath}/portfolio`} className="pd-btn pd-btn--primary">
              <Icon name="image" size={15} /> Portfolio
            </Link>
            <Link to={`${basePath}/projects`} className="pd-btn pd-btn--outline">
              <Icon name="briefcase" size={15} /> Client Projects
            </Link>
          </div>
        </div>
        <div className="pd-hero-badge-strip">
          <span className="pd-hero-badge">Portrait</span>
          <span className="pd-hero-badge">Wedding</span>
          <span className="pd-hero-badge">Editorial</span>
          <span className="pd-hero-badge">Commercial</span>
        </div>
      </div>

      {/* Stats grid */}
      <section className="pd-section">
        <div className="pd-section-header">
          <h2>Overview</h2>
          {!statsLoading && <span className="pd-section-meta">Live from your account</span>}
        </div>

        {statsLoading ? (
          <div className="pd-skeleton-grid">
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="pd-skeleton pd-skeleton--card" />)}
          </div>
        ) : stats ? (
          <div className="pd-stats-grid">
            <StatCard label="Portfolio Collections" value={stats.portfolioCollections} sub={`${stats.publishedCollections} published`} color="var(--pd-gold)" to={`${basePath}/portfolio`} />
            <StatCard label="Portfolio Images" value={stats.totalPortfolioImages} color="var(--pd-teal)" to={`${basePath}/portfolio`} />
            <StatCard label="Active Projects" value={stats.activeProjects} color="var(--pd-blue)" to={`${basePath}/projects`} />
            <StatCard label="Awaiting Action" value={stats.projectsAwaitingAction} sub="New or revision requested" color={stats.projectsAwaitingAction > 0 ? 'var(--pd-red)' : 'var(--pd-muted)'} to={`${basePath}/projects`} />
            <StatCard label="Submitted" value={stats.submittedProjects} sub="Awaiting client review" color="var(--pd-purple)" to={`${basePath}/projects`} />
            <StatCard label="Completed" value={stats.completedProjects} color="var(--pd-green)" to={`${basePath}/projects`} />
          </div>
        ) : (
          <div className="pd-empty-state">
            <Icon name="bell" size={32} />
            <p>Could not load statistics. Please refresh the page.</p>
          </div>
        )}
      </section>

      {/* Recent projects */}
      <section className="pd-section">
        <div className="pd-section-header">
          <h2>Recent Client Projects</h2>
          <Link to={`${basePath}/projects`} className="pd-link-action">View all <Icon name="arrow" size={13} /></Link>
        </div>

        {statsLoading ? (
          <div className="pd-skeleton-list">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="pd-skeleton pd-skeleton--row" />)}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="pd-recent-list">
            {recentProjects.map((p) => <RecentProjectItem key={p._id} project={p} basePath={basePath} />)}
          </div>
        ) : (
          <div className="pd-empty-state pd-empty-state--sm">
            <Icon name="briefcase" size={28} />
            <p>No client projects yet.</p>
            <Link to={`${basePath}/projects`} className="pd-btn pd-btn--sm pd-btn--outline">Create your first project</Link>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="pd-section">
        <div className="pd-section-header"><h2>Quick Actions</h2></div>
        <div className="pd-quick-grid">
          <Link to={`${basePath}/portfolio`} className="pd-quick-card">
            <div className="pd-quick-icon" style={{ background: 'rgba(212,175,55,.15)' }}><Icon name="image" size={22} /></div>
            <div>
              <strong>Add to Portfolio</strong>
              <span>Upload photos and create collections</span>
            </div>
            <Icon name="arrow" size={16} />
          </Link>
          <Link to={`${basePath}/projects`} className="pd-quick-card">
            <div className="pd-quick-icon" style={{ background: 'rgba(99,102,241,.15)' }}><Icon name="plus" size={22} /></div>
            <div>
              <strong>New Client Project</strong>
              <span>Track a new photography assignment</span>
            </div>
            <Icon name="arrow" size={16} />
          </Link>
          <Link to={`${basePath}/profile`} className="pd-quick-card">
            <div className="pd-quick-icon" style={{ background: 'rgba(34,197,94,.15)' }}><Icon name="user" size={22} /></div>
            <div>
              <strong>Edit Profile</strong>
              <span>Update your bio and specialties</span>
            </div>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </AppLayout>
  )
}

