import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import Section from './Section';
import { profile } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const contactLinks = [
  {
    icon: <Mail className="w-5 h-5" aria-hidden="true" />,
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: <Phone className="w-5 h-5" aria-hidden="true" />,
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
  },
  {
    icon: <Linkedin className="w-5 h-5" aria-hidden="true" />,
    label: 'LinkedIn',
    value: 'in/roshit-lamichhane',
    href: profile.linkedin,
  },
  {
    icon: <Github className="w-5 h-5" aria-hidden="true" />,
    label: 'GitHub',
    value: 'Roshit-11',
    href: profile.github,
  },
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
    'w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-slate-100 placeholder-slate-600 focus:border-accent/60 focus:bg-white/[0.06] outline-none transition-colors';

  return (
    <Section
      id="contact"
      kicker="06. contact"
      title="Get In Touch"
      lead="Open to internships, junior roles, and interesting collaborations. My inbox is always open."
    >
      <div ref={ref} className="reveal grid lg:grid-cols-[1fr,1.2fr] gap-10">
        <div className="space-y-4">
          {contactLinks.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group glass rounded-xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors"
            >
              <span className="grid place-items-center w-11 h-11 rounded-lg bg-accent/10 text-accent shrink-0">
                {c.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{c.label}</span>
                <span className="block text-sm text-slate-400 group-hover:text-accent transition-colors">
                  {c.value}
                </span>
              </span>
            </a>
          ))}
          <p className="flex items-center gap-2 text-sm text-slate-500 px-1 pt-1">
            <MapPin size={15} aria-hidden="true" /> {profile.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Tell me about your project, idea, or just say hello…"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-accent text-ink-950 font-semibold py-3.5 rounded-lg hover:bg-accent-soft transition-colors shadow-lg shadow-accent/20"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Message
          </button>
        </form>
      </div>
    </Section>
  );
};

export default Contact;
