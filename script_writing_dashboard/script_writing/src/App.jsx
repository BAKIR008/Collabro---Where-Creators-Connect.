import { useEffect, useMemo, useRef, useState } from 'react'
import CustomCursor from './components/CustomCursor.jsx'
import ToastContainer, { useToast } from './components/ToastSystem.jsx'
import './App.css'

const scriptsSeed = [
  {
    title: 'The Last Light',
    type: 'Feature',
    status: 'Open',
    pages: '114 pgs',
    collaborators: ['Maya Chen', 'Leo Park'],
    need: 'Co-writer + Script Doctor',
    slugline: 'EXT. NORTH COAST - DUSK',
    logline: 'A solitary lighthouse keeper uncovers a secret transmission from the deep sea, forcing her to confront the past she fled.',
    excerpt: `FADE IN:

EXT. NORTH COAST - DUSK

A relentless gale batters the black basalt cliffs. The Atlantic is ink and froth.
A lone beacon blinks awake—sweep, pause, sweep.

INT. LIGHTHOUSE - LANTERN ROOM - CONTINUOUS

MARA (62), wind-chapped face, hands wrapped in grease-stained woolen mitts, steadies the brass prism.
A shortwave radio on the shelf CRACKLES with static.

RADIO (V.O.)
...all stations, gale warning in sector four...

Mara ignores it. Then—a rhythmic TAP-TAP-TAP breaks through the frequency. Not weather. Morse.
She freezes.`,
  },
  {
    title: 'Somewhere in the city',
    type: 'Pilot',
    status: 'In progress',
    pages: '58 pgs',
    collaborators: ['Noah Williams'],
    need: 'Story editor',
    slugline: 'INT. SUBWAY CAR - 2:00 AM',
    logline: 'An undercover detective navigates the neon underground of a shifting metropolis while tracking a phantom syndicate.',
    excerpt: `FADE IN:

INT. SUBWAY CAR - 2:00 AM

Fluorescent tubes flicker like dying stars. Rainwater trickles through the carriage ceiling.
KIDD (34) sits with his trench coat collar raised, eyes locked on a briefcase handcuffed to an empty seat across the aisle.`,
  },
  {
    title: 'A little more wild',
    type: 'Short Film',
    status: 'Open',
    pages: '18 pgs',
    collaborators: ['Ava Patel', 'Kai Morgan'],
    need: 'Director + Producer',
    slugline: 'EXT. PACIFIC HIGHWAY - SUNRISE',
    logline: 'Two estranged siblings embark on an unexpected road trip across the Pacific Northwest to fulfill their grandmother’s final wish.',
    excerpt: `FADE IN:

EXT. PACIFIC HIGHWAY - SUNRISE

A battered 1991 Volvo station wagon idles at the overlook. Golden hour spills across endless pines.
JULES (22) taps the steering wheel out of rhythm.
Beside him, TESS (27) checks an old cassette tape labeled "PLAY ONCE WE REACH OREGON".`,
  },
  {
    title: 'Sunday on film',
    type: 'Docuseries',
    status: 'Open',
    pages: '42 pgs',
    collaborators: ['Ella Brooks'],
    need: 'Researcher + Co-writer',
    slugline: 'INT. ANALOG DARKROOM - AFTERNOON',
    logline: 'An intimate docuseries chronicling forgotten 35mm and 16mm collective filmmakers who preserved history against state censorship.',
    excerpt: `FADE IN:

INT. ANALOG DARKROOM - AFTERNOON

Red safety light bathes shallow chemical trays.
An archival print submerged in fixer slowly reveals a crowded city square from May 1978.`,
  },
]

