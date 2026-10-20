/* ── Inline SVG social icons (no external library) ─────────────── */
const IcoInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const IcoLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const IcoGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="none" />
  </svg>
)

/* ── Data ──────────────────────────────────────────────────────── */

// Platform links — real section anchors only
const platformLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Creator Types', href: '#for-creators' },
  { label: 'Discover', href: '#discover' },
  { label: 'Workflow', href: '#workflow' },
]

// Company links — future pages, no pages built yet
const companyLinks = [
  { label: 'About', href: '#', future: true },
  { label: 'Contact', href: '#', future: true },
]

// Social links — real URLs
const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bakirali_184301?mdxt=MXYyaG5kNDF0MWc0NA==',
    Icon: IcoInstagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/bakirali-kachwala-446595405',
    Icon: IcoLinkedIn,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/BAKIR008',
    Icon: IcoGitHub,
  },
]

/* ── Smooth-scroll handler for anchor links ───────────────────── */
function scrollToSection(href) {
  if (!href || href === '#') return
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ── Component ────────────────────────────────────────────────── */
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

            {/* Loop line — dash separator replaces heart emoji */}
            <div className="footer-loop-line" aria-label="Core loop">
              <span className="footer-loop-dash" aria-hidden="true" />
              <span>CREATE → DISCOVER → CONNECT → COLLABORATE</span>
            </div>
          </div>

          {/* Platform links — real section anchors */}
          <div className="footer-nav-col">
            <h4>Platform</h4>
            <ul role="list">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(href) }}
                    aria-label={`Go to ${label} section`}
                    className="footer-anchor-link"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links — future pages, clearly noted in code */}
          <div className="footer-nav-col">
            <h4>Company</h4>
            <ul role="list">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  {/* data-future-page: connect to real route once pages are built */}
                  <button
                    type="button"
                    data-future-page={label.toLowerCase()}
                    aria-label={`${label} — coming soon`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Follow column */}
          <div className="footer-nav-col">
            <h4>Follow</h4>
            <ul role="list">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow CollaBro on ${label}`}
                    className="footer-anchor-link footer-social-follow"
                  >
                    <span className="footer-social-follow-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © {new Date().getFullYear()} COLLABRO · The Creators Hub · All rights reserved
          </p>

          {/* Social icon buttons */}
          <div className="footer-socials" aria-label="Social media links">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={`Follow CollaBro on ${label}`}
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Attribution — Shinbyz bold + cyan, no emoji */}
          <p className="footer-bottom-text">
            Built with <strong><span className="footer-shinbyz">Shinbyz</span></strong> Minds.
          </p>
        </div>
      </div>
    </footer>
  )
}
