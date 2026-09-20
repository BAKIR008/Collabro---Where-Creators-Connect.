import { Suspense, lazy } from 'react'

// Lazy-load the heavy 3D canvas
const CollabUniverse = lazy(() => import('./CollabUniverse'))

const creatorLabels = [
  { text: 'VIDEO EDITOR', color: '#45D7FF' },
  { text: 'PHOTOGRAPHER', color: '#FFD52E' },
  { text: 'MOTION DESIGNER', color: '#FF3D9A' },
  { text: 'MUSIC PRODUCER', color: '#7B38FF', textColor: '#fff' },
  { text: 'UI/UX DESIGNER', color: '#FFD52E' },
  { text: '3D ARTIST', color: '#0B0B0B', textColor: '#fff' },
]

function Canvas3DFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--black)',
        borderRadius: 'var(--radius-lg)',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ fontSize: '64px' }}>🌐</div>
      <p style={{ color: 'var(--gray-mid)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.1em' }}>
        COLLABRO UNIVERSE
      </p>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="hero" id="hero" aria-label="Hero section">
      {/* Grid background */}
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-inner">
        {/* ---- LEFT: Text content ---- */}
        <div className="hero-content">

          {/* Eyebrow */}
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Creators, meet your next collaboration.
          </p>

          {/* Main headline */}
          <h1 className="hero-headline" aria-label="Create Together. Louder.">
            <span className="hero-headline-word">
              <span>
                <span className="word-highlight">CREATE</span>
              </span>
            </span>
            <span className="hero-headline-word">
              <span>TOGETHER.</span>
            </span>
            <span className="hero-headline-word">
              <span>
                <span className="word-highlight-cyan">LOUDER.</span>
              </span>
            </span>
          </h1>

          {/* Supporting copy */}
          <p className="hero-body">
            Collabro brings creators, skills, portfolios, and opportunities into one place—so the right idea can find the right people.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              aria-label="Join Collabro — placeholder"
            >
              Join Collabro ✦
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              aria-label="Explore Creators — placeholder"
            >
              Explore Creators →
            </button>
          </div>

          {/* Creator skill labels */}
          <div className="hero-creator-labels" role="list" aria-label="Creator types on Collabro">
            {creatorLabels.map(({ text, color, textColor }) => (
              <span
                key={text}
                className="creator-label"
                role="listitem"
                style={{
                  background: color,
                  color: textColor || 'var(--black)',
                }}
              >
                {text}
              </span>
            ))}
            <span
              className="creator-label available"
              role="listitem"
            >
              ● Available for Collab
            </span>
          </div>

          {/* Handwritten note */}
          <p className="hero-handwritten" aria-label="Made for creative collisions">
            ✏ Made for creative collisions
          </p>

          {/* Scroll indicator */}
          <div className="hero-scroll-indicator" aria-hidden="true" style={{ marginTop: '32px' }}>
            <span className="scroll-plane">✈</span>
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* ---- RIGHT: 3D Scene ---- */}
        <div className="hero-canvas-wrap" aria-label="Interactive 3D Collaboration Universe" role="img">

          {/* Corner stickers */}
          <div className="hero-canvas-corner-sticker">
            <span className="sticker sticker-yellow">LIVE ●</span>
          </div>
          <div className="hero-canvas-bottom-sticker">
            <span className="sticker sticker-black">3D COLLAB UNIVERSE</span>
          </div>

          {/* Animated dotted SVG paths overlaid on canvas */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
            aria-hidden="true"
          >
            <path
              d="M 60 80 Q 150 40 240 120 Q 320 180 400 100"
              fill="none"
              stroke="rgba(255,213,46,0.35)"
              strokeWidth="1.5"
              className="dotted-path"
            />
            <path
              d="M 80 200 Q 160 260 260 200 Q 340 140 420 220"
              fill="none"
              stroke="rgba(69,215,255,0.3)"
              strokeWidth="1.5"
              className="dotted-path"
              style={{ animationDelay: '-2s' }}
            />
          </svg>

          {/* 3D Canvas */}
          <Suspense fallback={<Canvas3DFallback />}>
            <CollabUniverse isHero={true} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
