import { createPreviewProject, deletePreviewProject, getPreviewProject, updatePreviewProject } from './dashboardStorage.js'

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(result.message || 'The request could not be completed.')
    error.status = response.status
    throw error
  }
  return result
}

export const dashboardApi = {
  async getUser() {
    return (await request('/api/auth/me')).user
  },
  async saveProfile(profile) {
    return (await request('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    })).user
  },
  async getProjects() {
    return (await request('/api/projects')).projects
  },
  async getProject(id) {
    if (id.startsWith('local-')) {
      const project = getPreviewProject(id)
      if (!project) throw new Error('Project not found in this browser.')
      return project
    }
    return (await request(`/api/projects/${encodeURIComponent(id)}`)).project
  },
  async createProject(project) {
    return (await request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    })).project
  },
  createPreviewProject,
  async updateProject(id, project) {
    if (id.startsWith('local-')) return updatePreviewProject(id, project)
    return (await request(`/api/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    })).project
  },
  async deleteProject(id) {
    if (id.startsWith('local-')) {
      deletePreviewProject(id)
      return { success: true }
    }
    return request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  async logout() {
    return request('/api/auth/logout', { method: 'POST' })
  },
}

export function authPageUrl(path = '/login') {
  const base = import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5111'
  return new URL(path, base).toString()
}
