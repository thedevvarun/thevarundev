export type Pointer = { x: number; y: number; on: boolean };
export type Draw = (
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: Pointer
) => void;

const TAU = Math.PI * 2;
const SUN = "#FFB02E";

function dot(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fill();
}

const ease = (x: number) => {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
};

// Fixed star field, so the sky is the same every visit.
const STARS = Array.from({ length: 90 }, (_, i) => {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 311.7) * 24634.6345;
  return [a - Math.floor(a), b - Math.floor(b), 0.5 + ((i * 7) % 5) / 5] as const;
});

let rolled = 0;
let lastT = 0;

/*
 * Frugal Founder: a take-off, seen from the cockpit, on a 12 second loop.
 * 0 → 0.72 is the ground roll, the rest is the climb. The aircraft leaves the
 * ground with runway still ahead of it, which is the whole point of the studio.
 */
export const runway: Draw = (c, w, h, t) => {
  const dt = Math.min(0.05, Math.max(0, t - lastT));
  lastT = t;
  const tt = t % 12;
  const s = tt < 9.6 ? Math.min(1, tt / 7.4) : 0;
  const roll = ease(s / 0.72);
  const lift = ease((s - 0.72) / 0.28);
  rolled += (0.3 + roll * 3.4) * dt;

  c.clearRect(0, 0, w, h);
  // Cut back to the threshold with a short dip to black.
  c.globalAlpha = Math.min(1, Math.abs(tt - 9.6) / 0.6);
  const wide = w > 900;
  const vx = wide ? w * 0.72 : w / 2;
  const vy = h * (0.36 + lift * 0.9);
  const half = (wide ? w * 0.34 : w * 0.5) * (1 + roll * 0.25);
  const floor = Math.max(h, vy + h * 0.4);

  for (const [sx, sy, m] of STARS) {
    c.fillStyle = `rgba(237,237,234,${lift * 0.75 * m * (0.7 + 0.3 * Math.sin(t * 1.3 + sx * 40))})`;
    dot(c, sx * w, ((sy * h * 0.9 + lift * 120 * m) % (h * 0.9)) + 20, 0.6 + m * 0.7);
  }

  const glow = c.createRadialGradient(vx, vy, 0, vx, vy, w * 0.62);
  glow.addColorStop(0, `rgba(255,176,46,${0.3 - lift * 0.12})`);
  glow.addColorStop(1, "rgba(255,176,46,0)");
  c.fillStyle = glow;
  c.fillRect(0, 0, w, h);

  c.fillStyle = "rgba(237,237,234,.05)";
  c.beginPath();
  c.moveTo(vx, vy);
  c.lineTo(vx + half, floor);
  c.lineTo(vx - half, floor);
  c.fill();

  const N = 16;
  const blur = 0.012 + roll * 0.085;
  const Y = (k: number) => vy + (floor - vy) * k * k * k;
  for (let i = 0; i < N; i++) {
    const z = (i + (rolled % 1)) / N;
    const k = z * z * z;
    const z2 = Math.min(1, z + 0.5 / N);
    const k2 = z2 * z2 * z2;
    c.fillStyle = `rgba(237,237,234,${0.22 + z * 0.6})`;
    c.beginPath();
    c.moveTo(vx - half * 0.04 * k, Y(z));
    c.lineTo(vx + half * 0.04 * k, Y(z));
    c.lineTo(vx + half * 0.04 * k2, Y(z2));
    c.lineTo(vx - half * 0.04 * k2, Y(z2));
    c.fill();

    // Edge lights smear into streaks as the speed builds.
    const zb = Math.min(1, z + blur);
    const kb = zb * zb * zb;
    c.strokeStyle = SUN;
    c.lineCap = "round";
    c.lineWidth = 1.4 + 6 * z;
    c.shadowColor = SUN;
    c.shadowBlur = 16 * z;
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(vx + side * half * k, Y(z));
      c.lineTo(vx + side * half * kb, Y(zb));
      c.stroke();
    }
    c.shadowBlur = 0;
  }

  c.strokeStyle = `rgba(237,237,234,${0.22 * (1 - lift)})`;
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(0, vy);
  c.lineTo(w, vy);
  c.stroke();

  if (!wide) {
    c.globalAlpha = 1;
    return;
  }

  // Head-up display: how much runway is left, and what the aircraft is doing.
  const left = 1 - roll * 0.68;
  const bw = 220;
  const bx = w - bw - Math.max(24, w * 0.045);
  const by = 112;
  c.font = '500 11px "Archivo", sans-serif';
  c.textBaseline = "alphabetic";
  c.textAlign = "left";
  c.fillStyle = "rgba(237,237,234,.6)";
  c.fillText("RUNWAY LEFT", bx, by);
  c.textAlign = "right";
  c.fillStyle = "#EDEDEA";
  c.fillText(`${Math.round(left * 100)}%`, bx + bw, by);
  for (let i = 0; i < 22; i++) {
    c.fillStyle = i / 22 < left ? SUN : "rgba(237,237,234,.16)";
    c.fillRect(bx + i * 10, by + 10, 7, 12);
  }
  c.textAlign = "left";
  c.font = '600 15px "Archivo", sans-serif';
  c.fillStyle = "#EDEDEA";
  const knots = Math.round(roll * 148 + lift * 22);
  c.fillText(
    s < 0.02 ? "Cleared for take-off." : lift >= 1 ? "Airborne, with runway to spare." : lift > 0 ? "Rotate." : `Rolling · ${knots} kt`,
    bx,
    by + 48
  );
  c.globalAlpha = 1;
};
