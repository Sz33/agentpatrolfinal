'use client';
import { useRef, useEffect, useCallback, useState, type ReactNode, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import './MagicCard.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '239, 68, 68';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string) => {
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

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// Single GlobalSpotlight mounted once per page section.
// Watches the entire .magic-bento-zone area and lights up cards near cursor.
const GlobalSpotlight = ({
  zoneSelector,
  spotlightRadius,
  glowColor,
  enabled,
}: {
  zoneSelector: string;
  spotlightRadius: number;
  glowColor: string;
  enabled: boolean;
}) => {
  useEffect(() => {
    if (!enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);

    const handleMouseMove = (e: MouseEvent) => {
      const zone = document.querySelector(zoneSelector) as HTMLElement | null;
      if (!zone) return;
      const rect = zone.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const cards = zone.querySelectorAll<HTMLElement>('.magic-card');

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach((c) => c.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cr = card.getBoundingClientRect();
        const cx = cr.left + cr.width / 2;
        const cy = cr.top + cr.height / 2;
        const distance = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2;
        const eff = Math.max(0, distance);
        minDistance = Math.min(minDistance, eff);

        let glowIntensity = 0;
        if (eff <= proximity) glowIntensity = 1;
        else if (eff <= fadeDistance) glowIntensity = (fadeDistance - eff) / (fadeDistance - proximity);

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;
      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      const zone = document.querySelector(zoneSelector) as HTMLElement | null;
      zone?.querySelectorAll<HTMLElement>('.magic-card').forEach((c) =>
        c.style.setProperty('--glow-intensity', '0')
      );
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlight.parentNode?.removeChild(spotlight);
    };
  }, [enabled, zoneSelector, spotlightRadius, glowColor]);

  return null;
};

// The ParticleCard wrapper applied to every individual card.
// Adds particles, tilt, magnetism, click ripple. Border glow uses
// CSS variables set by GlobalSpotlight. Stars/particles spawn on hover.
type MagicCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
  particleCount?: number;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  disableAnimations?: boolean;
};

export function MagicCard({
  children,
  className = '',
  style,
  glowColor = DEFAULT_GLOW_COLOR,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = true,
  clickEffect = true,
  disableAnimations = false,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
  const isMobile = useMobileDetection();
  const shouldDisable = disableAnimations || isMobile;

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();
    memoizedParticles.current.forEach((particle, i) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLElement;
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
      }, i * 100);
      timeoutsRef.current.push(id);
    });
  }, [initializeParticles]);

  useEffect(() => {
    console.log('[MagicCard] shouldDisable=', shouldDisable, 'isMobile=', isMobile);
    if (shouldDisable || !cardRef.current) {
      console.log('[MagicCard] not wiring events. shouldDisable=', shouldDisable, 'ref=', cardRef.current);
      return;
    }
    const el = cardRef.current;
    console.log('[MagicCard] wiring events on', el);

    const handleEnter = () => {
      console.log('[MagicCard] mouseenter fired', cardRef.current);
      isHoveredRef.current = true;
      if (enableStars) animateParticles();
      if (enableTilt) {
        gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
      }
    };

    const handleLeave = () => {
      console.log('[MagicCard] mouseleave');
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    const handleMove = (e: MouseEvent) => {
      console.log('[MagicCard] mousemove', e.clientX, e.clientY);
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (enableTilt) {
        const rx = ((y - cy) / cy) * -10;
        const ry = ((x - cx) / cx) * 10;
        gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      }
      if (enableMagnetism) {
        magnetismAnimationRef.current = gsap.to(el, {
          x: (x - cx) * 0.05,
          y: (y - cy) * 0.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      console.log('[MagicCard] click', e.clientX, e.clientY);
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, shouldDisable, enableStars, enableTilt, enableMagnetism, clickEffect, glowColor]);

  const cls = `magic-card${enableBorderGlow ? ' magic-card--border-glow' : ''} ${className}`.trim();
  return (
    <div
      ref={cardRef}
      className={cls}
      style={{ ...style, '--glow-color': glowColor } as CSSProperties}
    >
      {children}
    </div>
  );
}

// Mounted ONCE in FeaturesSection — drives the cursor-tracked spotlight.
export function MagicCardSpotlight({
  zoneSelector = '.magic-bento-zone',
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
  enabled = true,
}: {
  zoneSelector?: string;
  spotlightRadius?: number;
  glowColor?: string;
  enabled?: boolean;
}) {
  const isMobile = useMobileDetection();
  return (
    <GlobalSpotlight
      zoneSelector={zoneSelector}
      spotlightRadius={spotlightRadius}
      glowColor={glowColor}
      enabled={enabled && !isMobile}
    />
  );
}

export default MagicCard;
