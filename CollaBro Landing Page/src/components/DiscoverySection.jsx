import { useEffect, useRef, useState } from 'react'

const filterChips = [
  'Video Editing', 'Photography', 'Motion Design',
  'Remote', 'Delhi', 'Available Now', 'Paid Projects',
]

const profileCards = [
  {
    emoji: '🎬',
    name: 'Aarav Mehta',
    role: 'Video Editor · Motion Designer',
    skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    status: 'Available for collaboration',
    avatarBg: 'var(--cyan)',
  },
  {
    emoji: '📸',
    name: 'Meera Kapoor',
    role: 'Photographer · Visual Storyteller',
    skills: ['Portraits', 'Fashion', 'Product Shoots'],
    status: 'Open to creative projects',
    avatarBg: 'var(--magenta)',
  },
  {
    emoji: '🎵',
    name: 'Kabir Shah',
    role: 'Music Producer · Sound Designer',
    skills: ['Ableton Live', 'Mixing', 'Sound Design'],
    status: 'Looking for visual collaborators',
    avatarBg: 'var(--purple)',
  },
]

const SEARCH_TEXT = 'Video editor for fashion campaign...'

export default function DiscoverySection() {
  const [typedText, setTypedText] = useState('')
  const [activeChip, setActiveChip] = useState('Video Editing')
  const sectionRef = useRef()
  const hasAnimated = useRef(false)

  // Typewriter effect triggered on scroll-into-view
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let i = 0
          const interval = setInterval(() => {
            setTypedText(SEARCH_TEXT.slice(0, i + 1))
            i++
            if (i >= SEARCH_TEXT.length) clearInterval(interval)
          }, 48)
        }
      },
      { threshold: 0.25 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="discovery-section section-padding"
      id="discover"
      aria-labelledby="discover-heading"
    >
      <div className="container">
        <p className="section-eyebrow">Discovery</p>
        <h2 id="discover-heading" className="section-heading">
          NOT JUST A FEED.<br />
          <span className="highlight-cyan">A WAY TO FIND</span><br />
          THE RIGHT PERSON.
        </h2>
        <p style={{ fontSize: '17px', color: '#3a3530', maxWidth: '520px', lineHeight: 1.75, marginBottom: '8px' }}>
          Search by skill, discipline, location, and availability. Discover the collaborator your next project actually needs.
        </p>

        <div className="discovery-demo" role="region" aria-label="Creator discovery interface demo">

          {/* Search bar */}
          <div className="discovery-search-bar">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <div
              className="search-input-mock"
              aria-label={`Search demo: ${typedText}`}
              role="textbox"
              aria-readonly="true"
            >
              {typedText}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              aria-label="Search creators — placeholder"
              style={{ flexShrink: 0 }}
            >
              Search
            </button>
          </div>

          {/* Filter chips */}
          <div className="filter-chips" role="group" aria-label="Filter options (visual demo)">
            {filterChips.map(chip => (
              <button
                key={chip}
                type="button"
                className={`filter-chip ${activeChip === chip ? 'active' : ''}`}
                aria-pressed={activeChip === chip}
                aria-label={`Filter by ${chip} — placeholder`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Creator cards */}
          <div className="creator-cards-grid" role="list" aria-label="Example creator profiles">
            {profileCards.map((p, i) => (
              <article
                key={p.name}
                className="profile-card"
                role="listitem"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Scan-line overlay */}
                <div className="profile-card-scanline" aria-hidden="true" />

                {/* Header */}
                <div className="profile-card-header">
                  <div
                    className="profile-avatar"
                    style={{ background: p.avatarBg }}
                    aria-hidden="true"
                  >
                    {p.emoji}
                  </div>
                  <div className="profile-info">
                    <h4>{p.name}</h4>
                    <p className="profile-role">{p.role}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="profile-skills" aria-label={`Skills: ${p.skills.join(', ')}`}>
                  {p.skills.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>

                {/* Status */}
                <div className="profile-status">
                  <div className="profile-status-dot" aria-hidden="true" />
                  <span>{p.status}</span>
                </div>

                {/* Action */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  aria-label={`Collaborate with ${p.name} — placeholder`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Collaborate ✦
                </button>
              </article>
            ))}
          </div>
        </div>

        <p
          style={{
            marginTop: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--gray-dark)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
          aria-label="Note: Discovery is a product vision, not a live feature"
        >
          ✦ Creator discovery is part of the Collabro vision — coming soon
        </p>
      </div>
    </section>
  )
}
