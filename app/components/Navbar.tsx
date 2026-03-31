import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">
          V
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-gray-600 hover:text-black text-sm font-medium transition-colors">About Me</a>
          <a href="#skills" className="text-gray-600 hover:text-black text-sm font-medium transition-colors">Skills</a>
          <a href="#projects" className="text-gray-600 hover:text-black text-sm font-medium transition-colors">Project</a>
          <a href="#contact" className="text-gray-600 hover:text-black text-sm font-medium transition-colors">Contact Me</a>
        </div>

        {/* Resume Button */}
        <a
          href="/VarunResumev4.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-800 transition-colors"
        >
          Resume
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 flex flex-col gap-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="w-5 h-0.5 bg-black block" />
          <span className="w-5 h-0.5 bg-black block" />
          <span className="w-5 h-0.5 bg-black block" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          <a href="#about" className="text-gray-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>About Me</a>
          <a href="#skills" className="text-gray-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>Skills</a>
          <a href="#projects" className="text-gray-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>Project</a>
          <a href="#contact" className="text-gray-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>Contact Me</a>
          <a href="/VarunResumev4.pdf" target="_blank" rel="noopener noreferrer" className="bg-black text-white text-sm font-medium px-4 py-2.5 text-center">
            Resume
          </a>
        </div>
      )}
    </nav>
  );
}
