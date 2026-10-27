import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PROJECT_STATUSES, PHOTOGRAPHY_CATEGORIES, useBasePath } from '../api.js'


/* ── New Project Modal ── */
function NewProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    category: 'Portrait',
    budget: '',
    deadline: '',
    brief: '',
    deliverables: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) {
      setError('Project title must be at least 2 characters.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        budget: form.budget.trim(),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        brief: form.brief.trim(),
        deliverables: form.deliverables.trim(),
        notes: form.notes.trim(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal pd-modal--lg" onSubmit={submit} role="dialog" aria-modal="true">
        <div className="pd-modal-head">
          <h2>New Photography Project</h2>
          <button type="button" className="pd-modal-close" onClick={onClose} disabled={saving} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="pd-form-grid">
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-title">PROJECT TITLE *</label>
            <input
              id="np-title"
              className="pd-input"
              required
              minLength={2}
              maxLength={120}
              placeholder="e.g. Vogue Summer Lookbook"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-category">CATEGORY</label>
            <select
              id="np-category"
              className="pd-select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {PHOTOGRAPHY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-cname">CLIENT NAME</label>
            <input
              id="np-cname"
              className="pd-input"
              maxLength={100}
              placeholder="e.g. Acme Studio / Sarah Jenkins"
              value={form.clientName}
              onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
            />
          </div>

          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-cemail">CLIENT EMAIL</label>
            <input
              id="np-cemail"
              type="email"
              className="pd-input"
              maxLength={200}
              placeholder="client@example.com"
              value={form.clientEmail}
              onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
            />
          </div>

          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-budget">BUDGET</label>
            <input
              id="np-budget"
              className="pd-input"
              maxLength={100}
              placeholder="e.g. $1,200 or Fixed Rate"
              value={form.budget}
              onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            />
          </div>

          <div className="pd-form-col">
            <label className="pd-label" htmlFor="np-deadline">DEADLINE</label>
            <input
              id="np-deadline"
              type="date"
              className="pd-input"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </div>
        </div>

        <label className="pd-label" htmlFor="np-brief">PROJECT BRIEF & VISION</label>
        <textarea
          id="np-brief"
          className="pd-textarea"
          rows={3}
          maxLength={5000}
          placeholder="Details on theme, location, lighting, styling, shot list..."
          value={form.brief}
          onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
        />

        <label className="pd-label" htmlFor="np-deliv">DELIVERABLES REQUIRED</label>
        <textarea
          id="np-deliv"
          className="pd-textarea"
          rows={2}
          maxLength={2000}
          placeholder="e.g. 15 edited high-res TIFFs + web-sized JPEGs with commercial usage rights"
          value={form.deliverables}
          onChange={(e) => setForm((f) => ({ ...f, deliverables: e.target.value }))}
        />

        <label className="pd-label" htmlFor="np-notes">INTERNAL NOTES (OPTIONAL)</label>
        <textarea
          id="np-notes"
          className="pd-textarea"
          rows={2}
          maxLength={5000}
          placeholder="Private gear checklist, studio booking notes, assistant contact..."
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />

        {error && <p className="pd-form-error" role="alert">{error}</p>}

        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ── Project Card ── */
function ProjectCard({ project, onDelete, basePath = '' }) {
  const statusCfg = PROJECT_STATUSES[project.status] || { label: project.status, color: '#666' }
  const stages = project.progress || []
  const completedStages = stages.filter((s) => s.completed).length
  const percent = stages.length > 0 ? Math.round((completedStages / stages.length) * 100) : 0

  const deadlineDate = project.deadline ? new Date(project.deadline) : null
  const isOverdue = deadlineDate && deadlineDate < new Date() && project.status !== 'completed' && project.status !== 'cancelled'

  return (
    <article className="pd-project-card">
      <div className="pd-project-card-header">
        <span className="pd-project-cat">{project.category || 'Photography'}</span>
        <span className="pd-status-badge" style={{ '--status-color': statusCfg.color }}>
          {statusCfg.label}
        </span>
      </div>

      <Link to={`${basePath}/projects/${project._id}`} className="pd-project-card-title">
        {project.title}
      </Link>

      <div className="pd-project-card-client">
        <Icon name="user" size={14} />
        <span>{project.clientName || 'Unassigned Client'}</span>
        {project.clientEmail && <span className="pd-project-client-email">({project.clientEmail})</span>}
      </div>

      {project.brief && (
        <p className="pd-project-card-brief">{project.brief}</p>
      )}

      {/* Progress Bar */}
      <div className="pd-project-progress-wrap">
        <div className="pd-project-progress-labels">
          <span>Shoot & Delivery Progress</span>
          <span className="pd-progress-percent">{percent}% ({completedStages}/{stages.length})</span>
        </div>
        <div className="pd-progress-track">
          <div className="pd-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Revisions Notice if requested */}
      {project.status === 'revision_requested' && project.latestClientFeedback && (
        <div className="pd-project-revision-box">
          <Icon name="bell" size={14} />
          <span>Client requested revisions: "{project.latestClientFeedback.slice(0, 80)}..."</span>
        </div>
      )}

      {/* Card Footer */}
      <div className="pd-project-card-footer">
        <div className="pd-project-meta-pills">
          {project.budget && (
            <span className="pd-meta-pill">
              <strong>Budget:</strong> {project.budget}
            </span>
          )}
          {deadlineDate && (
            <span className={`pd-meta-pill ${isOverdue ? 'pd-meta-pill--danger' : ''}`}>
              <strong>Due:</strong> {deadlineDate.toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="pd-project-actions">
          <Link to={`${basePath}/projects/${project._id}`} className="pd-btn pd-btn--sm pd-btn--outline">
            Open Project
          </Link>
          <button
            className="pd-icon-btn pd-icon-btn--danger"
            onClick={() => onDelete(project)}
            aria-label="Delete project"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  const { addToast } = useToast()
  const basePath = useBasePath()
  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await api.listProjects(1, statusFilter)
      setProjects(data.projects || [])
    } catch (err) {
      addToast('error', 'Failed to load projects', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [statusFilter])

  const handleCreate = async (body) => {
    const created = await api.createProject(body)
    setProjects((prev) => [created, ...prev])
    addToast('success', 'Project created', `"${created.title}" is ready.`)
  }

  const handleDelete = async (proj) => {
    if (!window.confirm(`Delete client project "${proj.title}"? All submissions and progress will be deleted.`)) return
    try {
      await api.deleteProject(proj._id)
      setProjects((prev) => prev.filter((p) => p._id !== proj._id))
      addToast('success', 'Project deleted')
    } catch (err) {
      addToast('error', 'Failed to delete project', err.message)
    }
  }

  const filtered = projects.filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      (p.clientName && p.clientName.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  })

  return (
    <AppLayout title="Client Projects">
      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onSave={handleCreate}
        />
      )}

      {/* Top Header */}
      <div className="pd-page-header">
        <div>
          <h1 className="pd-page-title">Client Projects</h1>
          <p className="pd-page-sub">
            Track contracts, shooting schedules, progress stages, deliverables, and client revisions.
          </p>
        </div>
        <button className="pd-btn pd-btn--primary" onClick={() => setShowNewModal(true)}>
          <Icon name="plus" size={16} /> New Project
        </button>
      </div>

      {/* Controls Bar: Search & Status Filter Tabs */}
      <div className="pd-controls-bar">
        <div className="pd-search-box">
          <Icon name="chevron" size={14} />
          <input
            type="search"
            placeholder="Search projects or clients…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="pd-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={statusFilter === ''}
            className={`pd-tab ${statusFilter === '' ? 'pd-tab--active' : ''}`}
            onClick={() => setStatusFilter('')}
          >
            All Projects
          </button>
          {Object.entries(PROJECT_STATUSES).map(([key, cfg]) => (
            <button
              key={key}
              role="tab"
              aria-selected={statusFilter === key}
              className={`pd-tab ${statusFilter === key ? 'pd-tab--active' : ''}`}
              onClick={() => setStatusFilter(key)}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="pd-loading-state">
          <div className="pd-spinner" />
          <p>Loading projects…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="pd-empty-state">
          <div className="pd-empty-icon"><Icon name="briefcase" size={48} /></div>
          <h3>{searchQuery ? 'No matching projects found' : 'No client projects yet'}</h3>
          <p>
            {searchQuery
              ? 'Try modifying your search term or clearing filters.'
              : 'Start by creating your first client project to manage your photo shoots and deliveries.'}
          </p>
          {!searchQuery && (
            <button className="pd-btn pd-btn--primary" onClick={() => setShowNewModal(true)}>
              <Icon name="plus" size={16} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="pd-projects-grid">
          {filtered.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              basePath={basePath}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}
    </AppLayout>
  )
}
