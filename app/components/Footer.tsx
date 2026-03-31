import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="py-6 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <LogoMark size={32} />
        <p className="text-gray-400 text-xs font-light">© 2019–2025 Varun Dev Sharma · Made in India</p>
        <a
          href="https://thevarundev.com"
          className="text-gray-400 text-xs font-light hover:text-black transition-colors"
        >
          thevarundev.com
        </a>
      </div>
    </footer>
  );
}
