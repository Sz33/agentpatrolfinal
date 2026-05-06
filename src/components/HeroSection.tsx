"use client";

import { useState, useEffect } from "react";

const BANNER_PHRASES = [
  "ANALYZE THIS TOKEN'S ON-CHAIN ACTIVITY AND MARKET TRENDS",
  "DEPLOY MY CUSTOM AI MODEL ON THIS DECENTRALIZED INFRASTRUCTURE",
  "AUDIT AND DEPLOY MY ERC-20 SMART CONTRACT FOR POTENTIAL ISSUES",
  "BUILD AN AI-POWERED TRADING BOT WITH A CUSTOM TOKEN ON BNB CHAIN",
  "GENERATE AND MINT A CYBERPUNK-STYLE PFP NFT COLLECTION",
];

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % BANNER_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ background: "rgb(10,9,15)", position: "relative", overflow: "hidden" }}>
      {/* Cycling prompt banner */}
      <div
        style={{
          background: "rgb(18,18,18)",
          padding: "11px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgb(53,53,57)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-roboto-mono), 'Roboto Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.05em",
            color: "rgba(239,239,229,0.65)",
            margin: 0,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.35s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          &gt; {BANNER_PHRASES[phraseIndex]}
        </p>
      </div>

      {/* Main hero body */}
      <div
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        {/* Corner decorators */}
        {[
          { src: "/images/644fa7cd9bc7d5ed92d90f21_corner-top-left.svg", style: { top: 0, left: 0 } },
          { src: "/images/644fa7cdb9ca0ac43e739b5f_corner-top-right.svg", style: { top: 0, right: 0 } },
          { src: "/images/644fa7ccb2061a3f72c97c6b_corner-bottom-left.svg", style: { bottom: 0, left: 0 } },
          { src: "/images/644fa7ccf9e72f37ae5162ad_corner-bottom-right.svg", style: { bottom: 0, right: 0 } },
        ].map((corner, i) => (
          <img
            key={i}
            src={corner.src}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 160,
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0.7,
              ...corner.style,
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ))}

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
          {/* BRAND: Replace heading text */}
          <h1
            className="hero-load-heading"
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              color: "rgb(239,239,229)",
              margin: "0 0 24px",
            }}
          >
            Your Gateway{" "}
            <span className="gradient-text">To Web3 AI</span>
          </h1>

          <p
            className="hero-load-sub"
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "rgba(239,239,229,0.6)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.65,
            }}
          >
            {/* BRAND: Replace description */}
            Powered by ChainGPT AI — the blockchain intelligence layer for the next
            generation of crypto.
          </p>

          {/* CTA buttons — BRAND: Replace links */}
          <div className="hero-load-cta" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
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
              Launch App
            </a>

            <a
              href="https://docs.chaingpt.org/"
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
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(252,103,86,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(53,53,57)"; }}
            >
              View Docs
            </a>
          </div>

          <p
            className="hero-load-cta"
            style={{
              marginTop: 28,
              fontSize: 13,
              color: "rgba(239,239,229,0.4)",
              letterSpacing: "0.02em",
            }}
          >
            Trusted by 500K+ users &nbsp;&middot;&nbsp; $100K grant from NVIDIA
          </p>
        </div>
      </div>
    </section>
  );
}
