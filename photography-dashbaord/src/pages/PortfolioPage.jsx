import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PHOTOGRAPHY_CATEGORIES, useBasePath } from '../api.js'

/* ── Create/Edit collection modal ── */
function CollectionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || 'Other',
    isPublished: initial?.isPublished || false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) { setError('Title must be at least 2 characters.'); return }
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <div className="pd-modal-head">
          <h2 id="cm-title">{initial ? 'Edit Collection' : 'New Portfolio Collection'}</h2>
          <button type="button" className="pd-modal-close" onClick={onClose} disabled={saving} aria-label="Close"><Icon name="x" size={16} /></button>
        </div>
        <label className="pd-label" htmlFor="cm-title-input">TITLE *</label>
        <input id="cm-title-input" className="pd-input" required minLength={2} maxLength={100} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Golden Hour Portraits" />
        <label className="pd-label" htmlFor="cm-desc">DESCRIPTION</label>
        <textarea id="cm-desc" className="pd-textarea" rows={3} maxLength={1000} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="A little about this collection…" />
        <label className="pd-label" htmlFor="cm-category">CATEGORY</label>
        <select id="cm-category" className="pd-select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
          {PHOTOGRAPHY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="pd-label pd-label--row">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
          <span>Publish this collection</span>
        </label>
        {error && <p className="pd-form-error" role="alert">{error}</p>}
        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>{saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Collection'}</button>
        </div>
      </form>
    </div>
  )
}

/* ── Collection card ── */
function CollectionCard({ collection, onEdit, onDelete, onTogglePublish, basePath = '' }) {
  const coverUrl = collection.coverImageUrl || collection.images?.[0]?.url || null
  const imageCount = collection.images?.length ?? 0
  return (
    <article className="pd-collection-card">
      <Link to={`${basePath}/portfolio/${collection._id}`} className="pd-collection-thumb">
        {coverUrl
          ? <img src={coverUrl} alt={`${collection.title} cover`} loading="lazy" />
          : <div className="pd-collection-placeholder"><Icon name="image" size={36} /></div>
        }
        <span className={`pd-pub-badge ${collection.isPublished ? 'pd-pub-badge--live' : ''}`}>
          {collection.isPublished ? 'Published' : 'Draft'}
        </span>
        <span className="pd-collection-count">{imageCount} photo{imageCount !== 1 ? 's' : ''}</span>
      </Link>
      <div className="pd-collection-body">
        <div className="pd-collection-meta">
          <span className="pd-collection-category">{collection.category}</span>
        </div>
        <Link to={`${basePath}/portfolio/${collection._id}`} className="pd-collection-title">{collection.title}</Link>
        {collection.description && <p className="pd-collection-desc">{collection.description}</p>}
      </div>
      <div className="pd-collection-actions">
        <Link to={`${basePath}/portfolio/${collection._id}`} className="pd-btn pd-btn--sm pd-btn--outline">
          <Icon name="image" size={13} /> Open
        </Link>
        <button className="pd-btn pd-btn--sm pd-btn--ghost" onClick={() => onTogglePublish(collection)}>
          {collection.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button className="pd-icon-btn" onClick={() => onEdit(collection)} aria-label="Edit collection"><Icon name="edit" size={15} /></button>
        <button className="pd-icon-btn pd-icon-btn--danger" onClick={() => onDelete(collection)} aria-label="Delete collection"><Icon name="trash" size={15} /></button>
      </div>
    </article>
  )
}


export default function PortfolioPage() {
  const { addToast } = useToast()
  const basePath = useBasePath()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | collection (for edit)
  const [deleting, setDeleting] = useState(null)


  const load = async () => {
    setLoading(true)
    try {
      const { collections: data } = await api.listPortfolio()
      setCollections(data || [])
    } catch (err) {
      addToast('error', 'Could not load portfolio', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (body) => {
    const created = await api.createPortfolio(body)
    setCollections((prev) => [created, ...prev])
    addToast('success', 'Collection created', created.title)
  }

  const handleEdit = async (body) => {
    const updated = await api.updatePortfolio(modal._id, body)
    setCollections((prev) => prev.map((c) => c._id === updated._id ? updated : c))
    addToast('success', 'Collection updated', updated.title)
  }

  const handleDelete = async (collection) => {
    if (!window.confirm(`Delete "${collection.title}"? This also removes all its photos.`)) return
    setDeleting(collection._id)
    try {
      await api.deletePortfolio(collection._id)
      setCollections((prev) => prev.filter((c) => c._id !== collection._id))
      addToast('success', 'Collection deleted')
    } catch (err) {
      addToast('error', 'Could not delete', err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublish = async (collection) => {
    try {
      const result = await api.togglePublish(collection._id)
      setCollections((prev) => prev.map((c) => c._id === collection._id ? { ...c, isPublished: result.isPublished } : c))
      addToast('success', result.message)
    } catch (err) {
      addToast('error', 'Could not update', err.message)
    }
  }

  return (
    <AppLayout title="Portfolio">
      <div className="pd-page-header">
        <div>
          <h1 className="pd-page-title">Portfolio</h1>
          <p className="pd-page-sub">Manage your photography collections and published work.</p>
        </div>
        <button className="pd-btn pd-btn--primary" onClick={() => setModal('create')}>
          <Icon name="plus" size={15} /> New Collection
        </button>
      </div>

      {loading ? (
        <div className="pd-skeleton-grid">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="pd-skeleton pd-skeleton--collection" />)}
        </div>
      ) : collections.length === 0 ? (
        <div className="pd-empty-state pd-empty-state--full">
          <div className="pd-empty-icon"><Icon name="image" size={40} /></div>
          <h2>No collections yet</h2>
          <p>Create your first portfolio collection to showcase your photography.</p>
          <button className="pd-btn pd-btn--primary" onClick={() => setModal('create')}>
            <Icon name="plus" size={15} /> Create Collection
          </button>
        </div>
      ) : (
        <div className="pd-collection-grid">
          {collections.map((c) => (
            <CollectionCard
              key={c._id}
              collection={c}
              basePath={basePath}
              onEdit={(col) => setModal(col)}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />

          ))}
        </div>
      )}

      {modal === 'create' && (
        <CollectionModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal && modal !== 'create' && (
        <CollectionModal initial={modal} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
    </AppLayout>
  )
}
