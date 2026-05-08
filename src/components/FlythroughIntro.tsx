'use client';
import { useEffect, useRef } from 'react';

// Scroll-linked zoom-through intro. Four phases driven by the user's
// scroll position within a 200vh runway:
//   Phase 1 (0   → 0.3) : fade in + push (opacity 0→1, scale 0.85→1.0)
//   Phase 2 (0.3 → 0.6) : hold at full opacity, scale 1.0
//   Phase 3 (0.6 → 0.8) : exponential zoom-through past the camera
//                          (scale 1 → 26, fades fully by progress 0.8)
//   Phase 4 (0.8 → 1.0) : text gone, brief tail before AboutFlythrough
//                          takes over the viewport
//
// The text targets are mutated directly via refs inside a rAF loop so
// the scroll → transform path is smooth and never triggers React
// re-renders. Background is solid #000 so it fully obscures whatever
// sits behind it (the hero zone) during the transition.

export default function FlythroughIntro() {
  const wrapperRef = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const tickQueued = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return;

    const tick = () => {
      tickQueued.current = false;
      const rect = wrapper.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      let opacity: number;
      let scale: number;
      if (progress < 0.3) {
        const t = progress / 0.3;
        opacity = t;
        scale = 0.85 + t * 0.15;
      } else if (progress < 0.6) {
        opacity = 1;
        scale = 1;
      } else if (progress < 0.8) {
        const t = (progress - 0.6) / 0.2;     // 0 → 1 over 20% range
        scale = 1 + t * t * 25;                // exponential zoom 1 → 26
        opacity = 1 - Math.max(0, (t - 0.6) / 0.4); // fades faster
      } else {
        // Phase 4 — text gone, hold final zoomed-out scale so it stays
        // off-screen rather than snapping back.
        opacity = 0;
        scale = 26;
      }

      target.style.opacity = String(opacity);
      target.style.transform = `translateZ(0) scale(${scale})`;
    };

    const queueTick = () => {
      if (tickQueued.current) return;
      tickQueued.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    let listening = false;
    const attach = () => {
      if (listening) return;
      listening = true;
      window.addEventListener('scroll', queueTick, { passive: true });
      window.addEventListener('resize', queueTick);
      queueTick();
    };
    const detach = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener('scroll', queueTick);
      window.removeEventListener('resize', queueTick);
    };

    // IntersectionObserver gate keeps the rAF loop dormant when the
    // section is far from the viewport.
    const obs = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? attach() : detach()),
      { rootMargin: '300px 0px 300px 0px', threshold: 0 },
    );
    obs.observe(wrapper);

    // Run once on mount in case we land mid-section on a refresh.
    queueTick();

    return () => {
      obs.disconnect();
      detach();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      id="flythrough-intro"
      style={{
        height: '200vh',
        position: 'relative',
        background: '#000',
      }}
    >
      {/* Sticky pin */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          overflow: 'hidden',
          perspective: '1000px',
          padding: '24px',
        }}
      >
        {/* Single transform target — label + headline zoom together */}
        <div
          ref={targetRef}
          style={{
            textAlign: 'center',
            maxWidth: 800,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            opacity: 0,
            transform: 'translateZ(0) scale(0.85)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            transition: 'none',
          }}
        >
          <p
            style={{
              color: '#ef4444',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            // Introducing AgentPatrol
          </p>
          <h2
            style={{
              color: 'white',
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: 'clamp(40px, 6vw, 80px)',
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            The security layer your AI agents have been missing.
          </h2>
        </div>
      </div>
    </section>
  );
}
