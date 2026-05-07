'use client'
import { useEffect, useRef, useState } from 'react'

export function EvilCursor() {
  const iconRef  = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const pos           = useRef({ x: -300, y: -300 })
  const raf           = useRef<number | null>(null)
  const neutralizedAt  = useRef(-9999)
  const isNeutralized  = useRef(false)

  // Scope the cursor to the hero zone: render only while #hero-zone-end
  // is below the viewport (i.e. user has not scrolled past it). Toggles a
  // data attribute on <html> so CSS can scope `cursor: none` accordingly.
  useEffect(() => {
    const sentinel = document.getElementById('hero-zone-end')
    if (!sentinel) return

    const apply = (inHero: boolean) => {
      setActive(inHero)
      document.documentElement.dataset.heroActive = inHero ? 'true' : 'false'
    }

    // Initial check based on current scroll position
    apply(sentinel.getBoundingClientRect().top > 0)

    const obs = new IntersectionObserver(
      ([entry]) => apply(entry.boundingClientRect.top > 0),
      { rootMargin: '0px', threshold: 0 },
    )
    obs.observe(sentinel)
    return () => {
      obs.disconnect()
      document.documentElement.dataset.heroActive = 'false'
    }
  }, [])

  useEffect(() => {
    if (!active) return
    const onMove        = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    const onNeutralized = () => { neutralizedAt.current = performance.now(); isNeutralized.current = true }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('agentNeutralized', onNeutralized)

    const tick = () => {
      const p   = pos.current
      const now = performance.now()

      // Shake + flicker for 600 ms after neutralization
      const ne    = now - neutralizedAt.current
      const alive = ne < 600
      let shakeX = 0, shakeY = 0
      if (alive) {
        const decay = 1 - ne / 600
        shakeX = Math.sin(ne * 0.08) * 9 * decay
        shakeY = Math.cos(ne * 0.06) * 6 * decay
      }

      if (iconRef.current) {
        iconRef.current.style.transform = `translate(${p.x - 20 + shakeX}px, ${p.y - 15 + shakeY}px)`
        if (alive) {
          // shake phase: flicker opacity and hue
          iconRef.current.style.opacity = String(0.2 + Math.random() * 0.8)
          iconRef.current.style.filter  = `hue-rotate(${Math.random() * 60}deg) brightness(2)`
        } else if (isNeutralized.current && ne < 1600) {
          // green for 2 s after shake ends
          iconRef.current.style.opacity = '1'
          iconRef.current.style.filter  = 'hue-rotate(120deg) saturate(1.8) brightness(0.9)'
        } else {
          // revert to red
          isNeutralized.current         = false
          iconRef.current.style.opacity = '1'
          iconRef.current.style.filter  = ''
        }
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('agentNeutralized', onNeutralized)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [active])

  if (!active) return null

  const fixed: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, pointerEvents: 'none', willChange: 'transform',
  }

  return (
    <>
      {/* Robot icon */}
      <div ref={iconRef} style={{ ...fixed, zIndex: 9999, width: 40, height: 48 }}>
        <svg width="40" height="48" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="rb-eye" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="4"   result="b2"/>
              <feMerge>
                <feMergeNode in="b2"/>
                <feMergeNode in="b1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="rb-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="rb-head" x1="30" y1="8" x2="30" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#3a0000"/>
              <stop offset="100%" stopColor="#1a0000"/>
            </linearGradient>
            <linearGradient id="rb-chest" x1="30" y1="52" x2="30" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#2e0000"/>
              <stop offset="100%" stopColor="#140000"/>
            </linearGradient>
          </defs>

          <style>{`
            @keyframes rbEyePulse {
              0%, 100% { opacity: 0.8 }
              50%       { opacity: 1 }
            }
            @keyframes rbScan {
              0%   { transform: translateY(0px);   opacity: 0 }
              8%   { opacity: 0.6 }
              92%  { opacity: 0.4 }
              100% { transform: translateY(34px);  opacity: 0 }
            }
            @keyframes rbGlitch {
              0%, 94%, 100% { transform: none }
              95%  { transform: translate(-1px, 0) skewX(-1deg) }
              96%  { transform: translate( 1px, 0) skewX( 1deg) }
              97%  { transform: none }
            }
            @keyframes rbAntenna {
              0%, 100% { opacity: 0.5 }
              50%      { opacity: 1 }
            }
            .rb-body  { animation: rbGlitch 4s steps(1) infinite }
            .rb-eye-l { animation: rbEyePulse 1.8s ease-in-out infinite }
            .rb-eye-r { animation: rbEyePulse 1.8s ease-in-out infinite 0.4s }
            .rb-scan  { animation: rbScan 2.2s linear infinite }
            .rb-ant   { animation: rbAntenna 1.2s ease-in-out infinite }
          `}</style>

          <g className="rb-body">

            {/* ── ANTENNA ── */}
            <line x1="30" y1="8" x2="30" y2="2" stroke="rgba(180,0,0,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="30" cy="1.5" r="1.5" fill="#cc0000" className="rb-ant" filter="url(#rb-eye)"/>

            {/* ── HEAD CHASSIS ── */}
            {/* Outer shell */}
            <rect x="8" y="8" width="44" height="44" rx="4"
              fill="url(#rb-head)" stroke="#660000" strokeWidth="0.8"/>
            {/* Inner panel recess */}
            <rect x="12" y="12" width="36" height="36" rx="3"
              fill="#200000" stroke="rgba(140,0,0,0.35)" strokeWidth="0.5"/>

            {/* Corner bolts */}
            <circle cx="14" cy="14" r="1.2" fill="#3a0000" stroke="rgba(180,0,0,0.5)" strokeWidth="0.5"/>
            <circle cx="46" cy="14" r="1.2" fill="#3a0000" stroke="rgba(180,0,0,0.5)" strokeWidth="0.5"/>
            <circle cx="14" cy="46" r="1.2" fill="#3a0000" stroke="rgba(180,0,0,0.5)" strokeWidth="0.5"/>
            <circle cx="46" cy="46" r="1.2" fill="#3a0000" stroke="rgba(180,0,0,0.5)" strokeWidth="0.5"/>

            {/* Scan line sweeping down face */}
            <rect x="12" y="12" width="36" height="1.5" rx="0.5"
              fill="rgba(220,30,0,0.4)" className="rb-scan"/>

            {/* ── EAR VENTS ── */}
            {/* Left vent slits */}
            <line x1="8"  y1="24" x2="5"  y2="24" stroke="rgba(100,0,0,0.5)" strokeWidth="1"/>
            <line x1="8"  y1="27" x2="5"  y2="27" stroke="rgba(100,0,0,0.4)" strokeWidth="0.8"/>
            <line x1="8"  y1="30" x2="5"  y2="30" stroke="rgba(100,0,0,0.3)" strokeWidth="0.7"/>
            {/* Right vent slits */}
            <line x1="52" y1="24" x2="55" y2="24" stroke="rgba(100,0,0,0.5)" strokeWidth="1"/>
            <line x1="52" y1="27" x2="55" y2="27" stroke="rgba(100,0,0,0.4)" strokeWidth="0.8"/>
            <line x1="52" y1="30" x2="55" y2="30" stroke="rgba(100,0,0,0.3)" strokeWidth="0.7"/>

            {/* ── CAMERA EYES — circular lens style ── */}
            {/* Left eye housing */}
            <circle cx="22" cy="27" r="7" fill="#2a0000" stroke="rgba(180,0,0,0.6)" strokeWidth="0.8"/>
            {/* Left eye iris */}
            <circle cx="22" cy="27" r="5" fill="#1a0000" stroke="#cc0000" strokeWidth="0.5"/>
            {/* Left eye glow */}
            <circle cx="22" cy="27" r="3.5"
              fill="#cc0000" filter="url(#rb-eye)" className="rb-eye-l"/>
            {/* Left pupil */}
            <circle cx="22" cy="27" r="1.5" fill="#ff2200" opacity="0.95"/>
            {/* Left lens glint */}
            <circle cx="20.5" cy="25.5" r="0.8" fill="rgba(255,180,180,0.3)"/>

            {/* Right eye housing */}
            <circle cx="38" cy="27" r="7" fill="#2a0000" stroke="rgba(180,0,0,0.6)" strokeWidth="0.8"/>
            {/* Right eye iris */}
            <circle cx="38" cy="27" r="5" fill="#1a0000" stroke="#cc0000" strokeWidth="0.5"/>
            {/* Right eye glow */}
            <circle cx="38" cy="27" r="3.5"
              fill="#cc0000" filter="url(#rb-eye)" className="rb-eye-r"/>
            {/* Right pupil */}
            <circle cx="38" cy="27" r="1.5" fill="#ff2200" opacity="0.95"/>
            {/* Right lens glint */}
            <circle cx="36.5" cy="25.5" r="0.8" fill="rgba(255,180,180,0.3)"/>

            {/* Eye bridge bar */}
            <rect x="29" y="26" width="2" height="2" rx="0.5" fill="rgba(180,0,0,0.8)"/>

            {/* ── NOSE / SENSOR ARRAY ── */}
            <rect x="27" y="34" width="6" height="3" rx="1"
              fill="#2a0000" stroke="rgba(180,0,0,0.5)" strokeWidth="0.4"/>
            <circle cx="29" cy="35.5" r="0.6" fill="rgba(255,60,0,0.7)"/>
            <circle cx="31" cy="35.5" r="0.6" fill="rgba(255,60,0,0.7)"/>

            {/* ── MOUTH GRILLE ── */}
            <rect x="18" y="40" width="24" height="7" rx="2"
              fill="#1a0000" stroke="rgba(160,0,0,0.5)" strokeWidth="0.4"/>
            {/* Grille bars */}
            <line x1="21" y1="40.5" x2="21" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>
            <line x1="24" y1="40.5" x2="24" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>
            <line x1="27" y1="40.5" x2="27" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>
            <line x1="30" y1="40.5" x2="30" y2="46.5" stroke="rgba(200,0,0,0.6)" strokeWidth="0.6"/>
            <line x1="33" y1="40.5" x2="33" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>
            <line x1="36" y1="40.5" x2="36" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>
            <line x1="39" y1="40.5" x2="39" y2="46.5" stroke="rgba(180,0,0,0.5)" strokeWidth="0.6"/>

            {/* ── NECK ── */}
            <rect x="24" y="52" width="12" height="5" rx="1"
              fill="#280000" stroke="rgba(160,0,0,0.6)" strokeWidth="0.5"/>
            {/* Neck joint lines */}
            <line x1="24" y1="54" x2="36" y2="54" stroke="rgba(180,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="24" y1="56" x2="36" y2="56" stroke="rgba(180,0,0,0.4)" strokeWidth="0.5"/>

            {/* ── CHEST PLATE ── */}
            <path d="M4 72 L4 62 Q4 57 10 57 L50 57 Q56 57 56 62 L56 72 Z"
              fill="url(#rb-chest)" stroke="#550000" strokeWidth="0.5"/>
            {/* Chest center power cell */}
            <rect x="24" y="60" width="12" height="8" rx="2"
              fill="#1e0000" stroke="rgba(200,0,0,0.5)" strokeWidth="0.5"/>
            <rect x="26" y="62" width="8" height="4" rx="1"
              fill="#280000" stroke="rgba(220,0,0,0.4)" strokeWidth="0.4"/>
            <circle cx="30" cy="64" r="1.2"
              fill="rgba(255,0,0,0.9)" filter="url(#rb-glow)"/>
            {/* Shoulder panel lines */}
            <line x1="4"  y1="60" x2="20" y2="59" stroke="rgba(180,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="56" y1="60" x2="40" y2="59" stroke="rgba(180,0,0,0.4)" strokeWidth="0.5"/>
            {/* Chest vent left */}
            <line x1="8"  y1="63" x2="18" y2="63" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="8"  y1="65" x2="18" y2="65" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="8"  y1="67" x2="18" y2="67" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>
            {/* Chest vent right */}
            <line x1="52" y1="63" x2="42" y2="63" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="52" y1="65" x2="42" y2="65" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>
            <line x1="52" y1="67" x2="42" y2="67" stroke="rgba(160,0,0,0.4)" strokeWidth="0.5"/>

          </g>
        </svg>
      </div>
    </>
  )
}
