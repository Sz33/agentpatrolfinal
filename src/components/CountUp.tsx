'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function CountUp({ end, duration = 2.2, suffix = '', prefix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, duration, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
