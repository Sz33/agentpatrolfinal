'use client'
import AnimatedButton from '@/components/AnimatedButton'

export function Navbar() {
  return (
    <header
      className="navbar-blur-transition"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 32px',
        background: 'linear-gradient(180deg, rgba(8,8,10,.85), rgba(8,8,10,0))',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, letterSpacing: '.18em', fontSize: 14 }}>
        <span
          className="brand-dot"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--amber)',
            boxShadow: '0 0 12px var(--amber)',
            display: 'inline-block',
          }}
        />
        <b style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'inherit' }}>
          Agent<span className="brand-patrol">Patrol</span>
        </b>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Features', href: '#features' },
          { label: 'Demo', href: '#live-demo' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            style={{
              color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              fontSize: 12,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* CTA button */}
      <div>
        <a href="#" style={{ textDecoration: 'none' }}>
          <AnimatedButton>
            Request Early Access <span style={{ fontWeight: 400 }}>→</span>
          </AnimatedButton>
        </a>
      </div>
    </header>
  )
}
