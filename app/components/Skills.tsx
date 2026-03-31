import { useEffect, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Magnetic from "./Magnetic";

const skills = [
  { name: "JavaScript", logo: "/skills/javascript.svg", color: "#F7DF1E" },
  { name: "TypeScript", logo: "/skills/typescript.svg", color: "#3178C6" },
  { name: "React", logo: "/skills/react.svg", color: "#61DAFB" },
  { name: "Next.JS", logo: "/skills/nextjs.svg", color: "#000000" },
  { name: "Node.JS", logo: "/skills/nodejs.svg", color: "#339933" },
  { name: "Flutter", logo: "/skills/flutter.svg", color: "#02569B" },
  { name: "React Native", logo: "/skills/reactnative.svg", color: "#61DAFB" },
  { name: "NestJS", logo: "/skills/nestjs.svg", color: "#E0234E" },
  { name: "Docker", logo: "/skills/docker.svg", color: "#2496ED" },
  { name: "Kubernetes", logo: "/skills/kubernetes.svg", color: "#326CE5" },
  { name: "AWS", logo: "/skills/aws.svg", color: "#FF9900" },
  { name: "PostgreSQL", logo: "/skills/postgresql.svg", color: "#4169E1" },
  { name: "MongoDB", logo: "/skills/mongodb.svg", color: "#47A248" },
  { name: "Redis", logo: "/skills/redis.svg", color: "#FF4438" },
  { name: "Firebase", logo: "/skills/firebase.svg", color: "#FFCA28" },
  { name: "Git", logo: "/skills/git.svg", color: "#F05032" },
  { name: "Python", logo: "/skills/python.svg", color: "#3776AB" },
  { name: "Dart", logo: "/skills/dart.svg", color: "#0175C2" },
  { name: "Supabase", logo: "/skills/supabase.svg", color: "#3ECF8E" },
  { name: "Sveltekit", logo: "/skills/sveltekit.svg", color: "#FF3E00" },
];

export default function Skills() {
  const animeLib = useRef<any>(null);

  useEffect(() => {
    import("animejs").then(({ default: anime }) => {
      animeLib.current = anime;
    });
  }, []);

  const ref = useScrollReveal((anime, el) => {
    const tl = anime.timeline({ easing: "easeOutElastic(1, .6)" });

    tl.add({
      targets: el.querySelectorAll(".section-title-char"),
      translateY: ["120%", "0%"],
      rotateZ: [10, 0],
      skewX: [10, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(25),
    }).add({
      targets: el.querySelectorAll(".skill-card-wrapper"),
      opacity: [0, 1],
      translateY: [60, 0],
      scale: [0.7, 1],
      rotateX: [45, 0],
      duration: 1200,
      delay: anime.stagger(40, { start: 200 }),
    }, "-=800");
  });

  return (
    <section id="skills" className="py-24 bg-white" ref={ref} style={{ perspective: "1000px" }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl text-center text-black mb-16 overflow-hidden">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card-wrapper" style={{ opacity: 0, transform: "translateY(60px) scale(0.7) rotateX(45deg)" }}>
              <Magnetic strength={15}>
                <div
                  className="skill-card group border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-default bg-white border-gray-100"
                  style={{ 
                    borderColor: "#f3f4f6", 
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    const icon = target.querySelector(".skill-icon") as HTMLElement;
                    const text = target.querySelector(".skill-text") as HTMLElement;
                    const anime = animeLib.current;
                    
                    if (anime) {
                      // Card shadow & border
                      anime({
                        targets: target,
                        borderColor: skill.color,
                        boxShadow: `0 20px 40px ${skill.color}22`,
                        duration: 400,
                        easing: "easeOutCubic"
                      });

                      // Icon elastic pop
                      if (icon) {
                        icon.style.backgroundColor = skill.color;
                        anime({
                          targets: icon,
                          scale: [1, 1.35],
                          rotate: [0, 12],
                          duration: 1000,
                          easing: "easeOutElastic(1, .5)"
                        });
                      }

                      // Text color
                      if (text) {
                        anime({
                          targets: text,
                          color: "#000",
                          duration: 300,
                          easing: "linear"
                        });
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    const icon = target.querySelector(".skill-icon") as HTMLElement;
                    const text = target.querySelector(".skill-text") as HTMLElement;
                    const anime = animeLib.current;

                    if (anime) {
                      anime({
                        targets: target,
                        borderColor: "#f3f4f6",
                        boxShadow: "0 0px 0px rgba(0,0,0,0)",
                        duration: 400,
                        easing: "easeOutCubic"
                      });

                      if (icon) {
                        anime({
                          targets: icon,
                          scale: 1,
                          rotate: 0,
                          duration: 600,
                          easing: "easeOutCubic",
                          complete: () => {
                            icon.style.backgroundColor = "rgb(209 213 219)";
                          }
                        });
                      }

                      if (text) {
                        anime({
                          targets: text,
                          color: "#9ca3af", // gray-400
                          duration: 300,
                          easing: "linear"
                        });
                      }
                    }
                  }}
                >
                  <div
                    className="skill-icon w-12 h-12"
                    style={{
                      backgroundColor: "rgb(209 213 219)", // gray-300
                      maskImage: `url(${skill.logo})`,
                      WebkitMaskImage: `url(${skill.logo})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  />
                  <span className="skill-text text-sm font-bold text-center text-gray-400">
                    {skill.name}
                  </span>
                </div>
              </Magnetic>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
