import { useScrollReveal } from "../hooks/useScrollReveal";

export default function About() {
  const ref = useScrollReveal((anime, el) => {
    // SVG draw animation for the aboutme illustration
    const svgPaths = el.querySelectorAll(".about-image svg path, .about-image svg circle, .about-image svg rect");
    const strokePaths = el.querySelectorAll(".about-svg-stroke");

    // Init state for jaw-dropping entrance
    anime.set(el.querySelector(".about-image"), { opacity: 0, scale: 0.8, rotateY: -30, translateX: -60 });
    anime.set(el.querySelectorAll(".about-title-char"), { translateY: "120%", opacity: 0, rotateZ: 15, skewX: 15 });
    anime.set(el.querySelectorAll(".about-para"), { opacity: 0, translateY: 40, scale: 0.95 });

    const tl = anime.timeline({ easing: "easeOutExpo" });

    // Image pops in with 3d rotate
    tl.add({
      targets: el.querySelector(".about-image"),
      opacity: [0, 1],
      scale: [0.8, 1],
      rotateY: [-30, 0],
      translateX: [-60, 0],
      duration: 1400,
      easing: "easeOutElastic(1, .8)",
    })
    // Title chars cascade and un-rotate
    .add({
      targets: el.querySelectorAll(".about-title-char"),
      translateY: ["120%", "0%"],
      rotateZ: [15, 0],
      skewX: [15, 0],
      opacity: [0, 1],
      duration: 900,
      delay: anime.stagger(30),
      easing: "easeOutElastic(1, .8)"
    }, "-=1000")
    // Paragraphs stagger in with scale
    .add({
      targets: el.querySelectorAll(".about-para"),
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.95, 1],
      duration: 1000,
      delay: anime.stagger(150),
      easing: "easeOutCubic",
    }, "-=600");
  });

  return (
    <section id="about" className="py-24 bg-white" ref={ref} style={{ perspective: "1000px" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Left – Illustration */}
          <div className="about-image flex-1 flex justify-center">
            <img
              src="/svgs/aboutme.svg"
              alt="About Me Illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right – Bio */}
          <div className="about-content flex-1">
            <h2 className="text-4xl text-black mb-8 overflow-hidden">
              <span className="inline-block overflow-hidden">
                {"About ".split("").map((char, i) => (
                  <span key={`a${i}`} className="about-title-char inline-block font-light">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <span className="inline-block overflow-hidden">
                {"Me".split("").map((char, i) => (
                  <span key={`b${i}`} className="about-title-char inline-block font-extrabold">
                    {char}
                  </span>
                ))}
              </span>
            </h2>
            <div className="flex flex-col gap-5 text-gray-600 text-sm font-light leading-relaxed">
              <p className="about-para">
                I'm a passionate, multi-stack engineer who specializes in full stack
                development (React.js &amp; Node.js). I am very enthusiastic about bringing
                the technical and visual aspects of digital products to life. User
                experience, pixel perfect design, and writing clear, readable, highly
                performant code matters to me.
              </p>
              <p className="about-para">
                I began my journey as a web developer in 2019, and since then, I've
                continued to grow and evolve as a developer, taking on new challenges
                and learning the latest technologies along the way. Now, with 4+ years of
                experience, I'm building cutting-edge web applications using modern
                technologies such as Next.js, TypeScript, NestJS, Tailwind CSS, Supabase
                and much more.
              </p>
              <p className="about-para">
                When I'm not in full-on developer mode, you can find me hovering
                around on Twitter or on indie hacker, witnessing the journey of early
                startups or enjoying some free time. You can follow me on Twitter where
                I share tech-related bites and build in public, or you can follow me on
                GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
