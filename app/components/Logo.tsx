/* V is a triangle, D is a half-disc. The same two shapes drift through the hero. */
export default function Logo({ size = 22, className = "logo" }: { size?: number; className?: string }) {
  return (
    <svg className={className} height={size} viewBox="0 0 46 26" role="img" aria-label="Varun Dev">
      <path className="tri" d="M0 1h24L12 25z" fill="currentColor" />
      <path className="half" d="M27 1a12 12 0 0 1 0 24z" fill="currentColor" />
    </svg>
  );
}
