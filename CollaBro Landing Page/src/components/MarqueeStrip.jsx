const ITEMS = [
  { text: 'FIND YOUR PEOPLE', icon: '★' },
  { text: 'SHOW YOUR WORK', icon: '→' },
  { text: 'BUILD TOGETHER', icon: '♥' },
  { text: 'CREATE MORE', icon: '✦' },
  { text: 'COLLABORATE WITHOUT THE CHAOS', icon: '☺' },
  { text: 'MADE FOR CREATORS', icon: '↗' },
  { text: 'YOUR NEXT COLLAB STARTS HERE', icon: '✎' },
  { text: 'CREATIVE WORK IS BETTER TOGETHER', icon: '●' },
]

// Duplicate for seamless loop
const DOUBLED = [...ITEMS, ...ITEMS]

export default function MarqueeStrip() {
  return (
    <div className="marquee-strip" aria-label="Marquee: creator-focused phrases" role="marquee">
      <div className="marquee-inner" aria-hidden="true">
        {DOUBLED.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-icon">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}
