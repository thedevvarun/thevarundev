import { useState } from "react";

const ROUNDS = [
  [1, 2],
  [1, 1, 2],
  [1, 3, 2],
  [3, 1, 2],
  [2, 1, 1, 3],
];
const COLORS = ["#2DD68A", "#F7B731", "#8B7CF6", "#4FC3F7"];

/** Flex Fit, one of Flutter Wizard's arcade games: match the target row by changing flex factors. */
export default function FlexFit() {
  const [round, setRound] = useState(0);
  const [flex, setFlex] = useState(() => ROUNDS[0].map(() => 1));
  const [taps, setTaps] = useState(0);
  const target = ROUNDS[round];
  const won = flex.every((f, i) => f * target[0] === target[i] * flex[0]);
  const finished = won && round === ROUNDS.length - 1;

  const go = (next: number) => {
    setRound(next);
    setFlex(ROUNDS[next].map(() => 1));
    if (next === 0) setTaps(0);
  };
  const bump = (i: number, by: number) => {
    if (won) return;
    setFlex(flex.map((f, j) => (j === i ? Math.max(1, Math.min(6, f + by)) : f)));
    setTaps(taps + 1);
  };

  return (
    <div className="play">
      <div className="play-head">
        <b>Flex Fit</b>
        <span>
          Round {round + 1} of {ROUNDS.length} · {taps} taps
        </span>
      </div>
      <div className="flex-row target" aria-label={`Target layout, flex ${target.join(" to ")}`}>
        {target.map((f, i) => (
          <i key={i} style={{ flexGrow: f, background: COLORS[i] }} />
        ))}
      </div>
      <div className={`flex-row${won ? " won" : ""}`}>
        {flex.map((f, i) => (
          <b key={i} style={{ flexGrow: f, background: COLORS[i] }}>
            {f}
          </b>
        ))}
      </div>
      <div className="flex-ctl">
        {flex.map((f, i) => (
          <div key={i}>
            <button type="button" onClick={() => bump(i, -1)} disabled={won || f <= 1} aria-label={`Lower flex of box ${i + 1}`}>
              −
            </button>
            <button type="button" onClick={() => bump(i, 1)} disabled={won || f >= 6} aria-label={`Raise flex of box ${i + 1}`}>
              +
            </button>
          </div>
        ))}
      </div>
      <p className="code">
        Row(children: [
        {flex.map((f, i) => (
          <span key={i}>
            {i ? ", " : ""}Expanded(flex: <em>{f}</em>)
          </span>
        ))}
        ])
      </p>
      {won ? (
        <button type="button" className="play-btn" onClick={() => go(finished ? 0 : round + 1)}>
          {finished ? `All five in ${taps} taps. Play again` : "Matched. Next round"}
        </button>
      ) : (
        <p className="play-note">Make your row match the faded one. Flex is a ratio, not a width.</p>
      )}
    </div>
  );
}
