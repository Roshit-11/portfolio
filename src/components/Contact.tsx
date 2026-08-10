import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { MiniMe } from './Avatar';
import { ACCENTS } from '../data/accents';

const contactLinks = [
  { icon: <Mail className="w-5 h-5" aria-hidden="true" />, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, tint: ACCENTS[0] },
  { icon: <Phone className="w-5 h-5" aria-hidden="true" />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, tint: ACCENTS[1] },
  { icon: <Linkedin className="w-5 h-5" aria-hidden="true" />, label: 'LinkedIn', value: 'in/roshit-lamichhane', href: profile.linkedin, tint: ACCENTS[2] },
  { icon: <Github className="w-5 h-5" aria-hidden="true" />, label: 'GitHub', value: 'Roshit-11', href: profile.github, tint: ACCENTS[3] },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const ref = useInView();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || 'Contact from Portfolio Website');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-800 text-paper placeholder-white/30 focus:border-accent outline-none transition-colors';

  return (
    <section id="contact" className="bg-ink-950 text-paper py-24 sm:py-32">
      <div className="section-shell">
        <div ref={ref} className="relative reveal mb-14 sm:mb-16">
          <div className="md:max-w-[calc(100%-14rem)]">
            <h2 className="font-serif text-[2.1rem] sm:text-[3rem] font-bold text-paper tracking-[-0.01em] leading-[1.1]">
              Let&apos;s build something.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/60">
            Open to internships, junior roles, and interesting collaborations. My inbox is always open.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 absolute right-0 top-1" aria-hidden="true">
            <span className="px-4 py-2.5 rounded-2xl bg-ink-900 text-lime font-mono text-[13px] shadow-lg shadow-black/20">// say hi</span>
            <span className="w-12 h-14 animate-float shrink-0"><MiniMe className="w-full h-full" /></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8">
          <div className="space-y-4">
            {contactLinks.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl bg-ink-900 border border-ink-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              >
                <span
                  className="grid place-items-center w-11 h-11 rounded-xl shrink-0"
                  style={{ backgroundColor: `${c.tint}33`, color: c.tint }}
                >
                  {c.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white/60">{c.label}</span>
                  <span className="block font-semibold text-paper">{c.value}</span>
                </span>
              </a>
            ))}
            <p className="flex items-center gap-2 text-sm text-white/50 px-1 pt-1">
              <MapPin size={15} aria-hidden="true" /> {profile.location}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl bg-ink-900 border border-ink-800 p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-1.5">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={inputClass} placeholder="What's this about?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1.5">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Tell me about your project, idea, or just say hello…" />
            </div>
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-colors"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
