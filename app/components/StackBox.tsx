import { useState, type CSSProperties, type ReactNode } from "react";
import Video from "./Video";

type Part = [logo: string, name: string];
// `parts` is a chain: step i is the hand-off from parts[i] to parts[i + 1], so every tool is connected.
type Build = { id: string; tab: string; proof: string; parts: Part[]; steps: string[]; out: ReactNode };

const BUILDS: Build[] = [
  {
    id: "app",
    tab: "A mobile app",
    proof: "Trace, running. Flutter Wizard is built the same way.",
    parts: [
      ["python", "Python"],
      ["firebase", "Firebase"],
      ["dart", "Dart"],
      ["flutter", "Flutter"],
      ["nodejs", "Node.js"],
    ],
    steps: [
      "Python tools turn raw content into levels and lessons, then upload them.",
      "Dart code pulls that content and holds the game logic.",
      "Flutter draws it on iOS and Android from the one codebase.",
      "A Node.js function checks every purchase with the store before unlocking it.",
    ],
    out: (
      <div className="sbx-phone">
        <Video src="/media/trace-demo.mp4" poster="/media/trace-demo.webp" label="Trace running on a phone" />
      </div>
    ),
  },
  {
    id: "site",
    tab: "A website",
    proof: "frugalfounder.in, live.",
    parts: [
      ["typescript", "TypeScript"],
      ["astro", "Astro"],
      ["githubactions", "GitHub Actions"],
      ["terraform", "Terraform"],
      ["aws", "AWS"],
    ],
    steps: [
      "Pages are written in TypeScript and built ahead of time by Astro, so there is no server to keep warm.",
      "A push to GitHub runs the build and the checks.",
      "The same run applies Terraform, so the hosting can be rebuilt from a file.",
      "AWS serves the pages from the edge and runs the small functions behind forms.",
    ],
    out: (
      <div className="sbx-browser">
        <p>
          <i />
          <i />
          <i />
          <span>frugalfounder.in</span>
        </p>
        <img src="/media/ff-site.webp" alt="The Frugal Founder website" width="960" height="504" loading="lazy" />
      </div>
    ),
  },
  {
    id: "feature",
    tab: "A feature",
    proof: "Protected video, as I built it at iDream Education.",
    parts: [
      ["ffmpeg", "FFmpeg"],
      ["aws", "AWS"],
      ["nodejs", "Node.js"],
      ["redis", "Redis"],
      ["react", "React"],
    ],
    steps: [
      "FFmpeg compresses each upload and cuts it into short encrypted segments, stored on AWS.",
      "Node.js decides who may watch and signs the links.",
      "Redis remembers sessions, so every key check stays fast.",
      "The React player gets its key and picks a quality that suits the connection.",
    ],
    out: (
      <div className="sbx-player">
        <span className="sbx-chip">Encrypted</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5l12 7-12 7z" fill="currentColor" />
        </svg>
        <span className="sbx-quality">
          <b>1080p</b>
          <b>720p</b>
          <b>480p</b>
        </span>
        <i />
      </div>
    ),
  },
  {
    id: "agent",
    tab: "An AI agent",
    proof: "A real frame from UnStill, which runs this pipeline.",
    parts: [
      ["nodejs", "Node.js"],
      ["claude", "Claude"],
      ["typescript", "TypeScript"],
      ["postgresql", "PostgreSQL"],
      ["threedotjs", "three.js"],
    ],
    steps: [
      "Node.js sends the brief to Claude with a strict schema for the answer.",
      "A TypeScript validator lints the reply and sends problems back for repair.",
      "PostgreSQL stores the approved scene, its history and the credits it used.",
      "three.js plays the stored scene live in the browser.",
    ],
    out: (
      <div className="sbx-agent">
        <p>
          <span>Prompt</span> How does mitosis work?
        </p>
        <img src="/media/unstill-mitosis.webp" alt="A frame from the explainer UnStill generated for that prompt" width="800" height="450" loading="lazy" />
        <div>
          <span className="sbx-chip">Schema checked</span>
          <span className="sbx-chip">Linted</span>
        </div>
      </div>
    ),
  },
  {
    id: "auto",
    tab: "An automation",
    proof: "My daily AWS cost report. The bars here are an example, not real figures.",
    parts: [
      ["githubactions", "GitHub Actions"],
      ["terraform", "Terraform"],
      ["aws", "AWS"],
      ["python", "Python"],
      ["googlesheets", "Google Sheets"],
    ],
    steps: [
      "GitHub Actions runs Terraform, so nothing is set up by hand.",
      "Terraform creates the schedule and the function on AWS.",
      "Each morning the schedule wakes a small Python function.",
      "It reads yesterday's spend by service and writes it to a sheet.",
    ],
    out: (
      <div className="sbx-sheet">
        <p>Daily cost report</p>
        {["EC2", "S3", "CloudFront", "RDS", "Lambda"].map((name, i) => (
          <div key={name} style={{ "--w": [0.82, 0.34, 0.5, 0.64, 0.18][i], "--o": i } as CSSProperties}>
            <span>{name}</span>
            <i />
          </div>
        ))}
        <span className="sbx-chip">Under budget</span>
      </div>
    ),
  },
];

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Pick a kind of job: its tools drop into the box, the box hands back a finished thing, and the steps show how. */
export default function StackBox() {
  const [pick, setPick] = useState(0);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const b = BUILDS[pick];
  const n = b.parts.length;
  const choose = (i: number) => {
    setPick(i);
    setStep(0);
    setRun(run + 1);
  };

  return (
    <div className="sbx" data-in>
      <div className="sbx-tabs" role="tablist" aria-label="What to build">
        {BUILDS.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === pick} onClick={() => choose(i)}>
            {x.tab}
          </button>
        ))}
      </div>

      <div className="sbx-stage" key={run} style={css({ "--n": n })}>
        <div className="sbx-col">
          <p className="label bare">Goes in</p>
          <div className="sbx-crate" aria-hidden="true">
            {b.parts.map(([logo], i) => (
              <img key={logo} className="sbx-drop" src={`/skills/${logo}.svg`} alt="" style={css({ "--o": i, "--x": `${(i - (n - 1) / 2) * 30}px`, "--r": `${(i % 2 ? 1 : -1) * (14 + i * 9)}deg` })} />
            ))}
            <div className="sbx-box">
              <b>{b.tab.replace(/^An? /, "")}</b>
              <span>{n} parts</span>
            </div>
          </div>
          <button type="button" className="link sbx-again" onClick={() => choose(pick)}>
            Build it again
          </button>
        </div>

        <div className="sbx-col">
          <p className="label bare">How the parts hand off</p>
          <ol className="sbx-steps">
            {b.steps.map((text, i) => (
              <li key={i} className={i === step ? "on" : ""} style={css({ "--o": i })}>
                <button type="button" onClick={() => setStep(i)} onMouseEnter={() => setStep(i)} aria-current={i === step ? "step" : undefined}>
                  <span className="sbx-hop">
                    <img src={`/skills/${b.parts[i][0]}.svg`} alt={b.parts[i][1]} width="22" height="22" />
                    <i />
                    <img src={`/skills/${b.parts[i + 1][0]}.svg`} alt={b.parts[i + 1][1]} width="22" height="22" />
                  </span>
                  <span>{text}</span>
                </button>
                {i === step && <i className="sbx-bar" onAnimationEnd={() => setStep((i + 1) % b.steps.length)} />}
              </li>
            ))}
          </ol>
        </div>

        <div className="sbx-col">
          <p className="label bare">Comes out</p>
          <div className="sbx-out">{b.out}</div>
          <p className="sbx-proof">{b.proof}</p>
        </div>
      </div>
    </div>
  );
}
