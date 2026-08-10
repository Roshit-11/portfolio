import { useState, useRef } from 'react';
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const ref = useInView();
  const contactContainerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLSpanElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputMouseDown = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    e.currentTarget.parentElement?.style.setProperty('--focus-x', `${x}px`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const mascot = mascotRef.current;
    if (!mascot) return;

    // Get mascot eye layer center coordinates
    const mRect = mascot.getBoundingClientRect();
    const mx = mRect.left + mRect.width / 2;
    const my = mRect.top + mRect.height / 2;

    const dx = e.clientX - mx;
    const dy = e.clientY - my;
    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);

    // Dynamic scale depending on distance, up to max 3.2px translation
    const maxShift = 3.2;
    const shift = Math.min(maxShift, distance / 60);

    setPupilOffset({
      x: Math.cos(angle) * shift,
      y: Math.sin(angle) * shift,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const key = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
      console.error('Web3Forms access key is missing. Please set VITE_WEB3FORMS_KEY in your .env file.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: key,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      ref={contactContainerRef}
      onMouseMove={handleMouseMove}
      className="bg-[#1A1A18] text-paper py-24 sm:py-32"
    >
      <div className="section-shell">
        <div ref={ref} className="relative reveal mb-14 sm:mb-16">
          <div className="md:max-w-[calc(100%-14rem)]">
            <h2 className="font-serif text-[2.1rem] sm:text-[3rem] font-bold text-[#E2DFD2] tracking-[-0.01em] leading-[1.1]">
              Let&apos;s build something.
            </h2>
            <p className="mt-4 max-w-2xl text-white/60">
              Open to internships, junior roles, and interesting collaborations. My inbox is always open.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 absolute right-0 top-1" aria-hidden="true">
            <span className="px-4 py-2.5 rounded-2xl bg-[#252522] text-[#C5FF3B] font-mono text-[13px] shadow-lg shadow-black/20">// say hi</span>
            <span ref={mascotRef} className="w-12 h-14 animate-float shrink-0">
              <MiniMe
                accent="#C5FF3B"
                className="w-full h-full"
                pupilX={pupilOffset.x}
                pupilY={pupilOffset.y}
              />
            </span>
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
                className="group flex items-center gap-4 rounded-2xl bg-[#252522] border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C5FF3B]/30"
              >
                <span
                  className="grid place-items-center w-11 h-11 rounded-xl shrink-0"
                  style={{ backgroundColor: `${c.tint}33`, color: c.tint }}
                >
                  {c.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white/60">{c.label}</span>
                  <span className="block font-semibold text-[#E2DFD2]">{c.value}</span>
                </span>
              </a>
            ))}
            <p className="flex items-center gap-2 text-sm text-white/50 px-1 pt-1">
              <MapPin size={15} aria-hidden="true" /> {profile.location}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#252522] border border-white/5 p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="electric-input-wrapper">
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onMouseDown={handleInputMouseDown}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A18] border border-white/10 text-paper placeholder-white/30 outline-none transition-colors focus:border-white/20"
                  placeholder="Your name"
                />
                <div className="electric-border-line" />
              </div>
              <div className="electric-input-wrapper">
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onMouseDown={handleInputMouseDown}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A18] border border-white/10 text-paper placeholder-white/30 outline-none transition-colors focus:border-white/20"
                  placeholder="you@example.com"
                />
                <div className="electric-border-line" />
              </div>
            </div>
            <div className="electric-input-wrapper">
              <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-1.5">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onMouseDown={handleInputMouseDown}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A18] border border-white/10 text-paper placeholder-white/30 outline-none transition-colors focus:border-white/20"
                placeholder="What's this about?"
              />
              <div className="electric-border-line" />
            </div>
            <div className="electric-input-wrapper">
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1.5">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onMouseDown={handleInputMouseDown}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A18] border border-white/10 text-paper placeholder-white/30 outline-none transition-colors resize-none focus:border-white/20"
                placeholder="Tell me about your project, idea, or just say hello…"
                disabled={status === 'submitting'}
              />
              <div className="electric-border-line" />
            </div>

            {status === 'success' && (
              <p className="text-emerald-400 font-mono text-sm">
                ✓ Message sent successfully! I will get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-400 font-mono text-sm">
                ✗ Failed to send message. Please verify your connection or try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group w-full flex items-center justify-center gap-2 bg-[#C5FF3B] text-[#1A1A18] font-bold py-3.5 rounded-xl hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
