import { useScrollReveal } from "../hooks/useScrollReveal";

const skills = [
  { name: "JavaScript", logo: "/skills/javascript.svg" },
  { name: "TypeScript", logo: "/skills/typescript.svg" },
  { name: "React", logo: "/skills/react.svg" },
  { name: "Next.JS", logo: "/skills/nextjs.svg" },
  { name: "Node.JS", logo: "/skills/nodejs.svg" },
  { name: "Flutter", logo: "/skills/flutter.svg" },
  { name: "React Native", logo: "/skills/reactnative.svg" },
  { name: "NestJS", logo: "/skills/nestjs.svg" },
  { name: "Docker", logo: "/skills/docker.svg" },
  { name: "Kubernetes", logo: "/skills/kubernetes.svg" },
  { name: "AWS", logo: "/skills/aws.svg" },
  { name: "PostgreSQL", logo: "/skills/postgresql.svg" },
  { name: "MongoDB", logo: "/skills/mongodb.svg" },
  { name: "Redis", logo: "/skills/redis.svg" },
  { name: "Firebase", logo: "/skills/firebase.svg" },
  { name: "Git", logo: "/skills/git.svg" },
  { name: "Python", logo: "/skills/python.svg" },
  { name: "Dart", logo: "/skills/dart.svg" },
  { name: "Supabase", logo: "/skills/supabase.svg" },
  { name: "Sveltekit", logo: "/skills/sveltekit.svg" },
];

export default function Skills() {
  const ref = useScrollReveal((anime, el) => {
    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: el.querySelectorAll(".section-title-char"),
      translateY: ["100%", "0%"],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(25),
    }).add({
      targets: el.querySelectorAll(".skill-card"),
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.9, 1],
      duration: 600,
      delay: anime.stagger(50, { grid: [5, 4], from: "center" }),
      easing: "easeOutCubic",
    }, "-=400");
  });

  return (
    <section id="skills" className="py-16 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl text-center text-black mb-10 overflow-hidden">
          <span className="inline-block overflow-hidden">
            {"My ".split("").map((char, i) => (
              <span key={`a${i}`} className="section-title-char inline-block font-light" style={{ opacity: 0, transform: "translateY(100%)" }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="inline-block overflow-hidden">
            {"Skills".split("").map((char, i) => (
              <span key={`b${i}`} className="section-title-char inline-block font-extrabold" style={{ opacity: 0, transform: "translateY(100%)" }}>
                {char}
              </span>
            ))}
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="skill-card group border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-default bg-white border-gray-200 hover:border-black hover:shadow-lg"
              style={{ opacity: 0, transform: "translateY(40px) scale(0.9)" }}
            >
              <img
                src={skill.logo}
                alt={skill.name}
                className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-bold text-center text-black">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
