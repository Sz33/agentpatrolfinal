'use client';
import { useEffect, useState } from 'react';
import { headingOpacity, computeAboutExtendedProgress } from './AboutFlythrough';

// 100vh-tall scroll-runway section that owns the "SECURING / YOUR AGENT
// STACK" heading. Sits immediately after AboutFlythrough so its sticky
// range starts the moment the about runway ends. The sticky child fills
// the section vertically; once user scrolls past this section the sticky
// releases naturally and the heading scrolls upward out of view.
export default function SecuringHeadingZone() {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const update = () => setOpacity(headingOpacity(computeAboutExtendedProgress()));
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
      id="securing-your-agent-stack-zone"
      style={{ height: '100vh', position: 'relative', background: '#000' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <div style={{ textAlign: 'center', opacity, willChange: 'opacity' }}>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
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
    </section>
  );
}
