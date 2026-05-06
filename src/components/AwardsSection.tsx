"use client";

const awards = [
  "$100,000 Grant from NVIDIA",
  "$1M in Awards",
  "Best AI Startup · Consensus 2023",
  "Top Web3 Project · CoinDesk",
  "AI Innovation Award",
  "NVIDIA Inception Program",
  "Best Blockchain AI · AIBC 2023",
  "Web3 Excellence Award",
];

export default function AwardsSection() {
  // Duplicate for seamless loop
  const items = [...awards, ...awards];

  return (
    <div
      style={{
        borderTop: "1px solid rgb(53, 53, 57)",
        borderBottom: "1px solid rgb(53, 53, 57)",
        backgroundColor: "rgb(10, 9, 15)",
        overflow: "hidden",
        height: "64px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", alignItems: "center" }}>
        {items.map((award, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 20px",
              border: "1px solid rgb(53, 53, 57)",
              borderRadius: "100px",
              fontSize: "12px",
              letterSpacing: "0.6px",
              textTransform: "uppercase" as const,
              color: "rgb(239, 239, 229)",
              margin: "0 10px",
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}
          >
            {award}
          </span>
        ))}
      </div>
    </div>
  );
}
