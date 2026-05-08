'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** RGB triple, e.g. "239, 68, 68" — drives the border-glow gradient
   *  via `rgba(var(--glow-color), …)` and the particle / ripple colours. */
  glowColor?: string;
  particleCount?: number;
  enableMagnetism?: boolean;
  enableSpotlight?: boolean;
  clickEffect?: boolean;
  enableStars?: boolean;
  disableAnimations?: boolean;
}

const DEFAULT_GLOW_COLOR = '239, 68, 68'; // brand red

// Self-contained CSS, scoped to `.interactive-card`. Three glow layers:
//   ::before  — cursor-tracked bright neon RING along the card edge
//                (radial gradient masked to the perimeter)
//   ::after   — multi-layer box-shadow neon HALO projecting outside
//                the card (30px + 60px blurs + 1px outline + soft inset)
//   .spotlight child — soft INTERIOR radial highlight following cursor
const STYLES = `
.interactive-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  --mouse-x: 50%;
  --mouse-y: 50%;
}

/* Cursor-tracked bright ring along the perimeter */
.interactive-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1.5px;
  border-radius: inherit;
  background: radial-gradient(
    300px circle at var(--mouse-x) var(--mouse-y),
    rgba(var(--glow-color), 0.9),
    rgba(var(--glow-color), 0.3) 40%,
    transparent 70%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}
.interactive-card:hover::before { opacity: 1; }

/* Multi-layer outer neon halo — box-shadow projects OUTSIDE the card
   (overflow:hidden on this element does not clip its own box-shadow). */
.interactive-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 1px rgba(var(--glow-color), 0);
  transition: box-shadow 0.4s ease;
  pointer-events: none;
  z-index: 0;
}
.interactive-card:hover::after {
  box-shadow:
    0 0 0 1px rgba(var(--glow-color), 0.6),
    0 0 30px rgba(var(--glow-color), 0.4),
    0 0 60px rgba(var(--glow-color), 0.25),
    inset 0 0 30px rgba(var(--glow-color), 0.1);
}

/* Soft interior spotlight following cursor */
.interactive-card-spotlight {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    rgba(var(--glow-color), 0.15),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 2;
}
.interactive-card:hover .interactive-card-spotlight { opacity: 1; }

/* Tone-down ring around each ambient star particle */
.interactive-card .particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(var(--glow-color), 0.12);
  border-radius: 50%;
  z-index: -1;
}
`;

const createParticle = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  // Toned-down: alpha 0.4 instead of 1.0, smaller blur halo. Particles
  // stay subtle so they don't compete with the border-glow.
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 0.4);
    box-shadow: 0 0 4px rgba(${color}, 0.25);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

function useMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

let stylesInjected = false;
function useInjectStyles() {
  useEffect(() => {
    if (stylesInjected || typeof document === 'undefined') return;
    const tag = document.createElement('style');
    tag.id = 'interactive-card-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    stylesInjected = true;
  }, []);
}

export default function InteractiveCard({
  children,
  className,
  style,
  glowColor = DEFAULT_GLOW_COLOR,
  particleCount = 8,
  enableMagnetism = true,
  enableSpotlight = true,
  clickEffect = true,
  enableStars = true,
  disableAnimations = false,
}: InteractiveCardProps) {
  useInjectStyles();
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const isMobile = useMobile();
  const shouldDisable = disableAnimations || isMobile;

  const initParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * width, Math.random() * height, glowColor),
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode && p.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !enableStars) return;
    if (!particlesInitialized.current) initParticles();
    memoizedParticles.current.forEach((particle, idx) => {
      const t = window.setTimeout(() => {
        if (!cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.6, duration: 0.4, ease: 'back.out(1.7)' },
        );
        // Drift radius reduced from ±50 → ±30 so particles stay inside.
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.15,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, idx * 100);
      timeoutsRef.current.push(t);
    });
  }, [enableStars, initParticles]);

  useEffect(() => {
    if (shouldDisable) return;
    const el = cardRef.current;
    if (!el) return;

    const onEnter = () => {
      animateParticles();
    };
    const onLeave = () => {
      clearParticles();
      if (enableMagnetism) {
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Update CSS variables so the ::before ring + .spotlight follow the cursor.
      if (enableSpotlight) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mouse-x', `${x}%`);
        el.style.setProperty('--mouse-y', `${y}%`);
      }
      if (enableMagnetism) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const mx = (e.clientX - rect.left - cx) * 0.05;
        const my = (e.clientY - rect.top - cy) * 0.05;
        gsap.to(el, { x: mx, y: my, duration: 0.3, ease: 'power2.out' });
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDist * 2}px;
        height: ${maxDist * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDist}px;
        top: ${y - maxDist}px;
        pointer-events: none;
        z-index: 1000;
      `;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() },
      );
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClick);
      clearParticles();
    };
  }, [
    shouldDisable,
    enableMagnetism,
    enableSpotlight,
    clickEffect,
    glowColor,
    animateParticles,
    clearParticles,
  ]);

  return (
    <div
      ref={cardRef}
      className={`interactive-card ${className ?? ''}`}
      style={
        {
          '--glow-color': glowColor,
          width: '100%',
          height: '100%',
          ...style,
        } as React.CSSProperties
      }
    >
      {/* Soft interior spotlight that follows the cursor on hover. */}
      <div className="interactive-card-spotlight" aria-hidden="true" />
      {/* Card content sits above all glow layers. */}
      <div
        className="interactive-card-content"
        style={{ position: 'relative', zIndex: 3, height: '100%' }}
      >
        {children}
      </div>
    </div>
  );
}
