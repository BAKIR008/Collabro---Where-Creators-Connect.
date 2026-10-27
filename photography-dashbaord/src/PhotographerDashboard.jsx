import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomCursor from './components/CustomCursor.jsx'
import ToastContainer, { useToast } from './components/ToastSystem.jsx'
import ProjectForm, { imageFileToDataUrl } from './ProjectForm.jsx'
import { CreatorDialog, MessagesDialog, ProfileDialog, SettingsDialog } from './DashboardDialogs.jsx'
import { creators, moodboardReferences, photoUrl, projectsSeed } from './dashboardData.js'
import { authPageUrl, dashboardApi } from './dashboardApi.js'
import { createPreviewProject, readPreviewProfile, readPreviewProjects, savePreviewProfile } from './dashboardStorage.js'
import './PhotographerDashboard.css'

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
  const searchInput = useRef(null)
  const profileWrap = useRef(null)
  const notificationWrap = useRef(null)
  const [myProjects, setMyProjects] = useState(() => readPreviewProjects().map((item) => ({
    ...item,
    type: item.category,
    image: item.coverImage || 'photo-1492691527719-9d1e07e534b4',
    need: item.lookingFor || 'Find your team',
    collaborators: (item.collaborators || []).map((collaborator) => typeof collaborator === 'string' ? collaborator : collaborator.name),
  })))
  const [query, setQuery] = useState('')
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [authMessage, setAuthMessage] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [modal, setModal] = useState('')
  const [projectDraft, setProjectDraft] = useState(null)
  const [savingProject, setSavingProject] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [showMyProjects, setShowMyProjects] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collabro-favorites') || '[]') } catch { return [] }
  })
  const [requestedProjects, setRequestedProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collabro-join-requests') || '[]') } catch { return [] }
  })
  const [studioProjectId, setStudioProjectId] = useState(projectsSeed[0].id)
  const [studioTab, setStudioTab] = useState('moodboard')
  const [shotList, setShotList] = useState([])
  const [studioNotes, setStudioNotes] = useState('')
  const [studioInput, setStudioInput] = useState('')
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collabro-messages') || '[]') } catch { return [] }
  })
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collabro-settings') || '{"emailUpdates":true,"reduceMotion":false}') } catch { return { emailUpdates: true, reduceMotion: false } }
  })

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Photographer Dashboard — CollaBro'
    return () => { document.title = previousTitle }
  }, [])

  useEffect(() => {
    let active = true
    dashboardApi.getUser()
      .then((account) => {
        if (active) setUser(account)
        return dashboardApi.getProjects()
      })
      .then((items) => {
        if (active) {
          setMyProjects(items.map((item) => ({
            ...item,
            id: item._id,
            type: item.category,
            image: item.coverImage || 'photo-1492691527719-9d1e07e534b4',
            need: item.lookingFor || 'Find your team',
            collaborators: (item.collaborators || []).map((collaborator) => typeof collaborator === 'string' ? collaborator : collaborator.name),
          })))
        }
      })
      .catch((error) => {
        if (!active) return
        if (error.status === 401 || !error.status || error.status >= 500) {
          setUser(readPreviewProfile())
          setMyProjects(readPreviewProjects().map((item) => ({
            ...item,
            type: item.category,
            image: item.coverImage || 'photo-1492691527719-9d1e07e534b4',
            need: item.lookingFor || 'Find your team',
            collaborators: (item.collaborators || []).map((collaborator) => typeof collaborator === 'string' ? collaborator : collaborator.name),
          })))
          setAuthMessage(error.status === 401 ? 'Preview mode: sign in to save to your account. Projects on this device are temporary.' : 'Could not reach the account server. Preview projects are saved only in this browser.')
        } else {
          setAuthMessage(error.message)
          addToast('error', 'Projects unavailable', error.message, 5000)
        }
      })
      .finally(() => { if (active) setProjectsLoading(false) })
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

  useEffect(() => {
    const closePopovers = (event) => {
      if (!profileWrap.current?.contains(event.target)) setProfileOpen(false)
      if (!notificationWrap.current?.contains(event.target)) setNotificationsOpen(false)
    }
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
      if (event.key === 'Escape') {
        setProfileOpen(false)
        setNotificationsOpen(false)
        setModal('')
      }
    }
    document.addEventListener('mousedown', closePopovers)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', closePopovers)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('collabro-favorites', JSON.stringify(favorites))
      localStorage.setItem('collabro-join-requests', JSON.stringify(requestedProjects))
      localStorage.setItem('collabro-messages', JSON.stringify(messages))
      localStorage.setItem('collabro-settings', JSON.stringify(settings))
    } catch {
      addToast('warning', 'Browser storage is full', 'Some local preferences could not be saved.')
    }
  }, [favorites, requestedProjects, messages, settings, addToast])

  const allProjects = useMemo(() => [...myProjects, ...projectsSeed], [myProjects])
  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    const source = showMyProjects ? myProjects : allProjects
    if (!term) return source
    return source.filter((project) =>
      [project.title, project.description, project.type || project.category, project.status, project.need || project.lookingFor]
        .some((value) => String(value || '').toLowerCase().includes(term))
    )
  }, [allProjects, myProjects, query, showMyProjects])

  const filteredCreators = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return creators
    return creators.filter((creator) =>
      [creator.name, creator.role, ...creator.tags].some((value) => value.toLowerCase().includes(term))
    )
  }, [query])

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'creator'
  const profileName = user?.name || 'Your profile'
  const openProjectForm = () => {
    setProjectDraft(null)
    setModal('project')
  }

  const saveProject = async (details) => {
    setSavingProject(true)
    try {
      const created = user?.isLocalPreview || !user
        ? createPreviewProject(details)
        : await dashboardApi.createProject(details)
      const normalized = {
        ...created,
        id: created._id || created.id,
        type: created.category,
        image: created.coverImage || 'photo-1492691527719-9d1e07e534b4',
        need: created.lookingFor || 'Find your team',
        collaborators: (created.collaborators || []).map((person) => person.name),
      }
      setMyProjects((current) => [normalized, ...current])
      setModal('')
      addToast('success', 'Project created', `${created.title} is ready in your project workspace.`)
      navigate(`/projects/${created._id || created.id}`)
    } finally {
      setSavingProject(false)
    }
  }

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const coverImage = await imageFileToDataUrl(file)
      setProjectDraft({
        title: file.name.replace(/\.[^.]+$/, ''),
        category: 'Portrait',
        status: 'Open',
        coverImage,
      })
      setModal('project')
    } catch (error) {
      addToast('error', 'Image could not be added', error.message)
    }
  }

  const saveProfile = async (profile) => {
    setSavingProfile(true)
    try {
      const updated = user?.isLocalPreview || !user
        ? savePreviewProfile(profile)
        : await dashboardApi.saveProfile(profile)
      setUser(updated)
      setModal('')
      addToast('success', 'Profile updated', 'Your profile has been saved to your account.')
    } catch (error) {
      addToast('error', 'Profile was not saved', error.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const openProfileEditor = () => {
    setModal('profile')
    setProfileOpen(false)
  }

  const toggleFavorite = (name) => {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])
  }

  const sendMessage = (text) => {
    const normalizedText = text.trim()
    if (!normalizedText) return
    setMessages((current) => [...current, { text: normalizedText, recipient: selectedCreator?.name || 'Collaborators', createdAt: new Date().toISOString() }])
    addToast('success', 'Message saved', 'Your message is in your local conversation draft.')
  }

  const logout = async () => {
    if (user?.isLocalPreview || !user) {
      window.location.assign(authPageUrl())
      return
    }
    try {
      await dashboardApi.logout()
      window.location.assign(authPageUrl())
    } catch (error) {
      addToast('error', 'Sign-out failed', error.message)
    }
  }

  const openMyProjects = () => {
    setShowMyProjects(true)
    setProfileOpen(false)
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openSection = (section) => {
    if (section === 'projects') setShowMyProjects(false)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addStudioItem = () => {
    const item = studioInput.trim()
    if (!item) return
    if (studioTab === 'shot-list') setShotList((current) => [...current, { title: item, completed: false }])
    else if (studioTab === 'notes') setStudioNotes((current) => `${current}${current ? '\n' : ''}${item}`)
    setStudioInput('')
  }

  const currentStudioProject = allProjects.find((project) => String(project.id || project._id) === String(studioProjectId)) || allProjects[0]

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`collabro-studio-${studioProjectId}`) || '{}')
      setShotList(saved.shotList || [])
      setStudioNotes(saved.notes || '')
    } catch {
      setShotList([])
      setStudioNotes('')
    }
  }, [studioProjectId])

  useEffect(() => {
    try {
      localStorage.setItem(`collabro-studio-${studioProjectId}`, JSON.stringify({ shotList, notes: studioNotes }))
    } catch {
      addToast('warning', 'Studio draft was not saved', 'Browser storage is full.')
    }
  }, [shotList, studioNotes, studioProjectId, addToast])

  const joinProject = (project) => {
    if (requestedProjects.includes(project.id)) return
    setRequestedProjects((current) => [...current, project.id])
    addToast('success', 'Interest saved', `Your interest in “${project.title}” is saved in this browser.`)
  }

  const showCreator = (creator) => {
    setSelectedCreator(creator)
    setModal('creator')
  }

  const openMessages = () => {
    setModal('messages')
    setProfileOpen(false)
  }

  const openSettings = () => {
    setModal('settings')
    setProfileOpen(false)
  }

  const openNotificationProject = (id) => {
    setNotificationsOpen(false)
    navigate(`/projects/${id}`)
  }

  const openProject = (project) => {
    navigate(`/projects/${project.id || project._id}`)
  }

  const makeProjectImage = (project) => {
    if (project.coverImage) return project.coverImage
    if (project.image?.startsWith('http')) return project.image
    return photoUrl(project.image || 'photo-1492691527719-9d1e07e534b4')
  }

  return (
    <div className={`photo-dashboard ${settings.reduceMotion ? 'reduced-motion' : ''}`} id="dashboard">
      <CustomCursor />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="photo-topbar">
        <Link className="photo-brand" to="/dashboard" aria-label="CollaBro home">
          <span className="photo-brand-name">COLLAB<span>R</span>O</span>
          <span className="photo-brand-tag">THE CREATORS HUB</span>
        </Link>
        <label className="photo-search">
          <Icon name="discover" size={17} />
          <input
            ref={searchInput}
            type="search"
            placeholder="Search shoots, creators, projects..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search shoots, creators, and projects"
          />
          <kbd>Ctrl/⌘ K</kbd>
        </label>
        <div className="photo-account">
          <div className="photo-popover-wrap" ref={notificationWrap}>
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
                <div className="photo-popover-heading">Activity <span>{requestedProjects.length} saved</span></div>
                {requestedProjects.length ? requestedProjects.map((id) => {
                  const project = projectsSeed.find((item) => item.id === id)
                  return project ? <button key={id} onClick={() => openNotificationProject(id)}>You saved interest in “{project.title}” <Icon name="arrow" size={14} /></button> : null
                }) : <p>You’re all caught up. New project activity will appear here.</p>}
                <button onClick={() => { setNotificationsOpen(false); openMyProjects() }}>View your projects <Icon name="arrow" size={14} /></button>
              </div>
            )}
          </div>
          <div className="photo-popover-wrap" ref={profileWrap}>
            <button
              className="photo-profile-button"
              aria-label={`Open profile for ${profileName}`}
              aria-expanded={profileOpen}
              onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}
            >
              <img src={user?.profilePicture || photoUrl('photo-1534528741775-53994a69daeb', 96)} alt="" />
              <span>{profileName}</span>
              <Icon name="chevron" size={14} />
            </button>
            {profileOpen && (
              <div className="photo-popover photo-profile-menu">
                <img className="photo-menu-avatar" src={user?.profilePicture || photoUrl('photo-1534528741775-53994a69daeb', 96)} alt="" />
                <strong>{profileName}</strong>
                <span>{user?.username ? `@${user.username}` : user?.creatorRole || 'Creator'} · {user?.role || 'Creator'}</span>
                {user?.bio && <p>{user.bio}</p>}
                {user?.skills?.length > 0 && <small>Skills: {user.skills.join(', ')}</small>}
                {user?.interests?.length > 0 && <small>Interests: {user.interests.join(', ')}</small>}
                <button onClick={openProfileEditor}>Edit profile</button>
                <button onClick={openMyProjects}>My projects</button>
                <button onClick={openSettings}>Settings</button>
                <button onClick={logout}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </header>
      {!user && <div className="photo-account-notice" role="status">{authMessage || 'Preview mode: sign in to save projects to your account.'} <a href={authPageUrl()}>Sign in</a></div>}

      <div className="photo-layout">
        <aside className="photo-sidebar">
          <nav aria-label="Main navigation">
            <Link className="photo-nav-item is-active" to="/dashboard" onClick={() => setShowMyProjects(false)}><Icon name="home" /> Home</Link>
            <button className="photo-nav-item" onClick={() => openSection('creators')}><Icon name="discover" /> Discover</button>
            <button className="photo-nav-item" onClick={openMyProjects}><Icon name="projects" /> My Projects</button>
            <button className="photo-nav-item" onClick={openMessages}><Icon name="message" /> Messages <span className="photo-nav-count">{messages.length || ''}</span></button>
            <button className="photo-nav-item" onClick={() => { setNotificationsOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="bell" /> Notifications</button>
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
              <div className="photo-hero-badges" aria-label="Project types">
                <span className="photo-badge badge-purple"><Icon name="camera" size={14} /> Editorial</span>
                <span className="photo-badge badge-yellow"><Icon name="sparkle" size={14} /> Portraits</span>
                <span className="photo-badge badge-cyan"><Icon name="heart" size={14} /> Lifestyle</span>
              </div>
            </div>
            <div className="photo-hero-art">
              <div className="photo-hero-photo photo-hero-photo-back">
                <img src={photoUrl('photo-1531058020387-3be344556be6', 720)} alt="Colorful creative event captured during a photo shoot" fetchPriority="low" />
                <span className="photo-film-label">FRAME 001 · 35MM</span>
              </div>
              <div className="photo-hero-photo photo-hero-photo-front">
                <img src={photoUrl('photo-1524504388940-b1c1722653e1', 520)} alt="Portrait from a golden-hour photo shoot" fetchPriority="high" />
                <span className="photo-live"><i /> LIVE SHOOT</span>
              </div>
              <div className="photo-collab-note"><span className="photo-avatar-stack"><img src={photoUrl('photo-1534528741775-53994a69daeb', 60)} alt="" /><img src={photoUrl('photo-1500648767791-00dcc994a43e', 60)} alt="" /><img src={photoUrl('photo-1531123897727-8f129e1688ce', 60)} alt="" /></span><span><b>4 creators</b><small>making something good</small></span><Icon name="sparkle" size={20} /></div>
              <span className="photo-doodle photo-doodle-one" aria-hidden="true">✳</span>
              <span className="photo-doodle photo-doodle-two" aria-hidden="true">✦</span>
            </div>
          </section>

          <div className="photo-section-heading" id="projects">
            <div><span className="photo-eyebrow">{showMyProjects ? 'YOUR PROJECT WORKSPACE' : 'YOUR LATEST WORK'}</span><h2>{showMyProjects ? 'My projects' : 'Featured shoots'}</h2></div>
            {!showMyProjects && <button className="photo-text-link" onClick={openMyProjects}>View my projects <Icon name="arrow" size={15} /></button>}
          </div>
          <section className="photo-project-grid" aria-label="Featured photography projects">
            {projectsLoading && showMyProjects ? <div className="photo-empty-state">Loading your projects…</div> : null}
            {showMyProjects && !projectsLoading && !myProjects.length ? <div className="photo-empty-state">You haven’t created a project yet. Start with your next idea.</div> : null}
            {filteredProjects.length ? filteredProjects.map((project, index) => (
              <article className="photo-project-card" key={project.id || project._id || `${project.title}-${index}`}>
                <div className="photo-project-image">
                  <img
                    src={makeProjectImage(project)}
                    alt={`${project.type} photography: ${project.title}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={`photo-project-type type-${(project.type || '').toLowerCase().replace(/\s+/g, '-')}`}>{project.type || project.category}</span>
                  {!project._id && !project.isLocalPreview && <button className={`photo-save-button ${favorites.includes(project.id) ? 'is-saved' : ''}`} aria-label={`${favorites.includes(project.id) ? 'Unsave' : 'Save'} ${project.title}`} aria-pressed={favorites.includes(project.id)} onClick={() => toggleFavorite(project.id)}><Icon name="heart" size={15} /></button>}
                </div>
                <div className="photo-project-info">
                  <div className="photo-project-title"><h3>{project.title}</h3><span className={project.status === 'In progress' ? 'status-purple' : 'status-green'}>{project.status}</span></div>
                  <p>Looking for: <b>{project.need || project.lookingFor || 'Find your team'}</b></p>
                  <div className="photo-project-footer">
                    <span className="photo-mini-avatars">{project.collaborators?.length ? project.collaborators.map((name, avatarIndex) => <img key={`${name}-${avatarIndex}`} src={photoUrl(['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce'][avatarIndex % 3], 48)} alt="" />) : <span className="photo-avatar-empty"><Icon name="plus" size={11} /></span>}</span>
                    <div className="photo-project-card-actions">
                      <button onClick={() => openProject(project)}>Open project <Icon name="arrow" size={14} /></button>
                      {!project._id && !project.isLocalPreview && <button className="photo-project-join" onClick={() => joinProject(project)} disabled={requestedProjects.includes(project.id)}>{requestedProjects.includes(project.id) ? 'Interest saved' : 'Join shoot'}</button>}
                    </div>
                  </div>
                </div>
              </article>
            )) : !projectsLoading && (!showMyProjects || myProjects.length > 0) ? <div className="photo-empty-state">No shoots match “{query}”. Try a different search.</div> : null}
          </section>

          <div className="photo-section-heading photo-creators-heading" id="creators">
            <div><span className="photo-eyebrow">PEOPLE TO MAKE THINGS WITH</span><h2>Creators to know</h2></div>
            <button className="photo-text-link" onClick={() => { setQuery(''); openSection('creators') }}>Meet the community <Icon name="arrow" size={15} /></button>
          </div>
          <section className="photo-creator-grid" aria-label="Recommended creative collaborators">
            {filteredCreators.length ? filteredCreators.map((creator) => (
              <article className="photo-creator-card" key={creator.name}>
                <div className="photo-creator-top"><img src={photoUrl(creator.image, 120)} alt={`${creator.name}, ${creator.role}`} loading="lazy" decoding="async" /><span className="photo-creator-presence" /><button className={favorites.includes(creator.name) ? 'is-saved' : ''} aria-label={`${favorites.includes(creator.name) ? 'Unfavorite' : 'Favorite'} ${creator.name}`} aria-pressed={favorites.includes(creator.name)} onClick={() => toggleFavorite(creator.name)}><Icon name="heart" size={15} /></button></div>
                <h3>{creator.name}</h3>
                <p>{creator.role}</p>
                <div className="photo-creator-tags">{creator.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="photo-creator-stats"><span><Icon name="projects" size={13} /> {creator.projects} projects</span><span>★ {creator.rating}</span></div>
                <div className="photo-creator-actions"><button className="photo-creator-connect" onClick={() => { setSelectedCreator(creator); setModal('messages') }}>Connect <Icon name="arrow" size={14} /></button><button className="photo-creator-view" onClick={() => showCreator(creator)}>View profile</button></div>
              </article>
            )) : <div className="photo-empty-state">No creators match “{query}”. Try a different search.</div>}
          </section>

          <section className="photo-bottom-banner" id="invite">
            <div className="photo-banner-shape" aria-hidden="true" />
            <span className="photo-eyebrow">YOUR NEXT GREAT FRAME IS A TEAM EFFORT</span>
            <h2>MAKE SOMETHING<br />WORTH <mark>REMEMBERING.</mark></h2>
            <button className="photo-button photo-button-yellow" onClick={openProjectForm}>CREATE A SHOOT <Icon name="arrow" size={16} /></button>
            <span className="photo-banner-spark" aria-hidden="true">✳</span>
          </section>
          <footer className="photo-footer">Made for the makers, the muses &amp; the moments in between. <span>COLLABRO © {new Date().getFullYear()}</span></footer>
        </main>

        <aside className="photo-right-rail">
          <section className="photo-quick-actions">
            <div className="photo-rail-title"><h2>QUICK ACTIONS</h2><Icon name="sparkle" size={18} /></div>
            <button onClick={() => uploadInput.current?.click()}><Icon name="upload" /> Upload a shoot <Icon name="arrow" size={15} /></button>
            <button onClick={() => openSection('creators')}><Icon name="community" /> Find collaborators <Icon name="arrow" size={15} /></button>
            <button onClick={() => { setShowMyProjects(false); setQuery('Open'); openSection('projects') }}><Icon name="sparkle" /> Explore open shoots <Icon name="arrow" size={15} /></button>
            <input ref={uploadInput} className="photo-visually-hidden" type="file" accept="image/*" onChange={uploadPhoto} aria-label="Upload a photo" />
          </section>

          <section className="photo-studio-panel">
            <div className="photo-studio-header"><h2>PHOTO STUDIO</h2><span>● READY</span></div>
            <label className="photo-project-select">CURRENT PROJECT <select aria-label="Current project" value={studioProjectId} onChange={(event) => setStudioProjectId(event.target.value)}>{allProjects.map((project) => <option key={project.id || project._id} value={project.id || project._id}>{project.title}</option>)}</select></label>
            <div className="photo-studio-tabs">
              <button className={studioTab === 'moodboard' ? 'selected' : ''} onClick={() => setStudioTab('moodboard')}><Icon name="camera" size={15} /> Moodboard</button>
              <button className={studioTab === 'shot-list' ? 'selected' : ''} onClick={() => setStudioTab('shot-list')}><Icon name="projects" size={15} /> Shot list</button>
              <button className={studioTab === 'notes' ? 'selected' : ''} onClick={() => setStudioTab('notes')}><Icon name="message" size={15} /> Notes</button>
            </div>
            {studioTab === 'moodboard' ? <div className="photo-moodboard">
              <img src={makeProjectImage(currentStudioProject)} alt={`${currentStudioProject?.title || 'Project'} moodboard cover`} loading="lazy" decoding="async" />
              <div className="photo-moodboard-references" aria-label="Moodboard references">
                {moodboardReferences.map((reference) => <figure key={reference.label}><img src={photoUrl(reference.image, 180)} alt={reference.label} loading="lazy" decoding="async" /><figcaption>{reference.label}</figcaption></figure>)}
              </div>
              <div><b>{currentStudioProject?.title || 'MOODBOARD'}</b><p>{currentStudioProject?.description || 'Soft light. Honest moments. A little bit of golden hour.'}</p></div>
            </div> : studioTab === 'shot-list' ? <div className="photo-studio-editable">
              {shotList.length ? <ul>{shotList.map((shot, index) => <li key={`${shot.title}-${index}`}><label><input type="checkbox" checked={shot.completed} onChange={() => setShotList((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, completed: !item.completed } : item))} /><span className={shot.completed ? 'is-complete' : ''}>{shot.title}</span></label><button aria-label={`Remove ${shot.title}`} onClick={() => setShotList((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button></li>)}</ul> : <p>Add the first frame to your shot list.</p>}
              <div className="photo-studio-add"><input value={studioInput} onChange={(event) => setStudioInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addStudioItem() } }} placeholder="e.g. Wide establishing shot" aria-label="New shot" /><button onClick={addStudioItem}>Add</button></div>
            </div> : <div className="photo-studio-editable"><textarea value={studioNotes} onChange={(event) => setStudioNotes(event.target.value)} placeholder="Add a location, lighting plan, or creative note…" aria-label="Photo studio notes" /><div className="photo-studio-add"><input value={studioInput} onChange={(event) => setStudioInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addStudioItem() } }} placeholder="Add a quick note" aria-label="Quick note" /><button onClick={addStudioItem}>Add</button></div></div>}
            <div className="photo-studio-tip"><Icon name="sparkle" size={16} /><div><b>A little inspiration</b><p>Try shooting through something — a window, a veil, a rainy windshield.</p></div><Icon name="arrow" size={14} /></div>
            <div className="photo-studio-footer"><button onClick={() => addToast('success', 'Studio draft saved', 'Your moodboard, shot list, and notes are saved in this browser.')}>Save draft</button></div>
          </section>

        </aside>
      </div>

      {modal === 'project' && <ProjectForm initialProject={projectDraft} saving={savingProject} onClose={() => setModal('')} onSave={saveProject} />}
      {modal === 'profile' && <ProfileDialog user={user} saving={savingProfile} onClose={() => setModal('')} onSave={saveProfile} />}
      {modal === 'settings' && <SettingsDialog settings={settings} setSettings={setSettings} onClose={() => setModal('')} />}
      {modal === 'messages' && <MessagesDialog creator={selectedCreator} messages={messages} onSend={sendMessage} onClose={() => setModal('')} />}
      {modal === 'creator' && <CreatorDialog creator={selectedCreator} onClose={() => setModal('')} onConnect={() => setModal('messages')} />}
    </div>
  )
}

export default PhotographerDashboard
