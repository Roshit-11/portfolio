import { useEffect, useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import ResumeModal from './ResumeModal';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

type LenisLike = {
  scrollTo: (t: Element, o?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      // Over the closing panel the header sits on the lime frame, so it drops
      // its own surface and lets that colour through.
      const panel = document.getElementById('contact');
      setOverFooter(!!panel && panel.getBoundingClientRect().top <= 96);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          overFooter
            ? 'bg-transparent'
            : isScrolled
              ? 'bg-paper/80 backdrop-blur-md'
              : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center px-5 sm:px-8 py-4">
          {/* name logo (top-left) */}
          <a href="#hero" aria-label="Back to top" className="leading-[0.88]">
            <span className="block font-sans font-extrabold uppercase tracking-tight text-ink text-xl sm:text-3xl">Roshit</span>
            <span className="block font-sans font-extrabold uppercase tracking-tight text-ink text-xl sm:text-3xl">Lamichhane</span>
          </a>

          {/* actions (top-right) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setResumeOpen(true)}
              className="inline-flex items-center gap-2 bg-lime text-ink font-bold text-base px-6 py-3 rounded-full shadow-sm hover:brightness-95 transition"
            >
              <FileText size={18} aria-hidden="true" /> Resume
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-12 h-12 grid place-items-center rounded-xl border border-ink/25 text-ink hover:bg-surface transition"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* full-screen nav overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-ink-950 text-paper flex flex-col animate-fade-up">
          <div className="flex justify-between items-center px-5 sm:px-8 py-4">
            <span className="font-sans font-extrabold uppercase tracking-tight text-xl sm:text-3xl leading-[0.88]">
              Roshit<br />Lamichhane
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-12 h-12 grid place-items-center rounded-xl border border-white/20 hover:bg-white/10 transition"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-1 px-6 sm:px-16" aria-label="Primary">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  
                  // Release scroll lock immediately
                  document.body.style.overflow = '';
                  const lenis = getLenis();
                  if (lenis) {
                    lenis.start();
                    setTimeout(() => {
                      const el = document.getElementById(item.id);
                      if (el) lenis.scrollTo(el, { offset: -72 });
                    }, 50);
                  } else {
                    const el = document.getElementById(item.id);
                    if (el) {
                      window.scrollTo({
                        top: el.getBoundingClientRect().top + window.scrollY - 72,
                        behavior: 'smooth',
                      });
                    }
                  }
                  history.replaceState(null, '', `#${item.id}`);
                }}
                className="group flex items-baseline gap-4 font-serif text-4xl sm:text-6xl font-bold text-paper/80 hover:text-lime transition-colors"
              >
                <span className="font-mono text-sm text-lime/70">0{i + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </>
  );
};

export default Header;
