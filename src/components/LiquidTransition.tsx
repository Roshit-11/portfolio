import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function LiquidTransition() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { ref, progress } = useScrollProgress<HTMLElement>();

  if (!isDesktop) return null;

  // Determine scale of gooey circles based on scroll progress
  // We offset it slightly and speed it up so it finishes comfortably
  const scale = Math.min(3.5, progress * 6.0);
  const opacity = progress > 0.98 ? 0 : 1; // hide transition section once fully dark

  return (
    <section
      ref={ref}
      className="relative bg-[#E2DFD2] overflow-hidden"
      style={{ height: '60vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* SVG Gooey Filter */}
        <svg className="hidden" aria-hidden="true">
          <defs>
            <filter id="gooey-transition">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* Liquid Container */}
        <div
          className="w-full h-full absolute inset-0 bg-[#E2DFD2] transition-opacity duration-300"
          style={{
            filter: 'url(#gooey-transition)',
            opacity: opacity,
          }}
        >
          {/* Main big diagonal gooey blob row */}
          <div
            className="absolute bg-[#1A1A18] rounded-full transition-transform duration-75 ease-out"
            style={{
              width: '45vw',
              height: '45vw',
              top: '10%',
              left: '-5%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
          <div
            className="absolute bg-[#1A1A18] rounded-full transition-transform duration-75 ease-out"
            style={{
              width: '40vw',
              height: '40vw',
              top: '45%',
              left: '25%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
          <div
            className="absolute bg-[#1A1A18] rounded-full transition-transform duration-75 ease-out"
            style={{
              width: '50vw',
              height: '50vw',
              top: '-10%',
              left: '50%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
          <div
            className="absolute bg-[#1A1A18] rounded-full transition-transform duration-75 ease-out"
            style={{
              width: '45vw',
              height: '45vw',
              top: '60%',
              left: '70%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
          <div
            className="absolute bg-[#1A1A18] rounded-full transition-transform duration-75 ease-out"
            style={{
              width: '35vw',
              height: '35vw',
              top: '30%',
              left: '85%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Solid fallback background that fades in when transition is almost done */}
        <div
          className="absolute inset-0 bg-[#1A1A18] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: progress > 0.7 ? Math.min(1, (progress - 0.7) * 3.3) : 0,
          }}
        />

        {/* Elegant visual guide text */}
        <div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - progress * 2.5) }}
        >
          <p className="font-mono text-xs tracking-widest text-[#1B1B18]/50 uppercase">
            Entering the field notes
          </p>
        </div>
      </div>
    </section>
  );
}
