import { useEffect, useRef, useState } from "react";

/** Plays muted while on screen, pauses when it leaves, and loads nothing until then. */
export default function Video({ src, poster, label, sound }: { src: string; poster: string; label: string; sound?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    v.muted = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setStill(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video ref={ref} src={src} poster={poster} loop playsInline muted preload="none" controls={still} aria-label={label} />
      {sound && !still && (
        <button
          type="button"
          className="vid-sound"
          onClick={() => {
            const v = ref.current!;
            v.muted = !muted;
            if (muted) v.currentTime = 0;
            v.play().catch(() => {});
            setMuted(!muted);
          }}
        >
          {muted ? "Play with sound" : "Mute"}
        </button>
      )}
    </>
  );
}
