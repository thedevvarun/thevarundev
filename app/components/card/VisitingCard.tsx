import { useCallback, useEffect, useRef, useState } from "react";
import { company, product, profile } from "../../data/profile";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { SaveContactButton, ShareButton } from "./SaveContact";
import {
  ArrowUpRight,
  CheckIcon,
  CopyIcon,
  DocIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./Icons";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Every reveal here works by hiding an element and then animating it back in,
 * which means a stalled animation engine leaves a *blank business card* — the
 * one failure this page cannot afford. anime.js drives itself off rAF, and rAF
 * does not tick in a background tab, so a card opened in a background tab (or
 * one where the anime chunk fails to load) would hide its content and never
 * bring it back.
 *
 * Two guards, both here rather than in the shared hook so the portfolio's own
 * animations are untouched:
 *   - don't hide anything while the document is hidden — no viewer, no reason;
 *   - after animating, arm a timer that strips the inline styles if the
 *     animation never finished.
 */
const canAnimate = () =>
  typeof document !== "undefined" && !document.hidden && !prefersReducedMotion();

/** Drop the inline opacity/transform anime.js wrote, revealing whatever stalled. */
function clearInline(nodes: ArrayLike<Element>) {
  Array.from(nodes).forEach((n) => {
    const s = (n as HTMLElement).style;
    s.opacity = "";
    s.transform = "";
  });
}

/**
 * Builds the "lift `.vc-reveal` children into place" callback the four blocks
 * below the fold all share. `chips` adds the pop-in pass for the service tags.
 */
function revealBlock(shift: number, chips = false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (anime: any, el: Element) => {
    if (!canAnimate()) return;

    const items = el.querySelectorAll(".vc-reveal");
    const tags = chips ? el.querySelectorAll(".vc-chip") : null;

    anime.set(items, { opacity: 0, translateY: shift });
    if (tags?.length) anime.set(tags, { opacity: 0, scale: 0.86 });

    const guard = setTimeout(() => {
      clearInline(items);
      if (tags) clearInline(tags);
    }, 4000);

    const tl = anime.timeline({
      easing: "easeOutExpo",
      complete: () => clearTimeout(guard),
    });

    tl.add({
      targets: items,
      opacity: [0, 1],
      translateY: [shift, 0],
      duration: 950,
      delay: anime.stagger(75),
    });

    if (tags?.length) {
      tl.add({
        targets: tags,
        opacity: [0, 1],
        scale: [0.86, 1],
        duration: 650,
        delay: anime.stagger(60),
        easing: "easeOutBack",
      }, "-=550");
    }
  };
}

/* ------------------------------------------------------------------ *
 * Background
 * ------------------------------------------------------------------ */

/** Two slow aurora blobs + grain. Hue and drift are driven by scroll depth. */
function Aurora() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        root.style.setProperty("--vc-scroll", p.toFixed(4));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.style.removeProperty("--vc-scroll");
    };
  }, []);

  return (
    <div className="vc-aurora" aria-hidden>
      <span className="vc-blob vc-blob-1" />
      <span className="vc-blob vc-blob-2" />
      <span className="vc-blob vc-blob-3" />
      <span className="vc-grain" />
    </div>
  );
}

/** Hairline progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  return (
    <div className="vc-progress" aria-hidden>
      <span className="vc-progress-fill" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bits
 * ------------------------------------------------------------------ */

