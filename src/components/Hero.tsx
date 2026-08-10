import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Binary, Braces, Code2, Command, Cpu, Database, GitBranch, Hash, Laptop, Terminal } from 'lucide-react';
import HeroCharacter from './HeroCharacter';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Faint topographic contour background (Lando-style) */
const Contours = () => (
  <svg className="absolute inset-0 w-full h-full text-[#1B1B18]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" aria-hidden="true">
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
  <div className="rounded-2xl border border-ink/15 bg-[#FAF9F3]/80 backdrop-blur-sm px-5 py-4 w-[230px] shadow-sm">
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const orbitsRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  const [par, setPar] = useState({ px: 0, py: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stickyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPar({ px: (e.clientX - r.left) / r.width - 0.5, py: (e.clientY - r.top) / r.height - 0.5 });
  };
  const onLeave = () => setPar({ px: 0, py: 0 });

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      tl.to(characterRef.current, {
        scale: 0.65,
        opacity: 0.05,
        ease: 'none',
      }, 0)
      .to(orbitsRef.current, {
        scale: 1.8,
        opacity: 0.02,
        ease: 'none',
      }, 0)
      .to(textLeftRef.current, {
        x: -120,
        opacity: 0,
        ease: 'none',
      }, 0)
      .to(textRightRef.current, {
        x: 120,
        opacity: 0,
        ease: 'none',
      }, 0)
      .to(badgeRef.current, {
        y: 80,
        opacity: 0,
        ease: 'none',
      }, 0)
      .to(scrollHintRef.current, {
        y: 60,
        opacity: 0,
        ease: 'none',
      }, 0);

      // Signature sign-off: fades + draws in as hero scrolls away
      if (signatureRef.current) {
        gsap.set(signatureRef.current, { opacity: 0, scale: 0.7, y: 30 });

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '20% top',   // starts appearing earlier
            end: '55% top',     // fully visible by 55%
            scrub: true,
          },
        })
        .to(signatureRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
        }, 0)
        .fromTo(
          signatureRef.current.querySelector('.sig-line'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', ease: 'power1.inOut' },
          0
        );

        // Fade out the signature as we approach the very end
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '65% top',
            end: '85% top',
            scrub: true,
          },
        }).to(signatureRef.current, {
          opacity: 0,
          y: -20,
          ease: 'none',
        });
      }
    });

    return () => ctx.revert();
  }, [isDesktop]);

  /* -------- Mobile: clean static welcome -------- */
  if (!isDesktop) {
    return (
      <section id="hero" className="relative min-h-screen flex flex-col justify-center bg-paper pt-24 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,242,78,0.18),transparent_60%)]" aria-hidden="true" />
        <Contours />
        <div className="section-shell relative z-10 flex flex-col items-center text-center gap-6">
          <h1 className="font-serif text-4xl font-bold text-ink">Hey — I&apos;m Roshit.</h1>
          <div className="w-64"><HeroCharacter showHint={false} /></div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-muted bg-[#EDEBE4] px-3.5 py-1.5 rounded-full select-none">
            💻 Visit on desktop for 3D interactions
          </span>
          <p className="max-w-xs text-ink-soft">Welcome in. Have a look around, and leave a review on your way out.</p>
        </div>
      </section>
    );
  }

  /* -------- Desktop: big centered character, Lando-style -------- */
  const parStyle = {
    transform: `translate(${par.px * 18}px, ${par.py * 15}px)`,
    transition: 'transform 0.25s ease-out',
  };

  return (
    <section id="hero" ref={sectionRef} className="relative bg-paper" style={{ height: '185vh' }}>
      <div ref={stickyRef} onMouseMove={onMove} onMouseLeave={onLeave} className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_680px_at_50%_48%,rgba(198,242,78,0.20),transparent_62%)]" aria-hidden="true" />
        <Contours />
        
        {/* Orbits wrapper for GSAP scaling */}
        <div ref={orbitsRef} className="absolute inset-0 pointer-events-none z-0">
          <Orbits px={par.px} py={par.py} />
        </div>

        {/* welcome text — left */}
        <div ref={textLeftRef} className="absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 max-w-[290px] z-20">
          <h1 className="font-serif text-3xl xl:text-4xl font-bold text-ink leading-tight">Hey — I&apos;m Roshit.</h1>
          <p className="mt-3 text-base text-ink-soft leading-relaxed">
            Welcome in. Have a look around, and leave a review on your way out.
          </p>
        </div>

        {/* tweaky line — right */}
        <div ref={textRightRef} className="absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 max-w-[270px] text-right z-20">
          <p className="text-base italic text-muted leading-relaxed">
            Still deciding whether to hire me? Say it in plain English — I&apos;ll ship it in code.
          </p>
        </div>

        {/* character — center, big */}
        <div ref={characterRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[55vh] max-w-[86vw]">
          <div style={parStyle}>
            <div className="hero-float">
              <HeroCharacter />
            </div>
          </div>
        </div>

        {/* badge — bottom-left */}
        <div ref={badgeRef} className="absolute left-8 xl:left-16 bottom-10 z-20">
          <Badge />
        </div>

        {/* scroll hint — bottom-center */}
        <div
          ref={scrollHintRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-3 text-muted font-mono text-sm tracking-wider z-20"
        >
          scroll to explore <ArrowDown size={18} className="animate-bounce" />
        </div>

        {/* Signature sign-off — appears on scroll-out */}
        <div
          ref={signatureRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none"
        >
          <div className="sig-line">
            <img
              src="/hero/signature.png"
              alt="Roshit signature"
              draggable={false}
              className="w-48 xl:w-56 brightness-[0.15] contrast-[1.2] drop-shadow-[0_0_20px_rgba(26,26,24,0.35)]"
            />
          </div>
          <span className="sig-line font-mono text-[13px] tracking-[0.25em] uppercase text-[#8A8A7A]">
            signing off · scroll down
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
