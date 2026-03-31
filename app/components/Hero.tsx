import { useEffect, useRef } from "react";

function SplitText({ text, className, charClass }: { text: string; className?: string; charClass?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block" }}>
          {word.split("").map((char, ci) => (
            <span key={ci} className={`inline-block ${charClass || ""}`}>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("animejs").then(({ default: anime }) => {
      // Set initial states
      anime.set(".hero-char", { translateY: "120%", opacity: 0 });
      anime.set(".hero-engineer-box", { scaleX: 0, transformOrigin: "left center" });
      anime.set(".hero-engineer-text .hero-char", { translateY: "120%", opacity: 0 });
      anime.set([".hero-bio", ".hero-socials"], { opacity: 0, translateY: 30 });
      anime.set(".hero-banner", { opacity: 0, scale: 0.85, translateX: 40 });
      anime.set(".hero-divider", { scaleX: 0, transformOrigin: "left center" });

      const tl = anime.timeline({ easing: "easeOutExpo" });

      tl.add({
        targets: ".hero-line-1 .hero-char",
        translateY: ["120%", "0%"],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(30, { start: 300 }),
      })
        .add({
          targets: ".hero-line-1-bold .hero-char",
          translateY: ["120%", "0%"],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(35),
        }, "-=500")
        .add({
          targets: ".hero-line-2-text .hero-char",
          translateY: ["120%", "0%"],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(30),
        }, "-=400")
        .add({
          targets: ".hero-engineer-box",
          scaleX: [0, 1],
          duration: 600,
          easing: "easeOutCubic",
        }, "-=300")
        .add({
          targets: ".hero-engineer-text .hero-char",
          translateY: ["120%", "0%"],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(40),
        }, "-=200")
        .add({
          targets: ".hero-line-3 .hero-char",
          translateY: ["120%", "0%"],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(30),
        }, "-=400")
        .add({
          targets: ".hero-line-3-bold .hero-char",
          translateY: ["120%", "0%"],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(40),
        }, "-=500")
        .add({
          targets: ".hero-bio",
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 1000,
          easing: "easeOutCubic",
        }, "-=400")
        .add({
          targets: ".hero-socials a",
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(80),
          easing: "easeOutCubic",
        }, "-=600")
        .add({
          targets: ".hero-banner",
          opacity: [0, 1],
          scale: [0.85, 1],
          translateX: [40, 0],
          duration: 1600,
          easing: "easeOutElastic(1, 0.6)",
        }, 400)
        .add({
          targets: ".hero-divider",
          scaleX: [0, 1],
          duration: 1200,
          easing: "easeInOutQuart",
        }, "-=800");
    });
  }, []);

  return (
    <section ref={sectionRef} className="pt-20 pb-0 min-h-screen flex items-center">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">

        <div className="relative flex flex-col lg:flex-row items-center gap-10 py-12 lg:py-0 lg:min-h-[85vh] lg:gap-0">

          {/* Left Content */}
          <div className="w-full lg:w-[58%] flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Line 1: Hello I'm Varun Dev. */}
            <div className="overflow-hidden pb-1 w-full">
              <div className="text-4xl sm:text-5xl lg:text-[3rem] xl:text-[4rem] tracking-tight leading-[1.1] lg:whitespace-nowrap">
                <SplitText text="Hello I'm " className="hero-line-1 font-light text-black" charClass="hero-char" />
                <SplitText text="Varun Dev." className="hero-line-1-bold font-extrabold text-black" charClass="hero-char" />
              </div>
            </div>

            {/* Line 2: Full Stack [Engineer] */}
            <div className="overflow-hidden pb-1 w-full">
              <div className="text-4xl sm:text-5xl lg:text-[3rem] xl:text-[3.5rem] tracking-tight leading-[1.1] flex items-baseline gap-2 sm:gap-3 flex-wrap lg:flex-nowrap justify-center lg:justify-start">
                <SplitText text="Full Stack " className="hero-line-2-text font-extrabold text-black" charClass="hero-char" />
                <span className="hero-engineer-box inline-flex border-2 border-black px-2 sm:px-3 py-0.5">
                  <SplitText text="Engineer" className="hero-engineer-text text-outlined font-extrabold" charClass="hero-char" />
                </span>
              </div>
            </div>

            {/* Line 3: Based In India. */}
            <div className="overflow-hidden pb-2 mb-6 sm:mb-8 w-full">
              <div className="text-4xl sm:text-5xl lg:text-[3rem] xl:text-[3.5rem] tracking-tight leading-[1.1] lg:whitespace-nowrap">
                <SplitText text="Based In " className="hero-line-3 font-light text-black" charClass="hero-char" />
                <SplitText text="India." className="hero-line-3-bold font-extrabold text-black" charClass="hero-char" />
              </div>
            </div>

            {/* Bio */}
            <p className="hero-bio text-gray-500 text-sm font-light leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Multi-stack engineer experienced in building and scaling technology
              solutions from scratch. Adept at solving complex architectural
              challenges, optimizing cloud infrastructure, and pushing
              technological limits to deliver meaningful, high-impact products in
              fast-paced environments.
            </p>

            {/* Social Icons */}
            <div className="hero-socials flex items-center gap-3 justify-center lg:justify-start">
              <a
                href="https://linkedin.com/in/varun-dev-sharma05197a198"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/thedevvarun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="mailto:varundev1007@gmail.com"
                aria-label="Email"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              <a
                href="https://thevarundev.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Banner illustration */}
          <div className="hero-banner w-full lg:w-auto flex justify-center lg:flex-none">
            <img
              className="h-[42vh] sm:h-[55vh] lg:h-[80vh] w-auto max-w-[88vw] lg:max-w-[46vw] object-contain"
              src="/svgs/banner.svg"
              alt="Hero Illustration"
            />
          </div>

        </div>

        {/* Divider */}
        <div className="hero-divider border-t border-gray-200" />
      </div>
    </section>
  );
}
