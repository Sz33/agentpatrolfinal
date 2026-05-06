'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GsapAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Section fade-up reveals (everything outside the hero)
      const revealEls = gsap.utils.toArray<HTMLElement>(
        'section:not(.hero-section) h2, section:not(.hero-section) h3, section:not(.hero-section) h4, section:not(.hero-section) p, section:not(.hero-section) [data-gsap-reveal]'
      );
      revealEls.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      const hero = document.querySelector<HTMLElement>('.hero-section');

      // 2. Hero background scroll-zoom (subtle scale + fade)
      const heroBg = document.querySelector<HTMLElement>('[data-gsap="hero-bg"]');
      if (heroBg && hero) {
        gsap.to(heroBg, {
          scale: 1.25,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      // 3. Hero text parallax depth — text translates up slower than scroll
      const heroText = document.querySelector<HTMLElement>('[data-gsap="hero-text"]');
      if (heroText && hero) {
        gsap.to(heroText, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      // 3b. Dashboard image parallax (replaces old inline scroll handler)
      const dashImg = document.querySelector<HTMLElement>('[data-gsap="dashboard-image"]');
      if (dashImg) {
        gsap.to(dashImg, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: dashImg,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // 4. Staggered card reveals — "Why Teams Choose AgentPatrol" + any opt-in card
      const cardGroups = gsap.utils.toArray<HTMLElement>('[data-gsap-stagger]');
      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>('[data-gsap-card]');
        if (!cards.length) return;
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // 5. Number count-up — any element with data-gsap-count="500" data-gsap-suffix="+"
      const counters = gsap.utils.toArray<HTMLElement>('[data-gsap-count]');
      counters.forEach((el) => {
        const end = parseInt(el.dataset.gsapCount || '0', 10);
        const suffix = el.dataset.gsapSuffix || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      });

      // Refresh after fonts/images load so positions are accurate
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