const creators = [
  { name: 'Maya Chen', role: 'Screenwriter', tags: ['Feature', 'Drama'], projects: 12, rating: '4.9', image: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Leo Park', role: 'Script Doctor', tags: ['Sci-Fi', 'Thriller'], projects: 8, rating: '4.8', image: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ava Patel', role: 'Showrunner & TV Writer', tags: ['TV Pilot', 'Series'], projects: 15, rating: '5.0', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Kai Morgan', role: 'Creative Producer', tags: ['Indie Film', 'Doc'], projects: 10, rating: '4.9', image: 'photo-1506794778202-cad84cf45f1d' },
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
    pen: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    typewriter: <><rect x="4" y="6" width="16" height="12" rx="2" /><line x1="8" y1="10" x2="8.01" y2="10" /><line x1="12" y1="10" x2="12.01" y2="10" /><line x1="16" y1="10" x2="16.01" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="4" y1="18" x2="20" y2="18" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 15 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M4 16v4h16v-4" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    chevron: <><path d="m7 10 5 5 5-5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  }

  return <svg {...common}>{paths[name] || paths.sparkle}</svg>
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast()
  const uploadInput = useRef(null)
  const [projects, setProjects] = useState(scriptsSeed)
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [readerModalScript, setReaderModalScript] = useState(null)
  const [favoriteScriptTitles, setFavoriteScriptTitles] = useState([])
  const [favoriteCreators, setFavoriteCreators] = useState([])

  // New script form fields
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('Feature')
  const [projectLogline, setProjectLogline] = useState('')
  const [projectNeed, setProjectNeed] = useState('Co-writer + Script Doctor')

  // Writers Room studio panel tabs
  const [activeStudioTab, setActiveStudioTab] = useState('Beat sheet')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Storyroom — Script Writing Dashboard — CollaBro'
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
      .catch(() => {
        // Fallback gracefully
      })

    return () => { active = false }
  }, [])

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return projects
    return projects.filter((project) =>
      [project.title, project.type, project.status, project.need, project.logline || ''].some((value) => value.toLowerCase().includes(term))
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

  const activeStudioProject = projects[selectedScriptIndex] || projects[0]

  const createScript = (event) => {
    event.preventDefault()
    const title = projectName.trim()
    if (!title) return
    const newScript = {
      title,
      type: projectType,
      status: 'Open',
      pages: '10 pgs (Drafting)',
      collaborators: [],
      need: projectNeed || 'Find co-writer',
      slugline: 'INT. FIRST SCENE - DAY',
      logline: projectLogline || 'A new original screenplay in development.',
      excerpt: `FADE IN:\n\nINT. SCENE 1 - DAY\n\nThe story of "${title}" begins here.`,
    }
    setProjects((current) => [newScript, ...current])
    setSelectedScriptIndex(0)
    setProjectName('')
    setProjectLogline('')
    setProjectModalOpen(false)
    addToast('success', 'Script created', `${title} is live and ready for writers room collaboration.`)
  }

  const uploadScriptFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const cleanName = file.name.replace(/\.[^.]+$/, '')
    const uploadedScript = {
      title: cleanName,
      type: 'New upload',
      status: 'Just added',
      pages: 'Draft file',
      collaborators: [],
      need: 'Room feedback & notes',
      slugline: 'INT. IMPORTED SCREENPLAY - DRAFT',
      logline: 'Imported script document ready for table read & collaboration.',
      excerpt: `FADE IN:\n\nImported screenplay file: ${file.name}\n\nReady for scene analysis and writers room collaboration.`,
    }
    setProjects((current) => [uploadedScript, ...current])
    setSelectedScriptIndex(0)
    addToast('success', 'Screenplay uploaded', `${file.name} imported into Storyroom.`)
    event.target.value = ''
  }

  const toggleFavoriteScript = (title) => {
    if (favoriteScriptTitles.includes(title)) {
      setFavoriteScriptTitles(favoriteScriptTitles.filter((t) => t !== title))
      addToast('info', 'Removed from favorites', title)
    } else {
      setFavoriteScriptTitles([...favoriteScriptTitles, title])
      addToast('success', 'Saved to favorites', `${title} added to your reading list.`)
    }
  }

  const toggleFavoriteCreator = (name) => {
    if (favoriteCreators.includes(name)) {
      setFavoriteCreators(favoriteCreators.filter((n) => n !== name))
    } else {
      setFavoriteCreators([...favoriteCreators, name])
      addToast('success', 'Writer saved', `${name} added to your collaborators list.`)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      window.location.href = '/login'
    } catch {
      window.location.href = '/login'
    }
  }

  const openSection = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="script-dashboard" id="dashboard">
      <CustomCursor />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* TOPBAR */}
      <header className="script-topbar">
        <a className="script-brand" href="#dashboard" aria-label="CollaBro home">
          <span className="script-brand-name">COLLAB<span>R</span>O</span>
          <span className="script-brand-tag">THE CREATORS HUB</span>
        </a>

        <label className="script-search">
          <Icon name="discover" size={17} />
          <input
            type="search"
            placeholder="Search scripts, writers, projects..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search scripts, writers, and projects"
          />
          <kbd>⌘ K</kbd>
        </label>

        <div className="script-account">
          <div className="script-popover-wrap">
            <button
              className={`script-icon-button ${notificationsOpen ? 'is-open' : ''}`}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }}
            >
              <Icon name="bell" size={19} />
              <span className="script-notification-dot" />
            </button>
            {notificationsOpen && (
              <div className="script-popover script-notifications">
                <div className="script-popover-heading">You’re all caught up <span>2 new</span></div>
                <p><b>Maya Chen</b> wants to join <em>The Last Light</em> writers room.</p>
                <p><b>Leo Park</b> sent you a script collaboration request.</p>
                <button onClick={() => { setNotificationsOpen(false); openSection('projects') }}>
                  View script activity <Icon name="arrow" size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="script-popover-wrap">
            <button
              className="script-profile-button"
              aria-expanded={profileOpen}
              onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}
            >
              <img src={user?.profilePicture || photoUrl('photo-1534528741775-53994a69daeb', 96)} alt="" />
              <span>{profileName}</span>
              <Icon name="chevron" size={14} />
            </button>
            {profileOpen && (
              <div className="script-popover script-profile-menu">
                <strong>{profileName}</strong>
                <span>Screenwriter &amp; Showrunner · Creator profile</span>
                <button onClick={() => addToast('info', 'Profile settings', 'Profile editing is coming soon.')}>Edit profile</button>
                <button onClick={logout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div className="script-layout">
        {/* LEFT SIDEBAR */}
        <aside className="script-sidebar">
          <nav aria-label="Main navigation">
            <a className="script-nav-item is-active" href="#dashboard"><Icon name="home" /> Home</a>
            <button className="script-nav-item" onClick={() => openSection('creators')}><Icon name="discover" /> Discover</button>
            <button className="script-nav-item" onClick={() => openSection('projects')}><Icon name="document" /> My Projects</button>
            <button className="script-nav-item" onClick={() => addToast('info', 'Messages', 'Your writers room inbox is ready for script notes.')}><Icon name="message" /> Messages <span className="script-nav-count">2</span></button>
            <button className="script-nav-item" onClick={() => { setNotificationsOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="bell" /> Notifications</button>
            <button className="script-nav-item" onClick={() => openSection('creators')}><Icon name="community" /> Community</button>
          </nav>

          <div className="script-sidebar-note">
            <div className="script-sticker" aria-hidden="true"><span /><i /></div>
            <strong>GOOD IDEAS<br />LOOK BETTER<br />TOGETHER.</strong>
            <span className="script-squiggle" aria-hidden="true">〰</span>
          </div>

          <div className="script-sidebar-footer">
            <span className="script-brand-name">COLLAB<span>R</span>O</span>
            <small>The Creators Hub</small>
          </div>
        </aside>

        {/* MIDDLE MAIN CONTENT */}
        <main className="script-main">
          {/* HERO SECTION */}
          <section className="script-hero">
            <div className="script-hero-copy">
              <div className="script-eyebrow"><span /> HEY {firstName.toUpperCase()}, YOUR SCRIPT WRITING STUDIO</div>
              <h1>WRITE.<br /><mark>CONNECT.</mark><br /><i>CREATE</i> STORIES.</h1>
              <p>Find your next story arc, build a dream writers room, and bring the words on your pages to life.</p>
              <button className="script-button script-button-yellow" onClick={() => setProjectModalOpen(true)}>
                <Icon name="plus" size={17} /> START A SCRIPT <Icon name="arrow" size={16} />
              </button>
              <div className="script-hero-badges" aria-label="Script writing types">
                <span className="script-badge badge-purple"><Icon name="pen" size={14} /> Screenplay</span>
                <span className="script-badge badge-yellow"><Icon name="sparkle" size={14} /> TV Pilot</span>
                <span className="script-badge badge-cyan"><Icon name="film" size={14} /> Short Film</span>
              </div>
            </div>

            <div className="script-hero-art">
              {/* Back tilted draft card */}
              <div className="script-hero-card script-hero-card-back">
                <div className="script-hero-screenplay">
                  <div>
                    <div className="script-hero-slugline">EXT. NORTH COAST - DUSK</div>
                    <p className="script-hero-action">A relentless storm gathers over jagged cliffs. A lone beacon cuts the dark.</p>
                  </div>
                </div>
                <span className="script-draft-label">DRAFT 001 · SPEC SCRIPT</span>
              </div>

              {/* Front tilted draft card */}
              <div className="script-hero-card script-hero-card-front">
                <div className="script-hero-screenplay">
                  <div>
                    <div className="script-hero-slugline">INT. LIGHTHOUSE - CONTINUOUS</div>
                    <p className="script-hero-action">Mara steadies the brass dial. Static breaks into rhythmic Morse code.</p>
                  </div>
                  <div className="script-hero-dialogue-block">
                    <div className="script-hero-character">MARA (V.O.)</div>
                    <div className="script-hero-speech">"The sea doesn't keep secrets. It just waits for the tide."</div>
                  </div>
                </div>
                <span className="script-live"><i /> LIVE WRITERS ROOM</span>
              </div>

              {/* Collaboration note */}
              <div className="script-collab-note">
                <span className="script-avatar-stack">
                  <img src={photoUrl('photo-1534528741775-53994a69daeb', 60)} alt="" />
                  <img src={photoUrl('photo-1500648767791-00dcc994a43e', 60)} alt="" />
                  <img src={photoUrl('photo-1531123897727-8f129e1688ce', 60)} alt="" />
                </span>
                <span><b>4 writers</b><small>breaking the third act</small></span>
                <Icon name="sparkle" size={20} />
              </div>

              <span className="script-doodle script-doodle-one" aria-hidden="true">✳</span>
              <span className="script-doodle script-doodle-two" aria-hidden="true">✦</span>
              <div className="script-target-icon" aria-hidden="true" />
            </div>
          </section>

          {/* SECTION 1: FEATURED SCRIPTS */}
          <div className="script-section-heading" id="projects">
            <div><span className="script-eyebrow">YOUR LATEST WORK</span><h2>Featured scripts</h2></div>
            <button className="script-text-link" onClick={() => addToast('info', 'Script portfolio', 'All of your written scripts and pilots live here.')}>
              View portfolio <Icon name="arrow" size={15} />
            </button>
          </div>

          <section className="script-project-grid" aria-label="Featured screenplays">
            {filteredProjects.length ? filteredProjects.map((project, index) => {
              const isSaved = favoriteScriptTitles.includes(project.title)

              return (
                <article className="script-project-card" key={`${project.title}-${index}`}>
                  <div className="script-project-cover">
                    <div className="script-cover-excerpt">
                      <div className="script-cover-slug">{project.slugline || 'INT. SCENE - DAY'}</div>
                      <div className="script-cover-logline">{project.logline}</div>
                    </div>
                    <span className={`script-project-type type-${(project.type || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {project.type}
                    </span>
                    <button
                      className={`script-save-button ${isSaved ? 'is-saved' : ''}`}
                      aria-label={`Save ${project.title}`}
                      onClick={() => toggleFavoriteScript(project.title)}
                    >
                      <Icon name="heart" size={15} />
                    </button>
                  </div>

                  <div className="script-project-info">
                    <div className="script-project-title">
                      <h3>{project.title}</h3>
                      <span className={project.status === 'In progress' ? 'status-purple' : 'status-green'}>
                        {project.status}
                      </span>
                    </div>
                    <p>Looking for: <b>{project.need}</b></p>
                    <div className="script-project-footer">
                      <span className="script-mini-avatars">
                        {project.collaborators.length ? project.collaborators.map((name, avatarIndex) => (
                          <img
                            key={name}
                            src={photoUrl(['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce'][avatarIndex % 3], 48)}
                            alt=""
                          />
                        )) : <span className="script-avatar-empty"><Icon name="plus" size={11} /></span>}
                      </span>
                      <button onClick={() => setReaderModalScript(project)}>
                        Read script <Icon name="arrow" size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            }) : <div className="script-empty-state">No scripts match “{query}”. Try a different search.</div>}
          </section>

          {/* SECTION 2: CREATORS TO KNOW */}
          <div className="script-section-heading script-creators-heading" id="creators">
            <div><span className="script-eyebrow">PEOPLE TO MAKE THINGS WITH</span><h2>Creators to know</h2></div>
            <button className="script-text-link" onClick={() => addToast('info', 'Writers Guild', 'Browse hundreds of verified screenwriters and script doctors.')}>
              Meet the community <Icon name="arrow" size={15} />
            </button>
          </div>

          <section className="script-creator-grid" aria-label="Recommended screenwriting collaborators">
            {filteredCreators.length ? filteredCreators.map((creator) => {
              const isFav = favoriteCreators.includes(creator.name)

              return (
                <article className="script-creator-card" key={creator.name}>
                  <div className="script-creator-top">
                    <img src={photoUrl(creator.image, 120)} alt="" />
                    <span className="script-creator-presence" />
                    <button
                      aria-label={`Favorite ${creator.name}`}
                      onClick={() => toggleFavoriteCreator(creator.name)}
                    >
                      <Icon name="heart" size={15} />
                    </button>
                  </div>
                  <h3>{creator.name}</h3>
                  <p>{creator.role}</p>
                  <div className="script-creator-tags">
                    {creator.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="script-creator-stats">
                    <span><Icon name="projects" size={13} /> {creator.projects} scripts</span>
                    <span>★ {creator.rating}</span>
                  </div>
                  <button
                    className="script-creator-connect"
                    onClick={() => addToast('success', 'Invitation sent', `Invited ${creator.name} to collaborate on your active room.`)}
                  >
                    Connect <Icon name="arrow" size={14} />
                  </button>
                </article>
              )
            }) : <div className="script-empty-state">No writers match “{query}”. Try a different search.</div>}
          </section>

          {/* BOTTOM BANNER */}
          <section className="script-bottom-banner" id="messages">
            <div className="script-banner-shape" aria-hidden="true" />
            <span className="script-eyebrow">YOUR NEXT GREAT SCRIPT IS A TEAM EFFORT</span>
            <h2>MAKE SOMETHING<br />WORTH <mark>REMEMBERING.</mark></h2>
            <button className="script-button script-button-yellow" onClick={() => setProjectModalOpen(true)}>
              CREATE A SCRIPT <Icon name="arrow" size={16} />
            </button>
            <span className="script-banner-spark" aria-hidden="true">✳</span>
          </section>

          <footer className="script-footer">
            Made for the screenwriters, the scribes &amp; the scenes in between. <span>COLLABRO © {new Date().getFullYear()}</span>
          </footer>
        </main>

        {/* RIGHT RAIL */}
        <aside className="script-right-rail">
          {/* QUICK ACTIONS */}
          <section className="script-quick-actions">
            <div className="script-rail-title">
              <h2>QUICK ACTIONS</h2>
              <Icon name="sparkle" size={18} />
            </div>
            <button className="script-action-primary" onClick={() => setProjectModalOpen(true)}>
              <Icon name="plus" /> Create a project <Icon name="arrow" size={15} />
            </button>
            <button onClick={() => uploadInput.current?.click()}>
              <Icon name="upload" /> Upload a script <Icon name="arrow" size={15} />
            </button>
            <button onClick={() => openSection('creators')}>
              <Icon name="community" /> Find collaborators <Icon name="arrow" size={15} />
            </button>
            <button onClick={() => addToast('info', 'Script contests', 'Pitch calls, grants, and festival submissions coming soon.')}>
              <Icon name="sparkle" /> Explore opportunities <Icon name="arrow" size={15} />
            </button>
            <input
              ref={uploadInput}
              className="script-visually-hidden"
              type="file"
              accept=".pdf,.fdx,.txt,.fountain"
              onChange={uploadScriptFile}
              aria-label="Upload a screenplay file"
            />
          </section>

          {/* WRITING STUDIO PANEL */}
          <section className="script-studio-panel">
            <div className="script-studio-header">
              <h2>PHOTO STUDIO</h2>
              <span>● READY</span>
            </div>

            <label className="script-project-select">
              CURRENT PROJECT
              <select
                value={selectedScriptIndex}
                onChange={(e) => setSelectedScriptIndex(Number(e.target.value))}
                aria-label="Current script project"
              >
                {projects.map((project, index) => (
                  <option key={`${project.title}-${index}`} value={index}>
                    {project.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="script-studio-tabs">
              <button
                className={activeStudioTab === 'Moodboard' ? 'selected' : ''}
                onClick={() => setActiveStudioTab('Moodboard')}
              >
                <Icon name="camera" size={15} /> Moodboard
              </button>
              <button
                className={activeStudioTab === 'Shot list' ? 'selected' : ''}
                onClick={() => {
                  setActiveStudioTab('Shot list')
                  addToast('info', 'Beat sheet', `Loaded beat outline for ${activeStudioProject.title}.`)
                }}
              >
                <Icon name="projects" size={15} /> Shot list
              </button>
              <button
                className={activeStudioTab === 'Notes' ? 'selected' : ''}
                onClick={() => {
                  setActiveStudioTab('Notes')
                  addToast('info', 'Room notes', `Loaded feedback and character notes for ${activeStudioProject.title}.`)
                }}
              >
                <Icon name="message" size={15} /> Notes
              </button>
            </div>

            <div className="script-moodboard">
              <div className="script-moodboard-card">
                <span className="beat-title">SCENE BEAT · ACT II CLIMAX</span>
                <p className="beat-desc">
                  {activeStudioProject.logline || 'A solitary lighthouse keeper uncovers a secret transmission from the deep sea.'}
                </p>
              </div>
              <div>
                <b>MOODBOARD · 04</b>
                <p>Soft light. Honest moments. A little bit of golden hour.</p>
              </div>
            </div>

            <div className="script-studio-tip">
              <Icon name="sparkle" size={16} />
              <div>
                <b>A little inspiration</b>
                <p>Try shooting through something — a window, a veil, a rainy windshield.</p>
              </div>
              <Icon name="arrow" size={14} />
            </div>

            <div className="script-studio-footer">
              <button onClick={() => addToast('success', 'Draft saved', `Draft notes for "${activeStudioProject.title}" saved.`)}>
                Save draft
              </button>
              <button onClick={() => addToast('success', 'Invite link copied', `Writers room invite link for "${activeStudioProject.title}" copied to clipboard.`)}>
                Invite team <Icon name="community" size={14} />
              </button>
            </div>
          </section>

          {/* WEEKLY STATS CARD */}
          <section className="script-weekly-card">
            <div className="script-weekly-icon">
              <Icon name="pen" size={18} />
            </div>
            <span className="script-eyebrow">YOUR WEEK IN FRAMES</span>
            <strong>6,240</strong>
            <p>people discovered your work this week</p>
            <div className="script-weekly-chart" aria-label="Words written rising through the week">
              {[24, 39, 31, 52, 43, 67, 56, 84, 71, 100, 78, 92].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <span className="script-weekly-growth">↗ 18% from last week</span>
          </section>
        </aside>
      </div>

      {/* START A SCRIPT MODAL */}
      {projectModalOpen && (
        <div
          className="script-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectModalOpen(false) }}
        >
          <form
            className="script-project-modal"
            onSubmit={createScript}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-script-title"
          >
            <button
              type="button"
              className="script-modal-close"
              aria-label="Close"
              onClick={() => setProjectModalOpen(false)}
            >
              <Icon name="close" size={19} />
            </button>
            <span className="script-eyebrow">MAKE ROOM FOR A NEW IDEA</span>
            <h2 id="new-script-title">Start a project</h2>
            <p>Give your shoot a name and we’ll help you find the right creative team.</p>

            <label htmlFor="script-name">PROJECT NAME</label>
            <input
              id="script-name"
              autoFocus
              maxLength={60}
              placeholder="e.g. The Last Light"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              required
            />

            <label htmlFor="script-type">PROJECT TYPE</label>
            <select
              id="script-type"
              value={projectType}
              onChange={(event) => setProjectType(event.target.value)}
            >
              <option>Feature</option>
              <option>Pilot</option>
              <option>Short Film</option>
              <option>Docuseries</option>
              <option>Limited Series</option>
              <option>Stage Play</option>
            </select>

            <label htmlFor="script-logline">LOGLINE / PREMISE</label>
            <textarea
              id="script-logline"
              maxLength={220}
              placeholder="What is the story about? Who is the protagonist and what do they desire?"
              value={projectLogline}
              onChange={(event) => setProjectLogline(event.target.value)}
            />

            <button type="submit" className="script-button script-button-yellow">
              CREATE PROJECT <Icon name="arrow" size={16} />
            </button>
          </form>
        </div>
      )}

      {/* SCREENPLAY READER / EXCERPT MODAL */}
      {readerModalScript && (
        <div
          className="script-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setReaderModalScript(null) }}
        >
          <div className="script-reader-modal" role="dialog" aria-modal="true">
            <button
              type="button"
              className="script-modal-close"
              aria-label="Close"
              onClick={() => setReaderModalScript(null)}
            >
              <Icon name="close" size={19} />
            </button>

            <span className="script-eyebrow">SCREENPLAY PREVIEW · {readerModalScript.pages}</span>
            <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-display)', fontSize: '32px' }}>
              {readerModalScript.title}
            </h2>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#656158' }}>
              Format: <b>{readerModalScript.type}</b> · Looking for: <b>{readerModalScript.need}</b>
            </p>

            <div style={{ padding: '12px 14px', background: '#fff', border: '1px solid #dcd4c4', borderRadius: '6px', fontSize: '11px', color: '#4a453c', fontStyle: 'italic' }}>
              "{readerModalScript.logline}"
            </div>

            <div className="script-reader-body">
              {readerModalScript.excerpt}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="script-button"
                style={{ background: '#fff' }}
                onClick={() => setReaderModalScript(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="script-button script-button-yellow"
                onClick={() => {
                  addToast('success', 'Writers Room Joined', `You have requested to join ${readerModalScript.title}.`)
                  setReaderModalScript(null)
                }}
              >
                Join Writers Room <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