function Monogram({ size = 66 }: { size?: number }) {
  return (
    <div className="vc-monogram" style={{ width: size, height: size }} aria-hidden>
      <span className="vc-monogram-ring" />
      <span className="vc-monogram-face">
        <svg viewBox="0 0 30 22" width={size * 0.46} height={size * 0.46 * (22 / 30)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="0,2 7,20 14,2" />
          <path d="M17,2 L17,20 Q28,20 28,11 Q28,2 17,2 Z" />
        </svg>
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="vc-eyebrow">
      <span className="vc-eyebrow-line" aria-hidden />
      {children}
    </div>
  );
}

/** Icon tile in the quick-actions row. */
function ActionTile({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="vc-tile group"
    >
      <span className="vc-tile-glow" aria-hidden />
      <span className="relative text-white/75 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      <span className="vc-tile-label">{label}</span>
    </a>
  );
}

/** A contact row: tap the row to act, tap the trailing button to copy. */
function DetailRow({
  href,
  icon,
  label,
  value,
  copy,
  external,
  onNotify,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  copy?: string;
  external?: boolean;
  onNotify: (m: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const doCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(copy ?? value);
        setCopied(true);
        onNotify(`${label} copied`);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        onNotify("Clipboard blocked — long-press to copy instead.");
      }
    },
    [copy, value, label, onNotify]
  );

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="vc-row group"
    >
      <span className="vc-row-icon">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="vc-row-label">{label}</span>
        <span className="vc-row-value">{value}</span>
      </span>
      <button
        type="button"
        onClick={doCopy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="vc-row-copy"
      >
        {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
      </button>
    </a>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className={`vc-toast ${message ? "vc-toast-on" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Card
 * ------------------------------------------------------------------ */

export default function VisitingCard() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaSentinel = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  /* Intro timeline — runs once, on mount (or on first focus if loaded hidden). */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let failsafe: ReturnType<typeof setTimeout> | null = null;

    const INTRO_TARGETS =
      ".vc-hero-card, .vc-monogram, .vc-name-char, .vc-hero-title, .vc-hero-meta, .vc-hero-tagline, .vc-hero-cta, .vc-tile";

    const run = () => import("animejs").then(({ default: anime }) => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        anime.set(".vc-hero-card", { opacity: 0, translateY: 28, scale: 0.965 });
        anime.set(".vc-monogram", { opacity: 0, scale: 0.5, rotate: -25 });
        anime.set(".vc-name-char", { opacity: 0, translateY: "110%", rotateZ: 6 });
        anime.set([".vc-hero-title", ".vc-hero-meta", ".vc-hero-tagline"], { opacity: 0, translateY: 14 });
        anime.set(".vc-hero-cta", { opacity: 0, translateY: 18, scale: 0.97 });
        anime.set(".vc-tile", { opacity: 0, translateY: 16, scale: 0.94 });

        // ~4.5s of timeline; give it a generous margin before force-revealing.
        failsafe = setTimeout(() => clearInline(document.querySelectorAll(INTRO_TARGETS)), 7000);

        const tl = anime.timeline({
          easing: "easeOutExpo",
          complete: () => { if (failsafe) clearTimeout(failsafe); },
        });

        tl.add({
          targets: ".vc-hero-card",
          opacity: [0, 1],
          translateY: [28, 0],
          scale: [0.965, 1],
          duration: 1100,
        })
          .add({
            targets: ".vc-monogram",
            opacity: [0, 1],
            scale: [0.5, 1],
            rotate: [-25, 0],
            duration: 1200,
            easing: "easeOutElastic(1, .7)",
          }, "-=800")
          .add({
            targets: ".vc-name-char",
            opacity: [0, 1],
            translateY: ["110%", "0%"],
            rotateZ: [6, 0],
            duration: 900,
            delay: anime.stagger(26),
          }, "-=1000")
          .add({
            targets: [".vc-hero-title", ".vc-hero-meta", ".vc-hero-tagline"],
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 800,
            delay: anime.stagger(90),
          }, "-=650")
          .add({
            targets: ".vc-hero-cta",
            opacity: [0, 1],
            translateY: [18, 0],
            scale: [0.97, 1],
            duration: 900,
            easing: "easeOutBack",
          }, "-=500")
          .add({
            targets: ".vc-tile",
            opacity: [0, 1],
            translateY: [16, 0],
            scale: [0.94, 1],
            duration: 700,
            delay: anime.stagger(55),
          }, "-=600");
      });
    });

    // Loaded into a background tab: leave the card fully visible and hold the
    // intro until someone is actually looking at it.
    let onVisible: (() => void) | null = null;
    if (document.hidden) {
      onVisible = () => {
        if (document.hidden || cancelled) return;
        document.removeEventListener("visibilitychange", onVisible!);
        onVisible = null;
        void run();
      };
      document.addEventListener("visibilitychange", onVisible);
    } else {
      void run();
    }

    return () => {
      cancelled = true;
      if (failsafe) clearTimeout(failsafe);
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  /* Hero tips back as it scrolls away + tilts toward the pointer on desktop. */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;

    const render = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // 0 while the card sits at rest, → 1 as it leaves through the top.
      const gone = Math.min(Math.max(-rect.top / (rect.height * 0.9), 0), 1);
      const rotX = gone * 9 + pointerY * -5;
      const rotY = pointerX * 6;
      el.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${(1 - gone * 0.06).toFixed(3)})`;
      el.style.opacity = `${(1 - gone * 0.55).toFixed(3)}`;
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

    const onPointer = (e: PointerEvent) => {
      if (window.matchMedia("(hover: none)").matches) return;
      const rect = el.getBoundingClientRect();
      pointerX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      pointerY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      schedule();
    };

    const onLeave = () => { pointerX = 0; pointerY = 0; schedule(); };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Sticky save bar shows once the hero's own CTA is off screen. */
  useEffect(() => {
    const el = ctaSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Scroll-revealed blocks below the fold. */
  const detailsRef = useScrollReveal(revealBlock(24));
  const companyRef = useScrollReveal(revealBlock(26, true));
  const productRef = useScrollReveal(revealBlock(26));
  const footerRef = useScrollReveal(revealBlock(20));

  return (
    <main className="vc-root">
      <Aurora />
      <ScrollProgress />

      <div className="relative z-10 mx-auto w-full max-w-[430px] px-4 pb-44 pt-10 sm:pt-16">
        {/* ---------------- Hero ---------------- */}
        <section className="vc-hero-card vc-glass" ref={heroRef}>
          <span className="vc-sheen" aria-hidden />

          <div className="flex items-start justify-between gap-4">
            <Monogram />
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="vc-brand-pill"
            >
              {company.name}
              <ArrowUpRight size={12} />
            </a>
          </div>

          <h1 className="vc-name" aria-label={profile.fullName}>
            {profile.fullName.split(" ").map((word, wi, arr) => (
              <span key={wi} className="vc-name-word">
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="vc-name-char">
                    {ch}
                  </span>
                ))}
                {wi < arr.length - 1 && <span className="vc-name-space">&nbsp;</span>}
              </span>
            ))}
          </h1>

          <p className="vc-hero-title">{profile.title}</p>

          <div className="vc-hero-meta">
            <span className="vc-meta-chip">
              <PinIcon size={13} />
              {profile.location}
            </span>
            <span className="vc-meta-chip">
              <span className="vc-dot" aria-hidden />
              Building {product.name}
            </span>
          </div>

          <p className="vc-hero-tagline">{profile.tagline}</p>

          <div className="vc-hero-cta mt-7 flex items-center gap-3">
            <SaveContactButton onNotify={notify} />
            <ShareButton onNotify={notify} />
          </div>
        </section>

        <div ref={ctaSentinel} aria-hidden />

        {/* ---------------- Quick actions ---------------- */}
        <nav className="mt-4 grid grid-cols-5 gap-2.5" aria-label="Quick contact">
          <ActionTile href={`tel:${profile.phoneE164}`} label="Call">
            <PhoneIcon size={19} />
          </ActionTile>
          <ActionTile href={profile.whatsapp} label="WhatsApp" external>
            <WhatsAppIcon size={19} />
          </ActionTile>
          <ActionTile href={`mailto:${profile.emailWork}`} label="Email">
            <MailIcon size={19} />
          </ActionTile>
          <ActionTile href={profile.linkedin} label="LinkedIn" external>
            <LinkedInIcon size={18} />
          </ActionTile>
          <ActionTile href={profile.github} label="GitHub" external>
            <GitHubIcon size={18} />
          </ActionTile>
        </nav>

        {/* ---------------- Details ---------------- */}
        <section className="mt-8" ref={detailsRef}>
          <div className="vc-reveal">
            <SectionLabel>Reach me</SectionLabel>
          </div>
          <div className="vc-reveal vc-glass vc-panel">
            <DetailRow
              href={`tel:${profile.phoneE164}`}
              icon={<PhoneIcon size={17} />}
              label="Phone"
              value={profile.phoneDisplay}
              copy={profile.phoneE164}
              onNotify={notify}
            />
            <DetailRow
              href={`mailto:${profile.emailWork}`}
              icon={<MailIcon size={17} />}
              label="Work email"
              value={profile.emailWork}
              onNotify={notify}
            />
            <DetailRow
              href={`mailto:${profile.emailPersonal}`}
              icon={<MailIcon size={17} />}
              label="Personal email"
              value={profile.emailPersonal}
              onNotify={notify}
            />
            <DetailRow
              href={profile.linkedin}
              icon={<LinkedInIcon size={16} />}
              label="LinkedIn"
              value={profile.linkedinLabel}
              copy={profile.linkedin}
              external
              onNotify={notify}
            />
            <DetailRow
              href={profile.github}
              icon={<GitHubIcon size={16} />}
              label="GitHub"
              value={profile.githubLabel}
              copy={profile.github}
              external
              onNotify={notify}
            />
            <DetailRow
              href={profile.website}
              icon={<GlobeIcon size={17} />}
              label="Website"
              value={profile.websiteLabel}
              copy={profile.website}
              external
              onNotify={notify}
            />
          </div>
        </section>

        {/* ---------------- Company ---------------- */}
        <section className="mt-10" ref={companyRef}>
          <div className="vc-reveal">
            <SectionLabel>Company</SectionLabel>
          </div>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="vc-reveal vc-glass vc-feature group block"
          >
            <span className="vc-feature-glow" aria-hidden />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="vc-feature-title">{company.name}</h2>
                  <p className="vc-feature-tagline">{company.tagline}</p>
                </div>
                <span className="vc-feature-arrow">
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <p className="vc-feature-body">{company.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {company.services.map((s) => (
                  <span key={s} className="vc-chip">
                    {s}
                  </span>
                ))}
              </div>
              <span className="vc-feature-link">{company.domain}</span>
            </div>
          </a>
        </section>

        {/* ---------------- Product ---------------- */}
        <section className="mt-8" ref={productRef}>
          <div className="vc-reveal">
            <SectionLabel>Building</SectionLabel>
          </div>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="vc-reveal vc-glass vc-feature vc-feature-alt group block"
          >
            <span className="vc-feature-glow" aria-hidden />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="vc-feature-title">{product.name}</h2>
                  <p className="vc-feature-tagline">{product.tagline}</p>
                </div>
                <span className="vc-feature-arrow">
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <p className="vc-feature-body">{product.description}</p>
              <span className="vc-feature-link">{product.domainLabel}</span>
            </div>
          </a>
        </section>

        {/* ---------------- Footer ---------------- */}
        <footer className="mt-10" ref={footerRef}>
          <div className="vc-reveal grid grid-cols-2 gap-2.5">
            <a href="/" className="vc-ghost-btn">
              <GlobeIcon size={16} />
              Full portfolio
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="vc-ghost-btn">
              <DocIcon size={16} />
              Résumé
            </a>
          </div>
          <p className="vc-reveal vc-footnote">
            © {new Date().getFullYear()} {profile.fullName} · {company.name} · Made in India
          </p>
        </footer>
      </div>

      {/* ---------------- Sticky save bar ---------------- */}
      <div className={`vc-bar ${barVisible ? "vc-bar-on" : ""}`}>
        <div className="vc-bar-inner">
          <div className="min-w-0">
            <p className="vc-bar-name">{profile.fullName}</p>
            <p className="vc-bar-sub">{company.name}</p>
          </div>
          <div className="w-[168px] shrink-0">
            <SaveContactButton onNotify={notify} compact />
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </main>
  );
}
