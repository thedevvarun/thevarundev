export default function Footer() {
  return (
    <footer className="py-6 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-extrabold text-xs select-none">
          V
        </div>
        <p className="text-gray-400 text-xs font-light">© 2019–2025 Varun Dev Sharma · Made in India</p>
        <a
          href="https://thedevvarun.in"
          className="text-gray-400 text-xs font-light hover:text-black transition-colors"
        >
          thedevvarun.in
        </a>
      </div>
    </footer>
  );
}
