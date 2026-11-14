import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Role = { when: string; title: string; org: string; body: string };

// Seven roles, six scenes: the two engineering years at iDream share one.
const SCENE = [0, 1, 2, 3, 3, 4, 5];
const HOOK: [string, string, string][] = [
  ["2018", "Learned to think in code.", "A student at a desk by a night window, writing, with code symbols floating overhead"],
  ["2020", "First app, on two stores.", "Holding up a phone while an app screen assembles beside him"],
  ["2022", "Taught 25 students Flutter.", "Pointing at a whiteboard in front of a row of students"],
  ["2021 to 2023", "500,000+ classroom devices.", "Holding a laptop that is syncing to classroom devices all around him"],
  ["2023", "10,000+ screens. Bill down 40%.", "Presenting a smart TV on one side and a falling cloud bill on the other"],
  ["Now", "Took off as a founder.", "Launching a paper plane from a runway as the sun comes up"],
];
const TINT = ["#ebe7dc", "#e2e7f5", "#f2e6da", "#e0ece5", "#ece2ef", "#f7e9d0"];

const INK = "#15161b";
const SKIN = "#e2a67c";
const SKIN_D = "#c98a61";
const o = (n: number) => ({ "--o": n }) as CSSProperties;

const Pill = ({ x, y, w, children, n = 6 }: { x: number; y: number; w: number; children: string; n?: number }) => (
  <g className="pop" style={o(n)}>
    <rect x={x} y={y} width={w} height="22" rx="11" fill={INK} />
    <text x={x + w / 2} y={y + 15} textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600" letterSpacing=".04em">
      {children}
    </text>
  </g>
);

const Device = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g className="pop" style={o(n)}>
    <line className="sync" x1="260" y1="196" x2={x} y2={y} stroke={INK} strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" opacity=".45" />
    <rect x={x - 25} y={y - 15} width="50" height="36" rx="6" fill={INK} opacity=".12" />
    <rect x={x - 24} y={y - 18} width="48" height="34" rx="6" fill="#fff" stroke={INK} strokeWidth="2.2" />
    {n % 2 ? (
      <path d={`M${x - 5} ${y - 9}l13 8-13 8z`} fill="var(--pb)" />
    ) : (
      <path d={`M${x - 14} ${y - 8}h20M${x - 14} ${y - 1}h28M${x - 14} ${y + 6}h14`} stroke="var(--pb)" strokeWidth="3" strokeLinecap="round" />
    )}
  </g>
);

