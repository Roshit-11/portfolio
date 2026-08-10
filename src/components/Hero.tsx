import { useRef, useState } from 'react';
import { ArrowDown, Binary, Braces, Code2, Command, Cpu, Database, GitBranch, Hash, Laptop, Terminal } from 'lucide-react';
import HeroCharacter from './HeroCharacter';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMediaQuery } from '../hooks/useMediaQuery';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* Faint topographic contour background (Lando-style) */
const Contours = () => (
  <svg className="absolute inset-0 w-full h-full text-ink" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1.2">
      <path d="M-50 180 C 300 60, 520 300, 780 200 S 1250 60, 1500 220" />
      <path d="M-50 300 C 320 200, 540 420, 800 320 S 1260 200, 1500 340" />
      <path d="M-50 470 C 260 360, 560 560, 820 470 S 1240 360, 1500 500" />
      <path d="M-50 640 C 300 540, 540 720, 820 640 S 1250 540, 1500 680" />
      <path d="M-50 800 C 320 700, 560 880, 820 800 S 1240 700, 1500 840" />
    </g>
  </svg>
);

const OrbitIcon = ({ angle, radius, children }: { angle: number; radius: number; children: React.ReactNode }) => (
  <span className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}>
    <span className="block w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface/90 border border-line shadow-md grid place-items-center text-accent">
      {children}
    </span>
  </span>
);

const Orbits = ({ px, py }: { px: number; py: number }) => (
  <div
    className="absolute left-1/2 top-1/2 z-0 pointer-events-none"
    style={{ transform: `translate(calc(-50% + ${px * -16}px), calc(-50% + ${py * -14}px))` }}
    aria-hidden="true"
  >
    <div className="orbit-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 920, height: 920 }}>
      <span className="absolute inset-0 rounded-full border border-dashed border-accent/15" />
      <OrbitIcon angle={8} radius={460}><Code2 className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={68} radius={460}><Cpu className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={132} radius={460}><Terminal className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={196} radius={460}><Braces className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={262} radius={460}><Database className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={318} radius={460}><GitBranch className="w-5 h-5" /></OrbitIcon>
    </div>
    <div className="orbit-b absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 680, height: 680 }}>
      <span className="absolute inset-0 rounded-full border border-dashed border-accent/12" />
      <OrbitIcon angle={40} radius={340}><Binary className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={140} radius={340}><Laptop className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={230} radius={340}><Hash className="w-5 h-5" /></OrbitIcon>
      <OrbitIcon angle={320} radius={340}><Command className="w-5 h-5" /></OrbitIcon>
    </div>
    <div className="orbit-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 500, height: 500, animationDuration: '58s' }}>
      <span className="absolute inset-0 rounded-full border border-dashed border-accent/10" />
      <OrbitIcon angle={100} radius={250}><Cpu className="w-4 h-4" /></OrbitIcon>
      <OrbitIcon angle={280} radius={250}><Braces className="w-4 h-4" /></OrbitIcon>
    </div>
  </div>
);

const Badge = () => (
  <div className="rounded-2xl border border-ink/15 bg-surface/70 backdrop-blur-sm px-5 py-4 w-[230px] shadow-sm">
    <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Currently building</p>
    <div className="flex items-center gap-2 mt-2">
      <Laptop className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
      <p className="text-sm font-semibold text-ink leading-tight">Outbound data pipeline</p>
    </div>
    <p className="text-xs text-muted mt-1.5">@ Allied Title &amp; Escrow · since 2026</p>
  </div>
);

const Hero = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { ref, progress: p } = useScrollProgress<HTMLElement>();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ px: 0, py: 0 });
  const [, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stickyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPar({ px: (e.clientX - r.left) / r.width - 0.5, py: (e.clientY - r.top) / r.height - 0.5 });
  };
  const onLeave = () => setPar({ px: 0, py: 0 });

  /* -------- Mobile: clean static welcome -------- */
  if (!isDesktop) {
    return (
      <section id="hero" className="relative min-h-screen flex flex-col justify-center bg-paper pt-24 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,242,78,0.18),transparent_60%)]" aria-hidden="true" />
        <Contours />
        <div className="section-shell relative z-10 flex flex-col items-center text-center gap-6">
          <h1 className="font-serif text-4xl font-bold text-ink">Hey — I&apos;m Roshit.</h1>
          <div className="w-64"><HeroCharacter showHint={false} /></div>
          <p className="max-w-xs text-ink-soft">Welcome in. Have a look around, and leave a review on your way out.</p>
        </div>
      </section>
    );
  }

  /* -------- Desktop: big centered character, Lando-style -------- */
  const copyOp = clamp(1 - p * 1.9);
  const parStyle = {
    transform: `translate(${par.px * 18}px, ${par.py * 15}px)`,
    transition: 'transform 0.25s ease-out',
  };

  return (
    <section id="hero" ref={ref} className="relative bg-paper" style={{ height: '185vh' }}>
      <div ref={stickyRef} onMouseMove={onMove} onMouseLeave={onLeave} className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_680px_at_50%_48%,rgba(198,242,78,0.20),transparent_62%)]" aria-hidden="true" />
        <Contours />
        <Orbits px={par.px} py={par.py} />

        {/* welcome text — left */}
        <div className="absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 max-w-[240px] z-20" style={{ opacity: copyOp }}>
          <h1 className="font-serif text-3xl xl:text-4xl font-bold text-ink leading-tight">Hey — I&apos;m Roshit.</h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Welcome in. Have a look around, and leave a review on your way out.
          </p>
        </div>

        {/* tweaky line — right */}
        <div className="absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 max-w-[220px] text-right z-20" style={{ opacity: copyOp }}>
          <p className="text-sm italic text-muted leading-relaxed">
            Still deciding whether to hire me? Say it in plain English — I&apos;ll ship it in code.
          </p>
        </div>

        {/* character — center, big */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div style={parStyle}>
            <div className="hero-float">
              <div className="h-[74vh] w-[55vh] max-w-[86vw]">
                <HeroCharacter p={p} onHover={setHovered} />
              </div>
            </div>
          </div>
        </div>

        {/* badge — bottom-left */}
        <div className="absolute left-8 xl:left-16 bottom-10 z-20" style={{ opacity: copyOp }}>
          <Badge />
        </div>

        {/* scroll hint — bottom-center */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-3 text-muted font-mono text-xs tracking-wider z-20"
          style={{ opacity: clamp(1 - p * 2.6) }}
        >
          scroll to explore <ArrowDown size={18} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
