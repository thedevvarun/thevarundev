import { useScrollReveal, useScrollProgress } from "../hooks/useScrollReveal";
import Magnetic from "./Magnetic";
import { useState, useRef } from "react";

const experiences = [
  {
    company: "iDream Education",
    role: "Manager – Tech and Solutions",
    period: "2023 – Present",
    logo: "/logos/idream-education.webp",
    badge: "iD",
    badgeColor: "bg-indigo-600",
    bullets: [
      "Reduced recurring AWS cloud costs by 40% by migrating infrastructure from on-demand to reserved instances based on traffic analysis.",
      "Led the development of iPrep Tizen (React) for Smart TVs and iPrep Digital Library, successfully deploying to 10,000+ devices.",
      "Integrated AI model training pipelines and built custom FFmpeg compression/encoding, MP4 segmentation, and AES-256-CBC encryption tools.",
      "Architected a Content-as-API solution for seamless B2B integrations and implemented Widevine DRM streaming for adaptive video loading.",
    ],
  },
  {
    company: "iDream Education",
    role: "Assistant Manager",
    period: "2022 – 2023",
    logo: "/logos/idream-education.webp",
    badge: "iD",
    badgeColor: "bg-indigo-600",
    bullets: [
      "Architected a massive hybrid Edge-Cloud ecosystem (Project RISL – RajDigiLibrary) for government initiatives with offline LAN syncing.",
      "Built 3 custom frontends using Flutter and Next.js with a Node.js/PostgreSQL dual-backend supporting bulk taxonomy provisioning.",
      "Developed iPrep Digital Class, a Windows/Linux desktop app installed on 500,000+ devices, used by 1+ million users.",
    ],
  },
  {
    company: "iDream Education",
    role: "Senior Software Engineer",
    period: "2021 – 2022",
    logo: "/logos/idream-education.webp",
    badge: "iD",
    badgeColor: "bg-indigo-600",
    bullets: [
      "Architected and scaled the iPrep Web App (Next.js) from scratch to 5,000+ DAU, optimizing performance using LRU caching.",
      "Built a custom adaptive video player optimized for low-bandwidth environments.",
      "Engineered the cross-platform iPrep Mobile App (Flutter) with BLOC architecture, scaling to 60,000+ downloads across Android/iOS.",
    ],
  },
  {
    company: "Iraitech Pvt Ltd",
    role: "Frontend Developer – React Native (Internship)",
    period: "Feb 2020 – Feb 2021",
    badge: "IR",
    badgeColor: "bg-orange-500",
    bullets: [
      "Developed 'Desi Adda', a cross-platform event scheduling and e-sports management application for Android and iOS using React Native.",
      "Implemented a secure authentication system with Single Sign-On (SSO).",
      "Designed and developed event registration and landing pages for a seamless user experience.",
    ],
  },
];

export default function Experience() {
  const lineRef = useRef<HTMLDivElement>(null);
  
  // Custom scroll progress for the central line
  const containerRef = useScrollProgress((ratio) => {
    if (lineRef.current) {
      lineRef.current.style.transform = `scaleY(${ratio})`;
    }
  });

  const revealRef = useScrollReveal((anime, el) => {
    // Initial states for dots and cards
    anime.set(".exp-dot", { scale: 0 });
    
    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: el.querySelectorAll(".exp-title-char"),
      translateY: ["120%", "0%"],
      rotateZ: [5, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(30),
    }).add({
      targets: el.querySelectorAll(".exp-card-wrapper"),
      opacity: [0, 1],
      translateX: (el: HTMLElement) => {
        const isLeft = el.classList.contains("exp-left");
        return isLeft ? [-50, 0] : [50, 0];
      },
      rotateY: (el: HTMLElement) => {
        const isLeft = el.classList.contains("exp-left");
        return isLeft ? [15, 0] : [-15, 0];
      },
      duration: 1200,
      delay: anime.stagger(200),
    }, "-=600").add({
      targets: el.querySelectorAll(".exp-dot"),
      scale: [0, 1],
      duration: 600,
      delay: anime.stagger(200),
      easing: "easeOutElastic(1, .6)"
    }, "-=1200");
  }, { threshold: 0.1 });

  // Helper function to merge refs
  const setRefs = (node: HTMLDivElement | null) => {
    (containerRef as any).current = node;
    (revealRef as any).current = node;
  };

  return (
    <section id="experience" className="py-32 bg-black overflow-hidden" ref={setRefs}>
      <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-4xl text-white text-center mb-24 overflow-hidden">
          <span className="inline-block overflow-hidden">
            {"My ".split("").map((char, i) => (
              <span key={`a${i}`} className="exp-title-char inline-block font-light">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="inline-block overflow-hidden">
            {"Experience".split("").map((char, i) => (
              <span key={`b${i}`} className="exp-title-char inline-block font-extrabold">
                {char}
              </span>
            ))}
          </span>
        </h2>

        <div className="relative">
          {/* Centered Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2">
            <div 
              ref={lineRef}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-bottom from-indigo-500 to-purple-600 origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-0">
            {experiences.map((exp, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row items-center w-full mb-0 md:mb-16 ${isEven ? "md:flex-row-reverse" : ""}`}>
                  
                  {/* Content Space (Empty half on Desktop) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Central Dot */}
                  <div className="absolute left-[20px] md:left-1/2 top-6 md:top-1/2 w-4 h-4 rounded-full bg-black border-2 border-indigo-500 -translate-x-1/2 -translate-y-1/2 z-10 exp-dot" />

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? "md:pr-12" : "md:pl-12"} exp-card-wrapper ${isEven ? "exp-left" : "exp-right"}`} style={{ perspective: "1000px" }}>
                    <Magnetic strength={5}>
                      <div className="exp-card border border-white/10 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md hover:border-indigo-500/50 transition-all duration-500 group hover:shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                        <div className="flex items-start gap-4">
                          {exp.logo ? (
                            <img src={exp.logo} alt={exp.company} className="w-12 h-12 object-contain shrink-0 rounded-lg bg-white/5 p-1 border border-white/10 shadow-inner" />
                          ) : (
                            <div className={`${exp.badgeColor} w-12 h-12 flex items-center justify-center text-white font-extrabold text-sm shrink-0 rounded-lg shadow-lg`}>
                              {exp.badge}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                              <span className="text-white font-bold text-lg tracking-tight group-hover:text-indigo-400 transition-colors">{exp.role}</span>
                              <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">{exp.period}</span>
                            </div>
                            <p className="text-gray-400 text-sm font-light mb-4">{exp.company}</p>
                            <ul className="flex flex-col gap-3">
                              {exp.bullets.map((bullet, j) => (
                                <li key={j} className="text-gray-400 text-sm font-light flex gap-3 leading-relaxed group-hover:text-gray-300 transition-colors">
                                  <span className="text-indigo-500 shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Magnetic>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
