"use client";

const articles = [
  {
    title: "How Cryptorafts Powered Web3 Decision-Making with ChainGPT's AI Tools",
    date: "Apr 2025",
    category: "Case Study",
    link: "https://www.chaingpt.org/blog",
    image: "/images/img.webp",
  },
  {
    title: "What Actually Breaks During a Token Sale — and How to Prevent It",
    date: "Mar 2025",
    category: "Web3",
    link: "https://www.chaingpt.org/blog",
    image: "/images/img-1.webp",
  },
  {
    title: "Blockchain Tech 2024: What to Expect from AI in the Next Cycle",
    date: "Feb 2025",
    category: "AI",
    link: "https://www.chaingpt.org/blog",
    image: "/images/img-2.webp",
  },
];

export default function MediaSection() {
  return (
    <section id="blog" style={{ backgroundColor: "rgb(10,9,15)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header row */}
        <div className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(239,239,229,0.5)", marginBottom: 10 }}>
              MEDIA
            </p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 700, color: "rgb(239,239,229)", margin: 0 }}>
              Latest from <span className="gradient-text">ChainGPT</span>
            </h2>
          </div>
          <a
            href="https://www.chaingpt.org/blog"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: "rgba(239,239,229,0.55)", textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgb(239,239,229)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(239,239,229,0.55)"; }}
          >
            View All →
          </a>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="media-grid mobile-grid-1">
          {articles.map((article, idx) => (
            <a
              key={article.title}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift reveal"
              style={{
                "--reveal-delay": `${idx * 100}ms`,
                display: "block",
                textDecoration: "none",
                borderRadius: 12,
                border: "1px solid rgb(53,53,57)",
                background: "rgb(18,18,18)",
                overflow: "hidden",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(38,244,208,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(53,53,57)";
              }}
            >
              <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "rgb(25,25,25)" }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", display: "block" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="gradient-text" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(239,239,229,0.4)" }}>{article.date}</span>
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "rgb(239,239,229)",
                    lineHeight: 1.5,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {article.title}
                </h3>
                <span style={{ fontSize: 12, color: "rgba(239,239,229,0.45)" }}>Read more →</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .media-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
