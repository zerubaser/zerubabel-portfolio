/**
 * Static, decorative hero visual. Shown while the 3D scene lazy-loads, and as
 * the permanent fallback for reduced-motion / no-WebGL / errors. Purely
 * decorative (aria-hidden) — the real hero text + CTAs live in HTML next to it.
 */
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_72%_72%,rgba(251,146,60,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative h-28 w-28 rotate-45 rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-500/30 to-orange-500/30 shadow-[0_0_60px_rgba(56,189,248,0.45)]" />
    </div>
  );
}
