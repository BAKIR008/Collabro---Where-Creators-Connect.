import { useEffect, useState } from 'react'

const MAX_COVER_BYTES = 700 * 1024

export function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file such as JPG, PNG, or WebP.'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Choose an image smaller than 5 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('We could not read that image. Please try another file.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('That image could not be opened. Please try another file.'))
      image.onload = () => {
        const scale = Math.min(1, 1200 / image.width, 900 / image.height)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
        let quality = 0.78
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        while (dataUrl.length > MAX_COVER_BYTES && quality > 0.35) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        if (dataUrl.length > MAX_COVER_BYTES) {
          reject(new Error('This image is too detailed to save. Choose a smaller image.'))
          return
        }
        resolve(dataUrl)
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ProjectForm({ initialProject, onSave, onClose, saving = false }) {
  const [form, setForm] = useState(() => ({
    title: initialProject?.title || '',
    description: initialProject?.description || '',
    category: initialProject?.category || initialProject?.type || 'Portrait',
    status: initialProject?.status || 'Open',
    coverImage: initialProject?.coverImage || '',
    lookingFor: initialProject?.lookingFor || initialProject?.need || '',
  }))
  const [error, setError] = useState('')
  const isEditing = Boolean(initialProject?._id || initialProject?.isLocalPreview)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, saving])

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleCover = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      setField('coverImage', await imageFileToDataUrl(file))
    } catch (uploadError) {
      setError(uploadError.message)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (form.title.trim().length < 2) {
      setError('Add a project title with at least 2 characters.')
      return
    }
    try {
      setError('')
      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        lookingFor: form.lookingFor.trim(),
        category: form.category.trim(),
      })
    } catch (saveError) {
      setError(saveError.message || 'Could not save this project. Please try again.')
    }
  }

  return (
    <div
      className="photo-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose() }}
    >
      <form className="photo-project-modal photo-project-form" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="project-form-title">
        <button type="button" className="photo-modal-close" aria-label="Close" onClick={onClose} disabled={saving}>×</button>
        <span className="photo-eyebrow">{isEditing ? 'SHAPE THE IDEA' : 'MAKE ROOM FOR A NEW IDEA'}</span>
        <h2 id="project-form-title">{isEditing ? 'Edit project' : 'Start a project'}</h2>
        <p>Set the details now — you can keep shaping the project with your team later.</p>

        <label htmlFor="project-name">PROJECT TITLE *</label>
        <input id="project-name" autoFocus maxLength={80} placeholder="e.g. Golden hour portraits" value={form.title} onChange={(event) => setField('title', event.target.value)} required minLength={2} />

        <label htmlFor="project-description">DESCRIPTION</label>
        <textarea id="project-description" maxLength={3000} rows={3} placeholder="What story are you hoping to tell?" value={form.description} onChange={(event) => setField('description', event.target.value)} />

        <div className="photo-form-row">
          <div>
            <label htmlFor="project-category">CATEGORY</label>
            <select id="project-category" value={form.category} onChange={(event) => setField('category', event.target.value)}>
              {['Portrait', 'Editorial', 'Lifestyle', 'Nature', 'Campaign', 'Wedding', 'Other'].map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="project-status">STATUS</label>
            <select id="project-status" value={form.status} onChange={(event) => setField('status', event.target.value)}>
              <option>Open</option><option>In progress</option><option>Completed</option>
            </select>
          </div>
        </div>

        <label htmlFor="project-looking-for">WHO WOULD YOU LIKE TO COLLABORATE WITH?</label>
        <input id="project-looking-for" maxLength={200} placeholder="e.g. Stylist, makeup artist" value={form.lookingFor} onChange={(event) => setField('lookingFor', event.target.value)} />

        <label htmlFor="project-cover">COVER IMAGE</label>
        <input id="project-cover" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleCover} />
        {form.coverImage && (
          <div className="photo-cover-preview">
            <img src={form.coverImage} alt="Selected project cover preview" />
            <button type="button" onClick={() => setField('coverImage', '')}>Remove cover</button>
          </div>
        )}
        {error && <p className="photo-form-error" role="alert">{error}</p>}
        <button type="submit" className="photo-button photo-button-yellow" disabled={saving}>
          {saving ? 'SAVING…' : isEditing ? 'SAVE CHANGES' : 'CREATE PROJECT'} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  )
}
