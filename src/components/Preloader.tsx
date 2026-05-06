"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 800);
    const t2 = setTimeout(() => setGone(true), 1250);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" style={{ opacity: fading ? 0 : 1 }} aria-hidden="true">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(90deg, rgb(252,103,86), rgb(248,207,62) 38%, rgb(38,244,208) 52%, rgb(114,76,220))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            userSelect: "none",
          }}
        >
          C
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: `${["rgb(252,103,86)", "rgb(38,244,208)", "rgb(114,76,220))"][i]}`,
                animation: `preloaderDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes preloaderDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
