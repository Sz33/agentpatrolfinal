'use client';
import { useEffect, useRef, useState } from 'react';

// Self-contained transition heading between AboutFlythrough and
// StackingSteps. Owns its own scroll calculation — no imports from
// AboutFlythrough.
//
// Layout strategy (extended sticky):
//   <section height: 180vh>
//     <div sticky height:100vh>           ← heading pinned at viewport centre
//     <div height:80vh spacer>            ← release runway before StackingSteps
//   </section>
//
// The 100vh sticky stays pinned for 80vh of scroll (vs old 20vh).
// The trailing 80vh spacer ensures the parent block ends BEFORE
// StackingSteps' first card sticks at top:0, preventing overlap.
//
// Progress is normalized over el.offsetHeight so thresholds are always
// expressed as fractions of the section's total scroll range (0 → 1).
//
// Opacity timeline:
//   0     → 0.15    fade in  (section entering viewport)
//   0.15  → 0.75    hold     (fully visible — covers entire sticky phase)
//   0.75  → 0.90    fade out (heading exits while still pinned)
//   ≥ 0.90          gone

export default function SecuringHeadingZone() {
  const sectionRef = useRef<HTMLElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / el.offsetHeight;

      let next: number;
      if (progress < 0) {
        next = 0;
      } else if (progress < 0.15) {
        next = progress / 0.15; // fade in
      } else if (progress < 0.75) {
        next = 1; // hold
      } else if (progress < 0.90) {
        next = 1 - (progress - 0.75) / 0.15; // fade out
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
        height: '180vh',
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
            HOW IT WORKS
          </p>
          <h2
            style={{
              color: 'white',
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0 0 30px rgba(0,0,0,0.85)',
            }}
          >
            DEFENSE IN DEPTH
          </h2>
        </div>
      </div>

      {/* Release runway — 80vh of empty scroll so the sticky parent ends
          before StackingSteps' first card pins at top:0. */}
      <div style={{ height: '80vh' }} aria-hidden="true" />
    </section>
  );
}
