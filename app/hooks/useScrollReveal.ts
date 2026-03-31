import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimeInstance = any;

/**
 * Scroll-triggered animation hook using IntersectionObserver + anime.js
 * Calls `animate(anime, entry.target)` when element enters viewport.
 */
export function useScrollReveal(
  animate: (anime: AnimeInstance, el: Element) => void,
  options?: { threshold?: number; rootMargin?: string; once?: boolean }
) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animeLib: any = null;
    let observer: IntersectionObserver;

    // Resolve anime once at mount
    import("animejs")
      .then(({ default: anime }) => {
        animeLib = anime;
      })
      .catch((err) => {
        console.error("AnimeJS load failed in useScrollReveal:", err);
        // Visual fallback if anime fails
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            if (options?.once !== false) hasAnimated.current = true;
            if (animeLib) {
              animate(animeLib as unknown as AnimeInstance, entry.target);
            } else {
              // Fallback: If animeLib isn't ready when we intersect, try again briefly
              setTimeout(() => {
                if (animeLib) animate(animeLib as unknown as AnimeInstance, entry.target);
                else (entry.target as HTMLElement).style.opacity = "1"; // ultimate fallback
              }, 300);
            }
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Scroll progress hook - returns a ref and calls `onProgress(ratio)` as user scrolls.
 * ratio: 0 = element just entered bottom, 1 = element at top.
 */
export function useScrollProgress(
  onProgress: (ratio: number) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const ratio = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
        1
      );
      onProgress(ratio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return ref;
}
