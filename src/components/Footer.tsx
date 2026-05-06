"use client";

const aiProducts = [
  { text: "ChainGPT Chat Bot", href: "https://app.chaingpt.org/" },
  { text: "ChainGPT AI Agents", href: "https://www.chaingpt.org/ai-agents" },
  { text: "AI NFT Generator", href: "https://nft.chaingpt.org/" },
  { text: "Smart Contract Generator", href: "https://app.chaingpt.org/" },
  { text: "Smart Contract Auditor", href: "https://app.chaingpt.org/" },
  { text: "AI Generated News", href: "https://app.chaingpt.org/news" },
  { text: "AI Trading Assistant", href: "https://app.chaingpt.org/" },
  { text: "CryptoGuard", href: "https://www.cryptoguard.ai/" },
];

const resources = [
  { text: "ChainGPT Pad", href: "https://pad.chaingpt.org/" },
  { text: "ChainGPT Blog", href: "https://www.chaingpt.org/blog" },
  { text: "Documentation", href: "https://docs.chaingpt.org/" },
  { text: "$CGPT Staking", href: "https://app.chaingpt.org/staking" },
  { text: "DAO Governance", href: "https://app.chaingpt.org/dao" },
  { text: "Pricing Page", href: "https://app.chaingpt.org/pricing" },
  { text: "Brand Kit", href: "https://www.chaingpt.org/brand-kit" },
  { text: "Careers", href: "https://docs.chaingpt.org/misc/work-with-us" },
  { text: "Help Center", href: "http://help.chaingpt.org/" },
];

const legal = [
  { text: "Official Verification", href: "https://www.chaingpt.org/verify" },
  { text: "Privacy Policy", href: "https://www.chaingpt.org/privacy-policy" },
  { text: "Terms of Service", href: "https://www.chaingpt.org/tos" },
  { text: "Cookies Policy", href: "https://www.chaingpt.org/cookies" },
  { text: "Eligibility Policy", href: "https://www.chaingpt.org/eligibility-policy" },
];

const socials = [
  { label: "X", href: "https://twitter.com/ChainGPT_AI" },
  { label: "TG", href: "https://t.me/chaingpt_official" },
  { label: "DC", href: "https://discord.gg/chaingpt" },
  { label: "GH", href: "https://github.com/ChainGPT-org" },
];

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  color: "rgba(239,239,229,0.65)",
  textDecoration: "none",
  marginBottom: 10,
  transition: "color 0.2s",
};

const headingStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(239,239,229,0.4)",
  marginBottom: 20,
};

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgb(239,239,229)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(239,239,229,0.65)"; }}
    >
      {text}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "rgb(10,9,15)",
        borderTop: "1px solid rgb(53,53,57)",
        padding: "80px 40px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Main cols */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, paddingBottom: 60 }}
          className="footer-grid"
        >
          {/* Col 1 — Brand */}
          <div>
            {/* BRAND: Replace logo path */}
            <img
              src="/images/648329053d5c25f54cbb89c2_chaingpt-logoLight-Neon-2.svg"
              alt="ChainGPT"
              height={30}
              style={{ marginBottom: 16, display: "block" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <p style={{ fontSize: 13, color: "rgba(239,239,229,0.5)", lineHeight: 1.6, maxWidth: 200, marginBottom: 24 }}>
              Unleash The Power of Blockchain AI
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    border: "1px solid rgb(53,53,57)",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(239,239,229,0.5)",
                    textDecoration: "none",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgb(239,239,229)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(239,239,229,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(239,239,229,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(53,53,57)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <p style={headingStyle}>AI Products</p>
            {aiProducts.map((l) => <FooterLink key={l.text} href={l.href} text={l.text} />)}
          </div>

          {/* Col 3 */}
          <div>
            <p style={headingStyle}>Resources</p>
            {resources.map((l) => <FooterLink key={l.text} href={l.href} text={l.text} />)}
          </div>

          {/* Col 4 */}
          <div>
            <p style={headingStyle}>Legal</p>
            {legal.map((l) => <FooterLink key={l.text} href={l.href} text={l.text} />)}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgb(53,53,57)",
            padding: "24px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(239,239,229,0.35)", margin: 0 }}>
            © 2025 ChainGPT. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: "rgba(239,239,229,0.35)", margin: 0 }}>
            Built with ChainGPT AI
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
