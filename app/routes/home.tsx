import { useEffect, useRef, type CSSProperties } from "react";
import type { Route } from "./+types/home";
import AiLab from "../components/AiLab";
import Arr from "../components/Arrow";
import Logo from "../components/Logo";
import Path from "../components/Path";
import Scene from "../components/Scene";
import Shapes from "../components/Shapes";
import StackBox from "../components/StackBox";
import Video from "../components/Video";
import FlexFit from "../components/play/FlexFit";
import PromptReel from "../components/play/PromptReel";
import SortSprint from "../components/play/SortSprint";
import TraceGame from "../components/play/TraceGame";
import { startFx } from "../components/fx";
import { runway } from "../components/scenes";
import { profile } from "../data/profile";
import { bench, cases, figures, kit, products, roles, studio, type Product } from "../data/site";

const SITE = "https://www.thevarundev.com";
const title = "Varun Dev Sharma | Full-Stack and Flutter Engineer, Founder of Frugal Founder";
const description =
  "Varun Dev Sharma is a full-stack and Flutter engineer in New Delhi. Maker of UnStill, Trace and Flutter Wizard, and founder of the studio Frugal Founder.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "Varun Dev Sharma",
      description,
      inLanguage: "en",
      publisher: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE}/#profile`,
      url: `${SITE}/`,
      name: title,
      isPartOf: { "@id": `${SITE}/#website` },
      mainEntity: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: profile.fullName,
      alternateName: ["Varun Dev", "thedevvarun"],
      url: `${SITE}/`,
      image: `${SITE}/og.png`,
      jobTitle: "Founder and Full-Stack Engineer",
      description,
      email: `mailto:${profile.emailWork}`,
      telephone: profile.phoneE164,
      address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
      sameAs: [profile.linkedin, profile.github, studio.url],
      worksFor: { "@id": `${SITE}/#studio` },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Maharaja Agrasen Institute of Technology" },
      knowsAbout: ["Flutter", "React", "Next.js", "Node.js", "TypeScript", "AWS", "Video streaming and DRM", "Motion design", "Generative AI"],
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#studio`,
      name: studio.name,
      url: studio.url,
      founder: { "@id": `${SITE}/#person` },
      slogan: studio.tagline.join(" "),
    },
    ...products.map((p) => ({
      "@type": "SoftwareApplication",
      name: p.name,
      description: `${p.tag} ${p.body}`,
      applicationCategory: p.kind,
      operatingSystem: p.slug === "unstill" ? "Web" : "iOS, Android",
      author: { "@id": `${SITE}/#person` },
      ...(p.links[0] ? { url: p.links[0].href, sameAs: p.links.map((l) => l.href) } : {}),
    })),
  ],
};