const BACK: ReactNode[] = [
  <>
    <g className="pop" style={o(0)}>
      <rect x="52" y="64" width="118" height="128" rx="10" fill="#1b2142" />
      <circle cx="136" cy="100" r="15" fill="#f5d98a" />
      <circle cx="129" cy="96" r="13" fill="#1b2142" />
      {[
        [78, 92],
        [100, 130],
        [72, 150],
        [150, 150],
        [118, 168],
      ].map(([x, y], i) => (
        <circle key={i} className="blink" style={o(i * 2)} cx={x} cy={y} r="1.8" fill="#fff" />
      ))}
      <path d="M111 64v128M52 128h118" stroke="#ebe7dc" strokeWidth="4" />
      <rect x="46" y="190" width="130" height="8" rx="3" fill="#cfc8b6" />
    </g>
    {["{ }", "C++", "∑", "</>"].map((t, i) => (
      <text key={t} className="float" style={o(i)} x={[392, 446, 404, 462][i]} y={[92, 132, 176, 212][i]} fill={INK} fontSize={[26, 19, 26, 18][i]} fontWeight="600">
        {t}
      </text>
    ))}
  </>,
  <>
    <g className="spin" style={{ transformOrigin: "92px 168px" }}>
      {[0, 60, 120].map((r) => (
        <ellipse key={r} cx="92" cy="168" rx="42" ry="16" fill="none" stroke="var(--pb)" strokeWidth="2.6" transform={`rotate(${r} 92 168)`} />
      ))}
      <circle cx="92" cy="168" r="6" fill="var(--pb)" />
    </g>
    <g className="pop" style={o(0)}>
      <rect x="426" y="112" width="74" height="150" rx="13" fill="#fff" stroke={INK} strokeWidth="2.4" transform="rotate(9 463 187)" opacity=".7" />
    </g>
    <g className="pop" style={o(1)}>
      <rect x="350" y="92" width="100" height="186" rx="17" fill={INK} opacity=".13" transform="translate(5 6)" />
      <rect x="350" y="92" width="100" height="186" rx="17" fill="#fff" stroke={INK} strokeWidth="2.6" />
      <rect x="386" y="99" width="28" height="7" rx="3.5" fill={INK} />
    </g>
    <rect className="pop" style={o(2)} x="360" y="116" width="80" height="12" rx="6" fill={INK} opacity=".16" />
    <g className="pop" style={o(3)}>
      <rect x="360" y="136" width="80" height="50" rx="9" fill="var(--pb)" />
      <rect x="383" y="151" width="34" height="19" rx="9.5" fill="#fff" />
      <path d="M392 157v7M388.500 160.500h7" stroke="var(--pb)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="409" cy="160.500" r="2.800" fill="var(--pb)" />
    </g>
    <rect className="pop" style={o(4)} x="360" y="194" width="37" height="37" rx="9" fill="var(--ps)" />
    <rect className="pop" style={o(5)} x="403" y="194" width="37" height="37" rx="9" fill="var(--ph)" />
    <rect className="pop" style={o(6)} x="360" y="240" width="80" height="20" rx="10" fill={INK} />
    <Pill x={352} y={288} w={96} n={7}>
      Android + iOS
    </Pill>
  </>,
  <>
    <path d="M412 168l-14 150M482 168l14 150" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
    <rect x="390" y="52" width="118" height="120" rx="9" fill={INK} opacity=".12" transform="translate(5 6)" />
    <rect x="386" y="50" width="122" height="120" rx="9" fill="#fff" stroke={INK} strokeWidth="2.6" />
    <image className="pop" style={o(1)} href="/skills/flutter.svg" x="400" y="76" width="52" height="52" />
    <g className="draw" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
      <path pathLength="1" d="M478 82v20M478 102l-14 20M478 102l14 20" />
      <circle pathLength="1" cx="478" cy="78" r="6" fill="#fff" />
      <circle pathLength="1" cx="462" cy="128" r="6" fill="#fff" />
      <circle pathLength="1" cx="494" cy="128" r="6" fill="#fff" />
    </g>
    <path className="draw" pathLength="1" d="M402 152h60" fill="none" stroke="var(--ph)" strokeWidth="3" strokeLinecap="round" />
    <line x1="364" y1="121" x2="398" y2="106" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </>,
  <>
    {[
      [84, 126],
      [436, 126],
      [54, 196],
      [466, 196],
      [98, 266],
      [422, 266],
      [164, 86],
      [356, 86],
    ].map(([x, y], i) => (
      <Device key={i} x={x} y={y} n={i + 1} />
    ))}
  </>,
  <>
    <g className="pop" style={o(1)}>
      <rect x="40" y="128" width="150" height="96" rx="9" fill={INK} opacity=".13" transform="translate(5 6)" />
      <rect x="36" y="124" width="150" height="96" rx="9" fill="#23252e" />
      <rect x="43" y="131" width="136" height="82" rx="4" fill="#fff" />
      <rect x="100" y="220" width="22" height="8" fill="#23252e" />
      <rect x="82" y="228" width="58" height="5" rx="2.500" fill="#23252e" />
      <path className="beat" d="M98 154l30 18-30 18z" fill="var(--pb)" />
      <rect x="50" y="202" width="122" height="4" rx="2" fill={INK} opacity=".14" />
      <rect className="bar" style={o(8)} x="50" y="202" width="70" height="4" rx="2" fill="var(--ph)" />
    </g>
    <g className="pop" style={o(2)}>
      <circle cx="182" cy="128" r="18" fill="var(--ps)" />
      <rect x="175" y="126" width="14" height="11" rx="2.500" fill={INK} />
      <path d="M178 126v-4a4 4 0 0 1 8 0v4" fill="none" stroke={INK} strokeWidth="2.200" />
    </g>
    <Pill x={54} y={246} w={114} n={3}>
      10,000+ screens
    </Pill>
    <g className="pop" style={o(1)}>
      <path d="M382 92a17 17 0 0 1 33-5 14 14 0 0 1 25 8 12 12 0 0 1-2 24h-52a13.500 13.500 0 0 1-4-27z" fill="#fff" stroke={INK} strokeWidth="2.400" strokeLinejoin="round" />
    </g>
    {[86, 66, 50, 34].map((hgt, i) => (
      <rect key={i} className="grow" style={o(i + 2)} x={358 + i * 30} y={224 - hgt} width="21" height={hgt} rx="4" fill={i === 3 ? "var(--pb)" : INK} opacity={i === 3 ? 1 : 0.2} />
    ))}
    <path className="draw" pathLength="1" d="M362 128l94 52m0 0l-13-1m13 1l-5-12" fill="none" stroke="var(--ph)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Pill x={356} y={246} w={112} n={7}>
      −40% AWS bill
    </Pill>
  </>,
  <>
    <path className="rise" d="M344 318a76 76 0 0 1 152 0z" fill="var(--ps)" />
    {[
      [70, 80, 26],
      [150, 54, 18],
    ].map(([x, y, w], i) => (
      <path key={i} className="drift" style={o(i)} d={`M${x} ${y}a${w / 2} ${w / 2} 0 0 1 ${w} 0a${w / 3} ${w / 3} 0 0 1 ${w / 1.5} 0z`} fill="#fff" opacity=".8" />
    ))}
    {Array.from({ length: 10 }, (_, i) => (
      <circle key={i} className="blink" style={o(i)} cx={42 + i * 48} cy="327" r="3.4" fill="var(--ph)" />
    ))}
    <path className="trail" pathLength="1" d="M320 62C350 20 430 12 508 52" fill="none" stroke={INK} strokeWidth="2" strokeDasharray=".02 .03" opacity=".5" />
    <path className="plane" d="M-4 -11L24 0L-4 11L4 0z" fill="var(--pb)" />
    <g className="pop" style={o(2)}>
      <line x1="118" y1="318" x2="118" y2="236" stroke={INK} strokeWidth="3.4" />
      <rect x="60" y="202" width="124" height="42" rx="8" fill={INK} opacity=".13" transform="translate(4 5)" />
      <rect x="56" y="198" width="124" height="42" rx="8" fill="#23252e" />
      <path d="M72 212h14l-7 14z" fill="var(--pb)" />
      <path d="M89 212a7 7 0 0 1 0 14z" fill="#fff" />
      <text x="104" y="224" fill="#fff" fontSize="11.5" fontWeight="600">
        Frugal Founder
      </text>
    </g>
  </>,
];

