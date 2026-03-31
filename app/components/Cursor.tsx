import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function CursorInner() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const hovering = useRef(false);
  const trails = useRef<{ x: number; y: number; alpha: number; r: number }[]>([]);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current!;
    const ringEl = ringRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

      // Push ink trail point
      trails.current.push({ x: e.clientX, y: e.clientY, alpha: 0.6, r: 3 });
      if (trails.current.length > 40) trails.current.shift();
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor-hover]") && !hovering.current) {
        hovering.current = true;
        ringEl.style.width = "56px";
        ringEl.style.height = "56px";
        ringEl.style.opacity = "0.6";
        dot.style.width = "4px";
        dot.style.height = "4px";
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor-hover]") && hovering.current) {
        hovering.current = false;
        ringEl.style.width = "36px";
        ringEl.style.height = "36px";
        ringEl.style.opacity = "1";
        dot.style.width = "8px";
        dot.style.height = "8px";
      }
    };

    const onMouseDown = () => { dot.style.transform += " scale(0.7)"; };
    const onMouseUp = () => { dot.style.transform = dot.style.transform.replace(" scale(0.7)", ""); };

    const tick = () => {
      // Lag ring
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;

      // Draw ink trail on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trails.current.length; i++) {
        const t = trails.current[i];
        const next = trails.current[i + 1];
        if (!next) continue;

        // Progress 0→1 along the trail (older = more faded)
        const progress = i / trails.current.length;

        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${progress * 0.25})`;
        ctx.lineWidth = progress * 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Fade out old trails
      for (let i = trails.current.length - 1; i >= 0; i--) {
        trails.current[i].alpha -= 0.018;
        if (trails.current[i].alpha <= 0) trails.current.splice(i, 1);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Ink trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99997,
        }}
      />

      {/* Cursor wrapper — mix-blend-mode here so it blends above canvas */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99998,
          mixBlendMode: "difference",
        }}
      >
        {/* Dot */}
        <div
          ref={dotRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            background: "white",
            borderRadius: "50%",
            willChange: "transform",
            transform: "translate(-200px, -200px) translate(-50%, -50%)",
            transition: "width 0.15s ease, height 0.15s ease",
          }}
        />
        {/* Ring */}
        <div
          ref={ringRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 36,
            height: 36,
            border: "1.5px solid white",
            borderRadius: "50%",
            willChange: "transform",
            transform: "translate(-200px, -200px) translate(-50%, -50%)",
            transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
          }}
        />
      </div>
    </>
  );
}

export default function Cursor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render directly into document.body via portal — bypasses all React stacking contexts
  if (!mounted) return null;
  return createPortal(<CursorInner />, document.body);
}
