"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "MAIN WEBSITE", href: "/", isExternal: false },
  { label: "CRYPTO AI HUB", href: "https://app.chaingpt.org/", isExternal: true },
  { label: "AI NFT GENERATOR", href: "https://nft.chaingpt.org/", isExternal: true },
  { label: "OUR LAUNCHPAD", href: "https://pad.chaingpt.org/", isExternal: true },
  { label: "Incubation Labs", href: "https://labs.chaingpt.org/", isExternal: true },
  { label: "IDO Platform", href: "https://degenpad.com/", isExternal: true },
  { label: "SECURITY EXTENSION", href: "https://www.cryptoguard.ai/", isExternal: true },
];

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Docs", href: "https://docs.chaingpt.org/", isExternal: true },
];

function Dropdown({ open }: { open: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        minWidth: 240,
        background: "rgb(18, 18, 18)",
        border: "1px solid rgb(53, 53, 57)",
        borderRadius: 8,
        padding: "8px 0",
        zIndex: 1200,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.15s ease",
      }}
    >
      {PRODUCT_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.isExternal ? "_blank" : undefined}
          rel={link.isExternal ? "noopener noreferrer" : undefined}
          style={{
            display: "block",
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 500,
            color: "rgb(239, 239, 229)",
            textDecoration: "none",
            letterSpacing: "0.03em",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="navbar-blur-transition"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          width: "100%",
          height: 66,
          display: "flex",
          alignItems: "center",
          backgroundColor: scrolled ? "rgba(10,9,15,0.95)" : "rgb(10,9,15)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid transparent" : "1px solid rgb(53,53,57)",
          transition: "backdrop-filter 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo — BRAND: Replace logo path */}
          <Link href="/" aria-label="Home">
            <Image
              src="/images/648329053d5c25f54cbb89c2_chaingpt-logoLight-Neon-2.svg"
              alt="ChainGPT Logo"
              width={156}
              height={34}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            <div
              ref={dropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgb(239,239,229)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                Products
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2 4.5L6 8.5L10 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: "transform 0.2s",
                      transformOrigin: "center",
                    }}
                  />
                </svg>
              </button>
              <Dropdown open={dropdownOpen} />
            </div>

            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={"isExternal" in link && link.isExternal ? "_blank" : undefined}
                rel={"isExternal" in link && link.isExternal ? "noopener noreferrer" : undefined}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgb(239,239,229)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(239,239,229,0.65)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgb(239,239,229)"; }}
              >
                {link.label}
              </a>
            ))}

            {/* BRAND: Replace CTA link */}
            <div className="gradient-border" style={{ borderRadius: 6 }}>
              <a
                href="https://app.chaingpt.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-text"
                style={{
                  display: "block",
                  padding: "8px 20px",
                  borderRadius: 5,
                  background: "rgb(10,9,15)",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Launch App
              </a>
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: 4 }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: 22,
                    height: 2,
                    background: "rgb(239,239,229)",
                    borderRadius: 2,
                    transition: "transform 0.25s, opacity 0.25s",
                    transform:
                      i === 0 && mobileOpen ? "translateY(7px) rotate(45deg)"
                      : i === 2 && mobileOpen ? "translateY(-7px) rotate(-45deg)"
                      : "none",
                    opacity: i === 1 && mobileOpen ? 0 : 1,
                  }}
                />
              ))}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: "fixed",
          top: 66,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgb(10,9,15)",
          zIndex: 1099,
          overflowY: "auto",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          padding: "24px 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        aria-hidden={!mobileOpen}
      >
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(239,239,229,0.4)", textTransform: "uppercase", margin: "8px 0 4px" }}>
          Products
        </p>
        {PRODUCT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{ display: "block", padding: "12px 0", fontSize: 16, color: "rgb(239,239,229)", textDecoration: "none", borderBottom: "1px solid rgba(53,53,57,0.5)" }}
          >
            {link.label}
          </a>
        ))}
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(239,239,229,0.4)", textTransform: "uppercase", margin: "16px 0 4px" }}>
          Navigation
        </p>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{ display: "block", padding: "12px 0", fontSize: 16, color: "rgb(239,239,229)", textDecoration: "none", borderBottom: "1px solid rgba(53,53,57,0.5)" }}
          >
            {link.label}
          </a>
        ))}
        <div style={{ marginTop: 24 }}>
          <div className="gradient-border" style={{ borderRadius: 6 }}>
            <a
              href="https://app.chaingpt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-text"
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", textAlign: "center", padding: "14px 20px", borderRadius: 5, background: "rgb(10,9,15)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              Launch App
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
