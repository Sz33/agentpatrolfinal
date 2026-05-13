'use client'
import AnimatedButton from '@/components/AnimatedButton'
import { SceneWrapper } from './SceneWrapper'

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 5,
        minHeight: '100vh',
        padding: '160px 32px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 0,
        }}
      >
        {/* Tag */}
        <div className="hero-tag">
          // RUNTIME SECURITY FOR AI AGENTS
        </div>

        {/* Title */}
        <h1
          className="hero-h1-anim"
          style={{
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: '.04em',
            lineHeight: 0.95,
            fontSize: 'clamp(56px, 9vw, 148px)',
            margin: 0,
            background: 'linear-gradient(180deg,#fff 0%, #d8d8de 60%, #6e6e76 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          AGENTS DON&apos;T<br />
          <span className="patrol-shimmer">
            SLEEP. PATROL.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle-anim"
          style={{
            textAlign: 'center',
            maxWidth: 760,
            margin: '28px auto 0',
            color: 'var(--ink-dim)',
            fontFamily: 'var(--font-mono, ui-monospace), monospace',
            fontSize: 16,
            lineHeight: 1.7,
            letterSpacing: '.02em',
          }}
        >
          AgentPatrol monitors, enforces, and protects any AI agent running on your infrastructure, whether your team built it or someone else did. <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Zero code changes. Full enforcement in 90 seconds.</b>
        </p>

        {/* Hero art — Scene replaces the robot image */}
        <div
          id="hero-robot-art"
          className="hero-art-anim"
          style={{
            position: 'relative',
            margin: '48px auto 0',
            width: 'min(720px, 90vw)',
            aspectRatio: '800/900',
          }}
        >
          {/* HUD corners */}
          <span style={{ position: 'absolute', width: 90, height: 90, border: '1px solid var(--amber)', opacity: .7, zIndex: 3, top: 0, left: 0, borderRight: 'none', borderBottom: 'none' }} />
          <span style={{ position: 'absolute', width: 90, height: 90, border: '1px solid var(--amber)', opacity: .7, zIndex: 3, top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' }} />
          <span style={{ position: 'absolute', width: 90, height: 90, border: '1px solid var(--amber)', opacity: .7, zIndex: 3, bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' }} />
          <span style={{ position: 'absolute', width: 90, height: 90, border: '1px solid var(--amber)', opacity: .7, zIndex: 3, bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }} />

          {/* HUD labels */}
          <span
            className="hud-glow"
            style={{
              position: 'absolute',
              fontFamily: 'var(--font-mono, ui-monospace), monospace',
              fontSize: 10,
              letterSpacing: '.2em',
              color: 'var(--amber)',
              textTransform: 'uppercase',
              zIndex: 4,
              top: -22,
              left: 0,
            }}
          >
            UNIT-04 // POLICE PATROL
          </span>
          <span
            className="hud-glow"
            style={{
              position: 'absolute',
              fontFamily: 'var(--font-mono, ui-monospace), monospace',
              fontSize: 10,
              letterSpacing: '.2em',
              color: 'var(--amber)',
              textTransform: 'uppercase',
              zIndex: 4,
              top: '50%',
              right: -8,
              transform: 'translateY(-50%) rotate(90deg)',
              transformOrigin: 'right center',
            }}
          >
            TARGET LOCK
          </span>
          <span
            className="hud-glow"
            style={{
              position: 'absolute',
              fontFamily: 'var(--font-mono, ui-monospace), monospace',
              fontSize: 10,
              letterSpacing: '.2em',
              color: 'var(--amber)',
              textTransform: 'uppercase',
              zIndex: 4,
              bottom: -22,
              right: 0,
            }}
          >
            SECURE / ARMED
          </span>

          {/* Rings */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '55%',
              transform: 'translate(-50%,-50%)',
              width: '120%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border: '1px solid rgba(var(--brand-rgb),.18)',
              background: 'radial-gradient(circle, rgba(var(--brand-rgb),.08), transparent 60%)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '55%',
              transform: 'translate(-50%,-50%)',
              width: '80%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border: '1px solid rgba(var(--brand-rgb),.1)',
              background: 'none',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '55%',
              transform: 'translate(-50%,-50%)',
              width: '46%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border: '1px solid rgba(var(--brand-rgb),.08)',
              background: 'none',
              zIndex: 1,
            }}
          />

          {/* Left spec readouts */}
          <div
            className="specs-side"
            style={{
              position: 'absolute',
              left: -40,
              top: '30%',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              zIndex: 4,
            }}
          >
            <div className="spec-row-left"><span>STATUS · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>ACTIVE</b></span></div>
            <div className="spec-row-left"><span>POWER · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>98%</b></span></div>
            <div className="spec-row-left"><span>INSTALL · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>90s</b></span></div>
          </div>

          {/* Right spec readouts */}
          <div
            className="specs-side"
            style={{
              position: 'absolute',
              right: -40,
              top: '30%',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              zIndex: 4,
              alignItems: 'flex-end',
            }}
          >
            <div className="spec-row-right"><span>THREAT · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>0 / 0</b></span></div>
            <div className="spec-row-right"><span>SCAN · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>240 Hz</b></span></div>
            <div className="spec-row-right"><span>RESPONSE · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>12 ms</b></span></div>
          </div>

          {/* Scene — replaces the robot image */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}>
            <SceneWrapper />
          </div>
        </div>

        {/* CTA buttons — marginTop is generous so the button clears the
            radar ring (which extends ~67 px below the art container). */}
        <div
          className="hero-cta-anim"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
            marginTop: 'clamp(80px, 12vw, 120px)',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 5,
          }}
        >
          <a href="#" style={{ textDecoration: 'none' }}>
            <AnimatedButton className="px-7 py-4 text-[12px] tracking-[0.2em]">
              Request Early Access <span style={{ fontFamily: 'var(--font-mono, ui-monospace), monospace', fontWeight: 400 }}>→</span>
            </AnimatedButton>
          </a>
        </div>

        {/* Meta stats */}
        <div
          className="hero-stats-anim"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            marginTop: 48,
            flexWrap: 'wrap',
            fontFamily: 'var(--font-mono, ui-monospace), monospace',
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          <span style={{ color: 'var(--ink)' }}>90s INSTALL</span>
          <span style={{ color: 'var(--ink-faint)' }}>·</span>
          <span style={{ color: 'var(--ink)' }}>0 CODE CHANGES</span>
          <span style={{ color: 'var(--ink-faint)' }}>·</span>
          <span style={{ color: 'var(--ink)' }}>KERNEL-LEVEL ENFORCEMENT</span>
        </div>
      </div>
    </section>
  )
}
