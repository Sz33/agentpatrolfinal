'use client';

// Final conversion section. Sits directly above the footer; replaces
// the email-capture block that previously lived inside SolaisFooter.
export default function FinalCtaSection() {
  return (
    <section
      id="get-started"
      style={{
        position: 'relative',
        padding: '140px 24px 100px',
        background:
          'radial-gradient(ellipse at center, rgba(239,68,68,0.05) 0%, rgba(0,0,0,0) 60%), #000',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <p
          style={{
            color: '#ef4444',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          // Get Started
        </p>

        {/* Headline */}
        <h2
          style={{
            color: 'white',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(48px, 7vw, 88px)',
            lineHeight: 1.05,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            margin: '24px 0 0',
          }}
        >
          Your agents are running{' '}
          <span style={{ color: '#ef4444' }}>right now.</span>
        </h2>

        {/* Subheadline */}
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            lineHeight: 1.3,
            fontWeight: 400,
            margin: '20px 0 0',
          }}
        >
          Do you know what they are doing?
        </p>

        {/* Body copy */}
        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 640,
            margin: '32px auto 0',
          }}
        >
          AgentPatrol deploys in 90 seconds. Zero code changes. First session
          report in under five minutes. See exactly what your agent has been
          doing since the moment it first ran.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 40,
          }}
        >
          <a
            href="#"
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '14px 28px',
              borderRadius: 6,
              fontWeight: 500,
              fontFamily: 'var(--font-heading), sans-serif',
              textDecoration: 'none',
              fontSize: 14,
              letterSpacing: '0.04em',
              transition: 'background 0.2s ease',
              border: '1px solid #ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#ef4444';
            }}
          >
            Request Early Access{' '}
            <span
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: 400,
              }}
            >
              →
            </span>
          </a>
          <a
            href="#"
            style={{
              background: 'transparent',
              color: 'white',
              padding: '14px 28px',
              borderRadius: 6,
              fontWeight: 500,
              fontFamily: 'var(--font-heading), sans-serif',
              textDecoration: 'none',
              fontSize: 14,
              letterSpacing: '0.04em',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            }}
          >
            Talk to a Founder
          </a>
        </div>
      </div>
    </section>
  );
}
