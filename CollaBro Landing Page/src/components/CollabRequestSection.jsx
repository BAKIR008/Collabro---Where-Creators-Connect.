const flowSteps = [
  { icon: '💡', label: 'Idea', sub: 'You have a creative vision' },
  { icon: '🔍', label: 'Find Creator', sub: 'Browse by skill & availability' },
  { icon: '✉️', label: 'Send Request', sub: 'Structured collab invite' },
  { icon: '💬', label: 'Discuss', sub: 'Clarify scope & expectations' },
  { icon: '🚀', label: 'Build Together', sub: 'Create something real' },
]

export default function CollabRequestSection() {
  return (
    <section
      className="collab-section section-padding"
      id="collaborate"
      aria-labelledby="collab-heading"
    >
      <div className="container">
        <p className="section-eyebrow" style={{ color: '#4a4030' }}>Structured Collaboration</p>
        <h2 id="collab-heading" className="section-heading" style={{ marginBottom: '12px' }}>
          FROM "HEY, WANNA WORK?"<br />
          TO A <span style={{ background: 'var(--black)', color: 'var(--yellow)', padding: '0 10px' }}>REAL CREATIVE PLAN.</span>
        </h2>
        <p style={{ fontSize: '17px', color: '#3a3020', maxWidth: '540px', lineHeight: 1.75, marginBottom: '48px' }}>
          A clearer way to start creative work. No more ambiguous DMs—bring role, requirements, scope, and timeline into one place from the start.
        </p>

        <div className="collab-inner">

          {/* Left: Collab request card */}
          <div>
            <div className="collab-card">
              <div className="collab-card-header">
                <span className="collab-card-title">COLLABORATION REQUEST</span>
                <span className="sticker sticker-yellow" style={{ fontSize: '10px' }}>DRAFT</span>
              </div>
              <div className="collab-card-body">
                <div className="collab-field">
                  <div className="collab-field-label">Project</div>
                  <div className="collab-field-value">Cinematic College Campaign</div>
                </div>
                <div className="collab-field">
                  <div className="collab-field-label">Role Needed</div>
                  <div className="collab-field-value highlight">Motion Designer</div>
                </div>
                <div className="collab-field">
                  <div className="collab-field-label">Budget</div>
                  <div className="collab-field-value">₹15,000</div>
                </div>
                <div className="collab-field">
                  <div className="collab-field-label">Deadline</div>
                  <div className="collab-field-value">30 September</div>
                </div>
                <div className="collab-field">
                  <div className="collab-field-label">Description</div>
                  <div className="collab-field-value" style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.6 }}>
                    Looking for a motion designer to help turn campus stories into a bold launch film for the new semester campaign.
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  background: 'var(--offwhite)',
                  border: 'var(--border)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: 'var(--gray-dark)',
                  textTransform: 'uppercase',
                }}>
                  ⚠ Payment & project management features are planned as part of the Collabro roadmap.
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                  aria-label="Send collaboration request — placeholder"
                >
                  Send Request ✈
                </button>
              </div>
            </div>
          </div>

          {/* Right: Flow */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#4a4030',
              marginBottom: '24px',
            }}>
              — The Collabro Flow —
            </p>
            <div className="collab-flow" role="list" aria-label="Collaboration flow steps">
              {flowSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="collab-flow-item"
                  role="listitem"
                  style={{
                    animation: `flowIn 0.5s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  }}
                >
                  <div className="collab-flow-icon" aria-hidden="true">{step.icon}</div>
                  <div>
                    <div className="collab-flow-text">{step.label}</div>
                    <div className="collab-flow-subtext">{step.sub}</div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '19px',
                      bottom: '-14px',
                      width: '2px',
                      height: '14px',
                      background: 'rgba(11,11,11,0.2)',
                      borderRadius: '1px',
                    }} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flowIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
