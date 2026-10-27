import { useState, useEffect, useRef } from 'react'

/* ── Inline SVG icon components (no external library) ─────────────── */
const IconIdentity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const IconDiscover = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
    <path d="M8.5 9.5h5M11 7v5" />
  </svg>
)

const IconConnect = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8M8 14h5" />
  </svg>
)

const IconShape = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M7 8h4M7 12h8M7 16h5" />
  </svg>
)

const IconCreate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
)

/* ── Stage data ───────────────────────────────────────────────────── */
const stages = [
  {
    num: '01',
    title: 'CREATE YOUR IDENTITY',
    short: 'Identity',
    color: 'var(--yellow)',
    textColor: 'var(--black)',
    Icon: IconIdentity,
    description: 'Build a creator profile that captures your skills, work style, disciplines, and availability.',
    detail: 'Your profile is your creative resume — not a generic bio. List the tools you master, the formats you work in, the pace you keep. Potential collaborators see exactly who you are before the first message is sent.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['After Effects', 'Premiere Pro', 'DaVinci'].map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 10px', border: '1.5px solid var(--black)', borderRadius: '3px', background: 'var(--yellow)' }}>{t}</span>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-dark)', letterSpacing: '0.1em' }}>VIDEO EDITOR · AVAILABLE NOW</div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'DISCOVER YOUR PEOPLE',
    short: 'Discover',
    color: 'var(--cyan)',
    textColor: 'var(--black)',
    Icon: IconDiscover,
    description: 'Filter creators by skill, discipline, location, experience, and collaboration needs.',
    detail: 'The right match is not the most-followed account — it is the person whose skillset complements yours. Search by what you need: motion designer in Bangalore, open to short-term projects, experienced in brand work.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {['Motion Designer · Delhi', 'Sound Producer · Remote', 'Photographer · Mumbai'].map((r, i) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(69,215,255,0.12)', border: '1.5px solid rgba(69,215,255,0.4)', borderRadius: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: ['var(--cyan)', 'var(--magenta)', 'var(--purple)'][i], border: '1.5px solid var(--black)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{r}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'START A CONNECTION',
    short: 'Connect',
    color: 'var(--magenta)',
    textColor: 'var(--white)',
    Icon: IconConnect,
    description: 'Send structured collaboration requests — not vague DMs. Role, scope, deadline, all upfront.',
    detail: 'Skip the awkward "hey wanna collab?" Replace it with a clear request that includes your role, the project scope, timeline, and compensation expectations. Both parties know what they are agreeing to from the start.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '10px 12px', background: 'rgba(255,61,154,0.15)', border: '1.5px solid rgba(255,61,154,0.4)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.5 }}>
          <div style={{ color: 'var(--magenta)', fontWeight: 700, marginBottom: '4px' }}>COLLAB REQUEST</div>
          <div>Role: Motion Designer</div>
          <div>Scope: 60s brand reel</div>
          <div>Timeline: 2 weeks</div>
        </div>
      </div>
    ),
  },
  {
    num: '04',
    title: 'SHAPE THE PROJECT',
    short: 'Plan',
    color: 'var(--purple)',
    textColor: 'var(--white)',
    Icon: IconShape,
    description: 'Define clear roles, deliverables, and milestones before a single frame is created.',
    detail: 'Great creative work starts with clarity. Use the project brief tool to align on deliverables, responsibilities, and timelines. No surprises mid-project — everyone knows what they are building and by when.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {[['Deliverable', 'Final cut + stems'], ['Deadline', '15 Nov 2025'], ['Your Role', 'Video Editor']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(123,56,255,0.15)', border: '1px solid rgba(123,56,255,0.35)', borderRadius: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
            <span style={{ color: 'var(--gray-dark)' }}>{k}</span>
            <span style={{ fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '05',
    title: 'CREATE TOGETHER',
    short: 'Create',
    color: 'var(--yellow)',
    textColor: 'var(--black)',
    Icon: IconCreate,
    description: 'Collaborate in real time. Share drafts, give feedback, and iterate until it is right.',
    detail: 'Collaboration is not just task assignment — it is two creative minds working toward the same vision. Share work-in-progress, leave timestamped notes, iterate rapidly, and build something neither of you could have made alone.',
    visual: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, padding: '10px', background: 'rgba(255,213,46,0.18)', border: '1.5px solid rgba(255,213,46,0.5)', borderRadius: '7px', fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>v1 DRAFT</div>
          <div style={{ color: 'var(--gray-dark)' }}>Edit locked at 0:42</div>
          <div style={{ color: 'var(--gray-dark)' }}>Color: warm + grit</div>
        </div>
        <div style={{ flex: 1, padding: '10px', background: 'rgba(69,215,255,0.12)', border: '1.5px solid rgba(69,215,255,0.4)', borderRadius: '7px', fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>FEEDBACK</div>
          <div style={{ color: 'var(--gray-dark)' }}>Punch the cut at 0:18</div>
          <div style={{ color: 'var(--gray-dark)' }}>Music swell needed</div>
        </div>
      </div>
    ),
  },
  {
    num: '06',
    title: 'SHARE WHAT YOU BUILT',
    short: 'Launch',
    color: 'var(--cyan)',
    textColor: 'var(--black)',
    Icon: IconShare,
    description: 'Publish the finished project to your Collabro profile. Credit every contributor.',
    detail: 'Every finished project becomes part of both creators\' portfolios. Credit is shared, work is visible, and your next collaborator can see exactly what you are capable of. Build your reputation one project at a time.',
    visual: (
      <div style={{ padding: '12px 14px', background: 'rgba(69,215,255,0.15)', border: '1.5px solid rgba(69,215,255,0.45)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--black)' }}>PROJECT PUBLISHED</div>
        <div style={{ color: 'var(--gray-dark)' }}>Brand Reel 2025 · 2 collaborators</div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
          <span style={{ padding: '3px 8px', background: 'var(--cyan)', border: '1px solid var(--black)', borderRadius: '3px', fontSize: '9px', fontWeight: 700 }}>VIDEO</span>
          <span style={{ padding: '3px 8px', background: 'var(--yellow)', border: '1px solid var(--black)', borderRadius: '3px', fontSize: '9px', fontWeight: 700 }}>MUSIC</span>
        </div>
      </div>
    ),
  },
]

/* ── Arrow connector icons ────────────────────────────────────────── */
const ArrowRight = () => (
  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
    <path d="M8 20h24M26 12l8 8-8 8" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowLeft = () => (
  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
    <path d="M32 20H8M14 12 6 20l8 8" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowDown = () => (
  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
    <path d="M20 8v24M12 26l8 8 8-8" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Main component ───────────────────────────────────────────────── */
export default function WorkflowSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef()
  const cardRefs = useRef([])
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  /* Keyboard navigation */
  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % stages.length
      setActive(next)
      cardRefs.current[next]?.focus()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + stages.length) % stages.length
      setActive(prev)
      cardRefs.current[prev]?.focus()
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActive(idx)
    }
  }

  const current = stages[active]

  return (
    <section
      ref={sectionRef}
      className="workflow-section section-padding"
      id="workflow"
      aria-labelledby="workflow-heading"
    >
      <div className="container">
        <p className="section-eyebrow" style={{ color: 'var(--gray-mid)' }}>How CollaBro Works</p>
        <h2 id="workflow-heading" className="section-heading" style={{ color: 'var(--white)' }}>
          SIX STEPS FROM&nbsp;
          <span className="highlight-yellow">IDEA</span>
          <br />
          TO&nbsp;
          <span className="highlight-cyan">FINISHED WORK.</span>
        </h2>

        <p style={{
          fontSize: '17px',
          color: 'var(--gray-mid)',
          maxWidth: '540px',
          lineHeight: 1.75,
          marginBottom: '52px',
        }}>
          CollaBro structures the creative collaboration journey end-to-end — from building your identity to publishing what you built together.
        </p>

        {/* ── Serpentine grid ── */}
        <div className="workflow-serpentine" role="group" aria-label="Workflow stages — select a stage to learn more">

          {/* Row 1: 01 → 02 → 03 (with down-arrow connecting to row 2 on the right) */}
          <div className="workflow-row workflow-row-ltr">
            {stages.slice(0, 3).map((stage, i) => {
              const globalIdx = i
              const isActive = active === globalIdx
              return (
                <div key={stage.num} className="workflow-cell">
                  <button
                    ref={el => cardRefs.current[globalIdx] = el}
                    className={`workflow-card${isActive ? ' wf-active' : ''}`}
                    style={{ '--wf-color': stage.color, '--wf-text': stage.textColor }}
                    onClick={() => setActive(globalIdx)}
                    onKeyDown={(e) => handleKeyDown(e, globalIdx)}
                    aria-pressed={isActive}
                    aria-label={`Stage ${stage.num}: ${stage.title}`}
                    type="button"
                  >
                    <span className="wf-num" aria-hidden="true">{stage.num}</span>
                    <span className="wf-icon-wrap" aria-hidden="true">
                      <stage.Icon />
                    </span>
                    <span className="wf-title">{stage.short}</span>
                    <span className="wf-desc">{stage.description}</span>
                  </button>

                  {/* Horizontal arrow between stages (except last in row) */}
                  {i < 2 && (
                    <div className="workflow-arrow-h" aria-hidden="true">
                      <ArrowRight />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Down arrow on far right connecting row 1 to row 2 */}
            <div className="workflow-arrow-bend" aria-hidden="true">
              <ArrowDown />
            </div>
          </div>

          {/* Row 2: 06 ← 05 ← 04 (reversed visual order) */}
          <div className="workflow-row workflow-row-rtl">
            {stages.slice(3).reverse().map((stage, i) => {
              // reversed display: 06(i=0), 05(i=1), 04(i=2)
              // globalIdx: 06=5, 05=4, 04=3
              const globalIdx = 5 - i
              const isActive = active === globalIdx
              return (
                <div key={stage.num} className="workflow-cell">
                  <button
                    ref={el => cardRefs.current[globalIdx] = el}
                    className={`workflow-card${isActive ? ' wf-active' : ''}`}
                    style={{ '--wf-color': stage.color, '--wf-text': stage.textColor }}
                    onClick={() => setActive(globalIdx)}
                    onKeyDown={(e) => handleKeyDown(e, globalIdx)}
                    aria-pressed={isActive}
                    aria-label={`Stage ${stage.num}: ${stage.title}`}
                    type="button"
                  >
                    <span className="wf-num" aria-hidden="true">{stage.num}</span>
                    <span className="wf-icon-wrap" aria-hidden="true">
                      <stage.Icon />
                    </span>
                    <span className="wf-title">{stage.short}</span>
                    <span className="wf-desc">{stage.description}</span>
                  </button>

                  {/* Left-pointing arrow between stages (between 06←05 and 05←04) */}
                  {i < 2 && (
                    <div className="workflow-arrow-h workflow-arrow-h-rtl" aria-hidden="true">
                      <ArrowLeft />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div
          className="workflow-detail reveal"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="wf-detail-accent" style={{ background: current.color }} aria-hidden="true" />

          <div className="wf-detail-left">
            <div
              className="wf-detail-icon"
              style={{ background: current.color, color: current.textColor }}
              aria-hidden="true"
            >
              <current.Icon />
            </div>
            <div>
              <p className="wf-detail-step">STEP {current.num}</p>
              <h3 className="wf-detail-title">{current.title}</h3>
              <p className="wf-detail-body">{current.detail}</p>
            </div>
          </div>

          <div className="wf-detail-right" aria-label={`Visual preview for ${current.title}`}>
            {current.visual}
          </div>
        </div>

        {/* ── Prev / Next controls ── */}
        <div className="wf-controls" role="group" aria-label="Navigate workflow stages">
          <button
            type="button"
            className="wf-ctrl-btn"
            onClick={() => setActive((active - 1 + stages.length) % stages.length)}
            aria-label="Previous stage"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <path d="M13 15L8 10l5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Prev
          </button>
          <div className="wf-dots" role="tablist" aria-label="Stage selector">
            {stages.map((s, i) => (
              <button
                key={s.num}
                type="button"
                className={`wf-dot${active === i ? ' wf-dot-active' : ''}`}
                style={active === i ? { background: s.color, borderColor: 'var(--black)' } : {}}
                onClick={() => setActive(i)}
                aria-label={`Go to stage ${s.num}: ${s.title}`}
                aria-selected={active === i}
                role="tab"
              />
            ))}
          </div>
          <button
            type="button"
            className="wf-ctrl-btn"
            onClick={() => setActive((active + 1) % stages.length)}
            aria-label="Next stage"
          >
            Next
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        /* ── Section ── */
        .workflow-section {
          background: var(--black);
          border-top: var(--border-thick);
          border-bottom: var(--border-thick);
        }

        /* ── Serpentine grid ── */
        .workflow-serpentine {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 40px;
        }

        .workflow-row {
          display: grid;
          grid-template-columns: 1fr 40px 1fr 40px 1fr 60px;
          align-items: center;
          gap: 0;
        }

        .workflow-row-rtl {
          grid-template-columns: 1fr 40px 1fr 40px 1fr;
          justify-items: stretch;
        }

        .workflow-cell {
          display: contents;
        }

        .workflow-arrow-h {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
        }

        .workflow-arrow-h svg path {
          stroke: rgba(255,255,255,0.45);
        }

        .workflow-arrow-bend {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          padding-top: 8px;
        }

        .workflow-arrow-bend svg path {
          stroke: rgba(255,255,255,0.45);
        }

        /* ── Stage card ── */
        .workflow-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 24px 20px;
          background: rgba(255,255,255,0.04);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          text-align: left;
          width: 100%;
          position: relative;
          overflow: hidden;
          margin: 8px 0;
        }

        .workflow-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--wf-color, var(--yellow));
          opacity: 0;
          transition: opacity 0.22s ease;
          border-radius: inherit;
        }

        .workflow-card:hover {
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        }

        .workflow-card.wf-active {
          border-color: var(--wf-color);
          box-shadow: 0 0 0 2px var(--wf-color), 5px 5px 0 var(--wf-color);
          background: rgba(255,255,255,0.07);
        }

        .workflow-card.wf-active::before {
          opacity: 0.08;
        }

        .wf-num {
          font-family: var(--font-display);
          font-size: 38px;
          line-height: 1;
          color: rgba(255,255,255,0.12);
          position: absolute;
          top: 10px;
          right: 14px;
          user-select: none;
          transition: color 0.22s ease;
        }

        .workflow-card.wf-active .wf-num {
          color: var(--wf-color);
          opacity: 0.35;
        }

        .wf-icon-wrap {
          width: 44px;
          height: 44px;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-mid);
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .workflow-card.wf-active .wf-icon-wrap {
          background: var(--wf-color);
          border-color: var(--wf-color);
          color: var(--wf-text, var(--black));
        }

        .wf-title {
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: 0.04em;
          color: var(--white);
          line-height: 1.1;
          position: relative;
          z-index: 1;
        }

        .wf-desc {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--gray-mid);
          line-height: 1.55;
          position: relative;
          z-index: 1;
        }

        /* ── Detail panel ── */
        .workflow-detail {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 40px;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 2px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          padding: 36px 40px;
          position: relative;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .wf-detail-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          border-radius: 0;
          transition: background 0.3s ease;
        }

        .wf-detail-left {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          padding-left: 16px;
        }

        .wf-detail-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: var(--border-thick);
          box-shadow: var(--shadow-brutal);
          transition: background 0.3s ease, color 0.3s ease;
        }

        .wf-detail-step {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--gray-dark);
          margin-bottom: 6px;
        }

        .wf-detail-title {
          font-family: var(--font-display);
          font-size: 28px;
          letter-spacing: 0.04em;
          color: var(--white);
          margin-bottom: 14px;
          line-height: 1.1;
        }

        .wf-detail-body {
          font-size: 15px;
          color: var(--gray-mid);
          line-height: 1.75;
          max-width: 480px;
        }

        .wf-detail-right {
          padding: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md, 12px);
        }

        /* ── Controls ── */
        .wf-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .wf-ctrl-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gray-mid);
          background: none;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          transition: all 0.18s ease;
        }

        .wf-ctrl-btn:hover {
          color: var(--white);
          border-color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.06);
        }

        .wf-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .wf-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid transparent;
          transition: all 0.2s ease;
          padding: 0;
        }

        .wf-dot:hover {
          background: rgba(255,255,255,0.4);
        }

        .wf-dot-active {
          width: 24px;
          border-radius: 4px;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .workflow-detail {
            grid-template-columns: 1fr;
          }
          .wf-detail-right {
            display: none;
          }
        }

        @media (max-width: 860px) {
          .workflow-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .workflow-row-rtl {
            grid-template-columns: 1fr;
          }
          .workflow-arrow-h,
          .workflow-arrow-bend {
            display: none;
          }
          .workflow-card {
            flex-direction: row;
            align-items: center;
            margin: 6px 0;
          }
          .wf-num {
            position: static;
            font-size: 28px;
            color: rgba(255,255,255,0.2);
            margin-right: 4px;
          }
          .workflow-card.wf-active .wf-num {
            opacity: 0.5;
          }
          .wf-desc {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .workflow-detail {
            padding: 24px 20px;
          }
          .wf-detail-left {
            flex-direction: column;
            padding-left: 8px;
          }
          .wf-detail-title {
            font-size: 22px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .workflow-card,
          .wf-icon-wrap,
          .wf-detail-accent,
          .wf-detail-icon {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}