export function meta({}: Route.MetaArgs) {
  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: profile.fullName },
    { name: "robots", content: "index, follow, max-image-preview:large, max-video-preview:-1" },
    { name: "theme-color", content: "#f4f4f1" },
    { tagName: "link", rel: "canonical", href: `${SITE}/` },
    { property: "og:type", content: "profile" },
    { property: "og:site_name", content: profile.fullName },
    { property: "og:title", content: "Varun Dev Sharma builds software that moves" },
    { property: "og:description", content: description },
    { property: "og:url", content: `${SITE}/` },
    { property: "og:image", content: `${SITE}/og.png` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Varun Dev Sharma: software that moves" },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Varun Dev Sharma builds software that moves" },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE}/og.png` },
    { "script:ld+json": jsonLd },
  ];
}

const ext = { target: "_blank", rel: "noopener noreferrer" };
const css = (vars: Record<string, string | number>) => vars as CSSProperties;

const STATEMENT =
  "I’m Varun. I build products end to end, from the first sketch to the release that lands in the store. Software I wrote runs on *500,000+ classroom devices* and reaches *over a million learners* . Today I make apps that teach, explain and play through motion, and I lead technology for founders through my studio, *Frugal Founder* .";

function Statement() {
  const words: { text: string; strong: boolean }[] = [];
  STATEMENT.split("*").forEach((part, k) =>
    part
      .trim()
      .split(" ")
      .forEach((text) => {
        // Punctuation that follows a highlighted phrase belongs to its last word.
        if (/^[.,]$/.test(text) && words.length) words[words.length - 1].text += text;
        else words.push({ text, strong: k % 2 === 1 });
      })
  );
  return (
    <p className="statement" data-p style={css({ "--count": words.length })}>
      {words.map((w, i) => (
        <span key={i} style={css({ "--i": i })}>
          {w.strong ? <b>{w.text}</b> : w.text}{" "}
        </span>
      ))}
    </p>
  );
}

// The logo's family of shapes, one per bench row. They turn as the row crosses the screen.
const BENCH_SHAPES = [
  <path key="tri" d="M2 4h26L15 27z" fill="var(--blue)" />,
  <path key="half" d="M9 2a13 13 0 0 1 0 26z" fill="currentColor" />,
  <circle key="ring" cx="15" cy="15" r="9.5" fill="none" stroke="var(--blue)" strokeWidth="7" />,
  <rect key="sq" x="4" y="4" width="22" height="22" fill="var(--hot)" />,
];

const TECH = [
  ["flutter", "Flutter"], ["typescript", "TypeScript"], ["react", "React"], ["nextjs", "Next.js"], ["nodejs", "Node.js"],
  ["aws", "AWS"], ["terraform", "Terraform"], ["postgresql", "PostgreSQL"], ["firebase", "Firebase"], ["threedotjs", "three.js"],
  ["claude", "Claude"], ["dart", "Dart"], ["python", "Python"], ["docker", "Docker"], ["kubernetes", "Kubernetes"],
  ["redis", "Redis"], ["mongodb", "MongoDB"], ["ffmpeg", "FFmpeg"], ["githubactions", "GitHub Actions"], ["astro", "Astro"],
  ["supabase", "Supabase"], ["sveltekit", "SvelteKit"],
];

const PLAY = { prompts: PromptReel, trace: TraceGame, flex: FlexFit, sort: SortSprint };

function Chapter({ p }: { p: Product }) {
  const Play = p.play ? PLAY[p.play] : null;
  const demo = p.demo;
  const phone = demo && (
    <figure className="phone">
      <div className={"shots" in demo ? "phone-screen slides" : "phone-screen"} style={{ aspectRatio: demo.ratio }}>
        {"shots" in demo ? (
          demo.shots.map((src, i) => (
            <img key={src} src={src} alt={`${p.name} app screen ${i + 1}`} loading="lazy" width="540" height="1169" style={css({ "--i": i })} />
          ))
        ) : (
          <Video src={demo.src} poster={demo.poster} label={`${p.name}: ${demo.label}`} />
        )}
      </div>
      <figcaption className="cap">{demo.label}</figcaption>
    </figure>
  );

  return (
    <article className="chapter" id={p.slug} style={css({ "--hue": p.hue })}>
      <div className="chapter-copy">
        <div className="chapter-id" data-in>
          <img src={p.icon} alt="" width="46" height="46" loading="lazy" />
          <span className="status" data-wip={p.wip || undefined}>
            {p.status} · {p.kind}
          </span>
        </div>
        <h3 className="h t-2" data-in>
          {p.name}
        </h3>
        <p className="tagline" data-in style={css({ "--d": 1 })}>
          {p.tag}
        </p>
        <p className="copy" data-in style={css({ "--d": 2 })}>
          {p.body}
        </p>
        <ul className="built" data-in style={css({ "--d": 3 })}>
          {p.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="stack">{p.stack}</p>
        {p.links.length > 0 && (
          <div className="cta-row">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} className="btn" {...ext}>
                {l.label} <Arr />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="chapter-media">
        {p.promo.src && (
          <figure className="vid" data-p style={{ aspectRatio: "16 / 9" }}>
            <Video src={p.promo.src} poster={p.promo.poster} label={`${p.name} ${p.promo.label}`} sound />
            <figcaption>{p.promo.label}</figcaption>
          </figure>
        )}
        {p.loop && (
          <figure className="wide" data-in>
            <Video src={p.loop.src} poster={p.loop.poster} label={`${p.name}: ${p.loop.label}`} />
            <figcaption className="cap">{p.loop.label}</figcaption>
          </figure>
        )}
        {(phone || Play) && (
          <div className="duo" data-in>
            {phone}
            {Play && <Play />}
          </div>
        )}
      </div>
    </article>
  );
}

function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme"
      aria-label="Switch between light and dark theme"
      onClick={() => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => startFx(root.current!), []);

  return (
    <div className="pf" ref={root}>
      <div className="loader" aria-hidden="true">
        <Logo className="loader-mark" size={90} />
        <span className="loader-word">Varun Dev Sharma · Portfolio</span>
        <span className="loader-count" />
      </div>

      <header className="nav">
        <div className="wrap nav-row">
          <a href="#top" className="brand" aria-label="Varun Dev, back to top">
            <Logo />
            Varun Dev
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#experience">Experience</a>
            <a href="#ai">AI</a>
            <a href="#contact">Contact</a>
            <ThemeToggle />
            <a href={profile.resume} className="btn" {...ext}>
              Résumé <Arr />
            </a>
          </nav>
        </div>
        <div className="progress" data-page />
      </header>

      <main id="top">
        <section className="hero">
          <Shapes />
          <div className="wrap hero-inner">
            <h1 className="blend">
              <span className="hero-name">Varun Dev Sharma · Full-stack engineer and founder · New Delhi</span>
              <span className="hero-type" data-vel>
                <span className="mask rise">
                  <span>Software</span>
                </span>
                <span className="mask rise" style={css({ "--n": 1 })}>
                  <span>that</span> <span className="em">moves.</span>
                </span>
              </span>
            </h1>
            <div className="hero-foot">
              <p className="hero-lead">
                Products designed, built and shipped by one engineer. Go on, throw the shapes around, then scroll.
              </p>
              <div className="cta-row">
                <a href="#work" className="btn btn-fill">
                  See the work
                </a>
                <a href="#contact" className="btn">
                  Work with me
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="statement-sec wrap">
          <div className="statement-grid">
            <p className="label">About</p>
            <Statement />
          </div>
        </section>

        <section id="work" className="wrap" aria-labelledby="work-h">
          <div className="sec-head">
            <p className="label" data-in>
              Products I design, build and ship
            </p>
            <h2 id="work-h" className="h t-1" data-in>
              Five products, one idea: <span className="em">show it moving.</span>
            </h2>
            <p className="copy" data-in style={css({ "--d": 1 })}>
              The films are the real ones. The games beside them are small versions I rebuilt for this page, so you can
              try each idea without installing anything.
            </p>
          </div>
          {products.map((p) => (
            <Chapter p={p} key={p.slug} />
          ))}
        </section>

        <section className="sec wrap" aria-labelledby="bench-h">
          <div className="sec-head">
            <p className="label" data-in>
              Also on the bench
            </p>
            <h2 id="bench-h" className="h t-1" data-in>
              Smaller builds, <span className="em">same care.</span>
            </h2>
          </div>
          <div className="bench">
            {bench.map((b, i) => (
              <article className="bench-row line-row" key={b.name} data-in data-p style={css({ "--d": i })}>
                <svg className="bench-shape" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                  {BENCH_SHAPES[i % BENCH_SHAPES.length]}
                </svg>
                <h3 className="h t-3">{b.name}</h3>
                <p className="label bare">{b.note}</p>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="studio" className="studio" aria-labelledby="studio-h">
          <div className="takeoff">
            <div className="takeoff-pin">
              <Scene draw={runway} className="studio-scene" label="A cockpit view of an aircraft taking off with runway to spare" />
              <div className="wrap takeoff-grid">
                <div className="studio-top">
                  <p className="label" data-in>
                    The studio · {studio.name}
                  </p>
                  <h2 id="studio-h" className="h t-1" data-in>
                    {studio.tagline[0]}
                    <br />
                    <span className="em" style={{ color: "var(--blue)" }}>
                      {studio.tagline[1]}
                    </span>
                  </h2>
                  <p className="copy" data-in style={css({ "--d": 1 })}>
                    {studio.body}
                  </p>
                  <div className="cta-row" data-in style={css({ "--d": 2 })}>
                    <a href={studio.url} className="btn btn-fill" {...ext}>
                      frugalfounder.in <Arr />
                    </a>
                    <a href={`mailto:${studio.email}`} className="btn">
                      {studio.email}
                    </a>
                  </div>
                </div>

                <div className="services">
                  {studio.services.map((s, i) => (
                    <article className="service" key={s.name} data-in style={css({ "--d": i })}>
                      <h3 className="h t-3">{s.name}</h3>
                      <p>{s.body}</p>
                      {"href" in s && s.href && (
                        <a href={s.href} className="link" style={{ justifySelf: "start", fontSize: "0.86rem" }} {...ext}>
                          See the reel <Arr />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sec wrap studio-grid">
            <div>
              <p className="label" style={{ marginBottom: 18 }}>
                Delivered for clients
              </p>
              <div className="clients">
                {studio.clients.map((c, i) => (
                  <article className="client line-row" key={c.name} data-in style={css({ "--d": i })}>
                    <img src={c.logo} alt={`${c.name} logo`} width="44" height="44" loading="lazy" />
                    <h3 className="h t-3">
                      {c.name}
                      <small>{c.kind}</small>
                    </h3>
                    <p>{c.body}</p>
                    {c.href ? (
                      <a href={c.href} className="link" style={{ fontSize: "0.86rem" }} {...ext}>
                        {new URL(c.href).hostname} <Arr />
                      </a>
                    ) : (
                      <span />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experience" aria-labelledby="exp-h">
          <div className="sec wrap" style={{ paddingBottom: 0 }}>
            <div className="sec-head">
              <p className="label" data-in>
                Experience · iDream Education
              </p>
              <h2 id="exp-h" className="h t-1" data-in>
                Classroom scale, <span className="em">offline first.</span>
              </h2>
              <p className="copy" data-in style={css({ "--d": 1 })}>
                Most of this software runs where the internet is slow or absent: government schools, shared tablets,
                smart TVs and a library that has to keep working across a local network.
              </p>
            </div>
            <div className="figures">
              {figures.map((f, i) => (
                <p className="figure" key={f.n} data-in style={css({ "--d": i })}>
                  <b>{f.n}</b>
                  <span>{f.label}</span>
                </p>
              ))}
            </div>
            <div className="cases">
              {cases.map((c, i) => (
                <a className="case" key={c.name} href={c.href} data-in style={css({ "--d": i })} {...ext}>
                  <div className="case-img">
                    <img src={c.img} alt={`${c.name} in use`} loading="lazy" width="800" height="500" />
                  </div>
                  <h3 className="h t-3">
                    {c.name} <Arr />
                  </h3>
                  <p>{c.body}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="sec wrap">
            <div className="sec-head">
              <p className="label" data-in>
                The path so far
              </p>
              <h2 className="h t-1" data-in>
                Eight years, <span className="em">one desk at a time.</span>
              </h2>
            </div>
            <Path roles={[...roles].reverse()} />
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          {[TECH.slice(0, 11), TECH.slice(11)].map((row, k) => (
            <div className="marquee-row" key={k}>
              {[...row, ...row].map(([logo, name], i) => (
                <span className="chip" key={i}>
                  <img src={`/skills/${logo}.svg`} alt="" width="44" height="44" loading="lazy" />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>

        <section className="sec wrap" aria-labelledby="kit-h">
          <div className="sec-head">
            <p className="label" data-in>
              How I build
            </p>
            <h2 id="kit-h" className="h t-1" data-in>
              Pick a job. <span className="em">See what goes in the box.</span>
            </h2>
            <p className="copy" data-in style={css({ "--d": 1 })}>
              Each choice drops in the tools I would reach for, then shows them passing work to each other. These are
              the stacks behind real projects on this page.
            </p>
          </div>
          <StackBox />
          <p className="sr-only">Toolkit: {kit.map(([k, v]) => `${k}: ${v}`).join(". ")}.</p>
        </section>

        <section id="ai" className="sec wrap" aria-labelledby="ai-h" style={{ paddingTop: 0 }}>
          <div className="sec-head">
            <p className="label" data-in>
              Exploring now · AI
            </p>
            <h2 id="ai-h" className="h t-1" data-in>
              Learning the models <span className="em">from the weights up.</span>
            </h2>
            <p className="copy" data-in style={css({ "--d": 1 })}>
              I use models every day. This is my study list for understanding them properly, in the order the pieces
              stack: the transformer at the core, the rest of the model round it, and the tools people build on top. Pick any node.
            </p>
          </div>
          <AiLab />
        </section>

        <section id="contact" className="contact sec" aria-labelledby="contact-h">
          <Shapes pile />
          <div className="wrap contact-inner">
            <p className="label">Contact</p>
            <h2 id="contact-h" className="h hero-type" data-vel style={{ whiteSpace: "normal" }}>
              Let’s build <span className="em" style={{ color: "var(--blue)" }}>yours.</span>
            </h2>
            <p className="copy" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", color: "var(--ink)" }}>
              Tell me what you are trying to ship and where it is stuck. I read every message myself.
            </p>
            <div className="contact-links">
              <a href={`mailto:${profile.emailWork}`}>
                <span className="label bare">Work email</span>
                <b>{profile.emailWork}</b>
              </a>
              <a href={`mailto:${profile.emailPersonal}`}>
                <span className="label bare">Personal email</span>
                <b>{profile.emailPersonal}</b>
              </a>
              <a href={`tel:${profile.phoneE164}`}>
                <span className="label bare">Call me directly</span>
                <b>{profile.phoneDisplay}</b>
              </a>
              <a href={profile.whatsapp} {...ext}>
                <span className="label bare">WhatsApp</span>
                <b>Message on WhatsApp</b>
              </a>
              <a href={profile.linkedin} {...ext}>
                <span className="label bare">LinkedIn</span>
                <b>{profile.linkedinLabel}</b>
              </a>
              <a href={profile.github} {...ext}>
                <span className="label bare">GitHub</span>
                <b>{profile.githubLabel}</b>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <span>© 2019–2026 Varun Dev Sharma · Made in India</span>
        <span>
          <a href={profile.linkedin} {...ext}>
            LinkedIn
          </a>
          {" · "}
          <a href={profile.github} {...ext}>
            GitHub
          </a>
          {" · "}
          <a href={`mailto:${profile.emailWork}`}>Email</a>
          {" · "}
          <a href={`tel:${profile.phoneE164}`}>{profile.phoneDisplay}</a>
          {" · "}
          <a href="/card">Visiting card</a>
        </span>
      </footer>
    </div>
  );
}
