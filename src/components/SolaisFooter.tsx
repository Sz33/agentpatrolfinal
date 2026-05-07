"use client";
import { useState } from "react";

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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <footer
      id="footer-section"
      className="w-full py-24 lg:py-40 relative"
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
        {/* CTA heading */}
        <div className="mb-16 lg:mb-24">
          <h2
            className="text-[rgb(239,239,229)] leading-[1.05] reveal mb-6"
            style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontSize: "clamp(40px, 6vw, 88px)",
              fontWeight: 400,
            }}
          >
            Your agents are already running.
            <br />
            Are they safe?
          </h2>
          <p
            className="text-[rgb(239,239,229)] opacity-55 max-w-xl text-base lg:text-lg leading-relaxed reveal"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            The missing security layer between AI agents and enterprise infrastructure.
          </p>
        </div>

        {/* Form + links row */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start border-t border-[rgb(53,53,57)] pt-12">
          {/* Email form */}
          <div className="lg:w-1/2 reveal">
            <p
              className="text-[rgb(239,239,229)] text-xs tracking-[0.2em] uppercase opacity-50 mb-4"
              style={{ fontFamily: "var(--font-heading, sans-serif)" }}
            >
              Get Started
            </p>
            {submitted ? (
              <p
                className="text-[rgb(239,239,229)] text-sm opacity-70"
                style={{ fontFamily: "var(--font-body, sans-serif)" }}
              >
                Thanks — we&apos;ll be in touch soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-glow flex-1 bg-transparent border border-[rgb(53,53,57)] px-4 py-3 text-[rgb(239,239,229)] text-sm placeholder:opacity-40 focus:border-[rgb(60,9,30)] outline-none transition-colors"
                  style={{ fontFamily: "var(--font-body, sans-serif)" }}
                />
                <button
                  type="submit"
                  className="btn-glow px-6 py-3 text-white text-sm tracking-wide border border-[rgb(60,9,30)] shrink-0"
                  style={{
                    backgroundColor: "rgb(60,9,30)",
                    fontFamily: "var(--font-heading, sans-serif)",
                    marginLeft: "-1px",
                  }}
                >
                  Get Started
                </button>
              </form>
            )}
          </div>

          {/* Four-column link grid */}
          <nav className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-8 reveal">
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
        <div className="mt-16 lg:mt-24 pt-6 border-t border-[rgb(53,53,57)] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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
