const CARDS = [
  {
    title: "Runtime enforcement",
    desc: "AgentPatrol intercepts agent actions at the kernel level — before they reach your files, APIs, or infrastructure.",
  },
  {
    title: "Complete observability",
    desc: "Every syscall, network request and permission your agents attempt is logged with full context and timestamps.",
  },
  {
    title: "Zero-friction deployment",
    desc: "No SDK changes, no prompt modifications. Drop in AgentPatrol and your entire agent fleet is covered immediately.",
  },
];

export default function SolaisWhatIsSection() {
  return (
    <section
      id="about"
      className="w-full py-24 lg:py-40"
      style={{ backgroundColor: "rgb(5, 4, 8)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Section label */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/3 shrink-0">
            <p
              className="text-[rgb(239,239,229)] text-xs tracking-[0.25em] uppercase opacity-50 mb-3"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              About
            </p>
            <h2
              className="text-[rgb(239,239,229)] leading-[1.05] reveal"
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 400,
              }}
            >
              What is
              <br />
              AgentPatrol?
            </h2>
          </div>

          {/* Cards */}
          <div className="flex-1 flex flex-col gap-0">
            {CARDS.map((card, i) => (
              <div
                key={card.title}
                className="card-lift reveal border-t border-[rgb(53,53,57)] py-8 lg:py-10 group"
                style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Number */}
                  <span
                    className="text-[rgb(60,9,30)] text-xs tracking-widest uppercase w-16 shrink-0 pt-1"
                    style={{ fontFamily: "var(--font-heading, sans-serif)" }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3
                      className="text-[rgb(239,239,229)] mb-3 text-xl lg:text-2xl"
                      style={{
                        fontFamily: "var(--font-heading, sans-serif)",
                        fontWeight: 400,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-[rgb(239,239,229)] opacity-55 text-sm lg:text-base leading-relaxed"
                      style={{ fontFamily: "var(--font-body, sans-serif)" }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[rgb(53,53,57)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