const FRONT: ReactNode[] = [
  <>
    <rect x="152" y="256" width="216" height="62" fill="#2a2d3a" />
    <rect x="152" y="256" width="216" height="10" fill={INK} opacity=".35" />
    <rect x="286" y="276" width="62" height="26" rx="4" fill="none" stroke="#454a5c" strokeWidth="2" />
    <circle cx="317" cy="289" r="3" fill="#6a7088" />
    <rect x="138" y="246" width="244" height="11" rx="4" fill="#e0a56b" />
    <rect x="138" y="253" width="244" height="4" rx="2" fill="#c98a52" />
    <g className="pop" style={o(1)}>
      <path d="M166 246l9-42h46l-9 42z" fill="#23252e" />
      <circle className="beat" cx="194" cy="225" r="4.500" fill="var(--ps)" />
      <rect x="160" y="243" width="62" height="4" rx="2" fill="#3a3f52" />
    </g>
    <path d="M236 246l6-8h18v8zM284 246l-6-8h-18v8z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path className="flip" d="M260 238h18l6 8h-24z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <rect className="pop" style={o(2)} x="304" y="234" width="44" height="12" rx="3" fill="var(--ph)" />
    <rect className="pop" style={o(3)} x="308" y="222" width="38" height="12" rx="3" fill="var(--ps)" />
    <rect className="pop" style={o(4)} x="304" y="210" width="44" height="12" rx="3" fill="var(--pb)" />
    <g className="pop" style={o(5)}>
      <path className="glow" d="M352 190l-30 56h66z" fill="var(--ps)" opacity=".4" />
      <path d="M368 246q14-34-10-56" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M338 182l30 5-5 15-29-5z" fill="var(--ps)" stroke={INK} strokeWidth="2.200" strokeLinejoin="round" />
      <rect x="358" y="241" width="22" height="6" rx="3" fill={INK} />
    </g>
    <g className="cap">
      <path d="M260 76l38 14-38 14-38-14z" fill={INK} />
      <path d="M242 98v9q18 9 36 0v-9" fill={INK} />
      <path d="M298 90v20" stroke="var(--ps)" strokeWidth="2.600" strokeLinecap="round" />
      <circle cx="298" cy="112" r="3" fill="var(--ps)" />
    </g>
  </>,
  <>
    <g className="pop" style={o(0)}>
      <rect x="158" y="44" width="34" height="56" rx="8" fill="#23252e" />
      <rect x="162" y="50" width="26" height="44" rx="4" fill="#fff" />
      <rect className="bar" style={o(2)} x="165" y="55" width="20" height="6" rx="3" fill="var(--pb)" />
      <rect className="bar" style={o(3)} x="165" y="66" width="14" height="6" rx="3" fill="var(--ph)" />
      <rect className="bar" style={o(4)} x="165" y="77" width="18" height="6" rx="3" fill={INK} opacity=".3" />
    </g>
    {[0, 1, 2].map((i) => (
      <circle key={i} className="ring" style={o(i)} cx="175" cy="40" r="10" fill="none" stroke="var(--pb)" strokeWidth="2" />
    ))}
  </>,
  <>
    {[60, 100, 140, 180].map((x, i) => (
      <g key={x} className="bob" style={o(i)}>
        <path d={`M${x - 24} 334a24 24 0 0 1 48 0z`} fill={["var(--ps)", "var(--ph)", "#23252e", "#7c8fff"][i]} />
        <rect x={x - 5} y="304" width="10" height="10" fill={["#c98a61", "#a8693f", "#dba77f", "#b87c53"][i]} />
        <circle cx={x} cy="294" r="14" fill={["#e2a67c", "#b9794f", "#efc49f", "#c98d63"][i]} />
        <path d={i % 2 ? `M${x - 14} 296c-2-20 30-22 28 0-6-8-20-10-28 0z` : `M${x - 14} 294c0-22 28-22 28 0-8-10-18-4-28 0z`} fill={INK} />
        {i === 1 && <line className="wave" x1={x + 18} y1="316" x2={x + 24} y2="282" stroke="#b9794f" strokeWidth="7" strokeLinecap="round" />}
      </g>
    ))}
    <Pill x={52} y={238} w={92} n={5}>
      25 students
    </Pill>
  </>,
  <>
    <rect x="218" y="170" width="84" height="56" rx="7" fill="#23252e" />
    <rect x="218" y="170" width="84" height="56" rx="7" fill="none" stroke="#3a3f52" strokeWidth="2" />
    <circle className="beat" cx="260" cy="198" r="7" fill="var(--ps)" />
    <rect x="210" y="224" width="100" height="6" rx="3" fill="#3a3f52" />
  </>,
  null,
  null,
];

