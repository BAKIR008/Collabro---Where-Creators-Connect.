import { useEffect, useRef } from 'react'

/* Inline SVG icons — no external library needed */
const IcoProfile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const IcoMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IcoTools = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
  </svg>
)

/* Decorative visual SVGs for each step card */
const VisPalette = () => (
  <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2" />
    <circle cx="20" cy="24" r="4" fill="currentColor" opacity="0.7" />
    <circle cx="44" cy="24" r="4" fill="currentColor" opacity="0.7" />
    <circle cx="20" cy="40" r="4" fill="currentColor" opacity="0.5" />
    <circle cx="44" cy="40" r="4" fill="currentColor" opacity="0.5" />
    <circle cx="32" cy="44" r="4" fill="currentColor" opacity="0.9" />
  </svg>
)

const VisGlobe = () => (
  <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="32" cy="32" rx="10" ry="22" stroke="currentColor" strokeWidth="1.5" />
    <line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="1.5" />
    <line x1="14" y1="20" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="14" y1="44" x2="50" y2="44" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const VisPaperPlane = () => (
  <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
    <path d="M8 8l48 24-48 24 8-24L8 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="16" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const VisRocket = () => (
  <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
    <path d="M32 8c0 0 16 8 16 28H16C16 16 32 8 32 8z" stroke="currentColor" strokeWidth="2" />
    <rect x="22" y="36" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M22 44l-8 8M42 44l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="24" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const steps = [
  {
    num: '01',
    label: 'Create',
    title: 'CREATE YOUR IDENTITY',
    body: 'Build a creator profile that shows your skills, work, style, and availability. Your creative identity, all in one place.',
    Icon: IcoProfile,
    Visual: VisPalette,
    color: 'var(--yellow)',
  },
  {
    num: '02',
    label: 'Discover',
    title: 'DISCOVER YOUR PEOPLE',
    body: 'Find creators by skill, category, location, experience, and collaboration needs. The right match, not just the most popular.',
    Icon: IcoSearch,
    Visual: VisGlobe,
    color: 'var(--cyan)',
  },
  {
    num: '03',
    label: 'Connect',
    title: 'MAKE THE CONNECT',
    body: 'Send structured collaboration requests instead of vague DMs. Role, scope, budget, deadline—all in one message.',
    Icon: IcoMessage,
    Visual: VisPaperPlane,
    color: 'var(--magenta)',
  },
  {
    num: '04',
    label: 'Collaborate',
    title: 'BUILD SOMETHING REAL',
    body: 'Turn conversations into creative projects with clear roles, deadlines, and outcomes. Make work worth sharing.',
    Icon: IcoTools,
    Visual: VisRocket,
    color: 'var(--purple)',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useRef()
  const stepRefs = useRef([])

  useEffect(() => {
    const observers = stepRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('in-view'), i * 120)
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="how-section section-padding"
      id="how-it-works"
      aria-labelledby="how-heading"
    >
      <div className="container">
        <p className="section-eyebrow">How It Works</p>
        <h2 id="how-heading" className="section-heading">
          YOUR CREATIVE LOOP,<br />
          <span className="highlight-yellow">ALL IN ONE PLACE.</span>
        </h2>

        {/* Loop labels */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            alignItems: 'center',
          }}
          aria-label="Core product loop"
        >
          {['CREATE', 'DISCOVER', 'CONNECT', 'COLLABORATE'].map((label, i) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="sticker"
                style={{
                  background: [
                    'var(--yellow)', 'var(--cyan)', 'var(--magenta)', 'var(--purple)'
                  ][i],
                  color: i === 3 ? 'var(--white)' : 'var(--black)',
                }}
              >
                {label}
              </span>
              {i < 3 && (
                <span style={{ color: 'var(--gray-mid)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>→</span>
              )}
            </span>
          ))}
        </div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={el => stepRefs.current[i] = el}
              className="how-step reveal"
              style={{ '--step-color': step.color }}
            >
              {/* Large background number */}
              <div className="how-step-number" aria-hidden="true">{step.num}</div>

              {/* Icon box */}
              <div className="how-step-icon" aria-hidden="true">
                <step.Icon />
              </div>

              <p className="how-step-label">Step {step.num} · {step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>

              {/* Mini animated visual */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px',
                  background: `${step.color}18`,
                  border: `2px solid ${step.color}40`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                  color: step.color,
                }}
                aria-hidden="true"
              >
                <step.Visual />
              </div>

              {/* Connector arrow (not last) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: '32px',
                    height: '32px',
                    background: 'var(--black)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--yellow)',
                    fontSize: '14px',
                    border: 'var(--border)',
                  }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  )
}
