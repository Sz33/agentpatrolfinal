'use client';
import { useEffect, useRef, useState } from 'react';

// ── Event sequence ──────────────────────────────────────────────────
// One entry per event. `delay` is the offset from "trigger" at which
// step advances to (index + 1). Each entry produces one new line in
// each of the three panels.

type Severity = 'normal' | 'amber' | 'red';

interface DemoEvent {
  delay: number;        // ms from trigger
  agent: string;        // line for Panel 1
  agentSeverity: Severity;
  sensor: string;       // line for Panel 2
  sensorSeverity: Severity;
  report: string;       // line for Panel 3
  pulse?: boolean;      // brief flash on the sensor line for this event
}

const EVENTS: DemoEvent[] = [
  {
    delay: 500,
    agent: '$ agent.run()',
    agentSeverity: 'normal',
    sensor: '[OK] proc exec · Risk: 0',
    sensorSeverity: 'normal',
    report: 'Events: 1 · Blocked: 0',
  },
  {
    delay: 1500,
    agent: '$ open /etc/environment',
    agentSeverity: 'normal',
    sensor: '[35] file read · Risk: 35',
    sensorSeverity: 'amber',
    report: 'Events: 2 · Blocked: 0 · Risk: 35',
  },
  {
    delay: 2500,
    agent: '$ read /home/ubuntu/.aws/credentials',
    agentSeverity: 'red',
    sensor: '[78] cred access · BLOCKED ✕',
    sensorSeverity: 'red',
    report: 'Events: 3 · Blocked: 1 · Risk: 78',
  },
  {
    delay: 3500,
    agent: '→ POST 169.254.169.254 (IMDS)',
    agentSeverity: 'red',
    sensor: '[99] CRITICAL · BLOCKED ✕',
    sensorSeverity: 'red',
    report: 'Events: 4 · Blocked: 2 · Risk: 99',
    pulse: true,
  },
  {
    delay: 4500,
    agent: '→ POST api.openai.com (payload: AWS_KEY...)',
    agentSeverity: 'red',
    sensor: '[NEUTRALIZED] threat blocked',
    sensorSeverity: 'red',
    report: 'Events: 5 · Blocked: 3 · 4.2s',
  },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  normal: 'rgba(255,255,255,0.85)',
  amber: '#f59e0b',
  red: '#ef4444',
};

// Inline keyframes — kept local to this component so the rest of
// globals.css stays untouched.
const STYLES = `
@keyframes ld-line-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ld-pulse-critical {
  0%   { filter: brightness(1); transform: translateX(0); }
  20%  { filter: brightness(1.7); transform: translateX(-1px); }
  40%  { filter: brightness(1.7); transform: translateX(1px); }
  60%  { filter: brightness(1.7); transform: translateX(-1px); }
  100% { filter: brightness(1); transform: translateX(0); }
}
@keyframes ld-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Responsive layout: stacked below 768 px, 3-column at desktop. */
.ld-panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 56px;
}
.ld-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.08);
  transition: opacity 600ms ease-out;
}
@media (min-width: 768px) {
  .ld-panels {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .ld-stats {
    flex-direction: row;
    justify-content: center;
    gap: 48px;
  }
}
`;

// ── Component ───────────────────────────────────────────────────────

