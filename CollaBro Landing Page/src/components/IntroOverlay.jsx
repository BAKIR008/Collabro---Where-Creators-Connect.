import { useEffect, useRef, useState } from 'react'

export default function IntroOverlay({ onComplete }) {
  const overlayRef = useRef()
  const leftFistRef = useRef()
  const rightFistRef = useRef()
  const logoRef = useRef()
  const taglineRef = useRef()
  const burstRef = useRef()
  const heartRef = useRef()
  const [phase, setPhase] = useState('start') // start | fists | burst | logo | done

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      onComplete()
      return
    }

    document.body.classList.add('intro-active')

    const timeline = [
      { delay: 200,  fn: () => setPhase('fists') },
      { delay: 900,  fn: () => setPhase('burst') },
      { delay: 1300, fn: () => setPhase('logo') },
      { delay: 2200, fn: () => {
        if (overlayRef.current) {
          overlayRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
          overlayRef.current.style.opacity = '0'
          overlayRef.current.style.transform = 'scale(1.04)'
        }
      }},
      { delay: 2750, fn: () => {
        document.body.classList.remove('intro-active')
        onComplete()
      }},
    ]

    const timers = timeline.map(({ delay, fn }) => setTimeout(fn, delay))
    return () => {
      timers.forEach(clearTimeout)
      document.body.classList.remove('intro-active')
    }
  }, [onComplete])

  return (
    <div className="intro-overlay" ref={overlayRef} aria-hidden="true">
      <div className="intro-scene">

        {/* Left fist */}
        <div
          ref={leftFistRef}
          className="intro-fist intro-fist-left"
          style={{
            transition: 'left 0.55s cubic-bezier(0.34,1.10,0.64,1), opacity 0.3s',
            left: phase === 'start' ? '-140px' : phase === 'fists' ? '60px' : '80px',
            opacity: phase === 'done' ? 0 : 1,
          }}
        >
          🤜
        </div>

        {/* Right fist */}
        <div
          ref={rightFistRef}
          className="intro-fist intro-fist-right"
          style={{
            transition: 'right 0.55s cubic-bezier(0.34,1.10,0.64,1), opacity 0.3s',
            right: phase === 'start' ? '-140px' : phase === 'fists' ? '60px' : '80px',
            opacity: phase === 'done' ? 0 : 1,
          }}
        >
          🤛
        </div>

        {/* Energy burst SVG */}
        <svg
          className="intro-energy"
          viewBox="0 0 420 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            opacity: phase === 'burst' || phase === 'logo' ? 1 : 0,
            transition: 'opacity 0.25s',
          }}
        >
          {/* Burst lines from center */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const cx = 210, cy = 140
            const r1 = 30, r2 = 80 + (i % 3) * 20
            return (
              <line
                key={angle}
                x1={cx + Math.cos(rad) * r1}
                y1={cy + Math.sin(rad) * r1}
                x2={cx + Math.cos(rad) * r2}
                y2={cy + Math.sin(rad) * r2}
                stroke={i % 3 === 0 ? '#7B38FF' : i % 3 === 1 ? '#FF3D9A' : '#FFD52E'}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  animation: phase === 'burst' || phase === 'logo'
                    ? `burstLine 0.5s ${i * 0.03}s ease-out forwards`
                    : 'none',
                  opacity: 0,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              />
            )
          })}
          {/* Small heart */}
          <text
            x="205"
            y="148"
            fontSize="22"
            style={{
              opacity: phase === 'burst' || phase === 'logo' ? 1 : 0,
              transition: 'opacity 0.3s 0.2s',
            }}
          >
            ❤️
          </text>
        </svg>

        {/* Logo */}
        <div
          ref={logoRef}
          className="intro-logo"
          style={{
            opacity: phase === 'logo' ? 1 : 0,
            transform: phase === 'logo' ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20px)',
            transition: 'opacity 0.45s cubic-bezier(0.34,1.56,0.64,1), transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          COLLAB<span className="logo-o">R</span>O
        </div>
      </div>

      <div
        ref={taglineRef}
        className="intro-tagline"
        style={{
          opacity: phase === 'logo' ? 1 : 0,
          transition: 'opacity 0.4s 0.3s ease',
        }}
      >
        THE CREATORS HUB
      </div>

      <style>{`
        @keyframes burstLine {
          0%   { opacity: 0; transform: scaleX(0); }
          60%  { opacity: 1; }
          100% { opacity: 0.3; transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
