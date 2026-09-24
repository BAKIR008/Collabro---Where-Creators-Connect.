/**
 * CollaBro — Custom Cursor
 * Matches the landing page cursor behavior exactly
 */

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef()
  const ringRef = useRef()

  useEffect(() => {
    let rafId
    let mouseX = -100, mouseY = -100
    let ringX = -100, ringY = -100

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Dot follows mouse instantly
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px'
        dotRef.current.style.top = mouseY + 'px'
      }

      // Ring lags behind with lerp
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px'
        ringRef.current.style.top = ringY + 'px'
      }

      rafId = requestAnimationFrame(animate)
    }

    // Hover effect on interactive elements
    const onEnter = () => {
      dotRef.current?.classList.add('hovered')
      ringRef.current?.classList.add('hovered')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('hovered')
      ringRef.current?.classList.remove('hovered')
    }

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, input, label, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    animate()
    addHoverListeners()

    // Re-scan for new interactive elements periodically
    const interval = setInterval(addHoverListeners, 2000)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
