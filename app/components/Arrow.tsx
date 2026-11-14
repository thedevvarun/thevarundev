const TURN = { out: 0, right: 45, down: 135, left: 225, up: 315 };

/** One arrow, drawn once and turned to face where it points. `out` is the up-right arrow for links that leave the page. */
export default function Arrow({ dir = "out" }: { dir?: keyof typeof TURN }) {
  return (
    <svg className="arr" width="0.72em" height="0.72em" viewBox="0 0 12 12" aria-hidden="true" style={{ rotate: `${TURN[dir]}deg` }}>
      <path d="M2.5 9.5l7-7M4.2 2.5h5.3v5.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
