"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ScrollRevealInit() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isReducedMotion: "(prefers-reduced-motion: reduce)",
          isMotionOK: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { isReducedMotion } = ctx.conditions as {
            isReducedMotion: boolean;
            isMotionOK: boolean;
          };

          if (isReducedMotion) {
            gsap.set(".reveal, [data-reveal-stagger] > *", {
              opacity: 1,
              y: 0,
              clearProps: "transform",
            });
            return;
          }

          // 1) Generic fade-up reveals — every `.reveal` outside stagger groups
          const singles = gsap.utils.toArray<HTMLElement>(
            ".reveal:not([data-reveal-stagger] > *)"
          );

          singles.forEach((el) => {
            const delay = parseFloat(
              getComputedStyle(el).getPropertyValue("--reveal-delay") || "0"
            );

            gsap.fromTo(
              el,
              { opacity: 0, y: 8, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                clearProps: "filter",
                duration: 0.55,
                ease: "power2.out",
                delay: isNaN(delay) ? 0 : delay / 1000,
                force3D: true,
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none none",
                  once: true,
                },
              }
            );
          });

          // 2) Staggered card groups — wrap with `data-reveal-stagger`
          const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]");

          groups.forEach((group) => {
            const items = gsap.utils.toArray<HTMLElement>(
              group.querySelectorAll<HTMLElement>(":scope > *")
            );
            if (items.length === 0) return;

            gsap.set(items, { opacity: 0, y: 8, filter: "blur(8px)" });

            ScrollTrigger.create({
              trigger: group,
              start: "top 82%",
              once: true,
              onEnter: () => {
                gsap.to(items, {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  clearProps: "filter",
                  duration: 0.55,
                  ease: "power3.out",
                  stagger: 0.12,
                  force3D: true,
                });
              },
            });
          });
        }
      );

      // Refresh once after first paint so triggers measure post-layout
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    {}
  );

  return null;
}
