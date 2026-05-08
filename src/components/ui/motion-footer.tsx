'use client';
// CinematicFooter — adapted for AgentPatrol.
//
// Mechanic: outer wrapper takes 100vh of layout space. Inner <footer>
// is `position: fixed; bottom: 0` so it stays pinned to the viewport
// bottom. As the user scrolls past the rest of the page the footer
// reveals from underneath — that's the "curtain" effect. GSAP
// ScrollTrigger drives a parallax / staggered fade-in for the giant
// background text + heading + pills as the footer enters view.
//
// Adaptations from upstream (per spec):
//   • Giant text → "AGENTPATROL"
//   • Marquee strip removed
//   • Heading → "Patrol never sleeps."
//   • iOS / Android pills → "Request Early Access" / "Talk to a Founder"
//   • Secondary text pills → site nav links
//   • Copyright → AgentPatrol
//   • "Crafted with ❤" badge → removed
//   • Bottom bar simplified to two-item justify-between layout
import React, { useEffect, useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Local CSS — scoped to `.cinematic-footer` so the dark palette,
// glass pills, aurora, grid, and giant-text styles never bleed into
// other components. Theme variables resolved locally rather than
// remapping the project's global tokens.
const STYLES = `
.cinematic-footer {
  --cf-bg: #000000;
  --cf-fg: #ffffff;
  --cf-primary: #ef4444;
  --cf-muted: rgba(255, 255, 255, 0.5);
  --cf-border: rgba(255, 255, 255, 0.1);
  position: relative;
  width: 100%;
}

/* The curtain wrapper — gives 100vh of scroll runway and clips its
   contents so the fixed inner footer doesn't bleed elsewhere. */
.cinematic-footer__wrapper {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* Fixed inner footer — pinned to viewport bottom by default, revealed
   as the user scrolls. */
.cinematic-footer__panel {
  position: fixed;
  inset: 0 0 0 0;
  z-index: 0;
  background: var(--cf-bg);
  color: var(--cf-fg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Aurora — two large blurred red blobs that drift slowly. */
.cinematic-footer__aurora {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse 800px 600px at 25% 30%, rgba(239,68,68,0.18), transparent 60%),
    radial-gradient(ellipse 700px 500px at 78% 70%, rgba(239,68,68,0.10), transparent 65%);
  filter: blur(40px);
  animation: cf-aurora-drift 18s ease-in-out infinite alternate;
  pointer-events: none;
}
@keyframes cf-aurora-drift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-3%, 2%); }
}

/* Grid background — fine dotted line pattern. */
.cinematic-footer__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse at center, black 35%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 80%);
  pointer-events: none;
}

/* Giant background text — outlined fill with a soft top fade. */
.cinematic-footer__giant {
  position: absolute;
  left: 50%;
  bottom: -3vw;
  transform: translateX(-50%);
  font-family: var(--font-heading), sans-serif;
  font-weight: 900;
  font-size: clamp(120px, 22vw, 380px);
  line-height: 0.82;
  letter-spacing: -0.04em;
  white-space: nowrap;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.10) 0%,
    rgba(239,68,68,0.06) 60%,
    rgba(0,0,0,0) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.06);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  will-change: transform, opacity;
}

/* Centered content stack. */
.cinematic-footer__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 24px;
  text-align: center;
  max-width: 900px;
}
.cinematic-footer__heading {
  font-family: var(--font-heading), sans-serif;
  font-weight: 400;
  font-size: clamp(48px, 8vw, 120px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0;
  text-shadow: 0 0 40px rgba(239,68,68,0.25), 0 4px 30px rgba(0,0,0,0.6);
  will-change: transform, opacity;
}
.cinematic-footer__heading .cf-accent { color: var(--cf-primary); }

/* Glass pill — used for primary CTAs and secondary nav links. */
.footer-glass-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--cf-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--cf-fg);
  font-family: var(--font-heading), sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  will-change: transform;
}
.footer-glass-pill:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.4);
  color: var(--cf-fg);
}
.footer-glass-pill--primary {
  background: rgba(239, 68, 68, 0.85);
  border-color: rgba(239, 68, 68, 1);
  box-shadow: 0 0 0 1px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.25);
}
.footer-glass-pill--primary:hover {
  background: rgba(220, 38, 38, 1);
  border-color: rgba(220, 38, 38, 1);
}

/* Bottom bar */
.cinematic-footer__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 32px;
  border-top: 1px solid var(--cf-border);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cf-muted);
}
.cinematic-footer__top {
  background: transparent;
  border: 1px solid var(--cf-border);
  color: var(--cf-fg);
  padding: 8px 14px;
  border-radius: 9999px;
  cursor: pointer;
  font: inherit;
  transition: background 0.2s, border-color 0.2s;
}
.cinematic-footer__top:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.5);
}
`;

let stylesInjected = false;
function useInjectStyles() {
  useEffect(() => {
    if (stylesInjected || typeof document === 'undefined') return;
    const tag = document.createElement('style');
    tag.id = 'cinematic-footer-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    stylesInjected = true;
  }, []);
}

// ── MagneticButton — translates toward the cursor on hover via GSAP.
// Accepts either an anchor or button element via the `as` prop.
type MagneticButtonProps = {
  as?: 'a' | 'button';
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

function MagneticButton({
  as = 'button',
  href,
  className,
  style,
  children,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove: EventListener = (event) => {
      const e = event as globalThis.MouseEvent;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave: EventListener = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (as === 'a') {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        style={style}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ── Static nav data
const SECONDARY_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pre-Flight Scan', href: '#' },
  { label: 'Session Reports', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

// ── CinematicFooter
export function CinematicFooter() {
  useInjectStyles();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal on enter.
      gsap.fromTo(
        [headingRef.current, primaryRef.current, secondaryRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      // Parallax on the giant text — drifts upward as user scrolls in.
      if (giantTextRef.current) {
        gsap.fromTo(
          giantTextRef.current,
          { yPercent: 30, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        );
      }
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  const onTopClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cinematic-footer" aria-label="Site footer">
      <div ref={wrapperRef} className="cinematic-footer__wrapper">
        <footer className="cinematic-footer__panel">
          {/* Background layers */}
          <div className="cinematic-footer__aurora" aria-hidden="true" />
          <div className="cinematic-footer__grid" aria-hidden="true" />
          <div ref={giantTextRef} className="cinematic-footer__giant" aria-hidden="true">
            AGENTPATROL
          </div>

          {/* Centered content */}
          <div className="cinematic-footer__content">
            <h2 ref={headingRef} className="cinematic-footer__heading">
              Patrol never <span className="cf-accent">sleeps.</span>
            </h2>

            {/* Primary CTAs — magnetic glass pills */}
            <div
              ref={primaryRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}
            >
              <MagneticButton
                as="a"
                href="#early-access"
                className="footer-glass-pill footer-glass-pill--primary"
                style={{
                  padding: '20px 40px',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Request Early Access
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="footer-glass-pill"
                style={{
                  padding: '20px 40px',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Talk to a Founder
              </MagneticButton>
            </div>

            {/* Secondary nav pills */}
            <div
              ref={secondaryRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
            >
              {SECONDARY_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="footer-glass-pill"
                  style={{
                    padding: '10px 18px',
                    borderRadius: 9999,
                    fontSize: 11,
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="cinematic-footer__bar">
            <span>© {new Date().getFullYear()} AgentPatrol. All rights reserved.</span>
            <button
              type="button"
              onClick={onTopClick}
              className="cinematic-footer__top"
              aria-label="Back to top"
            >
              ↑ Back to top
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CinematicFooter;
