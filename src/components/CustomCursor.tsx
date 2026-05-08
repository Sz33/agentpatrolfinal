"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [outsideHero, setOutsideHero] = useState(false);

  // Inverse of EvilCursor: active everywhere EXCEPT inside the hero zone.
  useEffect(() => {
    const sentinel = document.getElementById("hero-zone-end");
    if (!sentinel) return;
    setOutsideHero(sentinel.getBoundingClientRect().top <= 0);
    const obs = new IntersectionObserver(
      ([entry]) => setOutsideHero(entry.boundingClientRect.top <= 0),
      { rootMargin: "0px", threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!outsideHero) return;
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        cursor.style.opacity = "1";
      });
    };

    const attachHover = () => {
      document.querySelectorAll<Element>("a, button").forEach((el) => {
        (el as HTMLElement).addEventListener("mouseenter", () => cursor.classList.add("hovering"));
        (el as HTMLElement).addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
      });
    };

    document.addEventListener("mousemove", onMove);
    attachHover();

    const mutObs = new MutationObserver(attachHover);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      mutObs.disconnect();
    };
  }, [outsideHero]);

  if (!outsideHero) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" style={{ opacity: 0 }} />;
}
