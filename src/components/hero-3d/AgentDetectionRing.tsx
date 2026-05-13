'use client'
import { useEffect, useRef, useState } from 'react'

export function AgentDetectionRing() {
  const ringRef  = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const subRef   = useRef<HTMLSpanElement>(null)

  const [active, setActive] = useState(false)

  const pos           = useRef({ x: -300, y: -300 })
  const inZone        = useRef(false)
  const enterTime     = useRef<number | null>(null)
  const neutralizedRef = useRef(false)
  const neutralizedAt  = useRef(-9999)
  const cooldownUntil  = useRef(-9999)
  const raf           = useRef<number | null>(null)

  // Scope to hero zone — see EvilCursor.tsx for the same pattern.
  useEffect(() => {
    const sentinel = document.getElementById('hero-zone-end')
    if (!sentinel) return
    setActive(sentinel.getBoundingClientRect().top > 0)
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.boundingClientRect.top > 0),
      { rootMargin: '0px', threshold: 0 },
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      const art = document.getElementById('hero-robot-art')
      if (!art) { inZone.current = false; return }
      const r  = art.getBoundingClientRect()
      const cx = r.left + r.width  * 0.5
      const cy = r.top  + r.height * 0.55
      inZone.current = Math.hypot(e.clientX - cx, e.clientY - cy) < r.width * 0.6
    }
    window.addEventListener('mousemove', onMove)

    const D = 68
    const R = D / 2

    const tick = () => {
      const { x, y } = pos.current
      const now  = performance.now()
      const t    = now * 0.0025
      const show = inZone.current && now > cooldownUntil.current

      // ── Active detection (not yet neutralized) ─────────────────
      if (show && !neutralizedRef.current) {
        if (enterTime.current === null) enterTime.current = now

        const elapsed   = now - enterTime.current
        const remaining = Math.max(0, 2000 - elapsed) / 1000

        // Ring: dotted red, pulsing
        if (ringRef.current) {
          ringRef.current.style.opacity     = String(0.6 + Math.sin(t) * 0.3)
          ringRef.current.style.transform   = `translate(${x - R}px, ${y + 9 - R}px)`
          ringRef.current.style.borderColor = '#FF0000'
          ringRef.current.style.borderStyle = 'dotted'
        }

        // Label
        if (titleRef.current) { titleRef.current.textContent = 'DETECTED'; titleRef.current.style.color = '#FF0000'; titleRef.current.style.textShadow = '0 0 8px #FF0000' }
        if (subRef.current)   { subRef.current.textContent = `NEUTRALIZING IN ${remaining.toFixed(1)}s`; subRef.current.style.color = '#EF9F27'; subRef.current.style.opacity = '1' }
        if (labelRef.current) { labelRef.current.style.opacity = '1'; labelRef.current.style.transform = `translate(${x}px, ${y - R - 6}px) translateX(-50%)` }

        // Trigger neutralization after 2 s
        if (elapsed >= 2000) {
          neutralizedRef.current = true
          neutralizedAt.current  = now
          enterTime.current      = null
          window.dispatchEvent(new CustomEvent('agentNeutralized'))
        }

      } else if (!show && !neutralizedRef.current) {
        // Cursor left zone — hide everything and reset countdown
        enterTime.current = null
        if (ringRef.current)  ringRef.current.style.opacity  = '0'
        if (labelRef.current) labelRef.current.style.opacity = '0'
        if (flashRef.current) flashRef.current.style.opacity = '0'
      }

      // ── Neutralization effect (800 ms) ─────────────────────────
      if (neutralizedRef.current) {
        const np = Math.min((now - neutralizedAt.current) / 800, 1)

        // Expanding flash circle
        if (flashRef.current) {
          const fs = 20 + np * 160
          flashRef.current.style.opacity   = String((1 - np) * 0.9)
          flashRef.current.style.width     = `${fs}px`
          flashRef.current.style.height    = `${fs}px`
          flashRef.current.style.transform = `translate(${x - fs / 2}px, ${y + 9 - fs / 2}px)`
        }

        // Ring: flash green then fade
        if (ringRef.current) {
          ringRef.current.style.borderStyle = 'solid'
          ringRef.current.style.borderColor = `rgba(0,255,80,${1 - np})`
          ringRef.current.style.opacity     = String(1 - np)
          ringRef.current.style.transform   = `translate(${x - R}px, ${y + 9 - R}px)`
        }

        // Label: "NEUTRALIZED" in green, fades out
        if (titleRef.current) { titleRef.current.textContent = 'NEUTRALIZED'; titleRef.current.style.color = '#00FF50'; titleRef.current.style.textShadow = '0 0 10px #00FF50' }
        if (subRef.current)   { subRef.current.textContent = 'THREAT ELIMINATED'; subRef.current.style.color = '#00FF50'; subRef.current.style.opacity = '1' }
        if (labelRef.current) { labelRef.current.style.opacity = String(1 - np); labelRef.current.style.transform = `translate(${x}px, ${y - R - 6}px) translateX(-50%)` }

        // End of effect — reset
        if (np >= 1) {
          neutralizedRef.current = false
          cooldownUntil.current  = now + 1200   // 1.2 s before re-detection
          if (ringRef.current)  ringRef.current.style.opacity  = '0'
          if (labelRef.current) labelRef.current.style.opacity = '0'
          if (flashRef.current) flashRef.current.style.opacity = '0'
        }
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [active])

  if (!active) return null

  const fixedBase: React.CSSProperties = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }

  return (
    <>
      {/* Dotted targeting circle */}
      <div
        ref={ringRef}
        style={{
          ...fixedBase,
          width:        72,
          height:       72,
          borderRadius: '50%',
          border:       '2px dotted #FF0000',
          boxShadow:    '0 0 10px rgba(255,0,0,0.5), inset 0 0 8px rgba(255,0,0,0.15)',
          opacity:      0,
          zIndex:       9993,
        }}
      />

      {/* Expanding neutralization flash */}
      <div
        ref={flashRef}
        style={{
          ...fixedBase,
          width:        20,
          height:       20,
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(0,255,80,0.9) 0%, rgba(0,200,60,0.4) 50%, transparent 100%)',
          opacity:      0,
          zIndex:       9992,
        }}
      />

      {/* DETECTED / NEUTRALIZED label */}
      <div
        ref={labelRef}
        style={{
          ...fixedBase,
          opacity:       0,
          zIndex:        9993,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           3,
        }}
      >
        <span
          ref={titleRef}
          style={{
            fontFamily:    'var(--font-orbitron), Orbitron, sans-serif',
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.22em',
            color:         '#FF0000',
            textShadow:    '0 0 8px #FF0000',
            whiteSpace:    'nowrap',
          }}
        >
          DETECTED
        </span>
        <span
          ref={subRef}
          style={{
            fontFamily:    'var(--font-orbitron), Orbitron, sans-serif',
            fontSize:      8,
            fontWeight:    600,
            letterSpacing: '0.15em',
            color:         '#EF9F27',
            textShadow:    '0 0 6px #EF9F27',
            whiteSpace:    'nowrap',
          }}
        >
          NEUTRALIZING IN 2.0s
        </span>
      </div>
    </>
  )
}
