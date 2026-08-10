import { useRef } from 'react';

/**
 * Lando-style hero image: a base photo (grayscale) with a soft spotlight that
 * follows the cursor and "scratches" through to reveal a second photo in colour.
 * Swap the two images in /public/hero/ (base.jpg + reveal.jpg) for your portraits.
 */
const HeroReveal = ({
  base = '/hero/base.jpg',
  reveal = '/hero/reveal.jpg',
  className = '',
}: {
  base?: string;
  reveal?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const setVars = (mx: number, my: number, r: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `${mx}px`);
    el.style.setProperty('--my', `${my}px`);
    el.style.setProperty('--r', `${r}px`);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setVars(e.clientX - rect.left, e.clientY - rect.top, 130);
  };
  const onLeave = () => setVars(-999, -999, 0);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onMove}
      onMouseLeave={onLeave}
      className={`hero-reveal group relative overflow-hidden rounded-[26px] border border-white/40 shadow-2xl shadow-black/20 ${className}`}
      style={{ aspectRatio: '3 / 4' }}
    >
      {/* revealed (colour) layer underneath */}
      <img src={reveal} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      {/* base (grayscale) layer on top, masked by the spotlight */}
      <img src={base} alt="Roshit Lamichhane" className="hero-reveal-top absolute inset-0 w-full h-full object-cover grayscale" />
      {/* lime cursor ring + subtle vignette */}
      <span className="hero-reveal-ring" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-lime/30 rounded-[26px]" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/85 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        hover to reveal
      </span>
    </div>
  );
};

export default HeroReveal;
