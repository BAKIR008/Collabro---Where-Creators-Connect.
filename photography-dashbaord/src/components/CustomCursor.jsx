import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return undefined

    let animationFrame
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100

    const onMove = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }
    const onEnter = () => {
      dotRef.current?.classList.add('hovered')
      ringRef.current?.classList.add('hovered')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('hovered')
      ringRef.current?.classList.remove('hovered')
    }
    const bindInteractiveElements = () => {
      document.querySelectorAll('a, button, input, label, [role="button"]').forEach((element) => {
        if (element.dataset.cursorBound) return
        element.dataset.cursorBound = 'true'
        element.addEventListener('mouseenter', onEnter)
        element.addEventListener('mouseleave', onLeave)
      })
    }
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }
      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    bindInteractiveElements()
    const observer = new MutationObserver(bindInteractiveElements)
    observer.observe(document.body, { childList: true, subtree: true })
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
