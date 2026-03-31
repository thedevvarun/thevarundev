import { useEffect, useRef } from "react";

/**
 * Creates a parallax effect on an element based on mouse movements.
 */
export function useParallax<T extends HTMLElement>(intensity: number = 20) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    let rafId: number;
    let animeInstance: any = null;
    let animeLib: any = null;

    // Resolve anime once at mount
    import("animejs").then(({ default: anime }) => {
      animeLib = anime;
    }).catch(err => {
      console.error("AnimeJS load failed in useParallax:", err);
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!animeLib) return;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      const xPos = (e.clientX / innerWidth) * 2 - 1;
      const yPos = (e.clientY / innerHeight) * 2 - 1;
      
      const xOffset = xPos * intensity;
      const yOffset = yPos * intensity;

      // cancel previous frame to ensure smooth
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (animeInstance) animeInstance.pause();
        animeInstance = animeLib({
          targets: el,
          translateX: xOffset,
          translateY: yOffset,
          rotateX: -yPos * (intensity / 4), // subtle tilt
          rotateY: xPos * (intensity / 4), 
          duration: 400,
          easing: "easeOutCubic",
          scale: 1.02 // very subtle scale to prevent text jitter if any
        });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      if (!animeLib) return;
      if (animeInstance) animeInstance.pause();
      animeInstance = animeLib({
        targets: el,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 800,
        easing: "easeOutElastic(1, .6)"
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [intensity]);

  return ref;
}
