import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import ParticleField from './ParticleField';
import Terminal from './Terminal';
import { profile } from '../data/portfolio';

const ROLES = [
  'Software Developer',
  'AI Student',
  'Automation Builder',
  'Full-Stack Learner',
];

/** Typewriter cycling through roles. */
function useTypewriter(words: string[]) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0]);
      return;
    }
    const word = words[wordIdx % words.length];
    const done = !deleting && text === word;
    const empty = deleting && text === '';

    const delay = done ? 1800 : deleting ? 40 : 75;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setWordIdx((i) => i + 1);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words]);

  return text;
}

const Hero = () => {
  const typed = useTypewriter(ROLES);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-ink-950" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.07),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>
      <ParticleField />

      <div className="section-shell relative z-10 grid lg:grid-cols-[1.15fr,1fr] gap-12 items-center py-28 w-full">
        <div className="animate-fade-up">
          <p className="font-mono text-accent text-sm sm:text-base mb-4">Hi, my name is</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
            Roshit Lamichhane<span className="text-accent">.</span>
          </h1>
          <p className="mt-4 font-mono text-xl sm:text-2xl text-slate-300 h-8">
            <span aria-live="polite">{typed}</span>
            <span className="text-accent animate-blink" aria-hidden="true">
              ▍
            </span>
          </p>
          <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">{profile.tagline}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="px-7 py-3.5 rounded-lg bg-accent text-ink-950 font-semibold hover:bg-accent-soft transition-colors shadow-lg shadow-accent/20"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-lg border border-accent/40 text-accent font-semibold hover:bg-accent/10 transition-colors"
            >
              Get in touch
            </a>
            <div className="flex items-center gap-2 sm:ml-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-3 rounded-lg text-slate-400 hover:text-accent hover:bg-white/5 transition-colors"
              >
                <Github size={22} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-3 rounded-lg text-slate-400 hover:text-accent hover:bg-white/5 transition-colors"
              >
                <Linkedin size={22} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send email"
                className="p-3 rounded-lg text-slate-400 hover:text-accent hover:bg-white/5 transition-colors"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Terminal />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-accent transition-colors animate-bounce"
      >
        <ArrowDown size={26} />
      </a>
    </section>
  );
};

export default Hero;
