import { useEffect, useRef } from 'react'

const chaosFragments = [
  { sender: 'Instagram DM', msg: 'Hey!! need a video editor asap 🙏', rotate: '-2deg', ml: '0' },
  { sender: 'WhatsApp', msg: 'Portfolio link?? Can u send?', rotate: '1.5deg', ml: '24px' },
  { sender: 'Random email', msg: 'Hi, saw ur work on LinkedIn…', rotate: '-1deg', ml: '8px' },
  { sender: 'Payment screenshot', msg: '₹5000 transferred ✓  (proof?)', rotate: '2deg', ml: '32px' },
  { sender: 'Loose file link', msg: 'drive.google.com/file/d/1xZa…', rotate: '-0.5deg', ml: '0' },
]

const connectedItems = [
  { icon: '👤', label: 'Creator Profile · Skills · Availability' },
  { icon: '🔍', label: 'Smart Discovery · Filters · Match' },
  { icon: '✉️', label: 'Collaboration Request · Role · Budget' },
  { icon: '📋', label: 'Project Space · Tasks · Milestones' },
  { icon: '✅', label: 'Clear Outcome · Reputation Built' },
]

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) ref.current.classList.add('in-view') },
      { threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
}

export default function ProblemSection() {
  const headingRef = useRef()
  const bodyRef = useRef()
  const visualRef = useRef()
  useReveal(headingRef)
  useReveal(bodyRef)
  useReveal(visualRef)

  return (
    <section className="problem-section section-padding" id="problem" aria-labelledby="problem-heading">
      <div className="container">

        <p className="section-eyebrow">The Problem</p>

        <h2
          id="problem-heading"
          ref={headingRef}
          className="section-heading reveal"
        >
          CREATIVE WORK SHOULDN'T<br />
          LIVE IN <span className="highlight-magenta">SCATTERED DMS.</span>
        </h2>

        <p
          ref={bodyRef}
          className="reveal reveal-delay-1"
          style={{ maxWidth: '600px', fontSize: '17px', color: '#3a3530', lineHeight: 1.75, marginBottom: '8px' }}
        >
          Creators currently jump between Instagram DMs, WhatsApp chats, random portfolios, payment screenshots, and personal contacts just to find the right person for one project.
        </p>

        {/* Chaos ←→ Connected visual */}
        <div ref={visualRef} className="problem-visual reveal reveal-delay-2">

          {/* CHAOS side */}
          <div className="chaos-zone" style={{ position: 'relative' }}>
            <div className="stamp stamp-messy" aria-label="Messy">MESSY</div>
            {chaosFragments.map((f, i) => (
              <div
                key={i}
                className="chaos-fragment"
                style={{
                  transform: `rotate(${f.rotate})`,
                  marginLeft: f.ml,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <span className="sender">{f.sender}</span>
                {f.msg}
              </div>
            ))}
            {/* Dotted chaotic paths */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.25 }}
              aria-hidden="true"
            >
              <path d="M 40 60 Q 120 30 80 120 Q 50 180 160 150" fill="none" stroke="#FF3D9A" strokeWidth="1.5" strokeDasharray="4 6" />
              <path d="M 100 40 Q 200 80 160 200" fill="none" stroke="#0B0B0B" strokeWidth="1" strokeDasharray="3 5" />
            </svg>
          </div>

          {/* Arrow */}
          <div className="problem-arrow" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32 }}>
              <path d="M4 16 H28 M20 8 L28 16 L20 24" stroke="#7B38FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '13px', textAlign: 'center', lineHeight: 1.3 }}>
              one<br />place
            </span>
          </div>

          {/* CONNECTED side */}
          <div className="connected-zone" style={{ position: 'relative' }}>
            <div className="stamp stamp-connected" style={{ right: '-10px', top: '-12px' }} aria-label="Connected">
              CONNECTED
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              ─── Collabro Platform ───
            </p>
            {connectedItems.map((item, i) => (
              <div key={i} className="connected-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="connected-item-icon">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
