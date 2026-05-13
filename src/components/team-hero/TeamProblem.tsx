"use client";

import MagicCard from "@/components/MagicCard";

const MONO = "var(--font-mono, ui-monospace), monospace";
const HEAD = "var(--font-heading)";
const BODY = "var(--font-body, var(--font-heading))";

const CARDS = [
  { col: 1, num: "01", color: "#DC2626", colorRgb: "220, 38, 38",  severity: "CRITICAL", title: "NO VISIBILITY AT RUNTIME",               body: "Your agent runs as a black box once deployed. Zero telemetry on execution." },
  { col: 1, num: "02", color: "#F59E0B", colorRgb: "245, 158, 11", severity: "HIGH",     title: "NO WAY TO STOP IT",                      body: "Alerts come too late. By the time anyone investigates, the damage is done." },
  { col: 3, num: "03", color: "#DC2626", colorRgb: "220, 38, 38",  severity: "CRITICAL", title: "NO AUDIT TRAIL",                         body: "Your CISO asks for proof. You have no session reports. Nothing to show." },
  { col: 3, num: "04", color: "#4D9FFF", colorRgb: "77, 159, 255", severity: "SUPPLY",   title: "NO CONTROL OVER WHAT IT WAS BUILT WITH", body: "Unknown dependencies. Unknown APIs. Unknown capabilities given by your vendor." },
];

export default function TeamProblem() {
  const leftCards  = CARDS.filter(c => c.col === 1);
  const rightCards = CARDS.filter(c => c.col === 3);

  return (
    <section
      id="problem"
      className="team-hero-zone"
      style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0" }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 56, zIndex: 2, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ height: 1, width: 56, background: "rgba(220,38,38,.45)" }} />
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.44em", color: "var(--brand)", textTransform: "uppercase", opacity: 0.8 }}>SOUND FAMILIAR?</span>
          <div style={{ height: 1, width: 56, background: "rgba(220,38,38,.45)" }} />
        </div>
        <h2 style={{ fontFamily: HEAD, fontWeight: 700, fontSize: "clamp(32px,5vw,72px)", letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--cream)", lineHeight: 1.05, margin: 0 }}>
          YOU DEPLOYED AN AI AGENT.
          <span style={{ display: "block", color: "#E63946" }}>NOW WHAT?</span>
        </h2>
      </div>

      {/* 3-column bento grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1fr) clamp(300px, 30vw, 500px) minmax(280px, 1fr)",
          gap: 20,
          alignItems: "stretch",
          padding: "0 clamp(16px, 4vw, 60px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {leftCards.map(card => <ProblemBentoCard key={card.num} card={card} />)}
        </div>

        {/* Center column — robot floats here (fixed position), keep empty */}
        <div style={{ gridColumn: 2 }} />

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {rightCards.map(card => <ProblemBentoCard key={card.num} card={card} />)}
        </div>
      </div>

      {/* Closing line */}
      <div
        style={{
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.22em",
          lineHeight: 2,
          marginTop: 100,
          zIndex: 2,
          position: "relative",
        }}
      >
        <div style={{ color: "var(--text-secondary)" }}>THIS ISN&apos;T A FUTURE RISK.</div>
        <div style={{ color: "rgba(230,57,70,.7)" }}>IT&apos;S THE CURRENT STATE OF AI AGENT DEPLOYMENT — RIGHT NOW.</div>
      </div>
    </section>
  );
}

function ProblemBentoCard({ card }: { card: typeof CARDS[number] }) {
  return (
    <MagicCard
      glowColor={card.colorRgb}
      particleCount={0}
      enableStars
      enableBorderGlow
      enableTilt={false}
      enableMagnetism
      clickEffect
    >
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: "24px 24px 20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          zIndex: 1,
          minHeight: 180,
        }}
      >
        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>
          <span style={{ color: card.color, fontSize: 13, fontWeight: 800 }}>{card.num}</span>
          <span style={{ display: "inline-block", width: 16, height: 1, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ padding: "2px 7px", borderRadius: 3, fontSize: 9, background: `rgba(${card.colorRgb},0.12)`, color: card.color, fontWeight: 700, letterSpacing: "0.1em" }}>{card.severity}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 14, color: "#F1F5F9", letterSpacing: "-0.01em", lineHeight: 1.25, textTransform: "uppercase", margin: "0 0 10px" }}>
          {card.title}
        </h3>

        {/* Body */}
        <p style={{ fontFamily: BODY, fontSize: 12, color: "#64748B", lineHeight: 1.65, margin: 0, flex: 1 }}>
          {card.body}
        </p>
      </div>
    </MagicCard>
  );
}
