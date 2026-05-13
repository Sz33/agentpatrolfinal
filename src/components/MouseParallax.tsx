'use client';
import { useEffect, ReactNode, useRef } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  rotateAmount?: number;
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.05, rotateAmount = 0, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * speed;
      const y = (e.clientY - window.innerHeight / 2) * speed;
      targetRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let af: number;
    function animate() {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06;
      if (ref.current) {
        const rotY = (currentRef.current.x / window.innerWidth) * rotateAmount;
        const rotX = -(currentRef.current.y / window.innerHeight) * rotateAmount;
        ref.current.style.transform = `perspective(1000px) translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }
      af = requestAnimationFrame(animate);
    }
    af = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(af);
    };
  }, [speed, rotateAmount]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}
