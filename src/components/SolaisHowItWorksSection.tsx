"use client";
import { useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Deploy",
    desc: "Drop AgentPatrol into your infrastructure. No code changes. Kernel-level hooks attach automatically to your agent runtime.",
  },
  {
    number: "02",
    title: "Monitor",
    desc: "Every syscall, file access, network connection and permission request your agents make is captured and analysed in real time.",
  },
  {
    number: "03",
    title: "Enforce",
    desc: "Policy violations get blocked before execution. Exfiltration, privilege escalation, unauthorised API calls — stopped at the kernel.",
  },
];

export default function SolaisHowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="w-full py-24 lg:py-40"
      style={{ backgroundColor: "rgb(5, 4, 8)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/3 shrink-0">
            <p
              className="text-[rgb(239,239,229)] text-xs tracking-[0.25em] uppercase opacity-50 mb-3"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              Securing
            </p>
            <h2
              className="text-[rgb(239,239,229)] leading-[1.05] reveal"
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 400,
              }}
            >
              Your Agent Stack
            </h2>
          </div>
          <div className="lg:w-1/2">
            <p
              className="text-[rgb(239,239,229)] opacity-55 leading-relaxed text-base reveal"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              A three-step process to detect, monitor and block threats before your agents cause damage.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div>
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="process-step reveal cursor-pointer group"
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Number */}
              <span
                className="text-[rgb(239,239,229)] opacity-30 text-sm pt-1 shrink-0"
                style={{ fontFamily: "var(--font-heading, sans-serif)" }}
              >
                {step.number}
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <h3
                    className="text-[rgb(239,239,229)] text-2xl lg:text-4xl transition-all duration-300 group-hover:translate-x-2"
                    style={{
                      fontFamily: "var(--font-heading, sans-serif)",
                      fontWeight: 400,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Corner icon */}
                  <div
                    className="relative shrink-0 ml-4"
                    style={{ opacity: activeStep === i ? 1 : 0, transition: "opacity 0.2s ease" }}
                  >
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      className="text-[rgb(239,239,229)]"
                    >
                      <path d="M17 0V8.586C17 8.851 16.895 9.105 16.707 9.293L13.293 12.707C13.105 12.895 12.851 13 12.586 13H0" stroke="currentColor"/>
                    </svg>
                  </div>
                </div>

                <div className="process-step-desc">
                  <p
                    className="text-[rgb(239,239,229)] opacity-55 text-sm lg:text-base leading-relaxed pt-3"
                    style={{ fontFamily: "var(--font-body, sans-serif)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-[rgb(53,53,57)]" />
        </div>
      </div>
    </section>
  );
}
