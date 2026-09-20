const portfolioTiles = [
  { emoji: '🎬', bg: 'var(--cyan)', label: 'Film project' },
  { emoji: '📸', bg: 'var(--magenta)', label: 'Photo series' },
  { emoji: '🎨', bg: 'var(--purple)', label: 'Design work' },
  { emoji: '🎵', bg: 'var(--yellow)', label: 'Music track' },
  { emoji: '✍️', bg: 'var(--offwhite)', label: 'Written piece' },
  { emoji: '🌐', bg: 'var(--black)', label: '3D project' },
]

const socialLinks = [
  { icon: '📷', label: 'Instagram' },
  { icon: '▶', label: 'YouTube' },
  { icon: '💼', label: 'LinkedIn' },
  { icon: '🔗', label: 'Portfolio link' },
]

export default function ProfileShowcaseSection() {
  return (
    <section
      className="profile-section section-padding"
      id="profile"
      aria-labelledby="profile-heading"
    >
      <div className="container">
        <div className="profile-showcase-inner">

          {/* Left: Text */}
          <div>
            <p className="section-eyebrow" style={{ color: '#4a4030' }}>Creator Profile</p>
            <h2 id="profile-heading" className="section-heading">
              YOUR WORK DESERVES MORE<br />
              THAN A <span style={{ background: 'var(--black)', color: 'var(--yellow)', padding: '0 10px' }}>LINK IN BIO.</span>
            </h2>
            <p style={{ fontSize: '17px', color: '#3a3020', lineHeight: 1.75, maxWidth: '400px', marginBottom: '28px' }}>
              Build a creator profile that shows what you make, what you need, and who gets it.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🎯', text: 'Show what you make.' },
                { icon: '🤝', text: 'Show what you need.' },
                { icon: '✨', text: 'Find the people who get it.' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: 'var(--black)',
                    border: 'var(--border)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-brutal)',
                  }} aria-hidden="true">
                    {icon}
                  </div>
                  <p style={{ fontFamily: 'var(--font-hand)', fontSize: '18px', color: '#2a2018' }}>{text}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              style={{ marginTop: '32px' }}
              aria-label="Build your creator profile — placeholder"
            >
              Build Your Profile →
            </button>

            <p style={{
              marginTop: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: '#6a5e4a',
              textTransform: 'uppercase',
            }}>
              ✦ Profiles are part of the Collabro platform vision
            </p>
          </div>

          {/* Right: Mock profile card */}
          <div>
            <div className="profile-mock-card">

              {/* Top dark header */}
              <div className="profile-mock-top">
                <div className="profile-mock-avatar" aria-hidden="true">🎬</div>
                <div>
                  <div className="profile-mock-name">Aryan Verma</div>
                  <div className="profile-mock-role">Filmmaker · Motion Designer</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {['After Effects', 'Premiere Pro', 'Cinema 4D'].map(s => (
                      <span key={s} style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        padding: '3px 8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '3px',
                        color: 'rgba(255,255,255,0.75)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Status badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '10px',
                    background: 'rgba(69, 215, 255, 0.15)',
                    border: '1px solid rgba(69, 215, 255, 0.35)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    color: '#45D7FF',
                    textTransform: 'uppercase',
                  }} aria-label="Available for collaboration">
                    <span style={{ width: '6px', height: '6px', background: '#45D7FF', borderRadius: '50%', animation: 'pulse 2s infinite' }} aria-hidden="true" />
                    Available for Collaboration
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="profile-mock-body">
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: 'var(--gray-dark)',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Portfolio
                </p>

                <div
                  className="profile-mock-portfolio"
                  role="list"
                  aria-label="Portfolio tiles (visual demo)"
                >
                  {portfolioTiles.map((tile, i) => (
                    <div
                      key={i}
                      className="portfolio-tile"
                      role="listitem"
                      style={{ background: tile.bg, color: tile.bg === 'var(--black)' ? 'white' : 'var(--black)' }}
                      aria-label={tile.label}
                    >
                      {tile.emoji}
                    </div>
                  ))}
                </div>

                {/* Social links row */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: 'var(--border)',
                }}>
                  {socialLinks.map(({ icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="footer-social-btn"
                      aria-label={`${label} — placeholder`}
                    >
                      {icon}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ marginLeft: 'auto' }}
                    aria-label="Collaborate — placeholder"
                  >
                    Collaborate
                  </button>
                </div>
              </div>
            </div>

            {/* Tape strip decoration */}
            <div aria-hidden="true" style={{
              position: 'relative',
              marginTop: '-8px',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'rgba(255,213,46,0.55)',
                height: '18px',
                width: '90px',
                borderRadius: '2px',
                transform: 'rotate(-2deg)',
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
