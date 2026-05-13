"use client";
import { useEffect, useRef, useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import { useEarlyAccess } from "@/components/EarlyAccessContext";

function SlotMachineDigit({ targetDigit, delay }: { targetDigit: number; delay: number }) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          setTimeout(() => {
            // Animate column: start from 0 shown at top, scroll down to targetDigit
            const totalDigits = 10; // 0-9
            // We want to end at targetDigit. Column is [0,1,2,...,9,0,1,...,targetDigit]
            // Simple: animate translateY so the right digit is visible
            const finalY = -(targetDigit * 100);
            setCurrentOffset(finalY);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [targetDigit, delay]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ width: "1ch", height: "1em", display: "inline-block" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${currentOffset}%)`,
          transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} style={{ height: "1em", lineHeight: "1em", display: "block" }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlotMachineNumber({ value }: { value: string }) {
  const digits = value.split("").filter((c) => /\d/.test(c));
  const nonDigitBefore = value.split(/\d/)[0];

  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end" }}>
      {nonDigitBefore}
      {digits.map((d, i) => (
        <SlotMachineDigit
          key={i}
          targetDigit={parseInt(d, 10)}
          delay={i * 150}
        />
      ))}
    </span>
  );
}

export default function SolaisStatsSection() {
  const { open } = useEarlyAccess();
  return (
    <section
      className="w-full py-24 lg:py-32"
      style={{ backgroundColor: "rgb(10, 9, 15)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* CTA panel — full width now that stat is removed */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-[rgb(239,239,229)] leading-[1.1] reveal"
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 400,
              }}
            >
              Secure your agents before they act
            </h3>
            <p
              className="text-[rgb(239,239,229)] opacity-55 text-sm lg:text-base leading-relaxed reveal"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              AI agents already have access to your systems. AgentPatrol gives you full visibility and control before something goes wrong.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal">
              <AnimatedButton className="inline-flex items-center gap-3" onClick={open}>
                Request Early Access
                <svg width="12" height="12" viewBox="0 0 24 25" fill="none">
                  <path d="M2.68 20.211V4.058H0V21.34L3.354 24.748H20.484V22.024H4.464L2.68 20.211Z" fill="currentColor"/>
                  <path d="M21.145 0.749H8.907V3.475H18.973L5.945 16.718L7.84 18.644L21.06 5.206V15.734H23.74V3.387L21.145 0.749Z" fill="currentColor"/>
                </svg>
              </AnimatedButton>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-[rgb(239,239,229)] text-sm opacity-60 hover:opacity-100 transition-opacity"
                style={{ fontFamily: "var(--font-body, sans-serif)" }}
              >
                See how it works
                <svg width="12" height="12" viewBox="0 0 24 25" fill="none">
                  <path d="M2.68 20.211V4.058H0V21.34L3.354 24.748H20.484V22.024H4.464L2.68 20.211Z" fill="currentColor"/>
                  <path d="M21.145 0.749H8.907V3.475H18.973L5.945 16.718L7.84 18.644L21.06 5.206V15.734H23.74V3.387L21.145 0.749Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
