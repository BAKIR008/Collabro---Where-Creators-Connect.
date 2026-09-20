import { useEffect, useRef } from 'react'

/**
 * Custom cursor — dot + ring that tracks mouse position.
 * Hides on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef()
  const ringRef = useRef()
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    let raf
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }
      raf = requestAnimationFrame(animate)
    }

    const onEnterInteractive = () => {
      dotRef.current?.classList.add('hovered')
      ringRef.current?.classList.add('hovered')
    }
    const onLeaveInteractive = () => {
      dotRef.current?.classList.remove('hovered')
      ringRef.current?.classList.remove('hovered')
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .creator-card, .portfolio-tile, .filter-chip')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
