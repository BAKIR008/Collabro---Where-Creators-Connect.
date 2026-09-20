const platformLinks = ['Discover', 'Creators', 'Projects', 'Community']
const companyLinks = ['About', 'Contact', 'Blog', 'Careers']
const socialLinks = [
  { icon: '📷', label: 'Instagram' },
  { icon: '▶', label: 'YouTube' },
  { icon: '💼', label: 'LinkedIn' },
  { icon: '𝕏', label: 'X / Twitter' },
]

export default function Footer() {
  return (
    <footer className="footer" aria-label="Collabro footer">
      <div className="container">
        <div className="footer-top">

          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-wordmark" aria-label="COLLABRO">
              COLLAB<span style={{ color: 'var(--purple)' }}>R</span>O
            </div>
            <div className="footer-tagline">The Creators Hub</div>

            <p style={{ fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.7, maxWidth: '280px' }}>
              A creative collaboration platform being built for people who make things. Find your people. Build something real.
            </p>

            <p className="footer-statement">Made for people who make things.</p>

            <div className="footer-loop-line" aria-label="Core loop">
              <span className="footer-loop-heart" aria-hidden="true">♥</span>
              <span>CREATE → DISCOVER → CONNECT → COLLABORATE</span>
            </div>
          </div>

          {/* Platform links */}
          <div className="footer-nav-col">
            <h4>Platform</h4>
            <ul role="list">
              {platformLinks.map(link => (
                <li key={link}>
                  <button
                    type="button"
                    aria-label={`${link} — placeholder`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="footer-nav-col">
            <h4>Company</h4>
            <ul role="list">
              {companyLinks.map(link => (
                <li key={link}>
                  <button
                    type="button"
                    aria-label={`${link} — placeholder`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="footer-nav-col">
            <h4>Follow</h4>
            <ul role="list">
              {socialLinks.map(({ icon, label }) => (
                <li key={label}>
                  <button
                    type="button"
                    aria-label={`${label} — placeholder`}
                    onClick={(e) => e.preventDefault()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span aria-hidden="true">{icon}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2024 COLLABRO · The Creators Hub · All rights reserved
          </p>

          <div className="footer-socials" aria-label="Social media links (placeholders)">
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
          </div>

          <p className="footer-bottom-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with
            <span style={{ color: 'var(--magenta)', animation: 'heartbeat 1.5s ease-in-out infinite' }}>♥</span>
            for creators
          </p>
        </div>
      </div>
    </footer>
  )
}
