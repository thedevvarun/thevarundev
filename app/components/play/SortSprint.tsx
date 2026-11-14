import { useState } from "react";

const ROUNDS = [
  [6, 9, 3, 4, 7],
  [8, 2, 5, 9, 4, 6],
  [7, 3, 9, 2, 6, 4],
];

const inversions = (a: number[]) => a.reduce((n, x, i) => n + a.slice(i + 1).filter((y) => y < x).length, 0);

/** Sort Sprint, from Algoplay's arcade: swap neighbours until the bars run small to tall. */
export default function SortSprint() {
  const [round, setRound] = useState(0);
  const [bars, setBars] = useState(ROUNDS[0]);
  const [swaps, setSwaps] = useState(0);
  const best = inversions(ROUNDS[round]);
  const sorted = inversions(bars) === 0;

  const swap = (i: number) => {
    const next = [...bars];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setBars(next);
    setSwaps(swaps + 1);
  };
  const next = () => {
    const r = (round + 1) % ROUNDS.length;
    setRound(r);
    setBars(ROUNDS[r]);
    setSwaps(0);
  };

  return (
    <div className="play">
      <div className="play-head">
        <b>Sort Sprint</b>
        <span>
          Swaps {swaps} · best {best}
        </span>
      </div>
      <div className="sort-stage" style={{ "--n": bars.length } as React.CSSProperties}>
        {[...bars]
          .sort((a, b) => a - b)
          .map((v) => (
            <div className="sort-bar" key={v} style={{ "--at": bars.indexOf(v), "--val": v } as React.CSSProperties}>
              <i />
              <b>{v}</b>
            </div>
          ))}
        {!sorted &&
          bars.slice(1).map((_, i) => (
            <button
              type="button"
              className="sort-swap"
              key={i}
              style={{ "--at": i } as React.CSSProperties}
              onClick={() => swap(i)}
              aria-label={`Swap ${bars[i]} and ${bars[i + 1]}`}
            >
              ⇄
            </button>
          ))}
      </div>
      {sorted ? (
        <button type="button" className="play-btn" onClick={next}>
          {swaps === best ? `Sorted in ${swaps}, the fewest possible. Next` : `Sorted in ${swaps}. ${best} was possible. Next`}
        </button>
      ) : (
        <p className="play-note">Tap ⇄ between two bars to swap them. Sort small to tall in the fewest swaps.</p>
      )}
    </div>
  );
}
