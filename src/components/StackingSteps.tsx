'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Step {
  num: string;
  title: string;
  desc: string;
  bg: string;
  accent: string;
  iconLines: string[];
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'DEPLOY',
    desc: 'Drop AgentPatrol into your infrastructure. No code changes. Kernel-level hooks attach automatically to your agent runtime.',
    bg: '#0a0a0a',
    accent: '#7f1d1d',
    iconLines: ['$ agentpatrol install', '> attaching to runtime...', '> kernel hooks active'],
  },
  {
    num: '02',
    title: 'MONITOR',
    desc: 'Every syscall, file access, network connection and permission request your agents make is captured and analysed in real time.',
    bg: '#0f0606',
    accent: '#991b1b',
    iconLines: ['[INFO] syscall: openat', '[INFO] net: connect 8.8.8.8', '[WARN] file: /etc/passwd'],
  },
  {
    num: '03',
    title: 'ENFORCE',
    desc: 'Policy violations get blocked before execution. Exfiltration, privilege escalation, unauthorised API calls — stopped at the kernel.',
    bg: '#1a0a0a',
    accent: '#dc2626',
    iconLines: ['[BLOCK] privilege escalation', '[BLOCK] data exfiltration', '[STATUS] threat neutralized'],
  },
];

const STYLES = `
@keyframes ss-pulse-dot {
  0%, 100% { transform: scale(1); box-shadow: 0 0 6px rgba(255,255,255,0.7); }
  50%      { transform: scale(1.4); box-shadow: 0 0 14px rgba(255,255,255,0.95); }
}
@keyframes ss-blink {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes ss-glitch {
  0%   { transform: translateX(0);  text-shadow: none; }
  20%  { transform: translateX(-3px); text-shadow: 2px 0 #ff0040, -2px 0 #00d0ff; }
  40%  { transform: translateX(3px);  text-shadow: -2px 0 #ff0040, 2px 0 #00d0ff; }
  60%  { transform: translateX(-2px); text-shadow: 1px 0 #ff0040, -1px 0 #00d0ff; }
  80%  { transform: translateX(2px);  text-shadow: -1px 0 #ff0040, 1px 0 #00d0ff; }
  100% { transform: translateX(0);  text-shadow: none; }
}
@keyframes ss-glow {
  0%   { box-shadow: 0 0 0 1px var(--ss-accent), 0 0 0 0 transparent; }
  50%  { box-shadow: 0 0 0 1px var(--ss-accent), 0 0 28px 4px var(--ss-accent); }
  100% { box-shadow: 0 0 0 1px var(--ss-accent), 0 0 0 0 transparent; }
}
@keyframes ss-roll-old {
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(-100%); opacity: 0; }
}
@keyframes ss-roll-new {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.ss-glitch    { animation: ss-glitch 0.4s steps(2, end); }
.ss-glow      { animation: ss-glow 0.8s ease-out; }
.ss-counter   { position: relative; display: inline-block; height: 1em; vertical-align: bottom; overflow: hidden; min-width: 1.6em; }
.ss-counter > span { display: block; }
.ss-counter .ss-old { animation: ss-roll-old 0.3s ease-out forwards; position: absolute; left: 0; top: 0; }
.ss-counter .ss-new { animation: ss-roll-new 0.3s ease-out forwards; }
.ss-pulse-dot {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: white;
  margin-right: 8px;
  vertical-align: middle;
  animation: ss-pulse-dot 1.2s ease-in-out infinite;
}
.ss-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: ss-blink 1s steps(1) infinite;
}
`;