function Arm({ side }: { side: "l" | "r" }) {
  const x = side === "l" ? 233 : 287;
  const cloth = side === "l" ? "var(--pb)" : "#1230d8";
  return (
    <g className={`arm arm-${side}`}>
      <line x1={x} y1="142" x2={x} y2="180" stroke={cloth} strokeWidth="17" strokeLinecap="round" />
      <g className={`fore fore-${side}`}>
        <line x1={x} y1="180" x2={x} y2="210" stroke={cloth} strokeWidth="15" strokeLinecap="round" />
        <rect x={x - 8.5} y="207" width="17" height="8" rx="2.500" fill="#0d24a8" />
        <ellipse cx={x} cy="223" rx="8" ry="9" fill={side === "l" ? SKIN : SKIN_D} />
      </g>
    </g>
  );
}

function Boy() {
  return (
    <g className="boy">
      <ellipse cx="260" cy="320" rx="54" ry="6" fill={INK} opacity=".14" />
      <path d="M258 208h25l5 99h-19z" fill="#1d2030" />
      <path d="M237 208h26l-7 99h-19z" fill="#272b3b" />
      <path d="M266 304h21q12 3 12 10v2a2 2 0 0 1-2 2h-31z" fill="var(--ph)" />
      <path d="M257 304h-21q-12 3-12 10v2a2 2 0 0 0 2 2h31z" fill="var(--ph)" />
      <rect x="266" y="314" width="33" height="4" rx="2" fill="#fff" />
      <rect x="224" y="314" width="33" height="4" rx="2" fill="#fff" />
      <g className="upper">
        <Arm side="r" />
        <path d="M238 128q22-17 44 0-6 12-22 12t-22-12z" fill="#0d24a8" />
        <path d="M236 130q24-8 48 0 11 4 13 17l-5 68q-32 8-64 0l-5-68q2-13 13-17z" fill="var(--pb)" />
        <path d="M270 127q8 1 14 3 11 4 13 17l-5 68q-11 3-22 4z" fill="#1230d8" />
        <path d="M228 207q32 8 64 0l-1 9q-31 8-62 0z" fill="#0d24a8" />
        <path d="M244 184h32l6 22h-44z" fill="#1230d8" opacity=".9" />
        <path d="M253 134v24M267 134v24" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".85" />
        <Arm side="l" />
        <rect x="253" y="110" width="14" height="24" rx="5" fill={SKIN_D} />
        <g className="head">
          <circle cx="239.500" cy="96" r="4.800" fill={SKIN_D} />
          <circle cx="280.500" cy="96" r="4.800" fill={SKIN} />
          <ellipse cx="260" cy="92" rx="21" ry="23" fill={SKIN} />
          <path d="M238 93C236 68 250 60 262 60c14 0 24 10 20 33-3-8-7-13-11-17-9 7-21 9-29 8-2 2-3 5-4 9z" fill={INK} />
          <path d="M245 87q5-3 9 0M266 87q4-3 9 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <g className="eyes" fill={INK}>
            <circle cx="250" cy="94" r="2.400" />
            <circle cx="270.500" cy="94" r="2.400" />
          </g>
          <path d="M260 96q3 5-1 7" fill="none" stroke={SKIN_D} strokeWidth="1.800" strokeLinecap="round" />
          <circle cx="246" cy="102" r="4" fill="#e9805f" opacity=".35" />
          <circle cx="275" cy="102" r="4" fill="#e9805f" opacity=".35" />
          <path d="M252 105q8 6 16 0" fill="none" stroke={INK} strokeWidth="2.100" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** The career path as a small animated film: one character, a new scene for each stretch of years. */
export default function Path({ roles }: { roles: Role[] }) {
  const [at, setAt] = useState(0);
  const scene = SCENE[at] ?? 0;
  const [year, hook, alt] = HOOK[scene];

  const lean = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <div className="path">
      <div className="path-stage" data-in style={{ background: TINT[scene] }} onPointerMove={lean}>
        <p className="path-hook" key={scene}>
          <span>{year}</span>
          <b>{hook}</b>
        </p>
        <svg viewBox="0 0 520 340" className={`s${scene}`} role="img" aria-label={alt}>
          <circle className="path-halo" cx="260" cy="190" r="150" fill="#fff" opacity=".42" />
          <line x1="20" y1="319" x2="500" y2="319" stroke={INK} strokeWidth="2.200" strokeLinecap="round" />
          <g className="lay-back" key={`b${scene}`}>
            {BACK[scene]}
          </g>
          <Boy />
          <g className="lay-front" key={`f${scene}`}>
            {FRONT[scene]}
          </g>
        </svg>
        <i className="path-wipe" key={`w${scene}`} />
      </div>

      <ol className="path-list">
        {roles.map((r, i) => (
          <li key={r.title + r.when} className={i === at ? "on" : ""}>
            <button type="button" onClick={() => setAt(i)} aria-expanded={i === at}>
              <span className="role-when">{r.when}</span>
              <span className="h t-3">{r.title}</span>
            </button>
            <div className="path-more">
              <div>
                <p className="role-org">{r.org}</p>
                {r.body && <p className="copy">{r.body}</p>}
              </div>
            </div>
            {i === at && <i className="path-bar" onAnimationEnd={() => setAt((i + 1) % roles.length)} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
