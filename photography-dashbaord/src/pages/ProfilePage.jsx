import { useEffect, useRef, useState } from 'react'
import AppLayout, { Icon, useToast } from '../components/AppLayout.jsx'
import { api, PHOTOGRAPHY_CATEGORIES } from '../api.js'

function formatProfileValue(value) {
  const values = Array.isArray(value) ? value : [value]
  const formatted = values
    .filter(Boolean)
    .map((item) => String(item).replace(/[-_]/g, ' '))
  return formatted.length ? formatted.join(', ') : 'Not provided'
}

function ProfileDetail({ label, value }) {
  return (
    <div className="pd-form-col">
      <span className="pd-label">{label}</span>
      <p>{formatProfileValue(value)}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { addToast } = useToast()
  const avatarInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    name: '',
    displayName: '',
    profileTitle: '',
    bio: '',
    experienceLevel: 'intermediate',
    skills: [],
    tools: [],
  })

  const [newGearInput, setNewGearInput] = useState('')

  const loadProfile = async () => {
    try {
      const data = await api.getProfile()
      setProfile(data)
      setForm({
        name: data.name || '',
        displayName: data.displayName || data.name || '',
        profileTitle: data.profileTitle || '',
        bio: data.bio || '',
        experienceLevel: data.experienceLevel || 'intermediate',
        skills: data.skills || [],
        tools: data.tools || [],
      })
    } catch (err) {
      addToast('error', 'Failed to load profile', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  /* ── Avatar Upload ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('picture', file)

    setUploadingAvatar(true)
    try {
      const res = await api.uploadAvatar(formData)
      setProfile((prev) => ({ ...prev, profilePicture: res.profilePicture }))
      addToast('success', 'Profile photo updated')
    } catch (err) {
      addToast('error', 'Avatar upload failed', err.message)
    } finally {
      setUploadingAvatar(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  /* ── Toggle Specialization Skill ── */
  const toggleSkill = (cat) => {
    setForm((prev) => {
      const exists = prev.skills.includes(cat)
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== cat) : [...prev.skills, cat],
      }
    })
  }

  /* ── Add Gear Item ── */
  const addGear = (e) => {
    e.preventDefault()
    const item = newGearInput.trim()
    if (!item) return
    if (form.tools.includes(item)) {
      setNewGearInput('')
      return
    }
    setForm((prev) => ({ ...prev, tools: [...prev.tools, item] }))
    setNewGearInput('')
  }

  /* ── Remove Gear Item ── */
  const removeGear = (idx) => {
    setForm((prev) => ({ ...prev, tools: prev.tools.filter((_, i) => i !== idx) }))
  }

  /* ── Save Profile ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.updateProfile(form)
      setProfile(updated)
      addToast('success', 'Profile saved', 'Your photography creator profile has been updated.')
    } catch (err) {
      addToast('error', 'Failed to save profile', err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout title="Photographer Profile">
        <div className="pd-loading-state">
          <div className="pd-spinner" />
          <p>Loading profile…</p>
        </div>
      </AppLayout>
    )
  }

  const avatarSrc = profile?.profilePicture || null
  const initials = (form.displayName || form.name || 'P')[0]?.toUpperCase()

  return (
    <AppLayout title="Photographer Profile">
      <div className="pd-page-header">
        <div>
          <h1 className="pd-page-title">Photographer Profile</h1>
          <p className="pd-page-sub">
            Customize your professional bio, camera gear setup, specialties, and client presentation.
          </p>
        </div>
      </div>

      <form className="pd-profile-form" onSubmit={handleSubmit}>
        {/* Avatar Card */}
        <section className="pd-profile-card">
          <div className="pd-profile-avatar-row">
            <div className="pd-profile-avatar-large-wrap">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="pd-profile-avatar-large" />
              ) : (
                <div className="pd-profile-avatar-large pd-avatar--fallback">{initials}</div>
              )}
            </div>

            <div className="pd-avatar-upload-info">
              <h3>Profile Picture</h3>
              <p>Supports PNG, JPG, or WEBP up to 5MB. Visible on project contracts and portfolio.</p>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/png,image/jpeg,image/webp,image/gif"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="pd-btn pd-btn--outline"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                <Icon name="upload" size={15} />
                {uploadingAvatar ? 'Uploading…' : 'Change Photo'}
              </button>
            </div>
          </div>
        </section>

        {/* General Info */}
        <section className="pd-profile-card">
          <h3 className="pd-card-section-title">General Information</h3>

          <div className="pd-form-grid">
            <div className="pd-form-col">
              <label className="pd-label" htmlFor="prof-name">FULL LEGAL NAME</label>
              <input
                id="prof-name"
                className="pd-input"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="pd-form-col">
              <label className="pd-label" htmlFor="prof-dname">STUDIO / DISPLAY NAME</label>
              <input
                id="prof-dname"
                className="pd-input"
                maxLength={100}
                placeholder="e.g. Elena Vance Photography"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              />
            </div>

            <div className="pd-form-col">
              <label className="pd-label" htmlFor="prof-email">ACCOUNT EMAIL</label>
              <input
                id="prof-email"
                className="pd-input pd-input--readonly"
                readOnly
                value={profile?.email || ''}
              />
            </div>

            <div className="pd-form-col">
              <label className="pd-label" htmlFor="prof-headline">HEADLINE / TITLE</label>
              <input
                id="prof-headline"
                className="pd-input"
                maxLength={100}
                placeholder="e.g. Editorial & Commercial Fashion Photographer"
                value={form.profileTitle}
                onChange={(e) => setForm((f) => ({ ...f, profileTitle: e.target.value }))}
              />
            </div>
          </div>

          <label className="pd-label" htmlFor="prof-bio">PHOTOGRAPHER BIO & ARTISTIC STATEMENT</label>
          <textarea
            id="prof-bio"
            className="pd-textarea"
            rows={4}
            maxLength={500}
            placeholder="Tell clients about your visual style, creative philosophy, and experience..."
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
          <span className="pd-char-count">{form.bio.length}/500</span>

          <label className="pd-label" htmlFor="prof-exp">EXPERIENCE LEVEL</label>
          <select
            id="prof-exp"
            className="pd-select"
            value={form.experienceLevel}
            onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
          >
            <option value="beginner">Beginner (1–2 years)</option>
            <option value="intermediate">Intermediate (3–5 years)</option>
            <option value="advanced">Advanced (5–8 years)</option>
            <option value="expert">Expert (8+ years)</option>
          </select>
        </section>

        {/* Onboarding profile details */}
        <section className="pd-profile-card">
          <h3 className="pd-card-section-title">Your Creator Profile</h3>
          <p className="pd-card-section-sub">Details saved from your CollaBro onboarding survey.</p>
          <div className="pd-form-grid">
            <ProfileDetail label="ACCOUNT TYPE" value={profile?.accountType} />
            <ProfileDetail label="CREATOR ROLE" value={profile?.primaryRole} />
            <ProfileDetail label="INTERESTS" value={profile?.interests} />
            <ProfileDetail label="GOALS" value={profile?.goals} />
            <ProfileDetail
              label="WORK PREFERENCES"
              value={[
                ...(profile?.workPreferences?.categories || []),
                ...(profile?.workPreferences?.industries || []),
                ...(profile?.workPreferences?.style || []),
              ]}
            />
            <ProfileDetail
              label="COLLABORATION PREFERENCES"
              value={[
                ...(profile?.collaborationPreferences?.creatorRoles || []),
                ...(profile?.collaborationPreferences?.projectTypes || []),
                profile?.collaborationPreferences?.duration,
                profile?.collaborationPreferences?.workMode,
              ]}
            />
          </div>
        </section>

        {/* Photography Specialties */}
        <section className="pd-profile-card">
          <h3 className="pd-card-section-title">Specialties & Genres</h3>
          <p className="pd-card-section-sub">Select the photography genres that represent your primary client offerings.</p>
          <div className="pd-chips-container">
            {[...new Set([...PHOTOGRAPHY_CATEGORIES, ...form.skills])].map((cat) => {
              const selected = form.skills.includes(cat)
              return (
                <button
                  type="button"
                  key={cat}
                  className={`pd-chip ${selected ? 'pd-chip--selected' : ''}`}
                  onClick={() => toggleSkill(cat)}
                >
                  {cat}
                  {selected && <Icon name="check" size={13} />}
                </button>
              )
            })}
          </div>
        </section>

        {/* Gear & Equipment */}
        <section className="pd-profile-card">
          <h3 className="pd-card-section-title">Camera Gear & Equipment</h3>
          <p className="pd-card-section-sub">List your camera bodies, lenses, lighting kits, and accessories.</p>

          <div className="pd-gear-input-row">
            <input
              type="text"
              className="pd-input"
              placeholder="e.g. Sony A7 IV, 24-70mm f/2.8 GM II, Profoto B10X…"
              value={newGearInput}
              onChange={(e) => setNewGearInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGear(e) } }}
            />
            <button type="button" className="pd-btn pd-btn--outline" onClick={addGear}>
              <Icon name="plus" size={15} /> Add Gear
            </button>
          </div>

          <div className="pd-gear-tags-list">
            {form.tools.length === 0 ? (
              <span className="pd-no-gear-hint">No equipment listed yet. Add your gear to build client confidence.</span>
            ) : (
              form.tools.map((item, idx) => (
                <div key={idx} className="pd-gear-tag">
                  <Icon name="camera" size={13} />
                  <span>{item}</span>
                  <button type="button" onClick={() => removeGear(idx)} aria-label={`Remove ${item}`}>
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Submit Action */}
        <div className="pd-profile-save-bar">
          <button type="submit" className="pd-btn pd-btn--primary" disabled={saving}>
            {saving ? 'Saving Changes…' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </AppLayout>
  )
}
