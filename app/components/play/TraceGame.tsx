import { useEffect, useRef, useState } from "react";

const BEAT = 0.58;
const NODES = 10;
const LEAD = 3;
const NOTES = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
const TAU = Math.PI * 2;
const GOLD = "#F5B83D";

// A five-point star: every corner is one beat.
const PTS = Array.from({ length: NODES + 1 }, (_, i) => {
  const a = -Math.PI / 2 + (i % NODES) * (Math.PI / 5);
  const r = i % 2 ? 0.42 : 1;
  return [Math.cos(a) * r, Math.sin(a) * r] as const;
});

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** The Trace mechanic in miniature: tap as the line reaches each corner, then see what you drew. */
export default function TraceGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [score, setScore] = useState(0);
  const game = useRef({
    phase: "idle" as "idle" | "play" | "done",
    t0: 0,
    end: 0,
    marks: new Array<number>(NODES + 1).fill(0), // 1 perfect, 2 good, 3 miss
    combo: 0,
    say: "",
    sayAt: 0,
    beat: -99,
    ac: null as AudioContext | null,
  });

  const blip = (freq: number, len: number, gain: number, type: OscillatorType = "triangle") => {
    const ac = game.current.ac;
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + len);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + len);
  };

  const start = () => {
    const g = game.current;
    try {
      g.ac ??= new AudioContext();
      g.ac.resume();
    } catch {
      g.ac = null;
    }
    g.marks.fill(0);
    g.combo = 0;
    g.say = "";
    g.beat = -99;
    g.t0 = performance.now() / 1000 + LEAD * BEAT;
    g.phase = "play";
    setPhase("play");
  };

  const tap = () => {
    const g = game.current;
    if (g.phase !== "play") return;
    const t = performance.now() / 1000 - g.t0;
    const k = Math.round(t / BEAT);
    if (k < 1 || k > NODES || g.marks[k]) return;
    const off = Math.abs(t - k * BEAT);
    if (off > 0.3) return;
    g.marks[k] = off <= 0.1 ? 1 : off <= 0.2 ? 2 : 3;
    g.combo = g.marks[k] === 3 ? 0 : g.combo + 1;
    g.say = g.marks[k] === 1 ? `Perfect x${g.combo}` : g.marks[k] === 2 ? "Good" : "Off beat";
    g.sayAt = performance.now() / 1000;
    if (g.marks[k] < 3) blip(NOTES[k - 1], 0.5, 0.11);
  };

  useEffect(() => {
    const cv = ref.current!;
    const c = cv.getContext("2d")!;
    const g = game.current;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const frame = () => {
      raf = 0;
      const now = performance.now() / 1000;
      const t = g.phase === "idle" ? -LEAD * BEAT : now - g.t0;

      if (g.phase === "play") {
        const beat = Math.floor(t / BEAT);
        if (beat !== g.beat && beat <= NODES) {
          g.beat = beat;
          blip(beat < 0 ? 220 : 110, 0.09, 0.05, "sine");
        }
        for (let k = 1; k <= NODES; k++)
          if (!g.marks[k] && t > k * BEAT + 0.2) {
            g.marks[k] = 3;
            g.combo = 0;
            g.say = "Missed";
            g.sayAt = now;
          }
        if (t > NODES * BEAT + 0.3) {
          g.phase = "done";
          g.end = now;
          const pts = g.marks.reduce((s, m) => s + (m === 1 ? 1 : m === 2 ? 0.6 : 0), 0);
          setScore(Math.round((pts / NODES) * 100));
          setPhase("done");
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => blip(f, 0.7, 0.08), i * 90));
        }
      }

      const u = Math.min(NODES, Math.max(0, t / BEAT));
      const seg = Math.min(NODES - 1, Math.floor(u));
      const f = u - seg;
      const hx = PTS[seg][0] + (PTS[seg + 1][0] - PTS[seg][0]) * f;
      const hy = PTS[seg][1] + (PTS[seg + 1][1] - PTS[seg][1]) * f;
      const out = g.phase === "done" ? ease((now - g.end) / 1.3) : 0;
      const S = Math.min(w, h) * 0.36;
      const zoom = 2.5 - 1.5 * out;
      const fx = hx * (1 - out);
      const fy = hy * (1 - out) + 0.05 * out;

      const sky = c.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#12306b");
      sky.addColorStop(1, "#071226");
      c.fillStyle = sky;
      c.fillRect(0, 0, w, h);

      c.save();
      c.translate(w / 2, h / 2);
      c.scale(zoom, zoom);
      c.translate(-fx * S, -fy * S);

      c.strokeStyle = "rgba(255,255,255,.06)";
      c.lineWidth = 1 / zoom;
      c.beginPath();
      for (let i = -8; i <= 8; i++) {
        c.moveTo(i * 0.25 * S, -2 * S);
        c.lineTo(i * 0.25 * S, 2 * S);
        c.moveTo(-2 * S, i * 0.25 * S);
        c.lineTo(2 * S, i * 0.25 * S);
      }
      c.stroke();

      c.lineJoin = c.lineCap = "round";
      if (out > 0) {
        c.beginPath();
        PTS.forEach(([x, y], i) => (i ? c.lineTo(x * S, y * S) : c.moveTo(x * S, y * S)));
        c.fillStyle = `rgba(245,184,61,${out})`;
        c.fill();
      } else if (seg < NODES) {
        c.strokeStyle = "rgba(255,255,255,.13)";
        c.lineWidth = 9;
        c.beginPath();
        c.moveTo(hx * S, hy * S);
        for (let k = seg + 1; k <= Math.min(NODES, seg + 2); k++) c.lineTo(PTS[k][0] * S, PTS[k][1] * S);
        c.stroke();
      }

      c.strokeStyle = "#fff";
      c.lineWidth = 4.5;
      c.beginPath();
      c.moveTo(PTS[0][0] * S, PTS[0][1] * S);
      for (let k = 1; k <= seg; k++) c.lineTo(PTS[k][0] * S, PTS[k][1] * S);
      c.lineTo(hx * S, hy * S);
      c.stroke();

      for (let k = 0; k <= Math.min(NODES, seg + 2); k++) {
        const [x, y] = PTS[k];
        const m = g.marks[k];
        c.fillStyle = m === 3 ? "#ff6b6b" : m === 2 ? "#fff" : GOLD;
        c.beginPath();
        c.arc(x * S, y * S, m ? 5 : 3.6, 0, TAU);
        c.fill();
        const dt = k * BEAT - t;
        if (!m && k > 0 && dt > -0.2 && dt < BEAT * 1.2 && g.phase !== "done") {
          c.strokeStyle = `rgba(245,184,61,${1 - Math.max(0, dt) / (BEAT * 1.3)})`;
          c.lineWidth = 2;
          c.beginPath();
          c.arc(x * S, y * S, 6 + Math.max(0, dt / BEAT) * 22, 0, TAU);
          c.stroke();
        }
      }

      if (g.phase !== "done") {
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(hx * S, hy * S, 6.5 + (g.phase === "idle" ? Math.sin(now * 4) * 1.5 : 0), 0, TAU);
        c.fill();
      }
      c.restore();

      c.font = '600 12px "Archivo", sans-serif';
      c.textBaseline = "top";
      c.fillStyle = "rgba(255,255,255,.7)";
      c.textAlign = "left";
      c.fillText(g.phase === "done" ? "Drawing: a star" : "Drawing: ???", 14, 14);
      c.textAlign = "right";
      c.fillText(`${Math.round((u / NODES) * 100)}%`, w - 14, 14);
      if (g.phase === "play") {
        c.textAlign = "center";
        if (t < 0) {
          c.font = '600 44px "Archivo", sans-serif';
          c.fillStyle = "#fff";
          c.fillText(String(Math.ceil(-t / BEAT)), w / 2, h * 0.16);
        } else if (now - g.sayAt < 0.7) {
          c.font = '600 20px "Archivo", sans-serif';
          c.fillStyle = `rgba(245,184,61,${1 - (now - g.sayAt) / 0.7})`;
          c.fillText(g.say, w / 2, h * 0.18 - (now - g.sayAt) * 20);
        }
      }

      if (visible) raf = requestAnimationFrame(frame);
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

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      g.ac?.close().catch(() => {});
      g.ac = null;
    };
  }, []);

  return (
    <div className="play">
      <div className="play-head">
        <b>Play a level</b>
        <span>{phase === "play" ? "Tap on every corner" : "10 beats"}</span>
      </div>
      <div
        className="trace-stage"
        role="button"
        tabIndex={0}
        aria-label="Trace mini game. Press space or tap when the line reaches a corner."
        onPointerDown={tap}
        onKeyDown={(e) => {
          if (e.key !== " " && e.key !== "Enter") return;
          e.preventDefault();
          if (phase === "play") tap();
          else start();
        }}
      >
        <canvas ref={ref} />
        {phase !== "play" && (
          <div className="trace-over">
            <p>{phase === "idle" ? "Tap each time the line reaches a corner." : `You drew a star. ${score}% on the beat.`}</p>
            <button type="button" className="play-btn" onClick={start}>
              {phase === "idle" ? "Start, with sound" : "Play again"}
            </button>
          </div>
        )}
      </div>
      <p className="play-note">A simplified level, written for this page. The real game has 60 songs, holds and curves.</p>
    </div>
  );
}
