"use client";

import React from "react";
import Hero3D from "./Hero3D";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const bits = [
  { text: "10011000_", style: { top: "22%", left: "14%", color: "rgba(0,102,255,.55)", animationDelay: "0s" } },
  { text: "00101010", style: { top: "36%", right: "18%", color: "rgba(0,102,255,.4)", animationDelay: ".6s" } },
  { text: "10011100", style: { top: "62%", left: "40%", color: "rgba(77,159,255,.5)", animationDelay: "1.4s" } },
  { text: "000000", style: { top: "78%", right: "28%", color: "rgba(230,57,70,.5)", animationDelay: "2.1s" } },
  { text: "110100_", style: { top: "30%", left: "62%", color: "rgba(0,102,255,.32)", animationDelay: ".9s" } },
  { text: "01001 // index", style: { top: "14%", right: "6%", color: "rgba(77,159,255,.38)", animationDelay: "1.7s" } },
];

function Crosshair({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 14, height: 14, zIndex: 25, color: "var(--accent)", ...style }}>
      <span style={{ position: "absolute", left: 0, right: 0, top: 6, height: 1, background: "currentColor" }} />
      <span style={{ position: "absolute", top: 0, bottom: 0, left: 6, width: 1, background: "currentColor" }} />
    </div>
  );
}

type ChipVariant = "default" | "light" | "alert";

function Chip({
  variant = "default",
  label,
  labelColor,
  query,
  value,
  valueColor,
  animDelay,
}: {
  variant?: ChipVariant;
  label: string;
  labelColor: string;
  query: string;
  value: string;
  valueColor: string;
  animDelay: string;
}) {
  const bg: Record<ChipVariant, string> = {
    default: "rgba(6,8,16,.88)",
    light: "rgba(15,22,40,.90)",
    alert: "rgba(26,6,8,.90)",
  };
  const border: Record<ChipVariant, string> = {
    default: "1px solid rgba(0,102,255,.4)",
    light: "1px solid rgba(77,159,255,.4)",
    alert: "1px solid rgba(230,57,70,.45)",
  };
  return (
    <div
      style={{
        background: bg[variant],
        backdropFilter: "blur(8px)",
        border: border[variant],
        color: "var(--cream)",
        padding: "14px 18px",
        borderRadius: 6,
        fontSize: 13,
        lineHeight: 1.35,
        boxShadow: "0 20px 50px rgba(0,0,0,.45), inset 0 0 30px rgba(0,102,255,.05)",
        minWidth: 240,
        animation: `team-bob 7s ease-in-out ${animDelay} infinite`,
        fontFamily: "var(--font-heading)",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.24em",
          opacity: 0.7,
          textTransform: "uppercase",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: labelColor,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: labelColor,
            boxShadow: `0 0 10px ${labelColor}`,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>{query}</span>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18, color: valueColor }}>{value}</span>
      </div>
    </div>
  );
}

