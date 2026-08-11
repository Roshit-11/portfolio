import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Send, X } from 'lucide-react';
import { profile } from '../data/portfolio';

/** Contact form in a lightbox, opened from the footer's CONTACT ME pill. */
const ContactModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputMouseDown = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.parentElement?.style.setProperty('--focus-x', `${e.clientX - rect.left}px`);
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
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: key, ...formData }),
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

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[#141413] border border-white/10 text-paper placeholder-white/25 outline-none text-sm transition-all duration-300 hover:border-white/20 focus:border-[#C5FF3B] focus:ring-2 focus:ring-[#C5FF3B]/20 focus:shadow-[0_0_18px_rgba(197,255,59,0.12)]';
  const labelClass =
    'block font-mono text-[10px] tracking-[0.16em] uppercase text-white/45 mb-1.5';

  return createPortal(
    <div
      className="contact-modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
    >
      <div
        className="contact-modal-panel relative w-full max-w-lg rounded-[2rem] bg-[#1C1C1A] border border-[#C5FF3B]/60 p-6 sm:p-9 shadow-[0_0_0_1px_rgba(197,255,59,0.08),0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_70px_rgba(197,255,59,0.14)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-[#C5FF3B] hover:bg-white/5 transition-colors"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="mb-7">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#C5FF3B] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF3B] shadow-[0_0_10px_#C5FF3B]" />
            Send a message
          </span>
          <h2 className="leading-[0.9] tracking-tighter mb-3">
            <span className="font-sans font-black text-3xl sm:text-4xl text-white uppercase">Let&apos;s </span>
            <span className="font-serif font-bold italic text-3xl sm:text-4xl text-[#C5FF3B]">talk.</span>
          </h2>
          <p className="text-xs text-white/35 font-mono break-all">{profile.email}</p>
          <div className="mt-5 h-px w-full bg-gradient-to-r from-[#C5FF3B]/50 via-white/10 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="electric-input-wrapper">
            <label htmlFor="cm-name" className={labelClass}>Name</label>
            <input
              type="text"
              id="cm-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onMouseDown={handleInputMouseDown}
              required
              className={inputClass}
              placeholder="Your name"
            />
            <div className="electric-border-line" />
          </div>

          <div className="electric-input-wrapper">
            <label htmlFor="cm-email" className={labelClass}>Email</label>
            <input
              type="email"
              id="cm-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onMouseDown={handleInputMouseDown}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
            <div className="electric-border-line" />
          </div>

          <div className="electric-input-wrapper">
            <label htmlFor="cm-subject" className={labelClass}>Subject</label>
            <input
              type="text"
              id="cm-subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              onMouseDown={handleInputMouseDown}
              className={inputClass}
              placeholder="What's this about?"
            />
            <div className="electric-border-line" />
          </div>

          <div className="electric-input-wrapper">
            <label htmlFor="cm-message" className={labelClass}>Message</label>
            <textarea
              id="cm-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onMouseDown={handleInputMouseDown}
              required
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Tell me about your project..."
              disabled={status === 'submitting'}
            />
            <div className="electric-border-line" />
          </div>

          {status === 'success' && (
            <p className="text-emerald-400 font-mono text-xs">✓ Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 font-mono text-xs">✗ Failed to send message.</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group w-full flex items-center justify-center gap-2 bg-[#C5FF3B] text-[#1A1A18] font-black uppercase tracking-widest py-3.5 rounded-full shadow-[0_0_12px_rgba(197,255,59,0.2)] hover:shadow-[0_0_20px_rgba(197,255,59,0.5)] hover:brightness-105 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;
