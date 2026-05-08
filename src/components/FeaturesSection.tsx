'use client';
import MagicCard from '@/components/MagicCard';

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
    body: 'seccomp-bpf syscall filters and Tetragon eBPF sit between your agent and the operating system. An agent that tries to read credentials, spawn an unauthorized shell, or connect to an unexpected endpoint gets stopped before the action completes. Not logged after. Stopped before.',
    tag: 'OWASP ASI04',
  },
  {
    num: '02',
    titleLine1: 'LLM Proxy',
    titleLine2: 'Intercept',
    body: 'Your agent thinks it is talking directly to OpenAI or Anthropic. It is actually talking to AgentPatrol first. Every prompt is inspected for data exfiltration. Every tool call is logged. Every response captured. The complete reasoning chain visible for every session.',
    tag: 'REASONING LAYER VISIBILITY',
  },
  {
    num: '03',
    titleLine1: 'Pre-Flight',
    titleLine2: 'Gate',
    body: 'Run agentpatrol scan on any agent codebase before it touches production. Dependency vulnerabilities, hardcoded secrets, dangerous code patterns, and unexpected capabilities all caught before deployment. Works on your own agent code and on code written by others.',
    tag: 'SUPPLY CHAIN PROTECTION',
  },
  {
    num: '04',
    titleLine1: 'AI Detection',
    titleLine2: 'Engine',
    body: 'Two streams run simultaneously. Stream A captures what the agent did at the OS layer. Stream B captures what the agent was reasoning. Both correlated by Claude to produce a unified threat verdict no single-layer tool can replicate.',
    tag: 'DUAL-STREAM CORRELATION',
  },
  {
    num: '05',
    titleLine1: 'Behavioral',
    titleLine2: 'Baseline',
    body: 'AgentPatrol learns what normal looks like for each individual agent over time. When behavior deviates, new file paths accessed, unusual network destinations, oversized LLM payloads, you know immediately. Slow-burn attacks spanning multiple sessions are caught.',
    tag: 'ANOMALY DETECTION',
  },
  {
    num: '06',
    titleLine1: 'Signed Session',
    titleLine2: 'Report',
    body: 'Every agent run produces a signed compliance report. Tamper-evident. Cryptographically sealed. Every action mapped to OWASP Agentic AI Top 10 categories. Show it to your auditor. Attach it to your SOC-2 evidence package. Send it to your enterprise client.',
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
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 360px;
  position: relative;
  z-index: 0;
}
.feature-num {
  color: #ef4444;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 11px;
  letter-spacing: 0.12em;
}
.feature-title-block {
  margin-top: 80px;
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
  margin-top: 16px;
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
          // What AgentPatrol Does
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

      {/* Uniform 3×2 grid — every card identical, no nth-child overrides. */}
      <div className="features-grid">
        {FEATURES.map((f) => (
          <MagicCard
            key={f.num}
            glowColor="239, 68, 68"
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt={false}
            enableMagnetism
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            disableAnimations={false}
            style={{ borderRadius: 8 }}
          >
            <div className="feature-card">
              <span className="feature-num">// {f.num}</span>
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
