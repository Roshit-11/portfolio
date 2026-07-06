import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-ink-950/85 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="section-shell" aria-label="Primary">
        <div className="flex justify-between items-center h-16">
          <a href="#hero" className="font-mono font-semibold text-white text-lg" aria-label="Back to top">
            <span className="text-accent">~/</span>roshit
            <span className="text-accent animate-blink" aria-hidden="true">
              _
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-accent transition-colors"
              >
                <span className="font-mono text-accent/70 text-xs mr-1">0{i + 1}.</span>
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-200 p-2"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-ink-900/95 backdrop-blur-md border-b border-white/10 shadow-xl">
            <div className="px-4 py-3 space-y-1">
              {NAV.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2.5 text-slate-200 hover:text-accent hover:bg-white/5 rounded-md transition-colors"
                >
                  <span className="font-mono text-accent/70 text-xs mr-2">0{i + 1}.</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
