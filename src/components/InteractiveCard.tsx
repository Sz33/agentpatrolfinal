'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** RGB triple, e.g. "239, 68, 68" — drives the border glow gradient
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

// Self-contained CSS for the per-card visual chrome. Scoped to the
// `.interactive-card` class so it cannot collide with MagicBento or any
// other component. No layout / sizing rules — the parent grid and the
// inline `style` prop control the card's box.
const STYLES = `
.interactive-card {
  position: relative;
  overflow: hidden;
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
}
.interactive-card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
  );
  border-radius: inherit;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 1;
}
.interactive-card--border-glow:hover {
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(var(--glow-color), 0.2);
}
.interactive-card .particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(var(--glow-color), 0.2);
  border-radius: 50%;
  z-index: -1;
}
`;

const createParticle = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
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
  particleCount = 12,
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
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
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

    const updateGlow = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--glow-x', `${x}%`);
      el.style.setProperty('--glow-y', `${y}%`);
      el.style.setProperty('--glow-intensity', '1');
      el.style.setProperty('--glow-radius', '200px');
    };

    const onEnter = () => {
      animateParticles();
      el.style.setProperty('--glow-intensity', '1');
    };
    const onLeave = () => {
      clearParticles();
      el.style.setProperty('--glow-intensity', '0');
      if (enableMagnetism) {
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    };
    const onMove = (e: MouseEvent) => {
      if (enableSpotlight) updateGlow(e);
      if (enableMagnetism) {
        const rect = el.getBoundingClientRect();
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
      className={`interactive-card interactive-card--border-glow ${className ?? ''}`}
      style={
        {
          '--glow-color': glowColor,
          width: '100%',
          height: '100%',
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