export default function TeamHero() {
  return (
    <section
      id="hero"
      className="team-hero-zone relative w-screen overflow-hidden"
      style={{
        height: "100vh",
        fontFamily: "var(--font-heading)",
        color: "var(--cream)",
        background: `
          radial-gradient(120% 100% at 100% 100%, rgba(0,102,255,.14) 0%, rgba(0,102,255,0) 55%),
          linear-gradient(180deg, #060810 0%, #0A0F1E 60%, #060810 100%)
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: "radial-gradient(60% 80% at 50% 40%, rgba(0,102,255,.16) 0%, rgba(0,102,255,0) 60%)",
        }}
      />

      {/* HUD overlays */}
      <div className="team-stage-grid" />
      <div className="team-stage-scanlines" />

      {/* Binary scatter */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 6, fontFamily: MONO, fontSize: 13, letterSpacing: "0.18em" }}
      >
        {bits.map((b, i) => (
          <span
            key={i}
            className="absolute"
            style={{ animation: `team-flicker 4s ease-in-out ${b.style.animationDelay} infinite`, ...b.style }}
          >
            {b.text}
          </span>
        ))}
      </div>

      {/* Side rails */}
      <div
        className="absolute flex flex-col justify-between items-center"
        style={{
          top: 120,
          bottom: 120,
          left: 18,
          width: 48,
          zIndex: 20,
          fontSize: 10,
          letterSpacing: "0.3em",
          fontFamily: MONO,
          color: "rgba(77,159,255,.55)",
        }}
      >
        <span>S—01</span>
        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          AGENTPATROL · 2026 · INDEX 0.42
        </span>
        <span>EN</span>
      </div>
      <div
        className="absolute flex flex-col justify-between items-center"
        style={{
          top: 120,
          bottom: 120,
          right: 18,
          width: 48,
          zIndex: 20,
          fontSize: 10,
          letterSpacing: "0.3em",
          fontFamily: MONO,
          color: "rgba(77,159,255,.55)",
        }}
      >
        <span>v3.1</span>
        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          LIVE · PATROLS ACTIVE · 24/7
        </span>
        <span>↘</span>
      </div>

      {/* Corner crosshairs */}
      <Crosshair style={{ top: 24, left: 24, opacity: 0.55 }} />
      <Crosshair style={{ top: 24, right: 24, opacity: 0.55 }} />
      <Crosshair style={{ bottom: 60, left: 64, opacity: 0.45 }} />
      <Crosshair style={{ bottom: 60, right: 24, opacity: 0.45 }} />

      {/* HUD rings */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 920,
          height: 920,
          borderRadius: "50%",
          border: "1px dotted rgba(0,102,255,.1)",
          zIndex: 8,
          animation: "team-ring-spin 90s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1px dashed rgba(0,102,255,.2)",
          zIndex: 8,
          animation: "team-ring-spin-rev 60s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 560,
          height: 560,
          borderRadius: "50%",
          border: "1px dashed rgba(77,159,255,.14)",
          zIndex: 8,
        }}
      />

      {/* Pedestal shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "14%",
          transform: "translateX(-50%)",
          width: 520,
          height: 80,
          zIndex: 9,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,.55), transparent 65%)",
          filter: "blur(6px)",
        }}
      />

      {/* 3D Robot — fixed canvas, mounts when this section mounts */}
      <Hero3D />

      {/* Floating chips */}
      <div style={{ position: "absolute", top: "23%", left: "30%", zIndex: 15 }}>
        <Chip
          variant="default"
          label="SESSION · LIVE"
          labelColor="var(--success)"
          query="agent_047 · llm runtime"
          value="ACTIVE"
          valueColor="var(--success)"
          animDelay="0s"
        />
      </div>
      <div style={{ position: "absolute", top: "54%", right: "30%", zIndex: 15 }}>
        <Chip
          variant="light"
          label="RUNTIME POLICY · ENFORCED"
          labelColor="#4D9FFF"
          query="tool call intercepted"
          value="SAFE ↑"
          valueColor="var(--accent)"
          animDelay="-2s"
        />
      </div>
      <div style={{ position: "absolute", top: "34%", right: "18%", zIndex: 15 }}>
        <Chip
          variant="alert"
          label="BREACH · DETECTED"
          labelColor="#E63946"
          query="unauthorized API scope"
          value="BLOCKED"
          valueColor="#E63946"
          animDelay="-4s"
        />
      </div>

      {/* Corner "N" indicator */}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 60,
          zIndex: 30,
          width: 34,
          height: 34,
          borderRadius: 6,
          background: "rgba(0,102,255,.1)",
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 13,
          fontWeight: 600,
          border: "1px solid rgba(0,102,255,.4)",
        }}
      >
        N
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 56, bottom: 88, zIndex: 20, color: "var(--cream)" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.32em",
            opacity: 0.85,
            marginBottom: 22,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          AI AGENT GOVERNANCE PLATFORM
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 16,
              background: "var(--cream)",
              transform: "translateY(2px)",
              animation: "team-blink 1.05s steps(1) infinite",
            }}
          />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(96px, 13vw, 200px)",
            lineHeight: 0.86,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: "var(--cream)",
          }}
        >
          GOVERN
          <span style={{ display: "block" }}>
            <span style={{ color: "var(--accent)", textShadow: "0 0 40px rgba(0,102,255,.6)" }}>—</span>
            YOUR AGENTS
          </span>
        </h1>
      </div>
    </section>
  );
}
