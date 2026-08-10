import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A18] text-[#E2DFD2] border-t border-white/5">
      <div className="section-shell py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <p className="font-mono text-xs text-white/40">
          © {currentYear} {profile.name} · Kathmandu
        </p>
        <div className="flex items-center gap-2">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="p-2.5 rounded-lg text-white/50 hover:text-[#C5FF3B] hover:bg-white/5 transition-colors">
            <Github size={20} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="p-2.5 rounded-lg text-white/50 hover:text-[#C5FF3B] hover:bg-white/5 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Send email" className="p-2.5 rounded-lg text-white/50 hover:text-[#C5FF3B] hover:bg-white/5 transition-colors">
            <Mail size={20} />
          </a>
        </div>
        <p className="font-mono text-xs text-white/30">Designed &amp; built with care · React · TS · Tailwind</p>
      </div>
    </footer>
  );
};

export default Footer;
