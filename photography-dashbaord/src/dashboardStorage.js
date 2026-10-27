const PROJECTS_KEY = 'collabro-preview-projects'
const PROFILE_KEY = 'collabro-preview-profile'

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('Browser storage is unavailable or full. Remove some saved images and try again.')
  }
}

export function readPreviewProjects() {
  return readJson(PROJECTS_KEY, [])
}

export function readPreviewProfile() {
  return readJson(PROFILE_KEY, null)
}

export function savePreviewProfile(profile) {
  const current = readPreviewProfile() || {}
  const updated = { ...current, ...profile, isLocalPreview: true }
  writeJson(PROFILE_KEY, updated)
  return updated
}

export function createPreviewProject(project) {
  const created = {
    ...project,
    id: `local-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
    isLocalPreview: true,
    collaborators: [],
    tasks: [],
    referenceImages: [],
    notes: '',
    createdAt: new Date().toISOString(),
  }
  writeJson(PROJECTS_KEY, [created, ...readPreviewProjects()])
  return created
}

export function getPreviewProject(id) {
  return readPreviewProjects().find((project) => project.id === id) || null
}

export function updatePreviewProject(id, changes) {
  const projects = readPreviewProjects()
  const index = projects.findIndex((project) => project.id === id)
  if (index < 0) throw new Error('Project not found in this browser.')
  projects[index] = { ...projects[index], ...changes, updatedAt: new Date().toISOString() }
  writeJson(PROJECTS_KEY, projects)
  return projects[index]
}

export function deletePreviewProject(id) {
  const projects = readPreviewProjects()
  const remaining = projects.filter((project) => project.id !== id)
  if (remaining.length === projects.length) throw new Error('Project not found in this browser.')
  writeJson(PROJECTS_KEY, remaining)
}
