import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Contact() {
  const ref = useScrollReveal((anime, el) => {
    anime.set(el.querySelectorAll(".contact-title-char"), { translateY: "100%", opacity: 0 });
    anime.set(el.querySelector(".contact-form"), { opacity: 0, translateY: 40 });
    anime.set(el.querySelector(".contact-info"), { opacity: 0, translateX: 40 });

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: el.querySelectorAll(".contact-title-char"),
      translateY: ["100%", "0%"],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(25),
    })
    .add({
      targets: el.querySelector(".contact-form"),
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      easing: "easeOutCubic",
    }, "-=400")
    .add({
      targets: el.querySelector(".contact-info"),
      opacity: [0, 1],
      translateX: [40, 0],
      duration: 1000,
      easing: "easeOutCubic",
    }, "-=800");
  }, { threshold: 0.1 });

  return (
    <section id="contact" className="py-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left – Form */}
          <div className="contact-form flex-1">
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-200 rounded px-5 py-3.5 text-sm font-light outline-none focus:border-black transition-colors bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-200 rounded px-5 py-3.5 text-sm font-light outline-none focus:border-black transition-colors bg-transparent"
              />
              <input
                type="url"
                placeholder="Your Website (Optional)"
                className="border border-gray-200 rounded px-5 py-3.5 text-sm font-light outline-none focus:border-black transition-colors bg-transparent"
              />
              <textarea
                placeholder="Your Message *"
                rows={5}
                className="border border-gray-200 rounded px-5 py-3.5 text-sm font-light outline-none focus:border-black transition-colors resize-none bg-transparent"
              />
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-black text-white text-sm font-semibold py-3.5 px-10 rounded hover:bg-gray-800 transition-colors"
                >
                  Get In Touch
                </button>

                {/* Social icons */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://linkedin.com/in/varun-dev-sharma05197a198"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/thedevvarun"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:varundev1007@gmail.com"
                    aria-label="Email"
                    className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Right – Contact Info */}
          <div className="contact-info flex-1">
            <h2 className="text-4xl text-black mb-2 overflow-hidden">
              <span className="inline-block overflow-hidden">
                {"Let's ".split("").map((char, i) => (
                  <span key={`a${i}`} className="contact-title-char inline-block font-light">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <span className="inline-block overflow-hidden">
                {"talk".split("").map((char, i) => (
                  <span key={`b${i}`} className="contact-title-char inline-block font-semibold italic">
                    {char}
                  </span>
                ))}
              </span>
              <span className="inline-block overflow-hidden">
                {" for".split("").map((char, i) => (
                  <span key={`c${i}`} className="contact-title-char inline-block font-light">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h2>
            <h2 className="text-4xl font-extrabold text-black mb-8 overflow-hidden">
              <span className="inline-block overflow-hidden">
                {"Something special".split("").map((char, i) => (
                  <span key={`d${i}`} className="contact-title-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-10 max-w-sm">
              I'm always open to discussing new projects, creative ideas, or opportunities to
              build something meaningful. Let's connect and create something extraordinary together.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:varundev1007@gmail.com"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-black transition-colors group"
              >
                <span className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                varundev1007@gmail.com
              </a>
              <a
                href="tel:+918700506796"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-black transition-colors group"
              >
                <span className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                +91 870 050 6796
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
