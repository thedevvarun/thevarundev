import { useEffect, useRef } from "react";

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const projects = [
  {
    number: "01",
    title: "iPrep Web App",
    description:
      "Architected and scaled a large-scale educational web platform from scratch to 5,000+ daily active users. Built a custom LRU caching layer and an adaptive video player optimized for low-bandwidth environments. Delivered a seamless learning experience for students across India.",
    tags: ["Next.JS", "Node.JS", "PostgreSQL", "Redis"],
    image: "/projects/iprep-web.webp",
    link: "https://iprep.in",
  },
  {
    number: "02",
    title: "RajDigiLibrary (Project RISL)",
    description:
      "Architected a massive hybrid Edge-Cloud ecosystem for the Rajasthan government's digital library initiative. Built 3 custom frontends (Flutter/Next.js) and a dual-backend capable of offline LAN syncing, secure local telemetry caching, and bulk taxonomy provisioning.",
    tags: ["Flutter", "Next.JS", "Node.JS", "PostgreSQL"],
    image: "/projects/rajdigi.webp",
    link: "https://rajdigilibrary.rajasthan.gov.in",
  },
  {
    number: "03",
    title: "iPrep Mobile App",
    description:
      "Engineered a cross-platform mobile application using Flutter with an event-driven BLOC architecture, scaling to 60,000+ downloads across Android and iOS. Integrated pdfrx for PDF rendering and Apple Payments for in-app purchases.",
    tags: ["Flutter", "Dart", "Firebase", "BLOC"],
    image: "/projects/iprep-mobile.webp",
    link: "https://play.google.com/store/apps/details?id=org.idreameducation.iprepapp",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll(".project-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            import("animejs").then(({ default: anime }) => {
              const el = entry.target;
              const isEven = el.getAttribute("data-index") === "0" || el.getAttribute("data-index") === "2";
              const imgDir = isEven ? -60 : 60;
              const contentDir = isEven ? 60 : -60;

              anime.set(el.querySelector(".project-image"), { opacity: 0, translateX: imgDir });
              anime.set(el.querySelector(".project-number"), { opacity: 0, translateY: 20, scale: 0.8 });
              anime.set(el.querySelector(".project-title"), { opacity: 0, translateY: 20 });
              anime.set(el.querySelector(".project-desc"), { opacity: 0, translateY: 20 });
              anime.set(el.querySelectorAll(".project-tag"), { opacity: 0, scale: 0.8 });
              anime.set(el.querySelector(".project-link"), { opacity: 0, translateX: -10 });

              const tl = anime.timeline({ easing: "easeOutCubic" });

              tl.add({
                targets: el.querySelector(".project-image"),
                opacity: [0, 1],
                translateX: [imgDir, 0],
                duration: 1000,
              })
              .add({
                targets: el.querySelector(".project-number"),
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.8, 1],
                duration: 600,
              }, "-=700")
              .add({
                targets: el.querySelector(".project-title"),
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
              }, "-=400")
              .add({
                targets: el.querySelector(".project-desc"),
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
              }, "-=300")
              .add({
                targets: el.querySelectorAll(".project-tag"),
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 400,
                delay: anime.stagger(60),
              }, "-=300")
              .add({
                targets: el.querySelector(".project-link"),
                opacity: [0, 1],
                translateX: [-10, 0],
                duration: 500,
              }, "-=200");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Title animation
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          import("animejs").then(({ default: anime }) => {
            anime({
              targets: el.querySelectorAll(".proj-title-char"),
              translateY: ["100%", "0%"],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(30),
              easing: "easeOutExpo",
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    // Set initial state
    const chars = el.querySelectorAll(".proj-title-char");
    chars.forEach((c) => {
      (c as HTMLElement).style.transform = "translateY(100%)";
      (c as HTMLElement).style.opacity = "0";
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 bg-black" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 ref={titleRef} className="text-4xl text-center text-white mb-20 overflow-hidden">
          <span className="inline-block overflow-hidden">
            {"My ".split("").map((char, i) => (
              <span key={`a${i}`} className="proj-title-char inline-block font-light">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="inline-block overflow-hidden">
            {"Projects".split("").map((char, i) => (
              <span key={`b${i}`} className="proj-title-char inline-block font-extrabold">
                {char}
              </span>
            ))}
          </span>
        </h2>
        <div className="flex flex-col gap-32">
          {projects.map((project, i) => (
            <div
              key={project.number}
              data-index={i}
              className={`project-item flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              {/* Image */}
              <div className="project-image flex-1 w-full">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-video object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement!;
                      parent.innerHTML = `<div class="w-full aspect-video bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-sm">Project Screenshot</div>`;
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 ${i % 2 === 0 ? "md:pl-4" : "md:pr-4"}`}>
                <p className="project-number text-5xl font-extrabold text-white/10 leading-none mb-2 select-none">
                  {project.number}
                </p>
                <h3 className="project-title text-xl font-bold text-white mb-4">{project.title}</h3>
                <p className="project-desc text-gray-400 text-sm font-light leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="project-tag text-xs font-medium border border-gray-700 px-3 py-1 text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="project-link inline-flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                  aria-label={`View ${project.title}`}
                >
                  <ArrowIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
