"use client";
import Image from "next/image";

export default function SolaisDashboardSection() {
  return (
    <section
      id="advantage"
      className="w-full py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "rgb(10, 9, 15)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Label */}
        <div className="mb-12 reveal">
          <p
            className="text-[rgb(239,239,229)] text-xs tracking-[0.25em] uppercase opacity-50 mb-3"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            Why Teams Choose AgentPatrol
          </p>
          <h2
            className="text-[rgb(239,239,229)] leading-[1.05]"
            style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: 400,
            }}
          >
            Real-time threat intelligence
            <br />
            built for engineers
          </h2>
        </div>

        {/* Original SOLAIS monitor PNG */}
        <div
          className="relative w-full overflow-hidden reveal"
          style={{
            aspectRatio: "16/8",
            border: "1px solid rgb(53,53,57)",
          }}
        >
          <div
            data-gsap="dashboard-image"
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              willChange: "transform",
            }}
          >
            <Image
              src="/images/dashboard.png"
              alt="AgentPatrol real-time threat intelligence dashboard"
              fill
              className="object-cover object-top"
              priority={false}
            />
          </div>

          {/* Overlay gradient at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, rgb(10,9,15))",
            }}
          />
        </div>

        {/* Feature grid below dashboard */}
        <div data-gsap-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-0">
          {[
            { label: "Full Audit Trail", desc: "Every action your agents took or attempted — logged, timestamped, and exportable." },
            { label: "Works With Any Framework", desc: "LangChain, LangGraph, AutoGen, CrewAI and any custom agent — zero integration required." },
            { label: "Threat-Sharing Flywheel", desc: "Every deployment makes the network smarter. Collective intelligence across all customers." },
            { label: "Kernel-Level Blocking", desc: "Not alerts. Not logs. Prevention at the OS layer — before damage is done." },
          ].map((item, i) => (
            <div
              key={item.label}
              data-gsap-card
              className="card-lift border border-[rgb(53,53,57)] p-6 lg:p-8"
              style={{
                marginLeft: i > 0 ? "-1px" : 0,
                marginTop: "-1px",
              } as React.CSSProperties}
            >
              <h4
                className="text-[rgb(239,239,229)] text-base lg:text-lg mb-3"
                style={{
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </h4>
              <p
                className="text-[rgb(239,239,229)] opacity-50 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body, sans-serif)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
