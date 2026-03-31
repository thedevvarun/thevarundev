import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import About from "../components/About";
import Projects from "../components/Projects";
// import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Varun Dev Sharma" },
    {
      name: "description",
      content:
        "Multi-stack engineer experienced in building and scaling technology solutions from scratch.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Skills />
      <Experience />
      <About />
      <Projects />
      {/* Testimonials section removed */}
      <Contact />
      <Footer />
    </>
  );
}
