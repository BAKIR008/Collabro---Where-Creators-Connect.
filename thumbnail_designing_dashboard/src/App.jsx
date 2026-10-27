import { useMemo, useRef, useState } from 'react'
import './App.css'

const thumbnailSeed = [
  {
    id: 'thumb-1',
    title: 'I Tried Living Offline',
    category: 'YouTube',
    status: 'In progress',
    image: 'photo-1519608487953-e999c86e7455',
    collaborators: ['Maya Chen', 'Leo Park'],
    need: 'Illustrator',
    description: 'A bold, cinematic cover for a 30-day digital detox story.',
    colors: ['#ffd52e', '#7b38ff'],
  },
  {
    id: 'thumb-2',
    title: 'The $10 Pasta Challenge',
    category: 'Food & drink',
    status: 'Open',
    image: 'photo-1473093295043-cdd812d0e601',
    collaborators: ['Noah Williams'],
    need: 'Photo editor',
    description: 'Playful food photography and punchy hand-lettered type.',
    colors: ['#ff3d9a', '#ffd52e'],
  },
  {
    id: 'thumb-3',
    title: 'Build Your First Portfolio',
    category: 'Education',
    status: 'Open',
    image: 'photo-1499951360447-b19be8fe80f5',
    collaborators: ['Ava Patel', 'Kai Morgan'],
    need: 'Graphic designer',
    description: 'A clean, high-contrast tutorial thumbnail built for clarity.',
    colors: ['#45d7ff', '#7b38ff'],
  },
  {
    id: 'thumb-4',
    title: 'A Weekend in Kyoto',
    category: 'Travel',
    status: 'Open',
    image: 'photo-1493976040374-85c8e12f0c0e',
    collaborators: ['Ella Brooks'],
    need: 'Title designer',
    description: 'Warm travel visuals with a little film grain and nostalgia.',
    colors: ['#ffb15c', '#ff3d9a'],
  },
]

const creators = [
  { name: 'Maya Chen', role: 'Thumbnail illustrator', tags: ['Illustration', 'YouTube'], projects: 12, rating: '4.9', image: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Leo Park', role: 'Photo compositor', tags: ['Photoshop', 'Gaming'], projects: 8, rating: '4.8', image: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ava Patel', role: 'Graphic designer', tags: ['Typography', 'Lifestyle'], projects: 15, rating: '5.0', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Kai Morgan', role: 'Creative director', tags: ['Branding', 'Video'], projects: 10, rating: '4.9', image: 'photo-1506794778202-cad84cf45f1d' },
]

const imageUrl = (id, width = 640) =>
  id.startsWith('blob:') || id.startsWith('data:')
    ? id
    : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

function Icon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    discover: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M11 8l-1 4 4-1" /></>,
    projects: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M8 5V3h8v2M3 10h18" /></>,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    community: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" /></>,
    camera: <><path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3Z" /><circle cx="12" cy="13" r="3.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 15 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M4 16v4h16v-4" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    chevron: <><path d="m7 10 5 5 5-5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    star: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function Toast({ toast, onClose }) {
  if (!toast) return null
  return (
    <div className="thumb-toast" role="status">
      <span className="thumb-toast-mark"><Icon name="check" size={15} /></span>
      <div><strong>{toast.title}</strong><p>{toast.message}</p></div>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}><Icon name="close" size={15} /></button>
    </div>
  )
}

