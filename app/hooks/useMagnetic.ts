import { useEffect, useRef } from "react";

/**
 * Creates a "magnetic" effect where the element smoothly follows the mouse
 * up to a certain distance when the cursor is nearby.
 * Requires `animejs` for smooth springs/easing.
 */
export function useMagnetic<T extends HTMLElement>(strength: number = 30) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    
    let isHovered = false;
    let animeInstance: any = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      
      const rect = el.getBoundingClientRect();
      // Calculate coordinates relative to the center of the element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Map the mouse distance to the given strength
      const tx = (x / (rect.width / 2)) * strength;
      const ty = (y / (rect.height / 2)) * strength;

      import("animejs").then(({ default: anime }) => {
        if (animeInstance) animeInstance.pause();
        animeInstance = anime({
          targets: el,
          translateX: tx,
          translateY: ty,
          scale: 1.05,
          duration: 300,
          easing: "easeOutSine",
        });
      });
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      import("animejs").then(({ default: anime }) => {
        if (animeInstance) animeInstance.pause();
        animeInstance = anime({
          targets: el,
          translateX: 0,
          translateY: 0,
          scale: 1,
          duration: 800,
          easing: "easeOutElastic(1, .5)",
        });
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (animeInstance) animeInstance.pause();
    };
  }, [strength]);

  return ref;
}
