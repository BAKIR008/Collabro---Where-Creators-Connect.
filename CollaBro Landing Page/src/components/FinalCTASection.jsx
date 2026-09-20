import { Suspense, lazy } from 'react'

const CollabUniverse = lazy(() => import('./CollabUniverse'))

export default function FinalCTASection() {
  return (
    <section
      className="cta-section section-padding"
      id="join"
      aria-labelledby="cta-heading"
    >
      {/* Background glow */}
      <div className="cta-bg-glow" aria-hidden="true" />

      {/* Mini 3D scene */}
      <div className="cta-canvas-wrap" aria-label="Collabro 3D collaboration universe" role="img">
        <Suspense fallback={null}>
          <CollabUniverse isHero={false} />
        </Suspense>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <p className="section-eyebrow" style={{ color: 'var(--gray-mid)', justifyContent: 'center' }}>
          Ready to Create?
        </p>

        <h2 id="cta-heading" className="section-heading">
          YOUR NEXT GREAT IDEA<br />
          NEEDS THE <span className="word-yellow">RIGHT PEOPLE.</span>
        </h2>

        <p className="cta-body">
          Build your creator identity. Find your collaborators. Make something worth sharing.
        </p>

        <div className="cta-buttons">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            aria-label="Join Collabro — placeholder"
            style={{ fontSize: '18px', padding: '20px 44px' }}
          >
            Join Collabro ✦
          </button>
          <button
            type="button"
            className="btn btn-cyan btn-lg"
            aria-label="Explore the Hub — placeholder"
            style={{ fontSize: '18px', padding: '20px 44px' }}
          >
            Explore the Hub →
          </button>
        </div>

        <p className="cta-handwritten" aria-label="No more scattered DMs. Just better creative collisions.">
          ✎ No more scattered DMs. Just better creative collisions.
        </p>

        {/* Loop */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '40px',
          flexWrap: 'wrap',
        }} aria-label="Core loop: Create, Discover, Connect, Collaborate">
          {['CREATE', 'DISCOVER', 'CONNECT', 'COLLABORATE'].map((word, i) => (
            <span key={word} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: ['var(--yellow)', 'var(--cyan)', 'var(--magenta)', 'var(--purple)'][i],
                letterSpacing: '0.06em',
              }}>
                {word}
              </span>
              {i < 3 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
