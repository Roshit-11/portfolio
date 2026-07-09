import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, Download, ExternalLink, FileText, Github, Linkedin, Mail, X } from 'lucide-react';
import ParticleField from './ParticleField';
import Terminal from './Terminal';
import { profile } from '../data/portfolio';

const resumeViewUrl = `https://drive.google.com/file/d/${profile.resumeDriveId}/view`;
const resumePreviewUrl = `https://drive.google.com/file/d/${profile.resumeDriveId}/preview`;
const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${profile.resumeDriveId}`;

/**
 * Lightbox that embeds the resume PDF via Google Drive's /preview endpoint
 * (the only Drive URL that allows iframe embedding) — same pattern as the
 * certification modal.
 */
const ResumeModal = ({ onClose }: { onClose: () => void }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Portal to <body>: ancestors animated with CSS transforms would otherwise
  // become the containing block for position:fixed and misplace the overlay.
  // No backdrop-filter here: blur on a fixed overlay above a cross-origin
  // iframe triggers a Chrome compositing bug where the browser hit-tests the
  // modal at a stale position — clicks on the close button silently fall
  // through to the iframe.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-ink-950/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
    >
      <div
        className="bg-ink-900 border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10">
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">Resume</h3>
            <p className="text-xs text-slate-500">{profile.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resumeDownloadUrl}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors px-2 py-1.5"
            >
              <Download size={14} aria-hidden="true" /> Download
            </a>
            <a
              href={resumeViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors px-2 py-1.5"
            >
              <ExternalLink size={14} aria-hidden="true" /> Open in Drive
            </a>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close resume preview"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe
          src={resumePreviewUrl}
          title="Resume preview"
          className="w-full h-[65vh] bg-ink-900"
          allow="autoplay"
        />
      </div>
    </div>,
    document.body
  );
};

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
  const [resumeOpen, setResumeOpen] = useState(false);

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
            <button
              onClick={() => setResumeOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg border border-accent/40 text-accent font-semibold hover:bg-accent/10 transition-colors"
            >
              <FileText size={18} aria-hidden="true" /> View Resume
            </button>
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

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </section>
  );
};

export default Hero;
