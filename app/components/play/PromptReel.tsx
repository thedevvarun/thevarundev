import { useEffect, useState } from "react";

const SHOTS = [
  ["Mitosis", "How does mitosis work?", "mitosis"],
  ["Rocket engine", "How does a rocket engine work?", "rocket-engine"],
  ["The heart", "How does the human heart work?", "how-does-human-heart-works"],
  ["Jet engine", "How does a jet engine work?", "jet-engine"],
  ["Dyson sphere", "What is a Dyson sphere?", "dyson-sphere"],
];

/** Pick a prompt, see a frame from the explainer UnStill made for it. Cycles on its own until touched. */
export default function PromptReel() {
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setAt((a) => (a + 1) % SHOTS.length), 3600);
    return () => clearInterval(id);
  }, [auto]);

  return (
    <div className="play">
      <div className="play-head">
        <b>One line in, one explainer out</b>
        <span>Real frames</span>
      </div>
      <p className="reel-prompt">
        <i>Prompt</i>
        <span key={at}>{SHOTS[at][1]}</span>
      </p>
      <div className="reel-stage">
        {SHOTS.map(([name, , file], i) => (
          <img
            key={file}
            className={i === at ? "on" : ""}
            src={`/media/unstill-${file}.webp`}
            alt={`Frame from an UnStill explainer: ${name}`}
            width="800"
            height="450"
            loading="lazy"
          />
        ))}
      </div>
      <div className="reel-chips">
        {SHOTS.map(([name], i) => (
          <button
            type="button"
            key={name}
            aria-pressed={i === at}
            onClick={() => {
              setAt(i);
              setAuto(false);
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
