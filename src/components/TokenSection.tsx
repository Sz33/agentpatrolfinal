"use client";

import { useState, useEffect, useRef } from "react";

const stats = [
  { label: "Circulating Supply", value: "862M" },
  { label: "Total Holders", value: "50K+" },
  { label: "TVL Staked", value: "$14M+" },
  { label: "APY", value: "225%" },
];

function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          const startTime = performance.now();
          const duration = 2000;
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplay(`${prefix}${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export default function TokenSection() {
  return (
    <section id="token" style={{ backgroundColor: "rgb(10,9,15)", padding: "100px 40px" }}>
      <div
        style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
        className="token-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div className="reveal">
            <p
              className="gradient-text"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}
            >
              $CGPT TOKEN
            </p>
            <h2
              style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "rgb(239,239,229)", lineHeight: 1.15, margin: "0 0 8px" }}
            >
              The Fuel of ChainGPT{" "}
              <span className="gradient-text">Ecosystem</span>
            </h2>
            <div style={{ height: 2, width: 80, background: "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))", marginBottom: 20 }} />
            <p style={{ fontSize: 17, color: "rgba(239,239,229,0.65)", lineHeight: 1.7, maxWidth: 480 }}>
              Hold, stake, and use $CGPT to unlock premium AI features, participate in
              DAO governance, and gain access to exclusive IDO allocations.
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="reveal"
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              >
                <p
                  className="gradient-text"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono, ui-monospace), monospace",
                    margin: "0 0 4px",
                    lineHeight: 1,
                  }}
                >
                  <CountUp value={s.value} />
                </p>
                <p style={{ fontSize: 12, color: "rgba(239,239,229,0.5)", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="reveal" style={{ display: "flex", gap: 14, flexWrap: "wrap", "--reveal-delay": "200ms" } as React.CSSProperties}>
            <a
              href="https://app.chaingpt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow cta-shimmer"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 6,
                background: "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))",
                color: "rgb(10,9,15)",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Buy $CGPT
            </a>
            <a
              href="https://app.chaingpt.org/staking"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 6,
                background: "transparent",
                border: "1px solid rgb(53,53,57)",
                color: "rgb(239,239,229)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(38,244,208,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(53,53,57)"; }}
            >
              Stake Now
            </a>
          </div>
        </div>

        {/* Right column — coin video */}
        <div className="reveal hero-load-visual" style={{ display: "flex", justifyContent: "center", alignItems: "center", "--reveal-delay": "100ms" } as React.CSSProperties}>
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 16,
              padding: 1,
              background: "linear-gradient(135deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))",
            }}
          >
            <div style={{ borderRadius: 15, background: "rgb(18,18,18)", overflow: "hidden" }}>
              <video
                src="https://web-assets.chaingpt.org/assets/video/cgpt_coin_sequence-hevc-safari.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block" }}
                poster="/images/6462111672fa898a555625b1_token-coin.webp"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .token-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
