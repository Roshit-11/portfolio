import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="section-shell text-center space-y-5">
        <div className="flex items-center justify-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2.5 rounded-lg text-slate-500 hover:text-accent hover:bg-white/5 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-2.5 rounded-lg text-slate-500 hover:text-accent hover:bg-white/5 transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send email"
            className="p-2.5 rounded-lg text-slate-500 hover:text-accent hover:bg-white/5 transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>

        <p className="font-mono text-xs text-slate-600">
          Designed & built by {profile.name} · © {currentYear}
        </p>
        <p className="font-mono text-xs text-slate-700">
          React · TypeScript · Tailwind — psst, try the terminal up top
        </p>
      </div>
    </footer>
  );
};

export default Footer;
