import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import ContactModal from './ContactModal';

type LenisLike = {
  scrollTo: (t: Element, o?: { offset?: number; duration?: number }) => void;
};
const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

/** Smooth, offset-correct in-page scroll (via Lenis when available). */
const scrollToId = (e: React.MouseEvent, id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 72);
  history.replaceState(null, '', `#${id}`);
};

const pages = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
];

const socials = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Phone', href: `tel:${profile.phone.replace(/\s/g, '')}` },
];

const techStack = [
  'HUBSPOT', 'N8N', 'PYTHON', 'JAVA', 'SQL', 'AUTOMATION', 'AI INTEGRATION',
];

const Contact = () => {
  const stageRef = useInView<HTMLDivElement>();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section
      id="contact"
      className="footer-panel relative bg-[#1A1A18] text-paper overflow-hidden pt-24 pb-12 lg:pt-0 lg:pb-0 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col lg:rounded-[2.5rem]"
    >
      {/* Notch cut into the panel's top edge — the lime frame shows through it,
          and the fixed header floats on that strip. */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-[44px] z-40 pointer-events-none">
        <svg viewBox="0 0 1000 46" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M 385 0 Q 406 0 409 14 L 413 30 Q 417 46 437 46 L 563 46 Q 583 46 587 30 L 591 14 Q 594 0 615 0 Z"
            fill="#C5FF3B"
          />
        </svg>
      </div>

      {/* Topographic map background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,150 C100,50 300,250 500,150 C700,50 900,250 1100,150" fill="none" stroke="#C5FF3B" strokeWidth="2" />
          <path d="M-100,200 C100,100 300,300 500,200 C700,100 900,300 1100,200" fill="none" stroke="#C5FF3B" strokeWidth="2" />
          <path d="M-100,250 C100,150 300,350 500,250 C700,150 900,350 1100,250" fill="none" stroke="#C5FF3B" strokeWidth="2" />
          <path d="M-100,300 C100,200 300,400 500,300 C700,200 900,400 1100,300" fill="none" stroke="#C5FF3B" strokeWidth="2" />

          <path d="M-50,600 C150,450 350,650 550,550 C750,450 950,650 1150,550" fill="none" stroke="#C5FF3B" strokeWidth="2" />
          <path d="M-50,650 C150,500 350,700 550,600 C750,500 950,700 1150,600" fill="none" stroke="#C5FF3B" strokeWidth="2" />
          <path d="M-50,700 C150,550 350,750 550,650 C750,550 950,750 1150,650" fill="none" stroke="#C5FF3B" strokeWidth="2" />

          <path d="M700,300 C750,280 800,320 780,360 C760,400 680,380 700,300 Z" fill="none" stroke="#C5FF3B" strokeWidth="1.5" />
          <path d="M680,280 C760,250 830,310 800,390 C770,440 650,410 680,280 Z" fill="none" stroke="#C5FF3B" strokeWidth="1.5" />
          <path d="M660,260 C780,220 860,300 820,420 C780,480 620,440 660,260 Z" fill="none" stroke="#C5FF3B" strokeWidth="1.5" />
        </svg>
      </div>

      {/*
        The stage. On lg+ every element is absolutely placed against this box so the
        composition matches the reference: headline top, bust bottom-centre, nav
        columns flanking it, tech marquee sliding *behind* the bust, CTA pill on top.
        Below lg it degrades to a plain stacked column.
      */}
      <div
        ref={stageRef}
        className="footer-stage relative z-10 w-full flex flex-col items-center gap-12 px-5 lg:gap-0 lg:px-0 lg:block lg:flex-1 lg:min-h-0"
      >
        {/* Headline + signature */}
        <div className="footer-stage-item relative w-full text-center lg:absolute lg:top-[13%] lg:left-0 lg:right-0 lg:z-30">
          <h2 className="relative leading-[0.86] tracking-tighter">
            <span className="block text-4xl sm:text-6xl lg:text-[clamp(2.5rem,8.5vh,5.5rem)]">
              <span className="font-sans font-black text-white uppercase">Always </span>
              <span className="font-serif font-bold italic text-[#C5FF3B]">Building</span>
            </span>
            <span className="block text-4xl sm:text-6xl lg:text-[clamp(2.5rem,8.5vh,5.5rem)]">
              <span className="font-sans font-black text-white uppercase">The </span>
              <span className="font-serif font-bold italic text-[#C5FF3B]">Future.</span>
            </span>
          </h2>
        </div>

        {/* Bust — bottom-anchored, sits above the marquee so the type slides behind it */}
        <div className="footer-stage-item order-last lg:order-none lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:z-20 pointer-events-none">
          <div className="relative">
            {/* neon bloom sitting behind the bust */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[55%] rounded-full bg-[#C5FF3B]/20 blur-[70px]"
            />
            <img
              src="/hero/cartoon.png"
              alt=""
              aria-hidden="true"
              className="bust-neon relative w-56 sm:w-72 lg:w-auto lg:h-[min(66vh,44rem)] object-contain object-bottom select-none"
            />
          </div>
        </div>

        {/* Nav columns */}
        <div className="footer-stage-item w-full max-w-md lg:max-w-none grid grid-cols-2 gap-8 lg:gap-0 lg:absolute lg:top-[45%] lg:left-0 lg:right-0 lg:z-30 lg:flex lg:items-start lg:justify-between lg:px-[clamp(3rem,13vw,15rem)]">
          <div className="text-center lg:text-left">
            <span className="block font-sans font-bold text-[10px] lg:text-[11px] tracking-[0.18em] text-white/45 uppercase mb-5 lg:mb-[clamp(0.75rem,2vh,1.25rem)]">
              Pages
            </span>
            <nav className="flex flex-col gap-1.5 lg:gap-[clamp(0.15rem,0.7vh,0.5rem)]" aria-label="Footer">
              {pages.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  onClick={(e) => scrollToId(e, p.id)}
                  className="font-sans font-black uppercase tracking-tight text-xl lg:text-[clamp(1.15rem,3vh,1.9rem)] text-white hover:text-[#C5FF3B] transition-colors leading-tight"
                >
                  {p.label}
                </a>
              ))}
              <a
                href="#certifications"
                onClick={(e) => scrollToId(e, 'certifications')}
                className="font-sans font-black uppercase tracking-tight text-xl lg:text-[clamp(1.15rem,3vh,1.9rem)] text-[#C5FF3B] hover:brightness-110 transition-all leading-tight"
              >
                Certifications
              </a>
            </nav>
          </div>

          <div className="text-center lg:text-left">
            <span className="block font-sans font-bold text-[10px] lg:text-[11px] tracking-[0.18em] text-white/45 uppercase mb-5 lg:mb-[clamp(0.75rem,2vh,1.25rem)]">
              Follow on
            </span>
            <div className="flex flex-col gap-1.5 lg:gap-[clamp(0.15rem,0.7vh,0.5rem)]">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-sans font-black uppercase tracking-tight text-xl lg:text-[clamp(1.15rem,3vh,1.9rem)] text-white hover:text-[#C5FF3B] transition-colors leading-tight"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tech marquee — z-10 keeps it behind the bust, exactly like the sponsor row */}
        <div className="footer-stage-item w-full overflow-hidden lg:absolute lg:bottom-[clamp(4rem,10vh,7rem)] lg:left-0 lg:right-0 lg:z-10">
          <div className="animate-marquee marquee-slow neon-text whitespace-nowrap flex gap-16 lg:gap-[clamp(2.5rem,6vh,5rem)] text-[#C5FF3B] font-sans font-black text-xl lg:text-[clamp(1rem,2.6vh,1.6rem)] tracking-[0.18em]">
            {Array(6).fill(techStack).flat().map((tech, idx) => (
              <span key={idx} className="shrink-0">{tech}</span>
            ))}
          </div>
        </div>

        {/* CTA pill */}
        <div className="footer-stage-item lg:absolute lg:bottom-[clamp(1rem,3.5vh,2.25rem)] lg:left-1/2 lg:-translate-x-1/2 lg:z-30">
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="group inline-flex items-center gap-3 bg-[#C5FF3B] text-[#1A1A18] font-sans font-black uppercase tracking-wider text-xs lg:text-[clamp(0.7rem,1.6vh,0.85rem)] px-8 lg:px-[clamp(1.5rem,4vh,2.5rem)] py-3.5 lg:py-[clamp(0.6rem,1.8vh,1rem)] rounded-full hover:brightness-105 active:scale-[0.99] transition-all duration-300"
          >
            Contact Me
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {formOpen && <ContactModal onClose={() => setFormOpen(false)} />}
    </section>
  );
};

export default Contact;
