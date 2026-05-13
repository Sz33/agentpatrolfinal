"use client";

import { useState } from "react";
import Image from "next/image";

const solutions = [
  {
    number: "01",
    name: "ChainGPT Chatbot",
    description:
      "Reliable & Fast Source of Information. Ask ChainGPT AI any question related to Blockchain and Crypto. The AI can answer, analyze, and generate content across all things Web3.",
    link: "https://app.chaingpt.org/",
    logo: "/images/65490b8a07a8b7aa78eff4f1_logo-chainGPT-dark.svg",
  },
  {
    number: "02",
    name: "AI NFT Generator",
    description:
      "Generate stunning NFT artwork using AI. Create unique collections with a single prompt and mint directly to any chain.",
    link: "https://nft.chaingpt.org/",
    logo: "/images/65490b8a668f9f9f2645d7bb_logo-NFTGen.svg",
  },
  {
    number: "03",
    name: "ChainGPT Pad",
    description:
      "The premier launchpad for AI-powered blockchain projects. Stake $CGPT to gain access to exclusive IDO allocations.",
    link: "https://pad.chaingpt.org/",
    logo: "/images/65490b8aeb8455bcc5cbf898_logo-Pad.svg",
  },
  {
    number: "04",
    name: "Smart Contract Tools",
    description:
      "Generate, audit, and deploy smart contracts with AI. From ERC-20 tokens to complex DeFi protocols — all in minutes.",
    link: "https://app.chaingpt.org/smart-contract-generator",
  },
  {
    number: "05",
    name: "AI Trading Assistant",
    description:
      "AI-powered trading signals and market analysis. Get real-time insights and alerts on crypto market trends.",
    link: "https://app.chaingpt.org/ai-trading-assistant",
  },
  {
    number: "06",
    name: "CryptoGuard Security",
    description:
      "Browser extension that protects you from crypto scams, phishing sites, and malicious smart contracts in real time.",
    link: "https://www.cryptoguard.ai/",
    logo: "/images/CryptoGuardLogo.svg",
  },
];

export default function SolutionsSection() {
  const [active, setActive] = useState(0);
  const current = solutions[active];

  return (
    <section
      style={{
        backgroundColor: "rgb(10, 9, 15)",
        padding: "100px 40px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section heading */}
        <div className="reveal" style={{ marginBottom: 64 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(239,239,229,0.5)",
              marginBottom: 12,
            }}
          >
            OUR SOLUTIONS
          </p>
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 700,
              color: "rgb(239, 239, 229)",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {/* BRAND: Replace heading text */}
            Powering the Next Wave of{" "}
            <span className="gradient-text">Web3 AI</span>
          </h2>
          <div
            style={{
              height: 2,
              width: 80,
              background:
                "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))",
              marginBottom: 16,
            }}
          />
          <p
            style={{
              fontSize: 18,
              color: "rgba(239,239,229,0.6)",
              maxWidth: 520,
            }}
          >
            From AI chatbots to NFT generators, every tool you need for the
            blockchain era.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 64,
          }}
          className="solutions-grid"
        >
          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {solutions.map((s, i) => (
              <button
                key={s.number}
                onClick={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 16px",
                  background:
                    i === active ? "rgba(252,103,86,0.06)" : "transparent",
                  cursor: "pointer",
                  border: "none",
                  borderLeft: `2px solid ${i === active ? "rgb(252,103,86)" : "rgb(53,53,57)"}`,
                  textAlign: "left",
                  transition: "all 0.2s",
                  width: "100%",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono, ui-monospace), monospace",
                    color:
                      i === active
                        ? "rgb(252,103,86)"
                        : "rgba(239,239,229,0.4)",
                    fontWeight: 600,
                  }}
                >
                  {s.number}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: i === active ? 600 : 400,
                    color:
                      i === active
                        ? "rgb(239,239,229)"
                        : "rgba(239,239,229,0.6)",
                    transition: "color 0.2s",
                  }}
                >
                  {s.name}
                </span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div
            key={active}
            style={{
              opacity: 1,
              animation: "fadeInUp 0.35s ease forwards",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              paddingTop: 8,
            }}
          >
            {/* Large decorative number */}
            <div
              style={{
                fontSize: "clamp(80px, 12vw, 140px)",
                fontWeight: 800,
                lineHeight: 1,
                color: "rgba(239,239,229,0.04)",
                fontFamily: "var(--font-mono, ui-monospace), monospace",
                userSelect: "none",
              }}
            >
              {current.number}
            </div>

            {/* Logo or name */}
            {current.logo ? (
              <div style={{ height: 40 }}>
                <img
                  src={current.logo}
                  alt={current.name}
                  style={{ height: "100%", width: "auto", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <h3 className="gradient-text" style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
                {current.name}
              </h3>
            )}

            <p
              style={{
                fontSize: 18,
                color: "rgba(239,239,229,0.7)",
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              {current.description}
            </p>

            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 600,
                color: "rgb(38, 244, 208)",
                textDecoration: "none",
              }}
            >
              Explore {current.name} →
            </a>

            {/* Preview card */}
            <div
              style={{
                marginTop: 16,
                borderRadius: 12,
                padding: 1,
                background:
                  "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))",
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  borderRadius: 11,
                  background: "rgb(18, 18, 18)",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 48, color: "rgba(239,239,229,0.1)" }}>
                  {current.number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solutions-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
