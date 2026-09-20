const bentoItems = [
  {
    icon: '👤',
    title: 'PROFESSIONAL CREATOR IDENTITY',
    body: 'Skills, work, availability, and creative personality in one place. Not just a link in bio.',
    featured: false,
    tag: null,
    bg: 'var(--white)',
  },
  {
    icon: '🔍',
    title: 'SMART DISCOVERY',
    body: 'Find collaborators based on compatibility—not popularity. Skills, location, style, and availability matter here.',
    featured: true,
    tag: null,
    bg: 'var(--black)',
  },
  {
    icon: '✉️',
    title: 'STRUCTURED COLLABORATION',
    body: 'Bring role, requirements, budget, and deadline into the conversation from day one.',
    featured: false,
    tag: null,
    bg: 'var(--white)',
  },
  {
    icon: '📋',
    title: 'PROJECT WORKSPACES',
    body: 'Future-ready spaces for members, tasks, files, and milestones. One home for the whole project.',
    featured: false,
    tag: 'COMING IN THE COLLABRO JOURNEY',
    bg: 'var(--white)',
  },
  {
    icon: '🏆',
    title: 'TRUST THAT MEANS SOMETHING',
    body: 'Collaboration history and reliability—not shallow vanity metrics or follower counts.',
    featured: false,
    tag: 'PLANNED',
    bg: 'var(--white)',
  },
  {
    icon: '💬',
    title: 'CREATIVE COMMUNICATION',
    body: 'Keep project conversations connected to the actual work. No more scattered DMs.',
    featured: false,
    tag: 'PLANNED',
    bg: 'var(--white)',
  },
]

export default function BentoGridSection() {
  return (
    <section
      className="bento-section section-padding"
      id="features"
      aria-labelledby="bento-heading"
    >
      <div className="container">
        <p className="section-eyebrow">Platform Vision</p>
        <h2 id="bento-heading" className="section-heading">
          BUILT FOR MORE<br />
          THAN <span className="highlight-yellow">FOLLOWERS.</span>
        </h2>
        <p style={{ fontSize: '17px', color: '#3a3530', maxWidth: '540px', lineHeight: 1.75, marginBottom: '8px' }}>
          Collabro is designed around what creators actually need—not what the algorithm rewards.
        </p>

        <div className="bento-grid" role="list" aria-label="Platform feature overview">
          {bentoItems.map((item, i) => (
            <div
              key={item.title}
              className={`bento-card ${item.featured ? 'featured' : ''}`}
              role="listitem"
              style={{
                background: item.bg,
                animation: `bentoIn 0.6s ${i * 0.08}s cubic-bezier(0.34,1.10,0.64,1) both`,
              }}
            >
              <span className="bento-card-icon" aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.tag && (
                <div className="bento-coming-soon" aria-label={item.tag}>
                  <span aria-hidden="true">⏳</span>
                  {item.tag}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bentoIn {
          from { opacity: 0; transform: translateY(24px) rotate(-0.5deg) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
        }
      `}</style>
    </section>
  )
}
