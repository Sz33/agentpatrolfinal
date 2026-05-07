'use client'
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
          CLASSIFIED // AUTONOMOUS DEFENSE LAYER
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
            fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace',
            fontSize: 16,
            lineHeight: 1.7,
            letterSpacing: '.02em',
          }}
        >
          AgentPatrol deploys <b style={{ color: 'var(--ink)', fontWeight: 600 }}>autonomous security agents</b> across your stack — monitoring traffic, detecting anomalies, and neutralizing threats in real time.{' '}
          <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Zero alerts. Zero downtime. Zero mercy.</b>
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
              fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace',
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
              fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace',
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
              fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace',
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
              border: '1px solid rgba(239, 68, 68,.18)',
              background: 'radial-gradient(circle, rgba(239, 68, 68,.08), transparent 60%)',
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
              border: '1px solid rgba(239, 68, 68,.1)',
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
              border: '1px solid rgba(239, 68, 68,.08)',
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
            <div className="spec-row-left"><span>RANGE · <b style={{ color: 'var(--amber)', fontWeight: 600 }}>2.4 KM</b></span></div>
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

        {/* CTA buttons */}
        <div
          className="hero-cta-anim"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
            marginTop: 48,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 5,
          }}
        >
          <a href="#" className="btn btn-primary">
            Deploy An Agent <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 400 }}>→</span>
          </a>
          <a href="#docs" className="btn btn-ghost">
            Read The Docs
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
            fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          <div><span style={{ color: 'var(--ink)', marginRight: 6 }}>Deployed</span> 12,400+ orgs</div>
          <div><span style={{ color: 'var(--ink)', marginRight: 6 }}>Threats stopped</span> 9.2M / day</div>
          <div><span style={{ color: 'var(--ink)', marginRight: 6 }}>Mean response</span> 12ms</div>
          <div><span style={{ color: 'var(--ink)', marginRight: 6 }}>SOC 2</span> Type II</div>
        </div>
      </div>
    </section>
  )
}
