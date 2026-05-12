"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" style={{ opacity: 0 }} />;
}
