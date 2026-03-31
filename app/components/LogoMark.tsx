export default function LogoMark({ size = 36 }: { size?: number }) {
  const pad = 2;

  return (
    <div
      className="relative flex items-center justify-center select-none shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Continuously spinning conic-gradient ring */}
      <div
        className="absolute inset-0 animate-spin"
        style={{
          background:
            "conic-gradient(from 0deg, #000 0%, #333 20%, #aaa 50%, #333 80%, #000 100%)",
          animationDuration: "4s",
          animationTimingFunction: "linear",
        }}
      />

      {/* Static black inner face */}
      <div
        className="absolute bg-black flex items-center justify-center"
        style={{ inset: pad }}
      >
        {/* VD monogram – V right-diagonal doubles as D's left vertical */}
        <svg
          viewBox="0 0 30 22"
          width={Math.round((size - pad * 2) * 0.72)}
          height={Math.round((size - pad * 2) * 0.72 * (22 / 30))}
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* V */}
          <polyline points="0,2 7,20 14,2" />
          {/* D */}
          <path d="M17,2 L17,20 Q28,20 28,11 Q28,2 17,2 Z" />
        </svg>
      </div>
    </div>
  );
}
