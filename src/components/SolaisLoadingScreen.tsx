"use client";
import { useEffect, useState } from "react";

export default function SolaisLoadingScreen() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400);
    const t2 = setTimeout(() => setGone(true), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="preloader"
      style={{ opacity: fading ? 0 : 1 }}
      aria-hidden="true"
    >
      {Array.from({ length: 144 }).map((_, i) => (
        <div
          key={i}
          className="loading-block w-full h-full grid-dot-bg"
          style={{
            backgroundColor: "rgb(60, 9, 30)",
            animationDelay: `${(i % 12) * 30 + Math.floor(i / 12) * 20}ms`,
          }}
        />
      ))}
    </div>
  );
}
