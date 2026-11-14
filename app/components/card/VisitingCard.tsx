import { useCallback, useEffect, useRef, useState } from "react";
import { company, product, profile } from "../../data/profile";
import Logo from "../Logo";
import Shapes from "../Shapes";
import { ArrowUpRight, CheckIcon, CopyIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { SaveContactButton, ShareButton } from "./SaveContact";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

type RowData = { label: string; value: string; href: string; copy?: string; external?: boolean };

const rows: RowData[] = [
  { label: "Phone", value: profile.phoneDisplay, href: `tel:${profile.phoneE164}`, copy: profile.phoneE164 },
  { label: "Work email", value: profile.emailWork, href: `mailto:${profile.emailWork}` },
  { label: "Personal email", value: profile.emailPersonal, href: `mailto:${profile.emailPersonal}` },
  { label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, copy: profile.linkedin, external: true },
  { label: "GitHub", value: profile.githubLabel, href: profile.github, copy: profile.github, external: true },
  { label: "Website", value: profile.websiteLabel, href: profile.website, copy: profile.website, external: true },
];

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

function ThemeToggle() {
  return (
    <button
      type="button"
      className="cd-theme"
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

function Row({ label, value, href, copy = value, external, onNotify }: RowData & { onNotify: (m: string) => void }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      onNotify(`${label} copied`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onNotify("Clipboard blocked — long-press to copy instead.");
    }
  };

  return (
    <li className="cd-row line-row">
      <a href={href} className="cd-row-link" {...(external ? ext : {})}>
        <span className="label bare">{label}</span>
        <b>{value}</b>
      </a>
      <button type="button" className="cd-copy" onClick={doCopy} aria-label={`Copy ${label.toLowerCase()}`}>
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      </button>
    </li>
  );
}

export default function VisitingCard() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hero = useRef<HTMLElement>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Writes --tx / --ty (-1..1) for the CSS tilt: the mouse on desktop, the phone's own tilt where
  // the browser reports it without a permission prompt (Android; iOS stays flat).
  useEffect(() => {
    const el = hero.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const set = (x: number, y: number) => {
      el.style.setProperty("--tx", clamp(x).toFixed(3));
      el.style.setProperty("--ty", clamp(y).toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const rest = () => set(0, 0);

    let beta: number | null = null;
    let gamma = 0;
    const tip = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (beta == null) {
        beta = e.beta;
        gamma = e.gamma;
      }
      // The resting pose drifts toward the current one, so the card settles flat however the phone is held.
      beta += (e.beta - beta) * 0.02;
      gamma += (e.gamma - gamma) * 0.02;
      set((e.gamma - gamma) / 16, (e.beta - beta) / 16);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", rest);
    addEventListener("deviceorientation", tip);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", rest);
      removeEventListener("deviceorientation", tip);
    };
  }, []);

  return (
    <div className="cd">
      <header className="cd-col cd-top">
        <a href="/" className="label bare cd-home">
          {profile.websiteLabel}
        </a>
        <ThemeToggle />
      </header>

      <main>
        <section className="cd-hero" ref={hero} aria-label="Contact card">
          <Shapes />
          <div className="cd-col cd-hero-in">
            <div className="cd-tilt">
              <div className="cd-card">
                <div className="cd-card-top">
                  <Logo size={30} className="logo cd-mark" />
                  <a href={company.url} className="label bare cd-co" {...ext}>
                    {company.name}
                    <ArrowUpRight size={12} />
                  </a>
                </div>

                <h1 className="h cd-name">
                  <span className="cd-mask">
                    <span>{profile.firstName}</span>
                  </span>{" "}
                  <span className="cd-mask">
                    <span className="em" style={{ "--n": 1 } as React.CSSProperties}>
                      {profile.lastName}
                    </span>
                  </span>
                </h1>

                <div className="cd-card-foot">
                  <p className="cd-role">{profile.title}</p>
                  <p className="cd-meta">
                    <span>{profile.location}</span>
                    <span className="cd-now">Building {product.name}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="cd-cta">
              <SaveContactButton onNotify={notify} />
              <ShareButton onNotify={notify} />
            </div>

            <nav className="cd-acts" aria-label="Quick contact">
              <a href={`tel:${profile.phoneE164}`} className="cd-act">
                <PhoneIcon size={20} />
                Call
              </a>
              <a href={profile.whatsapp} className="cd-act" {...ext}>
                <WhatsAppIcon size={20} />
                WhatsApp
              </a>
              <a href={`mailto:${profile.emailWork}`} className="cd-act">
                <MailIcon size={20} />
                Email
              </a>
            </nav>
          </div>
        </section>

        <div className="cd-col cd-body">
          <p className="cd-lead">{profile.tagline}</p>

          <section className="cd-sec">
            <h2 className="label">Reach me</h2>
            <ul className="cd-rows">
              {rows.map((r) => (
                <Row key={r.label} {...r} onNotify={notify} />
              ))}
            </ul>
          </section>

          <div className="cd-rest">
            <section className="cd-feat line-row">
              <p className="label">Company</p>
              <h2 className="h">
                <a href={company.url} {...ext}>
                  {company.name}
                  <ArrowUpRight size={22} />
                </a>
              </h2>
              <p className="cd-tagline">{company.tagline}</p>
              <p className="cd-desc">{company.description}</p>
              <ul className="cd-tags">
                {company.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="cd-domain">{company.domain}</p>
            </section>

            <section className="cd-feat line-row">
              <p className="label">Building</p>
              <h2 className="h">
                <a href={product.url} {...ext}>
                  {product.name}
                  <ArrowUpRight size={22} />
                </a>
              </h2>
              <p className="cd-tagline">{product.tagline}</p>
              <p className="cd-desc">{product.description}</p>
              <p className="cd-domain">{product.domainLabel}</p>
            </section>

            <div className="cd-links">
              <a href="/" className="btn">
                Full portfolio
              </a>
              <a href={profile.resume} className="btn" {...ext}>
                Résumé <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="cd-bar">
              <p>
                <b>{profile.fullName}</b>
                <span>{company.name}</span>
              </p>
              <SaveContactButton onNotify={notify} compact />
            </div>
          </div>
        </div>
      </main>

      <footer className="cd-col cd-note">
        © {new Date().getFullYear()} {profile.fullName} · {company.name} · Made in India
      </footer>

      <div className="cd-toast" role="status" aria-live="polite" data-on={toast ? "" : undefined}>
        {toast}
      </div>
    </div>
  );
}
