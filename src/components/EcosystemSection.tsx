"use client";

const products = [
  { name: "Crypto AI Hub", description: "Your all-in-one AI workspace for crypto and blockchain research.", logo: "/images/6613b25be8b895f732812334_logo-ai-hub.svg", link: "https://app.chaingpt.org/", category: "AI Tools" },
  { name: "AI NFT Generator", description: "Create stunning AI-generated NFT artwork and mint to any chain.", logo: "/images/65490b8a668f9f9f2645d7bb_logo-NFTGen.svg", link: "https://nft.chaingpt.org/", category: "NFTs" },
  { name: "ChainGPT Pad", description: "Premier launchpad for AI-powered blockchain projects.", logo: "/images/65490b8aeb8455bcc5cbf898_logo-Pad.svg", link: "https://pad.chaingpt.org/", category: "Launchpad" },
  { name: "ChainGPT Labs", description: "Incubation for next-gen Web3 AI projects and startups.", logo: "/images/668d4452d209630013ad3f7d_chain-gpt-labs.svg", link: "https://labs.chaingpt.org/", category: "Incubation" },
  { name: "CGPT Pad", description: "Self-hosted IDO launchpad platform for any project.", logo: "/images/67b6fd6c8515100d4ecc5b3c_CGPT_20Pad.svg", link: "https://pad.chaingpt.org/Saleium", category: "Launchpad" },
  { name: "CryptoGuard", description: "Browser security extension protecting you from crypto scams.", logo: "/images/CryptoGuardLogo.svg", link: "https://www.cryptoguard.ai/", category: "Security" },
  { name: "AIVM", description: "AI Virtual Machine — deploy custom AI models on-chain.", logo: "/images/aivm-logo.svg", link: "https://www.chaingpt.org/", category: "Infrastructure" },
  { name: "AI Signals Hub", description: "Real-time AI-powered market signals and trading intelligence.", logo: "/images/ai-signals-hub.svg", link: "https://app.chaingpt.org/ai-trading-assistant", category: "Trading" },
  { name: "Compliance Bot", description: "Crypto compliance assistant ensuring regulatory adherence.", logo: "/images/compliance-bot.svg", link: "https://app.chaingpt.org/crypto-compliance-assistant", category: "Compliance" },
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" style={{ backgroundColor: "rgb(10,9,15)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Heading */}
        <div className="reveal" style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(239,239,229,0.5)", marginBottom: 12 }}>
            ECOSYSTEM
          </p>
          <h2 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 700, color: "rgb(239,239,229)", lineHeight: 1.15, marginBottom: 8 }}>
            The Ecosystem behind{" "}
            <span className="gradient-text">ChainGPT</span>
          </h2>
          <div style={{ height: 2, width: 80, background: "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))", marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: "rgba(239,239,229,0.6)", maxWidth: 520 }}>
            A unified suite of AI tools for every crypto and blockchain need.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
          className="ecosystem-grid"
        >
          {products.map((p, idx) => (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift reveal"
              style={{
                "--reveal-delay": `${(idx % 3) * 100}ms`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 28,
                borderRadius: 12,
                border: "1px solid rgb(53,53,57)",
                background: "rgb(18,18,18)",
                textDecoration: "none",
                cursor: "pointer",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 24px rgba(38,244,208,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(38,244,208,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(53,53,57)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <img
                  src={p.logo}
                  alt={p.name}
                  style={{ height: 32, width: "auto", objectFit: "contain" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span style={{
                  fontSize: 11,
                  color: "rgba(239,239,229,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  border: "1px solid rgb(53,53,57)",
                  borderRadius: 100,
                  padding: "3px 10px",
                  whiteSpace: "nowrap",
                }}>
                  {p.category}
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "rgb(239,239,229)", margin: 0 }}>{p.name}</h3>
              <p style={{ fontSize: 14, color: "rgba(239,239,229,0.6)", lineHeight: 1.6, margin: 0 }}>{p.description}</p>
              <span className="gradient-text" style={{ fontSize: 13, fontWeight: 600, marginTop: "auto" }}>
                Explore →
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .ecosystem-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .ecosystem-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
