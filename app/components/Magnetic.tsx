import React, { cloneElement, useRef, useEffect } from "react";
import type { ReactElement } from "react";

export default function Magnetic({ children, strength = 30 }: { children: ReactElement, strength?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    let isHovered = false;
    let animeInstance: any = null;
    let animeLib: any = null;

    // Resolve anime once at mount
    import("animejs").then(({ default: anime }) => {
      animeLib = anime;
    }).catch(err => {
      console.error("AnimeJS load failed in Magnetic:", err);
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered || !animeLib) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tx = (x / (rect.width / 2)) * strength;
      const ty = (y / (rect.height / 2)) * strength;

      if (animeInstance) animeInstance.pause();
      animeInstance = animeLib({
        targets: el,
        translateX: tx,
        translateY: ty,
        scale: 1.1,
        duration: 350,
        easing: "easeOutCubic",
      });
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      if (!animeLib) return;
      if (animeInstance) animeInstance.pause();
      animeInstance = animeLib({
        targets: el,
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 800,
        easing: "easeOutElastic(1, .6)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (animeInstance) animeInstance.pause();
    };
  }, [strength]);

  const childProps = (children as React.ReactElement<any>).props;
  const childClassName = childProps.className ? `${childProps.className} magnetic` : "magnetic";

  return cloneElement(children as React.ReactElement<any>, { ref, className: childClassName });
}