export default function LiveDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [step, setStep] = useState(0);   // number of events that have fired
  const [runId, setRunId] = useState(0); // increments on replay

  // Auto-trigger ONCE when the section enters the viewport.
  useEffect(() => {
    if (triggered) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  // Run sequence whenever (re-)triggered.
  useEffect(() => {
    if (!triggered) return;
    const timeouts = EVENTS.map((event, i) =>
      window.setTimeout(() => setStep(i + 1), event.delay),
    );
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [triggered, runId]);

  const replay = () => {
    setStep(0);
    setRunId((n) => n + 1);
  };

  const complete = step >= EVENTS.length;

  // ── Render helpers ─────────────────────────────────────────────────
  const visibleEvents = EVENTS.slice(0, step);

  return (
    <section
      ref={sectionRef}
      id="live-demo"
      style={{
        background: '#000',
        padding: '120px 24px 100px',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
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
          // See It In Action
        </p>
        <h2
          style={{
            color: 'white',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            margin: '20px 0 0',
            maxWidth: 900,
          }}
        >
          Watch AgentPatrol catch a threat{' '}
          <span style={{ color: '#ef4444' }}>in real time.</span>
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 720,
            margin: '20px 0 0',
          }}
        >
          This is a live simulation. A rogue agent attempts to exfiltrate
          credentials. AgentPatrol detects and blocks it before it completes.
        </p>

        {/* 3 panels — class-driven so the media query in STYLES can flip
            the layout to vertical stacking below 768 px. */}
        <div className="ld-panels">
          <Panel
            title="AGENT ACTIVITY"
            statusLabel={complete ? 'TERMINATED' : triggered ? 'RUNNING' : 'IDLE'}
            lines={visibleEvents.map((e) => ({
              text: e.agent,
              color: SEVERITY_COLOR[e.agentSeverity],
            }))}
          />
          <Panel
            title="AGENTPATROL SENSOR"
            statusLabel="ARMED"
            lines={visibleEvents.map((e, i) => ({
              text: e.sensor,
              color: SEVERITY_COLOR[e.sensorSeverity],
              animation: e.pulse && i === step - 1
                ? 'ld-pulse-critical 0.5s ease-out 1, ld-line-in 200ms ease-out'
                : undefined,
            }))}
          />
          <Panel
            title="SESSION REPORT"
            statusLabel={complete ? 'SIGNED' : 'COLLECTING'}
            lines={
              step === 0
                ? [{ text: 'Events: 0 · Blocked: 0', color: 'rgba(255,255,255,0.6)' }]
                : visibleEvents.map((e, i) => ({
                    text: e.report,
                    // Latest line at full brightness, earlier lines slightly muted.
                    color: i === step - 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                  }))
            }
            footer={
              complete ? (
                <a
                  href="#"
                  style={{
                    display: 'inline-block',
                    marginTop: 16,
                    padding: '10px 14px',
                    background: '#ef4444',
                    color: 'white',
                    textDecoration: 'none',
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: 4,
                    animation: 'ld-fade-in 350ms ease-out both',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#ef4444';
                  }}
                >
                  Download Signed Report PDF
                </a>
              ) : null
            }
          />
        </div>

        {/* Replay */}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button
            onClick={replay}
            disabled={!triggered}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: triggered ? 'pointer' : 'default',
              padding: '4px 8px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            ↻ Replay simulation
          </button>
        </div>

        {/* Stats — fade in once simulation completes. Layout (row vs
            stacked) handled by .ld-stats media query. */}
        <div
          className="ld-stats"
          style={{ opacity: complete ? 1 : 0 }}
        >
          <Stat value="0.8ms" label="Block Time" />
          <Stat value="3" label="Actions" />
          <Stat value="4.2s" label="Total" />
        </div>

        {/* CTA */}
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            fontWeight: 500,
            textAlign: 'center',
            margin: '48px 0 0',
            fontFamily: 'var(--font-heading), sans-serif',
          }}
        >
          Run this simulation on your own agent.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <a
            href="#"
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 6,
              fontWeight: 500,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 13,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              border: '1px solid #ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#ef4444';
            }}
          >
            Request Early Access <span style={{ fontWeight: 400 }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

interface Line {
  text: string;
  color: string;
  animation?: string;
}

function Panel({
  title,
  statusLabel,
  lines,
  footer,
}: {
  title: string;
  statusLabel: string;
  lines: Line[];
  footer?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 16,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {/* Header — traffic dots + status label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={dotStyle('#ff5f56')} />
          <span style={dotStyle('#ffbd2e')} />
          <span style={dotStyle('#27c93f')} />
        </div>
        <span
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Title */}
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: '0 0 12px',
        }}
      >
        {title}
      </p>

      {/* Lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {lines.map((line, i) => (
          <div
            // key includes text so a new line at the same index re-runs the
            // entrance animation on replay
            key={`${i}-${line.text}`}
            style={{
              color: line.color,
              fontSize: 12.5,
              lineHeight: 1.5,
              wordBreak: 'break-all',
              animation: line.animation ?? 'ld-line-in 200ms ease-out',
            }}
          >
            {line.text}
          </div>
        ))}
        {footer}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          color: 'white',
          fontFamily: 'var(--font-heading), sans-serif',
          fontSize: 'clamp(28px, 4vw, 48px)',
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function dotStyle(color: string): React.CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  };
}
