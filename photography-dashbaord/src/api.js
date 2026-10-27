/**
 * CollaBro Photography Dashboard — API Client
 * All requests proxy through Vite to the CollaBro backend at port 5000.
 * Authentication uses the collabro_token HttpOnly cookie.
 */

const BASE = '/api/photography'
const AUTH = '/api/auth'

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(result.message || 'The request could not be completed.')
    error.status = response.status
    error.errors = result.errors
    throw error
  }
  return result
}

export const api = {
  /* ── Auth ── */
  getMe: () => request(`${AUTH}/me`).then((r) => r.user),
  logout: () => request(`${AUTH}/logout`, { method: 'POST' }),
  saveProfile: (body) => request(`${AUTH}/profile`, { method: 'PATCH', body: JSON.stringify(body) }),
  uploadAvatar: (formData) => request(`${AUTH}/profile/picture`, { method: 'POST', body: formData }),

  /* ── Dashboard stats ── */
  getDashboard: () => request(`${BASE}/dashboard`).then((r) => r.stats),

  /* ── Full profile (with creator profile fields) ── */
  getProfile: () => request(`${BASE}/profile`).then((r) => r.profile),
  updateProfile: (body) => request(`${BASE}/profile`, { method: 'PATCH', body: JSON.stringify(body) }).then((r) => r.profile),

  /* ── Portfolio ── */
  listPortfolio: (page = 1) => request(`${BASE}/portfolio?page=${page}&limit=20`),
  createPortfolio: (body) => request(`${BASE}/portfolio`, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.collection),
  getPortfolio: (id) => request(`${BASE}/portfolio/${id}`).then((r) => r.collection),
  updatePortfolio: (id, body) => request(`${BASE}/portfolio/${id}`, { method: 'PATCH', body: JSON.stringify(body) }).then((r) => r.collection),
  deletePortfolio: (id) => request(`${BASE}/portfolio/${id}`, { method: 'DELETE' }),
  togglePublish: (id) => request(`${BASE}/portfolio/${id}/publish`, { method: 'PATCH' }),
  uploadImages: (id, formData) => request(`${BASE}/portfolio/${id}/images`, { method: 'POST', body: formData }),
  deleteImage: (collectionId, imageId) => request(`${BASE}/portfolio/${collectionId}/images/${imageId}`, { method: 'DELETE' }).then((r) => r.collection),
  updateCaption: (collectionId, imageId, caption) =>
    request(`${BASE}/portfolio/${collectionId}/images/${imageId}`, { method: 'PATCH', body: JSON.stringify({ caption }) }).then((r) => r.collection),

  /* ── Projects ── */
  listProjects: (page = 1, status = '') =>
    request(`${BASE}/projects?page=${page}&limit=20${status ? `&status=${status}` : ''}`),
  createProject: (body) => request(`${BASE}/projects`, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.project),
  getProject: (id) => request(`${BASE}/projects/${id}`).then((r) => r.project),
  updateProject: (id, body) => request(`${BASE}/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }).then((r) => r.project),
  deleteProject: (id) => request(`${BASE}/projects/${id}`, { method: 'DELETE' }),
  updateStatus: (id, status) => request(`${BASE}/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }).then((r) => r.project),
  updateProgress: (id, stage, completed, note = '') =>
    request(`${BASE}/projects/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ stage, completed, note }) }).then((r) => r.project),

  /* ── Submissions ── */
  listSubmissions: (projectId) => request(`${BASE}/projects/${projectId}/submissions`).then((r) => r.submissions),
  createSubmission: (projectId, formData) => request(`${BASE}/projects/${projectId}/submissions`, { method: 'POST', body: formData }),
  addFeedback: (projectId, submissionId, body) =>
    request(`${BASE}/projects/${projectId}/submissions/${submissionId}/feedback`, { method: 'PATCH', body: JSON.stringify(body) }),
}

export const authUrl = (path = '/login') => {
  const base = import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5111'
  return new URL(path, base).toString()
}

export const useBasePath = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/photographer-dashboard')) {
    return '/photographer-dashboard'
  }
  return ''
}


export const PHOTOGRAPHY_CATEGORIES = [
  'Portrait', 'Wedding', 'Fashion', 'Product', 'Landscape',
  'Travel', 'Events', 'Street Photography', 'Architecture',
  'Food', 'Commercial', 'Editorial', 'Nature', 'Lifestyle', 'Other',
]

export const PROJECT_STATUSES = {
  new: { label: 'New', color: '#6366f1' },
  accepted: { label: 'Accepted', color: '#0ea5e9' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  ready_for_review: { label: 'Ready for Review', color: '#8b5cf6' },
  submitted: { label: 'Submitted', color: '#06b6d4' },
  revision_requested: { label: 'Revision Requested', color: '#ef4444' },
  completed: { label: 'Completed', color: '#22c55e' },
  cancelled: { label: 'Cancelled', color: '#6b7280' },
}

export const PROGRESS_STAGES = [
  { key: 'brief_reviewed', label: 'Brief Reviewed' },
  { key: 'shoot_planned', label: 'Shoot Planned' },
  { key: 'photography_completed', label: 'Photography Completed' },
  { key: 'images_selected', label: 'Images Selected' },
  { key: 'editing_in_progress', label: 'Editing in Progress' },
  { key: 'final_images_prepared', label: 'Final Images Prepared' },
  { key: 'deliverables_submitted', label: 'Deliverables Submitted' },
  { key: 'client_review_completed', label: 'Client Review Completed' },
  { key: 'revisions_completed', label: 'Revisions Completed' },
]
