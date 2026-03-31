import { useScrollReveal } from "../hooks/useScrollReveal";

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
  const ref = useScrollReveal((anime, el) => {
    anime.set(el.querySelectorAll(".exp-title-char"), { translateY: "100%", opacity: 0 });
    anime.set(el.querySelectorAll(".exp-card"), { opacity: 0, translateX: -40 });

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: el.querySelectorAll(".exp-title-char"),
      translateY: ["100%", "0%"],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(30),
    }).add({
      targets: el.querySelectorAll(".exp-card"),
      opacity: [0, 1],
      translateX: [-40, 0],
      duration: 800,
      delay: anime.stagger(120),
      easing: "easeOutCubic",
    }, "-=400");
  }, { threshold: 0.1 });

  return (
    <section className="py-24 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl text-white text-center mb-14 overflow-hidden">
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
        <div className="flex flex-col gap-4">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-card border border-white/10 p-6 rounded-lg hover:border-white/25 transition-colors">
              <div className="flex items-start gap-4">
                {exp.logo ? (
                  <img src={exp.logo} alt={exp.company} className="w-10 h-10 object-contain shrink-0 mt-0.5 rounded" />
                ) : (
                  <div
                    className={`${exp.badgeColor} w-10 h-10 flex items-center justify-center text-white font-extrabold text-xs shrink-0 mt-0.5 rounded`}
                  >
                    {exp.badge}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <span className="text-white font-semibold text-sm">{exp.role}</span>
                    <span className="text-gray-500 text-xs font-light shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-light italic mb-4">{exp.company}</p>
                  <ul className="flex flex-col gap-2">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-gray-400 text-sm font-light flex gap-2 leading-relaxed">
                        <span className="text-gray-600 shrink-0 mt-0.5">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
