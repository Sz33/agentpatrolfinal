'use client';
import { useEffect, useRef, useState } from 'react';

// Self-contained transition heading between AboutFlythrough and
// StackingSteps. Owns its own scroll calculation — no imports from
// AboutFlythrough.
//
// Layout strategy (tight scroll-range sticky):
//   <section height: 120vh>
//     <div sticky height:100vh>           ← heading pinned at viewport centre
//     <div height:20vh spacer>            ← release runway before StackingSteps
//   </section>
//
// The 100vh sticky stays pinned while the section's first 100vh is in
// scroll. The trailing 20vh spacer ensures the parent block ends BEFORE
// StackingSteps' first card sticks at top:0, preventing overlap.
//
// Opacity timeline (driven by THIS section's scroll progress, not
// AboutFlythrough's):
//   progress < 0      → 0   (section hasn't entered viewport yet)
//   0   → 0.5         → 0 → 1   fade in as section enters
//   0.5 → 1.0         → 1       fully visible while sticky pins it
//   1.0 → 1.2         → 1 → 0   fade out as section releases
//   ≥ 1.2             → 0   gone
//
// "progress" here = (viewportHeight − sectionTop) / viewportHeight, so
// progress = 0 the instant the section's top crosses the viewport
// bottom, progress = 1 when the section's top is at the viewport top.

export default function SecuringHeadingZone() {
  const sectionRef = useRef<HTMLElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / vh;

      let next: number;
      if (progress < 0) {
        next = 0;
      } else if (progress < 0.5) {
        next = progress / 0.5; // fade in
      } else if (progress < 1.0) {
        next = 1;
      } else if (progress < 1.2) {
        next = 1 - (progress - 1.0) / 0.2; // fade out
      } else {
        next = 0;
      }
      setOpacity(Math.max(0, Math.min(1, next)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="securing-heading-zone"
      style={{
        height: '120vh',
        position: 'relative',
        background: '#000',
      }}
    >
      {/* Sticky pin — heading stays at viewport centre for ~1 viewport. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            opacity,
            willChange: 'opacity',
            transition: 'opacity 0ms', // opacity already smooth via scroll
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 11,
              letterSpacing: '0.3em',
              margin: '0 0 16px',
            }}
          >
            SECURING
          </p>
          <h2
            style={{
              color: 'white',
              fontFamily: 'monospace',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0 0 30px rgba(0,0,0,0.85)',
            }}
          >
            YOUR AGENT STACK
          </h2>
        </div>
      </div>

      {/* Release runway — 20vh of empty scroll so the sticky parent ends
          before StackingSteps' first card pins at top:0. */}
      <div style={{ height: '20vh' }} aria-hidden="true" />
    </section>
  );
}
