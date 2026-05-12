'use client';

// Minimal text-only section explaining why kernel-level enforcement is
// fundamentally different from application-layer monitoring. Sits
// between StackingSteps and SolaisDashboardSection.
export default function WhyKernelSection() {
  return (
    <section
      id="why-kernel"
      style={{
        background: '#000',
        padding: '120px 24px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Eyebrow */}
        <p
          style={{
            color: 'var(--brand)',
            fontFamily: 'var(--font-mono, ui-monospace), monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          The Technical Difference
        </p>

        {/* Lead headline — two clauses, second clause emphasised */}
        <h2
          style={{
            color: 'white',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.1,
            fontWeight: 400,
            maxWidth: 900,
            margin: '24px 0 0',
            letterSpacing: '-0.01em',
          }}
        >
          Application-layer monitoring sees what the agent reports.
          <br />
          <span style={{ color: 'var(--danger)' }}>
            Kernel-level monitoring sees what the agent does.
          </span>
        </h2>

        {/* Two-column comparison */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginTop: 64,
          }}
        >
          {/* Left — application-layer */}
          <div
            style={{
              padding: 28,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              background: 'transparent',
            }}
          >
            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-mono, ui-monospace), monospace',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: '0 0 16px',
              }}
            >
              Application-Layer
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Sees what the agent reports. A compromised agent simply doesn&apos;t
              report the bad things it&apos;s doing. The monitoring tool is blind.
            </p>
          </div>

          {/* Right — kernel-level (subtle red glow) */}
          <div
            style={{
              padding: 28,
              border: '1px solid rgba(var(--danger-rgb),0.3)',
              borderRadius: 8,
              background: 'rgba(var(--danger-rgb),0.04)',
              boxShadow: '0 0 32px rgba(var(--danger-rgb),0.06)',
            }}
          >
            <p
              style={{
                color: 'var(--danger)',
                fontFamily: 'var(--font-mono, ui-monospace), monospace',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: '0 0 16px',
              }}
            >
              Kernel-Level (AgentPatrol)
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Sees what the agent does. Tetragon eBPF captures every syscall,
              file access, and network connection. The kernel sees everything
              regardless of what the agent code reports.
            </p>
          </div>
        </div>

        {/* Closing impact lines */}
        <div style={{ marginTop: 72 }}>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(20px, 2.2vw, 28px)',
              fontWeight: 500,
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 820,
            }}
          >
            An agent reading{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono, ui-monospace), monospace',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9em',
              }}
            >
              /etc/passwd
            </code>{' '}
            gets{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono, ui-monospace), monospace',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9em',
              }}
            >
              SIGKILL
            </code>{' '}
            before the syscall completes.
          </p>
          <p
            style={{
              color: 'var(--danger)',
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: 'clamp(28px, 3.4vw, 44px)',
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              margin: '28px 0 0',
            }}
          >
            Not flagged. Not alerted. Killed. Before.
          </p>
        </div>
      </div>
    </section>
  );
}
