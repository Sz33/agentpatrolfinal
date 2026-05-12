'use client';
import MagicCard, { MagicCardSpotlight } from '@/components/MagicCard';

interface Feature {
  num: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  tag: string;
}

const FEATURES: Feature[] = [
  {
    num: '01',
    titleLine1: 'Kernel-Level',
    titleLine2: 'Enforcement',
    body: 'seccomp-bpf and Tetragon eBPF sit between your agent and the OS. Unauthorized syscalls — credential reads, shell spawns, unexpected endpoints — stopped before they complete.',
    tag: 'OWASP ASI04',
  },
  {
    num: '02',
    titleLine1: 'LLM Proxy',
    titleLine2: 'Intercept',
    body: "Your agent thinks it's talking to OpenAI or Anthropic. It's talking to AgentPatrol first. Every prompt, tool call, and response intercepted and logged.",
    tag: 'REASONING LAYER VISIBILITY',
  },
  {
    num: '03',
    titleLine1: 'Pre-Flight',
    titleLine2: 'Gate',
    body: 'Scan any agent codebase before production. Dependency vulnerabilities, hardcoded secrets, and dangerous patterns caught before deployment.',
    tag: 'SUPPLY CHAIN PROTECTION',
  },
  {
    num: '04',
    titleLine1: 'AI Detection',
    titleLine2: 'Engine',
    body: 'Two streams run simultaneously — OS-layer actions and agent reasoning. Both correlated to produce a threat verdict no single-layer tool can replicate.',
    tag: 'DUAL-STREAM CORRELATION',
  },
  {
    num: '05',
    titleLine1: 'Behavioral',
    titleLine2: 'Baseline',
    body: "AgentPatrol learns each agent's normal behavior. Deviations — unusual paths, unexpected destinations, oversized payloads — flagged immediately. Slow-burn attacks caught across sessions.",
    tag: 'ANOMALY DETECTION',
  },
  {
    num: '06',
    titleLine1: 'Signed Session',
    titleLine2: 'Report',
    body: 'Every run produces a signed, tamper-evident report. Every action mapped to OWASP Agentic AI Top 10. Ready for your auditor, SOC-2 package, or enterprise client.',
    tag: 'AUDIT READY',
  },
];

const STYLES = `
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  perspective: 1000px;
}
@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* All cards identical — no nth-child, no span overrides. */
.feature-card {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;
}
.feature-title-block {
  margin-top: 0;
}
.feature-title-line1,
.feature-title-line2 {
  font-family: var(--font-heading), sans-serif;
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0;
  font-weight: 400;
}
.feature-title-line1 { color: #ffffff; }
.feature-title-line2 { color: #ef4444; }
.feature-body {
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  line-height: 1.7;
  margin-top: 12px;
}
.feature-tag {
  color: #ef4444;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: auto;
  padding-top: 24px;
}
`;

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="magic-bento-zone"
      style={{
        background: '#000',
        padding: '120px 0 100px',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 56px' }}>
        {/* Eyebrow */}
        <p
          style={{
            color: '#ef4444',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          What AgentPatrol Does
        </p>
        {/* Headline */}
        <h2
          style={{
            color: 'white',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            maxWidth: 800,
            margin: '20px 0 0',
            textTransform: 'uppercase',
          }}
        >
          Every layer of your agent monitored and enforced.
        </h2>
      </div>

      <MagicCardSpotlight glowColor="239, 68, 68" spotlightRadius={400} />

      {/* Uniform 3×2 grid — every card identical, no nth-child overrides. */}
      <div className="features-grid">
        {FEATURES.map((f) => (
          <MagicCard
            key={f.num}
            glowColor="239, 68, 68"
            particleCount={12}
            enableStars
            enableBorderGlow
            enableTilt={false}
            enableMagnetism
            clickEffect
          >
            <div className="feature-card">
              <div className="feature-title-block">
                <h3 className="feature-title-line1">{f.titleLine1}</h3>
                <h3 className="feature-title-line2">{f.titleLine2}</h3>
              </div>
              <p className="feature-body">{f.body}</p>
              <span className="feature-tag">→ {f.tag}</span>
            </div>
          </MagicCard>
        ))}
      </div>
    </section>
  );
}
