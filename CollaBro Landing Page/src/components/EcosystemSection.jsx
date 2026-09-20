import { useEffect, useRef } from 'react'

const creators = [
  { emoji: '🎥', label: 'Video Creators' },
  { emoji: '🎬', label: 'Video Editors' },
  { emoji: '🎨', label: 'Designers' },
  { emoji: '📸', label: 'Photographers' },
  { emoji: '🎵', label: 'Musicians' },
  { emoji: '💃', label: 'Dancers' },
  { emoji: '✍️', label: 'Writers' },
  { emoji: '🖼️', label: 'Animators' },
  { emoji: '🧊', label: '3D Artists' },
  { emoji: '🎞️', label: 'Cinematographers' },
  { emoji: '🌟', label: 'Creative Directors' },
  { emoji: '📱', label: 'Social Media Managers' },
]

export default function EcosystemSection() {
  const cardRefs = useRef([])

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0) scale(1) rotate(0deg)'
            }, i * 60)
          }
        },
        { threshold: 0.08 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section
      className="ecosystem-section section-padding"
      id="for-creators"
      aria-labelledby="ecosystem-heading"
    >
      <div className="container">
        <p className="section-eyebrow">Who It's For</p>
        <h2 id="ecosystem-heading" className="section-heading">
          WHATEVER YOU CREATE,<br />
          <span style={{ color: 'var(--yellow)' }}>YOU BELONG HERE.</span>
        </h2>
        <p style={{
          color: 'var(--gray-mid)',
          fontSize: '17px',
          maxWidth: '520px',
          marginBottom: '8px',
          lineHeight: 1.7,
        }}>
          Collabro is home to every kind of creator. If you make things, this platform was built for you.
        </p>

        <div className="creator-grid" role="list">
          {creators.map((c, i) => (
            <div
              key={c.label}
              ref={el => cardRefs.current[i] = el}
              className="creator-card"
              role="listitem"
              style={{
                opacity: 0,
                transform: `translateY(28px) scale(0.92) rotate(${(i % 3 - 1) * 1.5}deg)`,
                transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Background color blob */}
              <div className="creator-card-bg" aria-hidden="true" />

              <span className="creator-card-emoji" aria-hidden="true">{c.emoji}</span>
              <h4>{c.label}</h4>
              <div
                className="creator-card-badge"
                aria-label={`${c.label}: open for collaboration`}
              >
                Open for Collab
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
