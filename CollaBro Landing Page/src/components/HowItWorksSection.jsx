import { useEffect, useRef } from 'react'

const steps = [
  {
    num: '01',
    label: 'Create',
    title: 'CREATE YOUR IDENTITY',
    body: 'Build a creator profile that shows your skills, work, style, and availability. Your creative identity, all in one place.',
    icon: '👤',
    emoji: '🎨',
    color: 'var(--yellow)',
  },
  {
    num: '02',
    label: 'Discover',
    title: 'DISCOVER YOUR PEOPLE',
    body: 'Find creators by skill, category, location, experience, and collaboration needs. The right match, not just the most popular.',
    icon: '🔍',
    emoji: '🌐',
    color: 'var(--cyan)',
  },
  {
    num: '03',
    label: 'Connect',
    title: 'MAKE THE CONNECT',
    body: 'Send structured collaboration requests instead of vague DMs. Role, scope, budget, deadline—all in one message.',
    icon: '✉️',
    emoji: '✈️',
    color: 'var(--magenta)',
  },
  {
    num: '04',
    label: 'Collaborate',
    title: 'BUILD SOMETHING REAL',
    body: 'Turn conversations into creative projects with clear roles, deadlines, and outcomes. Make work worth sharing.',
    icon: '🛠️',
    emoji: '🚀',
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
                {step.icon}
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
                  fontSize: '32px',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                }}
                aria-hidden="true"
              >
                {step.emoji}
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
