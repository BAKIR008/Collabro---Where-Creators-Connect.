import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomCursor from './components/CustomCursor.jsx'
import ToastContainer, { useToast } from './components/ToastSystem.jsx'
import './PhotographerDashboard.css'

const projectsSeed = [
  {
    title: 'Golden hour, unfiltered',
    type: 'Portrait',
    status: 'Open',
    image: 'photo-1534528741775-53994a69daeb',
    collaborators: ['Maya Chen', 'Leo Park'],
    need: 'Stylist + MUA',
  },
  {
    title: 'Somewhere in the city',
    type: 'Editorial',
    status: 'In progress',
    image: 'photo-1515886657613-9f3515b0c78f',
    collaborators: ['Noah Williams'],
    need: 'Art director',
  },
  {
    title: 'A little more wild',
    type: 'Nature',
    status: 'Open',
    image: 'photo-1470252649378-9c29740c9fa8',
    collaborators: ['Ava Patel', 'Kai Morgan'],
    need: 'Videographer',
  },
  {
    title: 'Sunday on film',
    type: 'Lifestyle',
    status: 'Open',
    image: 'photo-1529139574466-a303027c1d8b',
    collaborators: ['Ella Brooks'],
    need: 'Model + stylist',
  },
]

const creators = [
  { name: 'Maya Chen', role: 'Fashion stylist', tags: ['Editorial', 'Fashion'], projects: 12, rating: '4.9', image: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Leo Park', role: 'Videographer', tags: ['Film', 'Travel'], projects: 8, rating: '4.8', image: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ava Patel', role: 'Makeup artist', tags: ['Beauty', 'Portrait'], projects: 15, rating: '5.0', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Kai Morgan', role: 'Creative director', tags: ['Campaign', 'Art'], projects: 10, rating: '4.9', image: 'photo-1506794778202-cad84cf45f1d' },
]

const photoUrl = (id, width = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

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
  }

  return <svg {...common}>{paths[name] || paths.sparkle}</svg>
}

