const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pre-Flight Scan", href: "#" },
      { label: "Session Reports", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "OWASP ASI Guide", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export default function SolaisFooter() {
  return (
    <footer
      id="footer-section"
      className="w-full py-16 lg:py-20 relative"
      style={{ backgroundColor: "rgb(5, 4, 8)", color: "rgb(239,239,229)" }}
    >
      {/* Grid dot bg */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M 0 0 L 10 0 M 0 0 L 0 10' stroke='white' stroke-dasharray='2 6' stroke-width='0.5' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Brand + tagline */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start pb-12 border-b border-[rgb(53,53,57)]">
          <div className="lg:w-1/2 flex flex-col gap-3">
            <span
              className="text-[rgb(239,239,229)] text-xs tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-heading, sans-serif)", fontWeight: 700 }}
            >
              AgentPatrol
            </span>
            <p
              className="text-[rgb(239,239,229)] opacity-55 max-w-md text-sm lg:text-base leading-relaxed"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              The missing security layer between AI agents and enterprise infrastructure.
            </p>
          </div>

          {/* Four-column link grid */}
          <nav className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p
                  className="text-[rgb(239,239,229)] text-xs tracking-[0.2em] uppercase opacity-50 mb-1"
                  style={{ fontFamily: "var(--font-heading, sans-serif)" }}
                >
                  {col.title}
                </p>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="nav-underline text-[rgb(239,239,229)] text-sm opacity-60 hover:opacity-100 transition-opacity self-start"
                    style={{ fontFamily: "var(--font-body, sans-serif)" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 mt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <span
            className="text-[rgb(239,239,229)] text-xs opacity-40"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            © {new Date().getFullYear()} AgentPatrol. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
