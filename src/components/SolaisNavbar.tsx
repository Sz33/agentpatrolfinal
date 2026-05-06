"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Advantage", href: "#advantage" },
  { label: "Industries", href: "#industries" },
];

export default function SolaisNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="navbar-load fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgb(53,53,57)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[92px]">
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <span
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "#ffffff",
              fontSize: "1.25rem",
              letterSpacing: "0.08em",
            }}
          >
            AGENTPATROL
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-underline text-sm hover:opacity-100 transition-opacity"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body, sans-serif)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden lg:inline-flex items-center gap-1 text-sm px-5 py-2 transition-colors"
            style={{ border: "1px solid #ffffff", color: "#ffffff", background: "transparent", fontFamily: "var(--font-heading, sans-serif)" }}
          >
            Request Access
          </a>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            style={{ color: "#ffffff" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="1" y1="1" x2="19" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="1" y1="13" x2="19" y2="1" stroke="currentColor" strokeWidth="1.5"/>
                </>
              ) : (
                <>
                  <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[rgb(53,53,57)] bg-[rgb(5,5,5)]">
          <div className="px-6 py-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm opacity-80 hover:opacity-100"
                style={{ color: "#ffffff" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm px-5 py-2 w-fit"
              style={{ border: "1px solid #ffffff", color: "#ffffff" }}
            >
              Request Access
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
