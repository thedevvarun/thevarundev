import { useState, type CSSProperties, type ReactNode } from "react";
import Arrow from "./Arrow";

type Topic = { name: string; layer: "The model" | "Around the model"; words: string; mine: string; links: [string, string][]; glyph: ReactNode };

const o = (n: number) => ({ "--o": n }) as CSSProperties;
const dots = (xs: number[], y: number) => xs.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" fill="currentColor" />);

// Ordered from the weights up: each one sits on top of the one before it.
const TOPICS: Topic[] = [
  {
    name: "Transformer models",
    layer: "The model",
    words: "Tokens look at each other through attention, layer after layer. That is the whole machine, repeated.",
    mine: "Every model I call is one of these, so I am working through the maths to understand why it behaves the way it does.",
    links: [
      ["The Illustrated Transformer", "https://jalammar.github.io/illustrated-transformer/"],
      ["Attention Is All You Need", "https://arxiv.org/abs/1706.03762"],
      ["Karpathy: Zero to Hero", "https://karpathy.ai/zero-to-hero.html"],
    ],
    glyph: (
      <>
        {[12, 26, 40, 54].map((x, i) => (
          <line key={x} className="g-blink" style={o(i)} x1="26" y1="14" x2={x} y2="50" stroke="var(--blue)" strokeWidth="2" />
        ))}
        {dots([12, 26, 40, 54], 14)}
        {dots([12, 26, 40, 54], 50)}
      </>
    ),
  },
  {
    name: "Mixture of experts",
    layer: "The model",
    words: "Many small sub-networks and a router that wakes only a few of them for each token, so a model can be large without all of it running.",
    mine: "Reading, for now. It explains why some big open models are cheaper to run than their size suggests.",
    links: [["Mixture of Experts Explained", "https://huggingface.co/blog/moe"]],
    glyph: (
      <>
        <circle cx="12" cy="32" r="5" fill="currentColor" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} className="g-blink" style={o(i * 2)} x={i % 2 ? 46 : 32} y={10 + Math.floor(i / 2) * 17} width="10" height="10" rx="2" fill="var(--blue)" />
        ))}
        <path d="M17 32h10" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    name: "Training and fine-tuning",
    layer: "The model",
    words: "Showing a model examples until the loss comes down, or nudging a small adapter instead of the whole thing.",
    mine: "I integrated model training pipelines at iDream Education. Now I am learning what happens inside the loop.",
    links: [
      ["Hugging Face LLM course", "https://huggingface.co/learn/llm-course/chapter1/1"],
      ["PEFT: adapters and LoRA", "https://huggingface.co/docs/peft/index"],
    ],
    glyph: (
      <>
        <path d="M10 8v46h46" fill="none" stroke="currentColor" strokeWidth="2" />
        <path className="g-draw" pathLength="1" d="M14 14c8 26 16 32 40 34" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Quantization",
    layer: "The model",
    words: "Storing each weight in fewer bits so the model fits in less memory, then measuring what that cost in quality.",
    mine: "It decides which open models I can run on my own laptop, and on a phone.",
    links: [
      ["Quantization overview", "https://huggingface.co/docs/transformers/main/en/quantization/overview"],
      ["llama.cpp", "https://github.com/ggml-org/llama.cpp"],
    ],
    glyph: (
      <>
        <path d="M8 54C24 50 40 14 56 10" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" />
        <path className="g-draw" pathLength="1" d="M8 54h12V42h12V28h12V14h12" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: "On-device models",
    layer: "The model",
    words: "Models small enough to run on the phone itself. No server, no bill per request, and it still works with the internet off.",
    mine: "Exploring Gemma 3n E2B. It fits how I already build: offline-first apps for classrooms with no signal.",
    links: [
      ["Gemma 3n", "https://ai.google.dev/gemma/docs/gemma-3n"],
      ["Google AI Edge", "https://ai.google.dev/edge"],
    ],
    glyph: (
      <>
        <rect x="18" y="6" width="28" height="52" rx="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <rect className="g-pulse" x="25" y="24" width="14" height="14" rx="3" fill="var(--blue)" />
      </>
    ),
  },
  {
    name: "Hugging Face",
    layer: "Around the model",
    words: "The hub where open models, datasets and the libraries around them live.",
    mine: "My first stop when I need an open speech or music model, and where most of my reading starts.",
    links: [["Hugging Face Learn", "https://huggingface.co/learn"]],
    glyph: (
      <>
        <g className="g-spin">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={32 + 22 * Math.cos((a * Math.PI) / 180)} cy={32 + 22 * Math.sin((a * Math.PI) / 180)} r="4" fill="currentColor" />
          ))}
        </g>
        <circle cx="32" cy="32" r="9" fill="var(--blue)" />
      </>
    ),
  },
  {
    name: "Model harness",
    layer: "Around the model",
    words: "Everything wrapped around the model: the prompt, the tools it may call, the loop, and the checks on what comes back.",
    mine: "Unstill's pipeline is a harness. Brief in, strict schema, validator, repair, and only then a scene.",
    links: [
      ["Claude Agent SDK", "https://docs.claude.com/en/api/agent-sdk/overview"],
      ["Claude Code", "https://docs.claude.com/en/docs/claude-code/overview"],
    ],
    glyph: (
      <>
        <path d="M20 8h-10v48h10M44 8h10v48h-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
        <circle className="g-pulse" cx="32" cy="32" r="8" fill="var(--blue)" />
      </>
    ),
  },
  {
    name: "LangChain and LangGraph",
    layer: "Around the model",
    words: "Libraries for wiring model calls into chains, and into graphs with shared state once the flow has branches and loops.",
    mine: "I am comparing them with the plain loops I write by hand, to learn where a framework earns its place.",
    links: [
      ["LangChain docs", "https://docs.langchain.com/"],
      ["LangGraph", "https://langchain-ai.github.io/langgraph/"],
    ],
    glyph: (
      <>
        <path d="M14 16l36 0M14 16l18 30M50 16l-18 30" fill="none" stroke="currentColor" strokeWidth="2" />
        {[
          [14, 16],
          [50, 16],
          [32, 46],
        ].map(([x, y], i) => (
          <circle key={i} className="g-blink" style={o(i * 2)} cx={x} cy={y} r="7" fill="var(--blue)" />
        ))}
      </>
    ),
  },
  {
    name: "Agents",
    layer: "Around the model",
    words: "A model in a loop with tools. It decides, acts, reads the result and decides again until the job is done.",
    mine: "MotionBox's AI director and Flutter Wizard AI keep the model on a short lead: it chooses, tested code does the work.",
    links: [["Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents"]],
    glyph: (
      <g className="g-spin">
        <path d="M32 10a22 22 0 1 1-19 11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M6 14l8 8 3-11z" fill="var(--blue)" />
        <circle cx="32" cy="10" r="4.5" fill="var(--blue)" />
      </g>
    ),
  },
  {
    name: "Evals",
    layer: "Around the model",
    words: "Tests for work that has no single right answer. Without them, every prompt change is a guess.",
    mine: "Unstill lints every generated scene before anyone sees it. That linter was my first eval.",
    links: [
      ["Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"],
      ["Inspect", "https://inspect.aisi.org.uk/"],
    ],
    glyph: (
      <>
        {[14, 32, 50].map((y, i) => (
          <g key={y}>
            <path d={`M26 ${y}h30`} stroke="currentColor" strokeWidth="2" opacity=".35" />
            <path className="g-draw" style={o(i * 3)} pathLength="1" d={i === 2 ? `M8 ${y - 5}l10 10m0-10l-10 10` : `M8 ${y}l4 5 8-10`} fill="none" stroke={i === 2 ? "var(--hot)" : "var(--blue)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </>
    ),
  },
];

const SOURCES: [string, string, string][] = [
  ["Claude", "I build with it every day and make it explain whatever I did not follow.", "https://claude.ai"],
  ["My own apps", "Nothing teaches like shipping. Each product above forced me to learn one of these.", "#work"],
  ["fanout.sh", "Mapped roadmaps, labs and daily papers across AI research and systems.", "https://fanout.sh"],
  ["Hugging Face Learn", "Free courses that go from the first pipeline to fine-tuning.", "https://huggingface.co/learn"],
  ["Anthropic Engineering", "Field notes on agents, tools and evals from people who run them.", "https://www.anthropic.com/engineering"],
];

// The transformer sits at the core, the rest of the model on the inner ring, everything around it on the outer.
const POS = TOPICS.map((_, i) => {
  if (i === 0) return [50, 50];
  const inner = i <= 4;
  const deg = inner ? 30 + (i - 1) * 90 : -90 + (i - 5) * 72;
  const r = inner ? 22 : 45;
  return [50 + r * Math.cos((deg * Math.PI) / 180), 50 + r * Math.sin((deg * Math.PI) / 180)];
});
const ring = (r: number) => `M${50 - r} 50A${r} ${r} 0 1 1 ${50 + r} 50A${r} ${r} 0 1 1 ${50 - r} 50`;

/** What I am studying in AI, drawn as the thing itself: a model at the core and the layers people build round it. */
export default function AiLab() {
  const [at, setAt] = useState(0);
  const t = TOPICS[at];
  const go = (i: number) => setAt((i + TOPICS.length) % TOPICS.length);

  return (
    <div className="lab" data-in>
      <div className="lab-top">
        <div className="lab-orbit" role="tablist" aria-label="AI topics">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path id="lab-r1" className="lab-ring" d={ring(22)} />
            <path id="lab-r2" className="lab-ring" d={ring(45)} />
            <text>
              <textPath href="#lab-r1" startOffset="25%" textAnchor="middle">
                THE MODEL
              </textPath>
            </text>
            <text>
              <textPath href="#lab-r2" startOffset="35%" textAnchor="middle">
                AROUND THE MODEL
              </textPath>
            </text>
            {at > 0 && <line key={at} className="lab-beam" x1="50" y1="50" x2={POS[at][0]} y2={POS[at][1]} />}
          </svg>
          {TOPICS.map((x, i) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={i === at}
              className={i === 0 ? "lab-node core" : "lab-node"}
              style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%`, "--o": i } as CSSProperties}
              onClick={() => setAt(i)}
            >
              <svg viewBox="0 0 64 64" aria-hidden="true">
                {x.glyph}
              </svg>
              <b>{x.name}</b>
            </button>
          ))}
        </div>

        <div className="lab-detail" key={t.name}>
          <div className="lab-nav">
            <button type="button" onClick={() => go(at - 1)} aria-label="Previous topic">
              <Arrow dir="left" />
            </button>
            <span>
              {at + 1} / {TOPICS.length} · {t.layer}
            </span>
            <button type="button" onClick={() => go(at + 1)} aria-label="Next topic">
              <Arrow dir="right" />
            </button>
            <i className="lab-bar" onAnimationEnd={() => go(at + 1)} />
          </div>
          <h3 className="h t-1">{t.name}</h3>
          <p className="lab-quote">{t.words}</p>
          <div className="lab-side">
            <p className="label bare">Where it meets my work</p>
            <p className="copy">{t.mine}</p>
            <p className="label bare" style={{ marginTop: 10 }}>
              Learn it here
            </p>
            <ul>
              {t.links.map(([label, href]) => (
                <li key={href}>
                  <a className="link" href={href} target="_blank" rel="noopener noreferrer">
                    {label} <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="lab-sources">
        <p className="label">Where I learn</p>
        <div>
          {SOURCES.map(([name, why, href]) => (
            <a key={name} href={href} {...(href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              <b>
                {name} <Arrow dir={href.startsWith("#") ? "up" : "out"} />
              </b>
              <span>{why}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