function CardInner({ step, idx, total, runId }: { step: Step; idx: number; total: number; runId: number }) {
  const [typedLines, setTypedLines] = useState<string[]>(() => step.iconLines.map(() => ''));
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    if (runId === 0) return;
    setTypedLines(step.iconLines.map(() => ''));
    setCursorOn(false);

    const acc = step.iconLines.map(() => '');
    let lineIdx = 0;
    let charIdx = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cursorTimer: ReturnType<typeof setTimeout> | undefined;

    function tick() {
      if (cancelled) return;
      if (lineIdx >= step.iconLines.length) {
        setCursorOn(true);
        cursorTimer = setTimeout(() => setCursorOn(false), 3000);
        return;
      }
      const line = step.iconLines[lineIdx];
      acc[lineIdx] = line.slice(0, charIdx + 1);
      setTypedLines([...acc]);
      charIdx++;
      if (charIdx >= line.length) {
        lineIdx++;
        charIdx = 0;
        timer = setTimeout(tick, 150);
      } else {
        timer = setTimeout(tick, 40);
      }
    }

    timer = setTimeout(tick, 200);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (cursorTimer) clearTimeout(cursorTimer);
    };
  }, [runId, step.iconLines]);

  const accentStyle = { '--ss-accent': step.accent } as React.CSSProperties;

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 30px)',
        background: step.bg,
        borderTopLeftRadius: idx > 0 ? '32px' : 0,
        borderTopRightRadius: idx > 0 ? '32px' : 0,
        boxShadow: idx > 0 ? '0 -20px 60px rgba(0,0,0,0.7)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          width: '100%',
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            key={`label-${runId}`}
            style={{
              color: step.accent,
              fontFamily: 'monospace',
              fontSize: '13px',
              letterSpacing: '0.3em',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            STEP{' '}
            <span className="ss-counter" aria-label={step.num}>
              {runId > 0 && <span className="ss-old">00</span>}
              <span className="ss-new">{step.num}</span>
            </span>
          </div>
          <h3
            key={`title-${runId}`}
            className={runId > 0 ? 'ss-glitch' : ''}
            style={{
              color: 'white',
              fontFamily: 'monospace',
              fontSize: 'clamp(60px, 9vw, 140px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              margin: '0 0 32px',
            }}
          >
            {step.title}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            {step.desc}
          </p>
        </div>

        <div
          key={`terminal-${runId}`}
          className={runId > 0 ? 'ss-glow' : ''}
          style={{
            ...accentStyle,
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${step.accent}40`,
            borderRadius: '12px',
            padding: '32px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: 2,
            minHeight: '220px',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: step.accent }} />
          </div>
          {step.iconLines.map((origLine, i) => {
            const text = typedLines[i] || '';
            const hasDot = origLine.toLowerCase().includes('attaching');
            const isLast = i === step.iconLines.length - 1;
            const color =
              origLine.startsWith('[BLOCK]') || origLine.startsWith('[WARN]')
                ? step.accent
                : origLine.startsWith('[STATUS]')
                ? '#22c55e'
                : 'rgba(255,255,255,0.7)';
            return (
              <div key={i} style={{ color, minHeight: '2em' }}>
                {hasDot && text.length > 0 && <span className="ss-pulse-dot" />}
                {text}
                {isLast && cursorOn && <span className="ss-cursor">█</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '40px',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.25em',
          color: step.accent,
        }}
      >
        {step.num} / 0{total}
      </div>
    </div>
  );
}

function StepCard({ step, idx, total }: { step: Step; idx: number; total: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  const wasActive = useRef(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const nowActive = entry.intersectionRatio > 0.6;
        if (nowActive && !wasActive.current) {
          setRunId((r) => r + 1);
        }
        wasActive.current = nowActive;
      },
      { threshold: [0, 0.4, 0.6, 0.9, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'sticky',
        top: 0,
        paddingTop: `calc(${idx} * 30px)`,
        height: '100vh',
      }}
    >
      <CardInner step={step} idx={idx} total={total} runId={runId} />
    </div>
  );
}

export default function StackingSteps() {
  return (
    <section id="how-it-works" style={{ background: '#000', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Continuity streaks bridging from AboutFlythrough — sparse static lines
          that visually echo the 3D flythrough's streaks. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '90vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {[
          { top: '12%', angle: -16 },
          { top: '38%', angle: -14 },
          { top: '64%', angle: -18 },
          { top: '82%', angle: -15 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: s.top,
              left: '-20%',
              width: '140%',
              height: '1px',
              background:
                'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent 100%)',
              transform: `rotate(${s.angle}deg)`,
              transformOrigin: 'left center',
            }}
          />
        ))}
      </div>

      {STEPS.map((step, idx) => (
        <StepCard key={idx} step={step} idx={idx} total={STEPS.length} />
      ))}
    </section>
  );
}
