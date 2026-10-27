import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PHOTOGRAPHY_CATEGORIES, useBasePath } from '../api.js'


/* ── Lightbox Component ── */
function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  const current = images[index]
  if (!current) return null

  return (
    <div className="pd-lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pd-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="pd-lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <Icon name="x" size={22} />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="pd-lightbox-nav pd-lightbox-nav--prev"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous photo"
            >
              <Icon name="chevron" size={24} />
            </button>
            <button
              className="pd-lightbox-nav pd-lightbox-nav--next"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="Next photo"
            >
              <Icon name="chevron" size={24} />
            </button>
          </>
        )}

        <div className="pd-lightbox-image-wrap">
          <img src={current.url} alt={current.caption || 'Portfolio photograph'} className="pd-lightbox-image" />
        </div>

        <div className="pd-lightbox-caption-bar">
          <div className="pd-lightbox-caption-text">
            <strong>{current.caption || 'Untitled photograph'}</strong>
            <span>{index + 1} of {images.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Edit Caption Modal ── */
function CaptionModal({ image, onClose, onSave }) {
  const [caption, setCaption] = useState(image?.caption || '')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(caption)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal pd-modal--sm" onSubmit={submit}>
        <div className="pd-modal-head">
          <h2>Edit Photo Caption</h2>
          <button type="button" className="pd-modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="pd-caption-preview">
          <img src={image.url} alt="" />
        </div>
        <label className="pd-label" htmlFor="caption-input">CAPTION</label>
        <input
          id="caption-input"
          className="pd-input"
          maxLength={300}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. Sunset over Brooklyn Bridge"
          autoFocus
        />
        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save Caption'}</button>
        </div>
      </form>
    </div>
  )
}

/* ── Edit Collection Modal ── */
function EditCollectionModal({ collection, onClose, onSave }) {
  const [form, setForm] = useState({
    title: collection.title,
    description: collection.description || '',
    category: collection.category,
    isPublished: collection.isPublished,
  })
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="pd-modal" onSubmit={submit}>
        <div className="pd-modal-head">
          <h2>Edit Collection Details</h2>
          <button type="button" className="pd-modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <label className="pd-label" htmlFor="edit-col-title">COLLECTION TITLE *</label>
        <input
          id="edit-col-title"
          className="pd-input"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <label className="pd-label" htmlFor="edit-col-desc">DESCRIPTION</label>
        <textarea
          id="edit-col-desc"
          className="pd-textarea"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <label className="pd-label" htmlFor="edit-col-cat">CATEGORY</label>
        <select
          id="edit-col-cat"
          className="pd-select"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          {PHOTOGRAPHY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="pd-label pd-label--row">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
          />
          <span>Publicly published</span>
        </label>
        <div className="pd-modal-actions">
          <button type="button" className="pd-btn pd-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save Details'}</button>
        </div>
      </form>
    </div>
  )
}

