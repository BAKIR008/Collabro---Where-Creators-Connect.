import { useEffect, useRef, useState } from 'react'
import { AUTH_APP_URL } from '../config'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = ['Discover', 'How It Works', 'For Creators', 'Projects', 'Community']

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      style={{
        animation: 'navDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) 2.8s both',
      }}
    >
      <div className="navbar-inner">

        {/* Logo */}
        <div className="navbar-logo">
          <span className="navbar-wordmark" aria-label="COLLABRO">
            COLLAB<span className="logo-accent">R</span>O
          </span>
          <span className="navbar-badge" aria-label="The Creators Hub">
            The Creators Hub
          </span>
        </div>

        {/* Nav links */}
        <ul className="navbar-nav" role="list">
          {navLinks.map((link) => (
            <li key={link}>
              <button
                type="button"
                aria-label={link}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <a
            href={`${AUTH_APP_URL}/login`}
            className="btn btn-outline btn-sm"
            aria-label="Log in to Collabro"
          >
            Log In
          </a>
          <a
            href={`${AUTH_APP_URL}/signup`}
            className="btn btn-primary btn-sm"
            aria-label="Join Collabro"
          >
            Join Collabro ✦
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-nav-btn"
            aria-label="Open navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Scrolled highlight line */}
      <div className="navbar-highlight-line" aria-hidden="true" />

      <style>{`
        @keyframes navDrop {
          0%   { opacity: 0; transform: translateY(-24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
