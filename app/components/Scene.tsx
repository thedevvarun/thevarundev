import { useEffect, useRef } from "react";
import type { Draw } from "./scenes";

export default function Scene({ draw, label, className }: { draw: Draw; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const c = cv.getContext("2d")!;
    const area = cv.parentElement!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = { x: 0.5, y: 0.5, on: false };
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const frame = (ms: number) => {
      raf = 0;
      if (w && h) draw(c, w, h, still ? 4.2 : ms / 1000, p);
      if (visible && !still) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      c.setTransform(d, 0, 0, d, 0, 0);
      kick();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(cv);

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      p.x = (e.clientX - r.left) / r.width;
      p.y = (e.clientY - r.top) / r.height;
      p.on = true;
    };
    const leave = () => {
      p.on = false;
    };
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, [draw]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