export default function App() {
  const [thumbnails, setThumbnails] = useState(thumbnailSeed)
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [joined, setJoined] = useState([])
  const [selectedId, setSelectedId] = useState(thumbnailSeed[0].id)
  const [studioTab, setStudioTab] = useState('Moodboard')
  const [studioDrafts, setStudioDrafts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('collabro-thumbnail-studio-notes') || '{}')
    } catch (error) {
      console.error('Could not load thumbnail studio drafts.', error)
      return {}
    }
  })
  const [studioText, setStudioText] = useState(() => {
    try {
      const drafts = JSON.parse(localStorage.getItem('collabro-thumbnail-studio-notes') || '{}')
      return drafts[thumbnailSeed[0].id] || ''
    } catch {
      return ''
    }
  })
  const [selectedLayout, setSelectedLayout] = useState('Big subject')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('YouTube')
  const [newDescription, setNewDescription] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [creatorRequests, setCreatorRequests] = useState([])
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('collabro-thumbnail-name') || 'Jordan Lee')
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileDraft, setProfileDraft] = useState(displayName)
  const [toast, setToast] = useState(null)
  const uploadInput = useRef(null)

  const selectedThumbnail = thumbnails.find((item) => item.id === selectedId) || thumbnails[0]
  const filteredThumbnails = useMemo(() => {
    const term = query.trim().toLowerCase()
    return thumbnails.filter((item) =>
      !term || `${item.title} ${item.category} ${item.status} ${item.need}`.toLowerCase().includes(term),
    )
  }, [query, thumbnails])
  const filteredCreators = useMemo(() => {
    const term = query.trim().toLowerCase()
    return creators.filter((creator) =>
      !term || `${creator.name} ${creator.role} ${creator.tags.join(' ')}`.toLowerCase().includes(term),
    )
  }, [query])

  const showToast = (title, message) => {
    setToast({ title, message })
    window.setTimeout(() => setToast(null), 3200)
  }

  const createThumbnail = (event) => {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    const item = {
      id: `thumb-${Date.now()}`,
      title,
      category: newCategory,
      status: 'In progress',
      image: 'photo-1492619375914-88005aa9e8fb',
      collaborators: [],
      need: 'Find a creative partner',
      description: newDescription.trim() || 'A new thumbnail concept ready to take shape.',
      colors: ['#ffd52e', '#7b38ff'],
    }
    setThumbnails((current) => [item, ...current])
    setSelectedId(item.id)
    setStudioText('')
    setSelectedLayout('Big subject')
    setNewTitle('')
    setNewDescription('')
    setCreateOpen(false)
    showToast('Thumbnail started', `${title} is ready in your workspace.`)
    window.setTimeout(() => document.getElementById('thumbnails')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const uploadThumbnail = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Unsupported file', 'Choose an image to add it to your thumbnail workspace.')
      return
    }
    const item = {
      id: `upload-${Date.now()}`,
      title: file.name.replace(/\.[^.]+$/, ''),
      category: 'New upload',
      status: 'Just added',
      image: URL.createObjectURL(file),
      collaborators: [],
      need: 'Add project details',
      description: 'An uploaded image, ready for your next thumbnail concept.',
      colors: ['#45d7ff', '#7b38ff'],
    }
    setThumbnails((current) => [item, ...current])
    setSelectedId(item.id)
    setStudioText('')
    setSelectedLayout('Big subject')
    showToast('Image uploaded', `${file.name} was added to your workspace.`)
  }

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const saveStudio = () => {
    try {
      const next = { ...studioDrafts, [selectedId]: studioText }
      localStorage.setItem('collabro-thumbnail-studio-notes', JSON.stringify(next))
      setStudioDrafts(next)
      showToast('Studio saved', `Your ${studioTab.toLowerCase()} notes for “${selectedThumbnail.title}” are saved.`)
    } catch (error) {
      console.error('Could not save thumbnail studio notes.', error)
      showToast('Could not save', 'Browser storage is unavailable. Please try again.')
    }
  }

  const selectThumbnail = (id) => {
    setSelectedId(id)
    setStudioText(studioDrafts[id] || '')
    setSelectedLayout('Big subject')
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const nextName = profileDraft.trim()
    if (!nextName) return
    try {
      localStorage.setItem('collabro-thumbnail-name', nextName)
      setDisplayName(nextName)
      setEditProfileOpen(false)
      showToast('Profile updated', 'Your display name has been saved.')
    } catch (error) {
      console.error('Could not save profile name.', error)
      showToast('Could not save profile', 'Browser storage is unavailable. Please try again.')
    }
  }

  const toggleJoin = (id) => {
    const hasJoined = joined.includes(id)
    setJoined((current) => hasJoined ? current.filter((item) => item !== id) : [...current, id])
    showToast(hasJoined ? 'Interest removed' : 'Interest saved', hasJoined ? 'Your interest was removed from this session.' : 'Your project interest is saved for this session.')
  }

  const toggleCreatorRequest = (name) => {
    const requested = creatorRequests.includes(name)
    setCreatorRequests((current) => requested ? current.filter((item) => item !== name) : [...current, name])
    showToast(requested ? 'Interest removed' : 'Interest saved', requested ? `Your interest in collaborating with ${name} was removed.` : `Your interest in collaborating with ${name} is saved for this session.`)
  }

  const openSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="thumb-dashboard" id="home">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <header className="thumb-topbar">
        <a className="thumb-brand" href="#home" aria-label="CollaBro home">
          <span className="thumb-brand-name">COLLAB<span>R</span>O</span>
          <span className="thumb-brand-tag">THE CREATORS HUB</span>
        </a>
        <label className="thumb-search">
          <Icon name="discover" size={17} />
          <input type="search" placeholder="Search thumbnails, creators, styles..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search thumbnails and creators" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="thumb-account">
          <div className="thumb-popover-wrap">
            <button className={`thumb-icon-button ${notificationsOpen ? 'is-open' : ''}`} type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }}>
              <Icon name="bell" size={19} /><span className="thumb-notification-dot" />
            </button>
            {notificationsOpen && <div className="thumb-popover thumb-notifications"><strong>YOU’RE ALL CAUGHT UP</strong><p>New project invitations and creator activity will show up here.</p><button type="button" onClick={() => { setNotificationsOpen(false); openSection('thumbnails') }}>View thumbnail projects <Icon name="arrow" size={14} /></button></div>}
          </div>
          <div className="thumb-popover-wrap">
            <button className="thumb-profile-button" type="button" aria-expanded={profileOpen} onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}>
              <span className="thumb-profile-avatar">{displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><span>{displayName}</span><Icon name="chevron" size={14} />
            </button>
            {profileOpen && <div className="thumb-popover thumb-profile-menu"><strong>{displayName}</strong><span>Thumbnail designer · Creator profile</span><button type="button" onClick={() => { setProfileDraft(displayName); setEditProfileOpen(true); setProfileOpen(false) }}>Edit profile</button></div>}
          </div>
        </div>
      </header>

      <div className="thumb-layout">
        <aside className="thumb-sidebar">
          <nav aria-label="Main navigation">
            <a className="thumb-nav-item is-active" href="#home"><Icon name="home" /> Home</a>
            <button className="thumb-nav-item" type="button" onClick={() => openSection('creators')}><Icon name="discover" /> Discover</button>
            <button className="thumb-nav-item" type="button" onClick={() => openSection('thumbnails')}><Icon name="projects" /> My Thumbnails</button>
            <button className="thumb-nav-item" type="button" onClick={() => showToast('Messages', 'Your creator inbox is ready for its first conversation.')}><Icon name="message" /> Messages <span className="thumb-nav-count">2</span></button>
            <button className="thumb-nav-item" type="button" onClick={() => { setNotificationsOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="bell" /> Notifications</button>
            <button className="thumb-nav-item" type="button" onClick={() => openSection('creators')}><Icon name="community" /> Community</button>
          </nav>
          <div className="thumb-sidebar-note">
            <div className="thumb-sticker" aria-hidden="true"><span /><i /></div>
            <strong>GOOD IDEAS<br />DESERVE A<br />GREAT COVER.</strong>
            <span className="thumb-squiggle" aria-hidden="true">〰</span>
          </div>
          <div className="thumb-sidebar-footer"><span className="thumb-brand-name">COLLAB<span>R</span>O</span><small>The Creators Hub</small></div>
        </aside>

        <main className="thumb-main">
          <section className="thumb-hero">
            <div className="thumb-hero-copy">
              <div className="thumb-eyebrow"><span /> HEY {displayName.split(/\s+/)[0].toUpperCase()}, YOUR THUMBNAIL STUDIO</div>
              <h1>THINK.<br /><mark>CLICK.</mark><br /><i>STAND</i> OUT.</h1>
              <p>Make the first frame impossible to ignore. Build a bold visual, find your people, and turn a scroll into a story.</p>
              <button className="thumb-button thumb-button-yellow" type="button" onClick={() => setCreateOpen(true)}><Icon name="plus" size={17} /> START A DESIGN <Icon name="arrow" size={16} /></button>
              <div className="thumb-hero-badges" aria-label="Thumbnail categories"><span className="thumb-badge badge-purple"><Icon name="camera" size={14} /> YouTube</span><span className="thumb-badge badge-yellow"><Icon name="sparkle" size={14} /> Podcast</span><span className="thumb-badge badge-cyan"><Icon name="layers" size={14} /> Social</span></div>
            </div>
            <div className="thumb-hero-art">
              <div className="thumb-hero-image thumb-hero-image-back"><img src={imageUrl('photo-1519608487953-e999c86e7455', 720)} alt="Moody night sky as inspiration for a video thumbnail" /><span className="thumb-frame-tag">FRAME 001 · 16:9</span><span className="thumb-image-copy">THE<br />UNKNOWN</span></div>
              <div className="thumb-hero-image thumb-hero-image-front"><img src={imageUrl('photo-1518837695005-2083093ee35b', 520)} alt="Dramatic ocean wave thumbnail artwork" /><span className="thumb-live"><i /> DESIGN IN PROGRESS</span><span className="thumb-image-stamp">MAKE<br />THEM<br />LOOK.</span></div>
              <div className="thumb-collab-note"><span className="thumb-avatar-stack">{creators.slice(0, 3).map((creator) => <img key={creator.name} src={imageUrl(creator.image, 60)} alt="" />)}</span><span><b>4 creators</b><small>making the scroll stop</small></span><Icon name="sparkle" size={20} /></div>
              <span className="thumb-doodle thumb-doodle-one" aria-hidden="true">✳</span><span className="thumb-doodle thumb-doodle-two" aria-hidden="true">✦</span>
            </div>
          </section>

          <div className="thumb-section-heading" id="thumbnails">
            <div><span className="thumb-eyebrow">YOUR LATEST WORK</span><h2>Featured thumbnails</h2></div>
            <button className="thumb-text-link" type="button" onClick={() => setCreateOpen(true)}>Start a design <Icon name="arrow" size={15} /></button>
          </div>
          <section className="thumb-project-grid" aria-label="Featured thumbnail projects">
            {filteredThumbnails.length ? filteredThumbnails.map((item) => (
              <article className={`thumb-project-card ${selectedId === item.id ? 'is-selected' : ''}`} key={item.id}>
                <button className="thumb-project-image" type="button" onClick={() => { selectThumbnail(item.id); openSection('studio') }} aria-label={`Open ${item.title} in studio`}>
                  <img src={imageUrl(item.image)} alt={`Thumbnail artwork for ${item.title}`} loading="lazy" />
                  <span className={`thumb-project-type type-${item.category.toLowerCase().replace(/\W+/g, '-')}`}>{item.category}</span>
                  <span className="thumb-art-title">{item.title}</span>
                  <span className="thumb-art-play">▶</span>
                </button>
                <div className="thumb-project-info">
                  <div className="thumb-project-title"><h3>{item.title}</h3><span className={item.status === 'In progress' ? 'status-purple' : 'status-green'}>{item.status}</span></div>
                  <p>Looking for: <b>{item.need}</b></p>
                  <div className="thumb-project-footer">
                    <span className="thumb-mini-avatars">{item.collaborators.length ? item.collaborators.map((name, index) => <img key={name} src={imageUrl(creators[index % creators.length].image, 48)} alt="" />) : <span className="thumb-avatar-empty"><Icon name="plus" size={11} /></span>}</span>
                    <div className="thumb-project-actions">
                      <button type="button" className={`thumb-save-button ${favorites.includes(item.id) ? 'is-saved' : ''}`} aria-label={`${favorites.includes(item.id) ? 'Unsave' : 'Save'} ${item.title}`} onClick={() => toggleFavorite(item.id)}><Icon name="heart" size={14} /></button>
                      <button type="button" onClick={() => toggleJoin(item.id)}>{joined.includes(item.id) ? 'Request sent' : 'Join project'} <Icon name="arrow" size={13} /></button>
                    </div>
                  </div>
                </div>
              </article>
            )) : <div className="thumb-empty-state">No thumbnail projects match “{query}”. Try a different search.</div>}
          </section>

          <div className="thumb-section-heading thumb-creators-heading" id="creators">
            <div><span className="thumb-eyebrow">PEOPLE TO MAKE THINGS WITH</span><h2>Creators to know</h2></div>
            <button className="thumb-text-link" type="button" onClick={() => setQuery('')}>Meet the community <Icon name="arrow" size={15} /></button>
          </div>
          <section className="thumb-creator-grid" aria-label="Thumbnail creators">
            {filteredCreators.length ? filteredCreators.map((creator) => (
              <article className="thumb-creator-card" key={creator.name}>
                <div className="thumb-creator-top"><img src={imageUrl(creator.image, 120)} alt={creator.name} /><span className="thumb-creator-presence" /><button type="button" className={favorites.includes(creator.name) ? 'is-saved' : ''} onClick={() => toggleFavorite(creator.name)} aria-label={`Save ${creator.name}`}><Icon name="heart" size={13} /></button></div>
                <h3>{creator.name}</h3><p>{creator.role}</p>
                <div className="thumb-creator-tags">{creator.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="thumb-creator-stats"><span><Icon name="projects" size={12} /> {creator.projects} designs</span><span>★ {creator.rating}</span></div>
                <button className="thumb-creator-connect" type="button" aria-pressed={creatorRequests.includes(creator.name)} onClick={() => toggleCreatorRequest(creator.name)}><Icon name={creatorRequests.includes(creator.name) ? 'check' : 'community'} size={13} />{creatorRequests.includes(creator.name) ? 'REQUEST SENT' : 'COLLABORATE'}</button>
              </article>
            )) : <div className="thumb-empty-state">No creators match “{query}”. Try a different search.</div>}
          </section>

          <section className="thumb-bottom-banner">
            <span className="thumb-eyebrow">BIG IDEAS START WITH A SINGLE FRAME</span>
            <h2>MAKE THEM<br />STOP THE <mark>SCROLL.</mark></h2>
            <button className="thumb-button thumb-button-yellow" type="button" onClick={() => setCreateOpen(true)}>CREATE A THUMBNAIL <Icon name="arrow" size={16} /></button>
            <span className="thumb-banner-spark" aria-hidden="true">✳</span>
          </section>
          <footer className="thumb-footer">Made for the makers behind the first impression. <span>COLLABRO © {new Date().getFullYear()}</span></footer>
        </main>

        <aside className="thumb-right-rail">
          <section className="thumb-quick-actions">
            <div className="thumb-rail-title"><h2>QUICK ACTIONS</h2><Icon name="sparkle" size={18} /></div>
            <button className="thumb-action-primary" type="button" onClick={() => setCreateOpen(true)}><Icon name="plus" /> Create a thumbnail <Icon name="arrow" size={15} /></button>
            <button type="button" onClick={() => uploadInput.current?.click()}><Icon name="upload" /> Upload an image <Icon name="arrow" size={15} /></button>
            <button type="button" onClick={() => openSection('creators')}><Icon name="community" /> Find collaborators <Icon name="arrow" size={15} /></button>
            <button type="button" onClick={() => { setQuery('YouTube'); openSection('thumbnails'); showToast('Trending format', 'Showing YouTube thumbnail concepts to explore.') }}><Icon name="sparkle" /> Explore trends <Icon name="arrow" size={15} /></button>
            <input ref={uploadInput} className="thumb-visually-hidden" type="file" accept="image/*" onChange={uploadThumbnail} aria-label="Upload thumbnail image" />
          </section>

          <section className="thumb-studio-panel" id="studio">
            <div className="thumb-studio-header"><h2>THUMBNAIL STUDIO</h2><span>● READY</span></div>
            <label className="thumb-project-select">CURRENT PROJECT
              <select value={selectedId} onChange={(event) => selectThumbnail(event.target.value)} aria-label="Current thumbnail project">
                {thumbnails.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </label>
            <div className="thumb-studio-tabs" role="tablist" aria-label="Thumbnail studio tools">
              {['Moodboard', 'Layouts', 'Notes'].map((tab) => <button key={tab} type="button" className={studioTab === tab ? 'selected' : ''} role="tab" aria-selected={studioTab === tab} onClick={() => setStudioTab(tab)}><Icon name={tab === 'Moodboard' ? 'camera' : tab === 'Layouts' ? 'layers' : 'message'} size={14} />{tab}</button>)}
            </div>
            {studioTab === 'Moodboard' ? (
              <div className="thumb-moodboard">
                <img src={imageUrl(selectedThumbnail.image, 500)} alt={`Moodboard reference for ${selectedThumbnail.title}`} />
                <div><b>VISUAL DIRECTION · 01</b><p>{selectedThumbnail.description}</p></div>
              </div>
            ) : studioTab === 'Layouts' ? (
              <div className="thumb-layout-options">
                {[
                  { name: 'Big subject', preview: 'layout-focus' },
                  { name: 'Split frame', preview: 'layout-split' },
                  { name: 'Type first', preview: 'layout-type' },
                ].map((layout) => (
                  <button type="button" className={`layout-choice ${selectedLayout === layout.name ? 'selected' : ''}`} key={layout.name} onClick={() => setSelectedLayout(layout.name)} aria-pressed={selectedLayout === layout.name}>
                    <span className={`layout-preview ${layout.preview}`} />{layout.name}<Icon name={selectedLayout === layout.name ? 'check' : 'arrow'} size={12} />
                  </button>
                ))}
              </div>
            ) : (
              <label className="thumb-notes-field"><span>DESIGN NOTES</span><textarea value={studioText} onChange={(event) => setStudioText(event.target.value)} placeholder="Colors, headline ideas, visual references..." rows="5" /></label>
            )}
            {studioTab !== 'Notes' && <div className="thumb-studio-note"><Icon name="sparkle" size={15} /><span>Keep your headline short, bold, and easy to read at a glance.</span></div>}
            <div className="thumb-studio-footer"><button type="button" onClick={saveStudio}>Save draft</button><button type="button" onClick={() => setPreviewOpen(true)}><Icon name="eye" size={13} /> Preview</button></div>
          </section>

          <section className="thumb-weekly-card">
            <span className="thumb-weekly-icon"><Icon name="layers" size={17} /></span>
            <span className="thumb-eyebrow">YOUR WEEK IN THUMBNAILS</span>
            <strong>{(thumbnails.length * 12 + 48).toLocaleString()}</strong>
            <p>creative impressions this week</p>
            <div className="thumb-weekly-chart" aria-label="Weekly design activity">{[28, 45, 38, 62, 52, 72, 58, 86, 68, 100, 82, 94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
            <span className="thumb-weekly-growth">↗ 18% from last week</span>
          </section>
        </aside>
      </div>

      {createOpen && <div className="thumb-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false) }}>
        <form className="thumb-project-modal" onSubmit={createThumbnail} role="dialog" aria-modal="true" aria-labelledby="new-thumbnail-title">
          <button type="button" className="thumb-modal-close" aria-label="Close" onClick={() => setCreateOpen(false)}><Icon name="close" size={19} /></button>
          <span className="thumb-eyebrow"><span /> MAKE ROOM FOR A NEW IDEA</span>
          <h2 id="new-thumbnail-title">Start a thumbnail</h2>
          <p>Give your next big visual a title and a place to grow.</p>
          <label htmlFor="thumbnail-name">PROJECT NAME</label>
          <input id="thumbnail-name" autoFocus maxLength={60} placeholder="e.g. I Tried Living Offline" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required />
          <label htmlFor="thumbnail-category">FORMAT</label>
          <select id="thumbnail-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)}><option>YouTube</option><option>Podcast</option><option>Gaming</option><option>Social</option><option>Education</option><option>Travel</option></select>
          <label htmlFor="thumbnail-description">CREATIVE BRIEF</label>
          <textarea id="thumbnail-description" maxLength={220} placeholder="What should viewers feel or notice first?" value={newDescription} onChange={(event) => setNewDescription(event.target.value)} />
          <button type="submit" className="thumb-button thumb-button-yellow">CREATE THUMBNAIL <Icon name="arrow" size={16} /></button>
        </form>
      </div>}

      {editProfileOpen && <div className="thumb-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditProfileOpen(false) }}>
        <form className="thumb-project-modal thumb-profile-modal" onSubmit={saveProfile} role="dialog" aria-modal="true" aria-labelledby="profile-title">
          <button type="button" className="thumb-modal-close" aria-label="Close" onClick={() => setEditProfileOpen(false)}><Icon name="close" size={19} /></button>
          <span className="thumb-eyebrow"><span /> CREATOR PROFILE</span><h2 id="profile-title">Edit your name</h2><p>Your name appears in your thumbnail workspace.</p>
          <label htmlFor="profile-name">DISPLAY NAME</label><input id="profile-name" maxLength={60} value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} required />
          <button type="submit" className="thumb-button thumb-button-yellow">SAVE PROFILE <Icon name="check" size={16} /></button>
        </form>
      </div>}

      {previewOpen && <div className="thumb-modal-backdrop thumb-preview-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false) }}>
        <section className="thumb-preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="thumb-preview-heading"><div><span className="thumb-eyebrow">16:9 THUMBNAIL PREVIEW · {selectedLayout.toUpperCase()}</span><h2 id="preview-title">{selectedThumbnail.title}</h2></div><button type="button" className="thumb-modal-close" aria-label="Close preview" onClick={() => setPreviewOpen(false)}><Icon name="close" size={19} /></button></div>
          <div className={`thumb-preview-art preview-${selectedLayout.toLowerCase().replace(' ', '-')}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(10,10,10,.02), rgba(10,10,10,.56)), url("${imageUrl(selectedThumbnail.image, 1200)}")` }}>
            <span>{selectedThumbnail.category}</span><strong>{selectedThumbnail.title}</strong><i>▶</i>
          </div>
          <p>Selected layout: <b>{selectedLayout}</b>. Choose another layout in the studio to compare the composition.</p>
        </section>
      </div>}
    </div>
  )
}
