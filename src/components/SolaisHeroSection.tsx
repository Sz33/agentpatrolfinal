'use client';
import dynamic from 'next/dynamic';
import { ParallaxLayer } from '@/components/MouseParallax';
import AnimatedButton from '@/components/AnimatedButton';
import { useEarlyAccess } from '@/components/EarlyAccessContext';
const Mascot3D = dynamic(() => import('@/components/Mascot3D'), { ssr: false });

export default function SolaisHeroSection() {
  const { open } = useEarlyAccess();
  return (
    <section
      id="hero-top"
      className="hero-section relative w-full flex flex-col justify-center overflow-hidden"
      style={{ position: 'relative', overflow: 'hidden', backgroundColor: "#050505", perspective: '1500px' }}
    >
      {/* Hero background layer (GSAP scrubs scale + opacity on scroll) */}
      <div
        data-gsap="hero-bg"
        style={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          transformOrigin: 'center center',
          willChange: 'transform',
          zIndex: 0,
        }}
      >
        <ParallaxLayer speed={0.03} className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M 0 0 L 10 0 M 0 0 L 0 10' stroke='white' stroke-dasharray='2 6' stroke-width='0.5' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
              backgroundRepeat: "repeat",
            }}
          />
        </ParallaxLayer>
      </div>

      <div
        data-gsap="hero-text"
        className="relative z-10 max-w-[1440px] mx-auto px-6 pt-[20px] pb-4 w-full flex flex-col lg:flex-row items-center gap-12"
        style={{ willChange: 'transform' }}
      >
        {/* Text content with subtle mouse parallax */}
        <ParallaxLayer speed={0.025} rotateAmount={150} className="flex-1">
          <div>
            {/* "Runtime Security for" label */}
            <p
              className="hero-label uppercase mb-3"
              style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "13px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)" }}
            >
              Runtime Security for
            </p>

            {/* Main heading */}
            <div className="hero-heading">
              <h1
                className="leading-[0.9] mb-2 tracking-[-0.02em] whitespace-nowrap"
                style={{
                  color: "#ffffff",
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontSize: "clamp(60px, 10vw, 148px)",
                  fontWeight: 400,
                  wordSpacing: "-20px",
                }}
              >
                AI AGENTS
              </h1>
              <p
                className="leading-none tracking-[0.12em] mb-10 uppercase"
                style={{
                  color: "#ffffff",
                  opacity: 0.75,
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontSize: "clamp(18px, 3.5vw, 52px)",
                  fontWeight: 400,
                }}
              >
                AT THE KERNEL LEVEL
              </p>
            </div>

            {/* Subtext */}
            <div className="hero-load-sub max-w-2xl">
              <p
                className="leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", fontFamily: "var(--font-body, sans-serif)" }}
              >
                AI agents are being granted access to your files, APIs, and infrastructure. AgentPatrol sits below your agent stack and enforces exactly what they can and cannot do. At the OS level, before damage is done.
              </p>
            </div>

            {/* CTA */}
            <div className="hero-load-cta flex flex-col sm:flex-row items-start gap-4 mt-10">
              <AnimatedButton className="inline-flex items-center gap-3" onClick={open}>
                Request Early Access
                <svg width="14" height="14" viewBox="0 0 24 25" fill="none">
                  <path d="M2.68 20.211V4.058H0V21.34L3.354 24.748H20.484V22.024H4.464L2.68 20.211Z" fill="currentColor"/>
                  <path d="M21.145 0.749H8.907V3.475H18.973L5.945 16.718L7.84 18.644L21.06 5.206V15.734H23.74V3.387L21.145 0.749Z" fill="currentColor"/>
                </svg>
              </AnimatedButton>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm hover:opacity-100 transition-opacity"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body, sans-serif)" }}
              >
                How it works
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </a>
            </div>
          </div>
        </ParallaxLayer>

        {/* Hero right: 3D mascot */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <Mascot3D />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #050505)", zIndex: 2 }}
      />
    </section>
  );
}
