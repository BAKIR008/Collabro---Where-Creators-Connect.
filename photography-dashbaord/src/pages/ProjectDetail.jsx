import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PROJECT_STATUSES, PROGRESS_STAGES, PHOTOGRAPHY_CATEGORIES, useBasePath } from '../api.js'


/* ── New Deliverable Submission Modal ── */
function SubmissionModal({ projectId, nextVersion, onClose, onSubmitted }) {
  const [files, setFiles] = useState([])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...chosen])
  }

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!files.length) {
      setError('Please select at least one deliverable file to submit.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData()
      files.forEach((f) => formData.append('deliverables', f))
      formData.append('note', note.trim())

      const result = await api.createSubmission(projectId, formData)
      onSubmitted(result.submission, result.project)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit deliverables.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !submitting) onClose() }}>
      <form className="pd-modal pd-modal--md" onSubmit={submit} role="dialog" aria-modal="true">
        <div className="pd-modal-head">
          <div>
            <h2>Submit Deliverables (v{nextVersion})</h2>
            <p className="pd-modal-sub">Upload high-resolution client deliverables and delivery notes.</p>
          </div>
          <button type="button" className="pd-modal-close" onClick={onClose} disabled={submitting}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* File Picker */}
        <div className="pd-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
          />
          <Icon name="upload" size={32} />
          <p><strong>Click to browse files</strong> or drag deliverables here</p>
          <span>Supports JPEG, PNG, TIFF, PSD, ZIP, WEBP (up to 50 files)</span>
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <div className="pd-submission-files-list">
            <h4>Selected Files ({files.length})</h4>
            <div className="pd-file-pill-container">
              {files.map((file, idx) => (
                <div key={idx} className="pd-file-pill">
                  <Icon name="image" size={13} />
                  <span className="pd-file-pill-name">{file.name}</span>
                  <span className="pd-file-pill-size">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                  <button type="button" onClick={() => removeFile(idx)} aria-label="Remove file">
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="pd-label" htmlFor="sub-note">DELIVERY NOTE FOR CLIENT</label>
        <textarea
          id="sub-note"
          className="pd-textarea"
          rows={3}
          maxLength={3000}
          placeholder="Summary of edits, color grading choices, download recommendations..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && <p className="pd-form-error" role="alert">{error}</p>}

        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={submitting || !files.length}>
            <Icon name="upload" size={15} />
            {submitting ? 'Uploading deliverables…' : `Submit Deliverables v${nextVersion}`}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ── Client Feedback / Review Modal ── */
function FeedbackModal({ submission, onClose, onFeedbackSaved }) {
  const [reviewStatus, setReviewStatus] = useState('approved')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await onFeedbackSaved(submission._id, {
        reviewStatus,
        clientFeedback: feedback.trim(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal" onSubmit={submit} role="dialog" aria-modal="true">
        <div className="pd-modal-head">
          <h2>Client Review for Submission v{submission.version}</h2>
          <button type="button" className="pd-modal-close" onClick={onClose} disabled={saving}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <label className="pd-label">DECISION</label>
        <div className="pd-decision-radio-group">
          <label className={`pd-radio-card ${reviewStatus === 'approved' ? 'pd-radio-card--active-success' : ''}`}>
            <input
              type="radio"
              name="reviewStatus"
              value="approved"
              checked={reviewStatus === 'approved'}
              onChange={() => setReviewStatus('approved')}
            />
            <div>
              <strong>Approve Submission</strong>
              <span>Deliverables meet all requirements and are accepted.</span>
            </div>
          </label>

          <label className={`pd-radio-card ${reviewStatus === 'revision_requested' ? 'pd-radio-card--active-danger' : ''}`}>
            <input
              type="radio"
              name="reviewStatus"
              value="revision_requested"
              checked={reviewStatus === 'revision_requested'}
              onChange={() => setReviewStatus('revision_requested')}
            />
            <div>
              <strong>Request Revisions</strong>
              <span>Photographer needs to make changes and submit a new revision.</span>
            </div>
          </label>
        </div>

        <label className="pd-label" htmlFor="cf-text">FEEDBACK & REVISION NOTES</label>
        <textarea
          id="cf-text"
          className="pd-textarea"
          rows={4}
          required={reviewStatus === 'revision_requested'}
          placeholder={reviewStatus === 'approved' ? 'Nice work! These look wonderful.' : 'Please adjust color temperature on shot #3 and remove background glare...'}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {error && <p className="pd-form-error" role="alert">{error}</p>}

        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Record Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ── Edit Project Details Modal ── */
function EditProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    title: project.title,
    clientName: project.clientName || '',
    clientEmail: project.clientEmail || '',
    category: project.category || 'Photography',
    budget: project.budget || '',
    deadline: project.deadline ? project.deadline.slice(0, 10) : '',
    brief: project.brief || '',
    deliverables: project.deliverables || '',
    notes: project.notes || '',
  })
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal pd-modal--lg" onSubmit={submit}>
        <div className="pd-modal-head">
          <h2>Edit Project Info</h2>
          <button type="button" className="pd-modal-close" onClick={onClose} disabled={saving}><Icon name="x" size={16} /></button>
        </div>

        <div className="pd-form-grid">
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-title">PROJECT TITLE *</label>
            <input
              id="ep-title"
              className="pd-input"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-cat">CATEGORY</label>
            <select
              id="ep-cat"
              className="pd-select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {PHOTOGRAPHY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-cname">CLIENT NAME</label>
            <input
              id="ep-cname"
              className="pd-input"
              value={form.clientName}
              onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
            />
          </div>
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-cemail">CLIENT EMAIL</label>
            <input
              id="ep-cemail"
              type="email"
              className="pd-input"
              value={form.clientEmail}
              onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
            />
          </div>
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-budget">BUDGET</label>
            <input
              id="ep-budget"
              className="pd-input"
              value={form.budget}
              onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            />
          </div>
          <div className="pd-form-col">
            <label className="pd-label" htmlFor="ep-deadline">DEADLINE</label>
            <input
              id="ep-deadline"
              type="date"
              className="pd-input"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </div>
        </div>

        <label className="pd-label" htmlFor="ep-brief">BRIEF</label>
        <textarea
          id="ep-brief"
          className="pd-textarea"
          rows={3}
          value={form.brief}
          onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
        />

        <label className="pd-label" htmlFor="ep-deliv">DELIVERABLES REQUIRED</label>
        <textarea
          id="ep-deliv"
          className="pd-textarea"
          rows={2}
          value={form.deliverables}
          onChange={(e) => setForm((f) => ({ ...f, deliverables: e.target.value }))}
        />

        <label className="pd-label" htmlFor="ep-notes">NOTES</label>
        <textarea
          id="ep-notes"
          className="pd-textarea"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />

        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const basePath = useBasePath()
  const { addToast } = useToast()

  const [project, setProject] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stages') // 'stages', 'submissions', 'activity'
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [feedbackSubmission, setFeedbackSubmission] = useState(null)

  const loadData = async () => {
    try {
      const [proj, subs] = await Promise.all([
        api.getProject(id),
        api.listSubmissions(id),
      ])
      setProject(proj)
      setSubmissions(subs || [])
    } catch (err) {
      addToast('error', 'Failed to load project', err.message)
      navigate(`${basePath}/projects`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  /* ── Status change ── */
  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await api.updateStatus(id, newStatus)
      setProject(updated)
      addToast('success', 'Status updated', `Project is now marked as "${PROJECT_STATUSES[newStatus]?.label || newStatus}".`)
    } catch (err) {
      addToast('error', 'Status update failed', err.message)
    }
  }

  /* ── Progress Stage Toggle ── */
  const handleToggleStage = async (stageKey, currentCompleted, note = '') => {
    try {
      const updated = await api.updateProgress(id, stageKey, !currentCompleted, note)
      setProject(updated)
      addToast('success', 'Progress updated')
    } catch (err) {
      addToast('error', 'Failed to update stage', err.message)
    }
  }

  /* ── Deliverables submitted callback ── */
  const handleDeliverablesSubmitted = (newSub, updatedProj) => {
    setSubmissions((prev) => [newSub, ...prev])
    if (updatedProj) setProject(updatedProj)
    addToast('success', 'Deliverables submitted', `v${newSub.version} submitted for client review.`)
  }

  /* ── Feedback recorded ── */
  const handleFeedbackSaved = async (submissionId, body) => {
    const res = await api.addFeedback(id, submissionId, body)
    setSubmissions((prev) =>
      prev.map((s) => (s._id === submissionId ? res.submission : s))
    )
    if (res.project) setProject(res.project)
    addToast('success', 'Review recorded', 'Client review status has been recorded.')
    return res
  }

  /* ── Save project metadata ── */
  const handleSaveInfo = async (fields) => {
    try {
      const updated = await api.updateProject(id, fields)
      setProject(updated)
      addToast('success', 'Project updated')
    } catch (err) {
      addToast('error', 'Failed to update project', err.message)
    }
  }

  /* ── Delete Project ── */
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    try {
      await api.deleteProject(id)
      addToast('success', 'Project deleted')
      navigate(`${basePath}/projects`)
    } catch (err) {
      addToast('error', 'Failed to delete project', err.message)
    }
  }


  if (loading || !project) {
    return (
      <AppLayout title="Project">
        <div className="pd-loading-state">
          <div className="pd-spinner" />
          <p>Loading project details…</p>
        </div>
      </AppLayout>
    )
  }

  const currentStatusCfg = PROJECT_STATUSES[project.status] || { label: project.status, color: '#666' }
  const stages = project.progress || []
  const completedCount = stages.filter((s) => s.completed).length
  const percent = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0
  const nextVer = (submissions[0]?.version || 0) + 1

  return (
    <AppLayout title={project.title}>
      {/* Submission Modal */}
      {showSubmitModal && (
        <SubmissionModal
          projectId={id}
          nextVersion={nextVer}
          onClose={() => setShowSubmitModal(false)}
          onSubmitted={handleDeliverablesSubmitted}
        />
      )}

      {/* Client Feedback Modal */}
      {feedbackSubmission && (
        <FeedbackModal
          submission={feedbackSubmission}
          onClose={() => setFeedbackSubmission(null)}
          onFeedbackSaved={handleFeedbackSaved}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveInfo}
        />
      )}

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to={`${basePath}/projects`}>Client Projects</Link>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">{project.title}</span>
      </nav>


      {/* Project Header */}
      <header className="pd-project-header">
        <div className="pd-project-header-left">
          <div className="pd-detail-meta-strip">
            <span className="pd-collection-category">{project.category || 'Photography'}</span>
            <span className="pd-status-badge" style={{ '--status-color': currentStatusCfg.color }}>
              {currentStatusCfg.label}
            </span>
          </div>
          <h1 className="pd-project-title-large">{project.title}</h1>
          <div className="pd-project-client-line">
            <Icon name="user" size={15} />
            <strong>Client:</strong>
            <span>{project.clientName || 'Unassigned'}</span>
            {project.clientEmail && <a href={`mailto:${project.clientEmail}`} className="pd-client-email-link">({project.clientEmail})</a>}
          </div>
        </div>

        <div className="pd-project-header-right">
          <div className="pd-status-picker">
            <label htmlFor="proj-status-select">Status:</label>
            <select
              id="proj-status-select"
              className="pd-select pd-select--status"
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {Object.entries(PROJECT_STATUSES).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>

          <button className="pd-btn pd-btn--primary" onClick={() => setShowSubmitModal(true)}>
            <Icon name="upload" size={16} /> Submit Deliverables
          </button>

          <button className="pd-btn pd-btn--outline" onClick={() => setShowEditModal(true)}>
            <Icon name="edit" size={15} /> Edit Info
          </button>

          <button className="pd-btn pd-btn--ghost pd-btn--danger-text" onClick={handleDelete}>
            <Icon name="trash" size={15} />
          </button>
        </div>
      </header>

      {/* Highlight alert if revision requested */}
      {project.status === 'revision_requested' && (
        <div className="pd-alert pd-alert--danger">
          <Icon name="bell" size={18} />
          <div>
            <strong>Client requested revisions on this shoot</strong>
            <p>{project.latestClientFeedback || 'Check deliverables tab for specific notes.'}</p>
          </div>
          <button className="pd-btn pd-btn--sm pd-btn--primary" onClick={() => setShowSubmitModal(true)}>
            Upload New Revision
          </button>
        </div>
      )}

      {/* Info Panels Grid */}
      <div className="pd-info-panels-grid">
        <div className="pd-info-panel">
          <div className="pd-info-panel-title">Overview & Schedule</div>
          <div className="pd-key-val-list">
            <div className="pd-key-val">
              <span className="pd-kv-key">Budget</span>
              <span className="pd-kv-val">{project.budget || 'Not specified'}</span>
            </div>
            <div className="pd-key-val">
              <span className="pd-kv-key">Deadline</span>
              <span className="pd-kv-val">
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Flexible'}
              </span>
            </div>
            <div className="pd-key-val">
              <span className="pd-kv-key">Progress</span>
              <span className="pd-kv-val">{percent}% complete ({completedCount}/9 stages)</span>
            </div>
          </div>
        </div>

        <div className="pd-info-panel">
          <div className="pd-info-panel-title">Deliverables Specification</div>
          <p className="pd-panel-body-text">
            {project.deliverables || 'No specific deliverable format specified.'}
          </p>
        </div>

        <div className="pd-info-panel pd-info-panel--wide">
          <div className="pd-info-panel-title">Brief & Creative Notes</div>
          <p className="pd-panel-body-text pd-panel-body-text--multiline">
            {project.brief || 'No creative brief provided yet.'}
          </p>
          {project.notes && (
            <div className="pd-internal-notes-box">
              <strong>Photographer Internal Notes:</strong>
              <p>{project.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Bar: Stages, Submissions, Activity */}
      <div className="pd-tabs-container">
        <div className="pd-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'stages'}
            className={`pd-tab ${activeTab === 'stages' ? 'pd-tab--active' : ''}`}
            onClick={() => setActiveTab('stages')}
          >
            Shoot Workflow Stages ({completedCount}/9)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'submissions'}
            className={`pd-tab ${activeTab === 'submissions' ? 'pd-tab--active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Deliverables & Revisions ({submissions.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'activity'}
            className={`pd-tab ${activeTab === 'activity' ? 'pd-tab--active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity Log ({project.activity?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: 9-Stage Shoot Workflow Tracker */}
      {activeTab === 'stages' && (
        <div className="pd-stages-workflow">
          <div className="pd-stages-header">
            <h3>Shoot & Post-Production Milestone Tracker</h3>
            <p>Check off milestones as you progress from planning through final client approval.</p>
          </div>

          <div className="pd-stages-list">
            {PROGRESS_STAGES.map((def, idx) => {
              const current = stages.find((s) => s.stage === def.key) || { stage: def.key, completed: false }
              return (
                <div
                  key={def.key}
                  className={`pd-stage-row ${current.completed ? 'pd-stage-row--done' : ''}`}
                >
                  <div className="pd-stage-left">
                    <button
                      type="button"
                      className={`pd-stage-check ${current.completed ? 'pd-stage-check--checked' : ''}`}
                      onClick={() => handleToggleStage(def.key, current.completed, current.note)}
                      aria-label={`Mark ${def.label} as ${current.completed ? 'incomplete' : 'complete'}`}
                    >
                      {current.completed && <Icon name="check" size={14} />}
                    </button>
                    <div className="pd-stage-info">
                      <span className="pd-stage-num">{idx + 1}.</span>
                      <strong className="pd-stage-name">{def.label}</strong>
                      {current.completedAt && (
                        <span className="pd-stage-date">
                          Completed on {new Date(current.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pd-stage-note-wrap">
                    {current.note ? (
                      <span className="pd-stage-note">“{current.note}”</span>
                    ) : (
                      <span className="pd-stage-note pd-stage-note--empty">No note added</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Versioned Deliverable Submissions */}
      {activeTab === 'submissions' && (
        <div className="pd-submissions-pane">
          <div className="pd-submissions-top">
            <div>
              <h3>Deliverable Packages & Revisions</h3>
              <p>Each delivery creates a distinct version preserving client feedback and previous packages.</p>
            </div>
            <button className="pd-btn pd-btn--primary" onClick={() => setShowSubmitModal(true)}>
              <Icon name="upload" size={15} /> Submit Deliverables v{nextVer}
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="pd-empty-state">
              <Icon name="upload" size={40} />
              <h4>No deliverables submitted yet</h4>
              <p>Once you finish editing, upload the deliverable package to start client review.</p>
              <button className="pd-btn pd-btn--primary" onClick={() => setShowSubmitModal(true)}>
                <Icon name="upload" size={15} /> Submit First Deliverables
              </button>
            </div>
          ) : (
            <div className="pd-submissions-timeline">
              {submissions.map((sub) => {
                const isApproved = sub.reviewStatus === 'approved'
                const isRevReq = sub.reviewStatus === 'revision_requested'
                return (
                  <article key={sub._id} className="pd-submission-card">
                    <div className="pd-submission-head">
                      <div className="pd-submission-ver-strip">
                        <span className="pd-sub-version">Version {sub.version}</span>
                        <span className="pd-sub-date">
                          Submitted {new Date(sub.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span className={`pd-sub-status-badge pd-sub-status-badge--${sub.reviewStatus}`}>
                        {sub.reviewStatus === 'approved' && 'Approved by Client'}
                        {sub.reviewStatus === 'revision_requested' && 'Revisions Requested'}
                        {sub.reviewStatus === 'pending' && 'Pending Client Review'}
                      </span>
                    </div>

                    {sub.note && (
                      <div className="pd-sub-photographer-note">
                        <strong>Delivery note:</strong> {sub.note}
                      </div>
                    )}

                    {/* Files Grid */}
                    <div className="pd-sub-files-grid">
                      {sub.deliverables?.map((file) => {
                        const isImg = file.mimeType?.startsWith('image/')
                        return (
                          <a
                            key={file._id || file.url}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pd-sub-file-item"
                          >
                            {isImg ? (
                              <img src={file.url} alt={file.originalName} className="pd-sub-file-thumb" />
                            ) : (
                              <div className="pd-sub-file-icon"><Icon name="folder" size={24} /></div>
                            )}
                            <div className="pd-sub-file-meta">
                              <span className="pd-sub-file-name" title={file.originalName || file.filename}>
                                {file.originalName || file.filename}
                              </span>
                              <span className="pd-sub-file-size">
                                {file.sizeBytes ? `${(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB` : ''}
                              </span>
                            </div>
                          </a>
                        )
                      })}
                    </div>

                    {/* Client feedback message */}
                    {sub.clientFeedback && (
                      <div className={`pd-sub-feedback-box ${isApproved ? 'pd-sub-feedback-box--approved' : 'pd-sub-feedback-box--revision'}`}>
                        <strong>Client Feedback:</strong>
                        <p>{sub.clientFeedback}</p>
                      </div>
                    )}

                    {/* Client review simulation / action */}
                    <div className="pd-sub-actions">
                      <button
                        className="pd-btn pd-btn--sm pd-btn--outline"
                        onClick={() => setFeedbackSubmission(sub)}
                      >
                        <Icon name="edit" size={13} /> Record Client Review / Feedback
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Activity Timeline */}
      {activeTab === 'activity' && (
        <div className="pd-activity-pane">
          <div className="pd-activity-header">
            <h3>Project Activity & Audit Trail</h3>
            <p>Chronological record of status changes, stage milestones, submissions, and client reviews.</p>
          </div>

          {(!project.activity || project.activity.length === 0) ? (
            <p className="pd-empty-hint">No activity recorded yet.</p>
          ) : (
            <div className="pd-activity-list">
              {[...project.activity].reverse().map((act, i) => (
                <div key={act._id || i} className="pd-activity-item">
                  <div className="pd-activity-bullet" />
                  <div className="pd-activity-content">
                    <span className="pd-activity-desc">{act.description}</span>
                    <span className="pd-activity-time">
                      {act.createdAt ? new Date(act.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  )
}