export default function PortfolioDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const basePath = useBasePath()
  const { addToast } = useToast()
  const fileInputRef = useRef(null)

  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [editingCaptionImage, setEditingCaptionImage] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const loadCollection = async () => {
    try {
      const data = await api.getPortfolio(id)
      setCollection(data)
    } catch (err) {
      addToast('error', 'Failed to load collection', err.message)
      navigate(`${basePath}/portfolio`)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadCollection()
  }, [id])

  /* ── Image upload handler ── */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    setUploading(true)
    try {
      const updated = await api.uploadImages(id, formData)
      setCollection(updated.collection)
      addToast('success', 'Photos uploaded', `${files.length} photo${files.length > 1 ? 's' : ''} added to collection.`)
    } catch (err) {
      addToast('error', 'Upload failed', err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Set Cover Image ── */
  const handleSetCover = async (imageUrl) => {
    try {
      const updated = await api.updatePortfolio(id, { coverImageUrl: imageUrl })
      setCollection(updated)
      addToast('success', 'Cover photo updated')
    } catch (err) {
      addToast('error', 'Failed to set cover', err.message)
    }
  }

  /* ── Delete Image ── */
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this photo from the collection?')) return
    try {
      const updated = await api.deleteImage(id, imageId)
      setCollection(updated)
      addToast('success', 'Photo deleted')
    } catch (err) {
      addToast('error', 'Failed to delete photo', err.message)
    }
  }

  /* ── Update Caption ── */
  const handleSaveCaption = async (caption) => {
    try {
      const updated = await api.updateCaption(id, editingCaptionImage._id, caption)
      setCollection(updated)
      addToast('success', 'Caption saved')
    } catch (err) {
      addToast('error', 'Failed to update caption', err.message)
    }
  }

  /* ── Toggle Publish ── */
  const handleTogglePublish = async () => {
    try {
      const res = await api.togglePublish(id)
      setCollection((c) => ({ ...c, isPublished: res.isPublished }))
      addToast('success', res.isPublished ? 'Collection published' : 'Collection moved to drafts')
    } catch (err) {
      addToast('error', 'Failed to update publish state', err.message)
    }
  }

  /* ── Update metadata ── */
  const handleSaveMeta = async (fields) => {
    try {
      const updated = await api.updatePortfolio(id, fields)
      setCollection(updated)
      addToast('success', 'Collection updated')
    } catch (err) {
      addToast('error', 'Failed to save changes', err.message)
    }
  }

  /* ── Delete Collection ── */
  const handleDeleteCollection = async () => {
    if (!window.confirm(`Delete "${collection.title}" and all its photos? This action cannot be undone.`)) return
    try {
      await api.deletePortfolio(id)
      addToast('success', 'Collection deleted')
      navigate(`${basePath}/portfolio`)
    } catch (err) {
      addToast('error', 'Failed to delete collection', err.message)
    }
  }

  if (loading || !collection) {
    return (
      <AppLayout title="Portfolio Collection">
        <div className="pd-loading-state">
          <div className="pd-spinner" />
          <p>Loading collection…</p>
        </div>
      </AppLayout>
    )
  }

  const images = collection.images || []

  return (
    <AppLayout title={collection.title}>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Caption Modal */}
      {editingCaptionImage && (
        <CaptionModal
          image={editingCaptionImage}
          onClose={() => setEditingCaptionImage(null)}
          onSave={handleSaveCaption}
        />
      )}

      {/* Edit Collection Modal */}
      {showEditModal && (
        <EditCollectionModal
          collection={collection}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveMeta}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to={`${basePath}/portfolio`}>Portfolio</Link>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">{collection.title}</span>
      </nav>


      {/* Collection Header */}
      <header className="pd-detail-header">
        <div className="pd-detail-header-main">
          <div className="pd-detail-meta-strip">
            <span className="pd-collection-category">{collection.category}</span>
            <span className={`pd-pub-badge ${collection.isPublished ? 'pd-pub-badge--live' : ''}`}>
              {collection.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="pd-detail-count">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="pd-detail-title">{collection.title}</h1>
          {collection.description && <p className="pd-detail-desc">{collection.description}</p>}
        </div>

        <div className="pd-detail-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
          />
          <button
            className="pd-btn pd-btn--primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Icon name="upload" size={16} />
            {uploading ? 'Uploading…' : 'Upload Photos'}
          </button>
          <button className="pd-btn pd-btn--outline" onClick={handleTogglePublish}>
            {collection.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button className="pd-btn pd-btn--ghost" onClick={() => setShowEditModal(true)}>
            <Icon name="edit" size={15} /> Edit Details
          </button>
          <button className="pd-btn pd-btn--ghost pd-btn--danger-text" onClick={handleDeleteCollection}>
            <Icon name="trash" size={15} />
          </button>
        </div>
      </header>

      {/* Upload Dropzone banner when uploading */}
      {uploading && (
        <div className="pd-upload-banner">
          <div className="pd-spinner pd-spinner--sm" />
          <span>Processing and uploading high-resolution photos…</span>
        </div>
      )}

      {/* Photos Grid */}
      {images.length === 0 ? (
        <div className="pd-empty-gallery">
          <div className="pd-empty-gallery-icon">
            <Icon name="camera" size={48} />
          </div>
          <h3>No photographs in this collection yet</h3>
          <p>Add your best shots to showcase your skills and impress potential clients.</p>
          <button
            className="pd-btn pd-btn--primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Icon name="upload" size={16} /> Upload First Photos
          </button>
        </div>
      ) : (
        <div className="pd-photo-gallery">
          {images.map((img, idx) => {
            const isCover = collection.coverImageUrl === img.url
            return (
              <div key={img._id || idx} className="pd-photo-card">
                <div className="pd-photo-thumb" onClick={() => setLightboxIndex(idx)}>
                  <img src={img.url} alt={img.caption || `Photo ${idx + 1}`} loading="lazy" />
                  {isCover && <span className="pd-cover-tag">Cover Photo</span>}
                  <div className="pd-photo-overlay">
                    <span className="pd-photo-zoom-hint">Click to enlarge</span>
                  </div>
                </div>

                <div className="pd-photo-info">
                  <span className="pd-photo-caption" title={img.caption || 'No caption'}>
                    {img.caption || <em>Untitled</em>}
                  </span>
                  <div className="pd-photo-tools">
                    <button
                      className="pd-photo-tool-btn"
                      onClick={() => setEditingCaptionImage(img)}
                      title="Edit caption"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    {!isCover && (
                      <button
                        className="pd-photo-tool-btn"
                        onClick={() => handleSetCover(img.url)}
                        title="Set as Cover"
                      >
                        <Icon name="check" size={14} />
                      </button>
                    )}
                    <button
                      className="pd-photo-tool-btn pd-photo-tool-btn--danger"
                      onClick={() => handleDeleteImage(img._id)}
                      title="Delete photo"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}
