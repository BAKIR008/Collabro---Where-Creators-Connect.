import { useState } from 'react'
import { photoUrl } from './dashboardData.js'

function DialogFrame({ titleId, eyebrow, title, onClose, children, className = '' }) {
  return (
    <div className="photo-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`photo-project-modal photo-project-form ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="photo-modal-close" aria-label="Close dialog" onClick={onClose}>×</button>
        <span className="photo-eyebrow">{eyebrow}</span><h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  )
}

export function ProfileDialog({ user, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    creatorRole: user?.creatorRole || 'Photographer',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    skills: (user?.skills || []).join(', '),
    interests: (user?.interests || []).join(', '),
  })
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    onSave({
      ...form,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      interests: form.interests.split(',').map((item) => item.trim()).filter(Boolean),
    })
  }
  return (
    <div className="photo-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose() }}>
      <form className="photo-project-modal photo-project-form" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="profile-form-title">
        <button type="button" className="photo-modal-close" aria-label="Close profile editor" onClick={onClose} disabled={saving}>×</button>
        <span className="photo-eyebrow">YOUR CREATOR PROFILE</span><h2 id="profile-form-title">Edit profile</h2>
        <label htmlFor="profile-name">NAME *</label><input id="profile-name" required minLength={3} maxLength={50} value={form.name} onChange={(event) => change('name', event.target.value)} />
        <label htmlFor="profile-username">USERNAME</label><input id="profile-username" pattern="[A-Za-z0-9_]{3,30}" maxLength={30} value={form.username} onChange={(event) => change('username', event.target.value)} placeholder="letters, numbers, underscores" />
        <label htmlFor="profile-role">CREATOR ROLE</label><input id="profile-role" required minLength={2} maxLength={80} value={form.creatorRole} onChange={(event) => change('creatorRole', event.target.value)} />
        <label htmlFor="profile-bio">BIO</label><textarea id="profile-bio" rows={3} maxLength={500} value={form.bio} onChange={(event) => change('bio', event.target.value)} placeholder="A little about your creative work…" />
        <label htmlFor="profile-photo">PROFILE PHOTO URL</label><input id="profile-photo" type="url" value={form.profilePicture} onChange={(event) => change('profilePicture', event.target.value)} placeholder="https://…" />
        <label htmlFor="profile-skills">SKILLS · SEPARATE WITH COMMAS</label><input id="profile-skills" maxLength={500} value={form.skills} onChange={(event) => change('skills', event.target.value)} placeholder="Portraits, Lightroom, studio lighting" />
        <label htmlFor="profile-interests">INTERESTS · SEPARATE WITH COMMAS</label><input id="profile-interests" maxLength={500} value={form.interests} onChange={(event) => change('interests', event.target.value)} placeholder="Editorial, film, travel" />
        <button type="submit" className="photo-button photo-button-yellow" disabled={saving}>{saving ? 'SAVING…' : 'SAVE PROFILE'}</button>
      </form>
    </div>
  )
}

export function SettingsDialog({ settings, setSettings, onClose }) {
  return (
    <DialogFrame titleId="settings-title" eyebrow="YOUR PREFERENCES" title="Settings" onClose={onClose}>
      <label className="photo-setting-row"><input type="checkbox" checked={settings.emailUpdates} onChange={(event) => setSettings((current) => ({ ...current, emailUpdates: event.target.checked }))} /><span>Email updates <small>Saved in this browser. Email delivery is not connected.</small></span></label>
      <label className="photo-setting-row"><input type="checkbox" checked={settings.reduceMotion} onChange={(event) => setSettings((current) => ({ ...current, reduceMotion: event.target.checked }))} /><span>Reduce animations <small>Use fewer motion effects in the dashboard.</small></span></label>
      <p className="photo-muted">Account preferences are saved locally on this device.</p>
    </DialogFrame>
  )
}

export function MessagesDialog({ creator, messages, onSend, onClose }) {
  const [text, setText] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const message = text.trim()
    if (!message) return
    onSend(message)
    setText('')
  }
  return (
    <DialogFrame titleId="messages-title" eyebrow="CREATOR INBOX" title={creator ? `Message ${creator.name}` : 'Messages'} onClose={onClose}>
      <p className="photo-local-feature-note">Message drafts are saved in this browser. Live message delivery is not connected yet.</p>
      <div className="photo-message-list">{messages.length ? messages.map((message, index) => <p key={`${message.createdAt}-${index}`}><b>You</b> · {new Date(message.createdAt).toLocaleString()}<br />{message.text}</p>) : <p className="photo-muted">Your inbox is ready. Write a note to start a local draft.</p>}</div>
      <form className="photo-message-form" onSubmit={submit}><textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} maxLength={1000} placeholder={`Write to ${creator?.name || 'your collaborators'}…`} required /><button type="submit" className="photo-button photo-button-yellow">SAVE DRAFT</button></form>
    </DialogFrame>
  )
}

export function CreatorDialog({ creator, onClose, onConnect }) {
  if (!creator) return null
  return (
    <DialogFrame titleId="creator-title" eyebrow="CREATOR PROFILE" title={creator.name} onClose={onClose} className="photo-creator-profile-modal">
      <img src={photoUrl(creator.image, 240)} alt={`${creator.name}, ${creator.role}`} />
      <p>{creator.role}</p>
      <div className="photo-creator-tags">{creator.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <p>{creator.projects} collaborations · ★ {creator.rating}</p>
      <button className="photo-button photo-button-yellow" onClick={onConnect}>Connect with {creator.name}</button>
    </DialogFrame>
  )
}
