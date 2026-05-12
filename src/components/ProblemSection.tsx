'use client';

// "Sound familiar?" — three pain-point cards with a closing accent line.
// Sits between SecuringHeadingZone and StackingSteps so the user lands on
// the problem statement before seeing the solution stack.

interface PainCard {
  num: string;
  title: string;
  body: string;
}

const CARDS: PainCard[] = [
  {
    num: '01',
    title: 'NO VISIBILITY AT RUNTIME',
    body: "Your agent runs as a black box once deployed. You have no way to see what it's actually doing during each run.",
  },
  {
    num: '02',
    title: 'NO WAY TO STOP IT',
    body: "Alerts come too late. By the time anyone investigates, the damage is already done. There's no enforcement layer.",
  },
  {
    num: '03',
    title: 'NO AUDIT TRAIL',
    body: 'Your CISO, auditor, or enterprise client asks for proof. You have no session reports. Nothing to show.',
  },
];

const STYLES = `
.problem-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 56px;
}
@media (min-width: 768px) {
  .problem-grid { grid-template-columns: repeat(3, 1fr); }
}
`;

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{ background: '#000', padding: '120px 24px 100px', position: 'relative' }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
          Sound Familiar?
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
          }}
        >
          You deployed an AI agent.
          <br />
          Now what?
        </h2>

        {/* Cards */}
        <div className="problem-grid">
          {CARDS.map((card) => (
            <div
              key={card.num}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: 28,
              }}
            >
              <p
                style={{
                  color: '#ef4444',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  margin: '0 0 16px',
                }}
              >
                {card.num}
              </p>
              <h3
                style={{
                  color: 'white',
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize: 16,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: '0 0 12px',
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing accent line */}
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 17,
            lineHeight: 1.5,
            maxWidth: 720,
            margin: '56px auto 0',
            paddingLeft: 16,
            borderLeft: '2px solid #ef4444',
          }}
        >
          This isn&apos;t a future risk. It&apos;s the current state of AI agent
          deployment right now.
        </p>
      </div>
    </section>
  );
}
