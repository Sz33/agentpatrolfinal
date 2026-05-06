"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

const CARDS = [
  {
    id: "ai01",
    label: "AI Startups",
    desc: "Deploy agents safely without slowing down your build cycle. Ship fast without compromising security.",
    number: "01",
  },
  {
    id: "ai02",
    label: "Enterprise Dev Teams",
    desc: "Enforce security policies across all agent deployments organisation-wide without touching agent code.",
    number: "02",
  },
  {
    id: "ai03",
    label: "Security Engineers",
    desc: "Full visibility into what every agent is doing at the OS level. Real-time threat detection and blocking.",
    number: "03",
  },
  {
    id: "ai04",
    label: "CTOs & Founders",
    desc: "Know exactly what your AI agents have access to and what they are doing with it at all times.",
    number: "04",
  },
];

export default function SolaisIndustriesSection() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDrag, setShowDrag] = useState(true);

  return (
    <section
      id="industries"
      className="w-full py-24 lg:py-40 overflow-hidden"
      style={{ backgroundColor: "rgb(5, 4, 8)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 mb-12 lg:mb-16 items-start lg:items-end">
          <div className="lg:w-1/2">
            <p
              className="text-[rgb(239,239,229)] text-xs tracking-[0.25em] uppercase opacity-50 mb-3"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              Find Your Industry
            </p>
            <h2
              className="text-[rgb(239,239,229)] leading-[1.05] reveal"
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 400,
              }}
            >
              Built for
              <br />
              your team
            </h2>
          </div>
          <div className="lg:w-1/2">
            <p
              className="text-[rgb(239,239,229)] opacity-55 leading-relaxed text-sm lg:text-base reveal"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              AgentPatrol is built for every team that deploys, manages or secures AI agents at scale.
            </p>
          </div>
        </div>
      </div>

      {/* Drag carousel container */}
      <div
        ref={constraintsRef}
        className="relative overflow-hidden"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Drag label */}
        {showDrag && (
          <div
            className="hidden lg:flex absolute top-4 left-1/2 z-10 items-center gap-2 px-3 py-1.5 text-xs text-white"
            style={{
              backgroundColor: "rgb(60,9,30)",
              fontFamily: "var(--font-heading, sans-serif)",
              transform: "translateX(-50%)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M8 4L4 4L4 20L8 20M16 4L20 4L20 20L16 20M8 12L16 12" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Drag
          </div>
        )}

        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          onDragStart={() => { setIsDragging(true); setShowDrag(false); }}
          onDragEnd={() => setIsDragging(false)}
          className="flex gap-0 will-change-transform"
          style={{ width: "max-content" }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="industry-card shrink-0 border border-[rgb(53,53,57)] p-8 lg:p-10 flex flex-col justify-between"
              style={{
                width: "clamp(280px, 35vw, 480px)",
                minHeight: "400px",
                marginLeft: "-1px",
                userSelect: "none",
              }}
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <span
                    className="text-[rgb(239,239,229)] text-xs opacity-30 tracking-widest"
                    style={{ fontFamily: "var(--font-heading, sans-serif)" }}
                  >
                    {card.number}
                  </span>
                  {/* Corner brackets */}
                  <div className="relative w-4 h-3">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="text-[rgb(239,239,229)] opacity-30 absolute top-0 right-0">
                      <path d="M17 0V8.586C17 8.851 16.895 9.105 16.707 9.293L13.293 12.707C13.105 12.895 12.851 13 12.586 13H0" stroke="currentColor"/>
                    </svg>
                  </div>
                </div>
                <h4
                  className="text-[rgb(239,239,229)] mb-6"
                  style={{
                    fontFamily: "var(--font-heading, sans-serif)",
                    fontSize: "clamp(24px, 2.5vw, 36px)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                >
                  {card.label}
                </h4>
                <p
                  className="text-[rgb(239,239,229)] opacity-50 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body, sans-serif)" }}
                >
                  {card.desc}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[rgb(53,53,57)]">
                <a
                  href="#"
                  className="text-[rgb(239,239,229)] text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading, sans-serif)" }}
                  onClick={(e) => isDragging && e.preventDefault()}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 25" fill="none">
                    <path d="M2.68 20.211V4.058H0V21.34L3.354 24.748H20.484V22.024H4.464L2.68 20.211Z" fill="currentColor"/>
                    <path d="M21.145 0.749H8.907V3.475H18.973L5.945 16.718L7.84 18.644L21.06 5.206V15.734H23.74V3.387L21.145 0.749Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
