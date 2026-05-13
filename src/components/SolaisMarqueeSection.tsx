'use client';
import { useEffect, useRef, useState } from 'react';

const WORDS = ['DETECT', 'PROTECT', 'KERNEL', 'ENFORCE', 'MONITOR', 'BLOCK'];
const REPEATED_WORDS = Array.from({ length: 6 }, () => WORDS).flat();

export default function SolaisMarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      // Trigger early: top rootMargin grows the observation area by 50% of
      // the viewport's height upward, so the marquee fires while user is
      // still ~92% through About section.
      // Note: rootMargin only accepts px or % (vh would throw SyntaxError).
      { threshold: 0, rootMargin: '50% 0px 0px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full overflow-hidden py-4 relative"
      style={{
        backgroundColor: "#0C1120",
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-out',
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 20s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {REPEATED_WORDS.map((word, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span
              style={{
                color: i % 2 === 0 ? '#ffffff' : 'var(--brand)',
                fontSize: '13px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading, sans-serif)',
                opacity: 0.85,
              }}
            >
              {word}
            </span>
            <span
              style={{
                color: 'var(--brand)',
                opacity: 0.4,
                fontSize: '13px',
                letterSpacing: '0.25em',
                fontFamily: 'var(--font-heading, sans-serif)',
                margin: '0 0.6rem',
              }}
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
