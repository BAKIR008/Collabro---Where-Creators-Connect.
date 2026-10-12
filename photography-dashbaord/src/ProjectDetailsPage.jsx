import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { creators, photoUrl, projectsSeed } from './dashboardData.js'
import { authPageUrl, dashboardApi } from './dashboardApi.js'
import ProjectForm from './ProjectForm.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import ToastContainer, { useToast } from './components/ToastSystem.jsx'
import './PhotographerDashboard.css'

function projectCover(project) {
  if (project.coverImage) return project.coverImage
  if (project.image) return project.image.startsWith('http') ? project.image : photoUrl(project.image, 1400)
  return photoUrl('photo-1492691527719-9d1e07e534b4', 1400)
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [collaboratorName, setCollaboratorName] = useState('')
  const [collaboratorRole, setCollaboratorRole] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const loadProject = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const loaded = await dashboardApi.getProject(projectId)
      setProject(loaded)
    } catch (error) {
      const featured = projectsSeed.find((item) => item.id === projectId)
      if (error.status === 401) {
        setPageError('Sign in to view your saved project workspace.')
      } else if (featured) {
        setProject({
          ...featured,
          category: featured.type,
          coverImage: projectCover(featured),
          creator: { name: 'CollaBro creator community' },
          tasks: [],
          referenceImages: [],
          notes: '',
        })
      } else {
        setPageError(error.message || 'We could not load this project.')
      }
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { loadProject() }, [loadProject])

  const saveProject = async (changes) => {
    if (!project?._id && !project?.isLocalPreview) throw new Error('Featured projects are examples. Create your own project to edit its workspace.')
    setSaving(true)
    try {
      const updated = await dashboardApi.updateProject(project._id || project.id, {
        title: changes.title ?? project.title,
        description: changes.description ?? project.description ?? '',
        category: changes.category ?? project.category ?? 'Portrait',
        status: changes.status ?? project.status ?? 'Open',
        coverImage: changes.coverImage ?? project.coverImage ?? null,
        lookingFor: changes.lookingFor ?? project.lookingFor ?? '',
        collaborators: changes.collaborators ?? project.collaborators ?? [],
        tasks: changes.tasks ?? project.tasks ?? [],
        referenceImages: changes.referenceImages ?? project.referenceImages ?? [],
        notes: changes.notes ?? project.notes ?? '',
      })
      setProject(updated)
      addToast('success', 'Project saved', 'Your changes are saved to your account.')
      return updated
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!project?._id && !project?.isLocalPreview) return
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await dashboardApi.deleteProject(project._id || project.id)
      addToast('success', 'Project deleted', 'This project has been removed.')
      navigate('/dashboard')
    } catch (error) {
      addToast('error', 'Could not delete project', error.message)
    }
  }

  const addTask = async (event) => {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title || (!project?._id && !project?.isLocalPreview)) return
    try {
      await saveProject({ tasks: [...(project.tasks || []), { title, completed: false }] })
      setTaskTitle('')
    } catch (error) {
      addToast('error', 'Task was not added', error.message)
    }
  }

  const addCollaborator = async (event) => {
    event.preventDefault()
    if ((!project?._id && !project?.isLocalPreview) || !collaboratorName.trim()) return
    try {
      await saveProject({
        collaborators: [...(project.collaborators || []), { name: collaboratorName.trim(), role: collaboratorRole.trim() }],
      })
      setCollaboratorName('')
      setCollaboratorRole('')
    } catch (error) {
      addToast('error', 'Collaborator was not added', error.message)
    }
  }

  const addReference = async (event) => {
    event.preventDefault()
    let url
    try {
      url = new URL(referenceUrl)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      addToast('error', 'Check the image link', 'Enter a complete link that starts with https://.')
      return
    }
    if (!project?._id && !project?.isLocalPreview) return
    try {
      await saveProject({ referenceImages: [...(project.referenceImages || []), url.toString()] })
      setReferenceUrl('')
    } catch (error) {
      addToast('error', 'Reference was not added', error.message)
    }
  }

  const toggleTask = async (index) => {
    try {
      await saveProject({
        tasks: project.tasks.map((task, taskIndex) => taskIndex === index
          ? { ...task, completed: !task.completed }
          : task),
      })
    } catch (error) {
      addToast('error', 'Task was not updated', error.message)
    }
  }

  const creator = typeof project?.creator === 'object' ? project.creator : null
  const canManageProject = Boolean(project?._id || project?.isLocalPreview)
  const category = project?.category || project?.type || 'Creative'
  const collaborators = project?.collaborators || []
  const tasks = project?.tasks || []
  const progress = tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0

  return (
    <div className="photo-dashboard photo-project-workspace">
      <CustomCursor />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="photo-topbar">
        <Link className="photo-brand" to="/dashboard" aria-label="CollaBro dashboard">
          <span className="photo-brand-name">COLLAB<span>R</span>O</span>
          <span className="photo-brand-tag">THE CREATORS HUB</span>
        </Link>
        <span className="photo-workspace-label">PROJECT WORKSPACE</span>
        <Link className="photo-workspace-back" to="/dashboard">← Back to Dashboard</Link>
      </header>

      <main className="photo-workspace-main">
        {loading ? <div className="photo-empty-state">Opening your project…</div> : pageError ? (
          <section className="photo-workspace-message" role="alert">
            <h1>{pageError}</h1>
            {pageError.startsWith('Sign in') ? <a className="photo-button photo-button-yellow" href={authPageUrl()}>Sign in</a> : <Link className="photo-button photo-button-yellow" to="/dashboard">Back to dashboard</Link>}
          </section>
        ) : project && (
          <>
            <div className="photo-workspace-hero">
              <img src={projectCover(project)} alt={`Cover for ${project.title}`} />
              <div className="photo-workspace-hero-shade" />
              <div className="photo-workspace-title">
                <span className="photo-workspace-chip">{category} · {project.status}</span>
                <h1>{project.title}</h1>
                <p>Created by {creator?.name || 'You'}{project.createdAt ? ` · ${new Date(project.createdAt).toLocaleDateString()}` : ''}</p>
              </div>
            </div>
            <div className="photo-workspace-actions">
              {canManageProject && <button className="photo-button photo-button-yellow" onClick={() => setFormOpen(true)}>Edit project</button>}
              {canManageProject && <button className="photo-workspace-delete" onClick={handleDelete}>Delete project</button>}
              {project.isLocalPreview && <span className="photo-workspace-demo">Preview mode · saved on this device only</span>}
              {!canManageProject && <span className="photo-workspace-demo">Featured community project</span>}
            </div>

            <div className="photo-workspace-grid">
              <section className="photo-workspace-card">
                <span className="photo-eyebrow">THE IDEA</span>
                <h2>About this project</h2>
                <p>{project.description || 'Add a few words about the story, mood, or creative direction behind this project.'}</p>
                {project.lookingFor && <p><b>Looking for:</b> {project.lookingFor}</p>}
                <p><b>Category:</b> {category} <span aria-hidden="true">·</span> <b>Status:</b> {project.status}</p>
                <h3>Collaborators</h3>
                {collaborators.length ? (
                  <ul className="photo-workspace-people">
                    {collaborators.map((person, index) => {
                      const name = typeof person === 'string' ? person : person.name
                      const role = typeof person === 'string' ? '' : person.role
                      return <li key={`${name}-${index}`}><img src={photoUrl(creators[index % creators.length].image, 80)} alt="" /><span><b>{name}</b><small>{role || 'Creative collaborator'}</small></span></li>
                    })}
                  </ul>
                ) : <p className="photo-muted">No collaborators yet. Invite someone to make it a team effort.</p>}
                {canManageProject && (
                  <form className="photo-inline-form" onSubmit={addCollaborator}>
                    <input aria-label="Collaborator name" placeholder="Creator name" value={collaboratorName} onChange={(event) => setCollaboratorName(event.target.value)} required maxLength={50} />
                    <input aria-label="Collaborator role" placeholder="Role (optional)" value={collaboratorRole} onChange={(event) => setCollaboratorRole(event.target.value)} maxLength={50} />
                    <button className="photo-button photo-button-yellow" disabled={saving}>Add collaborator</button>
                  </form>
                )}
              </section>

              <section className="photo-workspace-card">
                <div className="photo-workspace-card-heading"><div><span className="photo-eyebrow">NEXT STEPS</span><h2>Project tasks</h2></div><strong>{progress}%</strong></div>
                <div className="photo-progress-track"><span style={{ width: `${progress}%` }} /></div>
                {tasks.length ? <ul className="photo-task-list">{tasks.map((task, index) => (
                  <li key={`${task.title}-${index}`}>
                    <label><input type="checkbox" checked={Boolean(task.completed)} disabled={!canManageProject || saving} onChange={() => toggleTask(index)} /><span className={task.completed ? 'is-complete' : ''}>{task.title}</span></label>
                  </li>
                ))}</ul> : <p className="photo-muted">Add a first task to plan this project.</p>}
                {canManageProject && <form className="photo-inline-form" onSubmit={addTask}><input aria-label="New task" placeholder="e.g. Find a location" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} required maxLength={160} /><button className="photo-button photo-button-yellow" disabled={saving}>Add task</button></form>}
              </section>

              <section className="photo-workspace-card">
                <span className="photo-eyebrow">VISUAL DIRECTION</span>
                <h2>Reference images</h2>
                {project.referenceImages?.length ? (
                  <div className="photo-reference-grid">{project.referenceImages.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Project reference ${index + 1}`} loading="lazy" />)}</div>
                ) : <p className="photo-muted">Keep inspiration close by adding links to reference images.</p>}
                {canManageProject && <form className="photo-inline-form" onSubmit={addReference}><input type="url" aria-label="Reference image URL" placeholder="https://…" value={referenceUrl} onChange={(event) => setReferenceUrl(event.target.value)} required /><button className="photo-button photo-button-yellow" disabled={saving}>Add image</button></form>}
              </section>

              <section className="photo-workspace-card">
                <span className="photo-eyebrow">WORKING NOTES</span>
                <h2>Team notes</h2>
                <textarea className="photo-workspace-notes" aria-label="Project notes" value={project.notes || ''} onChange={(event) => setProject((current) => ({ ...current, notes: event.target.value }))} maxLength={5000} placeholder="Ideas, locations, shot details — keep them here." disabled={!canManageProject} />
                {canManageProject && <button className="photo-button photo-button-yellow" disabled={saving} onClick={() => saveProject({ notes: project.notes || '' }).catch((error) => addToast('error', 'Notes were not saved', error.message))}>{saving ? 'SAVING…' : 'SAVE NOTES'}</button>}
              </section>
            </div>
          </>
        )}
      </main>
      {formOpen && <ProjectForm initialProject={project} saving={saving} onClose={() => setFormOpen(false)} onSave={async (changes) => { await saveProject(changes); setFormOpen(false) }} />}
    </div>
  )
}
