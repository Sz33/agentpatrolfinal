"use client";

const plans = [
  {
    name: "Freemium",
    description: "Try ChainGPT AI for free",
    price: "Free",
    priceUnit: "",
    features: ["20 daily AI credits", "Web3 AI chatbot", "AI-generated news", "Basic smart contract tools", "Community support"],
    cta: "Get Started Free",
    ctaLink: "https://app.chaingpt.org/",
    highlighted: false,
  },
  {
    name: "PPP",
    description: "Pay only for what you use",
    price: "$0.001",
    priceUnit: "/ credit",
    features: ["No monthly commitment", "All AI tools", "Smart contract generator", "Auditor access", "Email support"],
    cta: "Start Now",
    ctaLink: "https://app.chaingpt.org/pricing",
    highlighted: false,
  },
  {
    name: "Individual",
    description: "Best for power users",
    price: "$9.99",
    priceUnit: "/ month",
    features: ["20,000 credits/month", "All AI tools", "Priority access", "API access", "Priority email support"],
    cta: "Subscribe",
    ctaLink: "https://app.chaingpt.org/pricing",
    highlighted: true,
  },
  {
    name: "Teams",
    description: "For growing teams",
    price: "$44.99",
    priceUnit: "/ month",
    features: ["100,000 credits/month", "All AI tools", "Team management", "API access", "Dedicated support"],
    cta: "Subscribe",
    ctaLink: "https://app.chaingpt.org/pricing",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" style={{ backgroundColor: "rgb(10,9,15)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Heading */}
        <div className="reveal" style={{ marginBottom: 64, textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(239,239,229,0.5)", marginBottom: 12 }}>
            PRICING
          </p>
          <h2 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 700, color: "rgb(239,239,229)", lineHeight: 1.15, marginBottom: 8 }}>
            Simple,{" "}
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <div style={{ height: 2, width: 80, background: "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 18, color: "rgba(239,239,229,0.6)" }}>
            Start free and scale as you grow.
          </p>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, alignItems: "stretch" }} className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                borderRadius: 12,
                padding: plan.highlighted ? 1 : 0,
                background: plan.highlighted
                  ? "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))"
                  : "transparent",
                transform: plan.highlighted ? "scale(1.02)" : "none",
              }}
            >
              <div
                style={{
                  borderRadius: plan.highlighted ? 11 : 12,
                  border: plan.highlighted ? "none" : "1px solid rgb(53,53,57)",
                  background: "rgb(18,18,18)",
                  padding: 32,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: "absolute",
                    top: -13,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, rgb(252,103,86), rgb(38,244,208))",
                    borderRadius: 100,
                    padding: "4px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgb(10,9,15)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <h3 style={{ fontSize: 20, fontWeight: 600, color: "rgb(239,239,229)", margin: "0 0 6px" }}>{plan.name}</h3>
                <p style={{ fontSize: 14, color: "rgba(239,239,229,0.5)", margin: "0 0 20px" }}>{plan.description}</p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 700, color: "rgb(239,239,229)", lineHeight: 1 }}>{plan.price}</span>
                  {plan.priceUnit && (
                    <span style={{ fontSize: 14, color: "rgba(239,239,229,0.5)" }}>{plan.priceUnit}</span>
                  )}
                </div>

                <hr style={{ border: "none", borderTop: "1px solid rgb(53,53,57)", margin: "0 0 24px" }} />

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(239,239,229,0.8)" }}>
                      <span style={{ color: "rgb(38,244,208)", flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                    background: plan.highlighted
                      ? "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))"
                      : "transparent",
                    color: plan.highlighted ? "rgb(10,9,15)" : "rgb(239,239,229)",
                    border: plan.highlighted ? "none" : "1px solid rgb(53,53,57)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .pricing-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