function PhotographerDashboard() {
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()
  const uploadInput = useRef(null)
  const [projects, setProjects] = useState(projectsSeed)
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('Portrait')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Photographer Dashboard — CollaBro'
    return () => { document.title = previousTitle }
  }, [])

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) return null
        if (!response.ok) throw new Error('We could not load your account details.')
        const data = await response.json()
        return data.user
      })
      .then((account) => {
        if (active && account) setUser(account)
      })
      .catch((error) => {
        if (active) addToast('warning', 'Profile unavailable', error.message, 5000)
      })

    return () => { active = false }
  }, [addToast])

  useEffect(() => {
    const markUnavailableImage = (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.target.classList.add('photo-image-unavailable')
      }
    }
    document.addEventListener('error', markUnavailableImage, true)
    return () => document.removeEventListener('error', markUnavailableImage, true)
  }, [])

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return projects
    return projects.filter((project) =>
      [project.title, project.type, project.status, project.need].some((value) => value.toLowerCase().includes(term))
    )
  }, [projects, query])

  const filteredCreators = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return creators
    return creators.filter((creator) =>
      [creator.name, creator.role, ...creator.tags].some((value) => value.toLowerCase().includes(term))
    )
  }, [query])

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Zinal'
  const profileName = user?.name || 'Zinal Agrawal'

  const createProject = (event) => {
    event.preventDefault()
    const title = projectName.trim()
    if (!title) return
    setProjects((current) => [{
      title,
      type: projectType,
      status: 'Open',
      image: 'photo-1492691527719-9d1e07e534b4',
      collaborators: [],
      need: 'Find your team',
    }, ...current])
    setProjectName('')
    setProjectModalOpen(false)
    addToast('success', 'Project created', `${title} is ready for collaborators.`)
  }

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Unsupported file', 'Choose an image file to add it to your portfolio.')
      event.target.value = ''
      return
    }
    const image = URL.createObjectURL(file)
    setProjects((current) => [{
      title: file.name.replace(/\.[^.]+$/, ''),
      type: 'New upload',
      status: 'Just added',
      image,
      collaborators: [],
      need: 'Add project details',
      isLocal: true,
    }, ...current])
    addToast('success', 'Photo uploaded', `${file.name} has been added to your portfolio.`)
    event.target.value = ''
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      if (!response.ok) throw new Error('Unable to log out. Please try again.')
      navigate('/login')
    } catch (error) {
      addToast('error', 'Sign-out failed', error.message)
    }
  }

  const openSection = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="photo-dashboard" id="dashboard">
      <CustomCursor />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="photo-topbar">
        <a className="photo-brand" href="#dashboard" aria-label="CollaBro home">
          <span className="photo-brand-name">COLLAB<span>R</span>O</span>
          <span className="photo-brand-tag">THE CREATORS HUB</span>
        </a>
        <label className="photo-search">
          <Icon name="discover" size={17} />
          <input
            type="search"
            placeholder="Search shoots, creators, projects..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search shoots, creators, and projects"
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="photo-account">
          <div className="photo-popover-wrap">
            <button
              className={`photo-icon-button ${notificationsOpen ? 'is-open' : ''}`}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }}
            >
              <Icon name="bell" size={19} />
              <span className="photo-notification-dot" />
            </button>
            {notificationsOpen && (
              <div className="photo-popover photo-notifications">
                <div className="photo-popover-heading">You’re all caught up <span>2 new</span></div>
                <p><b>Maya Chen</b> wants to join <em>Golden hour, unfiltered</em>.</p>
                <p><b>Leo Park</b> sent you a collaboration request.</p>
                <button onClick={() => { setNotificationsOpen(false); openSection('projects') }}>View project activity <Icon name="arrow" size={14} /></button>
              </div>
            )}
          </div>
          <div className="photo-popover-wrap">
            <button
              className="photo-profile-button"
              aria-expanded={profileOpen}
              onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}
            >
              <img src={user?.profilePicture || photoUrl('photo-1534528741775-53994a69daeb', 96)} alt="" />
              <span>{profileName}</span>
              <Icon name="chevron" size={14} />
            </button>
            {profileOpen && (
              <div className="photo-popover photo-profile-menu">
                <strong>{profileName}</strong>
                <span>Photographer · Creator profile</span>
                <button onClick={() => addToast('info', 'Profile settings', 'Profile editing is coming soon.')}>Edit profile</button>
                <button onClick={logout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="photo-layout">
        <aside className="photo-sidebar">
          <nav aria-label="Main navigation">
            <a className="photo-nav-item is-active" href="#dashboard"><Icon name="home" /> Home</a>
            <button className="photo-nav-item" onClick={() => openSection('creators')}><Icon name="discover" /> Discover</button>
            <button className="photo-nav-item" onClick={() => openSection('projects')}><Icon name="projects" /> My Projects</button>
            <button className="photo-nav-item" onClick={() => addToast('info', 'Messages', 'Your creator inbox is ready for its first conversation.')}><Icon name="message" /> Messages <span className="photo-nav-count">2</span></button>
            <button className="photo-nav-item" onClick={() => { setNotificationsOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="bell" /> Notifications</button>
            <button className="photo-nav-item" onClick={() => openSection('creators')}><Icon name="community" /> Community</button>
          </nav>
          <div className="photo-sidebar-note">
            <div className="photo-sticker" aria-hidden="true"><span /><i /></div>
            <strong>GOOD IDEAS<br />LOOK BETTER<br />TOGETHER.</strong>
            <span className="photo-squiggle" aria-hidden="true">〰</span>
          </div>
          <div className="photo-sidebar-footer">
            <span className="photo-brand-name">COLLAB<span>R</span>O</span>
            <small>The Creators Hub</small>
          </div>
        </aside>

        <main className="photo-main">
          <section className="photo-hero">
            <div className="photo-hero-copy">
              <div className="photo-eyebrow"><span /> HEY {firstName.toUpperCase()}, YOUR PHOTOGRAPHY STUDIO</div>
              <h1>SHOOT.<br /><mark>CONNECT.</mark><br /><i>CREATE</i> STORIES.</h1>
              <p>Find your next muse, build a dream team, and bring the ideas in your camera roll to life.</p>
              <button className="photo-button photo-button-yellow" onClick={() => setProjectModalOpen(true)}>
                <Icon name="plus" size={17} /> START A PROJECT <Icon name="arrow" size={16} />
              </button>
              <div className="photo-hero-badges" aria-label="Project types">
                <span className="photo-badge badge-purple"><Icon name="camera" size={14} /> Editorial</span>
                <span className="photo-badge badge-yellow"><Icon name="sparkle" size={14} /> Portraits</span>
                <span className="photo-badge badge-cyan"><Icon name="heart" size={14} /> Lifestyle</span>
              </div>
            </div>
            <div className="photo-hero-art">
              <div className="photo-hero-photo photo-hero-photo-back">
                <img src={photoUrl('photo-1531058020387-3be344556be6', 720)} alt="Creative photo shoot" />
                <span className="photo-film-label">FRAME 001 · 35MM</span>
              </div>
              <div className="photo-hero-photo photo-hero-photo-front">
                <img src={photoUrl('photo-1524504388940-b1c1722653e1', 520)} alt="Portrait from a golden-hour photo shoot" />
                <span className="photo-live"><i /> LIVE SHOOT</span>
              </div>
              <div className="photo-collab-note"><span className="photo-avatar-stack"><img src={photoUrl('photo-1534528741775-53994a69daeb', 60)} alt="" /><img src={photoUrl('photo-1500648767791-00dcc994a43e', 60)} alt="" /><img src={photoUrl('photo-1531123897727-8f129e1688ce', 60)} alt="" /></span><span><b>4 creators</b><small>making something good</small></span><Icon name="sparkle" size={20} /></div>
              <span className="photo-doodle photo-doodle-one" aria-hidden="true">✳</span>
              <span className="photo-doodle photo-doodle-two" aria-hidden="true">✦</span>
            </div>
          </section>

          <div className="photo-section-heading" id="projects">
            <div><span className="photo-eyebrow">YOUR LATEST WORK</span><h2>Featured shoots</h2></div>
            <button className="photo-text-link" onClick={() => addToast('info', 'Your portfolio', 'All of your photography projects will live here.')}>View portfolio <Icon name="arrow" size={15} /></button>
          </div>
          <section className="photo-project-grid" aria-label="Featured photography projects">
            {filteredProjects.length ? filteredProjects.map((project, index) => (
              <article className="photo-project-card" key={`${project.title}-${index}`}>
                <div className="photo-project-image">
                  <img src={project.image.startsWith('blob:') ? project.image : photoUrl(project.image)} alt={project.title} />
                  <span className={`photo-project-type type-${(project.type || '').toLowerCase().replace(/\s+/g, '-')}`}>{project.type}</span>
                  <button className="photo-save-button" aria-label={`Save ${project.title}`} onClick={() => addToast('success', 'Saved to favorites', project.title)}><Icon name="heart" size={15} /></button>
                </div>
                <div className="photo-project-info">
                  <div className="photo-project-title"><h3>{project.title}</h3><span className={project.status === 'In progress' ? 'status-purple' : 'status-green'}>{project.status}</span></div>
                  <p>Looking for: <b>{project.need}</b></p>
                  <div className="photo-project-footer">
                    <span className="photo-mini-avatars">{project.collaborators.length ? project.collaborators.map((name, avatarIndex) => <img key={name} src={photoUrl(['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce'][avatarIndex % 3], 48)} alt="" />) : <span className="photo-avatar-empty"><Icon name="plus" size={11} /></span>}</span>
                    <button onClick={() => addToast('success', 'You’re on the list', `We’ll let you know when ${project.title} gets a match.`)}>Join shoot <Icon name="arrow" size={14} /></button>
                  </div>
                </div>
              </article>
            )) : <div className="photo-empty-state">No shoots match “{query}”. Try a different search.</div>}
          </section>

          <div className="photo-section-heading photo-creators-heading" id="creators">
            <div><span className="photo-eyebrow">PEOPLE TO MAKE THINGS WITH</span><h2>Creators to know</h2></div>
            <button className="photo-text-link" onClick={() => addToast('info', 'Creator directory', 'More photographers, stylists, and artists are on the way.')}>Meet the community <Icon name="arrow" size={15} /></button>
          </div>
          <section className="photo-creator-grid" aria-label="Recommended creative collaborators">
            {filteredCreators.length ? filteredCreators.map((creator) => (
              <article className="photo-creator-card" key={creator.name}>
                <div className="photo-creator-top"><img src={photoUrl(creator.image, 120)} alt="" /><span className="photo-creator-presence" /><button aria-label={`Favorite ${creator.name}`} onClick={() => addToast('success', 'Creator saved', `${creator.name} was added to your favorites.`)}><Icon name="heart" size={15} /></button></div>
                <h3>{creator.name}</h3>
                <p>{creator.role}</p>
                <div className="photo-creator-tags">{creator.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="photo-creator-stats"><span><Icon name="projects" size={13} /> {creator.projects} projects</span><span>★ {creator.rating}</span></div>
                <button className="photo-creator-connect" onClick={() => addToast('success', 'Request sent', `${creator.name} will hear from you soon.`)}>Connect <Icon name="arrow" size={14} /></button>
              </article>
            )) : <div className="photo-empty-state">No creators match “{query}”. Try a different search.</div>}
          </section>

          <section className="photo-bottom-banner" id="messages">
            <div className="photo-banner-shape" aria-hidden="true" />
            <span className="photo-eyebrow">YOUR NEXT GREAT FRAME IS A TEAM EFFORT</span>
            <h2>MAKE SOMETHING<br />WORTH <mark>REMEMBERING.</mark></h2>
            <button className="photo-button photo-button-yellow" onClick={() => setProjectModalOpen(true)}>CREATE A SHOOT <Icon name="arrow" size={16} /></button>
            <span className="photo-banner-spark" aria-hidden="true">✳</span>
          </section>
          <footer className="photo-footer">Made for the makers, the muses &amp; the moments in between. <span>COLLABRO © {new Date().getFullYear()}</span></footer>
        </main>

        <aside className="photo-right-rail">
          <section className="photo-quick-actions">
            <div className="photo-rail-title"><h2>QUICK ACTIONS</h2><Icon name="sparkle" size={18} /></div>
            <button className="photo-action-primary" onClick={() => setProjectModalOpen(true)}><Icon name="plus" /> Create a project <Icon name="arrow" size={15} /></button>
            <button onClick={() => uploadInput.current?.click()}><Icon name="upload" /> Upload a shoot <Icon name="arrow" size={15} /></button>
            <button onClick={() => openSection('creators')}><Icon name="community" /> Find collaborators <Icon name="arrow" size={15} /></button>
            <button onClick={() => addToast('info', 'Open calls', 'New creative briefs and opportunities are coming soon.')}><Icon name="sparkle" /> Explore opportunities <Icon name="arrow" size={15} /></button>
            <input ref={uploadInput} className="photo-visually-hidden" type="file" accept="image/*" onChange={uploadPhoto} aria-label="Upload a photo" />
          </section>

          <section className="photo-studio-panel">
            <div className="photo-studio-header"><h2>PHOTO STUDIO</h2><span>● READY</span></div>
            <label className="photo-project-select">CURRENT PROJECT <select aria-label="Current project">{projects.map((project, index) => <option key={`${project.title}-${index}`}>{project.title}</option>)}</select></label>
            <div className="photo-studio-tabs"><button className="selected"><Icon name="camera" size={15} /> Moodboard</button><button onClick={() => addToast('info', 'Shot list', 'Plan the perfect shot list for your next session.')}><Icon name="projects" size={15} /> Shot list</button><button onClick={() => addToast('info', 'Notes', 'Keep ideas and references together with your team.')}><Icon name="message" size={15} /> Notes</button></div>
            <div className="photo-moodboard">
              <img src={photoUrl('photo-1515886657613-9f3515b0c78f', 340)} alt="Editorial fashion moodboard reference" />
              <div><b>MOODBOARD · 04</b><p>Soft light. Honest moments. A little bit of golden hour.</p></div>
            </div>
            <div className="photo-studio-tip"><Icon name="sparkle" size={16} /><div><b>A little inspiration</b><p>Try shooting through something — a window, a veil, a rainy windshield.</p></div><Icon name="arrow" size={14} /></div>
            <div className="photo-studio-footer"><button onClick={() => addToast('success', 'Draft saved', 'Your moodboard is saved for this session.')}>Save draft</button><button onClick={() => addToast('success', 'Invite link copied', 'Your shoot invite is ready to share.')}>Invite team <Icon name="community" size={14} /></button></div>
          </section>

          <section className="photo-weekly-card">
            <div className="photo-weekly-icon"><Icon name="camera" size={19} /></div>
            <span className="photo-eyebrow">YOUR WEEK IN FRAMES</span>
            <strong>6,240</strong>
            <p>people discovered your work this week</p>
            <div className="photo-weekly-chart" aria-label="Views rising through the week">
              {[24, 39, 31, 52, 43, 67, 56, 84, 71, 100, 78, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <span className="photo-weekly-growth">↗ 18% from last week</span>
          </section>
        </aside>
      </div>

      {projectModalOpen && (
        <div className="photo-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectModalOpen(false) }}>
          <form className="photo-project-modal" onSubmit={createProject} role="dialog" aria-modal="true" aria-labelledby="new-project-title">
            <button type="button" className="photo-modal-close" aria-label="Close" onClick={() => setProjectModalOpen(false)}><Icon name="close" size={19} /></button>
            <span className="photo-eyebrow">MAKE ROOM FOR A NEW IDEA</span>
            <h2 id="new-project-title">Start a project</h2>
            <p>Give your shoot a name and we’ll help you find the right creative team.</p>
            <label htmlFor="project-name">PROJECT NAME</label>
            <input id="project-name" autoFocus maxLength={60} placeholder="e.g. Golden hour portraits" value={projectName} onChange={(event) => setProjectName(event.target.value)} required />
            <label htmlFor="project-type">PROJECT TYPE</label>
            <select id="project-type" value={projectType} onChange={(event) => setProjectType(event.target.value)}>
              <option>Portrait</option><option>Editorial</option><option>Lifestyle</option><option>Nature</option><option>Campaign</option>
            </select>
            <button type="submit" className="photo-button photo-button-yellow">CREATE PROJECT <Icon name="arrow" size={16} /></button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PhotographerDashboard
