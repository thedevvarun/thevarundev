import { useEffect, useRef } from "react";

type Body = { x: number; y: number; vx: number; vy: number; a: number; va: number; r: number; kind: number; tone: number };

const KINDS = [0, 1, 2, 4, 1, 0, 3, 2, 0, 1, 4, 3, 2]; // 0 triangle, 1 half-disc, 2 disc, 3 ring, 4 square
const TONES = [0, 1, 2, 0, 3, 2, 1, 4, 0, 2, 1, 0, 2]; // 0 blue, 1 ink, 2 ink outline, 3 hot, 4 blue outline
const TAU = Math.PI * 2;

/**
 * The logo's two shapes and a few relatives, as a small physics toy.
 * Float mode drifts in zero gravity; pile mode drops them onto the floor.
 * They dodge the pointer, can be grabbed and thrown, and feel the page scroll.
 */
export default function Shapes({ pile = false }: { pile?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const c = cv.getContext("2d")!;
    const host = cv.parentElement!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bodies: Body[] = [];
    const ptr = { x: -9999, y: -9999, vx: 0, vy: 0 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let grab = -1;
    let lastY = scrollY;
    let frame = 0;
    let tones: string[] = [];

    const readTones = () => {
      const s = getComputedStyle(cv);
      const v = (n: string) => s.getPropertyValue(n).trim();
      tones = [v("--blue"), v("--ink"), v("--ink"), v("--hot"), v("--blue")];
    };

    let seed = pile ? 11 : 5;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const init = () => {
      bodies.length = 0;
      const n = w < 700 ? 8 : 13;
      const base = Math.min(Math.max(Math.min(w, h), 440), 900) * (pile ? 0.72 : 1);
      for (let i = 0; i < n; i++) {
        const r = base * (0.034 + rnd() * 0.058);
        bodies.push({
          x: pile ? r + rnd() * (w - r * 2) : w * (0.34 + rnd() * 0.62),
          y: pile ? -r - i * 110 : h * (0.14 + rnd() * 0.62),
          vx: (rnd() - 0.5) * 1.2,
          vy: (rnd() - 0.5) * 1.2,
          a: rnd() * TAU,
          va: (rnd() - 0.5) * 0.012,
          r,
          kind: KINDS[i % KINDS.length],
          tone: TONES[i % TONES.length],
        });
      }
    };

    const step = () => {
      const dy = Math.max(-70, Math.min(70, scrollY - lastY));
      lastY = scrollY;
      frame++;
      bodies.forEach((b, i) => {
        if (i === grab) {
          b.vx = (ptr.x - b.x) * 0.3;
          b.vy = (ptr.y - b.y) * 0.3;
        } else {
          if (pile) b.vy += 0.42 - Math.abs(dy) * 0.005;
          else {
            b.vx += Math.cos(frame * 0.006 + i * 1.7) * 0.006;
            b.vy += Math.sin(frame * 0.005 + i * 2.3) * 0.006 + dy * 0.016 * (0.5 + (i % 3) * 0.35);
          }
          const dx = b.x - ptr.x;
          const dz = b.y - ptr.y;
          const d = Math.hypot(dx, dz);
          const reach = b.r + 90;
          if (d < reach && d > 0.01) {
            const f = (1 - d / reach) * 0.9;
            b.vx += (dx / d) * f + ptr.vx * 0.02;
            b.vy += (dz / d) * f + ptr.vy * 0.02;
          }
        }
        const damp = pile ? 0.985 : 0.992;
        b.vx *= damp;
        b.vy *= damp;
        b.va *= pile ? 0.86 : 0.995;
        if (pile) b.va = Math.max(-0.02, Math.min(0.02, b.va));
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > 26) {
          b.vx *= 26 / sp;
          b.vy *= 26 / sp;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.a += b.va;
      });

      for (let pass = 0; pass < (pile ? 4 : 1); pass++) {
        for (let i = 0; i < bodies.length; i++) {
          const a = bodies[i];
          for (let j = i + 1; j < bodies.length; j++) {
            const b = bodies[j];
            const dx = b.x - a.x;
            const dz = b.y - a.y;
            const d = Math.hypot(dx, dz) || 0.01;
            const over = a.r + b.r - d;
            if (over <= 0) continue;
            const nx = dx / d;
            const ny = dz / d;
            const ma = a.r * a.r;
            const mb = b.r * b.r;
            const sum = ma + mb;
            a.x -= nx * over * (mb / sum);
            a.y -= ny * over * (mb / sum);
            b.x += nx * over * (ma / sum);
            b.y += ny * over * (ma / sum);
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel >= 0) continue;
            const jn = (-(1 + (pile ? 0.15 : 0.7)) * rel) / (1 / ma + 1 / mb);
            a.vx -= (jn / ma) * nx;
            a.vy -= (jn / ma) * ny;
            b.vx += (jn / mb) * nx;
            b.vy += (jn / mb) * ny;
            const spin = ((b.vx - a.vx) * ny - (b.vy - a.vy) * nx) * (pile ? 0.0003 : 0.0016);
            a.va += spin;
            b.va -= spin;
          }
        }
        for (const b of bodies) {
          const e = pile ? 0.2 : 0.75;
          if (b.x < b.r) (b.x = b.r), (b.vx = Math.abs(b.vx) * e);
          if (b.x > w - b.r) (b.x = w - b.r), (b.vx = -Math.abs(b.vx) * e);
          if (b.y > h - b.r) (b.y = h - b.r), (b.vy = -Math.abs(b.vy) * e), pile && (b.vx *= 0.9);
          if (!pile && b.y < b.r) (b.y = b.r), (b.vy = Math.abs(b.vy) * e);
        }
      }
      ptr.vx *= 0.8;
      ptr.vy *= 0.8;
    };

    const draw = () => {
      c.clearRect(0, 0, w, h);
      for (const b of bodies) {
        const { r } = b;
        c.save();
        c.translate(b.x, b.y);
        c.rotate(b.a);
        c.beginPath();
        if (b.kind === 0) {
          c.moveTo(0, -r);
          c.lineTo(r * 0.87, r * 0.5);
          c.lineTo(-r * 0.87, r * 0.5);
          c.closePath();
        } else if (b.kind === 1) {
          c.arc(-r * 0.4, 0, r, -Math.PI / 2, Math.PI / 2);
          c.closePath();
        } else if (b.kind === 4) c.rect(-r * 0.72, -r * 0.72, r * 1.44, r * 1.44);
        else c.arc(0, 0, b.kind === 3 ? r * 0.76 : r, 0, TAU);
        const outline = b.tone === 2 || b.tone === 4;
        if (b.kind === 3) {
          c.lineWidth = r * 0.46;
          c.strokeStyle = tones[b.tone];
          c.stroke();
        } else if (outline) {
          c.lineWidth = 2;
          c.strokeStyle = tones[b.tone];
          c.stroke();
        } else {
          c.fillStyle = tones[b.tone];
          c.fill();
        }
        c.restore();
      }
    };

    const loop = () => {
      raf = 0;
      step();
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && !still) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(devicePixelRatio || 1, 2);
      const first = !w;
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      c.setTransform(d, 0, 0, d, 0, 0);
      if (first) {
        readTones();
        init();
        if (still) {
          if (pile) for (let i = 0; i < 500; i++) step();
          draw();
        }
      }
      kick();
    });
    ro.observe(cv);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      lastY = scrollY;
      if (visible) kick();
    });
    io.observe(cv);

    const theme = new MutationObserver(() => {
      readTones();
      if (still) draw();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const at = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ptr.vx = x - ptr.x;
      ptr.vy = y - ptr.y;
      ptr.x = x;
      ptr.y = y;
    };
    const down = (e: PointerEvent) => {
      if (e.target !== cv) return;
      at(e);
      ptr.vx = ptr.vy = 0;
      if (e.pointerType === "touch") {
        for (const b of bodies) {
          const d = Math.hypot(b.x - ptr.x, b.y - ptr.y) || 1;
          if (d < 260) (b.vx += ((b.x - ptr.x) / d) * 9), (b.vy += ((b.y - ptr.y) / d) * 9);
        }
        return;
      }
      for (let i = bodies.length - 1; i >= 0; i--)
        if (Math.hypot(bodies[i].x - ptr.x, bodies[i].y - ptr.y) < bodies[i].r) {
          grab = i;
          cv.setPointerCapture(e.pointerId);
          break;
        }
    };
    const up = () => {
      grab = -1;
    };
    const leave = () => {
      if (grab < 0) ptr.x = ptr.y = -9999;
    };
    host.addEventListener("pointermove", at);
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointerleave", leave);
    addEventListener("pointerup", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      theme.disconnect();
      host.removeEventListener("pointermove", at);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerleave", leave);
      removeEventListener("pointerup", up);
    };
  }, [pile]);

  return <canvas ref={ref} className="shapes" aria-hidden="true" />;
}
