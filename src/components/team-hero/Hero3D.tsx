"use client";

import dynamic from "next/dynamic";

const RobotScene = dynamic(() => import("./RobotScene"), { ssr: false });

export default function Hero3D() {
  return (
    // fixed + z-9999 so the canvas is always rendered above every DOM element
    // pointer-events: none so page content below remains interactive
    // id="team-hero-3d-wrapper" so RobotScene's scroll handler can fade it out
    <div
      id="team-hero-3d-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        transition: "opacity 0.15s linear",
        transform: "translateY(-13vh)",
      }}
    >
      <RobotScene />
    </div>
  );
}
