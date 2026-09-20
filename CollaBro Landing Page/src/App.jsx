import { useState, useEffect } from 'react'

// Components
import IntroOverlay from './components/IntroOverlay'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MarqueeStrip from './components/MarqueeStrip'
import ProblemSection from './components/ProblemSection'
import HowItWorksSection from './components/HowItWorksSection'
import EcosystemSection from './components/EcosystemSection'
import DiscoverySection from './components/DiscoverySection'
import CollabRequestSection from './components/CollabRequestSection'
import ProfileShowcaseSection from './components/ProfileShowcaseSection'
import BentoGridSection from './components/BentoGridSection'
import FinalCTASection from './components/FinalCTASection'
import Footer from './components/Footer'

// Global scroll-reveal observer — activates .reveal elements
function useGlobalReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const targets = document.querySelectorAll('.reveal')
    targets.forEach(el => observer.observe(el))

    const interval = setInterval(() => {
      document.querySelectorAll('.reveal:not(.in-view)').forEach(el => observer.observe(el))
    }, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  useGlobalReveal()

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />

      <CustomCursor />

      {!introComplete && (
        <IntroOverlay onComplete={() => setIntroComplete(true)} />
      )}

      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <Navbar />

        <main id="main-content">
          <HeroSection />
          <MarqueeStrip />
          <ProblemSection />
          <HowItWorksSection />
          <EcosystemSection />
          <DiscoverySection />
          <CollabRequestSection />
          <ProfileShowcaseSection />
          <BentoGridSection />
          <FinalCTASection />
        </main>

        <Footer />
      </div>
    </>
  )
}
